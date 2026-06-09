#!/usr/bin/env node
/**
 * TOOLSCOUT DATA PIPELINE
 * Run: npx ts-node scripts/seed.ts
 *
 * Steps:
 *  1. Fetches SaaS tools from Product Hunt API
 *  2. Enriches GitHub tools with star counts
 *  3. Upserts into Supabase
 *  4. Builds comparison slug pairs for top tools
 *  5. Computes alternative relationships
 *
 * NOTE: AI enrichment (Claude) is disabled until ANTHROPIC_API_KEY is set.
 *       Tools will use PH tagline as summary until then.
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

// ─── Clients ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const PH_KEY    = process.env.PRODUCT_HUNT_API_KEY!
const PH_SECRET = process.env.PRODUCT_HUNT_API_SECRET!
const GH_TOKEN  = process.env.GITHUB_TOKEN!
const HAS_AI    = !!process.env.ANTHROPIC_API_KEY

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

// ─── Product Hunt OAuth ───────────────────────────────────────────────────────
async function getPHToken(): Promise<string> {
  console.log('  Authenticating with Product Hunt...')
  const res = await fetch('https://api.producthunt.com/v2/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: PH_KEY,
      client_secret: PH_SECRET,
      grant_type: 'client_credentials',
    }),
  })
  if (!res.ok) throw new Error(`PH auth failed: ${res.status} ${await res.text()}`)
  const data = await res.json() as { access_token: string }
  console.log('  ✅ PH token obtained')
  return data.access_token
}

// ─── Product Hunt fetch ───────────────────────────────────────────────────────
interface PHNode {
  id: string
  name: string
  tagline: string
  description: string
  votesCount: number
  website: string
  thumbnail: { url: string } | null
  topics: { edges: { node: { slug: string; name: string } }[] }
}

async function fetchPHTools(token: string, topic: string, after?: string): Promise<{
  tools: PHNode[]; hasNextPage: boolean; endCursor: string
}> {
  const query = `
    query GetPosts($topic: String!, $after: String) {
      posts(topic: $topic, after: $after, first: 50, order: VOTES) {
        pageInfo { hasNextPage endCursor }
        edges { node {
          id name tagline description votesCount website
          thumbnail { url }
          topics { edges { node { slug name } } }
        }}
      }
    }`
  const res = await fetch('https://api.producthunt.com/v2/api/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { topic, after } }),
  })
  const json = await res.json() as {
    data?: { posts?: { pageInfo: { hasNextPage: boolean; endCursor: string }; edges: { node: PHNode }[] } }
    errors?: { message: string }[]
  }
  if (json.errors) console.warn('  PH GQL warnings:', json.errors.map(e => e.message).join(', '))
  const posts = json.data?.posts
  return {
    tools: posts?.edges?.map(e => e.node) ?? [],
    hasNextPage: posts?.pageInfo?.hasNextPage ?? false,
    endCursor: posts?.pageInfo?.endCursor ?? '',
  }
}

// ─── GitHub stars ─────────────────────────────────────────────────────────────
async function getGitHubStars(url: string): Promise<number | null> {
  if (!url?.includes('github.com')) return null
  const match = url.match(/github\.com\/([^/]+\/[^/?#]+)/)
  if (!match) return null
  const repo = match[1].replace(/\.git$/, '')
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: 'application/vnd.github.v3+json' },
    })
    if (!res.ok) return null
    const data = await res.json() as { stargazers_count?: number }
    return data.stargazers_count ?? null
  } catch { return null }
}

// ─── Claude AI enrichment (optional) ─────────────────────────────────────────
async function generateAIContent(tool: { name: string; tagline: string; description: string; categories: string[] }) {
  if (!HAS_AI) {
    // Return sensible defaults when no API key
    return {
      ai_summary: tool.tagline,
      ai_pros: [] as string[],
      ai_cons: [] as string[],
      ai_best_for: tool.categories.slice(0, 3),
      ai_not_for: null,
      ai_ideal_user: null,
    }
  }
  // Dynamic import only if key is available
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const prompt = `You are writing for a SaaS comparison directory. Given this tool, return ONLY valid JSON (no markdown).

Tool: ${tool.name}
Tagline: ${tool.tagline}
Description: ${tool.description?.slice(0, 400) || 'N/A'}
Categories: ${tool.categories.join(', ')}

JSON format:
{
  "ai_summary": "2-3 honest sentences about what this tool does and who it's best for",
  "ai_pros": ["pro 1","pro 2","pro 3"],
  "ai_cons": ["con 1","con 2"],
  "ai_best_for": ["use case 1","use case 2","use case 3"],
  "ai_not_for": "One sentence on who should NOT use this",
  "ai_ideal_user": "One sentence describing the ideal user"
}`
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
    return JSON.parse(text)
  } catch {
    return { ai_summary: tool.tagline, ai_pros: [], ai_cons: [], ai_best_for: [], ai_not_for: null, ai_ideal_user: null }
  }
}

// ─── Comparison verdict (optional) ───────────────────────────────────────────
async function generateComparison(a: { name: string; tagline: string }, b: { name: string; tagline: string }) {
  if (!HAS_AI) {
    return {
      ai_verdict: `${a.name} and ${b.name} are both strong tools in their category. The best choice depends on your team size, budget, and specific workflow requirements.`,
      winner_use_cases: { tool_a: [`Teams that prefer ${a.name}'s approach`], tool_b: [`Teams that prefer ${b.name}'s approach`] },
      feature_comparison: [
        { feature: 'Free plan', tool_a: true, tool_b: true },
        { feature: 'API access', tool_a: 'Available', tool_b: 'Available' },
        { feature: 'Mobile app', tool_a: true, tool_b: true },
      ],
      switching_difficulty: 3,
    }
  }
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const prompt = `Compare these two SaaS tools for a comparison directory. Return ONLY valid JSON.

Tool A: ${a.name} - ${a.tagline}
Tool B: ${b.name} - ${b.tagline}

{
  "ai_verdict": "3-4 sentence balanced verdict. When to choose A vs B.",
  "winner_use_cases": {"tool_a": ["use case 1","use case 2"], "tool_b": ["use case 1","use case 2"]},
  "feature_comparison": [
    {"feature":"Free plan","tool_a":true,"tool_b":false},
    {"feature":"API access","tool_a":"Yes","tool_b":"Limited"},
    {"feature":"Mobile app","tool_a":true,"tool_b":true}
  ],
  "switching_difficulty": 3
}`
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', max_tokens: 700,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
    return JSON.parse(text)
  } catch {
    return { ai_verdict: `Compare ${a.name} vs ${b.name} based on your specific needs.`, winner_use_cases: { tool_a: [], tool_b: [] }, feature_comparison: [], switching_difficulty: 3 }
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log('\n🚀 ToolScout Data Pipeline\n' + '─'.repeat(50))
  console.log(`🤖 AI enrichment: ${HAS_AI ? '✅ Enabled (Claude)' : '⚠️  Disabled (no ANTHROPIC_API_KEY — using defaults)'}`)
  console.log()

  // ── STEP 1: Product Hunt OAuth ──────────────────────────────────────────────
  console.log('📡 STEP 1: Product Hunt authentication')
  const phToken = await getPHToken()
  console.log()

  // ── STEP 2: Fetch tools ─────────────────────────────────────────────────────
  console.log('📥 STEP 2: Fetching tools from Product Hunt')
  const topics = ['saas', 'productivity', 'developer-tools', 'marketing', 'sales', 'crm', 'analytics', 'design-tools', 'project-management', 'automation']
  const allTools: PHNode[] = []

  for (const topic of topics) {
    process.stdout.write(`  Fetching topic: ${topic}...`)
    let cursor: string | undefined
    let pages = 0
    while (pages < 2) { // 2 pages × 50 = 100 tools per topic
      const { tools, hasNextPage, endCursor } = await fetchPHTools(phToken, topic, cursor)
      allTools.push(...tools)
      if (!hasNextPage) break
      cursor = endCursor
      pages++
      await sleep(300)
    }
    console.log(` ${allTools.length} total`)
  }

  // Deduplicate by PH id
  const unique = Array.from(new Map(allTools.map(t => [t.id, t])).values())
  console.log(`\n  ✅ ${unique.length} unique tools collected\n`)

  // ── STEP 3: Upsert tools to Supabase ───────────────────────────────────────
  console.log('💾 STEP 3: Upserting tools to database')
  let saved = 0; let failed = 0

  for (const ph of unique) {
    const slug = toSlug(ph.name)
    if (!slug) continue
    const categories = ph.topics.edges.map(e => e.node.slug).filter(Boolean).slice(0, 5)

    // Check if already fully enriched
    const { data: existing } = await supabase.from('tools').select('id, ai_summary').eq('slug', slug).maybeSingle()

    // GitHub stars (only if website is a github URL)
    const ghStars = ph.website?.includes('github.com') ? await getGitHubStars(ph.website) : null

    // AI enrichment
    const ai = await generateAIContent({ name: ph.name, tagline: ph.tagline, description: ph.description, categories })
    if (HAS_AI) await sleep(150) // rate limit Claude

    const record = {
      slug,
      name: ph.name,
      tagline: ph.tagline || '',
      description: ph.description || '',
      website_url: ph.website || null,
      logo_url: ph.thumbnail?.url || null,
      categories,
      ph_votes: ph.votesCount || 0,
      ph_product_id: ph.id,
      github_stars: ghStars,
      github_url: ph.website?.includes('github.com') ? ph.website : null,
      pricing_model: 'freemium',
      has_free_plan: true,
      is_featured: (ph.votesCount || 0) > 1000,
      ...ai,
    }

    const { error } = await supabase.from('tools').upsert(record, { onConflict: 'slug' })
    if (error) { console.warn(`  ⚠️  ${ph.name}: ${error.message}`); failed++ }
    else saved++

    if (saved % 100 === 0) console.log(`  ✅ ${saved} saved...`)
  }
  console.log(`\n  ✅ Saved: ${saved} | Failed: ${failed}\n`)

  // ── STEP 4: Build comparison pairs ─────────────────────────────────────────
  console.log('⚔️  STEP 4: Generating comparison pairs')
  const { data: topTools } = await supabase
    .from('tools').select('id, slug, name, tagline, categories').order('ph_votes', { ascending: false }).limit(200)

  let compSaved = 0
  if (topTools) {
    for (let i = 0; i < topTools.length; i++) {
      for (let j = i + 1; j < Math.min(i + 15, topTools.length); j++) {
        const a = topTools[i]; const b = topTools[j]
        // Only pair tools in same category
        const shared = (a.categories || []).filter((c: string) => (b.categories || []).includes(c))
        if (shared.length === 0) continue

        const slug = `${a.slug}-vs-${b.slug}`
        const { data: existing } = await supabase.from('comparisons').select('id').eq('slug', slug).maybeSingle()
        if (existing) continue

        const verdict = await generateComparison(a, b)
        if (HAS_AI) await sleep(200)

        const { error } = await supabase.from('comparisons').upsert({
          slug, tool_a_id: a.id, tool_b_id: b.id, ...verdict,
        }, { onConflict: 'slug' })

        if (!error) { compSaved++; if (compSaved % 50 === 0) console.log(`  ✅ ${compSaved} comparisons saved...`) }
      }
    }
  }
  console.log(`\n  ✅ ${compSaved} comparison pairs generated\n`)

  // ── STEP 5: Build alternatives ──────────────────────────────────────────────
  console.log('🔄 STEP 5: Computing alternative relationships')
  const { data: allDbTools } = await supabase.from('tools').select('id, categories, pricing_model, has_free_plan, min_price')

  if (allDbTools) {
    const rows: object[] = []
    for (const tool of allDbTools) {
      const similar = allDbTools.filter(t => {
        if (t.id === tool.id) return false
        const shared = (t.categories || []).filter((c: string) => (tool.categories || []).includes(c))
        return shared.length > 0
      }).slice(0, 15)

      for (const alt of similar) {
        const sharedCount = (alt.categories || []).filter((c: string) => (tool.categories || []).includes(c)).length
        const score = Math.min(sharedCount / Math.max((tool.categories || []).length, 1), 1)
        let qualifier: string | null = null
        if (alt.has_free_plan && !tool.has_free_plan) qualifier = 'free'
        else if (alt.pricing_model === 'open-source') qualifier = 'open-source'
        else if (alt.min_price != null && tool.min_price != null && alt.min_price < tool.min_price) qualifier = 'affordable'
        rows.push({ tool_id: tool.id, alternative_id: alt.id, similarity_score: score, qualifier })
      }
    }
    // Batch upsert in chunks of 500
    for (let i = 0; i < rows.length; i += 500) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await supabase.from('alternatives').upsert(rows.slice(i, i + 500) as any[], { onConflict: 'tool_id,alternative_id' })
    }
    console.log(`  ✅ ${rows.length} alternative relationships built\n`)
  }

  // ── STEP 6: Update category tool counts ────────────────────────────────────
  console.log('📊 STEP 6: Updating category counts')
  const { data: cats } = await supabase.from('categories').select('id, slug')
  if (cats) {
    for (const cat of cats) {
      const { count } = await supabase.from('tools').select('*', { count: 'exact', head: true }).contains('categories', [cat.slug])
      await supabase.from('categories').update({ tool_count: count || 0 }).eq('id', cat.id)
    }
    console.log(`  ✅ Updated counts for ${cats.length} categories\n`)
  }

  console.log('🎉 Pipeline complete!\n')
  console.log('Next steps:')
  console.log('  1. Run: npm run dev')
  console.log('  2. Visit: http://localhost:3000')
  console.log('  3. Add ANTHROPIC_API_KEY to .env.local for AI-enriched content')
  console.log()
}

run().catch(err => { console.error('\n❌ Pipeline failed:', err.message); process.exit(1) })

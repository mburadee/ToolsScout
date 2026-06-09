import { supabaseAdmin } from './supabase'
import type { Tool, Comparison, Integration, Category, Alternative } from '@/types'

// ─── Tools ────────────────────────────────────────────────────────────────────

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const { data } = await supabaseAdmin
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function getAllToolSlugs(): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from('tools')
    .select('slug')
    .order('view_count', { ascending: false })
  return (data ?? []).map((r: { slug: string }) => r.slug)
}

export async function getToolsByCategory(
  category: string,
  options: { limit?: number; offset?: number; qualifier?: string } = {}
): Promise<{ tools: Tool[]; total: number }> {
  const { limit = 24, offset = 0 } = options

  let query = supabaseAdmin
    .from('tools')
    .select('*', { count: 'exact' })
    .contains('categories', [category])
    .order('g2_rating', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (options.qualifier === 'free') query = query.eq('has_free_plan', true)
  if (options.qualifier === 'open-source') query = query.eq('pricing_model', 'open-source')

  const { data, count } = await query
  return { tools: data ?? [], total: count ?? 0 }
}

export async function getFeaturedTools(limit = 12): Promise<Tool[]> {
  const { data } = await supabaseAdmin
    .from('tools')
    .select('*')
    .eq('is_featured', true)
    .order('g2_rating', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function searchTools(query: string, limit = 20): Promise<Tool[]> {
  const { data } = await supabaseAdmin
    .from('tools')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('ph_votes', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function incrementToolViews(slug: string) {
  await supabaseAdmin.rpc('increment_tool_views', { tool_slug: slug })
}

// ─── Comparisons ──────────────────────────────────────────────────────────────

export async function getComparison(slug: string): Promise<Comparison | null> {
  const { data } = await supabaseAdmin
    .from('comparisons')
    .select(`
      *,
      tool_a:tool_a_id(*),
      tool_b:tool_b_id(*)
    `)
    .eq('slug', slug)
    .single()
  return data
}

export async function getAllComparisonSlugs(): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from('comparisons')
    .select('slug')
    .order('search_volume', { ascending: false })
    .limit(500000) // Only index high-volume pages
  return (data ?? []).map((r: { slug: string }) => r.slug)
}

export async function getRelatedComparisons(toolId: string, limit = 6): Promise<Comparison[]> {
  const { data } = await supabaseAdmin
    .from('comparisons')
    .select(`*, tool_a:tool_a_id(*), tool_b:tool_b_id(*)`)
    .or(`tool_a_id.eq.${toolId},tool_b_id.eq.${toolId}`)
    .order('search_volume', { ascending: false })
    .limit(limit)
  return data ?? []
}

// ─── Integrations ─────────────────────────────────────────────────────────────

export async function getIntegration(slug: string): Promise<Integration | null> {
  const { data } = await supabaseAdmin
    .from('integrations')
    .select(`*, tool_a:tool_a_id(*), tool_b:tool_b_id(*)`)
    .eq('slug', slug)
    .single()
  return data
}

export async function getAllIntegrationSlugs(): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from('integrations')
    .select('slug')
  return (data ?? []).map((r: { slug: string }) => r.slug)
}

export async function getToolIntegrations(toolId: string, limit = 20): Promise<Integration[]> {
  const { data } = await supabaseAdmin
    .from('integrations')
    .select(`*, tool_a:tool_a_id(*), tool_b:tool_b_id(*)`)
    .or(`tool_a_id.eq.${toolId},tool_b_id.eq.${toolId}`)
    .order('view_count', { ascending: false })
    .limit(limit)
  return data ?? []
}

// ─── Alternatives ─────────────────────────────────────────────────────────────

export async function getAlternatives(
  toolId: string,
  qualifier?: string,
  limit = 12
): Promise<Alternative[]> {
  let query = supabaseAdmin
    .from('alternatives')
    .select('similarity_score, qualifier, alternative:alternative_id(*)')
    .eq('tool_id', toolId)
    .order('similarity_score', { ascending: false })
    .limit(limit)

  if (qualifier) query = query.eq('qualifier', qualifier)

  const { data } = await query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => ({
    tool: r.alternative as Tool,
    similarity_score: r.similarity_score as number,
    qualifier: r.qualifier as string | null,
  }))
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const { data } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('tool_count', { ascending: false })
  return data ?? []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

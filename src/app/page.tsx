import Link from 'next/link'
import { ArrowRight, Zap, GitCompare, RefreshCw, Puzzle } from 'lucide-react'
import { getFeaturedTools, getAllCategories } from '@/lib/db'
import { ToolCard } from '@/components/tools/ToolCard'

export const revalidate = 3600

const popularComparisons = [
  { slug: 'notion-vs-obsidian', a: 'Notion', b: 'Obsidian' },
  { slug: 'hubspot-vs-salesforce', a: 'HubSpot', b: 'Salesforce' },
  { slug: 'slack-vs-microsoft-teams', a: 'Slack', b: 'MS Teams' },
  { slug: 'zapier-vs-make', a: 'Zapier', b: 'Make' },
  { slug: 'linear-vs-jira', a: 'Linear', b: 'Jira' },
  { slug: 'vercel-vs-netlify', a: 'Vercel', b: 'Netlify' },
]

const popularAlternatives = [
  { slug: 'notion', name: 'Notion' },
  { slug: 'hubspot', name: 'HubSpot' },
  { slug: 'salesforce', name: 'Salesforce' },
  { slug: 'zapier', name: 'Zapier' },
  { slug: 'figma', name: 'Figma' },
  { slug: 'monday', name: 'Monday.com' },
]

const defaultCategories = [
  { slug: 'crm', name: 'CRM', icon: '🤝', tool_count: 0 },
  { slug: 'project-management', name: 'Project Management', icon: '📋', tool_count: 0 },
  { slug: 'email-marketing', name: 'Email Marketing', icon: '📧', tool_count: 0 },
  { slug: 'analytics', name: 'Analytics', icon: '📊', tool_count: 0 },
  { slug: 'automation', name: 'Automation', icon: '⚡', tool_count: 0 },
  { slug: 'design', name: 'Design', icon: '🎨', tool_count: 0 },
  { slug: 'developer-tools', name: 'Developer Tools', icon: '💻', tool_count: 0 },
  { slug: 'ai-tools', name: 'AI Tools', icon: '🤖', tool_count: 0 },
  { slug: 'communication', name: 'Communication', icon: '💬', tool_count: 0 },
  { slug: 'security', name: 'Security', icon: '🔒', tool_count: 0 },
  { slug: 'accounting', name: 'Accounting', icon: '💰', tool_count: 0 },
  { slug: 'sales', name: 'Sales', icon: '📈', tool_count: 0 },
  { slug: 'hr-tools', name: 'HR & People', icon: '👥', tool_count: 0 },
  { slug: 'customer-support', name: 'Customer Support', icon: '🎧', tool_count: 0 },
  { slug: 'ecommerce', name: 'E-commerce', icon: '🛒', tool_count: 0 },
  { slug: 'productivity', name: 'Productivity', icon: '🧠', tool_count: 0 },
]

export default async function HomePage() {
  const [featuredTools, categories] = await Promise.all([
    getFeaturedTools(12).catch(() => []),
    getAllCategories().catch(() => []),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'var(--color-ink)', color: 'white' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,.4) 40px,rgba(255,255,255,.4) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,.4) 40px,rgba(255,255,255,.4) 41px)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 border" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
              <Zap size={11} fill="currentColor" /> 20,000+ SaaS tools indexed
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight mb-6" style={{ color: 'white' }}>
              Find the right tool.<br /><span style={{ color: 'var(--color-accent)' }}>Stop second-guessing.</span>
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl" style={{ color: 'rgba(255,255,255,0.65)' }}>
              AI-powered comparisons, honest alternatives, and deep integration guides — so you choose software with confidence.
            </p>
            <form action="/search" method="GET">
              <div className="flex gap-2 max-w-xl">
                <input name="q" type="text" placeholder="Search 20,000+ tools… e.g. 'CRM for startups'" className="flex-1 px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }} />
                <button type="submit" className="px-5 py-3 rounded-xl text-sm font-medium shrink-0" style={{ background: 'var(--color-accent)', color: 'white' }}>Search</button>
              </div>
            </form>
            <div className="flex flex-wrap gap-3 mt-6">
              {[{ href: '/compare/notion-vs-obsidian', label: '⚔️ Notion vs Obsidian' }, { href: '/alternatives/to/hubspot', label: '🔄 HubSpot alternatives' }, { href: '/best/crm', label: '📋 Best CRMs' }, { href: '/best/ai-tools', label: '🤖 AI Tools' }].map((l) => (
                <Link key={l.href} href={l.href} className="px-3 py-1.5 rounded-lg text-xs transition-colors" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page types */}
        <section className="py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Zap size={20} />, href: '/best/crm', title: 'Browse by category', desc: '500+ categories with ranked tools', color: 'var(--color-accent)', bg: 'var(--color-accent-light)' },
              { icon: <GitCompare size={20} />, href: '/compare/notion-vs-obsidian', title: 'Compare tools', desc: 'Side-by-side AI-powered analysis', color: 'var(--color-blue)', bg: 'var(--color-blue-light)' },
              { icon: <RefreshCw size={20} />, href: '/alternatives/to/notion', title: 'Find alternatives', desc: 'Free, open-source, or cheaper', color: 'var(--color-green)', bg: 'var(--color-green-light)' },
              { icon: <Puzzle size={20} />, href: '/integrations/notion-and-slack', title: 'Check integrations', desc: 'Does tool A connect to tool B?', color: '#7c3aed', bg: '#f3f0ff' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="tool-card rounded-xl border p-5 flex flex-col gap-3 bg-white" style={{ borderColor: 'var(--color-border)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                  <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl" style={{ color: 'var(--color-ink)' }}>Browse by category</h2>
            <Link href="/categories" className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-ink-faint)' }}>All categories <ArrowRight size={13} /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {(categories.length > 0 ? categories.slice(0, 20) : defaultCategories).map((cat) => (
              <Link key={cat.slug} href={`/best/${cat.slug}`} className="tool-card rounded-xl border p-4 flex items-center gap-3 bg-white hover:border-stone-300" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-xl">{cat.icon || '📦'}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-ink)' }}>{cat.name}</p>
                  {cat.tool_count > 0 && <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>{cat.tool_count} tools</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured tools */}
        {featuredTools.length > 0 && (
          <section className="py-10">
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--color-ink)' }}>Featured tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {featuredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
            </div>
          </section>
        )}

        {/* Comparisons */}
        <section className="py-10">
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--color-ink)' }}>Popular comparisons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularComparisons.map((comp) => (
              <Link key={comp.slug} href={`/compare/${comp.slug}`} className="tool-card rounded-xl border p-4 flex items-center justify-between bg-white gap-3" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium truncate" style={{ color: 'var(--color-ink)' }}>{comp.a}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ background: 'var(--color-paper-2)', color: 'var(--color-ink-faint)' }}>vs</span>
                  <span className="text-sm font-medium truncate" style={{ color: 'var(--color-ink)' }}>{comp.b}</span>
                </div>
                <ArrowRight size={14} style={{ color: 'var(--color-ink-faint)' }} />
              </Link>
            ))}
          </div>
        </section>

        {/* Alternatives */}
        <section className="py-10 mb-10">
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--color-ink)' }}>Looking for alternatives?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {popularAlternatives.map((alt) => (
              <Link key={alt.slug} href={`/alternatives/to/${alt.slug}`} className="tool-card rounded-xl border p-4 text-center bg-white" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{alt.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-faint)' }}>alternatives →</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

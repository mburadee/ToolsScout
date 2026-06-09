import type { Metadata } from 'next'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { searchTools } from '@/lib/db'
import { ToolCard } from '@/components/tools/ToolCard'

export const metadata: Metadata = {
  title: 'Search SaaS Tools',
  description: 'Search 20,000+ SaaS tools, compare alternatives, and find integrations.',
  robots: { index: false, follow: true },
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q?.trim() || ''
  const results = query ? await searchTools(query, 24).catch(() => []) : []

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl mb-6" style={{ color: 'var(--color-ink)' }}>
        {query ? `Search results for "${query}"` : 'Search tools'}
      </h1>

      {/* Search form */}
      <form method="GET" action="/search" className="mb-8">
        <div className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-ink-faint)' }} />
            <input name="q" type="text" defaultValue={query}
              placeholder="Search 20,000+ SaaS tools…"
              autoFocus
              className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', background: 'white', color: 'var(--color-ink)' }} />
          </div>
          <button type="submit" className="px-5 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'var(--color-ink)', color: 'white' }}>
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      {query && (
        <p className="text-sm mb-6" style={{ color: 'var(--color-ink-faint)' }}>
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <p className="text-lg mb-2" style={{ color: 'var(--color-ink-muted)' }}>
            No tools found for "{query}"
          </p>
          <p className="text-sm mb-6" style={{ color: 'var(--color-ink-faint)' }}>
            Try a different search term or browse by category
          </p>
          <Link href="/categories" className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'var(--color-ink)', color: 'white' }}>
            Browse categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {['CRM', 'Automation', 'Analytics', 'Design', 'Email Marketing', 'AI Tools', 'Developer Tools', 'Project Management'].map((cat) => (
            <Link key={cat} href={`/best/${cat.toLowerCase().replace(/ /g, '-')}`}
              className="tool-card rounded-xl border p-4 text-center bg-white"
              style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{cat}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

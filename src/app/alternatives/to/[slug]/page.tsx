import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { getToolBySlug, getAlternatives, getAllToolSlugs } from '@/lib/db'
import { ToolCard } from '@/components/tools/ToolCard'
import type { AlternativePageProps } from '@/types'

export const revalidate = 86400

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) return { title: 'Not found' }
  const title = `Best ${tool.name} Alternatives in ${new Date().getFullYear()} (Free, Paid & Open Source)`
  const description = `Looking for ${tool.name} alternatives? We compared the top ${tool.name} competitors — free options, open-source alternatives, and cheaper paid tools.`
  return {
    title,
    description,
    alternates: { canonical: `/alternatives/to/${slug}` },
  }
}

const qualifiers = [
  { key: undefined, label: 'All alternatives' },
  { key: 'free', label: 'Free alternatives' },
  { key: 'open-source', label: 'Open source' },
  { key: 'affordable', label: 'Cheaper options' },
]

export default async function AlternativesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) notFound()

  const alternatives = await getAlternatives(tool.id, undefined, 20).catch(() => [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-ink-faint)' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span>Alternatives</span>
        <span>/</span>
        <span style={{ color: 'var(--color-ink-muted)' }}>{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="max-w-2xl mb-10">
        <div className="flex items-center gap-2 mb-3">
          <RefreshCw size={18} style={{ color: 'var(--color-accent)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
            {alternatives.length} alternatives found
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: 'var(--color-ink)' }}>
          Best {tool.name} Alternatives
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
          Not happy with {tool.name}? We've compared the top alternatives — including free tools,
          open-source options, and cheaper paid alternatives — so you can find the best fit for your needs.
        </p>
      </div>

      {/* Qualifier filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {qualifiers.map((q) => (
          <Link
            key={q.label}
            href={q.key ? `/alternatives/to/${slug}?qualifier=${q.key}` : `/alternatives/to/${slug}`}
            className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)', background: 'white' }}
          >
            {q.label}
          </Link>
        ))}
      </div>

      {/* Why look for alternatives */}
      {tool.ai_cons?.length > 0 && (
        <div className="rounded-2xl border p-5 mb-8" style={{ borderColor: 'var(--color-border)', background: 'var(--color-accent-light)' }}>
          <h2 className="font-semibold text-sm mb-2" style={{ color: 'var(--color-accent-dark)' }}>
            Why people look for {tool.name} alternatives
          </h2>
          <ul className="space-y-1">
            {tool.ai_cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                <span style={{ color: 'var(--color-accent)', marginTop: 2 }}>→</span> {con}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alternatives grid */}
      {alternatives.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {alternatives.map(({ tool: alt, qualifier }) => (
            <div key={alt.id} className="relative">
              {qualifier && (
                <div className="absolute -top-2 left-3 z-10">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: 'var(--color-green)', color: 'white' }}>
                    {qualifier === 'free' ? '✓ Free' : qualifier === 'open-source' ? '⊕ Open source' : '$ Cheaper'}
                  </span>
                </div>
              )}
              <ToolCard tool={alt} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16" style={{ color: 'var(--color-ink-faint)' }}>
          <RefreshCw size={32} className="mx-auto mb-3 opacity-30" />
          <p>No alternatives indexed yet. Check back soon.</p>
        </div>
      )}

      {/* Bottom CTA: compare with tool */}
      <div className="rounded-2xl border p-6 mb-8" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-2)' }}>
        <h2 className="font-display text-xl mb-2" style={{ color: 'var(--color-ink)' }}>
          Compare {tool.name} side by side
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--color-ink-muted)' }}>
          See a detailed feature-by-feature breakdown between {tool.name} and any alternative.
        </p>
        <div className="flex flex-wrap gap-2">
          {alternatives.slice(0, 6).map(({ tool: alt }) => (
            <Link key={alt.id}
              href={`/compare/${tool.slug}-vs-${alt.slug}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border bg-white hover:border-stone-400 transition-colors"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
              {tool.name} vs {alt.name} <ArrowRight size={10} />
            </Link>
          ))}
        </div>
      </div>

      {/* Related: also look at tool's comparisons */}
      <div className="text-center" style={{ color: 'var(--color-ink-faint)' }}>
        <Link href={`/tools/${tool.slug}`}
          className="text-sm flex items-center justify-center gap-1 hover:underline"
          style={{ color: 'var(--color-ink-muted)' }}>
          ← Back to full {tool.name} review
        </Link>
      </div>
    </div>
  )
}

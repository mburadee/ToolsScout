import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CheckCircle2, XCircle, ArrowRight, ExternalLink, Minus } from 'lucide-react'
import { getComparison, getAllComparisonSlugs } from '@/lib/db'
import type { ComparePageProps, Tool } from '@/types'

export const revalidate = 86400

export async function generateStaticParams() {
  const slugs = await getAllComparisonSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const comp = await getComparison(slug)
  if (!comp) return { title: 'Comparison not found' }
  const title = `${comp.tool_a.name} vs ${comp.tool_b.name} — Which is better? (${new Date().getFullYear()})`
  const description = comp.ai_verdict?.slice(0, 160) || `Compare ${comp.tool_a.name} and ${comp.tool_b.name} side by side — pricing, features, integrations, and who should use each.`
  return {
    title,
    description,
    alternates: { canonical: `/compare/${slug}` },
  }
}

function ComparisonJsonLd({ comp }: { comp: Awaited<ReturnType<typeof getComparison>> }) {
  if (!comp) return null
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${comp.tool_a.name} vs ${comp.tool_b.name}`,
        description: comp.ai_verdict,
        itemListElement: [
          { '@type': 'SoftwareApplication', position: 1, name: comp.tool_a.name, url: comp.tool_a.website_url },
          { '@type': 'SoftwareApplication', position: 2, name: comp.tool_b.name, url: comp.tool_b.website_url },
        ],
      })
    }} />
  )
}

function ToolHero({ tool, side }: { tool: Tool; side: 'A' | 'B' }) {
  const accentColor = side === 'A' ? 'var(--color-blue)' : 'var(--color-accent)'
  const accentBg = side === 'A' ? 'var(--color-blue-light)' : 'var(--color-accent-light)'
  return (
    <div className="rounded-2xl border bg-white p-6 flex flex-col items-center text-center"
      style={{ borderColor: 'var(--color-border)' }}>
      <div className="w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 overflow-hidden"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-2)' }}>
        {tool.logo_url
          ? <Image src={tool.logo_url} alt={tool.name} width={64} height={64} className="object-contain" />
          : <span className="text-2xl font-bold" style={{ color: 'var(--color-ink-faint)' }}>{tool.name[0]}</span>
        }
      </div>
      <h2 className="font-display text-2xl mb-1" style={{ color: 'var(--color-ink)' }}>{tool.name}</h2>
      <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-ink-muted)' }}>{tool.tagline}</p>
      {tool.g2_rating && (
        <p className="text-sm mb-3" style={{ color: 'var(--color-ink-faint)' }}>
          ⭐ {tool.g2_rating.toFixed(1)} / 5 · {(tool.g2_reviews || 0).toLocaleString()} reviews
        </p>
      )}
      <span className="text-xs px-3 py-1 rounded-full font-medium mb-4"
        style={{ background: accentBg, color: accentColor }}>
        {tool.has_free_plan ? 'Has free plan' : tool.min_price ? `From $${tool.min_price}/mo` : 'Paid'}
      </span>
      <a href={tool.affiliate_url || tool.website_url || '#'}
        target="_blank" rel="noopener noreferrer nofollow"
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium"
        style={{ background: accentColor, color: 'white' }}>
        Visit {tool.name} <ExternalLink size={12} />
      </a>
    </div>
  )
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const comp = await getComparison(slug)
  if (!comp) notFound()

  const { tool_a, tool_b } = comp

  return (
    <>
      <ComparisonJsonLd comp={comp} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-ink-faint)' }}>
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Compare</span>
          <span>/</span>
          <span style={{ color: 'var(--color-ink-muted)' }}>{tool_a.name} vs {tool_b.name}</span>
        </nav>

        {/* Page title */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: 'var(--color-ink)' }}>
            {tool_a.name} vs {tool_b.name}
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--color-ink-muted)' }}>
            An AI-powered side-by-side comparison to help you choose the right tool.
          </p>
        </div>

        {/* Tool heroes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <ToolHero tool={tool_a} side="A" />
          <ToolHero tool={tool_b} side="B" />
        </div>

        {/* AI verdict */}
        {comp.ai_verdict && (
          <section className="rounded-2xl border p-6 mb-8 bg-white" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="font-display text-xl mb-3" style={{ color: 'var(--color-ink)' }}>
              Our verdict
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
              {comp.ai_verdict}
            </p>
            {comp.switching_difficulty && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>Switching difficulty:</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="w-4 h-1.5 rounded-full"
                      style={{ background: n <= comp.switching_difficulty! ? 'var(--color-accent)' : 'var(--color-paper-3)' }} />
                  ))}
                </div>
                <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
                  {comp.switching_difficulty <= 2 ? 'Easy' : comp.switching_difficulty <= 3 ? 'Moderate' : 'Hard'}
                </span>
              </div>
            )}
          </section>
        )}

        {/* When to choose each */}
        {comp.winner_use_cases && (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {([['tool_a', tool_a, 'var(--color-blue)', 'var(--color-blue-light)'],
               ['tool_b', tool_b, 'var(--color-accent)', 'var(--color-accent-light)']] as const).map(
              ([key, tool, color, bg]) => (
                <div key={key} className="rounded-2xl border p-5 bg-white" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color }}>
                    Choose {tool.name} when…
                  </p>
                  <ul className="space-y-2">
                    {(comp.winner_use_cases![key] || []).map((uc, i) => (
                      <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                        <CheckCircle2 size={14} style={{ color, flexShrink: 0, marginTop: 2 }} />
                        {uc}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </section>
        )}

        {/* Feature comparison table */}
        {comp.feature_comparison && comp.feature_comparison.length > 0 && (
          <section className="rounded-2xl border bg-white overflow-hidden mb-8"
            style={{ borderColor: 'var(--color-border)' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="font-display text-xl" style={{ color: 'var(--color-ink)' }}>Feature comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--color-paper-2)' }}>
                    <th className="text-left text-xs font-semibold px-6 py-3" style={{ color: 'var(--color-ink-faint)', width: '40%' }}>Feature</th>
                    <th className="text-center text-xs font-semibold px-6 py-3" style={{ color: 'var(--color-ink)' }}>{tool_a.name}</th>
                    <th className="text-center text-xs font-semibold px-6 py-3" style={{ color: 'var(--color-ink)' }}>{tool_b.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {comp.feature_comparison.map((row, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-6 py-3 text-sm" style={{ color: 'var(--color-ink-muted)' }}>{row.feature}</td>
                      {[row.tool_a, row.tool_b].map((val, j) => (
                        <td key={j} className="px-6 py-3 text-center">
                          {typeof val === 'boolean'
                            ? val
                              ? <CheckCircle2 size={16} className="mx-auto" style={{ color: 'var(--color-green)' }} />
                              : <XCircle size={16} className="mx-auto" style={{ color: '#dc2626' }} />
                            : val
                              ? <span className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>{val}</span>
                              : <Minus size={14} className="mx-auto" style={{ color: 'var(--color-ink-faint)' }} />
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Related links */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', background: 'var(--color-blue-light)' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-blue)' }}>
              Explore {tool_a.name}
            </p>
            <div className="flex flex-col gap-1">
              <Link href={`/tools/${tool_a.slug}`} className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-ink-muted)' }}>
                <ArrowRight size={12} /> Full {tool_a.name} review
              </Link>
              <Link href={`/alternatives/to/${tool_a.slug}`} className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-ink-muted)' }}>
                <ArrowRight size={12} /> {tool_a.name} alternatives
              </Link>
              <Link href={`/pricing/${tool_a.slug}`} className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-ink-muted)' }}>
                <ArrowRight size={12} /> {tool_a.name} pricing
              </Link>
            </div>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', background: 'var(--color-accent-light)' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-accent-dark)' }}>
              Explore {tool_b.name}
            </p>
            <div className="flex flex-col gap-1">
              <Link href={`/tools/${tool_b.slug}`} className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-ink-muted)' }}>
                <ArrowRight size={12} /> Full {tool_b.name} review
              </Link>
              <Link href={`/alternatives/to/${tool_b.slug}`} className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-ink-muted)' }}>
                <ArrowRight size={12} /> {tool_b.name} alternatives
              </Link>
              <Link href={`/pricing/${tool_b.slug}`} className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-ink-muted)' }}>
                <ArrowRight size={12} /> {tool_b.name} pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ExternalLink, Star, CheckCircle2, XCircle, ArrowRight, GitCompare, RefreshCw, Puzzle, ThumbsUp, Users } from 'lucide-react'
import { getToolBySlug, getAllToolSlugs, getAlternatives, getRelatedComparisons, getToolIntegrations } from '@/lib/db'
import { ToolCard } from '@/components/tools/ToolCard'
import type { Tool } from '@/types'

export const revalidate = 86400

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs().catch(() => [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug).catch(() => null)
  if (!tool) return { title: 'Tool not found' }
  const title = `${tool.name} Review, Pricing & Alternatives ${new Date().getFullYear()}`
  const description = `${tool.ai_summary || tool.tagline} — Compare ${tool.name} with alternatives, check integrations, and see real pricing.`
  return { title, description, openGraph: { title, description }, alternates: { canonical: `/tools/${tool.slug}` } }
}

function ToolJsonLd({ tool }: { tool: Tool }) {
  const schema = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    name: tool.name, description: tool.ai_summary || tool.tagline,
    url: tool.website_url, image: tool.logo_url,
    applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
    ...(tool.g2_rating && { aggregateRating: { '@type': 'AggregateRating', ratingValue: tool.g2_rating, reviewCount: tool.g2_reviews || 1, bestRating: 5, worstRating: 1 } }),
    offers: { '@type': 'Offer', price: tool.min_price || '0', priceCurrency: 'USD' },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = await getToolBySlug(slug).catch(() => null)
  if (!tool) notFound()

  const [alternatives, comparisons, integrations] = await Promise.all([
    getAlternatives(tool.id, undefined, 8).catch(() => []),
    getRelatedComparisons(tool.id, 6).catch(() => []),
    getToolIntegrations(tool.id, 12).catch(() => []),
  ])

  const pricingLabel = tool.pricing_model === 'free' ? 'Free'
    : tool.pricing_model === 'open-source' ? 'Open Source'
    : tool.has_free_plan ? `Freemium — from $${tool.min_price || 0}/mo`
    : tool.min_price ? `From $${tool.min_price}/mo` : 'Paid'

  return (
    <>
      <ToolJsonLd tool={tool} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-ink-faint)' }}>
          <Link href="/" className="hover:underline">Home</Link><span>/</span>
          {tool.categories[0] && <><Link href={`/best/${tool.categories[0]}`} className="hover:underline capitalize">{tool.categories[0].replace(/-/g, ' ')}</Link><span>/</span></>}
          <span style={{ color: 'var(--color-ink-muted)' }}>{tool.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero card */}
            <div className="rounded-2xl border bg-white p-6 sm:p-8" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl border flex items-center justify-center shrink-0 overflow-hidden" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-2)' }}>
                  {tool.logo_url ? <Image src={tool.logo_url} alt={`${tool.name} logo`} width={64} height={64} className="object-contain" /> : <span className="text-2xl font-bold" style={{ color: 'var(--color-ink-faint)' }}>{tool.name[0]}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h1 className="font-display text-3xl" style={{ color: 'var(--color-ink)' }}>{tool.name}</h1>
                      <p className="text-base mt-1" style={{ color: 'var(--color-ink-muted)' }}>{tool.tagline}</p>
                    </div>
                    <a href={tool.affiliate_url || tool.website_url || '#'} target="_blank" rel="noopener noreferrer nofollow"
                      className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--color-accent)', color: 'white' }}>
                      Visit {tool.name} <ExternalLink size={13} />
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {tool.g2_rating && <span className="flex items-center gap-1 text-sm"><Star size={14} fill="#f59e0b" color="#f59e0b" /><strong>{tool.g2_rating.toFixed(1)}</strong><span style={{ color: 'var(--color-ink-faint)' }}>({(tool.g2_reviews || 0).toLocaleString()} reviews)</span></span>}
                    <span className="text-sm font-medium px-2.5 py-0.5 rounded-full" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent-dark)' }}>{pricingLabel}</span>
                    {tool.is_verified && <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-green)' }}><CheckCircle2 size={12} /> Verified</span>}
                  </div>
                </div>
              </div>
              {tool.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {tool.categories.map((cat) => (
                    <Link key={cat} href={`/best/${cat}`} className="text-xs px-3 py-1 rounded-full border hover:border-stone-400 transition-colors capitalize" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>{cat.replace(/-/g, ' ')}</Link>
                  ))}
                </div>
              )}
            </div>

            {/* AI Summary */}
            {tool.ai_summary && (
              <section className="rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--color-border)' }}>
                <h2 className="font-display text-xl mb-3" style={{ color: 'var(--color-ink)' }}>What is {tool.name}?</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{tool.ai_summary}</p>
                {tool.ai_ideal_user && (
                  <div className="mt-4 flex gap-2 p-3 rounded-xl" style={{ background: 'var(--color-paper-2)' }}>
                    <Users size={15} style={{ color: 'var(--color-ink-faint)', marginTop: 2, flexShrink: 0 }} />
                    <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}><strong>Ideal user: </strong>{tool.ai_ideal_user}</p>
                  </div>
                )}
              </section>
            )}

            {/* Pros & Cons */}
            {(tool.ai_pros?.length > 0 || tool.ai_cons?.length > 0) && (
              <section className="rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--color-border)' }}>
                <h2 className="font-display text-xl mb-4" style={{ color: 'var(--color-ink)' }}>Pros & cons</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-green)' }}>What works well</p>
                    <ul className="space-y-2">{tool.ai_pros.map((pro, i) => <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--color-ink-muted)' }}><CheckCircle2 size={15} style={{ color: 'var(--color-green)', flexShrink: 0, marginTop: 1 }} />{pro}</li>)}</ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#dc2626' }}>Watch out for</p>
                    <ul className="space-y-2">{tool.ai_cons.map((con, i) => <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--color-ink-muted)' }}><XCircle size={15} style={{ color: '#dc2626', flexShrink: 0, marginTop: 1 }} />{con}</li>)}</ul>
                  </div>
                </div>
                {tool.ai_not_for && <div className="mt-4 p-3 rounded-xl border-l-4 text-sm" style={{ background: '#fff7f5', borderColor: 'var(--color-accent)', color: 'var(--color-ink-muted)' }}><strong>Not the best fit if: </strong>{tool.ai_not_for}</div>}
              </section>
            )}

            {/* Best for */}
            {tool.ai_best_for?.length > 0 && (
              <section className="rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--color-border)' }}>
                <h2 className="font-display text-xl mb-4" style={{ color: 'var(--color-ink)' }}>Best for</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tool.ai_best_for.map((item, i) => (
                    <div key={i} className="flex gap-2 items-start p-3 rounded-xl" style={{ background: 'var(--color-paper-2)' }}>
                      <ThumbsUp size={13} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }} />
                      <span className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Comparisons */}
            {comparisons.length > 0 && (
              <section>
                <h2 className="font-display text-xl mb-4" style={{ color: 'var(--color-ink)' }}>{tool.name} comparisons</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {comparisons.map((comp) => {
                    const other = comp.tool_a.id === tool.id ? comp.tool_b : comp.tool_a
                    return (
                      <Link key={comp.id} href={`/compare/${comp.slug}`} className="tool-card rounded-xl border p-4 flex items-center justify-between gap-3 bg-white" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex items-center gap-2"><GitCompare size={14} style={{ color: 'var(--color-ink-faint)' }} /><span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{tool.name} vs {other.name}</span></div>
                        <ArrowRight size={13} style={{ color: 'var(--color-ink-faint)' }} />
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Integrations */}
            {integrations.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl" style={{ color: 'var(--color-ink)' }}>{tool.name} integrations</h2>
                  <Link href={`/integrations?tool=${tool.slug}`} className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-ink-faint)' }}>See all <ArrowRight size={12} /></Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {integrations.map((integ) => {
                    const other = integ.tool_a.id === tool.id ? integ.tool_b : integ.tool_a
                    return (
                      <Link key={integ.id} href={`/integrations/${integ.slug}`} className="tool-card rounded-xl border p-3 flex items-center gap-2 bg-white" style={{ borderColor: 'var(--color-border)' }}>
                        <Puzzle size={13} style={{ color: 'var(--color-ink-faint)', flexShrink: 0 }} />
                        <span className="text-sm truncate" style={{ color: 'var(--color-ink)' }}>{other.name}</span>
                        {integ.is_native && <span className="text-xs ml-auto shrink-0" style={{ color: 'var(--color-green)' }}>Native</span>}
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border bg-white p-5 sticky top-20" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--color-ink)' }}>Quick info</h3>
              <div className="space-y-3">
                {[
                  { label: 'Pricing', value: pricingLabel },
                  { label: 'Free plan', value: tool.has_free_plan ? 'Yes ✓' : 'No' },
                  { label: 'Founded', value: tool.founded_year ? String(tool.founded_year) : 'N/A' },
                  { label: 'Headquarters', value: tool.hq_country || 'N/A' },
                  { label: 'G2 rating', value: tool.g2_rating ? `${tool.g2_rating}/5` : 'N/A' },
                  { label: 'GitHub stars', value: tool.github_stars ? tool.github_stars.toLocaleString() : 'N/A' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-ink-faint)' }}>{label}</span>
                    <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{value}</span>
                  </div>
                ))}
              </div>
              <a href={tool.affiliate_url || tool.website_url || '#'} target="_blank" rel="noopener noreferrer nofollow"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium" style={{ background: 'var(--color-ink)', color: 'white' }}>
                Visit {tool.name} <ExternalLink size={13} />
              </a>
            </div>
            <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--color-border)', background: 'var(--color-accent-light)' }}>
              <RefreshCw size={18} style={{ color: 'var(--color-accent)', marginBottom: 8 }} />
              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>Not sold on {tool.name}?</p>
              <p className="text-xs mb-3" style={{ color: 'var(--color-ink-muted)' }}>See the best alternatives — free, open-source, and cheaper options.</p>
              <Link href={`/alternatives/to/${tool.slug}`} className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--color-accent)', color: 'white' }}>
                View alternatives <ArrowRight size={13} />
              </Link>
            </div>
          </aside>
        </div>

        {/* Alternatives grid */}
        {alternatives.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl" style={{ color: 'var(--color-ink)' }}>Top alternatives to {tool.name}</h2>
              <Link href={`/alternatives/to/${tool.slug}`} className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-ink-faint)' }}>See all <ArrowRight size={12} /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {alternatives.map(({ tool: alt }) => <ToolCard key={alt.id} tool={alt} />)}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react'
import { getToolBySlug, getAllToolSlugs } from '@/lib/db'

export const revalidate = 86400

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs().catch(() => [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug).catch(() => null)
  if (!tool) return { title: 'Not found' }
  const title = `${tool.name} Pricing ${new Date().getFullYear()} — All Plans Explained`
  const description = `How much does ${tool.name} cost? See all plans, what's included, hidden fees, and whether the free plan is worth it.`
  return { title, description, alternates: { canonical: `/pricing/${slug}` } }
}

export default async function PricingPage({ params }: Props) {
  const { slug } = await params
  const tool = await getToolBySlug(slug).catch(() => null)
  if (!tool) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-ink-faint)' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href={`/tools/${tool.slug}`} className="hover:underline">{tool.name}</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-ink-muted)' }}>Pricing</span>
      </nav>

      <h1 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: 'var(--color-ink)' }}>
        {tool.name} Pricing {new Date().getFullYear()}
      </h1>
      <p className="text-base mb-8" style={{ color: 'var(--color-ink-muted)' }}>
        A complete breakdown of {tool.name}&apos;s plans, what&apos;s included, and how to decide which tier is right for you.
      </p>

      {/* Pricing summary */}
      <div className="rounded-2xl border bg-white p-6 mb-8" style={{ borderColor: 'var(--color-border)' }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Starting price', value: tool.min_price ? `$${tool.min_price}/mo` : 'Free' },
            { label: 'Free plan', value: tool.has_free_plan ? '✓ Available' : '✗ Not available' },
            { label: 'Pricing model', value: tool.pricing_model || 'N/A' },
            { label: 'Max price', value: tool.max_price ? `$${tool.max_price}/mo` : 'Custom' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-3 rounded-xl" style={{ background: 'var(--color-paper-2)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--color-ink-faint)' }}>{label}</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{value}</p>
            </div>
          ))}
        </div>

        {tool.has_free_plan && (
          <div className="flex gap-2 p-3 rounded-xl mb-4" style={{ background: 'var(--color-green-light)' }}>
            <CheckCircle2 size={15} style={{ color: 'var(--color-green)', flexShrink: 0, marginTop: 1 }} />
            <p className="text-sm" style={{ color: 'var(--color-green)' }}>
              <strong>{tool.name} has a free plan</strong> — you can start using it without a credit card.
            </p>
          </div>
        )}

        <a href={tool.affiliate_url || tool.website_url || '#'}
          target="_blank" rel="noopener noreferrer nofollow"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium"
          style={{ background: 'var(--color-accent)', color: 'white' }}>
          See current pricing on {tool.name} <ExternalLink size={13} />
        </a>
        <p className="text-xs text-center mt-2" style={{ color: 'var(--color-ink-faint)' }}>
          Prices may change — always verify on the official site.
        </p>
      </div>

      {/* AI pricing analysis */}
      {tool.ai_summary && (
        <div className="rounded-2xl border bg-white p-6 mb-8" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-display text-xl mb-3" style={{ color: 'var(--color-ink)' }}>
            Is {tool.name} worth the price?
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
            {tool.ai_summary}
          </p>
          {tool.ai_best_for?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>Best value for:</p>
              <div className="flex flex-wrap gap-2">
                {tool.ai_best_for.map((item, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-lg"
                    style={{ background: 'var(--color-paper-2)', color: 'var(--color-ink-muted)' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Related links */}
      <div className="flex flex-wrap gap-3">
        <Link href={`/tools/${tool.slug}`} className="flex items-center gap-1 text-sm hover:underline"
          style={{ color: 'var(--color-ink-muted)' }}>
          <ArrowRight size={12} /> Full {tool.name} review
        </Link>
        <Link href={`/alternatives/to/${tool.slug}`} className="flex items-center gap-1 text-sm hover:underline"
          style={{ color: 'var(--color-ink-muted)' }}>
          <ArrowRight size={12} /> Cheaper {tool.name} alternatives
        </Link>
      </div>
    </div>
  )
}

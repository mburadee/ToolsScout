import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CheckCircle2, XCircle, ArrowRight, Puzzle, ExternalLink } from 'lucide-react'
import { getIntegration, getAllIntegrationSlugs } from '@/lib/db'
import type { IntegrationPageProps } from '@/types'

export const revalidate = 604800 // 1 week

export async function generateStaticParams() {
  const slugs = await getAllIntegrationSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const integ = await getIntegration(slug)
  if (!integ) return { title: 'Integration not found' }
  const title = `${integ.tool_a.name} + ${integ.tool_b.name} Integration — How to Connect Them`
  const description = `Does ${integ.tool_a.name} integrate with ${integ.tool_b.name}? ${integ.is_native ? 'Yes — natively.' : 'Yes — via Zapier or Make.'} Here's how to set it up and what data syncs.`
  return {
    title,
    description,
    alternates: { canonical: `/integrations/${slug}` },
  }
}

export default async function IntegrationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const integ = await getIntegration(slug)
  if (!integ) notFound()

  const { tool_a, tool_b } = integ
  const integrationMethods = [
    { available: integ.is_native, label: 'Native integration', desc: `${tool_a.name} has a built-in connector to ${tool_b.name}` },
    { available: integ.via_zapier, label: 'Via Zapier', desc: `Connect using Zapier automation (no code required)` },
    { available: integ.via_make, label: 'Via Make (Integromat)', desc: `Connect using Make automation workflows` },
    { available: integ.via_n8n, label: 'Via n8n', desc: `Connect using n8n open-source automation` },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-ink-faint)' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span>Integrations</span>
        <span>/</span>
        <span style={{ color: 'var(--color-ink-muted)' }}>{tool_a.name} & {tool_b.name}</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-5">
          {[tool_a, tool_b].map((tool, i) => (
            <div key={tool.id} className="flex items-center gap-4">
              {i === 1 && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--color-paper-3)' }}>
                  <Puzzle size={15} style={{ color: 'var(--color-ink-faint)' }} />
                </div>
              )}
              <div className="w-14 h-14 rounded-2xl border flex items-center justify-center overflow-hidden"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-2)' }}>
                {tool.logo_url
                  ? <Image src={tool.logo_url} alt={tool.name} width={56} height={56} className="object-contain" />
                  : <span className="text-xl font-bold" style={{ color: 'var(--color-ink-faint)' }}>{tool.name[0]}</span>
                }
              </div>
            </div>
          ))}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: 'var(--color-ink)' }}>
          {tool_a.name} + {tool_b.name} Integration
        </h1>
        <p className="text-base" style={{ color: 'var(--color-ink-muted)' }}>
          Everything you need to know about connecting {tool_a.name} and {tool_b.name}.
        </p>
        {/* Quick answer badge */}
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            background: integ.is_native ? 'var(--color-green-light)' : 'var(--color-accent-light)',
            color: integ.is_native ? 'var(--color-green)' : 'var(--color-accent-dark)',
          }}>
          {integ.is_native
            ? <><CheckCircle2 size={15} /> Yes — native integration available</>
            : <><CheckCircle2 size={15} /> Yes — connect via automation tools</>
          }
        </div>
      </div>

      {/* Integration methods */}
      <section className="rounded-2xl border bg-white p-6 mb-8" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="font-display text-xl mb-4" style={{ color: 'var(--color-ink)' }}>
          Integration methods
        </h2>
        <div className="space-y-3">
          {integrationMethods.map((method) => (
            <div key={method.label} className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: method.available ? 'var(--color-green-light)' : 'var(--color-paper-2)' }}>
              {method.available
                ? <CheckCircle2 size={16} style={{ color: 'var(--color-green)', flexShrink: 0, marginTop: 1 }} />
                : <XCircle size={16} style={{ color: 'var(--color-ink-faint)', flexShrink: 0, marginTop: 1 }} />
              }
              <div>
                <p className="text-sm font-medium" style={{ color: method.available ? 'var(--color-green)' : 'var(--color-ink-faint)' }}>
                  {method.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>{method.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What data syncs */}
      {integ.data_synced?.length > 0 && (
        <section className="rounded-2xl border bg-white p-6 mb-8" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-display text-xl mb-4" style={{ color: 'var(--color-ink)' }}>
            What data syncs
          </h2>
          <div className="flex flex-wrap gap-2">
            {integ.data_synced.map((item) => (
              <span key={item} className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"
                style={{ background: 'var(--color-paper-2)', color: 'var(--color-ink-muted)' }}>
                <ArrowRight size={11} /> {item}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Use cases */}
      {integ.use_cases?.length > 0 && (
        <section className="rounded-2xl border bg-white p-6 mb-8" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-display text-xl mb-4" style={{ color: 'var(--color-ink)' }}>
            Common use cases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {integ.use_cases.map((uc, i) => (
              <div key={i} className="flex gap-2 items-start p-3 rounded-xl"
                style={{ background: 'var(--color-paper-2)' }}>
                <span className="text-base">💡</span>
                <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>{uc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Setup guide */}
      {integ.setup_guide && (
        <section className="rounded-2xl border bg-white p-6 mb-8" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-display text-xl mb-4" style={{ color: 'var(--color-ink)' }}>
            How to set up the integration
          </h2>
          <div className="prose-tool text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
            {integ.setup_guide.split('\n').map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
        </section>
      )}

      {/* CTA row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
        {[tool_a, tool_b].map((tool) => (
          <div key={tool.id} className="rounded-xl border p-4 flex items-start justify-between gap-3 bg-white"
            style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{tool.name}</p>
              <div className="flex gap-2">
                <Link href={`/tools/${tool.slug}`} className="text-xs hover:underline flex items-center gap-1"
                  style={{ color: 'var(--color-ink-faint)' }}>
                  Review <ArrowRight size={10} />
                </Link>
                <Link href={`/alternatives/to/${tool.slug}`} className="text-xs hover:underline flex items-center gap-1"
                  style={{ color: 'var(--color-ink-faint)' }}>
                  Alternatives <ArrowRight size={10} />
                </Link>
              </div>
            </div>
            <a href={tool.website_url || '#'} target="_blank" rel="noopener noreferrer nofollow"
              className="text-xs px-3 py-1.5 rounded-lg font-medium shrink-0 flex items-center gap-1"
              style={{ background: 'var(--color-paper-2)', color: 'var(--color-ink-muted)' }}>
              Visit <ExternalLink size={10} />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Search, GitCompare, RefreshCw, Puzzle, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About ToolScout — How We Review and Rank SaaS Tools',
  description: 'ToolScout uses AI to compare 20,000+ SaaS tools. Learn how we rank tools, generate comparisons, and keep data fresh.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--color-ink-faint)' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-ink-muted)' }}>About</span>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-accent)' }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span className="font-semibold">ToolScout</span>
        </div>
        <h1 className="font-display text-4xl mb-4" style={{ color: 'var(--color-ink)' }}>
          The honest SaaS directory
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
          ToolScout helps software buyers cut through the noise. We index 20,000+ SaaS tools and use AI to
          generate honest comparisons, surface the best alternatives, and map every integration — so you
          spend less time researching and more time building.
        </p>
      </div>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--color-ink)' }}>
          How ToolScout works
        </h2>
        <div className="space-y-4">
          {[
            {
              icon: <Search size={18} />,
              title: 'We index from real sources',
              desc: 'Tool data is sourced from Product Hunt, GitHub, G2, and official product pages — not invented. We pull real ratings, pricing, and feature data.',
              color: 'var(--color-blue)',
              bg: 'var(--color-blue-light)',
            },
            {
              icon: <GitCompare size={18} />,
              title: 'AI generates comparisons',
              desc: 'Claude AI reads each tool\'s data and generates a unique narrative for every comparison page — honest pros, cons, and "when to choose" guidance.',
              color: 'var(--color-accent)',
              bg: 'var(--color-accent-light)',
            },
            {
              icon: <RefreshCw size={18} />,
              title: 'Alternatives are pre-computed',
              desc: 'We analyze category overlap and pricing differences to pre-compute the best alternatives for every tool — including free, open-source, and cheaper options.',
              color: 'var(--color-green)',
              bg: 'var(--color-green-light)',
            },
            {
              icon: <Puzzle size={18} />,
              title: 'Integration data from Zapier & Make',
              desc: 'We map integration pairs from Zapier (8,000+ apps) and Make, so every "does A integrate with B?" question gets a real answer with setup guidance.',
              color: '#7c3aed',
              bg: '#f3f0ff',
            },
            {
              icon: <TrendingUp size={18} />,
              title: 'Updated daily via ISR',
              desc: 'Tool pages refresh every 24 hours. Comparison and integration pages refresh weekly. Your data is always current without the site going stale.',
              color: '#0891b2',
              bg: '#ecfeff',
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5 rounded-2xl border bg-white"
              style={{ borderColor: 'var(--color-border)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>
                  {item.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate disclosure */}
      <section className="mb-12 p-5 rounded-2xl" style={{ background: 'var(--color-paper-2)', border: '1px solid var(--color-border)' }}>
        <h2 className="font-semibold text-sm mb-2" style={{ color: 'var(--color-ink)' }}>
          Affiliate disclosure
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
          Some links on ToolScout are affiliate links. When you click through and make a purchase or sign up,
          we may earn a commission at no extra cost to you. This never influences our rankings or editorial
          content — tools are ranked by rating, popularity, and relevance, not affiliate commission rate.
        </p>
      </section>

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Link href="/submit" className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'var(--color-ink)', color: 'white' }}>
          Submit your tool →
        </Link>
        <Link href="/advertise" className="px-4 py-2 rounded-xl text-sm font-medium border"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
          Advertise on ToolScout
        </Link>
      </div>
    </div>
  )
}

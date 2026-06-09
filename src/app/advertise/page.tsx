import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, TrendingUp, Users, Zap, Star, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Advertise on ToolScout — Reach 10k+ Daily SaaS Buyers',
  description: 'Reach high-intent SaaS buyers on ToolScout. Sponsored listings, featured comparisons, and category placements for SaaS vendors.',
}

const plans = [
  {
    name: 'Starter listing',
    price: '$199',
    period: '/mo',
    desc: 'Get your tool in front of category buyers.',
    color: 'var(--color-blue)',
    bg: 'var(--color-blue-light)',
    features: [
      'Verified badge on your tool page',
      'Priority placement in 1 category',
      'Logo displayed in category header',
      'Monthly performance report',
      'Direct affiliate link tracking',
    ],
  },
  {
    name: 'Featured vendor',
    price: '$499',
    period: '/mo',
    desc: 'Dominate your category and capture competitor traffic.',
    color: 'var(--color-accent)',
    bg: 'var(--color-accent-light)',
    highlight: true,
    features: [
      'Everything in Starter',
      'Sponsored slot on competitor alternative pages',
      'Featured in top 3 on 3 categories',
      'Custom comparison page co-branding',
      'Weekly performance analytics',
      'Dedicated account manager',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Full-funnel presence across ToolScout.',
    color: '#7c3aed',
    bg: '#f3f0ff',
    features: [
      'Everything in Featured',
      'Homepage banner placement',
      'Custom "Sponsored" category page',
      'Lead gen form integration',
      'Buyer intent signals (who viewed your page)',
      'Co-branded email newsletter slot',
      'Custom landing page on ToolScout',
    ],
  },
]

const stats = [
  { num: '20,000+', label: 'SaaS tools indexed' },
  { num: '500+', label: 'Categories covered' },
  { num: '5M+', label: 'SEO-optimized pages' },
  { num: '$30–$55', label: 'Avg CPC of our audience' },
]

export default function AdvertisePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--color-ink-faint)' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-ink-muted)' }}>Advertise</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
          style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent-dark)' }}>
          <TrendingUp size={12} /> Reach buyers actively comparing tools
        </div>
        <h1 className="font-display text-4xl sm:text-5xl mb-4" style={{ color: 'var(--color-ink)' }}>
          Advertise on ToolScout
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
          Our audience is searching for tools like yours right now — comparing alternatives,
          reading reviews, and ready to buy. Put your product in front of them at the exact moment they decide.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-white p-5 text-center"
            style={{ borderColor: 'var(--color-border)' }}>
            <p className="font-display text-3xl mb-1" style={{ color: 'var(--color-ink)' }}>{s.num}</p>
            <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Why advertise */}
      <section className="mb-14">
        <h2 className="font-display text-2xl mb-6 text-center" style={{ color: 'var(--color-ink)' }}>
          Why ToolScout traffic converts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Users size={20} />,
              title: 'Bottom-of-funnel intent',
              desc: 'Visitors searching "HubSpot alternatives" or "Notion vs Obsidian" are actively evaluating tools — not casually browsing.',
              color: 'var(--color-blue)',
              bg: 'var(--color-blue-light)',
            },
            {
              icon: <Star size={20} />,
              title: 'High-quality B2B audience',
              desc: 'Our readers are founders, product managers, and IT decision-makers — the exact buyers SaaS companies target.',
              color: 'var(--color-green)',
              bg: 'var(--color-green-light)',
            },
            {
              icon: <Zap size={20} />,
              title: 'Organic traffic, not ads',
              desc: 'All our traffic comes from Google search — people actively looking for solutions, not users being interrupted by ads.',
              color: 'var(--color-accent)',
              bg: 'var(--color-accent-light)',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border bg-white p-6"
              style={{ borderColor: 'var(--color-border)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              <p className="font-semibold text-sm mb-2" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Placement types */}
      <section className="mb-14">
        <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--color-ink)' }}>
          Placement options
        </h2>
        <div className="space-y-3">
          {[
            {
              placement: 'Alternative page sponsorship',
              desc: 'Appear as a sponsored result on competitor alternative pages. e.g., "Sponsored: Try [Your Tool] — a HubSpot alternative"',
              intent: 'Very High',
              example: '/alternatives/to/hubspot',
            },
            {
              placement: 'Category page featured slot',
              desc: 'Pin your tool to the top 3 of a category listing page with a "Featured" badge.',
              intent: 'High',
              example: '/best/crm',
            },
            {
              placement: 'Comparison page co-branding',
              desc: 'When your tool is compared, add custom messaging, a promo offer, or a demo CTA.',
              intent: 'Very High',
              example: '/compare/your-tool-vs-competitor',
            },
            {
              placement: 'Homepage spotlight',
              desc: 'Feature your tool in the "Featured tools" section on the ToolScout homepage.',
              intent: 'Medium',
              example: '/',
            },
          ].map((p) => (
            <div key={p.placement} className="rounded-xl border bg-white p-4 flex items-start justify-between gap-4"
              style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{p.placement}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{p.desc}</p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--color-ink-faint)' }}>{p.example}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    background: p.intent === 'Very High' ? 'var(--color-green-light)' : 'var(--color-accent-light)',
                    color: p.intent === 'Very High' ? 'var(--color-green)' : 'var(--color-accent-dark)',
                  }}>
                  {p.intent} intent
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing plans */}
      <section className="mb-14">
        <h2 className="font-display text-2xl mb-2 text-center" style={{ color: 'var(--color-ink)' }}>
          Advertising plans
        </h2>
        <p className="text-sm text-center mb-8" style={{ color: 'var(--color-ink-faint)' }}>
          All plans include a verified vendor profile and performance tracking.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div key={plan.name}
              className="rounded-2xl border p-6 flex flex-col"
              style={{
                borderColor: plan.highlight ? plan.color : 'var(--color-border)',
                borderWidth: plan.highlight ? 2 : 1,
                background: 'white',
              }}>
              {plan.highlight && (
                <div className="text-xs font-semibold px-3 py-1 rounded-full self-start mb-4"
                  style={{ background: plan.bg, color: plan.color }}>
                  Most popular
                </div>
              )}
              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{plan.name}</p>
              <p className="text-xs mb-3" style={{ color: 'var(--color-ink-faint)' }}>{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="font-display text-3xl" style={{ color: 'var(--color-ink)' }}>{plan.price}</span>
                <span className="text-sm" style={{ color: 'var(--color-ink-faint)' }}>{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                    <CheckCircle2 size={13} style={{ color: plan.color, flexShrink: 0, marginTop: 1 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="mailto:ads@toolscout.app"
                className="w-full py-2.5 rounded-xl text-sm font-medium text-center flex items-center justify-center gap-1"
                style={{
                  background: plan.highlight ? plan.color : 'var(--color-paper-2)',
                  color: plan.highlight ? 'white' : 'var(--color-ink)',
                }}>
                Get started <ArrowRight size={13} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <div className="rounded-2xl border p-8 text-center"
        style={{ background: 'var(--color-ink)', borderColor: 'var(--color-ink)' }}>
        <h2 className="font-display text-2xl mb-3" style={{ color: 'white' }}>
          Ready to reach SaaS buyers?
        </h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Email us with your tool name, target category, and monthly budget and we'll build a custom plan.
        </p>
        <a href="mailto:ads@toolscout.app"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
          style={{ background: 'var(--color-accent)', color: 'white' }}>
          Contact us → ads@toolscout.app
        </a>
      </div>
    </div>
  )
}

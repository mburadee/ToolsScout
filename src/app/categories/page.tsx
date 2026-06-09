import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getAllCategories } from '@/lib/db'

export const metadata: Metadata = {
  title: 'All SaaS Categories — Browse 500+ Software Categories',
  description: 'Browse every SaaS software category. Find the best tools for CRM, project management, email marketing, analytics, AI, and more.',
  alternates: { canonical: '/categories' },
}

export const revalidate = 86400

export default async function CategoriesPage() {
  const categories = await getAllCategories().catch(() => defaultCategories)
  const displayCats = categories.length > 0 ? categories : defaultCategories

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-ink-faint)' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-ink-muted)' }}>Categories</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-display text-4xl mb-3" style={{ color: 'var(--color-ink)' }}>
          All SaaS categories
        </h1>
        <p className="text-base" style={{ color: 'var(--color-ink-muted)' }}>
          Browse {displayCats.length}+ software categories. Each category has AI-ranked tools, pricing comparisons, and alternative finders.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayCats.map((cat) => (
          <Link
            key={cat.slug}
            href={`/best/${cat.slug}`}
            className="tool-card rounded-xl border p-4 flex items-center gap-3 bg-white"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <span className="text-2xl">{cat.icon || '📦'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-ink)' }}>
                {cat.name}
              </p>
              {cat.tool_count > 0 && (
                <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
                  {cat.tool_count} tools
                </p>
              )}
              {cat.description && (
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-ink-faint)' }}>
                  {cat.description}
                </p>
              )}
            </div>
            <ArrowRight size={13} style={{ color: 'var(--color-ink-faint)', flexShrink: 0 }} />
          </Link>
        ))}
      </div>

      {/* Popular sub-queries */}
      <section className="mt-14">
        <h2 className="font-display text-2xl mb-5" style={{ color: 'var(--color-ink)' }}>
          Popular searches
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="px-3 py-1.5 rounded-full border text-sm transition-colors hover:border-stone-400"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)', background: 'white' }}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

const popularSearches = [
  { href: '/best/crm?qualifier=free', label: 'Free CRM tools' },
  { href: '/best/project-management?qualifier=free', label: 'Free project management' },
  { href: '/best/email-marketing?qualifier=free', label: 'Free email marketing' },
  { href: '/best/ai-tools', label: 'Best AI tools 2026' },
  { href: '/best/automation?qualifier=open-source', label: 'Open source automation' },
  { href: '/best/developer-tools', label: 'Developer tools' },
  { href: '/best/analytics', label: 'Analytics platforms' },
  { href: '/best/design', label: 'Design tools' },
  { href: '/best/hr-tools', label: 'HR software' },
  { href: '/best/accounting', label: 'Accounting software' },
  { href: '/best/customer-support', label: 'Customer support tools' },
  { href: '/best/ecommerce', label: 'E-commerce platforms' },
  { href: '/alternatives/to/notion', label: 'Notion alternatives' },
  { href: '/alternatives/to/hubspot', label: 'HubSpot alternatives' },
  { href: '/alternatives/to/salesforce', label: 'Salesforce alternatives' },
  { href: '/compare/notion-vs-obsidian', label: 'Notion vs Obsidian' },
  { href: '/compare/zapier-vs-make', label: 'Zapier vs Make' },
]

const defaultCategories = [
  { slug: 'crm', name: 'CRM', description: 'Customer relationship management', icon: '🤝', tool_count: 0 },
  { slug: 'project-management', name: 'Project Management', description: 'Plan, track and ship projects', icon: '📋', tool_count: 0 },
  { slug: 'email-marketing', name: 'Email Marketing', description: 'Send and automate email campaigns', icon: '📧', tool_count: 0 },
  { slug: 'analytics', name: 'Analytics', description: 'Track and analyze data', icon: '📊', tool_count: 0 },
  { slug: 'automation', name: 'Automation', description: 'No-code workflow automation', icon: '⚡', tool_count: 0 },
  { slug: 'design', name: 'Design', description: 'UI/UX and graphic design', icon: '🎨', tool_count: 0 },
  { slug: 'developer-tools', name: 'Developer Tools', description: 'APIs, IDEs and dev platforms', icon: '💻', tool_count: 0 },
  { slug: 'ai-tools', name: 'AI Tools', description: 'AI and machine learning platforms', icon: '🤖', tool_count: 0 },
  { slug: 'communication', name: 'Communication', description: 'Team chat and messaging', icon: '💬', tool_count: 0 },
  { slug: 'security', name: 'Security', description: 'Cybersecurity tools', icon: '🔒', tool_count: 0 },
  { slug: 'accounting', name: 'Accounting', description: 'Bookkeeping and finance', icon: '💰', tool_count: 0 },
  { slug: 'sales', name: 'Sales', description: 'Sales enablement tools', icon: '📈', tool_count: 0 },
  { slug: 'hr-tools', name: 'HR & People', description: 'Hiring and HR management', icon: '👥', tool_count: 0 },
  { slug: 'customer-support', name: 'Customer Support', description: 'Help desk and ticketing', icon: '🎧', tool_count: 0 },
  { slug: 'ecommerce', name: 'E-commerce', description: 'Online store platforms', icon: '🛒', tool_count: 0 },
  { slug: 'productivity', name: 'Productivity', description: 'Notes, wikis and knowledge bases', icon: '🧠', tool_count: 0 },
  { slug: 'video-conferencing', name: 'Video Conferencing', description: 'Virtual meetings and webinars', icon: '🎥', tool_count: 0 },
  { slug: 'marketing', name: 'Marketing', description: 'Digital marketing platforms', icon: '📣', tool_count: 0 },
  { slug: 'data', name: 'Data & BI', description: 'Business intelligence tools', icon: '🗃️', tool_count: 0 },
  { slug: 'seo-tools', name: 'SEO & Content', description: 'Search optimization tools', icon: '🔍', tool_count: 0 },
]

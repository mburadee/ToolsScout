import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getToolsByCategory, getCategoryBySlug, getAllCategories } from '@/lib/db'
import { ToolCard } from '@/components/tools/ToolCard'

export const revalidate = 43200

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ qualifier?: string; page?: string }>
}

export async function generateStaticParams() {
  const categories = await getAllCategories().catch(() => defaultCategories)
  return categories.map((cat) => ({ category: cat.slug }))
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { category } = await params
  const { qualifier } = await searchParams
  if (!category) return { title: 'Browse Tools' }

  const catName = category.replace(/-/g, ' ')
  const year = new Date().getFullYear()
  const title = qualifier
    ? `Best ${qualifier.charAt(0).toUpperCase() + qualifier.slice(1)} ${catName} Tools ${year}`
    : `Best ${catName} Tools & Software ${year} — Ranked & Reviewed`
  const description = `Compare the best ${qualifier ? qualifier + ' ' : ''}${catName} tools. AI-powered rankings with pricing, features, and honest pros & cons.`
  return { title, description, alternates: { canonical: `/best/${category}` } }
}

const qualifierFilters = [
  { key: undefined, label: 'All tools' },
  { key: 'free', label: '🆓 Free' },
  { key: 'open-source', label: '⊕ Open source' },
  { key: 'affordable', label: '$ Affordable' },
]

export default async function BestCategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { qualifier, page: pageParam } = await searchParams

  if (!category) return <div>Category not found</div>

  const category_obj = await getCategoryBySlug(category).catch(() => null)
  const catName = category_obj?.name || category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  const page = parseInt(pageParam || '1', 10)
  const limit = 24
  const offset = (page - 1) * limit

  const { tools, total } = await getToolsByCategory(category, { limit, offset, qualifier }).catch(() => ({
    tools: [],
    total: 0,
  }))

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-ink-faint)' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:underline">Categories</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-ink-muted)' }}>{catName}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          {category_obj?.icon && <span className="text-2xl">{category_obj.icon}</span>}
          <h1 className="font-display text-3xl sm:text-4xl" style={{ color: 'var(--color-ink)' }}>
            Best {catName} Tools {new Date().getFullYear()}
          </h1>
        </div>
        {category_obj?.description && (
          <p className="text-base mt-2 max-w-2xl" style={{ color: 'var(--color-ink-muted)' }}>
            {category_obj.description}
          </p>
        )}
        <p className="text-sm mt-2" style={{ color: 'var(--color-ink-faint)' }}>
          {total > 0 ? `${total.toLocaleString()} tools` : 'Tools'} ranked by rating and popularity
        </p>
      </div>

      {/* Qualifier filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {qualifierFilters.map((q) => {
          const href = q.key ? `/best/${category}?qualifier=${q.key}` : `/best/${category}`
          const isActive = qualifier === q.key
          return (
            <Link key={q.label} href={href}
              className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
              style={{
                borderColor: isActive ? 'var(--color-ink)' : 'var(--color-border)',
                background: isActive ? 'var(--color-ink)' : 'white',
                color: isActive ? 'white' : 'var(--color-ink-muted)',
              }}>
              {q.label}
            </Link>
          )
        })}
      </div>

      {/* Tools grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20" style={{ color: 'var(--color-ink-faint)' }}>
          <p className="text-lg mb-2">No tools indexed yet for this category.</p>
          <p className="text-sm">Run the data pipeline to populate: <code className="font-mono text-xs">npm run pipeline</code></p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={`/best/${category}?page=${page - 1}${qualifier ? `&qualifier=${qualifier}` : ''}`}
              className="px-4 py-2 rounded-xl border text-sm"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
              ← Previous
            </Link>
          )}
          <span className="text-sm px-4" style={{ color: 'var(--color-ink-faint)' }}>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/best/${category}?page=${page + 1}${qualifier ? `&qualifier=${qualifier}` : ''}`}
              className="px-4 py-2 rounded-xl border text-sm"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
              Next →
            </Link>
          )}
        </div>
      )}

      {/* Related categories */}
      <section className="mt-16 pt-10 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="font-display text-xl mb-4" style={{ color: 'var(--color-ink)' }}>Related categories</h2>
        <div className="flex flex-wrap gap-2">
          {['crm', 'project-management', 'email-marketing', 'automation', 'analytics', 'ai-tools', 'design', 'developer-tools']
            .filter((s) => s !== category)
            .map((slug) => (
              <Link key={slug} href={`/best/${slug}`}
                className="tool-card rounded-xl border p-3 text-sm flex items-center gap-1 hover:border-stone-300 transition-colors bg-white"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
                {slug.replace(/-/g, ' ')} <ArrowRight size={11} />
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}

const defaultCategories = [
  { slug: 'crm', name: 'CRM', icon: '🤝', tool_count: 0, description: null, id: '1', parent_id: null },
  { slug: 'project-management', name: 'Project Management', icon: '📋', tool_count: 0, description: null, id: '2', parent_id: null },
  { slug: 'email-marketing', name: 'Email Marketing', icon: '📧', tool_count: 0, description: null, id: '3', parent_id: null },
  { slug: 'analytics', name: 'Analytics', icon: '📊', tool_count: 0, description: null, id: '4', parent_id: null },
  { slug: 'automation', name: 'Automation', icon: '⚡', tool_count: 0, description: null, id: '5', parent_id: null },
  { slug: 'design', name: 'Design', icon: '🎨', tool_count: 0, description: null, id: '6', parent_id: null },
  { slug: 'developer-tools', name: 'Developer Tools', icon: '💻', tool_count: 0, description: null, id: '7', parent_id: null },
  { slug: 'ai-tools', name: 'AI Tools', icon: '🤖', tool_count: 0, description: null, id: '8', parent_id: null },
  { slug: 'communication', name: 'Communication', icon: '💬', tool_count: 0, description: null, id: '9', parent_id: null },
  { slug: 'security', name: 'Security', icon: '🔒', tool_count: 0, description: null, id: '10', parent_id: null },
  { slug: 'accounting', name: 'Accounting', icon: '💰', tool_count: 0, description: null, id: '11', parent_id: null },
  { slug: 'sales', name: 'Sales', icon: '📈', tool_count: 0, description: null, id: '12', parent_id: null },
  { slug: 'hr-tools', name: 'HR & People', icon: '👥', tool_count: 0, description: null, id: '13', parent_id: null },
  { slug: 'customer-support', name: 'Customer Support', icon: '🎧', tool_count: 0, description: null, id: '14', parent_id: null },
  { slug: 'ecommerce', name: 'E-commerce', icon: '🛒', tool_count: 0, description: null, id: '15', parent_id: null },
  { slug: 'productivity', name: 'Productivity', icon: '🧠', tool_count: 0, description: null, id: '16', parent_id: null },
  { slug: 'video-conferencing', name: 'Video Conferencing', icon: '🎥', tool_count: 0, description: null, id: '17', parent_id: null },
  { slug: 'marketing', name: 'Marketing', icon: '📣', tool_count: 0, description: null, id: '18', parent_id: null },
  { slug: 'data', name: 'Data & BI', icon: '🗃️', tool_count: 0, description: null, id: '19', parent_id: null },
  { slug: 'seo-tools', name: 'SEO & Content', icon: '🔍', tool_count: 0, description: null, id: '20', parent_id: null },
]

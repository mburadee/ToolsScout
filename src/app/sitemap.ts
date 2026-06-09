import { MetadataRoute } from 'next'
import { getAllToolSlugs, getAllComparisonSlugs, getAllIntegrationSlugs, getAllCategories } from '@/lib/db'

export const revalidate = 86400 // Regenerate daily

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolscout.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [toolSlugs, comparisonSlugs, integrationSlugs, categories] = await Promise.all([
    getAllToolSlugs().catch(() => [] as string[]),
    getAllComparisonSlugs().catch(() => [] as string[]),
    getAllIntegrationSlugs().catch(() => [] as string[]),
    getAllCategories().catch(() => []),
  ])

  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Tool pages (highest priority)
  const toolPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Comparison pages
  const comparisonPages: MetadataRoute.Sitemap = comparisonSlugs.map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Alternatives pages
  const alternativePages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${BASE_URL}/alternatives/to/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Integration pages
  const integrationPages: MetadataRoute.Sitemap = integrationSlugs.map((slug) => ({
    url: `${BASE_URL}/integrations/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((cat) => [
    {
      url: `${BASE_URL}/best/${cat.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/best/${cat.slug}?qualifier=free`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
  ])

  return [
    ...staticPages,
    ...categoryPages,
    ...toolPages,
    ...alternativePages,
    ...comparisonPages,
    ...integrationPages,
  ]
}

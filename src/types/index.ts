// ─── Core Tool type ───────────────────────────────────────────────────────────
export interface Tool {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  website_url: string | null
  logo_url: string | null
  screenshot_url: string | null
  categories: string[]
  tags: string[]
  pricing_model: 'free' | 'freemium' | 'paid' | 'open-source' | 'contact'
  min_price: number | null
  max_price: number | null
  has_free_plan: boolean
  g2_rating: number | null
  g2_reviews: number | null
  ph_votes: number | null
  ph_product_id: string | null
  github_stars: number | null
  github_url: string | null
  founded_year: number | null
  hq_country: string | null
  company_size: string | null
  // Claude-generated fields
  ai_summary: string | null
  ai_pros: string[]
  ai_cons: string[]
  ai_best_for: string[]
  ai_not_for: string | null
  ai_ideal_user: string | null
  // Monetization
  affiliate_url: string | null
  affiliate_commission: string | null
  // Internal flags
  is_featured: boolean
  is_verified: boolean
  view_count: number
  // Timestamps
  created_at: string
  updated_at: string
}

// ─── Comparison type ──────────────────────────────────────────────────────────
export interface Comparison {
  id: string
  slug: string
  tool_a: Tool
  tool_b: Tool
  ai_verdict: string | null
  winner_use_cases: {
    tool_a: string[]
    tool_b: string[]
  } | null
  switching_difficulty: number | null  // 1-5
  search_volume: number | null
  feature_comparison: FeatureRow[] | null
  updated_at: string
}

export interface FeatureRow {
  feature: string
  tool_a: boolean | string
  tool_b: boolean | string
}

// ─── Integration type ─────────────────────────────────────────────────────────
export interface Integration {
  id: string
  slug: string
  tool_a: Tool
  tool_b: Tool
  is_native: boolean
  via_zapier: boolean
  via_make: boolean
  via_n8n: boolean
  setup_guide: string | null
  data_synced: string[]
  use_cases: string[]
  updated_at: string
}

// ─── Category type ────────────────────────────────────────────────────────────
export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  tool_count: number
  parent_id: string | null
}

// ─── Alternative relationship ─────────────────────────────────────────────────
export interface Alternative {
  tool: Tool
  similarity_score: number
  qualifier: string | null
}

// ─── Page props helpers ───────────────────────────────────────────────────────
export interface ToolPageProps {
  params: { slug: string }
}

export interface ComparePageProps {
  params: { slug: string }  // "notion-vs-obsidian"
}

export interface IntegrationPageProps {
  params: { slug: string }  // "notion-and-slack"
}

export interface AlternativePageProps {
  params: { slug: string }  // "notion"
}

export interface BestCategoryPageProps {
  params: { category: string }
  searchParams: { qualifier?: string; price?: string; page?: string }
}

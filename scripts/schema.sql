-- ─────────────────────────────────────────────────────────────────────────────
-- TOOLSCOUT DATABASE SCHEMA
-- Run this in your Supabase SQL editor to set up the complete schema
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- fuzzy search

-- ─── Categories ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  tool_count  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tools (master catalog) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tools (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  tagline             TEXT,
  description         TEXT,
  website_url         TEXT,
  logo_url            TEXT,
  screenshot_url      TEXT,
  categories          TEXT[] DEFAULT '{}',
  tags                TEXT[] DEFAULT '{}',
  pricing_model       TEXT CHECK (pricing_model IN ('free','freemium','paid','open-source','contact')),
  min_price           NUMERIC(10,2),
  max_price           NUMERIC(10,2),
  has_free_plan       BOOLEAN DEFAULT FALSE,
  -- External ratings
  g2_rating           NUMERIC(3,2),
  g2_reviews          INTEGER DEFAULT 0,
  ph_votes            INTEGER DEFAULT 0,
  ph_product_id       TEXT,
  github_stars        INTEGER,
  github_url          TEXT,
  -- Company info
  founded_year        SMALLINT,
  hq_country          TEXT,
  company_size        TEXT,
  -- Claude AI generated
  ai_summary          TEXT,
  ai_pros             TEXT[] DEFAULT '{}',
  ai_cons             TEXT[] DEFAULT '{}',
  ai_best_for         TEXT[] DEFAULT '{}',
  ai_not_for          TEXT,
  ai_ideal_user       TEXT,
  -- Monetization
  affiliate_url       TEXT,
  affiliate_commission TEXT,
  -- Internal
  is_featured         BOOLEAN DEFAULT FALSE,
  is_verified         BOOLEAN DEFAULT FALSE,
  view_count          INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast slug lookup and full-text search
CREATE INDEX IF NOT EXISTS tools_slug_idx ON tools(slug);
CREATE INDEX IF NOT EXISTS tools_categories_idx ON tools USING GIN(categories);
CREATE INDEX IF NOT EXISTS tools_name_trgm_idx ON tools USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS tools_featured_idx ON tools(is_featured, g2_rating DESC);

-- ─── Tool ↔ Category junction ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tool_categories (
  tool_id     UUID REFERENCES tools(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, category_id)
);

-- ─── Comparisons (A vs B) ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comparisons (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                  TEXT UNIQUE NOT NULL,   -- "notion-vs-obsidian"
  tool_a_id             UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  tool_b_id             UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  ai_verdict            TEXT,
  winner_use_cases      JSONB,  -- {tool_a: [...], tool_b: [...]}
  feature_comparison    JSONB,  -- [{feature, tool_a, tool_b}]
  switching_difficulty  SMALLINT CHECK (switching_difficulty BETWEEN 1 AND 5),
  search_volume         INTEGER DEFAULT 0,
  view_count            INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tool_a_id, tool_b_id)
);

CREATE INDEX IF NOT EXISTS comparisons_slug_idx ON comparisons(slug);
CREATE INDEX IF NOT EXISTS comparisons_volume_idx ON comparisons(search_volume DESC);

-- ─── Integrations (A ↔ B connections) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS integrations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,   -- "notion-and-slack"
  tool_a_id   UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  tool_b_id   UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  is_native   BOOLEAN DEFAULT FALSE,
  via_zapier  BOOLEAN DEFAULT FALSE,
  via_make    BOOLEAN DEFAULT FALSE,
  via_n8n     BOOLEAN DEFAULT FALSE,
  setup_guide TEXT,
  data_synced TEXT[] DEFAULT '{}',
  use_cases   TEXT[] DEFAULT '{}',
  view_count  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tool_a_id, tool_b_id)
);

CREATE INDEX IF NOT EXISTS integrations_slug_idx ON integrations(slug);

-- ─── Alternatives (pre-computed) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alternatives (
  tool_id          UUID REFERENCES tools(id) ON DELETE CASCADE,
  alternative_id   UUID REFERENCES tools(id) ON DELETE CASCADE,
  similarity_score NUMERIC(3,2),
  qualifier        TEXT,  -- "free", "open-source", "enterprise", "affordable"
  PRIMARY KEY (tool_id, alternative_id)
);

CREATE INDEX IF NOT EXISTS alternatives_tool_idx ON alternatives(tool_id, similarity_score DESC);

-- ─── Seed categories ──────────────────────────────────────────────────────────
INSERT INTO categories (slug, name, description, icon) VALUES
  ('crm', 'CRM', 'Customer relationship management tools', '🤝'),
  ('project-management', 'Project Management', 'Plan, track, and ship projects', '📋'),
  ('email-marketing', 'Email Marketing', 'Send and automate email campaigns', '📧'),
  ('analytics', 'Analytics', 'Track and analyze data', '📊'),
  ('customer-support', 'Customer Support', 'Help desk and ticketing systems', '🎧'),
  ('hr-tools', 'HR & People', 'Hiring, onboarding, and HR management', '👥'),
  ('accounting', 'Accounting & Finance', 'Bookkeeping and financial management', '💰'),
  ('video-conferencing', 'Video Conferencing', 'Virtual meetings and webinars', '🎥'),
  ('automation', 'Automation', 'No-code workflow automation', '⚡'),
  ('design', 'Design', 'UI/UX and graphic design tools', '🎨'),
  ('developer-tools', 'Developer Tools', 'APIs, IDEs, and dev platforms', '💻'),
  ('sales', 'Sales', 'Sales enablement and pipeline tools', '📈'),
  ('marketing', 'Marketing', 'Digital marketing platforms', '📣'),
  ('productivity', 'Productivity', 'Notes, wikis, and knowledge bases', '🧠'),
  ('ecommerce', 'E-commerce', 'Online store and commerce platforms', '🛒'),
  ('security', 'Security', 'Cybersecurity and identity management', '🔒'),
  ('data', 'Data & BI', 'Business intelligence and data tools', '🗃️'),
  ('communication', 'Communication', 'Team chat and messaging', '💬'),
  ('ai-tools', 'AI Tools', 'Artificial intelligence and ML platforms', '🤖'),
  ('seo-tools', 'SEO & Content', 'Search optimization and content tools', '🔍')
ON CONFLICT (slug) DO NOTHING;

-- ─── Updated_at trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tools_updated_at ON tools;
CREATE TRIGGER tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS comparisons_updated_at ON comparisons;
CREATE TRIGGER comparisons_updated_at
  BEFORE UPDATE ON comparisons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS integrations_updated_at ON integrations;
CREATE TRIGGER integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Tool submissions (from /submit form) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS tool_submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT NOT NULL,
  name            TEXT NOT NULL,
  website_url     TEXT,
  tagline         TEXT,
  categories      TEXT[] DEFAULT '{}',
  pricing_model   TEXT,
  has_free_plan   BOOLEAN DEFAULT FALSE,
  submitter_email TEXT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  submitted_at    TIMESTAMPTZ DEFAULT NOW()
);

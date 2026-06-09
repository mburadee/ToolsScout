# ToolScout — Setup Guide
## Your keys are already configured. Follow these steps to launch.

---

## STEP 1 — Set up the Supabase database schema

Your Supabase project: https://nsotwinqhgmvbofoedhz.supabase.co

1. Go to: https://supabase.com/dashboard/project/nsotwinqhgmvbofoedhz
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `scripts/schema.sql` from this project
5. Copy the entire contents and paste into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

This creates all tables:
- `tools` — master SaaS tool catalog
- `comparisons` — A vs B comparison data
- `integrations` — tool connection maps
- `alternatives` — pre-computed alternative relationships
- `categories` — category taxonomy (pre-seeded with 20 categories)
- `tool_submissions` — user-submitted tools

---

## STEP 2 — Install dependencies

```bash
cd saas-directory
npm install
```

---

## STEP 3 — Run the data pipeline

This fetches tools from Product Hunt, enriches with GitHub data, and seeds your database.

```bash
npm run pipeline
```

Expected output:
```
🚀 ToolScout Data Pipeline
──────────────────────────────────────────────────
🤖 AI enrichment: ⚠️  Disabled (no ANTHROPIC_API_KEY — using defaults)

📡 STEP 1: Product Hunt authentication
  ✅ PH token obtained

📥 STEP 2: Fetching tools from Product Hunt
  Fetching topic: saas... 50 total
  Fetching topic: productivity... 97 total
  ...
  ✅ 847 unique tools collected

💾 STEP 3: Upserting tools to database
  ✅ 100 saved...
  ✅ 200 saved...
  ...

⚔️  STEP 4: Generating comparison pairs
🔄 STEP 5: Computing alternative relationships
📊 STEP 6: Updating category counts

🎉 Pipeline complete!
```

**Duration:** ~5–10 minutes for ~800 tools

---

## STEP 4 — Start the development server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## STEP 5 — Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

When prompted, add these environment variables in Vercel dashboard
(Settings → Environment Variables):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nsotwinqhgmvbofoedhz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_HKEbVhidSR5lK3Xn_vXKYw_QD6kVEu9` |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_RW19drQStOSI_zzufQLehA_5KWk592J` |
| `PRODUCT_HUNT_API_KEY` | `g-wTu6-QGEcALgg4U5CEzGvH5MV3u4nS-JsIp-LDUQk` |
| `PRODUCT_HUNT_API_SECRET` | `k46GifnIfMJRPD7f3hkYgn_uzUY6PLtAuBeU7mcDdKk` |
| `GITHUB_TOKEN` | `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` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
| `REVALIDATE_SECRET` | `toolscout_revalidate_2026` |

---

## STEP 6 — Enable AI enrichment (when ready)

1. Get Anthropic API key: https://console.anthropic.com → API Keys
2. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
3. Re-run the pipeline: `npm run pipeline`
   - This time it will generate unique AI summaries, pros/cons, and comparison verdicts for every tool
   - Cost: ~$15 for 5,000 tools at $0.003/tool

---

## STEP 7 — Submit sitemap to Google

Once deployed:
1. Go to https://search.google.com/search-console
2. Add your domain
3. Submit: `https://your-domain.com/sitemap.xml`

---

## Supabase security note

After launch, go to Supabase → Settings → API → and:
1. Add your Vercel domain to the **allowed origins** list
2. Consider enabling **Row Level Security (RLS)** on the tools table for public reads

---

## Page URLs when live

| Page type | Example URL |
|-----------|-------------|
| Tool profile | `/tools/notion` |
| Comparison | `/compare/notion-vs-obsidian` |
| Alternatives | `/alternatives/to/notion` |
| Integration | `/integrations/notion-and-slack` |
| Pricing | `/pricing/notion` |
| Category | `/best/crm` |
| Free tools | `/best/crm?qualifier=free` |
| Search | `/search?q=crm` |

---

## Monthly pipeline refresh

Run this monthly to add new tools and update data:
```bash
npm run pipeline
```

Or set up a GitHub Actions cron (see README.md for full config).

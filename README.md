# ToolScout — SaaS Comparison Mega-Directory

Programmatic SEO Next.js app targeting 5M+ pages. Competes with G2, AlternativeTo, and Zapier's integration pages.

## Quick start

1. Create Supabase project → run `scripts/schema.sql` in SQL editor
2. Fill `.env.local` with your API keys
3. `npm install && npm run dev`
4. `npm run pipeline` to seed the database

## Page types (all ISR)

| Route | Pages | Revalidate | Target keywords |
|-------|-------|------------|-----------------|
| `/tools/[slug]` | 20,000 | 24h | [tool] review, pricing |
| `/compare/[slug]` | 500,000 | 7d | [A] vs [B] |
| `/alternatives/to/[slug]` | 20,000 | 24h | [tool] alternatives |
| `/integrations/[slug]` | 2,000,000 | 7d | does [A] integrate with [B] |
| `/pricing/[slug]` | 20,000 | 24h | [tool] pricing |
| `/best/[category]` | 500,000 | 12h | best [category] tools |

## Monetization (at 10k visits/day)
- Display ads: $2,400–$7,500/mo
- Affiliate: $5,000–$15,000/mo
- Sponsored listings: $5,000+/mo
- **Total: ~$20k–$35k/mo**

## Deploy
```bash
vercel --prod
```
Set all `.env.local` vars in Vercel dashboard.

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — ToolScout',
  description: 'ToolScout privacy policy. How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  const sections = [
    {
      title: 'What data we collect',
      content: `ToolScout collects minimal data. When you use the site, we may collect: anonymized page view analytics (no personal identifiers), search queries (anonymized), and email addresses if you voluntarily submit a tool or contact us. We do not require account creation to use ToolScout.`,
    },
    {
      title: 'How we use your data',
      content: `Analytics data helps us understand which tool comparisons and categories are most useful, so we can improve content. Email addresses collected via the tool submission form are used solely to notify you about your submission status and are never sold or shared with third parties.`,
    },
    {
      title: 'Affiliate links',
      content: `Some links on ToolScout are affiliate links. When you click an affiliate link and complete a purchase or sign-up, we may receive a commission. Affiliate partners may set cookies to track conversions. These affiliate relationships do not influence our editorial rankings or content.`,
    },
    {
      title: 'Third-party services',
      content: `ToolScout uses Vercel for hosting (Vercel Privacy Policy applies), Supabase for database services, and Google Analytics for anonymized traffic analysis. These services may process data according to their own privacy policies.`,
    },
    {
      title: 'Cookies',
      content: `ToolScout uses minimal cookies: essential cookies for site functionality and analytics cookies (anonymized). Affiliate partner cookies may be set when you click through to partner tools. You can disable cookies in your browser settings, though this may affect site functionality.`,
    },
    {
      title: 'Data retention',
      content: `Anonymized analytics data is retained for 26 months. Email addresses submitted via the tool submission form are retained until you request deletion. You may request deletion of any personal data by emailing privacy@toolscout.app.`,
    },
    {
      title: 'Your rights',
      content: `Depending on your location, you may have rights to access, correct, or delete personal data we hold about you. To exercise these rights, contact privacy@toolscout.app. We will respond within 30 days.`,
    },
    {
      title: 'Contact',
      content: `For privacy questions or data requests, email privacy@toolscout.app.`,
    },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--color-ink-faint)' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-ink-muted)' }}>Privacy Policy</span>
      </nav>

      <h1 className="font-display text-4xl mb-2" style={{ color: 'var(--color-ink)' }}>Privacy Policy</h1>
      <p className="text-sm mb-10" style={{ color: 'var(--color-ink-faint)' }}>
        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <section key={section.title}>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--color-ink)' }}>
              {i + 1}. {section.title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
              {section.content}
            </p>
          </section>
        ))}
      </div>
    </div>
  )
}

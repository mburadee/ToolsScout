import Link from 'next/link'
import { Zap } from 'lucide-react'

const footerLinks = {
  Categories: [
    { href: '/best/crm', label: 'CRM Tools' },
    { href: '/best/project-management', label: 'Project Management' },
    { href: '/best/email-marketing', label: 'Email Marketing' },
    { href: '/best/automation', label: 'Automation' },
    { href: '/best/analytics', label: 'Analytics' },
    { href: '/best/ai-tools', label: 'AI Tools' },
  ],
  Compare: [
    { href: '/compare/notion-vs-obsidian', label: 'Notion vs Obsidian' },
    { href: '/compare/hubspot-vs-salesforce', label: 'HubSpot vs Salesforce' },
    { href: '/compare/slack-vs-teams', label: 'Slack vs Teams' },
    { href: '/compare/zapier-vs-make', label: 'Zapier vs Make' },
    { href: '/compare/linear-vs-jira', label: 'Linear vs Jira' },
  ],
  Alternatives: [
    { href: '/alternatives/to/notion', label: 'Notion Alternatives' },
    { href: '/alternatives/to/hubspot', label: 'HubSpot Alternatives' },
    { href: '/alternatives/to/salesforce', label: 'Salesforce Alternatives' },
    { href: '/alternatives/to/slack', label: 'Slack Alternatives' },
    { href: '/alternatives/to/zapier', label: 'Zapier Alternatives' },
  ],
  ToolScout: [
    { href: '/about', label: 'About' },
    { href: '/submit', label: 'Submit a Tool' },
    { href: '/advertise', label: 'Advertise' },
    { href: '/sitemap.xml', label: 'Sitemap' },
    { href: '/privacy', label: 'Privacy Policy' },
  ],
}

export function Footer() {
  return (
    <footer
      className="mt-24 border-t"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-2)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        {/* Top row */}
        <div className="flex flex-col md:flex-row gap-12 justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-accent)' }}
              >
                <Zap size={14} color="white" fill="white" />
              </div>
              <span className="font-semibold text-sm">ToolScout</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-faint)' }}>
              The most comprehensive SaaS directory. Compare tools, find alternatives, and discover
              integrations — powered by AI.
            </p>
            <p className="text-xs mt-4" style={{ color: 'var(--color-ink-faint)' }}>
              20,000+ tools indexed · Updated daily
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--color-ink-faint)' }}>
                  {group}
                </p>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm transition-colors hover:underline"
                        style={{ color: 'var(--color-ink-muted)' }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
            © {new Date().getFullYear()} ToolScout. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
            Some links are affiliate links. We may earn a commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  )
}

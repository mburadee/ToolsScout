import Link from 'next/link'
import Image from 'next/image'
import { Star, ExternalLink, ArrowRight } from 'lucide-react'
import type { Tool } from '@/types'

interface ToolCardProps {
  tool: Tool
  showCompare?: boolean
  compact?: boolean
}

function PricingBadge({ tool }: { tool: Tool }) {
  const label =
    tool.pricing_model === 'free'
      ? 'Free'
      : tool.pricing_model === 'open-source'
      ? 'Open Source'
      : tool.has_free_plan
      ? 'Freemium'
      : tool.min_price
      ? `From $${tool.min_price}/mo`
      : 'Paid'

  const cls =
    tool.pricing_model === 'free' || tool.has_free_plan
      ? 'badge-free'
      : tool.pricing_model === 'open-source'
      ? 'badge-open'
      : 'badge-paid'

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  )
}

export function ToolCard({ tool, compact = false }: ToolCardProps) {
  return (
    <div
      className="tool-card rounded-xl border bg-white flex flex-col"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div
            className="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 overflow-hidden"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-2)' }}
          >
            {tool.logo_url ? (
              <Image
                src={tool.logo_url}
                alt={`${tool.name} logo`}
                width={40}
                height={40}
                className="object-contain"
              />
            ) : (
              <span className="text-base font-semibold" style={{ color: 'var(--color-ink-faint)' }}>
                {tool.name[0]}
              </span>
            )}
          </div>

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <Link
              href={`/tools/${tool.slug}`}
              className="font-semibold text-sm leading-tight hover:underline block truncate"
              style={{ color: 'var(--color-ink)' }}
            >
              {tool.name}
            </Link>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <PricingBadge tool={tool} />
              {tool.g2_rating && (
                <span className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--color-ink-faint)' }}>
                  <Star size={11} fill="#f59e0b" color="#f59e0b" />
                  {tool.g2_rating.toFixed(1)}
                  {tool.g2_reviews && (
                    <span>({tool.g2_reviews.toLocaleString()})</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p
          className="text-sm leading-relaxed line-clamp-2"
          style={{ color: 'var(--color-ink-muted)' }}
        >
          {tool.ai_summary || tool.tagline}
        </p>

        {/* Best for tags */}
        {!compact && tool.ai_best_for?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tool.ai_best_for.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md"
                style={{ background: 'var(--color-paper-2)', color: 'var(--color-ink-muted)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div
        className="px-5 py-3 border-t flex items-center justify-between gap-2"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <Link
          href={`/tools/${tool.slug}`}
          className="text-xs font-medium flex items-center gap-1 hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          View details <ArrowRight size={11} />
        </Link>
        {tool.website_url && (
          <a
            href={tool.affiliate_url || tool.website_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-xs flex items-center gap-1"
            style={{ color: 'var(--color-ink-faint)' }}
          >
            Visit site <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  )
}

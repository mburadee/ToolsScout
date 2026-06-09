import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="font-mono text-5xl mb-4" style={{ color: 'var(--color-paper-3)' }}>404</p>
      <h1 className="font-display text-3xl mb-3" style={{ color: 'var(--color-ink)' }}>Page not found</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-ink-muted)' }}>
        This tool, comparison, or page doesn't exist yet — or may have been removed.
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/" className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'var(--color-ink)', color: 'white' }}>
          Go home
        </Link>
        <Link href="/search" className="px-4 py-2 rounded-xl text-sm font-medium border"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
          Search tools
        </Link>
      </div>
    </div>
  )
}

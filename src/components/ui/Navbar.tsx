'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Search, Menu, X, Zap } from 'lucide-react'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/best/crm', label: 'CRM' },
    { href: '/best/project-management', label: 'Project Mgmt' },
    { href: '/best/automation', label: 'Automation' },
    { href: '/best/analytics', label: 'Analytics' },
    { href: '/best/ai-tools', label: 'AI Tools' },
  ]

  return (
    <header style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-paper)' }}
      className="sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--color-accent)' }}>
            <Zap size={14} color="white" fill="white" />
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--color-ink)' }}>
            ToolScout
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className="px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-stone-100"
              style={{ color: 'var(--color-ink-muted)' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link href="/search"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors hover:bg-stone-50"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
            <Search size={14} />
            <span className="hidden sm:inline">Search tools…</span>
          </Link>
          <Link href="/submit"
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hidden sm:block"
            style={{ background: 'var(--color-ink)', color: 'white' }}>
            + Submit tool
          </Link>
          <button className="md:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper)' }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className="px-3 py-2 rounded-lg text-sm"
                style={{ color: 'var(--color-ink-muted)' }}
                onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

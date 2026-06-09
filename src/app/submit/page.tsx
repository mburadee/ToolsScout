'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'

export default function SubmitPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({
    name: '', website: '', tagline: '', category: '', pricing: 'freemium',
    hasFree: false, email: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/submit-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <CheckCircle2 size={40} className="mx-auto mb-4" style={{ color: 'var(--color-green)' }} />
        <h1 className="font-display text-3xl mb-3" style={{ color: 'var(--color-ink)' }}>Tool submitted!</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-ink-muted)' }}>
          We'll review and add your tool within 2–3 business days.
        </p>
        <Link href="/" className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'var(--color-ink)', color: 'white' }}>
          Back to home
        </Link>
      </div>
    )
  }

  const inputStyle = {
    background: 'white',
    border: '1px solid var(--color-border)',
    color: 'var(--color-ink)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
  }

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 500 as const,
    color: 'var(--color-ink-muted)',
    marginBottom: '5px',
    display: 'block',
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-ink-faint)' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-ink-muted)' }}>Submit a tool</span>
      </nav>

      <h1 className="font-display text-3xl mb-2" style={{ color: 'var(--color-ink)' }}>Submit a tool</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-ink-muted)' }}>
        Add your SaaS product to the ToolScout directory. Free listings — we'll enrich with AI and publish within 2–3 days.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label style={labelStyle}>Tool name *</label>
          <input required style={inputStyle} value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Notion" />
        </div>

        <div>
          <label style={labelStyle}>Website URL *</label>
          <input required type="url" style={inputStyle} value={form.website}
            onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
            placeholder="https://your-tool.com" />
        </div>

        <div>
          <label style={labelStyle}>Tagline *</label>
          <input required style={inputStyle} value={form.tagline}
            onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
            placeholder="One sentence describing what your tool does" maxLength={120} />
        </div>

        <div>
          <label style={labelStyle}>Primary category *</label>
          <select required style={{ ...inputStyle, appearance: 'none' as const }}
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            <option value="">Select category…</option>
            {['CRM','Project Management','Email Marketing','Analytics','Automation','Design',
              'Developer Tools','AI Tools','Communication','Security','Accounting','Sales',
              'HR & People','Customer Support','E-commerce','Productivity','Marketing'].map(c => (
              <option key={c} value={c.toLowerCase().replace(/ /g, '-')}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Pricing model *</label>
          <select required style={{ ...inputStyle, appearance: 'none' as const }}
            value={form.pricing}
            onChange={e => setForm(f => ({ ...f, pricing: e.target.value }))}>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid only</option>
            <option value="open-source">Open source</option>
            <option value="contact">Contact for pricing</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="hasFree" checked={form.hasFree}
            onChange={e => setForm(f => ({ ...f, hasFree: e.target.checked }))}
            style={{ width: 16, height: 16, accentColor: 'var(--color-accent)' }} />
          <label htmlFor="hasFree" style={{ ...labelStyle, margin: 0 }}>
            Has a free plan or free trial
          </label>
        </div>

        <div>
          <label style={labelStyle}>Your email (for updates)</label>
          <input type="email" style={inputStyle} value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@company.com" />
        </div>

        {status === 'error' && (
          <p className="text-sm" style={{ color: '#dc2626' }}>
            Something went wrong. Please try again or email us directly.
          </p>
        )}

        <button type="submit" disabled={status === 'loading'}
          className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
          style={{ background: 'var(--color-ink)', color: 'white', opacity: status === 'loading' ? 0.7 : 1 }}>
          {status === 'loading' ? <><Loader2 size={15} className="animate-spin" /> Submitting…</> : 'Submit tool →'}
        </button>
      </form>

      <div className="mt-10 p-5 rounded-xl" style={{ background: 'var(--color-paper-2)' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-ink-muted)' }}>
          Want to be featured?
        </p>
        <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
          Premium listings include featured placement on category pages, sponsored comparison slots,
          and a verified badge. <Link href="/advertise" className="underline">Learn more →</Link>
        </p>
      </div>
    </div>
  )
}

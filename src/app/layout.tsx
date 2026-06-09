import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: { default: 'ToolScout — Find, Compare & Discover SaaS Tools', template: '%s | ToolScout' },
  description: 'Compare 20,000+ SaaS tools. Find alternatives, see integrations, and make confident software decisions with AI-powered insights.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://toolscout.app'),
  openGraph: { siteName: 'ToolScout', type: 'website' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col" style={{ background: 'var(--color-paper)' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ph-files.imgix.net' },
      { protocol: 'https', hostname: 'ph-avatars.imgix.net' },
      { protocol: 'https', hostname: 'logo.clearbit.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  async redirects() {
    return [
      { source: '/tool/:slug', destination: '/tools/:slug', permanent: true },
      { source: '/comparison/:slug', destination: '/compare/:slug', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/tools/:slug',
        headers: [{ key: 'Cache-Control', value: 's-maxage=86400, stale-while-revalidate=3600' }],
      },
    ]
  },
  compress: true,
  experimental: { optimizePackageImports: ['lucide-react'] },
}

export default nextConfig

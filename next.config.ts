import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin(
  './src/i18n/config.ts'
)

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: [],
  },
  // Configure strict mode for better debugging
  reactStrictMode: true,
  // Metadata sempre no <head> (evita streaming de metadata no body, que derruba o SEO no Lighthouse)
  htmlLimitedBots: /.*/,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy-Report-Only',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://cdn.counter.dev; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; frame-ancestors 'none'",
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)

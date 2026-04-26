import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Avoid server-side optimizer timeouts with external CDN images.
    // Browser loads remote images directly.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.olgadsn.com',
        pathname: '/cdn/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig

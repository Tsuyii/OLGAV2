import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.olgadsn.com',
        pathname: '/cdn/**',
      },
    ],
  },
}

export default nextConfig

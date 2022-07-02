/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    images: {
      unoptimized: true,
    },
  },
}

if (process.env.NODE_ENV === 'production') {
  nextConfig.basePath = '/spongy.exchange'
}

module.exports = nextConfig

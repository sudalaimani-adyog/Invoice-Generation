/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['@napi-rs/canvas']
  },
  api: {
    responseLimit: '10mb',
  }
}

module.exports = nextConfig
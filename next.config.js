/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['@napi-rs/canvas']
  },
  // Enable src directory
  webpack: (config) => {
    return config;
  }
}

module.exports = nextConfig
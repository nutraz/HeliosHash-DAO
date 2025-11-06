/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@helioshash/shared'],
  experimental: {
    // Disable static optimization for error pages
    optimizeCss: false,
  },
  // Ensure error pages are client-rendered
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig

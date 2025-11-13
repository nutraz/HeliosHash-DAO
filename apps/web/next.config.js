/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@helioshash/shared"],
  experimental: {
    // Disable static optimization for error pages
    optimizeCss: false,
    esmExternals: 'loose'
  },
  // Point to src directory for App Router
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  // Ensure error pages are client-rendered
  generateBuildId: async () => {
    return "build-" + Date.now();
  },
  // Disable static generation for authentication-required app
  // output: process.env.NEXT_PUBLIC_DISABLE_STATIC_EXPORT === 'true' ? undefined : 'export', // ❌ Removed - forces static generation
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;

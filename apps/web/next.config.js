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
    // Allow dicebear avatar URLs used across the app
    domains: ['api.dicebear.com'],
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
};
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
};

export default {
  ...nextConfig,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
export default nextConfig;

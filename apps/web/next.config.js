/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ["@helioshash/shared"],
  experimental: {
    optimizeCss: false,
    esmExternals: 'loose'
  },
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  },
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  generateBuildId: async () => {
    return "build-" + Date.now();
  },
  trailingSlash: true,
  images: {
    domains: ['api.dicebear.com', 'localhost', 'your-app.vercel.app'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    };
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true
    };
    return config;
  }
};

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
];

export default {
  ...nextConfig,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  }
};
=======
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;
>>>>>>> 954253d5 (docs: refresh and clean up all documentation (README, repo summary, critical fixes, copilot context))

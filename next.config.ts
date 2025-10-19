import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },

  // Force all routes to be dynamic to prevent useContext issues during static generation
  experimental: {
    cacheComponents: false,
<<<<<<< HEAD
=======
    optimizeCss: true,
>>>>>>> audit-clean
  },

  // Disable static optimization to prevent prerendering issues
  output: 'standalone',

<<<<<<< HEAD
=======
  // Fix workspace root inference for multiple lockfiles
  outputFileTracingRoot: require('path').join(process.cwd()),

>>>>>>> audit-clean
  // Mobile development configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Configure allowed origins for mobile development
  allowedDevOrigins: [
    '192.168.29.210:3001',
    '192.168.29.210:3003',
    '192.168.29.210:3005',
    '127.0.0.1:3001',
    '127.0.0.1:3003',
    '127.0.0.1:3005',
    'localhost:3001',
    'localhost:3003',
    'localhost:3005',
  ],

  // Allow mobile device connections in development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // Configure image optimization
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Optimize for mobile development
  compiler: {
    removeConsole: false, // Keep console.log in development
  },

  // Disable some warnings in development
  webpack: (config: any, { dev }: { dev: boolean }) => {
    if (dev) {
      // Reduce verbose logging
      config.stats = 'errors-warnings';
<<<<<<< HEAD
=======
      config.resolve.fallback = { ...config.resolve.fallback, 'react-dom/client': false };
>>>>>>> audit-clean
    }
    return config;
  },
};

export default nextConfig;

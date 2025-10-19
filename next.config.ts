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
    optimizeCss: true,
  },

  // Disable static optimization to prevent prerendering issues
  output: 'standalone',

  // Fix workspace root inference for multiple lockfiles
  outputFileTracingRoot: require('path').join(process.cwd()),

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
  allowedDevOrigins: (() => {
    const LAN = process.env.LOCAL_LAN_IP || '';
    const ports = ['3001', '3003', '3005'];
    const locals = ports.flatMap((p) => [
      `127.0.0.1:${p}`,
      `localhost:${p}`,
    ]);
    const lanHosts = LAN ? ports.map((p) => `${LAN}:${p}`) : [];
    return [...lanHosts, ...locals];
  })(),

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
      config.resolve.fallback = { ...config.resolve.fallback, 'react-dom/client': false };
    }
    return config;
  },
};

export default nextConfig;

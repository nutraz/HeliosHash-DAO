/** @type {import('next').NextConfig} */
const nextConfig = {
  // Critical: Dynamic rendering for Internet Identity + IC agents
  output: 'standalone',

  // React optimization
  reactStrictMode: true,

  // App Router optimizations
  experimental: {
    serverComponentsExternalPackages: [
      '@dfinity/agent',
      '@dfinity/auth-client',
      '@dfinity/principal',
      '@dfinity/candid'
    ],
    serverActions: {
      bodySizeLimit: '5mb',
    },
    dynamicIO: true,
    turbo: {
      rules: {
        "*.raw": {
          loaders: ['raw-loader'],
          as: '*.js'
        }
      }
    }
  },

  // Force dynamic behavior - no static pre-rendering
  generateEtags: false,
  staticPageGenerationTimeout: 0,

  // Security headers
  poweredByHeader: false,

  // Image optimization
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'ic0.app',
      'icp0.io',
      'internetcomputer.org'
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // CORS for local development + IC mainnet
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' }
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ],
      }
    ];
  },

  // Environment variables for build time
  env: {
    NEXT_PUBLIC_IC_HOST: process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:4943',
    NEXT_PUBLIC_II_CANISTER_ID: process.env.NEXT_PUBLIC_II_CANISTER_ID,
    NEXT_PUBLIC_PROJECT_HUB_ID: process.env.NEXT_PUBLIC_PROJECT_HUB_ID,
  },

  // Webpack configuration for IC packages
  webpack: (config, { isServer }) => {
    // Handle node-specific modules in browser context
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        path: require.resolve('path-browserify'),
      };
    }

    // Provide global Buffer for IC agent
    config.plugins.push(
      new (require('webpack').ProvidePlugin)({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    return config;
  }
};

module.exports = nextConfig;

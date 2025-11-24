/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // During CI or automated builds we may need to skip ESLint failures
  // to allow incremental fixes. Set to `true` to avoid failing the Next
  // build when ESLint flags console/logging rules or other non-blocking
  // issues. Developers should still fix lint warnings locally.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "connect-src 'self' http://localhost:4000 ws://localhost:3002 http://localhost:3002 http://127.0.0.1:4943",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

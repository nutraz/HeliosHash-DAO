// Next.js configuration for v16+ (ESM syntax)
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // Add any custom config here
  turbopack: {
    root: '/home/nutarzz/HeliosHash-DAO',
  },
  allowedDevOrigins: ['192.168.29.210'],
};

export default nextConfig;

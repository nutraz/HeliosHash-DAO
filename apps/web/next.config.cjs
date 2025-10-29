/** Minimal Next.js config to avoid build errors and workspace confusion */
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  output: 'standalone',
};

module.exports = nextConfig;

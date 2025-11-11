/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@helioshash/shared"],
  experimental: {
    // Disable static optimization for error pages
    optimizeCss: false,
  },
  // Point to src directory for App Router
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  // Ensure error pages are client-rendered
  generateBuildId: async () => {
    return "build-" + Date.now();
  },
};

export default nextConfig;

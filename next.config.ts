/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Add any experimental features here
  },
  eslint: {
    // Ignores ESLint errors during builds
    ignoreDuringBuilds: true
  }

  // Add other Next.js configuration options here
};

module.exports = nextConfig;

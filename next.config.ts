import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Other config options here
};
module.exports = {
  experimental: {
  },
}
export default nextConfig;
module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during builds
  },
};



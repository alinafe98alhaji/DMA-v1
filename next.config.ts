import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Other config options here
};
module.exports = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}
export default nextConfig;


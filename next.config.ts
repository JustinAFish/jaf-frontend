import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove trailingSlash as it can cause issues on Amplify
  // trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Ensure middleware runs properly
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;

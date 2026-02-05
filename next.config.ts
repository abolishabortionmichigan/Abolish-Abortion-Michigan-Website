import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'abolishabortionmichigan.com',
      },
      {
        protocol: 'https',
        hostname: '*.abolishabortionmichigan.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
      },
    ],
  },
  // Enable static export if needed for Hostinger hosting
  // output: 'export',
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pic.aucnetcars.com',
      },
    ],
  },
};

export default nextConfig;

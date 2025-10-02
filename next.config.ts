import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pic.aucnetcars.com",
      },
      {
        protocol: "https",
        hostname: "retro-pxe-00001-hs.angpla-net.com",
      },
    ],
  },
};

export default nextConfig;

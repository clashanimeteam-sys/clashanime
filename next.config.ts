import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "cdn.gifukai.com",
      },
      {
        protocol: "https",
        hostname: "cdn.listen.moe",
      },
      {
        protocol: "https",
        hostname: "listen.moe",
      },
    ],
  },
};

export default nextConfig;

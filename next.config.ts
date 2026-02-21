import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "v3b.fal.media" },
      { hostname: "media.samajsaathi.com" },
      { hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;

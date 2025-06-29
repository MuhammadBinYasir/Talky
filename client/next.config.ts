import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nzrfjecjpqqfyeryjvgt.supabase.co"
      }
    ]
  }
};

module.exports = nextConfig

// export default nextConfig;

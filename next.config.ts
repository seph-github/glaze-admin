// filepath: /Users/oyo_boy/Development/Repo/web_projects/glaze-web/next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_IMAGE_DOMAIN || ""],
  },
};

export default nextConfig;

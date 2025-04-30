// filepath: /Users/oyo_boy/Development/Repo/web_projects/glaze-web/next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_IMAGE_DOMAIN || ''],
  },
  // source: '/public/.well-known/apple-app-site-association',
  async headers() {
    return [
      {
        // Match all API routes
        source: '/public/well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

/* 
async headers() {
    return [
      {
        // Match all API routes
        source: '/public/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
*/

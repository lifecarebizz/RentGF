/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Remove 'standalone' for Vercel — Vercel handles its own output format
};

export default nextConfig;

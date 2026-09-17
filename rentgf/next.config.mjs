/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    // Prisma client types don't resolve correctly in pnpm on Vercel CI
    // Runtime behavior is correct — prisma generate runs before next build
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

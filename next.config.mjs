import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'swiper',
      '@supabase/supabase-js',
      'firebase',
      'react-markdown',
      'rehype-raw',
      'remark-gfm',
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/chart/:path*',
        destination: 'https://thirsty-spoiler-cartel.ngrok-free.dev/api/v1/chart/:path*',
      },
    ];
  },
};

export default nextConfig;

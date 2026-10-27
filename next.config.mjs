/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  compress: true,
  httpAgentOptions: {
    keepAlive: false,
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api', 'import'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lightweight-charts',
      'react-apexcharts',
      'apexcharts',
      'technicalindicators',
      '@supabase/supabase-js',
      'react-phone-number-input',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://thirsty-spoiler-cartel.ngrok-free.dev').replace(/\/+$/, '');
    return [
      {
        source: '/api/v1/chart/:path*',
        destination: `${backendUrl}/api/v1/chart/:path`,
      },
    ];
  },
};

export default nextConfig;


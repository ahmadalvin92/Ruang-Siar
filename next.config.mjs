/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Hide the Next.js developer-tools badge while working locally.
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/warta',
        destination: '/berita',
      },
      {
        source: '/warta/:slug*',
        destination: '/berita/:slug*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/jadwal',
        destination: '/siaran',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

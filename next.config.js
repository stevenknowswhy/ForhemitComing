/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '618ukecvpc.ufs.sh',
        pathname: '/**',
      },
    ],
  },
  // Trigger redeploy: v1
}

module.exports = nextConfig

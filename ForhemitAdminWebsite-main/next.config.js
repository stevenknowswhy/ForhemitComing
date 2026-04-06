const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lockfile in a parent directory (e.g. ~/package-lock.json) makes Next pick the wrong root;
  // without this, dev may never listen / Turbopack resolves the wrong tree.
  turbopack: {
    root: path.resolve(__dirname),
  },
  reactStrictMode: true,
  images: {
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
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://js.stripe.com https://uploadthing.com https://cdn.jsdelivr.net https://clerk.forhemit.website https://*.clerk.accounts.dev",
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
              "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
              "img-src 'self' data: https: blob: https://img.clerk.com",
              "connect-src 'self' https://api.convex.dev https://uploadthing.com wss://uploadthing.com https://striped-puma-587.convex.cloud wss://striped-puma-587.convex.cloud https://clerk.forhemit.website https://*.clerk.accounts.dev https://clerk-telemetry.com",
              "frame-src 'self' https://js.stripe.com https://clerk.forhemit.website https://*.clerk.accounts.dev",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

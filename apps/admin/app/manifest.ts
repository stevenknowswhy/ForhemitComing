import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Forhemit PBC',
    short_name: 'Forhemit',
    description: 'Stewardship Management Organization Built for Continuity, Not Extraction',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1209',
    theme_color: '#FF6B00',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'finance'],
    lang: 'en-US',
    scope: '/',
    prefer_related_applications: false,
  };
}

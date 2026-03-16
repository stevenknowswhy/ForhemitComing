import { MetadataRoute } from 'next';

const baseUrl = 'https://forhemit.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/introduction',
    '/faq',
    '/business-owners',
    '/brokers',
    '/lenders',
    '/accounting-firms',
    '/legal-practices',
    '/wealth-managers',
    '/appraisers',
    '/the-exit-crisis',
    '/beyond-the-balance-sheet',
    '/financial-accounting',
    '/privacy',
    '/terms',
    '/opt-in',
  ];

  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}

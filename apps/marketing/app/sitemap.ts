import { MetadataRoute } from 'next';
import { mockArticles } from '@/lib/blog-data';

const baseUrl = 'https://forhemit.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/blog',
    '/contact',
    '/introduction',
    '/faq',
    '/business-owners',
    '/four-month-path',
    '/brokers',
    '/broker-screening',
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

  const blogArticleRoutes = mockArticles.map((a) => `/blog/${a.slug}`);

  const lastModified = new Date();

  const staticEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }));

  const blogEntries = blogArticleRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}

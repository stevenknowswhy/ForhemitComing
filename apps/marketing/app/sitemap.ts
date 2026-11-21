import { MetadataRoute } from "next";
const baseUrl = "https://www.forhemit.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/about",
    "/pricing",
    "/blog",
    "/contact",
    "/faq",
    "/business-owners",
    "/four-month-path",
    "/brokers",
    "/accounting-firms",
    "/legal-practices",
    "/wealth-managers",
    "/the-exit-crisis",
    "/beyond-the-balance-sheet",
    "/privacy",
    "/terms",
    "/opt-in",
  ];

  const lastModified = new Date();

  const staticEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1.0 : 0.8,
  }));

  return staticEntries;
}

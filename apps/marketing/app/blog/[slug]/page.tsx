import { notFound } from "next/navigation";
import {
  fetchPostBySlug,
  fetchPublishedPosts,
  fetchPublishedPostSlugs,
} from "@/lib/blog-convex-server";
import { postDocToListItem } from "@/lib/blog-map";
import { BlogArticleView } from "@/components/blog/BlogArticleView";

export const dynamicParams = true;

/**
 * Flagship evidence pieces (ruling D3 A, 2026-11-27) render with the
 * data/evidence article variant. The set is intentionally empty: no
 * flagship post exists yet, and no content was invented to fill it.
 * Add a post's slug here when a real flagship piece is published.
 */
const FLAGSHIP_SLUGS: ReadonlySet<string> = new Set<string>();

export async function generateStaticParams() {
  return fetchPublishedPostSlugs(200);
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const doc = await fetchPostBySlug(slug);

  if (!doc) return { title: "Article Not Found" };

  const title = doc.metaTitle?.trim() || doc.title;
  const description =
    doc.metaDescription?.trim() || doc.excerpt?.trim() || doc.title;
  const ogUrl = doc.ogImage?.trim() || doc.featuredImage?.trim();

  return {
    title,
    description,
    ...(ogUrl
      ? { openGraph: { title, description, images: [{ url: ogUrl }] } }
      : {}),
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await fetchPostBySlug(slug);

  if (!doc) {
    notFound();
  }

  const allPublished = await fetchPublishedPosts(24);
  const related = allPublished
    .filter((p) => p.slug !== doc.slug)
    .slice(0, 2)
    .map((p) => postDocToListItem(p));

  return (
    <BlogArticleView
      doc={doc}
      relatedItems={related}
      variant={FLAGSHIP_SLUGS.has(doc.slug) ? "flagship" : "standard"}
    />
  );
}

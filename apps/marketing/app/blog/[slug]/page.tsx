import { notFound } from "next/navigation";
import {
  fetchPostBySlug,
  fetchPublishedPosts,
  fetchPublishedPostSlugs,
} from "@/lib/blog-convex-server";
import { postDocToListItem } from "@/lib/blog-map";
import { BlogArticleView } from "@/components/blog/BlogArticleView";

export const dynamicParams = true;

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

  return {
    title: doc.metaTitle?.trim() || doc.title,
    description:
      doc.metaDescription?.trim() || doc.excerpt?.trim() || doc.title,
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

  return <BlogArticleView doc={doc} relatedItems={related} />;
}

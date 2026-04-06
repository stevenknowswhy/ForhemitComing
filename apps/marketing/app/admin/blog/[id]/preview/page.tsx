import { notFound } from "next/navigation";
import { fetchPublishedPosts } from "@/lib/blog-convex-server";
import { postDocToListItem } from "@/lib/blog-map";
import { BlogArticleView } from "@/components/blog/BlogArticleView";
import { loadAdminPost } from "../../actions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const doc = await loadAdminPost(id);
  return {
    title: doc ? `Preview: ${doc.title}` : "Preview",
    robots: { index: false, follow: false },
  };
}

export default async function AdminBlogPreviewPage({ params }: PageProps) {
  const { id } = await params;
  const doc = await loadAdminPost(id);
  if (!doc) notFound();

  const allPublished = await fetchPublishedPosts(24);
  const related = allPublished
    .filter((p) => p.slug !== doc.slug)
    .slice(0, 2)
    .map((p) => postDocToListItem(p));

  return (
    <BlogArticleView
      doc={doc}
      relatedItems={related}
      preview
      editHref={`/admin/blog/${doc._id}/edit`}
    />
  );
}

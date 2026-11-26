import Link from "next/link";
import { notFound } from "next/navigation";
import { EditBlogPostForm } from "./EditBlogPostForm";
import { loadAdminPost } from "../../actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: PageProps) {
  const { id } = await params;

  if (!process.env.ADMIN_TOKEN?.length) {
    return (
      <div>
        <Link
          href="/admin/blog"
          className="text-sm font-medium text-stone underline underline-offset-4 hover:text-ink"
        >
          ← All posts
        </Link>
        <p className="mt-6 border bg-white p-4 text-sm text-ink">
          Set <code>ADMIN_TOKEN</code> in the marketing app environment to load
          and edit posts.
        </p>
      </div>
    );
  }

  const post = await loadAdminPost(id);
  if (!post) {
    notFound();
  }

  return <EditBlogPostForm post={post} configError={null} />;
}

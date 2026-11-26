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
      <main style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
        <p style={{ marginBottom: 16 }}>
          Set <code>ADMIN_TOKEN</code> in the marketing app environment to load
          and edit posts.
        </p>
        <Link href="/admin/blog" style={{ textDecoration: "underline" }}>
          ← Back to blog admin
        </Link>
      </main>
    );
  }

  const post = await loadAdminPost(id);
  if (!post) {
    notFound();
  }

  return <EditBlogPostForm post={post} configError={null} />;
}

import { BlogAdminClient } from "./BlogAdminClient";
import { loadAdminPosts } from "./actions";

export default async function AdminBlogPage() {
  if (!process.env.ADMIN_TOKEN?.length) {
    return (
      <BlogAdminClient
        posts={[]}
        configError='Set ADMIN_TOKEN in the marketing app environment (e.g. apps/marketing/.env.local). It must match the Convex deployment secret you use with requireAdmin. Then redeploy or restart dev.'
      />
    );
  }

  try {
    const posts = await loadAdminPosts();
    return <BlogAdminClient posts={posts} configError={null} />;
  } catch (e) {
    return (
      <BlogAdminClient
        posts={[]}
        configError={
          e instanceof Error
            ? e.message
            : "Failed to load posts from Convex."
        }
      />
    );
  }
}

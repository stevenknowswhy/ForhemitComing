import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { withTimeout } from "@/lib/blog-timeout";

/** How long the blog index waits for Convex before treating it as down. */
export const BLOG_INDEX_TIMEOUT_MS = 4000;

export type BlogIndexResult =
  | { ok: true; posts: Doc<"posts">[] }
  | { ok: false };

/**
 * Fetch published posts for the blog index WITHOUT swallowing the
 * error/empty distinction: `{ ok: false }` means Convex was unreachable
 * (or too slow), `ok: true, posts: []` means the library is genuinely empty.
 * The older helpers below keep their `[]`-on-error contract for the
 * article page; the index needs the difference to render the right state.
 */
export async function fetchIndexPosts(limit = 50): Promise<BlogIndexResult> {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    console.error("[blog] index fetch failed: NEXT_PUBLIC_CONVEX_URL is not set");
    return { ok: false };
  }
  try {
    const posts = await withTimeout(
      fetchQuery(api.posts.listPublished, { limit }),
      BLOG_INDEX_TIMEOUT_MS
    );
    return Array.isArray(posts) ? { ok: true, posts } : { ok: false };
  } catch (error) {
    console.error("[blog] index fetch failed:", error);
    return { ok: false };
  }
}

export async function fetchPublishedPostSlugs(
  limit = 200
): Promise<{ slug: string }[]> {
  try {
    const posts = await fetchQuery(api.posts.listPublished, { limit });
    return posts.map((p: Doc<"posts">) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function fetchPublishedPosts(
  limit = 100
): Promise<Doc<"posts">[]> {
  try {
    return await fetchQuery(api.posts.listPublished, { limit });
  } catch {
    return [];
  }
}

export async function fetchPostBySlug(
  slug: string
): Promise<Doc<"posts"> | null> {
  try {
    return await fetchQuery(api.posts.getBySlug, { slug });
  } catch {
    return null;
  }
}

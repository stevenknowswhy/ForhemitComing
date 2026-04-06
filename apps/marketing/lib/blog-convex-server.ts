import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

export async function fetchPublishedPostSlugs(
  limit = 200
): Promise<{ slug: string }[]> {
  try {
    const posts = await fetchQuery(api.posts.listPublished, { limit });
    return posts.map((p) => ({ slug: p.slug }));
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

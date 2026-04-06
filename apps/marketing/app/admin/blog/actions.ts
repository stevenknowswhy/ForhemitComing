"use server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { revalidatePath } from "next/cache";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";

function adminToken(): string {
  const t = process.env.ADMIN_TOKEN;
  if (!t?.length) {
    throw new Error("ADMIN_TOKEN is not set on the server");
  }
  return t;
}

function revalidateBlog() {
  revalidatePath("/", "layout");
}

export async function loadAdminPosts(): Promise<Doc<"posts">[]> {
  return fetchQuery(api.posts.adminList, {
    adminToken: adminToken(),
    limit: 200,
  });
}

export async function loadAdminPost(
  id: string
): Promise<Doc<"posts"> | null> {
  const trimmed = id.trim();
  if (!trimmed) return null;
  try {
    return await fetchQuery(api.posts.adminGet, {
      id: trimmed as Id<"posts">,
      adminToken: adminToken(),
    });
  } catch {
    return null;
  }
}

export async function publishBlogPost(id: Id<"posts">) {
  await fetchMutation(api.posts.publish, {
    id,
    adminToken: adminToken(),
  });
  revalidateBlog();
}

export async function unpublishBlogPost(id: Id<"posts">) {
  await fetchMutation(api.posts.unpublish, {
    id,
    adminToken: adminToken(),
  });
  revalidateBlog();
}

export async function deleteBlogPost(id: Id<"posts">) {
  await fetchMutation(api.posts.remove, {
    id,
    adminToken: adminToken(),
  });
  revalidateBlog();
}

type PathwayOpt =
  | "founders"
  | "attorneys"
  | "lenders"
  | "cpas"
  | "employees";

export async function createBlogPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || undefined;
  const subtitle = String(formData.get("subtitle") ?? "").trim() || undefined;
  const category = String(formData.get("category") ?? "").trim() || undefined;
  const featuredImage =
    String(formData.get("featuredImage") ?? "").trim() || undefined;
  const contentRaw = String(formData.get("content") ?? "").trim();
  const publishNow = formData.get("publishNow") === "on";
  const pathwayRaw = String(formData.get("pathway") ?? "").trim();

  const pathway: PathwayOpt | undefined =
    pathwayRaw === "founders" ||
    pathwayRaw === "attorneys" ||
    pathwayRaw === "lenders" ||
    pathwayRaw === "cpas" ||
    pathwayRaw === "employees"
      ? pathwayRaw
      : undefined;

  const readTimeOverview = numOrUndef(formData.get("readTimeOverview"));
  const readTimeDeepDive = numOrUndef(formData.get("readTimeDeepDive"));
  const readTimeMethodology = numOrUndef(formData.get("readTimeMethodology"));

  let resilienceSummary: string[] | undefined;
  const rs = String(formData.get("resilienceSummary") ?? "").trim();
  if (rs) {
    resilienceSummary = rs
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (!title || !slug) {
    throw new Error("Title and slug are required");
  }

  let content: unknown;
  try {
    content = JSON.parse(contentRaw || "{}");
  } catch {
    throw new Error("Content must be valid JSON (TipTap document)");
  }

  await fetchMutation(api.posts.create, {
    title,
    slug,
    excerpt,
    subtitle,
    category,
    featuredImage,
    content,
    status: publishNow ? "published" : "draft",
    pathway,
    readTimeOverview,
    readTimeDeepDive,
    readTimeMethodology,
    resilienceSummary,
    adminToken: adminToken(),
  });
  revalidateBlog();
}

export async function updateBlogPost(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing post id");

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || undefined;
  const subtitle = String(formData.get("subtitle") ?? "").trim() || undefined;
  const category = String(formData.get("category") ?? "").trim() || undefined;
  const featuredImage =
    String(formData.get("featuredImage") ?? "").trim() || undefined;
  const contentRaw = String(formData.get("content") ?? "").trim();
  const pathwayRaw = String(formData.get("pathway") ?? "").trim();

  const pathway: PathwayOpt | undefined =
    pathwayRaw === "founders" ||
    pathwayRaw === "attorneys" ||
    pathwayRaw === "lenders" ||
    pathwayRaw === "cpas" ||
    pathwayRaw === "employees"
      ? pathwayRaw
      : undefined;

  const readTimeOverview = numOrUndef(formData.get("readTimeOverview"));
  const readTimeDeepDive = numOrUndef(formData.get("readTimeDeepDive"));
  const readTimeMethodology = numOrUndef(formData.get("readTimeMethodology"));

  const rs = String(formData.get("resilienceSummary") ?? "").trim();
  const resilienceSummary = rs
    ? rs
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  if (!title || !slug) {
    throw new Error("Title and slug are required");
  }

  let content: unknown;
  try {
    content = JSON.parse(contentRaw || "{}");
  } catch {
    throw new Error("Content must be valid JSON (TipTap document)");
  }

  await fetchMutation(api.posts.update, {
    id: id as Id<"posts">,
    title,
    slug,
    excerpt,
    subtitle,
    category,
    featuredImage,
    content,
    pathway,
    readTimeOverview,
    readTimeDeepDive,
    readTimeMethodology,
    resilienceSummary,
    adminToken: adminToken(),
  });
  revalidateBlog();
}

function numOrUndef(v: FormDataEntryValue | null): number | undefined {
  if (v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

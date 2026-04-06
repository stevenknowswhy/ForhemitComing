import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/requireAdmin";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeSlug(raw: string): string {
  return raw.trim().toLowerCase();
}

function assertSlug(slug: string): void {
  if (!SLUG_RE.test(slug)) {
    throw new Error(
      "Invalid slug: use lowercase letters, numbers, and single hyphens between words"
    );
  }
}

function assertContent(content: unknown): void {
  if (content === null || typeof content !== "object" || Array.isArray(content)) {
    throw new Error("content must be a JSON object (e.g. TipTap doc)");
  }
}

const postStatus = v.union(
  v.literal("draft"),
  v.literal("published"),
  v.literal("scheduled")
);

/** Initial status on create: draft or published only (scheduled needs a future time — use update). */
const createPostStatus = v.union(v.literal("draft"), v.literal("published"));

const blogPathway = v.union(
  v.literal("founders"),
  v.literal("attorneys"),
  v.literal("lenders"),
  v.literal("cpas"),
  v.literal("employees")
);

const blogDepthLevel = v.union(
  v.literal("overview"),
  v.literal("detailed"),
  v.literal("comprehensive")
);

// --- Public ---

/** Published posts, newest first (for marketing blog index). */
export const listPublished = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const lim = Math.min(Math.max(args.limit ?? 24, 1), 100);
    const rows = await ctx.db
      .query("posts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .take(lim * 2);

    return rows
      .filter(
        (p) =>
          p.publishedAt !== undefined && p.publishedAt <= now
      )
      .slice(0, lim);
  },
});

/** Single published post by slug, or null. */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const slug = normalizeSlug(args.slug);
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!post) return null;
    if (post.status !== "published") return null;
    if (post.publishedAt === undefined || post.publishedAt > now) return null;
    return post;
  },
});

// --- Admin ---

export const adminList = query({
  args: { adminToken: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    const lim = Math.min(Math.max(args.limit ?? 100, 1), 500);
    return await ctx.db
      .query("posts")
      .withIndex("by_updatedAt", (q) => q.gte("updatedAt", 0))
      .order("desc")
      .take(lim);
  },
});

export const adminGet = query({
  args: {
    id: v.id("posts"),
    adminToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.optional(v.string()),
    content: v.any(),
    featuredImage: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    status: v.optional(createPostStatus),
    pathway: v.optional(blogPathway),
    category: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    readTimeOverview: v.optional(v.number()),
    readTimeDeepDive: v.optional(v.number()),
    readTimeMethodology: v.optional(v.number()),
    depthLevel: v.optional(blogDepthLevel),
    resilienceSummary: v.optional(v.array(v.string())),
    relatedPathways: v.optional(v.array(blogPathway)),
    adminToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    assertContent(args.content);
    const slug = normalizeSlug(args.slug);
    assertSlug(slug);

    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (existing) {
      throw new Error("A post with this slug already exists");
    }

    const identity = await ctx.auth.getUserIdentity();
    const authorDisplayName =
      identity?.email?.split("@")[0]?.replace(/\./g, " ") ?? undefined;

    const now = Date.now();
    const status = args.status ?? "draft";

    const id = await ctx.db.insert("posts", {
      title: args.title.trim(),
      slug,
      excerpt: args.excerpt?.trim(),
      content: args.content,
      status,
      publishedAt: status === "published" ? now : undefined,
      scheduledAt: undefined,
      version: 1,
      authorDisplayName,
      featuredImage: args.featuredImage,
      metaTitle: args.metaTitle,
      metaDescription: args.metaDescription,
      ogImage: args.ogImage,
      pathway: args.pathway,
      category: args.category?.trim(),
      subtitle: args.subtitle?.trim(),
      readTimeOverview: args.readTimeOverview,
      readTimeDeepDive: args.readTimeDeepDive,
      readTimeMethodology: args.readTimeMethodology,
      depthLevel: args.depthLevel,
      resilienceSummary: args.resilienceSummary,
      relatedPathways: args.relatedPathways,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      action: "create",
      entityType: "post",
      entityId: id,
      timestamp: now,
    });

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.any()),
    featuredImage: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    status: v.optional(postStatus),
    pathway: v.optional(blogPathway),
    category: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    readTimeOverview: v.optional(v.number()),
    readTimeDeepDive: v.optional(v.number()),
    readTimeMethodology: v.optional(v.number()),
    depthLevel: v.optional(blogDepthLevel),
    resilienceSummary: v.optional(v.array(v.string())),
    relatedPathways: v.optional(v.array(blogPathway)),
    adminToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");

    const now = Date.now();
    let nextSlug = post.slug;
    if (args.slug !== undefined) {
      nextSlug = normalizeSlug(args.slug);
      assertSlug(nextSlug);
      if (nextSlug !== post.slug) {
        const taken = await ctx.db
          .query("posts")
          .withIndex("by_slug", (q) => q.eq("slug", nextSlug))
          .first();
        if (taken) throw new Error("A post with this slug already exists");
      }
    }

    if (args.content !== undefined) {
      assertContent(args.content);
    }

    const nextStatus = args.status ?? post.status;
    let publishedAt = post.publishedAt;
    let scheduledAt = post.scheduledAt;

    if (args.status !== undefined) {
      if (nextStatus === "published") {
        publishedAt = post.publishedAt ?? now;
        scheduledAt = undefined;
      } else if (nextStatus === "draft") {
        publishedAt = undefined;
        scheduledAt = undefined;
      } else if (nextStatus === "scheduled") {
        scheduledAt = post.scheduledAt ?? now;
        publishedAt = undefined;
      }
    }

    await ctx.db.patch(args.id, {
      ...(args.title !== undefined ? { title: args.title.trim() } : {}),
      slug: nextSlug,
      ...(args.excerpt !== undefined ? { excerpt: args.excerpt?.trim() } : {}),
      ...(args.content !== undefined ? { content: args.content } : {}),
      ...(args.featuredImage !== undefined ? { featuredImage: args.featuredImage } : {}),
      ...(args.metaTitle !== undefined ? { metaTitle: args.metaTitle } : {}),
      ...(args.metaDescription !== undefined
        ? { metaDescription: args.metaDescription }
        : {}),
      ...(args.ogImage !== undefined ? { ogImage: args.ogImage } : {}),
      ...(args.pathway !== undefined ? { pathway: args.pathway } : {}),
      ...(args.category !== undefined ? { category: args.category?.trim() } : {}),
      ...(args.subtitle !== undefined ? { subtitle: args.subtitle?.trim() } : {}),
      ...(args.readTimeOverview !== undefined
        ? { readTimeOverview: args.readTimeOverview }
        : {}),
      ...(args.readTimeDeepDive !== undefined
        ? { readTimeDeepDive: args.readTimeDeepDive }
        : {}),
      ...(args.readTimeMethodology !== undefined
        ? { readTimeMethodology: args.readTimeMethodology }
        : {}),
      ...(args.depthLevel !== undefined ? { depthLevel: args.depthLevel } : {}),
      ...(args.resilienceSummary !== undefined
        ? { resilienceSummary: args.resilienceSummary }
        : {}),
      ...(args.relatedPathways !== undefined
        ? { relatedPathways: args.relatedPathways }
        : {}),
      status: nextStatus,
      publishedAt,
      scheduledAt,
      version: post.version + 1,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      action: "update",
      entityType: "post",
      entityId: args.id,
      timestamp: now,
    });

    return args.id;
  },
});

export const publish = mutation({
  args: { id: v.id("posts"), adminToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: "published",
      publishedAt: post.publishedAt ?? now,
      scheduledAt: undefined,
      version: post.version + 1,
      updatedAt: now,
    });
    await ctx.db.insert("auditLogs", {
      action: "update",
      entityType: "post",
      entityId: args.id,
      timestamp: now,
    });
    return args.id;
  },
});

export const unpublish = mutation({
  args: { id: v.id("posts"), adminToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: "draft",
      publishedAt: undefined,
      scheduledAt: undefined,
      version: post.version + 1,
      updatedAt: now,
    });
    await ctx.db.insert("auditLogs", {
      action: "update",
      entityType: "post",
      entityId: args.id,
      timestamp: now,
    });
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("posts"), adminToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    const now = Date.now();
    const entityId = args.id;
    await ctx.db.delete(args.id);
    await ctx.db.insert("auditLogs", {
      action: "delete",
      entityType: "post",
      entityId,
      timestamp: now,
    });
  },
});

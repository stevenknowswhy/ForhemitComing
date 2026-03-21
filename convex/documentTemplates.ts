import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List all templates
export const list = query({
  args: {
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("draft"),
      v.literal("archived")
    )),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("documentTemplates")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("documentTemplates")
      .order("desc")
      .collect();
  },
});

// Get a single template by ID
export const get = query({
  args: { id: v.id("documentTemplates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get a template by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documentTemplates")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Create a new template
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    version: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("draft"),
      v.literal("archived")
    ),
    category: v.optional(v.string()),
    formKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("documentTemplates", {
      ...args,
      createdAt: Date.now(),
    });
    return { success: true, id };
  },
});

// Update a template
export const update = mutation({
  args: {
    id: v.id("documentTemplates"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    version: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("draft"),
      v.literal("archived")
    )),
    category: v.optional(v.string()),
    formKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }
    cleanUpdates.updatedAt = Date.now();
    await ctx.db.patch(id, cleanUpdates);
    return { success: true };
  },
});

// Seed the ESOP Cost Reference template if none exist
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("documentTemplates")
      .withIndex("by_slug", (q) => q.eq("slug", "esop-cost-reference"))
      .first();

    if (existing) {
      return { success: true, id: existing._id, seeded: false };
    }

    const id = await ctx.db.insert("documentTemplates", {
      name: "ESOP Cost Reference Calculator",
      slug: "esop-cost-reference",
      description:
        "Interactive cost reference calculator for ESOP transactions. Models sunk costs, structural costs, universal costs, and §1042 tax deferral benefits across deal stages.",
      version: "2.0",
      status: "active",
      category: "Financial Analysis",
      formKey: "esop-cost-reference",
      createdAt: Date.now(),
    });

    return { success: true, id, seeded: true };
  },
});

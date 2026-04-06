import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Log a document generation event
export const create = mutation({
  args: {
    templateId: v.id("documentTemplates"),
    templateName: v.string(),
    formData: v.string(),
    action: v.union(
      v.literal("pdf-download"),
      v.literal("pdf-download-server"),
      v.literal("pdf-download-client"),
      v.literal("print"),
      v.literal("preview"),
      v.literal("export-csv"),
      v.literal("export-json")
    ),
    generatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("generatedDocuments", {
      ...args,
      createdAt: Date.now(),
    });
    return { success: true, id };
  },
});

// List all generated documents (most recent first)
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("generatedDocuments")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

// Get generated documents for a specific template
export const getByTemplate = query({
  args: {
    templateId: v.id("documentTemplates"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("generatedDocuments")
      .withIndex("by_template", (q) => q.eq("templateId", args.templateId))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

// Get a single generated document by ID
export const get = query({
  args: { id: v.id("generatedDocuments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

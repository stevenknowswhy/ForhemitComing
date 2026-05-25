import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get a template by ID
 */
export const get = query({
  args: { id: v.id("templates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get a template by its title
 */
export const getByTitle = query({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("templates")
      .filter((q) => q.eq(q.field("title"), args.title))
      .first();
    return results;
  },
});

/**
 * Get a template by its lifecycle stage and a search term in the title
 */
export const getByStageAndTitle = query({
  args: {
    lifecycleStage: v.string(),
    titleContains: v.string(),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("templates")
      .filter((q) =>
        q.and(
          q.eq(q.field("lifecycleStage"), args.lifecycleStage),
          q.eq(q.field("status"), "exists")
        )
      )
      .collect();

    return results.filter((t) =>
      t.title.toLowerCase().includes(args.titleContains.toLowerCase())
    );
  },
});

/**
 * Get all templates for a given lifecycle stage
 */
export const getByStage = query({
  args: { lifecycleStage: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("templates")
      .filter((q) => q.eq(q.field("lifecycleStage"), args.lifecycleStage))
      .collect();
  },
});

/**
 * Get all templates with status "exists" (built and ready)
 */
export const getExisting = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("templates")
      .filter((q) => q.eq(q.field("status"), "exists"))
      .collect();
  },
});

/**
 * Get all templates
 */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("templates").collect();
  },
});

/**
 * Update the content field of a template by title.
 * Also sets status to "exists" if it was "gap" or "urgent" (since content is now present).
 */
export const updateContentByTitle = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db
      .query("templates")
      .filter((q) => q.eq(q.field("title"), args.title))
      .first();
    if (!template) {
      return { success: false, error: `Template not found: ${args.title}` };
    }
    const patch: Record<string, unknown> = {
      content: args.content,
      updatedAt: Date.now(),
    };
    // Auto-promote status when content is populated
    if (template.status === "gap" || template.status === "urgent") {
      patch.status = "exists";
    }
    await ctx.db.patch(template._id, patch);
    return { success: true, title: args.title, previousStatus: template.status };
  },
});

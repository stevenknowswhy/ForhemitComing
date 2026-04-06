import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/requireAdmin";

// Get all phone messages
export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("phoneMessages")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

// Get a specific message
export const getMessage = query({
  args: { id: v.id("phoneMessages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mark a message as read or unread
export const markAsRead = mutation({
  args: { id: v.id("phoneMessages"), read: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: args.read });
  },
});

// Delete a phone message
export const deleteMessage = mutation({
  args: { id: v.id("phoneMessages"), adminToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    await ctx.db.delete(args.id);
  },
});

// Save a new message from a webhook
export const saveWebhookMessage = mutation({
  args: {
    callId: v.string(),
    agentId: v.optional(v.string()),
    callerNumber: v.optional(v.string()),
    transcript: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("completed"),
      v.literal("failed"),
      v.literal("in-progress"),
      v.literal("missed")
    )),
    duration: v.optional(v.number()),
    summary: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Check if we already have this callId to avoid duplicates
    const existing = await ctx.db
      .query("phoneMessages")
      .withIndex("by_callId", (q) => q.eq("callId", args.callId))
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        ...args,
        read: existing.read, // preserve read state
      });
      return existing._id;
    }

    // Insert new
    return await ctx.db.insert("phoneMessages", {
      ...args,
      createdAt: Date.now(),
      read: false,
    });
  },
});

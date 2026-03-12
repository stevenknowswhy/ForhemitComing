import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Submit early access signup
export const submit = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Normalize email
    const normalizedEmail = args.email.toLowerCase().trim();

    // Check if email already exists
    const existingSignup = await ctx.db
      .query("earlyAccessSignups")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existingSignup) {
      // Return success but indicate it was a duplicate
      return { success: true, id: existingSignup._id, isDuplicate: true };
    }

    // Create new signup
    const signupId = await ctx.db.insert("earlyAccessSignups", {
      email: normalizedEmail,
      source: args.source,
      createdAt: Date.now(),
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
    });

    // Update daily stats
    const today = new Date().toISOString().split("T")[0];
    const existingStats = await ctx.db
      .query("submissionStats")
      .withIndex("by_date", (q) => q.eq("date", today))
      .first();

    if (existingStats) {
      await ctx.db.patch(existingStats._id, {
        earlyAccessSignups: existingStats.earlyAccessSignups + 1,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert("submissionStats", {
        date: today,
        contactSubmissions: 0,
        earlyAccessSignups: 1,
        jobApplications: 0,
        lastUpdated: Date.now(),
      });
    }

    return { success: true, id: signupId, isDuplicate: false };
  },
});

// Get all early access signups
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const signups = await ctx.db
      .query("earlyAccessSignups")
      .order("desc")
      .take(args.limit ?? 100);
    return signups;
  },
});

// Check if email exists
export const checkEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const existing = await ctx.db
      .query("earlyAccessSignups")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    return { exists: !!existing };
  },
});

// Get signup by ID
export const getById = query({
  args: { id: v.id("earlyAccessSignups") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

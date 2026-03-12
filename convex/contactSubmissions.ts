import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Submit a contact form
export const submit = mutation({
  args: {
    contactType: v.union(
      v.literal("business-owner"),
      v.literal("partner"),
      v.literal("existing-business"),
      v.literal("website-visitor"),
      v.literal("marketing")
    ),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    interest: v.optional(v.union(
      v.literal("esop-transition"),
      v.literal("accounting"),
      v.literal("legal"),
      v.literal("lending"),
      v.literal("broker"),
      v.literal("wealth"),
      v.literal("career"),
      v.literal("general")
    )),
    message: v.string(),
    source: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for duplicate submissions from same email within last hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const existingSubmissions = await ctx.db
      .query("contactSubmissions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.gt(q.field("createdAt"), oneHourAgo))
      .take(1);

    if (existingSubmissions.length > 0) {
      throw new Error("Duplicate submission: Please wait before submitting again");
    }

    // Create the submission
    const submissionId = await ctx.db.insert("contactSubmissions", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });

    // Update daily stats
    const today = new Date().toISOString().split("T")[0];
    const existingStats = await ctx.db
      .query("submissionStats")
      .withIndex("by_date", (q) => q.eq("date", today))
      .first();

    if (existingStats) {
      await ctx.db.patch(existingStats._id, {
        contactSubmissions: existingStats.contactSubmissions + 1,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert("submissionStats", {
        date: today,
        contactSubmissions: 1,
        earlyAccessSignups: 0,
        jobApplications: 0,
        lastUpdated: Date.now(),
      });
    }

    return { success: true, id: submissionId };
  },
});

// Get all contact submissions (for admin dashboard)
export const list = query({
  args: {
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("in-progress"),
      v.literal("responded"),
      v.literal("closed")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("contactSubmissions")
        .withIndex("by_status", (q) => q.eq("status", args.status))
        .take(args.limit ?? 100);
    }
    
    return await ctx.db
      .query("contactSubmissions")
      .order("desc")
      .take(args.limit ?? 100);
  },
});

// Update submission status
export const updateStatus = mutation({
  args: {
    id: v.id("contactSubmissions"),
    status: v.union(
      v.literal("new"),
      v.literal("in-progress"),
      v.literal("responded"),
      v.literal("closed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return { success: true };
  },
});

// Get submission by ID
export const getById = query({
  args: { id: v.id("contactSubmissions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

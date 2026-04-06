import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/requireAdmin";

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

    // Create audit log
    await ctx.db.insert("auditLogs", {
      action: "create",
      entityType: "contactSubmission",
      entityId: submissionId,
      timestamp: Date.now(),
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

    await ctx.scheduler.runAfter(0, internal.emails.notifyContactSubmissionTelegram, {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      phone: args.phone,
      company: args.company,
      contactType: args.contactType,
      interest: args.interest,
      message: args.message,
      source: args.source,
    });

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
    const limit = args.limit ?? 300;
    if (args.status) {
      const rows = await ctx.db
        .query("contactSubmissions")
        .withIndex("by_status", (q) => q.eq("status", args.status))
        .collect();
      rows.sort((a, b) => b.createdAt - a.createdAt);
      return rows.slice(0, limit);
    }

    return await ctx.db.query("contactSubmissions").order("desc").take(limit);
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
    adminToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Submission not found");
    }

    const oldStatus = existing.status || "new";
    
    await ctx.db.patch(args.id, { 
      status: args.status,
      updatedAt: Date.now(),
    });

    // Create audit log
    await ctx.db.insert("auditLogs", {
      action: "update",
      entityType: "contactSubmission",
      entityId: args.id,
      changes: [{ field: "status", oldValue: oldStatus, newValue: args.status }],
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// Update full submission
export const update = mutation({
  args: {
    id: v.id("contactSubmissions"),
    contactType: v.optional(v.union(
      v.literal("business-owner"),
      v.literal("partner"),
      v.literal("existing-business"),
      v.literal("website-visitor"),
      v.literal("marketing")
    )),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
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
    message: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("in-progress"),
      v.literal("responded"),
      v.literal("closed")
    )),
    adminToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);

    const { id, adminToken, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Submission not found");
    }

    // Track changes for audit log
    const changes: { field: string; oldValue?: string; newValue?: string }[] = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && value !== (existing as Record<string, unknown>)[key]) {
        changes.push({
          field: key,
          oldValue: String((existing as Record<string, unknown>)[key] ?? ""),
          newValue: String(value),
        });
      }
    }

    if (changes.length === 0) {
      return { success: true, message: "No changes detected" };
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    // Create audit log
    await ctx.db.insert("auditLogs", {
      action: "update",
      entityType: "contactSubmission",
      entityId: id,
      changes,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

export const appendAdminNote = mutation({
  args: {
    id: v.id("contactSubmissions"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Submission not found");
    }
    const trimmed = args.text.trim();
    if (!trimmed) {
      throw new Error("Note cannot be empty");
    }
    const prev = existing.adminNotes ?? [];
    const noteId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const adminNotes = [...prev, { id: noteId, text: trimmed, createdAt: Date.now() }];
    await ctx.db.patch(args.id, {
      adminNotes,
      updatedAt: Date.now(),
    });
    await ctx.db.insert("auditLogs", {
      action: "update",
      entityType: "contactSubmission",
      entityId: args.id,
      changes: [{ field: "adminNotes", oldValue: String(prev.length), newValue: String(adminNotes.length) }],
      timestamp: Date.now(),
    });
    return { success: true, noteId };
  },
});

export const removeAdminNote = mutation({
  args: {
    id: v.id("contactSubmissions"),
    noteId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Submission not found");
    }
    const prev = existing.adminNotes ?? [];
    const adminNotes = prev.filter((n) => n.id !== args.noteId);
    if (adminNotes.length === prev.length) {
      throw new Error("Note not found");
    }
    await ctx.db.patch(args.id, {
      adminNotes,
      updatedAt: Date.now(),
    });
    await ctx.db.insert("auditLogs", {
      action: "update",
      entityType: "contactSubmission",
      entityId: args.id,
      changes: [{ field: "adminNotes", oldValue: String(prev.length), newValue: String(adminNotes.length) }],
      timestamp: Date.now(),
    });
    return { success: true };
  },
});

// Delete submission
export const remove = mutation({
  args: {
    id: v.id("contactSubmissions"),
    adminToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Submission not found");
    }

    await ctx.db.delete(args.id);

    // Create audit log
    await ctx.db.insert("auditLogs", {
      action: "delete",
      entityType: "contactSubmission",
      entityId: args.id,
      timestamp: Date.now(),
    });

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

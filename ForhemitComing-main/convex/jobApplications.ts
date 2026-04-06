import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function requireAdmin(authToken: string | undefined): void {
  if (!authToken || authToken !== ADMIN_TOKEN) {
    throw new Error("Unauthorized: Admin access required");
  }
}

// Submit job application
export const submit = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    position: v.string(),
    otherPosition: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();

    // Check for existing application from same email for same position within last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const existingApplications = await ctx.db
      .query("jobApplications")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .filter((q) => 
        q.and(
          q.eq(q.field("position"), args.position),
          q.gt(q.field("createdAt"), thirtyDaysAgo)
        )
      )
      .take(1);

    if (existingApplications.length > 0) {
      throw new Error("You have already applied for this position within the last 30 days");
    }

    // Create the application
    const applicationId = await ctx.db.insert("jobApplications", {
      ...args,
      email: normalizedEmail,
      status: "new",
      createdAt: Date.now(),
    });

    // Create audit log
    await ctx.db.insert("auditLogs", {
      action: "create",
      entityType: "jobApplication",
      entityId: applicationId,
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
        jobApplications: existingStats.jobApplications + 1,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert("submissionStats", {
        date: today,
        contactSubmissions: 0,
        earlyAccessSignups: 0,
        jobApplications: 1,
        lastUpdated: Date.now(),
      });
    }

    return { success: true, id: applicationId };
  },
});

// Get all job applications
export const list = query({
  args: {
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("reviewing"),
      v.literal("interview-scheduled"),
      v.literal("rejected"),
      v.literal("hired")
    )),
    position: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("jobApplications")
        .withIndex("by_status", (q) => q.eq("status", args.status))
        .take(args.limit ?? 100);
    }
    
    if (args.position) {
      return await ctx.db
        .query("jobApplications")
        .withIndex("by_position", (q) => q.eq("position", args.position!))
        .take(args.limit ?? 100);
    }
    
    return await ctx.db
      .query("jobApplications")
      .order("desc")
      .take(args.limit ?? 100);
  },
});

// Update application status
export const updateStatus = mutation({
  args: {
    id: v.id("jobApplications"),
    status: v.union(
      v.literal("new"),
      v.literal("reviewing"),
      v.literal("interview-scheduled"),
      v.literal("rejected"),
      v.literal("hired")
    ),
    adminToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Application not found");
    }

    const oldStatus = existing.status || "new";

    await ctx.db.patch(args.id, { 
      status: args.status,
      updatedAt: Date.now(),
    });

    // Create audit log
    await ctx.db.insert("auditLogs", {
      action: "update",
      entityType: "jobApplication",
      entityId: args.id,
      changes: [{ field: "status", oldValue: oldStatus, newValue: args.status }],
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// Update full application
export const update = mutation({
  args: {
    id: v.id("jobApplications"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    position: v.optional(v.string()),
    otherPosition: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("reviewing"),
      v.literal("interview-scheduled"),
      v.literal("rejected"),
      v.literal("hired")
    )),
    adminToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    
    const { id, adminToken, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Application not found");
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
      entityType: "jobApplication",
      entityId: id,
      changes,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// Delete application
export const remove = mutation({
  args: {
    id: v.id("jobApplications"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Application not found");
    }

    await ctx.db.delete(args.id);

    // Create audit log
    await ctx.db.insert("auditLogs", {
      action: "delete",
      entityType: "jobApplication",
      entityId: args.id,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// Get application by ID
export const getById = query({
  args: { id: v.id("jobApplications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get applications by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const applications = await ctx.db
      .query("jobApplications")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .order("desc")
      .take(10);
    return applications;
  },
});

// Get application statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allApplications = await ctx.db.query("jobApplications").collect();
    
    const stats = {
      total: allApplications.length,
      byStatus: {
        new: 0,
        reviewing: 0,
        "interview-scheduled": 0,
        rejected: 0,
        hired: 0,
      } as Record<string, number>,
      byPosition: {} as Record<string, number>,
    };

    for (const app of allApplications) {
      // Count by status
      const status = app.status || "new";
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      
      // Count by position
      const position = app.position;
      stats.byPosition[position] = (stats.byPosition[position] || 0) + 1;
    }

    return stats;
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create an audit log entry
export const create = mutation({
  args: {
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete")
    ),
    entityType: v.union(
      v.literal("contactSubmission"),
      v.literal("earlyAccessSignup"),
      v.literal("jobApplication"),
      v.literal("documentTemplate"),
      v.literal("generatedDocument")
    ),
    entityId: v.string(),
    changes: v.optional(v.array(v.object({
      field: v.string(),
      oldValue: v.optional(v.string()),
      newValue: v.optional(v.string()),
    }))),
    performedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auditLogId = await ctx.db.insert("auditLogs", {
      ...args,
      timestamp: Date.now(),
    });
    return { success: true, id: auditLogId };
  },
});

// Get all audit logs
export const list = query({
  args: {
    limit: v.optional(v.number()),
    entityType: v.optional(v.union(
      v.literal("contactSubmission"),
      v.literal("earlyAccessSignup"),
      v.literal("jobApplication")
    )),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("auditLogs").order("desc");
    
    if (args.entityType) {
      // Filter by entity type - need to collect and filter
      const allLogs = await query.collect();
      const filtered = allLogs.filter(log => log.entityType === args.entityType);
      return filtered.slice(0, args.limit ?? 100);
    }
    
    return await query.take(args.limit ?? 100);
  },
});

// Get audit logs for a specific entity
export const getByEntity = query({
  args: {
    entityType: v.union(
      v.literal("contactSubmission"),
      v.literal("earlyAccessSignup"),
      v.literal("jobApplication")
    ),
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("auditLogs")
      .withIndex("by_entity", (q) => 
        q.eq("entityType", args.entityType).eq("entityId", args.entityId)
      )
      .order("desc")
      .collect();
  },
});

// Get audit log statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allLogs = await ctx.db.query("auditLogs").collect();
    
    const stats = {
      total: allLogs.length,
      byAction: {
        create: 0,
        update: 0,
        delete: 0,
      } as Record<string, number>,
      byEntityType: {
        contactSubmission: 0,
        earlyAccessSignup: 0,
        jobApplication: 0,
        documentTemplate: 0,
        generatedDocument: 0,
      } as Record<string, number>,
      recentActivity: allLogs.slice(0, 10), // Last 10 actions
    };

    for (const log of allLogs) {
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
      stats.byEntityType[log.entityType] = (stats.byEntityType[log.entityType] || 0) + 1;
    }

    return stats;
  },
});

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * List all documents for a company.
 */
export const listByCompany = query({
  args: {
    companyId: v.id("crmCompanies"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dealDocuments")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();
  },
});

/**
 * Get documents for a company filtered by type.
 */
export const getByType = query({
  args: {
    companyId: v.id("crmCompanies"),
    type: v.union(
      v.literal("appraisal"),
      v.literal("plan-document"),
      v.literal("tax-return"),
      v.literal("financial-statement"),
      v.literal("legal"),
      v.literal("lender-doc"),
      v.literal("compliance"),
      v.literal("other")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dealDocuments")
      .withIndex("by_company_type", (q) =>
        q.eq("companyId", args.companyId).eq("type", args.type)
      )
      .order("desc")
      .collect();
  },
});

/**
 * Create a document record.
 */
export const create = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    name: v.string(),
    type: v.union(
      v.literal("appraisal"),
      v.literal("plan-document"),
      v.literal("tax-return"),
      v.literal("financial-statement"),
      v.literal("legal"),
      v.literal("lender-doc"),
      v.literal("compliance"),
      v.literal("other")
    ),
    url: v.optional(v.string()),
    storageId: v.optional(v.string()),
    uploadedBy: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    mimeType: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dealDocuments", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

/**
 * Delete a document record.
 */
export const remove = mutation({
  args: {
    id: v.id("dealDocuments"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Log an externally generated document.
 * Called by the HTTP action when a Python script or agent skill
 * generates a PDF for a client.
 */
export const logDocument = mutation({
	args: {
		companyId: v.optional(v.id("crmCompanies")),
		documentType: v.union(
			v.literal("preflight-internal"),
			v.literal("preflight-external"),
			v.literal("nda-receipt"),
			v.literal("engagement-letter"),
			v.literal("term-sheet"),
			v.literal("lender-package"),
			v.literal("stewardship-agreement"),
			v.literal("wiring-instructions"),
			v.literal("transaction-cost-disclosure"),
			v.literal("offer-summary"),
			v.literal("honest-review"),
			v.literal("calendar-120-day"),
			v.literal("1042-rollover-explainer"),
			v.literal("other"),
		),
		fileName: v.string(),
		filePath: v.optional(v.string()),
		fileSizeBytes: v.optional(v.number()),
		ref: v.optional(v.string()),
		companyName: v.optional(v.string()),
		generatedBy: v.optional(v.string()),
		status: v.union(
			v.literal("generated"),
			v.literal("sent"),
			v.literal("approved"),
			v.literal("superseded"),
		),
		metadata: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const documentId = await ctx.db.insert("externalDocumentLog", {
			...args,
			createdAt: Date.now(),
		});
		return documentId;
	},
});

/**
 * Log a document generation error.
 * Called by the HTTP action when a generation fails.
 */
export const logError = mutation({
	args: {
		companyId: v.optional(v.id("crmCompanies")),
		documentType: v.string(),
		ref: v.optional(v.string()),
		errorMessage: v.string(),
		errorStack: v.optional(v.string()),
		source: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const errorId = await ctx.db.insert("documentGenerationErrors", {
			...args,
			createdAt: Date.now(),
		});
		return errorId;
	},
});

/**
 * List all documents for a company, newest first.
 */
export const listByCompany = query({
	args: {
		companyId: v.id("crmCompanies"),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("externalDocumentLog")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.order("desc")
			.collect();
	},
});

/**
 * List all errors, newest first.
 */
export const listErrors = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db
			.query("documentGenerationErrors")
			.withIndex("by_createdAt")
			.order("desc")
			.take(50);
	},
});

/**
 * Update document status (e.g., generated → sent, or generated → approved).
 */
export const updateStatus = mutation({
	args: {
		id: v.id("externalDocumentLog"),
		status: v.union(
			v.literal("generated"),
			v.literal("sent"),
			v.literal("approved"),
			v.literal("superseded"),
		),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, { status: args.status });
	},
});

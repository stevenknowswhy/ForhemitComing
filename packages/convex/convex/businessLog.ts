import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";
import { toClientProjection } from "./lib/clientProjection";

// ── Admin All Activity ───────────────────────────────────

export const listAll = query({
	args: {
		cursor: v.optional(v.string()),
		limit: v.optional(v.number()),
		category: v.optional(v.string()),
		severity: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const pageSize = Math.min(args.limit ?? 50, 100);

		const result = await ctx.db
			.query("businessLog")
			.order("desc")
			.paginate({
				cursor: args.cursor ?? null,
				numItems: pageSize,
			});

		let items = result.page.filter((e) => e.deletedAt == null);
		if (args.category) {
			items = items.filter((e) => e.category === args.category);
		}
		if (args.severity && args.severity !== "all") {
			items = items.filter((e) => e.severity === args.severity);
		}

		return {
			items,
			cursor: result.continueCursor,
			hasMore: !result.isDone,
		};
	},
});

// ── Team Feed (single-stream via boolean index) ──────────
//
// teamVisible boolean index means this is a single-stream query.
// Cursor pagination works correctly — no multi-stream merge needed.
// Overfetch (pageSize * 3) to account for in-memory filter loss.

export const listForTeam = query({
	args: {
		cursor: v.optional(v.string()),
		limit: v.optional(v.number()),
		category: v.optional(v.string()),
		severity: v.optional(v.string()),
		roleFilter: v.optional(v.string()),
		companyId: v.optional(v.id("crmCompanies")),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const pageSize = Math.min(args.limit ?? 50, 100);

		const result = await ctx.db
			.query("businessLog")
			.withIndex("by_team_time", (q) => q.eq("teamVisible", true))
			.order("desc")
			.paginate({
				cursor: args.cursor ?? null,
				numItems: pageSize * 3,
			});

		let items = result.page.filter((e) => e.deletedAt == null);
		if (args.companyId) {
			items = items.filter((e) => e.companyId === args.companyId);
		}
		if (args.roleFilter) {
			items = items.filter((e) => e.relatedRoles?.includes(args.roleFilter!));
		}
		if (args.category) {
			items = items.filter((e) => e.category === args.category);
		}
		if (args.severity && args.severity !== "all") {
			items = items.filter((e) => e.severity === args.severity);
		}

		return {
			items: items.slice(0, pageSize),
			cursor: result.continueCursor,
			hasMore: !result.isDone,
		};
	},
});

// ── Client Preview (admin POV — uses toClientProjection) ─

export const listClientPreview = query({
	args: {
		companyId: v.id("crmCompanies"),
		cursor: v.optional(v.string()),
		limit: v.optional(v.number()),
		severity: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const pageSize = Math.min(args.limit ?? 25, 50);
		const now = Date.now();

		const result = await ctx.db
			.query("businessLog")
			.withIndex("by_company_client_time", (q) =>
				q.eq("companyId", args.companyId).eq("clientVisible", true),
			)
			.order("desc")
			.paginate({
				cursor: args.cursor ?? null,
				numItems: pageSize,
			});

		let items = result.page.filter(
			(e) =>
				e.deletedAt == null && e.publishedAt != null && e.publishedAt <= now,
		);

		if (args.severity && args.severity !== "all") {
			items = items.filter((e) => e.severity === args.severity);
		}

		return {
			items: items.map(toClientProjection),
			cursor: result.continueCursor,
			hasMore: !result.isDone,
		};
	},
});

// ── Stats (materialized, constant-time) ──────────────────

export const getStats = query({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx);
		const todayKey = new Date().toISOString().slice(0, 10);

		const [total, today, warnings, criticals] = await Promise.all([
			ctx.db
				.query("businessLogStats")
				.withIndex("by_window", (q) => q.eq("window", "total"))
				.first(),
			ctx.db
				.query("businessLogStats")
				.withIndex("by_window", (q) => q.eq("window", todayKey))
				.first(),
			ctx.db
				.query("businessLogStats")
				.withIndex("by_window", (q) => q.eq("window", "severity:warning"))
				.first(),
			ctx.db
				.query("businessLogStats")
				.withIndex("by_window", (q) => q.eq("window", "severity:critical"))
				.first(),
		]);

		return {
			total: total?.count ?? 0,
			today: today?.count ?? 0,
			warnings: warnings?.count ?? 0,
			criticals: criticals?.count ?? 0,
		};
	},
});

// ── auditLogs deep-link ──────────────────────────────────

export const getByCorrelationId = query({
	args: { correlationId: v.string() },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return ctx.db
			.query("auditLogs")
			.withIndex("by_correlation", (q) =>
				q.eq("correlationId", args.correlationId),
			)
			.collect();
	},
});

// ── Retention purge ──────────────────────────────────────

const THREE_YEARS_MS = 3 * 365 * 24 * 60 * 60 * 1000;

export const purgeExpiredActivityEvents = internalMutation({
	args: {},
	handler: async (ctx) => {
		const cutoff = Date.now() - THREE_YEARS_MS;
		const expired = await ctx.db
			.query("businessLog")
			.withIndex("by_retention_time", (q) =>
				q.eq("retentionClass", "activity").lt("_creationTime", cutoff),
			)
			.take(500);

		// We need to import incrementStats but it's in logEvent.ts
		// Since this is an internal mutation, we decrement stats directly
		const todayKey = new Date().toISOString().slice(0, 10);
		const count = expired.length;
		if (count > 0) {
			const totalRow = await ctx.db
				.query("businessLogStats")
				.withIndex("by_window", (q) => q.eq("window", "total"))
				.first();
			if (totalRow) {
				await ctx.db.patch(totalRow._id, {
					count: Math.max(0, totalRow.count - count),
					updatedAt: Date.now(),
				});
			}
		}

		await Promise.all(expired.map((e) => ctx.db.delete(e._id)));
		return { deleted: expired.length };
	},
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";
import { logEvent } from "./lib/logEvent";
import { LOG_ACTIONS } from "./lib/logEvents.constants";
import { resolveActor } from "./lib/resolveActor";

// ── Record "seen" (deduplicated per viewer per event) ────

export const recordSeen = mutation({
	args: {
		eventId: v.id("businessLog"),
		companyId: v.id("crmCompanies"),
		viewerId: v.optional(v.string()),
		viewerEmail: v.optional(v.string()),
		embedSessionId: v.optional(v.id("boxLogSessions")),
	},
	handler: async (ctx, args) => {
		// Deduplicate: one "seen" per viewer per event
		if (args.viewerId) {
			const existing = await ctx.db
				.query("businessLogInteractions")
				.withIndex("by_event_viewer", (q) =>
					q.eq("eventId", args.eventId).eq("viewerId", args.viewerId!),
				)
				.filter((q) => q.eq(q.field("interactionType"), "seen"))
				.first();

			if (existing) return existing._id; // already recorded
		}

		return ctx.db.insert("businessLogInteractions", {
			...args,
			interactionType: "seen",
			viewerType: "client",
		});
	},
});

// ── Record acknowledge ───────────────────────────────────

export const recordAcknowledged = mutation({
	args: {
		eventId: v.id("businessLog"),
		companyId: v.id("crmCompanies"),
		viewerId: v.optional(v.string()),
		viewerEmail: v.optional(v.string()),
		embedSessionId: v.optional(v.id("boxLogSessions")),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("businessLogInteractions", {
			...args,
			interactionType: "acknowledged",
			viewerType: "client",
		});
	},
});

// ── List by event ────────────────────────────────────────

export const listByEvent = query({
	args: { eventId: v.id("businessLog") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return ctx.db
			.query("businessLogInteractions")
			.withIndex("by_event", (q) => q.eq("eventId", args.eventId))
			.collect();
	},
});

// ── Unacknowledged count (for admin stats) ───────────────

export const getUnacknowledgedCount = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);

		// Get all client-visible events for this company
		const events = await ctx.db
			.query("businessLog")
			.withIndex("by_company_client_time", (q) =>
				q.eq("companyId", args.companyId).eq("clientVisible", true),
			)
			.filter((q) => q.eq(q.field("deletedAt"), undefined))
			.collect();

		// Get all acknowledgments for this company
		const acks = await ctx.db
			.query("businessLogInteractions")
			.withIndex("by_company_viewer", (q) => q.eq("companyId", args.companyId))
			.filter((q) => q.eq(q.field("interactionType"), "acknowledged"))
			.collect();

		const ackedEventIds = new Set(acks.map((a) => a.eventId));
		return events.filter((e) => !ackedEventIds.has(e._id)).length;
	},
});

// ── Log client feed opened (called from embed API) ──────

export const logFeedOpened = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		embedSessionId: v.optional(v.id("boxLogSessions")),
	},
	handler: async (ctx, args) => {
		const actor = await resolveActor(ctx);
		await logEvent(ctx, {
			...actor,
			eventType: LOG_ACTIONS.CLIENT_FEED_OPENED,
			category: "client",
			summary: `Client opened activity feed`,
			clientSummary: `You viewed the deal activity feed`,
			source: "box_embed",
			visibility: "external",
			companyId: args.companyId,
			scopeType: "company",
			scopeId: args.companyId,
			metadata: { embedSessionId: args.embedSessionId },
		});
	},
});

// ── Log client link opened (called from embed API) ───────

export const logLinkOpened = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		embedSessionId: v.optional(v.id("boxLogSessions")),
		linkLabel: v.string(),
	},
	handler: async (ctx, args) => {
		const actor = await resolveActor(ctx);
		await logEvent(ctx, {
			...actor,
			eventType: LOG_ACTIONS.CLIENT_LINK_OPENED,
			category: "client",
			summary: `Client opened link: ${args.linkLabel}`,
			source: "box_embed",
			visibility: "internal",
			companyId: args.companyId,
			scopeType: "company",
			scopeId: args.companyId,
			metadata: {
				linkLabel: args.linkLabel,
				embedSessionId: args.embedSessionId,
			},
		});
	},
});

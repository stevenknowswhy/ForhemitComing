import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";
import { logEvent } from "./lib/logEvent";
import { LOG_ACTIONS } from "./lib/logEvents.constants";
import { resolveActor } from "./lib/resolveActor";

// Use Web Crypto API (available in Convex runtime)
async function sha256(input: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateToken(): string {
	return crypto.randomUUID();
}

// ── Create session (admin generates Box link) ────────────

export const createSession = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		boxFolderId: v.optional(v.string()),
		viewerEmail: v.optional(v.string()),
		capabilities: v.array(v.string()),
		expiresInDays: v.number(),
		createdBy: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);

		const rawToken = generateToken();
		const tokenHash = await sha256(rawToken);

		const sessionId = await ctx.db.insert("boxLogSessions", {
			companyId: args.companyId,
			boxFolderId: args.boxFolderId,
			tokenHash,
			exchangeCount: 0,
			viewerEmail: args.viewerEmail,
			capabilities: args.capabilities,
			expiresAt: Date.now() + args.expiresInDays * 86_400_000,
			createdBy: args.createdBy,
		});

		// Log: Box link generated
		const actor = await resolveActor(ctx);
		await logEvent(ctx, {
			...actor,
			eventType: LOG_ACTIONS.BOX_LINK_GENERATED,
			category: "box",
			summary: `Box embed link generated for ${args.viewerEmail || "anonymous"}`,
			clientSummary: `A new activity link has been shared with you`,
			source: "admin_ui",
			visibility: "external",
			companyId: args.companyId,
			scopeType: "company",
			scopeId: args.companyId,
			entityType: "boxLogSession",
			entityId: sessionId,
			metadata: {
				viewerEmail: args.viewerEmail,
				expiresInDays: args.expiresInDays,
			},
		});

		return { sessionId, rawToken };
	},
});

// ── Exchange token (POST endpoint — one-time) ────────────

export const markExchanged = mutation({
	args: {
		sessionId: v.id("boxLogSessions"),
		sessionCookieHash: v.string(),
	},
	handler: async (ctx, args) => {
		const session = await ctx.db.get(args.sessionId);
		if (!session) throw new Error("Session not found");
		if (session.exchangeCount > 0) throw new Error("Token already exchanged");

		await ctx.db.patch(args.sessionId, {
			exchangedAt: Date.now(),
			sessionCookieHash: args.sessionCookieHash,
			exchangeCount: 1,
		});
	},
});

// ── Find by hash ─────────────────────────────────────────

export const findByHash = query({
	args: { tokenHash: v.string() },
	handler: async (ctx, args) => {
		return ctx.db
			.query("boxLogSessions")
			.withIndex("by_tokenHash", (q) => q.eq("tokenHash", args.tokenHash))
			.first();
	},
});

// ── Revoke ───────────────────────────────────────────────

export const revokeSession = mutation({
	args: { sessionId: v.id("boxLogSessions") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.sessionId, {
			revokedAt: Date.now(),
		});
	},
});

// ── List by company ──────────────────────────────────────

export const findByCompany = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return ctx.db
			.query("boxLogSessions")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.collect();
	},
});

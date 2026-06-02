/**
 * Business Log — Emitter
 *
 * Best-effort awaited. ALWAYS `await logEvent(ctx, payload)`.
 * Never `void logEvent(...)` — errors are caught internally and logged.
 *
 * SECURITY RULES (permanent — no exceptions):
 *
 * No client-visible event may contain:
 * - Internal notes or internal email addresses
 * - Internal IDs (Convex IDs, Clerk IDs)
 * - Cost data, fee amounts, or financial specifics
 * - AI prompts, model names, or outputs marked internal
 * - Audit log field-level diffs
 * - Individual team member names (use "Forhemit Team")
 *
 * Enforced by toClientProjection (response layer)
 * and by fail-closed check below (write layer).
 */

import type { MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { LOG_RETENTION } from "./logEvents.constants";

const METADATA_MAX_BYTES = 2000;
const PUBLIC_METADATA_MAX_BYTES = 1000;
const MAX_LINKS = 5;

// ── Payload types (discriminated union) ──────────────────

interface InternalEvent {
	visibility: "system" | "internal";
	clientSummary?: never;
}

interface ClientVisibleEvent {
	visibility: "external" | "client";
	clientSummary: string; // REQUIRED — TypeScript enforces
}

type LogLink = {
	label: string;
	type: "box_file" | "box_folder" | "document" | "company" | "external";
	href?: string;
	boxFileId?: string;
	boxFolderId?: string;
	clientVisible: boolean;
};

export type LogPayload = {
	eventType: string;
	category:
		| "deal"
		| "task"
		| "document"
		| "email"
		| "agent"
		| "auth"
		| "system"
		| "journal"
		| "tracker"
		| "box"
		| "client";
	summary: string;
	actorType: "user" | "system" | "agent" | "webhook" | "client" | "box";
	actorId?: string;
	actorLabel?: string;
	clientActorLabel?: string;
	source:
		| "admin_ui"
		| "client_portal"
		| "box_embed"
		| "webhook"
		| "agent"
		| "api"
		| "scheduler";
	entityType?: string;
	entityId?: string;
	companyId?: Id<"crmCompanies">;
	scopeType?: "company" | "user" | "system";
	scopeId?: string;
	correlationId?: string;
	idempotencyKey?: string;
	occurredAt?: number; // default: Date.now()
	publishedAt?: number;
	severity?: "info" | "warning" | "critical";
	relatedRoles?: string[];
	metadata?: Record<string, unknown>;
	publicMetadata?: Record<string, unknown>;
	links?: LogLink[];
} & (InternalEvent | ClientVisibleEvent);

// ── Sanitizer ────────────────────────────────────────────

function sanitize(obj: unknown, maxBytes: number) {
	if (!obj) return undefined;
	const s = JSON.stringify(obj);
	if (s.length <= maxBytes) return obj;
	console.warn("[businessLog] metadata truncated", {
		size: s.length,
		limit: maxBytes,
	});
	return {
		_truncated: true,
		_originalSize: s.length,
		...Object.fromEntries(
			Object.entries(obj as Record<string, unknown>).filter(
				([, v]) => typeof v !== "object" && typeof v !== "function",
			),
		),
	};
}

// ── Stats updater ────────────────────────────────────────

async function incrementStats(ctx: MutationCtx, severity: string, delta = 1) {
	const todayKey = new Date().toISOString().slice(0, 10);
	const windows = ["total", todayKey];
	if (severity !== "info") windows.push(`severity:${severity}`);

	await Promise.all(
		windows.map(async (window) => {
			const existing = await ctx.db
				.query("businessLogStats")
				.withIndex("by_window", (q) => q.eq("window", window))
				.first();

			if (existing) {
				await ctx.db.patch(existing._id, {
					count: Math.max(0, existing.count + delta),
					updatedAt: Date.now(),
				});
			} else if (delta > 0) {
				await ctx.db.insert("businessLogStats", {
					window,
					count: delta,
					updatedAt: Date.now(),
				});
			}
		}),
	);
}

// ── Main emitter ─────────────────────────────────────────

/**
 * Best-effort awaited emitter.
 *
 * ALWAYS `await logEvent(ctx, payload)` — never `void logEvent(...)`.
 * Errors are caught internally and logged; they never block the caller.
 *
 * FAIL-CLOSED: clientVisible events require clientSummary.
 * TypeScript enforces this at compile time; runtime check is the backstop.
 */
export async function logEvent(ctx: MutationCtx, payload: LogPayload) {
	try {
		const teamVisible = payload.visibility !== "system";
		const clientVisible =
			payload.visibility === "external" || payload.visibility === "client";

		// FAIL CLOSED: clientVisible requires clientSummary
		if (clientVisible && !payload.clientSummary) {
			throw new Error(
				`[businessLog] clientVisible event "${payload.eventType}" ` +
					`is missing required clientSummary. Refusing to write.`,
			);
		}

		// Idempotency guard
		if (payload.idempotencyKey) {
			const existing = await ctx.db
				.query("businessLog")
				.withIndex("by_idempotency", (q) =>
					q.eq("idempotencyKey", payload.idempotencyKey),
				)
				.first();
			if (existing) return; // already recorded — skip
		}

		const retentionClass = LOG_RETENTION[payload.eventType];

		if (!retentionClass) {
			throw new Error(
				`[businessLog] No retention class for eventType: "${payload.eventType}". ` +
					`Add it to LOG_RETENTION in logEvents.constants.ts`,
			);
		}

		// Truncate links to max 5
		const links =
			payload.links && payload.links.length > MAX_LINKS
				? (console.warn("[businessLog] links truncated", {
						count: payload.links.length,
						limit: MAX_LINKS,
					}),
					payload.links.slice(0, MAX_LINKS))
				: payload.links;

		await ctx.db.insert("businessLog", {
			eventVersion: 1,
			severity: payload.severity ?? "info",
			occurredAt: payload.occurredAt ?? Date.now(),
			publishedAt: payload.publishedAt ?? Date.now(),
			deletedAt: undefined,
			...payload,
			teamVisible,
			clientVisible,
			retentionClass: retentionClass ?? "activity",
			links,
			metadata: sanitize(payload.metadata, METADATA_MAX_BYTES),
			publicMetadata: sanitize(
				payload.publicMetadata,
				PUBLIC_METADATA_MAX_BYTES,
			),
		});

		await incrementStats(ctx, payload.severity ?? "info");
	} catch (err) {
		// Never block the main mutation — re-throw dev guard errors
		if (
			err instanceof Error &&
			(err.message.includes("No retention class") ||
				err.message.includes("missing required clientSummary"))
		) {
			throw err;
		}
		console.error("[businessLog] write failed", {
			eventType: payload.eventType,
			companyId: payload.companyId,
			entityId: payload.entityId,
			err,
		});
	}
}

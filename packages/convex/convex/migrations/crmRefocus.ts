import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

// ── Stage Migration Map ──────────────────────────────────────────────────────

const STAGE_MAP: Record<string, string> = {
	"First contact": "Identified",
	"Intro call": "Connected",
	"NDA sent": "Engaged",
	Feasibility: "Engaged",
	"Term sheet": "Committed",
	"LOI signed": "In Process",
	Closed: "Closed",
	"On hold": "Recycled",
	Dead: "Lost",
};

// ── Activity Type Migration Map ──────────────────────────────────────────────

const ACTIVITY_TYPE_MAP: Record<string, string> = {
	note: "Other",
	call: "Call",
	email: "Email",
	meeting: "Meeting",
	stage_change: "Other",
	task: "Other",
};

// ── Revenue/Size Parsing ─────────────────────────────────────────────────────

function parseRevenueRange(revenue: string | undefined): string | undefined {
	if (!revenue) return undefined;
	const cleaned = revenue.replace(/[^0-9.MKmk]/g, "").toLowerCase();
	if (!cleaned) return undefined;

	let value: number;
	if (cleaned.includes("m")) {
		value = parseFloat(cleaned.replace("m", "")) * 1_000_000;
	} else if (cleaned.includes("k")) {
		value = parseFloat(cleaned.replace("k", "")) * 1_000;
	} else {
		value = parseFloat(cleaned);
	}

	if (isNaN(value)) return "Unknown";
	if (value < 500_000) return "Under $500K";
	if (value < 1_000_000) return "$500K – $1M";
	if (value < 3_000_000) return "$1M – $3M";
	if (value < 5_000_000) return "$3M – $5M";
	if (value < 10_000_000) return "$5M – $10M";
	return "$10M+";
}

function parseEmployeeRange(size: string | undefined): string | undefined {
	if (!size) return undefined;
	const num = parseInt(size.replace(/[^0-9]/g, ""), 10);
	if (isNaN(num)) return "Unknown";
	if (num <= 5) return "1–5";
	if (num <= 20) return "6–20";
	if (num <= 50) return "21–50";
	if (num <= 100) return "51–100";
	return "100+";
}

// ── Migration: Companies ─────────────────────────────────────────────────────

/**
 * Migrate company stages and parse revenue/size fields.
 * Run once. Safe to re-run (idempotent for fields already set).
 */
export const migrateCompanies = internalMutation({
	args: { batchSize: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const batchSize = args.batchSize ?? 50;
		const companies = await ctx.db.query("crmCompanies").take(batchSize);

		let migrated = 0;
		for (const company of companies) {
			const updates: Record<string, unknown> = {};

			// Stage migration — only if still using old stage names
			if (STAGE_MAP[company.stage]) {
				updates.stage = STAGE_MAP[company.stage];
			}

			// Revenue range parsing
			if (!company.revenueRange && company.revenue) {
				updates.revenueRange = parseRevenueRange(company.revenue);
			}

			// Employee range parsing
			if (!company.employeeCountRange && company.size) {
				updates.employeeCountRange = parseEmployeeRange(company.size);
			}

			if (Object.keys(updates).length > 0) {
				await ctx.db.patch(company._id, updates);
				migrated++;
			}
		}

		return {
			processed: companies.length,
			migrated,
			hasMore: companies.length === batchSize,
		};
	},
});

// ── Migration: Contacts ──────────────────────────────────────────────────────

/**
 * Infer contactType for existing contacts based on role and company FKs.
 * Run once. Safe to re-run (won't overwrite existing contactType).
 */
export const migrateContacts = internalMutation({
	args: { batchSize: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const batchSize = args.batchSize ?? 50;
		const contacts = await ctx.db.query("crmContacts").take(batchSize);

		// Build a map of brokerContactIds from companies
		const companies = await ctx.db.query("crmCompanies").collect();
		const brokerContactIds = new Set(
			companies.map((c) => c.brokerContactId).filter(Boolean),
		);
		const sellerContactIds = new Set(
			companies.map((c) => c.sellerContactId).filter(Boolean),
		);

		let migrated = 0;
		for (const contact of contacts) {
			// Skip if contactType already set
			if (contact.contactType) continue;

			let contactType = "other";

			if (contact.isPrimary || sellerContactIds.has(contact._id)) {
				contactType = "owner";
			} else if (brokerContactIds.has(contact._id)) {
				contactType = "broker";
			} else if (
				contact.role?.toLowerCase().includes("owner") ||
				contact.role?.toLowerCase().includes("seller")
			) {
				contactType = "owner";
			} else if (contact.role?.toLowerCase().includes("broker")) {
				contactType = "broker";
			} else if (
				contact.role?.toLowerCase().includes("cpa") ||
				contact.role?.toLowerCase().includes("attorney") ||
				contact.role?.toLowerCase().includes("advisor") ||
				contact.role?.toLowerCase().includes("accountant")
			) {
				contactType = "advisor";
			}

			await ctx.db.patch(contact._id, { contactType });
			migrated++;
		}

		return {
			processed: contacts.length,
			migrated,
			hasMore: contacts.length === batchSize,
		};
	},
});

// ── Migration: Activities → Interactions ─────────────────────────────────────

/**
 * Copy crmActivities records into crmInteractions.
 * Run once. NOT idempotent — will create duplicates if run twice.
 * Check for existing records first.
 */
export const migrateActivitiesToInteractions = internalMutation({
	args: { batchSize: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const batchSize = args.batchSize ?? 50;
		const activities = await ctx.db.query("crmActivities").take(batchSize);

		let migrated = 0;
		for (const activity of activities) {
			// Build summary from title + description
			const summary = activity.description
				? `${activity.title}: ${activity.description}`
				: activity.title;

			await ctx.db.insert("crmInteractions", {
				type: ACTIVITY_TYPE_MAP[activity.type] || "Other",
				summary,
				companyId: activity.companyId,
				performedBy: activity.performedBy,
				date: activity.date,
				createdAt: activity.createdAt,
			});
			migrated++;
		}

		return {
			processed: activities.length,
			migrated,
			hasMore: activities.length === batchSize,
		};
	},
});

// ── Migration: Owner Contacts → Primary Owner FK ────────────────────────────

/**
 * Link primary owner contacts to their companies via primaryOwnerContactId.
 * Run once. Safe to re-run.
 */
export const linkPrimaryOwners = internalMutation({
	args: { batchSize: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const batchSize = args.batchSize ?? 50;
		const companies = await ctx.db.query("crmCompanies").take(batchSize);

		let linked = 0;
		for (const company of companies) {
			// Skip if already linked
			if (company.primaryOwnerContactId) continue;

			// Find the primary owner contact for this company
			const contacts = await ctx.db
				.query("crmContacts")
				.withIndex("by_company", (q) => q.eq("companyId", company._id))
				.collect();

			const primaryOwner = contacts.find(
				(c) => c.isPrimary || c.contactType === "owner",
			);
			if (primaryOwner) {
				await ctx.db.patch(company._id, {
					primaryOwnerContactId: primaryOwner._id,
				});
				linked++;
			}
		}

		return {
			processed: companies.length,
			linked,
			hasMore: companies.length === batchSize,
		};
	},
});

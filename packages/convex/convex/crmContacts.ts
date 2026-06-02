import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

// ============================================
// CRM Contacts Queries
// ============================================

/**
 * Get all contacts for a company
 */
export const listByCompany = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("crmContacts")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.order("asc")
			.collect();
	},
});

/**
 * Get a single contact by ID
 */
export const get = query({
	args: { id: v.id("crmContacts") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db.get(args.id);
	},
});

/**
 * Search contacts by name. Used by form pickers ("select existing or create new").
 * Searches firstName + lastName. Returns matches ordered by lastName.
 */
export const searchContacts = query({
	args: {
		searchTerm: v.string(),
		contactType: v.optional(v.string()), // filter by type
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 20;
		const term = args.searchTerm.toLowerCase();

		// Get all contacts (or filter by type) and filter in memory
		// Convex doesn't support full-text search natively, so we do prefix matching
		let results;
		if (args.contactType) {
			results = await ctx.db
				.query("crmContacts")
				.withIndex("by_type", (q) => q.eq("contactType", args.contactType!))
				.collect();
		} else {
			results = await ctx.db.query("crmContacts").collect();
		}

		return results
			.filter((c) => {
				const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
				return (
					fullName.includes(term) ||
					(c.email?.toLowerCase().includes(term) ?? false) ||
					(c.firm?.toLowerCase().includes(term) ?? false)
				);
			})
			.sort((a, b) => a.lastName.localeCompare(b.lastName))
			.slice(0, limit);
	},
});

/**
 * List contacts by type. Used to populate advisor/broker pickers.
 */
export const listByType = query({
	args: {
		contactType: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 50;
		return await ctx.db
			.query("crmContacts")
			.withIndex("by_type", (q) => q.eq("contactType", args.contactType))
			.order("asc")
			.take(limit);
	},
});

// ============================================
// CRM Contacts Mutations
// ============================================

/**
 * Create a new contact
 */
export const create = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		firstName: v.string(),
		lastName: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		role: v.optional(v.string()),
		isPrimary: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const now = Date.now();

		// If setting as primary, unset any existing primary contact
		if (args.isPrimary) {
			const existingContacts = await ctx.db
				.query("crmContacts")
				.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
				.collect();

			for (const contact of existingContacts) {
				if (contact.isPrimary) {
					await ctx.db.patch(contact._id, { isPrimary: false });
				}
			}
		}

		const contactId = await ctx.db.insert("crmContacts", {
			companyId: args.companyId,
			firstName: args.firstName,
			lastName: args.lastName,
			email: args.email,
			phone: args.phone,
			role: args.role,
			isPrimary: args.isPrimary ?? false,
			createdAt: now,
			updatedAt: now,
		});

		// Log activity
		await ctx.db.insert("crmActivities", {
			companyId: args.companyId,
			type: "note",
			title: "Contact added",
			description: `${args.firstName} ${args.lastName} added as ${args.role || "contact"}`,
			date: new Date().toISOString().split("T")[0],
			createdAt: now,
		});

		return contactId;
	},
});

/**
 * Update an existing contact
 */
export const update = mutation({
	args: {
		id: v.id("crmContacts"),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		role: v.optional(v.string()),
		isPrimary: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const { id, ...updates } = args;
		const contact = await ctx.db.get(id);

		if (!contact) {
			throw new Error("Contact not found");
		}

		const now = Date.now();

		// If setting as primary, unset any existing primary contact
		if (updates.isPrimary) {
			const existingContacts = await ctx.db
				.query("crmContacts")
				.withIndex("by_company", (q) => q.eq("companyId", contact.companyId))
				.collect();

			for (const c of existingContacts) {
				if (c._id !== id && c.isPrimary) {
					await ctx.db.patch(c._id, { isPrimary: false });
				}
			}
		}

		await ctx.db.patch(id, {
			...updates,
			updatedAt: now,
		});

		return id;
	},
});

/**
 * Create a broker contact with broker-specific fields.
 * Used by the Quick Send engagement letter workflow.
 */
export const createBrokerContact = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		firstName: v.string(),
		lastName: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		firm: v.optional(v.string()),
		website: v.optional(v.string()),
		dateMet: v.optional(v.string()),
		brokerMarket: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const now = Date.now();

		const contactId = await ctx.db.insert("crmContacts", {
			companyId: args.companyId,
			firstName: args.firstName,
			lastName: args.lastName,
			email: args.email,
			phone: args.phone,
			role: "Broker",
			contactType: "broker",
			firm: args.firm,
			website: args.website,
			dateMet: args.dateMet || new Date().toISOString().split("T")[0],
			brokerMarket: args.brokerMarket,
			isPrimary: false,
			createdAt: now,
			updatedAt: now,
		});

		// Log activity
		await ctx.db.insert("crmActivities", {
			companyId: args.companyId,
			type: "note",
			title: "Broker contact added",
			description: `${args.firstName} ${args.lastName}${args.firm ? ` (${args.firm})` : ""} added as broker via Engagement Letter Quick Send`,
			date: new Date().toISOString().split("T")[0],
			createdAt: now,
		});

		return contactId;
	},
});

/**
 * Delete a contact
 */
export const remove = mutation({
	args: { id: v.id("crmContacts") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const contact = await ctx.db.get(args.id);
		if (!contact) {
			throw new Error("Contact not found");
		}

		await ctx.db.delete(args.id);

		// Log activity (only if contact was linked to a company)
		if (contact.companyId) {
			await ctx.db.insert("crmActivities", {
				companyId: contact.companyId,
				type: "note",
				title: "Contact removed",
				description: `${contact.firstName} ${contact.lastName} removed`,
				date: new Date().toISOString().split("T")[0],
				createdAt: Date.now(),
			});
		}

		return { success: true };
	},
});

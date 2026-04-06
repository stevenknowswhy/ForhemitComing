import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// ============================================
// CRM Contacts Queries
// ============================================

/**
 * Get all contacts for a company
 */
export const listByCompany = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
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
    return await ctx.db.get(args.id);
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
 * Delete a contact
 */
export const remove = mutation({
  args: { id: v.id("crmContacts") },
  handler: async (ctx, args) => {
    const contact = await ctx.db.get(args.id);
    if (!contact) {
      throw new Error("Contact not found");
    }

    await ctx.db.delete(args.id);

    // Log activity
    await ctx.db.insert("crmActivities", {
      companyId: contact.companyId,
      type: "note",
      title: "Contact removed",
      description: `${contact.firstName} ${contact.lastName} removed`,
      date: new Date().toISOString().split("T")[0],
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

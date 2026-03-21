import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List all templates
export const list = query({
  args: {
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("draft"),
      v.literal("archived")
    )),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("documentTemplates")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("documentTemplates")
      .order("desc")
      .collect();
  },
});

// Get a single template by ID
export const get = query({
  args: { id: v.id("documentTemplates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get a template by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documentTemplates")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Create a new template
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    version: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("draft"),
      v.literal("archived")
    ),
    category: v.optional(v.string()),
    formKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("documentTemplates", {
      ...args,
      createdAt: Date.now(),
    });
    return { success: true, id };
  },
});

// Update a template
export const update = mutation({
  args: {
    id: v.id("documentTemplates"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    version: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("draft"),
      v.literal("archived")
    )),
    category: v.optional(v.string()),
    formKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }
    cleanUpdates.updatedAt = Date.now();
    await ctx.db.patch(id, cleanUpdates);
    return { success: true };
  },
});

// Seed all document templates
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const templatesToSeed: Array<{
      name: string;
      slug: string;
      description: string;
      version: string;
      status: "active" | "draft" | "archived";
      category?: string;
      formKey?: string;
    }> = [
      {
        name: "ESOP Cost Reference Calculator",
        slug: "esop-cost-reference",
        description:
          "Interactive cost reference calculator for ESOP transactions. Models sunk costs, structural costs, universal costs, and §1042 tax deferral benefits across deal stages.",
        version: "2.0",
        status: "active",
        category: "Financial Analysis",
        formKey: "esop-cost-reference",
      },
      {
        name: "ESOP Head-to-Head Comparison",
        slug: "esop-head-to-head",
        description:
          "Compare two ESOP transaction structures side-by-side. Analyze valuation differences, tax implications, financing requirements, and shareholder outcomes.",
        version: "1.0",
        status: "active",
        category: "Financial Analysis",
        formKey: "esop-head-to-head",
      },
      {
        name: "ESOP Term Sheet",
        slug: "esop-term-sheet",
        description:
          "Interactive term sheet for ESOP acquisitions. Models capital structure, debt service coverage, seller economics, and transaction scenarios with SBA-compliant underwriting.",
        version: "1.0",
        status: "active",
        category: "Transaction Documents",
        formKey: "esop-term-sheet",
      },
      {
        name: "Deal Intake — Credit Memo",
        slug: "deal-intake",
        description:
          "Four-step deal intake wizard for generating illustrative credit memos. Captures business info, capital stack structure, DSCR scenarios, and open items for lender submission.",
        version: "1.0",
        status: "active",
        category: "Transaction Documents",
        formKey: "deal-intake",
      },
    ];

    const seededIds: { slug: string; id: string; seeded: boolean }[] = [];

    // First, get all existing templates to check what's there
    const existingTemplates = await ctx.db
      .query("documentTemplates")
      .collect();
    
    const existingSlugs = new Set(existingTemplates.map(t => t.slug));
    console.log("Existing templates:", existingSlugs);

    for (const template of templatesToSeed) {
      if (existingSlugs.has(template.slug)) {
        // Find existing and update it
        const existing = await ctx.db
          .query("documentTemplates")
          .withIndex("by_slug", (q) => q.eq("slug", template.slug))
          .first();
        
        if (existing) {
          await ctx.db.patch(existing._id, {
            name: template.name,
            description: template.description,
            version: template.version,
            status: template.status,
            category: template.category,
            formKey: template.formKey,
            updatedAt: Date.now(),
          });
          seededIds.push({ slug: template.slug, id: existing._id, seeded: false });
        }
      } else {
        const id = await ctx.db.insert("documentTemplates", {
          name: template.name,
          slug: template.slug,
          description: template.description,
          version: template.version,
          status: template.status,
          category: template.category,
          formKey: template.formKey,
          createdAt: Date.now(),
        });
        seededIds.push({ slug: template.slug, id, seeded: true });
      }
    }

    return { success: true, templates: seededIds };
  },
});

// Force seed all templates - creates missing ones without checking existing
export const forceSeedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const templatesToSeed = [
      {
        name: "ESOP Cost Reference Calculator",
        slug: "esop-cost-reference",
        description:
          "Interactive cost reference calculator for ESOP transactions. Models sunk costs, structural costs, universal costs, and §1042 tax deferral benefits across deal stages.",
        version: "2.0",
        status: "active" as const,
        category: "Financial Analysis",
        formKey: "esop-cost-reference",
      },
      {
        name: "ESOP Head-to-Head Comparison",
        slug: "esop-head-to-head",
        description:
          "Compare two ESOP transaction structures side-by-side. Analyze valuation differences, tax implications, financing requirements, and shareholder outcomes.",
        version: "1.0",
        status: "active" as const,
        category: "Financial Analysis",
        formKey: "esop-head-to-head",
      },
      {
        name: "ESOP Term Sheet",
        slug: "esop-term-sheet",
        description:
          "Interactive term sheet for ESOP acquisitions. Models capital structure, debt service coverage, seller economics, and transaction scenarios with SBA-compliant underwriting.",
        version: "1.0",
        status: "active" as const,
        category: "Transaction Documents",
        formKey: "esop-term-sheet",
      },
      {
        name: "Deal Intake — Credit Memo",
        slug: "deal-intake",
        description:
          "Four-step deal intake wizard for generating illustrative credit memos. Captures business info, capital stack structure, DSCR scenarios, and open items for lender submission.",
        version: "1.0",
        status: "active" as const,
        category: "Transaction Documents",
        formKey: "deal-intake",
      },
    ];

    const results: { slug: string; id: string; action: string }[] = [];

    for (const template of templatesToSeed) {
      const existing = await ctx.db
        .query("documentTemplates")
        .withIndex("by_slug", (q) => q.eq("slug", template.slug))
        .first();

      if (existing) {
        // Delete existing and recreate
        await ctx.db.delete(existing._id);
      }

      // Create new
      const id = await ctx.db.insert("documentTemplates", {
        name: template.name,
        slug: template.slug,
        description: template.description,
        version: template.version,
        status: template.status,
        category: template.category,
        formKey: template.formKey,
        createdAt: Date.now(),
      });
      results.push({ slug: template.slug, id, action: "created" });
    }

    return { success: true, templates: results };
  },
});

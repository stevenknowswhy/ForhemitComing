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
        name: "Engagement Letter",
        slug: "engagement-letter",
        description:
          "Client engagement letter for Forhemit Transition Stewardship. Includes revised tail provision, ERISA/tax disclaimers, limitation of liability, indemnification, and dispute resolution.",
        version: "1.1",
        status: "active",
        category: "Transaction Documents",
        formKey: "engagement-letter",
      },
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
      {
        name: "SBA ESOP Lender Package",
        slug: "sba-esop-package",
        description:
          "Seven-step form for generating SBA ESOP lender package executive summaries. Captures lender info, financials, management team, advisory team, compliance checklist, and generates complete LGPC-ready documentation.",
        version: "1.0",
        status: "active",
        category: "Transaction Documents",
        formKey: "sba-esop-package",
      },
      {
        name: "ESOP Deal Flow System",
        slug: "deal-flow-system",
        description:
          "Three-stage deal intake and due diligence system. Stage 1: First Contact (intake & qualification). Stage 2: Feasibility Study (scoring matrix & Go/No-Go). Stage 3: Due Diligence (document checklists & critical path tracking).",
        version: "1.0",
        status: "active",
        category: "Transaction Documents",
        formKey: "deal-flow-system",
      },
      {
        name: "Lender Q&A Tracker",
        slug: "lender-qa-tracker",
        description:
          "Three-step wizard for tracking lender questions and conditions. Step 1: Deal Header (company, lender, timeline). Step 2: Q&A Items (categorized tracking with status, priority, due dates). Step 3: Summary & Print (completion metrics, category progress, export).",
        version: "1.0",
        status: "active",
        category: "Transaction Documents",
        formKey: "lender-qa-tracker",
      },
      {
        name: "ESOP Repayment & Amortization Model",
        slug: "esop-repayment-model",
        description:
          "Interactive financial modeling for SBA loan and seller note analysis. Step 1: Deal Header. Step 2: Debt Structure (SBA loan, seller note, projections). Step 3: Model Output (amortization schedule, DSCR analysis, scenario testing, paydown charts).",
        version: "1.0",
        status: "active",
        category: "Financial Analysis",
        formKey: "esop-repayment-model",
      },
      {
        name: "Introduction Letter Generator",
        slug: "intro-letter-generator",
        description:
          "Professional introduction letter generator for Forhemit. Features 9 recipient types (Sellers, Brokers, Attorneys, Lenders, ESOP Admins, Valuation Firms, CPAs, Wealth Advisors, Accountants) with personalized templates and live preview. Export to PDF.",
        version: "1.0",
        status: "active",
        category: "Marketing & Outreach",
        formKey: "intro-letter-generator",
      },
      {
        name: "Transition Stewardship Agreement",
        slug: "stewardship-agreement",
        description:
          "Post-close transition stewardship agreement. 12-section form covering term selection (12/18/24 months), fee calculation (2.5% EBITDA), six service pillars, lender & trustee disclosure, confidentiality, indemnification, and dispute resolution.",
        version: "1.0",
        status: "active",
        category: "Transaction Documents",
        formKey: "stewardship-agreement",
      },
      {
        name: "Engagement Letter (Standalone)",
        slug: "engagement-letter-standalone",
        description:
          "Standard sell-side M&A engagement letter. Self-contained version that does not push shared fields (Company, Reference, Date) to other documents.",
        version: "1.0",
        status: "active",
        category: "Transaction Documents",
        formKey: "engagement-letter-standalone",
      },
      {
        name: "Transition Stewardship Agreement (Standalone)",
        slug: "stewardship-agreement-standalone",
        description:
          "Post-close transition stewardship agreement. Self-contained version that does not pull shared fields from the Engagement Letter. Includes full 12-section form and fee calculation.",
        version: "1.0",
        status: "active",
        category: "Transaction Documents",
        formKey: "stewardship-agreement-standalone",
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
        name: "Engagement Letter",
        slug: "engagement-letter",
        description:
          "Client engagement letter for Forhemit Transition Stewardship. Includes revised tail provision, ERISA/tax disclaimers, limitation of liability, indemnification, and dispute resolution.",
        version: "1.1",
        status: "active" as const,
        category: "Transaction Documents",
        formKey: "engagement-letter",
      },
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
      {
        name: "SBA ESOP Lender Package",
        slug: "sba-esop-package",
        description:
          "Seven-step form for generating SBA ESOP lender package executive summaries. Captures lender info, financials, management team, advisory team, compliance checklist, and generates complete LGPC-ready documentation.",
        version: "1.0",
        status: "active" as const,
        category: "Transaction Documents",
        formKey: "sba-esop-package",
      },
      {
        name: "ESOP Deal Flow System",
        slug: "deal-flow-system",
        description:
          "Three-stage deal intake and due diligence system. Stage 1: First Contact (intake & qualification). Stage 2: Feasibility Study (scoring matrix & Go/No-Go). Stage 3: Due Diligence (document checklists & critical path tracking).",
        version: "1.0",
        status: "active" as const,
        category: "Transaction Documents",
        formKey: "deal-flow-system",
      },
      {
        name: "Lender Q&A Tracker",
        slug: "lender-qa-tracker",
        description:
          "Three-step wizard for tracking lender questions and conditions. Step 1: Deal Header (company, lender, timeline). Step 2: Q&A Items (categorized tracking with status, priority, due dates). Step 3: Summary & Print (completion metrics, category progress, export).",
        version: "1.0",
        status: "active" as const,
        category: "Transaction Documents",
        formKey: "lender-qa-tracker",
      },
      {
        name: "ESOP Repayment & Amortization Model",
        slug: "esop-repayment-model",
        description:
          "Interactive financial modeling for SBA loan and seller note analysis. Step 1: Deal Header. Step 2: Debt Structure (SBA loan, seller note, projections). Step 3: Model Output (amortization schedule, DSCR analysis, scenario testing, paydown charts).",
        version: "1.0",
        status: "active" as const,
        category: "Financial Analysis",
        formKey: "esop-repayment-model",
      },
      {
        name: "Introduction Letter Generator",
        slug: "intro-letter-generator",
        description:
          "Professional introduction letter generator for Forhemit. Features 9 recipient types (Sellers, Brokers, Attorneys, Lenders, ESOP Admins, Valuation Firms, CPAs, Wealth Advisors, Accountants) with personalized templates and live preview. Export to PDF.",
        version: "1.0",
        status: "active" as const,
        category: "Marketing & Outreach",
        formKey: "intro-letter-generator",
      },
      {
        name: "Transition Stewardship Agreement",
        slug: "stewardship-agreement",
        description:
          "Post-close transition stewardship agreement. 12-section form covering term selection (12/18/24 months), fee calculation (2.5% EBITDA), six service pillars, lender & trustee disclosure, confidentiality, indemnification, and dispute resolution.",
        version: "1.0",
        status: "active" as const,
        category: "Transaction Documents",
        formKey: "stewardship-agreement",
      },
      {
        name: "Engagement Letter (Standalone)",
        slug: "engagement-letter-standalone",
        description:
          "Standard sell-side M&A engagement letter. Self-contained version that does not push shared fields (Company, Reference, Date) to other documents.",
        version: "1.0",
        status: "active" as const,
        category: "Transaction Documents",
        formKey: "engagement-letter-standalone",
      },
      {
        name: "Transition Stewardship Agreement (Standalone)",
        slug: "stewardship-agreement-standalone",
        description:
          "Post-close transition stewardship agreement. Self-contained version that does not pull shared fields from the Engagement Letter. Includes full 12-section form and fee calculation.",
        version: "1.0",
        status: "active" as const,
        category: "Transaction Documents",
        formKey: "stewardship-agreement-standalone",
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

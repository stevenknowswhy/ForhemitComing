import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// ============================================
// Agent Outputs Queries
// ============================================

/**
 * Get all agent outputs for a company/deal
 */
export const listByCompany = query({
  args: {
    companyId: v.id("crmCompanies"),
    gate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("agentOutputs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.gate !== undefined) {
      q = q.filter((q) => q.eq(q.field("gate"), args.gate));
    }

    return await q.order("desc").collect();
  },
});

/**
 * Get a single agent output by ID
 */
export const get = query({
  args: { id: v.id("agentOutputs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get outputs by agent for a company
 */
export const getByAgent = query({
  args: {
    agentId: v.string(),
    companyId: v.id("crmCompanies"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentOutputs")
      .withIndex("by_agent", (q) =>
        q.eq("agentId", args.agentId).eq("companyId", args.companyId)
      )
      .order("desc")
      .collect();
  },
});

/**
 * Get outputs by status (e.g., all pending_review across deals)
 */
export const getPendingReview = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentOutputs")
      .withIndex("by_status", (q) => q.eq("status", "pending_review"))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

// ============================================
// Agent Outputs Mutations
// ============================================

/**
 * Estimate cost in USD based on token usage and model.
 */
function estimateCost(
  model: string,
  usage: { promptTokens: number; completionTokens: number }
): number {
  const rates: Record<string, { input: number; output: number }> = {
    "anthropic/claude-sonnet-4": { input: 3.0, output: 15.0 },
    "anthropic/claude-haiku": { input: 0.25, output: 1.25 },
    "gpt-4o": { input: 2.5, output: 10.0 },
    "gpt-4o-mini": { input: 0.15, output: 0.6 },
  };

  const rate =
    Object.entries(rates).find(([key]) => model.startsWith(key))?.[1] ??
    { input: 3.0, output: 15.0 };

  const inputCost = (usage.promptTokens / 1_000_000) * rate.input;
  const outputCost = (usage.completionTokens / 1_000_000) * rate.output;

  return Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000;
}

/**
 * Store an agent output artifact.
 * Called by processAgentQueue after an agent produces work.
 */
export const store = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    agentId: v.string(),
    templateId: v.string(),
    gate: v.number(),
    content: v.string(),
    contentType: v.union(
      v.literal("markdown"),
      v.literal("json"),
      v.literal("structured")
    ),
    provider: v.string(),
    model: v.string(),
    usage: v.object({
      promptTokens: v.number(),
      completionTokens: v.number(),
      totalTokens: v.number(),
    }),
    source: v.union(v.literal("claude"), v.literal("kimi")),
    isSimulation: v.boolean(),
    supersedes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const costUsd = estimateCost(args.model, args.usage);
    const status = args.isSimulation ? "simulation" : "pending_review";

    return await ctx.db.insert("agentOutputs", {
      companyId: args.companyId,
      agentId: args.agentId,
      templateId: args.templateId,
      gate: args.gate,
      content: args.content,
      contentType: args.contentType,
      status,
      provider: args.provider,
      model: args.model,
      usage: args.usage,
      costUsd,
      source: args.source,
      supersedes: args.supersedes,
      createdAt: Date.now(),
    });
  },
});

/**
 * Update the status of an agent output (approve, reject, etc.)
 */
export const updateStatus = mutation({
  args: {
    id: v.id("agentOutputs"),
    status: v.union(
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("superseded"),
      v.literal("simulation")
    ),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const output = await ctx.db.get(args.id);
    if (!output) throw new Error("Agent output not found");

    const updates: Partial<Doc<"agentOutputs">> = {
      status: args.status,
    };
    if (args.reviewNotes !== undefined) {
      updates.reviewNotes = args.reviewNotes;
    }

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

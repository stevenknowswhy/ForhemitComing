import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";
import { STAGE_AGENT_MAP } from "./agentQueueConfig";
import { buildDealContextSnapshot, logStageChange } from "./agentQueueHelpers";

// ============================================
// Agent Queue Queries
// ============================================

/**
 * Get pending jobs ordered by priority (used by processAgentQueue).
 */
export const getPending = query({
	args: {
		limit: v.optional(v.number()),
		simulationOnly: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const limit = args.limit ?? 1;

		if (args.simulationOnly) {
			return await ctx.db
				.query("agentQueue")
				.withIndex("by_status_priority", (q) => q.eq("status", "simulation"))
				.order("asc")
				.take(limit);
		}

		return await ctx.db
			.query("agentQueue")
			.withIndex("by_status_priority", (q) => q.eq("status", "pending"))
			.order("asc")
			.take(limit);
	},
});

/**
 * Get queue jobs for a company.
 */
export const listByCompany = query({
	args: {
		companyId: v.id("crmCompanies"),
		gate: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		let q = ctx.db
			.query("agentQueue")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId));

		if (args.gate !== undefined) {
			q = q.filter((q) => q.eq(q.field("gate"), args.gate));
		}

		return await q.order("desc").collect();
	},
});

/**
 * Get queue jobs by agent and status.
 */
export const getByAgent = query({
	args: {
		agentId: v.string(),
		status: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		let q = ctx.db
			.query("agentQueue")
			.withIndex("by_agent", (q) => q.eq("agentId", args.agentId));

		if (args.status) {
			q = q.filter((q) => q.eq(q.field("status"), args.status));
		}

		return await q.order("desc").collect();
	},
});

// ============================================
// Agent Queue Mutations
// ============================================

/**
 * Enqueue an agent job.
 * Called by advanceStage or manually for rework/simulation.
 */
export const enqueue = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		agentId: v.string(),
		templateId: v.string(),
		gate: v.number(),
		priority: v.optional(v.number()),
		isSimulation: v.optional(v.boolean()),
		context: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const isSimulation = args.isSimulation ?? false;

		return await ctx.db.insert("agentQueue", {
			companyId: args.companyId,
			agentId: args.agentId,
			templateId: args.templateId,
			gate: args.gate,
			status: isSimulation ? "simulation" : "pending",
			priority: args.priority ?? 1,
			isSimulation,
			context: args.context,
			createdAt: Date.now(),
		});
	},
});

/**
 * Mark a queue job as in_progress.
 */
export const markInProgress = mutation({
	args: { id: v.id("agentQueue") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const job = await ctx.db.get(args.id);
		if (!job) throw new Error("Queue job not found");
		if (job.status !== "pending" && job.status !== "simulation") {
			throw new Error(`Job is already ${job.status} — cannot claim`);
		}

		await ctx.db.patch(args.id, {
			status: "in_progress" as const,
			startedAt: Date.now(),
		});
		return args.id;
	},
});

/**
 * Mark a queue job as completed.
 */
export const markCompleted = mutation({
	args: { id: v.id("agentQueue") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const job = await ctx.db.get(args.id);
		if (!job) throw new Error("Queue job not found");
		if (job.status !== "in_progress") {
			throw new Error(
				`Job is ${job.status} — can only complete in_progress jobs`,
			);
		}

		await ctx.db.patch(args.id, {
			status: "completed" as const,
			completedAt: Date.now(),
		});
		return args.id;
	},
});

/**
 * Mark a queue job as failed with error message.
 */
export const markFailed = mutation({
	args: {
		id: v.id("agentQueue"),
		error: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const job = await ctx.db.get(args.id);
		if (!job) throw new Error("Queue job not found");
		if (job.status !== "in_progress") {
			throw new Error(`Job is ${job.status} — can only fail in_progress jobs`);
		}

		await ctx.db.patch(args.id, {
			status: "failed" as const,
			error: args.error,
			completedAt: Date.now(),
		});
		return args.id;
	},
});

// ============================================
// advanceStage — The Critical Wiring Point
// ============================================

/**
 * Advance a company to a new pipeline stage and trigger agent work.
 *
 * This is the bridge between the CRM and the AI agent framework.
 * When a deal moves to a new stage, this mutation:
 * 1. Updates the company's stage in crmCompanies
 * 2. Logs the stage change as a crmActivity
 * 3. Looks up the stage in STAGE_AGENT_MAP
 * 4. If an agent is mapped, enqueues a job in agentQueue
 *
 * Call this instead of crmCompanies.update when changing stages,
 * so agent work is automatically triggered.
 */
export const advanceStage = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		newStage: v.union(
			v.literal("First contact"),
			v.literal("Intro call"),
			v.literal("NDA sent"),
			v.literal("Feasibility"),
			v.literal("Term sheet"),
			v.literal("LOI signed"),
			v.literal("Closed"),
			v.literal("On hold"),
			v.literal("Dead"),
		),
		isSimulation: v.optional(v.boolean()),
		performedBy: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const company = await ctx.db.get(args.companyId);
		if (!company) throw new Error("Company not found");

		// Idempotency: skip if already at this stage
		if (company.stage === args.newStage) {
			return { success: true, agentQueued: false, skipped: true };
		}

		const oldStage = company.stage;
		const now = Date.now();
		const isSimulation = args.isSimulation ?? false;

		// 1. Update the company stage
		await ctx.db.patch(args.companyId, {
			stage: args.newStage,
			updatedAt: now,
		});

		// 2. Log the stage change activity
		await logStageChange(ctx, args.companyId, oldStage, args.newStage, args.performedBy, now);

		// 3. Check if this stage triggers an agent
		const mapping = STAGE_AGENT_MAP[args.newStage];
		if (!mapping) {
			return { success: true, agentQueued: false };
		}

		// 4. Enqueue agent work (CRM still works if agent tables aren't deployed)
		try {
			const contextSnapshot = await buildDealContextSnapshot(
				ctx, args.companyId, args.newStage, oldStage, now,
			);

			const jobId = await ctx.db.insert("agentQueue", {
				companyId: args.companyId,
				agentId: mapping.agentId,
				templateId: mapping.templateId,
				gate: mapping.gate,
				status: isSimulation ? "simulation" : "pending",
				priority: 1,
				isSimulation,
				context: contextSnapshot,
				createdAt: now,
			});

			return { success: true, agentQueued: true, jobId };
		} catch (e) {
			console.warn("Failed to queue agent work:", e);
			return { success: true, agentQueued: false, warning: String(e) };
		}
	},
});

/**
 * Deal Tracker — Convex Mutations & Queries
 *
 * Manages per-client 120-day ESOP transaction tracker.
 * Replaces localStorage with persistent Convex storage.
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";
import { SEED_TASKS } from "./lib/dealTrackerSeed";
import type { Id } from "./_generated/dataModel";
import { logEvent } from "./lib/logEvent";
import { LOG_ACTIONS } from "./lib/logEvents.constants";
import { resolveActor } from "./lib/resolveActor";

// ============================================
// Queries
// ============================================

/**
 * Get full tracker state for a client
 */
export const getTrackerState = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);

		const tasks = await ctx.db
			.query("dealTrackerTasks")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.collect();

		const progress = await ctx.db
			.query("dealTrackerProgress")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.first();

		return {
			tasks,
			progress,
			isInitialized: tasks.length > 0,
		};
	},
});

/**
 * Get progress summary for a client (lightweight)
 */
export const getProgressSummary = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);

		return await ctx.db
			.query("dealTrackerProgress")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.first();
	},
});

/**
 * Get all trackers summary for dashboard overview
 */
export const getAllTrackersSummary = query({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx);

		const allProgress = await ctx.db.query("dealTrackerProgress").collect();

		// Get company names
		const summaries = await Promise.all(
			allProgress.map(async (progress) => {
				const company = await ctx.db.get(progress.companyId);
				return {
					companyId: progress.companyId,
					companyName: company?.name || "Unknown",
					companyRef: company?.ref,
					stage: company?.stage,
					progressPercent: progress.progressPercent,
					currentPhase: progress.currentPhase,
					gates: progress.gates,
					engagementStartDate: progress.engagementStartDate,
					lastUpdatedAt: progress.lastUpdatedAt,
				};
			}),
		);

		return summaries;
	},
});

/**
 * Check if a company has a tracker initialized
 */
export const hasTracker = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		const progress = await ctx.db
			.query("dealTrackerProgress")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.first();

		return !!progress;
	},
});

// ============================================
// Mutations
// ============================================

/**
 * Initialize tracker for a new client
 * Creates all tasks from seed data
 */
export const initializeTracker = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		engagementStartDate: v.optional(v.string()),
		initializedBy: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);

		// Check if already initialized
		const existing = await ctx.db
			.query("dealTrackerProgress")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.first();

		if (existing) {
			throw new Error("Tracker already initialized for this company");
		}

		const now = Date.now();
		const startDate =
			args.engagementStartDate || new Date().toISOString().split("T")[0];

		// Create all tasks from seed data
		for (const seedTask of SEED_TASKS) {
			await ctx.db.insert("dealTrackerTasks", {
				companyId: args.companyId,
				phase: seedTask.phase,
				taskId: seedTask.id,
				taskTitle: seedTask.title,
				taskType: seedTask.type,
				dayTarget: seedTask.day,
				dayNumber: seedTask.dayNumber,
				role: seedTask.role,
				order: seedTask.order,
				subtasks: seedTask.subs.map((label, idx) => ({
					id: `${seedTask.id}_${idx}`,
					label,
					completed: false,
					completedAt: undefined,
					completedBy: undefined,
				})),
				allSubtasksCompleted: false,
				completedAt: undefined,
				gateStatus: seedTask.type === "gate" ? "pending" : undefined,
				gateClearedAt: undefined,
				gateClearedBy: undefined,
				lastUpdatedAt: now,
				lastUpdatedBy: args.initializedBy,
				createdAt: now,
			});
		}

		// Create progress record
		await ctx.db.insert("dealTrackerProgress", {
			companyId: args.companyId,
			totalSubtasks: SEED_TASKS.reduce((sum, t) => sum + t.subs.length, 0),
			completedSubtasks: 0,
			progressPercent: 0,
			phases: {
				ignition: { total: 0, completed: 0, percent: 0 },
				build: { total: 0, completed: 0, percent: 0 },
				validate: { total: 0, completed: 0, percent: 0 },
				closePrep: { total: 0, completed: 0, percent: 0 },
				closing: { total: 0, completed: 0, percent: 0 },
			},
			gates: {
				gate1: {
					status: "pending",
					day: "Day 45",
					name: "FMV adequacy letter",
				},
				gate2: {
					status: "pending",
					day: "Day 60",
					name: "Lender commitment letter",
				},
				gate3: {
					status: "pending",
					day: "Day 75",
					name: "QofE EBITDA validation",
				},
				gate4: {
					status: "pending",
					day: "Day 90",
					name: "Trustee COOP sign-off",
				},
			},
			currentPhase: "ignition",
			engagementStartDate: startDate,
			initializedBy: args.initializedBy,
			initializedAt: now,
			startedAt: now,
			lastUpdatedAt: now,
			createdAt: now,
			updatedAt: now,
		});

		// Log to audit
		await ctx.db.insert("auditLogs", {
			action: "create",
			entityType: "dealTracker",
			entityId: args.companyId,
			changes: [
				{ field: "tracker", oldValue: undefined, newValue: "initialized" },
				{
					field: "engagementStartDate",
					oldValue: undefined,
					newValue: startDate,
				},
			],
			timestamp: now,
			performedBy: args.initializedBy || "system",
		});

		// Log to business log
		const actor = await resolveActor(ctx);
		const trackerCompany = await ctx.db.get(args.companyId);
		await logEvent(ctx, {
			...actor,
			eventType: LOG_ACTIONS.TRACKER_STARTED,
			category: "tracker",
			summary: `Tracker initialized for ${trackerCompany?.name || "deal"}`,
			clientSummary: `Your 120-day transaction tracker has been started`,
			source: "admin_ui",
			visibility: "external",
			companyId: args.companyId,
			scopeType: "company",
			scopeId: args.companyId,
			metadata: { engagementStartDate: startDate },
		});

		return { success: true, companyId: args.companyId };
	},
});

/**
 * Toggle a single subtask
 */
export const toggleSubtask = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		taskId: v.string(),
		subtaskIndex: v.number(),
		toggledBy: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);

		// Find the task
		const task = await ctx.db
			.query("dealTrackerTasks")
			.withIndex("by_company_task", (q) =>
				q.eq("companyId", args.companyId).eq("taskId", args.taskId),
			)
			.first();

		if (!task) {
			throw new Error(`Task ${args.taskId} not found`);
		}

		// Toggle the subtask
		const subtasks = [...task.subtasks];
		if (args.subtaskIndex < 0 || args.subtaskIndex >= subtasks.length) {
			throw new Error(`Invalid subtask index: ${args.subtaskIndex}`);
		}

		const subtask = subtasks[args.subtaskIndex];
		const wasCompleted = subtask.completed;
		const now = Date.now();

		subtasks[args.subtaskIndex] = {
			...subtask,
			completed: !wasCompleted,
			completedAt: !wasCompleted ? now : undefined,
			completedBy: !wasCompleted ? args.toggledBy : undefined,
		};

		// Check if all subtasks are completed
		const allCompleted = subtasks.every((s) => s.completed);

		await ctx.db.patch(task._id, {
			subtasks,
			allSubtasksCompleted: allCompleted,
			completedAt: allCompleted ? now : undefined,
			lastUpdatedAt: now,
			lastUpdatedBy: args.toggledBy,
		});

		// Recalculate progress
		await recalculateProgress(ctx, args.companyId);

		// Log to audit
		await ctx.db.insert("auditLogs", {
			action: "update",
			entityType: "dealTracker",
			entityId: args.companyId,
			changes: [
				{
					field: `${args.taskId}.subtask.${args.subtaskIndex}`,
					oldValue: wasCompleted ? "completed" : "incomplete",
					newValue: !wasCompleted ? "completed" : "incomplete",
				},
			],
			timestamp: now,
			performedBy: args.toggledBy || "unknown",
		});

		// Log to business log
		const actor = await resolveActor(ctx);
		await logEvent(ctx, {
			...actor,
			eventType: LOG_ACTIONS.TRACKER_SUBTASK,
			category: "tracker",
			summary: `Subtask ${!wasCompleted ? "completed" : "uncompleted"}: ${args.taskId} #${args.subtaskIndex}`,
			source: "admin_ui",
			visibility: "internal",
			companyId: args.companyId,
			scopeType: "company",
			scopeId: args.companyId,
			metadata: {
				taskId: args.taskId,
				subtaskIndex: args.subtaskIndex,
				completed: !wasCompleted,
			},
		});

		return { success: true };
	},
});

/**
 * Toggle all subtasks for a task
 */
export const toggleAllSubtasks = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		taskId: v.string(),
		toggledBy: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);

		// Find the task
		const task = await ctx.db
			.query("dealTrackerTasks")
			.withIndex("by_company_task", (q) =>
				q.eq("companyId", args.companyId).eq("taskId", args.taskId),
			)
			.first();

		if (!task) {
			throw new Error(`Task ${args.taskId} not found`);
		}

		const now = Date.now();
		const allCompleted = task.subtasks.every((s) => s.completed);
		const newCompleted = !allCompleted;

		// Toggle all subtasks
		const subtasks = task.subtasks.map((s) => ({
			...s,
			completed: newCompleted,
			completedAt: newCompleted ? now : undefined,
			completedBy: newCompleted ? args.toggledBy : undefined,
		}));

		await ctx.db.patch(task._id, {
			subtasks,
			allSubtasksCompleted: newCompleted,
			completedAt: newCompleted ? now : undefined,
			lastUpdatedAt: now,
			lastUpdatedBy: args.toggledBy,
		});

		// Recalculate progress
		await recalculateProgress(ctx, args.companyId);

		// Log to audit
		await ctx.db.insert("auditLogs", {
			action: "update",
			entityType: "dealTracker",
			entityId: args.companyId,
			changes: [
				{
					field: `${args.taskId}.allSubtasks`,
					oldValue: allCompleted ? "completed" : "incomplete",
					newValue: newCompleted ? "completed" : "incomplete",
				},
			],
			timestamp: now,
			performedBy: args.toggledBy || "unknown",
		});

		return { success: true };
	},
});

/**
 * Toggle gate status
 */
export const toggleGate = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		gateId: v.string(), // "g1", "g2", "g3", "g4"
		toggledBy: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);

		// Find the gate task
		const gateTask = await ctx.db
			.query("dealTrackerTasks")
			.withIndex("by_company_task", (q) =>
				q.eq("companyId", args.companyId).eq("taskId", args.gateId),
			)
			.first();

		if (!gateTask || gateTask.taskType !== "gate") {
			throw new Error(`Gate ${args.gateId} not found`);
		}

		const now = Date.now();
		const cycle: Record<string, string> = {
			pending: "cleared",
			cleared: "blocked",
			blocked: "pending",
		};

		const currentStatus = gateTask.gateStatus || "pending";
		const newStatus = cycle[currentStatus];

		await ctx.db.patch(gateTask._id, {
			gateStatus: newStatus as "pending" | "cleared" | "blocked",
			gateClearedAt: newStatus === "cleared" ? now : undefined,
			gateClearedBy: newStatus === "cleared" ? args.toggledBy : undefined,
			lastUpdatedAt: now,
			lastUpdatedBy: args.toggledBy,
		});

		// Update progress gates
		const progress = await ctx.db
			.query("dealTrackerProgress")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.first();

		if (progress) {
			const gateKey =
				`gate${args.gateId.replace("g", "")}` as keyof typeof progress.gates;
			const gates = { ...progress.gates };
			gates[gateKey] = { ...gates[gateKey], status: newStatus };

			await ctx.db.patch(progress._id, {
				gates,
				lastUpdatedAt: now,
				updatedAt: now,
			});
		}

		// Log to audit
		await ctx.db.insert("auditLogs", {
			action: "update",
			entityType: "dealTracker",
			entityId: args.companyId,
			changes: [
				{
					field: `gate.${args.gateId}`,
					oldValue: currentStatus,
					newValue: newStatus,
				},
			],
			timestamp: now,
			performedBy: args.toggledBy || "unknown",
		});

		// Log to business log
		const gateIndex = args.gateId.replace("g", "");
		const gateNames: Record<string, string> = {
			g1: "FMV adequacy letter",
			g2: "Lender commitment letter",
			g3: "QofE EBITDA validation",
			g4: "Trustee COOP sign-off",
		};
		const actor = await resolveActor(ctx);
		const gateSummary = `Gate ${gateIndex} (${gateNames[args.gateId] || args.gateId}): ${currentStatus} → ${newStatus}`;
		const gateMeta = {
			gateId: args.gateId,
			oldStatus: currentStatus,
			newStatus,
		};

		if (newStatus === "cleared") {
			await logEvent(ctx, {
				...actor,
				eventType: LOG_ACTIONS.TRACKER_GATE,
				category: "tracker",
				summary: gateSummary,
				clientSummary: `Gate ${gateIndex} has been cleared`,
				source: "admin_ui",
				visibility: "external",
				companyId: args.companyId,
				scopeType: "company",
				scopeId: args.companyId,
				metadata: gateMeta,
			});
		} else if (newStatus === "blocked") {
			await logEvent(ctx, {
				...actor,
				eventType: LOG_ACTIONS.TRACKER_BLOCKED,
				category: "tracker",
				summary: gateSummary,
				source: "admin_ui",
				visibility: "internal",
				companyId: args.companyId,
				scopeType: "company",
				scopeId: args.companyId,
				severity: "warning",
				metadata: gateMeta,
			});
		} else {
			await logEvent(ctx, {
				...actor,
				eventType: LOG_ACTIONS.TRACKER_SUBTASK,
				category: "tracker",
				summary: gateSummary,
				source: "admin_ui",
				visibility: "internal",
				companyId: args.companyId,
				scopeType: "company",
				scopeId: args.companyId,
				metadata: gateMeta,
			});
		}

		return { success: true, newStatus };
	},
});

// ============================================
// Internal Helpers
// ============================================

/**
 * Recalculate progress percentages
 */
async function recalculateProgress(ctx: any, companyId: Id<"crmCompanies">) {
	const tasks = await ctx.db
		.query("dealTrackerTasks")
		.withIndex("by_company", (q: any) => q.eq("companyId", companyId))
		.collect();

	const progress = await ctx.db
		.query("dealTrackerProgress")
		.withIndex("by_company", (q: any) => q.eq("companyId", companyId))
		.first();

	if (!progress) return;

	// Calculate overall stats
	let totalSubtasks = 0;
	let completedSubtasks = 0;

	// Calculate per-phase stats
	const phaseStats: Record<string, { total: number; completed: number }> = {
		ignition: { total: 0, completed: 0 },
		build: { total: 0, completed: 0 },
		validate: { total: 0, completed: 0 },
		"close-prep": { total: 0, completed: 0 },
		closing: { total: 0, completed: 0 },
	};

	for (const task of tasks) {
		const phase = task.phase;
		for (const subtask of task.subtasks) {
			totalSubtasks++;
			phaseStats[phase].total++;
			if (subtask.completed) {
				completedSubtasks++;
				phaseStats[phase].completed++;
			}
		}
	}

	const progressPercent =
		totalSubtasks > 0
			? Math.round((completedSubtasks / totalSubtasks) * 100)
			: 0;

	// Calculate phase percentages
	const phases = {
		ignition: {
			total: phaseStats.ignition.total,
			completed: phaseStats.ignition.completed,
			percent:
				phaseStats.ignition.total > 0
					? Math.round(
							(phaseStats.ignition.completed / phaseStats.ignition.total) * 100,
						)
					: 0,
		},
		build: {
			total: phaseStats.build.total,
			completed: phaseStats.build.completed,
			percent:
				phaseStats.build.total > 0
					? Math.round(
							(phaseStats.build.completed / phaseStats.build.total) * 100,
						)
					: 0,
		},
		validate: {
			total: phaseStats.validate.total,
			completed: phaseStats.validate.completed,
			percent:
				phaseStats.validate.total > 0
					? Math.round(
							(phaseStats.validate.completed / phaseStats.validate.total) * 100,
						)
					: 0,
		},
		closePrep: {
			total: phaseStats["close-prep"].total,
			completed: phaseStats["close-prep"].completed,
			percent:
				phaseStats["close-prep"].total > 0
					? Math.round(
							(phaseStats["close-prep"].completed /
								phaseStats["close-prep"].total) *
								100,
						)
					: 0,
		},
		closing: {
			total: phaseStats.closing.total,
			completed: phaseStats.closing.completed,
			percent:
				phaseStats.closing.total > 0
					? Math.round(
							(phaseStats.closing.completed / phaseStats.closing.total) * 100,
						)
					: 0,
		},
	};

	// Determine current phase
	let currentPhase = "ignition";
	if (phases.ignition.percent === 100) currentPhase = "build";
	if (phases.build.percent === 100) currentPhase = "validate";
	if (phases.validate.percent === 100) currentPhase = "close-prep";
	if (phases.closePrep.percent === 100) currentPhase = "closing";

	const now = Date.now();

	await ctx.db.patch(progress._id, {
		totalSubtasks,
		completedSubtasks,
		progressPercent,
		phases,
		currentPhase,
		lastUpdatedAt: now,
		updatedAt: now,
	});
}

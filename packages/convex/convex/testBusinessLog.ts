import { internalMutation } from "./_generated/server";
import { logEvent } from "./lib/logEvent";
import { LOG_ACTIONS, LOG_RETENTION } from "./lib/logEvents.constants";
import { resolveActor, agentActor, boxActor } from "./lib/resolveActor";
import { makeCorrelationId } from "./lib/correlationId";
import { toClientProjection } from "./lib/clientProjection";

/**
 * End-to-end test harness for the Business Log system.
 * Run via: npx convex run testBusinessLog:run
 *
 * Tests: emitter → write → read → clientProjection → stats → interactions → dedup
 */
export const run = internalMutation({
	args: {},
	handler: async (ctx) => {
		const results: string[] = [];
		let passed = 0;
		let failed = 0;

		function assert(label: string, condition: boolean, detail?: string) {
			if (condition) {
				results.push(`  ✅ ${label}`);
				passed++;
			} else {
				results.push(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
				failed++;
			}
		}

		// ── Test 1: Write internal event ─────────────────────
		results.push("\n🔹 Test 1: Write internal event");
		const actor = await resolveActor(ctx);
		await logEvent(ctx, {
			...actor,
			eventType: LOG_ACTIONS.TASK_COMPLETED,
			category: "task",
			summary: "Test task completed",
			source: "admin_ui",
			visibility: "internal",
			scopeType: "system",
			scopeId: "test",
			metadata: { test: true },
		});

		const internalEvents = await ctx.db
			.query("businessLog")
			.withIndex("by_team_time", (q) => q.eq("teamVisible", true))
			.order("desc")
			.take(1);
		const lastInternal = internalEvents[0];
		assert("Internal event written", !!lastInternal);
		assert("teamVisible is true", lastInternal?.teamVisible === true);
		assert("clientVisible is false", lastInternal?.clientVisible === false);
		assert(
			"clientSummary is undefined",
			lastInternal?.clientSummary === undefined,
		);

		// ── Test 2: Write client-visible event ───────────────
		results.push("\n🔹 Test 2: Write client-visible event");
		const correlationId = makeCorrelationId("test");
		await logEvent(ctx, {
			...actor,
			eventType: LOG_ACTIONS.DEAL_STAGE_CHANGED,
			category: "deal",
			summary: "Stage: First contact → Intro call",
			clientSummary: "Your deal has advanced to the next phase",
			source: "admin_ui",
			visibility: "external",
			scopeType: "system",
			scopeId: "test",
			correlationId,
			metadata: { oldStage: "First contact", newStage: "Intro call" },
		});

		const clientEvents = await ctx.db
			.query("businessLog")
			.withIndex("by_correlation_time", (q) =>
				q.eq("correlationId", correlationId),
			)
			.collect();
		const clientEvent = clientEvents[0];
		assert("Client-visible event written", !!clientEvent);
		assert("teamVisible is true", clientEvent?.teamVisible === true);
		assert("clientVisible is true", clientEvent?.clientVisible === true);
		assert(
			"clientSummary preserved",
			clientEvent?.clientSummary === "Your deal has advanced to the next phase",
		);

		// ── Test 3: toClientProjection ───────────────────────
		results.push("\n🔹 Test 3: toClientProjection");
		if (clientEvent) {
			const projection = toClientProjection(clientEvent);
			assert(
				"Projection uses clientSummary",
				projection.summary === "Your deal has advanced to the next phase",
			);
			assert(
				"Projection uses clientActorLabel",
				projection.actorLabel === "Forhemit Team",
			);
			assert(
				"Projection strips internal metadata",
				projection.publicMetadata === undefined,
			);
			assert(
				"Projection returns valid eventType",
				projection.eventType === LOG_ACTIONS.DEAL_STAGE_CHANGED,
			);
		}

		// ── Test 4: Idempotency ──────────────────────────────
		results.push("\n🔹 Test 4: Idempotency guard");
		const idempotencyKey = "test-idempotent-key-123";
		await logEvent(ctx, {
			...actor,
			eventType: LOG_ACTIONS.DOC_SIGNED,
			category: "document",
			summary: "Document signed (first)",
			clientSummary: "Your document has been signed",
			source: "webhook",
			visibility: "external",
			scopeType: "system",
			scopeId: "test",
			idempotencyKey,
		});
		await logEvent(ctx, {
			...actor,
			eventType: LOG_ACTIONS.DOC_SIGNED,
			category: "document",
			summary: "Document signed (duplicate)",
			clientSummary: "Your document has been signed",
			source: "webhook",
			visibility: "external",
			scopeType: "system",
			scopeId: "test",
			idempotencyKey,
		});
		const idempotentEvents = await ctx.db
			.query("businessLog")
			.withIndex("by_idempotency", (q) =>
				q.eq("idempotencyKey", idempotencyKey),
			)
			.collect();
		assert(
			"Idempotency: only 1 event written",
			idempotentEvents.length === 1,
			`got ${idempotentEvents.length}`,
		);

		// ── Test 5: Stats materialization ────────────────────
		results.push("\n🔹 Test 5: Stats materialization");
		const totalStat = await ctx.db
			.query("businessLogStats")
			.withIndex("by_window", (q) => q.eq("window", "total"))
			.first();
		assert("Total stats exist", !!totalStat);
		assert(
			"Total count >= 3",
			(totalStat?.count ?? 0) >= 3,
			`got ${totalStat?.count}`,
		);
		const todayKey = new Date().toISOString().slice(0, 10);
		const todayStat = await ctx.db
			.query("businessLogStats")
			.withIndex("by_window", (q) => q.eq("window", todayKey))
			.first();
		assert("Today stats exist", !!todayStat);

		// ── Test 6: Agent actor ──────────────────────────────
		results.push("\n🔹 Test 6: Agent actor");
		const agent = agentActor("test-agent");
		await logEvent(ctx, {
			...agent,
			eventType: LOG_ACTIONS.AGENT_OUTPUT,
			category: "agent",
			summary: "Agent output: test-agent generated",
			source: "agent",
			visibility: "internal",
			scopeType: "system",
			scopeId: "test",
			entityType: "agentOutput",
		});
		assert(
			"Agent actor has clientActorLabel",
			agent.clientActorLabel === "Forhemit Team",
		);

		// ── Test 7: Box actor ────────────────────────────────
		results.push("\n🔹 Test 7: Box actor");
		const box = boxActor();
		await logEvent(ctx, {
			...box,
			eventType: LOG_ACTIONS.DOC_SIGNED,
			category: "document",
			summary: "Document signed via Box",
			clientSummary: "Your document has been signed",
			source: "webhook",
			visibility: "external",
			scopeType: "system",
			scopeId: "test",
		});
		assert("Box actor is 'Box'", box.actorLabel === "Box");
		assert("Box clientActorLabel is 'Box'", box.clientActorLabel === "Box");

		// ── Test 8: Links ────────────────────────────────────
		results.push("\n🔹 Test 8: Event links (max 5)");
		await logEvent(ctx, {
			...actor,
			eventType: LOG_ACTIONS.DOC_UPLOADED,
			category: "document",
			summary: "Document uploaded with links",
			clientSummary: "A document has been uploaded",
			source: "admin_ui",
			visibility: "external",
			scopeType: "system",
			scopeId: "test",
			links: [
				{ label: "File 1", type: "box_file", clientVisible: true },
				{ label: "File 2", type: "box_file", clientVisible: true },
				{ label: "File 3", type: "box_file", clientVisible: true },
				{ label: "File 4", type: "box_file", clientVisible: true },
				{ label: "File 5", type: "box_file", clientVisible: true },
				{ label: "File 6", type: "box_file", clientVisible: true }, // should be truncated
			],
		});
		const linkedEvents = await ctx.db
			.query("businessLog")
			.withIndex("by_team_time", (q) => q.eq("teamVisible", true))
			.order("desc")
			.take(1);
		const linkedEvent = linkedEvents[0];
		assert(
			"Links truncated to 5",
			(linkedEvent?.links?.length ?? 0) === 5,
			`got ${linkedEvent?.links?.length}`,
		);

		// ── Test 9: Retention class ──────────────────────────
		results.push("\n🔹 Test 9: Retention class mapping");
		assert(
			"deal.closed is compliance",
			LOG_RETENTION["deal.closed"] === "compliance",
		);
		assert(
			"task.completed is activity",
			LOG_RETENTION["task.completed"] === "activity",
		);
		assert(
			"document.signed is compliance",
			LOG_RETENTION["document.signed"] === "compliance",
		);
		assert(
			"email.sent is activity",
			LOG_RETENTION["email.sent"] === "activity",
		);

		// ── Summary ──────────────────────────────────────────
		results.push(`\n${"═".repeat(50)}`);
		results.push(
			`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`,
		);
		results.push(`${"═".repeat(50)}`);

		return results.join("\n");
	},
});

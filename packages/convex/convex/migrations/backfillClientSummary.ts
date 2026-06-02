import { internalMutation } from "../_generated/server";

/**
 * Backfill migration: add clientSummary to existing clientVisible events
 * that were written before the fail-closed check existed.
 *
 * Run via: npx convex run migrations/backfillClientSummary:run
 */
export const run = internalMutation({
	args: {},
	handler: async (ctx) => {
		const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000; // last 90 days
		const batch = await ctx.db
			.query("businessLog")
			.withIndex("by_team_time", (q) => q.eq("teamVisible", true))
			.filter((q) => q.gte(q.field("_creationTime"), cutoff))
			.take(200);

		let patched = 0;
		for (const event of batch) {
			if (event.clientVisible && !event.clientSummary) {
				await ctx.db.patch(event._id, {
					clientSummary: "Your deal team completed an action.",
				});
				patched++;
			}
		}

		return { scanned: batch.length, patched };
	},
});

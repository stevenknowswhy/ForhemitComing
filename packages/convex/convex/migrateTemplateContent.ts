/**
 * Migrate template.content from inline HTML to Convex File Storage.
 *
 * Paginated: reads 50 templates at a time, stores each content blob
 * in File Storage, patches the doc with contentFileId, and chains
 * the next batch via the scheduler.
 *
 * Run: npx convex run migrateTemplateContent:migrateContentToFiles
 */
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation } from "./_generated/server";

const PAGE_SIZE = 50;

/**
 * Internal mutation: fetch one page of templates that still need migration.
 * Returns the page + cursor for chaining.
 */
export const fetchMigrationPage = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const results = await ctx.db
			.query("templates")
			.paginate({ cursor: args.cursor ?? null, numItems: PAGE_SIZE });

		// Filter to docs that have content but no contentFileId yet
		const toMigrate = results.page.filter((t) => t.content && !t.contentFileId);

		return {
			docs: toMigrate.map((t) => ({ _id: t._id, content: t.content! })),
			isDone: results.isDone,
			continueCursor: results.continueCursor,
		};
	},
});

/**
 * Internal mutation: patch a template with its File Storage ID
 * and clear the inline content field.
 */
export const patchWithFileId = internalMutation({
	args: {
		templateId: v.id("templates"),
		fileId: v.id("_storage"),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.templateId, {
			contentFileId: args.fileId,
			content: undefined,
			updatedAt: Date.now(),
		});
	},
});

/**
 * Main migration action. Paginated via scheduler chaining.
 */
export const migrateContentToFiles = internalAction({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args): Promise<{ migrated: number; done: boolean }> => {
		// 1. Fetch one page of templates to migrate
		const page = await ctx.runMutation(
			internal.migrateTemplateContent.fetchMigrationPage,
			{ cursor: args.cursor },
		);

		let migrated = 0;
		for (const doc of page.docs) {
			// Store content as a file
			const bytes = new TextEncoder().encode(doc.content);
			const fileId = await ctx.storage.store(
				new Blob([bytes], { type: "text/html" }),
			);

			// Patch the template doc
			await ctx.runMutation(internal.migrateTemplateContent.patchWithFileId, {
				templateId: doc._id,
				fileId,
			});
			migrated++;
		}

		// Migration status tracked via return value

		// 2. Chain next batch if more docs remain
		if (!page.isDone) {
			await ctx.scheduler.runAfter(
				0,
				internal.migrateTemplateContent.migrateContentToFiles as typeof internal.migrateTemplateContent.migrateContentToFiles,
				{ cursor: page.continueCursor },
			);
		} else {
			// Migration complete — status tracked via return value
		}

		return { migrated, done: page.isDone };
	},
});

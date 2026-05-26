/**
 * Template Content Helper
 *
 * Reads template HTML content from File Storage (preferred) or inline fallback.
 * File Storage decouples content blobs from document rows, keeping document
 * reads under Convex's 16 MB per-transaction limit.
 *
 * Usage in actions:
 *   const html = await getTemplateContent(ctx, template);
 *
 * Usage in queries (returns file ID only — fetch client-side):
 *   const fileId = getContentFileId(template);
 */

import type { Doc, Id } from "../_generated/dataModel";
import type { ActionCtx } from "../_generated/server";

type Template = Doc<"templates">;

/**
 * Fetch the HTML content of a template.
 *
 * Prefers File Storage (`contentFileId`) over inline `content`.
 * Returns `null` if the template has no content in either location.
 *
 * Can be called from actions (which have `ctx.storage`).
 */
export async function getTemplateContent(
	ctx: ActionCtx,
	template: Template,
): Promise<string | null> {
	if (template.contentFileId) {
		const url = await ctx.storage.getUrl(template.contentFileId as Id<"_storage">);
		if (url) {
			const res = await fetch(url);
			return await res.text();
		}
	}

	return template.content ?? null;
}

/**
 * Return the File Storage ID for a template's content, if one exists.
 * Useful in queries where you can't call `ctx.storage.read()` —
 * return this to the client and fetch the URL there.
 */
export function getContentFileId(template: Template): Id<"_storage"> | null {
	return (template.contentFileId as Id<"_storage">) ?? null;
}

/**
 * Store HTML content in File Storage and return the file ID.
 * Used by mutations that write template content.
 */
export async function storeTemplateContent(
	ctx: ActionCtx,
	html: string,
): Promise<Id<"_storage">> {
	const bytes = new TextEncoder().encode(html);
	return await ctx.storage.store(new Blob([bytes], { type: "text/html" }));
}

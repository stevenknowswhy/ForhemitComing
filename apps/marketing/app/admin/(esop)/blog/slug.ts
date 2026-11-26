/**
 * Slug derivation for admin blog creation — kept out of actions.ts because
 * Next.js only permits async exports from "use server" modules, and this is
 * pure and unit-tested (actions.test.ts).
 */

/** TipTap empty document: one empty paragraph. */
export const EMPTY_TIPTAP_DOC = { type: "doc", content: [{ type: "paragraph" }] };

/** Kebab-case slug from a title; Convex asserts ^[a-z0-9]+(?:-[a-z0-9]+)*$. */
export function titleToSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
  return slug || "post";
}

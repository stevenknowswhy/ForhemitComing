# Draft: Convex schema additions (`posts`, `users`)

**Status:** Review before implementation.  
**Aligns with:** `HARMONIZATION_PLAN.md` sections 4–6 (forward-compatible blog model).

## Integration with current codebase

Today (`ForhemitAdminWebsite-main/convex/schema.ts`):

- There is **no** `users` table.
- Admin authorization uses `requireAdmin()` in `convex/lib/requireAdmin.ts`: Clerk identity **email** must match super-admin email or `@forhemit.com` domain (plus optional `ADMIN_TOKEN`).

**Migration path (recommended):**

1. Add **`users`** table synced from Clerk (webhook + upsert fallback in mutations per plan).
2. Set **`isAdmin`** from Clerk `publicMetadata` / role claim (source of truth), with safe default `false` on upsert.
3. Refactor **`requireAdmin`** to prefer `users.isAdmin` (by `clerkId`), with a **temporary** fallback to current email rules until all admins have rows.
4. Extend **`auditLogs.entityType`** with `literal("post")` when implementing blog audits.

## `users` table (new)

| Field | Type | Notes |
|-------|------|--------|
| `clerkId` | string | Clerk `subject`; unique |
| `email` | string | Denormalized for display |
| `isAdmin` | boolean | Default `false`; webhook sets true for role |
| `createdAt` | number | ms |
| `updatedAt` | optional number | ms |

**Indexes:**

- `by_clerk_id` on `clerkId` (unique lookup for upsert and auth)

## `posts` table (new)

| Field | Type | Notes |
|-------|------|--------|
| `title` | string | |
| `slug` | string | Unique; validate format in mutation |
| `excerpt` | optional string | Card / meta fallback |
| `content` | any | TipTap JSON; **Zod whitelist validated in mutation** before `ctx.db.insert/patch` |
| `status` | union | `draft` \| `published` \| `scheduled` |
| `publishedAt` | optional number | Set when moving to published |
| `scheduledAt` | optional number | Phase 4 scheduling |
| `version` | number | Start at `1`; bump on meaningful edits (Phase 4 revisions) |
| `parentId` | optional id("posts") | Revision chain |
| `authorId` | id("users") | |
| `featuredImage` | optional string | UploadThing URL |
| `metaTitle` | optional string | |
| `metaDescription` | optional string | |
| `ogImage` | optional string | UploadThing URL |
| `createdAt` | number | |
| `updatedAt` | number | |

**Indexes:**

- `by_slug` on `slug` (unique enforcement via query-before-insert or Convex rules)
- `by_status_publishedAt` on `status`, `publishedAt` (public listing, published only)
- `by_author` on `authorId` (optional, admin list)

## Convex functions (names are suggestions)

**Public (anonymous OK):**

- `posts.listPublished` — `status === "published"`, `publishedAt <= now`, paginated; **no** draft fields in return type.
- `posts.getBySlug` — same filter; **not found** → throw or return `null` so Next returns **404**.

**Admin (auth + `isAdmin`):**

- `posts.adminList`, `posts.adminGet`, `posts.create`, `posts.update`, `posts.publish`, `posts.unpublish`, `posts.delete`

**Preview:**

- `posts.getPreview` — validates JWT / token server-side; **404-style** failure for all invalid cases (plan: uniform 404 to avoid oracles).

## Content validation (not in schema)

Use **Zod** (or similar) in mutations to restrict TipTap JSON to allowed node types; reject `iframe`, `script`, unknown nodes. Combine with **DOMPurify** on read path in Next for defense in depth.

## Clerk webhook

On `user.created` / `user.updated`, upsert `users` by `clerkId`. Do not rely on webhooks alone — mutations use **upsert fallback** if row missing.

---

*Team review gate: confirm `users.isAdmin` source (publicMetadata shape) and slug uniqueness strategy before merging schema.*

# Forhemit: Complete Harmonization Plan

**Revised edition:** Next.js · Convex · Clerk · **Turborepo** · UploadThing · pnpm workspaces

This document consolidates strategy for aligning **Forhemit Admin Website** (internal CRM and tools, Clerk) and **Forhemit Coming / marketing** (public site), plus the **Resources** hub and **blog** (“blog platform”). It is a planning artifact only; implementation follows separate tasks.

Replace `domain.com` below with production domains (e.g. `www.forhemit.com` for marketing, `admin.forhemit.website` or agreed admin host).

---

## 1. Current state

| Surface | Role | Stack highlights |
|--------|------|------------------|
| **Admin** | Contacts, leads, CRM, templates, audit logs, authenticated operators | Next.js 16, React 19, **Clerk**, **Convex**, Tailwind, UploadThing, Sentry; dev often on port **5050** |
| **Marketing / public** | Landing, about, recruitment, early access, public content | Next.js 16, React 19, **Convex**, UploadThing, Sentry |

**Backend intent:** Documentation references a **shared Convex deployment** (`NEXT_PUBLIC_CONVEX_URL`) for both apps.

**Structural risk:** Each app currently carries its **own `convex/` directory** with overlapping modules. That pattern is prone to **schema drift**, **accidental deploy from the wrong app**, and **divergent generated types** relative to production.

**Repo standards (admin):** `AGENTS.md` defines file-size limits, feature-based structure, and links to modular design and refactoring docs. Harmonization work should respect or explicitly update those policies.

---

## 2. North-star outcomes

1. **One logical backend:** single Convex project, single deploy authority, one canonical schema (target: **`packages/convex` in a Turborepo monorepo**).
2. **Clear product boundaries:** Public experiences on **marketing**; **admin** for internal tools and **blog authoring**.
3. **Seamless data story:** CRM, leads, and blog data do not depend on which app last deployed Convex.
4. **Resources + blog** on marketing with **Convex** + **UploadThing**, editor UX closer to a small CMS; **security foundations in Phase 1**, not bolted on later.
5. **Operational clarity:** Shared env validation (e.g. **t3-env**), observability, Convex **p95** baselines from Phase 1, and documented local `convex dev` ownership.

---

## 3. Architecture decisions (locked for this plan)

### 3.1 Placement of surfaces

| Experience | Host / app | Auth |
|------------|------------|------|
| Marketing pages, **Resources** hub, **blog (read)** | **Marketing** Next app (Vercel Project A) | Public for readers |
| CRM, templates, audit, **blog (write/preview)** | **Admin** Next app (Vercel Project B) | **Clerk** + Convex `isAdmin` |
| Convex functions & schema | **`packages/convex`** (single project) | Public queries narrow; admin mutations authenticated |

### 3.2 Blog and Resources (information architecture)

- **URLs:** `/resources` (hub), `/resources/blog` (listing), `/resources/blog/[slug]` (post). **Canonical URLs** on marketing host, e.g. `https://www.domain.com/resources/blog/...` (see Section 8 and the SEO row in Section 10).
- **Content store:** Convex **`posts`** table; **TipTap / ProseMirror JSON** in `content`, **Zod-validated on save** server-side (not only at render).
- **Images:** **UploadThing** via an **`uploadFile()` abstraction** (no direct UploadThing imports in app feature code); Convex stores URLs only (`featuredImage`, `ogImage`, inline references as designed).
- **Sanitization:** **DOMPurify** on render path; block dangerous nodes (iframes, scripts). Active from **Phase 1**.

### 3.3 Monorepo and Convex ownership

- **Decision:** **Turborepo** + **pnpm workspaces**; **remote caching enabled from Day 1**.
- **Rule:** **No `convex/` directories inside `apps/`** after migration—only `packages/convex`. Both apps import the generated Convex client from that package.
- **CI:** `npx convex deploy` after TypeScript check passes; single GitHub Actions pipeline for Convex.

### 3.4 Harmonization patterns

- **`packages/ui`:** Shared shadcn-oriented components where valuable.
- **`packages/auth`:** Shared Clerk helpers.
- **Observability:** Sentry (and optional Datadog); UploadThing failure alerts to Slack by Phase 3.
- **Health:** Align `api/health` semantics across apps.

---

## 4. Forward-compatible schema (posts)

Include **scheduling and versioning fields from Day 1** (UI may ship in Phase 4) to avoid painful production migrations.

Convex-shaped planning model (exact validators in implementation):

| Field | Notes |
|-------|--------|
| `title`, `slug` | Unique slug enforced in mutations |
| `content` | TipTap JSON; **Zod whitelist on save** |
| `status` | `draft` \| `published` \| `scheduled` |
| `publishedAt` | Optional until published |
| `scheduledAt` | Phase 4 scheduling |
| `version` | Revision tracking (Phase 4 UI) |
| `parentId` | Optional link to prior revision |
| `authorId` | `Id<"users">` |
| `featuredImage`, `metaTitle`, `metaDescription`, `ogImage` | Optional strings (URLs / SEO) |

---

## 5. Data access patterns

| API surface | Functions (conceptual) | Rules |
|-------------|------------------------|--------|
| **Public** | `posts.listPublished`, `posts.getBySlug` | Only `published === true` (and `publishedAt` in past if used). **No OR tricks** that could leak drafts. Missing or draft slug → behave like **404** at HTTP layer where applicable. |
| **Admin** | `posts.adminList`, `posts.adminUpdate`, etc. | **Every** mutation and admin query: `ctx.auth.getUserIdentity()` + **`isAdmin`**. No client-only auth. |
| **Preview** | `posts.getPreview` | Valid **JWT** (see Section 7); **404 for all failures** (expired, invalid, wrong post) to avoid oracle attacks. Log access. |

**Performance:** Serve public blog pages with **ISR/SSG** so Convex is **not** hit on every anonymous request; set cache headers; monitor Convex function **p95 from Phase 1**.

---

## 6. Authentication flow (Day 1 template)

**Next.js:** `clerkMiddleware()` with explicit route matchers for admin routes.

**Convex:** Every admin mutation/query uses identity + admin check. **Upsert fallback** if Clerk webhook missed user creation:

```typescript
export const createPost = mutation({
  args: { title: v.string() /* ... */ },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        clerkId: identity.subject,
        email: identity.email,
        isAdmin: false, // Safe default; webhook enriches / sets admin
      });
      user = await ctx.db.get(userId);
    }

    if (!user?.isAdmin) throw new ConvexError("Admin required");
    // ... create logic
  },
});
```

**Clerk webhooks:** Sync users to Convex; **do not rely on webhooks alone**—the upsert above covers missed deliveries.

---

## 7. Preview system

- **Route:** e.g. `/preview/[token]` on **marketing** (exact path to align with app router).
- **Token:** **JWT** signed with `preview_secret`, **24h expiry**, payload includes `postId` (and any needed claims).
- **Behavior:** **404** for expired, invalid, tampered, or wrong-post access (no distinction in response to prevent oracles).
- **Security audit in Phase 2:** Attempt draft access via ID/slug manipulation; confirm **404** only.

---

## 8. UploadThing

1. **`uploadFile()` wrapper** only—allows future swap to S3/R2 without changing post workflows.
2. **Images only** for MVP (e.g. **5MB** limit)—document in schema/UI.
3. **t3-env:** Validate `UPLOADTHING_TOKEN` (and related vars) at **build time**.
4. **Operations:** Single **1Password** (or secrets manager) item; **rotate both Vercel projects simultaneously** to avoid drift.

---

## 9. SEO and canonical strategy

| Item | Approach |
|------|----------|
| **Canonical** | All posts canonical to **`https://www.domain.com/resources/blog/*`** (adjust path if marketing IA changes, but one public host). |
| **Admin host** | **`admin.domain.com`** — **noindex** via `robots.txt` (and meta where needed). No competing blog URLs on admin. |
| **Redirects** | **301** any mistaken admin subpaths that could duplicate content. |
| **Sitemap** | `/sitemap.xml` with `lastmod` (Phase 2). |
| **RSS** | `/rss.xml` (Phase 2). |
| **Cannibalization** | Marketing owns all indexable blog URLs; admin is internal-only surface. |

---

## 10. Risk register and mitigations

| Risk | Severity | Likelihood | Mitigation strategy | Owner |
|------|----------|------------|---------------------|--------|
| Dual `convex/` dirs | High | High | Monorepo with single `packages/convex`; Turborepo + pnpm; one deploy pipeline (GitHub Actions). | Tech Lead |
| Auth bypass | Critical | Medium | Clerk middleware + Convex auth: verify `auth.userId` + `isAdmin`. **No client-only** admin checks. **Day 1.** | Security |
| Draft leakage | High | Medium | DB-level filtering: public queries only `published === true`. Separate `admin*` functions with auth. **404** (not 403) for missing/draft slugs on public routes. | Backend |
| CORS / Clerk misconfig | Medium | High | Clerk allowed origins: `*.domain.com`. Document cookie `Domain=.domain.com` for cross-subdomain. Staging test with real subdomains. | DevOps |
| UploadThing env drift | Medium | Medium | **t3-env** validation; **single** secrets item; rotate both Vercel projects together. | DevOps |
| UploadThing vendor lock-in | Medium | Low | **`uploadFile()`** abstraction; no direct UploadThing imports outside wrapper. | Backend |
| XSS via rich text | High | Low | **Zod** validates TipTap JSON **on save**; **DOMPurify** on render; block iframes/scripts. **Day 1.** | Frontend |
| Preview URL exposure | Medium | Medium | JWT preview tokens; **404 on all failures**; short expiry; access logging. | Full-stack |
| SEO cannibalization | Medium | High | Canonical on **www**; admin **noindex**; 301 duplicates. | SEO |
| Convex cold start / rate limits | Medium | Medium | **ISR/SSG** for public blog; cache headers; monitor **p95 from Phase 1**. | Backend |
| Clerk webhook reliability | High | Medium | **Upsert fallback** on first authenticated Convex call if Convex user row missing. | Backend |
| Monorepo build time creep | Medium | High | **Turborepo remote cache** Day 1; decouple `packages/ui` changes from `packages/convex` where possible. | DevOps |
| Dev environment collision | Medium | High | **LOCAL_DEV.md:** one `convex dev` owner; others `npx convex dev --once` for schema pushes; `--prod-like` for integration tests. | Team |
| Scope creep | High | High | **Phase gates:** MVP = CRUD + publish + security foundations; new features need explicit prioritization. | PM |

---

## 11. Repository structure (target)

```
root/
├── apps/
│   ├── marketing/          # Next.js → Vercel Project A
│   └── admin/                # Next.js → Vercel Project B
├── packages/
│   ├── convex/               # SINGLE source of truth
│   │   ├── convex/
│   │   │   ├── schema.ts
│   │   │   ├── posts/
│   │   │   └── users/
│   │   └── package.json
│   ├── ui/                   # Shared components (shadcn)
│   └── auth/                 # Shared Clerk helpers
├── turbo.json
└── pnpm-workspace.yaml
```

---

## 12. Deployment strategy

| Target | Mechanism |
|--------|-----------|
| **Convex** | `npx convex deploy` on push to **main** after **TypeScript** passes in CI |
| **Marketing** | Vercel auto-deploy `apps/marketing` |
| **Admin** | Vercel auto-deploy `apps/admin`; **environment protection** (approval) recommended |

Production Convex URL must be the only target for production Vercel envs on **main**.

---

## 13. Implementation phases

**Structural rule:** Security (Convex auth on every admin mutation, XSS pipeline) is **Phase 1**, not a later hardening pass. Preview and full SEO are **Phase 2** features with explicit gates.

### Phase 0: Foundation (week 1)

- Turborepo + pnpm workspaces; **enable remote caching immediately**
- Single Convex project in **`packages/convex`**
- Clerk configured with **admin role claim**
- Vercel projects + **t3-env** validation for shared secrets (`CONVEX_DEPLOY_KEY`, `CLERK_SECRET_KEY`, `UPLOADTHING_TOKEN`, etc.)
- Schema defined including **scheduled** / **version** / **parentId** (even if UI later)
- **LOCAL_DEV.md** — `convex dev` ownership rules
- **`uploadFile()`** abstraction (UploadThing inside only here)

**Gate:** Both apps run locally with hot reload, **one** Convex dev instance; schema reviewed; upload wrapper tested.

### Phase 1: MVP content + security foundations (weeks 2–3)

- `posts` table + public/admin function split per Section 5
- **Auth template on every mutation from Day 1** of this phase
- Admin: TipTap editor; **Zod on save**; **DOMPurify** on render
- UploadThing via **wrapper** only; image limits documented
- Marketing: blog list + post pages via **ISR/SSG** (not per-request Convex for static paths)
- Clerk webhook + **upsert fallback**
- Basic SEO fields (title, description, OG)
- **Establish Convex p95 baseline**

**Gate:** Publish from admin → visible on marketing; drafts never public; all mutations authenticated; XSS mitigations active.

### Phase 2: Preview + SEO (week 4)

- JWT preview URLs (Section 7)
- Sitemap (`lastmod`), RSS, canonical headers, `robots.txt` (disallow admin; allow blog)
- Security audit: draft ID manipulation → **404**

**Gate:** Preview works; no draft leakage; sitemap validates; canonicals verified.

### Phase 3: Polish, performance, monitoring (week 5)

- Image optimization pipeline
- Convex errors → Sentry/Datadog; UploadThing failures → Slack
- **p95 alerting** (threshold vs Phase 1 baseline, e.g. **50% degradation**)
- Lighthouse **> 90** target
- Google Search Console verification
- README, **DEPLOYMENT.md**, **LOCAL_DEV.md** complete

**Gate:** Lighthouse target met; monitoring live; docs reviewed.

### Phase 4: Future (post-MVP)

- Search (Algolia / Meilisearch)
- **Scheduling** cron (schema already supports `scheduled`, `scheduledAt`)
- Revision UI (`postRevisions` or version diffs)

**Gate:** Each item requires **explicit prioritization** before work.

---

## 14. Success criteria (definition of done)

### Functional

- **Single source of truth:** `git log --oneline packages/convex/` shows all Convex changes; **no** `convex/` dirs under `apps/`
- **Auth:** Admin enforced **in Convex**, not UI-only; unauthenticated calls get **401**/unauthorized errors
- **Draft protection:** `curl` marketing with draft slug/ID → **404**; preview tokens invalid/expired/wrong → **404** only

### Performance and SEO

- **Core Web Vitals:** LCP **< 2.5s** on post pages (Vercel Analytics)
- **SEO:** Sitemap updates on publish; canonicals to **www** blog paths; no duplicate indexable content between apps
- **Convex:** p95 tracked from Phase 1; alert by Phase 3

### Operational

- Convex deploy **after** TS check; production Convex only from **main**
- Docs: **README** (monorepo), **`.env.example`**, **DEPLOYMENT.md**, **LOCAL_DEV.md**
- **Vendor resilience:** Upload mock swap proves abstraction (no direct UploadThing outside wrapper)

### Monitoring

- Convex errors → Sentry/Datadog; UploadThing issues → Slack
- **Uptime targets:** Marketing **99.9%**; admin **99%** acceptable (internal)
- **Regression:** Alert if p95 **> 1.5×** baseline (or agreed threshold)

---

## 15. Immediate next steps (before heavy implementation)

1. **Draft `posts` + `users` schema** — Done for review: [`docs/SCHEMA_DRAFT_POSTS_USERS.md`](docs/SCHEMA_DRAFT_POSTS_USERS.md). **Team review before code** (Clerk `isAdmin` source, slug uniqueness).
2. **Monorepo tool:** **Turborepo** — Recorded in [`docs/ADR-001-turborepo-monorepo.md`](docs/ADR-001-turborepo-monorepo.md).
3. **Convex:** Project settings + **deploy key** for CI (ops).
4. **Lock env:** **`lib/env.ts`** in admin and marketing (`@t3-oss/env-nextjs`) covers `CONVEX_*`, `CLERK_*`, `UPLOADTHING_*`, `NEXT_PUBLIC_*`, etc. Add **`CONVEX_DEPLOY_KEY`** to the schema when CI runs `convex deploy` from this repo. `SKIP_ENV_VALIDATION` documented in `.env.example`.
5. **LOCAL_DEV.md** — [`docs/LOCAL_DEV.md`](docs/LOCAL_DEV.md) (current two-folder workflow + post-monorepo target).
6. **DEPLOYMENT.md** — [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) (Vercel/Convex checklist).
7. **UploadThing client abstraction** — Per app, `@uploadthing/react` is only imported in `lib/uploads/client.ts`; feature code imports `UploadButton` / `UploadDropzone` from there. Server router (`uploadthing.ts`) and API route remain the only `uploadthing/next` touchpoints. (Programmatic `uploadFile()` can wrap SDK calls in the same folder when needed.)

---

## 16. Related documents

**Workspace (`docs/`):**

- [`docs/ADR-001-turborepo-monorepo.md`](docs/ADR-001-turborepo-monorepo.md) — Monorepo decision
- [`docs/LOCAL_DEV.md`](docs/LOCAL_DEV.md) — Convex dev ownership and ports
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Deploy and env checklist
- [`docs/SCHEMA_DRAFT_POSTS_USERS.md`](docs/SCHEMA_DRAFT_POSTS_USERS.md) — Blog `posts` + `users` draft
- [`docs/PRE_MONOREPO_GITHUB_MAIN.md`](docs/PRE_MONOREPO_GITHUB_MAIN.md) — Old GitHub `main` tip (`83a1504`); tag `pre-monorepo-github-main`

**Legal / engagement artifacts:**

- `ForhemitLegal/` — engagement letter, stewardship agreement, attorney checklists, revised HTML forms (tracked in git)

**Existing app docs:**

- `ForhemitAdminWebsite-main/AGENTS.md`
- `ForhemitAdminWebsite-main/STRUCTURE_ANALYSIS.md` / `ForhemitComing-main/STRUCTURE_ANALYSIS.md`
- `ForhemitAdminWebsite-main/REPO_SPLIT_COMPLETE.md`
- `ForhemitAdminWebsite-main/MODULAR_DESIGN.md`, `REFACTORING_PLAN.md`

---

## 17. Plan revision history

| Change | Notes |
|--------|--------|
| Blog platform revision | Risk register with owners; Turborepo + pnpm + single `packages/convex`; auth upsert fallback; JWT preview with 404-oracle mitigation |
| Security in Phase 1 | Auth template + XSS (Zod save + DOMPurify) alongside MVP CMS |
| Forward-compatible schema | `scheduled`, `version`, `parentId` from Day 1 |
| New risks | Convex cold start/ISR, Clerk webhook reliability, UploadThing lock-in, monorepo build time |
| Ops | t3-env, p95 baseline Phase 1, remote cache Day 1, Phase 3 alerting |
| SEO | www canonical, admin noindex, sitemap/RSS Phase 2 |
| Docs scaffold | `docs/ADR-001`, `LOCAL_DEV`, `DEPLOYMENT`, `SCHEMA_DRAFT_POSTS_USERS`; Sections 15–16 updated with links |
| Upload client + repo hygiene | Root `.gitignore` (`.DS_Store`); `lib/uploads/client.ts` in admin and marketing apps; `ForhemitLegal` linked in Section 16 |

---

*Last updated: harmonization plan + upload abstraction + root gitignore.*

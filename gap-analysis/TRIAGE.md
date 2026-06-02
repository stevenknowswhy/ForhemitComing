06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Forhemit Gap Analysis — Unified Triage
**Date:** 2026-06-02  
**Scope:** `/Users/stephenstokes/Workspace/Projects/Forhemit`  
**Sources:** architecture.md, docs-roadmap.md, testing-quality.md, security-deployment.md

---

## 🔴 CRITICAL — Fix Today

| # | Issue | Files | Blast Radius |
|---|-------|-------|--------------|
| 1 | `SUPER_ADMIN_EMAIL` hardcoded in two source files | `packages/convex/convex/lib/requireAdmin.ts:6`, `apps/admin/lib/clerk.ts:4` | Org-change requires code change + redeploy; leaks internal identity |
| 2 | `POST /api/process-queue` is unauthenticated | `apps/admin/app/api/process-queue/route.ts` | Spam/abuse, doc generation via spoofed input, data leakage |
| 3 | Convex HTTP action uses `Access-Control-Allow-Origin: *` | `packages/convex/convex/http.ts:15-18` | CSRF, cross-origin consumption of Convex endpoints |
| 4 | Root `.gitignore` does not ignore per-app `.env.local` | `.gitignore` | `git add .` can leak live credentials from any app |
| 5 | `SKIP_ENV_VALIDATION=true` bypasses all env schema checks | `apps/admin/lib/env.ts:56-57`, `apps/marketing/lib/env.ts:38-39` | Deploys silently succeed with missing/wrong secrets |
| 6 | Sentry integration files entirely absent in admin app | Docs reference `sentry.client.config.ts`, `sentry.server.config.ts`, `instrumentation.ts` — none exist | Sentry is non-functional despite docs claiming it’s set up |
| 7 | `packages/convex` has no `tsconfig.json` and no typecheck | `packages/convex/package.json` (no typecheck script) | Any Convex refactor is untestable at build time |

---

## 🟠 HIGH — Fix This Sprint

| # | Issue | Files | Blast Radius |
|---|-------|-------|--------------|
| 8 | Three strategy docs referenced in `HARMONIZATION_PLAN.md` and `GOD.md` are missing | `docs/LOCAL_DEV.md`, `docs/DEPLOYMENT.md`, `docs/PRE_MONOREPO_GITHUB_MAIN.md` | Onboarding and deployment follow broken links |
| 9 | `docs/completed/` has only 3 of ~15 completed items from `PROJECT_STATUS.md` | `docs/completed/`, `PROJECT_STATUS.md:18-113` | No source of truth for what shipped |
| 10 | `CONVEX_FIXES_PLAN.md` references deleted `dealProcessor.ts` | `CONVEX_FIXES_PLAN.md`, `PROJECT_STATUS.md:166-169`, `PRODUCTION_READINESS_REPORT.md:26` | Stale plan misleads anyone fixing Convex |
| 11 | `PROJECT_STATUS.md:155-161` lists branches that don’t exist | `PROJECT_STATUS.md` | Gives false sense of parallel workstreams |
| 12 | `packages/ui` and `packages/auth` referenced but don’t exist | `HARMONIZATION_PLAN.md:61-62` | Duplicated admin/marketing component debt |
| 13 | No root `tsconfig.json` | repo root | No monorepo-wide typecheck gate |
| 14 | Marketing `vitest.config.ts` missing `@forhemit/shared` alias | `apps/marketing/vitest.config.ts` | Any shared-component test fails to resolve |
| 15 | CI runs `turbo test` and `tsc` but **never runs lint** | `.github/workflows/ci.yml` | Lint errors can ship undetected |
| 16 | Dark-mode plan claims complete; `admin-stitch.css` has 0 `.dark` rules | `apps/admin/app/admin/admin-stitch.css` | Layout breaks in dark mode |
| 17 | Marketing CSP omits Sentry and Clerk `frame-src` | `apps/marketing/next.config.js` | Sentry blocked; Clerk OAuth may break in preview |

---

## 🟡 MEDIUM — Fix This Month

| # | Issue | Files |
|---|-------|-------|
| 18 | No Prettier config or format gate anywhere | repo-wide |
| 19 | No `test:ci` script in any package (marketing/admin rely on turbo appending `--run`) | `apps/admin/package.json`, `apps/marketing/package.json` |
| 20 | `packages/shared` has no build verification script | `packages/shared/package.json` |
| 21 | Dedup plan “Pending approval” — no phase verified complete | `docs/design/admin-marketing-page-dedup.md` |
| 22 | `docs/SCHEMA_DRAFT_POSTS_USERS.md` says “Review before implementation” but `posts`/`users` exist | `docs/SCHEMA_DRAFT_POSTS_USERS.md`, `packages/convex/convex/posts.ts` |
| 23 | `ADMIN_TOKEN` is optional env with hardcoded fallback in `requireAdmin` | `packages/convex/convex/lib/requireAdmin.ts:24-27`, `apps/admin/lib/env.ts:22` |
| 24 | No `middleware.ts` in either app for edge-level security headers | `apps/admin/`, `apps/marketing/` |
| 25 | `NET_PUBLIC_SITE_URL` hardcoded to `https://forhemit.website` in example | `apps/admin/.env.example:58` |
| 26 | `.env.local.example` leaks real admin email in both apps | `apps/admin/.env.local.example`, `apps/marketing/.env.local.example` |

---

## ℹ️ LOW — Backlog / Nice-to-Have

| # | Issue | Files |
|---|-------|-------|
| 27 | Zero ADRs for major decisions (Convex single-pkg, Clerk model, XSS, Sentry) | `docs/ADR-001-*` only |
| 28 | No runbooks for deploy, incidents, rollback, webhooks | repo-wide |
| 29 | `__tests__` directories exist but are empty in many places | `apps/admin/lib/__tests__/`, `apps/marketing/` |
| 30 | Marketing e2e is byte-for-byte copy of admin e2e | `apps/marketing/e2e/homepage.spec.ts` |
| 31 | No husky/pre-commit hooks despite `AGENTS.md` requesting them | `package.json`, `AGENTS.md` |
| 32 | `docs/journal-roadmap.md:24` marks Phase 7 “In progress” despite `[x] done` in body | `docs/journal-roadmap.md` |

---

## Recommended Execution Order

**Day 1 (security + build blockers)**
1. `.gitignore` fix — add per-app `.env.local` patterns
2. Hardcode removal — move `SUPER_ADMIN_EMAIL` to env with dev fallback
3. Auth guard — protect `POST /api/process-queue`
4. CORS fix — restrict `http.ts` origins
5. `SKIP_ENV_VALIDATION` — remove from production paths

**Day 2-3 (observability + type safety)**
6. Convex typecheck — add `tsconfig.json` + script
7. Root tsconfig — monorepo-wide strict gate
8. Sentry — create missing config files or remove claims
9. Marketing vitest alias — mirror admin’s `@forhemit/shared`

**Day 4-7 (documentation + dark mode)**
10. Dark-mode CSS verification — implement `.dark` in `admin-stitch.css`
11. Reconcile `docs/completed/` with `PROJECT_STATUS.md`
12. Remove/replace stale docs (`CONVEX_FIXES_PLAN`, `SCHEMA_DRAFT_POSTS_USERS`)
13. Create missing `docs/DEPLOYMENT.md` + `LOCAL_DEV.md`
14. Update `PROJECT_STATUS.md` to reflect actual branch/task reality

---

## Source Files

- `/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/architecture.md`
- `/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/docs-roadmap.md`
- `/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/testing-quality.md`
- `/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/security-deployment.md`

06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Gap Analysis: docs/ and roadmap/ vs. Actual Implementation

**Generated:** 2026-06-02  
**Repo:** /Users/stephenstokes/Workspace/Projects/Forhemit  
**Scope:** Documentation alignment audit across `docs/`, `roadmap/` (task), `PROJECT_STATUS.md`, `docs/completed/`, `HARMONIZATION_PLAN.md`, actual `apps/` and `packages/` trees.

---

## 1. CRITICAL ISSUES

### 1.1 Referenced docs are MISSING from the filesystem
Multiple strategy/lock docs are referenced in other documents but do not exist.

- `docs/LOCAL_DEV.md` — Referenced by `HARMONIZATION_PLAN.md` lines 315-316 and `docs/GOD.md` line 12.
- `docs/DEPLOYMENT.md` — Referenced by `HARMONIZATION_PLAN.md` lines 316-317 and `docs/GOD.md` line 11.
- `docs/PRE_MONOREPO_GITHUB_MAIN.md` — Referenced by `HARMONIZATION_PLAN.md` line 329 and `docs/GOD.md` line 13.

**Impact:** Onboarding, local dev setup, and deployment checklists are broken. Engineers following the harmonization plan hit 404s.

---

### 1.2 `docs/completed/` is severely out of sync with `PROJECT_STATUS.md`

`docs/completed/` contains exactly 3 files:
- `docs/completed/dark-mode-plan-admin.md`
- `docs/completed/herdr-session-2026-05-25.md`
- `docs/completed/multi-agent-workflow-skill-created.md`

`PROJECT_STATUS.md` (lines 18-113) lists **at least 12 completed deliverable items** that are absent from `docs/completed/`:
1. CodeFlow analysis triage
2. Convex auth guards (23 files, commit `ae2c8e3`)
3. XSS sanitization (5 files, commit `e74d5d6`)
4. Duplicate-code mapping / deleted `" 2"` directories
5. Smoke test verification (2026-05-25)
6. Build fix — type errors 124 → 0 (commit `838c872`)
7. ESLint flat config setup (`fbbb499`)
8. `.env.example` creation
9. Stale worktree cleanup
10. Sentry `feature/sentry-config` merge (commit from journal)
11. Web-vitals tracking merge
12. Engagement-letter consolidation (commit `68f811d`)

**Impact:** No single source of truth for completed work. Historical sessions and merges are scattered in `PROJECT_STATUS.md` instead of the formal `docs/completed/` registry.

---

### 1.3 Stale/unreferenced architectural plans

- `CONVEX_FIXES_PLAN.md` — References `packages/convex/convex/dealProcessor.ts` as an existing file (line 8, line 17, etc.). That file no longer exists in the filesystem. The plan was created pre-refactor and is now stale.
- `PROJECT_STATUS.md` line 169 still lists "dealProcessor.ts has `@ts-nocheck` — circular type inference," but no such file is found under `packages/convex/convex/`. The concern may have moved to another module, but the status doc is misleading.
- `docs/roadmap-pi-lens-remediation.md` — Notes "9 remaining as any" (line 37) but references commits (`3b959f0`, `9fc8443`) not present in current git log. Effectiveness of remediation is unverifiable.

---

## 2. ROADMAP ALIGNMENT GAPS

### 2.1 docs/roadmap.md is stale and narrow

`docs/roadmap.md` only covers:
- Completed shared-package extractions (P0-P2)
- A single "CRM Type Reconciliation" red flag
- Placeholder P3-P5 dedup phases with no status

It omits:
- Current security audit work described in `PROJECT_STATUS.md` (P0–P2 items)
- Active feature branches listed in `PROJECT_STATUS.md` lines 152-161
- Recent rate-limiting, Sentry, web-vitals, console-cleanup, and agent-queue-split items from the 2026-05-25/31 sprints
- `docs/journal-roadmap.md` and `journal-next-steps.md` content (which is substantial and active)

**Line-by-line issues:**

| File | Line(s) | Issue |
|------|---------|-------|
| `docs/roadmap.md` | 3-11 | Claims only 4 extraction steps are "Completed" (`P0`, `P1`, `P2a`, `P2b`, `P2c`). Ignores P2d, P3–P5 dedup. |
| `docs/roadmap.md` | 14-45 | "CRM Type Reconciliation" flagged as 🔴 Planned/blocked. However, `packages/shared/src/features/crm/types.ts` (385 lines, dated 2026-05-31) already exists with a unified types superset. This plan is premature or already superseded and should be marked in-progress or done. |
| `docs/roadmap.md` | 41-45 | "Other Dedup Phases (P3–P5)" — no ownership, no timeline, no signals of whether these were started. At minimum these need an explicit "not started as of 2026-06-02" status. |

### 2.2 Missing roadmap files at repo root

Task instructions asked for `roadmap.md` and `journal-roadmap.md` at repo root. Both files exist only inside `docs/`:
- `docs/roadmap.md`
- `docs/journal-roadmap.md`

No copies or symlinks exist at the root. Any tooling expecting root-level files will fail with "File not found."

---

## 3. DISCREPANCIES BETWEEN docs/completed/ AND REALITY

### 3.1 `docs/completed/dark-mode-plan-admin.md` is a plan artifact, not a completion record
- File: `docs/completed/dark-mode-plan-admin.md`
- Lines 1-7: Header claims "✅ COMPLETED — 2026-05-31"
- Lines 103-154: Still lists detailed execution steps ("Execution Order 1-6"), file-by-file TODO lists, and "Need to verify/fix" items for buttons/badges/inputs/selects/dropdowns/tabs.

This appears to have been marked done before all the planned verification work was finished. Either the file should remain in `docs/plan/` until fully executed, or the verification checklist should be archived separately.

### 3.2 `docs/completed/herdr-session-2026-05-25.md` groups unmerged work as "completed"
- File: `docs/completed/herdr-session-2026-05-25.md`  
- Lines 52-71: Workspaces 7 (P2-1 AgentQueue Split), 8 (P2-4 Console Cleanup), and 9 (P2-2 Circular Deps) are listed as completed but explicitly say "NOT merged to main or pushed."
- `PROJECT_STATUS.md` lines 128-135 mark the same items as unchecked (still todo) or "no immediate need." The docs label them completed while PROJECT_STATUS does not — contradiction.

---

## 4. BROKEN LINKS & STALE ADRs

### 4.1 HARMONIZATION_PLAN.md references missing files (broken links)

| Reference location | Referenced file | Found? |
|---------------------|-----------------|--------|
| `HARMONIZATION_PLAN.md` line 315 | `docs/LOCAL_DEV.md` | ❌ Missing |
| `HARMONIZATION_PLAN.md` line 316 | `docs/DEPLOYMENT.md` | ❌ Missing |
| `HARMONIZATION_PLAN.md` line 329 | `docs/PRE_MONOREPO_GITHUB_MAIN.md` | ❌ Missing |
| `docs/GOD.md` line 11 | `docs/DEPLOYMENT.md` | ❌ Missing |
| `docs/GOD.md` line 12 | `docs/LOCAL_DEV.md` | ❌ Missing |
| `docs/GOD.md` line 13 | `docs/PRE_MONOREPO_GITHUB_MAIN.md` | ❌ Missing |

### 4.2 ADR catalog is under-populated
Only 1 ADR exists (`docs/ADR-001-turborepo-monorepo.md`) for a project with this much architectural work:
- Single-convex migration
- Clerk authorization model choice
- UploadThing abstraction
- DOMPurify / XSS strategy
- Sentry observability
- Turborepo + pnpm choice

Most of these were decided implicitly in `HARMONIZATION_PLAN.md` but never turned into standalone ADRs.

### 4.3 GOD.md stale timestamp
- File: `docs/GOD.md` line 7
- All "Last Verified" timestamps are `2026-05-26T01:58:00`, even though later activity exists (2026-05-25, 2026-05-29, 2026-05-30, 2026-05-31 in other docs). This document is out of date.

---

## 5. MISSING RUNBOOKS

No runbooks exist in the entire repo. Zero files matched `*runbook*` search. Given the project's complexity (Convex CI deploy, Clerk webhooks, Box/Resend/Puppeteer integrations, ESOP transaction workflows, agent queueing), the following runbooks are missing:

1. **Deploy runbook** — Convex deploy steps, Vercel promotion steps, env var rotation
2. **Incident runbook** — Convex outage, auth bypass scenario, email failure, box webhook failure
3. **Database/Backfill runbook** — Schema migration steps (e.g., `migrations/crmRefocus.ts`, `backfillClientSummary.ts` lack runbook context)
4. **Rollback runbook** — Reverting `main` after bad deploy
5. **Webhook verification runbook** — Clerk/Box/Resend webhook debugging steps

---

## 6. IMPLEMENTATION VS. PLANNED FEATURES

### 6.1 Planned packages that don't exist
`HARMONIZATION_PLAN.md` Section 11 lines 203-204 describes a target Monorepo with:
- `packages/ui` (shared shadcn components)
- `packages/auth` (shared Clerk helpers)

Neither directory exists. `packages/react-bits/` exists but is empty.

### 6.2 `packages/ui` emptiness vs. local component libraries
Both `apps/admin/components/` and `apps/marketing/components/` contain duplicated UI code (cards, layout, animation, visualizations, dock, blog). The `packages/shared/src/styles/` directory has 11 CSS files extracted for shared marketing pages, but no shared UI component package bridges the two apps.

### 6.3 Blog posts feature: partially implemented but roadmap is stale
`HARMONIZATION_PLAN.md` describes Phases 1-4 for the blog platform. Actual state:

| Planned Step | Actual State |
|--------------|--------------|
| `packages/convex/schema.ts` `posts` table | ✅ Exists (verified via grep) |
| `packages/convex/convex/posts.ts` | ✅ 443-line file with 443 lines including `requireAdmin`, slug validation, publishing logic |
| Marketing blog routing (`/blog/[slug]/page.tsx`) | ✅ File exists under `apps/marketing/app/blog/[slug]/page.tsx` (55 lines, uses `fetchPublishedPostSlugs`, `fetchPostBySlug`) |
| Zod validation on save | Unverified |
| DOMPurify on render | Partially: `docs/roadmap-pi-lens-remediation.md` line 51 mentions it was planned; `docs/journal-next-steps.md` line 78 notes PDF generation uses admin HTTP endpoint |
| JWT preview URLs | Unverified |
| ISR/SSG caching | Partial: `generateStaticParams()` exists in blog page |
| Scheduling (scheduledAt cron) | Schema field exists; no cron observed |
| Users table | ✅ Schema references `users` |

`docs/SCHEMA_DRAFT_POSTS_USERS.md` still says "Status: Review before implementation" (line 3), but the schema and functions are already in the repo. This doc is stale and should be archived or updated to "✅ Implemented."

### 6.4 Dark mode: plan marked done, verification unclear
- `docs/completed/dark-mode-plan-admin.md` header says "COMPLETED 2026-05-31"
- Body (lines 119-154) contains step 4 "14 admin pages — Add `dark:` variants" and step 5 "UI components — Verify + fix each shared component"
- No separate test/report artifact exists confirming the dark mode toggle was actually tested on all 14 pages; the `PROJECT_STATUS.md` checklist does not mention dark mode verification either.

---

## 7. INCONSISTENT / MISLEADING STATUS STATEMENTS

| Document | Lines | Claim | Reality |
|----------|-------|-------|---------|
| `docs/journal-roadmap.md` | 24 | "7. Advanced features — 🔄 In progress (4b851b2)" | `git log` shows `4b851b2` is a few commits back and the work it started (auto-narrative) is marked `[x]` done at line 47. The phase appears closed. |
| `PROJECT_STATUS.md` | 155-161 | Active branches listed (feature/type-safety-cleanup, deploy-config, observability, security-rate-limiting, agent-wiring, blog-convex-admin-seed) | `git branch --list` returns only `* main`. None of these branches exist locally. |
| `PROJECT_STATUS.md` | 138 | "7 test files across 1,373 source files (0.5%)" | `__tests__` directories exist under `apps/admin/lib/`, `apps/marketing/lib/`, and `freellmapi/server/src/`, but an exhaustive search found **zero test files** (`*.test.ts`, `*.spec.ts`). The 0.5% claim is unverifiable and likely stale. |
| `PROJECT_STATUS.md` | 139 | ".env.example — already exists" | Not verified here, but referenced many places. |
| `docs/roadmap.md` | 7 | Root-level hooks merged (`7748db1`) | Not found in current git log (only 20 most recent shown). |

---

## 8. AGGREGATED EVIDENCE SUMMARY

### 8.1 What actually exists in apps/ and packages/
- Apps: `apps/admin`, `apps/marketing`
- Packages: `packages/convex` (complete Convex backend), `packages/shared` (extracted hooks, lib, features, styles), `packages/react-bits` (empty)
- Missing packages: `packages/ui`, `packages/auth`
- Marketing `convex/` dir: auto-generated only (`_generated/`) — no source files; consistent with "single convex" goal
- Blog posts: implemented at `packages/convex/convex/posts.ts` + `apps/marketing/app/blog/[slug]/page.tsx`
- Tests: `__tests__` directories exist but are empty; 0 test files found in main code

### 8.2 What docs claim vs. reality

| Claimed Plan / Target | Actual State |
|----------------------|--------------|
| `docs/LOCAL_DEV.md` exists | ❌ Missing |
| `docs/DEPLOYMENT.md` exists | ❌ Missing |
| `packages/ui` + `packages/auth` exist | ❌ Missing |
| Archives in `docs/completed/` cover all finished work | ❌ Only 3 of ~15 items |
| `dealProcessor.ts` exists at packages/convex/convex/ | ❌ Missing (renamed/moved) |
| `CONVEX_FIXES_PLAN.md` is actionable | ❌ References nonexistent files |
| Journal Phase 7 still in progress | ❌ Already marked done in journal-roadmap.md itself |
| Active branches listed in PROJECT_STATUS.md | ❌ None exist locally |
| 7 test files / 0.5% coverage | ❌ 0 test files found |

---

## 9. RECOMMENDED ACTIONS (Priority Order)

1. **Recreate the missing lock docs** or acknowledge deletion: `docs/LOCAL_DEV.md`, `docs/DEPLOYMENT.md`, `docs/PRE_MONOREPO_GITHUB_MAIN.md`.
2. **Prune `docs/completed/` backlog:** Archive/stage the 12 missing completed items into `docs/completed/` so the registry reflects reality.
3. **Deprecate or archive** `CONVEX_FIXES_PLAN.md` (references deleted files), `docs/SCHEMA_DRAFT_POSTS_USERS.md` (implemented), and the stale CRM Type Reconciliation section in `docs/roadmap.md`.
4. **Update `docs/roadmap.md`** to reflect current P0-P3 status, journal progress, and branch reality; remove claims about branches that no longer exist.
5. **Update `journal-roadmap.md`** Phase 7 status to done (or remove "In progress" marker).
6. **Add at least 3 ADRs** — Convex single-package decision, Blog forward-compatible schema, Auth model (requireAdmin vs. requireAuth).
7. **Create runbooks** — Deploy runbook and Incident runbook are the highest-value missing artifacts.
8. **Resolve the dark mode verification gap** — add a test report or remove "COMPLETED" until verification is documented.
9. **Resolve test coverage claim** — either produce real tests or update PROJECT_STATUS.md line 138 to a verified count.
10. **Address `@ts-nocheck` and `noImplicitAny` status** — verify if `dealProcessor.ts` issue still exists elsewhere (the referenced file is gone) and update `PROJECT_STATUS.md` lines 159-170.

---

*End of gap-analysis*

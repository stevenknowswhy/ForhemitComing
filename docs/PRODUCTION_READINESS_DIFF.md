# Production Readiness — Fresh Diff

Last updated: 05/26/26 01:58 AM PT
Purpose: Diff-based production readiness tracking against baseline report

**Date:** 2026-05-25 (updated)
**Baseline:** `PRODUCTION_READINESS_REPORT.md` at commit `eb37111`
**Current HEAD:** `aa73746`
**Build:** ✅ Both apps compile | **Tests:** ✅ 69/69 pass | **Type errors:** 0

---

## ✅ Completed Since Last Report (8 items)

| # | Item | Commit | Before → After |
|---|------|--------|----------------|
| 1 | Remove `@ts-nocheck` from dealProcessor.ts | `cb26b65` | Had `@ts-nocheck` → Removed, explicit types added |
| 2 | Re-enable `noImplicitAny` in admin tsconfig | `68f811d` | `noImplicitAny: false` → Removed (defaults to true), 0 errors |
| 3 | Remove `as any` casts from Convex | `68f811d`, `838c872` | Many casts → 8 remaining (down from 20+) |
| 4 | Delete `.backup` files (admin) | `cb26b65` | 14 files → 0 in admin (4 remain in marketing) |
| 5 | Create root `.env.example` | `cb26b65` | Missing → Created |
| 6 | Convex auth guards | `ae3dc9c` (merged) | 5/36 protected → 28/36 protected |
| 7 | XSS — DOMPurify sanitization | `d1dc728` (merged) | Raw HTML → DOMPurify.sanitize() on admin dangerouslySetInnerHTML |
| 8 | Deployment runbook | `f14240f` (herdr) | Missing → `docs/DEPLOYMENT.md` exists |

**Bonus (not in original report):**
- ESLint 10 added with flat config, 84 errors fixed (`fbbb499`)
- Type-narrowed `ctx.db.get()` unions in triggers.ts + workflowTasks.ts (`838c872`)

---

## ❌ Still Remaining (12 items)

### Security (3 items)

| # | Item | Priority | Effort | Status |
|---|------|----------|--------|--------|
| 1 | **API rate limiting** — zero rate limiting on any endpoint | 🔴 High | 3-4h | Not started. No `@upstash/ratelimit` installed. |
| 2 | **UploadThing `maxFileCount`** — unlimited file count per upload | 🟡 Medium | 15m | Not started. `uploadthing.ts` has no `maxFileCount`. |
| 3 | **Convex unprotected functions** — 8 files still have no auth guard | ⚪ Low | N/A | **Correctly exempt.** `authEmails`, `brokerEmails`, `notifications`, `pdfGenerator` are internal service actions called via `ctx.runMutation()`. `schema`, `seed*`, `templates` are non-executable. `dealProcessor`, `emailCore`, `emails`, `templateEmailer`, `templateGenerator` are internal pipeline functions. |

### Observability (5 items)

| # | Item | Priority | Effort | Status |
|---|------|----------|--------|--------|
| 4 | **Sentry DSN** — not in any `.env.example` | 🟡 Medium | 15m | No `NEXT_PUBLIC_SENTRY_DSN` in any env file. Config reads it but value is absent. |
| 5 | **Sentry source maps** — no upload in CI | 🟡 Medium | 30m | No `SENTRY_AUTH_TOKEN` in `.github/workflows/ci.yml`. Production stack traces will be minified. |
| 6 | **Structured logging** — 376 `console.log` calls | 🟡 Medium | 3-4h | `pino` not installed. `console.log` count down to ~2 in admin/app routes (herdr's `fix/cleanup-console-logs` worktree may be handling this). |
| 7 | **Web Vitals** — no LCP/FID/CLS tracking | 🟢 Low | 1h | Not configured. |
| 8 | **`SENTRY_SETUP.md`** — no setup guide | 🟢 Low | 15m | Missing. |

### Deployment (2 items)

| # | Item | Priority | Effort | Status |
|---|------|----------|--------|--------|
| 9 | **`SKIP_ENV_VALIDATION=true`** in CI — all 3 steps | 🟡 Medium | 30m | Still present in `ci.yml` lines 36, 43, 48. |
| 10 | **Stale worktrees** — `.worktrees/convex-auth`, `.worktrees/xss-fix` | 🟢 Low | 5m | Empty dirs, branches merged. Safe to delete. |

### Code Hygiene (2 items)

| # | Item | Priority | Effort | Status |
|---|------|----------|--------|--------|
| 11 | **4 `.backup` files in marketing** | 🟢 Low | 2m | `apps/marketing/`: `layout.tsx.backup`, `ConvexProvider.tsx.backup`, `InfrastructureAuditModal.tsx.backup`, `next.config.js.backup` |
| 12 | **8 `as any` casts in Convex** | 🟢 Low | 1-2h | In `documentPipeline.ts`, `emailCore.ts`, `templateGenerator.ts`, `triggers.ts`, `workflowTasks.ts`. Most are intentional type coercion for Convex union fields. |

---

## Priority Matrix

```
                    HIGH IMPACT
                        │
     ┌──────────────────┼──────────────────┐
     │                  │                  │
     │   Rate Limiting  │  Sentry DSN +    │
     │   (#1)           │  Source Maps     │
     │   3-4h           │  (#4, #5) 45m    │
LOW  │                  │                  │  HIGH
EFFORT│────────────────────────────────────│ EFFORT
     │                  │                  │
     │  maxFileCount    │  Structured      │
     │  (#2) 15m        │  Logging (#6)    │
     │  stale worktrees │  3-4h            │
     │  (#10) 5m        │                  │
     │  .backup files   │  SKIP_ENV_VAL    │
     │  (#11) 2m        │  (#9) 30m        │
     │  SENTRY_SETUP.md │                  │
     │  (#8) 15m        │                  │
     └──────────────────┼──────────────────┘
                        │
                    LOW IMPACT
```

---

## Recommended Next Steps

**Quick wins (30 min total):**
1. Delete 4 marketing `.backup` files
2. Delete stale `.worktrees/` dirs
3. Add `maxFileCount` to uploadthing.ts
4. Add Sentry DSN placeholder to `.env.example` files

**Sprint 1 (4-5h):**
5. Add rate limiting to API routes
6. Configure Sentry source maps in CI
7. Move `SKIP_ENV_VALIDATION` to type-check/test only (not build)

**Sprint 2 (3-4h):**
8. Replace `console.log` with pino (or wait for herdr's cleanup worktree)
9. Add Web Vitals tracking

---

## Active Worktrees (other agents)

| Worktree | Branch | Status |
|----------|--------|--------|
| `fix/agentQueue-god-file-split` | `5e626dd` | In progress |
| `fix/break-circular-dependencies` | `d2a1e74` | In progress |
| `fix/cleanup-console-logs` | `95fab93` | In progress — may cover item #6 |
| `fix/deduplicate-code` | `cb26b65` | In progress |

---

*Diff generated 2026-05-25 against `PRODUCTION_READINESS_REPORT.md` at `eb37111`.*

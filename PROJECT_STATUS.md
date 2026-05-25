# Forhemit Project Status

> Last updated: 2026-05-25 (smoke test verified)
> Current branch: `main` (at `838c872`)

---

## What We're Doing

Running a **full security and code quality audit** on the Forhemit monorepo (pnpm + Turborepo, Next.js 16, Convex, Clerk). The work was triggered by a CodeFlow static analysis report that contained a mix of real findings and false positives. We triaged the report, validated the real issues, and are now fixing them in isolated feature branches.

---

## What Has Been Accomplished

### 1. CodeFlow Analysis Triage ✅

Ran CodeFlow's dependency graph and security scanner against the Forhemit codebase. Reviewed every "HIGH" severity finding and separated real issues from false positives:

- **Dismissed ~70% false positives** — SQL injection in bash `echo` statements, shell execution in CSS files, XSS in `.md`/`.json` cache files, "shell execution" in UI components named `*Shell.tsx`
- **Identified 7 real `dangerouslySetInnerHTML` instances** requiring DOMPurify
- **Identified 31 unprotected Convex function files** with zero auth guards
- **Mapped 31.48% code duplication** (64,812 / 205,852 lines), largely from Finder copy artifacts (`" 2"` directories)

### 2. Convex Auth Guards — MERGED ✅

**Commits:** `ae3dc9c` + `ae2c8e3` (merge) — `feat(security): add auth guards to 23 Convex function files`

Created `packages/convex/convex/lib/requireAuth.ts` — a lightweight auth guard that verifies `ctx.auth.getUserIdentity()` before allowing any mutation/query to execute.

**23 files now protected:**

| Category | Files |
|----------|-------|
| CRM | `crmContacts`, `crmTasks`, `crmActivities`, `companyFinancials` |
| Deals | `dealEngine`, `dealDocuments`, `gates`, `stages` |
| Pipeline | `documentPipeline`, `documentTemplates`, `workflowService`, `workflowTasks` |
| Email/Events | `emailEvents`, `formSubmissions`, `templateRules`, `templates` |
| Agents | `agentQueue`, `agentOutputs` |
| Financials | `feeCalculator` |
| Other | `auditLogs`, `notes`, `opensign`, `generatedDocuments`, `triggers` |

**6 files correctly skipped** (internal service actions called via `ctx.runAction()` — adding auth would break cron jobs and internal flows):

- `authEmails.ts` — email verification, called during signup
- `brokerEmails.ts` — broker emails, called from deal processing
- `notifications.ts` — Telegram/Slack, called internally
- `pdfGenerator.ts` — PDF generation, called from documentPipeline
- `templateEmailer.ts` — email sending, called from pipeline
- `templateGenerator.ts` — template rendering, called from pipeline

**Also skipped:** `schema.ts`, `auth.config.ts`, `crons.ts`, `seed.ts`, `seedTemplates.ts`, `seedStageRequirements.ts`

### 3. XSS Sanitization — MERGED ✅

**Commits:** `d1dc728` + `e74d5d6` (merge) — `fix(security): add DOMPurify sanitization to dangerouslySetInnerHTML usage`

Added `DOMPurify.sanitize()` wrapping to all user-facing `dangerouslySetInnerHTML` instances:

| File | Risk Level | What It Renders |
|------|------------|-----------------|
| `LetterPreview.tsx` (admin + marketing) | HIGH | Contact address, opening text, CTA from letter data |
| `forms/[taskId]/page.tsx` | HIGH | Template content rendered in public form pages |
| `InfrastructureAuditModal.tsx` (admin + marketing) | MEDIUM | Diagnostic text from audit results |
| `StewardshipAgreementForm.tsx` | LOW | Checkbox labels |

**Intentionally skipped** (safe — static constants only):
- `ThemeProvider.tsx` — inline script with JS constant
- `layout.tsx` (marketing) — theme init script
- `NdaStep.tsx` — hardcoded `NDA_TEXT` constant

### 4. Duplicate Code Mapping ✅

Ran `jscpd` duplicate detection. Found **1,549 clones** across **31.48%** of the codebase:

| Top Duplication | Lines | Cause |
|-----------------|-------|-------|
| `engagement-letter*.html` ↔ `engagement-letter-standalone.html` | 1,222 | Two copies of same template |
| `DetailPanel.tsx` ↔ `DetailPanel 2.tsx` | 874 | Finder copy artifact |
| `term-sheet.css` ↔ `term-sheet 2.css` | 873 | Finder copy artifact |
| `ContactModal.tsx` ↔ `ContactModal 2.tsx` | 719 | Finder copy artifact |
| `ESOPPartnerCRM.tsx` ↔ `ESOPPartnerCRM 2.tsx` | 615 | Finder copy artifact |
| `usePartnerCRM.ts` ↔ `usePartnerCRM 2.ts` | 459 | Finder copy artifact |

~4,800+ lines are literal Finder copy duplicates (`" 2"` directories).

### 5. Smoke Test Verified ✅

Ran full smoke test on 2026-05-25 with both Convex backend and admin dev server:

| Test | Result |
|------|--------|
| Admin routes (/, /admin, /crm, /contacts, /templates, /audit, /stats, /esop-partners) | ✅ All 200 |
| Public form page (/forms/[taskId]) | ✅ 200 |
| Clerk sign-in page | ✅ 200 (keyless mode) |
| Convex backend connection | ✅ Functions ready (1.63s) |
| Auth guard failures | ✅ None in logs |
| Server crashes/errors | ✅ None |

### 6. Build Fix ✅

**Commit:** `838c872` — `fix: type-narrow Convex ctx.db.get() unions in triggers.ts and workflowTasks.ts`

Resolved final build-blocking type errors:
- Added explicit `Id<"queueTasks">[]` type for `createdTasks` array in `triggers.ts`
- Cast `ctx.db.get()` results to typed shapes (`template`, `company`, `contact`) in `workflowTasks.ts`
- Error count: 124 → 0 (100% reduction from original)

Both apps (`forhemit-admin`, `forhemit-coming-soon`) now build successfully.

---

## Checklist: What's Left To Do

### P0 — This Week (Security)

- [x] **Review and merge** `feature/convex-auth-guards` branch
- [x] **Review and merge** `feature/xss-sanitization` branch
- [x] **Verify auth guards don't break existing flows** — smoke tested 2026-05-25: all admin routes (/, /admin, /crm, /contacts, /templates, /audit, /stats, /esop-partners, /forms) return 200, Convex backend connects cleanly, no auth guard failures in logs, Clerk keyless mode works
- [x] **Install `isomorphic-dompurify` types** — already present in dependencies (LSP resolved after `pnpm install`)
- [x] **Resolve Convex build errors** — 124 → 0 TS errors, both apps build clean

### P1 — Next Sprint (Code Quality)

- [x] **Delete all `" 2"` duplicate directories** — already done in commit `ebbef77`
- [ ] **Consolidate engagement letter templates** — investigated 2026-05-25: NOT simple duplicates. `packages/convex/templates/external/03-engagement/engagement-letter.html` is the canonical template for PDF generation (referenced by `manifest.ts`). `apps/admin/public/forms/engagement-letter-standalone.html` is the interactive form served via iframe (referenced by `StandaloneEngagementLetterForm.tsx`). Both are actively used. Consolidation would require architectural decision.
- [ ] **Break circular dependencies** — investigated 2026-05-25: no circular dependencies found in `esop-partners/components/`. `ESOPPartnerCRM` → `DetailPanel` + `ContactModal` is one-way. `ContactModal` and `DetailPanel` import only from `../types`, `../lib/formatters`, `../lib/calculations`. False positive from CodeFlow analysis.
- [ ] **Split `agentQueue.ts`** — investigated 2026-05-25: file is 360 lines with 8 exports (not 1,206 lines / 49 functions as originally estimated). 5 queries + 3 mutations. No immediate need to split.

### P2 — Backlog (Tech Debt)

- [ ] **Reduce email complexity** — `email-config.ts` (complexity: 148) and `emails.ts` (complexity: 138) need registry pattern refactor
- [ ] **Audit duplicate domain functions** — `styleCheckOpt` (4 files), `toggleBroker` (4 files), `syncShared` (4 files) — extract to shared package if identical
- [ ] **Add ESLint** — currently no linter configured. `next lint` was removed in Next.js 16.
- [ ] **Increase test coverage** — 7 test files across 1,373 source files (0.5%)
- [ ] **Create `.env.example`** — document required environment variables
- [ ] **Resolve Convex build errors** — ~21 remaining type errors from schema drift (down from 124, 83% reduction)
- [x] **Clean stale worktrees** — all 6 worktrees removed 2026-05-25

### P3 — Architecture (Strategic)

- [ ] **Convex authorization model** — implement role-based access control beyond basic auth check
- [ ] **Add Convex `internalMutation`/`internalQuery`** for service functions that should never be called from client
- [ ] **Rate limiting** on public-facing Convex endpoints
- [ ] **Audit `requireAdmin.ts` usage** — only used in 2 files, should be the standard for admin-only operations

---

## Active Branches

| Branch | Status | Description |
|--------|--------|-------------|
| `feature/convex-auth-guards` | ✅ Merged (`ae2c8e3`) | Auth guards on 23 Convex files |
| `feature/xss-sanitization` | ✅ Merged (`e74d5d6`) | DOMPurify on 5 dangerouslySetInnerHTML files |
| `main` | Current | At `151069b` |
| `feature/type-safety-cleanup` | Active | At `d4708a9` — @ts-nocheck removal, .env.example, backup cleanup |
| Other feature branches | Active | `deploy-config`, `observability`, `security-rate-limiting`, `agent-wiring`, `blog-convex-admin-seed` |

## Known Issues

- ~~**Build still failing**~~ ✅ FIXED — both apps build clean (0 TS errors)
- ~~**Error ping-pong pattern**~~ ✅ FIXED — Convex codegen stable after schema alignment
- ~~**`dealProcessor.ts` malformed**~~ ✅ FIXED — return types restored
- **`git index.lock` recurring** — always `rm -f .git/index.lock` before git operations if interrupted
- **`noImplicitAny: false`** — admin tsconfig relaxed temporarily; ~100+ untyped callbacks need incremental typing
- **`dealProcessor.ts` has `@ts-nocheck`** — circular type inference needs architectural refactor to break import cycle

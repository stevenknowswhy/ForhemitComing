# Session Memory: Production Readiness Review (2026-05-25)

## User Profile
- **Stefano Stokes** — founder/developer of Forhemit
- Email: stefano.stokes@forhemit.com
- Frequently references agent tools/extensions that aren't installed (rpiv-todo, pi-hermes-memory, composio, plannotator, agent-comms mesh). These appear in prompts as aspirations, not available capabilities. Work with what's actually installed.
- Gives confident "go" signals for fix execution; prefers action over ceremony.
- Uses Pi agent framework with "Ah-Yeon" (velocity) + "Wendy" (structure/QA) dual-agent setup.

## Project Conventions
- **Monorepo**: Turborepo + pnpm (`pnpm@10.33.4`)
- **Apps**: `apps/admin` (port 5050), `apps/marketing` — both Next.js 16.x
- **Backend**: Convex (`packages/convex/convex/`)
- **Auth**: Clerk with `@forhemit.com` domain restriction
- **Monitoring**: Sentry (`@sentry/nextjs`)
- **File uploads**: UploadThing
- **Email**: Resend
- **Package manager**: pnpm (NOT npm, NOT yarn)
- **Node**: v22
- **Super admin**: stefano.stokes@forhemit.com (hardcoded in `lib/clerk.ts` and `convex/lib/requireAdmin.ts`)

## Failures & Corrections

### formatPhoneNumber test fix — 3 iterations required
- **Attempt 1**: Added truncation but international fallback (`if (numbers.length > 10) return +numbers`) caught inputs first
- **Attempt 2**: Reordered but didn't account for 11-digit numbers starting with "1" (US country code)
- **Final**: Restructured to: strip non-digits → check for US 1+10 pattern → truncate all others to 10 → format
- **Insight**: When fixing format functions, trace every test case through the control flow manually before writing. Order of guards matters.

### git index.lock stale file
- Multiple `git stash` and `git commit` attempts failed with `index.lock` exists error
- **Fix**: `rm .git/index.lock` then retry
- **Cause**: A previous git process crashed or a background tool held the lock
- **Insight**: When git operations fail with index.lock, check for and remove the stale lock before retrying

### Next.js 16 removed `next lint` subcommand
- CI and package.json scripts used `next lint` which no longer exists in Next.js 16
- ESLint is not configured as a direct dependency either
- **Insight**: Next.js 16+ requires explicit ESLint setup. `next lint` was a convenience wrapper that's been dropped.

### Convex mutation call pattern
- Code called mutations directly: `initializeFees(ctx, { ebitda })` instead of `ctx.runMutation(internal.feeCalculator.initializeFees, { ebitda })`
- **Fix**: For pure computation (no DB writes), extract to a plain helper function. For DB mutations, use `ctx.runMutation`.
- **Insight**: In Convex, mutations are registered functions, not plain async functions. Direct calls fail at type-check time.

### Convex schema drift
- Code referenced 3 tables (`notes`, `emailEvents`, `queueTasks`) not in schema
- `stageRequirements` table was missing `trigger`, `triggerGate`, `daysOffset`, `feeMilestone`, `autoSend`, `recurringRule` fields
- `crmCompanies.fees` was missing milestone sub-fields (`retainer`, `validation`, `commitment`, `success` with status/amount)
- **Insight**: Always run `convex dev --once` after schema changes to regenerate types. Schema drift accumulates silently.

## Tool Quirks
- **pnpm overrides** for transitive dependency CVEs: add `pnpm.overrides` to root `package.json` when upstream hasn't patched
- **Convex codegen**: Run `npx convex dev --once` to regenerate `_generated/` types after schema changes
- **`.claude/worktrees/agent-winding`**: Contains stale copies of routes including buggy duplicates ("login 2", "verify 2"). These are dead code — don't reference them.

## Commits Made
1. `eac1af4` — P0 blockers: auth bypass re-enabled, next@16.2.6, effect@3.21.2 override, CI quality gates, formatters test fix
2. `94e137a` — Convex architecture: schema alignment (3 missing tables + fields), function call patterns (direct → ctx.runMutation), type fixes (notes, triggers, workflowService, feeCalculator, gates, stages)

## Remaining Work (as of session end)
- 52 TypeScript errors remain (down from 124)
- Generated API shape mismatches (`api.module.fn` → `api.default.module.fn`)
- Frontend type mismatches in `useCrmStats`, `TemplatesTab`, `DealSummary`
- Duplicate routes in `apps/admin/app/api/admin/` (login 2, verify 2) — should be deleted
- `.claude/worktrees/agent-wiring` — stale worktree, should be cleaned up
- No ESLint configured — CI lint step removed
- Zero integration/E2E tests running in CI (Playwright config exists but tests are minimal)

# Memory Capture — 2026-05-25
> Auto-generated from conversation review. Main agent should persist these to memory tools.

## Project Conventions (Forhemit)
- **Monorepo structure:** `apps/admin` (main ESOP deal app), `apps/marketing` (coming-soon site), `packages/convex` (shared Convex backend)
- **Package manager:** pnpm with workspaces
- **Stack:** Clerk (auth), Convex (backend), Vercel (deploy), UploadThing (uploads), DOMPurify (XSS)
- **No Sentry project exists** — use placeholders for any Sentry-related config (user explicitly stated)
- **Git worktrees:** convention is `.worktrees/<branch-name>` directory, branched from `main`
- **CI:** GitHub Actions, ubuntu-latest, Node 22, pnpm --frozen-lockfile
- **Auth pattern:** `requireAuth.ts` guard in `packages/convex/convex/lib/` for Convex function auth
- **Vercel config:** `apps/admin/vercel.json` uses `--no-frozen-lockfile`, `apps/marketing/vercel.json` uses `--frozen-lockfile`

## User Preferences (Stefano)
- Prefers **parallel agents in separate worktrees** for multi-track production work
- Wants **structured planning with test gates** — test after each repair, not just at the end
- Wants to **avoid creating new issues** while fixing existing ones (incremental, validated changes)
- Will correct agent assumptions (e.g., Sentry project availability) — always confirm infrastructure availability before planning
- Values the production readiness report as a tracking artifact

## Failure Memories
- **[failure]** Git `index.lock` race condition when multiple agents/processes access the same repo simultaneously
  - **What happened:** Two git processes (stash + another operation) competed for `.git/index.lock`
  - **Error:** `fatal: Unable to create '.git/index.lock': File exists`
  - **Resolution:** Lock file was transient — retrying after a moment succeeded. But this is a real risk with parallel worktree agents.
  - **Insight:** When launching parallel agents on the same repo, ensure each agent's git operations are scoped to its own worktree. Avoid any git operations on `main` while agents are active.

- **[correction]** User corrected assumption about Sentry: "We do not have a Sentry project the agent can use placeholders"
  - **Insight:** Don't assume external service availability. Confirm with user before planning integrations.

- **[tool-quirk]** Edit tool validation error when `edits` parameter was passed as a JSON string instead of an array object
  - **Error:** `Validation failed: edits.0: must be object`
  - **Resolution:** Properly structured the edits parameter as an array of objects, not a stringified JSON

- **[tool-quirk]** `git stash` pathspec matching failed for files not yet tracked
  - **Error:** `error: pathspec ':(prefix:0)PRODUCTION_FIX_PLAN.md' did not match any file(s) known to git`
  - **Resolution:** File needed `git add` first, or use different stash strategy

## Architecture Decisions (Forhemit)
- **Hybrid Brain Failover:** Cloud OpenRouter primary → Local Ollama fallback on M1 Pro
- **Multi-agent roles:** Wendy (Unni = Structure/QA) + Ah-Yeon (Dongsaeng = Velocity/Code)
- **Auth bypass was a P0 fix** — `isAllowedEmail` domain check was disabled, now re-enabled in middleware

# Memory Capture — 2026-05-25 (Part 2 — Session Continuation)
> Auto-generated from conversation review. Main agent should persist these to memory tools.

## User Preferences (Stefano)
- **Prefers easiest-to-hardest ordering** for task execution — explicitly requested this approach
- **Three-agent pattern preference**: Task Agent → Judge Agent (max 3 turns) → Orchestrator (build verify, commit, push, cleanup). Validated on Tasks 1-3.
- **Expects structured final reports** with commit hash, build status, push confirmation, cleanup status per task
- **Wants skills developed iteratively** — "start with a refactored skill and then build upon it as necessary" (not over-engineered upfront)

## Tool Quirks & Failures
- **[failure] Herdr agent prompting doesn't work reliably** — prompts sent via `herdr agent send` sit in the buffer without executing. The agent shows "idle" even after prompt delivery.
  - What was tried: Full prompt injection to spawned Pi agent in Herdr workspace
  - Why it failed: Herdr's agent:send puts text in terminal buffer but Pi agent doesn't process it as a prompt
  - Error: Agent stays "idle", no work done
  - What worked instead: Execute directly as orchestrator (inline), then run judge review. Herdr workspace creation/closing works fine; it's the agent prompt delivery that's unreliable.
  - **Insight:** For now, use Herdr for workspace isolation and pane management, but do the actual work inline. The three-agent pattern works when the orchestrator plays all three roles sequentially.

- **[failure] `git worktree remove` fails on Herdr-managed worktrees**
  - Error: `fatal: 'path' is not a working tree` even though `git worktree list` shows it
  - What happened: Herdr creates worktrees via its own system, not standard `git worktree add`
  - What worked: `git worktree remove --force` from the main repo, or manual `rm -rf` + `git worktree prune`
  - **Insight:** Always use `--force` for Herdr worktree cleanup, or check if it's a Herdr-managed worktree first

- **[failure] Merge conflict in PLAN.md when two feature branches both added to the same file**
  - Both `fix/break-circular-dependencies` and `fix/cleanup-console-logs` added PLAN.md content
  - Resolution: `git checkout --ours` to keep main's version, then manually append the other branch's content
  - **Insight:** When merging multiple feature branches sequentially, PLAN.md conflicts are expected. Keep the most recent analysis (ours) and append older docs.

- **[tool-quirk] `.env.local` files are gitignored and don't travel with worktrees**
  - Build fails with `Client created with undefined deployment address` in worktrees
  - Resolution: Copy `.env.local` files from main repo to worktree before build verification
  - **Insight:** Always copy env files when creating worktrees for build verification: `for f in .env.local apps/admin/.env.local apps/marketing/.env.local packages/convex/.env.local; do cp "$f" worktree_path/"$f" 2>/dev/null; done`

- **[tool-quirk] Convex `_generated/api.d.ts` goes stale after branch merge**
  - Error: `Property 'dealEngine' does not exist on type` — blog branch's generated types didn't include main's newer Convex functions
  - Resolution: Restore `_generated/api.d.ts` from main (has superset of all exports)
  - **Insight:** After merging feature branches that modify Convex schema, always restore or regenerate `_generated/` files from main. Can't run `npx convex dev` without CONVEX_DEPLOYMENT env var, so manual restore is the fallback.

- **[tool-quirk] Edit tool ambiguous match when multiple handlers have identical patterns**
  - Error: `edits[X].oldText appears 2 times` — multiple `handler: async (ctx, args) => {` blocks in templates.ts
  - Resolution: Include more surrounding context (function name, args) to make each edit unique
  - **Insight:** When editing Convex files with many similar handler patterns, always include the function name or export statement in the oldText for uniqueness

## Architecture Decisions (Forhemit)
- **Next.js 16 proxy migration**: `middleware.ts` → `proxy.ts` is a straight rename. Clerk's `clerkMiddleware` function name stays the same. Comments referencing "middleware" should be updated to "proxy" for accuracy. Build output shows `ƒ Proxy (Middleware)` confirming migration.
- **Convex auth guard scope**: Only 6 of 31 flagged files actually need auth guards. Internal services (emailCore, pdfGenerator, dealProcessor), seeds, crons, and schema files are exempt. The pattern: `import { requireAuth } from "./lib/requireAuth"; await requireAuth(ctx);` at handler start.
- **Convex auth guard for internal actions**: `internalAction` handlers do NOT get auth guards (they're server-to-server, not client-facing). Only `query`, `mutation`, and `action` (public) need guards.
- **Blog system merge strategy**: 15 merge conflicts resolved by keeping "ours" (main) for all files. Main had rate limiting, proxy migration, and other production readiness changes that supersede the blog branch's older state.

## Workflow Patterns Validated
- **Task → Judge → Build → Commit → Merge → Push → Cleanup** — validated across 3 tasks with zero failures
- **Sequential merge with build gate**: Merge one branch at a time, build verify, then next. Prevents cascading failures.
- **Judge review pattern**: Run `tsc --noEmit`, check file counts, verify expected changes, check for unintended modifications. Approve/reject.
- **Cleanup sequence**: Delete worktree → delete branch → verify on main → push

## Skill Development
- **`multi-agent-workflow` skill created** at `~/.pi/agent/skills/multi-agent-workflow/`
  - SKILL.md (core, ~550 lines): state machine, pre-flight, task execution, judge review, build verification
  - multi-agent-parallel.md: parallel execution extension stub
  - multi-agent-sdd.md: SDD integration extension stub  
  - multi-agent-preflight.md: extended pre-flight extension stub
  - Refactored from a 1,698-line monolithic skill to 840 lines across 4 files
  - Validated on Tasks 1-3 before formalizing

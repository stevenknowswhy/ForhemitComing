# Memory Capture — 2026-05-25 Session

## User Profile
- **Name:** Stephen Stokes
- **Identity:** Senior developer, architect-level
- **Work style:** Systematic, incremental — "we should be careful and move through this systematically and completing small chunks at a time to ensure we do not break the entire app"
- **Preference:** Build verification after every phase/merge
- **Architecture:** Dual-agent pattern — Wendy (Unni, structure/QA) + Ah-Yeon (Dongsaeng, velocity/code)
- **Language:** Prefers English for code, artifacts, commit messages, PR descriptions
- **Tools:** Herdr for multi-agent workspace management, Pi agent framework

## Project Conventions (Forhemit)
- **Repo:** `stevenknowswhy/ForhemitComing` on GitHub
- **Monorepo:** apps/admin, apps/marketing, packages/convex, packages/shared (new)
- **Stack:** pnpm workspaces + Turborepo + Next.js 16.2.6 + Convex + Clerk + Vercel
- **Build:** `pnpm turbo run build` (both apps compile)
- **Type check:** `tsc --noEmit` (run in each app dir)
- **Lint:** ESLint 10 flat config
- **E2E:** Playwright
- **Auth pattern:** `requireAuth` from `./lib/requireAuth` at handler start; `internalAction` should NOT have auth guards
- **Next.js 16:** `proxy.ts` (not `middleware.ts`) — migration confirmed working
- **Merge strategy:** Feature branches → main via `ort` strategy, explicit push control
- **Env:** `.env.local` files required at root, apps/admin, apps/marketing, packages/convex for builds to pass (Convex, Clerk, Resend, Sentry)

## Failure Memories
- **[tool-quirk] Herdr agent send unreliable:** `herdr agent send` prompts often sit in buffer without executing. Fallback: execute task directly as inline agent.
- **[failure] Worktree cleanup with modified files:** `git worktree remove` fails with "contains modified or untracked files". Fix: `git worktree remove --force`.
- **[failure] .env.local missing in worktrees:** New worktrees don't inherit .env.local. Builds fail with "Missing API key for Resend webhook" or "Client created with undefined deployment address". Fix: copy .env.local files to worktree before building.
- **[failure] Convex codegen without env:** `npx convex codegen` fails with "No CONVEX_DEPLOYMENT set". Cannot run in worktrees without env. Workaround: restore _generated files from main.
- **[failure] Merge conflicts between feature branches:** Multiple feature branches created in parallel cause merge conflicts when merging sequentially. Resolution: keep main's security/types, integrate feature additions.
- **[tool-quirk] pi-lens markdown:** "Pi-lens analysis unavailable. Tools for markdown not installed." — pi-lens doesn't analyze markdown files.

## Insight Memories
- **[insight] Dedup scope:** Forhemit has 319 byte-identical files between admin and marketing (~16,000 duplicate lines). Extraction plan: hooks (P0 ✅) → lib/utils (P1) → types (P2) → shared lib (P3) → components (P4) → templates (P5).
- **[insight] Multi-agent workflow skill:** Created and validated `~/.pi/agent/skills/multi-agent-workflow/SKILL.md` — core orchestrator with task→judge→build→commit pattern. Works well for bounded tasks.
- **[convention] SDD for large changes:** Use SDD flow (explore → design doc → incremental phases → build gate) for architectural changes like dedup extraction.
- **[insight] Admin-only files (not duplicated):** admin-session.ts, admin-auth.ts, broker-auth.ts, dashboard components, CRM components, deal engine, template forms.

# Multi-Agent Workflow Skill — Created 2026-05-25

Last updated: 05/26/26 01:58 AM PT
Purpose: Session log documenting creation of multi-agent workflow orchestrator skill

## What was created

Refactored multi-agent orchestrator skill based on lessons learned from
the Forhemit production readiness sprint and Tasks 1-3 execution.

### Files

| File | Lines | Purpose |
|------|-------|---------|
| `~/.pi/agent/skills/multi-agent-workflow/SKILL.md` | 550 | Core skill — state machine, per-task procedure, invocation |
| `multi-agent-parallel.md` | 82 | Extension: parallel execution with dependency resolution |
| `multi-agent-sdd.md` | 112 | Extension: SDD integration for complex tasks |
| `multi-agent-preflight.md` | 96 | Extension: extended pre-flight checks |

### Key design decisions

1. **Worktree-first isolation**: Each task gets a git worktree (not just Herdr workspace) for filesystem-level isolation
2. **Pi as default agent**: Changed from `claude` to `pi` to match Forhemit environment
3. **Inline judge for simple tasks**: Direct `git diff` + `tsc --noEmit` + pattern checks instead of spawning a judge agent
4. **Agent fallback chain**: Try `herdr agent start` + send → `herdr pane run` → execute inline
5. **Practical preflight**: 6 checks (not 11) — Herdr env, tools, git remote, working tree, checkpoint dir, session lock
6. **Extensions on demand**: Parallel, SDD, and extended preflight are separate files loaded only when needed

### Validated workflow (Tasks 1-3)

```
git worktree add → pnpm install → task agent (inline) → judge review
→ tsc --noEmit → git commit → git merge --no-ff → build gate
→ git push → worktree remove → branch delete → workspace close
```

### Known limitation

`herdr agent send` types text into Pi prompt buffer but doesn't submit.
Task agents must be launched via `herdr pane run` or executed inline.
This is documented in Step T2 with a fallback chain.

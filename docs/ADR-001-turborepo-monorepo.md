# ADR-001: Turborepo monorepo with single Convex package

## Status

Accepted — **implemented** (`apps/admin`, `apps/marketing`, `packages/convex`).

## Context

Forhemit runs two Next.js applications that previously each contained a copy of `convex/`, which duplicated schema and functions, risked conflicting deploys, and complicated the blog platform (single source of truth for `posts`). The monorepo removes the duplicate; Convex code lives only under `packages/convex/convex/`.

Alternatives considered:

- **pnpm workspaces only** — lighter, but no built-in task graph and remote cache story.
- **Nx** — strong for large orgs; steeper adoption than Turborepo for this team size.
- **Keep two repos with one “owner” app** — fails to eliminate drift without heavy discipline and CI.

## Decision

Use **Turborepo** with **pnpm workspaces**:

- `apps/admin` and `apps/marketing` (names after migration from current folder names).
- `packages/convex` as the **only** Convex source tree; both apps depend on it.
- **Remote caching** enabled from Day 1 to limit CI and local build time growth.

## Consequences

- One-time migration cost: move folders, fix imports, unify `convex/` into `packages/convex`, update Vercel root directories.
- Convex deploy runs once per merge to main (CI), not from two apps.
- All engineers must use documented `convex dev` ownership (see `LOCAL_DEV.md`).

## References

- `HARMONIZATION_PLAN.md` (sections 3.3, 10–13)

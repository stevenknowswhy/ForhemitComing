# Design: Deduplication via packages/shared/

Last updated: 05/26/26 01:58 AM PT
Purpose: Design doc for code deduplication via packages/shared extraction

**Session:** 20260525-workflow-001
**Status:** Approved for incremental execution
**Date:** 2026-05-25

---

## 1. Problem Statement

The Forhemit monorepo has two Next.js apps (`apps/admin` and `apps/marketing`)
that share a significant amount of identical code. Static analysis reveals:

| Metric | Value |
|--------|-------|
| Admin source files | 485 |
| Marketing source files | 553 |
| Overlapping paths | 410 |
| **Byte-identical files** | **319** |
| **Estimated duplicate lines** | **~16,000** |

This duplication means:
- Bug fixes must be applied twice
- Feature additions to shared logic require synchronized changes
- TypeScript compilation processes the same code twice
- Code review burden is doubled for shared components

## 2. Proposed Approach

Create a `packages/shared/` workspace package that exports shared hooks,
utilities, and components. Both apps import from `@forhemit/shared` instead
of maintaining their own copies.

### Extraction strategy: **Incremental, category-by-category**

Each phase extracts one category of files, updates imports, verifies the
build, and commits. If any phase breaks the build, it can be reverted
independently without affecting other phases.

### Phase order (safest → most complex):

| Phase | Category | Files | Lines | Risk | Rationale |
|-------|----------|-------|-------|------|-----------|
| **P0** | Root-level hooks | 6 | ~515 | Low | Already imported via `@/hooks/`, simple path change |
| **P1** | Root-level lib/utils | 5 | ~298 | Low | Small utility files, no complex dependencies |
| **P2** | Feature hooks (CRM, templates) | 13 | ~1,912 | Medium | Relative imports need path rewriting |
| **P3** | Feature lib (CRM, templates) | 19 | ~2,098 | Medium | Calculation/formatter files |
| **P4** | Components | ~263 | ~8,000+ | High | Largest category, most import paths to update |
| **P5** | App-level pages | varies | varies | High | Page components with routing dependencies |

**This design covers P0 and P1 in detail. P2–P5 require separate design
docs after P0/P1 are validated.**

---

## 3. Phase P0: Root-Level Hooks (Proof of Concept)

### Files to extract

| File | Lines | Current imports |
|------|-------|-----------------|
| `hooks/useIntersectionObserver.ts` | 75 | `@/hooks/useIntersectionObserver` |
| `hooks/useScrollReveal.ts` | 80 | `@/hooks/useScrollReveal` |
| `hooks/useCountUp.ts` | 74 | `@/hooks/useCountUp` |
| `hooks/useReducedMotion.ts` | 50 | `@/hooks/useReducedMotion` |
| `hooks/useToast.ts` | 50 | `../hooks/useToast` or `@/hooks/useToast` |
| `hooks/useBlog.ts` | 180 | `@/hooks/useBlog` |
| **Total** | **509** | |

### New package structure

```
packages/shared/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts          (barrel export)
│   └── hooks/
│       ├── useIntersectionObserver.ts
│       ├── useScrollReveal.ts
│       ├── useCountUp.ts
│       ├── useReducedMotion.ts
│       ├── useToast.ts
│       └── useBlog.ts
```

### package.json

```json
{
  "name": "@forhemit/shared",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./hooks": "./src/hooks/index.ts",
    "./hooks/*": "./src/hooks/*"
  }
}
```

### Import migration

**Before (both apps):**
```ts
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useToast } from "../hooks/useToast";
```

**After (both apps):**
```ts
import { useIntersectionObserver } from "@forhemit/shared/hooks/useIntersectionObserver";
import { useToast } from "@forhemit/shared/hooks/useToast";
```

### Files requiring import updates

Based on grep analysis:

**Admin app (8 files):**
- `app/brokers/page.tsx` — useIntersectionObserver
- `app/the-exit-crisis/page.tsx` — useIntersectionObserver
- `app/faq/page.tsx` — useIntersectionObserver
- `app/about/page.tsx` — useIntersectionObserver
- `app/opt-in/page.tsx` — useToast
- `app/legal-practices/page.tsx` — useScrollReveal (if used)
- `app/layout.tsx` — may import shared providers
- `hooks/index.ts` — barrel file (if exists)

**Marketing app (8+ files):**
- `app/brokers/_components/BrokersContactModal.tsx` — useToast
- `app/the-exit-crisis/TheExitCrisisPageClient.tsx` — useIntersectionObserver
- `app/faq/FAQPageClient.tsx` — useIntersectionObserver
- `app/about/page.tsx` — useIntersectionObserver
- `app/blog/[slug]/page.tsx` — useBlog
- `app/blog/page.tsx` — useBlog
- Various other pages using scroll/intersection hooks

### tsconfig setup

Both apps need `@forhemit/shared` in their `paths` or the monorepo
workspace resolution handles it automatically via pnpm workspaces.

```json
// apps/admin/tsconfig.json (add to paths)
{
  "compilerOptions": {
    "paths": {
      "@forhemit/shared/*": ["../../packages/shared/src/*"]
    }
  }
}
```

---

## 4. Phase P1: Root-Level Lib/Utils

### Files to extract

| File | Lines | Purpose |
|------|-------|---------|
| `lib/utils.ts` | 6 | Generic utility functions |
| `lib/uploads/client.ts` | 10 | UploadThing client |
| `lib/formatters.ts` | 11 | Generic formatters |
| `lib/export-utils.ts` | 143 | CSV/data export utilities |
| `lib/__tests__/validation.test.ts` | 138 | Validation tests |
| **Total** | **308** | |

These are simpler than hooks because they're pure functions with no
React dependencies. They can be extracted with minimal import path changes.

---

## 5. Interfaces / APIs

### Package exports

```ts
// packages/shared/src/index.ts
export * from './hooks/useIntersectionObserver';
export * from './hooks/useScrollReveal';
export * from './hooks/useCountUp';
export * from './hooks/useReducedMotion';
export * from './hooks/useToast';
export * from './hooks/useBlog';
```

### No schema changes

This extraction does not change any Convex schemas, API routes, or
database models. It is purely a code organization refactor.

---

## 6. Test Plan

After each phase:

1. **TypeScript check:** `npx tsc --noEmit` in both apps
2. **Build gate:** `pnpm turbo run build` (both apps must compile)
3. **Import verification:** `grep -r "from.*@/hooks" apps/` should show
   zero results after P0 (all migrated to `@forhemit/shared/hooks`)
4. **Runtime smoke test:** `curl` the admin dev server to verify pages load

---

## 7. Out of Scope

- **P2–P5** (feature hooks, feature lib, components, app-level pages)
  require separate design docs after P0/P1 validate the approach
- **CSS/Tailwind shared config** — not addressed in this design
- **Shared React components** — P4 is too large for this session
- **Convex shared code** — stays in `packages/convex/`

---

## 8. Risks and Open Questions

| Risk | Mitigation |
|------|-----------|
| pnpm workspace resolution fails | Verify `pnpm-workspace.yaml` includes `packages/shared` |
| Circular dependency between shared and app code | Shared package must have ZERO imports from apps |
| Build cache invalidation | Turbo may need `inputs` config for the shared package |
| Import path breakage | Run grep to verify all old imports are replaced |
| `@/` path alias conflicts | Both apps must add `@forhemit/shared/*` to tsconfig paths |

### Open Questions

1. Should `packages/shared` have its own `tsconfig.json` extending the
   root config, or inherit from root directly?
2. Should we add `@forhemit/shared` to the Turbo pipeline as a
   dependency of both apps?
3. Do any of the root-level hooks depend on app-specific types that
   would need to be extracted first?

---

## 9. Execution Plan

### P0 Steps (this session)

```
1. Create packages/shared/ directory structure
2. Copy 6 root-level hooks to packages/shared/src/hooks/
3. Create barrel exports (index.ts)
4. Add @forhemit/shared to pnpm-workspace.yaml (if not present)
5. Add tsconfig paths to both apps
6. Update imports in admin app (8 files)
7. Update imports in marketing app (8+ files)
8. Delete original hooks/ directories from both apps
9. Run tsc --noEmit on both apps
10. Run pnpm turbo run build
11. Commit: "refactor: extract root-level hooks to packages/shared (P0)"
12. Push and verify
```

### P1 Steps (after P0 validates)

```
1. Copy 5 lib files to packages/shared/src/lib/
2. Update imports
3. Build verification
4. Commit: "refactor: extract root-level lib/utils to packages/shared (P1)"
```

### P2–P5 (future sessions)

Each gets its own design doc, worktree, and build gate.

---

## 10. Phase P2a: Feature Module Extraction — lender-qa-tracker

**Date:** 2026-05-26
**Status:** Complete

### Discovery

Initial P2 analysis revealed CRM types have **diverged** between apps:
- Admin uses Convex `Doc<"crmCompanies">` types
- Marketing uses hand-rolled types with different pipeline stages
- Admin has `useDealEngine` (marketing doesn't)

Three template form modules are **byte-identical** and self-contained:
- `lender-qa-tracker` (2,426L) — chosen as proof-of-concept
- `esop-repayment-model` (2,912L)
- `deal-flow-system` (5,018L)

### Architecture

Extract the **logic layer only** (types, constants, hooks, lib) to shared.
Components stay in apps (may diverge for layout/styling).

```
packages/shared/src/features/lender-qa-tracker/
├── index.ts              (barrel export, 71L)
├── types.ts              (113L)
├── constants.ts          (223L)
├── hooks/
│   └── useLenderQAForm.ts (246L)
└── lib/
    ├── validation.ts      (202L)
    └── calculations.ts    (113L)
```

### What stays in apps

```
apps/{admin,marketing}/app/admin/templates/forms/lender-qa-tracker/
├── index.ts              (re-exports from shared + local form component)
├── LenderQATrackerForm.tsx (imports hook from shared)
└── components/           (imports types/constants from shared)
```

### Key decisions

1. Self-contained modules only — zero external deps beyond React
2. Relative imports within shared feature dir preserved (no rewrite needed)
3. Components import from `@forhemit/shared/features/lender-qa-tracker`
4. Both apps updated even if marketing doesn't register the form yet
5. `packages/shared/tsconfig.json` fixed (was extending nonexistent root config)

### Results

- **968 lines** extracted to shared (types + constants + hook + lib)
- **27 import statements** updated across 12 admin component files
- Both apps `tsc --noEmit` pass clean
- Both apps `build` pass clean
- Zero stale local imports remain

### Pattern for P2b/P2c

Same approach: extract hooks + types + constants + lib to
`packages/shared/src/features/<module>/`. Components stay in apps.
CRM (P2d) needs type reconciliation first.

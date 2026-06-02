06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Testing & Code Quality Gap Analysis — Forhemit Monorepo

## Scope
- Packages reviewed: `apps/admin`, `apps/marketing`, `packages/shared`, `packages/convex`
- Additional projects reviewed: `freellmapi` (server, client, shared)
- CI: `.github/workflows/ci.yml`
- Config files: `package.json`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.mjs`
- Docs reviewed: `docs/completed/dark-mode-plan-admin.md`, `docs/design/admin-marketing-page-dedup.md`, `docs/design/dedup-shared-package-20260525.md`

---

## 1. Test Coverage — What Exists vs. What Does Not

### apps/admin
- Unit test locations: `app/lib/__tests__/`, `test/` (root of app)
- Existing unit tests (observed):
  - `app/lib/__tests__/formatters.test.ts`
  - `app/lib/__tests__/email-payload.test.ts`
  - `test/calculations.test.ts`
  - `test/formatters.test.ts`
  - `test/formatters-extended.test.ts`
  - `test/formatters-more.test.ts`
  - `test/analytics.test.ts`
  - `test/esop-partners.test.ts`
- Problem: tests are spread across `test/` and `app/lib/__tests__/`. No `__tests__/` directory at the app root, and no tests are colocated with components/hooks they cover. This makes discoverability poor and increases risk that new code ships untested.
- E2E: `e2e/homepage.spec.ts` exists but exercises only the homepage route and SEO endpoints. No coverage of authenticated admin flows, CRM, journals, or forms.
- Component tests: zero identified. No React testing-library `.test.tsx` files.

### apps/marketing
- Unit test locations: `app/lib/__tests__/`, `test/`
- Existing unit tests (observed):
  - `app/lib/__tests__/formatters.test.ts`
  - `test/setup.ts`
  - `test/utils.tsx`
- Problem: very thin coverage. There is literally only 1 file-matched test (`formatters.test.ts`) plus setup/utils helpers. The marketing app has ~329 source files, and most have no tests.
- E2E: `e2e/homepage.spec.ts` exists and mirrors the admin one byte-for-byte (only a comment diff: "proxy" vs "middleware"). No other e2e coverage.

### packages/shared
- Zero tests found. Features extracted to shared (`esop-partners`, `esop-repayment-model`, `deal-flow-system`, `crm`) have no `*.test.ts` files. The extracted logic (calculations, validators, formatters) is testable pure code that is now untested at the package level.

### packages/convex
- Zero tests. No Convex-specific test runner or harness found.

### freellmapi
- `server` has 20 tests under `src/__tests__/` (good coverage for routes/providers).
- `client` has zero tests.
- `shared` (a workspace package) has zero tests.

### Gap: Missing test suites by package
| Package | Unit | Component | E2E |
|---------|------|-----------|-----|
| apps/admin | partial | none | partial |
| apps/marketing | partial | none | minimal |
| packages/shared | none | none | none |
| packages/convex | none | none | none |
| freellmapi/server | partial | none | none |
| freellmapi/client | none | none | none |
| freellmapi/shared | none | none | none |

---

## 2. Tests That Don't Run / Runner Misconfigs

### apps/admin
- `package.json` `"test": "vitest"` runs vitest in watch mode by default. There's no `test:ci` script that forces non-watch execution; CI relies on `pnpm turbo test -- --run` which works, but locally there is no script for CI-style runs.
- `vitest.config.ts` exists and is structured correctly, but the `test/setup.ts` included by config must be verified to exist and export properly.

### apps/marketing
- Same `"test": "vitest"` issue; no `test:ci` script.
- `vitest.config.ts` is missing the shared package alias:
  - Admin config maps `@forhemit/shared` → `../../packages/shared/src`
  - Marketing config has no such alias. Any marketing tests (or their dependencies) that import shared feature modules will likely fail resolution in tests.
- `e2e` is included in `testDir`, but Playwright webServer assumes `npm run dev` which for marketing starts on port 3000. That is fine, but no admin e2e is configured, and on port 5050 there is no e2e runner for authenticated admin flows.

### packages/shared
- No test script in `package.json`. No `vitest.config.ts`. No `tsc --noEmit` script.

### packages/convex
- No test script. No tsconfig file (missing entirely).

### freellmapi/server
- Has dedicated Vitest config with `include: ['src/__tests__/**/*.test.ts']` and a `test:watch` script.
- Build is TypeScript (`tsc`) — fine.

### freellmapi/client
- Build is `tsc -b && vite build`. No tests.

---

## 3. Linting & Formatting Holes

### ESLint
- Root `eslint.config.mjs` covers both apps but intentionally relaxes several rules:
  - `.explicit-any` is `"off"`
  - `.no-unused-vars` warns (underscore-prefix allowed) — fine but borders on too permissive
  - `.no-empty-function` and `.no-empty-object-type` are off (Convex compatibility)
  - `.no-undef` is warn (unsafe for libraries)
- lint scripts:
  - Root `pnpm run lint:eslint` — uses `eslint .` (good)
  - `apps/admin` `"lint": "next lint"` — uses Next's legacy built-in lint, NOT the shared `eslint .`. Next lint may miss files and uses a different runner; this creates holes.
  - `apps/marketing` `"lint": "next lint"` — same problem.
- No workspace-level CI lint job observed. The `.github/workflows/ci.yml` runs `tsc` and `turbo build/test`, but does NOT run `turbo lint` or `eslint .`. Lint is not enforced in CI.

### Prettier
- There is no Prettier config anywhere in the repo (`prettier.config.*`, `.prettierrc*` not found). Formatting is left to ad-hoc editor settings. No `format` or `format:check` script exists in any `package.json`.
- `packageManager` lists `pnpm`, but nothing in root or app `package.json` references Prettier. This is a gap.

### TypeScript strictness
- `apps/admin/tsconfig.json`: `strict: true` — good.
- `apps/marketing/tsconfig.json`: `strict: true` — good.
- `packages/shared/tsconfig.json`: `strict: true` — good, but missing `include` of test files if they existed.
- `packages/convex`: **no `tsconfig.json`** — major gap. The only TypeScript reference is in `package.json` devDep.
- `freellmapi/server/tsconfig.json`: present but not inspected in detail here.
- No script in any package.json ensures `tsc --noEmit` runs as part of a routine local gate. CI does it for admin/marketing only.

---

## 4. Build Verification Gaps

### apps/admin
- Build script is `next build`. No `build:ci` script. No explicit env check for required Next.js env vars, which could cause builds that pass locally to fail silently if a key is missing. CI supplies them, so that's handled; locally it's a risk.

### apps/marketing
- Same: `next build` only. Ports assumed 3000 in Playwright, not verified against admin.

### packages/shared
- No build script. No output dir configuration (`outDir` is empty). This means CI does not verify the shared package compiles cleanly independent of the app builds.

### packages/convex
- Deploy-only scripts. No build verification. No tsconfig to verify at all.

### freellmapi/server
- Has `tsc` build script and `start` script. (Same monorepo as Forhemit but disconnected from turbo.) No CI pipeline found for this sub-project in the Forhemit monorepo CI.

### CI pipeline
- Runs `pnpm turbo test -- --run`. Since admin/marketing `package.json` `"test": "vitest"` (watch mode), CI must append `--run`. That works today but is fragile. Marketing has no unit tests that would actually run in CI. Admin tests do exist, but unknown if they all pass.
- CI does NOT run `pnpm run lint` and does NOT run `pnpm run lint:eslint`.

---

## 5. Dead Code / Duplicated Logic Between admin and marketing

### Admin-stitch.css
- `apps/admin/app/admin/admin-stitch.css` is 1,103 lines. The dark-mode plan required adding `.dark` overrides and replacing hardcoded hex colors with CSS variables.
- **Verification result**: this file currently contains **0 `dark:` variants** and **0 `.dark` rule sets** in the stylesheet. It still uses hardcoded palettes (`#ffffff`, `#f8f9fa`, `#1f2937`, `#6b7280`, `#e5e7eb`, etc.). The dark mode plan claims completion, but the actual source file unverified claim is contradicted by the code.

### admin.css / templates.css
- `apps/admin/app/admin/admin.css` and `templates.css` also contain **0 dark-mode overrides** each.

### Admin-owned Tailwind JSX
- Admin does have `dark:` classes in many TSX files (63 hits observed in `.tsx` grep). But the CSS source for layout/sidebar is not updated, so dark mode is only “works in some places.”

### Marketing-owned components
- Marketing Tailwind TSX has **0** `dark:` classes in JSX observed. Marketing e2e/appear to be light-only.

### Duplication
- Design doc `docs/design/admin-marketing-page-dedup.md` claims `jscpd` reports 1,663 duplicates and lists 13 near-identical page pairs. The report says "Pending approval" and no phase of that dedup is marked complete.
- Simultaneously, `docs/design/dedup-shared-package-20260525.md` documents that `packages/shared` extraction completed Phases P0/P1 and `lender-qa-tracker` (P2a). But the Crm/CRM divergence is still unresolved; the remaining duplication (pages, components, CSS) is largely unchanged.

### Shared package inconsistency
- `packages/shared/src/features/lender-qa-tracker` is extracted. Other features (CRM, esop-repayment-model, deal-flow-system) exist in shared but there is no test, lint, or build verification for them.
- `packages/shared` is referenced via TS path alias in `apps/admin/tsconfig.json`; **`apps/marketing/tsconfig.json` references the same path**, but marketing's `vitest.config.ts` has no alias, so tests cannot resolve `@forhemit/shared/*`.

---

## 6. TypeScript Coverage / `noEmit` Gaps

- CI only runs `tsc --noEmit` for `apps/admin` and `apps/marketing`. Not for:
  - `packages/shared`
  - `packages/convex` (no tsconfig at all)
  - `freellmapi` sub-projects
- None of the package.jsons in the monorepo include a `typecheck` script, and none of the apps have a `typecheck:watch` equivalent. The `AGENTS.md` pre-commit checklist explicitly mentions `npx tsc --noEmit`, but no husky/pre-commit integration is observed in any package.json.

---

## 7. Dark-Mode vs. Refactor Verification Gaps

### Dark-Mode Plan (`docs/completed/dark-mode-plan-admin.md`)
- Claims “Completed — 2026-05-31 — verified working across sidebar, layout, cards, tables, forms, modals, CRM, journals, and all admin pages.”
- Actual verification fails on the most complex layer in the plan:
  - `admin-stitch.css` (Layer A) is still entirely light-mode hardcoded and has no `.dark` overrides.
  - `admin.css` (Layer E legacy sidebar styles) has no `.dark` overrides.
  - `globals.css` and `variables.css` root-variable approach is presumably in place for some tokens; no `admin-stitch.css` token usage visible.
- The JSX dark-mode classes in admin JSX suggest some efforts were real, but the CSS core of the layout is unverified/not done per the plan itself.

### Refactor / Dedup Plan (`docs/design/admin-marketing-page-dedup.md`)
- Status is "Pending approval" in the doc. No phase has a “verified” marker. The plan expected build verification (`tsc --noEmit` on both apps) after each phase; nothing in CI or package.json enforces this.

---

## 8. By-Package Risk Summary

### apps/admin
- Lint runs via `next lint`, not `eslint .` — holes.
- No format gate (no Prettier).
- Unit tests exist but are inconsistent in location; no component tests; e2e only homepage.
- `AGENTS.md` mandates `tsc --noEmit` and `npm run build` at pre-commit; no husky/pre-commit hook present that would enforce this.
- Dark-mode CSS layer is not actually updated despite plan claiming done.

### apps/marketing
- Same `next lint` hole.
- Marketing has by far the thinner test surface (~1 unit test file, ~0 component tests).
- Marketing's vitest config resolves no `@forhemit/shared` alias, so shared-package tests cannot run inside marketing.
- Zero `dark:` JSX usage in marketing CSS — light-mode only.

### packages/shared
- No tests, no tsconfig strictness verification, no build verification.
- Extracted logic is implicitly relied on by both apps; any regression is untestable until tests are added.

### packages/convex
- Missing `tsconfig.json` entirely. No build step. No tests.

### freellmapi
- Out of main Forhemit CI loop. Server has decent tests; client and shared have none.

---

## 9. Recommended Remediation Actions (concrete)

1. **Enforce lint in CI** — add `pnpm turbo run lint:eslint` to `ci.yml`. Fail the build on ESLint errors.
2. **Add a Prettier config + `format:check` script** in root `package.json` and add it to CI and pre-commit.
3. **Standardize test scripts** — add `test:ci` with `vitest run --reporter=verbose` in `apps/admin`, `apps/marketing`, and `packages/shared`.
4. **Marketing vitest alias** — add `@forhemit/shared` alias to `apps/marketing/vitest.config.ts`, mirroring admin.
5. **Colocate unit tests** — move any `test/foo.test.ts` into the feature directories so tests travel with code.
6. **Add component tests** for shared UI and admin/marketing components that currently have none.
7. **Add tests to `packages/shared`** covering all extracted pure logic (calculations, formatters).
8. **Add `packages/convex/tsconfig.json`** and a `typecheck` script (even if Convex itself can't compile ahead-of-time).
9. **Unblock dark-mode verification** — actually implement the `.dark` block in `admin-stitch.css` and update `docs/completed/dark-mode-plan-admin.md` to reflect actual status. Do the same for `admin.css` and `globals.css` if needed.
10. **Unlink marketing from e2e duplication** — the e2e is identical to admin's; either add different checks or refactor into a shared fixture.
11. **Verify the dedup plan** — either execute Phases 1–3 of `admin-marketing-page-dedup.md` OR revert the docs to reflect current un-duplicated state. Right now the repo has neither: dups remain but docs suggest progress.

---

## 10. File Paths of Interest (for quick navigation)
- Configs:
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/eslint.config.mjs`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/package.json`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/package.json`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/marketing/package.json`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/tsconfig.json`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/marketing/tsconfig.json`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/packages/shared/tsconfig.json`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/vitest.config.ts`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/marketing/vitest.config.ts`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/playwright.config.ts`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/marketing/playwright.config.ts`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/.github/workflows/ci.yml`
- Tests:
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/lib/__tests__/`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/test/`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/marketing/test/`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/e2e/homepage.spec.ts`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/apps/marketing/e2e/homepage.spec.ts`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/freellmapi/server/src/__tests__/`
- Dark-mode / dedup docs:
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/docs/completed/dark-mode-plan-admin.md`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/docs/design/admin-marketing-page-dedup.md`
  - `/Users/stephenstokes/Workspace/Projects/Forhemit/docs/design/dedup-shared-package-20260525.md`

---

*Prepared by Hermes subagent — focused strictly on testing, linting, type safety, code quality, and verified gaps.*

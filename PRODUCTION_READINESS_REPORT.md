# Forhemit Production Readiness Assessment

**Date:** 2026-05-25  
**Auditor:** Ah-Yeon (Pi Agent — Velocity / Code)  
**Codebase:** forhemit-monorepo (Turborepo + pnpm + Convex + Next.js 16)

---

## Executive Summary

**Verdict: ❌ NOT PRODUCTION READY**

The Forhemit codebase has a solid architectural foundation (monorepo, Convex backend, Clerk auth, Sentry observability, CSP headers) but has critical gaps that block production deployment. There are 2 high-severity CVEs in core dependencies, authentication middleware is partially disabled, test coverage is near zero, and there is significant code hygiene debt.

### Severity Breakdown

| Category | Score | Status |
|----------|-------|--------|
| Security (CVEs + Auth) | 🔴 CRITICAL | 2 HIGH CVEs, auth bypass in middleware |
| Test Coverage | 🔴 CRITICAL | 0.5% file ratio (7 test files / 1,373 source files) |
| CI/CD | 🟡 WEAK | Build-only CI, no test/lint/security gates |
| Code Hygiene | 🟡 WEAK | Duplicate routes, backup files, 376 console.log calls |
| Documentation | 🟢 GOOD | ADRs, deployment docs, env docs exist |
| Observability | 🟢 GOOD | Sentry, health endpoint, structured schema |
| Architecture | 🟢 GOOD | Clean monorepo, env validation, CSP headers |

---

## 🔴 CRITICAL ISSUES (Must Fix Before Production)

### 1. HIGH CVE: Next.js DoS via Server Components (CVE-2026-23869)

- **Package:** `next` @ 16.2.2
- **Advisory:** GHSA-q4gf-8mx6-v5v3
- **CVSS:** 7.5 (HIGH)
- **Impact:** Denial of Service via crafted HTTP requests to any App Router Server Function endpoint
- **Fix:** Upgrade to `next@16.2.3` or later
- **Both apps affected:** `apps/admin`, `apps/marketing`

### 2. HIGH CVE: Effect ALS Context Contamination (CVE-2026-32887)

- **Package:** `effect` @ 3.17.7 (via `@uploadthing/react` → `@uploadthing/shared` → `effect`)
- **Advisory:** GHSA-38f7-945m-qr2g
- **CVSS:** 7.4 (HIGH)
- **Impact:** Under concurrent load, `auth()` can return the wrong user's session (authentication bypass). This is a race condition — works locally, fails in production.
- **Fix:** Upgrade `effect` to ≥3.20.0 (may require updating `@uploadthing/react`)
- **Mitigation:** If using Effect RPC with Clerk, capture ALS-dependent values before entering Effect runtime

### 3. Authentication Bypass: Domain Check Disabled

**File:** `apps/admin/middleware.ts` (line ~48)

```typescript
// TEMPORARILY DISABLE DOMAIN CHECK FOR TESTING
// if (!isAllowedEmail(email)) {
//   return NextResponse.json(
//     { error: 'Unauthorized', message: 'Email domain not allowed' },
//     { status: 403 }
//   );
// }
console.log(`Allowing email: ${email} for testing`);
```

**Impact:** Any authenticated Clerk user can access all admin API routes, not just `@forhemit.com` emails. This completely bypasses the domain-restriction security model.

**Fix:** Re-enable the domain check and remove the console.log.

### 4. Near-Zero Test Coverage

| Metric | Value |
|--------|-------|
| Source files (.ts/.tsx) | 1,373 |
| Test files (*.test.*, *.spec.*) | 7 |
| Test file ratio | **0.5%** |
| Unit tests | 5 (formatters, validation, email-payload) |
| E2E tests | 2 (homepage.spec.ts per app) |
| Test framework installed | ✅ Vitest + Playwright configured |
| Tests actually running in CI | ❌ No — CI only runs `build` |

The test frameworks are installed and configured but tests are not run in CI. The existing tests only cover utility functions and basic homepage rendering. No API route tests, no integration tests, no authentication flow tests.

---

## 🟡 SIGNIFICANT ISSUES (Should Fix Before Production)

### 5. CI Pipeline Has No Quality Gates

**File:** `.github/workflows/ci.yml`

The CI only runs:
1. `pnpm install --frozen-lockfile`
2. `pnpm turbo build` (with `SKIP_ENV_VALIDATION=true`)

**Missing from CI:**
- ❌ `pnpm test` (tests exist but aren't run)
- ❌ `pnpm lint` (lint script exists but isn't called)
- ❌ Security audit (`pnpm audit`)
- ❌ Type checking (`tsc --noEmit`)
- ❌ E2E tests (Playwright configs exist but unused)

### 6. Duplicate API Routes (Code Smell)

```
apps/admin/app/api/admin/login/route.ts
apps/admin/app/api/admin/login 2/route.ts    ← identical copy
apps/admin/app/api/admin/verify/route.ts
apps/admin/app/api/admin/verify 2/route.ts   ← identical copy
```

These are exact duplicates (diff returns nothing). They suggest merge conflict artifacts or copy-paste debugging. In Next.js, having a route with a space in the directory name is fragile and may cause routing issues.

### 7. No `.env.example` for Onboarding

No `.env.example` or `.env.template` exists. The `.env.local` file has 8 environment variables (CONVEX_URL, OPENAI keys, OPENROUTER key, etc.) but a new developer has no documented way to know what's required vs optional. The `lib/env.ts` files use `@t3-oss/env-nextjs` which validates at build time, but most server vars are `.optional()` which masks missing config.

### 8. 376 console.log Statements in Source

376 `console.log`, `console.error`, or `console.warn` calls across the TypeScript source. In production these:
- Leak internal state to server logs
- Cost money (Vercel log ingestion is metered)
- May contain PII (emails, user IDs)

Recommendation: Replace with structured logger (e.g., `pino`) or remove.

### 9. 14 `.backup` Files in Tree

Multiple `.backup` files in the working tree and in `.claude/worktrees/`:
- `apps/admin/app/layout.tsx.backup`
- `apps/marketing/app/layout.tsx.backup`
- `apps/marketing/next.config.js.backup`
- Various `ConvexProvider.tsx.backup` and `InfrastructureAuditModal.tsx.backup`

These should be cleaned up and excluded via `.gitignore`.

### 10. MEDIUM CVE: basic-ftp CRLF Injection

- **Package:** `basic-ftp` @ 5.2.0 (transitive via `puppeteer-core` → `proxy-agent`)
- **Impact:** CRLF injection in FTP commands (lower risk — only exploitable if FTP credentials are user-supplied)
- **Fix:** Upgrade `puppeteer-core` or add to audit exceptions

---

## 🟢 STRENGTHS

### Architecture
- Clean Turborepo monorepo with proper workspace config
- Single Convex source of truth (`packages/convex`) with CI auto-deploy
- Well-designed Convex schema with proper indexing, audit logs, CRM pipeline
- ADR documentation exists (ADR-001: Turborepo decision)

### Security Foundations
- CSP headers properly configured in `next.config.js`
- Clerk middleware with route matchers
- `@t3-oss/env-nextjs` for build-time env validation
- `.env.local` properly gitignored (never committed)
- Sentry error tracking configured (client + server)
- Health endpoint with Convex connectivity check
- Webhook signature verification infrastructure (Svix for Clerk, Retell)

### Deployment
- Vercel deployment documented with root directory config
- Convex auto-deploy via GitHub Actions on `packages/convex/**` changes
- Deployment documentation exists in `docs/`
- `pnpm --frozen-lockfile` in CI for deterministic builds

---

## Priority Remediation Plan

| Priority | Action | Effort | Risk Reduced |
|----------|--------|--------|-------------|
| P0 | Re-enable domain check in middleware | 5 min | Critical auth bypass |
| P0 | Upgrade `next` to ≥16.2.3 | 30 min | HIGH CVE |
| P0 | Upgrade `effect` / `@uploadthing` | 1-2 hr | HIGH CVE (auth race condition) |
| P1 | Add `pnpm test` and `pnpm lint` to CI | 30 min | Quality gate |
| P1 | Add `pnpm audit` to CI | 15 min | CVE detection |
| P1 | Remove duplicate API routes (`* 2/`) | 10 min | Code hygiene |
| P2 | Create `.env.example` | 30 min | Onboarding |
| P2 | Add tests for auth flows + API routes | 2-3 days | Test coverage |
| P2 | Replace console.log with structured logger | 1 day | Security + cost |
| P3 | Clean up `.backup` files | 10 min | Repo hygiene |
| P3 | Add type-check to CI (`tsc --noEmit`) | 15 min | Type safety |

---

## Recommended Acceptance Criteria for "Production Ready"

- [ ] All HIGH CVEs resolved (next ≥16.2.3, effect ≥3.20.0)
- [ ] Domain check re-enabled in middleware
- [ ] CI runs: build + lint + test + audit + type-check
- [ ] Test coverage ≥30% for API routes and auth flows (minimum viable)
- [ ] `.env.example` exists with all required variables documented
- [ ] Zero `console.log` in production source
- [ ] Duplicate routes removed
- [ ] `.backup` files cleaned from repo

---

*Generated by Ah-Yeon — Forhemit Production Readiness Review v1.0*

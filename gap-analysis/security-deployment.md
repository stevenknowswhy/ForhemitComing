06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Security, Secrets Handling, Deployment, and Environment Management — Gap Analysis

Focus areas: security posture, secrets hygiene, deployment config, environment validation, CORS, Sentry, and unprotected routes. File paths refer to the monorepo root unless otherwise stated.

---

## 1. Hardcoded Secrets / Credentials in Tracked Files

### 🔴 High — Super admin email hardcoded in source
- `packages/convex/convex/lib/requireAdmin.ts:6` — `SUPER_ADMIN_EMAIL = "stefano.stokes@forhemit.com"`
- `apps/admin/lib/clerk.ts:4` — same value duplicated.

**Impact:** Principle violation; any org change requires code change and re-deploy. Also leaks an internal identity.
**Recommendation:** Use an env var like `SUPER_ADMIN_EMAIL` with a safe default in development only.

### 🟡 Medium — Default admin credentials in tracked example files
- `apps/admin/.env.local.example:5` — `RESEND_API_KEY=re_your_api_key_here` (resend key prefix visible).
- `apps/admin/.env.local.example:11` — `ADMIN_EMAIL=stefano.stokes@forhemit.com`
- `apps/marketing/.env.local.example:11` — same Resend/email defaults as admin.

**Impact:** Example files are committed and instructive, but real-looking defaults can be copied into `.env.local` and forgotten; also reveals a production admin email address.
**Recommendation:** Replace with `your_admin_email@example.com` and remove key prefixes from examples.

---

## 2. Secrets in Version Control (.gitignore Gaps)

### 🔴 High — Root `.gitignore` does not protect per-app `.env.local`
- Root `.gitignore` only ignores `.env.local` at the monorepo root.
- App-level `.env.local` files (`apps/admin/.env.local`, `apps/marketing/.env.local`, `packages/convex/.env.local`) are **not ignored** at the root level (each app lacks its own `.gitignore` entry via the root file).
- Verified with `git ls-files`: none of those files are currently tracked, but an untracked `.env.local` could still leak via `git add .` because git only respects ignore rules in the directory of the path.

**Impact:** High risk of accidentally committing live credentials.
**Recommendation:** Add to root `.gitignore`:
```
# Per-app secrets
apps/**/.env.local
packages/**/.env.local
```

---

## 3. Environment Validation Gaps

### 🟠 High — `SKIP_ENV_VALIDATION` bypasses schema checks
- `apps/admin/lib/env.ts:56-57`
- `apps/marketing/lib/env.ts:38-39`

Both set:
```ts
skipValidation: process.env.SKIP_ENV_VALIDATION === "true" || process.env.npm_lifecycle_event === "lint"
```

**Impact:** Setting `SKIP_ENV_VALIDATION=true` (used historically per `PRODUCTION_READINESS_DIFF.md`) silences `@t3-oss/env-nextjs` validation including missing required secrets, production URL mismatches, and malformed keys. If a deploy forgets a credential, the build still succeeds and the app may fail at runtime or silently use an unintended fallback.
**Recommendation:** Remove `SKIP_ENV_VALIDATION` from production and CI build commands. Keep lint-only skip if needed, but gate with an explicit allowlist or a different variable.

### 🟡 Medium — Optional fallbacks mask missing production configuration
- Admin `lib/env.ts:47` defaults `NEXT_PUBLIC_CONVEX_URL` to `https://dummy.convex.cloud` when empty.
- Admin `lib/env.ts:11-22` marks `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `UPLOADTHING_*`, `UNSPLASH_*`, and `ADMIN_TOKEN` as optional.

**Impact:** Builds can succeed with absent production services; admin auth or uploads simply degrade silently.
**Recommendation:** For production builds, require the minimal critical secret set (at minimum `CLERK_SECRET_KEY` for admin, `UPLOADTHING_TOKEN` if uploads are enabled, `NEXT_PUBLIC_SENTRY_DSN` if Sentry is enabled).

---

## 4. Unprotected / Insufficiently Protected Routes

### 🔴 High — `POST /api/process-queue` has no auth/authorization
- `apps/admin/app/api/process-queue/route.ts`

Unauthenticated client-triggered batch document generation. The route accepts arbitrary `taskId`, `templateTitle`, `recipientEmail`, `dealData`, etc. and forwards them to the authenticated `generate-document` endpoint server-side.

**Impact:** abuse (spam/rate-limit exhaustion), document generation via spoofed input, potential data leakage through generated docs.
**Recommendation:** Require an admin session (same as other admin API routes) or at minimum validate the request is internal and rate-limit per session.

### 🟡 Medium — `GET /api/admin/verify` exposes internal auth state publicly
- `apps/admin/app/api/admin/verify/route.ts`

Returns `authenticated: true` without any Clerk/session check beyond an in-memory `admin_session` cookie. Can be probed to enumerate valid admin sessions.
**Impact:** low-medium; mostly information disclosure.
**Recommendation:** Ensure consistent auth guard; return 401 by default without the cookie.

### 🟡 Medium — Marketing `GET /app/admin/logout` lacks admin auth
- `apps/marketing/app/admin/logout/route.ts`

A logout route on the marketing app clears an `admin_session` cookie without verifying a valid admin session first.
**Impact:** Logout-forcing, session fixation vector, and potential denial-of-service to admin users.
**Recommendation:** Validate session before clearing, or remove the public logout endpoint.

---

## 5. CORS Gaps

### 🟠 High — Convex HTTP action uses wildcard CORS
- `packages/convex/convex/http.ts:15-18`

```ts
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
```

Comment says it is intentional for `file://` drafts, but this header is applied broadly and can expose Convex-backed HTTP responses to any origin.

**Impact:** CSRF/external browser consumption of Convex HTTP endpoints.
**Recommendation:** Restrict origins to the known app domains; allow `file://` only on specific routes if still required.

### 🟠 Medium — Marketing CSP omits `https://*.sentry.io`
- `apps/marketing/next.config.js`

Admin app also had this gap (documented in `docs/SENTRY_SETUP.md`). Sentry ingestion is not allowlisted.
**Impact:** Sentry reports are blocked by CSP in production.
**Recommendation:** Add `https://*.sentry.io` to both apps' `connect-src` after activating Sentry.

### 🟡 Low — Marketing CSP lacks Clerk and UploadThing on some endpoints
- Marketing `next.config.js` `connect-src` and `script-src` include Stripe, UploadThing, Clerk paths — but `frame-src` excludes Clerk (`frame-src 'self' https://js.stripe.com`). Clerk often requires iframe/frame allowances for OAuth flows.
**Impact:** Clerk sign-in/redirect flow breakage in marketing preview builds.
**Recommendation:** Add Clerk domains to `frame-src` if used for OAuth, or disable clerk-specific framing explicitly if not needed.

---

## 6. Sentry Misconfiguration / Incomplete Integration

### 🟠 High — Sentry integration files are missing entirely
Docs describe required files:
- `apps/admin/sentry.client.config.ts`
- `apps/admin/sentry.server.config.ts`
- `apps/admin/instrumentation.ts`
- `apps/admin/next.config.js` wrapper `withSentryConfig`

Only `next.config.js` exists; no `sentry.*` config files or `instrumentation.ts` found.
**Impact:** Sentry is effectively inactive despite docs claiming it is installed and configured. Errors will not be reported.
**Recommendation:** Create the referenced config files, add source map upload to `next.config.js`, and create `instrumentation.ts` at `apps/admin/` root.

### 🟡 Medium — Sentry DSN shown in docs with placeholder credentials
- `docs/SENTRY_SETUP.md:43-44`

```md
https://abc123@o123456.ingest.us.sentry.io/7890123
```

**Impact:** Developers may paste the example directly into `.env.local` or `.env.example` (it does not appear in those files currently, but the example is concrete and copy-pasteable).
**Recommendation:** Use fully placeholder DSNs in docs and do not include secrets in examples.

### 🟡 Low — `NEXT_PUBLIC_SENTRY_DSN` is not in either app's `lib/env.ts`
Neither `apps/admin/lib/env.ts` nor `apps/marketing/lib/env.ts` validates `NEXT_PUBLIC_SENTRY_DSN`. The docs assume it is loaded; in practice, missing validation means the app builds with a stale or absent DSN silently.
**Recommendation:** Add `NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional()` to the client schema in both env files.

---

## 7. Incomplete / Inaccurate DEPLOYMENT.md Instructions

### 🟠 High — Convex deploy via `convex.config` is not actually present
`docs/DEPLOYMENT.md:33` references a `convex.config` with deployment preferences. No `convex.config.*` file exists in the repo.
**Impact:** Deployment instructions are misleading; teams may follow a nonexistent file-based config.
**Recommendation:** Remove the reference or add a real convex config file.

### 🟠 High — Convex env fallback logic is unclear
`docs/DEPLOYMENT.md:33` says env loads from `packages/convex/.env.local`, else `apps/admin/.env.local` or `apps/marketing/.env.local`. There is no document or code path confirming this fallback is intentional or reliable.
**Impact:** Deploys may use unintended keys during `pnpm convex:deploy`.
**Recommendation:** Document exactly which precedence is used by `pnpm convex:*` scripts in this monorepo.

### 🟡 Medium — Vercel install commands are inconsistent
- `apps/admin/vercel.json:2` — `pnpm install --no-frozen-lockfile --prefer-offline`
- `apps/marketing/vercel.json:2` — `pnpm install --frozen-lockfile`

Both install from the monorepo root. Divergent flags make build reproducibility uncertain.
**Recommendation:** Standardize on `--frozen-lockfile` for both, removing the admin override.

### 🟡 Medium — Deployment protection for Admin is marked optional
`docs/DEPLOYMENT.md:11` — optional deployment protection on Admin.
**Impact:** Admin may be publicly reachable if passwords are missing or if Vercel bypass protection is not enabled.
**Recommendation:** Mandate Vercel password protection (or SSO) in production; do not leave it optional.

---

## 8. Local-Dev Overrides and Other Leak Vectors

### 🟡 Medium — `.env.local.example` files are tracked but leak identities
- `apps/admin/.env.local.example:11` — `ADMIN_EMAIL=stefano.stokes@forhemit.com`
- `apps/marketing/.env.local.example:11` — same value.

**Impact:** Internal identity present in version control.
**Recommendation:** Replace with generic examples.

### 🟡 Medium — Root `NEXT_PUBLIC_SITE_URL` is set to production value in example
- `apps/admin/.env.example:58` — `NEXT_PUBLIC_SITE_URL=https://forhemit.website`
**Impact:** Hardcoded production URL in template.
**Recommendation:** Use `https://your-domain.com`.

### 🟡 Medium — `ADMIN_TOKEN` still in play
- `apps/admin/lib/env.ts:22`
- `docs/DEPLOYMENT.md:52`
- `packages/convex/convex/lib/requireAdmin.ts:24-27` (fallback to env var)

`ADMIN_TOKEN` is server-only, but `lib/env.ts` marks it optional and `requireAdmin` uses it as a bypass. If leaked, anyone with this string bypasses Clerk admin checks in Convex mutations.
**Recommendation:** Treat `ADMIN_TOKEN` as a break-glass emergency key; document rotation cadence and alert on its use.

---

## 9. Additional Observations

### 🟡 Medium — No `middleware.ts` in either app
There is no middleware for redirects, versioning, or security headers at the edge.
**Impact:** No centralized rate limiting or origin checks for non-API routes.
**Recommendation:** Add a minimal `middleware.ts` in both apps (if needed for preview gateway, A/B, or rewrites).

### 🟡 Medium — No `convex.config.*`
Mentioned in §7. Without this, Convex auth hints and deploy preferences rely on environment.

### 🟡 Low — Root `.gitignore` ignores `.env.local`, but example files are named `.env.local.example`
The ignore pattern does not cover `.env.local.example`. This is normally harmless (clean examples), but teams sometimes rename `.env.local.example` → `.env.local` without reviewing.

---

## Summary Table (Severity → Count)

| Severity | Description |
|----------|-------------|
| 🔴 High | 4 — super-admin email hardcoded; .gitignore missing per-app `.env.local`; `process-queue` unauthenticated; Sentry integration files absent |
| 🟠 Medium-High | 4 — `SKIP_ENV_VALIDATION` bypass; Convex wildcard CORS; missing convex config; install command inconsistency |
| 🟡 Medium | 9 — tracked example secrets/identities; marketing logout unauthenticated; admin verify public; env fallback unclear; Deployment Protection optional; `ADMIN_TOKEN` risk; no middleware; missing Sentry DSN in env schema; marketing CSP omission |
| ℹ️ Low | 2 — hardcoded production URLs in examples; `.env.local.example` naming |

---

## Recommended Immediate Actions

1. Update root `.gitignore` to ignore `apps/**/.env.local` and `packages/**/.env.local`.
2. Replace hardcoded `SUPER_ADMIN_EMAIL` with `process.env.SUPER_ADMIN_EMAIL` (with dev fallback).
3. Remove/secure hardcoded identities from `.env.local.example` files.
4. Add authentication to `POST /api/process-queue` (or remove the public client-facing route).
5. Restrict Convex CORS origins to known app domains.
6. Add `NEXT_PUBLIC_SENTRY_DSN` to both `lib/env.ts` client schemas, then implement `instrumentation.ts` and Sentry client/server configs.
7. Standardize Vercel install commands (frozen lockfile) and make Deployment Protection mandatory.
8. Audit cleanup of any `SKIP_ENV_VALIDATION=true` usage in CI and replace with real secrets per `docs/DEPLOYMENT.md`.

---

*Generated from monorepo root `/Users/stephenstokes/Workspace/Projects/Forhemit` for the 4th delegate gap analysis.*

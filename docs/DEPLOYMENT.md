# Deployment

Operational checklist aligned with `HARMONIZATION_PLAN.md`. Replace placeholder domains with production values.

## Surfaces

| Surface | Platform | Branch | Notes |
|---------|----------|--------|--------|
| Convex | Convex Cloud | `main` | Deploy **only** from `packages/convex` (local or CI; see below) |
| Marketing | Vercel (Project A) | `main` | **Root Directory:** `apps/marketing` |
| Admin | Vercel (Project B) | `main` | **Root Directory:** `apps/admin`; optional **deployment protection** |

## Vercel (marketing + admin)

Use **two** Vercel projects pointing at the **same** GitHub repository.

1. **Settings → General → Root Directory**
   - Marketing: **`apps/marketing`**
   - Admin: **`apps/admin`**

2. **Install command** — the pnpm lockfile is at the **monorepo root**. Each app includes **`vercel.json`** with:
   - `cd ../.. && pnpm install --frozen-lockfile`
   - In the dashboard, remove any conflicting **Install Command** override, or paste that exact command.

3. **Build command** — default **`next build`** (no override needed unless you standardize on Turbo).

4. **Framework preset** — Next.js.

5. **Node.js version** — **22.x** (aligned with GitHub Actions).

## Convex (single deployment)

- **Manual (local):** from repo root: **`pnpm convex:deploy`**. Env is loaded from **`packages/convex/.env.local`** if present, otherwise **`apps/admin/.env.local`** or **`apps/marketing/.env.local`** (same **`CONVEX_DEPLOYMENT`** as the apps). **`CONVEX_DEPLOY_KEY`** must be in one of those files for deploy; never commit it.
- **Do not** run **`convex deploy`** from **`apps/admin`** or **`apps/marketing`** (no Convex project files there).
- **CI:** **`.github/workflows/convex-deploy.yml`** runs on **`push` to `main`** when files under **`packages/convex/**`** change. Add GitHub secret **`CONVEX_DEPLOY_KEY`**. Without it, the workflow fails on those pushes.

## Environment variables

Validate at build time with **`@t3-oss/env-nextjs`** in each app’s `lib/env.ts`. Use **`SKIP_ENV_VALIDATION=true`** only for lint or CI steps without secrets. Minimum set:

### Both Next apps

- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL` (if used)
- Sentry / analytics as applicable

### Admin only

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- Clerk URL redirect envs per Clerk dashboard
- `ADMIN_TOKEN` (optional; scripts / `requireAdmin` fallback in current code)

### UploadThing (both if uploads used)

- `UPLOADTHING_TOKEN` (and any UploadThing public app id vars your version requires)

### CI (GitHub Actions)

- **`CONVEX_DEPLOY_KEY`** — used by **`.github/workflows/convex-deploy.yml`** on pushes to `main` that change **`packages/convex/**`**. Add as an **encrypted repository secret**. For local deploys, use **`packages/convex/.env.local`** (gitignored) or export in the shell.

## Secrets hygiene

- Store a **single** 1Password (or team vault) item listing **both** Vercel projects’ UploadThing and shared keys.
- **Rotate UploadThing** (and shared secrets) in **both** Vercel projects in the same change window to avoid drift.

## SEO / hosts

- **Indexable blog:** marketing host (e.g. `https://www.example.com/resources/blog/...`).
- **Admin host:** `noindex` via `robots.txt` and meta; no duplicate blog routes.

## Post-deploy smoke

- Marketing: health route, one published blog post (post–blog launch), sitemap URL.
- Admin: sign-in, one authenticated Convex mutation (e.g. list contacts).

## References

- `HARMONIZATION_PLAN.md` — phases, success criteria, risk register
- Each app’s `.env.example` (until merged into monorepo root)

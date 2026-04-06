# Deployment

Operational checklist aligned with `HARMONIZATION_PLAN.md`. Replace placeholder domains with production values.

## Surfaces

| Surface | Platform | Branch | Notes |
|---------|----------|--------|--------|
| Convex | Convex Cloud | `main` | Deploy from `packages/convex`: `pnpm convex:deploy` (root) or `pnpm run convex:deploy` in that package |
| Marketing | Vercel (Project A) | `main` | Root: `apps/marketing` after monorepo |
| Admin | Vercel (Project B) | `main` | Root: `apps/admin`; optional **deployment protection** (approval) |

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

- **`CONVEX_DEPLOY_KEY`** — full value from Convex dashboard (format `dev:deployment|…`). Add as an **encrypted repository secret**, not in workflow YAML. For local deploys, keep it in **`packages/convex/.env.local`** (gitignored), or export in the shell before deploy.

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

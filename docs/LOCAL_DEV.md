# Local development

This document describes how to run Forhemit apps **today** (two sibling project folders) and the **target** workflow after the Turborepo migration. Update this file when the monorepo lands.

## Current layout (pre-monorepo)

| Path | App | Default dev port |
|------|-----|------------------|
| `ForhemitAdminWebsite-main/` | Admin (Clerk, CRM, templates) | `5050` (`npm run dev`) |
| `ForhemitComing-main/` | Marketing / public | `3000` (`npm run dev`) |

Both projects expect the **same** `NEXT_PUBLIC_CONVEX_URL` for the shared Convex deployment (see each app’s `.env.example`).

### Convex dev ownership (critical)

Only **one** `convex dev` process should run against a given Convex project at a time.

1. **Designated owner** for the day runs from the folder they are editing (today: duplicate `convex/` — prefer **admin** as canonical until merge):
   ```bash
   cd ForhemitAdminWebsite-main && npx convex dev
   ```
2. **Everyone else:** avoid long-running `convex dev` against the same deployment. For a quick schema push:
   ```bash
   npx convex dev --once
   ```
3. For integration-style checks, use Convex docs for **prod-like** / preview deployments as appropriate; do not start a second dev push without coordinating.

After **monorepo**: run `convex dev` only from `packages/convex` (or repo root script); see updated section below.

### Environment

- Copy `.env.example` → `.env.local` in **each** app you run.
- Clerk keys are required for **admin**; marketing may omit Clerk for public routes but still needs Convex URL (and UploadThing if testing uploads).
- Each app validates env at runtime via **`lib/env.ts`** (`@t3-oss/env-nextjs`). For **`next lint`** without a full `.env.local`, validation is skipped automatically; you can set **`SKIP_ENV_VALIDATION=true`** for other commands if needed.

### Ports

- Admin: `5050` avoids clashing with marketing on `3000`. If both run, use two terminals.

---

## Target layout (post–Turborepo)

| Path | Role |
|------|------|
| `apps/admin/` | Admin Next app |
| `apps/marketing/` | Marketing Next app |
| `packages/convex/` | **Only** Convex schema and functions |

From repo root (exact scripts TBD in root `package.json`):

```bash
pnpm install
pnpm convex:dev    # single watcher; name may be "dev:convex"
pnpm dev           # turbo: both apps or use --filter
```

**Rule:** No `convex/` directory under `apps/*`. Generated client imports from `packages/convex`.

---

## Troubleshooting

- **“Schema out of sync”** — Someone else pushed schema; pull latest and restart `convex dev`.
- **Wrong deployment** — Confirm `NEXT_PUBLIC_CONVEX_URL` matches the Convex dashboard project you intend (dev vs prod).

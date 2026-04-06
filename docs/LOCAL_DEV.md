# Local development

## Layout (Turborepo)

| Path | App | Default dev port |
|------|-----|------------------|
| `apps/admin/` | Admin (Clerk, CRM, templates) | `5050` |
| `apps/marketing/` | Marketing / public | `3000` |
| `packages/convex/` | **Only** Convex schema and functions | — |

From repo root:

```bash
pnpm install
pnpm convex:dev     # Convex watcher (run in one terminal)
pnpm dev            # Turbo: both Next apps in parallel
```

Run a single app:

```bash
pnpm --filter forhemit-admin dev
pnpm --filter forhemit-coming-soon dev
```

**Rule:** There is no `convex/` under `apps/*`. Client code imports `@/convex/_generated/*`, which resolves to `packages/convex/convex/_generated/`.

### Convex dev ownership (critical)

Only **one** `convex dev` process should run against a given Convex deployment at a time.

1. Run Convex from the shared package (or `pnpm convex:dev` from repo root):
   ```bash
   cd packages/convex && pnpm run convex:dev
   ```
2. For **`convex deploy`**, set **`CONVEX_DEPLOY_KEY`** in **`packages/convex/.env.local`** (or export in the shell). You can symlink or copy from an app’s `.env.local` while migrating.
3. **`pnpm convex:once`** — one-shot codegen / schema push from root.

### Environment

- Copy each app’s `.env.example` → `.env.local` under `apps/admin` and/or `apps/marketing`.
- Clerk keys are required for **admin**; marketing may omit Clerk for public routes but still needs Convex URL (and UploadThing if testing uploads).
- Each app validates env at runtime via **`lib/env.ts`** (`@t3-oss/env-nextjs`). For **`next lint`** without a full `.env.local`, validation is skipped automatically; you can set **`SKIP_ENV_VALIDATION=true`** for other commands if needed.

### Ports

- Admin: `5050` avoids clashing with marketing on `3000`.

## Troubleshooting

- **“Schema out of sync”** — Someone else pushed schema; pull latest and restart `convex dev`.
- **Wrong deployment** — Confirm `NEXT_PUBLIC_CONVEX_URL` matches the Convex dashboard project you intend (dev vs prod).
- **Turbopack / monorepo** — Both apps set `turbopack.root` to the **repository root** and `experimental.externalDir` so imports from `packages/convex` resolve correctly.

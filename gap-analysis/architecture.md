06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Architecture Gap Analysis

## Planning Baselines

- `PLAN.md` lines: 217
- `HARMONIZATION_PLAN.md` lines: 359
- `PRODUCTION_READINESS_REPORT.md` lines: 103
- `docs/ADR-001-turborepo-monorepo.md` lines: 33

## Structural Checks

- package.json workspaces: 
- turbo.json exists: yes
- tsconfig at root: no
- convex.config exists anywhere under packages/convex: /Users/stephenstokes/Workspace/Projects/Forhemit/packages/convex/convex.json
- packages/ui exists: no
- packages/auth exists: no
- tailwind configs: /Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/tailwind.config.js
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/marketing/tailwind.config.js
- __tests__ dirs: 
- docs/LOCAL_DEV.md: yes
- docs/DEPLOYMENT.md: yes

## Workspace/Package Directory Layout

```
/Users/stephenstokes/Workspace/Projects/Forhemit/apps
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/.clerk
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/.clerk/.tmp
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/types
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/brokers
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/forms
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/privacy
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/embed
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/beyond-the-balance-sheet
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/wealth-managers
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/the-exit-crisis
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/lenders
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/faq
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/accounting-firms
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/introduction
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/terms
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/admin
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/appraisers
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/opt-in
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/business-owners
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/about
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/blog
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/styles
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/components
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/hooks
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/lib
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/legal-practices
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/api
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/financial-accounting
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/(auth)
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/coming-soon
/Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/app/client
/Users/stephenstokes/Workspace/Projects/Forhem
```

## Package Scripts / deps

### /Users/stephenstokes/Workspace/Projects/Forhemit/apps/admin/package.json

```json
1|{
2|  "name": "forhemit-admin",
3|  "version": "0.1.0",
4|  "private": true,
5|  "main": "next.config.ts",
6|  "scripts": {
7|    "dev": "NODE_OPTIONS='--max-http-header-size=32768' next dev --port 5050",
8|    "dev:3000": "NODE_OPTIONS='--max-http-header-size=32768' next dev --port 3000",
9|    "build": "next build",
10|    "start": "NODE_OPTIONS='--max-http-header-size=32768' next start",
11|    "lint": "eslint .",
12|    "test": "vitest",
13|    "convex:dev": "pnpm --filter @forhemit/convex run convex:dev",
14|    "convex:once": "pnpm --filter @forhemit/convex run convex:once",
15|    "convex:deploy": "pnpm --filter @forhemit/convex run convex:deploy",
16|    "convex:env": "pnpm --filter @forhemit/convex exec convex env list",
17|    "convex:dashboard": "pnpm --filter @forhemit/convex exec convex dashboard"
18|  },
19|  "dependencies": {
20|    "@clerk/nextjs": "^7.0.6",
21|    "@hookform/resolvers": "^5.4.0",
22|    "@radix-ui/react-accordion": "^1.2.12",
23|    "@radix-ui/react-avatar": "^1.1.11",
24|    "@radix-ui/react-checkbox": "^1.3.3",
25|    "@radix-ui/react-collapsible": "^1.1.12",
26|    "@radix-ui/react-dialog": "^1.1.15",
27|    "@radix-ui/react-dropdown-menu": "^2.1.16",
28|    "@radix-ui/react-label": "^2.1.8",
29|    "@radix-ui/react-select": "^2.2.6",
30|    "@radix-ui/react-separator": "^1.1.8",
31|    "@radix-ui/react-slot": "^1.2.0",
32|    "@radix-ui/react-tabs": "^1.1.13",
33|    "@radix-ui/react-tooltip": "^1.2.8",
34|    "@sentry/nextjs": "^10.43.
```

### /Users/stephenstokes/Workspace/Projects/Forhemit/apps/marketing/package.json

```json
1|{
2|  "name": "forhemit-coming-soon",
3|  "version": "0.1.0",
4|  "private": true,
5|  "main": "next.config.ts",
6|  "scripts": {
7|    "dev": "next dev",
8|    "dev:webpack": "next dev --webpack",
9|    "build": "next build",
10|    "start": "next start",
11|    "lint": "next lint",
12|    "test": "vitest",
13|    "generate:fee-pdf": "node scripts/generate-fee-transparency-pdf.mjs",
14|    "generate:brokers-checklist-pdf": "node scripts/generate-broker-first-call-checklist-pdf.mjs",
15|    "convex:dev": "pnpm --filter @forhemit/convex run convex:dev",
16|    "convex:once": "pnpm --filter @forhemit/convex run convex:once",
17|    "convex:deploy": "pnpm --filter @forhemit/convex run convex:deploy",
18|    "seed:blog": "npx tsx scripts/seed-blog-posts.ts"
19|  },
20|  "dependencies": {
21|    "@radix-ui/react-accordion": "^1.2.12",
22|    "@radix-ui/react-slot": "^1.2.0",
23|    "@radix-ui/react-tabs": "^1.1.13",
24|    "@sentry/nextjs": "^10.43.0",
25|    "@sparticuz/chromium": "^143.0.4",
26|    "@t3-oss/env-nextjs": "^0.13.8",
27|    "@uploadthing/react": "^7.3.3",
28|    "class-variance-authority": "^0.7.1",
29|    "clsx": "^2.1.1",
30|    "convex": "^1.33.0",
31|    "jspdf": "^4.2.1",
32|    "lucide-react": "^0.577.0",
33|    "next": "^16.2.6",
34|    "puppeteer-core": "^24.40.0",
35|    "react": "^19.2.4",
36|    "react-dom": "^19.2.4",
37|    "tailwind-merge": "^3.5.0",
38|    "tailwindcss-animate": "^1.0.7",
39|    "uploadthing": "^7.7.4",
40|    "zod": "^4.3.6"
41|  
```

### /Users/stephenstokes/Workspace/Projects/Forhemit/packages/shared/package.json

```json
1|{
2|  "name": "@forhemit/shared",
3|  "version": "0.1.0",
4|  "private": true,
5|  "main": "./src/index.ts",
6|  "types": "./src/index.ts",
7|  "exports": {
8|    ".": "./src/index.ts",
9|    "./hooks": "./src/hooks/index.ts",
10|    "./hooks/*": "./src/hooks/*.ts",
11|    "./lib": "./src/lib/index.ts",
12|    "./lib/*": "./src/lib/*.ts",
13|    "./features/lender-qa-tracker": "./src/features/lender-qa-tracker/index.ts",
14|    "./features/lender-qa-tracker/*": "./src/features/lender-qa-tracker/*.ts",
15|    "./features/esop-repayment-model": "./src/features/esop-repayment-model/index.ts",
16|    "./features/esop-repayment-model/*": "./src/features/esop-repayment-model/*.ts",
17|    "./features/deal-flow-system": "./src/features/deal-flow-system/index.ts",
18|    "./features/deal-flow-system/*": "./src/features/deal-flow-system/*.ts",
19|    "./features/crm": "./src/features/crm/index.ts",
20|    "./features/crm/*": "./src/features/crm/*.ts",
21|    "./features/esop-partners": "./src/features/esop-partners/index.ts",
22|    "./features/esop-partners/*": "./src/features/esop-partners/*.ts",
23|    "./pages/*": "./src/pages/*.tsx",
24|    "./styles/*": "./src/styles/*.css"
25|  },
26|  "dependencies": {
27|    "clsx": "^2.1.1",
28|    "tailwind-merge": "^3.5.0"
29|  },
30|  "peerDependencies": {
31|    "next": "^15.0.0",
32|    "react": "^19.0.0",
33|    "react-dom": "^19.0.0"
34|  },
35|  "devDependencies": {
36|    "@types/react": "^19.0.0",
37|    "next": "^15.0.0",
38|   
```

### /Users/stephenstokes/Workspace/Projects/Forhemit/packages/convex/package.json

```json
1|{
2|  "name": "@forhemit/convex",
3|  "version": "0.0.0",
4|  "private": true,
5|  "scripts": {
6|    "convex:dev": "bash scripts/with-env.sh dev",
7|    "convex:deploy": "bash scripts/with-env.sh deploy --yes",
8|    "convex:once": "bash scripts/with-env.sh dev --once"
9|  },
10|  "dependencies": {
11|    "@upstash/redis": "^1.38.0",
12|    "convex": "^1.33.0"
13|  },
14|  "devDependencies": {
15|    "typescript": "^5.7.0"
16|  }
17|}
18|
```

## Doc References

### packages/ui refs

- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/HARMONIZATION_PLAN.md', 'line': 61, 'content': '- **`packages/ui`:** Shared shadcn-oriented components where valuable.'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/HARMONIZATION_PLAN.md', 'line': 183, 'content': '| Monorepo build time creep | Medium | High | **Turborepo remote cache** Day 1; decouple `packages/ui` changes from `packages/convex` where possible. | DevOps |'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/docs-roadmap.md', 'line': 150, 'content': '- `packages/ui` (shared shadcn components)'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/docs-roadmap.md', 'line': 155, 'content': '### 6.2 `packages/ui` emptiness vs. local component libraries'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/docs-roadmap.md', 'line': 199, 'content': '- Missing packages: `packages/ui`, `packages/auth`'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/docs-roadmap.md', 'line': 210, 'content': '| `packages/ui` + `packages/auth` exist | ❌ Missing |'}

### packages/auth refs

- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/HARMONIZATION_PLAN.md', 'line': 62, 'content': '- **`packages/auth`:** Shared Clerk helpers.'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/docs-roadmap.md', 'line': 151, 'content': '- `packages/auth` (shared Clerk helpers)'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/docs-roadmap.md', 'line': 199, 'content': '- Missing packages: `packages/ui`, `packages/auth`'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/docs-roadmap.md', 'line': 210, 'content': '| `packages/ui` + `packages/auth` exist | ❌ Missing |'}

### dealProcessor refs

- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/docs-roadmap.md', 'line': 49, 'content': '- `CONVEX_FIXES_PLAN.md` — References `packages/convex/convex/dealProcessor.ts` as an existing file (line 8, line 17, etc.). That file no longer exists in the filesystem. The plan was created pre-refactor and is now stale.'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/docs-roadmap.md', 'line': 50, 'content': '- `PROJECT_STATUS.md` line 169 still lists "dealProcessor.ts has `@ts-nocheck` — circular type inference," but no such file is found under `packages/convex/convex/`. The concern may have moved to another module, but the status doc is misleading.'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/docs-roadmap.md', 'line': 212, 'content': '| `dealProcessor.ts` exists at packages/convex/convex/ | ❌ Missing (renamed/moved) |'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/gap-analysis/docs-roadmap.md', 'line': 231, 'content': '10. **Address `@ts-nocheck` and `noImplicitAny` status** — verify if `dealProcessor.ts` issue still exists elsewhere (the referenced file is gone) and update `PROJECT_STATUS.md` lines 159-170.'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/PROJECT_STATUS.md', 'line': 166, 'content': '- ~~**`dealProcessor.ts` malformed**~~ ✅ FIXED — return types restored'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/PROJECT_STATUS.md', 'line': 169, 'content': '- **`dealProcessor.ts` has `@ts-nocheck`** — circular type inference needs architectural refactor to break import cycle'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/PRODUCTION_READINESS_REPORT.md', 'line': 26, 'content': '- [x] **API import fixes** — Dynamic imports in `dealProcessor.ts`, `templateEmailer.ts`, `templateGenerator.ts`'}
- {'path': '/Users/stephenstokes/Workspace/Projects/Forhemit/PRODUCTION_READINESS_REPORT.md', 'line': 40, 'content': '| Remove `@ts-nocheck` from `dealProcessor.ts` | Medium | 1-2h | Refactor circular API import |'}

## Priority Architecture Gaps

1. `packages/ui` and `packages/auth` do not exist despite being referenced in `HARMONIZATION_PLAN.md`.
2. No root `tsconfig.json` found.
3. Convex package has no tsconfig.json according to testing-quality agent; verify via listing.
4. Root `turbo.json` status needs confirmation.
5. `docs/LOCAL_DEV.md` and `docs/DEPLOYMENT.md` are referenced but missing per docs-roadmap findings.
6. `tailwind.config.*` locations need verification for duplicate configs across apps.
7. `__tests__` directories need verification if present.

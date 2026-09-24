# Forhemit

Monorepo for Forhemit's public marketing site and the internal admin application, plus the shared packages they run on.

## Repository layout

```
├── apps/
│   ├── admin/        # Internal admin app — CRM, deal management, templates, document generation (Next.js 16)
│   └── marketing/    # Public marketing site (Next.js 15)
├── packages/
│   ├── shared/       # Shared types, hooks, utilities (@forhemit/shared)
│   └── convex/       # Convex backend functions + schema (@forhemit/convex)
├── resources/
│   └── ai-visibility-audit-evidence-log/   # Free, ungated evidence-log template
└── docs/             # Architecture decisions, deployment guides, project status
```

> Note: some public marketing pages (e.g. `/about`, `/accounting-firms`) currently live in `apps/admin` and likely belong in `apps/marketing`. Moving them is a planned follow-up.

## Free AI visibility resource

- [AI Visibility Audit Evidence Log](resources/ai-visibility-audit-evidence-log/) — Free, ungated 18-field CSV template with 12 neutral buyer-prompt starters for recording AI answer-engine mentions, citations, competitors, and factual accuracy.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Admin app | Next.js 16, React 19, Tailwind CSS, Radix UI |
| Marketing site | Next.js 15, React 19, Tailwind CSS |
| Backend | Convex (realtime database + serverless functions) |
| Auth | Clerk |
| Deployment | Vercel (frontend), Convex Cloud (backend) |
| Package manager | pnpm 10 (pinned via `packageManager`) |
| Build | Turborepo |

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 10 (Corepack picks it up from `packageManager`; install with `corepack enable`)
- Convex account ([convex.dev](https://convex.dev))
- Clerk account ([clerk.com](https://clerk.com))

### Installation

```bash
git clone <repo-url>
cd ForhemitComing
pnpm install

# Environment
cp apps/admin/.env.example apps/admin/.env.local
cp apps/marketing/.env.example apps/marketing/.env.local
# Edit the .env.local files with your keys

pnpm dev
```

### Environment variables

Each app's `.env.example` lists the required variables:

- **Admin**: Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, sign-in URL overrides), Convex URLs (`NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`), UploadThing, Unsplash, Sentry, Upstash Redis
- **Marketing**: Convex URLs (`NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`), UploadThing, Unsplash, Sentry

## Development

```bash
pnpm dev              # start all apps via Turborepo
pnpm build            # build all packages
pnpm lint             # lint all packages
pnpm test             # run tests
pnpm convex:dev       # local Convex development
pnpm convex:deploy    # deploy the Convex backend

# Type check a single app
pnpm --filter forhemit-admin exec tsc --noEmit
pnpm --filter forhemit-coming-soon exec tsc --noEmit
```

### Shared package pattern

Shared code lives in `packages/shared` and is imported via:

```typescript
import { ... } from '@forhemit/shared/features/<feature-name>';
```

Feature areas currently shared between apps: CRM, deal flow, ESOP partners, lender QA tracker, and the ESOP repayment model. See `docs/design/` for extraction patterns and conventions.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions. In short: frontend apps deploy on Vercel; the Convex backend deploys with `pnpm convex:deploy`.

## Documentation

- [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) — current project status dashboard
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — deployment guide
- [docs/LOCAL_DEV.md](docs/LOCAL_DEV.md) — local development setup
- [docs/ADR-001-turborepo-monorepo.md](docs/ADR-001-turborepo-monorepo.md) — architecture decision record
- [docs/SENTRY_SETUP.md](docs/SENTRY_SETUP.md) — error monitoring setup
- [docs/roadmap.md](docs/roadmap.md) — feature roadmap

## License

Proprietary — Forhemit, Inc.

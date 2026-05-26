05/26/26 06:54 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Forhemit

ESOP deal management platform — streamlining employee stock ownership plan transactions from first contact to close.

## Architecture

**Monorepo** managed by Turborepo with pnpm workspaces.

```
├── apps/
│   ├── admin/          # Internal admin dashboard (Next.js 15)
│   └── marketing/      # Public-facing site (Next.js 15)
├── packages/
│   ├── shared/         # Shared types, hooks, utilities (@forhemit/shared)
│   └── convex/         # Backend functions + schema (Convex)
└── docs/               # Architecture decisions, deployment guides
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS, Radix UI |
| Backend | Convex (realtime DB + serverless functions) |
| Auth | Clerk |
| Deployment | Vercel (frontend), Convex Cloud (backend) |
| Package Manager | pnpm with workspaces |
| Build | Turborepo |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Convex account ([convex.dev](https://convex.dev))
- Clerk account ([clerk.com](https://clerk.com))

### Installation

```bash
# Clone and install
git clone <repo-url>
cd Forhemit
pnpm install

# Set up environment
cp apps/admin/.env.example apps/admin/.env.local
cp apps/marketing/.env.example apps/marketing/.env.local
# Edit .env.local files with your keys

# Start development
pnpm dev
```

### Environment Variables

See `.env.example` in each app for required variables:

- **Convex**: `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOY_KEY`
- **Clerk**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- **Email (Resend)**: `RESEND_API_KEY`

## Development

```bash
# Start all apps
pnpm dev

# Build all packages
pnpm build

# Type check
pnpm --filter forhemit-admin exec tsc --noEmit
pnpm --filter forhemit-coming-soon exec tsc --noEmit

# Lint
pnpm lint
```

### Shared Package Pattern

Shared code lives in `packages/shared` and is imported via:

```typescript
import { ... } from '@forhemit/shared/features/<feature-name>';
```

See `docs/design/` for extraction patterns and conventions.

## Project Structure

### Apps

- **admin** — Internal dashboard for deal management, CRM, document generation, template builder
- **marketing** — Public site with intake forms, blog, partner directory

### Shared Features

| Feature | Package Path | Description |
|---------|-------------|-------------|
| CRM | `features/crm` | Company/contact types, calculations, filters |
| Deal Flow | `features/deal-flow-system` | Deal pipeline form + sections |
| ESOP Partners | `features/esop-partners` | Partner CRM types + calculations |
| Lender QA | `features/lender-qa-tracker` | Lender Q&A tracking form |
| ESOP Repayment | `features/esop-repayment-model` | Repayment model calculations |

### Backend (Convex)

- `packages/convex/convex/` — Serverless functions
- `packages/convex/convex/schema.ts` — Database schema
- `packages/convex/convex/crm/` — CRM-specific queries/mutations

## Deployment

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

**Quick deploy:**
```bash
# Deploy Convex backend
pnpm --filter convex deploy

# Deploy frontend (via Vercel CLI or GitHub integration)
vercel --prod
```

## Documentation

- `docs/ADR-001-turborepo-monorepo.md` — Architecture decision record
- `docs/DEPLOYMENT.md` — Deployment guide
- `docs/LOCAL_DEV.md` — Local development setup
- `docs/SENTRY_SETUP.md` — Error monitoring setup
- `docs/roadmap.md` — Feature roadmap

## License

Proprietary — Forhemit, Inc.

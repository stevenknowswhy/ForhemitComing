06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Forhemit Fix Checklist
Triage source: gap-analysis/TRIAGE.md  
Date: 2026-06-02

## Critical (today)
- [ ] C1 Fix .gitignore to ignore apps/**/.env.local and packages/**/.env.local
- [ ] C2 Remove hardcoded SUPER_ADMIN_EMAIL; use env with dev fallback
- [ ] C3 Add auth guard to POST /api/process-queue OR remove public client route
- [ ] C4 Restrict Convex HTTP CORS origins from * to known app domains
- [ ] C5 Remove SKIP_ENV_VALIDATION from production/CI paths
- [ ] C6 Create missing Sentry config files in apps/admin
- [ ] C7 Add tsconfig.json and typecheck script to packages/convex

## High (this sprint)
- [ ] H1 Recreate/archive missing docs/LOCAL_DEV.md, docs/DEPLOYMENT.md, docs/PRE_MONOREPO_GITHUB_MAIN.md
- [ ] H2 Sync docs/completed/ with PROJECT_STATUS.md
- [ ] H3 Deprecate stale CONVEX_FIXES_PLAN.md and SCHEMA_DRAFT_POSTS_USERS.md
- [ ] H4 Update PROJECT_STATUS.md branches/dealProcessor.ts status
- [ ] H5 Scaffold packages/ui + packages/auth OR remove references
- [ ] H6 Add root tsconfig.json with strict settings
- [ ] H7 Add @forhemit/shared alias to marketing vitest.config.ts
- [ ] H8 Add lint job to CI
- [ ] H9 Implement .dark CSS in admin-stitch.css and verify dark mode
- [ ] H10 Fix marketing CSP for Sentry + Clerk frame-src

## Medium (this month)
- [ ] M1 Sanitize .env.local.example placeholder values
- [ ] M2 Add Prettier config and format:check
- [ ] M3 Add test:ci scripts to admin, marketing, shared
- [ ] M4 Add build verification for packages/shared
- [ ] M5 Execute or revert dedup plan phases
- [ ] M6 Document ADMIN_TOKEN as break-glass key
- [ ] M7 Add middleware.ts for edge security headers
- [ ] M8 Add NEXT_PUBLIC_SENTRY_DSN to both lib/env.ts client schemas

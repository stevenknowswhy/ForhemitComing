05/26/26 08:23 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Changelog

All notable changes to the Forhemit monorepo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- README.md with project overview, architecture, and getting started guide
- LICENSE (proprietary) with Forhemit Inc. copyright
- `packages/shared` package for cross-app feature extraction
- Shared features: esop-partners, deal-flow-system, esop-repayment-model, lender-qa-tracker, export-utils
- CRM shared data layer: types, constants, lib/filters, lib/calculations
- Blog system with Convex-backed posts and admin editing
- Auth guards on remaining Convex functions (agentQueue, brokerEmails, etc.)
- pi-lens code quality scanning integration
- CHANGELOG.md (this file)

### Changed
- Extracted `esop-partners` feature to `packages/shared/src/features/esop-partners/` — types, constants, lib, hooks now shared
- Extracted `export-utils` to `packages/shared/src/lib/export-utils.ts`
- Fixed `generatedDocuments.templateId` schema mismatch — now references `templates` table (not `documentTemplates`)
- Removed 14 `as any` type casts — replaced with proper Convex `Id<>` types and union literals
- Removed ~250 dead files (scripts, unused components, duplicate CSS, dead hooks)
- Type-safe DealStage/WorkflowStatus/ContactType/ContactInterest/ContactStatus/ApplicationStatus aliases in Convex and apps

### Fixed
- `generatedDocuments.templateId` referencing wrong table — `v.id("documentTemplates")` → `v.id("templates")`
- Schema/comment mismatch in generatedDocuments.ts

### Removed
- 15 one-off test/seed scripts (dead code)
- 238 dead files: duplicate marketing admin components, unused CSS, dead hooks, unused form components (~33,450 lines)
- Marketing `admin/crm/` components/hooks/styles (duplicated from admin, never imported)
- Marketing `admin/templates/forms/` (60+ duplicate form components)
- Duplicate hooks: useCountUp, useIntersectionObserver, useReducedMotion, useScrollReveal (now in shared)

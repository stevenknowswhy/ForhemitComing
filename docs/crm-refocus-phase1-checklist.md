06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# CRM Refocus — Phase 1 Checklist

> Plan: `docs/crm-refocus-phase1-schema-types.md`
> Status: 🔴 Not Started

---

## Step 1: Create Constants File

- [x] Create `packages/shared/src/features/crm/stewardship-constants.ts`
- [x] Add `DEAL_STAGES`, `DealStage`, `TERMINAL_STAGES`, `ACTIVE_STAGES`
- [x] Add `CONTACT_TYPES`, `ContactType`
- [x] Add `ADVISOR_TYPES`, `AdvisorType`
- [x] Add `FINANCIAL_RANGES`, `FinancialRange`
- [x] Add `EMPLOYEE_RANGES`, `EmployeeRange`
- [x] Add `TRANSITION_TIMELINES`, `TransitionTimeline`
- [x] Add `PRIMARY_MOTIVATIONS`, `PrimaryMotivation`
- [x] Add `NURTURE_STAGES`, `NurtureStage`
- [x] Add `RELATIONSHIP_STAGES`, `RelationshipStage`
- [x] Add `INTERACTION_TYPES`, `InteractionType`
- [x] Add `SENTIMENT_VALUES`, `SentimentValue`
- [x] Add `CONTACT_FREQUENCIES`, `ContactFrequency`
- [x] Add `URGENCY_LEVELS`, `UrgencyLevel`
- [x] Add `TRUST_LEVELS`, `TrustLevel`
- [x] Add `BUSINESS_MODELS`, `BusinessModel`
- [x] Add `INDUSTRY_CATEGORIES`, `IndustryCategory`
- [x] Update `packages/shared/src/features/crm/index.ts` to export constants

---

## Step 2: Rewrite Types File

- [x] Create `packages/shared/src/features/crm/stewardship-types.ts` (new file, old types.ts preserved)
- [x] Create `CompanyV2` interface (all new fields)
- [x] Create `ContactV2` interface (type discriminator + all new fields)
- [x] Create `InteractionV2` interface
- [x] Create `CrmDocumentV2` interface
- [x] Create `CompanyFormDataV2` (7-step structure)
- [x] Create `OwnerFormData`
- [x] Create `BrokerFormData`
- [x] Create `AdvisorFormData`
- [x] Create `ContactFormDataV2`
- [x] Create `InteractionFormDataV2`
- [x] Create `DocumentFormDataV2`
- [x] Create `CompanyFiltersV2`
- [x] Create `PipelineStatsV2`
- [x] Create `ContactFiltersV2`
- [x] Create `InteractionFiltersV2`
- [x] Create `SortConfigV2`, `CompanySortField`, `SortDirectionV2`
- [x] Create `CRM_VIEWS_V2`
- [x] Re-export old types as V1 aliases (`CompanyV1`, `ContactV1`, etc.)
- [x] Update `packages/shared/src/features/crm/index.ts` to export all new types

---

## Step 3: Convex Schema Changes

- [x] Update `packages/convex/convex/schema.ts`
- [x] Add stewardship fields to `crmCompanies` (~70 new optional fields)
- [x] Add stewardship fields to `crmContacts` (~40 new optional fields + contactType)
- [x] Make `crmContacts.companyId` optional (referral partners may not be linked)
- [x] Create `crmInteractions` table (7 indexes)
- [x] Create `crmDocuments` table (3 indexes)
- [x] Add new indexes to `crmCompanies` (nurtureStage, transitionTimeline, recycleDate, referredBy, nextActionDate)
- [x] Add new indexes to `crmContacts` (type, type+company, lastName)
- [x] Fix `crmContacts.ts` — guard `companyId` usage (now optional)
- [x] Fix `crmContacts.ts` — remove unused `Doc` import
- [x] Verify schema pushes: `cd packages/convex && pnpm convex:once`
- [x] Verify admin build passes

---

## Step 4: New Convex Modules

- [x] Create `packages/convex/convex/crmInteractions.ts`
  - [x] `create` mutation (with auto-update of contact lastContactDate)
  - [x] `update` mutation
  - [x] `remove` mutation
  - [x] `listByCompany` query
  - [x] `listByContact` query
  - [x] `getLatestByCompany` query
  - [x] `getLatestByContact` query
  - [x] `getUpcomingActions` query (nextActionDate <= today)
- [x] Create `packages/convex/convex/crmDocuments.ts`
  - [x] `create` mutation
  - [x] `remove` mutation
  - [x] `listByCompany` query
  - [x] `listByContact` query
- [x] Update `packages/convex/convex/crmContacts.ts`
  - [x] Add `searchContacts` query (name search for picker)
  - [x] Add `listByType` query
- [x] Verify Convex functions push: `pnpm convex:once`
- [x] Verify admin build passes

---

## Step 5: Migration Script

- [x] Create `packages/convex/convex/migrations/crmRefocus.ts`
- [x] Implement `migrateCompanies` — stage migration (STAGE_MAP) + revenue/size parsing
- [x] Implement `migrateContacts` — contactType inference from role + company FKs
- [x] Implement `migrateActivitiesToInteractions` — crmActivities → crmInteractions copy
- [x] Implement `linkPrimaryOwners` — link owner contacts via primaryOwnerContactId
- [x] All migrations are batched (configurable batchSize, default 50)
- [x] Company/contact migrations are idempotent; activity migration is one-way
- [x] Convex functions push successfully

---

## Step 6: Admin App Compatibility

- [x] Old views still compile (all new fields are optional, old fields preserved)
- [x] `crmContacts.companyId` made optional — guarded with `if` in existing mutations
- [x] No changes needed to existing components during Phase 1 (Phase 2 rebuilds the form)
- [x] `pnpm build` passes clean

---

## Step 7: Build & Verify

- [x] `packages/shared` — compiles clean
- [x] `packages/convex` — schema pushes, functions deploy
- [x] `apps/admin` — `pnpm build` passes
- [x] No regressions in existing CRM views (additive-only changes)
- [x] No regressions in Deal Tracker, Business Log, Letters, Journals

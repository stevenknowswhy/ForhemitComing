05/29/26 08:03 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Convex Architecture Fixes — Revised Plan

## Context
Initial diagnosis found 5 issues. Full type-check reveals **~100+ TS errors** across 15+ Convex files.
These are all pre-existing — the codebase was developed with `SKIP_ENV_VALIDATION=true` and no type-check gate.

## Root Cause Analysis

### Category A: Schema Behind Code (50+ errors)
The schema doesn't define tables/fields that the code already uses.

**Missing tables:**
- `notes` — used by `workflowTasks.ts`, `notes.ts`
- `emailEvents` — used by email code
- `queueTasks` — used by `triggers.ts`

**Missing fields on `workflowTasks`:**
- Status values: `sent`, `received`, `delivered`, `opened`, `overdue` (schema only has `pending|completed|skipped|cancelled`)
- Fields: `meetingAgenda`, `privateNotes`, `boxFileId`, `boxSignRequestId`, `boxSignStatus`, `signedDocumentUrl`, `responseData`, `receivedAt`, `sentAt`, `resendId`

**Missing fields on `templates`:**
- `source`, `content`

**Missing indexes:**
- `stageRequirements.by_trigger` 
- `workflowTasks.by_box_sign`, `workflowTasks.by_company_template`
- `notes.by_company`, `notes.by_contact`, `notes.by_task`, `notes.by_type`

### Category B: Convex Function Call Pattern (20+ errors)
Code calls `someMutation(ctx, args)` directly instead of `ctx.runMutation("module:fn", args)`.
Same for queries: `someQuery(ctx, args)` instead of `ctx.runQuery("module:fn", args)`.

**Files affected:**
- `dealEngine.ts` — calls `initializeFees`, `getStageState`, `canTransition`
- `feeCalculator.ts` — calls `getFees` query directly
- `gates.ts` — calls `getGates` query directly  
- `stages.ts` — calls `getStageState`, `canTransition` directly
- `triggers.ts` — calls `createTriggeredTasks` directly
- `workflowService.ts` — calls `createWorkflowTask` directly
- `templateGenerator.ts` — calls actions directly

### Category C: Convex API Namespace Issues (5+ errors)
- `templateEmailer.ts` — duplicate `v` import, `api.emails` doesn't exist
- `templateGenerator.ts` — `api.templates` doesn't exist
- `workflowTasks.ts` — `ctx.runMutation("workflowService:createWorkflowTask", ...)` uses string instead of function reference

### Category D: Misc Typos & Field Mismatches (10+ errors)
- `templateRules.ts` — `recurringRule` → `recurrenceRule` (2 places)
- `triggers.ts` — `requiredGate` doesn't exist on stageRequirements
- `stages.ts` — `"First touch"` not in stage union type

## Execution Plan

### Phase 1: Schema Alignment (fixes ~60% of errors)
Update `schema.ts` to match what code expects:
1. Add `notes` table with all fields + indexes
2. Add `emailEvents` table  
3. Add `queueTasks` table with all fields + indexes
4. Expand `workflowTasks` status union: add `sent|received|delivered|opened|overdue`
5. Add missing fields to `workflowTasks`: `meetingAgenda`, `privateNotes`, `boxFileId`, `boxSignRequestId`, `boxSignStatus`, `signedDocumentUrl`, `responseData`, `receivedAt`, `sentAt`, `resendId`
6. Add missing fields to `templates`: `source`, `content`
7. Add missing indexes to `stageRequirements` and `workflowTasks`
8. Add `by_trigger` index to `stageRequirements`

### Phase 2: Function Call Pattern (fixes ~20% of errors)  
Convert direct function calls to `ctx.runMutation`/`ctx.runQuery`:
- `dealEngine.ts`
- `feeCalculator.ts` 
- `gates.ts`
- `stages.ts`
- `triggers.ts`
- `workflowService.ts`
- `templateGenerator.ts`
- `workflowTasks.ts` (string → function reference)

### Phase 3: Code Fixes (fixes remaining errors)
- Fix `templateEmailer.ts` duplicate import
- Fix `templateRules.ts` recurringRule typos
- Fix `stages.ts` "First touch" stage name
- Fix `triggers.ts` requiredGate reference

### Phase 4: Validation
- `npx tsc --noEmit` — zero errors
- `pnpm turbo test -- --run` — all tests pass
- `SKIP_ENV_VALIDATION=true pnpm turbo build` — both apps build

## Risk Assessment
- **Schema changes are additive only** — no data loss risk
- **Function call refactors change execution semantics** — direct call = same transaction, `runMutation` = separate transaction. Need to verify data consistency.
- **Status union expansion** — existing data with `pending|completed|skipped|cancelled` is unaffected; new statuses are additive.

## Estimated Scope
~15 files, ~200 lines changed. This is a medium-sized refactor.

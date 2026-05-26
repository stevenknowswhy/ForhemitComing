# P2c: Extract deal-flow-system to packages/shared

**Date:** 2026-05-26
**Pattern:** Same as P2a (lender-qa-tracker) and P2b (esop-repayment-model)
**Total:** 5,018 lines → 3 incremental slices

---

## P2c-1: Logic layer (types + constants + hook + lib)

**Lines:** ~1,559
**Risk:** Low — proven pattern 3x

### Files to extract

| File | Lines | Imports from |
|------|-------|-------------|
| `types.ts` | 446 | None (standalone) |
| `constants.ts` | 528 | `./types` |
| `hooks/useDealFlowForm.ts` | 450 | `../types`, `../constants`, `../lib` |
| `lib/calculations.ts` | 135 | `../types` |

### Steps

1. `mkdir -p packages/shared/src/features/deal-flow-system/{hooks,lib}`
2. Copy 4 files from admin (canonical, byte-identical)
3. Create barrel `index.ts` (types + constants + hook + lib exports)
4. Update `packages/shared/package.json` exports
5. Update admin `index.ts` — import from `@forhemit/shared/features/deal-flow-system`
6. Update marketing `index.ts` — same
7. Update admin `DealFlowSystemForm.tsx` — hook import from shared
8. Update marketing `DealFlowSystemForm.tsx` — same
9. Delete old files from both apps
10. `tsc --noEmit` both apps
11. `build` both apps
12. Commit

---

## P2c-2: Input components

**Lines:** ~308
**Risk:** Low — small files, only React + types deps

### Files to extract

| File | Lines |
|------|-------|
| `Checkbox.tsx` | 23 |
| `CheckboxGroup.tsx` | 46 |
| `NumberInput.tsx` | 52 |
| `RadioGroup.tsx` | 46 |
| `SelectInput.tsx` | 54 |
| `StageIndicator.tsx` | 35 |
| `TextInput.tsx` | 43 |
| `index.ts` | 9 |

### Steps

1. Create `packages/shared/src/features/deal-flow-system/components/inputs/`
2. Copy 8 files from admin
3. Update imports in copied files (`../../types` → `@forhemit/shared/features/deal-flow-system`)
4. Export inputs from feature barrel `index.ts`
5. Update section components in both apps to import inputs from shared
6. Delete old input files from both apps
10. `tsc --noEmit` + `build` both apps
11. Commit

---

## P2c-3: Section components + form component

**Lines:** ~2,701
**Risk:** Medium — largest slice, 20 section files + form

### Files to extract

| Group | Files | Lines |
|-------|-------|-------|
| Sections (20) | BusinessIdentitySection, DealFlowOutput, EmployeePopulation, ESOPStructure, FeasibilityFlags, FinancialDocuments, GapItems, GoNoGo, HRDocuments, InsuranceGovernance, KeyContacts, LegalDocuments, Liabilities, Motivation, NextSteps, OwnerObjectives, QuickQualifiers, Rollover1042, Scoring, SourceReferral, Valuation, index | ~2,144 |
| Form | DealFlowSystemForm.tsx | 557 |

### Steps

1. Create `packages/shared/src/features/deal-flow-system/components/sections/`
2. Copy 21 section files from admin
3. Update imports in copied files (types/constants/lib/inputs → shared paths)
4. Copy `DealFlowSystemForm.tsx` to shared
5. Update its imports
6. Export sections + form from barrel
7. Update app index.ts files to re-export from shared
8. Delete old files from both apps
9. `tsc --noEmit` + `build` both apps
10. Commit

---

## Verification (after each slice)

- `pnpm --filter forhemit-admin exec tsc --noEmit`
- `pnpm --filter forhemit-coming-soon exec tsc --noEmit`
- `pnpm --filter forhemit-admin run build`
- `pnpm --filter forhemit-coming-soon run build`
- No stale local imports: `grep -rn 'from "\.\./types"\|from "\.\./constants"\|from "\.\./lib"' <module-path>`

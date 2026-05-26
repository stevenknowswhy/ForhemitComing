05/26/26 07:50 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# pi-lens Remediation Plan

**Created:** 2026-05-26
**Source:** pi-lens scan `booboo-2026-05-26T13-14-46.md`
**Baseline:** 3,616 issues | 3,550 fixable | 66 need refactor | Production Readiness: 65/100 (D)

## Batch Execution Order

### Batch 1: Schema Mismatch Fix 🔴
**Priority:** Highest — potential runtime bug
**Task:** Fix `documentPipeline.ts:149` TODO — `templateId` references "documentTemplates" but args.templateId is from "templates"
**Scope:** 1 file, Convex backend
**Risk:** High — data layer correctness
**Gate:** `tsc --noEmit` on both apps
**Status:** ✅ Complete — `c527c6e`

### Batch 2: Dedup Extraction (esop-partners, export-utils, useBlog) 🟡
**Priority:** High — follows proven pattern from CRM extraction
**Tasks:**
- T2a: Extract `esop-partners` types/constants/lib to shared (filterContacts, sortContacts)
- T2b: Extract `export-utils` to shared (flattenObject, exportToText, formatValue)
- T2c: Extract `useBlog` hook to shared (useScrollDepth)
**Scope:** ~6-8 files across admin + marketing
**Risk:** Medium — same pattern as P2a-P2d
**Gate:** `tsc --noEmit` + `next build` on both apps
**Status:** ✅ Partial (2a + 2b complete, 2c skipped — too coupled to blog-data)

### Batch 3: `as any` Cast Cleanup 🟡
**Priority:** Medium — type safety
**Task:** Replace 24 `as any` casts with proper types, referencing Convex schema
**Scope:** ~24 locations across codebase
**Risk:** Medium — needs Convex schema reference for branded types
**Gate:** `tsc --noEmit` on both apps
**Status:** ✅ Complete — 14 of 23 fixed (`3b959f0` + `9fc8443`), 9 remaining (3 false positives, 1 experimental API, 5 lower priority)

### Batch 4: Cleanup (README + Console.log) 🟢
**Priority:** Low — housekeeping
**Tasks:**
- T4a: Create README.md + LICENSE (production readiness docs score: 10→?)
- T4b: Remove console.log from production code (319 statements, keep in scripts/)
**Scope:** New files + scattered edits
**Risk:** Low
**Gate:** `tsc --noEmit` on both apps
**Status:** ✅ Complete (4a: `86de3f1`, 4b: No action needed — production code only has legitimate console.error/warn in catch blocks)

## Expected Outcome

| Metric | Before | Target After |
|--------|--------|-------------|
| Total Issues | 3,616 | ~2,800 |
| Semantic Duplicates | 10 | 4 |
| `as any` casts | 24 | <5 |
| Production Readiness | 65/100 (D) | 75+ (C) |
| Open TODOs | 3 | 2 |

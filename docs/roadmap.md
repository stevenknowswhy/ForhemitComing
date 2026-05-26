# Forhemit Roadmap

## Shared Package — Feature Extraction (P2+)

### ✅ Completed

- **P0** — Root-level hooks → `packages/shared/src/hooks/` (merged 7748db1)
- **P1** — `cn` utility → `packages/shared/src/lib/utils.ts` (merged 3dfc3e8)
- **P2a** — `lender-qa-tracker` logic layer → `packages/shared/src/features/lender-qa-tracker/` (968 lines)

### Ready (same pattern as P2a)

- **P2b** — `esop-repayment-model` → `packages/shared/src/features/esop-repayment-model/` (2,912 lines, byte-identical)
- **P2c** — `deal-flow-system` → `packages/shared/src/features/deal-flow-system/` (5,018 lines, byte-identical)

### 🔴 Planned — CRM Type Reconciliation

**Why it's blocked:** The CRM module has diverged between admin and marketing.

| Area | Admin | Marketing |
|------|-------|-----------|
| Entity types | Uses Convex `Doc<"crmCompanies">` | Hand-rolled `Company` type with `[key: string]: any` |
| Pipeline stages | `"First contact"`, `"Intro call"`, `"NDA sent"`, ... | `"New"`, `"Contacted"`, `"Qualified"`, `"Underwriting"`, ... |
| NDA statuses | `["None", "Pending", "Signed"]` | `["None", "Requested", "Pending", "Signed"]` |
| Stage styles | `Record<PipelineStage, StageStyle>` with inline hex | `Record<string, StageStyle>` with CSS class refs |
| Task statuses | `"pending"`, `"completed"`, `"overdue"` | `"Open"`, `"In Progress"`, `"Done"`, `"Blocked"` |
| useDealEngine | Present (wires triggers on stage change) | Absent |
| useCrmCompanies | Wires `wireTriggersMutation` on stage change | Clean update-only |

**What needs to happen:**

1. **Choose canonical types** — Marketing's types are a superset (more flexible, more stages). Admin's are Convex-typed. Need a unified type system that works for both.
2. **Reconcile pipeline stages** — Decide on one stage set (or make it configurable).
3. **Handle `useDealEngine`** — Admin-only feature. Either extract to admin-only code or make it opt-in in shared.
4. **Extract hooks + types + constants + lib** — ~1,578 lines (types 203L, constants 167L, 7 hooks 608L, 4 lib files 600L). Some hooks are identical, some differ.
5. **Update 20+ component files** — Both apps' CRM components import from local types/constants/lib.

**Estimated effort:** Medium-large. Type reconciliation is the hard part; extraction follows the P2a pattern once types are unified.

**Suggested approach:** Start with a `packages/shared/src/features/crm/types.ts` that defines the canonical types as a superset of both apps, then migrate each app incrementally.

---

## Other Dedup Phases (P3–P5)

- **P3** — Feature lib (CRM, templates) — ~2,098 lines
- **P4** — Components (~263 files, ~8,000+ lines) — high risk, largest category
- **P5** — App-level pages — varies

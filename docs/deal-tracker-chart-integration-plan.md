06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Deal Tracker → Phase Radial Chart Integration Plan

**Date:** 2026-05-31
**Version:** 3.0
**Status:** Planned — Ready to Build

---

## Overview

Wire the Admin dashboard's phase radial chart to the deal tracker checklist. Two modes: **aggregate** (default, all deals) and **per-deal** (company selected from dropdown). The chart is visible to both admins and clients. Every decision in this document prioritizes clarity, correctness, and a professional client-facing appearance.

---

## What Changed from v2

| Area | v2 | v3 |
|------|----|----|
| Ring map location | Embedded in query file | Shared config `phaseChartConfig.ts` |
| Subtask counts | Hardcoded in ring map | Derived dynamically from DB; config stores task ID only |
| Aggregate semantics | "% of active deals" (undefined) | Explicitly: % of deals that have reached that phase |
| Gate logic | Partially defined | Fully specified with three-state derivation rules |
| Dropdown visibility | Hidden in aggregate | Always visible, defaults to "All Deals" |
| Loading/empty states | Per-deal empty only | All states defined for both modes |
| Tooltips | Not mentioned | Required on all rings |
| Caching | Not mentioned | Defined per mode |
| Client visibility | Not addressed | Explicitly accommodated in UX decisions |

---

## Open Questions — Resolved

> All questions from v2 are answered here. These answers are locked decisions unless explicitly reopened.

| # | Question | Answer |
|---|----------|--------|
| Q1 | What defines "active" in aggregate mode? | Any deal with status `active`. Excludes `archived`, `lost`, `closed`. |
| Q2 | Are gate tasks double-counted in totals? | No. Gate subtasks are included once in phase totals. `isGate` flag drives the indicator row separately. |
| Q3 | What triggers "Blocked" gate status? | Derived: all gate subtasks complete but a manual `blocked` flag exists on the deal record. Pending = subtasks incomplete. Cleared = all subtasks complete and no block flag. |
| Q4 | What if a company has no tracker data? | Show a "No tracker data yet" notice inside the chart area. Rings render at zero. Gate row shows all Pending. |
| Q5 | Is the dropdown scoped to active deals only? | Yes. Dropdown lists only companies with an active deal. |
| Q6 | Does ring completion require all subtasks, or is partial shown? | Partial fill shown. Ring arc fills proportionally to `completedSubs / totalSubs`. |
| Q7 | What happens when a task is renamed or deleted in the tracker? | Config stores task ID only. DB is the source of truth for labels and counts. A dev-mode warning fires if a task ID in config is missing from DB. |
| Q8 | Are subtask counts hardcoded? | No. Counts are derived from the DB at query time. Config contains task IDs only. Phase totals in this document are reference estimates only. |

---

## Shared Configuration

**File:** `packages/shared/phaseChartConfig.ts`

This is the only place ring order, task mapping, and gate definitions live. Imported by the backend query and the frontend chart component.

```ts
export const PHASE_CHART_CONFIG = {
  phases: [
    {
      key: "ignition",
      label: "Ignition",
      rings: [
        { taskId: "t1_1",  label: "Retainer Secured"    },
        { taskId: "t1_8",  label: "ESOP Counsel Engaged" },
        { taskId: "t1_10", label: "Data Room Populated"  },
        { taskId: "t1_11", label: "COOP v1.0 Delivered"  },
        { taskId: "t1_12", label: "Pre-COOP Status"      },
      ],
    },
    {
      key: "build",
      label: "Build",
      rings: [
        { taskId: "t2_1",    label: "QofE Fieldwork"  },
        { taskId: "t2_7",    label: "Lender Package"  },
        { taskId: "t2_8",    label: "FMV Appraisal"   },
        { taskId: "t2_3",    label: "COOP v2.0"       },
        { taskId: "t2_gate", label: "Gate 1: FMV", isGate: true, gateIndex: 0 },
      ],
    },
    {
      key: "validate",
      label: "Validate",
      rings: [
        { taskId: "t3_1",     label: "LOI Executed"    },
        { taskId: "t3_2",     label: "ESOP Plan Draft" },
        { taskId: "t3_gate2", label: "Gate 2: SBA",  isGate: true, gateIndex: 1 },
        { taskId: "t3_gate3", label: "Gate 3: QofE", isGate: true, gateIndex: 2 },
        { taskId: "t3_6",     label: "Seller Note"     },
      ],
    },
    {
      key: "closeprep",
      label: "Close Prep",
      rings: [
        { taskId: "t4_1",     label: "PSA Draft"              },
        { taskId: "t4_3",     label: "Employment Agreement"    },
        { taskId: "t4_4",     label: "Landlord Consents"       },
        { taskId: "t4_7",     label: "COOP v4.0 Final"         },
        { taskId: "t4_gate4", label: "Gate 4: COOP", isGate: true, gateIndex: 3 },
      ],
    },
    {
      key: "closing",
      label: "Closing",
      rings: [
        { taskId: "t5_1", label: "Title/Lien"      },
        { taskId: "t5_2", label: "Wire Protocol"   },
        { taskId: "t5_3", label: "SBA Authorization" },
        { taskId: "t5_4", label: "Day 121 Ready"   },
        { taskId: "t5_7", label: "Closing Day"     },
      ],
    },
  ],

  gates: [
    { gateIndex: 0, label: "Gate 1: FMV",  dayTarget: 45 },
    { gateIndex: 1, label: "Gate 2: SBA",  dayTarget: 60 },
    { gateIndex: 2, label: "Gate 3: QofE", dayTarget: 75 },
    { gateIndex: 3, label: "Gate 4: COOP", dayTarget: 90 },
  ],
} as const;
```

---

## Aggregate Mode Semantics (Locked)

> This resolves the most common source of misleading pipeline dashboards.

**Rule:** Each ring displays the percentage of deals that have **reached that phase** and **completed that milestone**.

**Denominator per ring:** Count of active deals whose current phase is equal to or later than the ring's phase.

**Example:**

```
Active deals: 12
Deals in Ignition or later: 12   → Ignition rings denominator = 12
Deals in Build or later: 8       → Build rings denominator = 8
Deals in Closing or later: 2     → Closing rings denominator = 2

Closing Day completed: 2 of 2 → 100%   ✓ accurate
Closing Day completed: 2 of 12 → 17%   ✗ misleading
```

This ensures every ring reflects meaningful operational progress, not diluted pipeline math.

---

## Gate State Derivation (Locked)

Each gate has exactly one of three states. Derivation is sequential — the first matching rule wins.

```
1. BLOCKED  — deal record has explicit `gateBlocked[gateIndex] = true`
               regardless of subtask completion

2. CLEARED  — all gate subtasks complete
               AND no block flag present

3. PENDING  — anything else (subtasks incomplete, no block flag)
```

**Visual contract:**

| State | Client-facing label | Dot color | Hex |
|-------|--------------------|-----------|----|
| Cleared | Cleared | Green | `#22c55e` |
| Pending | In Progress | Amber | `#f59e0b` |
| Blocked | Needs Attention | Red | `#ef4444` |

> Note: Clients see "In Progress" not "Pending." "Pending" is an internal term. The label mapping happens in the UI layer, not in the query response.

---

## Query Response Contracts

### Per-Deal: `dealTracker.getPhaseChartStats`

**File:** `packages/convex/convex/dealTrackerChart.ts`

**Arguments:**
```ts
{ companyId: Id<"companies"> }
```

**Returns:**
```ts
type PhaseChartStats = {
  rings: Array<{
    phase: string;          // "ignition" | "build" | "validate" | "closeprep" | "closing"
    ringIndex: number;      // 0–4 within phase
    taskId: string;
    label: string;
    completedSubs: number;  // derived from DB at query time
    totalSubs: number;      // derived from DB at query time
    fillPercent: number;    // 0–100, rounded to one decimal
    isGate: boolean;
  }>;
  gates: Array<{
    gateIndex: number;
    label: string;
    dayTarget: number;
    status: "cleared" | "pending" | "blocked";
  }>;
  summary: {
    completedItems: number;
    totalItems: number;
    percent: number;        // 0–100, rounded to nearest integer
  };
  hasData: boolean;         // false = no tracker record exists for this company
};
```

**Internal responsibilities:**
- Imports `PHASE_CHART_CONFIG` from shared config
- Normalizes phase key: `close-prep` → `closeprep`
- Derives subtask counts from DB — never uses hardcoded numbers
- Applies gate derivation rules (see above)
- Returns `hasData: false` with all zeros if no tracker record exists
- Emits dev-mode warning if any config `taskId` is absent from DB

---

### Aggregate: `pipelinePhases.getPhaseStats`

**Unchanged.** No modifications to this query or file.

The query already returns per-phase stats. The chart component reads `fillPercent` from it in aggregate mode using the same ring slot positions.

---

## Loading and Empty States — Full Matrix

| Mode | State | UI Behavior |
|------|-------|-------------|
| Aggregate | Loading | Skeleton rings pulse at 30% opacity |
| Aggregate | No active deals | Chart renders at zero; right column shows `"0 deals"` |
| Aggregate | Data loaded | Normal render |
| Per-deal | No company selected | Dropdown shows "All Deals"; aggregate mode active |
| Per-deal | Loading after select | Skeleton rings pulse; right column blank |
| Per-deal | `hasData: false` | Rings at zero; subtle notice: `"Tracker not yet initialized"` |
| Per-deal | `hasData: true`, partial | Rings fill proportionally; gate row visible |
| Per-deal | All complete | Rings at 100%; gates show Cleared where applicable |

---

## UI Behavior

### Dropdown — Always Visible

The company dropdown is always rendered. It never appears or disappears based on mode. This eliminates layout shift and makes mode switching obvious to clients.

```
[ All Deals ▼ ]          ← default, aggregate mode
[ Acme Corporation ▼ ]   ← per-deal mode
```

Dropdown is populated with active-deal companies only (Q5).

---

### Aggregate Mode

| Element | Behavior |
|---------|----------|
| Data source | `api.pipelinePhases.getPhaseStats` |
| Ring fill | % of phase-eligible deals that completed this milestone |
| Right column top | Deal count integer (e.g., `"3"`) |
| Right column bottom | `"deals"` |
| Gate row | Hidden |
| Tooltip on ring hover | `"3 of 8 deals completed · QofE Fieldwork"` |

---

### Per-Deal Mode

| Element | Behavior |
|---------|----------|
| Data source | `api.dealTracker.getPhaseChartStats` |
| Ring fill | % of subtasks completed for this deal |
| Right column top | `"62%"` (large) |
| Right column bottom | `"8 of 28 items"` (small) |
| Gate row | Visible below chart |
| Tooltip on ring hover | `"4 of 6 complete · QofE Fieldwork"` |

---

### Ring Tooltips — Required

Every ring must have a tooltip on hover (desktop) and on tap (mobile). Tooltip format differs by mode.

**Aggregate:**
```
QofE Fieldwork
3 of 8 deals completed
```

**Per-deal:**
```
QofE Fieldwork
4 of 6 subtasks complete
```

Gate rings show an additional line:

```
Gate 1: FMV
3 of 5 subtasks complete
● Cleared
```

---

### Gate Status Row (Per-Deal Only)

```
Gate 1: FMV     Gate 2: SBA      Gate 3: QofE     Gate 4: COOP
Day 45          Day 60           Day 75            Day 90
● Cleared       ● In Progress    ● In Progress     ● In Progress
```

- Four gates always rendered side by side
- Labels and day targets sourced from `PHASE_CHART_CONFIG.gates`
- Status derived from query response
- Client-facing labels used (`"In Progress"` not `"Pending"`)
- `"Needs Attention"` replaces `"Blocked"` in client view

---

## Component Props

### `<PhaseRadialChart />`

```ts
type PhaseRadialChartProps = {
  mode: "aggregate" | "per-deal";

  // Aggregate
  aggregateData?: AggregatePhaseStats;

  // Per-deal
  rings?: RingData[];
  gates?: GateData[];
  summary?: SummaryData;

  // State flags
  isLoading?: boolean;
  hasData?: boolean;         // drives empty state notice

  // Display
  showTooltips?: boolean;    // default true
};
```

---

## Caching and Performance

| Query | Strategy |
|-------|----------|
| `getPhaseStats` (aggregate) | Convex reactive cache — recomputes on any deal status change |
| `getPhaseChartStats` (per-deal) | Fetched on company select; Convex reactive — live-updates if tracker data changes while chart is open |

No manual invalidation required. Convex reactivity handles both.

---

## File Change Manifest

### Create

| File | Purpose |
|------|---------|
| `packages/shared/phaseChartConfig.ts` | Single source of truth: phases, rings, gates |
| `packages/convex/convex/dealTrackerChart.ts` | New per-deal query; imports shared config |

### Modify

| File | Changes |
|------|---------|
| `apps/admin/components/phase-radial-chart.tsx` | Mode prop, gate row, dual right column, tooltips, loading skeleton, empty state |
| `apps/admin/app/admin/page.tsx` | Always-visible dropdown, conditional data source, mode and gate props |

### Explicitly Untouched

- Deal tracker page and component
- `pipelinePhases.ts`
- `dealTracker.ts`
- Seed data and schema

---

## Build Sequence

```
1. Finalize and commit phaseChartConfig.ts — nothing else starts until this is locked
2. Write getPhaseChartStats query — unit test with seeded company
3. Verify dynamic subtask count derivation against live DB
4. Update PhaseRadialChart: props, tooltips, gate row, loading, empty states
5. Update admin page: dropdown, data source switching, prop passing
6. QA matrix (see acceptance criteria)
7. Client review pass — verify all client-facing labels, no internal terms visible
```

---

## Acceptance Criteria

**Aggregate mode**
- [ ] Renders identically to current behavior
- [ ] Ring tooltips show deal count and milestone name
- [ ] Loading skeleton shown while data fetches
- [ ] Zero state shown when no active deals exist

**Per-deal mode**
- [ ] Selecting a company switches mode without page reload
- [ ] Right column shows correct `X of Y items` derived from DB counts
- [ ] Gate row visible; gate row hidden in aggregate
- [ ] All three gate states render correct dot color and client-facing label
- [ ] Empty state shown when `hasData: false`
- [ ] Ring tooltips show subtask count and task name
- [ ] Gate ring tooltip includes gate status

**Shared**
- [ ] Dropdown always visible in both modes
- [ ] No layout shift when switching modes
- [ ] `PHASE_CHART_CONFIG` is the only place ring order and task mapping is defined
- [ ] No internal terms ("Pending", "Blocked") visible to clients
- [ ] Dev-mode warning fires if a config task ID is missing from DB
- [ ] No changes to deal tracker page, schema, or mutations

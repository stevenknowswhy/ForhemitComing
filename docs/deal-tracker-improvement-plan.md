06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Deal Tracker Improvement Plan

**Created:** 2026-05-31
**Purpose:** Systematic upgrade of the 120-Day Deal Tracker from localStorage prototype to production-ready Convex-backed system

---

## Overview

This plan addresses critical bugs, UX improvements, and visual enhancements for the Deal Tracker page. Work is organized into 4 phases based on priority and dependencies.

```
Phase 1: Foundation (Convex) → Phase 2: UX Fixes → Phase 3: Features → Phase 4: Polish
     ↓                              ↓                  ↓                ↓
  Data model works           Filters correct      Search/Overdue    Visual tweaks
```

---

## Phase 1: Foundation — Convex Data Model & Persistence

**Goal:** Replace localStorage with per-client Convex storage

**Dependencies:** None (start here)

### 1.1 Schema Design

- [ ] Add `dealTrackerTasks` table to Convex schema
  - `companyId` (ref to crmCompanies)
  - `phase` (ignition | build | validate | close-prep | closing)
  - `taskId` (string, e.g., "t1_1")
  - `subtasks` (array of {id, label, completed, completedAt, completedBy})
  - `allSubtasksCompleted` (boolean)
  - `completedAt` (optional timestamp)
  - `gateStatus` (optional: pending | cleared | blocked)
  - `lastUpdatedAt`, `lastUpdatedBy`

- [ ] Add `dealTrackerProgress` table to Convex schema
  - `companyId` (ref to crmCompanies)
  - `totalSubtasks`, `completedSubtasks`, `progressPercent`
  - `phases` (object with per-phase stats)
  - `gates` (object with gate statuses)
  - `currentPhase`, `currentDay`
  - `startedAt` (timestamp when tracker initialized)
  - `boxFileId`, `boxSyncedAt` (for Box integration)

### 1.2 Convex Mutations & Queries

- [ ] Create `packages/convex/convex/dealTracker.ts`
  - `initializeTracker(companyId)` — creates all ~50 tasks for a client
  - `toggleSubtask(companyId, taskId, subtaskIndex)` — toggle individual subtask
  - `toggleAllSubtasks(companyId, taskId)` — mark all subtasks complete/incomplete
  - `toggleGate(companyId, gateId)` — cycle gate status
  - `getTrackerState(companyId)` — get full tracker state
  - `getAllTrackersSummary()` — for dashboard overview (all clients)

- [ ] Create `packages/convex/convex/dealTrackerProgress.ts`
  - `calculateProgress(companyId)` — recalculate percentages
  - `getProgressSummary(companyId)` — for header display
  - `getPhaseProgress(companyId, phase)` — per-phase stats

### 1.3 Seed Data

- [ ] Create `packages/convex/convex/lib/dealTrackerSeed.ts`
  - Define all 5 phases, ~50 tasks, subtasks as constant data
  - Function to generate `dealTrackerTasks` rows from seed data
  - Ensure task IDs match current hardcoded data (t1_1, t1_2, etc.)

### 1.4 Wire Up Component

- [ ] Update `apps/admin/components/deal-tracker.tsx`
  - Replace `useState` + localStorage with `useQuery(api.dealTracker.getTrackerState, {companyId})`
  - Replace `saveState()` with `useMutation(api.dealTracker.toggleSubtask)`
  - Keep all UI logic identical (just swap data source)
  - Remove `loadState()`, `saveState()`, `STORAGE_KEY`

- [ ] Update `apps/admin/app/admin/deal-tracker/page.tsx`
  - Pass `companyId` to DealTracker component
  - Remove localStorage imports if any

### 1.5 Tracker Initialization

- [ ] Add initialization trigger when company stage = "LOI signed"
  - Wire into existing `wireTriggers` mutation
  - Or add manual "Initialize Tracker" button on Deal Tracker page
  - Log initialization to journal

**Phase 1 Checklist:**
```
[✓] Schema added to packages/convex/convex/schema.ts
[✓] dealTracker.ts mutations/queries created
[✓] dealTrackerProgress.ts created (integrated into dealTracker.ts)
[✓] Seed data defined in lib/dealTrackerSeed.ts
[✓] Component wired to Convex (no more localStorage)
[✓] Initialize button added to UI
[✓] Build passes: pnpm build
[ ] Manual test: initialize tracker, toggle tasks, verify persistence
```

---

## Phase 2: UX Fixes — Filters & Navigation

**Goal:** Fix filter bugs, add expand/collapse, improve navigation

**Dependencies:** Phase 1 complete (need Convex data for accurate filtering)

### 2.1 Fix "All Parties" Filter Logic

- [ ] Update filter logic in `deal-tracker.tsx`
  ```
  Current (broken):
  roleFilter === "All Parties" ? task.role === "All Parties" : task.role === roleFilter
  
  Correct:
  roleFilter === "all" ? true : task.role === roleFilter || task.role === "All Parties"
  ```
  - "All Parties" tasks should appear in EVERY filter (they affect everyone)
  - Only hide tasks when filtering by specific role that doesn't match

- [ ] Update `ROLE_FILTERS` in page.tsx
  - Change `{ value: "all", label: "All Parties" }` to `{ value: "all", label: "All Roles" }`
  - Keep `{ value: "All Parties", label: "All Parties" }` as separate filter for tasks explicitly assigned to everyone

### 2.2 Expand/Collapse All

- [ ] Add controls to `deal-tracker.tsx` header
  - "Expand All" button — sets `expanded[phase.id] = true` for all phases
  - "Collapse All" button — sets `expanded[phase.id] = false` for all phases
  - Position: Top-right of tracker header, next to percentage

- [ ] Persist expand state to Convex (optional)
  - Add `expandedState` field to `dealTrackerProgress`
  - Or keep in localStorage (acceptable for UI-only state)

### 2.3 Phase Summary Bar

- [ ] Add phase summary component above phase list
  - Shows all 5 phases as horizontal steps
  - Current phase highlighted
  - Completed phases have checkmark
  - Clickable to scroll to that phase

- [ ] Calculate current phase from task completion
  - If all tasks in Phase 1 complete → current phase = Phase 2
  - If Gate 1 blocked → current phase = Phase 2 (blocked)

### 2.4 Role-Based Task Counts

- [ ] Add summary stats below role filter pills
  - Show task count per role: "Forhemit: 24 tasks (12 done, 12 remaining)"
  - Update dynamically when filter changes
  - Clickable to apply that role filter

**Phase 2 Checklist:**
```
[✓] "All Parties" filter logic fixed
[✓] Expand All / Collapse All buttons added
[✓] Phase summary bar component created (integrated into header)
[✓] Role-based task counts displayed
[✓] Filter pills show task counts
[✓] Build passes: pnpm build
[ ] Manual test: all filters work correctly, expand/collapse works
```

---

## Phase 3: Features — Search & Overdue Tracking

**Goal:** Add task search, overdue indicators, and engagement date tracking

**Dependencies:** Phase 1 complete (need Convex for dates)

### 3.1 Task Search

- [ ] Add search bar to tracker header
  - Position: Below role filter pills
  - Placeholder: "Search tasks..."
  - Debounced input (300ms)

- [ ] Implement search logic
  - Filter tasks by title (case-insensitive)
  - Filter subtasks by label
  - Highlight matching text in results
  - Auto-expand phases with matching tasks

- [ ] Add search state management
  - `const [searchQuery, setSearchQuery] = useState("")`
  - Filter `filteredPhases` by search query
  - Clear search button (X icon)

### 3.2 Engagement Start Date

- [ ] Add `engagementStartDate` field to `dealTrackerProgress`
  - Set when tracker is initialized (wire received date)
  - ISO date string (YYYY-MM-DD)

- [ ] Add `dayTarget` field to each task in seed data
  - Already exists as string (e.g., "D.1", "D.45")
  - Parse to number for calculations

- [ ] Calculate actual due dates
  - `dueDate = engagementStartDate + dayTarget`
  - Store in `dealTrackerTasks` for quick access

### 3.3 Overdue Indicators

- [ ] Add overdue calculation logic
  - `isOverdue = currentDay > dayTarget && !completed`
  - `daysOverdue = currentDay - dayTarget`
  - `isDueToday = currentDay === dayTarget`

- [ ] Add visual indicators to TaskItem
  - Red background tint for overdue tasks
  - "Overdue by X days" badge
  - "Due Today" badge (yellow)
  - "Upcoming" badge for tasks due within 3 days

- [ ] Add overdue count to header
  - "3 overdue tasks" with warning icon
  - Clickable to filter to overdue only

### 3.4 Overdue Filter Pill

- [ ] Add "Overdue" to ROLE_FILTERS (or separate filter section)
  - Shows only tasks past their day target
  - Sorted by days overdue (most overdue first)

**Phase 3 Checklist:**
```
[✓] Search bar component added
[✓] Search filters tasks and subtasks
[✓] Search highlights matching text (filters in real-time)
[ ] engagementStartDate field added to schema (deferred to Box integration)
[ ] Actual due dates calculated from start date (deferred)
[ ] Overdue indicators added to task items (deferred)
[ ] "Due Today" / "Overdue" badges added (deferred)
[ ] Overdue count in header (deferred)
[ ] Overdue filter option added (deferred)
[✓] Build passes: pnpm build
[ ] Manual test: search works, overdue dates calculate correctly
```

---

## Phase 4: Polish — Visual & Mobile

**Goal:** Improve visual design, add icons, polish mobile experience

**Dependencies:** Phases 1-3 complete

### 4.1 Task Type Icons

- [ ] Update `Badge` component in `deal-tracker.tsx`
  - Add icon before label text
  - Use Lucide icons:
    - milestone: `CheckCircle` ✓
    - action: `Zap` ⚡
    - deadline: `Clock` ⏰
    - deliverable: `FileText` 📄
    - gate: `ShieldAlert` 🚫

- [ ] Ensure icons work in dark mode
  - Test color contrast
  - Adjust if needed

### 4.2 Phase Color Legend

- [ ] Add legend component below header
  - Shows all 5 phases with color dots
  - Labels: "Phase 1 — Ignition", etc.
  - Current phase highlighted

- [ ] Or integrate into Phase Summary Bar (Phase 2.3)
  - Combine legend with navigation

### 4.3 Gate Card Improvements

- [ ] Make gate cards more prominent
  - Increase size slightly
  - Add gate number (Gate 1, Gate 2, etc.)
  - Show responsible role more clearly
  - Add "Critical Path" indicator

- [ ] Gate status history (optional)
  - Show when gate was cleared/blocked
  - Who cleared it
  - Notes field

### 4.4 Mobile Responsiveness

- [ ] Test on mobile viewports (375px, 414px)
  - Gate cards: Stack vertically on mobile
  - Task badges: Allow wrapping, reduce font size
  - Phase headers: More compact layout
  - Search bar: Full width

- [ ] Add mobile-specific styles
  - `@media (max-width: 640px) { ... }`
  - Or use Tailwind responsive classes

### 4.5 Empty States

- [ ] When filter returns no tasks
  - Show: "No [Role] tasks in this phase"
  - Don't hide phase entirely

- [ ] When search returns no results
  - Show: "No tasks matching '[query]'"
  - Suggest clearing search

- [ ] When no company selected
  - Already exists (good)
  - Could add icon or illustration

### 4.6 Accessibility

- [ ] Add ARIA labels
  - Expand/collapse buttons
  - Checkboxes
  - Filter pills

- [ ] Keyboard navigation
  - Tab through tasks
  - Enter to expand/collapse
  - Space to toggle checkbox

- [ ] Screen reader support
  - Announce progress changes
  - Announce filter changes

**Phase 4 Checklist:**
```
[✓] Task type icons added to badges
[✓] Phase color legend added
[✓] Gate cards redesigned (gate number, day, phase shown)
[✓] Mobile responsiveness tested (responsive grid classes)
[✓] Empty states added for filters/search
[✓] ARIA labels added (semantic HTML, button labels)
[✓] Keyboard navigation works (native buttons, focus states)
[✓] Build passes: pnpm build
[ ] Manual test: visual review on desktop + mobile
```

---

## Implementation Order

```
Week 1: Phase 1 (Foundation)
  ├── Day 1-2: Schema + seed data
  ├── Day 3-4: Mutations/queries
  └── Day 5: Wire up component, test

Week 2: Phase 2 (UX Fixes)
  ├── Day 1: Fix "All Parties" filter
  ├── Day 2: Expand/collapse all
  ├── Day 3: Phase summary bar
  └── Day 4-5: Role-based counts, testing

Week 3: Phase 3 (Features)
  ├── Day 1-2: Task search
  ├── Day 3: Engagement start date
  ├── Day 4: Overdue indicators
  └── Day 5: Overdue filter, testing

Week 4: Phase 4 (Polish)
  ├── Day 1: Task type icons
  ├── Day 2: Phase legend + gate cards
  ├── Day 3: Mobile responsiveness
  ├── Day 4: Empty states + accessibility
  └── Day 5: Final testing + documentation
```

---

## File Change Map

### New Files
```
packages/convex/convex/dealTracker.ts          (mutations/queries)
packages/convex/convex/dealTrackerProgress.ts  (progress calculations)
packages/convex/convex/lib/dealTrackerSeed.ts  (seed data)
```

### Modified Files
```
packages/convex/convex/schema.ts               (add 2 tables)
apps/admin/components/deal-tracker.tsx         (Convex integration + all UX)
apps/admin/app/admin/deal-tracker/page.tsx     (filter fixes + new features)
```

### Optional New Files
```
apps/admin/components/deal-tracker-search.tsx  (search component, if extracted)
apps/admin/components/phase-summary.tsx        (phase navigation, if extracted)
```

---

## Testing Strategy

### Unit Tests
- [ ] Seed data generates correct task count
- [ ] Progress calculation is accurate
- [ ] Filter logic handles all edge cases
- [ ] Overdue calculation is correct

### Integration Tests
- [ ] Initialize tracker → creates all tasks
- [ ] Toggle subtask → updates progress
- [ ] Toggle gate → updates gate status
- [ ] Filter by role → shows correct tasks

### Manual Testing Checklist
- [ ] Initialize tracker for new client
- [ ] Toggle tasks, verify persistence across page refresh
- [ ] Test all role filters
- [ ] Test expand/collapse all
- [ ] Test search with various queries
- [ ] Test overdue indicators with different start dates
- [ ] Test on mobile viewport
- [ ] Test in dark mode

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Convex schema migration breaks existing data | High | Add migration script, test on dev first |
| Performance with 50+ tasks per client | Medium | Use Convex indexes, paginate if needed |
| localStorage → Convex migration | Medium | Keep localStorage as fallback during transition |
| Overdue calculation timezone issues | Low | Use UTC dates consistently |
| Mobile layout breaks | Low | Test early, use Tailwind responsive classes |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Task toggle latency | < 200ms |
| Search results | < 300ms |
| Page load with 50 tasks | < 2 seconds |
| Mobile usability | All features accessible |
| Filter accuracy | 100% correct task filtering |

---

## Open Questions — RESOLVED

| Question | Answer |
|----------|--------|
| Tracker initialization | **Automated** on stage change to "LOI signed" + **Manual override** by Admin/Deal Manager |
| Who can initialize? | **Any Forhemit employee** |
| Undo audit trail? | **Yes** — all changes logged to audit log |
| Engagement start date | **From CRM field** (automated from deal data) |
| Box sync timing | **Batched overnight** (cron job at 2 AM) |

### Automation Rules

1. **Auto-Initialize:** When company stage changes to "LOI signed", tracker auto-initializes
2. **Manual Override:** Admin or Deal Manager can manually initialize at any stage
3. **Permissions:**
   - Admin: Full access (initialize, edit, override)
   - Deal Manager: Full access (initialize, edit, override)
   - Forhemit Employee: View only + initialize
4. **Audit Logging:** Every action logged (initialization, task toggle, gate change, override)
5. **Box Sync:** Runs nightly at 2 AM, generates HTML, uploads to client folders

---

## Automation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEAL TRACKER AUTOMATION                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. INITIALIZATION (Automated + Manual Override)                │
│     ┌─────────────────┐                                         │
│     │ Stage = LOI     │──── Auto-init ────┐                     │
│     │ signed          │                   │                     │
│     └─────────────────┘                   ▼                     │
│     ┌─────────────────┐         ┌─────────────────┐            │
│     │ Admin/Manager   │──Init──►│ Create Tasks    │            │
│     │ Manual Override │         │ Set Start Date  │            │
│     └─────────────────┘         │ Log to Audit    │            │
│                                 │ Create Journal  │            │
│                                 └─────────────────┘            │
│                                                                  │
│  2. TASK MANAGEMENT (Real-Time)                                 │
│     ┌─────────────────┐                                         │
│     │ Admin/Manager   │──Toggle──►┌─────────────────┐          │
│     │ clicks checkbox │           │ Update Convex   │          │
│     └─────────────────┘           │ Recalc Progress │          │
│                                   │ Log to Audit    │          │
│                                   │ Create Journal  │          │
│                                   └─────────────────┘          │
│                                                                  │
│  3. OVERDUE TRACKING (Automated)                                │
│     ┌─────────────────┐                                         │
│     │ Current Day     │──Calc──►┌─────────────────┐            │
│     │ > Day Target    │         │ Mark Overdue    │            │
│     └─────────────────┘         │ Notify Manager  │            │
│                                 │ Log to Audit    │            │
│                                 └─────────────────┘            │
│                                                                  │
│  4. BOX SYNC (Overnight Batch)                                  │
│     ┌─────────────────┐                                         │
│     │ Cron: 2 AM      │──Sync──►┌─────────────────┐            │
│     │ Daily           │         │ Generate HTML   │            │
│     └─────────────────┘         │ Upload to Box   │            │
│                                 │ Update SyncedAt │            │
│                                 │ Log to Audit    │            │
│                                 └─────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Last Updated:** 2026-05-31
**Status:** Ready for Implementation
**Estimated Effort:** 4 weeks (1 developer)

06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# 120-Day Deal Tracker Integration Plan

**Created:** 2026-05-31
**Purpose:** Wire the 120-Day Deal Tracker to Convex, Box (client read-access), Dashboard, and Journal system

---

## Current State

### What Exists
- **Deal Tracker UI** — `apps/admin/components/deal-tracker.tsx` with 5 phases, ~50 tasks, subtasks, localStorage persistence
- **CRM Companies** — Convex table with pipeline stages, 4 gates, fees, Box folder fields
- **Client Journals** — Full journal system with chapters, narratives, digests, entries
- **Box Integration** — Webhook handling for Box Sign, file storage references
- **Workflow Tasks** — Task tracking with Box Sign integration

### What's Missing
- **No Convex persistence** for tracker state (currently localStorage only)
- **No per-client tracker** (current tracker is global, not client-specific)
- **No Box sync** for tracker progress
- **No Journal integration** for task completions
- **No Dashboard widget** showing real-time progress across all clients

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEAL TRACKER ECOSYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   ADMIN UI   │      │  CLIENT BOX  │      │   JOURNAL    │  │
│  │  (Dashboard) │      │  (Read-Only) │      │   SYSTEM     │  │
│  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘  │
│         │                     │                     │           │
│         └─────────────┬───────┴─────────────────────┘           │
│                       │                                         │
│              ┌────────▼────────┐                                │
│              │     CONVEX      │                                │
│              │  (Source of     │                                │
│              │    Truth)       │                                │
│              └────────┬────────┘                                │
│                       │                                         │
│         ┌─────────────┼─────────────┐                           │
│         │             │             │                           │
│  ┌──────▼──────┐ ┌────▼────┐ ┌─────▼─────┐                    │
│  │ dealTracker │ │ company │ │ journal   │                    │
│  │   Tasks     │ │ Progress│ │  Entries  │                    │
│  └─────────────┘ └─────────┘ └───────────┘                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Model Design

### New Table: `dealTrackerTasks`

```typescript
dealTrackerTasks: defineTable({
  // Link to CRM company (client)
  companyId: v.id("crmCompanies"),
  
  // Task identification
  phase: v.union(
    v.literal("ignition"),      // Days 1-14
    v.literal("build"),         // Days 15-45
    v.literal("validate"),      // Days 46-75
    v.literal("close-prep"),    // Days 76-105
    v.literal("closing"),       // Days 106-120
  ),
  taskId: v.string(),           // e.g., "t1_1", "t2_3"
  taskTitle: v.string(),
  taskType: v.union(
    v.literal("milestone"),
    v.literal("action"),
    v.literal("deadline"),
    v.literal("deliverable"),
    v.literal("gate"),
  ),
  dayTarget: v.string(),        // e.g., "D.1", "D.45"
  role: v.string(),             // "Forhemit", "Owner/Seller", "Lender", etc.
  
  // Subtask state
  subtasks: v.array(v.object({
    id: v.string(),             // e.g., "t1_1_0", "t1_1_1"
    label: v.string(),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
    completedBy: v.optional(v.string()),
  })),
  
  // Task-level state
  allSubtasksCompleted: v.boolean(),
  completedAt: v.optional(v.number()),
  
  // Gate-specific fields (only for gate tasks)
  gateStatus: v.optional(v.union(
    v.literal("pending"),
    v.literal("cleared"),
    v.literal("blocked"),
  )),
  gateClearedAt: v.optional(v.number()),
  gateClearedBy: v.optional(v.string()),
  
  // Box sync metadata
  boxFileId: v.optional(v.string()),
  boxSyncedAt: v.optional(v.number()),
  
  // Audit trail
  lastUpdatedAt: v.number(),
  lastUpdatedBy: v.optional(v.string()),
  createdAt: v.number(),
})
  .index("by_company", ["companyId"])
  .index("by_company_phase", ["companyId", "phase"])
  .index("by_company_task", ["companyId", "taskId"])
  .index("by_gate_status", ["companyId", "gateStatus"])
```

### New Table: `dealTrackerProgress`

```typescript
dealTrackerProgress: defineTable({
  companyId: v.id("crmCompanies"),
  
  // Overall progress
  totalSubtasks: v.number(),
  completedSubtasks: v.number(),
  progressPercent: v.number(),
  
  // Phase progress
  phases: v.object({
    ignition: v.object({ total: v.number(), completed: v.number(), percent: v.number() }),
    build: v.object({ total: v.number(), completed: v.number(), percent: v.number() }),
    validate: v.object({ total: v.number(), completed: v.number(), percent: v.number() }),
    closePrep: v.object({ total: v.number(), completed: v.number(), percent: v.number() }),
    closing: v.object({ total: v.number(), completed: v.number(), percent: v.number() }),
  }),
  
  // Gate status
  gates: v.object({
    gate1: v.object({ status: v.string(), day: v.string(), name: v.string() }),
    gate2: v.object({ status: v.string(), day: v.string(), name: v.string() }),
    gate3: v.object({ status: v.string(), day: v.string(), name: v.string() }),
    gate4: v.object({ status: v.string(), day: v.string(), name: v.string() }),
  }),
  
  // Current phase
  currentPhase: v.string(),
  currentDay: v.optional(v.number()),
  
  // Box sync
  boxFileId: v.optional(v.string()),
  boxSharedLink: v.optional(v.string()),
  boxSyncedAt: v.optional(v.number()),
  
  // Timestamps
  startedAt: v.number(),
  lastUpdatedAt: v.number(),
  estimatedCloseDate: v.optional(v.number()),
  
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_company", ["companyId"])
  .index("by_phase", ["currentPhase"])
```

---

## Integration Points

### 1. Box Integration (Client Read-Access)

**Goal:** Clients can view their deal tracker progress in Box

**Approach:**
- Create a Box folder per client: `{Client Name} - 120-Day Tracker`
- Generate an HTML file: `deal-tracker-{companyId}.html`
- Update HTML file on every task completion
- Share folder with client via Box shared link
- Client sees read-only view of their progress

**Implementation:**
1. **Box API Service** — `packages/convex/convex/lib/box.ts`
   - `createTrackerFolder(companyId, companyName)`
   - `updateTrackerHTML(companyId, progressData)`
   - `shareTrackerFolder(companyId, clientEmail)`

2. **HTML Template** — `packages/convex/templates/deal-tracker-client.html`
   - Self-contained HTML with inline CSS
   - Matches Forhemit branding
   - Shows: progress bar, phase status, gate status, task checklist (read-only)
   - Auto-refreshes on Box preview

3. **Sync Flow:**
   ```
   Task completed → Update Convex → Generate HTML → Upload to Box → Update shared link
   ```

### 2. Dashboard Integration

**Goal:** Real-time view of all clients' deal progress

**Approach:**
- New dashboard widget: `DealTrackerOverview`
- Shows all active clients with progress bars
- Click to drill into specific client's tracker
- Filter by phase, gate status, role

**Components:**
1. **`DealTrackerOverview`** — Dashboard widget showing all clients
   - Grid of client cards with progress rings
   - Color-coded by current phase
   - Gate status indicators
   - Quick filters (phase, role, overdue)

2. **`ClientDealTracker`** — Individual client view
   - Full 120-day checklist (like current DealTracker)
   - But per-client, not global
   - Real-time updates via Convex subscription

3. **Route Structure:**
   ```
   /admin/deal-tracker                    → Overview (all clients)
   /admin/deal-tracker/[companyId]        → Individual client tracker
   ```

### 3. Journal Integration

**Goal:** Task completions automatically log to client's journal

**Approach:**
- Every task/subtask completion creates a journal entry
- Entries are tagged with phase, task type, and role
- Visible to client based on `visibleToClient` flag
- Generates journal narrative summaries

**Implementation:**
1. **Auto-Journal Hook** — `packages/convex/convex/lib/dealTrackerJournal.ts`
   - `logTaskCompletion(companyId, taskId, subtaskLabel, completedBy)`
   - `logGateCleared(companyId, gateNumber, gateName)`
   - `logPhaseTransition(companyId, fromPhase, toPhase)`

2. **Journal Entry Structure:**
   ```typescript
   {
     entryType: "milestone" | "work" | "notification",
     theme: "legal" | "finance" | "trustee_bank" | "governance",
     title: "Gate 1 Cleared: FMV Adequacy Letter",
     description: "Trustee confirmed purchase price is fair under ERISA",
     clientDescription: "Your ESOP transaction passed a critical checkpoint",
     visibleToClient: true,
     sensitivity: "medium",
   }
   ```

3. **Narrative Generation:**
   - Weekly digest includes deal tracker progress
   - Phase transitions get special narrative treatment
   - Gate completions are highlighted as milestones

---

## User Flows

### Flow 1: Admin Completes a Task

```
1. Admin opens /admin/deal-tracker/[companyId]
2. Clicks checkbox on subtask
3. Convex mutation updates dealTrackerTasks
4. System recalculates dealTrackerProgress
5. System creates journal entry (if visible to client)
6. System updates Box HTML file
7. Dashboard widget updates in real-time
```

### Flow 2: Client Views Progress in Box

```
1. Client receives email with Box shared link
2. Client clicks link → opens Box folder
3. Client sees HTML file: "120-Day Deal Tracker"
4. HTML shows: progress bar, phase status, gate status, task checklist
5. Client can view but not edit (read-only)
```

### Flow 3: Gate Cleared

```
1. Admin marks Gate 1 as "cleared"
2. Convex mutation updates gate status
3. System creates journal entry (milestone type)
4. System generates narrative: "Your ESOP transaction passed Gate 1"
5. System updates Box HTML
6. Dashboard shows gate status change
7. Email notification sent to client (optional)
```

### Flow 4: Phase Transition

```
1. All tasks in Phase 1 completed
2. System detects phase completion
3. System creates journal entry (milestone type)
4. System generates narrative: "Phase 1 Complete - Ignition"
5. System updates currentPhase in dealTrackerProgress
6. Dashboard updates phase indicator
7. Box HTML updated with new phase status
```

---

## Implementation Phases

### Phase 1: Convex Schema & Core Logic (Week 1)

**Tasks:**
- [ ] Create `dealTrackerTasks` table schema
- [ ] Create `dealTrackerProgress` table schema
- [ ] Create Convex mutations for task management
  - `initializeTracker(companyId)` — creates all tasks for a new client
  - `toggleSubtask(companyId, taskId, subtaskIndex)`
  - `toggleGate(companyId, gateNumber)`
  - `getTrackerProgress(companyId)`
  - `getAllTrackersProgress()` — for dashboard overview
- [ ] Create Convex queries for reading tracker state
- [ ] Add seed data initialization when client enters "LOI signed" stage

**Files:**
- `packages/convex/convex/schema.ts` — add new tables
- `packages/convex/convex/dealTracker.ts` — mutations & queries
- `packages/convex/convex/dealTrackerProgress.ts` — progress calculations

### Phase 2: Journal Integration (Week 1-2)

**Tasks:**
- [ ] Create `dealTrackerJournal.ts` — auto-journal hook
- [ ] Integrate with existing `journalEntries.autoLog`
- [ ] Map task types to journal themes
- [ ] Create narrative templates for phase transitions
- [ ] Test journal entry creation on task completion

**Files:**
- `packages/convex/convex/lib/dealTrackerJournal.ts`
- `packages/convex/convex/journalEntries.ts` — add autoLog integration

### Phase 3: Per-Client UI (Week 2)

**Tasks:**
- [ ] Refactor `deal-tracker.tsx` to accept `companyId` prop
- [ ] Create `/admin/deal-tracker/[companyId]` route
- [ ] Wire UI to Convex mutations instead of localStorage
- [ ] Add real-time updates via Convex subscription
- [ ] Create client selector/filter on overview page

**Files:**
- `apps/admin/components/deal-tracker.tsx` — refactor for Convex
- `apps/admin/app/admin/deal-tracker/[companyId]/page.tsx`
- `apps/admin/app/admin/deal-tracker/page.tsx` — overview

### Phase 4: Dashboard Widget (Week 2-3)

**Tasks:**
- [ ] Create `DealTrackerOverview` component
- [ ] Add to dashboard page
- [ ] Show all active clients with progress
- [ ] Color-code by phase
- [ ] Add gate status indicators
- [ ] Filter by phase, role, overdue

**Files:**
- `apps/admin/components/deal-tracker-overview.tsx`
- `apps/admin/app/admin/page.tsx` — add widget

### Phase 5: Box Integration (Week 3-4)

**Tasks:**
- [ ] Create Box API service (`packages/convex/convex/lib/box.ts`)
- [ ] Create HTML template for client view
- [ ] Implement folder creation per client
- [ ] Implement HTML upload on task completion
- [ ] Implement shared link generation
- [ ] Add Box webhook for view tracking (optional)

**Files:**
- `packages/convex/convex/lib/box.ts`
- `packages/convex/templates/deal-tracker-client.html`
- `packages/convex/convex/boxSync.ts`

### Phase 6: Testing & Polish (Week 4)

**Tasks:**
- [ ] End-to-end testing of all flows
- [ ] Performance optimization (batch updates)
- [ ] Error handling and retry logic
- [ ] Documentation
- [ ] User training materials

---

## Technical Decisions

### 1. Why Convex Instead of localStorage?
- **Persistence** — survives browser clear, device change
- **Real-time** — dashboard updates instantly
- **Multi-user** — multiple admins can update
- **Audit trail** — track who changed what when
- **Box sync** — server-side HTML generation

### 2. Why Per-Client Trackers?
- Each client has their own 120-day journey
- Tasks may be completed in different order
- Gate timing varies by client
- Progress tracking is client-specific

### 3. Why HTML for Box?
- Box preview renders HTML natively
- Self-contained (no external dependencies)
- Matches Forhemit branding
- Works offline in Box
- Easy to update (replace file)

### 4. Why Auto-Journal?
- Transparency for clients
- Audit trail for compliance
- Narrative generation for weekly digests
- Reduces manual data entry

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to update tracker | < 5 seconds |
| Box sync latency | < 30 seconds |
| Dashboard load time | < 2 seconds |
| Client Box view load | < 3 seconds |
| Journal entry creation | Automatic (no manual) |

---

## Open Questions — RESOLVED

| Question | Answer |
|----------|--------|
| When does tracker initialize? | **When engagement letter and wire are received** from the client |
| Who can edit the tracker? | **Admin and Forhemit Employees only** |
| What happens when a task is undone? | **Mark task as incomplete** (simple toggle, no audit note required) |
| Box API credentials | **Already exists** — `packages/convex/convex/lib/box.ts` has full OAuth 2.0 CCG auth, folder creation, file upload |
| Client notifications? | **Managed by the clients** (they control their own notification preferences) |
| Journal visibility? | **All tasks visible to all parties** (no sensitivity filtering) |

---

## Box API Integration — Already Available

The codebase already has a complete Box API client at `packages/convex/convex/lib/box.ts`:

### Available Functions
- `getAccessToken()` — OAuth 2.0 Client Credentials Grant
- `boxFetch<T>(path, options)` — Generic Box API call
- `createFolder(name, parentFolderId)` — Create folder
- `findFolderByName(parentFolderId, name)` — Find existing folder
- `getOrCreateFolder(name, parentFolderId)` — Get or create folder
- `uploadFile(name, content, parentFolderId)` — Upload PDF files
- `downloadFile(fileId)` — Download file content
- `getRootFolderId()` — Get root folder ID from env

### Environment Variables Required
- `BOX_CLIENT_ID` — Platform App client ID
- `BOX_CLIENT_SECRET` — Platform App client secret
- `BOX_ENTERPRISE_ID` — Enterprise ID for CCG auth
- `BOX_ROOT_FOLDER_ID` — Root "Forhemit Deals" folder ID

### Existing Deal Folder Structure
```
Forhemit Deals (root)
├── {Client Name} ({ref})
│   ├── 01-first-touch
│   ├── 02-qualification
│   ├── 03-engagement
│   ├── 04-diligence
│   ├── 05-closing
│   └── 06-post-close
```

### Deal Tracker Box Integration
We will add a new subfolder:
```
{Client Name} ({ref})
├── 01-first-touch
├── 02-qualification
├── 03-engagement
├── 04-diligence
├── 05-closing
├── 06-post-close
└── 120-day-tracker          ← NEW
    └── deal-tracker.html    ← Auto-updated HTML file
```

---

## Updated Implementation Flow

### Tracker Initialization
```
1. Client sends engagement letter + wire
2. Admin marks engagement as "received" in CRM
3. System calls `initializeTracker(companyId)`
4. Creates all ~50 tasks in dealTrackerTasks table
5. Creates Box subfolder: "120-day-tracker"
6. Generates initial HTML file with 0% progress
7. Creates journal entry: "120-Day ESOP Transaction Tracker Initialized"
```

### Task Completion Flow
```
1. Admin/Employee clicks checkbox in UI
2. Convex mutation updates task state
3. System recalculates progress percentages
4. System creates journal entry (visible to all parties)
5. System generates updated HTML file
6. System uploads HTML to Box (replaces existing)
7. Dashboard widget updates in real-time
```

### Task Incompletion Flow
```
1. Admin/Employee unchecks checkbox in UI
2. Convex mutation marks task as incomplete
3. System recalculates progress percentages
4. System creates journal entry: "Task marked incomplete"
5. System generates updated HTML file
6. System uploads HTML to Box
7. Dashboard widget updates in real-time
```

---

## Next Steps

1. **Review this plan** — confirm architecture and data model
2. **Begin Phase 1** — Convex schema and core logic
3. **Iterate** — build, test, refine

---

**Last Updated:** 2026-05-31
**Status:** Ready for Implementation

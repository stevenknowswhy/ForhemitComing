06/02/26 10:36 AM PT
Purpose: (auto-inserted by pre-commit — please update)

06/02/26 10:34 AM PT
Purpose: (auto-inserted by pre-commit — please update)

06/02/26 10:31 AM PT
Purpose: (auto-inserted by pre-commit — please update)

06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Business Log — Implementation Plan v8 (FINAL)

> **Status:** Approved — Ready for implementation
> **Updated:** 2026-05-31
> **Location:** Audit Log page in Insights tab (`/admin/audit`) + Box-embedded client feed
> **Principle:** One event stream, four lenses (Admin · Team · Client Preview · Box Embed)

---

## 1. Architecture Overview

### One Stream, Four Lenses

```
                    ┌───────────────────────┐
                    │     businessLog       │
                    │   (single table)      │
                    └───────────┬───────────┘
                                │
        ┌───────────────┬───────┴───────┬────────────────┐
        ▼               ▼               ▼                ▼
  ┌──────────┐    ┌──────────┐   ┌──────────────┐  ┌──────────────┐
  │  Admin   │    │  Team    │   │ Client Feed  │  │ Box Embed    │
  │  Tab     │    │  Tab     │   │ Preview      │  │ (client-     │
  │ (ALL)    │    │          │   │ (admin POV)  │  │  safe API)   │
  └──────────┘    └──────────┘   └──────────────┘  └──────────────┘
```

The **Client Feed Preview** in admin and the **Box Embed** read from the same query path via `toClientProjection` — so what an admin previews is exactly what the client sees. No drift.

### Projection Layer (First-Class Concept)

Every audience has a dedicated projection. Not just client — all three.

```typescript
toAdminProjection()   // full internal rows — everything visible
toTeamProjection()    // internal rows — may hide security/HR/billing events later
toClientProjection()  // sanitized: clientSummary, clientActorLabel, publicMetadata only
```

v1 implements `toClientProjection` (mandatory on all client/Box responses). `toAdminProjection` and `toTeamProjection` are identity transforms for now — formalized so future filtering is a single-point change.

### Table Relationships

| Table | Purpose | Example | Retention |
|---|---|---|---|
| `businessLog` | Event narrative ("what happened, for whom") | "Stage: NDA → DD" | Activity 3yr · Compliance forever |
| `auditLogs` | Field-level diffs ("what changed, old→new") | `stage: "NDA" → "DD"` | Forever |
| `documentAudit` | SOC 2 doc lifecycle | "PDF generated, sha256: …" | Forever |
| `businessLogInteractions` | Client read/ack on events | "client acknowledged event abc123" | 1 year |
| `boxLogSessions` | Box embed access tokens | hashed token, scope, expiry | Until revoked + 90d |

**Linking rule:** mutations that write to `businessLog` AND `auditLogs` share a `correlationId`. The expanded event row deep-links to the field-level diffs.

### Security Rules (Permanent — No Exceptions)

No client-visible event may contain:
- Internal notes or internal email addresses
- Internal IDs (Convex IDs, Clerk IDs, Box internal IDs)
- Cost data, fee amounts, or financial specifics
- AI prompts, AI model names, or AI outputs marked internal
- Audit log field-level diffs
- Individual team member names (use `"Forhemit Team"`)

This is enforced by `toClientProjection` at the response layer and by the fail-closed check in `logEvent` at the write layer. Document this in the code as a permanent comment.

---

## 2. Visibility Model — Boolean Indexes

Two booleans derived at write time. **Never passed by callers** — always computed in `logEvent`.

```typescript
visibility:    "system" | "internal" | "external" | "client"  // semantic label, caller provides
teamVisible:   boolean   // derived: visibility !== "system"
clientVisible: boolean   // derived: visibility === "external" || "client"
```

| Tab | Index Query |
|---|---|
| Admin All Activity | No visibility filter (everything) |
| Team | `teamVisible === true` (single-stream, cursor pagination works) |
| Client Preview | `companyId = X AND clientVisible = true` |
| Box Embed | `companyId = session.companyId AND clientVisible = true` |

| Visibility | Admin | Team | Client | Examples |
|---|---|---|---|---|
| `system` | ✅ | ❌ | ❌ | Login, settings, exports |
| `internal` | ✅ | ✅ | ❌ | Internal notes, agent runs, office tasks |
| `external` | ✅ | ✅ | ✅ | NDA sent, stage change, doc signed |
| `client` | ✅ | ✅ | ✅ | Journal delivery, client opened |

---

## 3. Event Catalog

### Auth & System (visibility: `system`)

| Action | Summary |
|---|---|
| `auth.login` | "Stefano logged in" |
| `auth.logout` | "Stefano logged out" |
| `auth.user_created` | "New user created via Clerk webhook" |
| `auth.role_changed` | "Admin role granted to Jane" |
| `system.settings_changed` | "Pipeline stage order updated" |
| `system.export_generated` | "Deal pipeline exported to CSV" |
| `system.bulk_operation` | "3 tasks marked complete" |

### Deal Lifecycle (visibility: `external`)

| Action | Summary | Client Summary |
|---|---|---|
| `deal.created` | "New deal created: Acme Corp" | "Your ESOP engagement has been initiated" |
| `deal.stage_changed` | "Stage: Feasibility → Term sheet" | "Deal progressed to Term Sheet stage" |
| `deal.nda_status_changed` | "NDA status: Pending → Signed" | "NDA has been fully executed" |
| `deal.gate_cleared` | "Gate 2 (SBA) cleared at D60" | "SBA financing approval received" |
| `deal.gate_blocked` | "Gate 3 (QofE) blocked — missing docs" | "QofE review pending additional documents" |
| `deal.fee_invoiced` | "Retainer ($25,000) invoiced" | "Retainer invoice issued" |
| `deal.fee_paid` | "Validation fee ($50,000) received" | "Validation fee received" |
| `deal.closed` | "Deal closed — ESOP transition complete" | "Congratulations — your ESOP transition is complete" |
| `deal.killed` | "Deal marked Dead: owner withdrew" | — (internal only) |
| `deal.on_hold` | "Deal paused — lender timeline" | "Deal timeline paused pending lender review" |
| `deal.contact_added` | "Jane Doe added as Trustee contact" | — (internal only) |

### Workflow Tasks (visibility depends)

| Action | Visibility | Summary |
|---|---|---|
| `task.created` | `internal` | "Task auto-created: Send NDA" |
| `task.assigned` | `internal` | "Task assigned to CPA role" |
| `task.sent` | `external` | "NDA sent to john@acme.com via Resend" |
| `task.opened` | `external` | "NDA opened by john@acme.com" |
| `task.completed` | `external` | "NDA signed — Box Sign completed" |
| `task.overdue` | `internal` | "Task overdue: QofE report (due D75)" |
| `task.cancelled` | `internal` | "Task cancelled: superseded by new NDA" |
| `task.skipped` | `internal` | "Task skipped: not applicable" |

### Documents (visibility depends)

| Action | Visibility | Summary |
|---|---|---|
| `document.generated` | `internal` | "Preflight internal PDF generated" |
| `document.uploaded` | `internal` | "Tax return uploaded by seller" |
| `document.shared` | `external` | "Lender package shared with Wells Fargo" |
| `document.signed` | `external` | "LOI signed by all parties" |
| `document.declined` | `external` | "NDA declined by trustee" |
| `document.viewed` | `external` | "Term sheet viewed by CPA" |
| `document.downloaded` | `external` | "QofE report downloaded by lender" |
| `document.emailed` | `external` | "Engagement letter emailed to owner" |

### Email (visibility depends)

| Action | Visibility | Summary |
|---|---|---|
| `email.sent` | `external` | "Email sent: NDA to john@acme.com" |
| `email.delivered` | `external` | "Email delivered to john@acme.com" |
| `email.opened` | `external` | "Email opened by john@acme.com" |
| `email.bounced` | `internal` | "Email bounced: invalid address" |
| `email.failed` | `internal` | "Email delivery failed" |

### AI Agent (visibility: `internal`)

| Action | Summary |
|---|---|
| `agent.output_generated` | "Deal Analyst produced QofE memo (GPT-4, $0.42)" |
| `agent.job_queued` | "Capital Structurer job queued (priority: high)" |
| `agent.job_completed` | "Deal Analyst job completed in 12s" |
| `agent.job_failed` | "Valuation Agent failed: timeout" |
| `agent.output_approved` | "QofE memo approved by Stefano" |
| `agent.output_rejected` | "Capital structure rejected: wrong assumptions" |

### Client Journal (visibility depends on `visibleToClient` flag)

| Action | Visibility | Summary |
|---|---|---|
| `journal.entry_created` | `external` if visibleToClient, else `internal` | "Trustee call logged (45 min)" |
| `journal.narrative_sent` | `external` | "Weekly narrative sent to owner@acme.com" |
| `journal.digest_delivered` | `external` | "Week 14 digest delivered via Box + email" |
| `journal.client_opened` | `external` | "Client opened journal email" |
| `journal.client_viewed` | `external` | "Client viewed Box file" |

### Deal Tracker — 120-Day Roadmap (visibility: `external`)

| Action | Summary |
|---|---|
| `tracker.subtask_toggled` | "Subtask completed: Team seated" |
| `tracker.gate_cleared` | "Gate 1 (FMV) cleared at D45" |
| `tracker.gate_blocked` | "Gate 2 (SBA) blocked" |
| `tracker.engagement_started` | "120-day clock started" |
| `tracker.phase_entered` | "Entered Build phase (Day 15)" |

### Box Integration (visibility: `internal`)

| Action | Summary |
|---|---|
| `box.folder_provisioned` | "Box folder created for Acme Corp" |
| `box.link_generated` | "Box activity link created (expires 30d)" |
| `box.session_started` | "Client opened activity log from Box" |
| `box.session_revoked` | "Box activity link revoked" |

### Client Interactions (visibility: `client`)

| Action | Summary |
|---|---|
| `client.feed_opened` | "Client opened activity feed" |
| `client.event_acknowledged` | "Client acknowledged: Gate 2 cleared" |
| `client.box_link_opened` | "Client opened linked Box document" |

> **v2 (deferred):** `client.comment_added`, replies, notifications, threading.
> **v1:** Read, acknowledge, open links only.

---

## 4. Schema — Complete Definition (FINAL)

```typescript
// packages/convex/convex/schema.ts

businessLog: defineTable({
  // ── Versioning ─────────────────────────────────────────
  eventVersion:    v.number(),    // start at 1

  // ── What happened ──────────────────────────────────────
  eventType:       v.string(),    // "deal.stage_changed"
  category:        v.union(
    v.literal("deal"),    v.literal("task"),    v.literal("document"),
    v.literal("email"),   v.literal("agent"),   v.literal("auth"),
    v.literal("system"),  v.literal("journal"), v.literal("tracker"),
    v.literal("box"),     v.literal("client")
  ),

  // ── Display: dual summaries ────────────────────────────
  summary:         v.string(),                  // internal/team
  clientSummary:   v.optional(v.string()),      // client-safe; REQUIRED if clientVisible

  // ── Actor (structured) ─────────────────────────────────
  actorType:       v.union(
    v.literal("user"),    v.literal("system"), v.literal("agent"),
    v.literal("webhook"), v.literal("client"), v.literal("box")
  ),
  actorId:         v.optional(v.string()),
  actorLabel:      v.optional(v.string()),      // "Stefano" — internal
  clientActorLabel:v.optional(v.string()),      // "Forhemit Team" — client

  // ── Where it came from ─────────────────────────────────
  source:          v.union(
    v.literal("admin_ui"), v.literal("client_portal"),
    v.literal("box_embed"), v.literal("webhook"),
    v.literal("agent"),    v.literal("api"),    v.literal("scheduler")
  ),

  // ── Entity link ────────────────────────────────────────
  entityType:      v.optional(v.string()),
  entityId:        v.optional(v.string()),

  // ── Scoping & traceability ─────────────────────────────
  companyId:       v.optional(v.id("crmCompanies")),
  scopeType:       v.optional(v.union(
    v.literal("company"), v.literal("user"), v.literal("system")
  )),
  scopeId:         v.optional(v.string()),
  correlationId:   v.optional(v.string()),
  idempotencyKey:  v.optional(v.string()),      // prevents webhook duplicates

  // ── Timing ─────────────────────────────────────────────
  occurredAt:      v.number(),                   // when event actually happened
  publishedAt:     v.optional(v.number()),       // when client may see it

  // ── Access control (derived — never passed by callers) ─
  visibility:      v.union(
    v.literal("system"), v.literal("internal"),
    v.literal("external"), v.literal("client")
  ),
  teamVisible:     v.boolean(),                  // derived: visibility !== "system"
  clientVisible:   v.boolean(),                  // derived: visibility in ("external","client")

  // ── Filtering & severity ───────────────────────────────
  severity:        v.union(
    v.literal("info"), v.literal("warning"), v.literal("critical")
  ),
  relatedRoles:    v.optional(v.array(v.string())),
  // NOTE: relatedRoles filtering is in-memory after fetch (v1 acceptable).

  // ── Retention ──────────────────────────────────────────
  retentionClass:  v.union(v.literal("activity"), v.literal("compliance")),
  deletedAt:       v.optional(v.number()),

  // ── Payloads (split: internal vs client-safe) ──────────
  metadata:        v.optional(v.any()),         // internal only; ≤2KB
  publicMetadata:  v.optional(v.any()),         // client-safe; ≤1KB

  // ── Links (with per-link visibility, max 5) ────────────
  links:           v.optional(v.array(v.object({
    label:          v.string(),
    type:           v.union(
      v.literal("box_file"),  v.literal("box_folder"),
      v.literal("document"),  v.literal("company"),
      v.literal("external")
    ),
    href:           v.optional(v.string()),
    boxFileId:      v.optional(v.string()),
    boxFolderId:    v.optional(v.string()),
    clientVisible:  v.boolean(),
  }))),
})
  .index("by_company_time",        ["companyId",       "_creationTime"])
  .index("by_team_time",           ["teamVisible",     "_creationTime"])
  .index("by_company_client_time", ["companyId", "clientVisible", "_creationTime"])
  .index("by_category_time",       ["category",        "_creationTime"])
  .index("by_eventType_time",      ["eventType",       "_creationTime"])
  .index("by_severity_time",       ["severity",        "_creationTime"])
  .index("by_correlation_time",    ["correlationId",   "_creationTime"])
  .index("by_retention_time",      ["retentionClass",  "_creationTime"])
  .index("by_idempotency",         ["idempotencyKey"])
  // NOTE: no by_time index — Convex auto-indexes _creationTime

// ── Client interactions (separate from feed) ─────────────
businessLogInteractions: defineTable({
  eventId:        v.id("businessLog"),
  companyId:      v.id("crmCompanies"),
  interactionType:v.union(
    v.literal("seen"), v.literal("expanded"),
    v.literal("acknowledged"), v.literal("opened_link")
    // v2: "commented"
  ),
  viewerType:     v.union(v.literal("client"), v.literal("box_user"), v.literal("system")),
  viewerId:       v.optional(v.string()),
  viewerEmail:    v.optional(v.string()),
  embedSessionId: v.optional(v.id("boxLogSessions")),
  // v2: comment: v.optional(v.string()),
})
  .index("by_event",          ["eventId"])
  .index("by_event_viewer",   ["eventId", "viewerId"])
  .index("by_company_viewer", ["companyId", "viewerId"])
  .index("by_company_time",   ["companyId", "_creationTime"]),

// ── Box embed sessions ───────────────────────────────────
boxLogSessions: defineTable({
  companyId:          v.id("crmCompanies"),
  boxFolderId:        v.optional(v.string()),
  tokenHash:          v.string(),                     // sha256 of URL token
  exchangedAt:        v.optional(v.number()),          // when URL token was exchanged
  sessionCookieHash:  v.optional(v.string()),           // sha256 of issued cookie
  exchangeCount:      v.number(),                      // 0 or 1; guard on server
  viewerEmail:        v.optional(v.string()),
  boxUserId:          v.optional(v.string()),
  capabilities:       v.array(v.string()),             // ["read","acknowledge"] (v1)
  expiresAt:          v.number(),
  revokedAt:          v.optional(v.number()),
  createdBy:          v.string(),
  lastSeenAt:         v.optional(v.number()),
})
  .index("by_tokenHash", ["tokenHash"])
  .index("by_company",   ["companyId"]),

// ── Stats cache ──────────────────────────────────────────
businessLogStats: defineTable({
  window:    v.string(),
  count:     v.number(),
  updatedAt: v.number(),
}).index("by_window", ["window"]),

// ── Embed tokens (legacy, replaced by boxLogSessions) ────
embedTokens: defineTable({
  companyId:   v.id("crmCompanies"),
  token:       v.string(),
  issuedAt:    v.number(),
  expiresAt:   v.number(),
  revokedAt:   v.optional(v.number()),
  issuedBy:    v.string(),
}).index("by_company",  ["companyId"])
  .index("by_token",    ["token"]),
```

### auditLogs Schema Addition

```typescript
auditLogs: defineTable({
  // ... all existing fields ...
  correlationId: v.optional(v.string()),
})
  // ... all existing indexes ...
  .index("by_correlation", ["correlationId"]),
```

---

## 5. Constants File

```typescript
// packages/convex/convex/lib/logEvents.constants.ts

/**
 * SUMMARY STYLE GUIDE
 * ─────────────────────────────────────────────────────────────────
 * INTERNAL summaries (summary field):
 * - Max 120 characters, past tense
 * - Include entity names, emails, dollar amounts, old→new states
 * - Internal jargon OK: "Gate 2 (SBA) cleared at D60"
 *
 * CLIENT summaries (clientSummary field):
 * - Max 120 characters, plain language
 * - No internal IDs, no jargon, no individual names
 * - Required whenever clientVisible === true (enforced by TypeScript + runtime)
 *
 * CLIENT actor labels (clientActorLabel field):
 * - Always "Forhemit Team" unless explicitly approved
 * - Individual names NEVER shown to clients
 *
 * SECURITY (enforced in toClientProjection):
 * - No internal notes, internal emails, internal IDs
 * - No cost data, AI prompts, AI outputs marked internal
 * - No audit log field-level diffs
 * ─────────────────────────────────────────────────────────────────
 */

export const LOG_ACTIONS = {
  // Auth
  AUTH_LOGIN:           "auth.login",
  AUTH_LOGOUT:          "auth.logout",
  AUTH_USER_CREATED:    "auth.user_created",
  AUTH_ROLE_CHANGED:    "auth.role_changed",

  // Deal
  DEAL_CREATED:         "deal.created",
  DEAL_STAGE_CHANGED:   "deal.stage_changed",
  DEAL_NDA_CHANGED:     "deal.nda_status_changed",
  DEAL_GATE_CLEARED:    "deal.gate_cleared",
  DEAL_GATE_BLOCKED:    "deal.gate_blocked",
  DEAL_FEE_INVOICED:    "deal.fee_invoiced",
  DEAL_FEE_PAID:        "deal.fee_paid",
  DEAL_CLOSED:          "deal.closed",
  DEAL_KILLED:          "deal.killed",
  DEAL_ON_HOLD:         "deal.on_hold",
  DEAL_CONTACT_ADDED:   "deal.contact_added",
  DEAL_BOX_LINKED:      "deal.box_folder_linked",
  DEAL_BOX_SIGN:        "deal.box_sign_status",

  // Task
  TASK_CREATED:         "task.created",
  TASK_ASSIGNED:        "task.assigned",
  TASK_SENT:            "task.sent",
  TASK_OPENED:          "task.opened",
  TASK_COMPLETED:       "task.completed",
  TASK_OVERDUE:         "task.overdue",
  TASK_CANCELLED:       "task.cancelled",
  TASK_SKIPPED:         "task.skipped",

  // Document
  DOC_GENERATED:        "document.generated",
  DOC_UPLOADED:         "document.uploaded",
  DOC_SHARED:           "document.shared",
  DOC_SIGNED:           "document.signed",
  DOC_DECLINED:         "document.declined",
  DOC_VIEWED:           "document.viewed",
  DOC_DOWNLOADED:       "document.downloaded",
  DOC_EMAILED:          "document.emailed",

  // Email
  EMAIL_SENT:           "email.sent",
  EMAIL_DELIVERED:      "email.delivered",
  EMAIL_OPENED:         "email.opened",
  EMAIL_BOUNCED:        "email.bounced",
  EMAIL_FAILED:         "email.failed",

  // Agent
  AGENT_OUTPUT:         "agent.output_generated",
  AGENT_JOB_QUEUED:     "agent.job_queued",
  AGENT_JOB_COMPLETED:  "agent.job_completed",
  AGENT_JOB_FAILED:     "agent.job_failed",
  AGENT_APPROVED:       "agent.output_approved",
  AGENT_REJECTED:       "agent.output_rejected",

  // Journal
  JOURNAL_ENTRY:        "journal.entry_created",
  JOURNAL_NARRATIVE:    "journal.narrative_sent",
  JOURNAL_DIGEST:       "journal.digest_delivered",
  JOURNAL_OPENED:       "journal.client_opened",
  JOURNAL_VIEWED:       "journal.client_viewed",

  // Tracker
  TRACKER_SUBTASK:      "tracker.subtask_toggled",
  TRACKER_GATE:         "tracker.gate_cleared",
  TRACKER_BLOCKED:      "tracker.gate_blocked",
  TRACKER_STARTED:      "tracker.engagement_started",
  TRACKER_PHASE:        "tracker.phase_entered",

  // Box
  BOX_FOLDER_PROVISIONED: "box.folder_provisioned",
  BOX_LINK_GENERATED:     "box.link_generated",
  BOX_SESSION_STARTED:    "box.session_started",
  BOX_SESSION_REVOKED:    "box.session_revoked",

  // Client interactions (v1: read + ack + open links)
  CLIENT_FEED_OPENED:     "client.feed_opened",
  CLIENT_EVENT_ACKED:     "client.event_acknowledged",
  CLIENT_LINK_OPENED:     "client.box_link_opened",
  // v2: CLIENT_COMMENT_ADDED

  // System
  SYSTEM_SETTINGS:      "system.settings_changed",
  SYSTEM_EXPORT:        "system.export_generated",
  SYSTEM_BULK:          "system.bulk_operation",
  SYSTEM_PUBLISHED:     "system.content_published",
  SYSTEM_UPDATED:       "system.content_updated",
} as const;

// ── Retention class per action — COMPLETE ─────────────────

export const LOG_RETENTION: Record<string, "activity" | "compliance"> = {
  // Compliance — keep forever
  "deal.nda_status_changed":  "compliance",
  "deal.gate_cleared":        "compliance",
  "deal.fee_invoiced":        "compliance",
  "deal.fee_paid":            "compliance",
  "deal.closed":              "compliance",
  "deal.killed":              "compliance",
  "deal.box_sign_status":     "compliance",
  "document.signed":          "compliance",
  "document.declined":        "compliance",
  "auth.role_changed":        "compliance",

  // Activity — purgeable after 3-year TTL
  "deal.created":             "activity",
  "deal.stage_changed":       "activity",
  "deal.on_hold":             "activity",
  "deal.contact_added":       "activity",
  "deal.box_folder_linked":   "activity",
  "deal.gate_blocked":        "activity",
  "task.created":             "activity",
  "task.assigned":            "activity",
  "task.sent":                "activity",
  "task.opened":              "activity",
  "task.completed":           "activity",
  "task.overdue":             "activity",
  "task.cancelled":           "activity",
  "task.skipped":             "activity",
  "document.generated":       "activity",
  "document.uploaded":        "activity",
  "document.shared":          "activity",
  "document.viewed":          "activity",
  "document.downloaded":      "activity",
  "document.emailed":         "activity",
  "email.sent":               "activity",
  "email.delivered":          "activity",
  "email.opened":             "activity",
  "email.bounced":            "activity",
  "email.failed":             "activity",
  "agent.output_generated":   "activity",
  "agent.job_queued":         "activity",
  "agent.job_completed":      "activity",
  "agent.job_failed":         "activity",
  "agent.output_approved":    "activity",
  "agent.output_rejected":    "activity",
  "journal.entry_created":    "activity",
  "journal.narrative_sent":   "activity",
  "journal.digest_delivered": "activity",
  "journal.client_opened":    "activity",
  "journal.client_viewed":    "activity",
  "tracker.subtask_toggled":  "activity",
  "tracker.gate_cleared":     "activity",
  "tracker.gate_blocked":     "activity",
  "tracker.engagement_started": "activity",
  "tracker.phase_entered":    "activity",
  "box.folder_provisioned":   "activity",
  "box.link_generated":       "activity",
  "box.session_started":      "activity",
  "box.session_revoked":      "activity",
  "client.feed_opened":       "activity",
  "client.event_acknowledged": "activity",
  "client.box_link_opened":   "activity",
  "auth.login":               "activity",
  "auth.logout":              "activity",
  "auth.user_created":        "activity",
  "system.settings_changed":  "activity",
  "system.export_generated":  "activity",
  "system.bulk_operation":    "activity",
  "system.content_published": "activity",
  "system.content_updated":   "activity",
} as const;

export const CLIENT_VISIBLE_LEVELS = new Set(["external", "client"]);

export const ROLE_FILTERS = [
  "Forhemit", "Owner/Seller", "CPA", "Legal", "Lender", "Broker", "Trustee"
] as const;

export const CATEGORY_FILTERS = [
  "deal", "task", "document", "email", "agent", "auth",
  "system", "journal", "tracker", "box", "client"
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  deal:     "🤝",
  task:     "📋",
  document: "📄",
  email:    "📧",
  agent:    "🤖",
  auth:     "🔐",
  system:   "⚙️",
  journal:  "📔",
  tracker:  "🗓️",
  box:      "📦",
  client:   "👤",
};
```

---

## 6. Utilities

### 6a. Actor Resolver

```typescript
// packages/convex/convex/lib/resolveActor.ts

import { MutationCtx } from "../_generated/server";

/**
 * Policy: clientActorLabel is always "Forhemit Team".
 * Individual names are NEVER shown to clients.
 * This is enforced here, not at call sites.
 */
export async function resolveActor(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return {
      actorType:        "system" as const,
      actorId:          "system",
      actorLabel:       "System",
      clientActorLabel: "Forhemit Team",
    };
  }

  return {
    actorType:        "user" as const,
    actorId:          identity.subject,
    actorLabel:       identity.name ?? identity.email ?? identity.subject,
    clientActorLabel: "Forhemit Team",
  };
}

export function agentActor(agentName: string) {
  return {
    actorType:        "agent" as const,
    actorId:          `agent:${agentName}`,
    actorLabel:       agentName,
    clientActorLabel: "Forhemit Team",
  };
}

export function webhookActor(source: string) {
  return {
    actorType:        "webhook" as const,
    actorId:          `webhook:${source}`,
    actorLabel:       source,
    clientActorLabel: "Forhemit Team",
  };
}

export function boxActor() {
  return {
    actorType:        "box" as const,
    actorId:          "box-webhook",
    actorLabel:       "Box",
    clientActorLabel: "Box",   // client CAN see "Box" as actor
  };
}
```

### 6b. Correlation ID

```typescript
// packages/convex/convex/lib/correlationId.ts

/**
 * Collision-resistant correlation ID for linking businessLog ↔ auditLogs.
 * Format: {prefix}_{base36_timestamp}_{6_char_random}
 * Example: "deal_stage_lk3m2n_x4r9f2"
 */
export function makeCorrelationId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random    = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}
```

### 6c. Client-Safe Projection (Typed)

```typescript
// packages/convex/convex/lib/clientProjection.ts

import { Doc } from "../_generated/dataModel";

export interface ClientEventProjection {
  id:             string;
  occurredAt:     number;
  eventType:      string;
  category:       string;
  severity:       "info" | "warning" | "critical";
  summary:        string;           // always a string — never undefined
  actorLabel:     string;           // always a string — never undefined
  publicMetadata: Record<string, unknown> | undefined;
  links:          ClientLink[];
}

export interface ClientLink {
  label:      string;
  type:       string;
  href?:      string;
  boxFileId?: string;
}

/**
 * MANDATORY on all client/Box responses.
 * Strips internal fields — only client-safe data leaves the server.
 *
 * Runtime guard catches data written before fail-closed check existed.
 */
export function toClientProjection(
  event: Doc<"businessLog">
): ClientEventProjection {
  if (!event.clientSummary) {
    console.error(
      "[clientProjection] clientVisible event missing clientSummary",
      { eventType: event.eventType, id: event._id }
    );
  }

  return {
    id:             event._id,
    occurredAt:     event.occurredAt,
    eventType:      event.eventType,
    category:       event.category,
    severity:       event.severity,
    summary:        event.clientSummary ?? "Your deal team completed an action.",
    actorLabel:     event.clientActorLabel ?? "Forhemit Team",
    publicMetadata: event.publicMetadata as Record<string, unknown> | undefined,
    links:          (event.links ?? [])
                      .filter(l => l.clientVisible)
                      .map(({ label, type, href, boxFileId }) =>
                        ({ label, type, href, boxFileId })
                      ),
  };
}
```

### 6d. Emitter — Best-Effort Awaited

```typescript
// packages/convex/convex/lib/logEvent.ts

import { MutationCtx } from "../_generated/server";
import { LOG_RETENTION } from "./logEvents.constants";

const METADATA_MAX_BYTES        = 2000;
const PUBLIC_METADATA_MAX_BYTES = 1000;
const MAX_LINKS                 = 5;

/**
 * SECURITY RULES (permanent — no exceptions):
 *
 * No client-visible event may contain:
 * - Internal notes or internal email addresses
 * - Internal IDs (Convex IDs, Clerk IDs)
 * - Cost data, fee amounts, or financial specifics
 * - AI prompts, model names, or outputs marked internal
 * - Audit log field-level diffs
 * - Individual team member names (use "Forhemit Team")
 *
 * Enforced by toClientProjection (response layer)
 * and by fail-closed check below (write layer).
 */

// ── Payload types (discriminated union) ──────────────────

interface InternalEvent {
  visibility:    "system" | "internal";
  clientSummary?: never;
}

interface ClientVisibleEvent {
  visibility:    "external" | "client";
  clientSummary: string;           // REQUIRED — TypeScript enforces
}

export type LogPayload = {
  eventType:        string;
  category:         "deal" | "task" | "document" | "email" |
                    "agent" | "auth" | "system" | "journal" |
                    "tracker" | "box" | "client";
  summary:          string;
  actorType:        "user" | "system" | "agent" | "webhook" | "client" | "box";
  actorId?:         string;
  actorLabel?:      string;
  clientActorLabel?: string;
  source:           "admin_ui" | "client_portal" | "box_embed" |
                    "webhook" | "agent" | "api" | "scheduler";
  entityType?:      string;
  entityId?:        string;
  companyId?:       string;
  scopeType?:       "company" | "user" | "system";
  scopeId?:         string;
  correlationId?:   string;
  idempotencyKey?:  string;
  occurredAt?:      number;        // default: Date.now()
  publishedAt?:     number;
  severity?:        "info" | "warning" | "critical";
  relatedRoles?:    string[];
  metadata?:        Record<string, unknown>;
  publicMetadata?:  Record<string, unknown>;
  links?:           Array<{
    label: string;
    type: "box_file" | "box_folder" | "document" | "company" | "external";
    href?: string;
    boxFileId?: string;
    boxFolderId?: string;
    clientVisible: boolean;
  }>;
} & (InternalEvent | ClientVisibleEvent);

// ── Sanitizer ────────────────────────────────────────────

function sanitize(obj: unknown, maxBytes: number) {
  if (!obj) return undefined;
  const s = JSON.stringify(obj);
  if (s.length <= maxBytes) return obj;
  console.warn("[businessLog] metadata truncated", { size: s.length, limit: maxBytes });
  return {
    _truncated: true,
    _originalSize: s.length,
    ...Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).filter(
        ([, v]) => typeof v !== "object" && typeof v !== "function"
      )
    ),
  };
}

// ── Stats updater ────────────────────────────────────────

async function incrementStats(ctx: MutationCtx, severity: string, delta: number = 1) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const windows = ["total", todayKey];
  if (severity !== "info") windows.push(`severity:${severity}`);

  await Promise.all(
    windows.map(async (window) => {
      const existing = await ctx.db
        .query("businessLogStats")
        .withIndex("by_window", q => q.eq("window", window))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          count: Math.max(0, existing.count + delta),
          updatedAt: Date.now(),
        });
      } else if (delta > 0) {
        await ctx.db.insert("businessLogStats", {
          window, count: delta, updatedAt: Date.now(),
        });
      }
    })
  );
}

// ── Main emitter ─────────────────────────────────────────

/**
 * Best-effort awaited emitter.
 *
 * ALWAYS `await logEvent(ctx, payload)` — never `void logEvent(...)`.
 * Errors are caught internally and logged; they never block the caller.
 *
 * FAIL-CLOSED: clientVisible events require clientSummary.
 * TypeScript enforces this at compile time; runtime check is the backstop.
 */
export async function logEvent(ctx: MutationCtx, payload: LogPayload) {
  try {
    const teamVisible   = payload.visibility !== "system";
    const clientVisible = payload.visibility === "external"
                       || payload.visibility === "client";

    // FAIL CLOSED: clientVisible requires clientSummary
    if (clientVisible && !payload.clientSummary) {
      throw new Error(
        `[businessLog] clientVisible event "${payload.eventType}" ` +
        `is missing required clientSummary. Refusing to write.`
      );
    }

    // Idempotency guard
    if (payload.idempotencyKey) {
      const existing = await ctx.db
        .query("businessLog")
        .withIndex("by_idempotency", q => q.eq("idempotencyKey", payload.idempotencyKey))
        .first();
      if (existing) return; // already recorded — skip
    }

    const retentionClass = LOG_RETENTION[payload.eventType];
    if (!retentionClass) {
      if (process.env.NODE_ENV === "development") {
        throw new Error(
          `[businessLog] No retention class for eventType: "${payload.eventType}". ` +
          `Add it to LOG_RETENTION in logEvents.constants.ts`
        );
      }
      console.warn("[businessLog] Unknown eventType, defaulting to activity", {
        eventType: payload.eventType,
      });
    }

    // Truncate links to max 5
    const links = payload.links && payload.links.length > MAX_LINKS
      ? (console.warn("[businessLog] links truncated", { count: payload.links.length, limit: MAX_LINKS }),
         payload.links.slice(0, MAX_LINKS))
      : payload.links;

    await ctx.db.insert("businessLog", {
      eventVersion:  1,
      severity:      payload.severity ?? "info",
      occurredAt:    payload.occurredAt ?? Date.now(),
      publishedAt:   payload.publishedAt ?? Date.now(),
      deletedAt:     undefined,
      ...payload,
      teamVisible,
      clientVisible,
      retentionClass: retentionClass ?? "activity",
      links,
      metadata:       sanitize(payload.metadata,        METADATA_MAX_BYTES),
      publicMetadata: sanitize(payload.publicMetadata,  PUBLIC_METADATA_MAX_BYTES),
    });

    await incrementStats(ctx, payload.severity ?? "info");
  } catch (err) {
    // Never block the main mutation — re-throw dev guard errors
    if (err instanceof Error && (
      err.message.includes("No retention class") ||
      err.message.includes("missing required clientSummary")
    )) {
      throw err;
    }
    console.error("[businessLog] write failed", {
      eventType: payload.eventType,
      companyId: payload.companyId,
      entityId:  payload.entityId,
      err,
    });
  }
}
```

### 6e. Call Site Examples

```typescript
// Deal stage change (external visibility — needs clientSummary)
const actor = await resolveActor(ctx);
const correlationId = makeCorrelationId("deal_stage");

await logEvent(ctx, {
  ...actor,
  eventType:        LOG_ACTIONS.DEAL_STAGE_CHANGED,
  category:         "deal",
  summary:          `Stage: ${oldStage} → ${newStage}`,
  clientSummary:    `Deal progressed to ${clientStageName} stage`,
  source:           "admin_ui",
  entityType:       "crmCompany",
  entityId:         args.companyId,
  companyId:        args.companyId,
  scopeType:        "company",
  correlationId,
  idempotencyKey:   `deal_stage_${args.companyId}_${newStage}`,
  occurredAt:       Date.now(),
  visibility:       "external",
  severity:         "info",
  relatedRoles:     ["Forhemit", "Broker"],
  metadata:         { oldStage, newStage },
  publicMetadata:   { newStage: clientStageName },
  links: [{
    label: "View in Box",
    type:  "box_folder",
    boxFolderId: boxFolderId,
    clientVisible: true,
  }],
});

// Agent run (internal visibility — no clientSummary needed)
await logEvent(ctx, {
  ...agentActor("Deal Analyst"),
  eventType:     LOG_ACTIONS.AGENT_OUTPUT,
  category:      "agent",
  summary:       `Deal Analyst produced QofE memo ($${costUsd.toFixed(2)})`,
  source:        "agent",
  visibility:    "internal",
  companyId:     args.companyId,
  scopeType:     "company",
  metadata:      { model, costUsd, tokenCount },
});

// Auth event (system visibility — no companyId needed)
await logEvent(ctx, {
  ...actor,
  eventType:  LOG_ACTIONS.AUTH_LOGIN,
  category:   "auth",
  summary:    `${actor.actorLabel} logged in`,
  source:     "admin_ui",
  visibility: "system",
  scopeType:  "user",
  scopeId:    actor.actorId,
});
```

---

## 7. Queries

```typescript
// packages/convex/convex/businessLog.ts

import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";
import { toClientProjection } from "./lib/clientProjection";

// ── Admin All Activity ───────────────────────────────────

export const listAll = query({
  args: {
    cursor:   v.optional(v.string()),
    limit:    v.optional(v.number()),
    category: v.optional(v.string()),
    severity: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const pageSize = Math.min(args.limit ?? 50, 100);

    const result = await ctx.db
      .query("businessLog")
      .order("desc")
      .paginate({ cursor: args.cursor ?? null, numItems: pageSize });

    let items = result.page.filter(e => e.deletedAt == null);
    if (args.category) items = items.filter(e => e.category === args.category);
    if (args.severity && args.severity !== "all") items = items.filter(e => e.severity === args.severity);

    return { items, cursor: result.continueCursor, hasMore: !result.isDone };
  },
});

// ── Team Feed (single-stream via boolean index) ──────────
//
// teamVisible boolean index means this is a single-stream query.
// Cursor pagination works correctly — no multi-stream merge needed.
// Overfetch (pageSize * 3) to account for in-memory filter loss.

export const listForTeam = query({
  args: {
    cursor:     v.optional(v.string()),
    limit:      v.optional(v.number()),
    category:   v.optional(v.string()),
    severity:   v.optional(v.string()),
    roleFilter: v.optional(v.string()),
    companyId:  v.optional(v.id("crmCompanies")),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const pageSize = Math.min(args.limit ?? 50, 100);

    const result = await ctx.db
      .query("businessLog")
      .withIndex("by_team_time", q => q.eq("teamVisible", true))
      .order("desc")
      .paginate({ cursor: args.cursor ?? null, numItems: pageSize * 3 });

    let items = result.page.filter(e => e.deletedAt == null);
    if (args.companyId) items = items.filter(e => e.companyId === args.companyId);
    if (args.roleFilter) items = items.filter(e => e.relatedRoles?.includes(args.roleFilter!));
    if (args.category) items = items.filter(e => e.category === args.category);
    if (args.severity && args.severity !== "all") items = items.filter(e => e.severity === args.severity);

    return {
      items:   items.slice(0, pageSize),
      cursor:  result.continueCursor,
      hasMore: !result.isDone,
    };
  },
});

// ── Client Preview (admin POV — uses toClientProjection) ─

export const listClientPreview = query({
  args: {
    companyId: v.id("crmCompanies"),
    cursor:    v.optional(v.string()),
    limit:     v.optional(v.number()),
    severity:  v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const pageSize = Math.min(args.limit ?? 25, 50);
    const now = Date.now();

    const result = await ctx.db
      .query("businessLog")
      .withIndex("by_company_client_time", q =>
        q.eq("companyId", args.companyId).eq("clientVisible", true)
      )
      .order("desc")
      .paginate({ cursor: args.cursor ?? null, numItems: pageSize });

    let items = result.page
      .filter(e => e.deletedAt == null && e.publishedAt != null && e.publishedAt <= now);

    if (args.severity && args.severity !== "all") {
      items = items.filter(e => e.severity === args.severity);
    }

    return {
      items:  items.map(toClientProjection),
      cursor: result.continueCursor,
      hasMore: !result.isDone,
    };
  },
});

// ── Box Embed (public, session-token auth) ───────────────

export const listForBoxEmbed = query({
  args: {
    sessionToken: v.string(),
    cursor:       v.optional(v.string()),
    limit:        v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const session = await resolveBoxSession(ctx, args.sessionToken);
    if (!session) return { items: [], cursor: null, hasMore: false };

    const pageSize = Math.min(args.limit ?? 25, 50);
    const now = Date.now();

    const result = await ctx.db
      .query("businessLog")
      .withIndex("by_company_client_time", q =>
        q.eq("companyId", session.companyId).eq("clientVisible", true)
      )
      .order("desc")
      .paginate({ cursor: args.cursor ?? null, numItems: pageSize });

    const items = result.page
      .filter(e => e.deletedAt == null && e.publishedAt != null && e.publishedAt <= now)
      .map(toClientProjection);

    await ctx.db.patch(session._id, { lastSeenAt: now });

    return { items, cursor: result.continueCursor, hasMore: !result.isDone };
  },
});

// ── Stats (materialized, constant-time) ──────────────────

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const todayKey = new Date().toISOString().slice(0, 10);

    const [total, today, warnings, criticals] = await Promise.all([
      ctx.db.query("businessLogStats").withIndex("by_window", q => q.eq("window", "total")).first(),
      ctx.db.query("businessLogStats").withIndex("by_window", q => q.eq("window", todayKey)).first(),
      ctx.db.query("businessLogStats").withIndex("by_window", q => q.eq("window", "severity:warning")).first(),
      ctx.db.query("businessLogStats").withIndex("by_window", q => q.eq("window", "severity:critical")).first(),
    ]);

    return {
      total:     total?.count     ?? 0,
      today:     today?.count     ?? 0,
      warnings:  warnings?.count  ?? 0,
      criticals: criticals?.count ?? 0,
    };
  },
});

// ── auditLogs deep-link ──────────────────────────────────

export const getByCorrelationId = query({
  args: { correlationId: v.string() },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return ctx.db.query("auditLogs")
      .withIndex("by_correlation", q => q.eq("correlationId", args.correlationId))
      .collect();
  },
});

// ── Box session resolver (internal) ──────────────────────

async function resolveBoxSession(ctx: any, token: string) {
  const { createHash } = await import("node:crypto");
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const session = await ctx.db
    .query("boxLogSessions")
    .withIndex("by_tokenHash", q => q.eq("tokenHash", tokenHash))
    .first();

  if (!session) return null;
  if (session.revokedAt) return null;
  if (session.expiresAt < Date.now()) return null;
  if (session.exchangeCount > 0) return null; // one-time token already used
  return session;
}

// ── Retention purge ──────────────────────────────────────

const THREE_YEARS_MS = 3 * 365 * 24 * 60 * 60 * 1000;

export const purgeExpiredActivityEvents = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - THREE_YEARS_MS;
    const expired = await ctx.db
      .query("businessLog")
      .withIndex("by_retention_time", q =>
        q.eq("retentionClass", "activity").lt("_creationTime", cutoff)
      )
      .take(500);

    await incrementStats(ctx, "info", -expired.length);
    await Promise.all(expired.map(e => ctx.db.delete(e._id)));
    return { deleted: expired.length };
  },
});
```

---

## 8. Business Log Interactions

```typescript
// packages/convex/convex/businessLogInteractions.ts

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

// ── Record "seen" (deduplicated per viewer per event) ────

export const recordSeen = mutation({
  args: {
    eventId:        v.id("businessLog"),
    companyId:      v.id("crmCompanies"),
    viewerId:       v.optional(v.string()),
    viewerEmail:    v.optional(v.string()),
    embedSessionId: v.optional(v.id("boxLogSessions")),
  },
  handler: async (ctx, args) => {
    if (args.viewerId) {
      const existing = await ctx.db
        .query("businessLogInteractions")
        .withIndex("by_event_viewer", q =>
          q.eq("eventId", args.eventId).eq("viewerId", args.viewerId!)
        )
        .filter(q => q.eq(q.field("interactionType"), "seen"))
        .first();

      if (existing) return existing._id;
    }

    return ctx.db.insert("businessLogInteractions", {
      ...args,
      interactionType: "seen",
      viewerType:      "client",
    });
  },
});

// ── Record acknowledge ───────────────────────────────────

export const recordAcknowledged = mutation({
  args: {
    eventId:        v.id("businessLog"),
    companyId:      v.id("crmCompanies"),
    viewerId:       v.optional(v.string()),
    viewerEmail:    v.optional(v.string()),
    embedSessionId: v.optional(v.id("boxLogSessions")),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("businessLogInteractions", {
      ...args,
      interactionType: "acknowledged",
      viewerType:      "client",
    });
  },
});

// ── List by event ────────────────────────────────────────

export const listByEvent = query({
  args: { eventId: v.id("businessLog") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return ctx.db
      .query("businessLogInteractions")
      .withIndex("by_event", q => q.eq("eventId", args.eventId))
      .collect();
  },
});

// ── Unacknowledged count (for admin stats) ───────────────

export const getUnacknowledgedCount = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    // Get all client-visible events for this company
    const events = await ctx.db
      .query("businessLog")
      .withIndex("by_company_client_time", q =>
        q.eq("companyId", args.companyId).eq("clientVisible", true)
      )
      .filter(q => q.eq(q.field("deletedAt"), undefined))
      .collect();

    // Get all acknowledgments for this company
    const acks = await ctx.db
      .query("businessLogInteractions")
      .withIndex("by_company_viewer", q => q.eq("companyId", args.companyId))
      .filter(q => q.eq(q.field("interactionType"), "acknowledged"))
      .collect();

    const ackedEventIds = new Set(acks.map(a => a.eventId));
    return events.filter(e => !ackedEventIds.has(e._id)).length;
  },
});
```

---

## 9. Box Log Sessions

```typescript
// packages/convex/convex/boxLogSessions.ts

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";
import { createHash, randomUUID } from "node:crypto";

// ── Create session (admin generates Box link) ────────────

export const createSession = mutation({
  args: {
    companyId:    v.id("crmCompanies"),
    boxFolderId:  v.optional(v.string()),
    viewerEmail:  v.optional(v.string()),
    capabilities: v.array(v.string()),
    expiresInDays: v.number(),
    createdBy:    v.string(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const rawToken = randomUUID();
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    const sessionId = await ctx.db.insert("boxLogSessions", {
      companyId:         args.companyId,
      boxFolderId:       args.boxFolderId,
      tokenHash,
      exchangeCount:     0,
      viewerEmail:       args.viewerEmail,
      capabilities:      args.capabilities,
      expiresAt:         Date.now() + args.expiresInDays * 86_400_000,
      createdBy:         args.createdBy,
    });

    return { sessionId, rawToken };
  },
});

// ── Exchange token (POST endpoint — one-time) ────────────

export const markExchanged = mutation({
  args: {
    sessionId:       v.id("boxLogSessions"),
    sessionCookieHash: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.exchangeCount > 0) throw new Error("Token already exchanged");

    await ctx.db.patch(args.sessionId, {
      exchangedAt:       Date.now(),
      sessionCookieHash: args.sessionCookieHash,
      exchangeCount:     1,
    });
  },
});

// ── Find by hash ─────────────────────────────────────────

export const findByHash = query({
  args: { tokenHash: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("boxLogSessions")
      .withIndex("by_tokenHash", q => q.eq("tokenHash", args.tokenHash))
      .first();
  },
});

// ── Revoke ───────────────────────────────────────────────

export const revokeSession = mutation({
  args: { sessionId: v.id("boxLogSessions") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.patch(args.sessionId, { revokedAt: Date.now() });
  },
});

// ── List by company ──────────────────────────────────────

export const findByCompany = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return ctx.db
      .query("boxLogSessions")
      .withIndex("by_company", q => q.eq("companyId", args.companyId))
      .collect();
  },
});
```

---

## 10. Cron Job

```typescript
// packages/convex/convex/crons.ts

crons.weekly(
  "purge expired activity events",
  { dayOfWeek: "sunday", hourUTC: 2, minuteUTC: 0 },
  internal.businessLog.purgeExpiredActivityEvents
);
```

---

## 11. Admin UI — Four Surfaces

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Audit Log                                                    │
│                                                               │
│  [247 Total] [12 Today] [3 Warn] [1 Crit] [4 Unack'd client] │
│                                                               │
│  ┌─[All Activity][Team ▾][Client Preview]──────────────────┐ │
│  │                                                          │ │
│  │  Client Preview — Company: [Acme Corp ▾]                 │ │
│  │  [👁 Preview as client] [🔗 Generate Box link]           │ │
│  │                                                          │ │
│  │  ✅ Deal moved to Due Diligence     2h ago  [✓ ack'd]   │ │
│  │  📄 NDA signed                      Yesterday            │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Tab Behavior

| Tab | Data source | Pagination | Projection |
|---|---|---|---|
| All Activity | `listAll` | Convex cursor | Full internal rows |
| Team | `listForTeam` | Convex cursor (single-stream) | Full internal rows |
| Client Preview | `listClientPreview` | Convex cursor | `toClientProjection` (admin sees what client sees) |

### Client Preview Controls

- **Preview mode** — read-only, rendered via `toClientProjection` server-side
- **Generate Box link** — opens separate panel (not nested in preview)
- **Manage Box links** — list, revoke existing sessions

---

## 12. Box Embed

### Phase 0 — Feasibility (Do FIRST)

| Option | How it works | Pros | Cons |
|---|---|---|---|
| **Box Web Link** | Admin adds Web Link in Box pointing to embed URL | Zero Box API setup; works today | Client clicks link, leaves Box UI |
| **Box UI Element** | Box's official embed SDK renders inside Box | Native Box feel; stays in Box frame | Requires Box developer account + app approval |
| **Box Custom App** | Full Box skills/extension integration | Deepest integration | Significant platform work; approval required |

**Recommendation: Web Link for v1, Box UI Element for v2.**

Before any Box engineering, build a static "Hello World" activity feed inside the target Box environment. Success criteria: loads correctly, works in customer tenant, cookies work, CSP works. Many integrations fail because platform constraints are discovered too late.

### Routes (Phase 4)

```
apps/admin/app/embed/box/activity/page.tsx        ← UI (iframe-friendly)
apps/admin/app/api/embed/box-log/session/route.ts ← POST: exchange token → HttpOnly cookie
apps/admin/app/api/embed/box-log/events/route.ts  ← paginated feed
apps/admin/app/api/embed/box-log/interactions/route.ts ← acknowledge + open links
```

### Token Exchange Flow (POST, not GET)

```
1. Admin: "Generate Box link" → creates boxLogSessions row, returns signed URL
2. Admin: places link in client's Box folder
3. Client opens link → /embed/box/activity?t=<token>
4. Embed page JS: POSTs token to /api/embed/box-log/session
5. Server: validates hash, checks expiry/revocation/exchangeCount
6. Server: marks exchanged (exchangeCount → 1), sets HttpOnly cookie
7. Embed page: uses cookie for all subsequent /api/embed/box-log/events calls
```

### Security Checklist

- [ ] Token exchanged via POST (not GET) — prevents token in logs/referrers
- [ ] One-time: `exchangeCount` guard — token invalidated after exchange
- [ ] Cookie: `SameSite=None; Secure; HttpOnly; Path=/embed`
- [ ] CSP: `frame-ancestors box.com app.box.com`
- [ ] Session: 8h default, 24h max, revocable from admin
- [ ] Token hash (sha256) stored, never raw
- [ ] All responses through `toClientProjection`
- [ ] Rate limit: 60 req/min on events, 30 req/min on interactions
- [ ] No Clerk cookies trusted inside `/embed/*`

### Embed UI (v1 — no comments)

```
┌─────────────────────────────────────────────────────┐
│  Deal Activity                                       │
│                                                      │
│  ✅ Deal moved to Due Diligence          2h ago      │
│     Forhemit Team                                    │
│     › View document in Box        [Acknowledge]     │
│                                                      │
│  📄 NDA signed                          Yesterday    │
│     Forhemit Team                                    │
│                                                      │
│ 📬 Weekly digest sent                   Jan 18       │
│                                                      │
│  [Load more]                                         │
└─────────────────────────────────────────────────────┘
```

### Backfill Migration (Phase 4)

Existing `clientVisible: true` events written before Box embed may lack `clientSummary`. Run once:

```typescript
// packages/convex/convex/migrations/backfillClientSummary.ts

export const backfillClientSummary = internalMutation({
  args: { cursor: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("businessLog")
      .filter(q =>
        q.and(
          q.eq(q.field("clientVisible"), true),
          q.eq(q.field("clientSummary"), undefined)
        )
      )
      .paginate({ cursor: args.cursor ?? null, numItems: 100 });

    for (const event of result.page) {
      const clientSummary = deriveClientSummary(event);
      if (clientSummary) await ctx.db.patch(event._id, { clientSummary });
    }

    return { processed: result.page.length, cursor: result.continueCursor, hasMore: !result.isDone };
  },
});

function deriveClientSummary(event: any): string | null {
  const safeMap: Record<string, string> = {
    "deal.stage_changed": "Your deal advanced to the next phase.",
    "deal.gate_cleared":  "A milestone was completed.",
    "document.signed":    "A document was signed.",
    "task.completed":     "A task was completed.",
    "email.sent":         "Your team sent a communication.",
  };
  return safeMap[event.eventType] ?? null;
}
```

---

## 13. Write Strategy — Best-Effort Awaited

**Always `await logEvent(ctx, payload)`.** Never `void logEvent(...)`.

- Errors caught inside `logEvent`, logged, never block the caller
- Dev guard re-throws for missing `clientSummary` and unknown `eventType`
- `teamVisible`/`clientVisible` derived in emitter — never passed by callers
- `clientActorLabel` always `"Forhemit Team"` — policy in `resolveActor`, not call sites
- `idempotencyKey` checked before insert — prevents webhook duplicates
- `links` truncated to max 5
- `occurredAt` defaults to `Date.now()`, overridable for webhook events
- `incrementStats` runs inside `logEvent` — stats always current

---

## 14. Wiring Plan

### Batch 1 (Phase 1)

| File | Events |
|---|---|
| `crmCompanies.ts` | 10 deal lifecycle events |
| `workflowTasks.ts` | 5 task events |
| `dealTracker.ts` | 4 tracker events |
| `posts.ts` | 2 system events |
| `contactSubmissions.ts` | 1 event |
| `documentAudit.ts` | 3 document events |
| Email mutations | 3 email events |
| Clerk webhook | 2 auth events |

### Batch 2 (Phase 2)

| File | Events |
|---|---|
| Document mutations | `document.generated`, `document.uploaded`, `document.emailed` |
| Email mutations | `email.opened`, `email.failed` |

### Batch 3 (Phase 3)

| File | Events |
|---|---|
| Agent mutations | 6 agent events |
| Journal mutations | 3 journal events |
| Remaining tracker events | `tracker.gate_blocked`, `tracker.phase_entered` |

### Batch 4 (Phase 4)

| File | Events |
|---|---|
| Box provisioner | `box.folder_provisioned`, `box.link_generated` |
| Session routes | `box.session_started`, `box.session_revoked` |
| Interaction routes | `client.feed_opened`, `client.event_acknowledged`, `client.box_link_opened` |

---

## 15. Implementation Order

```
Phase 0 — Box Feasibility (½ day, FIRST)
  0a. Build static "Hello World" embed in target Box environment
  0b. Validate: loads, cookies work, CSP works, customer tenant OK
  0c. Decision: Web Link (v1) vs UI Element (v2)

Phase 1 — Foundation
  1.  Schema: businessLog + businessLogInteractions + boxLogSessions + businessLogStats + auditLogs correlationId
  2.  Constants: logEvents.constants.ts (complete, incl. Box + Client actions)
  3.  Utilities: resolveActor.ts, correlationId.ts, clientProjection.ts
  4.  Emitter: logEvent.ts (best-effort awaited, fail-closed, idempotent, sanitize, incrementStats)
  5.  Queries: listAll, listForTeam, listClientPreview, listForBoxEmbed (stub), getStats, getByCorrelationId
  6.  Interactions: businessLogInteractions.ts (recordSeen deduped, recordAcknowledged, getUnacknowledgedCount)
  7.  Sessions: boxLogSessions.ts (createSession, markExchanged, findByHash, revokeSession)
  8.  Cron: weekly purge (activity only, stats decrement)
  9.  Wire Batch 1: crm, tasks, tracker, posts, docs, email, auth

Phase 2 — Admin UI
  10. Rebuild /admin/audit — 3 tabs, stats cards, Client Preview (toClientProjection)
  11. Wire Batch 2: remaining document + email events

Phase 3 — Enrichment
  12. Wire Batch 3: agents, journal, remaining tracker events
  13. correlationId deep-links to auditLogs in expanded row

Phase 4 — Box Embed
  14. /embed/box/activity page + POST session exchange + events route + interactions route
  15. CSP headers + rate limiting
  16. Admin "Generate Box link" flow + "Manage Box links" panel
  17. Wire Batch 4: box + client interaction events
  18. Run backfillClientSummary migration for existing clientVisible events

Phase 5 — Scale (when triggered)
  19. Stats already materialized — verify performance at >100K rows
```

---

## 16. Files Created/Modified

```
packages/convex/convex/schema.ts                         ← MODIFY
packages/convex/convex/lib/logEvents.constants.ts        ← CREATE
packages/convex/convex/lib/resolveActor.ts                ← CREATE
packages/convex/convex/lib/correlationId.ts               ← CREATE
packages/convex/convex/lib/clientProjection.ts            ← CREATE
packages/convex/convex/lib/logEvent.ts                    ← CREATE
packages/convex/convex/businessLog.ts                     ← CREATE
packages/convex/convex/businessLogInteractions.ts         ← CREATE
packages/convex/convex/boxLogSessions.ts                  ← CREATE
packages/convex/convex/auditLogs.ts                       ← MODIFY
packages/convex/convex/crons.ts                           ← MODIFY
packages/convex/convex/migrations/backfillClientSummary.ts ← CREATE (Phase 4)
packages/convex/convex/crmCompanies.ts                    ← MODIFY
packages/convex/convex/workflowTasks.ts                   ← MODIFY
packages/convex/convex/dealTracker.ts                     ← MODIFY
packages/convex/convex/posts.ts                           ← MODIFY
packages/convex/convex/contactSubmissions.ts              ← MODIFY
packages/convex/convex/documentAudit.ts                   ← MODIFY
apps/admin/app/admin/audit/page.tsx                       ← REBUILD
apps/admin/app/admin/audit/_components/AllActivityTab.tsx ← CREATE
apps/admin/app/admin/audit/_components/TeamTab.tsx        ← CREATE
apps/admin/app/admin/audit/_components/ClientTab.tsx      ← CREATE
apps/admin/app/admin/audit/_components/EventRow.tsx       ← CREATE
apps/admin/app/admin/audit/_components/EventFilters.tsx   ← CREATE
apps/admin/app/admin/audit/_components/BoxLinkPanel.tsx   ← CREATE
apps/admin/app/embed/box/activity/page.tsx                ← CREATE (Phase 4)
apps/admin/app/api/embed/box-log/session/route.ts         ← CREATE (Phase 4)
apps/admin/app/api/embed/box-log/events/route.ts          ← CREATE (Phase 4)
apps/admin/app/api/embed/box-log/interactions/route.ts    ← CREATE (Phase 4)
```

---

## 17. Hardening Decisions

| # | Decision | Status |
|---|----------|--------|
| Write strategy | Best-effort awaited (always `await`, errors caught inside) | ✅ |
| Visibility | Boolean indexes (`teamVisible`, `clientVisible`), derived in emitter, never passed | ✅ |
| Client safety | `clientSummary` + `publicMetadata` + `clientActorLabel`; fail-closed; TypeScript discriminated union | ✅ |
| Security rules | Permanent comment in logEvent.ts — no internal data in client responses | ✅ |
| Box embed | `/embed/box/activity` + POST session exchange + one-time token | ✅ |
| Box projection | `toClientProjection` mandatory on all embed responses | ✅ |
| Client interactions | Separate `businessLogInteractions` table; deduped `seen`; v1=read+ack+open | ✅ |
| Box sessions | `exchangedAt` + `exchangeCount` + `sessionCookieHash` for one-time guard | ✅ |
| Token exchange | POST, not GET — prevents token in logs/referrers | ✅ |
| Metadata limits | 2KB internal, 1KB public; truncated automatically | ✅ |
| Links limit | Max 5 per event; truncated in emitter | ✅ |
| Retention | Activity 3y purge, Compliance forever | ✅ |
| Stats | Materialized from day one (`businessLogStats`) | ✅ |
| Pagination | Cursor for All/Client; single-stream cursor for Team (boolean index); overfetch ×3 for in-memory filters | ✅ |
| `occurredAt` | Separate from `_creationTime` — defaults to `Date.now()`, overridable for webhooks | ✅ |
| `idempotencyKey` | Prevents webhook duplicates — checked before insert | ✅ |
| `scopeType`/`scopeId` | For events without `companyId` (auth, system) | ✅ |
| `auditLogs` link | `correlationId` → field diff drawer | ✅ |
| `relatedRoles` | In-memory filter (v1 acceptable) | ✅ Documented |
| Client model | Single client, single deal | ✅ |
| Client auth | Clerk metadata or `users.companyId`, never URL params | ✅ |
| Projections | Formalized: `toAdminProjection`, `toTeamProjection`, `toClientProjection` | ✅ |
| Actor resolution | `resolveActor()` with `clientActorLabel` always "Forhemit Team" | ✅ |
| `boxActor` | "Forhemit Team" → "Box" for client — Box is an approved visible actor | ✅ |
| Correlation IDs | `makeCorrelationId()` — timestamp + random, unique under concurrency | ✅ |
| Backfill plan | `backfillClientSummary` migration in Phase 4 | ✅ |
| Phase 0 | Box Hello World embed in real customer environment before any Box engineering | ✅ |

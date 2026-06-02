06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Business Log — Implementation Checklist

> **Full plan:** `docs/business-log-plan.md` (v8 FINAL)
> **Status:** Ready to build

---

## v8 Final Changes

| # | Change | Source |
|---|---|---|
| 1 | `boxLogSessions`: `exchangedAt`, `sessionCookieHash`, `exchangeCount` for one-time token guard | Review 1 |
| 2 | `toClientProjection`: typed interface + runtime guard + safe fallback | Review 1 |
| 3 | `listForTeam`: single-stream via boolean index, overfetch `pageSize * 3` documented | Review 1+2 |
| 4 | `recordSeen`: deduplicated via `by_event_viewer` index | Review 1 |
| 5 | Phase 0: Web Link vs UI Element vs Custom App + Hello World embed | Review 1+2 |
| 6 | `links[]`: max 5 enforced in emitter | Review 1 |
| 7 | Admin preview: read-only, separated from manage controls | Review 1 |
| 8 | `backfillClientSummary` migration in Phase 4 | Review 1 |
| 9 | `occurredAt` field (separate from `_creationTime`) | Review 2 |
| 10 | `idempotencyKey` field + index (prevent webhook duplicates) | Review 2 |
| 11 | Discriminated union types (`InternalEvent \| ClientVisibleEvent`) for TypeScript enforcement | Review 2 |
| 12 | Removed redundant `by_time` index (Convex auto-indexes `_creationTime`) | Review 2 |
| 13 | Token exchange: POST, not GET | Review 2 |
| 14 | `scopeType`/`scopeId` for events without `companyId` | Review 2 |
| 15 | Security rules as permanent comment in `logEvent.ts` | Review 2 |
| 16 | `clientActorLabel` always "Forhemit Team" — policy in `resolveActor` | Review 1 |
| 17 | Comments deferred to v2 embed (v1 = read + acknowledge + open links) | Review 2 |
| 18 | Projections formalized: `toAdminProjection`, `toTeamProjection`, `toClientProjection` | Review 2 |

---

## Checklist

### Phase 0 — Box Feasibility (½ day, FIRST)

- [ ] **0.1** Build static "Hello World" embed in target Box environment
- [ ] **0.2** Validate: loads correctly, cookies work, CSP works, customer tenant OK
- [ ] **0.3** Decision documented: Web Link (v1) vs Box UI Element (v2)

### Phase 1 — Foundation

- [ ] **1.1 Schema** — Add to `packages/convex/convex/schema.ts`:
  - [ ] `businessLog` — complete with `occurredAt`, `idempotencyKey`, `scopeType`/`scopeId`, `clientSummary`, `publicMetadata`, `clientActorLabel`, `teamVisible`, `clientVisible`, `links[]`, 9 indexes (no `by_time`)
  - [ ] `businessLogInteractions` — `seen`/`acknowledged`/`opened_link` (4 indexes incl. `by_company_time`)
  - [ ] `boxLogSessions` — `exchangedAt`, `sessionCookieHash`, `exchangeCount` for one-time guard (2 indexes)
  - [ ] `businessLogStats` — materialized counts (1 index)
  - [ ] `auditLogs` — add `correlationId` + `by_correlation` index
  - [ ] `users` — add `companyId` field

- [ ] **1.2 Constants** — Create `packages/convex/convex/lib/logEvents.constants.ts`:
  - [ ] `LOG_ACTIONS` — 53 action constants (4 Box + 3 Client v1)
  - [ ] `LOG_RETENTION` — complete map (every action listed)
  - [ ] `CLIENT_VISIBLE_LEVELS`, `ROLE_FILTERS`, `CATEGORY_FILTERS`, `CATEGORY_ICONS`
  - [ ] Summary style guide + security rules as comments

- [ ] **1.3 Utilities** — Create:
  - [ ] `lib/resolveActor.ts` — `resolveActor()`, `agentActor()`, `webhookActor()`, `boxActor()` — all return `clientActorLabel`
  - [ ] `lib/correlationId.ts` — `makeCorrelationId(prefix)`
  - [ ] `lib/clientProjection.ts` — `toClientProjection()` typed + runtime guard + safe fallback

- [ ] **1.4 Emitter** — Create `packages/convex/convex/lib/logEvent.ts`:
  - [ ] Discriminated union: `InternalEvent | ClientVisibleEvent` (TypeScript enforces `clientSummary` requirement)
  - [ ] `sanitize()` — 2KB internal / 1KB public
  - [ ] `incrementStats()` — supports delta for purge
  - [ ] Fail-closed: `clientVisible` requires `clientSummary` (TypeScript + runtime)
  - [ ] Dev guard: throws for unknown `eventType`
  - [ ] Idempotency check: skip if `idempotencyKey` already exists
  - [ ] Links truncation: max 5
  - [ ] Security rules as permanent comment block

- [ ] **1.5 Queries** — Create `packages/convex/convex/businessLog.ts`:
  - [ ] `listAll` — cursor pagination, `deletedAt` filter
  - [ ] `listForTeam` — single-stream (`by_team_time`), cursor pagination, overfetch `×3` for in-memory filters
  - [ ] `listClientPreview` — returns `toClientProjection`, gates `publishedAt`
  - [ ] `listForBoxEmbed` — session-token auth, `toClientProjection`, `exchangeCount` guard
  - [ ] `getStats` — materialized (constant-time key lookups)
  - [ ] `getByCorrelationId` — deep-link into `auditLogs`
  - [ ] `purgeExpiredActivityEvents` — weekly, activity only, batch 500, decrements stats
  - [ ] `resolveBoxSession()` — hash check, expiry, revocation, exchangeCount

- [ ] **1.6 Interactions** — Create `packages/convex/convex/businessLogInteractions.ts`:
  - [ ] `recordSeen` — deduplicated via `by_event_viewer` index
  - [ ] `recordAcknowledged`
  - [ ] `listByEvent`
  - [ ] `getUnacknowledgedCount`

- [ ] **1.7 Sessions** — Create `packages/convex/convex/boxLogSessions.ts`:
  - [ ] `createSession` — generates raw token, stores hash
  - [ ] `markExchanged` — one-time guard (`exchangeCount > 0` = reject)
  - [ ] `findByHash`
  - [ ] `revokeSession`
  - [ ] `findByCompany`

- [ ] **1.8 Cron** — Add to `packages/convex/convex/crons.ts`:
  - [ ] Weekly purge (Sunday 2AM UTC)

- [ ] **1.9 Wire Batch 1:**
  - [ ] `crmCompanies.ts` → 10 deal events (with `idempotencyKey`, `occurredAt`, `scopeType`)
  - [ ] `workflowTasks.ts` → 5 task events
  - [ ] `dealTracker.ts` → 4 tracker events
  - [ ] `posts.ts` → 2 system events
  - [ ] `contactSubmissions.ts` → 1 event
  - [ ] `documentAudit.ts` → 3 document events
  - [ ] Email mutations → 3 email events (with `idempotencyKey` from Resend message ID)
  - [ ] Clerk webhook → 2 auth events (with `scopeType: "user"`)

### Phase 2 — Admin UI

- [ ] **2.1 Rebuild** — `apps/admin/app/admin/audit/page.tsx`:
  - [ ] Three tabs: All Activity, Team, Client Preview (read-only, uses `toClientProjection`)
  - [ ] Stats cards: Total, Today, Warnings, Critical, Unack'd Client count
  - [ ] "Generate Box link" button + "Manage Box links" panel (separate from preview)

- [ ] **2.2 Components** — Create `apps/admin/app/admin/audit/_components/`:
  - [ ] `AllActivityTab.tsx` — cursor pagination
  - [ ] `TeamTab.tsx` — cursor pagination (single-stream), Role filter
  - [ ] `ClientTab.tsx` — company-scoped, uses `listClientPreview`
  - [ ] `EventRow.tsx` — icon, summary, actor, time, severity, expandable detail
  - [ ] `EventFilters.tsx` — Category, Severity, Role dropdowns
  - [ ] `BoxLinkPanel.tsx` — generate/revoke Box sessions

- [ ] **2.3 Expanded event detail:**
  - [ ] Internal summary + client summary (if different)
  - [ ] Metadata JSON + publicMetadata
  - [ ] Links (with client-visible indicator)
  - [ ] `[→ View field-level changes]` → `getByCorrelationId` → side drawer

- [ ] **2.4 Wire Batch 2:**
  - [ ] Document mutations → `document.generated`, `document.uploaded`, `document.emailed`
  - [ ] Email mutations → `email.opened`, `email.failed`

### Phase 3 — Enrichment

- [ ] **3.1 Wire Batch 3:**
  - [ ] Agent mutations → 6 events (with `scopeType: "company"`)
  - [ ] Journal mutations → 3 events
  - [ ] Remaining tracker events → `tracker.gate_blocked`, `tracker.phase_entered`

- [ ] **3.2 Remaining events:**
  - [ ] `system.settings_changed`, `system.export_generated`, `system.bulk_operation`
  - [ ] `auth.logout`, `auth.role_changed`

### Phase 4 — Box Embed

- [ ] **4.1 Routes** — Create:
  - [ ] `apps/admin/app/embed/box/activity/page.tsx` — iframe-safe UI, v1 (read + ack + open links, no comments)
  - [ ] `apps/admin/app/api/embed/box-log/session/route.ts` — POST: token exchange → HttpOnly cookie
  - [ ] `apps/admin/app/api/embed/box-log/events/route.ts` — paginated feed via `toClientProjection`
  - [ ] `apps/admin/app/api/embed/box-log/interactions/route.ts` — acknowledge + open links

- [ ] **4.2 Security:**
  - [ ] POST token exchange (not GET)
  - [ ] One-time: `exchangeCount` guard
  - [ ] Cookie: `SameSite=None; Secure; HttpOnly; Path=/embed`
  - [ ] CSP: `frame-ancestors box.com app.box.com`
  - [ ] Session: 8h default, 24h max, revocable
  - [ ] Rate limit: 60 req/min events, 30 req/min interactions
  - [ ] All responses through `toClientProjection`
  - [ ] No Clerk cookies trusted in `/embed/*`

- [ ] **4.3 Admin flow:**
  - [ ] "Generate Box link" → `boxLogSessions.createSession`
  - [ ] "Manage Box links" → list, revoke
  - [ ] Copy URL button

- [ ] **4.4 Wire Batch 4:**
  - [ ] Box provisioner → `box.folder_provisioned`, `box.link_generated`
  - [ ] Session routes → `box.session_started`, `box.session_revoked`
  - [ ] Interaction routes → `client.feed_opened`, `client.event_acknowledged`, `client.box_link_opened`

- [ ] **4.5 Backfill:**
  - [ ] Run `backfillClientSummary` migration for existing `clientVisible` events without `clientSummary`

### Phase 5 — Scale (when triggered)

- [ ] **5.1** Verify materialized stats performance at >100K rows

---

## Files Summary

| File | Action | Phase |
|---|---|---|
| `packages/convex/convex/schema.ts` | Modify | 1 |
| `packages/convex/convex/lib/logEvents.constants.ts` | **Create** | 1 |
| `packages/convex/convex/lib/resolveActor.ts` | **Create** | 1 |
| `packages/convex/convex/lib/correlationId.ts` | **Create** | 1 |
| `packages/convex/convex/lib/clientProjection.ts` | **Create** | 1 |
| `packages/convex/convex/lib/logEvent.ts` | **Create** | 1 |
| `packages/convex/convex/businessLog.ts` | **Create** | 1 |
| `packages/convex/convex/businessLogInteractions.ts` | **Create** | 1 |
| `packages/convex/convex/boxLogSessions.ts` | **Create** | 1 |
| `packages/convex/convex/auditLogs.ts` | Modify | 1 |
| `packages/convex/convex/crons.ts` | Modify | 1 |
| `packages/convex/convex/crmCompanies.ts` | Modify | 1 |
| `packages/convex/convex/workflowTasks.ts` | Modify | 1 |
| `packages/convex/convex/dealTracker.ts` | Modify | 1 |
| `packages/convex/convex/posts.ts` | Modify | 1 |
| `packages/convex/convex/contactSubmissions.ts` | Modify | 1 |
| `packages/convex/convex/documentAudit.ts` | Modify | 1 |
| `packages/convex/convex/migrations/backfillClientSummary.ts` | **Create** | 4 |
| `apps/admin/app/admin/audit/page.tsx` | **Rebuild** | 2 |
| `apps/admin/app/admin/audit/_components/AllActivityTab.tsx` | **Create** | 2 |
| `apps/admin/app/admin/audit/_components/TeamTab.tsx` | **Create** | 2 |
| `apps/admin/app/admin/audit/_components/ClientTab.tsx` | **Create** | 2 |
| `apps/admin/app/admin/audit/_components/EventRow.tsx` | **Create** | 2 |
| `apps/admin/app/admin/audit/_components/EventFilters.tsx` | **Create** | 2 |
| `apps/admin/app/admin/audit/_components/BoxLinkPanel.tsx` | **Create** | 2 |
| `apps/admin/app/embed/box/activity/page.tsx` | **Create** | 4 |
| `apps/admin/app/api/embed/box-log/session/route.ts` | **Create** | 4 |
| `apps/admin/app/api/embed/box-log/events/route.ts` | **Create** | 4 |
| `apps/admin/app/api/embed/box-log/interactions/route.ts` | **Create** | 4 |

---

## Definition of Done

- [ ] Admin sees every event in All Activity tab
- [ ] Team tab: single-stream boolean index query, cursor pagination works, no duplicates
- [ ] Client Preview shows exactly what client sees (server-side `toClientProjection`)
- [ ] Box embed: iframe-safe, POST token exchange, one-time guard, CSP, rate limiting
- [ ] `clientSummary` required for all client-visible events (TypeScript discriminated union + runtime fail-closed)
- [ ] `toClientProjection` enforced on all client/Box responses (no raw rows leak)
- [ ] `idempotencyKey` prevents webhook duplicate events
- [ ] `occurredAt` reflects when event actually happened (not when stored)
- [ ] Stats cards: materialized, constant-time, include unacknowledged client count
- [ ] Metadata: 2KB internal, 1KB public, auto-truncated
- [ ] Links: max 5 per event, auto-truncated
- [ ] Activity events auto-purge after 3 years (weekly cron, stats decremented)
- [ ] Compliance events never purge
- [ ] `deletedAt` + `publishedAt` filters on all client queries
- [ ] `auditLogs` deep-links work via `correlationId`
- [ ] Best-effort awaited: always `await logEvent(...)`, errors caught, never blocks mutation
- [ ] Dev guard: throws for missing `clientSummary` on client-visible events
- [ ] Dev guard: throws for unknown `eventType` in `LOG_RETENTION`
- [ ] Actor resolution: `resolveActor()` with `clientActorLabel` always "Forhemit Team"
- [ ] `boxActor()` returns "Box" as client-visible actor label
- [ ] `recordSeen` deduplicated per viewer per event
- [ ] Box sessions: one-time token, revocable, hashed, expiring
- [ ] Client Preview + Box Embed read from same query path — no drift
- [ ] Security rules documented permanently in `logEvent.ts`

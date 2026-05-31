05/31/26 02:01 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Client Journals — Next Steps & Production Checklist

Generated 2026-05-30 after session that built the core journal system.

---

## Production Readiness Checklist

Before going live with real clients, complete these:

### Configuration
- [ ] **Box shared link setup** — Create shared link for each client folder, store URL + password in `clientJournals.boxSharedLink`
- [ ] **Resend webhook** — Add `https://your-domain.com/api/resend/webhook` at resend.com/webhooks, subscribe to `email.opened` + `email.clicked`
- [ ] **Box webhook** — Configure at developer.box.com for `SIGNATURE` and `FILE` events → `https://your-domain.com/api/box/webhook`
- [ ] **ADMIN_APP_URL** — Set env var in Convex dashboard (e.g., `https://admin.forhemit.com`) for PDF generation
- [ ] **Digest recipients** — Set `digestRecipients` array on each journal with client email addresses
- [ ] **Demo cleanup** — Delete Sunrise Manufacturing, Pacific Coast Logistics, Greenfield Engineering from CRM

### Schema Migration (if upgrading existing deployment)
- [ ] Run `npx convex dev` to push new tables: `clientJournals`, `journalEntries`, `journalNarratives`, `journalDigests`, `journalChapters`
- [ ] Verify all indexes created correctly
- [ ] Test cron job registered (Tuesday 2AM PST)

### Testing
- [ ] **End-to-end flow** — Create journal → add manual entry → write narrative → mark ready → trigger digest → verify PDF in Box → verify email sent
- [ ] **Auto-entries** — Verify document signing, task completion, stage change, and email sent all create journal entries
- [ ] **Fallback narrative** — Test digest with no narrative written (should auto-generate)
- [ ] **Phase close summary** — Advance a deal stage and verify chapter close summary PDF generated
- [ ] **CSV import** — Test bulk import with 5+ rows, verify all entries created
- [ ] **Engagement tracking** — Send test email, open it, verify `lastEmailOpenedAt` updates
- [ ] **PDF quality** — Review generated PDF for branding, layout, readability

---

## Phase 8: Multi-Deal Support (Future)

### When to build
When a client has multiple active engagements (e.g., completed Transition + active Stewardship, or a second ESOP transaction).

### Architecture
- [ ] Create `deals` table: `{ clientId, name, dealType, status, startedAt, closedAt }`
- [ ] Migrate `clientJournals.clientId` → `clientJournals.dealId`
- [ ] Backfill: one deal per existing client
- [ ] Update `autoLog` to resolve journal by deal, not just client
- [ ] Update admin UI to show deals per company
- [ ] Update journal creation to require deal selection

### Migration path
The current schema is designed for clean migration. `clientJournals.clientId` becomes `clientJournals.dealId` with a one-time backfill script. No data loss.

---

## Phase 9: Client Portal (Future)

### When to build
When Box shared links aren't enough — clients want to see entries in a web UI, add comments, or upload documents.

### Architecture
- [ ] New `apps/portal` Next.js app (or route in existing app)
- [ ] Clerk authentication with client-specific org
- [ ] Read-only view of journal entries (filtered by `visibleToClient: true`)
- [ ] Narrative viewer with chapter history
- [ ] Action items view (client's open items)
- [ ] Document viewer (embed Box preview)
- [ ] Optional: client can add comments on entries

### Scope control
Start with read-only. Client comments and uploads are a separate phase.

---

## Technical Debt

- [ ] **Entry type mapping** — `journalDigests.metrics.entriesByEffort` maps to entry types, not effort bands. Rename field or fix mapping.
- [ ] **PDF generation** — Currently calls admin app HTTP endpoint. Consider moving to a Convex component or serverless function for independence.
- [ ] **Chapter numbering** — Currently stored on journal as `chapterNumber`. Should derive from `journalChapters` table instead.
- [ ] **Auth on auto-entries** — `autoLog` uses no auth (internal). Verify this is intentional and document the security boundary.
- [ ] **Error handling** — Journal hooks are fire-and-forget. Add a dead-letter queue or error log for failed auto-entries.

---

## Quick Reference: What's Built

| Feature | Status | Notes |
|---------|--------|-------|
| 5-table schema | ✅ | clientJournals, journalEntries, journalNarratives, journalDigests, journalChapters |
| Auto-entry hooks | ✅ | Box, tasks, stages, documents, emails |
| Admin journal list | ✅ | Company name, type, chapter, engagement badges |
| Manual entry form | ✅ | 10 quick templates, visibility toggle |
| CSV bulk import | ✅ | Paste CSV, preview, import |
| Entry filtering | ✅ | Theme, type, source, visibility |
| Rich text editor | ✅ | TipTap with preview mode |
| Action items | ✅ | Due dates, mark complete, overdue highlighting |
| Milestone progress | ✅ | Visual timeline with checkmarks |
| Effort chart | ✅ | Pure CSS horizontal bar by theme |
| Weekly narrative | ✅ | Account lead writes, marks ready |
| Auto-narrative fallback | ✅ | Generates from entries if not ready |
| PDF generation | ✅ | Puppeteer, Forhemit branded |
| Email digest | ✅ | Resend with metrics + Box link |
| Engagement tracking | ✅ | Resend webhook for opens/clicks |
| Phase close summary | ✅ | Chapter book on stage transition |
| Chapter history | ✅ | Timeline with status badges |

---

## Session Stats

- **Commits**: 12
- **Files modified**: ~25
- **Lines added**: ~3,500+
- **Duration**: Single session
- **Approach**: Incremental — built schema first, then CRUD, then UI, then integrations

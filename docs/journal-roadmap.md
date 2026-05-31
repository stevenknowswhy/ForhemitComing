05/31/26 01:55 AM PT
05/31/26 01:44 AM PT
05/31/26 01:33 AM PT
05/31/26 12:55 AM PT
05/30/26 07:27 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Client Journal — Roadmap

> Transparency engine for ESOP transition and stewardship engagements.
> Clients never wonder "what are we doing?" — the journal tells them.

## Status

| Phase | Status | Commit |
|---|---|---|
| 1. Schema + CRUD | ✅ Done | — |
| 2. Auto-entry hooks | ✅ Done | — |
| 3. Admin journal UI | ✅ Done | — |
| 4. Quick wins (UI polish) | ✅ Done | — |
| 5. PDF generation | ✅ Done | — |
| 6. Email digest | ✅ Done | — |
| 7. Advanced features | 🔄 In progress | 4b851b2 |

---

## Quick Wins (UI Polish)

- [x] **Manual entry form** — account lead logs calls, meetings, decisions from the UI
- [x] **Entry filtering** — filter by theme, type, auto vs manual, visibility
- [x] **Outcome field display** — surface `outcome` prominently on entry cards
- [x] **Action item tracking** — entries with dueDate grouped Overdue/Due This Week/Upcoming, mark-complete
- [x] **Milestone progress bar** — progress bar + timeline for milestone entries

---

## Core Features (Phase 4–5)

- [x] **PDF generation** — Puppeteer renders journal to branded PDF via Tuesday 2AM cron
- [x] **Box upload** — PDF uploaded to client's Box folder, versioned file
- [x] **Email digest** — weekly email with metrics, narrative excerpt, and Box link
- [x] **Auto-narrative fallback** — if account lead doesn't mark "ready" by deadline
- [x] **Effort-by-theme chart** — horizontal bar chart by theme with effort weights

---

## Advanced Features (Future)

- [x] **Phase close summary** — "chapter book" when transitioning phases
  - Auto-closes chapter + creates new one on stage transition
  - Generates branded PDF with all chapter entries + metrics
  - Uploads to Box, marks chapter as completed
  - Chapter history timeline in admin UI

- [x] **Client engagement tracking** — did they open the email? View the PDF?
  - Resend email open tracking via webhook
  - Engagement badges in admin UI: "📧 Opened 2h ago, 📄 Viewed yesterday"
  - Box file view tracking fields ready (webhook endpoint pending Box app config)

- [x] **Rich text editor** — TipTap with bold/italic/headings/lists/quotes + preview mode

- [x] **Entry templates** — 10 pre-built templates (Trustee Call, Document Review, Valuation Meeting, Tax Discussion, Legal Review, Board Meeting, Signature Request, Due Diligence, Compliance Check, Internal Note)

- [ ] **Bulk entry import** — import entries from calendar/email
  - Parse calendar events → entries
  - Parse email threads → entries
  - Account lead reviews before saving

- [ ] **Multi-deal support** — when a client has multiple engagements
  - Add `deals` table (Path B from schema discussion)
  - Migrate `clientJournals.clientId` → `clientJournals.dealId`
  - Backfill one deal per client

- [ ] **Client portal** — if shared links aren't enough
  - Clerk-authenticated portal
  - Journal history view
  - Action item completion
  - Document download

---

## Schema Reference

### Tables
- `clientJournals` — one per client per type (transition/stewardship)
- `journalEntries` — individual activity logs (auto + manual)
- `journalNarratives` — weekly account lead write-ups
- `journalDigests` — generated PDFs with metrics snapshot
- `journalChapters` — phase definitions within a journal

### Key Fields
- `entries.visibleToClient` — controls what the client sees
- `entries.internalNote` — never shown to client
- `entries.outcome` — value/impact statement
- `entries.effortBand` — null on auto-entries, human-judged on manual
- `narratives.status` — draft → ready → sent
- `narratives.usedFallback` — true if system generated the summary

### Auto-Entry Hooks
| Event | Source | Entry Type |
|---|---|---|
| Document signed | Box webhook | signature |
| Signature declined/expired | Box webhook | issue (internal) |
| Task completed | Convex mutation | work |
| Stage advanced | Convex mutation | milestone |
| Document generated | Admin API → Convex HTTP | document |
| Email sent | Convex action | email |

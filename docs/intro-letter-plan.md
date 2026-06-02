06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Client Letters — Implementation Plan

## Overview

Two client-facing letters that form the opening sequence of the deal pipeline:

1. **Introduction Letter** — Warm first-contact. Sets the tone, explains what Forhemit does, how the process works, why it matters. No numbers, no fees.
2. **Preliminary Review Letter** — Assessment/alignment letter. Includes initial valuation perspective, fee structure, and how Forhemit is paid.

**Pipeline Position:** `First contact` → **Introduction Letter** → `Intro call` → ... → **Preliminary Review Letter** → ...

Both letters: auto-pull CRM data, generate branded PDF, send via Resend, log to all three business log tiers.

---

## Architecture

### Letter Sections

```
┌─────────────────────────────────────────────┐
│  Forhemit — Transition Stewardship          │
│  [Navy/Brass header, matching brand]        │
├─────────────────────────────────────────────┤
│  Date                                       │
│  Client Name                                │
│  Company Name                               │
│  Address                                    │
├─────────────────────────────────────────────┤
│  RE: {companyName} — Introduction           │
├─────────────────────────────────────────────┤
│                                             │
│  § A Personal Introduction                  │
│  "Dear {firstName},"                        │
│  Opening paragraph — why we're reaching out │
│  and what caught our attention about their  │
│  company specifically.                      │
│                                             │
│  § How We View Your Transition              │
│  [Auto-pulled: industry, EBITDA, revenue,   │
│   employees, location]                      │
│  [Editable narrative field for custom       │
│   deal commentary]                          │
│                                             │
│  § What to Expect from Forhemit             │
│  [120-day roadmap overview]                 │
│  [5 phases, 4 gates, team roles]            │
│  [Your role vs. our role]                   │
│  [Fee structure — retainer at engagement,   │
│   success fee at closing]                   │
│                                             │
│  § About Your Steward                       │
│  [Stefano bio — disaster planning,          │
│   stewardship philosophy, credentials]      │
│  [Editable with defaults]                   │
│                                             │
│  § Next Steps                               │
│  [Intro call scheduling]                    │
│  [What to prepare: financials, org chart,   │
│   ownership structure]                      │
│  [NDA — we'll send for review]              │
│                                             │
├─────────────────────────────────────────────┤
│  Signature block                            │
│  Stefano Stokes                             │
│  Founder & Managing Director                │
│  Forhemit Transition Stewardship            │
│  stefano.stokes@forhemit.com                │
│  424-253-4019                               │
└─────────────────────────────────────────────┘
```

### Frontend Components

| File | Purpose |
|---|---|
| `apps/admin/app/admin/letters/components/ClientIntroductionLetter.tsx` | Introduction Letter — form + preview + send |
| `apps/admin/app/admin/letters/components/ClientIntroductionLetter.css` | Introduction Letter styles |
| `apps/admin/app/admin/letters/components/PreliminaryReviewLetter.tsx` | Preliminary Review — form + preview + send |
| `apps/admin/app/admin/letters/components/PreliminaryReviewLetter.css` | Preliminary Review styles |

### Integration Points

| Location | Change |
|---|---|
| `apps/admin/app/admin/letters/page.tsx` | ✅ Added both cards to `letterTemplates` array |
| `apps/admin/app/admin/crm/components/CompanyDetailPanel.tsx` | ✅ Added "Letters" section with Intro + Preliminary Review buttons + modal |
| `packages/convex/convex/clientEmails.ts` | ✅ New Convex actions + business log mutation |

### Data Flow

```
User clicks "Create Letter"
  ↓
[Letters page] → empty form, user picks company
  — OR —
[CRM detail] → pre-fills company data from crmCompanies record
  ↓
Form shows:
  - Company name, industry, EBITDA, revenue, employees (from CRM)
  - Editable "deal narrative" textarea
  - Editable "about your steward" bio textarea
  - Sender info (Stefano defaults, editable)
  ↓
User clicks "Preview & Send"
  ↓
Modal shows:
  - To: (editable, defaults to primary contact email)
  - Subject: (editable, defaults to "Forhemit — Introduction for {companyName}")
  - PDF attachment toggle (generates via /api/pdf-generate)
  - Editable email body (pre-filled from letter content)
  ↓
User clicks "Send"
  ↓
Convex action → Resend API → email sent
  ↓
Business log entries:
  1. DOC_GENERATED (internal, teamVisible) — "Introduction Letter generated for Acme Corp"
  2. DOC_EMAILED (external, clientVisible) — clientSummary: "Forhemit shared an introduction letter"
```

---

## Business Log Integration

### Event Types

```typescript
// In logEvents.constants.ts — add to LOG_ACTIONS:
CLIENT_INTRO_LETTER_GENERATED: "client_intro_letter.generated",
CLIENT_INTRO_LETTER_SENT: "client_intro_letter.sent",
```

### Log Entries

**When PDF is generated:**
```typescript
await logEvent(ctx, {
  eventType: LOG_ACTIONS.DOC_GENERATED,
  category: "document",
  summary: `Introduction Letter generated for ${companyName}`,
  actorType: "user",
  actorId: userId,
  actorLabel: "Stefano Stokes",
  source: "admin_ui",
  companyId: companyId,
  entityType: "introductionLetter",
  severity: "info",
  visibility: "internal",
});
```

**When email is sent:**
```typescript
await logEvent(ctx, {
  eventType: LOG_ACTIONS.DOC_EMAILED,
  category: "email",
  summary: `Introduction Letter emailed to ${recipientEmail} for ${companyName}`,
  actorType: "user",
  actorId: userId,
  actorLabel: "Stefano Stokes",
  clientActorLabel: "Forhemit Team",
  source: "admin_ui",
  companyId: companyId,
  entityType: "introductionLetter",
  severity: "info",
  visibility: "external",
  clientSummary: "Forhemit shared an introduction letter outlining our assessment of your company and the transition process",
  publicMetadata: {
    recipientEmail,
    documentType: "introduction_letter",
  },
});
```

### Retention Classes
```typescript
"client_intro_letter.generated": "activity",
"client_intro_letter.sent": "activity",
```

---

## Default Bio Text (Editable)

```
Stefano Stokes is the Founder and Managing Director of Forhemit Transition Stewardship. His background is in disaster planning and mitigation — a discipline built on one principle: there are no acceptable excuses for failure.

In Stefano's world, a disaster is anything that stops the business from operating. A cyber attack. Your three most senior people quitting the same day. Your biggest vendor going out of business. And none of them are an acceptable reason to miss a deadline. The checks still need to go out on Friday. The applications still need to be processed. Investors, lenders, vendors get paid on time and on schedule.

That same discipline drives how Forhemit manages ownership transitions. Every engagement is structured around a 120-day roadmap with hard gates at every milestone. The owner runs the business. Forhemit runs the deal.
```

---

## Default Email Body

```
Dear {firstName},

I appreciate you taking the time to speak with us about {companyName}. After reviewing your company's position — {industry}, {revenue} in revenue, {employees} employees — I want to share how we see your transition and what you can expect from working with Forhemit.

[Deal narrative paragraph — editable]

I've attached our Introduction Letter which walks through our process, timeline, and what the next steps look like. I'd like to schedule an introductory call to discuss your goals and answer any questions you have.

Would {suggestedDate} work for a 30-minute conversation?

With respect,
Stefano Stokes
Founder & Managing Director
Forhemit Transition Stewardship
stefano.stokes@forhemit.com
424-253-4019
```

---

## Convex Schema — No Changes Needed

The existing `crmCompanies` table has all fields we need:
- `name`, `industry`, `size`, `revenue`, `ebitda`
- `stage`, `ref`
- `sellerContactId` (for pre-filling recipient)

The existing `businessLog` table and `logEvent` function handle logging.
The existing `http.ts` `/send-email` action handles Resend delivery.

---

## UI Access Points

### 1. Letters Page
Add to `letterTemplates` array in `apps/admin/app/admin/letters/page.tsx`:
```typescript
{
  id: "client-intro-letter",
  name: "Client Introduction Letter",
  description: "Generate a personalized introduction letter for a client before the Intro Call — includes deal assessment, process overview, and your bio",
  category: "Clients",
  status: "active",
  version: "1.0",
  component: ClientIntroductionLetter,
}
```

### 2. CRM Company Detail Panel
Add button in `CompanyDetailPanel.tsx` Actions section:
```tsx
<button 
  className="crm-action-btn"
  onClick={() => openIntroLetter(company)}
>
  📝 Generate Intro Letter
</button>
```

This opens the same `ClientIntroductionLetter` component in a modal with company data pre-filled.

---

## Implementation Order

1. **Create `ClientIntroductionLetter.tsx` + CSS** — main component
2. **Add to Letters page** — register in letterTemplates
3. **Add Convex action** — `sendClientIntroductionEmail` in emails.ts
4. **Add business log events** — constants + log calls
5. **Add to CRM detail panel** — button + modal integration
6. **Test end-to-end** — generate PDF → preview → send → verify logs

---

## Files Created/Modified

| Action | File |
|---|---|
| CREATE | `apps/admin/app/admin/letters/components/ClientIntroductionLetter.tsx` |
| CREATE | `apps/admin/app/admin/letters/components/ClientIntroductionLetter.css` |
| CREATE | `apps/admin/app/admin/letters/components/PreliminaryReviewLetter.tsx` |
| CREATE | `apps/admin/app/admin/letters/components/PreliminaryReviewLetter.css` |
| CREATE | `packages/convex/convex/clientEmails.ts` (2 actions + 1 mutation) |
| MODIFY | `apps/admin/app/admin/letters/page.tsx` — added 2 letter cards |
| MODIFY | `apps/admin/app/admin/crm/components/CompanyDetailPanel.tsx` — added Letters section + modal |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Company has no contact email | Show warning, allow manual entry |
| PDF generation fails | Graceful fallback, allow print instead |
| Resend API down | Error toast, retry button |
| Business log write fails | Best-effort (existing pattern) — never blocks email send |
| Company data incomplete | Show placeholders, make fields editable |

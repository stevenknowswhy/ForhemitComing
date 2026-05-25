# Forhemit Document Templates

Unified template system organized by pipeline stage and access level.

## Structure

```
templates/
├── manifest.ts              # Agent-readable index (102 documents)
├── README.md                # This file
│
├── external/                # Sent outside organization
│   ├── 01-first-touch/      # Initial contact, introductions
│   ├── 02-qualification/    # Deal screener, NDA, pre-flight
│   ├── 03-engagement/       # Engagement letter, LOI, onboarding
│   ├── 04-diligence/        # Gate confirmations, status updates
│   ├── 05-closing/          # Closing docs, announcements
│   └── 06-post-close/       # COOP stewardship, reports
│
├── internal/                # Never leaves organization
│   ├── 01-first-touch/      # Scripts, standards, reminders
│   ├── 02-qualification/    # Intake forms, internal announcements
│   ├── 03-engagement/       # Kickoff, vendor onboarding, conflict log
│   ├── 04-diligence/        # Gate tracking, invoices, memos
│   ├── 05-closing/          # Legal clearance, closing checklist
│   └── 06-post-close/       # Lessons learned, COOP intake
│
└── shared/                  # Reusable components
    ├── styles/              # Brand system (fonts, colors, print)
    └── components/          # Header, footer, signature blocks
```

## Pipeline Stages

| Stage | Description | Gate |
|-------|-------------|------|
| `01-first-touch` | Initial contact, introductions, outreach | Pre-Gate |
| `02-qualification` | Deal screener, pre-flight, NDA | Gate 1 |
| `03-engagement` | Engagement letter, LOI, advisor intros | Gate 2 |
| `04-diligence` | Lender package, board resolutions, gate confirmations | Gate 3 |
| `05-closing` | Retainers, closing docs, announcements | Gate 4 |
| `06-post-close` | COOP stewardship, quarterly reports, completion | Post-Gate |

## Quick Start

### For Agents

```typescript
import {
  templates,
  getTemplatesByStage,
  getTemplatesByPipeline,
  getUrgentTemplates,
  getTemplateStats
} from './manifest';

// Get all qualification documents
const qualDocs = getTemplatesByStage('02-qualification');

// Get all external documents
const externalDocs = getTemplatesByPipeline('external');

// Get Deal 1 blockers
const urgentDocs = getUrgentTemplates();

// Get statistics
const stats = getTemplateStats();
// → { total: 102, external: 63, internal: 39, exists: 28, gap: 62, urgent: 12, ... }
```

### For Humans

1. **Find a template**: Check `manifest.ts` or browse the directory structure
2. **Check status**: Look at the `status` field (`exists`, `partial`, `gap`, `urgent`)
3. **Build new template**: Copy an existing one, update placeholders, add to manifest

## Template Status

- **`exists`** — Built and tested
- **`partial`** — Started but incomplete
- **`gap`** — Not yet built
- **`urgent`** — Deal 1 blocker, needs immediate attention

## Document Counts

| Pipeline | Total | Exists | Partial | Gap | Urgent |
|----------|-------|--------|---------|-----|--------|
| External | 63 | 18 | 4 | 29 | 12 |
| Internal | 39 | 5 | 5 | 29 | 0 |
| **Total** | **102** | **23** | **9** | **58** | **12** |

## Template Types

### Static Templates (no JavaScript)
- `{{placeholder}}` variables for data injection
- Print-first CSS (white background, dark text)
- Used for: notifications, confirmations, receipts
- Example: `nda-receipt-confirmation.html`

### Interactive Templates (with JavaScript)
- Control bar with toggles and print button
- Config panel with `data-dv` attribute sync
- Used for: complex agreements, forms
- Example: `engagement-letter.html`

## Shared Components

Reusable HTML/CSS components in `shared/components/`:

- `header.html` — Document header with logo and reference
- `footer.html` — Confidentiality notice and contact info
- `signature-block.html` — 2-column signature grid
- `confirmation-block.html` — Green checkmark confirmation block

## Brand System

- **Fonts**: Cormorant Garamond (display), Jost (body), DM Mono (monospace)
- **Colors**: Brass accent (#B8965A), dark default (#0D0D0D), off-white text (#F0EDE8)
- **Layout**: 820px max-width (interactive), 720px (static/PDF)

## Adding New Templates

1. Create HTML file in appropriate directory
2. Add entry to `manifest.ts` with full metadata
3. Test PDF generation with Puppeteer
4. Update this README if adding new category

## Agent Discovery Workflow

```
1. Read manifest.ts
2. Query by stage, pipeline, audience, or status
3. Check if template exists (status === 'exists')
4. Load template HTML
5. Replace {{placeholders}} with deal data
6. Generate PDF via Puppeteer
7. Send via Resend email
```

## Critical Files

- `manifest.ts` — Template index and helper functions
- `packages/convex/convex/seedTemplates.ts` — Source of truth for 102 documents
- `packages/convex/convex/schema.ts` — Database schema (templates table)
- `apps/admin/app/api/pdf-generate/route.ts` — PDF generation endpoint
- `packages/convex/convex/emails.ts` — Email sending with attachments

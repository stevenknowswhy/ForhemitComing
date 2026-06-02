---
name: forhemit-documents
version: 1.0.0
description: >
  Generates branded deal pipeline documents for Forhemit clients: PDF reports,
  email drafts, and notices. Produces client-ready deliverables with Forhemit
  branding (Navy/Brass/Jost/Cormorant Garamond). Email drafts include an
  interactive "Send via Resend" button that sends directly from the browser.
  All generated documents are automatically logged to the Convex externalDocumentLog
  table. Supports 6 email types, 2 preflight report types, and NDA receipt notices.
options:
  folder:
    flag: <folder-path>
    description: >
      Path to the client output folder. PDFs and email drafts are written here.
    required: true
  type:
    flag: --type <document-type>
    description: >
      The document type to generate. Valid values depend on the script:
        Email types: deal-screener, qualification-agenda, preflight-cover,
                     conditional-go, engagement-cover, loi-transmittal
        PDF types:   preflight (internal + external), nda-receipt
    required: true
  company:
    flag: --company <name>
    description: Company legal name. Used in document headers and metadata.
    required: true
  seller:
    flag: --seller <name>
    description: Seller/owner authorized signatory name.
    default: "Seller"
  broker:
    flag: --broker <name>
    description: Broker name (for deal-screener emails).
    default: "Broker"
  broker_email:
    flag: --broker-email <email>
    description: Broker email address. Used as default recipient for outbound emails.
    default: ""
  ref:
    flag: --ref <reference>
    description: >
      Deal reference number (e.g., "DHI-2026-001"). If not provided,
      generated from company initials + year.
    default: "auto-generated"
  to:
    flag: --to <email>
    description: >
      Override recipient email address. For email drafts, this pre-fills
      the editable recipient field. If omitted, auto-set based on email
      direction (inbound → deals@forhemit.com, outbound → seller/broker).
    default: "auto-set from direction"
  first_name:
    flag: --first-name <name>
    description: >
      Override first name for email greeting. Stored as additional name
      in Convex metadata (does NOT overwrite the original seller/broker name).
      Appears in the send-bar as an editable input field.
    default: ""
  last_name:
    flag: --last-name <name>
    description: >
      Override last name for email greeting. Stored as additional name
      in Convex metadata (does NOT overwrite the original seller/broker name).
      Appears in the send-bar as an editable input field.
    default: ""
  email:
    flag: --email <email>
    description: >
      Override recipient email address. Takes precedence over --to when
      both are provided. Appears in the send-bar as an editable input.
    default: ""
  attachment:
    flag: --attachment <path>
    description: >
      Path to a PDF file to display as the attachment in the email draft
      metadata banner. Does not actually attach the file — metadata only.
    default: "none"
  output:
    flag: --output <path>
    description: Output directory for generated files.
    default: "<cwd>/output/"
trigger: >
  /forhemit-documents, "generate email", "generate deal email",
  "create email draft", "send email to seller", "send email to broker",
  "deal screener", "qualification agenda", "preflight cover letter",
  "conditional go letter", "engagement letter cover", "loi transmittal",
  "generate preflight PDF", "generate NDA receipt", "create NDA notice",
  "email template", "deal documents", "pipeline documents"
---

## Overview

The Forhemit document pipeline produces three categories of deliverables:

| Category | Script | Output | Convex Logging |
|---|---|---|---|
| **Email Drafts** | `scripts/generate-deal-email.py` | `.draft.html` files | ✅ auto |
| **Preflight Reports** | `scripts/generate-preflight-pdf.py` | `.pdf` files | ✅ auto |
| **NDA Receipts** | `scripts/generate-nda-receipt.py` | `.pdf` files | ✅ auto |
| **Broker Packet Docs** | `scripts/generate-broker-packet.py` | `.pdf` files | ✅ auto |

Every document is automatically logged to the `externalDocumentLog` table in Convex
via `scripts/convex_logger.py`. If Convex is unreachable, logs fall back to
`.pi/convex-log-failures.jsonl`.

## Prerequisites

All dependencies are already installed in the Forhemit project:

```
Python packages:  weasyprint, pdfplumber, openpyxl, markdown
System deps:      pandoc, tesseract (optional OCR)
Convex:           externalDocumentLog table + /log-document + /send-email HTTP actions
Resend:           API key in apps/admin/.env.local (RESEND_API_KEY)
```

## Email Draft Generator

### Script

```bash
python3 scripts/generate-deal-email.py \
  --type <email-type> \
  --company "Company Name" \
  --seller "Owner Name" \
  --ref REF-2026-001 \
  --output /path/to/client/output
```

### Email Types

#### 1. Deal Screener (`deal-screener`)
**Direction:** Broker → Forhemit (inbound)
**Default recipient:** deals@forhemit.com
**Purpose:** Acknowledges receipt of a broker's deal submission and outlines
the screening process (financial profile, entity structure, management depth,
industry fit). Sets expectation of 5 business days for initial review.

#### 2. Seller Qualification Call Agenda (`qualification-agenda`)
**Direction:** Forhemit → Seller (outbound)
**Default recipient:** seller email
**Purpose:** Pre-call agenda with 6 sections: Company Overview (10 min),
Financial Snapshot (15 min), Ownership & Transition Goals (10 min),
Team & Management (10 min), Legal & Entity Structure (5 min),
Next Steps & Q&A (10 min). Total: ~60 minutes.

#### 3. Pre-Flight Checklist Cover Letter (`preflight-cover`)
**Direction:** Forhemit → Seller (outbound)
**Default recipient:** seller email
**Purpose:** Cover letter accompanying the pre-flight assessment PDF. Lists
what the assessment covers (financial readiness, entity structure, employee
eligibility, management depth, regulatory) and requests return of the
completed checklist within 5 business days.

#### 4. Conditional Go Letter (`conditional-go`)
**Direction:** Forhemit → Seller (outbound)
**Default recipient:** seller email
**Purpose:** Formal notification that the company received conditional approval
to proceed. Includes a green "Proceed with conditions" badge and lists the
conditions: entity conversion to C-Corp, reviewed financials, resolution of
legal matters, independent valuation.

#### 5. Engagement Letter Cover Email (`engagement-cover`)
**Direction:** Forhemit → Seller (outbound)
**Default recipient:** seller email
**Purpose:** Cover email for the formal engagement letter. Lists key terms:
scope of services, fee structure, exclusivity, representations, dispute
resolution. Requests review, signature, and return.

#### 6. LOI Transmittal Letter (`loi-transmittal`)
**Direction:** Forhemit → Seller (outbound)
**Default recipient:** seller email
**Purpose:** Transmittal letter for the Letter of Intent. Outlines what the
LOI contains (enterprise value, financing, timeline, due diligence, conditions
precedent). Notes the LOI is non-binding except for confidentiality,
exclusivity, and governing law provisions.

### Interactive Send Button

Every email draft includes an interactive send panel at the bottom:

```
┌─────────────────────────────────────────┐
│         Ready to send?                  │
│                                         │
│  First Name: [ James ]                  │  ← editable input
│  Last Name:  [ Smith ]                  │  ← editable input
│  To:         [ recipient@example.com ]  │  ← editable input
│                                         │
│           [ Send via Resend ]           │  ← brass button
│                                         │
│  ✓ Email sent successfully to ...       │  ← green success
│  Error: ...                             │  ← red error (retry)
└─────────────────────────────────────────┘
```

- **Name override:** If `--first-name`/`--last-name` are provided, those values
  pre-fill the inputs. Editing them in the browser updates the email greeting
  (`Dear First Last`) via JS regex replacement before sending.
- **Edit recipient:** Change the email in the input field before clicking
- **Spinner:** Button shows a loading spinner while sending
- **Success:** Button turns green with "✓ Sent", green status text appears
- **Error:** Red error text, button re-enables for retry
- **Architecture:** Browser → Convex `/send-email` HTTP action → Resend API

The Convex URL is auto-detected from `CONVEX_DEPLOY_KEY` in `apps/admin/.env.local`
and injected into the HTML at generation time.

### Adding a New Email Type

To add a new email type to the pipeline:

#### 1. Add the type definition

In `scripts/generate-deal-email.py`, add to the `EMAIL_TYPES` dict:

```python
EMAIL_TYPES = {
    ...
    "my-new-type": {
        "subject": "Subject Line — {company} — {ref}",
        "direction": "outbound",  # or "inbound"
        "description": "Human-readable description of this email",
    },
}
```

#### 2. Write the body function

Add a function that returns the HTML body content:

```python
def body_my_new_type(ctx: dict) -> str:
    """Description of when this email is used."""
    # Use ctx['display_name'] when a name override is provided,
    # otherwise fall back to ctx['seller'] or ctx['broker']
    greeting = ctx.get('display_name') or ctx['seller']
    return f"""
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Dear {greeting},
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Your email body content here. Use <strong>ctx['company']</strong> for
  the company name and <strong>ctx['ref']</strong> for the reference.
</p>
"""
```

**Style guidelines:**
- Use `{TEXT_BODY}` for body text color (`#3d3832`)
- Use `{INK}` for headings (`#1A1714`)
- Use `{BRASS}` for accent/links (`#B8965A`)
- Use `{PARCHMENT}` for callout backgrounds (`#F7F4EE`)
- Font size: 15px, line-height: 1.7, margin: 0 0 16px between paragraphs
- Use `{ctx['seller']}`, `{ctx['company']}`, `{ctx['broker']}`, `{ctx['ref']}` for variables
- Use `{ctx.get('display_name') or ctx['seller']}` for the greeting (supports name override)

#### 3. Register the body function

Add to the `BODY_GENERATORS` dict:

```python
BODY_GENERATORS = {
    ...
    "my-new-type": body_my_new_type,
}
```

#### 4. Test

```bash
python3 scripts/generate-deal-email.py \
  --type my-new-type \
  --company "Test Company" \
  --seller "Test Seller" \
  --ref TEST-2026-001 \
  --output /tmp/test-output
```

### Name & Email Override Fields

Every email draft supports three optional override fields:

```bash
python3 scripts/generate-deal-email.py \
  --type deal-screener \
  --company "Dark Horse Institute" \
  --broker "Gary Martin" \
  --first-name "James" --last-name "Smith" \
  --email "james@newbroker.com" \
  --ref DHI-2026-001 \
  --output /path/to/output
```

| Flag | Effect |
|---|---|
| `--first-name` | Override first name in email greeting + editable input in send-bar |
| `--last-name` | Override last name in email greeting + editable input in send-bar |
| `--email` | Override recipient email (takes priority over `--to`) |

**How it works:**
- `display_name` is built from `first_name + last_name`. If provided, it replaces
  `ctx['seller']` (outbound emails) or `ctx['broker']` (inbound deal-screener) in the
  "Dear ..." greeting.
- The send-bar at the bottom shows three editable input fields: First Name, Last Name,
  and Email. Users can edit these before clicking "Send via Resend".
- If name fields are edited in the browser, the JavaScript dynamically updates the
  greeting in the email body via regex replacement (`/Dear [^,<]+/`) before sending.
- The success message confirms: "Email sent successfully to {email} as {displayName}".

**Convex logging:** When name is overridden, the log metadata includes:
- `override_name` — the full display name used
- `override_first_name`, `override_last_name` — individual parts
- `original_name` — the original seller/broker name (never overwritten)
- `override_email` — if email was overridden

The original name in Convex is NEVER overwritten. The override is stored as
additional metadata on the log entry.

### Architecture & Gotchas

#### How the email generator works

The generated `.draft.html` file is a **single self-contained HTML page** with
three layers:

```
┌─────────────────────────────────────────────┐
│  Draft Banner (orange dashed)               │
│  Type, To, Subject, Generated,              │
│  First Name, Last Name, Email               │  ← metadata display
├─────────────────────────────────────────────┤
│  Preview Frame                              │
│  ┌─────────────────────────────────────┐    │
│  │ Full branded email HTML             │    │  ← email_layout() output
│  │ (nested <!DOCTYPE html><html>...)   │    │     embedded verbatim
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  Send Bar                                   │
│  [First Name] [Last Name] [Email]           │  ← editable inputs
│  [ Send via Resend ]                        │  ← sends via Convex HTTP
└─────────────────────────────────────────────┘
```

The email body (`email_layout()`) generates a full HTML document with its own
`<!DOCTYPE html>`, `<head>`, and `<body>` tags. This gets embedded inside the
`.preview-frame` div of the outer draft wrapper. This means the final file has
**nested `<html>` and `<body>` tags** — browsers handle this fine but it looks
weird if you inspect the DOM.

#### Gotchas when creating new email types

1. **Nested HTML in preview-frame**: `email_layout()` returns a full HTML document
   (`<!DOCTYPE html><html>...`). It gets embedded inside the draft wrapper's
   `.preview-frame` div. This is intentional — the browser renders the inner
   document inside the frame. Do NOT strip the inner `<!DOCTYPE>` or `<html>` tags;
   they're needed for the send-bar's `frame.innerHTML` extraction to capture the
   full email when sending.

2. **Body functions use f-strings with module-level constants**: The body functions
   (`body_deal_screener`, etc.) are Python f-strings that reference module-level
   color constants (`TEXT_BODY`, `INK`, `BRASS`, `PARCHMENT`, `BORDER_GRAY`). If you
   add a new color, define it at module level, not inside the function.

3. **`display_name` fallback logic**: Each body function uses
   `ctx.get('display_name') or ctx['seller']` (or `ctx['broker']` for inbound).
   Always use this pattern — never hardcode `ctx['seller']` directly in the greeting,
   otherwise name overrides won't work.

4. **Greeting regex replacement**: The browser-side JS replaces the greeting via
   `emailHtml.replace(/Dear [^,<]+/, 'Dear ' + displayName)`. This regex matches
   everything after "Dear " until a comma or `<` tag. If your greeting uses a
   different format (e.g., "Dear Sir/Madam" or "Hello"), the regex won't match.
   Stick with "Dear {name}," format for all body functions.

5. **Draft file naming**: Output files are named `{email_type}-{ref}.draft.html`.
   If you generate the same type+ref twice, it overwrites. The `--send` flow
   renames `.draft.html` → `.sent.html` after successful send.

6. **Attachment is metadata-only**: The `--attachment` flag embeds the file as
   base64 in the HTML for the "Send via Resend" button, but it only works when
   sending from the browser. The CLI `--send` path does NOT re-read the attachment.

7. **Convex URL injection**: The Convex site URL is detected at generation time
   from `CONVEX_DEPLOY_KEY` in `.env.local` and baked into the HTML as a JS
   variable. If you move the draft to a different machine, the URL still points
   to the original deployment. This is intentional — drafts are single-use.

8. **`email()` flag priority**: `--email` takes priority over `--to`. If both are
   provided, `--email` wins for the recipient input field. The `--to` flag is the
   older override mechanism; prefer `--email` for consistency.

9. **Python ruff auto-format**: After writing/editing the script, ruff auto-formats
   it. Always re-read the file before making further edits to avoid mismatch errors.

## PDF Generators

### Preflight Reports

```bash
python3 scripts/generate-preflight-pdf.py /path/to/client/output
```

Reads `preflight-internal-*.md` and `preflight-external-*.md` from the output
folder and generates branded PDFs using Weasyprint. Includes page breaks before
Company Overview, Assessment, and Next Steps sections. External PDF includes
an extended legal disclaimer.

### NDA Receipt Notice

```bash
python3 scripts/generate-nda-receipt.py \
  --company "Company Name" \
  --seller "Owner Name" \
  --ref REF-2026-001 \
  --nda-date "May 15, 2026" \
  --output /path/to/client/output
```

Generates a one-page branded notice confirming receipt of a signed NDA.
Includes company/seller metadata grid, two paragraphs confirming receipt,
and a signature block for Stefano Stokes.

### Adding a New PDF Type

Create a new Python script in `scripts/` following this pattern:

```python
#!/usr/bin/env python3
"""Description of the PDF type."""

import sys
from pathlib import Path
from datetime import datetime

log_document = None
try:
    from convex_logger import log_document
except ImportError:
    pass

try:
    from weasyprint import HTML
    HAS_WEASYPRINT = True
except ImportError:
    HAS_WEASYPRINT = False

# Import the Forhemit brand CSS from an existing script or define inline
BRAND_CSS = """..."""

def generate_pdf(data: dict, output_dir: Path) -> Path:
    """Generate the PDF and return its path."""
    html = f"""<!DOCTYPE html>
    <html>
    <head><style>{BRAND_CSS}</style></head>
    <body>
      <!-- Document content -->
    </body>
    </html>"""

    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"my-document-{data['ref']}.pdf"
    HTML(string=html).write_pdf(str(output_path))
    return output_path

def main():
    # Parse args, generate PDF
    pdf_path = generate_pdf(data, output_dir)

    # Auto-log to Convex
    if log_document is not None:
        try:
            log_document(
                document_type="my-document-type",
                file_path=str(pdf_path),
                company_name=data["company"],
                ref=data["ref"],
                generated_by="generate-my-document.py",
            )
        except Exception:
            pass

if __name__ == "__main__":
    main()
```

**Brand colors:**
- Navy: `#1B2A4A`
- Brass: `#7A5C20` (PDF) / `#B8965A` (email)
- Orange: `#FF6B00`

**Fonts:**
- Display: Cormorant Garamond (headings, brand name)
- Body: Jost (paragraphs, labels)
- Mono: DM Mono (reference numbers, codes)

## Convex Logging

All scripts auto-log to Convex via `scripts/convex_logger.py`.

### How it works

```
Script generates document
    │
    ├─ convex_logger.log_document()
    │      │
    │      ├─ Convex reachable? → POST /log-document → externalDocumentLog table
    │      │
    │      └─ Convex down? → .pi/convex-log-failures.jsonl (local fallback)
    │
    └─ Document created regardless of logging outcome
```

### URL detection

The logger auto-detects the Convex site URL in this order:
1. `CONVEX_DEPLOY_KEY` in `.env.local` → extracts deployment name → `https://{name}.convex.site`
2. `NEXT_PUBLIC_CONVEX_URL` env var → converts `.convex.cloud` to `.convex.site`
3. `CONVEX_URL` env var

### Manual logging

```bash
python3 scripts/convex_logger.py \
  --type preflight-internal \
  --file /path/to/document.pdf \
  --company "Company Name" \
  --ref REF-2026-001
```

### Health check

```bash
python3 scripts/convex_logger.py --health
```

## Cleanup

Remove non-PDF files from an output folder:

```bash
python3 scripts/cleanup-output.py /path/to/client/output          # dry run
python3 scripts/cleanup-output.py /path/to/client/output --confirm # delete
```

## Full Pipeline Example

For a new client, run these in order:

```bash
# 1. Convert documents to markdown
/forhemit-convert /path/to/client/folder

# 2. Run preflight analysis (generates internal + external PDFs)
/forhemit-preflight /path/to/client/folder

# 3. Generate NDA receipt
python3 scripts/generate-nda-receipt.py \
  --company "Company Name" --seller "Owner" \
  --ref REF-2026-001 --output /path/to/client/output

# 4. Generate email drafts (all 6 types)
for type in deal-screener qualification-agenda preflight-cover \
            conditional-go engagement-cover loi-transmittal; do
  python3 scripts/generate-deal-email.py \
    --type $type --company "Company Name" \
    --seller "Owner" --broker "Broker" \
    --broker-email "broker@example.com" \
    --ref REF-2026-001 --output /path/to/client/output
done

# 5. Clean up non-PDF files (keep only final deliverables)
python3 scripts/cleanup-output.py /path/to/client/output --confirm

# 6. Review email drafts in browser, edit recipients, click Send
```

## File Inventory

| File | Purpose |
|---|---|
| `scripts/generate-deal-email.py` | Email draft generator (6 types + interactive send) |
| `scripts/generate-preflight-pdf.py` | Preflight report PDF generator |
| `scripts/generate-nda-receipt.py` | NDA receipt notice PDF generator |
| `scripts/generate-broker-packet.py` | Broker packet PDF generator (3 types: broker-intro-packet, esop-cost-card, broker-screener-form) |
| `scripts/convex_logger.py` | Convex HTTP action logger (documents + errors) |
| `scripts/cleanup-output.py` | Remove non-PDF files from output folder |
| `packages/convex/convex/http.ts` | HTTP actions: `/log-document`, `/log-error`, `/send-email`, `/health` |
| `packages/convex/convex/externalDocuments.ts` | Mutations: `logDocument`, `logError`, `updateStatus` |
| `packages/convex/convex/schema.ts` | Tables: `externalDocumentLog`, `documentGenerationErrors` |

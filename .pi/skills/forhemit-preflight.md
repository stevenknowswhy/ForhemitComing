---
name: forhemit-preflight
version: 1.0.0
description: >
  Analyzes a folder of converted documents for ESOP transaction readiness.
  Reads the output/ folder produced by /forhemit-convert, extracts deal-relevant
  data points, runs gap analysis against Forhemit's preflight checklist, and
  generates two branded PDF reports: an internal version (full risk detail,
  confidence scores, missing document list) and an external version (clean
  client/broker-facing summary). Gated workflow: external PDF is staged for
  human review before delivery.
options:
  folder:
    flag: <folder-path>
    description: >
      Path to the client folder. Must contain an output/ subfolder with
      converted markdown files and _manifest.json from /forhemit-convert.
      If output/ does not exist, the skill will run /forhemit-convert first.
    required: true
  company:
    flag: --company <name>
    description: >
      Override the company name extracted from documents. Use when the
      folder name or document content doesn't clearly identify the company.
    default: "auto-detect from documents"
  ref:
    flag: --ref <reference>
    description: >
      Deal reference number (e.g., "DHI-2026-001"). If not provided,
      generated from company name + date.
    default: "auto-generated"
  skip_convert:
    flag: --skip-convert
    description: >
      Skip the /forhemit-convert step even if output/ is missing.
      Use when you want to run preflight on already-available markdown
      files in a custom location.
    default: false
trigger: >
  /forhemit-preflight, "run preflight", "analyze documents",
  "preflight analysis", "check ESOP readiness", "gap analysis",
  "what's missing for this deal", "readiness assessment"
---

# Forhemit Preflight Skill v1.0.0

## Part 0 — When to Use This Skill

Use this skill when the user wants to assess a client's ESOP readiness based
on documents they've provided. This is the **second step** in the Forhemit
document pipeline:

```
/forhemit-convert  →  /forhemit-preflight  →  /forhemit-proposal
  (conversion)         (this skill)            (document generation)
```

### MUST Use When

1. The user says "run preflight on this folder" or "analyze these documents."
2. A new client intake has been converted and needs a readiness assessment.
3. The user wants to know what's missing before a deal can proceed.

### MUST NOT Use When

1. The folder hasn't been converted yet — route to `/forhemit-convert` first
   (unless `--skip-convert` is set).
2. The user wants to generate a specific proposal document — route to
   `/forhemit-proposal` instead.

---

## Part 1 — Prerequisites

### 1.1 Converted Documents

The preflight reads from `<folder>/output/`. If this directory doesn't exist
and `--skip-convert` is not set, run `/forhemit-convert <folder>` first.

### 1.2 Manifest

The `_manifest.json` file in `output/` tells the preflight:
- Which documents were converted and which failed
- File types, sizes, and hashes for dedup
- Whether OCR was available for scanned documents

### 1.3 PDF Generation

The preflight generates branded PDFs via the admin app's Puppeteer route.
Ensure the admin dev server is running:

```bash
cd apps/admin && pnpm dev
```

If the server is not running, the preflight will generate markdown reports
only (no PDFs).

---

## Part 2 — Agent Workflow

When the user invokes `/forhemit-preflight <folder>`:

### Step 1: Validate Input

```
1. Resolve the folder path to an absolute path.
2. Check if <folder>/output/ exists.
   - If YES: proceed to Step 2.
   - If NO: run /forhemit-convert <folder> first, then proceed.
3. Read <folder>/output/_manifest.json.
4. Report: "Found N converted files. M succeeded, K skipped, J errors."
```

### Step 2: Read All Converted Documents

Read every `.md` file listed in the manifest. For each file:
1. Parse the YAML frontmatter (source_file, file_type, converted_at)
2. Read the full markdown content
3. Categorize the document by its content:

| Category | Detection Heuristics |
|----------|---------------------|
| **P&L / Income Statement** | Filename contains "P&L", "profit", "income"; content has revenue/expense rows |
| **Balance Sheet** | Filename contains "BS", "balance"; content has assets/liabilities |
| **Tax Return** | Filename contains "tax", "return", "1040", "1120"; content has tax form indicators |
| **Financial Statement** | Filename contains "audit", "review", "financial"; content has CPA/auditor language |
| **Spreadsheet / Analysis** | File type is xlsx/csv; content has structured numeric data |
| **Legal Document** | Filename contains "agreement", "contract", "NDA", "operating"; legal language in content |
| **Email Communication** | File type is eml/msg; has email headers |
| **Presentation** | File type is pptx; has slide structure |
| **Organizational** | Filename contains "org", "chart", "team"; content has names/titles |
| **Overview / Memo** | Filename contains "overview", "memo", "summary", "CIM" |
| **Other** | Anything that doesn't match above |

Store the categorized document inventory for later use.

### Step 3: Extract Data Points

For each document, extract the following data points where available.
Mark each with a confidence level:

| Confidence | Meaning | Icon |
|------------|---------|------|
| `confirmed` | Found explicitly in document text | 🟢 |
| `inferred` | Calculated or implied from partial data | 🟡 |
| `stated` | Owner-provided, not yet verified by docs | 🔵 |
| `missing` | Not found in any document | 🔴 |

#### 3.1 Company Profile

| Field | Sources | Notes |
|-------|---------|-------|
| Company legal name | Tax returns, legal docs, CIM | Exact match required |
| DBA / trade name | Overview docs, presentations | May differ from legal name |
| Entity type | Tax returns (1120 = C-Corp, 1120-S = S-Corp, 1065 = Partnership) | CRITICAL for §1042 |
| State of incorporation | Operating agreement, articles | |
| Operating state | Tax returns, P&L headers | |
| Industry / NAICS | CIM, overview docs | |
| Employee count | Org chart, tax returns (W-2 count), overview | Count W-2 employees only |

#### 3.2 Financial Data (3-Year)

| Field | Sources | Notes |
|-------|---------|-------|
| Annual revenue (Y1, Y2, Y3) | P&L statements, tax returns | Most recent = Y3 |
| EBITDA (Y1, Y2, Y3) | P&L statements, analysis spreadsheets | Normalize for owner comp |
| Net income (Y1, Y2, Y3) | P&L statements, tax returns | |
| Total outstanding debt | Balance sheets, debt schedules | All loans + lines + equipment |
| Existing SBA/EIDL balance | Balance sheets, debt schedules | Must be identified for closing |
| Owner compensation | Tax returns (K-1, W-2 from S-Corp) | Needed for QofE normalization |
| Owner benefits | Tax returns | Add-back candidate |
| Revenue trend | Calculated from 3-year revenue | Growing / flat / declining |
| EBITDA trend | Calculated from 3-year EBITDA | Growing / flat / declining |

#### 3.3 Owner Profile

| Field | Sources | Notes |
|-------|---------|-------|
| Owner name(s) | Tax returns, legal docs, CIM | |
| Ownership percentage | Operating agreement, stock ledger | Multiple owners = note each |
| Owner age | Tax returns (DOB on 1040) | If available |
| Post-close preference | Overview docs, emails, meeting notes | |
| Management depth | Org chart, overview docs | Count capable non-owner leaders |
| Key-person dependency | Overview docs, CIM narrative | |

#### 3.4 Deal Factors

| Field | Sources | Notes |
|-------|---------|-------|
| Has broker | Emails, CIM, engagement letters | |
| Broker name / firm | Emails, CIM cover page | |
| Customer concentration | Financial statements, CIM | Top customer % of revenue |
| Lease terms | Legal docs, overview | Years remaining |
| Owns real estate | Balance sheets (fixed assets), overview | |
| Pending litigation | Legal docs, emails | |
| Existing benefit plans | Overview, emails | 401(k), profit-sharing, pension |

### Step 4: Run Gap Analysis

Compare extracted data against the Forhemit preflight checklist categories:

#### 4.1 Financial Readiness

| Checklist Item | Status | Evidence |
|----------------|--------|----------|
| 3 years audited/reviewed financials | ✅/🟡/🔴 | |
| 3 years federal/state tax returns | ✅/🟡/🔴 | |
| EBITDA calculation / QofE | ✅/🟡/🔴 | |
| AR aging schedule | ✅/🟡/🔴 | |
| Outstanding debt schedule | ✅/🟡/🔴 | |
| CapEx history and projections | ✅/🟡/🔴 | |

#### 4.2 Legal Readiness

| Checklist Item | Status | Evidence |
|----------------|--------|----------|
| Entity type confirmed | ✅/🟡/🔴 | |
| Entity conversion requirements | ✅/🟡/🔴 | |
| Existing liens identified | ✅/🟡/🔴 | |
| Pending litigation disclosed | ✅/🟡/🔴 | |
| IP ownership confirmed | ✅/🟡/🔴 | |
| Material contracts reviewed | ✅/🟡/🔴 | |

#### 4.3 Operational Readiness

| Checklist Item | Status | Evidence |
|----------------|--------|----------|
| Management team identified | ✅/🟡/🔴 | |
| Key-person dependency assessed | ✅/🟡/🔴 | |
| Succession plan exists | ✅/🟡/🔴 | |
| Customer concentration analyzed | ✅/🟡/🔴 | |
| Vendor concentration assessed | ✅/🟡/🔴 | |
| SOPs documented | ✅/🟡/🔴 | |

#### 4.4 Ownership Readiness

| Checklist Item | Status | Evidence |
|----------------|--------|----------|
| Seller motivation clear | ✅/🟡/🔴 | |
| Timeline established | ✅/🟡/🔴 | |
| Post-close role defined | ✅/🟡/🔴 | |
| Family considerations disclosed | ✅/🟡/🔴 | |
| Multiple owner alignment | ✅/🟡/🔴 | |
| Valuation expectations set | ✅/🟡/🔴 | |

#### 4.5 ESOP-Specific Readiness

| Checklist Item | Status | Evidence |
|----------------|--------|----------|
| ERISA compliance awareness | ✅/🟡/🔴 | |
| Trustee identified | ✅/🟡/🔴 | |
| Lender interest confirmed | ✅/🟡/🔴 | |
| Employee count verified | ✅/🟡/🔴 | |
| Existing benefit plans cataloged | ✅/🟡/🔴 | |
| §1042 eligibility assessed | ✅/🟡/🔴 | |

### Step 5: Determine Viability Signal

Based on the gap analysis, assign one of three signals:

| Signal | Criteria |
|--------|----------|
| **YES** | All critical items 🟢 or 🟡. EBITDA ≥ $3M. Entity convertible. Owner aligned. |
| **YES — WITH CONDITIONS** | Most items 🟢/🟡 but 1-2 critical items 🔴 that are solvable (e.g., missing QofE, entity conversion needed, financials are compiled not reviewed). |
| **NOT YET** | EBITDA < $2.5M, declining 3 years, owner unmotivated, litigation pending, or multiple unsolvable blockers. |

### Step 6: Generate Internal Preflight Report

Create a detailed markdown report with:

```markdown
# FORHEMIT PREFLIGHT ANALYSIS — INTERNAL
## [Company Name] | [Date] | Ref: [REF]

---

### EXECUTIVE SUMMARY

**Viability Signal:** [YES / YES — WITH CONDITIONS / NOT YET]

[2-3 sentence summary of the deal. Name the company, industry,
approximate EBITDA, entity type, and the single biggest risk factor.]

---

### DOCUMENT INVENTORY

| # | Document | Type | Status | Category |
|---|----------|------|--------|----------|
| 1 | filename.pdf | pdf | ✅ | P&L Statement |
...

**Documents Received:** N of M expected
**Critical Gaps:** [list missing document types]

---

### EXTRACTED DATA

#### Company Profile
| Field | Value | Confidence | Source |
|-------|-------|------------|--------|
| Company Name | Acme Corp | 🟢 confirmed | tax-return-2024.pdf |
| Entity Type | S-Corp | 🟢 confirmed | tax-return-2024.pdf |
...

#### Financial Summary (3-Year)
| Metric | 2022 | 2023 | 2024 | Trend |
|--------|------|------|------|-------|
| Revenue | $X | $Y | $Z | ↗️ |
| EBITDA | $X | $Y | $Z | ↘️ |
...

#### Owner Profile
| Field | Value | Confidence |
|-------|-------|------------|
| Owner | John Smith | 🟢 |
...

---

### RISK FLAGS

🔴 **[Flag Name]**
- What it is: [explanation]
- Why it matters: [deal impact]
- How to resolve: [specific action]
- Urgency: [before engagement / before close / monitor]

🟡 **[Flag Name]**
...

---

### GAP ANALYSIS

[Full checklist tables from Step 4 with status and evidence]

---

### RECOMMENDATIONS

1. [Most urgent action]
2. [Second priority]
3. [Third priority]

---

### MISSING DOCUMENTS — ACTION LIST

Request the following from the client:
1. [Document type] — [why needed]
2. [Document type] — [why needed]
...

---

*Generated by Forhemit Preflight v1.0.0 | [Date] | INTERNAL USE ONLY
This analysis is AI-generated. All data points require human verification
before use in transaction documents.*
```

### Step 7: Generate External Preflight Report

Create a **clean** version for client/broker delivery:

```markdown
# FORHEMIT PREFLIGHT SUMMARY
## [Company Name] | [Date]

---

### OVERVIEW

[2-3 paragraph summary written in Forhemit's professional voice.
State what was reviewed, what was found, and the overall assessment.
No raw risk language, no confidence scores, no internal flags.]

---

### DOCUMENTS REVIEWED

[List document types received — not filenames. Group by category.]

---

### FINANCIAL SNAPSHOT

| Metric | Most Recent Year | Prior Year |
|--------|-----------------|------------|
| Revenue | $X | $Y |
| EBITDA | $X | $Y |
| Employees | N | — |

[Brief narrative on financial trajectory — written for a business owner,
not an analyst.]

---

### ASSESSMENT

**Result: [YES / YES — WITH CONDITIONS / NOT YET]**

[Plain-language explanation of what this means for the owner.
2-3 sentences. No jargon. Written as if speaking to the owner directly.]

---

### WHAT WE STILL NEED

To complete our analysis, we need the following:
1. [Document type] — [plain-language explanation]
2. [Document type] — [plain-language explanation]
...

---

### NEXT STEPS

[What happens next. Timeline. Contact information.]

---

**Forhemit Transition Stewardship**
deals@forhemit.com | 424-253-4019 | forhemit.com

*This summary is based on documents provided and is subject to
revision upon receipt of additional information. It does not
constitute legal, tax, or financial advice.*
```

### Step 8: Generate PDFs

#### 8.1 Internal PDF

Use the existing Puppeteer PDF generation route:

```bash
curl -X POST http://localhost:5050/api/pdf-generate \
  -H "Content-Type: application/json" \
  -d '{
    "htmlContent": "<rendered internal HTML>",
    "cssContent": "<Forhemit branding CSS>",
    "templateName": "Preflight-Internal-[REF]"
  }' \
  --output output/preflight-internal-[REF].pdf
```

#### 8.2 External PDF (STAGED)

Generate the external PDF but **do not deliver it**:

```bash
curl -X POST http://localhost:5050/api/pdf-generate \
  -H "Content-Type: application/json" \
  -d '{
    "htmlContent": "<rendered external HTML>",
    "cssContent": "<Forhemit branding CSS>",
    "templateName": "Preflight-External-[REF]"
  }' \
  --output output/preflight-external-[REF].pdf.draft
```

**The `.draft` extension is a hard gate.** The external PDF must be
reviewed and approved by a human before delivery. To approve:

```bash
mv output/preflight-external-[REF].pdf.draft output/preflight-external-[REF].pdf
```

### Step 9: Output Summary

Report to the user:

```markdown
## Preflight Complete — [Company Name]

**Viability:** [YES / YES — WITH CONDITIONS / NOT YET]
**Documents Analyzed:** N
**Data Points Extracted:** M (🟢 X, 🟡 Y, 🔴 Z)
**Risk Flags:** A red, B yellow

### Generated Files
| File | Status |
|------|--------|
| output/preflight-internal-[REF].pdf | ✅ Ready |
| output/preflight-internal-[REF].md | ✅ Ready |
| output/preflight-external-[REF].pdf.draft | ⏳ Staged for review |
| output/preflight-external-[REF].md | ✅ Ready |

### Top 3 Actions Required
1. [Most urgent]
2. [Second]
3. [Third]

### Next Step
Review the internal report, approve or edit the external draft,
then run `/forhemit-proposal engagement` to generate the engagement letter.
```

---

## Part 3 — HTML Rendering for PDF

When generating HTML for the Puppeteer PDF route, use the Forhemit brand
system. The CSS must include:

```css
:root {
  --brass: #7A5C20;
  --brass-dim: #bbb;
  --muted: #666;
  --line: #ddd;
  --line-strong: #bbb;
  --green: #2E7D32;
  --green-bg: #f0f8f0;
  --red-bg: #fef0f0;
  --callout-bg: #faf7f0;
  --ff-display: 'Cormorant Garamond', Georgia, serif;
  --ff-body: 'Jost', system-ui, sans-serif;
  --ff-mono: 'DM Mono', monospace;
  --page-w: 720px;
}
```

Use the same typography hierarchy as the existing preflight HTML templates:
- Header: Cormorant Garamond, 1.5rem, letter-spacing 0.28em, uppercase
- Section titles: Cormorant Garamond, 1.05rem, letter-spacing 0.06em
- Body: Jost, 0.83rem, weight 300, line-height 1.85
- Labels: 0.55-0.65rem, uppercase, letter-spacing 0.15-0.22em, brass color
- Monospace: DM Mono, 0.62-0.7rem

Reference templates:
- External: `packages/convex/templates/external/02-qualification/pre-flight-checklist.html`
- Internal: `packages/convex/templates/internal/02-qualification/pre-flight-checklist-internal.html`

---

## Part 4 — Convex Integration (Future)

When the Convex `preflightAssessments` table is implemented, the preflight
should:

1. Create a `preflightAssessments` record with all extracted data
2. Link to `crmCompanies` via `companyId`
3. Store `fieldConfidence` as a JSON record
4. Store `viabilityFlags` as a structured array
5. Store PDF URLs after generation

This is deferred until the schema addition is implemented.

---

## Part 5 — Error Handling

| Scenario | Action |
|----------|--------|
| `output/` folder missing | Run `/forhemit-convert` first |
| `_manifest.json` missing | Run `/forhemit-convert` first (manifest is always generated) |
| All files failed conversion | Report error, suggest checking source files |
| PDF generation server not running | Generate markdown reports only, note PDFs require admin server |
| No financial data found | Flag as 🔴 critical, suggest requesting P&L and tax returns |
| Entity type ambiguous | Flag as 🟡 inferred, list possible types |
| Multiple companies in folder | Ask user which company, or analyze separately |

---

## Part 6 — Integration with Downstream Skills

### How /forhemit-proposal uses the preflight output

The proposal skill reads:
1. `output/preflight-internal-[REF].md` — for extracted data to fill templates
2. `output/_manifest.json` — for document inventory
3. The viability signal — to determine which proposals are appropriate

### Data Handoff

The preflight produces a structured data package that proposals consume:

```json
{
  "companyName": "...",
  "entityType": "S-Corp",
  "stateOfIncorporation": "TN",
  "ebitda3yr": [4200000, 4800000, 5100000],
  "revenue3yr": [22000000, 24000000, 25500000],
  "employeeCount": 85,
  "ownerName": "Robin Crow",
  "viabilitySignal": "YES_WITH_CONDITIONS",
  "riskFlags": [...],
  "missingDocuments": [...]
}
```

This data is embedded in the internal markdown report's frontmatter
for machine consumption.

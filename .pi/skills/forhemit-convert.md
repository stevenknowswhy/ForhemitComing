---
name: forhemit-convert
version: 1.0.0
description: >
  Recursively converts a folder of mixed-format documents (PDF, DOCX, XLSX,
  CSV, EML, MSG, HTML, images) into clean markdown files with YAML frontmatter.
  Designed as the intake layer for /forhemit-preflight and /forhemit-proposal.
  Outputs to a output/ subfolder with a _manifest.json for downstream
  consumption. OCR support for scanned documents is optional and degrades
  gracefully if Tesseract is not installed.
options:
  folder:
    flag: <folder-path>
    description: >
      Path to the folder containing source documents. Must be the first
      argument. Can be absolute or relative to the project root.
    required: true
  output:
    flag: --output <path>
    description: >
      Override the output directory. Default: <folder>/output/.
      Use this when you want markdown files in a different location
      (e.g., a shared staging area).
    default: "<folder>/output/"
  dry_run:
    flag: --dry-run
    description: >
      Scan the folder and report what would be converted without writing
      any files. Use this to preview the conversion scope.
    default: false
  check_deps:
    flag: --check-deps
    description: >
      Check which Python dependencies are installed and report status.
      Use this before first run to verify setup.
    default: false
trigger: >
  /forhemit-convert, "convert this folder", "convert documents",
  "prepare documents for preflight", "convert intake folder",
  "turn these files into markdown"
---

# Forhemit Document Converter Skill v1.0.0

## Part 0 — When to Use This Skill

Use this skill when the user wants to prepare a folder of mixed-format
documents for agent analysis. This is the **first step** in the Forhemit
document pipeline:

```
/forhemit-convert  →  /forhemit-preflight  →  /forhemit-proposal
  (this skill)         (gap analysis)          (document generation)
```

### MUST Use When

1. The user points to a folder and says "convert these" or "prepare for preflight."
2. The user wants to run `/forhemit-preflight` but the source documents haven't been converted yet.
3. A new client intake folder arrives (PDFs, spreadsheets, emails, Word docs mixed together).

### MUST NOT Use When

1. The folder already has a `output/` subfolder with a recent `_manifest.json`
   — check manifest timestamp first. If less than 24 hours old, ask whether
   to re-convert or use existing output.
2. The user wants to generate a proposal or preflight directly — route to the
   appropriate skill instead.

---

## Part 1 — Setup (Run Once)

### 1.1 Install Python Dependencies

Before first use, run the dependency check:

```bash
python3 scripts/convert-to-markdown.py /dev/null --check-deps
```

If any required dependencies show ❌, install them:

```bash
pip install -r scripts/requirements-convert.txt
```

**Required for core functionality:**
- `pdfplumber` — PDF text and table extraction
- `openpyxl` — Excel spreadsheet parsing
- `extract-msg` — Outlook .msg email parsing
- `html2text` — HTML to markdown conversion
- `pandoc` (CLI) — DOCX conversion (`brew install pandoc`)

**Optional (graceful degradation):**
- `pytesseract` + `Pillow` — OCR for scanned documents
- `tesseract` (system binary) — `brew install tesseract`

If OCR dependencies are missing, scanned PDFs and images will be flagged
as "skipped — OCR not available" rather than causing an error.

### 1.2 Verify Pandoc

```bash
which pandoc
```

If not found: `brew install pandoc`

---

## Part 2 — Running the Converter

### 2.1 Basic Usage

```bash
python3 scripts/convert-to-markdown.py /path/to/client-folder
```

This will:
1. Recursively scan the folder for supported file types
2. Convert each file to markdown with YAML frontmatter
3. Write output to `<folder>/output/`
4. Generate `_manifest.json` with conversion results

### 2.2 Preview Mode (Dry Run)

```bash
python3 scripts/convert-to-markdown.py /path/to/client-folder --dry-run
```

Shows what would be converted without writing any files.

### 2.3 Custom Output Directory

```bash
python3 scripts/convert-to-markdown.py /path/to/client-folder --output /path/to/staging
```

---

## Part 3 — Agent Behavior

When the user invokes `/forhemit-convert`:

### Step 1: Identify the Target Folder

```
User provides a folder path, e.g.:
  /forhemit-convert /Users/stephenstokes/Downloads/acme-corp-intake

If no path provided, ask:
  "Which folder should I convert? Please provide the path."
```

### Step 2: Run Dependency Check

```bash
python3 scripts/convert-to-markdown.py <folder> --check-deps
```

Report the results. If core dependencies are missing, offer to install:
```bash
pip install -r scripts/requirements-convert.txt
```

### Step 3: Preview (Dry Run)

```bash
python3 scripts/convert-to-markdown.py <folder> --dry-run
```

Show the user what will be converted. Summarize:
- Total files found
- File types and counts
- Any files that would be skipped

Ask: "Ready to convert?" (Skip this step if the user says "just do it" or similar.)

### Step 4: Run Conversion

```bash
python3 scripts/convert-to-markdown.py <folder>
```

### Step 5: Report Results

Read the `_manifest.json` from the output directory and summarize:

```markdown
## Conversion Complete

**Source:** /path/to/client-folder
**Output:** /path/to/client-folder/output/

| Status | Count |
|--------|-------|
| ✅ Converted | N |
| ⏭ Skipped | N |
| ⚠️ Empty | N |
| ❌ Errors | N |

### Files Converted
- `financial-statements-2024.pdf` → `financial-statements-2024.md` (12 pages, 3 tables)
- `company-overview.docx` → `company-overview.md`
- `revenue-data.xlsx` → `revenue-data.md` (3 sheets, 156 rows)
...

### Files Skipped
- `scanned-tax-return.pdf` — OCR not available (install tesseract for scanned docs)
...

### Next Step
Run `/forhemit-preflight <folder>` to analyze these documents
for ESOP readiness and generate internal/external reports.
```

### Step 6: Handle Errors

If any files fail to convert:
1. List the failed files with reasons
2. Offer to retry individual files
3. For PDFs that fail with pdfplumber, offer OCR fallback:
   ```bash
   # If pdfplumber extraction fails, the preflight skill can
   # attempt OCR on the original PDFs directly
   ```

---

## Part 4 — Output Format

### 4.1 Markdown Files

Each converted file gets:
- YAML frontmatter with `source_file`, `file_type`, `converted_at`, `converter`
- Type-specific metadata (pages for PDFs, sheets for Excel, headers for emails)
- Clean markdown content with tables preserved

Example:
```yaml
---
source_file: "financial-statements-2024.pdf"
file_type: "pdf"
converted_at: "2026-05-26 14:30:00 UTC"
converter: "forhemit-convert v1.0.0"
pages: 12
tables_found: 3
---
```

### 4.2 Manifest File (`_manifest.json`)

```json
{
  "source_folder": "/path/to/client-folder",
  "output_folder": "/path/to/client-folder/markdown",
  "converted_at": "2026-05-26T14:30:00+00:00",
  "total_files": 15,
  "converted": 12,
  "skipped": 2,
  "errors": 1,
  "empty": 0,
  "ocr_available": false,
  "dependencies": {
    "pdfplumber": true,
    "openpyxl": true,
    "extract_msg": true,
    "html2text": true,
    "ocr": false,
    "pandoc": true
  },
  "files": [
    {
      "source": "financials/2024-tax-return.pdf",
      "extension": ".pdf",
      "size_bytes": 2456789,
      "hash": "a1b2c3d4e5f6g7h8",
      "status": "converted",
      "output": "financials--2024-tax-return.md",
      "pages": 24,
      "tables": 2
    }
  ]
}
```

The manifest is consumed by:
- `/forhemit-preflight` — reads manifest to know what documents are available
- `/forhemit-proposal` — reads converted markdown to extract data for templates

---

## Part 5 — Conversion Rules by File Type

### PDF
- **Tool:** pdfplumber
- **Strategy:** Extract text page-by-page, extract tables separately
- **Output:** Page breaks as `---`, tables as markdown tables
- **Fallback:** If text extraction returns empty (scanned PDF), offer OCR if available

### DOCX
- **Tool:** pandoc CLI
- **Strategy:** `pandoc -f docx -t markdown --wrap=none`
- **Output:** Clean markdown preserving headings, lists, tables, bold/italic
- **Fallback:** None — pandoc is required

### XLSX / XLS
- **Tool:** openpyxl
- **Strategy:** One section per sheet (`## Sheet: SheetName`), skip empty rows
- **Output:** Markdown tables with headers
- **Note:** Uses `data_only=True` to get computed values, not formulas

### CSV
- **Tool:** Python csv module
- **Strategy:** Standard CSV → markdown table
- **Fallback:** Try UTF-8 first, fall back to latin-1

### EML
- **Tool:** Python email module
- **Strategy:** Extract headers (From, To, Cc, Subject, Date) + body
- **Output:** Headers block + body text. Prefers text/plain, falls back to html2text for HTML bodies.

### MSG (Outlook)
- **Tool:** extract-msg
- **Strategy:** Same as EML but for Outlook format
- **Fallback:** None — requires extract-msg package

### HTML
- **Tool:** html2text
- **Strategy:** Convert to markdown preserving links and structure
- **Output:** Clean markdown

### TXT
- **Tool:** Python stdlib
- **Strategy:** Wrap in code block with frontmatter
- **Output:** Preserved as-is in fenced code block

### MD
- **Tool:** Python stdlib
- **Strategy:** Add frontmatter if not already present, otherwise copy
- **Output:** Original content preserved

### Images (JPG, PNG, TIFF, BMP)
- **Tool:** pytesseract (optional)
- **Strategy:** OCR text extraction
- **Fallback:** If pytesseract not installed, flag as "skipped — OCR not available"

---

## Part 6 — Folder Exclusions

The converter **skips** these directories:

| Directory | Reason |
|-----------|--------|
| `output/` | Output directory — don't re-convert |
| `.git/` | Version control internals |
| `node_modules/` | Package manager artifacts |
| `__pycache__/` | Python bytecode cache |
| `.pi/` | Agent state files |
| `.atl/` | Skill registry |
| `.pi-lens/` | Code intelligence cache |
| `.worktrees/` | Git worktree data |

---

## Part 7 — File Size Limits

- Maximum file size: **100 MB** per file
- Files exceeding the limit are skipped with a warning
- No total folder size limit (processes all files sequentially)

---

## Part 8 — Integration with Downstream Skills

### How /forhemit-preflight uses the output

The preflight skill reads `<folder>/output/_manifest.json` to:
1. Know which documents are available (and which are missing)
2. Read each `.md` file for content analysis
3. Build the document inventory for the internal/external reports
4. Map source files to ESOP preflight checklist categories

### How /forhemit-proposal uses the output

The proposal skill reads converted markdown to:
1. Extract company name, entity type, EBITDA, employee count, etc.
2. Auto-fill template form fields (engagement letter, term sheet, etc.)
3. Cross-reference with preflight analysis for risk flags

### Handoff Protocol

After conversion completes:
1. Output the summary (Step 5 above)
2. If the user wants to continue, suggest: `/forhemit-preflight <folder>`
3. The manifest and all markdown files persist in the folder — no session state needed

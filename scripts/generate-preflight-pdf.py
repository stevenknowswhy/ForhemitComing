#!/usr/bin/env python3
"""
Generate branded PDFs from preflight markdown reports.
Usage: python3 scripts/generate-preflight-pdf.py /path/to/output/folder
"""

import sys
import re
from pathlib import Path
from typing import Any, Callable

log_document: Callable[..., object] | None = None
try:
    from ghost_logger import log_document  # noqa: F811
except ImportError:
    pass

markdown: Any = None
HTML: Any = None

try:
    import markdown as _md

    markdown = _md
    HAS_MARKDOWN = True
except ImportError:
    HAS_MARKDOWN = False

try:
    from weasyprint import HTML as _HTML

    HTML = _HTML
    HAS_WEASYPRINT = True
except ImportError:
    HAS_WEASYPRINT = False

BRAND_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Mono:wght@300;400&family=Jost:wght@300;400;500&display=swap');

@page {
    size: letter;
    margin: 0.75in;
    @bottom-center {
        content: "Forhemit Transition Stewardship  |  deals@forhemit.com  |  forhemit.com";
        font-family: 'DM Mono', monospace;
        font-size: 7pt;
        color: #999;
    }
    @bottom-right {
        content: "CONFIDENTIAL";
        font-family: 'DM Mono', monospace;
        font-size: 7pt;
        color: #7A5C20;
    }
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 10pt; }
body {
    color: #111;
    background: #fff;
    font-family: 'Jost', system-ui, sans-serif;
    line-height: 1.85;
    font-weight: 300;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    color: #111;
    margin: 1.5em 0 0.5em 0;
    page-break-after: avoid;
}

h1 {
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 0.04em;
    text-align: center;
    margin-top: 0;
}

h2 {
    font-size: 1.2rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.3em;
}

h3 {
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: #7A5C20;
}

p { margin-bottom: 0.8em; }

table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
}

th, td {
    padding: 8px 10px;
    border: 1px solid #ddd;
    text-align: left;
    vertical-align: top;
}

th {
    background: #f8f9fa;
    font-family: 'DM Mono', monospace;
    font-weight: 400;
    font-size: 7pt;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #7A5C20;
}

td { font-weight: 300; }

tr:nth-child(even) { background: #fafafa; }

strong { font-weight: 500; }

hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 2em 0;
}

ul, ol {
    margin: 0.5em 0 1em 1.5em;
}

li { margin-bottom: 0.3em; }

code {
    font-family: 'DM Mono', monospace;
    font-size: 8.5pt;
    background: #f5f5f5;
    padding: 2px 4px;
    border-radius: 2px;
}

blockquote {
    border-left: 2px solid #7A5C20;
    padding: 0.5em 1em;
    margin: 1em 0;
    background: #faf7f0;
    font-style: italic;
}

div[style*="page-break-before"] {
    page-break-before: always;
    display: block;
    height: 0;
    margin: 0;
    padding: 0;
    border: none;
}

.header-block {
    text-align: center;
    border-bottom: 2px solid #7A5C20;
    padding-bottom: 1.5em;
    margin-bottom: 2em;
}

.header-block .brand {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 300;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #111;
}

.header-block .brand-sub {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #7A5C20;
    font-weight: 400;
    margin-top: 0.3em;
}

.metadata-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border: 1px solid #bbb;
    margin: 1.5em 0 2em 0;
}

.meta-cell {
    padding: 0.6em 0.8em;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
}

.meta-cell:nth-child(even) { border-right: none; }
.meta-cell:nth-last-child(-n+2) { border-bottom: none; }

.meta-label {
    font-size: 6pt;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #7A5C20;
    margin-bottom: 0.2em;
}

.meta-value {
    font-size: 9pt;
    font-weight: 300;
}

.signal-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;
    font-family: 'DM Mono', monospace;
    font-size: 8pt;
    font-weight: 400;
    letter-spacing: 0.05em;
}

.signal-yes { background: #e8f5e9; color: #2E7D32; }
.signal-conditional { background: #fff8e1; color: #F57F17; }
.signal-no { background: #fce4ec; color: #C62828; }

.risk-red { border-left: 3px solid #C62828; padding: 0.5em 0.8em; margin: 0.8em 0; background: #fef0f0; }
.risk-yellow { border-left: 3px solid #F57F17; padding: 0.5em 0.8em; margin: 0.8em 0; background: #fff8e1; }
"""


def strip_yaml_frontmatter(text: str) -> str:
    """Remove YAML frontmatter from markdown text."""
    if text.startswith("---"):
        end = text.find("---", 3)
        if end != -1:
            return text[end + 3 :].strip()
    return text


def inject_page_breaks(html: str) -> str:
    """Ensure page-break divs survive markdown conversion.

    The python-markdown converter sometimes strips or mangles bare
    <div style="page-break-before"> tags.  This function normalises
    every variant into a clean, WeasyPrint-friendly break.
    """
    # Pattern 1: markdown converted the div correctly — leave it.
    # Pattern 2: the div was dropped or mangled — inject one before
    #             any <h2> or <h3> whose text matches our target sections.
    break_targets = [
        "company overview",
        "assessment",
        "next steps",
    ]
    for target in break_targets:
        # Match h2 or h3 containing the target text (case-insensitive)
        pattern = re.compile(
            r"(?<!page-break-before)(<(?:h2|h3)[^>]*>([^<]*"
            + re.escape(target)
            + r"[^<]*)</(?:h2|h3)>)",
            re.IGNORECASE,
        )
        html = pattern.sub(r'<div style="page-break-before: always;"></div>\n\1', html)
    return html


def md_to_html(md_text: str) -> str:
    """Convert markdown to HTML."""
    if HAS_MARKDOWN:
        raw = markdown.markdown(
            md_text,
            extensions=["tables", "fenced_code", "toc"],
        )
    else:
        # Fallback: minimal conversion
        text = md_text
        text = re.sub(r"^### (.+)$", r"<h3>\1</h3>", text, flags=re.MULTILINE)
        text = re.sub(r"^## (.+)$", r"<h2>\1</h2>", text, flags=re.MULTILINE)
        text = re.sub(r"^# (.+)$", r"<h1>\1</h1>", text, flags=re.MULTILINE)
        text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
        text = re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
        text = re.sub(r"^---$", r"<hr>", text, flags=re.MULTILINE)
        text = re.sub(r"\n\n", r"</p><p>", text)
        raw = f"<p>{text}</p>"
    return inject_page_breaks(raw)


def build_full_html(body_html: str, title: str) -> str:
    """Wrap body HTML in a complete document with branding."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{title}</title>
<style>{BRAND_CSS}</style>
</head>
<body>
<div class="header-block">
    <div class="brand">Forhemit</div>
    <div class="brand-sub">Transition Stewardship</div>
</div>
{body_html}
</body>
</html>"""


def generate_pdf(md_path: Path, output_path: Path, title: str):
    """Convert a markdown file to a branded PDF."""
    if not HAS_WEASYPRINT:
        print("  ❌ weasyprint not installed")
        return False

    md_text = md_path.read_text(encoding="utf-8")
    body_text = strip_yaml_frontmatter(md_text)
    body_html = md_to_html(body_text)
    full_html = build_full_html(body_html, title)

    try:
        HTML(string=full_html).write_pdf(str(output_path))
        size_kb = output_path.stat().st_size / 1024
        print(f"  ✅ {output_path.name} ({size_kb:.0f} KB)")
        return True
    except Exception as e:
        print(f"  ❌ {output_path.name}: {e}")
        return False


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/generate-preflight-pdf.py /path/to/output/folder")
        sys.exit(1)

    output_dir = Path(sys.argv[1]).resolve()
    if not output_dir.exists():
        print(f"ERROR: Directory not found: {output_dir}")
        sys.exit(1)

    # Find preflight markdown files
    internal_md = list(output_dir.glob("preflight-internal-*.md"))
    external_md = list(output_dir.glob("preflight-external-*.md"))

    if not internal_md and not external_md:
        print(f"ERROR: No preflight markdown files found in {output_dir}")
        sys.exit(1)

    print("\n  Generating branded PDFs...\n")

    ref = None
    company_name = None
    if internal_md:
        ref = internal_md[0].stem.replace("preflight-internal-", "").upper()
    elif external_md:
        ref = external_md[0].stem.replace("preflight-external-", "").upper()

    for md_path in internal_md:
        pdf_name = md_path.stem + ".pdf"
        pdf_path = output_dir / pdf_name
        title = (
            f"Preflight Internal — {md_path.stem.replace('preflight-internal-', '')}"
        )
        generate_pdf(md_path, pdf_path, title)
        if log_document is not None:
            try:
                log_document(
                    document_type="preflight-internal",
                    file_path=str(pdf_path),
                    ref=ref,
                    generated_by="forhemit-preflight",
                )
            except Exception:
                pass

    for md_path in external_md:
        pdf_name = md_path.stem + ".pdf"
        pdf_path = output_dir / pdf_name
        title = f"Preflight Summary — {md_path.stem.replace('preflight-external-', '')}"
        generate_pdf(md_path, pdf_path, title)
        if log_document is not None:
            try:
                log_document(
                    document_type="preflight-external",
                    file_path=str(pdf_path),
                    ref=ref,
                    generated_by="forhemit-preflight",
                )
            except Exception:
                pass

    print()


if __name__ == "__main__":
    main()

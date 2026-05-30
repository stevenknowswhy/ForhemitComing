#!/usr/bin/env python3
"""
Forhemit — Notice of Receipt of Signed NDA
───────────────────────────────────────────
Generates a simple, branded acknowledgment letter confirming
receipt of a signed NDA for the client's records.

Usage:
  python3 scripts/generate-nda-receipt.py \
    --company "Dark Horse Institute" \
    --seller "Robin Crow" \
    --ref "DHI-2026-001" \
    --output /path/to/output/folder

  python3 scripts/generate-nda-receipt.py \
    --company "Acme Corp" \
    --seller "Jane Doe" \
    --output /Users/stephenstokes/Workspace/Clients/Acme/output
"""

import argparse
import sys
from datetime import datetime
from pathlib import Path

log_document = None
try:
    from ghost_logger import log_document  # noqa: F811
except ImportError:
    pass

try:
    from weasyprint import HTML

    HAS_WEASYPRINT = True
except ImportError:
    HAS_WEASYPRINT = False


BRAND_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Mono:wght@300;400&family=Jost:wght@300;400;500&display=swap');

@page {
    size: letter;
    margin: 1in;
    @bottom-center {
        content: "Forhemit Transition Stewardship  |  deals@forhemit.com  |  forhemit.com";
        font-family: 'DM Mono', monospace;
        font-size: 7pt;
        color: #999;
    }
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 11pt; }
body {
    color: #111;
    background: #fff;
    font-family: 'Jost', system-ui, sans-serif;
    font-weight: 300;
    line-height: 1.7;
}

.header {
    border-bottom: 2px solid #7A5C20;
    padding-bottom: 1.2rem;
    margin-bottom: 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.brand-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.4rem;
    font-weight: 300;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #111;
}

.brand-sub {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #7A5C20;
    font-weight: 400;
    margin-top: 0.2em;
}

.header-right {
    text-align: right;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    color: #666;
    line-height: 1.8;
}

.title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.6rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: #111;
    text-align: center;
    margin-bottom: 0.3rem;
}

.subtitle {
    font-size: 0.65rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #666;
    text-align: center;
    margin-bottom: 2.5rem;
}

.date-line {
    text-align: right;
    font-size: 0.85rem;
    color: #333;
    margin-bottom: 2rem;
}

.meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border: 1px solid #bbb;
    margin-bottom: 2rem;
}

.meta-cell {
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
}

.meta-cell:nth-child(even) { border-right: none; }
.meta-cell:nth-last-child(-n+2) { border-bottom: none; }

.meta-label {
    font-size: 0.55rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #7A5C20;
    margin-bottom: 0.15rem;
}

.meta-value {
    font-size: 0.85rem;
    font-weight: 300;
    color: #111;
}

.body-text {
    font-size: 0.9rem;
    line-height: 1.85;
    color: #333;
    margin-bottom: 1.2rem;
}

.body-text strong {
    font-weight: 500;
    color: #111;
}

.signature-block {
    margin-top: 3rem;
}

.sig-line {
    border-bottom: 1px solid #bbb;
    width: 250px;
    margin-bottom: 0.3rem;
    height: 2rem;
}

.sig-label {
    font-size: 0.55rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #666;
}

.footer-notice {
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid #ddd;
    font-size: 0.65rem;
    color: #999;
    line-height: 1.6;
}
"""


def generate_nda_receipt(
    company: str,
    seller: str,
    ref: str,
    nda_date: str,
    output_dir: Path,
) -> Path:
    today = datetime.now().strftime("%B %d, %Y")
    output_dir.mkdir(parents=True, exist_ok=True)
    filename = f"NDA-Receipt-{company.replace(' ', '-')}.pdf"
    output_path = output_dir / filename

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Notice of Receipt of Signed NDA — {company}</title>
<style>{BRAND_CSS}</style>
</head>
<body>

<div class="header">
    <div>
        <div class="brand-name">Forhemit</div>
        <div class="brand-sub">Transition Stewardship</div>
    </div>
    <div class="header-right">
        <div>forhemit.com</div>
        <div>deals@forhemit.com</div>
        <div style="margin-top:0.3rem; color:#7A5C20;">Ref: {ref}</div>
    </div>
</div>

<div class="title">Notice of Receipt of Signed NDA</div>
<div class="subtitle">Confidentiality Acknowledgment</div>

<div class="date-line">{today}</div>

<div class="meta-grid">
    <div class="meta-cell">
        <div class="meta-label">Company</div>
        <div class="meta-value">{company}</div>
    </div>
    <div class="meta-cell">
        <div class="meta-label">Authorized Signatory</div>
        <div class="meta-value">{seller}</div>
    </div>
    <div class="meta-cell">
        <div class="meta-label">NDA Date</div>
        <div class="meta-value">{nda_date}</div>
    </div>
    <div class="meta-cell">
        <div class="meta-label">Reference</div>
        <div class="meta-value">{ref}</div>
    </div>
</div>

<p class="body-text">
    This notice confirms that Forhemit Transition Stewardship has received a
    executed Non-Disclosure Agreement ("<strong>NDA</strong>") from
    <strong>{seller}</strong> on behalf of <strong>{company}</strong>,
    dated <strong>{nda_date}</strong>.
</p>

<p class="body-text">
    The NDA governs the exchange of confidential information between the parties
    in connection with the potential evaluation of an employee ownership
    transaction. Forhemit acknowledges receipt and will comply with the terms
    of the executed NDA for the duration of the engagement.
</p>

<p class="body-text">
    This notice is provided for the Company's records. A copy of the fully
    executed NDA is retained by Forhemit and available upon request.
</p>

<div class="signature-block">
    <div class="sig-line"></div>
    <div class="sig-label">Stefano Stokes, Founder</div>
    <div style="font-size:0.75rem; color:#333; margin-top:0.1rem;">
        Forhemit Transition Stewardship
    </div>
</div>

<div class="footer-notice">
    Forhemit Stewardship Management Co. &middot; California Public Benefit Corporation<br>
    This notice confirms receipt only and does not constitute an engagement letter,
    agreement to proceed, or binding commitment of any kind.
</div>

</body>
</html>"""

    HTML(string=html).write_pdf(str(output_path))
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Generate NDA receipt notice PDF")
    parser.add_argument("--company", required=True, help="Company legal name")
    parser.add_argument("--seller", required=True, help="Authorized signatory name")
    parser.add_argument(
        "--ref", default=None, help="Deal reference (auto-generated if omitted)"
    )
    parser.add_argument(
        "--nda-date", default=None, help="Date NDA was signed (default: today)"
    )
    parser.add_argument("--output", required=True, help="Output directory for PDF")

    args = parser.parse_args()

    if not HAS_WEASYPRINT:
        print("ERROR: weasyprint not installed. Run: pip install weasyprint")
        sys.exit(1)

    ref = args.ref or f"{args.company[:3].upper()}-{datetime.now().strftime('%Y')}-001"
    nda_date = args.nda_date or datetime.now().strftime("%B %d, %Y")
    output_dir = Path(args.output).resolve()

    pdf_path = generate_nda_receipt(
        company=args.company,
        seller=args.seller,
        ref=ref,
        nda_date=nda_date,
        output_dir=output_dir,
    )

    size_kb = pdf_path.stat().st_size / 1024
    print(f"\n  ✅ {pdf_path.name}  ({size_kb:.0f} KB)")
    print(f"  📄 {pdf_path}\n")

    if log_document is not None:
        try:
            log_document(
                document_type="nda-receipt",
                file_path=str(pdf_path),
                company_name=args.company,
                ref=ref,
                generated_by="generate-nda-receipt.py",
            )
        except Exception:
            pass


if __name__ == "__main__":
    main()

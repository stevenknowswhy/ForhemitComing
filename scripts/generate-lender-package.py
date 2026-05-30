#!/usr/bin/env python3
"""
Forhemit — Lender Package Document Generator
─────────────────────────────────────────────
Generates branded PDF documents for SBA lender outreach and qualification:
  - sba-lender-brief           One-page outreach brief for SBA 7(a) lenders
  - sba-intake-form            Lender intake form (printable, 3 pages)
  - lender-interview-questions Structured interview questions (4 pages)
  - lender-scoring-rubric      Weighted qualification scoring matrix

Usage:
  python3 scripts/generate-lender-package.py --type sba-lender-brief \\
    --company "Dark Horse Institute" --seller "Robin Crow" \\
    --lender "Live Oak Bank" --lender-contact "Sarah Chen" \\
    --lender-email "schen@liveoakbank.com" \\
    --ref DHI-2026-001 \\
    --transaction-size "$7.2M" --loan-amount "$5.4M" \\
    --esop-percentage "100%" --valuation "$7.2M" \\
    --output /path/to/output

  python3 scripts/generate-lender-package.py --type sba-intake-form \\
    --company "Dark Horse Institute" --ref DHI-2026-001 \\
    --output /path/to/output

  python3 scripts/generate-lender-package.py --type lender-interview-questions \\
    --company "Dark Horse Institute" --lender "Live Oak Bank" \\
    --lender-contact "Sarah Chen" \\
    --ref DHI-2026-001 \\
    --output /path/to/output

  python3 scripts/generate-lender-package.py --type lender-scoring-rubric \\
    --company "Dark Horse Institute" --ref DHI-2026-001 \\
    --output /path/to/output
"""

import argparse
import contextlib
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

log_document = None
with contextlib.suppress(ImportError):
    from ghost_logger import log_document  # noqa: F811

HTML: Any = None
with contextlib.suppress(ImportError):
    from weasyprint import HTML  # type: ignore[assignment]

HAS_WEASYPRINT = HTML is not None

# ── Brand CSS ───────────────────────────────────────────────────────────────

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
        content: counter(page) " of " counter(pages);
        font-family: 'DM Mono', monospace;
        font-size: 7pt;
        color: #999;
    }
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 10pt; }
body {
    color: #111;
    background: #fff;
    font-family: 'Jost', system-ui, sans-serif;
    font-weight: 300;
    line-height: 1.85;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

/* ── Header ── */
.dh {
    border-bottom: 1px solid #bbb;
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 2rem;
}
.db-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 300;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #111;
}
.db-sub {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #7A5C20;
    font-weight: 400;
}
.dref {
    text-align: right;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    color: #666;
    line-height: 1.8;
}

/* ── Title ── */
.dt {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 0.04em;
    color: #111;
    margin-bottom: 0.4rem;
}
.dst {
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #666;
    margin-bottom: 2rem;
}

/* ── Context Value Grid ── */
.cvg {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border: 1px solid #bbb;
    margin-bottom: 2.5rem;
}
.cvc {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
}
.cvc:nth-child(even) { border-right: none; }
.cvc:nth-last-child(-n+2) { border-bottom: none; }
.cvc-l {
    font-size: 0.55rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #7A5C20;
    margin-bottom: 0.3rem;
    font-weight: 400;
}
.cvc-v {
    font-size: 0.88rem;
    font-weight: 300;
    color: #111;
    min-height: 1.2em;
}

/* ── Sections ── */
.sec {
    margin-bottom: 2rem;
    break-inside: avoid;
}
.sh {
    display: flex;
    align-items: baseline;
    gap: 0.8rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #ddd;
    break-after: avoid;
}
.sn {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    color: #7A5C20;
    font-weight: 300;
    flex-shrink: 0;
    letter-spacing: 0.08em;
}
.st {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.05rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: #111;
}
.sb {
    font-size: 0.83rem;
    font-weight: 300;
    line-height: 1.85;
    color: #333;
}
.sb p { margin-bottom: 0.8rem; }
.sb p:last-child { margin-bottom: 0; }

/* ── Callout ── */
.co {
    border-left: 2px solid #7A5C20;
    padding: 0.6rem 0.9rem;
    margin: 0.8rem 0;
    font-size: 0.78rem;
    line-height: 1.7;
    color: #333;
    background: #faf7f0;
    break-inside: avoid;
}
.co strong { color: #111; font-weight: 500; }

/* ── Stacked List ── */
.sl {
    margin: 0.8rem 0;
    display: grid;
    gap: 0;
    border-top: 1px solid #ddd;
}
.si {
    display: grid;
    grid-template-columns: 26px 1fr;
    gap: 0.6rem;
    align-items: start;
    padding: 0.55rem 0;
    border-bottom: 1px solid #ddd;
    font-size: 0.8rem;
    font-weight: 300;
    color: #333;
}
.si-n {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    color: #7A5C20;
    padding-top: 0.1rem;
}

/* ── Cost Table ── */
.cost-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.78rem;
}
.cost-table th {
    text-align: left;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #666;
    font-weight: 400;
    padding: 0.5rem 0.6rem;
    border-bottom: 2px solid #bbb;
}
.cost-table td {
    padding: 0.5rem 0.6rem;
    border-bottom: 1px solid #ddd;
    font-weight: 300;
    color: #333;
}
.cost-table td:first-child { font-weight: 400; color: #111; }
.cost-table td.amount {
    text-align: right;
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
}
.cost-table tr.total td {
    border-top: 2px solid #bbb;
    border-bottom: 2px solid #bbb;
    font-weight: 500;
    color: #111;
}
.cost-table tr.total td.amount { color: #7A5C20; }

/* ── Form Fields ── */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem 2rem;
    margin-bottom: 0.6rem;
}
.form-field {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}
.form-field label {
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7A5C20;
    font-weight: 400;
}
.form-field .f-line {
    border-bottom: 1px solid #bbb;
    height: 1.8rem;
    min-width: 100%;
}
.form-field-full {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-bottom: 0.6rem;
}
.form-field-full label {
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7A5C20;
    font-weight: 400;
}
.form-field-full .f-line {
    border-bottom: 1px solid #bbb;
    height: 1.8rem;
}
.check-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.45rem 0;
    border-bottom: 1px solid #ddd;
    font-size: 0.8rem;
    font-weight: 300;
    color: #333;
}
.check-box {
    width: 14px;
    height: 14px;
    border: 1px solid #bbb;
    flex-shrink: 0;
}

/* ── Field Row ── */
.fr {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.5rem;
}
.fr label {
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #666;
    white-space: nowrap;
    min-width: 140px;
}

/* ── Signature Grid ── */
.sg {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 1.5rem;
}
.sb-block {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}
.sb-entity {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 0.95rem;
    font-weight: 300;
    color: #111;
    line-height: 1.4;
}
.s-line {
    border-bottom: 1px solid #bbb;
    height: 2.5rem;
    margin-top: 0.3rem;
}
.s-lbl {
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #666;
    margin-top: 0.3rem;
}

/* ── Footer ── */
.df {
    border-top: 1px solid #ddd;
    padding-top: 1.2rem;
    margin-top: 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    break-inside: avoid;
}
.df-note {
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #666;
    line-height: 1.8;
}
.df-conf {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    color: #7A5C20;
    text-align: right;
}

/* ── Question Block ── */
.qb {
    margin-bottom: 0.7rem;
    padding-left: 0.5rem;
    border-left: 2px solid transparent;
}
.qb:hover { border-left-color: #7A5C20; }
.q-num {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    color: #7A5C20;
    font-weight: 400;
    margin-right: 0.5rem;
}
.q-text {
    font-size: 0.8rem;
    font-weight: 300;
    color: #111;
    line-height: 1.6;
}
.q-note {
    font-size: 0.68rem;
    font-weight: 300;
    color: #666;
    font-style: italic;
    margin-top: 0.15rem;
    padding-left: 2rem;
}

/* ── Rubric ── */
.rubric-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.72rem;
}
.rubric-table th {
    text-align: left;
    font-size: 0.58rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #666;
    font-weight: 400;
    padding: 0.5rem 0.5rem;
    border-bottom: 2px solid #bbb;
}
.rubric-table th.center { text-align: center; }
.rubric-table td {
    padding: 0.45rem 0.5rem;
    border-bottom: 1px solid #ddd;
    font-weight: 300;
    color: #333;
    vertical-align: top;
}
.rubric-table td:first-child { font-weight: 400; color: #111; }
.rubric-table td.center { text-align: center; }
.rubric-table td.weight {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    text-align: center;
    color: #7A5C20;
}
.rubric-table td.score {
    text-align: center;
    font-family: 'DM Mono', monospace;
}
.rubric-table tr.total td {
    border-top: 2px solid #bbb;
    border-bottom: 2px solid #bbb;
    font-weight: 500;
    color: #111;
}

/* ── Grade Badge ── */
.grade-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border: 1px solid #bbb;
    margin: 1rem 0;
}
.grade-cell {
    padding: 0.5rem;
    text-align: center;
    border-right: 1px solid #ddd;
    font-size: 0.68rem;
}
.grade-cell:last-child { border-right: none; }
.grade-letter {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.2rem;
    font-weight: 500;
    color: #111;
}
.grade-range {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    color: #666;
}
.grade-label {
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #7A5C20;
    margin-top: 0.2rem;
}
"""


def _wrap_html(body: str, title: str) -> str:
    """Wrap a body fragment in a full HTML document with brand CSS."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{title}</title>
<style>{BRAND_CSS}</style>
</head>
<body>
{body}
</body>
</html>"""


def _header_block(ref: str = "") -> str:
    ref_line = (
        f'<div style="margin-top:0.4rem;color:#7A5C20;">Ref: {ref}</div>' if ref else ""
    )
    return f"""<div class="dh">
    <div>
        <div class="db-name">Forhemit</div>
        <div class="db-sub">Transition Stewardship</div>
    </div>
    <div class="dref">
        <div>forhemit.com</div>
        <div>deals&#64;forhemit.com</div>
        {ref_line}
    </div>
</div>"""


def _footer_block(generated: str, confidential: str = "CONFIDENTIAL") -> str:
    return f"""<div class="df">
    <div class="df-note">Generated: {generated}<br>deals&#64;forhemit.com &#183; forhemit.com</div>
    <div class="df-conf">{confidential}</div>
</div>"""


def _sig_block() -> str:
    return """<div class="sec">
    <div class="sh"><span class="sn">&#8212;</span><span class="st">Forhemit Transition Stewardship</span></div>
    <div class="sg">
        <div class="sb-block">
            <div class="sb-entity">Forhemit Stewardship Management Co.<br><span style="font-size:0.78rem;color:#666;">California Public Benefit Corporation</span></div>
            <div class="s-line"></div>
            <div class="s-lbl">Authorized Representative</div>
        </div>
        <div class="sb-block">
            <div style="font-size:0.62rem;letter-spacing:0.22em;text-transform:uppercase;color:#7A5C20;font-weight:400;">Date</div>
            <div class="s-line"></div>
        </div>
    </div>
</div>"""


def _lender_sig_block() -> str:
    return """<div class="sec">
    <div class="sh"><span class="sn">&#8212;</span><span class="st">Lender Acknowledgment</span></div>
    <div class="sg">
        <div class="sb-block">
            <div class="s-line"></div>
            <div class="s-lbl">Lender Authorized Signature</div>
        </div>
        <div class="sb-block">
            <div style="font-size:0.62rem;letter-spacing:0.22em;text-transform:uppercase;color:#7A5C20;font-weight:400;">Date</div>
            <div class="s-line"></div>
        </div>
    </div>
</div>"""


# ── Document: SBA Lender Outreach Brief ─────────────────────────────────────


def generate_sba_lender_brief(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    body = f"""
{_header_block(ctx['ref'])}

<div class="dt">SBA Lender Outreach Brief</div>
<div class="dst">ESOP Transaction — {ctx['company']}</div>

<div class="cvg">
    <div class="cvc"><div class="cvc-l">Company</div><div class="cvc-v">{ctx['company']}</div></div>
    <div class="cvc"><div class="cvc-l">Reference</div><div class="cvc-v">{ctx['ref']}</div></div>
    <div class="cvc"><div class="cvc-l">Seller</div><div class="cvc-v">{ctx['seller']}</div></div>
    <div class="cvc"><div class="cvc-l">Date</div><div class="cvc-v">{today}</div></div>
    <div class="cvc"><div class="cvc-l">Transaction Size</div><div class="cvc-v">{ctx['transaction_size']}</div></div>
    <div class="cvc"><div class="cvc-l">ESOP Percentage</div><div class="cvc-v">{ctx['esop_percentage']}</div></div>
    <div class="cvc"><div class="cvc-l">Valuation</div><div class="cvc-v">{ctx['valuation']}</div></div>
    <div class="cvc"><div class="cvc-l">Status</div><div class="cvc-v">Pre-Qualification</div></div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 01</span><span class="st">Executive Summary</span></div>
    <div class="sb">
        <p>Forhemit Stewardship Management Co. is facilitating an Employee Stock Ownership Plan (ESOP) transaction for <strong>{ctx['company']}</strong>, a qualified operating company. We are reaching out to introduce this financing opportunity and assess your institution's appetite for SBA 7(a) guaranteed lending in support of this ESOP acquisition.</p>
        <p>The transaction involves the acquisition of <strong>{ctx['esop_percentage']}</strong> of the company's outstanding equity by a newly formed ESOP trust, with an independent ASA-accredited valuation of <strong>{ctx['valuation']}</strong>. The seller, <strong>{ctx['seller']}</strong>, is committed to a structured transition with continued involvement post-close.</p>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 02</span><span class="st">ESOP Suitability Indicators</span></div>
    <div class="sb">
        <div class="sl">
            <div class="si"><span class="si-n">A.</span><span><strong>Stable revenue base.</strong> The company demonstrates consistent annual revenue with predictable cash flow patterns, supporting reliable debt service coverage.</span></div>
            <div class="si"><span class="si-n">B.</span><span><strong>Positive EBITDA trajectory.</strong> Trailing twelve-month EBITDA meets or exceeds the SBA 7(a) minimum threshold with a healthy debt service coverage ratio (DSCR).</span></div>
            <div class="si"><span class="si-n">C.</span><span><strong>Experienced management team.</strong> A capable management layer exists below the seller, providing operational continuity and reducing key-person risk.</span></div>
            <div class="si"><span class="si-n">D.</span><span><strong>Favorable industry position.</strong> The company operates in a sector with demonstrated ESOP compatibility and long-term market stability.</span></div>
            <div class="si"><span class="si-n">E.</span><span><strong>Clean legal and compliance posture.</strong> No material pending litigation, regulatory actions, or environmental liabilities identified.</span></div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 03</span><span class="st">SBA 7(a) Financing Structure</span></div>
    <div class="sb">
        <table class="cost-table">
            <thead><tr><th style="width:55%;">Component</th><th style="text-align:right;">Detail</th></tr></thead>
            <tbody>
                <tr><td>Total Transaction Value</td><td class="amount">{ctx['transaction_size']}</td></tr>
                <tr><td>Requested Loan Amount</td><td class="amount">{ctx['loan_amount']}</td></tr>
                <tr><td>SBA Guarantee (est.)</td><td class="amount">Up to 75%</td></tr>
                <tr><td>Borrower Equity Injection</td><td class="amount">Per SBA requirements</td></tr>
                <tr><td>Use of Proceeds</td><td class="amount">ESOP stock acquisition</td></tr>
                <tr><td>Projected DSCR</td><td class="amount">&ge; 1.25x</td></tr>
                <tr class="total"><td>Guaranteed Portion</td><td class="amount">SBA 7(a) eligible</td></tr>
            </tbody>
        </table>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 04</span><span class="st">Key Transaction Metrics</span></div>
    <div class="sb">
        <div class="cvg" style="margin-bottom:0;">
            <div class="cvc"><div class="cvc-l">Enterprise Value</div><div class="cvc-v">{ctx['valuation']}</div></div>
            <div class="cvc"><div class="cvc-l">Loan-to-Value</div><div class="cvc-v">Per SBA guidelines</div></div>
            <div class="cvc"><div class="cvc-l">ESOP Structure</div><div class="cvc-v">Leveraged ESOP</div></div>
            <div class="cvc"><div class="cvc-l">Entity Type</div><div class="cvc-v">C-Corporation</div></div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 05</span><span class="st">Forhemit's Role</span></div>
    <div class="sb">
        <p>Forhemit serves as the transaction steward, coordinating the ESOP deal team and managing the process from pre-qualification through closing and post-close transition. Our responsibilities include:</p>
        <div class="sl">
            <div class="si"><span class="si-n">01</span><span><strong>Deal preparation.</strong> Assembling the lender package, coordinating QofE analysis, and preparing all transaction documentation.</span></div>
            <div class="si"><span class="si-n">02</span><span><strong>Team coordination.</strong> Managing the ESOP trustee, ERISA counsel, independent valuation firm, and lender communications.</span></div>
            <div class="si"><span class="si-n">03</span><span><strong>Process management.</strong> Overseeing the 120-day structured timeline with clear gates and decision points.</span></div>
            <div class="si"><span class="si-n">04</span><span><strong>Post-close stewardship.</strong> Providing ongoing operational support, compliance management, and annual reporting coordination.</span></div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 06</span><span class="st">SBA 7(a) Program Notes</span></div>
    <div class="sb">
        <div class="co"><strong>ESOP eligibility:</strong> SBA 7(a) loans are available for leveraged ESOP buyouts when the ESOP acquires at least 51% of the company's outstanding stock. The SBA guarantee covers up to 75% of the loan amount. ESOP transactions must comply with ERISA requirements and obtain an independent ASA-accredited valuation.</div>
        <p>This transaction has been structured to meet SBA 7(a) eligibility requirements, including C-Corp entity status, qualified ESOP trust formation, independent valuation, and post-close operational continuity.</p>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 07</span><span class="st">Next Steps</span></div>
    <div class="sb">
        <div class="sl">
            <div class="si"><span class="si-n">1.</span><span><strong>Review this brief.</strong> Assess the opportunity against your institution's ESOP lending criteria and SBA 7(a) appetite.</span></div>
            <div class="si"><span class="si-n">2.</span><span><strong>Schedule an introduction call.</strong> Contact Forhemit at <strong>deals&#64;forhemit.com</strong> to arrange a call with the deal team.</span></div>
            <div class="si"><span class="si-n">3.</span><span><strong>Request full package.</strong> Upon expression of interest, Forhemit will provide the complete lender package including QofE report, financial statements, management bios, and ESOP feasibility analysis.</span></div>
        </div>
    </div>
</div>

{_sig_block()}

{_footer_block(today, "CONFIDENTIAL — For qualified lender discussion only.")}
"""
    return _wrap_html(body, f"Forhemit — SBA Lender Outreach Brief — {ctx['company']}")


# ── Document: SBA Intake Form ───────────────────────────────────────────────


def generate_sba_intake_form(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    body = f"""
{_header_block(ctx['ref'])}

<div class="dt">SBA Lender Intake Form</div>
<div class="dst">ESOP Transaction — {ctx['company']}</div>

<div class="co"><strong>Instructions:</strong> Complete all fields below. This form is used by Forhemit to prepare the SBA 7(a) lender package and assess financing readiness. All information is treated as confidential under existing NDA. Fields marked with an asterisk (*) are required for SBA submission.</div>

<div class="cvg">
    <div class="cvc"><div class="cvc-l">Company</div><div class="cvc-v">{ctx['company']}</div></div>
    <div class="cvc"><div class="cvc-l">Reference</div><div class="cvc-v">{ctx['ref']}</div></div>
    <div class="cvc"><div class="cvc-l">Seller</div><div class="cvc-v">{ctx['seller']}</div></div>
    <div class="cvc"><div class="cvc-l">Date</div><div class="cvc-v">{today}</div></div>
</div>

<!-- ── Page 1: Sections 01-03 ── -->

<div class="sec">
    <div class="sh"><span class="sn">&#167; 01</span><span class="st">Lender Information *</span></div>
    <div class="sb">
        <div class="form-row">
            <div class="form-field"><label>Lending Institution *</label><div class="f-line"></div></div>
            <div class="form-field"><label>SBA Preferred Lender Status</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Contact Name *</label><div class="f-line"></div></div>
            <div class="form-field"><label>Title / Role</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Email *</label><div class="f-line"></div></div>
            <div class="form-field"><label>Phone</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>NMLS Number</label><div class="f-line"></div></div>
            <div class="form-field"><label>SBA Loan Authorization #</label><div class="f-line"></div></div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 02</span><span class="st">Borrower / ESOP Trust Information *</span></div>
    <div class="sb">
        <div class="form-row">
            <div class="form-field"><label>ESOP Trust Name *</label><div class="f-line"></div></div>
            <div class="form-field"><label>Trust Formation Date</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Trustee Name *</label><div class="f-line"></div></div>
            <div class="form-field"><label>Trustee Type (Individual / Institutional)</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>ERISA Counsel</label><div class="f-line"></div></div>
            <div class="form-field"><label>Independent Valuation Firm</label><div class="f-line"></div></div>
        </div>
        <div class="form-field-full"><label>Plan Administrator (if different from trustee)</label><div class="f-line"></div></div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 03</span><span class="st">Company Overview *</span></div>
    <div class="sb">
        <div class="form-row">
            <div class="form-field"><label>Company Legal Name *</label><div class="f-line"></div></div>
            <div class="form-field"><label>DBA (if different)</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>EIN / Tax ID *</label><div class="f-line"></div></div>
            <div class="form-field"><label>State of Incorporation *</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Industry / NAICS Code *</label><div class="f-line"></div></div>
            <div class="form-field"><label>Year Founded</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Principal Address *</label><div class="f-line"></div></div>
            <div class="form-field"><label>Entity Type (LLC / S-Corp / C-Corp) *</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Total W-2 Employees *</label><div class="f-line"></div></div>
            <div class="form-field"><label>Participating Employees (est.)</label><div class="f-line"></div></div>
        </div>
        <div class="form-field-full"><label>Brief Description of Business Operations</label><div class="f-line"></div></div>
    </div>
</div>

<!-- ── Page 2: Sections 04-05 ── -->
<div style="page-break-before:always;"></div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 04</span><span class="st">Financial Summary *</span></div>
    <div class="sb">
        <div class="form-row">
            <div class="form-field"><label>Annual Revenue (TTM) *</label><div class="f-line"></div></div>
            <div class="form-field"><label>Revenue (Prior Year)</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>EBITDA (TTM, QofE-adjusted) *</label><div class="f-line"></div></div>
            <div class="form-field"><label>EBITDA Margin %</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Owner's Total Compensation *</label><div class="f-line"></div></div>
            <div class="form-field"><label>SDE (Seller's Discretionary Earnings)</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Total Assets</label><div class="f-line"></div></div>
            <div class="form-field"><label>Total Liabilities</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Net Worth (Book Value)</label><div class="f-line"></div></div>
            <div class="form-field"><label>Working Capital</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Existing Debt Service (Annual) *</label><div class="f-line"></div></div>
            <div class="form-field"><label>Proposed SBA Debt Service (Annual)</label><div class="f-line"></div></div>
        </div>
        <div class="form-field-full"><label>Material Adjustments, Add-backs, or One-Time Items (describe)</label><div class="f-line"></div></div>
        <div class="form-field-full"><label>Revenue Trend (3 years: stable / growing / declining)</label><div class="f-line"></div></div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 05</span><span class="st">ESOP Transaction Details *</span></div>
    <div class="sb">
        <div class="form-row">
            <div class="form-field"><label>Transaction Value (Enterprise) *</label><div class="f-line"></div></div>
            <div class="form-field"><label>ESOP Ownership Percentage *</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Requested Loan Amount *</label><div class="f-line"></div></div>
            <div class="form-field"><label>Borrower Equity Injection</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Seller Note Amount (if any)</label><div class="f-line"></div></div>
            <div class="form-field"><label>Seller Note Terms</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Requested Loan Term (years)</label><div class="f-line"></div></div>
            <div class="form-field"><label>Requested Interest Rate Type (Fixed / Variable)</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Projected DSCR *</label><div class="f-line"></div></div>
            <div class="form-field"><label>Projected Job Retention / Creation</label><div class="f-line"></div></div>
        </div>
        <div class="form-field-full"><label>Use of Proceeds (breakdown by category)</label><div class="f-line"></div></div>
    </div>
</div>

<!-- ── Page 3: Sections 06-08 ── -->
<div style="page-break-before:always;"></div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 06</span><span class="st">Ownership &amp; Management</span></div>
    <div class="sb">
        <div class="form-row">
            <div class="form-field"><label>Seller Name *</label><div class="f-line"></div></div>
            <div class="form-field"><label>Seller Ownership % (pre-transaction)</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Seller Age</label><div class="f-line"></div></div>
            <div class="form-field"><label>Transition Period Commitment</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Management Depth (layers below owner)</label><div class="f-line"></div></div>
            <div class="form-field"><label>Succession Plan in Place?</label><div class="f-line"></div></div>
        </div>
        <div class="form-field-full"><label>Key Person Dependencies (describe)</label><div class="f-line"></div></div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 07</span><span class="st">Collateral &amp; Guarantees</span></div>
    <div class="sb">
        <div class="form-row">
            <div class="form-field"><label>Business Assets (estimated value)</label><div class="f-line"></div></div>
            <div class="form-field"><label>Real Estate (owned / leased)</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Equipment / FF&amp;E Value</label><div class="f-line"></div></div>
            <div class="form-field"><label>Accounts Receivable (avg.)</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Inventory Value</label><div class="f-line"></div></div>
            <div class="form-field"><label>Intellectual Property (if material)</label><div class="f-line"></div></div>
        </div>
        <div class="form-field-full"><label>Personal Guarantee Available? (Seller / Other)</label><div class="f-line"></div></div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 08</span><span class="st">Document Checklist</span></div>
    <div class="sb">
        <p>Check each document that is available for lender review. Forhemit will coordinate collection of missing items.</p>
        <div class="check-row"><div class="check-box"></div><span>3 years of federal tax returns (company)</span></div>
        <div class="check-row"><div class="check-box"></div><span>3 years of federal tax returns (seller / personal)</span></div>
        <div class="check-row"><div class="check-box"></div><span>Year-to-date internal financial statements (P&amp;L + Balance Sheet)</span></div>
        <div class="check-row"><div class="check-box"></div><span>Quality of Earnings (QofE) report</span></div>
        <div class="check-row"><div class="check-box"></div><span>Independent ASA-accredited valuation</span></div>
        <div class="check-row"><div class="check-box"></div><span>ESOP feasibility analysis</span></div>
        <div class="check-row"><div class="check-box"></div><span>Articles of incorporation / operating agreement</span></div>
        <div class="check-row"><div class="check-box"></div><span>Certificate of good standing</span></div>
        <div class="check-row"><div class="check-box"></div><span>Lease agreements (real estate and equipment)</span></div>
        <div class="check-row"><div class="check-box"></div><span>Major customer / vendor contracts</span></div>
        <div class="check-row"><div class="check-box"></div><span>Insurance certificates (key person, liability, property)</span></div>
        <div class="check-row"><div class="check-box"></div><span>Organizational chart with management bios</span></div>
        <div class="check-row"><div class="check-box"></div><span>Pending litigation disclosure (if any)</span></div>
        <div class="check-row"><div class="check-box"></div><span>Environmental assessment (if applicable)</span></div>
        <div class="check-row"><div class="check-box"></div><span>409A or other prior valuation (if available)</span></div>
    </div>
</div>

{_lender_sig_block()}

{_footer_block(today, "CONFIDENTIAL — SBA 7(a) Lender Package — For qualified lender use only.")}
"""
    return _wrap_html(body, f"Forhemit — SBA Intake Form — {ctx['company']}")


# ── Document: Lender Qualification Interview Questions ──────────────────────


def generate_lender_interview_questions(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")

    def q(num: int, text: str, note: str = "") -> str:
        note_html = f'<div class="q-note">{note}</div>' if note else ""
        return f'<div class="qb"><span class="q-num">{num}.</span><span class="q-text">{text}</span>{note_html}</div>'

    body = f"""
{_header_block(ctx['ref'])}

<div class="dt">Lender Qualification Interview</div>
<div class="dst">Structured Questions — {ctx['company']}</div>

<div class="cvg">
    <div class="cvc"><div class="cvc-l">Company</div><div class="cvc-v">{ctx['company']}</div></div>
    <div class="cvc"><div class="cvc-l">Reference</div><div class="cvc-v">{ctx['ref']}</div></div>
    <div class="cvc"><div class="cvc-l">Lender</div><div class="cvc-v">{ctx['lender']}</div></div>
    <div class="cvc"><div class="cvc-l">Contact</div><div class="cvc-v">{ctx['lender_contact']}</div></div>
    <div class="cvc"><div class="cvc-l">Seller</div><div class="cvc-v">{ctx['seller']}</div></div>
    <div class="cvc"><div class="cvc-l">Date</div><div class="cvc-v">{today}</div></div>
    <div class="cvc"><div class="cvc-l">Transaction Size</div><div class="cvc-v">{ctx['transaction_size']}</div></div>
    <div class="cvc"><div class="cvc-l">Loan Amount</div><div class="cvc-v">{ctx['loan_amount']}</div></div>
</div>

<div class="co"><strong>Purpose:</strong> These questions are designed to structure the lender qualification interview. Use them to assess the lender's appetite, process, and timeline for SBA 7(a) ESOP financing. Record responses in the space provided or on a separate notes sheet.</div>

<!-- ── Page 1: Section 01 ── -->

<div class="sec">
    <div class="sh"><span class="sn">&#167; 01</span><span class="st">Lender Profile &amp; ESOP Experience</span></div>
    <div class="sb">
        {q(1, "How many SBA 7(a) loans has your institution closed in the past 24 months?", "Indicates SBA lending volume and familiarity with the process.")}
        {q(2, "How many leveraged ESOP transactions has your institution financed?", "ESOP experience is critical — the deal structure differs significantly from standard business acquisitions.")}
        {q(3, "Are you an SBA Preferred Lender? If so, what is your PLP authorization level?", "Preferred Lenders can approve loans in-house, significantly reducing timeline.")}
        {q(4, "What is your typical SBA 7(a) loan size range?", "Confirm alignment with this transaction's requested amount.")}
        {q(5, "Do you have a dedicated SBA lending team or department?", "Specialized teams tend to process faster and with fewer issues.")}
        {q(6, "What is your current SBA 7(a) appetite for ESOP-related acquisitions?", "Some lenders have caps on ESOP lending or exclude it from their portfolio.")}
        {q(7, "Are there any industry restrictions that would affect this transaction?", "Confirm the company's industry is within the lender's acceptable risk profile.")}
        {q(8, "Do you work with independent ESOP trustees and ERISA counsel, or do you require borrower-selected advisors?", "Clarifies expectations for the deal team composition.")}
    </div>
</div>

<!-- ── Page 2: Section 02 ── -->
<div style="page-break-before:always;"></div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 02</span><span class="st">Underwriting &amp; Financial Requirements</span></div>
    <div class="sb">
        {q(9, "What is your minimum DSCR requirement for SBA 7(a) ESOP loans?", "Standard is 1.25x, but some lenders require higher for leveraged buyouts.")}
        {q(10, "Do you require a Quality of Earnings (QofE) report? If so, do you have preferred QofE providers?", "QofE is typically required for ESOP transactions. Lender preferences affect cost and timeline.")}
        {q(11, "What collateral coverage ratio do you require?", "Some lenders require 1:1 coverage; others accept less for strong cash-flow businesses.")}
        {q(12, "Do you accept the ESOP trust as the borrower, or do you require a personal guarantee from the seller?", "Structural requirement that affects deal terms.")}
        {q(13, "What is your policy on seller notes? Do you subordinate to the SBA loan?", "Seller notes are common in ESOPs. Subordination affects cash flow projections.")}
        {q(14, "How do you treat owner's compensation add-backs in the SBA underwriting?", "ESOP transactions may adjust owner comp post-close. Clarify treatment.")}
        {q(15, "Do you require a 409A valuation in addition to the ESOP's ASA-accredited valuation?", "Some lenders want independent confirmation of value.")}
        {q(16, "What is your maximum LTV for this type of transaction?", "Determines equity injection requirements.")}
    </div>
</div>

<!-- ── Page 3: Section 03 ── -->
<div style="page-break-before:always;"></div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 03</span><span class="st">ESOP-Specific Requirements</span></div>
    <div class="sb">
        {q(17, "What ESOP-specific documentation do you require beyond standard SBA application materials?", "Typically includes: trust document, plan document, trustee resolution, ERISA opinion letter.")}
        {q(18, "Do you require the ESOP plan to be pre-approved by the DOL before closing?", "DOL review is optional for most ESOPs but some lenders require it.")}
        {q(19, "What is your requirement for the independent valuation firm? Do you need to approve the appraiser?", "ASA-accredited firms are standard, but lender approval adds a step.")}
        {q(20, "How do you handle the &sect;1042 tax deferral documentation?", "Lender may need to confirm the seller's intent to elect &sect;1042 to structure the note properly.")}
        {q(21, "What are your requirements for the ESOP trustee?", "Individual vs. institutional trustee; lender may have preferences or requirements.")}
        {q(22, "Do you require an annual ESOP valuation update as a loan covenant?", "Standard practice — confirms ongoing compliance and collateral value.")}
    </div>
</div>

<!-- ── Page 4: Section 04 ── -->
<div style="page-break-before:always;"></div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 04</span><span class="st">Process &amp; Timeline</span></div>
    <div class="sb">
        {q(23, "What is your typical timeline from application to commitment letter for SBA 7(a) ESOP loans?", "Critical for the 120-day transaction timeline. Typical range: 45–90 days.")}
        {q(24, "What are your application fees? Are they refundable if the loan is not approved?", "Fees range from 0.25% to 1% of the loan amount. Refundability varies.")}
        {q(25, "What documentation is required at the initial application vs. at closing?", "Phased submission reduces upfront burden. Clarify what's needed at each gate.")}
        {q(26, "Who is the primary point of contact throughout the process?", "Establish a single point of contact to streamline communications.")}
        {q(27, "Do you require a site visit or management meeting before issuing a commitment letter?", "Some lenders require face-to-face; others work remotely.")}
        {q(28, "What is your post-closing reporting requirement?", "Annual financial statements, covenant compliance, ESOP valuation updates.")}
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 05</span><span class="st">Risk Assessment &amp; Conditions</span></div>
    <div class="sb">
        {q(29, "What are the most common reasons you decline SBA 7(a) ESOP applications?", "Helps identify deal-specific risks early in the process.")}
        {q(30, "Are there any current regulatory or SBA policy changes that could affect this transaction?", "SBA rules change periodically. Confirm current requirements.")}
        {q(31, "What conditions precedent do you require before funding?", "Typically: SBA authorization, satisfactory QofE, independent valuation, ERISA compliance, insurance.")}
        {q(32, "Do you participate in the SBA 504 program in addition to 7(a)? If so, is this transaction eligible for a 504 component?", "504 can finance real estate or equipment at favorable rates if applicable.")}
    </div>
</div>

{_sig_block()}

{_footer_block(today, "CONFIDENTIAL — Lender Qualification Interview — For Forhemit internal use only.")}
"""
    return _wrap_html(body, f"Forhemit — Lender Interview Questions — {ctx['company']}")


# ── Document: Lender Scoring Rubric ─────────────────────────────────────────


def generate_lender_scoring_rubric(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    body = f"""
{_header_block(ctx['ref'])}

<div class="dt">Lender Scoring Rubric</div>
<div class="dst">ESOP Qualification Assessment — {ctx['company']}</div>

<div class="cvg">
    <div class="cvc"><div class="cvc-l">Company</div><div class="cvc-v">{ctx['company']}</div></div>
    <div class="cvc"><div class="cvc-l">Reference</div><div class="cvc-v">{ctx['ref']}</div></div>
    <div class="cvc"><div class="cvc-l">Seller</div><div class="cvc-v">{ctx['seller']}</div></div>
    <div class="cvc"><div class="cvc-l">Date</div><div class="cvc-v">{today}</div></div>
    <div class="cvc"><div class="cvc-l">Transaction Size</div><div class="cvc-v">{ctx['transaction_size']}</div></div>
    <div class="cvc"><div class="cvc-l">Valuation</div><div class="cvc-v">{ctx['valuation']}</div></div>
    <div class="cvc"><div class="cvc-l">Loan Amount</div><div class="cvc-v">{ctx['loan_amount']}</div></div>
    <div class="cvc"><div class="cvc-l">Assessed By</div><div class="cvc-v">Forhemit</div></div>
</div>

<div class="co"><strong>Scoring Guide:</strong> Rate each criterion 1–5 (1 = Poor, 5 = Excellent). Multiply by the weight to get the weighted score. Sum all weighted scores for the total. Use the grade scale below to determine the overall recommendation.</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 01</span><span class="st">Weighted Scoring Criteria</span></div>
    <div class="sb">
        <table class="rubric-table">
            <thead>
                <tr>
                    <th style="width:28%;">Criterion</th>
                    <th class="center" style="width:10%;">Weight</th>
                    <th class="center" style="width:8%;">Score<br><span style="font-size:0.5rem;color:#999;">(1–5)</span></th>
                    <th class="center" style="width:12%;">Weighted</th>
                    <th style="width:42%;">Guidance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1. Financial Strength</td>
                    <td class="weight">25%</td>
                    <td class="score"></td>
                    <td class="score"></td>
                    <td style="font-size:0.68rem;">Revenue stability, EBITDA margins, DSCR, debt capacity, 3-year trends</td>
                </tr>
                <tr>
                    <td>2. Management Depth</td>
                    <td class="weight">20%</td>
                    <td class="score"></td>
                    <td class="score"></td>
                    <td style="font-size:0.68rem;">Succession readiness, key-person risk, team depth, transition plan</td>
                </tr>
                <tr>
                    <td>3. Collateral Coverage</td>
                    <td class="weight">15%</td>
                    <td class="score"></td>
                    <td class="score"></td>
                    <td style="font-size:0.68rem;">Asset base, real estate, equipment, AR, inventory, IP value</td>
                </tr>
                <tr>
                    <td>4. Cash Flow Stability</td>
                    <td class="weight">15%</td>
                    <td class="score"></td>
                    <td class="score"></td>
                    <td style="font-size:0.68rem;">Recurring revenue, customer concentration, contract backlog, seasonality</td>
                </tr>
                <tr>
                    <td>5. ESOP Readiness</td>
                    <td class="weight">10%</td>
                    <td class="score"></td>
                    <td class="score"></td>
                    <td style="font-size:0.68rem;">Entity type, plan document status, trustee identified, valuation complete</td>
                </tr>
                <tr>
                    <td>6. Industry Position</td>
                    <td class="weight">5%</td>
                    <td class="score"></td>
                    <td class="score"></td>
                    <td style="font-size:0.68rem;">Market stability, competitive moat, regulatory environment, growth outlook</td>
                </tr>
                <tr>
                    <td>7. Character &amp; Seller Commitment</td>
                    <td class="weight">5%</td>
                    <td class="score"></td>
                    <td class="score"></td>
                    <td style="font-size:0.68rem;">Seller transition period, reputation, references, engagement level</td>
                </tr>
                <tr>
                    <td>8. Deal Structure Quality</td>
                    <td class="weight">5%</td>
                    <td class="score"></td>
                    <td class="score"></td>
                    <td style="font-size:0.68rem;">LTV, equity injection, seller note terms, earn-out provisions</td>
                </tr>
                <tr class="total">
                    <td>TOTAL WEIGHTED SCORE</td>
                    <td class="weight">100%</td>
                    <td class="score" style="border-left:2px solid #bbb;"></td>
                    <td class="score" style="font-weight:500;"></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 02</span><span class="st">Grade Scale</span></div>
    <div class="sb">
        <div class="grade-grid">
            <div class="grade-cell">
                <div class="grade-letter">A+</div>
                <div class="grade-range">4.50 – 5.00</div>
                <div class="grade-label">Exceptional</div>
            </div>
            <div class="grade-cell">
                <div class="grade-letter">A</div>
                <div class="grade-range">4.00 – 4.49</div>
                <div class="grade-label">Strong</div>
            </div>
            <div class="grade-cell">
                <div class="grade-letter">B+</div>
                <div class="grade-range">3.50 – 3.99</div>
                <div class="grade-label">Good</div>
            </div>
            <div class="grade-cell">
                <div class="grade-letter">B</div>
                <div class="grade-range">3.00 – 3.49</div>
                <div class="grade-label">Acceptable</div>
            </div>
        </div>
        <div class="grade-grid" style="margin-top:0;">
            <div class="grade-cell">
                <div class="grade-letter">C+</div>
                <div class="grade-range">2.50 – 2.99</div>
                <div class="grade-label">Marginal</div>
            </div>
            <div class="grade-cell">
                <div class="grade-letter">C</div>
                <div class="grade-range">2.00 – 2.49</div>
                <div class="grade-label">Weak</div>
            </div>
            <div class="grade-cell">
                <div class="grade-letter">D</div>
                <div class="grade-range">1.50 – 1.99</div>
                <div class="grade-label">Poor</div>
            </div>
            <div class="grade-cell">
                <div class="grade-letter">F</div>
                <div class="grade-range">1.00 – 1.49</div>
                <div class="grade-label">Decline</div>
            </div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 03</span><span class="st">Recommendation</span></div>
    <div class="sb">
        <table class="cost-table" style="margin-bottom:1.5rem;">
            <thead><tr><th style="width:55%;">Assessment</th><th style="text-align:right;">Result</th></tr></thead>
            <tbody>
                <tr><td>Total Weighted Score</td><td class="amount" style="min-width:80px;"></td></tr>
                <tr><td>Overall Grade</td><td class="amount"></td></tr>
                <tr class="total"><td>Recommendation</td><td class="amount"></td></tr>
            </tbody>
        </table>

        <div class="form-field-full"><label>Strengths (top 2–3 factors supporting the deal)</label><div class="f-line" style="height:3rem;"></div></div>
        <div class="form-field-full"><label>Risk Concerns (top 2–3 factors requiring mitigation)</label><div class="f-line" style="height:3rem;"></div></div>
        <div class="form-field-full"><label>Conditions or Mitigants Required</label><div class="f-line" style="height:3rem;"></div></div>
        <div class="form-row">
            <div class="form-field"><label>Recommended Action</label><div class="f-line"></div></div>
            <div class="form-field"><label>Next Review Date</label><div class="f-line"></div></div>
        </div>
    </div>
</div>

{_sig_block()}

{_footer_block(today, "CONFIDENTIAL — Internal Assessment — Not for distribution to seller or broker.")}
"""
    return _wrap_html(body, f"Forhemit — Lender Scoring Rubric — {ctx['company']}")


# ── Main ────────────────────────────────────────────────────────────────────

GENERATORS = {
    "sba-lender-brief": generate_sba_lender_brief,
    "sba-intake-form": generate_sba_intake_form,
    "lender-interview-questions": generate_lender_interview_questions,
    "lender-scoring-rubric": generate_lender_scoring_rubric,
}

FILENAMES = {
    "sba-lender-brief": "SBA-Lender-Outreach-Brief",
    "sba-intake-form": "SBA-Intake-Form",
    "lender-interview-questions": "Lender-Qualification-Interview-Questions",
    "lender-scoring-rubric": "Lender-Scoring-Rubric",
}


def main():
    p = argparse.ArgumentParser(description="Forhemit lender package PDF generator")
    p.add_argument(
        "--type",
        choices=list(GENERATORS.keys()),
        required=True,
        help="Document type to generate",
    )
    p.add_argument("--company", default="Company", help="Company legal name")
    p.add_argument("--seller", default="Seller", help="Seller/owner name")
    p.add_argument("--ref", default="REF-0000", help="Deal reference number")
    p.add_argument("--output", required=True, help="Output directory")

    # Lender-specific
    p.add_argument("--lender", default="Lender", help="Lending institution name")
    p.add_argument("--lender-contact", default="", help="Lender contact person")
    p.add_argument("--lender-email", default="", help="Lender contact email")

    # Transaction details
    p.add_argument("--transaction-size", default="TBD", help="Total transaction value")
    p.add_argument("--loan-amount", default="TBD", help="Requested SBA loan amount")
    p.add_argument(
        "--esop-percentage", default="100%", help="ESOP ownership percentage"
    )
    p.add_argument("--valuation", default="TBD", help="Independent valuation amount")

    args = p.parse_args()

    if not HAS_WEASYPRINT:
        print("ERROR: weasyprint not installed. Run: pip install weasyprint")
        sys.exit(1)

    ctx = {
        "company": args.company,
        "seller": args.seller,
        "ref": args.ref,
        "lender": args.lender,
        "lender_contact": args.lender_contact or args.lender,
        "lender_email": args.lender_email,
        "transaction_size": args.transaction_size,
        "loan_amount": args.loan_amount,
        "esop_percentage": args.esop_percentage,
        "valuation": args.valuation,
    }

    output_dir = Path(args.output).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    filename = f"{FILENAMES[args.type]}-{ctx['ref']}.pdf"
    output_path = output_dir / filename

    print(f"\n  Generating {args.type} PDF...\n")

    html_content = GENERATORS[args.type](ctx)
    assert HTML is not None, "weasyprint not installed"
    HTML(string=html_content).write_pdf(str(output_path))

    size_kb = output_path.stat().st_size / 1024
    print(f"  ✅ {output_path.name}  ({size_kb:.0f} KB)")
    print(f"  📄 {output_path}\n")

    # Auto-log to Convex
    if log_document is not None:
        with contextlib.suppress(Exception):
            log_document(
                document_type=args.type,
                file_path=str(output_path),
                company_name=args.company,
                ref=args.ref,
                generated_by=f"generate-lender-package:{args.type}",
            )


if __name__ == "__main__":
    main()

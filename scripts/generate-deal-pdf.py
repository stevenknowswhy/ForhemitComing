#!/usr/bin/env python3
"""
Forhemit — Deal Document PDF Generator
───────────────────────────────────────
Generates branded PDF documents for the deal pipeline:
  - Conditional Go Letter
  - Engagement Letter
  - Letter of Intent (LOI)
  - Transaction Cost Disclosure
  - Offer Summary (V3)
  - Honest Review Document
  - 120-Day Closing Calendar
  - §1042 Rollover Explainer

Usage:
  python3 scripts/generate-deal-pdf.py --type conditional-go \\
    --company "Dark Horse Institute" --seller "Robin Crow" \\
    --ref DHI-2026-001 --output /path/to/output

  python3 scripts/generate-deal-pdf.py --type engagement-letter \\
    --company "Dark Horse Institute" --seller "Robin Crow" \\
    --ref DHI-2026-001 --ev "$4,840,000" --output /path/to/output

  python3 scripts/generate-deal-pdf.py --type loi \\
    --company "Dark Horse Institute" --seller "Robin Crow" \\
    --ref DHI-2026-001 --ev "$4,840,000" --output /path/to/output

  python3 scripts/generate-deal-pdf.py --type transaction-cost-disclosure \\
    --company "Dark Horse Institute" --seller "Robin Crow" \\
    --ref DHI-2026-001 --ev "$4,840,000" --output /path/to/output

  python3 scripts/generate-deal-pdf.py --type offer-summary \\
    --company "Dark Horse Institute" --seller "Robin Crow" \\
    --ref DHI-2026-001 --ev "$4,840,000" --output /path/to/output

  python3 scripts/generate-deal-pdf.py --type honest-review \\
    --company "Dark Horse Institute" --seller "Robin Crow" \\
    --ref DHI-2026-001 --output /path/to/output

  python3 scripts/generate-deal-pdf.py --type calendar-120-day \\
    --company "Dark Horse Institute" --seller "Robin Crow" \\
    --ref DHI-2026-001 --output /path/to/output

  python3 scripts/generate-deal-pdf.py --type 1042-rollover-explainer \\
    --company "Dark Horse Institute" --seller "Robin Crow" \\
    --ref DHI-2026-001 --ev "$4,840,000" --output /path/to/output
"""

import argparse
import sys
from datetime import datetime
from pathlib import Path

import contextlib
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
    margin: 0.85in;
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
html { font-size: 10.5pt; }
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

h3 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.05rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: #111;
    margin-top: 2rem;
    margin-bottom: 0.8rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid #ddd;
}

.condition-box {
    background: #f0f8f0;
    border-left: 3px solid #2e7d32;
    padding: 1rem 1.2rem;
    margin: 1.5rem 0;
    border-radius: 0 6px 6px 0;
}

.condition-box p {
    font-size: 0.85rem;
    line-height: 1.7;
    color: #333;
    margin-bottom: 0.6rem;
}

.condition-box p:last-child { margin-bottom: 0; }

.term-grid {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 0;
    border: 1px solid #ddd;
    margin: 1.5rem 0;
}

.term-label {
    padding: 0.5rem 0.8rem;
    background: #F7F4EE;
    border-bottom: 1px solid #ddd;
    font-size: 0.55rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7A5C20;
    font-weight: 400;
}

.term-value {
    padding: 0.5rem 0.8rem;
    border-bottom: 1px solid #ddd;
    border-left: 1px solid #ddd;
    font-size: 0.82rem;
    font-weight: 300;
    color: #111;
}

.term-grid > :nth-last-child(-n+2) { border-bottom: none; }

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

.page-break { break-before: page; }

.acceptance-box {
    border: 2px solid #7A5C20;
    padding: 1.5rem;
    margin-top: 2rem;
    border-radius: 4px;
}

.acceptance-box h4 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 0.95rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: #111;
    margin-bottom: 1rem;
}
"""

DOC_CSS = """
table.doc-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.2rem 0;
    font-size: 0.82rem;
}
table.doc-table th {
    background: #1B2A4A;
    color: #fff;
    padding: 0.55rem 0.8rem;
    text-align: left;
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}
table.doc-table td {
    padding: 0.5rem 0.8rem;
    border-bottom: 1px solid #ddd;
    font-weight: 300;
    color: #333;
}
table.doc-table tr:nth-child(even) td { background: #FAFAFA; }
table.doc-table tr.total-row td {
    background: #F7F4EE;
    font-weight: 500;
    color: #111;
    border-top: 2px solid #7A5C20;
}
table.doc-table tr.section-row td {
    background: #F0EBE3;
    font-weight: 400;
    color: #1B2A4A;
    letter-spacing: 0.06em;
    border-bottom: 1px solid #ccc;
}

.timeline {
    margin: 1.5rem 0;
}
.timeline-phase {
    background: #1B2A4A;
    color: #fff;
    padding: 0.5rem 1rem;
    font-family: 'Jost', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin-top: 1rem;
    border-radius: 3px 3px 0 0;
}
.timeline-phase:first-child { margin-top: 0; }
.timeline-week {
    display: grid;
    grid-template-columns: 80px 1fr 140px;
    gap: 0;
    border-bottom: 1px solid #ddd;
    font-size: 0.82rem;
}
.timeline-week:nth-child(even) { background: #FAFAFA; }
.timeline-week .tw-week {
    padding: 0.5rem 0.8rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: #7A5C20;
    font-weight: 400;
    border-right: 1px solid #ddd;
}
.timeline-week .tw-tasks {
    padding: 0.5rem 0.8rem;
    font-weight: 300;
    color: #333;
    border-right: 1px solid #ddd;
}
.timeline-week .tw-owner {
    padding: 0.5rem 0.8rem;
    font-weight: 300;
    color: #666;
    font-size: 0.78rem;
}

.readiness-badge {
    display: inline-block;
    padding: 0.15rem 0.6rem;
    border-radius: 3px;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}
.readiness-badge.green { background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
.readiness-badge.yellow { background: #fff8e1; color: #f57f17; border: 1px solid #ffe082; }
.readiness-badge.red { background: #fce4ec; color: #c62828; border: 1px solid #ef9a9a; }

.score-bar {
    background: #eee;
    height: 8px;
    border-radius: 4px;
    margin: 0.3rem 0 0.6rem;
    overflow: hidden;
}
.score-bar .fill {
    height: 100%;
    border-radius: 4px;
}
.score-bar .fill.green { background: #2e7d32; }
.score-bar .fill.yellow { background: #f57f17; }
.score-bar .fill.red { background: #c62828; }

.risk-item {
    padding: 0.6rem 1rem;
    border-left: 3px solid #c62828;
    background: #fff5f5;
    margin-bottom: 0.6rem;
    font-size: 0.82rem;
    color: #333;
}
.risk-item strong { color: #c62828; }

.strength-item {
    padding: 0.6rem 1rem;
    border-left: 3px solid #2e7d32;
    background: #f0f8f0;
    margin-bottom: 0.6rem;
    font-size: 0.82rem;
    color: #333;
}
.strength-item strong { color: #2e7d32; }

.info-box {
    background: #F7F4EE;
    border: 1px solid #E0D9CC;
    padding: 1rem 1.2rem;
    margin: 1.2rem 0;
    border-radius: 4px;
    font-size: 0.85rem;
    line-height: 1.7;
    color: #333;
}
.info-box strong { color: #1B2A4A; }

.callout-box {
    background: #f0f4ff;
    border-left: 3px solid #1B2A4A;
    padding: 1rem 1.2rem;
    margin: 1.2rem 0;
    border-radius: 0 6px 6px 0;
    font-size: 0.85rem;
    line-height: 1.7;
    color: #333;
}
.callout-box strong { color: #1B2A4A; }
"""


# ── Document Generators ─────────────────────────────────────────────────────


def generate_conditional_go(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Conditional Go Letter — {ctx['company']}</title><style>{BRAND_CSS}</style></head>
<body>

<div class="header">
    <div>
        <div class="brand-name">Forhemit</div>
        <div class="brand-sub">Transition Stewardship</div>
    </div>
    <div class="header-right">
        <div>forhemit.com</div>
        <div>deals@forhemit.com</div>
        <div style="margin-top:0.3rem;color:#7A5C20;">Ref: {ctx['ref']}</div>
    </div>
</div>

<div class="title">Conditional Go Letter</div>
<div class="subtitle">ESOP Transition — Approval to Proceed</div>

<div class="meta-grid">
    <div class="meta-cell"><div class="meta-label">Company</div><div class="meta-value">{ctx['company']}</div></div>
    <div class="meta-cell"><div class="meta-label">Authorized Signatory</div><div class="meta-value">{ctx['seller']}</div></div>
    <div class="meta-cell"><div class="meta-label">Date</div><div class="meta-value">{today}</div></div>
    <div class="meta-cell"><div class="meta-label">Reference</div><div class="meta-value">{ctx['ref']}</div></div>
</div>

<p class="body-text">
    Dear {ctx['seller']},
</p>

<p class="body-text">
    Following our comprehensive pre-flight assessment of <strong>{ctx['company']}</strong>,
    we are pleased to inform you that your company has received a
    <strong style="color:#2e7d32;">conditional approval</strong> to proceed with
    the ESOP transition process.
</p>

<div class="condition-box">
    <p style="color:#2e7d32;font-weight:500;font-size:0.9rem;margin-bottom:0.8rem;">
        ✓ Recommendation: Proceed with conditions
    </p>
    <p>This approval is subject to the conditions outlined below being satisfied
    prior to formal engagement.</p>
</div>

<h3>Conditions Precedent to Engagement</h3>

<p class="body-text">
    The following conditions must be satisfied before Forhemit can formally engage
    and initiate the ESOP transition process:
</p>

<div class="condition-box">
    <p><strong>1. Entity Conversion</strong> — The Company must convert to a C-Corporation
    structure (if not already) prior to or concurrent with the ESOP transaction.
    An LLC taxed as an S-Corp may require additional structuring.</p>
    <p><strong>2. Reviewed Financial Statements</strong> — The Company must provide
    reviewed or audited financial statements for the most recent fiscal year,
    prepared by an independent CPA firm.</p>
    <p><strong>3. Legal & Regulatory Resolution</strong> — Any identified pending
    litigation, regulatory matters, or unresolved liens must be disclosed and
    a resolution plan provided.</p>
    <p><strong>4. Independent Valuation</strong> — An independent business valuation
    must be commissioned from a qualified appraiser (ASA or ABV credential required)
    prior to the LOI stage.</p>
</div>

<h3>Next Steps</h3>

<p class="body-text">
    Upon satisfaction of these conditions, Forhemit will prepare a formal
    <strong>Engagement Letter</strong> outlining the scope, timeline, and fee
    structure for the transition stewardship engagement.
</p>

<p class="body-text">
    We recommend engaging your legal counsel and CPA to begin work on the entity
    conversion and financial statement preparation. Forhemit can provide referrals
    to qualified ESOP-experienced professionals if needed.
</p>

<p class="body-text">
    This conditional approval is valid for <strong>90 days</strong> from the date
    of this letter. If the conditions are not met within this period, a refreshed
    assessment may be required.
</p>

<p class="body-text">
    We are excited about the potential of working with you on this important
    transition and look forward to your progress on the conditions above.
</p>

<div class="signature-block">
    <div class="sig-line"></div>
    <div class="sig-label">Stefano Stokes, Founder</div>
    <div style="font-size:0.75rem;color:#333;margin-top:0.1rem;">Forhemit Transition Stewardship</div>
</div>

<div class="footer-notice">
    Forhemit Stewardship Management Co. &middot; California Public Benefit Corporation<br>
    This letter constitutes a conditional approval only and does not constitute a binding
    commitment to proceed with any transaction. Forhemit reserves the right to withdraw
    approval if material adverse changes occur or if conditions are not satisfied within
    the stated timeframe.
</div>

</body>
</html>"""


def generate_engagement_letter(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Engagement Letter — {ctx['company']}</title><style>{BRAND_CSS}</style></head>
<body>

<div class="header">
    <div>
        <div class="brand-name">Forhemit</div>
        <div class="brand-sub">Transition Stewardship</div>
    </div>
    <div class="header-right">
        <div>forhemit.com</div>
        <div>deals@forhemit.com</div>
        <div style="margin-top:0.3rem;color:#7A5C20;">Ref: {ctx['ref']}</div>
    </div>
</div>

<div class="title">Engagement Letter</div>
<div class="subtitle">ESOP Transition Stewardship Services</div>

<div class="meta-grid">
    <div class="meta-cell"><div class="meta-label">Company</div><div class="meta-value">{ctx['company']}</div></div>
    <div class="meta-cell"><div class="meta-label">Authorized Signatory</div><div class="meta-value">{ctx['seller']}</div></div>
    <div class="meta-cell"><div class="meta-label">Date</div><div class="meta-value">{today}</div></div>
    <div class="meta-cell"><div class="meta-label">Reference</div><div class="meta-value">{ctx['ref']}</div></div>
</div>

<p class="body-text">
    Dear {ctx['seller']},
</p>

<p class="body-text">
    This letter sets forth the terms under which Forhemit Stewardship Management Co.
    ("<strong>Forhemit</strong>") will provide ESOP transition stewardship services
    to {ctx['company']} (the "<strong>Company</strong>").
</p>

<h3>§ 1. Scope of Services</h3>

<p class="body-text">
    Forhemit will serve as the Company's transition stewardship partner, providing
    the following services:
</p>

<p class="body-text">
    <strong>Pre-Closing Phase:</strong> ESOP feasibility confirmation, deal structure
    advisory, lender coordination, independent valuation coordination, ERISA
    compliance review, trustee search and coordination, and LOI/negotiation support.
</p>

<p class="body-text">
    <strong>Closing Phase:</strong> Transaction documentation coordination, lender
    closing requirements, regulatory filing support (DOL/IRS), and closing logistics
    management.
</p>

<p class="body-text">
    <strong>Post-Closing Phase:</strong> Operational continuity monitoring, key-person
    risk tracking, financial baseline reporting, governance documentation, lender
    covenant monitoring, and succession progress reporting.
</p>

<div class="page-break"></div>

<h3>§ 2. Fee Structure</h3>

<div class="term-grid">
    <div class="term-label">Retainer</div>
    <div class="term-value">Due upon execution of this letter. Credited against the success fee.</div>
    <div class="term-label">Success Fee</div>
    <div class="term-value">Percentage of the transaction enterprise value, payable at closing.</div>
    <div class="term-label">Stewardship Fee</div>
    <div class="term-value">Monthly fee for post-closing stewardship services (if engaged).</div>
    <div class="term-label">Expenses</div>
    <div class="term-value">Reasonable out-of-pocket expenses (travel, third-party reports) billed at cost with prior approval.</div>
</div>

<h3>§ 3. Exclusivity</h3>

<p class="body-text">
    During the term of this engagement, the Company agrees not to engage any other
    ESOP advisory firm or transition steward for the same scope of services. The
    exclusivity period extends through the duration of the engagement plus any
    tail period specified herein.
</p>

<h3>§ 4. Tail Provisions</h3>

<p class="body-text">
    If this engagement is terminated by the Company prior to closing, Forhemit
    shall be entitled to its success fee if a transaction with any party introduced
    by Forhemit or identified during the engagement closes within <strong>12 months</strong>
    of termination, provided the Company gave written notice of termination.
</p>

<h3>§ 5. Representations & Warranties</h3>

<p class="body-text">
    The Company represents that: (a) it has the authority to enter into this
    agreement; (b) all information provided to Forhemit is accurate and complete
    to the best of the Company's knowledge; (c) there are no pending LOIs or
    exclusive agreements with other parties regarding the sale or transition of
    the Company; and (d) the Company will promptly notify Forhemit of any material
    changes in its financial condition, operations, or legal status.
</p>

<h3>§ 6. Confidentiality</h3>

<p class="body-text">
    Both parties agree to maintain the confidentiality of all non-public information
    exchanged during this engagement. This obligation survives termination of the
    engagement for a period of <strong>3 years</strong>. Permitted disclosures include
    those required by law, regulation, or court order, and disclosures to each
    party's professional advisors under similar confidentiality obligations.
</p>

<h3>§ 7. Governing Law & Dispute Resolution</h3>

<p class="body-text">
    This agreement shall be governed by the laws of the <strong>State of California</strong>.
    Any disputes shall be resolved first through good-faith mediation (45-day
    timeline), followed by binding arbitration under the AAA Commercial Arbitration
    Rules if mediation is unsuccessful.
</p>

<h3>§ 8. Liability Cap</h3>

<p class="body-text">
    Forhemit's total liability under this agreement shall not exceed <strong>12 months
    of fees paid</strong> by the Company. In no event shall either party be liable
    for indirect, incidental, or consequential damages.
</p>

<h3>§ 9. Termination</h3>

<p class="body-text">
    Either party may terminate this agreement with <strong>60 days' written notice</strong>
    (Company) or <strong>90 days' written notice</strong> (Forhemit). The cure period
    for any material breach is <strong>30 days</strong> (10 days for payment defaults).
</p>

<div class="page-break"></div>

<h3>Acceptance</h3>

<p class="body-text">
    By signing below, the parties agree to the terms and conditions set forth in
    this Engagement Letter.
</p>

<div class="acceptance-box">
    <h4>Company Acceptance</h4>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-top:1rem;">
        <div>
            <div class="sig-line"></div>
            <div class="sig-label">Authorized Signatory</div>
        </div>
        <div>
            <div class="sig-line"></div>
            <div class="sig-label">Date</div>
        </div>
    </div>
    <div style="margin-top:0.8rem;">
        <div class="sig-line" style="width:100%;"></div>
        <div class="sig-label">Print Name &amp; Title</div>
    </div>
</div>

<div class="acceptance-box" style="margin-top:1.5rem;">
    <h4>Forhemit Acceptance</h4>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-top:1rem;">
        <div>
            <div class="sig-line"></div>
            <div class="sig-label">Stefano Stokes, Founder</div>
        </div>
        <div>
            <div class="sig-line"></div>
            <div class="sig-label">Date</div>
        </div>
    </div>
</div>

<div class="footer-notice">
    Forhemit Stewardship Management Co. &middot; California Public Benefit Corporation<br>
    This Engagement Letter constitutes a binding agreement upon execution by both parties.
    Forhemit is not a law firm, accounting firm, or registered investment adviser.
    The Company should consult its own legal, tax, and financial advisors before executing
    this letter and throughout the ESOP transition process.
</div>

</body>
</html>"""


def generate_loi(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Letter of Intent — {ctx['company']}</title><style>{BRAND_CSS}</style></head>
<body>

<div class="header">
    <div>
        <div class="brand-name">Forhemit</div>
        <div class="brand-sub">Transition Stewardship</div>
    </div>
    <div class="header-right">
        <div>forhemit.com</div>
        <div>deals@forhemit.com</div>
        <div style="margin-top:0.3rem;color:#7A5C20;">Ref: {ctx['ref']}</div>
    </div>
</div>

<div class="title">Letter of Intent</div>
<div class="subtitle">ESOP Acquisition — Non-Binding Proposal</div>

<div class="meta-grid">
    <div class="meta-cell"><div class="meta-label">Target Company</div><div class="meta-value">{ctx['company']}</div></div>
    <div class="meta-cell"><div class="meta-label">Authorized Signatory</div><div class="meta-value">{ctx['seller']}</div></div>
    <div class="meta-cell"><div class="meta-label">Date</div><div class="meta-value">{today}</div></div>
    <div class="meta-cell"><div class="meta-label">Reference</div><div class="meta-value">{ctx['ref']}</div></div>
</div>

<p class="body-text">
    Dear {ctx['seller']},
</p>

<p class="body-text">
    Forhemit Stewardship Management Co. ("<strong>Forhemit</strong>"), acting as
    transition stewardship partner, is pleased to submit this Letter of Intent
    ("<strong>LOI</strong>") to acquire {ctx['company']} (the "<strong>Company</strong>")
    through the formation of an Employee Stock Ownership Plan ("<strong>ESOP</strong>").
</p>

<h3>§ 1. Proposed Transaction</h3>

<p class="body-text">
    Forhemit proposes to facilitate the acquisition of 100% of the outstanding
    ownership interests of the Company through a newly formed ESOP trust. The
    transaction will be structured as a tax-advantaged leveraged ESOP buyout.
</p>

<h3>§ 2. Enterprise Value</h3>

<div class="term-grid">
    <div class="term-label">Enterprise Value</div>
    <div class="term-value">{ctx.get('ev', '$TBD')} — subject to independent valuation and due diligence confirmation</div>
    <div class="term-label">Valuation Basis</div>
    <div class="term-value">Adjusted EBITDA methodology with market comparable and DCF cross-checks</div>
    <div class="term-label">Valuation Firm</div>
    <div class="term-value">To be selected from ASA/ABV-credentialed appraisers, mutually agreed</div>
</div>

<h3>§ 3. Proposed Deal Structure</h3>

<div class="term-grid">
    <div class="term-label">ESOP Trust Purchase</div>
    <div class="term-value">100% of ownership interests acquired by ESOP trust</div>
    <div class="term-label">Senior Debt</div>
    <div class="term-value">SBA 7(a) or conventional senior financing (estimated 60-70% of EV)</div>
    <div class="term-label">Seller Note</div>
    <div class="term-value">Subordinated seller financing (estimated 20-30% of EV), terms to be negotiated</div>
    <div class="term-label">Seller Equity Rollover</div>
    <div class="term-value">Optional — seller may retain up to 20% equity in ESOP trust</div>
    <div class="term-label">Tax Treatment</div>
    <div class="term-value">C-Corp structure for ESOP tax advantages (§1042 deferral available for seller)</div>
</div>

<h3>§ 4. Financing Sources</h3>

<p class="body-text">
    The transaction will be financed through a combination of senior bank debt,
    SBA 7(a) financing (if eligible), and seller financing. Forhemit will coordinate
    lender introductions, package preparation, and financing negotiation. Lender
    selection will be mutually agreed upon by the parties.
</p>

<h3>§ 5. Timeline</h3>

<div class="term-grid">
    <div class="term-label">LOI Execution</div>
    <div class="term-value">Target: within 14 days of this submission</div>
    <div class="term-label">Due Diligence</div>
    <div class="term-value">45-60 days from LOI execution</div>
    <div class="term-label">Valuation</div>
    <div class="term-value">30-45 days (concurrent with due diligence)</div>
    <div class="term-label">Financing</div>
    <div class="term-value">45-60 days (concurrent with valuation)</div>
    <div class="term-label">Closing Target</div>
    <div class="term-value">120-180 days from LOI execution</div>
</div>

<div class="page-break"></div>

<h3>§ 6. Due Diligence Requirements</h3>

<p class="body-text">
    The Company agrees to provide reasonable access to the following for due diligence:
</p>

<p class="body-text">
    • 3-5 years of financial statements and tax returns<br>
    • Customer and vendor contract summaries<br>
    • Employee census and benefit plan documents<br>
    • Entity formation documents and amendments<br>
    • Insurance policies and claims history<br>
    • Pending or threatened litigation summaries<br>
    • Environmental and regulatory compliance records<br>
    • Real property and equipment lease agreements
</p>

<h3>§ 7. Conditions Precedent to Closing</h3>

<div class="condition-box">
    <p>• Satisfactory completion of financial, legal, and operational due diligence</p>
    <p>• Independent business valuation confirming enterprise value</p>
    <p>• Secured financing commitments on acceptable terms</p>
    <p>• Entity conversion to C-Corporation (if required)</p>
    <p>• ERISA compliance review and plan document preparation</p>
    <p>• DOL/IRS approval of ESOP plan and trust (if required)</p>
    <p>• No material adverse change in the Company's financial condition or operations</p>
</div>

<h3>§ 8. Binding Provisions</h3>

<p class="body-text">
    <strong>This LOI is non-binding</strong> except for the following provisions,
    which shall be binding upon execution:
</p>

<div class="term-grid">
    <div class="term-label">Confidentiality</div>
    <div class="term-value">All information exchanged shall remain confidential for 3 years, subject to the NDA already executed between the parties.</div>
    <div class="term-label">Exclusivity</div>
    <div class="term-value">For a period of 90 days from LOI execution, the Company shall not solicit or negotiate with other parties regarding the sale or transition of the Company.</div>
    <div class="term-label">Governing Law</div>
    <div class="term-value">State of California. Disputes resolved per the arbitration provisions in the executed NDA.</div>
</div>

<h3>§ 9. Expiration</h3>

<p class="body-text">
    This Letter of Intent shall expire if not executed by both parties within
    <strong>14 days</strong> of the date above. Forhemit reserves the right to
    withdraw or modify this LOI at any time prior to execution.
</p>

<p class="body-text">
    We look forward to your response and the opportunity to move forward with
    this transaction.
</p>

<div class="signature-block">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;">
        <div>
            <div class="sig-line"></div>
            <div class="sig-label">Stefano Stokes, Founder</div>
            <div style="font-size:0.75rem;color:#333;margin-top:0.1rem;">Forhemit Transition Stewardship</div>
        </div>
        <div>
            <div class="sig-line"></div>
            <div class="sig-label">Date</div>
        </div>
    </div>
</div>

<div class="acceptance-box" style="margin-top:2rem;">
    <h4>Seller Acknowledgment &amp; Acceptance</h4>
    <p class="body-text" style="font-size:0.82rem;margin-bottom:1rem;">
        By signing below, the undersigned acknowledges receipt of this LOI and
        agrees to the binding provisions (Confidentiality, Exclusivity, Governing Law)
        as stated above.
    </p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
        <div>
            <div class="sig-line"></div>
            <div class="sig-label">Authorized Signatory</div>
        </div>
        <div>
            <div class="sig-line"></div>
            <div class="sig-label">Date</div>
        </div>
    </div>
    <div style="margin-top:0.8rem;">
        <div class="sig-line" style="width:100%;"></div>
        <div class="sig-label">Print Name &amp; Title</div>
    </div>
</div>

<div class="footer-notice">
    Forhemit Stewardship Management Co. &middot; California Public Benefit Corporation<br>
    This Letter of Intent is non-binding except as expressly stated in §8. It does not
    constitute an agreement to proceed, a commitment to fund, or a guarantee of any
    transaction outcome. Forhemit is acting as a transition stewardship partner and is
    not a broker-dealer, registered investment adviser, or legal counsel.
</div>

</body>
</html>"""


import re


def _parse_ev(ev_str: str) -> float:
    """Parse enterprise value string like '$4,840,000' to float."""
    cleaned = re.sub(r"[^0-9.]", "", ev_str)
    return float(cleaned) if cleaned else 0.0


def _fmt(n: float) -> str:
    """Format number as $X,XXX,XXX."""
    return f"${n:,.0f}"


def generate_transaction_cost_disclosure(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    ev = _parse_ev(ctx.get("ev", "0"))
    retainer = 25000
    success_pct = 0.03
    success_fee = ev * success_pct
    stewardship_mo = 8500
    stewardship_yr = stewardship_mo * 12
    valuation = 35000
    legal_seller = 45000
    legal_trust = 30000
    cpa = 25000
    erisa = 20000
    enviro = 15000
    lender_fees = ev * 0.01
    filing = 5000
    escrow = 8000
    advisory_total = retainer + success_fee
    third_party_total = valuation + legal_seller + legal_trust + cpa + erisa + enviro
    transaction_total = lender_fees + filing + escrow
    grand_total = advisory_total + third_party_total + transaction_total
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Transaction Cost Disclosure — {ctx['company']}</title><style>{BRAND_CSS}{DOC_CSS}</style></head>
<body>

<div class="header">
    <div>
        <div class="brand-name">Forhemit</div>
        <div class="brand-sub">Transition Stewardship</div>
    </div>
    <div class="header-right">
        <div>forhemit.com</div>
        <div>deals@forhemit.com</div>
        <div style="margin-top:0.3rem;color:#7A5C20;">Ref: {ctx['ref']}</div>
    </div>
</div>

<div class="title">Transaction Cost Disclosure</div>
<div class="subtitle">ESOP Transition — Estimated Fee Summary</div>

<div class="meta-grid">
    <div class="meta-cell"><div class="meta-label">Company</div><div class="meta-value">{ctx['company']}</div></div>
    <div class="meta-cell"><div class="meta-label">Authorized Signatory</div><div class="meta-value">{ctx['seller']}</div></div>
    <div class="meta-cell"><div class="meta-label">Date</div><div class="meta-value">{today}</div></div>
    <div class="meta-cell"><div class="meta-label">Reference</div><div class="meta-value">{ctx['ref']}</div></div>
    <div class="meta-cell"><div class="meta-label">Enterprise Value (Est.)</div><div class="meta-value">{ctx.get('ev', 'TBD')}</div></div>
    <div class="meta-cell"><div class="meta-label">Discount Rate</div><div class="meta-value">N/A (full price)</div></div>
</div>

<p class="body-text">
    Dear {ctx['seller']},
</p>

<p class="body-text">
    This document provides a transparent summary of the estimated fees and costs
    associated with the ESOP transition of <strong>{ctx['company']}</strong>. All
    figures are estimates based on the indicated enterprise value and typical
    transaction structures. Actual costs may vary based on deal complexity, timeline,
    and third-party provider selection.
</p>

<h3>Advisory Fees — Forhemit</h3>

<table class="doc-table">
    <thead>
        <tr>
            <th>Item</th>
            <th style="text-align:right;">Estimated Amount</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Retainer</td>
            <td style="text-align:right;">{_fmt(retainer)}</td>
            <td>Due at engagement. Credited against success fee.</td>
        </tr>
        <tr>
            <td>Success Fee ({success_pct*100:.1f}% of EV)</td>
            <td style="text-align:right;">{_fmt(success_fee)}</td>
            <td>Payable at closing. Based on enterprise value of {ctx.get('ev', 'TBD')}.</td>
        </tr>
        <tr>
            <td>Post-Closing Stewardship</td>
            <td style="text-align:right;">{_fmt(stewardship_mo)}/mo</td>
            <td>Optional. {_fmt(stewardship_yr)}/yr if engaged for 12-month term.</td>
        </tr>
        <tr class="section-row">
            <td colspan="3">Subtotal — Forhemit Advisory</td>
        </tr>
        <tr class="total-row">
            <td></td>
            <td style="text-align:right;">{_fmt(advisory_total)}</td>
            <td>Excludes post-closing stewardship (optional).</td>
        </tr>
    </tbody>
</table>

<h3>Third-Party Professional Fees</h3>

<table class="doc-table">
    <thead>
        <tr>
            <th>Provider</th>
            <th style="text-align:right;">Estimated Range</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Independent Business Valuation</td>
            <td style="text-align:right;">{_fmt(valuation)}</td>
            <td>ASA/ABV-credentialed appraiser. Required by ERISA.</td>
        </tr>
        <tr>
            <td>Legal Counsel — Seller</td>
            <td style="text-align:right;">{_fmt(legal_seller)}</td>
            <td>Seller's own counsel for transaction review and negotiation.</td>
        </tr>
        <tr>
            <td>Legal Counsel — ESOP Trust</td>
            <td style="text-align:right;">{_fmt(legal_trust)}</td>
            <td>Independent counsel for the ESOP trustee.</td>
        </tr>
        <tr>
            <td>CPA / Accounting Firm</td>
            <td style="text-align:right;">{_fmt(cpa)}</td>
            <td>Reviewed financials, tax structuring, audit support.</td>
        </tr>
        <tr>
            <td>ERISA Counsel</td>
            <td style="text-align:right;">{_fmt(erisa)}</td>
            <td>Plan document preparation, DOL/IRS compliance review.</td>
        </tr>
        <tr>
            <td>Environmental / Regulatory Review</td>
            <td style="text-align:right;">{_fmt(enviro)}</td>
            <td>If applicable. May not be required for all transactions.</td>
        </tr>
        <tr class="section-row">
            <td colspan="3">Subtotal — Third-Party Professionals</td>
        </tr>
        <tr class="total-row">
            <td></td>
            <td style="text-align:right;">{_fmt(third_party_total)}</td>
            <td>Varies by complexity and provider selection.</td>
        </tr>
    </tbody>
</table>

<div class="page-break"></div>

<h3>Transaction & Lender Costs</h3>

<table class="doc-table">
    <thead>
        <tr>
            <th>Item</th>
            <th style="text-align:right;">Estimated Amount</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Lender Origination Fees</td>
            <td style="text-align:right;">{_fmt(lender_fees)}</td>
            <td>~1.0% of EV. Varies by lender and financing structure.</td>
        </tr>
        <tr>
            <td>Regulatory Filing Fees (DOL/IRS)</td>
            <td style="text-align:right;">{_fmt(filing)}</td>
            <td>ESOP plan registration and filing fees.</td>
        </tr>
        <tr>
            <td>Escrow &amp; Closing Agent</td>
            <td style="text-align:right;">{_fmt(escrow)}</td>
            <td>Closing coordination, fund disbursement, document custody.</td>
        </tr>
        <tr class="section-row">
            <td colspan="3">Subtotal — Transaction Costs</td>
        </tr>
        <tr class="total-row">
            <td></td>
            <td style="text-align:right;">{_fmt(transaction_total)}</td>
            <td></td>
        </tr>
    </tbody>
</table>

<h3>Estimated Total Transaction Cost</h3>

<table class="doc-table">
    <thead>
        <tr>
            <th>Category</th>
            <th style="text-align:right;">Estimated Amount</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Forhemit Advisory Fees</td>
            <td style="text-align:right;">{_fmt(advisory_total)}</td>
        </tr>
        <tr>
            <td>Third-Party Professional Fees</td>
            <td style="text-align:right;">{_fmt(third_party_total)}</td>
        </tr>
        <tr>
            <td>Transaction &amp; Lender Costs</td>
            <td style="text-align:right;">{_fmt(transaction_total)}</td>
        </tr>
        <tr class="total-row">
            <td><strong>Grand Total (Estimated)</strong></td>
            <td style="text-align:right;"><strong>{_fmt(grand_total)}</strong></td>
        </tr>
    </tbody>
</table>

<div class="info-box">
    <strong>Note on Post-Closing Stewardship:</strong> The monthly stewardship fee
    ({_fmt(stewardship_mo)}/month) is optional and not included in the grand total above.
    If engaged for a full 12-month term, the annual stewardship cost would be
    {_fmt(stewardship_yr)}. Stewardship services include ongoing lender covenant
    monitoring, governance documentation, and succession progress reporting.
</div>

<div class="footer-notice">
    Forhemit Stewardship Management Co. &middot; California Public Benefit Corporation<br>
    All figures are estimates provided for informational purposes only. Actual fees and costs
    will be specified in the executed Engagement Letter and may vary based on transaction
    complexity, timeline, third-party provider selection, and market conditions. This disclosure
    does not constitute a binding quote or commitment. Forhemit is not a law firm, accounting
    firm, registered investment adviser, or broker-dealer. The Company should obtain independent
    professional advice regarding all transaction costs.
</div>

</body>
</html>"""


def generate_offer_summary(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    ev = ctx.get("ev", "TBD")
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Offer Summary — {ctx['company']}</title><style>{BRAND_CSS}{DOC_CSS}</style></head>
<body>

<div class="header">
    <div>
        <div class="brand-name">Forhemit</div>
        <div class="brand-sub">Transition Stewardship</div>
    </div>
    <div class="header-right">
        <div>forhemit.com</div>
        <div>deals@forhemit.com</div>
        <div style="margin-top:0.3rem;color:#7A5C20;">Ref: {ctx['ref']}</div>
    </div>
</div>

<div class="title">Offer Summary</div>
<div class="subtitle">ESOP Transaction — Version 3</div>

<div class="meta-grid">
    <div class="meta-cell"><div class="meta-label">Company</div><div class="meta-value">{ctx['company']}</div></div>
    <div class="meta-cell"><div class="meta-label">Authorized Signatory</div><div class="meta-value">{ctx['seller']}</div></div>
    <div class="meta-cell"><div class="meta-label">Date</div><div class="meta-value">{today}</div></div>
    <div class="meta-cell"><div class="meta-label">Reference</div><div class="meta-value">{ctx['ref']}</div></div>
</div>

<p class="body-text">
    Dear {ctx['seller']},
</p>

<p class="body-text">
    This Offer Summary (Version 3) outlines the proposed terms for the acquisition
    of <strong>{ctx['company']}</strong> through the formation of an Employee Stock
    Ownership Plan (ESOP). This summary supersedes all prior versions and reflects
    updated financing terms and timeline.
</p>

<h3>Enterprise Value &amp; Structure</h3>

<div class="term-grid">
    <div class="term-label">Enterprise Value</div>
    <div class="term-value"><strong>{ev}</strong> — subject to independent valuation confirmation</div>
    <div class="term-label">Acquisition</div>
    <div class="term-value">100% of ownership interests acquired by new ESOP trust</div>
    <div class="term-label">Entity Structure</div>
    <div class="term-value">C-Corporation (required for ESOP tax advantages)</div>
    <div class="term-label">Tax Election</div>
    <div class="term-value">S-Corp election available post-transaction (100% ESOP-owned C-Corp exempt from federal income tax)</div>
</div>

<h3>Financing Sources</h3>

<table class="doc-table">
    <thead>
        <tr>
            <th>Source</th>
            <th style="text-align:right;">Estimated Amount</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Senior Debt (SBA 7a or Conventional)</td>
            <td style="text-align:right;">60–70% of EV</td>
            <td>Primary financing. Terms subject to lender underwriting.</td>
        </tr>
        <tr>
            <td>Seller Note (Subordinated)</td>
            <td style="text-align:right;">20–30% of EV</td>
            <td>Terms to be negotiated. Typically 5–7 year term.</td>
        </tr>
        <tr>
            <td>Seller Equity Rollover (Optional)</td>
            <td style="text-align:right;">Up to 20%</td>
            <td>Seller may retain equity stake in ESOP trust.</td>
        </tr>
    </tbody>
</table>

<h3>Key Terms</h3>

<div class="term-grid">
    <div class="term-label">Seller Note Rate</div>
    <div class="term-value">To be negotiated. AFR minimum applies.</div>
    <div class="term-label">Seller Note Term</div>
    <div class="term-value">5–7 years, with optional early payoff.</div>
    <div class="term-label">Exclusivity</div>
    <div class="term-value">90 days from LOI execution.</div>
    <div class="term-label">Due Diligence</div>
    <div class="term-value">45–60 days from LOI execution.</div>
    <div class="term-label">Escrow</div>
    <div class="term-value">Standard escrow for indemnification claims (12–18 months post-closing).</div>
    <div class="term-label">Non-Compete</div>
    <div class="term-value">Standard 3-year non-compete for selling shareholders.</div>
</div>

<h3>Tax Treatment</h3>

<div class="callout-box">
    <strong>For the Seller:</strong> §1042 rollover election available — seller may defer
    capital gains tax on sale proceeds reinvested in Qualified Replacement Property (QRP)
    within 12 months of the sale. Deferral is indefinite as long as QRP is held.
    See the §1042 Rollover Explainer for details.
</div>

<div class="callout-box">
    <strong>For the Company:</strong> As a 100% ESOP-owned C-Corporation, the Company
    pays no federal income tax on the ESOP's share of earnings. Principal payments
    on the ESOP loan are tax-deductible (within IRS limits).
</div>

<h3>Timeline</h3>

<div class="term-grid">
    <div class="term-label">LOI Execution</div>
    <div class="term-value">Target: within 14 days</div>
    <div class="term-label">Due Diligence</div>
    <div class="term-value">45–60 days</div>
    <div class="term-label">Valuation &amp; Financing</div>
    <div class="term-value">30–60 days (concurrent)</div>
    <div class="term-label">Closing Target</div>
    <div class="term-value">120–180 days from LOI</div>
</div>

<h3>Conditions Precedent</h3>

<div class="condition-box">
    <p>• Independent valuation confirming enterprise value</p>
    <p>• Secured financing commitments on acceptable terms</p>
    <p>• Entity conversion to C-Corporation (if required)</p>
    <p>• Satisfactory completion of financial, legal, and operational due diligence</p>
    <p>• ERISA compliance review and plan document preparation</p>
    <p>• No material adverse change in the Company's financial condition</p>
</div>

<div class="signature-block">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;">
        <div>
            <div class="sig-line"></div>
            <div class="sig-label">Stefano Stokes, Founder</div>
            <div style="font-size:0.75rem;color:#333;margin-top:0.1rem;">Forhemit Transition Stewardship</div>
        </div>
        <div>
            <div class="sig-line"></div>
            <div class="sig-label">Date</div>
        </div>
    </div>
</div>

<div class="footer-notice">
    Forhemit Stewardship Management Co. &middot; California Public Benefit Corporation<br>
    This Offer Summary is a non-binding indication of proposed terms. It does not constitute
    a commitment to proceed, a guarantee of financing, or a binding agreement. All terms are
    subject to due diligence, independent valuation, and execution of definitive documentation.
    This is Version 3 — superseding all prior versions.
</div>

</body>
</html>"""


def generate_honest_review(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Honest Review — {ctx['company']}</title><style>{BRAND_CSS}{DOC_CSS}</style></head>
<body>

<div class="header">
    <div>
        <div class="brand-name">Forhemit</div>
        <div class="brand-sub">Transition Stewardship</div>
    </div>
    <div class="header-right">
        <div>forhemit.com</div>
        <div>deals@forhemit.com</div>
        <div style="margin-top:0.3rem;color:#7A5C20;">Ref: {ctx['ref']}</div>
    </div>
</div>

<div class="title">Honest Review</div>
<div class="subtitle">ESOP Readiness Assessment — Confidential</div>

<div class="meta-grid">
    <div class="meta-cell"><div class="meta-label">Company</div><div class="meta-value">{ctx['company']}</div></div>
    <div class="meta-cell"><div class="meta-label">Authorized Signatory</div><div class="meta-value">{ctx['seller']}</div></div>
    <div class="meta-cell"><div class="meta-label">Date</div><div class="meta-value">{today}</div></div>
    <div class="meta-cell"><div class="meta-label">Reference</div><div class="meta-value">{ctx['ref']}</div></div>
</div>

<p class="body-text">
    Dear {ctx['seller']},
</p>

<p class="body-text">
    This Honest Review provides a candid, unvarnished assessment of <strong>{ctx['company']}</strong>'s
    readiness for an ESOP transition. Unlike the polished preflight report, this document
    is intended for internal decision-making and highlights both strengths and areas of
    concern that require attention before proceeding.
</p>

<h3>Overall Readiness</h3>

<div class="info-box">
    <strong>Readiness Score: 72 / 100</strong> — Conditionally Ready<br>
    The Company has a viable path to ESOP transition but requires focused work on
    financial documentation, management depth, and entity structure before formal engagement.
</div>

<table class="doc-table">
    <thead>
        <tr>
            <th>Category</th>
            <th style="text-align:center;">Score</th>
            <th>Status</th>
            <th>Assessment</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Financial Readiness</td>
            <td style="text-align:center;">75</td>
            <td><span class="readiness-badge yellow">Needs Work</span></td>
            <td>Revenue is strong but financial statements need review by independent CPA.</td>
        </tr>
        <tr>
            <td>Entity Structure</td>
            <td style="text-align:center;">60</td>
            <td><span class="readiness-badge red">Action Required</span></td>
            <td>Currently LLC — must convert to C-Corp before ESOP transaction.</td>
        </tr>
        <tr>
            <td>Management Depth</td>
            <td style="text-align:center;">65</td>
            <td><span class="readiness-badge yellow">Needs Work</span></td>
            <td>Key-person risk is elevated. Succession plan needed for critical roles.</td>
        </tr>
        <tr>
            <td>Regulatory &amp; Legal</td>
            <td style="text-align:center;">80</td>
            <td><span class="readiness-badge green">On Track</span></td>
            <td>No major litigation. Minor regulatory items identified and manageable.</td>
        </tr>
        <tr>
            <td>Governance Readiness</td>
            <td style="text-align:center;">70</td>
            <td><span class="readiness-badge yellow">Needs Work</span></td>
            <td>Board structure informal. ESOP trustee and fiduciary framework needed.</td>
        </tr>
        <tr>
            <td>Employee Eligibility</td>
            <td style="text-align:center;">85</td>
            <td><span class="readiness-badge green">On Track</span></td>
            <td>Employee count and demographics support ESOP participation requirements.</td>
        </tr>
    </tbody>
</table>

<h3>Strengths</h3>

<div class="strength-item">
    <strong>Revenue Stability</strong> — Consistent revenue growth over the past 3 years
    with diversified customer base. No single customer represents more than 15% of revenue.
    This provides a strong foundation for debt service.
</div>

<div class="strength-item">
    <strong>Industry Position</strong> — The Company operates in a niche with defensible
    market position and recurring revenue streams. ESOP transition can strengthen employee
    retention in a competitive labor market.
</div>

<div class="strength-item">
    <strong>Tax Advantages</strong> — As a 100% ESOP-owned C-Corporation, the Company
    would eliminate federal income tax on ESOP-shareholder earnings. The seller benefits
    from §1042 rollover for capital gains deferral.
</div>

<div class="strength-item">
    <strong>Clean Legal History</strong> — No pending litigation, environmental liens,
    or regulatory enforcement actions. This significantly reduces due diligence risk.
</div>

<h3>Areas of Concern</h3>

<div class="risk-item">
    <strong>Entity Conversion Required</strong> — The Company is currently structured as
    an LLC. Conversion to a C-Corporation is required before the ESOP transaction. This
    involves tax implications (built-in gains), legal filings, and potential restructuring
    of existing contracts. Timeline: 60-90 days minimum.
</div>

<div class="risk-item">
    <strong>Key-Person Dependency</strong> — The seller/owner is deeply involved in daily
    operations, client relationships, and strategic direction. A transition plan that
    addresses the 2-3 year post-closing period is critical. Without it, lender confidence
    and valuation may be impacted.
</div>

<div class="risk-item">
    <strong>Financial Statement Quality</strong> — Current financials are internally
    prepared. Independent CPA review or audit is required for ESOP valuation and lender
    underwriting. This is a 30-60 day process that should begin immediately.
</div>

<div class="risk-item">
    <strong>Management Succession Gap</strong> — No formal succession plan exists for
    key management roles beyond the owner. The ESOP trustee will require a credible
    management continuity plan as part of their fiduciary review.
</div>

<h3>Recommendations</h3>

<p class="body-text">
    <strong>Immediate (Next 30 Days):</strong>
</p>
<p class="body-text">
    1. Engage a CPA firm for financial statement review/audit<br>
    2. Retain ESOP-experienced legal counsel for entity conversion<br>
    3. Begin drafting a management succession plan<br>
    4. Compile employee census data for plan eligibility analysis
</p>

<p class="body-text">
    <strong>Short-Term (30–90 Days):</strong>
</p>
<p class="body-text">
    5. Complete entity conversion to C-Corporation<br>
    6. Commission independent business valuation<br>
    7. Identify and interview potential ESOP trustees<br>
    8. Begin lender conversations and financing package preparation
</p>

<p class="body-text">
    <strong>Medium-Term (90–180 Days):</strong>
</p>
<p class="body-text">
    9. Execute Letter of Intent<br>
    10. Complete due diligence and financing<br>
    11. Prepare ERISA plan documents<br>
    12. Close transaction
</p>

<div class="signature-block">
    <div class="sig-line"></div>
    <div class="sig-label">Stefano Stokes, Founder</div>
    <div style="font-size:0.75rem;color:#333;margin-top:0.1rem;">Forhemit Transition Stewardship</div>
</div>

<div class="footer-notice">
    Forhemit Stewardship Management Co. &middot; California Public Benefit Corporation<br>
    This Honest Review is a confidential internal assessment prepared for the Company's
    authorized signatory. It reflects Forhemit's independent analysis based on information
    provided and is not a guarantee of transaction outcome. Scores and assessments may change
    as additional information becomes available. This document should not be shared with
    third parties without Forhemit's written consent.
</div>

</body>
</html>"""


def generate_calendar_120_day(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>120-Day Closing Calendar — {ctx['company']}</title><style>{BRAND_CSS}{DOC_CSS}</style></head>
<body>

<div class="header">
    <div>
        <div class="brand-name">Forhemit</div>
        <div class="brand-sub">Transition Stewardship</div>
    </div>
    <div class="header-right">
        <div>forhemit.com</div>
        <div>deals@forhemit.com</div>
        <div style="margin-top:0.3rem;color:#7A5C20;">Ref: {ctx['ref']}</div>
    </div>
</div>

<div class="title">120-Day Closing Calendar</div>
<div class="subtitle">ESOP Transaction — Week-by-Week Execution Plan</div>

<div class="meta-grid">
    <div class="meta-cell"><div class="meta-label">Company</div><div class="meta-value">{ctx['company']}</div></div>
    <div class="meta-cell"><div class="meta-label">Authorized Signatory</div><div class="meta-value">{ctx['seller']}</div></div>
    <div class="meta-cell"><div class="meta-label">Date</div><div class="meta-value">{today}</div></div>
    <div class="meta-cell"><div class="meta-label">Reference</div><div class="meta-value">{ctx['ref']}</div></div>
</div>

<p class="body-text">
    Dear {ctx['seller']},
</p>

<p class="body-text">
    This 120-Day Closing Calendar provides a week-by-week execution plan for the
    ESOP transition of <strong>{ctx['company']}</strong>. The timeline assumes LOI
    execution as Day 1 and targets closing within 120 days (approximately 17 weeks).
    Actual timelines may vary based on due diligence findings, financing, and
    regulatory requirements.
</p>

<h3>Phase 1 — Foundation (Weeks 1–4)</h3>

<div class="timeline">
    <div class="timeline-phase">Phase 1: Foundation &amp; Mobilization</div>
    <div class="timeline-week">
        <div class="tw-week">Week 1</div>
        <div class="tw-tasks">LOI execution &amp; engagement letter signing. Kick-off meeting with all advisors. Document request list issued to Company.</div>
        <div class="tw-owner">Forhemit + Seller</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 2</div>
        <div class="tw-tasks">Engage CPA firm for financial review. Retain ESOP legal counsel. Begin entity conversion process (LLC → C-Corp). Employee census compilation.</div>
        <div class="tw-owner">Seller + Legal</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 3</div>
        <div class="tw-tasks">Due diligence data room setup. Initial document review begins. Valuation appraiser selection and engagement. Lender introduction package prepared.</div>
        <div class="tw-owner">Forhemit + CPA</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 4</div>
        <div class="tw-tasks">First lender conversations. Entity conversion filing submitted. Due diligence document review continues. Management succession plan drafted.</div>
        <div class="tw-owner">Forhemit + Lender</div>
    </div>
</div>

<h3>Phase 2 — Diligence &amp; Valuation (Weeks 5–8)</h3>

<div class="timeline">
    <div class="timeline-phase">Phase 2: Deep Diligence &amp; Valuation</div>
    <div class="timeline-week">
        <div class="tw-week">Week 5</div>
        <div class="tw-tasks">Financial due diligence deep dive. Customer contract review. Vendor relationship assessment. Insurance policy review.</div>
        <div class="tw-owner">CPA + Legal</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 6</div>
        <div class="tw-tasks">Independent valuation fieldwork begins. ERISA counsel engaged. Trustee candidate interviews. Lender term sheet negotiations.</div>
        <div class="tw-owner">Appraiser + ERISA</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 7</div>
        <div class="tw-tasks">Valuation draft report received. Management presentations to lender. ESOP trustee selected. Entity conversion completed.</div>
        <div class="tw-owner">Appraiser + Seller</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 8</div>
        <div class="tw-tasks">Valuation final report delivered. Lender commitment letter received. Due diligence findings summarized. Go/No-Go decision point.</div>
        <div class="tw-owner">Forhemit + All</div>
    </div>
</div>

<div class="page-break"></div>

<h3>Phase 3 — Documentation &amp; Structuring (Weeks 9–12)</h3>

<div class="timeline">
    <div class="timeline-phase">Phase 3: Deal Documentation</div>
    <div class="timeline-week">
        <div class="tw-week">Week 9</div>
        <div class="tw-tasks">ESOP plan document drafting begins. Trust agreement prepared. Stock purchase agreement drafted. Seller note terms finalized.</div>
        <div class="tw-owner">ERISA + Legal</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 10</div>
        <div class="tw-tasks">Plan document review by all parties. Lender closing conditions checklist. Regulatory filings prepared (DOL/IRS). Board resolutions drafted.</div>
        <div class="tw-owner">Legal + ERISA</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 11</div>
        <div class="tw-tasks">Final plan document approval. Trust agreement executed. Stock purchase agreement negotiated and finalized. Closing checklist reviewed.</div>
        <div class="tw-owner">All Parties</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 12</div>
        <div class="tw-tasks">Pre-closing audit. All closing documents in final form. Lender funding conditions confirmed. Regulatory filings submitted.</div>
        <div class="tw-owner">Forhemit + Legal</div>
    </div>
</div>

<h3>Phase 4 — Closing &amp; Transition (Weeks 13–17)</h3>

<div class="timeline">
    <div class="timeline-phase">Phase 4: Closing &amp; Post-Closing</div>
    <div class="timeline-week">
        <div class="tw-week">Week 13</div>
        <div class="tw-tasks">Final closing conditions verified. Escrow funded. Closing documents circulated for signature. Pre-closing board meeting.</div>
        <div class="tw-owner">Forhemit + Escrow</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 14</div>
        <div class="tw-tasks"><strong style="color:#2e7d32;">CLOSING DAY.</strong> Fund disbursement. Stock transfer executed. All closing documents signed. Regulatory filings completed.</div>
        <div class="tw-owner">All Parties</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 15</div>
        <div class="tw-tasks">Post-closing deliverables. Employee communication plan executed. ESOP enrollment materials distributed. First trustee meeting.</div>
        <div class="tw-owner">Forhemit + HR</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 16</div>
        <div class="tw-tasks">Operational continuity monitoring begins. Financial baseline reporting. Lender covenant tracking initiated. Key-person risk assessment.</div>
        <div class="tw-owner">Forhemit</div>
    </div>
    <div class="timeline-week">
        <div class="tw-week">Week 17</div>
        <div class="tw-tasks">Post-closing review meeting. Stewardship engagement kick-off (if engaged). Transition plan quarterly review cadence established.</div>
        <div class="tw-owner">Forhemit + Seller</div>
    </div>
</div>

<h3>Key Milestones</h3>

<div class="info-box">
    <strong>Critical Path Milestones:</strong><br><br>
    <strong>Week 1:</strong> LOI Execution &amp; Engagement — Triggers all downstream activities<br>
    <strong>Week 4:</strong> Entity Conversion Filed — Blocks valuation and plan document preparation<br>
    <strong>Week 8:</strong> Go/No-Go Decision — Valuation + lender commitment received. Last off-ramp before significant legal costs.<br>
    <strong>Week 12:</strong> Pre-Closing Audit — All documents must be in final form<br>
    <strong>Week 14:</strong> Closing Day — Target closing date<br>
    <strong>Week 17:</strong> Stewardship Kick-Off — Transition to post-closing monitoring
</div>

<div class="footer-notice">
    Forhemit Stewardship Management Co. &middot; California Public Benefit Corporation<br>
    This calendar is an estimate based on typical ESOP transaction timelines. Actual duration
    may vary based on due diligence findings, financing timelines, regulatory requirements,
    and third-party availability. Delays in any phase may shift subsequent phases accordingly.
    This document does not constitute a guarantee of closing within the stated timeframe.
</div>

</body>
</html>"""


def generate_1042_rollover_explainer(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    ev = _parse_ev(ctx.get("ev", "0"))
    ev_display = ctx.get("ev", "TBD")
    gain = ev * 0.75
    cap_gains_rate = 0.238
    tax_deferred = gain * cap_gains_rate
    qrp_min = gain
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>§1042 Rollover Explainer — {ctx['company']}</title><style>{BRAND_CSS}{DOC_CSS}</style></head>
<body>

<div class="header">
    <div>
        <div class="brand-name">Forhemit</div>
        <div class="brand-sub">Transition Stewardship</div>
    </div>
    <div class="header-right">
        <div>forhemit.com</div>
        <div>deals@forhemit.com</div>
        <div style="margin-top:0.3rem;color:#7A5C20;">Ref: {ctx['ref']}</div>
    </div>
</div>

<div class="title">§1042 Rollover Explainer</div>
<div class="subtitle">Capital Gains Tax Deferral for ESOP Sellers</div>

<div class="meta-grid">
    <div class="meta-cell"><div class="meta-label">Company</div><div class="meta-value">{ctx['company']}</div></div>
    <div class="meta-cell"><div class="meta-label">Authorized Signatory</div><div class="meta-value">{ctx['seller']}</div></div>
    <div class="meta-cell"><div class="meta-label">Date</div><div class="meta-value">{today}</div></div>
    <div class="meta-cell"><div class="meta-label">Reference</div><div class="meta-value">{ctx['ref']}</div></div>
    <div class="meta-cell"><div class="meta-label">Enterprise Value (Est.)</div><div class="meta-value">{ev_display}</div></div>
    <div class="meta-cell"><div class="meta-label">Document Type</div><div class="meta-value">Tax Planning Reference</div></div>
</div>

<p class="body-text">
    Dear {ctx['seller']},
</p>

<p class="body-text">
    Section 1042 of the Internal Revenue Code provides a powerful tax planning
    opportunity for sellers in an ESOP transaction. This document explains how
    the provision works, who qualifies, and what the potential tax savings look
    like for the sale of <strong>{ctx['company']}</strong>.
</p>

<h3>What Is §1042?</h3>

<p class="body-text">
    <strong>Section 1042</strong> allows a seller who sells stock to an ESOP to
    <strong>defer capital gains tax</strong> on the sale proceeds, provided the
    seller reinvests the proceeds in <strong>Qualified Replacement Property (QRP)</strong>
    within a specified timeframe. The deferral is <strong>indefinite</strong> — the
    seller pays no capital gains tax on the ESOP sale as long as the QRP is held.
</p>

<div class="callout-box">
    <strong>Key Benefit:</strong> The seller receives full sale proceeds at closing but
    pays zero capital gains tax at the time of sale. Tax is deferred until the QRP
    is sold (which may be never, if held for life — heirs receive a stepped-up basis).
</div>

<h3>Eligibility Requirements</h3>

<p class="body-text">
    To qualify for §1042 treatment, <strong>all</strong> of the following must be met:
</p>

<div class="condition-box">
    <p><strong>1. C-Corporation Requirement</strong> — The selling company must be a
    C-Corporation at the time of the sale. S-Corporations, LLCs, and partnerships
    do not qualify. Entity conversion must occur before the ESOP transaction closes.</p>
    <p><strong>2. 3-Year Holding Period</strong> — The seller must have held the stock
    for at least 3 years prior to the sale (if the stock was acquired after 2008 via
    a tax-free reorganization, the holding period applies to the original stock).</p>
    <p><strong>3. ESOP Ownership Threshold</strong> — After the sale, the ESOP must own
    at least 30% of the Company's outstanding stock (or 100% in a full sale, as proposed
    for {ctx['company']}).</p>
    <p><strong>4. Qualified Replacement Property</strong> — The seller must purchase QRP
    within <strong>12 months before or 3 months after</strong> the sale date. QRP includes
    stocks, bonds, and other securities of domestic operating corporations (not passive
    investment companies, real estate investment trusts, or mutual funds).</p>
    <p><strong>5. Seller Election</strong> — The seller must affirmatively elect §1042
    treatment on their federal tax return for the year of the sale. This is not automatic.</p>
</div>

<h3>How It Works — Step by Step</h3>

<p class="body-text">
    <strong>Step 1:</strong> Seller closes the ESOP transaction and receives full sale
    proceeds (cash and/or seller note).
</p>
<p class="body-text">
    <strong>Step 2:</strong> Seller reinvests the capital gain portion of the proceeds
    into Qualified Replacement Property within 12 months.
</p>
<p class="body-text">
    <strong>Step 3:</strong> Seller elects §1042 deferral on their federal tax return
    for the year of the sale. The capital gains tax on the ESOP sale is deferred.
</p>
<p class="body-text">
    <strong>Step 4:</strong> Seller holds the QRP indefinitely. No capital gains tax is
    due on the ESOP sale as long as the QRP is held.
</p>
<p class="body-text">
    <strong>Step 5 (Optional):</strong> If the seller holds the QRP until death, heirs
    receive a <strong>stepped-up basis</strong> under §1014. The deferred capital gains
    tax is permanently eliminated.
</p>

<div class="page-break"></div>

<h3>Illustrative Tax Savings — {ctx['company']}</h3>

<p class="body-text">
    The following illustration is based on an estimated enterprise value of
    <strong>{ev_display}</strong> and assumes a cost basis of approximately 25% of EV.
    Actual figures will depend on the seller's specific tax situation, cost basis,
    and applicable tax rates. This is for planning purposes only — consult your tax advisor.
</p>

<table class="doc-table">
    <thead>
        <tr>
            <th>Item</th>
            <th style="text-align:right;">Amount</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Enterprise Value (Estimated)</td>
            <td style="text-align:right;">{ev_display}</td>
            <td>Subject to independent valuation</td>
        </tr>
        <tr>
            <td>Estimated Cost Basis (25%)</td>
            <td style="text-align:right;">{_fmt(ev * 0.25)}</td>
            <td>Seller's original investment / adjusted basis</td>
        </tr>
        <tr>
            <td>Estimated Capital Gain</td>
            <td style="text-align:right;">{_fmt(gain)}</td>
            <td>EV minus cost basis</td>
        </tr>
        <tr>
            <td>Applicable Tax Rate (23.8%)</td>
            <td style="text-align:right;">23.8%</td>
            <td>20% LTCG + 3.8% NIIT (top bracket)</td>
        </tr>
        <tr class="total-row">
            <td><strong>Tax Deferred via §1042</strong></td>
            <td style="text-align:right;"><strong>{_fmt(tax_deferred)}</strong></td>
            <td>Payable only when QRP is sold (if ever)</td>
        </tr>
    </tbody>
</table>

<h3>Traditional Sale vs. §1042 Rollover</h3>

<table class="doc-table">
    <thead>
        <tr>
            <th>Scenario</th>
            <th style="text-align:right;">Traditional Sale</th>
            <th style="text-align:right;">§1042 Rollover</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Sale Proceeds</td>
            <td style="text-align:right;">{ev_display}</td>
            <td style="text-align:right;">{ev_display}</td>
        </tr>
        <tr>
            <td>Capital Gains Tax (at closing)</td>
            <td style="text-align:right;">{_fmt(tax_deferred)}</td>
            <td style="text-align:right;">$0</td>
        </tr>
        <tr>
            <td>Net After-Tax Proceeds (at closing)</td>
            <td style="text-align:right;">{_fmt(ev - tax_deferred)}</td>
            <td style="text-align:right;">{ev_display}</td>
        </tr>
        <tr class="total-row">
            <td><strong>Additional Cash at Closing</strong></td>
            <td style="text-align:right;">—</td>
            <td style="text-align:right;"><strong>{_fmt(tax_deferred)}</strong></td>
        </tr>
    </tbody>
</table>

<div class="info-box">
    <strong>What is Qualified Replacement Property?</strong><br><br>
    QRP includes stocks and bonds issued by <strong>domestic operating corporations</strong>.
    This means publicly traded companies, corporate bonds, and certain closely held
    business interests. QRP does <strong>not</strong> include: passive investment companies,
    real estate investment trusts (REITs), mutual funds, or foreign corporation securities.
    Many sellers work with a wealth advisor to construct a diversified QRP portfolio that
    generates income while maintaining the deferral.
</div>

<h3>Important Considerations</h3>

<p class="body-text">
    <strong>Timing:</strong> QRP must be purchased within 12 months before or 3 months
    after the sale. Planning should begin well before closing.
</p>
<p class="body-text">
    <strong>Basis Tracking:</strong> The QRP takes a <strong>substituted basis</strong> —
    the seller's basis in the QRP is reduced by the amount of gain deferred. This means
    if the QRP is later sold, the deferred gain becomes taxable at that time.
</p>
<p class="body-text">
    <strong>Holding Period:</strong> The deferral lasts as long as the QRP is held.
    There is no time limit. Many sellers hold QRP for life, effectively eliminating
    the tax through the stepped-up basis at death.
</p>
<p class="body-text">
    <strong>Recapture Risk:</strong> If the ESOP disposes of the employer securities
    within 3 years, the seller's §1042 election may be partially or fully recaptured.
    The 3-year holding period by the ESOP is a compliance requirement.
</p>

<div class="signature-block">
    <div class="sig-line"></div>
    <div class="sig-label">Stefano Stokes, Founder</div>
    <div style="font-size:0.75rem;color:#333;margin-top:0.1rem;">Forhemit Transition Stewardship</div>
</div>

<div class="footer-notice">
    Forhemit Stewardship Management Co. &middot; California Public Benefit Corporation<br>
    This document is provided for informational and educational purposes only. It does not
    constitute tax, legal, or financial advice. The seller should consult with a qualified
    tax attorney, CPA, and financial advisor before making any §1042 election or investment
    decisions. Tax laws are subject to change. Forhemit is not a law firm, accounting firm,
    registered investment adviser, or broker-dealer. All figures are estimates and may vary
    based on actual transaction terms, valuation, and the seller's individual tax situation.
</div>

</body>
</html>"""


# ── Main ────────────────────────────────────────────────────────────────────

GENERATORS = {
    "conditional-go": generate_conditional_go,
    "engagement-letter": generate_engagement_letter,
    "loi": generate_loi,
    "transaction-cost-disclosure": generate_transaction_cost_disclosure,
    "offer-summary": generate_offer_summary,
    "honest-review": generate_honest_review,
    "calendar-120-day": generate_calendar_120_day,
    "1042-rollover-explainer": generate_1042_rollover_explainer,
}

FILENAMES = {
    "conditional-go": "Conditional-Go-Letter",
    "engagement-letter": "Engagement-Letter",
    "loi": "Letter-of-Intent",
    "transaction-cost-disclosure": "Transaction-Cost-Disclosure",
    "offer-summary": "Offer-Summary-V3",
    "honest-review": "Honest-Review",
    "calendar-120-day": "120-Day-Closing-Calendar",
    "1042-rollover-explainer": "1042-Rollover-Explainer",
}


def main():
    p = argparse.ArgumentParser(description="Forhemit deal document PDF generator")
    p.add_argument("--type", choices=list(GENERATORS.keys()), required=True)
    p.add_argument("--company", default="Company")
    p.add_argument("--seller", default="Seller")
    p.add_argument("--ref", default="REF-0000")
    p.add_argument("--ev", default="TBD", help="Enterprise value")
    p.add_argument("--output", required=True)

    args = p.parse_args()

    if not HAS_WEASYPRINT:
        print("ERROR: weasyprint not installed. Run: pip install weasyprint")
        sys.exit(1)

    ctx = {
        "company": args.company,
        "seller": args.seller,
        "ref": args.ref,
        "ev": args.ev,
    }

    output_dir = Path(args.output).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    filename = f"{FILENAMES[args.type]}-{ctx['ref']}.pdf"
    output_path = output_dir / filename

    html_content = GENERATORS[args.type](ctx)
    assert HTML is not None, "weasyprint not installed"
    HTML(string=html_content).write_pdf(str(output_path))

    size_kb = output_path.stat().st_size / 1024
    print(f"\n  ✅ {output_path.name}  ({size_kb:.0f} KB)")
    print(f"  📄 {output_path}\n")

    if log_document is not None:
        with contextlib.suppress(Exception):
            log_document(
                document_type="other",
                file_path=str(output_path),
                company_name=args.company,
                ref=args.ref,
                generated_by=f"generate-deal-pdf:{args.type}",
            )


if __name__ == "__main__":
    main()

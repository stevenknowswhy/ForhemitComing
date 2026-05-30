#!/usr/bin/env python3
"""
Forhemit — ESOP Transaction Packet Generator
─────────────────────────────────────────────
Generates branded PDF documents for ESOP transaction setup:
  - board-resolution     — Board/Member resolution authorizing ESOP exploration
  - roles-matrix         — Roles & independence matrix for ERISA compliance
  - dream-team-roster    — Advisory team roster with mini-RFPs

Usage:
  python3 scripts/generate-esop-packet.py --type board-resolution \\
    --company "Dark Horse Institute" \\
    --seller "Robin Crow" \\
    --ref DHI-2026-001 \\
    --entity-type "Tennessee LLC" \\
    --state "Tennessee" \\
    --board-members "Robin Crow,Managing Member" \\
    --output /path/to/output

  python3 scripts/generate-esop-packet.py --type roles-matrix \\
    --company "Dark Horse Institute" \\
    --ref DHI-2026-001 \\
    --output /path/to/output

  python3 scripts/generate-esop-packet.py --type dream-team-roster \\
    --company "Dark Horse Institute" \\
    --seller "Robin Crow" \\
    --ref DHI-2026-001 \\
    --ev "$7,250,000" \\
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

/* ── Table ── */
.matrix-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.78rem;
}
.matrix-table th {
    text-align: left;
    font-size: 0.58rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #fff;
    font-weight: 400;
    padding: 0.6rem 0.7rem;
    background: #1B2A4A;
    border-bottom: 2px solid #7A5C20;
}
.matrix-table td {
    padding: 0.55rem 0.7rem;
    border-bottom: 1px solid #ddd;
    font-weight: 300;
    color: #333;
    vertical-align: top;
}
.matrix-table tr:nth-child(even) td { background: #faf8f4; }
.matrix-table td:first-child { font-weight: 400; color: #111; }
.matrix-table td.role-name {
    font-weight: 400;
    color: #111;
    white-space: nowrap;
}
.indep-yes {
    color: #2d7a3a;
    font-weight: 400;
}
.indep-no {
    color: #b33a3a;
    font-weight: 400;
}
.indep-na {
    color: #999;
    font-style: italic;
}

/* ── RFP Card ── */
.rfp-card {
    border: 1px solid #bbb;
    margin-bottom: 1.5rem;
    break-inside: avoid;
}
.rfp-header {
    background: #1B2A4A;
    color: #fff;
    padding: 0.7rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.rfp-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: 0.06em;
}
.rfp-badge {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #B8965A;
}
.rfp-body {
    padding: 1rem;
    font-size: 0.8rem;
    font-weight: 300;
    line-height: 1.8;
    color: #333;
}
.rfp-body p { margin-bottom: 0.6rem; }
.rfp-body strong { color: #111; font-weight: 500; }
.rfp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    margin-top: 0.8rem;
    border-top: 1px solid #ddd;
}
.rfp-cell {
    padding: 0.5rem 0.7rem;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    font-size: 0.75rem;
}
.rfp-cell:nth-child(even) { border-right: none; }
.rfp-cell-l {
    font-size: 0.52rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #7A5C20;
    margin-bottom: 0.15rem;
}
.rfp-cell-v { font-weight: 300; color: #111; }

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

/* ── Resolution Block ── */
.res-whereas {
    margin-bottom: 0.6rem;
    padding-left: 1.5rem;
    text-indent: -1.5rem;
    font-size: 0.83rem;
    line-height: 1.85;
    color: #333;
}
.res-whereas strong { color: #111; font-weight: 500; }
.res-resolve {
    margin-bottom: 0.6rem;
    padding-left: 1.5rem;
    text-indent: -1.5rem;
    font-size: 0.83rem;
    line-height: 1.85;
    color: #111;
    font-weight: 400;
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
"""


def _wrap_html(body: str, title: str) -> str:
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


# ── Document: Board Resolution ───────────────────────────────────────────────


def generate_board_resolution(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    board_members = ctx.get("board_members", [])
    entity_type = ctx.get("entity_type", "LLC")
    state = ctx.get("state", "the applicable state")

    # Build board member list
    member_rows = ""
    for name, title in board_members:
        member_rows += f'<div class="si"><span class="si-n">&#9679;</span><span><strong>{name}</strong> &mdash; {title}</span></div>\n'

    # Adjust resolution language based on entity type
    if "LLC" in entity_type.upper():
        governing_body = "Members"
        action_word = "RESOLVED"
        auth_language = "the Members of"
        doc_type = "Resolution of the Members"
    else:
        governing_body = "Board of Directors"
        action_word = "RESOLVED"
        auth_language = "the Board of Directors of"
        doc_type = "Resolution of the Board of Directors"

    body = f"""
{_header_block(ctx['ref'])}

<div class="dt">{doc_type}</div>
<div class="dst">{ctx['company']} &mdash; Authorization of ESOP Exploration</div>

<div class="cvg">
    <div class="cvc"><div class="cvc-l">Company</div><div class="cvc-v">{ctx['company']}</div></div>
    <div class="cvc"><div class="cvc-l">Entity Type</div><div class="cvc-v">{entity_type}</div></div>
    <div class="cvc"><div class="cvc-l">State of Formation</div><div class="cvc-v">{state}</div></div>
    <div class="cvc"><div class="cvc-l">Date of Adoption</div><div class="cvc-v">{today}</div></div>
    <div class="cvc"><div class="cvc-l">Reference</div><div class="cvc-v">{ctx['ref']}</div></div>
    <div class="cvc"><div class="cvc-l">Authorized Signatory</div><div class="cvc-v">{ctx['seller']}</div></div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 01</span><span class="st">Recitals</span></div>
    <div class="sb">
        <p><strong>WHEREAS,</strong> {ctx['company']} (the &ldquo;Company&rdquo;) is a {entity_type} organized under the laws of the State of {state};</p>

        <p><strong>WHEREAS,</strong> the {governing_body} of the Company has been presented with a preliminary assessment of the feasibility of establishing an Employee Stock Ownership Plan (&ldquo;ESOP&rdquo;) for the benefit of the Company&rsquo;s eligible employees;</p>

        <p><strong>WHEREAS,</strong> the {governing_body} has reviewed the potential benefits of an ESOP transaction, including but not limited to: (a) providing a fair market value liquidity event for the current ownership; (b) preserving the Company&rsquo;s independence, culture, and legacy; (c) creating a tax-advantaged employee benefit program; and (d) aligning employee incentives with long-term company performance;</p>

        <p><strong>WHEREAS,</strong> the {governing_body} has determined that it is in the best interests of the Company and its stakeholders to formally authorize the exploration of an ESOP transaction and to engage qualified professional advisors to conduct a detailed feasibility analysis;</p>

        <p><strong>WHEREAS,</strong> the {governing_body} acknowledges that any ESOP transaction will be subject to (i) an independent fair market valuation by an ASA-accredited appraiser, (ii) ERISA compliance review, (iii) a favorable tax opinion from qualified counsel, and (iv) final approval by the {governing_body} prior to execution;</p>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 02</span><span class="st">Resolutions</span></div>
    <div class="sb">
        <p><strong>NOW, THEREFORE, BE IT {action_word},</strong> by {auth_language} the Company, as follows:</p>

        <p class="res-resolve"><strong>RESOLVED (1) &mdash; Authorization of ESOP Exploration.</strong> That the Company is hereby authorized to explore, evaluate, and pursue the establishment of an Employee Stock Ownership Plan, including the formation of an ESOP trust, the engagement of qualified professional advisors, and the preparation of all necessary documentation to facilitate a potential ESOP transaction.</p>

        <p class="res-resolve"><strong>RESOLVED (2) &mdash; Engagement of Professional Advisors.</strong> That the Authorized Signatory is hereby authorized and directed to engage, on behalf of the Company, the following professional advisors to assist with the ESOP feasibility analysis and transaction process:</p>
        <div class="sl">
            <div class="si"><span class="si-n">(a)</span><span><strong>Transaction Stewardship:</strong> Forhemit Stewardship Management Co. to serve as the overall transaction coordinator and stewardship advisor.</span></div>
            <div class="si"><span class="si-n">(b)</span><span><strong>ERISA Counsel:</strong> To be selected from qualified ERISA/employee benefits law firms to provide legal counsel on plan design, fiduciary obligations, and Department of Labor compliance.</span></div>
            <div class="si"><span class="si-n">(c)</span><span><strong>Independent Appraiser:</strong> An ASA-accredited business valuation firm to conduct the independent fair market value appraisal of the Company&rsquo;s stock or membership interests.</span></div>
            <div class="si"><span class="si-n">(d)</span><span><strong>Trustee:</strong> An independent ESOP trustee to represent the interests of the plan participants and negotiate the transaction on behalf of the ESOP trust.</span></div>
            <div class="si"><span class="si-n">(e)</span><span><strong>Auditor / Accountant:</strong> A qualified accounting firm to prepare or review the Company&rsquo;s financial statements, quality of earnings analysis, and tax compliance matters.</span></div>
        </div>

        <p class="res-resolve"><strong>RESOLVED (3) &mdash; Authorized Signatory.</strong> That <strong>{ctx['seller']}</strong>, in their capacity as the Company&rsquo;s Authorized Signatory, is hereby authorized and empowered to:</p>
        <div class="sl">
            <div class="si"><span class="si-n">(a)</span><span>Execute and deliver engagement letters, non-disclosure agreements, and other documents necessary to effectuate the purposes of these Resolutions;</span></div>
            <div class="si"><span class="si-n">(b)</span><span>Provide financial statements, tax returns, and other confidential company information to professional advisors under appropriate confidentiality protections;</span></div>
            <div class="si"><span class="si-n">(c)</span><span>Negotiate the terms of the ESOP transaction, subject to final approval by the {governing_body};</span></div>
            <div class="si"><span class="si-n">(d)</span><span>Take any and all actions as may be necessary or appropriate to carry out the intent and purposes of these Resolutions.</span></div>
        </div>

        <p class="res-resolve"><strong>RESOLVED (4) &mdash; Conditions Precedent.</strong> That no ESOP transaction shall be consummated unless and until:</p>
        <div class="sl">
            <div class="si"><span class="si-n">(a)</span><span>An independent fair market value appraisal has been completed and the purchase price does not exceed the appraised value;</span></div>
            <div class="si"><span class="si-n">(b)</span><span>ERISA counsel has delivered a favorable opinion regarding the legality and tax-qualified status of the proposed ESOP;</span></div>
            <div class="si"><span class="si-n">(c)</span><span>The {governing_body} has reviewed and approved the final terms and conditions of the transaction by subsequent resolution;</span></div>
            <div class="si"><span class="si-n">(d)</span><span>All applicable regulatory approvals and filings have been completed.</span></div>
        </div>

        <p class="res-resolve"><strong>RESOLVED (5) &mdash; Ratification.</strong> That all actions heretofore taken by the Authorized Signatory and the Company&rsquo;s officers in connection with the ESOP exploration are hereby ratified, confirmed, and approved in all respects.</p>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 03</span><span class="st">{governing_body} Approving This Resolution</span></div>
    <div class="sb">
        <p>The undersigned, constituting all of the {governing_body} of {ctx['company']}, hereby adopt and approve the foregoing Resolutions as of the date first written above.</p>
        <div class="sl">
            {member_rows}
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 04</span><span class="st">Signatures</span></div>
    <div class="sb">
        <div class="sg">
            <div class="sb-block">
                <div style="font-size:0.55rem;letter-spacing:0.22em;text-transform:uppercase;color:#7A5C20;font-weight:400;">Authorized Signatory</div>
                <div class="s-line"></div>
                <div class="s-lbl">{ctx['seller']}</div>
                <div style="font-size:0.7rem;color:#666;">Printed Name &amp; Title</div>
            </div>
            <div class="sb-block">
                <div style="font-size:0.55rem;letter-spacing:0.22em;text-transform:uppercase;color:#7A5C20;font-weight:400;">Date</div>
                <div class="s-line"></div>
            </div>
        </div>
    </div>
</div>

{_footer_block(today, "CONFIDENTIAL — Board Resolution — Not valid until all signatures obtained.")}
"""
    return _wrap_html(body, f"Board Resolution — {ctx['company']}")


# ── Document: Roles & Independence Matrix ───────────────────────────────────


def generate_roles_matrix(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")

    # Standard ESOP deal team roles with independence requirements
    roles = [
        {
            "role": "Transaction Steward",
            "provider": "Forhemit Stewardship Management Co.",
            "fiduciary": "No",
            "independent": "Yes",
            "conflicts": "None identified — fee paid by Company, not contingent on deal closing",
            "notes": "Coordinates deal team, manages timeline, prepares packages. Non-fiduciary advisory role.",
        },
        {
            "role": "ESOP Trustee",
            "provider": "To Be Selected",
            "fiduciary": "Yes",
            "independent": "Yes (required)",
            "conflicts": "Must be independent of seller, management, and other advisors per ERISA \u00a7408(e)",
            "notes": "Represents plan participants. Negotiates purchase price. Must approve FMV appraisal.",
        },
        {
            "role": "ERISA Counsel",
            "provider": "To Be Selected",
            "fiduciary": "No",
            "independent": "Yes (recommended)",
            "conflicts": "Should not represent seller or management in the same transaction",
            "notes": "Advises on plan design, fiduciary obligations, DOL compliance, prohibited transactions.",
        },
        {
            "role": "Seller's Counsel",
            "provider": "To Be Selected",
            "fiduciary": "No",
            "independent": "No (represents seller)",
            "conflicts": "Represents seller's interests — cannot also represent ESOP trust",
            "notes": "Negotiates purchase agreement, reps & warranties, tax structuring for seller.",
        },
        {
            "role": "Company Counsel",
            "provider": "To Be Selected",
            "fiduciary": "No",
            "independent": "Recommended",
            "conflicts": "May have existing relationship with seller — must disclose",
            "notes": "Reviews entity conversion, corporate governance, loan agreements, guarantees.",
        },
        {
            "role": "Independent Appraiser",
            "provider": "ASA-Accredited Firm (TBS)",
            "fiduciary": "No",
            "independent": "Yes (required)",
            "conflicts": "Cannot have financial interest in the transaction per ERISA \u00a72509",
            "notes": "Issues FMV appraisal. Must be independent of seller, buyer (trust), and management.",
        },
        {
            "role": "Quality of Earnings",
            "provider": "To Be Selected",
            "fiduciary": "No",
            "independent": "Yes (recommended)",
            "conflicts": "Should not be the Company's regular audit firm to maintain independence",
            "notes": "Prepares QofE report. Financial due diligence for trustee and lender.",
        },
        {
            "role": "Lender",
            "provider": "To Be Selected",
            "fiduciary": "No",
            "independent": "N/A (arm's length)",
            "conflicts": "Standard commercial lending relationship",
            "notes": "SBA 7(a), conventional, or seller financing. Lender due diligence independent of deal team.",
        },
        {
            "role": "Third-Party Administrator",
            "provider": "To Be Selected",
            "fiduciary": "No",
            "independent": "Yes (recommended)",
            "conflicts": "Should not also serve as trustee to avoid concentration of responsibility",
            "notes": "Handles plan administration, compliance testing, Form 5500 filing, participant communications.",
        },
        {
            "role": "Insurance Broker",
            "provider": "To Be Selected",
            "fiduciary": "No",
            "independent": "N/A",
            "conflicts": "Standard commercial relationship",
            "notes": "Fidelity bond (ERISA \u00a7412), fiduciary liability insurance, key-person insurance.",
        },
    ]

    # Build table rows
    rows = ""
    for r in roles:
        indep_class = (
            "indep-na"
            if "N/A" in r["independent"]
            else ("indep-yes" if "Yes" in r["independent"] else "indep-no")
        )
        fid_class = "indep-yes" if r["fiduciary"] == "Yes" else "indep-na"
        rows += f"""<tr>
    <td class="role-name">{r['role']}</td>
    <td>{r['provider']}</td>
    <td class="{fid_class}">{r['fiduciary']}</td>
    <td class="{indep_class}">{r['independent']}</td>
    <td style="font-size:0.72rem;">{r['conflicts']}</td>
    <td style="font-size:0.72rem;">{r['notes']}</td>
</tr>
"""

    body = f"""
{_header_block(ctx['ref'])}

<div class="dt">Roles &amp; Independence Matrix</div>
<div class="dst">{ctx['company']} &mdash; ESOP Deal Team Structure &amp; ERISA Compliance</div>

<div class="cvg">
    <div class="cvc"><div class="cvc-l">Company</div><div class="cvc-v">{ctx['company']}</div></div>
    <div class="cvc"><div class="cvc-l">Reference</div><div class="cvc-v">{ctx['ref']}</div></div>
    <div class="cvc"><div class="cvc-l">Date</div><div class="cvc-v">{today}</div></div>
    <div class="cvc"><div class="cvc-l">Status</div><div class="cvc-v">Draft &mdash; Subject to Advisor Selection</div></div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 01</span><span class="st">Purpose</span></div>
    <div class="sb">
        <p>This matrix identifies the professional roles required to execute an ESOP transaction for {ctx['company']}, the independence requirements under ERISA for each role, and the potential conflicts of interest that must be managed. This document is prepared by Forhemit as part of the pre-engagement planning process.</p>
        <div class="co"><strong>ERISA Requirement:</strong> The ESOP trustee and independent appraiser must be free from conflicts of interest with the seller, management, and other deal participants. Non-compliance with independence requirements can result in prohibited transactions under ERISA &sect;406, excise taxes under &sect;4975, and potential plan disqualification.</div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 02</span><span class="st">Deal Team Roles &amp; Independence Status</span></div>
    <div class="sb">
        <table class="matrix-table">
            <thead>
                <tr>
                    <th style="width:12%;">Role</th>
                    <th style="width:14%;">Provider</th>
                    <th style="width:7%;">ERISA Fiduciary</th>
                    <th style="width:9%;">Independent</th>
                    <th style="width:24%;">Conflict Considerations</th>
                    <th style="width:34%;">Scope &amp; Notes</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 03</span><span class="st">Independence Key</span></div>
    <div class="sb">
        <div class="sl">
            <div class="si"><span class="si-n" style="color:#2d7a3a;">&#10003;</span><span><strong style="color:#2d7a3a;">Yes &mdash; Independent:</strong> The advisor has no financial, personal, or professional relationship with the seller, management, or other deal parties that could impair objectivity.</span></div>
            <div class="si"><span class="si-n" style="color:#b33a3a;">&#10007;</span><span><strong style="color:#b33a3a;">No &mdash; Not Independent:</strong> The advisor represents a specific party&rsquo;s interests (e.g., seller&rsquo;s counsel). This is expected and does not indicate a problem — it simply means the advisor advocates for their client.</span></div>
            <div class="si"><span class="si-n" style="color:#999;">&#8212;</span><span><strong style="color:#999;">N/A:</strong> Independence is not a regulatory requirement for this role (e.g., lender, insurance broker). Standard commercial relationships apply.</span></div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 04</span><span class="st">Critical Independence Requirements</span></div>
    <div class="sb">
        <p>The following roles have mandatory independence requirements under ERISA. Failure to comply can result in prohibited transactions, excise taxes, and plan disqualification:</p>
        <div class="sl">
            <div class="si"><span class="si-n">A.</span><span><strong>ESOP Trustee (ERISA &sect;408(e)):</strong> Must be independent of the seller, the company, and management. The trustee acts as the buyer and has a fiduciary duty exclusively to plan participants. Cannot receive compensation from the seller or have a financial interest in the transaction outcome.</span></div>
            <div class="si"><span class="si-n">B.</span><span><strong>Independent Appraiser (ERISA &sect;2509):</strong> Must be independent of the seller, the company, and the trustee. The appraiser&rsquo;s valuation determines the maximum purchase price. The Department of Labor has stated that the appraiser must be &ldquo;independent of the parties to the transaction and of each other.&rdquo;</span></div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 05</span><span class="st">Conflict Management Protocols</span></div>
    <div class="sb">
        <div class="sl">
            <div class="si"><span class="si-n">1.</span><span><strong>Disclosure:</strong> All advisors must disclose any existing relationships with the seller, company, or other deal parties before engagement. This includes prior work, financial interests, and personal relationships.</span></div>
            <div class="si"><span class="si-n">2.</span><span><strong>Screening:</strong> Forhemit will screen all proposed advisors against the independence requirements before recommending engagement. The final selection of the trustee and appraiser is subject to approval by the independent ERISA counsel.</span></div>
            <div class="si"><span class="si-n">3.</span><span><strong>Documentation:</strong> All independence certifications and conflict disclosures will be documented in writing and retained in the deal file. Any identified conflicts will be evaluated by ERISA counsel for materiality and mitigation options.</span></div>
            <div class="si"><span class="si-n">4.</span><span><strong>Ongoing Monitoring:</strong> Independence is not a one-time check. If circumstances change during the engagement (e.g., advisor acquires a conflict), the affected party must disclose immediately and the conflict management protocol will be re-applied.</span></div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#8212;</span><span class="st">Prepared by</span></div>
    <div class="sb">
        <p>This matrix is prepared by Forhemit Stewardship Management Co. as a planning document for {ctx['company']}. It is subject to revision as the deal team is assembled and specific advisors are selected. Final independence determinations will be confirmed by ERISA counsel prior to engagement.</p>
    </div>
</div>

{_sig_block()}

{_footer_block(today, "CONFIDENTIAL — Draft — Subject to revision upon advisor selection.")}
"""
    return _wrap_html(body, f"Roles & Independence Matrix — {ctx['company']}")


# ── Document: Dream Team Roster + Mini-RFP ──────────────────────────────────


def generate_dream_team_roster(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    ev = ctx.get("ev", "TBD")

    # Define the advisory team with RFP details
    team = [
        {
            "role": "Transaction Steward",
            "org": "Forhemit Stewardship Management Co.",
            "scope": "Full-service transaction coordination: deal team assembly, timeline management, lender and trustee package preparation, post-close stewardship planning.",
            "deliverables": "Deal screener, pre-flight checklist, engagement letter, transaction timeline, lender package, trustee package, post-close stewardship plan.",
            "est_fee": "Included in engagement letter",
            "est_timeline": "Full engagement (120 days)",
            "selection_criteria": "Firm experience with lower-middle-market ESOPs, stewardship model (vs. traditional advisory), post-close operational support capability.",
        },
        {
            "role": "ESOP Trustee",
            "org": "To Be Selected &mdash; Independent Trust Firm",
            "scope": "Act as buyer fiduciary for the ESOP trust. Review and approve FMV appraisal. Negotiate purchase price and terms. Execute stock purchase agreement on behalf of plan participants.",
            "deliverables": "Trustee engagement letter, FMV review memo, purchase agreement negotiation, closing opinion, ongoing trustee oversight.",
            "est_fee": "$75,000 &ndash; $150,000 (transaction) + $25,000 &ndash; $50,000/yr (ongoing)",
            "est_timeline": "Engaged at pre-transaction, active through closing, ongoing post-close",
            "selection_criteria": "Independence from seller and management, ESOP-specific experience, industry familiarity, willingness to serve ongoing, reasonable fee structure.",
        },
        {
            "role": "ERISA Counsel",
            "org": "To Be Selected &mdash; ERISA / Employee Benefits Law Firm",
            "scope": "Legal counsel on ESOP plan design, fiduciary obligations, prohibited transaction analysis, DOL compliance, plan document drafting, and tax qualification.",
            "deliverables": "Plan design memo, plan document and trust agreement, fiduciary duty analysis, prohibited transaction opinion, IRS determination letter application.",
            "est_fee": "$100,000 &ndash; $200,000 (transaction) + $15,000 &ndash; $30,000/yr (ongoing)",
            "est_timeline": "Engaged at feasibility, active through plan adoption and closing, ongoing advisory",
            "selection_criteria": "Dedicated ERISA practice (not general corporate), experience with ESOP transactions of similar size, DOL audit defense experience, IRS determination letter track record.",
        },
        {
            "role": "Independent Appraiser",
            "org": "ASA-Accredited Valuation Firm (TBS)",
            "scope": "Independent fair market value appraisal of the Company&rsquo;s equity interests. Must comply with ERISA &sect;2509 and IRS Revenue Ruling 59-60. Appraisal determines maximum purchase price.",
            "deliverables": "Formal FMV appraisal report, fairness opinion (if requested), annual update valuations for ongoing ESOP administration.",
            "est_fee": "$50,000 &ndash; $100,000 (initial) + $15,000 &ndash; $30,000/yr (annual updates)",
            "est_timeline": "4&ndash;6 weeks for initial appraisal, annual updates thereafter",
            "selection_criteria": "ASA accreditation (Accredited Senior Appraiser), ESOP-specific valuation experience, independence from all deal parties, industry expertise, DOL-defensible methodology.",
        },
        {
            "role": "Quality of Earnings / Auditor",
            "org": "To Be Selected &mdash; Accounting Firm",
            "scope": "Quality of earnings analysis (QofE), financial due diligence, review or audit of historical financial statements, pro forma financial projections for lender package.",
            "deliverables": "QofE report, reviewed/audited financials (3 years), pro forma projections, lender-ready financial package.",
            "est_fee": "$40,000 &ndash; $80,000 (QofE) + $30,000 &ndash; $60,000/yr (audit/review)",
            "est_timeline": "6&ndash;8 weeks for QofE, ongoing for annual audit/review",
            "selection_criteria": "Experience with ESOP QofE requirements, independence from regular audit firm (recommended), familiarity with SBA lending requirements, industry expertise.",
        },
        {
            "role": "Lender",
            "org": "To Be Selected &mdash; SBA 7(a) or Conventional Lender",
            "scope": "Finance the ESOP purchase. SBA 7(a) loans can fund up to 100% of FMV for qualifying companies. Conventional or seller financing may supplement or replace SBA depending on deal size and structure.",
            "deliverables": "Term sheet, loan commitment, closing funds, ongoing loan servicing.",
            "est_fee": "Standard lending fees (1&ndash;3% origination + interest)",
            "est_timeline": "4&ndash;8 weeks from application to commitment",
            "selection_criteria": "ESOP lending experience, SBA preferred lender status (if SBA route), competitive rates and terms, ability to close within 120-day timeline.",
        },
        {
            "role": "Third-Party Administrator",
            "org": "To Be Selected &mdash; TPA Firm",
            "scope": "Ongoing plan administration: compliance testing (ADP/ACP, top-heavy), Form 5500 filing, participant communications, distribution processing, contribution calculations.",
            "deliverables": "Annual compliance testing, Form 5500, participant statements, plan amendments, distribution processing.",
            "est_fee": "$15,000 &ndash; $35,000/yr",
            "est_timeline": "Engaged at plan adoption, ongoing annual services",
            "selection_criteria": "ESOP-specific administration experience (not just 401(k)), integration with payroll systems, compliance track record, reasonable annual fees.",
        },
        {
            "role": "Insurance Broker",
            "org": "To Be Selected",
            "scope": "Fidelity bond (ERISA &sect;412 required), fiduciary liability insurance (recommended), key-person life insurance (if required by lender).",
            "deliverables": "Fidelity bond policy, fiduciary liability policy, key-person insurance quotes, annual renewal management.",
            "est_fee": "Varies by coverage &mdash; typically $5,000&ndash;$15,000/yr for fidelity + fiduciary",
            "est_timeline": "2&ndash;4 weeks for initial placement",
            "selection_criteria": "ERISA bond experience, competitive premiums, multiple carrier relationships, claims support.",
        },
    ]

    # Build RFP cards
    cards = ""
    for i, t in enumerate(team, 1):
        cards += f"""
<div class="rfp-card">
    <div class="rfp-header">
        <div class="rfp-title">{i}. {t['role']}</div>
        <div class="rfp-badge">{t['org']}</div>
    </div>
    <div class="rfp-body">
        <p><strong>Scope of Services:</strong> {t['scope']}</p>
        <p><strong>Key Deliverables:</strong> {t['deliverables']}</p>
        <div class="rfp-grid">
            <div class="rfp-cell">
                <div class="rfp-cell-l">Estimated Fee Range</div>
                <div class="rfp-cell-v">{t['est_fee']}</div>
            </div>
            <div class="rfp-cell">
                <div class="rfp-cell-l">Estimated Timeline</div>
                <div class="rfp-cell-v">{t['est_timeline']}</div>
            </div>
            <div class="rfp-cell" style="grid-column: 1 / -1; border-right: none;">
                <div class="rfp-cell-l">Selection Criteria</div>
                <div class="rfp-cell-v">{t['selection_criteria']}</div>
            </div>
        </div>
    </div>
</div>
"""

    body = f"""
{_header_block(ctx['ref'])}

<div class="dt">Dream Team Roster</div>
<div class="dst">{ctx['company']} &mdash; ESOP Advisory Team &amp; Mini-RFP</div>

<div class="cvg">
    <div class="cvc"><div class="cvc-l">Company</div><div class="cvc-v">{ctx['company']}</div></div>
    <div class="cvc"><div class="cvc-l">Reference</div><div class="cvc-v">{ctx['ref']}</div></div>
    <div class="cvc"><div class="cvc-l">Estimated Enterprise Value</div><div class="cvc-v">{ev}</div></div>
    <div class="cvc"><div class="cvc-l">Date</div><div class="cvc-v">{today}</div></div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 01</span><span class="st">Overview</span></div>
    <div class="sb">
        <p>This document identifies the professional advisors required to execute an ESOP transaction for <strong>{ctx['company']}</strong>, along with scope-of-service mini-RFPs for each role. The estimated enterprise value of <strong>{ev}</strong> informs the fee ranges and service levels outlined below.</p>
        <div class="co"><strong>Process:</strong> Forhemit will coordinate the selection process. For each role, we will (1) identify 2&ndash;3 qualified candidates, (2) issue the mini-RFP below, (3) evaluate responses against the selection criteria, and (4) recommend the best-fit provider to {ctx['seller']} for final approval. The ESOP trustee and independent appraiser selections require independence verification by ERISA counsel before engagement.</div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 02</span><span class="st">Advisory Team &mdash; Mini-RFPs by Role</span></div>
</div>

{cards}

<div class="sec">
    <div class="sh"><span class="sn">&#167; 03</span><span class="st">Fee Summary (Estimated Ranges)</span></div>
    <div class="sb">
        <table class="matrix-table">
            <thead>
                <tr>
                    <th style="width:25%;">Role</th>
                    <th style="width:30%;">One-Time / Transaction</th>
                    <th style="width:25%;">Annual / Ongoing</th>
                    <th style="width:20%;">Total (5-Year Est.)</th>
                </tr>
            </thead>
            <tbody>
                <tr><td class="role-name">Transaction Steward</td><td>Included in engagement</td><td>Included in stewardship</td><td>Included</td></tr>
                <tr><td class="role-name">ESOP Trustee</td><td>$75K &ndash; $150K</td><td>$25K &ndash; $50K/yr</td><td>$200K &ndash; $400K</td></tr>
                <tr><td class="role-name">ERISA Counsel</td><td>$100K &ndash; $200K</td><td>$15K &ndash; $30K/yr</td><td>$160K &ndash; $350K</td></tr>
                <tr><td class="role-name">Independent Appraiser</td><td>$50K &ndash; $100K</td><td>$15K &ndash; $30K/yr</td><td>$110K &ndash; $250K</td></tr>
                <tr><td class="role-name">QofE / Auditor</td><td>$40K &ndash; $80K</td><td>$30K &ndash; $60K/yr</td><td>$190K &ndash; $380K</td></tr>
                <tr><td class="role-name">Lender</td><td>1&ndash;3% origination</td><td>Standard interest</td><td>Per loan terms</td></tr>
                <tr><td class="role-name">Third-Party Administrator</td><td>&mdash;</td><td>$15K &ndash; $35K/yr</td><td>$75K &ndash; $175K</td></tr>
                <tr><td class="role-name">Insurance Broker</td><td>&mdash;</td><td>$5K &ndash; $15K/yr</td><td>$25K &ndash; $75K</td></tr>
                <tr style="font-weight:500;"><td class="role-name" style="font-weight:500;">Estimated Total (excl. lending)</td><td colspan="2" style="font-weight:500;">$265K &ndash; $530K one-time + $105K &ndash; $220K/yr recurring</td><td style="font-weight:500;color:#7A5C20;">$760K &ndash; $1.63M</td></tr>
            </tbody>
        </table>
        <div class="co"><strong>Note:</strong> All fee ranges are estimates based on comparable ESOP transactions for companies of similar size. Actual fees will be confirmed through the mini-RFP process and memorialized in individual engagement letters. Fees are typically tax-deductible business expenses.</div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 04</span><span class="st">Next Steps</span></div>
    <div class="sb">
        <div class="sl">
            <div class="si"><span class="si-n">1.</span><span><strong>Review &amp; Approve Roster.</strong> {ctx['seller']} reviews the roster and confirms the roles, scopes, and fee ranges. Any adjustments to scope or priorities are incorporated before RFPs are issued.</span></div>
            <div class="si"><span class="si-n">2.</span><span><strong>Forhemit Issues Mini-RFPs.</strong> Forhemit identifies 2&ndash;3 qualified candidates per role and issues the mini-RFPs. Responses are collected within 2 weeks.</span></div>
            <div class="si"><span class="si-n">3.</span><span><strong>Evaluate &amp; Recommend.</strong> Forhemit evaluates responses against the selection criteria and presents a recommended team to {ctx['seller']} with rationale and comparative fee analysis.</span></div>
            <div class="si"><span class="si-n">4.</span><span><strong>Engage Advisors.</strong> Upon approval, Forhemit coordinates the execution of engagement letters and initiates the 120-day transaction timeline.</span></div>
        </div>
    </div>
</div>

{_sig_block()}

{_footer_block(today, "CONFIDENTIAL — Preliminary estimates — For discussion purposes only.")}
"""
    return _wrap_html(body, f"Dream Team Roster — {ctx['company']}")


# ── Main ────────────────────────────────────────────────────────────────────

GENERATORS = {
    "board-resolution": generate_board_resolution,
    "roles-matrix": generate_roles_matrix,
    "dream-team-roster": generate_dream_team_roster,
}

FILENAMES = {
    "board-resolution": "Board-Resolution",
    "roles-matrix": "Roles-Independence-Matrix",
    "dream-team-roster": "Dream-Team-Roster",
}


def main():
    p = argparse.ArgumentParser(
        description="Forhemit ESOP transaction packet PDF generator"
    )
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

    # Board resolution specific
    p.add_argument(
        "--entity-type",
        default="LLC",
        help="Entity type (e.g., Tennessee LLC, C-Corp)",
    )
    p.add_argument(
        "--state",
        default="the applicable state",
        help="State of formation",
    )
    p.add_argument(
        "--board-members",
        default="",
        help="Comma-separated board members as Name,Title pairs (semicolon-separated)",
    )

    # Dream team specific
    p.add_argument("--ev", default="TBD", help="Estimated enterprise value")

    args = p.parse_args()

    if not HAS_WEASYPRINT:
        print("ERROR: weasyprint not installed. Run: pip install weasyprint")
        sys.exit(1)

    # Parse board members: "Name1,Title1;Name2,Title2"
    board_members = []
    if args.board_members:
        for pair in args.board_members.split(";"):
            parts = pair.strip().split(",", 1)
            if len(parts) == 2:
                board_members.append((parts[0].strip(), parts[1].strip()))
            elif len(parts) == 1:
                board_members.append((parts[0].strip(), "Member"))

    ctx = {
        "company": args.company,
        "seller": args.seller,
        "ref": args.ref,
        "entity_type": args.entity_type,
        "state": args.state,
        "board_members": board_members,
        "ev": args.ev,
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
                generated_by=f"generate-esop-packet:{args.type}",
            )


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Forhemit — Broker Packet Document Generator
────────────────────────────────────────────
Generates branded PDF documents for broker outreach and qualification:
  - broker-intro-packet   — Partnership overview for new broker relationships
  - esop-cost-card        — Three-framework ESOP cost analysis reference card
  - broker-screener-form  — Deal qualification submission form (printable)

Usage:
  python3 scripts/generate-broker-packet.py --type broker-intro-packet \\
    --company "Dark Horse Institute" --broker "Gary Martin" \\
    --broker-firm "Martin M&A Advisors" \\
    --referral-source "Industry conference" \\
    --ref DHI-2026-001 --output /path/to/output

  python3 scripts/generate-broker-packet.py --type esop-cost-card \\
    --company "Dark Horse Institute" \\
    --ref DHI-2026-001 \\
    --transaction-costs "$385,000 – $520,000" \\
    --annual-stewardship "$85,000 – $120,000 / yr" \\
    --five-year-total "$810,000 – $1,120,000" \\
    --ma-comparison "4–6% of EV ($290K – $430K)" \\
    --output /path/to/output

  python3 scripts/generate-broker-packet.py --type broker-screener-form \\
    --company "Dark Horse Institute" \\
    --ref DHI-2026-001 \\
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


# ── Document: Broker Introduction Packet ─────────────────────────────────────


def generate_broker_intro_packet(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    body = f"""
{_header_block()}

<div class="dt">Broker Introduction</div>
<div class="dst">ESOP Transaction Stewardship — Partnership Overview</div>

<div class="cvg">
    <div class="cvc"><div class="cvc-l">Broker</div><div class="cvc-v">{ctx['broker']}</div></div>
    <div class="cvc"><div class="cvc-l">Firm</div><div class="cvc-v">{ctx['broker_firm']}</div></div>
    <div class="cvc"><div class="cvc-l">Date</div><div class="cvc-v">{today}</div></div>
    <div class="cvc"><div class="cvc-l">Source</div><div class="cvc-v">{ctx['referral_source']}</div></div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 01</span><span class="st">Who We Are</span></div>
    <div class="sb">
        <p>Dear {ctx['broker']},</p>
        <p>Forhemit Stewardship Management Co. is a transaction stewardship firm that facilitates employee ownership transitions for lower-middle-market companies. We coordinate the ESOP deal team, manage the process timeline, prepare lender and trustee packages, and provide post-close operational stewardship.</p>
        <p>We are writing to introduce ourselves and explore a referral partnership. Forhemit works with business brokers who encounter clients exploring exit options — and for the right company, an ESOP can be the best outcome for all parties.</p>
        <div class="co"><strong>What we are NOT:</strong> Forhemit is not a buyer, broker, attorney, financial advisor, or ERISA fiduciary. We do not compete for deals — we help close them. Our fee is paid by the operating company, not from the broker's commission.</div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 02</span><span class="st">When to Refer to Forhemit</span></div>
    <div class="sb">
        <p>An ESOP may be the right path when the seller's company has:</p>
        <div class="sl">
            <div class="si"><span class="si-n">A.</span><span><strong>Stable, recurring revenue.</strong> $5M+ annual revenue with predictable cash flow. ESOPs work best for companies with durable earnings, not project-based or volatile businesses.</span></div>
            <div class="si"><span class="si-n">B.</span><span><strong>Strong EBITDA.</strong> $1.5M+ TTM EBITDA (QofE-normalized). This is the floor for SBA 7(a) financing viability.</span></div>
            <div class="si"><span class="si-n">C.</span><span><strong>Owner continuity interest.</strong> The seller wants to preserve the company's legacy, retain employees, and stay involved post-close (even if only for a transition period).</span></div>
            <div class="si"><span class="si-n">D.</span><span><strong>No obvious strategic buyer.</strong> The seller has explored traditional M&amp;A and either the valuations are below expectations or the fit isn't right.</span></div>
            <div class="si"><span class="si-n">E.</span><span><strong>C-Corp or convertible entity.</strong> LLCs and S-Corps can convert to C-Corps for the ESOP, but the seller needs to understand the tax implications (we handle this).</span></div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 03</span><span class="st">How the Referral Works</span></div>
    <div class="sb">
        <div class="sl">
            <div class="si"><span class="si-n">1.</span><span><strong>You introduce the seller to Forhemit.</strong> A warm email introduction is all we need. We handle the rest — deal screener, pre-flight checklist, engagement letter, and full transaction management.</span></div>
            <div class="si"><span class="si-n">2.</span><span><strong>We send you the deal screener response.</strong> Within 48 hours, Forhemit will send you and the seller a structured assessment: does this deal fit the ESOP criteria, and if so, what does the path look like?</span></div>
            <div class="si"><span class="si-n">3.</span><span><strong>Your commission is protected.</strong> Forhemit does not adjust, share, defer, or appear as a line item affecting broker commission. The full agreed-upon commission is paid at closing per the listing agreement.</span></div>
            <div class="si"><span class="si-n">4.</span><span><strong>Referral fee available.</strong> If you are not the listing broker but made the referral, Forhemit can facilitate a referral fee arrangement. Details are set forth in a separate Referral Fee Agreement.</span></div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 04</span><span class="st">The ESOP Advantage for Sellers</span></div>
    <div class="sb">
        <p>Why sellers choose ESOPs over traditional M&amp;A:</p>
        <div class="sl">
            <div class="si"><span class="si-n">A.</span><span><strong>Fair market value.</strong> ESOP appraisals are conducted by independent, ASA-accredited firms. The FMV is often competitive with — or exceeds — strategic buyer offers for the right company.</span></div>
            <div class="si"><span class="si-n">B.</span><span><strong>&sect;1042 tax deferral.</strong> Sellers of C-Corp stock to an ESOP can defer 100% of capital gains tax by reinrolling proceeds into Qualified Replacement Securities. This can save millions in taxes.</span></div>
            <div class="si"><span class="si-n">C.</span><span><strong>Legacy preservation.</strong> The company stays independent. No competitor acquisition, no PE strip-mining, no layoffs. The employees who built the company become its owners.</span></div>
            <div class="si"><span class="si-n">D.</span><span><strong>Flexible timeline.</strong> The 120-day process is structured but not rushed. The seller has clear gates and decision points throughout.</span></div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 05</span><span class="st">What We Send You</span></div>
    <div class="sb">
        <p>For each referred deal, Forhemit provides the broker with:</p>
        <div class="sl">
            <div class="si"><span class="si-n">01</span><span><strong>Deal screener response.</strong> Structured assessment of ESOP viability within 48 hours of receiving company information.</span></div>
            <div class="si"><span class="si-n">02</span><span><strong>Weekly status updates.</strong> During the transaction, brokers receive headline-only status updates at each gate milestone.</span></div>
            <div class="si"><span class="si-n">03</span><span><strong>Closing commission confirmation.</strong> Formal confirmation of commission amount and wire timing on closing day.</span></div>
            <div class="si"><span class="si-n">04</span><span><strong>Marketing materials.</strong> ESOP cost reference cards, two-track cost analyses, and other materials you can share with sellers to introduce the ESOP concept.</span></div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 06</span><span class="st">Next Steps</span></div>
    <div class="sb">
        <p>If you have a seller who may be a fit for an ESOP, the process is simple:</p>
        <div class="sl">
            <div class="si"><span class="si-n">A.</span><span><strong>Send a warm introduction.</strong> Email <strong>deals&#64;forhemit.com</strong> with the seller's name, company, and basic financials (revenue, EBITDA, industry). CC the seller if appropriate.</span></div>
            <div class="si"><span class="si-n">B.</span><span><strong>We respond within 48 hours.</strong> The seller receives a structured deal screener response. You receive a copy.</span></div>
            <div class="si"><span class="si-n">C.</span><span><strong>No commitment required.</strong> The deal screener is free. The seller can proceed or walk away at any point before signing the Pre-Flight Checklist.</span></div>
        </div>
        <div class="co"><strong>Confidentiality:</strong> All information shared with Forhemit is treated as confidential. We will not contact the seller directly without a broker introduction, and we will not share deal information with any third party without authorization.</div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 07</span><span class="st">Contact</span></div>
    <div class="sb">
        <div class="fr"><label>Email</label><span style="flex:1;color:#111;">deals&#64;forhemit.com</span></div>
        <div class="fr"><label>Website</label><span style="flex:1;">forhemit.com</span></div>
        <p style="margin-top:0.8rem;">We look forward to working with you.</p>
    </div>
</div>

{_sig_block()}

{_footer_block(today, "CONFIDENTIAL — This introduction does not constitute a referral agreement.")}
"""
    return _wrap_html(body, "Forhemit — Broker Introduction Packet")


# ── Document: ESOP Cost Reference Card ───────────────────────────────────────


def generate_esop_cost_card(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    body = f"""
{_header_block(ctx['ref'])}

<div class="dt">ESOP Cost Reference Card</div>
<div class="dst">Three-Framework Cost Analysis for {ctx['company']}</div>

<div class="cvg">
    <div class="cvc"><div class="cvc-l">Company</div><div class="cvc-v">{ctx['company']}</div></div>
    <div class="cvc"><div class="cvc-l">Reference</div><div class="cvc-v">{ctx['ref']}</div></div>
    <div class="cvc"><div class="cvc-l">Date</div><div class="cvc-v">{today}</div></div>
    <div class="cvc"><div class="cvc-l">Status</div><div class="cvc-v">Preliminary</div></div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 01</span><span class="st">How to Read This Card</span></div>
    <div class="sb">
        <p>ESOP costs are often presented as a single number, which obscures their true nature. This card uses three frameworks to give a complete picture:</p>
        <div class="co"><strong>Framework 1:</strong> What you pay at closing (one-time transaction costs).<br><strong>Framework 2:</strong> What you pay every year (ongoing stewardship costs).<br><strong>Framework 3:</strong> What it costs over five years (total cost of ownership).</div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 02</span><span class="st">Framework 1: Transaction Costs (One-Time)</span></div>
    <div class="sb">
        <p>These are the costs incurred to execute the ESOP transaction. They are paid once, at or around closing.</p>
        <table class="cost-table">
            <thead><tr><th style="width:50%;">Category</th><th style="text-align:right;">Estimated Amount</th></tr></thead>
            <tbody>
                <tr><td>Transaction Costs (trustee, ERISA counsel, valuation, QofE, Forhemit, other)</td><td class="amount">{ctx['transaction_costs']}</td></tr>
                <tr class="total"><td>Total One-Time Transaction Costs</td><td class="amount">{ctx['transaction_costs']}</td></tr>
            </tbody>
        </table>
        <p>These costs are typically capitalized into the deal or paid from company operating funds. They are tax-deductible business expenses.</p>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 03</span><span class="st">Framework 2: Annual Stewardship Costs (Ongoing)</span></div>
    <div class="sb">
        <p>After closing, the ESOP requires ongoing professional support to remain compliant and well-managed.</p>
        <table class="cost-table">
            <thead><tr><th style="width:50%;">Category</th><th style="text-align:right;">Annual Estimate</th></tr></thead>
            <tbody>
                <tr><td>Annual Stewardship (Forhemit post-close support, trustee oversight, valuation, compliance)</td><td class="amount">{ctx['annual_stewardship']}</td></tr>
                <tr class="total"><td>Total Annual Ongoing Costs</td><td class="amount">{ctx['annual_stewardship']}</td></tr>
            </tbody>
        </table>
        <p>Annual stewardship costs cover the ESOP trustee, annual valuation updates, ERISA compliance, Form 5500 filing support, and Forhemit's operational stewardship. These are recurring operating expenses.</p>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 04</span><span class="st">Framework 3: Total Cost of Ownership (5-Year View)</span></div>
    <div class="sb">
        <p>The total cost of ownership over five years combines one-time transaction costs with five years of annual stewardship:</p>
        <table class="cost-table">
            <thead><tr><th style="width:50%;">Component</th><th style="text-align:right;">Amount</th></tr></thead>
            <tbody>
                <tr><td>One-Time Transaction Costs</td><td class="amount">{ctx['transaction_costs']}</td></tr>
                <tr><td>Annual Stewardship &times; 5 Years</td><td class="amount">{ctx['annual_stewardship']} / yr</td></tr>
                <tr class="total"><td>Five-Year Total Cost of Ownership</td><td class="amount">{ctx['five_year_total']}</td></tr>
            </tbody>
        </table>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 05</span><span class="st">Comparison to Traditional M&amp;A Costs</span></div>
    <div class="sb">
        <p>For context, the table below compares ESOP costs to a typical third-party sale:</p>
        <table class="cost-table">
            <thead><tr><th style="width:50%;">Cost Element</th><th style="text-align:right;">Traditional M&amp;A</th></tr></thead>
            <tbody>
                <tr><td>Typical Advisory &amp; Closing Costs</td><td class="amount">{ctx['ma_comparison']}</td></tr>
            </tbody>
        </table>
        <div class="co"><strong>Key difference:</strong> In a third-party sale, the seller typically bears a 4&ndash;6% sell-side broker commission plus legal and accounting fees. In an ESOP sale, the company pays all fees as business expenses, and there is no sell-side broker commission. Additionally, &sect;1042 tax deferral can offset many multiples of the transaction cost.</div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 06</span><span class="st">Important Notes</span></div>
    <div class="sb">
        <div class="sl">
            <div class="si"><span class="si-n">1.</span><span><strong>All figures are estimates.</strong> Final costs depend on company size, deal complexity, and advisor selection. Detailed quotes will be provided during the engagement process.</span></div>
            <div class="si"><span class="si-n">2.</span><span><strong>Tax deductibility.</strong> Transaction costs and annual stewardship costs are generally deductible as ordinary business expenses. The seller's CPA should confirm applicability.</span></div>
            <div class="si"><span class="si-n">3.</span><span><strong>&sect;1042 offset.</strong> The tax savings from &sect;1042 deferral frequently exceed the total transaction cost, making the ESOP economically compelling on a net basis even when gross costs are comparable to M&amp;A.</span></div>
        </div>
    </div>
</div>

{_sig_block()}

{_footer_block(today, "CONFIDENTIAL — PRELIMINARY ESTIMATES — For discussion purposes only. Final costs confirmed during engagement.")}
"""
    return _wrap_html(body, "Forhemit — ESOP Cost Reference Card")


# ── Document: Broker Screener / Qualification Form ───────────────────────────


def generate_broker_screener_form(ctx: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    body = f"""
{_header_block(ctx['ref'])}

<div class="dt">Broker Screener Form</div>
<div class="dst">Deal Qualification Submission</div>

<div class="co"><strong>Instructions:</strong> Complete all fields below. This form is used by Forhemit to assess whether a deal opportunity meets our qualification criteria. Incomplete submissions will be returned. All information is treated as confidential under the terms of any existing NDA.</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 01</span><span class="st">Broker Information</span></div>
    <div class="sb">
        <div class="form-row">
            <div class="form-field"><label>Broker Name</label><div class="f-line"></div></div>
            <div class="form-field"><label>Firm Name</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Email</label><div class="f-line"></div></div>
            <div class="form-field"><label>Phone</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>License Number</label><div class="f-line"></div></div>
            <div class="form-field"><label>Submission Date</label><div class="f-line"></div></div>
        </div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 02</span><span class="st">Company Information</span></div>
    <div class="sb">
        <div class="form-row">
            <div class="form-field"><label>Company Name</label><div class="f-line"></div></div>
            <div class="form-field"><label>DBA (if different)</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Industry / NAICS Code</label><div class="f-line"></div></div>
            <div class="form-field"><label>Year Founded</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>City / State</label><div class="f-line"></div></div>
            <div class="form-field"><label>Legal Entity Type</label><div class="f-line"></div></div>
        </div>
        <div class="form-field-full"><label>Brief Company Description</label><div class="f-line"></div></div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 03</span><span class="st">Financial Summary (TTM)</span></div>
    <div class="sb">
        <div class="form-row">
            <div class="form-field"><label>Annual Revenue</label><div class="f-line"></div></div>
            <div class="form-field"><label>Gross Margin %</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>EBITDA (Adjusted)</label><div class="f-line"></div></div>
            <div class="form-field"><label>EBITDA Margin %</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>SDE (Seller's Discretionary Earnings)</label><div class="f-line"></div></div>
            <div class="form-field"><label>Owner Compensation (Total)</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Revenue Trend (3yr)</label><div class="f-line"></div></div>
            <div class="form-field"><label>EBITDA Trend (3yr)</label><div class="f-line"></div></div>
        </div>
        <div class="form-field-full"><label>Material Adjustments or Add-backs (describe)</label><div class="f-line"></div></div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 04</span><span class="st">Ownership &amp; Management</span></div>
    <div class="sb">
        <div class="form-row">
            <div class="form-field"><label>Number of Owners</label><div class="f-line"></div></div>
            <div class="form-field"><label>Primary Owner % Stake</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Owner Age</label><div class="f-line"></div></div>
            <div class="form-field"><label>Desired Exit Timeline</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Total Employees (W-2)</label><div class="f-line"></div></div>
            <div class="form-field"><label>Management Depth (layers)</label><div class="f-line"></div></div>
        </div>
        <div class="form-field-full"><label>Key Person Dependency (describe if owner is critical to operations)</label><div class="f-line"></div></div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 05</span><span class="st">Deal Terms</span></div>
    <div class="sb">
        <div class="form-row">
            <div class="form-field"><label>Asking Price</label><div class="f-line"></div></div>
            <div class="form-field"><label>Valuation Basis</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Preferred Deal Structure</label><div class="f-line"></div></div>
            <div class="form-field"><label>Seller Financing Available?</label><div class="f-line"></div></div>
        </div>
        <div class="form-row">
            <div class="form-field"><label>Real Estate Included?</label><div class="f-line"></div></div>
            <div class="form-field"><label>Real Estate Value (if applicable)</label><div class="f-line"></div></div>
        </div>
        <div class="form-field-full"><label>Material Liabilities, Contingencies, or Litigation</label><div class="f-line"></div></div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#167; 06</span><span class="st">Qualification Checklist</span></div>
    <div class="sb">
        <p>Check each item that applies. This helps us assess fit before scheduling a call.</p>
        <div class="check-row"><div class="check-box"></div><span>EBITDA between $1M and $15M (QofE-adjusted, trailing twelve months)</span></div>
        <div class="check-row"><div class="check-box"></div><span>Industry: manufacturing, professional services, healthcare, or distribution</span></div>
        <div class="check-row"><div class="check-box"></div><span>Owner-operator seeking full or partial exit within 12 months</span></div>
        <div class="check-row"><div class="check-box"></div><span>Entity type: LLC, S-Corp, or C-Corp (willing to convert if LLC)</span></div>
        <div class="check-row"><div class="check-box"></div><span>15+ W-2 employees with at least one layer of management below owner</span></div>
        <div class="check-row"><div class="check-box"></div><span>No material pending litigation or regulatory actions</span></div>
        <div class="check-row"><div class="check-box"></div><span>Clean tax returns available for last 3 years</span></div>
        <div class="check-row"><div class="check-box"></div><span>Customer concentration below 30% (top customer)</span></div>
        <div class="check-row"><div class="check-box"></div><span>Owner willing to stay through transition period (6–24 months)</span></div>
        <div class="check-row"><div class="check-box"></div><span>Broker has executed NDA with seller</span></div>
    </div>
</div>

<div class="sec">
    <div class="sh"><span class="sn">&#8212;</span><span class="st">Broker Certification</span></div>
    <div class="sb">
        <p>By submitting this form, the broker certifies that the information provided is accurate to the best of their knowledge and that they have authorization from the seller to share this information with Forhemit.</p>
        <div class="sg">
            <div class="sb-block">
                <div class="s-line"></div>
                <div class="s-lbl">Broker Signature</div>
            </div>
            <div class="sb-block">
                <div style="font-size:0.62rem;letter-spacing:0.22em;text-transform:uppercase;color:#7A5C20;font-weight:400;">Date</div>
                <div class="s-line"></div>
            </div>
        </div>
    </div>
</div>

{_footer_block(today, "CONFIDENTIAL — Submit to: deals&#64;forhemit.com")}
"""
    return _wrap_html(body, "Forhemit — Broker Screener Form")


# ── Main ────────────────────────────────────────────────────────────────────

GENERATORS = {
    "broker-intro-packet": generate_broker_intro_packet,
    "esop-cost-card": generate_esop_cost_card,
    "broker-screener-form": generate_broker_screener_form,
    "seller-faq": generate_seller_faq,
    "broker-nda": generate_broker_nda,
    "exit-strategy-benchmark": generate_exit_strategy_benchmark,
    "esop-head-to-head": generate_esop_head_to_head,
}

FILENAMES = {
    "broker-intro-packet": "Broker-Introduction-Packet",
    "esop-cost-card": "ESOP-Cost-Reference-Card",
    "broker-screener-form": "Broker-Screener-Form",
    "seller-faq": "Seller-FAQ-Guide",
    "broker-nda": "Broker-NDA",
    "exit-strategy-benchmark": "Exit-Strategy-Benchmark",
    "esop-head-to-head": "ESOP-Head-to-Head-Comparison",
}


def main():
    p = argparse.ArgumentParser(description="Forhemit broker packet PDF generator")
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

    # Broker intro packet specific
    p.add_argument("--broker", default="Broker", help="Broker name")
    p.add_argument("--broker-firm", default="", help="Broker firm name")
    p.add_argument(
        "--referral-source", default="Direct", help="How the broker found Forhemit"
    )

    # ESOP cost card specific
    p.add_argument(
        "--transaction-costs",
        default="TBD",
        help="Estimated one-time transaction costs",
    )
    p.add_argument(
        "--annual-stewardship",
        default="TBD",
        help="Estimated annual stewardship costs",
    )
    p.add_argument(
        "--five-year-total", default="TBD", help="Five-year total cost of ownership"
    )
    p.add_argument(
        "--ma-comparison",
        default="TBD",
        help="Traditional M&A advisory/closing cost comparison",
    )

    args = p.parse_args()

    if not HAS_WEASYPRINT:
        print("ERROR: weasyprint not installed. Run: pip install weasyprint")
        sys.exit(1)

    ctx = {
        "company": args.company,
        "seller": args.seller,
        "ref": args.ref,
        "broker": args.broker,
        "broker_firm": args.broker_firm or args.broker,
        "referral_source": args.referral_source,
        "transaction_costs": args.transaction_costs,
        "annual_stewardship": args.annual_stewardship,
        "five_year_total": args.five_year_total,
        "ma_comparison": args.ma_comparison,
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
                generated_by=f"generate-broker-packet:{args.type}",
            )


if __name__ == "__main__":
    main()

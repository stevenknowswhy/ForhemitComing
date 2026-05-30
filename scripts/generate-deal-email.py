#!/usr/bin/env python3
"""
Forhemit Deal Email Draft Generator
────────────────────────────────────
Generates branded HTML email drafts for review before sending.
Supports 6 deal pipeline email types. Saves .draft.html files
to the output folder. Use --send to actually deliver via Resend.

Usage:
  python3 scripts/generate-deal-email.py \\
    --type deal-screener \\
    --company "Dark Horse Institute" \\
    --seller "Robin Crow" \\
    --broker "Gary Martin" \\
    --broker-email "gary@oxfordhighland.com" \\
    --ref DHI-2026-001 \\
    --attachment /path/to/attachment.pdf \\
    --output /path/to/output/folder

  # Override name and email (stored as additional name in Convex, not overriding original):
  python3 scripts/generate-deal-email.py \\
    --type deal-screener \\
    --company "Dark Horse Institute" \\
    --broker "Gary Martin" \\
    --first-name "James" --last-name "Smith" \\
    --email "james@newbroker.com" \\
    --ref DHI-2026-001 \\
    --output /path/to/output/folder

  # Send the approved draft via Resend:
  python3 scripts/generate-deal-email.py \\
    --type deal-screener \\
    --send /path/to/output/deal-screener-DHI-2026-001.draft.html

Types:
  deal-screener          Broker → Forhemit (deal submission acknowledgment)
  qualification-agenda   Seller qualification call agenda
  preflight-cover        Pre-flight checklist cover letter (to seller)
  conditional-go         Conditional go/no-go letter
  engagement-cover       Engagement letter cover email
  loi-transmittal        LOI transmittal letter
  board-resolution-cover Cover email for board resolution package
  roles-matrix-cover     Cover email for roles & independence matrix
  dream-team-cover       Cover email for dream team roster & mini-RFP
"""

import argparse
import contextlib
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

log_document = None
log_error = None
with contextlib.suppress(ImportError):
    from ghost_logger import log_document  # noqa: F811

# ── Brand colors (matches emailCore.ts BRAND object) ───────────────────────

BRASS = "#B8965A"
INK = "#1A1714"
PARCHMENT = "#F7F4EE"
STONE = "#8A7E6E"
WHITE = "#ffffff"
LIGHT_GRAY = "#f5f3ee"
BORDER_GRAY = "#e0dbd2"
TEXT_GRAY = "#6b6560"
TEXT_DARK = "#1A1714"
TEXT_BODY = "#3d3832"


# ── Email type definitions ─────────────────────────────────────────────────

EMAIL_TYPES = {
    "deal-screener": {
        "subject": "New Deal Submission — {company} — {ref}",
        "direction": "inbound",
        "description": "Broker submits a deal listing to Forhemit",
    },
    "qualification-agenda": {
        "subject": "Seller Qualification Call — {company} — {ref}",
        "direction": "outbound",
        "description": "Agenda sent to seller/broker before qualification call",
    },
    "preflight-cover": {
        "subject": "Pre-Flight Assessment — {company} — {ref}",
        "direction": "outbound",
        "description": "Cover letter accompanying pre-flight checklist to seller",
    },
    "conditional-go": {
        "subject": "Conditional Go Letter — {company} — {ref}",
        "direction": "outbound",
        "description": "Formal notification of conditional approval to proceed",
    },
    "engagement-cover": {
        "subject": "Engagement Letter — {company} — {ref}",
        "direction": "outbound",
        "description": "Cover email for engagement letter delivery",
    },
    "loi-transmittal": {
        "subject": "Letter of Intent — {company} — {ref}",
        "direction": "outbound",
        "description": "Transmittal letter for LOI delivery",
    },
    "board-resolution-cover": {
        "subject": "Board Resolution — {company} — {ref}",
        "direction": "outbound",
        "description": "Cover email for board resolution package delivery",
    },
    "roles-matrix-cover": {
        "subject": "Roles & Independence Matrix — {company} — {ref}",
        "direction": "outbound",
        "description": "Cover email for roles & independence matrix delivery",
    },
    "dream-team-cover": {
        "subject": "Dream Team Roster — {company} — {ref}",
        "direction": "outbound",
        "description": "Cover email for dream team roster & mini-RFP delivery",
    },
    "lender-outreach": {
        "subject": "ESOP Financing Opportunity — {company} — {ref}",
        "direction": "outbound",
        "description": "SBA lender outreach email introducing ESOP financing opportunity",
    },
    "lender-qualification": {
        "subject": "Lender Qualification Interview — {company} — {ref}",
        "direction": "outbound",
        "description": "Qualification interview request to SBA lender",
    },
}


# ── Email body generators ──────────────────────────────────────────────────


def body_deal_screener(ctx: dict) -> str:
    """Broker → Forhemit: acknowledgment of deal submission."""
    name = ctx.get("display_name") or ctx["broker"]
    return f"""
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Dear {name},
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Thank you for submitting the listing for <strong>{ctx['company']}</strong>
  for our review. We have received the materials and will begin our initial
  qualification assessment.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Our standard screening process includes:
</p>
<ol style="font-size:15px;line-height:1.8;color:{TEXT_BODY};margin:0 0 16px;padding-left:20px;">
  <li>Financial profile review (EBITDA, revenue stability, debt capacity)</li>
  <li>Entity structure and ESOP eligibility assessment</li>
  <li>Management depth and succession readiness evaluation</li>
  <li>Industry fit and customer concentration analysis</li>
</ol>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  We expect to complete our initial screening within <strong>5 business days</strong>.
  If the opportunity meets our criteria, we will reach out to schedule an
  introductory call with the seller.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  If you have any questions in the meantime, please don't hesitate to reach out.
</p>
"""


def body_qualification_agenda(ctx: dict) -> str:
    """Outbound: agenda for seller qualification call."""
    name = ctx.get("display_name") or ctx["seller"]
    call_date = ctx.get("date", "")
    call_time = ctx.get("time", "")

    date_time_block = ""
    if call_date or call_time:
        date_line = f"<strong>Date:</strong> {call_date}" if call_date else ""
        time_line = f"<strong>Time:</strong> {call_time}" if call_time else ""
        separator = (
            "&nbsp;&nbsp;&middot;&nbsp;&nbsp;" if call_date and call_time else ""
        )
        date_time_block = f"""
<div style="background:{PARCHMENT};border:1px solid {BORDER_GRAY};padding:14px 20px;margin:20px 0;border-radius:6px;text-align:center;">
  <p style="font-size:15px;color:{INK};margin:0;font-weight:500;letter-spacing:0.3px;">
    {date_line}{separator}{time_line}
  </p>
</div>
"""

    return f"""
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Dear {name},
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Thank you for your interest in exploring an employee ownership transition
  for <strong>{ctx['company']}</strong>. We look forward to our conversation.
</p>
{date_time_block}
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Below is the agenda for our qualification call. Please review it beforehand
  and have any relevant documents or financial summaries available.
</p>

<div style="background:{PARCHMENT};border-left:3px solid {BRASS};padding:20px 24px;margin:24px 0;border-radius:0 6px 6px 0;">
  <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:{INK};margin:0 0 16px;font-weight:400;letter-spacing:0.5px;">
    Qualification Call Agenda
  </h3>

  <p style="font-size:14px;color:{TEXT_BODY};margin:0 0 12px;">
    <strong style="color:{INK};">1. Company Overview</strong> (10 min)<br>
    History, mission, products/services, market position, and organizational structure.
  </p>
  <p style="font-size:14px;color:{TEXT_BODY};margin:0 0 12px;">
    <strong style="color:{INK};">2. Financial Snapshot</strong> (15 min)<br>
    Revenue trends, EBITDA performance, debt obligations, and capital expenditure needs.
    Please have 3 years of financial statements or tax returns available.
  </p>
  <p style="font-size:14px;color:{TEXT_BODY};margin:0 0 12px;">
    <strong style="color:{INK};">3. Ownership &amp; Transition Goals</strong> (10 min)<br>
    Current ownership structure, desired timeline, motivation for employee ownership,
    and expectations for the transition.
  </p>
  <p style="font-size:14px;color:{TEXT_BODY};margin:0 0 12px;">
    <strong style="color:{INK};">4. Team &amp; Management</strong> (10 min)<br>
    Key personnel, management depth, employee count, and succession readiness.
  </p>
  <p style="font-size:14px;color:{TEXT_BODY};margin:0 0 12px;">
    <strong style="color:{INK};">5. Legal &amp; Entity Structure</strong> (5 min)<br>
    Entity type, state of incorporation, existing agreements, and any pending
    litigation or regulatory matters.
  </p>
  <p style="font-size:14px;color:{TEXT_BODY};margin:0 0 12px;">
    <strong style="color:{INK};">6. Next Steps &amp; Q&amp;A</strong> (10 min)<br>
    Overview of our process, timeline expectations, and your questions.
  </p>
</div>

<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  The call is expected to last approximately <strong>60 minutes</strong>.
  Please confirm your availability or suggest an alternative time if needed.
</p>
"""


def body_preflight_cover(ctx: dict) -> str:
    """Outbound: cover letter for pre-flight checklist."""
    name = ctx.get("display_name") or ctx["seller"]
    return f"""
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Dear {name},
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Thank you for the productive conversation regarding <strong>{ctx['company']}</strong>
  and your interest in exploring an employee ownership transition.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  As a next step, we have prepared a <strong>Pre-Flight Assessment</strong> — a
  comprehensive evaluation of your company's readiness for an ESOP transition.
  This assessment covers:
</p>
<ul style="font-size:15px;line-height:1.8;color:{TEXT_BODY};margin:0 0 16px;padding-left:20px;">
  <li>Financial readiness and EBITDA analysis</li>
  <li>Entity structure requirements</li>
  <li>Employee eligibility and workforce composition</li>
  <li>Management depth and succession planning</li>
  <li>Regulatory and compliance considerations</li>
</ul>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Please find the attached assessment for your review. We have also included a
  <strong>document checklist</strong> of items we will need to proceed with a
  full evaluation.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Please review the assessment and return the completed checklist within
  <strong>5 business days</strong>. If you have any questions, we are available
  to discuss at your convenience.
</p>
"""


def body_conditional_go(ctx: dict) -> str:
    """Outbound: conditional go/no-go letter."""
    name = ctx.get("display_name") or ctx["seller"]
    return f"""
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Dear {name},
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Following our comprehensive pre-flight assessment of <strong>{ctx['company']}</strong>,
  we are pleased to inform you that your company has received a
  <strong style="color:#2e7d32;">conditional approval</strong> to proceed with
  the ESOP transition process.
</p>

<div style="background:#f0f8f0;border-left:3px solid #2e7d32;padding:16px 20px;margin:20px 0;border-radius:0 6px 6px 0;">
  <p style="font-size:15px;color:#2e7d32;margin:0;font-weight:500;">
    ✓ Recommendation: Proceed with conditions
  </p>
</div>

<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  This approval is subject to the following conditions being satisfied before
  we can formally engage:
</p>

<div style="background:{PARCHMENT};padding:16px 20px;margin:20px 0;border-radius:6px;border:1px solid {BORDER_GRAY};">
  <p style="font-size:14px;color:{TEXT_BODY};margin:0 0 10px;">
    <strong>1.</strong> Entity conversion to C-Corp structure (if not already)
  </p>
  <p style="font-size:14px;color:{TEXT_BODY};margin:0 0 10px;">
    <strong>2.</strong> Reviewed or audited financial statements for the most recent fiscal year
  </p>
  <p style="font-size:14px;color:{TEXT_BODY};margin:0 0 10px;">
    <strong>3.</strong> Resolution of any identified legal or regulatory matters
  </p>
  <p style="font-size:14px;color:{TEXT_BODY};margin:0;">
    <strong>4.</strong> Completion of independent business valuation
  </p>
</div>

<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Upon satisfaction of these conditions, we will prepare a formal engagement
  letter outlining the scope, timeline, and fee structure for the transition.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  We are excited about the potential of working with you on this important
  transition. Please don't hesitate to reach out with any questions.
</p>
"""


def body_engagement_cover(ctx: dict) -> str:
    """Outbound: cover email for engagement letter."""
    name = ctx.get("display_name") or ctx["seller"]
    return f"""
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Dear {name},
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Thank you for your continued interest in pursuing an employee ownership
  transition for <strong>{ctx['company']}</strong>.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Attached please find the formal <strong>Engagement Letter</strong> detailing
  the scope of our services, fee structure, and the terms under which Forhemit
  will serve as your transition stewardship partner.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Key terms included in the engagement letter:
</p>
<ul style="font-size:15px;line-height:1.8;color:{TEXT_BODY};margin:0 0 16px;padding-left:20px;">
  <li>Scope of stewardship services</li>
  <li>Fee structure and retainer terms</li>
  <li>Exclusivity period and tail provisions</li>
  <li>Representations and warranties</li>
  <li>Dispute resolution and governing law</li>
</ul>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Please review the letter carefully. If the terms are acceptable, please sign
  and return the document at your earliest convenience. We are happy to schedule
  a call to discuss any questions before execution.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Upon receipt of the signed engagement letter, we will initiate the formal
  transition process.
</p>
"""


def body_loi_transmittal(ctx: dict) -> str:
    """Outbound: transmittal letter for LOI delivery."""
    name = ctx.get("display_name") or ctx["seller"]
    return f"""
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Dear {name},
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  We are pleased to transmit the enclosed <strong>Letter of Intent</strong> for
  the acquisition of <strong>{ctx['company']}</strong> through an Employee Stock
  Ownership Plan (ESOP) transaction.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  The LOI outlines the proposed terms of the transaction, including:
</p>
<ul style="font-size:15px;line-height:1.8;color:{TEXT_BODY};margin:0 0 16px;padding-left:20px;">
  <li>Proposed enterprise value and deal structure</li>
  <li>Financing sources and seller note terms</li>
  <li>Timeline to closing</li>
  <li>Due diligence requirements</li>
  <li>Key conditions precedent to closing</li>
</ul>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  This Letter of Intent is intended to serve as a framework for negotiation
  and is <strong>non-binding</strong> except for the confidentiality,
  exclusivity, and governing law provisions as specified therein.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Please review the LOI at your earliest convenience. We recommend sharing it
  with your legal and financial advisors. We are available to discuss any
  questions or proposed modifications.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  We look forward to your response and the opportunity to move forward with
  this transaction.
</p>
"""


def body_board_resolution_cover(ctx: dict) -> str:
    """Outbound: cover email for board resolution package."""
    name = ctx.get("display_name") or ctx["seller"]
    return f"""
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Dear {name},
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Thank you for your continued commitment to exploring an employee ownership
  transition for <strong>{ctx['company']}</strong>.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  As a formal step in the ESOP exploration process, we have prepared a
  <strong>Board Resolution Package</strong> for your review. This package
  contains the formal resolution authorizing the Company to explore, evaluate,
  and pursue the establishment of an Employee Stock Ownership Plan.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  The resolution addresses the following key authorizations:
</p>
<ul style="font-size:15px;line-height:1.8;color:{TEXT_BODY};margin:0 0 16px;padding-left:20px;">
  <li>Authorization to explore and pursue an ESOP transaction</li>
  <li>Engagement of professional advisors (transaction steward, ERISA counsel, appraiser, trustee, auditor)</li>
  <li>Delegation of authority to the authorized signatory</li>
  <li>Conditions precedent to consummation of the transaction</li>
  <li>Ratification of prior actions taken in furtherance of the exploration</li>
</ul>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Please review the attached resolution carefully. Once approved by the
  {ctx.get('entity_type', 'Company').split()[-1] if ctx.get('entity_type') else 'Company'}'s
  governing body, please sign and return the executed document. The signed
  resolution will be retained in the deal file and shared with ERISA counsel
  as part of the engagement process.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  If you have any questions about the resolution language or the authorization
  process, please don't hesitate to reach out.
</p>
"""


def body_roles_matrix_cover(ctx: dict) -> str:
    """Outbound: cover email for roles & independence matrix."""
    name = ctx.get("display_name") or ctx["seller"]
    return f"""
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Dear {name},
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  As part of our pre-engagement planning for <strong>{ctx['company']}</strong>,
  we have prepared a <strong>Roles &amp; Independence Matrix</strong> — a
  comprehensive document that identifies every professional role required to
  execute the ESOP transaction and their independence status under ERISA.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  This matrix is critical for two reasons:
</p>
<ol style="font-size:15px;line-height:1.8;color:{TEXT_BODY};margin:0 0 16px;padding-left:20px;">
  <li><strong>ERISA Compliance:</strong> The ESOP trustee and independent appraiser must be free from conflicts of interest with the seller, management, and other deal parties. The matrix documents these requirements upfront.</li>
  <li><strong>Conflict Management:</strong> By identifying all roles and their relationships before the deal team is assembled, we can screen for conflicts early and avoid costly delays or re-engagements later in the process.</li>
</ol>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  The attached matrix covers 10 advisory roles, their ERISA fiduciary status,
  independence requirements, conflict considerations, and recommended
  conflict management protocols.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Please review the matrix and let us know if there are any existing
  relationships or potential conflicts we should be aware of before we begin
  the advisor selection process.
</p>
"""


def body_dream_team_cover(ctx: dict) -> str:
    """Outbound: cover email for dream team roster & mini-RFP."""
    name = ctx.get("display_name") or ctx["seller"]
    ev = ctx.get("ev", "TBD")
    return f"""
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Dear {name},
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  We are pleased to present the <strong>Dream Team Roster</strong> for the
  ESOP transaction of <strong>{ctx['company']}</strong>. This document
  identifies every professional advisor required to execute the transaction,
  along with detailed mini-RFPs (scope, deliverables, estimated fees, and
  selection criteria) for each role.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  The roster covers 8 advisory roles:
</p>
<ul style="font-size:15px;line-height:1.8;color:{TEXT_BODY};margin:0 0 16px;padding-left:20px;">
  <li>Transaction Steward (Forhemit)</li>
  <li>ESOP Trustee (independent fiduciary)</li>
  <li>ERISA Counsel</li>
  <li>Independent Appraiser (ASA-accredited)</li>
  <li>Quality of Earnings / Auditor</li>
  <li>Lender (SBA 7(a) or conventional)</li>
  <li>Third-Party Administrator</li>
  <li>Insurance Broker</li>
</ul>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Based on an estimated enterprise value of <strong>{ev}</strong>, the
  attached document includes a consolidated fee summary showing estimated
  one-time, annual, and five-year total advisory costs.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Next steps: please review the roster and let us know if you'd like to adjust
  any scopes, priorities, or fee expectations. Once approved, Forhemit will
  identify 2–3 qualified candidates per role and issue the mini-RFPs.
</p>
"""


def body_lender_outreach(ctx: dict) -> str:
    """Outbound: SBA lender outreach introducing ESOP financing opportunity."""
    lender_name = (
        ctx.get("display_name")
        or ctx.get("lender_contact")
        or ctx.get("lender", "Lender")
    )
    return f"""
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Dear {lender_name},
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Forhemit Stewardship Management Co. is facilitating an Employee Stock Ownership Plan
  (ESOP) transaction for <strong>{ctx['company']}</strong>, and we are reaching out to
  introduce this SBA 7(a) financing opportunity to your institution.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  The transaction involves the acquisition of <strong>{ctx.get('esop_percentage', '100%')}</strong>
  of the company's outstanding equity by a newly formed ESOP trust, with an independent
  ASA-accredited valuation of <strong>{ctx.get('valuation', 'TBD')}</strong>. The seller,
  <strong>{ctx['seller']}</strong>, is committed to a structured transition with continued
  involvement post-close.
</p>
<div style="background:{PARCHMENT};border:1px solid {BORDER_GRAY};padding:16px 22px;margin:24px 0;border-radius:6px;">
  <p style="font-size:13px;color:{INK};margin:0 0 8px;font-weight:500;letter-spacing:0.3px;">Key Transaction Metrics</p>
  <table role="presentation" style="font-size:14px;color:{TEXT_BODY};line-height:1.8;">
    <tr><td style="padding-right:16px;font-weight:500;">Transaction Size:</td><td>{ctx.get('transaction_size', 'TBD')}</td></tr>
    <tr><td style="padding-right:16px;font-weight:500;">Loan Amount:</td><td>{ctx.get('loan_amount', 'TBD')}</td></tr>
    <tr><td style="padding-right:16px;font-weight:500;">ESOP Percentage:</td><td>{ctx.get('esop_percentage', '100%')}</td></tr>
    <tr><td style="padding-right:16px;font-weight:500;">Valuation:</td><td>{ctx.get('valuation', 'TBD')}</td></tr>
  </table>
</div>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  We have attached the <strong>SBA Lender Outreach Brief</strong> for your review.
  The brief includes details on the ESOP suitability indicators, proposed SBA 7(a)
  financing structure, and Forhemit's role as transaction steward.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  We welcome the opportunity to discuss this transaction at your convenience.
  Please reply to this email or contact us at <strong>deals@forhemit.com</strong>
  to schedule an introduction call.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Thank you for your consideration.
</p>
"""


def body_lender_qualification(ctx: dict) -> str:
    """Outbound: Qualification interview request to SBA lender."""
    lender_name = (
        ctx.get("display_name")
        or ctx.get("lender_contact")
        or ctx.get("lender", "Lender")
    )
    return f"""
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Dear {lender_name},
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Thank you for your interest in the ESOP financing opportunity for
  <strong>{ctx['company']}</strong>. We would like to schedule a lender
  qualification interview to discuss the transaction details, your
  institution's SBA 7(a) appetite, and the path to a commitment letter.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  We have prepared a structured set of interview questions covering:
</p>
<ol style="font-size:15px;line-height:1.8;color:{TEXT_BODY};margin:0 0 16px;padding-left:20px;">
  <li>Lender profile and ESOP experience</li>
  <li>Underwriting and financial requirements</li>
  <li>ESOP-specific documentation and compliance</li>
  <li>Process, timeline, and fees</li>
  <li>Risk assessment and conditions precedent</li>
</ol>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  The attached <strong>Lender Qualification Interview Questions</strong> document
  provides the full question set for your preparation. We expect the call to
  last approximately <strong>45-60 minutes</strong>.
</p>
<p style="font-size:15px;line-height:1.7;color:{TEXT_BODY};margin:0 0 16px;">
  Please reply with your availability over the next two weeks, and we will
  confirm a date and time. We look forward to the conversation.
</p>
"""


BODY_GENERATORS = {
    "deal-screener": body_deal_screener,
    "qualification-agenda": body_qualification_agenda,
    "preflight-cover": body_preflight_cover,
    "conditional-go": body_conditional_go,
    "engagement-cover": body_engagement_cover,
    "loi-transmittal": body_loi_transmittal,
    "board-resolution-cover": body_board_resolution_cover,
    "roles-matrix-cover": body_roles_matrix_cover,
    "dream-team-cover": body_dream_team_cover,
    "lender-outreach": body_lender_outreach,
    "lender-qualification": body_lender_qualification,
}


# ── HTML layout ─────────────────────────────────────────────────────────────


def email_layout(
    title: str, preheader: str, content: str, footer_note: str = ""
) -> str:
    """Generate full branded email HTML (mirrors emailCore.ts emailLayout)."""
    year = datetime.now().year
    footer = (
        footer_note
        or f"""
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:11px;color:{STONE};line-height:1.6;">
      <tr><td style="text-align:center;padding-bottom:2px;">
        Forhemit Stewardship Management Co. &middot; California Public Benefit Corporation
        &nbsp;&middot;&nbsp;
        <a href="https://forhemit.com" style="color:{BRASS};text-decoration:none;font-weight:500;">forhemit.com</a>
      </td></tr>
      <tr><td style="text-align:center;padding-bottom:2px;">
        548 Market St, Suite 36451, San Francisco, CA 94104
      </td></tr>
      <tr><td style="text-align:center;font-size:10px;color:#b0a99a;">
        &copy; {year} Forhemit Stewardship Management Co. All rights reserved.
      </td></tr>
    </table>
    """
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="description" content="{preheader}">
  <title>{title}</title>
</head>
<body style="margin:0;padding:0;background:{LIGHT_GRAY};">
  <div style="font-family:'Jost',Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:{WHITE};border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:{INK};padding:20px 30px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:44px;vertical-align:middle;">
              <div style="width:40px;height:40px;border-radius:50%;border:1px solid {BRASS};text-align:center;line-height:40px;">
                <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:300;color:{PARCHMENT};">F</span>
              </div>
            </td>
            <td style="width:1px;padding:0 16px;">
              <div style="width:1px;height:32px;background:#3a342a;"></div>
            </td>
            <td style="vertical-align:middle;">
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;font-weight:300;letter-spacing:4px;color:{PARCHMENT};">FORHEMIT</div>
              <div style="font-size:6px;font-weight:400;letter-spacing:3px;color:{BRASS};margin-top:2px;">TRANSITION STEWARDSHIP</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Title bar -->
      <div style="background:{PARCHMENT};padding:16px 30px;border-bottom:1px solid {BORDER_GRAY};">
        <h1 style="color:{INK};margin:0;font-size:18px;font-weight:500;letter-spacing:0.5px;">{title}</h1>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        {content}
        <div style="margin-top:30px;padding-top:20px;border-top:1px solid {BORDER_GRAY};">
          <p style="font-size:14px;line-height:1.6;color:{TEXT_BODY};margin:0;">
            Best regards,<br><br>
            <strong>Forhemit Transition Stewardship</strong><br>
            deals@forhemit.com<br>
            forhemit.com
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:{PARCHMENT};padding:20px 30px;border-top:1px solid {BORDER_GRAY};">
        {footer}
      </div>
    </div>
  </div>
</body>
</html>"""


# ── Draft wrapper ───────────────────────────────────────────────────────────


def draft_wrapper(
    email_type: str,
    ctx: dict,
    subject: str,
    to: str,
    attachment_name: Optional[str],
    inner_html: str,
    convex_url: str = "",
    attachment_b64: str = "",
    first_name: str = "",
    last_name: str = "",
    email: str = "",
    date: str = "",
    time: str = "",
) -> str:
    """Wrap the email in a review banner with metadata."""
    import json as _json

    meta = EMAIL_TYPES[email_type]
    subject_json = _json.dumps(subject)
    att_row = ""
    if attachment_name:
        att_row = f"""
        <tr>
          <td style="padding:4px 0;color:{TEXT_GRAY};font-size:12px;width:80px;"><strong>Attachment:</strong></td>
          <td style="padding:4px 0;color:{INK};font-size:12px;">📎 {attachment_name}</td>
        </tr>"""

    # Date/time banner rows (only for qualification-agenda)
    date_banner = ""
    if date:
        date_banner = f"""
        <tr>
          <td style="padding:4px 0;color:{TEXT_GRAY};font-size:12px;"><strong>Date:</strong></td>
          <td style="padding:4px 0;color:{INK};font-size:12px;">{date}</td>
        </tr>"""
    time_banner = ""
    if time:
        time_banner = f"""
        <tr>
          <td style="padding:4px 0;color:{TEXT_GRAY};font-size:12px;"><strong>Time:</strong></td>
          <td style="padding:4px 0;color:{INK};font-size:12px;">{time}</td>
        </tr>"""

    # Date/time send-bar inputs (only shown when values exist)
    date_input = ""
    time_input = ""
    if date:
        date_input = f"""
  <div class="recipient-box">
    <span class="recipient-label">Date:</span>
    <input class="recipient-input" type="text" id="callDate" value="{date}" />
  </div>"""
    if time:
        time_input = f"""
  <div class="recipient-box">
    <span class="recipient-label">Time:</span>
    <input class="recipient-input" type="text" id="callTime" value="{time}" />
  </div>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>DRAFT — {subject}</title>
  <style>
    body {{ margin:0;padding:0;background:#f5f3ee;font-family:'Jost',Arial,sans-serif; }}
    .draft-banner {{
      background:#fff3e0;border:2px dashed #ff9800;padding:16px 24px;
      margin:0;border-radius:0;
    }}
    .draft-banner h2 {{ margin:0 0 8px;color:#e65100;font-size:16px;letter-spacing:0.5px; }}
    .draft-banner table {{ font-size:12px; }}
    .preview-frame {{
      max-width:640px;margin:20px auto;background:#fff;
      border:1px solid #ddd;border-radius:8px;overflow:hidden;
      box-shadow:0 2px 8px rgba(0,0,0,0.1);
    }}
    .send-bar {{
      max-width:640px;margin:0 auto 20px;padding:24px;
      background:#fff;border:1px solid #ddd;border-radius:8px;
      text-align:center;
    }}
    .recipient-box {{
      display:flex;align-items:center;justify-content:center;gap:10px;
      margin-bottom:18px;background:{PARCHMENT};padding:14px 20px;
      border-radius:6px;border:1px solid {BORDER_GRAY};
    }}
    .recipient-label {{
      font-size:11px;letter-spacing:0.18em;text-transform:uppercase;
      color:{STONE};font-weight:400;white-space:nowrap;
    }}
    .recipient-input {{
      flex:1;max-width:320px;padding:8px 12px;border:1px solid {BORDER_GRAY};
      border-radius:4px;font-family:'DM Mono',monospace;font-size:13px;
      color:{INK};background:#fff;text-align:center;
    }}
    .recipient-input:focus {{
      outline:none;border-color:{BRASS};box-shadow:0 0 0 2px rgba(184,150,90,0.15);
    }}
    .send-btn {{
      display:inline-flex;align-items:center;gap:8px;
      background:{BRASS};color:#fff;padding:12px 28px;border:none;border-radius:6px;
      font-family:'Jost',Arial,sans-serif;font-size:14px;font-weight:500;
      letter-spacing:0.5px;cursor:pointer;transition:all 0.2s;
    }}
    .send-btn:hover:not(:disabled) {{ background:#9a7d3e; }}
    .send-btn:disabled {{ opacity:0.7;cursor:default; }}
    .send-btn .spinner {{
      display:none;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);
      border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite;
    }}
    .send-btn.loading .spinner {{ display:inline-block; }}
    .send-btn.loading .btn-label {{ display:none; }}
    @keyframes spin {{ to {{ transform:rotate(360deg); }} }}
    .send-status {{
      display:none;margin-top:12px;font-size:13px;font-weight:500;
    }}
    .send-status.success {{ display:block;color:#2e7d32; }}
    .send-status.error {{ display:block;color:#c62828; }}
  </style>
</head>
<body>

<div class="draft-banner">
  <h2>⚠️ DRAFT — REVIEW BEFORE SENDING</h2>
  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:4px 0;color:{TEXT_GRAY};font-size:12px;width:80px;"><strong>Type:</strong></td>
      <td style="padding:4px 0;color:{INK};font-size:12px;">{meta['description']}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;color:{TEXT_GRAY};font-size:12px;"><strong>To:</strong></td>
      <td style="padding:4px 0;color:{INK};font-size:12px;">{to}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;color:{TEXT_GRAY};font-size:12px;"><strong>Subject:</strong></td>
      <td style="padding:4px 0;color:{INK};font-size:12px;">{subject}</td>
    </tr>
    {att_row}
    {date_banner}
    {time_banner}
    <tr>
      <td style="padding:4px 0;color:{TEXT_GRAY};font-size:12px;"><strong>Generated:</strong></td>
      <td style="padding:4px 0;color:{INK};font-size:12px;">{datetime.now().strftime("%B %d, %Y at %I:%M %p")}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;color:{TEXT_GRAY};font-size:12px;width:80px;"><strong>First Name:</strong></td>
      <td style="padding:4px 0;color:{INK};font-size:12px;">{first_name or '—'}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;color:{TEXT_GRAY};font-size:12px;"><strong>Last Name:</strong></td>
      <td style="padding:4px 0;color:{INK};font-size:12px;">{last_name or '—'}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;color:{TEXT_GRAY};font-size:12px;"><strong>Email:</strong></td>
      <td style="padding:4px 0;color:{INK};font-size:12px;">{email or '—'}</td>
    </tr>
  </table>
</div>

<div class="preview-frame">
  {inner_html}
</div>

<div class="send-bar">
  <p style="margin:0 0 14px;font-size:13px;color:#333;">
    <strong>Ready to send?</strong>
  </p>
  {date_input}
  {time_input}
  <div class="recipient-box">
    <span class="recipient-label">First Name:</span>
    <input class="recipient-input" type="text" id="firstName" value="{first_name}" />
  </div>
  <div class="recipient-box">
    <span class="recipient-label">Last Name:</span>
    <input class="recipient-input" type="text" id="lastName" value="{last_name}" />
  </div>
  <div class="recipient-box">
    <span class="recipient-label">To:</span>
    <input class="recipient-input" type="email" id="recipient" value="{to}" />
  </div>
  <button class="send-btn" id="sendBtn" onclick="sendEmail()">
    <span class="spinner"></span>
    <span class="btn-label">Send via Resend</span>
  </button>
  <div class="send-status" id="sendStatus"></div>
</div>

<script>
var CONVEX_URL = '{convex_url}';
var EMAIL_SUBJECT = {subject_json};
var EMAIL_TYPE = '{email_type}';
var ATTACHMENT_NAME = '{attachment_name or ""}';
var ATTACHMENT_B64 = '{attachment_b64}';

async function sendEmail() {{
  var btn = document.getElementById('sendBtn');
  var status = document.getElementById('sendStatus');
  var email = document.getElementById('recipient').value.trim();
  var firstName = document.getElementById('firstName').value.trim();
  var lastName = document.getElementById('lastName').value.trim();

  if (!email || !email.includes('@')) {{
    status.className = 'send-status error';
    status.textContent = 'Please enter a valid email address';
    return;
  }}

  btn.disabled = true;
  btn.classList.add('loading');
  status.className = 'send-status';
  status.style.display = 'none';

  // Build updated display name from first/last
  var displayName = (firstName + ' ' + lastName).trim();

  // Extract the preview-frame HTML (the actual email body)
  var frame = document.querySelector('.preview-frame');
  var emailHtml = frame ? frame.innerHTML : document.body.innerHTML;

  // Update greeting in email body if name fields were edited
  if (displayName) {{
    emailHtml = emailHtml.replace(/Dear [^,<]+/, 'Dear ' + displayName);
  }}

  var payload = {{
    to: email,
    subject: EMAIL_SUBJECT,
    html: emailHtml,
  }};

  // Include attachment if present
  if (ATTACHMENT_NAME && ATTACHMENT_B64) {{
    payload.attachments = [{{ filename: ATTACHMENT_NAME, content: ATTACHMENT_B64 }}];
  }}

  try {{
    var resp = await fetch(CONVEX_URL + '/send-email', {{
      method: 'POST',
      headers: {{ 'Content-Type': 'application/json' }},
      body: JSON.stringify(payload),
    }});

    var data = await resp.json();

    if (data.success) {{
      btn.classList.remove('loading');
      btn.innerHTML = '✓ Sent';
      btn.style.background = '#2e7d32';
      status.className = 'send-status success';
      var attMsg = ATTACHMENT_NAME ? ' with attachment ' + ATTACHMENT_NAME : '';
      var nameMsg = displayName ? ' as ' + displayName : '';
      status.textContent = 'Email sent successfully to ' + email + nameMsg + attMsg;
    }} else {{
      throw new Error(data.error || 'Send failed');
    }}
  }} catch (err) {{
    btn.disabled = false;
    btn.classList.remove('loading');
    btn.innerHTML = '<span class="spinner"></span><span class="btn-label">Send via Resend</span>';
    status.className = 'send-status error';
    status.textContent = 'Error: ' + err.message;
  }}
}}
</script>

</body>
</html>"""


# ── Main ────────────────────────────────────────────────────────────────────


def generate_draft(
    email_type: str,
    ctx: dict,
    to: str,
    output_dir: Path,
    attachment_path: Optional[str] = None,
    convex_url: str = "",
    first_name: str = "",
    last_name: str = "",
    email: str = "",
    date: str = "",
    time: str = "",
) -> Path:
    """Generate an HTML email draft file."""
    import base64 as _b64

    meta = EMAIL_TYPES[email_type]
    subject = meta["subject"].format(**ctx)
    body_fn = BODY_GENERATORS[email_type]
    body_html = body_fn(ctx)

    title = meta["description"]
    inner = email_layout(title=title, preheader=subject, content=body_html)

    attachment_name = None
    attachment_b64 = ""
    if attachment_path:
        att_path = Path(attachment_path)
        if att_path.exists():
            attachment_name = att_path.name
            attachment_b64 = _b64.b64encode(att_path.read_bytes()).decode("ascii")
        else:
            print(f"  ⚠️  Attachment not found: {attachment_path}")

    full = draft_wrapper(
        email_type,
        ctx,
        subject,
        to,
        attachment_name,
        inner,
        convex_url=convex_url,
        attachment_b64=attachment_b64,
        first_name=first_name,
        last_name=last_name,
        email=email,
        date=date,
        time=time,
    )

    output_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{email_type}-{ctx.get('ref', 'draft')}.draft.html"
    out_path = output_dir / filename
    out_path.write_text(full, encoding="utf-8")
    return out_path


def main():
    p = argparse.ArgumentParser(description="Forhemit deal email draft generator")
    p.add_argument(
        "--type", choices=list(EMAIL_TYPES.keys()), help="Email type to generate"
    )
    p.add_argument(
        "--send",
        metavar="FILE",
        help="Send an approved draft via Resend (provide .draft.html path)",
    )
    p.add_argument("--company", default="Company", help="Company name")
    p.add_argument("--seller", default="Seller", help="Seller/owner name")
    p.add_argument("--broker", default="Broker", help="Broker name")
    p.add_argument("--broker-email", default="", help="Broker email address")
    p.add_argument("--ref", default="REF-0000", help="Deal reference")
    p.add_argument(
        "--to", default="", help="Recipient email (auto-set from direction if omitted)"
    )
    p.add_argument(
        "--first-name",
        default="",
        help="Override first name for email greeting (stored as additional name in Convex)",
    )
    p.add_argument(
        "--last-name",
        default="",
        help="Override last name for email greeting (stored as additional name in Convex)",
    )
    p.add_argument(
        "--email",
        default="",
        help="Override recipient email address",
    )
    p.add_argument(
        "--date",
        default="",
        help="Call date for qualification agenda (e.g., 'June 5, 2026')",
    )
    p.add_argument(
        "--time",
        default="",
        help="Call time for qualification agenda (e.g., '2:00 PM EST')",
    )
    p.add_argument("--attachment", help="Path to PDF attachment (for metadata display)")
    p.add_argument("--output", help="Output directory (default: ./output)")
    p.add_argument(
        "--ev",
        default="TBD",
        help="Estimated enterprise value (for dream-team-cover email)",
    )
    p.add_argument(
        "--entity-type",
        default="LLC",
        help="Entity type (for board-resolution-cover email)",
    )
    p.add_argument("--lender", default="", help="Lender institution name")
    p.add_argument("--lender-contact", default="", help="Lender contact person name")
    p.add_argument("--lender-email", default="", help="Lender contact email address")
    p.add_argument("--transaction-size", default="TBD", help="Total transaction value")
    p.add_argument("--loan-amount", default="TBD", help="Requested SBA loan amount")
    p.add_argument(
        "--esop-percentage", default="100%", help="ESOP ownership percentage"
    )
    p.add_argument("--valuation", default="TBD", help="Independent valuation amount")

    args = p.parse_args()

    # ── Send mode ──
    if args.send:
        send_draft(Path(args.send), to_override=args.to or None)
        return

    # ── Generate mode ──
    if not args.type:
        p.error("--type is required when generating a draft")

    # Build display name from override fields (first/last) or fall back to seller/broker
    display_name = ""
    name_overridden = False
    if args.first_name or args.last_name:
        display_name = f"{args.first_name} {args.last_name}".strip()
        name_overridden = True

    ctx = {
        "company": args.company,
        "seller": args.seller,
        "broker": args.broker,
        "broker_email": args.broker_email,
        "ref": args.ref,
        "display_name": display_name,
        "first_name": args.first_name,
        "last_name": args.last_name,
        "date": args.date,
        "time": args.time,
        "ev": args.ev,
        "entity_type": args.entity_type,
        "lender": args.lender,
        "lender_contact": args.lender_contact,
        "lender_email": args.lender_email,
        "transaction_size": args.transaction_size,
        "loan_amount": args.loan_amount,
        "esop_percentage": args.esop_percentage,
        "valuation": args.valuation,
    }

    # Auto-set recipient based on direction
    meta = EMAIL_TYPES[args.type]
    if args.email:
        to = args.email
    elif args.to:
        to = args.to
    elif meta["direction"] == "inbound":
        to = "deals@forhemit.com"
    elif args.lender_email:
        to = args.lender_email
    else:
        to = args.broker_email or args.seller or "recipient@example.com"

    output_dir = Path(args.output).resolve() if args.output else Path.cwd() / "output"

    # Detect Convex site URL for browser-side email sending
    convex_url = ""
    for env_path in [Path("apps/admin/.env.local"), Path(".env.local")]:
        if env_path.exists():
            for line in env_path.read_text().splitlines():
                if line.startswith("CONVEX_DEPLOY_KEY="):
                    key = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if "|" in key:
                        deployment = key.split("|")[0]
                        if ":" in deployment:
                            deployment = deployment.split(":", 1)[1]
                        convex_url = f"https://{deployment}.convex.site"
                    break
            if convex_url:
                break

    draft_path = generate_draft(
        email_type=args.type,
        ctx=ctx,
        to=to,
        output_dir=output_dir,
        attachment_path=args.attachment,
        convex_url=convex_url,
        first_name=args.first_name,
        last_name=args.last_name,
        email=args.email,
        date=args.date,
        time=args.time,
    )

    size_kb = draft_path.stat().st_size / 1024
    print(f"\n  ✅ {draft_path.name}  ({size_kb:.0f} KB)")
    print(f"  📧 Type: {meta['description']}")
    print(f"  📄 {draft_path}\n")

    # Log to Convex
    if log_document is not None:
        log_metadata = {
            "email_type": args.type,
            "to": to,
            "subject": meta["subject"].format(**ctx),
        }
        # Store override name as additional info (never overwrites original)
        if name_overridden:
            log_metadata["override_name"] = display_name
            log_metadata["override_first_name"] = args.first_name
            log_metadata["override_last_name"] = args.last_name
            log_metadata["original_name"] = (
                args.broker if meta["direction"] == "inbound" else args.seller
            )
        if args.email:
            log_metadata["override_email"] = args.email

        with contextlib.suppress(Exception):
            log_document(
                document_type="other",
                file_path=str(draft_path),
                company_name=args.company,
                ref=args.ref,
                generated_by=f"generate-deal-email:{args.type}",
                metadata=log_metadata,
            )


def send_draft(draft_path: Path, to_override: str | None = None):
    """Parse an approved draft and send via Resend API."""
    if not draft_path.exists():
        print(f"  ❌ File not found: {draft_path}")
        sys.exit(1)

    # Check for Resend API key
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        # Try .env.local
        for env_path in [Path("apps/admin/.env.local"), Path(".env.local")]:
            if env_path.exists():
                for line in env_path.read_text().splitlines():
                    if line.startswith("RESEND_API_KEY="):
                        api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                        break
            if api_key:
                break

    if not api_key:
        print("  ❌ RESEND_API_KEY not found. Set it in env or apps/admin/.env.local")
        sys.exit(1)

    content = draft_path.read_text(encoding="utf-8")

    # Extract metadata from the draft banner
    import re

    to_match = re.search(r"<strong>To:</strong></td>\s*<td[^>]*>([^<]+)", content)
    subject_match = re.search(
        r"<strong>Subject:</strong></td>\s*<td[^>]*>([^<]+)", content
    )

    if not to_match or not subject_match:
        print(
            "  ❌ Could not parse To/Subject from draft. Is this a valid .draft.html?"
        )
        sys.exit(1)

    to = to_match.group(1).strip()
    subject = subject_match.group(1).strip()

    # Override recipient if --to was provided
    if to_override:
        to = to_override

    # Extract the preview-frame inner HTML (the actual email)
    frame_match = re.search(
        r'<div class="preview-frame">\s*(.*?)\s*</div>\s*<div class="send-bar"',
        content,
        re.DOTALL,
    )
    if frame_match:
        html_body = frame_match.group(1).strip()
    else:
        html_body = content  # fallback to full content

    print("\n  📧 Sending via Resend...")
    print(f"  To: {to}")
    print(f"  Subject: {subject}\n")

    import urllib.error
    import urllib.request

    body = json.dumps(
        {
            "from": "Forhemit <deals@forhemit.com>",
            "to": [to],
            "subject": subject,
            "html": html_body,
        }
    ).encode("utf-8")

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            print(f"  ✅ Sent! Resend ID: {result.get('id', '?')}")

            # Rename draft to .sent.html
            sent_path = draft_path.with_suffix("").with_suffix(".sent.html")
            draft_path.rename(sent_path)
            print(f"  📄 Renamed to: {sent_path.name}\n")

    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        print(f"  ❌ Resend error ({e.code}): {error_body}")
        sys.exit(1)


if __name__ == "__main__":
    main()

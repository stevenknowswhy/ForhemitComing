/**
 * Engagement Letter — jsPDF-based PDF Generator
 * ───────────────────────────────────────────────
 * Ports the legacy HTML `generatePDF()` logic into a TypeScript function that
 * uses jsPDF to build a professional, multi-page letter-format PDF with
 * logical page breaks, headers/footers, and proper typography.
 *
 * This replaces the html2canvas screenshot approach (which cuts through text
 * mid-line) with structured text rendering that respects page boundaries.
 */

import type { ELData } from "./types";
import { calcFee, fmt } from "./calculations";

/* ── Color constants (RGB tuples) ─────────────────────────────────────────── */
const NAVY: [number, number, number] = [27, 42, 74];
const BRASS: [number, number, number] = [154, 117, 64];
const MUTED: [number, number, number] = [122, 112, 104];
const RULE: [number, number, number] = [214, 208, 196];
const INK: [number, number, number] = [28, 21, 16];

/* ── Layout constants ─────────────────────────────────────────────────────── */
const W = 612;          // letter width in pt
const ML = 72;          // left margin
const MR = 72;          // right margin
const M_TOP = 72;       // top margin
const CW = W - ML - MR; // content width
const PAGE_BOTTOM = 740; // bottom limit before footer

function formatContractDate(iso: string): string {
  if (!iso?.trim()) return "—";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  return new Date(t).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Generate a professional PDF from the engagement letter form data.
 * Returns a jsPDF instance which the caller can `.save()` or `.output()`.
 */
export async function generateEngagementPDF(d: ELData): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  let y = M_TOP;

  const evNum = parseFloat(d.ev) || 0;
  const evDisplay = evNum > 0 ? fmt(evNum) : "—";
  const feeResult = calcFee(d.ev);
  const successFee = feeResult.tier === 0 ? "$25,000" : feeResult.fee;
  const genDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* ── Helper: horizontal rule ─────────────────────────────────────────── */
  function rule(yy: number, col: [number, number, number] = RULE, thick = 0.5) {
    pdf.setDrawColor(...col);
    pdf.setLineWidth(thick);
    pdf.line(ML, yy, W - MR, yy);
  }

  /* ── Helper: add a new page with header ──────────────────────────────── */
  function addPage() {
    pdf.addPage();
    y = M_TOP;
    // Running header
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...MUTED);
    pdf.text(
      "FORHEMIT TRANSITION STEWARDSHIP  |  Engagement Letter  |  CONFIDENTIAL",
      ML,
      36
    );
    pdf.text(
      `${d.s_company.trim() || "Company"}  |  ${d.s_ref.trim() || "—"}`,
      W - MR,
      36,
      { align: "right" }
    );
    rule(42, RULE, 0.4);
    y = 60;
  }

  /* ── Helper: check if we need a new page ─────────────────────────────── */
  function checkY(needed = 60) {
    if (y + needed > PAGE_BOTTOM) addPage();
  }

  /* ── Helper: render a text block with auto-wrap ──────────────────────── */
  function textBlock(
    text: string,
    opts: {
      size?: number;
      bold?: boolean;
      italic?: boolean;
      color?: [number, number, number];
      width?: number;
      x?: number;
      after?: number;
    } = {}
  ): number {
    const sz = opts.size || 9;
    const font = opts.bold ? "bold" : opts.italic ? "italic" : "normal";
    const col = opts.color || INK;
    pdf.setFontSize(sz);
    pdf.setFont("helvetica", font);
    pdf.setTextColor(...col);
    const lines = pdf.splitTextToSize(text, opts.width || CW);
    const lineHeight = sz * 1.4;
    checkY(lines.length * lineHeight);
    pdf.text(lines, opts.x || ML, y);
    y += lines.length * lineHeight + (opts.after || 0);
    return y;
  }

  /* ══════════════════════════════════════════════════════════════════════ */
  /*  COVER PAGE                                                          */
  /* ══════════════════════════════════════════════════════════════════════ */

  y = 140;
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...NAVY);
  pdf.text("FORHEMIT", W / 2, y, { align: "center" });
  y += 32;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...BRASS);
  pdf.text("Transition Stewardship", W / 2, y, { align: "center" });
  y += 60;

  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...NAVY);
  pdf.text("ENGAGEMENT LETTER", W / 2, y, { align: "center" });
  y += 24;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "italic");
  pdf.setTextColor(...MUTED);
  pdf.text(
    "Transaction Stewardship Services Agreement (Revised)",
    W / 2,
    y,
    { align: "center" }
  );
  y += 60;

  rule(y);
  y += 32;

  const coverFields: [string, string][] = [
    ["Company (Client)", d.s_company.trim() || "—"],
    [
      "Authorized Officer",
      [d.officer_name.trim(), d.officer_title.trim()].filter(Boolean).join(", ") || "—",
    ],
    ["Effective Date", formatContractDate(d.s_date)],
    ["Engagement Reference", d.s_ref.trim() || "—"],
  ];

  coverFields.forEach(([label, value]) => {
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...MUTED);
    pdf.text(label.toUpperCase(), ML, y);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...INK);
    pdf.text(value, ML + 160, y);
    y += 22;
  });

  rule(y + 10);
  y += 40;

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "italic");
  pdf.setTextColor(...MUTED);
  pdf.text(
    "Forhemit Transition Stewardship  |  forhemit.com  |  deals@forhemit.com",
    W / 2,
    720,
    { align: "center" }
  );

  /* ══════════════════════════════════════════════════════════════════════ */
  /*  CONTENT PAGES                                                       */
  /* ══════════════════════════════════════════════════════════════════════ */

  addPage();

  // Build venue paragraph
  const venueParagraph = d.venue_county.trim()
    ? `County / venue for arbitration administration ("Arbitration County"): ${d.venue_county.trim()} County, ${d.gov_law || "__________"}. The Parties agree this county is used to establish the arbitration location, and that any court proceeding permitted solely for injunctive relief to protect confidential information or proprietary rights may be brought in the state or federal courts located in the Arbitration County.`
    : `County / venue for arbitration administration: The Parties will use the county specified by the Company to establish the arbitration location, and any court proceeding permitted solely for injunctive relief may be brought in the state or federal courts located in such county.`;

  const sections: { num: string; title: string; paras: string[] }[] = [
    {
      num: "1.",
      title: "Parties and Nature of Engagement",
      paras: [
        `This Engagement Letter ("Agreement") is entered into between Forhemit Transition Stewardship, a California Public Benefit Corporation ("Forhemit"), and ${d.s_company.trim() || "__________"} ("Company"), acting through ${d.officer_name.trim() || "__________"}, ${d.officer_title.trim() || "__________"}.`,
        `Forhemit is a transaction stewardship firm. Forhemit facilitates employee ownership transitions — coordinating the transaction team, managing the process timeline, preparing the lender and trustee package, and providing post-close operational stewardship.`,
        `IMPORTANT: Forhemit is not a buyer, investor, lender, broker, attorney, or financial advisor. All fees are paid by the Company as operating business expenses.`,
        `ERISA DISCLAIMER: Forhemit is NOT an ERISA fiduciary. All ERISA matters must be reviewed by independent ERISA counsel.`,
        `TAX DISCLAIMER: Forhemit does NOT provide tax advice. All tax matters must be reviewed by independent tax professionals.`,
      ],
    },
    {
      num: "2.",
      title: "Scope of Services",
      paras: [
        `Forhemit will provide the following transition stewardship services: (a) Transaction coordination — team assembly and management; (b) COOP pre-assessment — operational continuity documentation; (c) Lender package preparation — SBA underwriting materials; (d) Capital stack structuring support; (e) 120-day timeline management; (f) Broker and advisor coordination; (g) Closing coordination and post-close stewardship handoff.`,
        `NO RESULTS DISCLAIMER: Company acknowledges that Forhemit does not and cannot guaranty any specific transaction outcome, including successful closing, financing terms, valuation, purchase price, or timing. The success fee is earned upon consummation of a transaction, not upon achievement of any particular terms or valuation.`,
      ],
    },
    {
      num: "3.",
      title: "Retainer",
      paras: [
        `The Company agrees to pay Forhemit a non-refundable retainer of $25,000, payable from the Company's operating account by ${formatContractDate(d.retainer_date)} via ${d.retainer_method}. The Retainer is earned in full at execution. It does not apply toward the Transition Success Fee.`,
        `LIMITED REFUND EXCEPTION: The Retainer is non-refundable except in the event that Forhemit materially breaches this Agreement, fails to substantially perform services, or the Agreement is terminated by Company prior to Forhemit's commencement of material services. In any such event, the Retainer shall be pro-rated based on services actually rendered and the unearned portion shall be refunded to the Company.`,
      ],
    },
    {
      num: "4.",
      title: "Transition Success Fee",
      paras: [
        `Based on an estimated enterprise value of ${evDisplay}, the applicable Transition Success Fee is ${successFee}, payable by the Company from operating funds at the Closing Date.`,
        `Fee Schedule: Under $8M — $25,000; $8M–$12M — $35,000; Above $12M — $45,000. The success fee is paid by the Company from operating funds. It does not appear on the closing statement. It does not reduce seller proceeds. Forhemit invoices the Company directly within 2 business days of close; payment due within 10 business days.`,
        `FEE ADJUSTMENT: If actual Enterprise Value at closing differs by more than 10% from estimate, parties agree to negotiate in good faith an appropriate adjustment prior to closing.`,
        `LATE PAYMENT: If the Transition Success Fee is not paid when due, it shall accrue interest at the rate of 1.5% per month (or the maximum rate permitted by applicable law) from the due date until paid in full. In the event of collection action, Company shall be liable for all costs of collection, including reasonable attorneys' fees.`,
      ],
    },
    {
      num: "5.",
      title: "Company Representations",
      paras: [
        `Company represents that: (a) Tax structure: ${d.tax_struct || "__________"}; (b) Approximate employee count: ${d.emp_count || "__________"}; (c) ERISA eligibility status: ${d.erisa_elig || "__________"}; (d) Pending LOI status: ${d.other_loi || "__________"}.`,
        `The authorized officer confirms that all financial statements and operational disclosures provided to Forhemit are accurate and complete in all material respects, and that no material liabilities, pending litigation, or regulatory actions have been withheld. These representations shall survive termination of this Agreement for a period of three (3) years.`,
      ],
    },
    {
      num: "6.",
      title: "Broker / M&A Advisor",
      paras:
        d.has_broker === "yes"
          ? [
              `A broker / M&A advisor is engaged: ${d.broker_name.trim() || "__________"}, ${d.broker_firm.trim() || "__________"}.`,
              `ROLE DELINEATION: Any broker or M&A advisor identified by Company acts independently of Forhemit. Forhemit's role is limited to transaction stewardship and coordination services. Forhemit is NOT compensated based on transaction price and Forhemit's fees are NOT calculated as a percentage of transaction value.`,
            ]
          : [
              `No broker or M&A advisor is currently engaged. Seller is navigating the process directly.`,
            ],
    },
    {
      num: "7.",
      title: "Governing Law & Tail Provision",
      paras: [
        `This Agreement is governed by the laws of the State of ${d.gov_law.trim() || "__________"}.`,
        venueParagraph,
        `TAIL PROVISION: ${d.tail || "As set forth in the fully executed agreement."} If Company closes a transaction with a party introduced or identified by Forhemit within 180 days of termination, the success fee is owed, provided Forhemit gave written notice prior to termination. Tail does NOT apply if terminated for Forhemit's material breach.`,
        ...(d.special_terms.trim()
          ? [`Special Terms: ${d.special_terms.trim()}`]
          : []),
      ],
    },
    {
      num: "8.",
      title: "Dispute Resolution",
      paras: [
        `Any dispute shall be resolved by binding arbitration administered by JAMS pursuant to its Comprehensive Arbitration Rules and Procedures. The arbitration shall be conducted in the Arbitration County (as identified above) within the State of ${d.gov_law.trim() || "__________"}, before a single arbitrator with commercial services experience. The arbitrator may award costs and reasonable attorneys' fees to the prevailing party. Either Party may seek injunctive relief in court solely to protect confidential information or proprietary rights.`,
      ],
    },
    {
      num: "9.",
      title: "Limitation of Liability",
      paras: [
        `EXCEPT FOR BREACH OF CONFIDENTIALITY, WILLFUL MISCONDUCT, OR GROSS NEGLIGENCE, FORHEMIT'S TOTAL AGGREGATE LIABILITY TO COMPANY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES ACTUALLY PAID TO FORHEMIT HEREUNDER.`,
        `IN NO EVENT SHALL FORHEMIT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE.`,
        `FORHEMIT SHALL NOT BE LIABLE FOR ANY DECISIONS MADE BY COMPANY, ANY THIRD PARTY (INCLUDING LENDERS, INVESTORS, OR ADVISORS), OR ANY TRANSACTION OUTCOMES.`,
      ],
    },
    {
      num: "10.",
      title: "Indemnification",
      paras: [
        `Each Party agrees to indemnify the other for losses arising from third-party claims caused by its own gross negligence, willful misconduct, or material breach. Company additionally indemnifies Forhemit for claims arising from Company's material breach, fraud, or intellectual property infringement caused by Company's materials.`,
      ],
    },
    {
      num: "11.",
      title: "Additional Disclaimers & Independent Contractor",
      paras: [
        `ERISA DISCLAIMER: Forhemit is NOT an ERISA fiduciary and does NOT provide ERISA legal advice. All matters relating to ESOP plan qualification, employee eligibility, prohibited transactions, and fiduciary duties must be reviewed by independent ERISA counsel. Company represents that it has retained or will retain such counsel prior to signing any Letter of Intent.`,
        `TAX ADVICE DISCLAIMER: Forhemit does NOT provide tax, accounting, or financial advisory services. All tax matters must be reviewed by independent qualified tax professionals. Forhemit makes NO representations or warranties regarding any tax consequences of any transaction structure.`,
        `INDEPENDENT CONTRACTOR: The Parties are independent contractors. This Agreement does not create a partnership, joint venture, or employer-employee relationship. Forhemit shall have no authority to bind Company except as expressly provided.`,
      ],
    },
  ];

  sections.forEach((sec) => {
    checkY(60);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...NAVY);
    pdf.text(`${sec.num}  ${sec.title}`, ML, y);
    y += 6;
    rule(y, BRASS, 1);
    y += 14;
    sec.paras.forEach((p) => {
      textBlock(p, { after: 10 });
    });
    y += 8;
  });

  /* ══════════════════════════════════════════════════════════════════════ */
  /*  SIGNATURE PAGE                                                      */
  /* ══════════════════════════════════════════════════════════════════════ */

  // Always start signatures on a new page
  addPage();

  y += 10;
  rule(y);
  y += 32;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...NAVY);
  pdf.text("Signatures", ML, y);
  y += 24;

  const sigY = y;

  // Left sig — Forhemit
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...NAVY);
  pdf.text("FORHEMIT TRANSITION STEWARDSHIP", ML, sigY);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...MUTED);
  pdf.text("California Public Benefit Corporation", ML, sigY + 12);

  pdf.setDrawColor(...RULE);
  pdf.setLineWidth(0.5);
  pdf.line(ML, sigY + 50, ML + CW / 2 - 20, sigY + 50);
  pdf.text("Signature", ML, sigY + 60);

  pdf.line(ML, sigY + 80, ML + CW / 2 - 20, sigY + 80);
  pdf.text(
    `Printed Name & Title: ${d.fhm_signer.trim() || "__________"}, ${d.fhm_title.trim() || "__________"}`,
    ML,
    sigY + 90
  );

  pdf.line(ML, sigY + 110, ML + CW / 2 - 20, sigY + 110);
  pdf.text("Date", ML, sigY + 120);

  // Right sig — Company
  const rx = ML + CW / 2 + 20;
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...NAVY);
  pdf.text("COMPANY (CLIENT)", rx, sigY);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...MUTED);
  pdf.text("Authorized Officer — signing on behalf of Company", rx, sigY + 12);

  pdf.line(rx, sigY + 50, W - MR, sigY + 50);
  pdf.text("Signature", rx, sigY + 60);

  pdf.line(rx, sigY + 80, W - MR, sigY + 80);
  pdf.text(
    `Printed Name & Title: ${d.officer_name.trim() || "__________"}, ${d.officer_title.trim() || "__________"}`,
    rx,
    sigY + 90
  );

  pdf.line(rx, sigY + 110, W - MR, sigY + 110);
  pdf.text("Date", rx, sigY + 120);

  y = sigY + 150;

  // Broker acknowledgment (if applicable)
  if (d.has_broker === "yes") {
    checkY(120);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...MUTED);
    pdf.text("BROKER ACKNOWLEDGMENT (WITNESS — NOT A PARTY)", ML, y);
    y += 14;
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7.5);
    const brokerNote = pdf.splitTextToSize(
      "The undersigned broker acknowledges having reviewed the fee and retainer terms with the authorized officer prior to execution. This creates no agency relationship between Forhemit and the broker.",
      CW
    );
    pdf.text(brokerNote, ML, y);
    y += brokerNote.length * 10 + 14;

    pdf.setDrawColor(...RULE);
    pdf.line(ML, y, ML + CW / 2, y);
    y += 12;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(...MUTED);
    pdf.text(
      `Broker: ${d.broker_name.trim() || "_______________"}   Firm: ${d.broker_firm.trim() || "_______________"}`,
      ML,
      y
    );
    y += 20;
  }

  // Footer on last page
  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MUTED);
  pdf.text(
    `Generated: ${genDate}  |  deals@forhemit.com  |  forhemit.com`,
    W / 2,
    752,
    { align: "center" }
  );
  pdf.text(
    "CONFIDENTIAL — This document requires wet or electronic signatures before becoming effective.",
    W / 2,
    763,
    { align: "center" }
  );

  /* ── Save ────────────────────────────────────────────────────────────── */
  const companySlug = d.s_company.trim().replace(/\s+/g, "_") || "Company";
  const dateSlug = d.s_date || new Date().toISOString().slice(0, 10);
  pdf.save(`Forhemit_Engagement_Letter_${companySlug}_${dateSlug}.pdf`);
}

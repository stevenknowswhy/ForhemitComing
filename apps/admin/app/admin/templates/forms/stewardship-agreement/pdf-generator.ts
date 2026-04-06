/**
 * Stewardship Agreement — jsPDF-based PDF Generator
 * ──────────────────────────────────────────────────
 * Ported from the legacy forhemit_stewardship_form_REVISED.html generatePDF().
 * Produces a professional multi-page Stewardship Agreement PDF with logical
 * page breaks, cover page, 12 articles, and triple-signature page.
 */

import type { SAData } from "./types";
import { fmtCurrency, calcStewardshipFee } from "./calculations";

/* ── Colours (RGB) ────────────────────────────────────────────────────────── */
const NAVY: [number, number, number] = [27, 42, 74];
const BRASS: [number, number, number] = [154, 117, 64];
const MUTED: [number, number, number] = [122, 112, 104];
const RULE: [number, number, number] = [214, 208, 196];
const INK: [number, number, number] = [28, 21, 16];

/* ── Page geometry ────────────────────────────────────────────────────────── */
const W = 612;
const ML = 72;
const MR = 72;
const CW = W - ML - MR;
const PB = 740; // page bottom limit

export async function generateStewardshipPDF(d: SAData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  let y = 72;

  const fee = calcStewardshipFee(d.ebitda);
  const genDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* ── Helpers ─────────────────────────────────────────────────────────── */
  function rule(yy: number, col: [number, number, number] = RULE, thick = 0.5) {
    pdf.setDrawColor(...col);
    pdf.setLineWidth(thick);
    pdf.line(ML, yy, W - MR, yy);
  }

  function addPage() {
    pdf.addPage();
    y = 72;
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...MUTED);
    pdf.text(
      "FORHEMIT TRANSITION STEWARDSHIP  |  Stewardship Agreement (REVISED)  |  CONFIDENTIAL",
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

  function checkY(n = 60) {
    if (y + n > PB) addPage();
  }

  function block(
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
  ): void {
    const sz = opts.size || 9;
    const font = opts.bold ? "bold" : opts.italic ? "italic" : "normal";
    const col = opts.color || INK;
    pdf.setFontSize(sz);
    pdf.setFont("helvetica", font);
    pdf.setTextColor(...col);
    const lines = pdf.splitTextToSize(text, opts.width || CW);
    const lh = sz * 1.4;
    checkY(lines.length * lh);
    pdf.text(lines, opts.x || ML, y);
    y += lines.length * lh + (opts.after || 0);
  }

  function articleHeading(title: string) {
    checkY(60);
    y += 20;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...NAVY);
    pdf.text(title, ML, y);
    y += 6;
    rule(y, BRASS, 1);
    y += 14;
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

  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...NAVY);
  pdf.text("TRANSITION STEWARDSHIP AGREEMENT", W / 2, y, { align: "center" });
  y += 24;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "italic");
  pdf.setTextColor(...MUTED);
  pdf.text(
    `Post-Close Operational Stewardship  |  ${d.term || "—"}-Month Term  |  REVISED v1.0`,
    W / 2,
    y,
    { align: "center" }
  );
  y += 60;

  rule(y);
  y += 32;

  const coverFields: [string, string][] = [
    ["Company", d.s_company.trim() || "—"],
    ["Engagement Reference", d.s_ref.trim() || "—"],
    ["Closing Date", d.closing_date || "—"],
    ["Agreement Date", d.agreement_date || "—"],
    ["Stewardship Term", d.term ? `${d.term} months` : "—"],
    ["SBA Lender", d.lender_name.trim() || "—"],
    ["ESOP Trustee", d.trustee_name.trim() || "—"],
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
  y += 30;

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "italic");
  pdf.setTextColor(...MUTED);
  pdf.text(
    "This Agreement is disclosed to the SBA lender and ESOP trustee as a disclosed operating expense.",
    W / 2,
    y + 10,
    { align: "center", maxWidth: CW }
  );
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

  /* Article 1 — Parties */
  articleHeading("ARTICLE 1 — PARTIES AND RELATIONSHIP");
  block(
    `This Transition Stewardship Agreement is entered into as of ${d.agreement_date || "__________"} between Forhemit Transition Stewardship, a California public benefit corporation ("Forhemit"), and ${d.s_company.trim() || "__________"} ("Company"). The Company completed a sale to an ESOP on ${d.closing_date || "__________"}.`,
    { after: 10 }
  );
  block(
    `Forhemit is an independent contractor service provider to the Company. Forhemit is NOT: (a) a fiduciary of the ESOP benefit plan; (b) an employee, agent, or manager of the Company; (c) a party to the SBA loan; or (d) responsible for the Company's operations.`,
    { after: 10 }
  );

  /* Article 2 — Term */
  articleHeading("ARTICLE 2 — STEWARDSHIP TERM");
  block(
    `Initial Term: ${d.term || "—"} months commencing on ${d.closing_date || "__________"}.`,
    { after: 8 }
  );
  block(
    `Extension Periods: Months 13–18 and 19–24 may be extended only upon written election by both parties. Either party may decline extension with 45 days' notice.`,
    { after: 8 }
  );

  /* Article 3 — Fee */
  articleHeading("ARTICLE 3 — STEWARDSHIP FEE");
  block(
    `Annual Fee: 2.5% of QofE Adjusted EBITDA of ${fee.ebitda > 0 ? fmtCurrency(fee.ebitda) : "—"} = ${fee.annual > 0 ? fmtCurrency(fee.annual) : "—"} annually (${fee.quarterly > 0 ? fmtCurrency(fee.quarterly) : "—"}/quarter).`,
    { after: 8 }
  );
  block(
    `Fee Schedule: Months 1–6: ${fee.t1 > 0 ? fmtCurrency(fee.t1) : "—"} (60%) | Months 7–12: ${fee.t2 > 0 ? fmtCurrency(fee.t2) : "—"} (20%) | Months 13–18: ${fee.t3 > 0 ? fmtCurrency(fee.t3) : "—"} (10%) | Months 19–24: ${fee.t4 > 0 ? fmtCurrency(fee.t4) : "—"} (10%).`,
    { after: 8 }
  );
  block(
    `Payment Terms: Due within 30 days of invoice. Late payments accrue interest at ${d.late_interest || "1.5% per month"}. Forhemit may suspend services for non-payment after 30 days.`,
    { after: 8 }
  );
  block(
    `Fee Source: Paid from Company operating cash flow. Not paid from ESOP trust assets or SBA loan proceeds.`,
    { after: 8 }
  );

  /* Article 4 — Service Scope */
  articleHeading("ARTICLE 4 — SERVICE SCOPE");
  const activePillars = d.pillars.filter((p) => p.checked);
  block(`Selected Service Pillars (${activePillars.length} of 6):`, { after: 8 });
  activePillars.forEach((p) => {
    checkY(28);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...BRASS);
    pdf.text(`${p.id} — ${p.title}`, ML + 15, y);
    y += 12;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...MUTED);
    const descLines = pdf.splitTextToSize(p.desc, CW - 15);
    pdf.text(descLines, ML + 15, y);
    y += descLines.length * 11 + 6;
  });

  /* Article 5 — Standard of Care */
  articleHeading("ARTICLE 5 — STANDARD OF CARE");
  block(
    `Forhemit shall perform services in a commercially reasonable manner consistent with industry standards. Forhemit exercises no discretionary authority over Company operations and makes no management decisions.`,
    { after: 8 }
  );
  block(
    `No Guarantee of Results: Forhemit does not guarantee or warrant any specific financial results, covenant compliance, ESOP plan performance, or business outcomes.`,
    { after: 8 }
  );

  /* Article 6 — Confidentiality */
  articleHeading("ARTICLE 6 — CONFIDENTIALITY");
  block(
    `Each party shall maintain the confidentiality of the other's confidential information, using at least the same degree of care used to protect its own confidential information. Confidential information includes all business, financial, technical, and operational information.`,
    { after: 8 }
  );
  block(
    `Obligations survive termination for ${d.confidentiality_survival || "3 years"}. Upon termination, each party shall return or destroy the other's confidential information.`,
    { after: 8 }
  );

  /* Article 7 — Lender & Trustee Disclosure */
  articleHeading("ARTICLE 7 — LENDER & TRUSTEE DISCLOSURE");
  block(
    `SBA Lender: ${d.lender_name.trim() || "__________"}${d.lender_rm.trim() ? ` (RM: ${d.lender_rm.trim()})` : ""}.`,
    { after: 8 }
  );
  block(
    `ESOP Trustee: ${d.trustee_name.trim() || "__________"}${d.trustee_contact.trim() ? ` (${d.trustee_contact.trim()})` : ""}.`,
    { after: 8 }
  );
  block(
    `ERISA Status: Forhemit is not a fiduciary within the meaning of ERISA Section 3(21) with respect to the ESOP or its assets.`,
    { after: 8 }
  );
  block(
    `Material Risk (for lender notification): (a) DSCR below 1.25x for two consecutive months; (b) actual or projected covenant breach; (c) loss of key person without qualified successor; or (d) condition that could result in SBA loan acceleration.`,
    { after: 8 }
  );

  /* Article 8 — Termination */
  articleHeading("ARTICLE 8 — TERMINATION");
  block(
    `Termination for Cause: Either party may terminate if the other party: (a) materially breaches and fails to cure within ${d.term_cure_period || "30 days (standard) / 10 days for payment"}; (b) fails to pay when due; (c) becomes insolvent; or (d) engages in fraud.`,
    { after: 8 }
  );
  block(
    `Termination for Convenience: ${d.term_conv_notice || "Company 60 days / Forhemit 90 days"}.`,
    { after: 8 }
  );
  block(
    `Effect of Termination: Company pays all earned fees through termination date (prorated for convenience termination; immediately due for cause termination). Forhemit delivers all work product within 10 days.`,
    { after: 8 }
  );

  /* Article 9 — Limitation of Liability */
  articleHeading("ARTICLE 9 — LIMITATION OF LIABILITY");
  block(
    `Liability Cap: Except for breach of confidentiality, gross negligence, or willful misconduct, Forhemit's total liability shall not exceed ${d.liability_cap || "12 months of fees paid"}.`,
    { after: 8 }
  );
  block(
    `Consequential Damages Waiver: Forhemit shall not be liable for any indirect, special, incidental, punitive, or consequential damages, including lost profits, lost revenue, or damages from ESOP plan disqualification.`,
    { after: 8 }
  );

  /* Article 10 — Indemnification */
  articleHeading("ARTICLE 10 — INDEMNIFICATION");
  block(
    `Company shall indemnify Forhemit from claims arising from: (a) Company's breach; (b) Company's operations; (c) third-party claims relating to Company's business; or (d) allegation of fiduciary advice (except from Forhemit's gross negligence or willful misconduct).`,
    { after: 8 }
  );
  block(
    `Forhemit shall indemnify Company from claims arising from Forhemit's material breach, gross negligence, or willful misconduct.`,
    { after: 8 }
  );

  /* Article 11 — Dispute Resolution */
  articleHeading("ARTICLE 11 — DISPUTE RESOLUTION");
  block(`Governing Law: State of ${d.gov_law.trim() || "__________"}.`, { after: 8 });
  block(
    `Mediation: Disputes submitted to non-binding mediation before AAA in ${d.venue_county.trim() || "[County]"}, ${d.gov_law.trim() || "__________"}. Mediation to conclude within ${d.mediation_timeline || "45 days"}.`,
    { after: 8 }
  );
  block(
    `Arbitration: If unresolved, binding arbitration under ${d.arbitration_rules || "AAA Commercial Arbitration Rules"}. Single arbitrator in ${d.venue_county.trim() || "[County]"}, ${d.gov_law.trim() || "__________"}.`,
    { after: 8 }
  );
  block(
    `Jury Trial Waiver: Parties hereby waive right to trial by jury. Prevailing party entitled to attorney fees.`,
    { after: 8 }
  );

  /* Article 12 — General Provisions */
  articleHeading("ARTICLE 12 — GENERAL PROVISIONS");
  block(
    `Notices: Forhemit — deals@forhemit.com; Company — ${d.company_email.trim() || "__________"}.`,
    { after: 8 }
  );
  block(
    `Amendment: This Agreement may only be amended by written instrument signed by both parties.`,
    { after: 8 }
  );
  block(
    `Assignment: Neither party may assign without consent, except to affiliates or successors in connection with merger or asset sale.`,
    { after: 8 }
  );
  block(
    `Entire Agreement: This Agreement, together with the Engagement Letter, constitutes the entire agreement between the parties.`,
    { after: 8 }
  );
  block(
    `Severability: If any provision is held invalid, the remaining provisions continue in full force.`,
    { after: 8 }
  );
  block(
    `Force Majeure: Neither party liable for delay beyond reasonable control. Fee prorated during events extending beyond 30 days.`,
    { after: 8 }
  );

  if (d.special_terms.trim()) {
    block(`Special Terms: ${d.special_terms.trim()}`, { after: 8 });
  }

  /* ══════════════════════════════════════════════════════════════════════ */
  /*  SIGNATURE PAGE                                                      */
  /* ══════════════════════════════════════════════════════════════════════ */

  addPage();
  y += 10;
  rule(y);
  y += 32;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...NAVY);
  pdf.text("SIGNATURES", ML, y);
  y += 24;

  const sy = y;

  // Forhemit
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...NAVY);
  pdf.text("FORHEMIT TRANSITION STEWARDSHIP", ML, sy);
  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MUTED);
  pdf.text("California Public Benefit Corporation", ML, sy + 12);
  pdf.setDrawColor(...RULE);
  pdf.setLineWidth(0.5);
  pdf.line(ML, sy + 50, ML + CW / 2 - 20, sy + 50);
  pdf.text("Signature", ML, sy + 60);
  pdf.line(ML, sy + 80, ML + CW / 2 - 20, sy + 80);
  pdf.text(
    `Printed Name & Title: ${d.fhm_signer.trim() || "__________"}, ${d.fhm_title.trim() || "__________"}`,
    ML,
    sy + 90
  );
  pdf.line(ML, sy + 110, ML + CW / 2 - 20, sy + 110);
  pdf.text("Date", ML, sy + 120);

  // Company
  const rx = ML + CW / 2 + 20;
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...NAVY);
  pdf.text("COMPANY (CLIENT)", rx, sy);
  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MUTED);
  pdf.text("Authorized Officer — signing on behalf of Company", rx, sy + 12);
  pdf.line(rx, sy + 50, W - MR, sy + 50);
  pdf.text("Signature", rx, sy + 60);
  pdf.line(rx, sy + 80, W - MR, sy + 80);
  pdf.text(
    `Printed Name & Title: ${d.post_officer.trim() || "__________"}`,
    rx,
    sy + 90
  );
  pdf.line(rx, sy + 110, W - MR, sy + 110);
  pdf.text("Date", rx, sy + 120);

  // Trustee acknowledgment
  y = sy + 160;
  checkY(100);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...MUTED);
  pdf.text("ESOP TRUSTEE — ACKNOWLEDGMENT ONLY (NOT A PARTY)", ML, y);
  y += 14;
  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "italic");
  pdf.setTextColor(...MUTED);
  const trusteeNote = pdf.splitTextToSize(
    `${d.trustee_name.trim() || "__________"}: acknowledges receipt of this Agreement and the ERISA Section 408(b)(2) disclosure from Forhemit.`,
    CW
  );
  pdf.text(trusteeNote, ML, y);
  y += trusteeNote.length * 10 + 14;

  pdf.setDrawColor(...RULE);
  pdf.line(ML, y + 30, ML + CW / 2, y + 30);
  y += 40;
  pdf.setFont("helvetica", "normal");
  pdf.text("Trustee Signature", ML, y);
  pdf.text("Date", ML + 300, y);

  // Footer
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
    "REVISED v1.0 — CONFIDENTIAL — Requires wet or electronic signatures before becoming effective.",
    W / 2,
    763,
    { align: "center" }
  );

  /* ── Save ────────────────────────────────────────────────────────────── */
  const slug = d.s_company.trim().replace(/\s+/g, "_") || "Company";
  const dateSlug = d.closing_date || new Date().toISOString().slice(0, 10);
  pdf.save(`Forhemit_Stewardship_Agreement_REVISED_${slug}_${dateSlug}.pdf`);
}

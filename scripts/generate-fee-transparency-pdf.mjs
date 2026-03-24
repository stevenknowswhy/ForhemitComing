/**
 * Regenerates public/downloads/Forhemit-ESOP-Fee-Transparency.pdf
 * Run: node scripts/generate-fee-transparency-pdf.mjs
 * Keep content aligned with app/four-month-path/lib/feeData.ts
 *
 * Design tokens (Executive Manuscript):
 *   Canvas #F9F7F2 · Parchment #F0EBE3 · Ink #1A1A1A · Stone #5A5A5A
 *   Sage #2C3E2D · Sage-light #A8C3A8 · Sage-muted #C5CEBD
 *   Alert-clay #B87D5E · Border-light #E0D9D0
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { jsPDF } from "jspdf";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(
  __dirname,
  "../public/downloads/Forhemit-ESOP-Fee-Transparency.pdf"
);

/* ── colour helpers ── */
const hex = (h) => {
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return [r, g, b];
};

const C = {
  canvas: hex("#F9F7F2"),
  parchment: hex("#F0EBE3"),
  ink: hex("#1A1A1A"),
  stone: hex("#5A5A5A"),
  stoneLt: hex("#7A7A7A"),
  sage: hex("#2C3E2D"),
  sageLt: hex("#A8C3A8"),
  sageMuted: hex("#C5CEBD"),
  clay: hex("#B87D5E"),
  borderLt: hex("#E0D9D0"),
  white: [255, 255, 255],
};

const TAG_COLORS = {
  Universal: { bg: hex("#EBF2EB"), text: hex("#2C3E2D") },
  "ESOP Only": { bg: hex("#FFF4EB"), text: hex("#B87D5E") },
  Varies: { bg: hex("#F0EBE3"), text: hex("#5A5A5A") },
};

/* ── data (mirrors feeData.ts) ── */
const PHASES = [
  {
    label: "Within the first 30 days",
    subtitle:
      "Feasibility & initial engagement — low commitment, high information",
    rows: [
      {
        name: "Feasibility Study + Preliminary Valuation",
        range: "$10k – $40k",
        tag: "Universal",
        note: "Non-binding range estimate done before any commitment. Directly reusable in an M&A marketing process (CIM, buyer discussions).",
      },
      {
        name: "ESOP Advisor / Quarterback — initial engagement",
        range: "$15k – $50k",
        tag: "Universal",
        note: "Coordinates the full transaction. If running a dual-track process (ESOP + private buyer in parallel), success fees can be structured so M&A and ESOP portions are credited against each other.",
      },
    ],
  },
  {
    label: "Days 31 – 60",
    subtitle: "LOI stage, bank engagement & legal kick-off",
    rows: [
      {
        name: "Quality of Earnings (QofE) + Financial Due Diligence",
        range: "$20k – $50k",
        tag: "Universal",
        note: "Required by both lenders and ESOP trustees. 100% reusable if the deal moves to a private buyer.",
      },
      {
        name: "Company Corporate Attorney",
        range: "$20k – $50k",
        tag: "Universal",
        note: "Sale agreement drafting, data room setup, governance cleanup. Work product transfers directly to any buyer.",
      },
      {
        name: "Independent Transaction Appraisal (FMV)",
        range: "$15k – $35k",
        tag: "ESOP Only",
        note: "Commissioned by the ESOP trustee as a fiduciary requirement. Not required in a private sale.",
      },
      {
        name: "ERISA / ESOP Specialist Attorney",
        range: "$30k – $75k",
        tag: "ESOP Only",
        note: "Drafts the ESOP plan, trust documents, and fiduciary process agreements. Critical for DOL compliance.",
      },
    ],
  },
  {
    label: "Days 61 – 120 (through closing)",
    subtitle: "Trustee engagement, final approvals & close",
    rows: [
      {
        name: "Independent ESOP Trustee + Trustee's Separate Counsel",
        range: "$35k – $130k",
        tag: "ESOP Only",
        note: "Trustee must independently approve price and terms on behalf of employees. Institutional trustees are standard for leveraged deals. Trustee's own attorney adds $10k–$30k.",
      },
      {
        name: "Third-Party Administrator (TPA) — setup + first year",
        range: "$10k – $25k",
        tag: "ESOP Only",
        note: "Sets up participant accounts, vesting schedules, Form 5500 filing, and repurchase obligation modeling. Ongoing annual cost of $20k–$40k begins in Year 2.",
      },
      {
        name: "Other: financing fees, SBA packaging, escrow, misc.",
        range: "$10k – $50k",
        tag: "Varies",
        note: "Bank commitment fees, legal opinions, SBA 7(a) packaging (if used), escrow, and miscellaneous closing costs.",
      },
    ],
  },
];

/* ── page setup ── */
const doc = new jsPDF({ unit: "pt", format: "letter" });
const PW = doc.internal.pageSize.getWidth(); // 612
const PH = doc.internal.pageSize.getHeight(); // 792
const ML = 54;
const MR = 54;
const MT = 54;
const MB = 60;
const CW = PW - ML - MR; // 504

let y = MT;
let pageNum = 1;

/* ── drawing primitives ── */

function setColor(c) {
  doc.setTextColor(...c);
}
function setFill(c) {
  doc.setFillColor(...c);
}
function setDraw(c) {
  doc.setDrawColor(...c);
}

function pageFooter() {
  const footY = PH - 28;
  setDraw(C.borderLt);
  doc.setLineWidth(0.5);
  doc.line(ML, footY - 10, PW - MR, footY - 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setColor(C.stoneLt);
  doc.text("forhemit.com", ML, footY);
  doc.text(
    "Approximation only — not a quote, commitment, or legal advice.",
    PW / 2,
    footY,
    { align: "center" }
  );
  doc.text(`${pageNum}`, PW - MR, footY, { align: "right" });
}

function pageBg() {
  setFill(C.canvas);
  doc.rect(0, 0, PW, PH, "F");
}

function newPage() {
  pageFooter();
  doc.addPage();
  pageNum++;
  y = MT;
  pageBg();
}

function ensureSpace(pts) {
  if (y + pts > PH - MB) {
    newPage();
  }
}

function hline(color = C.borderLt, inset = 0) {
  setDraw(color);
  doc.setLineWidth(0.5);
  doc.line(ML + inset, y, PW - MR - inset, y);
  y += 6;
}

function gap(pts) {
  y += pts;
}

/* ── wrapped text helper ── */
function wrappedText(
  str,
  {
    font = "helvetica",
    style = "normal",
    size = 9.5,
    color = C.ink,
    x = ML,
    maxW = CW,
    lineHeight = 1.45,
  } = {}
) {
  doc.setFont(font, style);
  doc.setFontSize(size);
  setColor(color);
  const lines = doc.splitTextToSize(str, maxW);
  const lh = size * lineHeight;
  ensureSpace(lines.length * lh);
  for (const line of lines) {
    doc.text(line, x, y);
    y += lh;
  }
}

/* ── tag badge ── */
function drawTag(tag, tx, ty) {
  const tc = TAG_COLORS[tag] || TAG_COLORS.Varies;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  const tw = doc.getTextWidth(tag) + 10;
  const th = 12;
  setFill(tc.bg);
  doc.roundedRect(tx, ty - th + 3, tw, th, 2, 2, "F");
  setColor(tc.text);
  doc.text(tag, tx + 5, ty);
}

/* ── fee row ── */
function drawFeeRow(row, isLast) {
  const indent = ML + 12;
  const noteIndent = ML + 16;
  const noteMaxW = CW - 28;

  doc.setFont("times", "bold");
  doc.setFontSize(10);
  const nameLines = doc.splitTextToSize(row.name, CW * 0.58);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const noteLines = doc.splitTextToSize(row.note, noteMaxW);

  const rowH =
    nameLines.length * 13 + 18 + noteLines.length * 11 + (isLast ? 6 : 16);
  ensureSpace(rowH);

  // Fee name
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  setColor(C.ink);
  for (const nl of nameLines) {
    doc.text(nl, indent, y);
    y += 13;
  }
  gap(2);

  // Range + tag
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setColor(C.sage);
  doc.text(row.range, indent, y);
  const rangeW = doc.getTextWidth(row.range);
  drawTag(row.tag, indent + rangeW + 10, y);
  y += 16;

  // Note
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setColor(C.stone);
  for (const nl of noteLines) {
    doc.text(nl, noteIndent, y);
    y += 11;
  }

  if (!isLast) {
    gap(6);
    setDraw(C.borderLt);
    doc.setLineWidth(0.25);
    doc.line(indent, y, PW - MR - 12, y);
    gap(10);
  } else {
    gap(6);
  }
}

/* ── phase section ── */
function drawPhase(phase) {
  ensureSpace(90);

  // Header band
  setFill(C.sage);
  doc.roundedRect(ML, y, CW, 34, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  setColor(C.white);
  doc.text(phase.label.toUpperCase(), ML + 14, y + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setColor(C.sageLt);
  doc.text(phase.subtitle, ML + 14, y + 26);

  y += 44;

  for (let i = 0; i < phase.rows.length; i++) {
    drawFeeRow(phase.rows[i], i === phase.rows.length - 1);
  }
  gap(10);
}

/* ── totals box ── */
function drawTotals() {
  const boxH = 104;
  ensureSpace(boxH + 8);

  setDraw(C.sage);
  doc.setLineWidth(1);
  setFill(C.parchment);
  doc.roundedRect(ML, y, CW, boxH, 4, 4, "FD");

  const bx = ML + 20;
  const savedY = y;
  y += 24;

  doc.setFont("times", "bold");
  doc.setFontSize(13);
  setColor(C.ink);
  doc.text("Total setup + Year 1", bx, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  setColor(C.sage);
  doc.text("$150,000 – $400,000+", PW - MR - 20, y, { align: "right" });
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setColor(C.stone);
  const typLabel = "Most common in the $3M–$15M EBITDA range: ";
  doc.text(typLabel, bx, y);
  doc.setFont("helvetica", "bold");
  setColor(C.ink);
  doc.text("$200,000 – $350,000", bx + doc.getTextWidth(typLabel), y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setColor(C.stone);
  const noteLines = doc.splitTextToSize(
    "All fees are borne by the company (or financed through the ESOP loan) — not paid personally by the seller. Annual ongoing post-close (Years 2+): roughly $20k–$60k (TPA + annual valuation + compliance).",
    CW - 40
  );
  for (const l of noteLines) {
    doc.text(l, bx, y);
    y += 10.5;
  }

  y = savedY + boxH + 16;
}

/* ── dual-track card ── */
function drawDualTrackCard(label, labelColor, bgColor, borderColor, bodyText) {
  const pad = 14;
  const innerW = CW - pad * 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  const labelW = doc.getTextWidth(label);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const bodyLines = doc.splitTextToSize(bodyText, innerW);
  const bodyH = bodyLines.length * 11.5;
  const cardH = 16 + bodyH + pad + 4;

  ensureSpace(cardH + 8);

  // Card background + border
  setFill(bgColor);
  setDraw(borderColor);
  doc.setLineWidth(0.75);
  doc.roundedRect(ML, y, CW, cardH, 3, 3, "FD");

  // Left accent bar
  setFill(borderColor);
  doc.rect(ML, y, 4, cardH, "F");

  // Label
  const labelY = y + pad;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setColor(labelColor);
  doc.text(label, ML + pad + 4, labelY);

  // Body
  let ty = labelY + 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setColor(C.stone);
  for (const bl of bodyLines) {
    doc.text(bl, ML + pad + 4, ty);
    ty += 11.5;
  }

  y += cardH + 8;
}

function drawDualTrack() {
  // Section heading — use same sage band style as phases for consistency
  ensureSpace(44 + 60);

  setFill(C.sage);
  doc.roundedRect(ML, y, CW, 34, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  setColor(C.white);
  doc.text(
    "DUAL-TRACK ANALYSIS: ESOP + PRIVATE BUYER IN PARALLEL",
    ML + 14,
    y + 14
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setColor(C.sageLt);
  doc.text(
    "What happens to fees if you pursue both paths simultaneously",
    ML + 14,
    y + 26
  );

  y += 44;

  // Universal card
  drawDualTrackCard(
    "UNIVERSAL FEES — NO DOUBLE-SPEND",
    C.sage,
    hex("#F2F7F2"),
    C.sage,
    "Feasibility study, QofE, corporate legal work, and data room costs are 80–100% reusable regardless of which path closes. No double-spend."
  );

  // ESOP-specific card
  drawDualTrackCard(
    "ESOP-SPECIFIC FEES — SUNK IF M&A WINS",
    C.clay,
    hex("#FFFAF5"),
    C.clay,
    "If a private buyer wins the deal, ESOP-specific costs (trustee, FMV appraisal, ERISA attorney, TPA) are not recovered. Estimate $75k–$200k in sunk costs — but M&A broker success fees alone (1–3%+ of enterprise value) frequently exceed the entire ESOP setup cost. Having an active ESOP track is insurance: if a private buyer walks away at the last minute, you have a fully-developed closing option ready. It also strengthens your negotiating position — buyers know you have a credible, funded alternative."
  );

  // Real-world data card
  drawDualTrackCard(
    "REAL-WORLD DATA POINT",
    C.ink,
    C.parchment,
    C.borderLt,
    "One dual-track case (PCE Companies) showed the ESOP path delivered 89% of the after-tax value of a rejected strategic offer — while avoiding broker fees and capital gains tax."
  );
}

/* ── legend row ── */
function drawLegend() {
  ensureSpace(36);
  const tags = ["Universal", "ESOP Only", "Varies"];
  const descs = [
    "Applies to any sale. Work product is reusable.",
    "Required only for an ESOP transaction.",
    "Both paths; amount depends on financing.",
  ];
  let lx = ML;
  for (let i = 0; i < tags.length; i++) {
    drawTag(tags[i], lx, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    const tw = doc.getTextWidth(tags[i]) + 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    setColor(C.stone);
    doc.text(descs[i], lx + tw, y);
    lx += tw + doc.getTextWidth(descs[i]) + 16;
  }
  y += 18;
}

/* ═══════════════════════════════════════════════
   BUILD THE PDF
   ═══════════════════════════════════════════════ */

// Page 1 background + header stripe
pageBg();
setFill(C.sage);
doc.rect(0, 0, PW, 6, "F");
gap(12);

// Title block
doc.setFont("times", "bold");
doc.setFontSize(22);
setColor(C.ink);
doc.text("ESOP Transaction Fee Guide", ML, y);
y += 14;

doc.setFont("helvetica", "normal");
doc.setFontSize(9);
setColor(C.stone);
doc.text(
  "Approximate costs for a leveraged ESOP in the $3M–$15M EBITDA range",
  ML,
  y
);
y += 10;

doc.setFont("helvetica", "normal");
doc.setFontSize(7.5);
setColor(C.stoneLt);
doc.text("Prepared by Forhemit  |  forhemit.com", ML, y);

const dateStr = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
doc.text(dateStr, PW - MR, y, { align: "right" });
y += 18;

hline(C.sage);
gap(6);

// Disclaimer box
setFill(C.parchment);
setDraw(C.borderLt);
doc.setLineWidth(0.5);
const disclaimerText =
  "Approximation only. These figures are illustrative estimates based on NCEO 2024 industry benchmarks for leveraged ESOP transactions in the $3M–$15M EBITDA range. They are not a quote, commitment, or legal advice. Actual costs vary by deal complexity, team experience, and timeline. Always obtain written proposals from NCEO/ESOP Association-listed providers and consult qualified legal and tax counsel.";
doc.setFont("helvetica", "normal");
doc.setFontSize(8);
const dLines = doc.splitTextToSize(disclaimerText, CW - 28);
const dBoxH = dLines.length * 10.5 + 20;
doc.roundedRect(ML, y, CW, dBoxH, 3, 3, "FD");
setColor(C.stone);
let dy = y + 14;
for (const dl of dLines) {
  doc.text(dl, ML + 14, dy);
  dy += 10.5;
}
y += dBoxH + 16;

// Context heading + body
wrappedText("Every business sale has transaction costs", {
  font: "times",
  style: "bold",
  size: 13,
  color: C.ink,
});
gap(6);
wrappedText(
  "Whether you sell to a private buyer or through an ESOP, there are fees — attorneys, appraisers, advisors, and due diligence. We believe sellers deserve full transparency before committing to any path. The breakdown below shows what to expect, when to expect it, and whether each cost is ESOP-specific or applies to any sale.",
  { size: 9, color: C.stone, lineHeight: 1.5 }
);
gap(12);

// Legend
drawLegend();
gap(4);
hline(C.borderLt);
gap(8);

// Phases
for (const phase of PHASES) {
  drawPhase(phase);
}

// Totals
drawTotals();

// Dual-track
drawDualTrack();

// Final disclaimer
gap(6);
hline(C.sage);
gap(6);
wrappedText(
  "Ranges are current as of 2026 and sourced from NCEO transaction surveys (237 responses, 2014–2023 data). Figures represent the company's costs, not personal seller expenses. This is not legal or financial advice. Consult your attorney, CPA, and a licensed ESOP advisor before making any decisions.",
  { size: 7.5, color: C.stoneLt, lineHeight: 1.5 }
);

// Final page footer
pageFooter();

/* ── write to disk ── */
const buf = Buffer.from(doc.output("arraybuffer"));
writeFileSync(outPath, buf);
console.log("Wrote", outPath, `(${pageNum} page${pageNum > 1 ? "s" : ""})`);

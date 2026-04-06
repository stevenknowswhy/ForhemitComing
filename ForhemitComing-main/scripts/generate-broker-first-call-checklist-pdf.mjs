/**
 * Regenerates public/downloads/Forhemit-Broker-First-Call-Checklist.pdf
 * Run: node scripts/generate-broker-first-call-checklist-pdf.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { jsPDF } from "jspdf";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(
  __dirname,
  "../public/downloads/Forhemit-Broker-First-Call-Checklist.pdf"
);

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

const C = {
  canvas: hex("#F9F7F2"),
  card: hex("#FFFFFF"),
  ink: hex("#1A1A1A"),
  muted: hex("#5A5A5A"),
  mutedLight: hex("#7A7A7A"),
  brand: hex("#1E3A5F"),
  brandSoft: hex("#E8EEF5"),
  border: hex("#D7DFE8"),
  success: hex("#2F5D3A"),
};

const doc = new jsPDF({ unit: "pt", format: "letter" });
const PW = doc.internal.pageSize.getWidth();
const PH = doc.internal.pageSize.getHeight();
const ML = 54;
const MR = 54;
const MT = 54;
const MB = 54;
const CW = PW - ML - MR;
let y = MT;

const sections = [
  {
    title: "Business Snapshot",
    items: [
      "Company name, state, and legal entity (S-Corp / C-Corp).",
      "Approximate revenue and EBITDA (or net income) for the last 2 years.",
      "Current asking range and latest stage of your buyer process.",
      "Any known concentration risk (customer, supplier, owner dependence).",
    ],
  },
  {
    title: "Ownership and Team",
    items: [
      "Current cap table summary (who owns what today).",
      "Seller transition posture (full exit, phased transition, or advisory role).",
      "Approximate full-time employee count and leadership bench.",
      "Who can represent finance/operations on follow-up calls (owner, CFO, controller).",
    ],
  },
  {
    title: "Financial and Process Readiness",
    items: [
      "Most recent P&L and balance sheet (high-level is fine for first call).",
      "Debt summary (existing notes, LOCs, SBA obligations if any).",
      "Status of quality of earnings work or data room materials.",
      "Timeline constraints (LOI windows, exclusivity periods, seller deadlines).",
    ],
  },
  {
    title: "Broker Coordination",
    items: [
      "Broker of record and NDA path (existing NDA or tri-party intro path).",
      "Preferred communication cadence (weekly checkpoint vs milestone-only updates).",
      "How you want private buyer process updates coordinated with the ESOP track.",
      "Decision-maker for go/no-go after the first qualification call.",
    ],
  },
];

function setColor(c) {
  doc.setTextColor(...c);
}

function setDraw(c) {
  doc.setDrawColor(...c);
}

function setFill(c) {
  doc.setFillColor(...c);
}

function footer() {
  const footY = PH - 26;
  setDraw(C.border);
  doc.setLineWidth(0.5);
  doc.line(ML, footY - 10, PW - MR, footY - 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setColor(C.mutedLight);
  doc.text("forhemit.com", ML, footY);
  doc.text("Open in browser and print for your call packet", PW / 2, footY, { align: "center" });
  doc.text(new Date().toLocaleDateString("en-US"), PW - MR, footY, { align: "right" });
}

function ensureSpace(height) {
  if (y + height <= PH - MB) return;
  footer();
  doc.addPage();
  y = MT;
  drawPageChrome(false);
}

function wrapped(str, x, maxW, opts = {}) {
  const {
    font = "helvetica",
    style = "normal",
    size = 9.5,
    color = C.ink,
    lineHeight = 1.45,
  } = opts;
  doc.setFont(font, style);
  doc.setFontSize(size);
  setColor(color);
  const lines = doc.splitTextToSize(str, maxW);
  const lh = size * lineHeight;
  for (const line of lines) {
    doc.text(line, x, y);
    y += lh;
  }
}

function drawPageChrome(firstPage) {
  setFill(C.canvas);
  doc.rect(0, 0, PW, PH, "F");

  setFill(C.brand);
  doc.rect(0, 0, PW, 7, "F");

  if (firstPage) {
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    setColor(C.ink);
    doc.text("Broker First Call Preparation Checklist", ML, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    setColor(C.muted);
    doc.text(
      "Forhemit dual-track ESOP intake: concise prep list for brokers and owners before the first call.",
      ML,
      y
    );
    y += 11;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(C.mutedLight);
    doc.text("Prepared by Forhemit", ML, y);
    doc.text("Confidential working checklist", PW - MR, y, { align: "right" });
    y += 14;

    setDraw(C.border);
    doc.setLineWidth(0.8);
    doc.line(ML, y, PW - MR, y);
    y += 14;

    setFill(C.brandSoft);
    setDraw(C.border);
    doc.roundedRect(ML, y, CW, 50, 4, 4, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setColor(C.brand);
    doc.text("How to use this", ML + 12, y + 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setColor(C.muted);
    const guidance =
      "Complete what you can before the first call. Unknown items are fine; we use the call to close gaps quickly and determine fit.";
    const lines = doc.splitTextToSize(guidance, CW - 24);
    let gy = y + 30;
    for (const line of lines) {
      doc.text(line, ML + 12, gy);
      gy += 10.5;
    }
    y += 66;
  }
}

function drawSection(section) {
  const titleH = 22;
  const itemHeightEstimate = section.items.length * 21 + 16;
  ensureSpace(titleH + itemHeightEstimate + 16);

  setFill(C.card);
  setDraw(C.border);
  doc.setLineWidth(0.8);
  doc.roundedRect(ML, y, CW, titleH + itemHeightEstimate, 5, 5, "FD");

  setFill(C.brand);
  doc.rect(ML, y, CW, titleH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setColor([255, 255, 255]);
  doc.text(section.title, ML + 12, y + 14.5);

  y += titleH + 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setColor(C.ink);

  section.items.forEach((item) => {
    setDraw(C.mutedLight);
    doc.setLineWidth(1);
    doc.roundedRect(ML + 12, y - 7, 8, 8, 1.5, 1.5, "S");
    wrapped(item, ML + 26, CW - 38, { size: 9, color: C.ink, lineHeight: 1.4 });
    y += 6;
  });

  y += 8;
}

drawPageChrome(true);

for (const section of sections) {
  drawSection(section);
}

ensureSpace(84);
setFill(hex("#EEF4EE"));
setDraw(hex("#CDE0D0"));
doc.roundedRect(ML, y, CW, 66, 4, 4, "FD");
doc.setFont("helvetica", "bold");
doc.setFontSize(8);
setColor(C.success);
doc.text("First call output target", ML + 12, y + 16);
doc.setFont("helvetica", "normal");
doc.setFontSize(8.7);
setColor(C.muted);
const outLines = doc.splitTextToSize(
  "By call end, we should have a clear go / no-go on dual-track fit, a list of missing diligence items, and the owner + broker next-step timeline.",
  CW - 24
);
let oy = y + 31;
for (const line of outLines) {
  doc.text(line, ML + 12, oy);
  oy += 10.5;
}

footer();

const buf = Buffer.from(doc.output("arraybuffer"));
writeFileSync(outPath, buf);
console.log("Wrote", outPath);

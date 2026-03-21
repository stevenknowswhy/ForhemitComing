import { DealInputs, CalculatedValues, DSCRResult } from "../types";
import { OPEN_ITEM_DEFINITIONS, TARGET_DSCR } from "../constants";
import { fmt, fmtPct, fmtX } from "./formatters";

// ── CREDIT MEMO GENERATION ───────────────────────────────────────────────────

export interface CreditMemoOptions {
  inputs: DealInputs;
  calculated: CalculatedValues;
  dscr: DSCRResult;
  activeEbitda: number;
}

export function generateCreditMemo(options: CreditMemoOptions): string {
  const { inputs, calculated, dscr, activeEbitda } = options;
  const { business, financial, capital, lenderNotes } = inputs;
  const { purchasePrice, ebitda, actualClosingCosts, workingCapital, workingCapitalPct } = financial;
  const { sbaAmount, sellerNote, standbyMode } = capital;

  const resolvedCount = inputs.openItems.filter((i) => i.resolved).length;
  const unresolvedItems = inputs.openItems
    .filter((i) => !i.resolved)
    .map((i) => i.title);

  const stressedEbitda = activeEbitda * 0.9;
  const stressedDscr =
    dscr.totalDS > 0 ? stressedEbitda / dscr.totalDS : 0;

  // FIXED: Show business type (including "Other" text if applicable)
  const businessTypeDisplay =
    business.type === "Other" && business.typeOther
      ? `Other: ${business.typeOther}`
      : business.type || "N/A";

  // FIXED: Seller note structure label only shown when seller note > 0
  const snStructureLabel =
    sellerNote > 0
      ? standbyMode === "full"
        ? "Full standby — $0 debt service (SOP 50 10 8)"
        : "Active payment — interest-only at 6% p.a."
      : "N/A (no seller note)";

  const lines: string[] = [
    "ILLUSTRATIVE CREDIT MEMO PREVIEW",
    "Prepared by Forhemit Stewardship Management Co. — Transaction Manager & Post-Close Stewardship Provider",
    "Forhemit is not the buyer, holds no equity, and does not appear in the capital structure.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "1. TRANSACTION SUMMARY",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `Business:              ${business.name || "Target Company"}`,
    `Type:                  ${businessTypeDisplay}`,
    `State:                 ${business.state || "N/A"}`,
    `Employees:             ${business.employeeCount || "N/A"}`,
    "Transaction type:      100% ESOP acquisition",
    `Purchase price:        ${fmt(purchasePrice)}`,
    `TTM EBITDA:            ${fmt(ebitda)}`,
    `Implied multiple:      ${purchasePrice && ebitda ? fmtX(purchasePrice / ebitda) : "N/A"}`,
    `Total project cost:    ${fmt(calculated.totalProjectCost)}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "2. SOURCES & USES",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "USES",
    `  Purchase price:                  ${fmt(purchasePrice)}`,
    `  Actual closing costs:            ${fmt(actualClosingCosts)}`,
    `  Working capital reserve (${workingCapitalPct}%): ${fmt(workingCapital)}`,
    `  Total uses:                      ${fmt(calculated.totalProjectCost)}`,
    "",
    "SOURCES",
    `  SBA 7(a) senior debt:            ${fmt(sbaAmount)}  (${
      calculated.totalProjectCost > 0
        ? fmtPct((sbaAmount / calculated.totalProjectCost) * 100)
        : "—"
    })`,
    ...(sellerNote > 0 ? [
      `  Seller note:                     ${fmt(sellerNote)}  (${
        calculated.totalProjectCost > 0
          ? fmtPct((sellerNote / calculated.totalProjectCost) * 100)
          : "—"
      })`,
      `    Structure:                     ${snStructureLabel}`,
    ] : []),
    `  ESOP leveraged loan (TBD):       ${fmt(calculated.esopLoan)}  (${
      calculated.totalProjectCost > 0
        ? fmtPct((calculated.esopLoan / calculated.totalProjectCost) * 100)
        : "—"
    })`,
    `  Total sources:                   ${fmt(calculated.totalProjectCost)}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "3. LOAN ASSUMPTIONS",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `  SBA 7(a):   ${dscr.sbaRate.toFixed(2)}% / ${inputs.dscr.loanTerm}-year fully amortizing`,
    `  ESOP loan:  ${dscr.esopRate.toFixed(2)}% / ${dscr.esopTerm}-year fully amortizing (indicative)`,
    `  SBA guaranty fee (est.):  ${fmt(calculated.guarantyFee)} (${
      sbaAmount > 0 ? fmtPct((calculated.guarantyFee / sbaAmount) * 100) : "—"
    } of loan amount)`,
    `    Fee basis: 75% guaranteed portion × applicable rate per FY2026 SBA fee schedule`,
    `  All rate and term assumptions are illustrative. Confirm with lenders.`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `4. DSCR ANALYSIS (${
      inputs.dscr.scenario === "B" ? "Scenario B — QofE-adjusted" : "Scenario A — Base case"
    })`,
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `EBITDA (basis):        ${fmt(activeEbitda)}`,
    `SBA debt service:      ${fmt(dscr.sbaDS)}`,
    `ESOP loan service:     ${fmt(dscr.esopDS)}`,
    ...(sellerNote > 0 ? [`Seller note service:   ${dscr.snDS === 0 ? "$0 (full standby)" : fmt(dscr.snDS) + " (active, int.-only at 6%)"}`] : []),
    `Total debt service:    ${fmt(dscr.totalDS)}`,
    "",
    "PRIMARY DSCR (EBITDA basis — SBA standard metric):",
    `  EBITDA DSCR:         ${fmtX(dscr.dscrEbitda)}  [${
      dscr.dscrEbitda >= TARGET_DSCR ? "PASS — above 1.25x SBA minimum" : "FAIL — below 1.25x SBA minimum"
    }]`,
    `  Formula: EBITDA ÷ total annual debt service (pre-tax, pre-D&A)`,
    "",
    "SUPPLEMENTAL DSCR (OCF basis):",
    `  OCF DSCR:            ${fmtX(dscr.dscrOcf)} (after ${dscr.taxRate}% effective tax rate)`,
    `  Formula: EBITDA × (1 − tax rate) ÷ total annual debt service`,
    "",
    "Stress test (10% EBITDA decline):",
    `  Stressed EBITDA:     ${fmt(stressedEbitda)}`,
    `  Stressed DSCR:       ${fmtX(stressedDscr)}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "5. SBA POLICY COMPLIANCE",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ...(sellerNote > 0 && standbyMode === "full"
      ? ["  SOP 50 10 8: Seller note on full standby counted as equity injection."]
      : ["  Seller note on active payment — not eligible for equity injection treatment."]),
    "  ESOP acquisition requirements governed by SBA SOP 50 10 8, Section B.",
    "  SBA maximum loan amount: $5,000,000.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "6. FORHEMIT — ROLE & STEWARDSHIP",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "  Forhemit Stewardship Management Co. is a California Public Benefit Corporation.",
    "  Role: Transaction manager and post-close operational stewardship provider.",
    "  Forhemit has no equity position, no capital at risk, and does not appear",
    "  in sources & uses. Revenue model: structuring fees + ongoing retainer.",
    "",
    "  Differentiation: COOP-based stewardship standard derived from municipal",
    "  disaster preparedness methodology. All transactions require a documented",
    "  business continuity plan as a condition of Forhemit engagement.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "7. OPEN ITEMS & CONDITIONS PRECEDENT",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `  Resolved (${resolvedCount}/5):`
  ];

  inputs.openItems.forEach((item, i) => {
    lines.push(`  [${item.resolved ? "✓" : " "}] ${item.title}`);
  });

  if (unresolvedItems.length > 0) {
    lines.push(
      "",
      "  FLAGGED — must be resolved before lender submission:",
      ...unresolvedItems.map((x) => `  • ${x}`),
      ""
    );
  } else {
    lines.push("", "  All conditions precedent resolved.", "");
  }

  if (lenderNotes) {
    lines.push(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "8. ADDITIONAL NOTES",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      lenderNotes,
      ""
    );
  }

  lines.push(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "DISCLAIMER: Illustrative only. Not a commitment to lend. All rate and term",
    "assumptions must be confirmed with the applicable lenders. Subject to full",
    "credit underwriting, QofE, SBA lender approval, and legal review.",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  );

  return lines.join("\n");
}

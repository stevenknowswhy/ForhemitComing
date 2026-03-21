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
  const { purchasePrice, ebitda } = financial;
  const { sbaAmount, sellerNote, standbyMode } = capital;

  const resolvedCount = inputs.openItems.filter((i) => i.resolved).length;
  const unresolvedItems = inputs.openItems
    .filter((i) => !i.resolved)
    .map((i) => i.title);

  const stressedEbitda = activeEbitda * 0.9;
  const stressedDscr =
    dscr.totalDS > 0 ? stressedEbitda / dscr.totalDS : 0;

  const lines: string[] = [
    "ILLUSTRATIVE CREDIT MEMO PREVIEW",
    "Prepared by Forhemit Stewardship Management Co. — Transaction Manager & Post-Close Stewardship Provider",
    "Forhemit is not the buyer, holds no equity, and does not appear in the capital structure.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "1. TRANSACTION SUMMARY",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `Business:              ${business.name || "Target Company"}`,
    `Type:                  ${business.type || "N/A"}`,
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
    `  Closing costs & working capital: ${fmt(financial.closingCosts)}`,
    `  Total uses:                      ${fmt(calculated.totalProjectCost)}`,
    "",
    "SOURCES",
    `  SBA 7(a) senior debt:            ${fmt(sbaAmount)}  (${
      calculated.totalProjectCost > 0
        ? fmtPct((sbaAmount / calculated.totalProjectCost) * 100)
        : "—"
    })`,
    `  Seller note [${
      standbyMode === "full" ? "FULL STANDBY" : "active payment"
    }]: ${fmt(sellerNote)}  (${
      calculated.totalProjectCost > 0
        ? fmtPct((sellerNote / calculated.totalProjectCost) * 100)
        : "—"
    })`,
    `  ESOP leveraged loan (TBD):       ${fmt(calculated.esopLoan)}  (${
      calculated.totalProjectCost > 0
        ? fmtPct((calculated.esopLoan / calculated.totalProjectCost) * 100)
        : "—"
    })`,
    `  Total sources:                   ${fmt(calculated.totalProjectCost)}`,
    "",
  ];

  if (standbyMode === "full") {
    lines.push(
      "  Note: Seller note on full standby per SOP 50 10 8. Treated as equity injection.",
      "  $0 debt service during SBA loan term.",
      ""
    );
  }

  lines.push(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `3. DSCR ANALYSIS (${
      inputs.dscr.scenario === "B" ? "Scenario B — QofE-adjusted" : "Scenario A — Base case"
    })`,
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `EBITDA:                ${fmt(activeEbitda)}`,
    `SBA debt service:      ${fmt(dscr.sbaDS)}`,
    `ESOP loan service:     ${fmt(dscr.esopDS)}`,
    `Total debt service:    ${fmt(dscr.totalDS)}`,
    `EBITDA DSCR:           ${fmtX(dscr.dscrEbitda)}  [${
      dscr.dscrEbitda >= TARGET_DSCR
        ? "PASS — above 1.25x SBA minimum"
        : "FAIL — below 1.25x SBA minimum"
    }]`,
    `OCF DSCR:              ${fmtX(dscr.dscrOcf)}`,
    "",
    "Stress test (10% EBITDA decline):",
    `  Stressed EBITDA:     ${fmt(stressedEbitda)}`,
    `  Stressed DSCR:       ${fmtX(stressedDscr)}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "4. SBA POLICY COMPLIANCE",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "  SOP 50 10 8: Seller note on full standby counted as equity injection.",
    "  Policy Notice 5000-876441: ESOP-specific underwriting requirements apply.",
    "  Guaranty fee (FY2026, $5M loan): ~$138,125 (est.).",
    "  Note: Policy Notice 5000-876441 is not an ESOP-specific notice; SOP 50 10 8",
    "  governs ESOP standby seller note treatment.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "5. FORHEMIT — ROLE & STEWARDSHIP",
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
    "6. OPEN ITEMS & CONDITIONS PRECEDENT",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `  Resolved (${resolvedCount}/5):`
  );

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
      "7. ADDITIONAL NOTES",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      lenderNotes,
      ""
    );
  }

  lines.push(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "DISCLAIMER: Illustrative only. Not a commitment to lend. Subject to full",
    "credit underwriting, QofE, SBA lender approval, and legal review.",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  );

  return lines.join("\n");
}

// ── CREDIT MEMO STRUCTURED DATA ──────────────────────────────────────────────

import { DealInputs, CalculatedValues, DSCRResult } from "../types";
import { OPEN_ITEM_DEFINITIONS, TARGET_DSCR } from "../constants";
import { fmt, fmtPct, fmtX } from "./formatters";

export interface CreditMemoSection {
  id: string;
  title: string;
  rows: CreditMemoRow[];
}

export interface CreditMemoRow {
  label: string;
  value: string;
  highlight?: "good" | "warn" | "danger" | "neutral";
  indent?: boolean;
}

export interface StructuredCreditMemo {
  header: {
    title: string;
    subtitle: string;
    disclaimer: string;
  };
  sections: CreditMemoSection[];
  footer: string;
}

export interface CreditMemoDataOptions {
  inputs: DealInputs;
  calculated: CalculatedValues;
  dscr: DSCRResult;
  activeEbitda: number;
}

export function generateStructuredCreditMemo(
  options: CreditMemoDataOptions
): StructuredCreditMemo {
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

  const dscrStatus =
    dscr.dscrEbitda >= 1.35
      ? "good"
      : dscr.dscrEbitda >= TARGET_DSCR
      ? "neutral"
      : "danger";

  const stressedStatus =
    stressedDscr >= TARGET_DSCR
      ? "good"
      : stressedDscr >= 1.1
      ? "warn"
      : "danger";

  // FIXED: Seller note structure label only shown when seller note > 0
  const snStructureLabel =
    sellerNote > 0
      ? standbyMode === "full"
        ? "Full standby — $0 debt service (SOP 50 10 8)"
        : "Active payment — interest-only at 6% p.a."
      : "N/A (no seller note)";

  // FIXED: Show business type (including "Other" text if applicable)
  const businessTypeDisplay =
    business.type === "Other" && business.typeOther
      ? `Other: ${business.typeOther}`
      : business.type || "N/A";

  const sections: CreditMemoSection[] = [
    // Section 1: Transaction Summary
    {
      id: "summary",
      title: "1. Transaction Summary",
      rows: [
        { label: "Business", value: business.name || "Target Company" },
        { label: "Type", value: businessTypeDisplay },
        { label: "State", value: business.state || "N/A" },
        {
          label: "Employees",
          value: business.employeeCount?.toString() || "N/A",
        },
        { label: "Transaction Type", value: "100% ESOP acquisition" },
        { label: "Purchase price", value: fmt(purchasePrice) },
        { label: "TTM EBITDA", value: fmt(ebitda) },
        {
          label: "Implied multiple",
          value:
            purchasePrice && ebitda ? fmtX(purchasePrice / ebitda) : "N/A",
        },
        { label: "Total project cost", value: fmt(calculated.totalProjectCost) },
      ],
    },

    // Section 2: Sources & Uses (FIXED: split closing costs and working capital)
    {
      id: "sources-uses",
      title: "2. Sources & Uses",
      rows: [
        { label: "USES", value: "" },
        { label: "Purchase price", value: fmt(purchasePrice), indent: true },
        {
          label: "Actual closing costs",
          value: fmt(actualClosingCosts),
          indent: true,
        },
        {
          label: `Working capital reserve (${workingCapitalPct}%)`,
          value: fmt(workingCapital),
          indent: true,
        },
        { label: "Total uses", value: fmt(calculated.totalProjectCost), indent: true },
        { label: "", value: "" },
        { label: "SOURCES", value: "" },
        {
          label: "SBA 7(a) senior debt",
          value: `${fmt(sbaAmount)} (${
            calculated.totalProjectCost > 0
              ? fmtPct((sbaAmount / calculated.totalProjectCost) * 100)
              : "—"
          })`,
          indent: true,
        },
        // FIXED: Only show seller note details if seller note > 0
        ...(sellerNote > 0
          ? [
              {
                label: "Seller note",
                value: `${fmt(sellerNote)} (${
                  calculated.totalProjectCost > 0
                    ? fmtPct((sellerNote / calculated.totalProjectCost) * 100)
                    : "—"
                })`,
                indent: true as const,
              },
              {
                label: "Structure",
                value: snStructureLabel,
                indent: true as const,
              },
            ]
          : []),
        {
          label: "ESOP leveraged loan (TBD)",
          value: `${fmt(calculated.esopLoan)} (${
            calculated.totalProjectCost > 0
              ? fmtPct((calculated.esopLoan / calculated.totalProjectCost) * 100)
              : "—"
          })`,
          indent: true,
        },
        {
          label: "Total sources",
          value: fmt(calculated.totalProjectCost),
          indent: true,
        },
      ],
    },

    // Section 3: Loan Assumptions
    {
      id: "loan-assumptions",
      title: "3. Loan Assumptions",
      rows: [
        {
          label: "SBA 7(a)",
          value: `${dscr.sbaRate.toFixed(2)}% / ${inputs.dscr.loanTerm}-year fully amortizing`,
        },
        {
          label: "ESOP loan",
          value: `${dscr.esopRate.toFixed(2)}% / ${dscr.esopTerm}-year fully amortizing (indicative)`,
        },
        {
          label: "SBA guaranty fee (est.)",
          value: `${fmt(calculated.guarantyFee)} (${
            sbaAmount > 0 ? fmtPct((calculated.guarantyFee / sbaAmount) * 100) : "—"
          } of loan amount)`,
        },
        {
          label: "Fee basis",
          value: "75% guaranteed portion × applicable rate per FY2026 SBA fee schedule",
          indent: true,
        },
        {
          label: "Note",
          value: "All rate and term assumptions are illustrative. Confirm with lenders.",
        },
      ],
    },

    // Section 4: DSCR Analysis (corrected formulas)
    {
      id: "dscr",
      title: `4. DSCR Analysis (${
        inputs.dscr.scenario === "B" ? "Scenario B — QofE-adjusted" : "Scenario A — Base case"
      })`,
      rows: [
        { label: "EBITDA (basis)", value: fmt(activeEbitda) },
        { label: "SBA debt service", value: fmt(dscr.sbaDS) },
        { label: "ESOP loan service", value: fmt(dscr.esopDS) },
        // FIXED: Only show seller note service if seller note > 0
        ...(sellerNote > 0
          ? [
              {
                label: "Seller note service",
                value:
                  dscr.snDS === 0
                    ? "$0 (full standby)"
                    : `${fmt(dscr.snDS)} (active, int.-only at 6%)`,
              },
            ]
          : []),
        { label: "Total debt service", value: fmt(dscr.totalDS) },
        { label: "", value: "" },
        // FIXED: Primary DSCR clearly labeled as SBA standard metric
        {
          label: "PRIMARY DSCR (EBITDA basis — SBA standard metric)",
          value: "",
        },
        {
          label: "EBITDA DSCR",
          value: `${fmtX(dscr.dscrEbitda)} (${
            dscr.dscrEbitda >= TARGET_DSCR ? "PASS" : "FAIL"
          })`,
          highlight: dscrStatus,
          indent: true,
        },
        {
          label: "Formula",
          value: "EBITDA ÷ total annual debt service (pre-tax, pre-D&A)",
          indent: true,
        },
        { label: "", value: "" },
        // FIXED: OCF DSCR clearly labeled as supplemental
        {
          label: "SUPPLEMENTAL DSCR (OCF basis)",
          value: "",
        },
        {
          label: "OCF DSCR",
          value: `${fmtX(dscr.dscrOcf)} (after ${dscr.taxRate}% effective tax rate)`,
          indent: true,
        },
        {
          label: "Formula",
          value: "EBITDA × (1 − tax rate) ÷ total annual debt service",
          indent: true,
        },
        { label: "", value: "" },
        {
          label: "STRESS TEST (10% EBITDA decline)",
          value: "",
        },
        {
          label: "Stressed EBITDA",
          value: fmt(stressedEbitda),
          indent: true,
        },
        {
          label: "Stressed DSCR",
          value: `${fmtX(stressedDscr)} (${
            stressedDscr >= TARGET_DSCR ? "PASS" : "FAIL"
          })`,
          highlight: stressedStatus,
          indent: true,
        },
      ],
    },

    // Section 5: SBA Policy Compliance
    {
      id: "sba-policy",
      title: "5. SBA Policy Compliance",
      rows: [
        // FIXED: Conditional policy treatment based on standby mode and seller note
        ...(sellerNote > 0 && standbyMode === "full"
          ? [
              {
                label: "SOP 50 10 8",
                value: "Seller note on full standby counted as equity injection.",
              },
            ]
          : [
              {
                label: "Seller note",
                value: "Active payment — not eligible for equity injection treatment.",
              },
            ]),
        {
          label: "ESOP requirements",
          value: "ESOP acquisition requirements governed by SBA SOP 50 10 8, Section B.",
        },
        {
          label: "SBA maximum loan amount",
          value: "$5,000,000",
        },
      ],
    },

    // Section 6: Forhemit Role
    {
      id: "forhemit",
      title: "6. Forhemit — Role & Stewardship",
      rows: [
        {
          label: "Entity",
          value:
            "Forhemit Stewardship Management Co. — California Public Benefit Corporation",
        },
        {
          label: "Role",
          value:
            "Transaction manager and post-close operational stewardship provider.",
        },
        {
          label: "Position",
          value:
            "No equity position, no capital at risk, does not appear in sources & uses.",
        },
        {
          label: "Revenue Model",
          value: "Structuring fees + ongoing retainer",
        },
        {
          label: "Differentiation",
          value:
            "COOP-based stewardship standard derived from municipal disaster preparedness methodology. All transactions require a documented business continuity plan.",
        },
      ],
    },

    // Section 7: Open Items
    {
      id: "open-items",
      title: "7. Open Items & Conditions Precedent",
      rows: [
        { label: "Resolved", value: `${resolvedCount}/5` },
        ...inputs.openItems.map((item) => ({
          label: item.resolved ? "✓" : "○",
          value: item.title,
          highlight: (item.resolved ? "good" : "neutral") as
            | "good"
            | "neutral",
        })),
        ...(unresolvedItems.length > 0
          ? [
              { label: "", value: "" },
              {
                label: "FLAGGED",
                value: "Must be resolved before lender submission:",
                highlight: "danger" as const,
              },
              ...unresolvedItems.map((item) => ({
                label: "•",
                value: item,
                highlight: "danger" as const,
              })),
            ]
          : [
              { label: "", value: "" },
              {
                label: "Status",
                value: "All conditions precedent resolved.",
                highlight: "good" as const,
              },
            ]),
      ],
    },

    // Section 8: Additional Notes (conditional)
    ...(lenderNotes
      ? [
          {
            id: "notes",
            title: "8. Additional Notes",
            rows: [{ label: "", value: lenderNotes }],
          },
        ]
      : []),
  ];

  return {
    header: {
      title: "Illustrative Credit Memo",
      subtitle: "Forhemit Stewardship Management Co.",
      disclaimer:
        "Transaction Manager & Post-Close Stewardship Provider. Forhemit is not the buyer, holds no equity, and does not appear in the capital structure.",
    },
    sections,
    footer:
      "DISCLAIMER: Illustrative only. Not a commitment to lend. All rate and term assumptions must be confirmed with the applicable lenders. Subject to full credit underwriting, QofE, SBA lender approval, and legal review.",
  };
}

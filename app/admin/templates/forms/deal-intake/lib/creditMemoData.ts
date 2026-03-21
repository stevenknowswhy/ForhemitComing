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
  const { purchasePrice, ebitda, closingCosts } = financial;
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

  const sections: CreditMemoSection[] = [
    // Section 1: Transaction Summary
    {
      id: "summary",
      title: "1. Transaction Summary",
      rows: [
        { label: "Business", value: business.name || "Target Company" },
        { label: "Type", value: business.type || "N/A" },
        { label: "State", value: business.state || "N/A" },
        {
          label: "Employees",
          value: business.employeeCount?.toString() || "N/A",
        },
        { label: "Transaction Type", value: "100% ESOP acquisition" },
        { label: "Purchase Price", value: fmt(purchasePrice) },
        { label: "TTM EBITDA", value: fmt(ebitda) },
        {
          label: "Implied Multiple",
          value:
            purchasePrice && ebitda ? fmtX(purchasePrice / ebitda) : "N/A",
        },
        { label: "Total Project Cost", value: fmt(calculated.totalProjectCost) },
      ],
    },

    // Section 2: Sources & Uses
    {
      id: "sources-uses",
      title: "2. Sources & Uses",
      rows: [
        { label: "USES", value: "" },
        { label: "Purchase price", value: fmt(purchasePrice), indent: true },
        {
          label: "Closing costs & working capital",
          value: fmt(closingCosts),
          indent: true,
        },
        { label: "Total uses", value: fmt(calculated.totalProjectCost), indent: true },
        { label: "", value: "" },
        { label: "SOURCES", value: "" },
        {
          label: `SBA 7(a) senior debt`,
          value: `${fmt(sbaAmount)} (${
            calculated.totalProjectCost > 0
              ? fmtPct((sbaAmount / calculated.totalProjectCost) * 100)
              : "—"
          })`,
          indent: true,
        },
        {
          label: `Seller note [${
            standbyMode === "full" ? "FULL STANDBY" : "active payment"
          }]`,
          value: `${fmt(sellerNote)} (${
            calculated.totalProjectCost > 0
              ? fmtPct((sellerNote / calculated.totalProjectCost) * 100)
              : "—"
          })`,
          indent: true,
        },
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
        ...(standbyMode === "full"
          ? [
              { label: "", value: "" },
              {
                label: "Note",
                value:
                  "Seller note on full standby per SOP 50 10 8. Treated as equity injection. $0 debt service during SBA loan term.",
                indent: true,
              },
            ]
          : []),
      ],
    },

    // Section 3: DSCR Analysis
    {
      id: "dscr",
      title: `3. DSCR Analysis (${
        inputs.dscr.scenario === "B" ? "Scenario B — QofE-adjusted" : "Scenario A — Base case"
      })`,
      rows: [
        { label: "EBITDA", value: fmt(activeEbitda) },
        { label: "SBA debt service", value: fmt(dscr.sbaDS) },
        { label: "ESOP loan service", value: fmt(dscr.esopDS) },
        { label: "Total debt service", value: fmt(dscr.totalDS) },
        {
          label: "EBITDA DSCR",
          value: `${fmtX(dscr.dscrEbitda)} (${
            dscr.dscrEbitda >= TARGET_DSCR ? "PASS" : "FAIL"
          })`,
          highlight: dscrStatus,
        },
        { label: "OCF DSCR", value: fmtX(dscr.dscrOcf) },
        { label: "", value: "" },
        { label: "Stress Test (10% EBITDA decline)", value: "" },
        {
          label: "Stressed EBITDA",
          value: fmt(stressedEbitda),
          indent: true,
        },
        {
          label: "Stressed DSCR",
          value: fmtX(stressedDscr),
          highlight:
            stressedDscr >= TARGET_DSCR
              ? "good"
              : stressedDscr >= 1.1
              ? "warn"
              : "danger",
          indent: true,
        },
      ],
    },

    // Section 4: SBA Policy Compliance
    {
      id: "sba-policy",
      title: "4. SBA Policy Compliance",
      rows: [
        {
          label: "SOP 50 10 8",
          value: "Seller note on full standby counted as equity injection.",
        },
        {
          label: "Policy Notice",
          value:
            "5000-876441: ESOP-specific underwriting requirements apply.",
        },
        {
          label: "Guaranty Fee (FY2026)",
          value: "~$138,125 estimated on $5M loan",
        },
        {
          label: "Note",
          value:
            "Policy Notice 5000-876441 is not an ESOP-specific notice; SOP 50 10 8 governs ESOP standby seller note treatment.",
        },
      ],
    },

    // Section 5: Forhemit Role
    {
      id: "forhemit",
      title: "5. Forhemit — Role & Stewardship",
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

    // Section 6: Open Items
    {
      id: "open-items",
      title: "6. Open Items & Conditions Precedent",
      rows: [
        { label: `Resolved`, value: `${resolvedCount}/5` },
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

    // Section 7: Additional Notes (conditional)
    ...(lenderNotes
      ? [
          {
            id: "notes",
            title: "7. Additional Notes",
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
      "DISCLAIMER: Illustrative only. Not a commitment to lend. Subject to full credit underwriting, QofE, SBA lender approval, and legal review.",
  };
}

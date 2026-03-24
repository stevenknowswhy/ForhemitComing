import { fmt, type DealResults } from "../lib/dealCalculations";
import type { StateKey } from "../lib/feeData";

type Props = {
  results: DealResults;
  state: StateKey;
};

type Row = {
  label: string;
  esop: string | null;
  pe: string | null;
  note?: string;
  isSubtotal?: boolean;
  isTotal?: boolean;
  isSectionHead?: boolean;
};

function neg(n: number) {
  return n === 0 ? "—" : `(${fmt(n)})`;
}

export function DealWaterfallTable({ results, state }: Props) {
  const rows: Row[] = [
    { label: "PROCEEDS STRUCTURE", esop: null, pe: null, isSectionHead: true },
    {
      label: "Purchase price / headline",
      esop: fmt(results.esopValue),
      pe: fmt(results.peHeadline),
    },
    {
      label: "Cash received at close",
      esop: fmt(results.esopNetProceeds),
      pe: fmt(results.peCashAtClose),
      note: "PE: only 61.5% of headline is cash on Day 1",
    },
    {
      label: "Escrow (released ~18 mo., 25% avg. lost to claims)",
      esop: "N/A",
      pe: fmt(results.peEscrowNet),
    },
    {
      label: "Earnout (45% avg. realization, Yr 2–3)",
      esop: "N/A",
      pe: fmt(results.peEarnoutNet),
    },
    {
      label: "Rollover equity future value (1.8× in 6 yrs, illiquid)",
      esop: "N/A",
      pe: fmt(results.peRolloverFV),
    },
    {
      label: "Seller-paid transaction costs",
      esop: neg(results.esopSellerCost),
      pe: neg(results.peSellerCosts),
      note: "ESOP: Forhemit advisory only. PE: broker 10% + QoE + legal + R&W insurance.",
    },
    {
      label: "Total gross proceeds (pre-tax)",
      esop: fmt(results.esopNetProceeds),
      pe: fmt(results.peTotalGross - results.peSellerCosts),
      isSubtotal: true,
    },

    { label: "TAX IMPACT", esop: null, pe: null, isSectionHead: true },
    {
      label: "Federal capital gains tax (20%)",
      esop: neg(results.esopFedTax),
      pe: neg(results.peFedTax),
    },
    {
      label: "Net Investment Income Tax (3.8%)",
      esop: neg(results.esopNIIT),
      pe: neg(results.peNIIT),
    },
    {
      label: `State tax${state === "other" ? " (est. 8%)" : " (0%)"}`,
      esop: results.esopStateTax === 0 ? "—" : neg(results.esopStateTax),
      pe: results.peStateTax === 0 ? "—" : neg(results.peStateTax),
    },
    {
      label: "Earnout tax (ordinary income rate, ~37%+ federal)",
      esop: "N/A",
      pe: neg(results.peEarnoutTax),
      note: "Earnout payments are typically ordinary income, not capital gains.",
    },
    {
      label: "Total estimated tax",
      esop: neg(results.esopTotalTax),
      pe: neg(results.peTotalTax),
      isSubtotal: true,
    },

    { label: "RESULT", esop: null, pe: null, isSectionHead: true },
    {
      label: "Net after-tax (base, no §1042)",
      esop: fmt(results.esopNetAfterTax),
      pe: fmt(results.peNetAfterTax),
      isTotal: true,
    },
    {
      label: "§1042 election available",
      esop: "✓ Yes",
      pe: "✗ No",
    },
    {
      label: "With §1042 election (full gain deferral)",
      esop: fmt(results.esopWith1042),
      pe: "Not available",
      isTotal: true,
      note: "Requires C-Corp stock sale with reinvestment in Qualified Replacement Property within 12 months.",
    },
  ];

  return (
    <div className="dc-waterfall">
      <div className="dc-waterfall-header">
        <span className="dc-waterfall-col-label" />
        <span className="dc-waterfall-col-label dc-waterfall-col-label--esop">ESOP via Forhemit</span>
        <span className="dc-waterfall-col-label dc-waterfall-col-label--pe">Private Buyer</span>
      </div>

      {rows.map((row, i) => {
        if (row.isSectionHead) {
          return (
            <div key={i} className="dc-waterfall-section-head">
              {row.label}
            </div>
          );
        }
        return (
          <div
            key={i}
            className={`dc-waterfall-row ${row.isTotal ? "dc-waterfall-row--total" : ""} ${row.isSubtotal ? "dc-waterfall-row--subtotal" : ""}`}
          >
            <div className="dc-waterfall-row-label">
              {row.label}
              {row.note && <span className="dc-waterfall-row-note">{row.note}</span>}
            </div>
            <span className="dc-waterfall-cell dc-waterfall-cell--esop">{row.esop}</span>
            <span className="dc-waterfall-cell dc-waterfall-cell--pe">{row.pe}</span>
          </div>
        );
      })}

      <p className="dc-waterfall-footnote">
        PE rollover equity ($
        {Math.round(results.peRolloverFV / 1000)}k future value) assumes 1.8× return over 6 years with no
        governance rights and no guaranteed liquidity. Actual return may be materially less. ESOP seller
        note (20–40%) not shown separately — held until the SBA loan is fully repaid.
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ComparisonRow } from "@/types";

const rows: ComparisonRow[] = [
  { label: "Broker Commission", traditional: "Standard Fee (Paid at Close)", forhemit: "Standard Fee (Paid at Close)" },
  { label: "Transaction Timeline", traditional: "12 – 24 Months (High uncertainty)", forhemit: "90 – 120 Days (Pre-underwritten)" },
  { label: "Purchase Price", traditional: "Subject to aggressive negotiation", forhemit: "100% of Independent Fair Market Value" },
  { label: "Capital Stack", traditional: "Buyer Cash + Bank Debt", forhemit: "SBA 7(a) Senior Debt (up to $5M) + Seller Note" },
  { label: "Tax Advantages", traditional: "Standard Capital Gains", forhemit: "Potential $0 Cap Gains (Sec. 1042 Rollover)" },
  { label: "Employee Outcome", traditional: "High risk of layoffs", forhemit: "100% Employee Ownership; Jobs preserved" },
];

export function ComparisonTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="comparison-table">
      <div className="table-header">
        <div className="table-cell metric-label">Metric</div>
        <div className="table-cell traditional-header">Traditional External Buyer</div>
        <div className="table-cell forhemit-header">The Forhemit ESOP Exit</div>
      </div>
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`table-row ${hoveredRow === i ? "hovered" : ""}`}
          onMouseEnter={() => setHoveredRow(i)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <div className="table-cell metric-label">{row.label}</div>
          <div className="table-cell traditional-cell">{row.traditional}</div>
          <div className="table-cell forhemit-cell">{row.forhemit}</div>
        </div>
      ))}
    </div>
  );
}

"use client";

import React from "react";
import { DealHeader } from "../../types";
import { formatDate, formatCurrency, getLoanTypeLabel } from "../../lib/calculations";

interface SummaryPanelProps {
  header: DealHeader;
}

export function SummaryPanel({ header }: SummaryPanelProps) {
  const { company, lender, loanamt, loantype, closedate, dealstage } = header;

  const subtitleParts = [
    getLoanTypeLabel(loantype),
    loanamt ? formatCurrency(loanamt) : null,
    lender ? `Lender: ${lender}` : null,
  ].filter(Boolean);

  return (
    <div className="lqa-summary-header">
      <div className="lqa-summary-deal">{company || "—"}</div>
      <div className="lqa-summary-sub">{subtitleParts.join(" · ")}</div>
      <div className="lqa-summary-close">
        Target close: <span>{closedate ? formatDate(closedate) : "—"}</span>
        &nbsp;·&nbsp; Deal stage: <span>{dealstage || "—"}</span>
      </div>
    </div>
  );
}

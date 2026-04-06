"use client";

import React from "react";
import { DealHeader } from "../../types";
import { fmtK, today } from "../../lib";

interface PrintCoverProps {
  header: DealHeader;
  totalDebt: number;
}

export function PrintCover({ header, totalDebt }: PrintCoverProps) {
  const companyName = header.company.trim() || "Company Name";

  return (
    <div className="erm-print-cover">
      <div className="erm-print-cover-top">
        <div className="erm-cover-eyebrow">ESOP Transaction — Confidential</div>
        <div className="erm-cover-title">{companyName} — Repayment & Amortization Model</div>
        <div className="erm-cover-sub">SBA 7(a) · Seller Note · Debt Service Coverage Analysis</div>
      </div>
      <div className="erm-cover-meta">
        <div className="erm-cover-meta-item">
          <div className="erm-cover-meta-label">Company</div>
          <div className="erm-cover-meta-val">{companyName}</div>
        </div>
        <div className="erm-cover-meta-item">
          <div className="erm-cover-meta-label">Total debt</div>
          <div className="erm-cover-meta-val">{fmtK(totalDebt)}</div>
        </div>
        <div className="erm-cover-meta-item">
          <div className="erm-cover-meta-label">Prepared</div>
          <div className="erm-cover-meta-val">{today()}</div>
        </div>
      </div>
    </div>
  );
}

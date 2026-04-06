"use client";

import React from "react";
import { RepaymentModelInputs, ModelMetrics } from "../../types";
import { fmt, fmtX, getDscrStatus } from "../../lib";

interface UnderwritingSummaryProps {
  inputs: RepaymentModelInputs;
  metrics: ModelMetrics;
}

export function UnderwritingSummary({ inputs, metrics }: UnderwritingSummaryProps) {
  const { sbaLoan, sellerNote, projections } = inputs;
  const dscrStatus = getDscrStatus(metrics.year1Dscr);

  const subordinationText =
    sellerNote.subordination === "yes"
      ? "The seller note is on full standstill and excluded from the SBA DSCR calculation, consistent with SBA ESOP underwriting requirements."
      : sellerNote.subordination === "partial"
      ? "The seller note permits interest-only payments, which are included in the debt service calculation."
      : "The seller note is not subordinated and is included in full in the debt service calculation.";

  return (
    <div className="erm-card">
      <div className="erm-card-header">
        <span className="erm-card-title">Underwriting Summary</span>
      </div>
      <div className="erm-card-body">
        <div className="erm-uw-grid">
          <div>
            <div className="erm-uw-section-title">Debt structure summary</div>
            <div className="erm-wfall-row">
              <span className="erm-wfall-label">SBA loan amount</span>
              <span className="erm-wfall-val">{fmt(sbaLoan.amount)}</span>
            </div>
            <div className="erm-wfall-row">
              <span className="erm-wfall-label">SBA interest rate</span>
              <span className="erm-wfall-val">{sbaLoan.rate.toFixed(2)}%</span>
            </div>
            <div className="erm-wfall-row">
              <span className="erm-wfall-label">SBA loan term</span>
              <span className="erm-wfall-val">{sbaLoan.term} years</span>
            </div>
            <div className="erm-wfall-row">
              <span className="erm-wfall-label">Seller note amount</span>
              <span className="erm-wfall-val">{fmt(sellerNote.amount)}</span>
            </div>
            <div className="erm-wfall-row">
              <span className="erm-wfall-label">Seller note rate / term</span>
              <span className="erm-wfall-val">
                {sellerNote.rate.toFixed(2)}% / {sellerNote.term} yrs
              </span>
            </div>
            <div className="erm-wfall-row">
              <span className="erm-wfall-label">Subordination</span>
              <span className="erm-wfall-val">
                {sellerNote.subordination === "yes"
                  ? "Full standstill"
                  : sellerNote.subordination === "partial"
                  ? "Interest only"
                  : "None"}
              </span>
            </div>
            <div className="erm-wfall-row">
              <span className="erm-wfall-label erm-wfall-bold">Debt / EBITDA</span>
              <span className="erm-wfall-val">
                {metrics.debtToEbitda ? fmtX(metrics.debtToEbitda) : "—"}
              </span>
            </div>
          </div>
          <div>
            <div className="erm-uw-section-title">Coverage assessment</div>
            <p className="erm-uw-para">
              Based on Year 1 projected EBITDA of{" "}
              <strong>{fmt(projections.year1Ebitda)}</strong>, the deal generates a DSCR of{" "}
              <strong style={{ color: metrics.year1Dscr && metrics.year1Dscr >= 1.5 ? "#0D6E5A" : metrics.year1Dscr && metrics.year1Dscr >= 1.25 ? "#B85C00" : "#9E2B2B" }}>
                {metrics.year1Dscr ? fmtX(metrics.year1Dscr) : "—"}
              </strong>
              , which is {dscrStatus} the SBA minimum covenant of 1.25x.
            </p>
            <p className="erm-uw-para">{subordinationText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

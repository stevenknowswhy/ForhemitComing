"use client";

import React from "react";
import { WaterfallData, SubordinationType } from "../../types";
import { fmt, getDscrPill } from "../../lib";

interface WaterfallPanelProps {
  waterfall: WaterfallData;
  snSubordination: SubordinationType;
  year1Dscr: number | null;
}

export function WaterfallPanel({
  waterfall,
  snSubordination,
  year1Dscr,
}: WaterfallPanelProps) {
  const netCash = waterfall.fcf - waterfall.sbaDebtService - waterfall.snDebtService;
  const dscrPill = getDscrPill(year1Dscr);

  return (
    <div className="erm-card">
      <div className="erm-card-header">
        <span className="erm-card-title">Year 1 Free Cash Flow Waterfall</span>
      </div>
      <div className="erm-card-body">
        <div className="erm-wfall-row">
          <span className="erm-wfall-label erm-wfall-bold">EBITDA</span>
          <span className="erm-wfall-val erm-wfall-pos">{fmt(waterfall.ebitda)}</span>
        </div>
        <div className="erm-wfall-row erm-wfall-indent">
          <span className="erm-wfall-label">Less: maintenance capex</span>
          <span className="erm-wfall-val erm-wfall-neg">({fmt(waterfall.capex)})</span>
        </div>
        <div className="erm-wfall-row erm-wfall-indent">
          <span className="erm-wfall-label">Less: cash taxes</span>
          <span className="erm-wfall-val erm-wfall-neg">({fmt(waterfall.taxes)})</span>
        </div>
        {waterfall.wcReserve > 0 && (
          <div className="erm-wfall-row erm-wfall-indent">
            <span className="erm-wfall-label">Less: working capital reserve</span>
            <span className="erm-wfall-val erm-wfall-neg">({fmt(waterfall.wcReserve)})</span>
          </div>
        )}
        <div className="erm-wfall-divider" />
        <div className="erm-wfall-row">
          <span className="erm-wfall-label erm-wfall-bold">Free cash flow (FCF)</span>
          <span className="erm-wfall-val erm-wfall-pos" style={{ color: "var(--erm-teal)" }}>
            {fmt(waterfall.fcf)}
          </span>
        </div>
        <div className="erm-wfall-divider" />
        <div className="erm-wfall-row erm-wfall-indent">
          <span className="erm-wfall-label">Less: SBA debt service (P+I)</span>
          <span className="erm-wfall-val erm-wfall-neg">({fmt(waterfall.sbaDebtService)})</span>
        </div>
        {snSubordination === "yes" ? (
          <div className="erm-wfall-row erm-wfall-indent">
            <span className="erm-wfall-label">Seller note (standstill — excluded from DSCR)</span>
            <span className="erm-wfall-val" style={{ color: "var(--erm-hint)" }}>—</span>
          </div>
        ) : (
          <div className="erm-wfall-row erm-wfall-indent">
            <span className="erm-wfall-label">Less: seller note debt service</span>
            <span className="erm-wfall-val erm-wfall-neg">({fmt(waterfall.snDebtService)})</span>
          </div>
        )}
        <div className="erm-wfall-divider" />
        <div className="erm-wfall-row">
          <span className="erm-wfall-label erm-wfall-bold">Net cash after debt service</span>
          <span
            className={`erm-wfall-val ${netCash >= 0 ? "erm-wfall-pos" : "erm-wfall-neg"}`}
            style={{ color: netCash >= 0 ? "var(--erm-teal)" : "var(--erm-red)" }}
          >
            {fmt(netCash)}
          </span>
        </div>
        <div
          className="erm-wfall-row"
          style={{
            background: "var(--erm-slate)",
            padding: "8px 0",
            marginTop: 4,
            borderRadius: 4,
          }}
        >
          <span className="erm-wfall-label erm-wfall-bold" style={{ paddingLeft: 8 }}>
            Year 1 DSCR
          </span>
          <span className="erm-wfall-val" style={{ paddingRight: 8 }}>
            <span className={`erm-pill ${dscrPill.className}`}>
              {year1Dscr ? year1Dscr.toFixed(2) + "x" : "N/A"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

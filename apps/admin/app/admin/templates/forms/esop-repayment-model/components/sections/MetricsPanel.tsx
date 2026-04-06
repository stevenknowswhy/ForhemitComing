"use client";

import React from "react";
import { ModelMetrics, WaterfallData } from "../../types";
import { fmtK, fmtX, getDscrColor, getDscrPill } from "../../lib";

interface MetricsPanelProps {
  metrics: ModelMetrics;
  waterfall?: WaterfallData;
}

export function MetricsPanel({ metrics, waterfall }: MetricsPanelProps) {
  const dscrColor = getDscrColor(metrics.year1Dscr);
  const dscrPill = getDscrPill(metrics.year1Dscr);
  
  // Calculate FCF from waterfall if available, otherwise estimate
  const fcf = waterfall?.fcf ?? 0;

  return (
    <div className="erm-metrics-strip">
      <div className="erm-metric-card">
        <div className="erm-metric-label">Total debt</div>
        <div className="erm-metric-value">{fmtK(metrics.totalDebt)}</div>
        <div className="erm-metric-sub">SBA + seller note</div>
      </div>
      <div className="erm-metric-card">
        <div className="erm-metric-label">SBA monthly payment</div>
        <div className="erm-metric-value">
          {metrics.sbaMonthlyPayment > 0
            ? "$" + Math.round(metrics.sbaMonthlyPayment).toLocaleString()
            : "—"}
        </div>
        <div className="erm-metric-sub">{fmtK(metrics.sbaAnnualPayment)} / year</div>
      </div>
      <div className="erm-metric-card">
        <div className="erm-metric-label">Year 1 DSCR</div>
        <div className="erm-metric-value" style={{ color: dscrColor }}>
          {metrics.year1Dscr ? fmtX(metrics.year1Dscr) : "—"}
        </div>
        <div className="erm-metric-sub">
          <span className={`erm-pill ${dscrPill.className}`}>{dscrPill.text}</span>
        </div>
      </div>
      <div className="erm-metric-card">
        <div className="erm-metric-label">Year 1 free cash flow</div>
        <div className="erm-metric-value" style={{ color: "#0D6E5A" }}>
          {fmtK(fcf)}
        </div>
        <div className="erm-metric-sub">After capex & taxes</div>
      </div>
    </div>
  );
}

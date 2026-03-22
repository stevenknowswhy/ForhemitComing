"use client";

import React from "react";
import { MetricsData } from "../../types";

interface MetricsPanelProps {
  metrics: MetricsData;
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  const { total, resolved, pending, blocked, overdue, percentage } = metrics;

  return (
    <>
      <div className="lqa-metrics-row">
        <div className="lqa-metric-card">
          <div className="lqa-metric-label">Total items</div>
          <div className="lqa-metric-val">{total}</div>
        </div>
        <div className="lqa-metric-card">
          <div className="lqa-metric-label">Resolved</div>
          <div className="lqa-metric-val lqa-green">{resolved}</div>
        </div>
        <div className="lqa-metric-card">
          <div className="lqa-metric-label">Pending</div>
          <div className="lqa-metric-val lqa-blue">{pending}</div>
        </div>
        <div className="lqa-metric-card">
          <div className="lqa-metric-label">Blocked/Overdue</div>
          <div className="lqa-metric-val lqa-red">
            {blocked + overdue > 0 ? `${blocked} (${overdue} overdue)` : blocked}
          </div>
        </div>
      </div>

      <div className="lqa-progress-wrap">
        <div className="lqa-progress-meta">
          <span>Overall completion</span>
          <span>{percentage}%</span>
        </div>
        <div className="lqa-progress-bar">
          <div
            className={`lqa-progress-fill ${percentage < 30 ? "danger" : percentage < 70 ? "warning" : ""}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </>
  );
}

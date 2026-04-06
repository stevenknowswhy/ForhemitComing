"use client";

import React from "react";
import { AmortizationRow, ScenarioTab } from "../../types";
import { fmtX, getDscrColor, getDscrPill } from "../../lib";
import { SCENARIOS } from "../../constants";

interface DSCRPanelProps {
  rows: AmortizationRow[];
  activeScenario: ScenarioTab;
  onScenarioChange: (scenario: ScenarioTab) => void;
}

export function DSCRPanel({ rows, activeScenario, onScenarioChange }: DSCRPanelProps) {
  return (
    <div>
      <div className="erm-scen-tabs">
        {SCENARIOS.map((scen) => (
          <button
            key={scen.key}
            className={`erm-scen-tab ${activeScenario === scen.key ? "active" : ""}`}
            onClick={() => onScenarioChange(scen.key as ScenarioTab)}
          >
            {scen.label}
          </button>
        ))}
      </div>
      <div className="erm-dscr-section">
        {rows.map((row) => {
          const dscr = row.dscr || 0;
          const pct = Math.min(100, Math.max(0, (dscr / 3) * 100));
          const color = getDscrColor(row.dscr);
          const pill = getDscrPill(row.dscr);

          return (
            <div key={row.year} className="erm-dscr-row">
              <span className="erm-dscr-yr">Yr {row.year}</span>
              <div className="erm-dscr-bar-track">
                <div
                  className="erm-dscr-bar-fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <span className="erm-dscr-val" style={{ color }}>
                {row.dscr ? fmtX(row.dscr) : "—"}
              </span>
              <div className="erm-dscr-pill">
                {row.dscr ? (
                  <span className={`erm-pill ${pill.className}`}>{pill.text}</span>
                ) : (
                  <span className="erm-pill erm-pill-na">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 11,
          color: "var(--erm-hint)",
        }}
      >
        SBA minimum DSCR covenant:{" "}
        <strong style={{ color: "var(--erm-amber)" }}>1.25x</strong> · Preferred target:{" "}
        <strong style={{ color: "var(--erm-teal)" }}>≥ 1.50x</strong>
      </div>
    </div>
  );
}

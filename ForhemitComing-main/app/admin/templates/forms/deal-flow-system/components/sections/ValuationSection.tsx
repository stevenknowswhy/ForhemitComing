// ── PRELIMINARY VALUATION SECTION ────────────────────────────────────────────

import React from "react";
import type { Stage2Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import {
  SelectInput,
} from "../inputs";
import { FINANCIAL_QUALITY_OPTIONS } from "../../constants";

interface ValuationSectionProps {
  data: Stage2Data["valuation"];
  updateValuation: UseDealFlowFormReturn["updateValuation"];
  updateValuationScenario: UseDealFlowFormReturn["updateValuationScenario"];
}

const VALUATION_ROWS = [
  { key: "revenue", label: "Revenue (TTM)" },
  { key: "ebitda", label: "EBITDA (TTM)" },
  { key: "multiple", label: "Multiple Range" },
  { key: "enterpriseValue", label: "Enterprise Value" },
  { key: "netDebt", label: "Net Debt" },
  { key: "equityValue", label: "Equity Value" },
  { key: "workingCapitalTarget", label: "Working Capital Target" },
] as const;

export function ValuationSection({
  data,
  updateValuation,
  updateValuationScenario,
}: ValuationSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-blue">
          <span className="dfs-card-badge">2.2</span>
          <span className="dfs-card-title">Preliminary Valuation Range</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-table-wrap">
            <table className="dfs-table dfs-valuation-table">
              <thead>
                <tr>
                  <th style={{ width: "22%" }}>Metric</th>
                  <th style={{ width: "18%" }}>Conservative</th>
                  <th style={{ width: "18%" }}>Base Case</th>
                  <th style={{ width: "18%" }}>Aggressive</th>
                  <th style={{ width: "24%" }}>Data Source / Notes</th>
                </tr>
              </thead>
              <tbody>
                {VALUATION_ROWS.map((row) => {
                  const scenario = data[row.key as keyof typeof data] as { conservative: string; baseCase: string; aggressive: string };
                  return (
                    <tr key={row.key}>
                      <td>{row.label}</td>
                      <td>
                        <input
                          type="text"
                          value={scenario.conservative}
                          onChange={(e) =>
                            updateValuationScenario(row.key as keyof typeof data, {
                              conservative: e.target.value,
                            })
                          }
                          placeholder="$"
                          className="dfs-input dfs-table-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={scenario.baseCase}
                          onChange={(e) =>
                            updateValuationScenario(row.key as keyof typeof data, {
                              baseCase: e.target.value,
                            })
                          }
                          placeholder="$"
                          className="dfs-input dfs-table-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={scenario.aggressive}
                          onChange={(e) =>
                            updateValuationScenario(row.key as keyof typeof data, {
                              aggressive: e.target.value,
                            })
                          }
                          placeholder="$"
                          className="dfs-input dfs-table-input"
                        />
                      </td>
                      <td>
                        {row.key === "revenue" ? (
                          <select
                            value={data.financialQuality}
                            onChange={(e) =>
                              updateValuation({ financialQuality: e.target.value as typeof data.financialQuality })
                            }
                            className="dfs-select dfs-table-select"
                          >
                            <option value="">Quality...</option>
                            {FINANCIAL_QUALITY_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : row.key === "ebitda" ? (
                          <input
                            type="text"
                            value={data.ebitdaNotes}
                            onChange={(e) => updateValuation({ ebitdaNotes: e.target.value })}
                            placeholder="Adj. add-backs..."
                            className="dfs-input dfs-table-input"
                          />
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="dfs-field" style={{ marginTop: "14px" }}>
            <label className="dfs-label">Valuation Notes</label>
            <textarea
              value={data.valuationNotes}
              onChange={(e) => updateValuation({ valuationNotes: e.target.value })}
              placeholder="Additional context, comparables, methodology notes..."
              rows={2}
              className="dfs-textarea"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

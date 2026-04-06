// ── LIABILITIES & CONTINGENCIES SECTION ──────────────────────────────────────

import React from "react";
import type { Stage3Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import { LIABILITY_TYPES, YES_NO_OPTIONS } from "../../constants";

interface LiabilitiesSectionProps {
  data: Stage3Data["liabilities"];
  updateLiability: UseDealFlowFormReturn["updateLiability"];
}

export function LiabilitiesSection({
  data,
  updateLiability,
}: LiabilitiesSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-teal">
          <span className="dfs-card-badge">3.4</span>
          <span className="dfs-card-title">Outstanding Liabilities &amp; Contingencies</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-table-wrap">
            <table className="dfs-table dfs-liab-table">
              <thead>
                <tr>
                  <th style={{ width: "20%" }}>Liability Type</th>
                  <th style={{ width: "18%" }}>Est. Amount ($)</th>
                  <th style={{ width: "14%" }}>Reserved?</th>
                  <th style={{ width: "48%" }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {LIABILITY_TYPES.map((liability) => {
                  const value = data[liability.key as keyof typeof data];
                  return (
                    <tr key={liability.key}>
                      <td className="dfs-liab-type">{liability.label}</td>
                      <td>
                        <input
                          type="text"
                          value={value.amount}
                          onChange={(e) =>
                            updateLiability(liability.key as keyof typeof data, {
                              amount: e.target.value,
                            })
                          }
                          placeholder="$"
                          className="dfs-input dfs-table-input"
                        />
                      </td>
                      <td>
                        <select
                          value={value.reserved}
                          onChange={(e) =>
                            updateLiability(liability.key as keyof typeof data, {
                              reserved: e.target.value as typeof value.reserved,
                            })
                          }
                          className="dfs-select dfs-table-select"
                        >
                          <option value="">—</option>
                          {YES_NO_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={value.notes}
                          onChange={(e) =>
                            updateLiability(liability.key as keyof typeof data, {
                              notes: e.target.value,
                            })
                          }
                          placeholder={liability.placeholder}
                          className="dfs-input dfs-table-input"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CRITICAL PATH GAPS & ACTION ITEMS SECTION ────────────────────────────────

import React from "react";
import type { Stage3Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import { GAP_STATUS_OPTIONS } from "../../constants";

interface GapItemsSectionProps {
  gapItems: Stage3Data["gapItems"];
  advisorNotes: string;
  updateGapItem: UseDealFlowFormReturn["updateGapItem"];
  updateStage3Notes: UseDealFlowFormReturn["updateStage3Notes"];
}

export function GapItemsSection({
  gapItems,
  advisorNotes,
  updateGapItem,
  updateStage3Notes,
}: GapItemsSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-teal">
          <span className="dfs-card-badge">3.7</span>
          <span className="dfs-card-title">Critical Path Gaps &amp; Action Items</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-table-wrap">
            <table className="dfs-table dfs-gap-table">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th style={{ width: "35%" }}>Issue / Gap</th>
                  <th style={{ width: "25%" }}>Owner</th>
                  <th style={{ width: "15%" }}>Due Date</th>
                  <th style={{ width: "20%" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {gapItems.map((item, index) => (
                  <tr key={index}>
                    <td className="dfs-gap-num">{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={item.issue}
                        onChange={(e) =>
                          updateGapItem(index, { issue: e.target.value })
                        }
                        placeholder="Describe gap..."
                        className="dfs-input dfs-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.owner}
                        onChange={(e) =>
                          updateGapItem(index, { owner: e.target.value })
                        }
                        placeholder="Name / team"
                        className="dfs-input dfs-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={item.dueDate}
                        onChange={(e) =>
                          updateGapItem(index, { dueDate: e.target.value })
                        }
                        className="dfs-input dfs-table-input"
                      />
                    </td>
                    <td>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateGapItem(index, {
                            status: e.target.value as typeof item.status,
                          })
                        }
                        className="dfs-select dfs-table-select"
                      >
                        <option value="">—</option>
                        {GAP_STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dfs-field" style={{ marginTop: "14px" }}>
            <label className="dfs-label">Advisor Notes</label>
            <textarea
              value={advisorNotes}
              onChange={(e) => updateStage3Notes(e.target.value)}
              placeholder="Overall observations, deal dynamics, open questions..."
              rows={3}
              className="dfs-textarea"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

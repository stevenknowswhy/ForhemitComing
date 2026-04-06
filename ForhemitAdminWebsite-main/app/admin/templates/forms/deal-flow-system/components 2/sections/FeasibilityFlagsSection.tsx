// ── FEASIBILITY RED FLAGS SECTION ────────────────────────────────────────────

import React from "react";
import type { Stage2Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import { FEASIBILITY_RED_FLAGS } from "../../constants";

interface FeasibilityFlagsSectionProps {
  data: Stage2Data["redFlags"];
  updateFeasibilityRedFlags: UseDealFlowFormReturn["updateFeasibilityRedFlags"];
}

export function FeasibilityFlagsSection({
  data,
  updateFeasibilityRedFlags,
}: FeasibilityFlagsSectionProps) {
  const toggleFlag = (key: string) => {
    const flagKey = key as keyof Omit<typeof data, "notes">;
    updateFeasibilityRedFlags({ [flagKey]: !data[flagKey] } as Partial<typeof data>);
  };

  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-blue">
          <span className="dfs-card-badge">2.5</span>
          <span className="dfs-card-title">Feasibility Red Flags</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-red-flags">
            <p className="dfs-flag-title">⚠ Check Any That Apply</p>
            <div className="dfs-checkbox-group dfs-cols-2">
              {FEASIBILITY_RED_FLAGS.map((flag) => (
                <label key={flag.key} className="dfs-checkbox-label">
                  <input
                    type="checkbox"
                    checked={data[flag.key as keyof Omit<typeof data, "notes">] as boolean}
                    onChange={() => toggleFlag(flag.key)}
                    className="dfs-checkbox"
                  />
                  <span>{flag.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="dfs-field" style={{ marginTop: "12px" }}>
            <label className="dfs-label">Red Flag Notes</label>
            <textarea
              value={data.notes}
              onChange={(e) => updateFeasibilityRedFlags({ notes: e.target.value })}
              placeholder="Describe any flagged items..."
              rows={2}
              className="dfs-textarea"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

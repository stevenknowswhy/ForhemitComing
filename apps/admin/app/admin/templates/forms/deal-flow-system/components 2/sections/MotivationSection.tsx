// ── MOTIVATION & RED FLAGS SECTION ───────────────────────────────────────────

import React from "react";
import type { Stage1Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import {
  SelectInput,
  CheckboxGroup,
} from "../inputs";
import {
  PRIMARY_MOTIVATIONS,
  ESOP_KNOWLEDGE_OPTIONS,
  STAGE1_RED_FLAGS,
} from "../../constants";

interface MotivationSectionProps {
  data: Stage1Data["motivation"];
  redFlags: Stage1Data["redFlags"];
  updateMotivation: UseDealFlowFormReturn["updateMotivation"];
  updateRedFlags: UseDealFlowFormReturn["updateRedFlags"];
}

export function MotivationSection({
  data,
  redFlags,
  updateMotivation,
  updateRedFlags,
}: MotivationSectionProps) {
  const toggleRedFlag = (key: keyof typeof redFlags) => {
    updateRedFlags({ [key]: !redFlags[key] } as Partial<typeof redFlags>);
  };

  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-navy">
          <span className="dfs-card-badge">1.5</span>
          <span className="dfs-card-title">Motivation &amp; Red Flags</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-grid dfs-grid-2">
            <div>
              <p className="dfs-section-label">Primary Driver (select top 1–2)</p>
              <CheckboxGroup
                options={PRIMARY_MOTIVATIONS.map((m) => ({ key: m.key, label: m.label }))}
                selected={data.primaryDrivers}
                onChange={(selected) => updateMotivation({ primaryDrivers: selected as typeof data.primaryDrivers })}
              />
              <div className="dfs-field" style={{ marginTop: "10px" }}>
                <label className="dfs-label">Current ESOP Knowledge</label>
                <select
                  value={data.esopKnowledge}
                  onChange={(e) =>
                    updateMotivation({ esopKnowledge: e.target.value as typeof data.esopKnowledge })
                  }
                  className="dfs-select"
                >
                  <option value="">Select...</option>
                  {ESOP_KNOWLEDGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div className="dfs-red-flags">
                <p className="dfs-flag-title">⚠ Immediate Red Flags (check if mentioned)</p>
                <div className="dfs-checkbox-group">
                  {STAGE1_RED_FLAGS.map((flag) => (
                    <label key={flag.key} className="dfs-checkbox-label">
                      <input
                        type="checkbox"
                        checked={redFlags[flag.key as keyof typeof redFlags]}
                        onChange={() => toggleRedFlag(flag.key as keyof typeof redFlags)}
                        className="dfs-checkbox"
                      />
                      <span>{flag.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

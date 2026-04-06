// ── 1042 ROLLOVER CHECKLIST SECTION ──────────────────────────────────────────

import React from "react";
import type { Stage3Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import { Checkbox } from "../inputs";

interface Rollover1042SectionProps {
  data: Stage3Data["rollover1042"];
  updateRollover1042: UseDealFlowFormReturn["updateRollover1042"];
}

const CHECKBOX_ITEMS = [
  { key: "qrpIdentified", label: "Qualified replacement property (QRP) identified" },
  { key: "timelineEstablished", label: "Investment timeline established (12-month window)" },
  { key: "frnDecision", label: "FRN vs. direct stock purchase decision made" },
  { key: "estatePlanning", label: "Estate planning coordination (grantor trust setup)" },
  { key: "cratCrut", label: "CRAT / CRUT alternatives evaluated" },
] as const;

export function Rollover1042Section({
  data,
  updateRollover1042,
}: Rollover1042SectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-teal">
          <span className="dfs-card-badge">3.6</span>
          <span className="dfs-card-title">1042 Rollover Checklist</span>
          <span className="dfs-card-note">Complete if applicable — front-load this conversation</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-grid dfs-grid-2">
            <div>
              <div className="dfs-checkbox-group" style={{ gap: "8px" }}>
                {CHECKBOX_ITEMS.map((item) => (
                  <Checkbox
                    key={item.key}
                    label={item.label}
                    checked={data[item.key as keyof typeof data] as boolean}
                    onChange={(checked) =>
                      updateRollover1042({ [item.key]: checked } as Partial<typeof data>)
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="dfs-grid dfs-grid-1" style={{ gap: "10px" }}>
                <div className="dfs-field">
                  <label className="dfs-label">QRP Identified</label>
                  <input
                    type="text"
                    value={data.qrpDetail}
                    onChange={(e) => updateRollover1042({ qrpDetail: e.target.value })}
                    placeholder="Security / instrument..."
                    className="dfs-input"
                  />
                </div>
                <div className="dfs-field">
                  <label className="dfs-label">Investment Window Start Date</label>
                  <input
                    type="date"
                    value={data.windowStartDate}
                    onChange={(e) =>
                      updateRollover1042({ windowStartDate: e.target.value })
                    }
                    className="dfs-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

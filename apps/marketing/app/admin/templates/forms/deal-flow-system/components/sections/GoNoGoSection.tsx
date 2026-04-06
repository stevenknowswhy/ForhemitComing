// ── GO/NO-GO DECISION SECTION ────────────────────────────────────────────────

import React from "react";
import type { Stage2Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";

interface GoNoGoSectionProps {
  data: Stage2Data["goNoGo"];
  updateGoNoGo: UseDealFlowFormReturn["updateGoNoGo"];
  updateSignOff: UseDealFlowFormReturn["updateSignOff"];
}

const DECISIONS = [
  {
    value: "proceed",
    label: "✓ PROCEED",
    sub: "Structure term sheet",
    className: "proceed",
  },
  {
    value: "conditional",
    label: "~ CONDITIONAL",
    sub: "Resolve open items first",
    className: "conditional",
  },
  {
    value: "pass",
    label: "✕ PASS",
    sub: "Not viable at this time",
    className: "pass",
  },
] as const;

const SIGN_OFF_ROLES = [
  { key: "leadAdvisor", label: "Lead Advisor" },
  { key: "companyCEO", label: "Company CEO" },
  { key: "esopCounsel", label: "ESOP Counsel" },
  { key: "valuationFirm", label: "Valuation Firm" },
] as const;

export function GoNoGoSection({
  data,
  updateGoNoGo,
  updateSignOff,
}: GoNoGoSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-blue">
          <span className="dfs-card-badge">2.7</span>
          <span className="dfs-card-title">Feasibility Go / No-Go Decision</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-decision-grid">
            {DECISIONS.map((decision) => (
              <label
                key={decision.value}
                className={`dfs-decision-card dfs-decision-${decision.className} ${
                  data.decision === decision.value ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="go_nogo"
                  value={decision.value}
                  checked={data.decision === decision.value}
                  onChange={() =>
                    updateGoNoGo({ decision: decision.value as typeof data.decision })
                  }
                  className="dfs-decision-radio"
                />
                <span className="dfs-decision-label">{decision.label}</span>
                <span className="dfs-decision-sub">{decision.sub}</span>
              </label>
            ))}
          </div>

          <div className="dfs-grid dfs-grid-2" style={{ marginTop: "14px" }}>
            <div className="dfs-field">
              <label className="dfs-label">Conditions / Rationale</label>
              <textarea
                value={data.conditionsRationale}
                onChange={(e) => updateGoNoGo({ conditionsRationale: e.target.value })}
                placeholder="What must be resolved, or why passing..."
                rows={2}
                className="dfs-textarea"
              />
            </div>
            <div className="dfs-field">
              <label className="dfs-label">Next Steps</label>
              <textarea
                value={data.nextSteps}
                onChange={(e) => updateGoNoGo({ nextSteps: e.target.value })}
                placeholder="Specific actions, owners, deadlines..."
                rows={2}
                className="dfs-textarea"
              />
            </div>
          </div>

          <hr className="dfs-divider" />

          <p className="dfs-section-label">Sign-Off</p>
          <div className="dfs-grid dfs-grid-4">
            {SIGN_OFF_ROLES.map((role) => (
              <div key={role.key} className="dfs-field">
                <label className="dfs-label">{role.label}</label>
                <input
                  type="text"
                  value={data.signOffs[role.key as keyof typeof data.signOffs]}
                  onChange={(e) =>
                    updateSignOff(role.key as keyof typeof data.signOffs, e.target.value)
                  }
                  placeholder="Name"
                  className="dfs-input"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

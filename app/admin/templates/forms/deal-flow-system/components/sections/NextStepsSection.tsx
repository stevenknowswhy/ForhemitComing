// ── NEXT STEPS SECTION ───────────────────────────────────────────────────────

import React from "react";
import type { Stage1Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import {
  SelectInput,
  Checkbox,
} from "../inputs";
import { TIMEZONE_OPTIONS } from "../../constants";

interface NextStepsSectionProps {
  nextSteps: Stage1Data["nextSteps"];
  internalNotes: string;
  updateNextSteps: UseDealFlowFormReturn["updateNextSteps"];
  updateStage1Notes: UseDealFlowFormReturn["updateStage1Notes"];
}

const NEXT_STEP_OPTIONS = [
  { key: "sendNDA", label: "Send NDA" },
  { key: "scheduleIntroCall", label: "Schedule intro call (60 min)" },
  { key: "requestFinancials", label: "Request financials (P&L, Balance Sheet)" },
  { key: "brokerFeeReview", label: "Broker fee agreement review" },
  { key: "passRefer", label: "PASS — Refer to another advisor" },
] as const;

export function NextStepsSection({
  nextSteps,
  internalNotes,
  updateNextSteps,
  updateStage1Notes,
}: NextStepsSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-navy">
          <span className="dfs-card-badge">1.6</span>
          <span className="dfs-card-title">Next Steps &amp; Routing</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-grid dfs-grid-2">
            <div>
              <p className="dfs-section-label">Actions Assigned</p>
              <div className="dfs-checkbox-group">
                {NEXT_STEP_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt.key}
                    label={opt.label}
                    checked={nextSteps[opt.key as keyof typeof nextSteps] as boolean}
                    onChange={(checked) =>
                      updateNextSteps({ [opt.key]: checked } as Partial<typeof nextSteps>)
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="dfs-grid dfs-grid-1" style={{ gap: "12px" }}>
                <div className="dfs-field">
                  <label className="dfs-label">Meeting Scheduled</label>
                  <input
                    type="datetime-local"
                    value={nextSteps.meetingScheduled}
                    onChange={(e) =>
                      updateNextSteps({ meetingScheduled: e.target.value })
                    }
                    className="dfs-input"
                  />
                </div>
                <SelectInput
                  label="Time Zone"
                  value={nextSteps.timezone}
                  onChange={(v) => updateNextSteps({ timezone: v })}
                  options={TIMEZONE_OPTIONS}
                />
              </div>
            </div>
          </div>

          <hr className="dfs-divider" />

          <div className="dfs-field">
            <label className="dfs-label">
              Internal Notes — Broker relationship, urgency level, gut check
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => updateStage1Notes(e.target.value)}
              placeholder="Notes visible only to advisory team..."
              rows={4}
              className="dfs-textarea"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

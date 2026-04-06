// ── SOURCE & REFERRAL SECTION ────────────────────────────────────────────────

import React from "react";
import type { Stage1Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import {
  TextInput,
  SelectInput,
  RadioGroup,
} from "../inputs";
import {
  DEAL_SOURCE_OPTIONS,
  ENGAGEMENT_LETTER_OPTIONS,
  FOUND_US_OPTIONS,
} from "../../constants";

interface SourceReferralSectionProps {
  data: Stage1Data["sourceReferral"];
  updateSourceReferral: UseDealFlowFormReturn["updateSourceReferral"];
}

export function SourceReferralSection({
  data,
  updateSourceReferral,
}: SourceReferralSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-navy">
          <span className="dfs-card-badge">1.1</span>
          <span className="dfs-card-title">Source &amp; Referral</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-grid dfs-grid-2">
            <div>
              <p className="dfs-section-label">Deal Source</p>
              <RadioGroup
                name="deal_source"
                options={DEAL_SOURCE_OPTIONS}
                value={data.dealSource}
                onChange={(v) => updateSourceReferral({ dealSource: v as typeof data.dealSource })}
              />
            </div>
            <div>
              <p className="dfs-section-label">Referral Details</p>
              <div className="dfs-grid dfs-grid-1" style={{ gap: "10px" }}>
                <TextInput
                  label="Broker Firm"
                  value={data.brokerFirm}
                  onChange={(v) => updateSourceReferral({ brokerFirm: v })}
                  placeholder="Firm name"
                />
                <TextInput
                  label="Broker Contact"
                  value={data.brokerContact}
                  onChange={(v) => updateSourceReferral({ brokerContact: v })}
                  placeholder="Name"
                />
                <SelectInput
                  label="Engagement Letter"
                  value={data.engagementLetter}
                  onChange={(v) => updateSourceReferral({ engagementLetter: v as typeof data.engagementLetter })}
                  options={ENGAGEMENT_LETTER_OPTIONS}
                />
                <SelectInput
                  label="If Direct — How Found Us"
                  value={data.foundUs}
                  onChange={(v) => updateSourceReferral({ foundUs: v as typeof data.foundUs })}
                  options={FOUND_US_OPTIONS}
                />
              </div>
            </div>
          </div>

          <div className="dfs-field" style={{ marginTop: "12px" }}>
            <label className="dfs-label">Intake By</label>
            <input
              type="text"
              value={data.intakeBy}
              onChange={(e) => updateSourceReferral({ intakeBy: e.target.value })}
              placeholder="Advisor name"
              className="dfs-input"
              style={{ maxWidth: "280px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { AdvisorTeam } from "../../types";
import { TextInput } from "../inputs";

interface AdvisorTeamSectionProps {
  advisors: AdvisorTeam;
  onUpdateField: <K extends keyof AdvisorTeam>(field: K, value: AdvisorTeam[K]) => void;
}

export function AdvisorTeamSection({
  advisors,
  onUpdateField,
}: AdvisorTeamSectionProps) {
  return (
    <div className="erm-card">
      <div className="erm-card-header">
        <span className="erm-card-title">Advisor & Lender Team</span>
      </div>
      <div className="erm-card-body">
        <div className="erm-field-grid erm-fg-3" style={{ marginBottom: 14 }}>
          <TextInput
            id="h-advisor"
            label="Lead advisor / firm"
            value={advisors.leadAdvisor}
            onChange={(v) => onUpdateField("leadAdvisor", v)}
            placeholder="Acme ESOP Advisors"
          />
          <TextInput
            id="h-attorney"
            label="ESOP attorney"
            value={advisors.esopAttorney}
            onChange={(v) => onUpdateField("esopAttorney", v)}
            placeholder="Counsel firm name"
          />
          <TextInput
            id="h-trustee"
            label="Trustee"
            value={advisors.trustee}
            onChange={(v) => onUpdateField("trustee", v)}
            placeholder="Independent trustee name"
          />
        </div>
        <div className="erm-field-grid erm-fg-3">
          <TextInput
            id="h-lender"
            label="SBA lender"
            value={advisors.sbaLender}
            onChange={(v) => onUpdateField("sbaLender", v)}
            placeholder="First Community Bank"
          />
          <TextInput
            id="h-appraiser"
            label="Appraiser / valuation firm"
            value={advisors.appraiser}
            onChange={(v) => onUpdateField("appraiser", v)}
            placeholder="Valuation firm name"
          />
          <TextInput
            id="h-tpa"
            label="TPA / administrator"
            value={advisors.tpa}
            onChange={(v) => onUpdateField("tpa", v)}
            placeholder="Plan administrator name"
          />
        </div>
      </div>
    </div>
  );
}

// ── OWNER OBJECTIVES SECTION ─────────────────────────────────────────────────

import React from "react";
import type { Stage2Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import {
  TextInput,
  SelectInput,
  NumberInput,
  CheckboxGroup,
} from "../inputs";
import {
  OWNER_OBJECTIVES,
  CONTROL_OPTIONS,
  YES_NO_OPTIONS,
} from "../../constants";

interface OwnerObjectivesSectionProps {
  data: Stage2Data["ownerObjectives"];
  updateOwnerObjectives: UseDealFlowFormReturn["updateOwnerObjectives"];
}

export function OwnerObjectivesSection({
  data,
  updateOwnerObjectives,
}: OwnerObjectivesSectionProps) {
  const objectiveKeys = OWNER_OBJECTIVES.map((o) => o.key);
  const selectedObjectives = objectiveKeys.filter(
    (key) => data[key as keyof typeof data] as boolean
  );

  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-blue">
          <span className="dfs-card-badge">2.1</span>
          <span className="dfs-card-title">Owner Objectives &amp; Transaction Profile</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-grid dfs-grid-2">
            <div>
              <p className="dfs-section-label">Primary Motivation (Rank 1–3)</p>
              <CheckboxGroup
                options={OWNER_OBJECTIVES.map((o) => ({ key: o.key, label: o.label }))}
                selected={selectedObjectives}
                onChange={(selected) => {
                  objectiveKeys.forEach((key) => {
                    updateOwnerObjectives({ [key]: selected.includes(key) } as Partial<typeof data>);
                  });
                }}
              />
            </div>
            <div>
              <p className="dfs-section-label">Owner Red Lines</p>
              <div className="dfs-grid dfs-grid-1" style={{ gap: "10px" }}>
                <SelectInput
                  label="Must retain voting control?"
                  value={data.retainControl}
                  onChange={(v) => updateOwnerObjectives({ retainControl: v as typeof data.retainControl })}
                  options={CONTROL_OPTIONS}
                />
                <TextInput
                  label="Minimum Cash at Closing ($)"
                  value={data.minCashAtClosing}
                  onChange={(v) => updateOwnerObjectives({ minCashAtClosing: v })}
                  placeholder="e.g. $4,000,000"
                />
                <SelectInput
                  label="Willing to Seller Finance?"
                  value={data.willingSellerFinance}
                  onChange={(v) => updateOwnerObjectives({ willingSellerFinance: v as typeof data.willingSellerFinance })}
                  options={YES_NO_OPTIONS}
                />
                <TextInput
                  label="Max Seller Finance Amount ($)"
                  value={data.sellerFinanceMax}
                  onChange={(v) => updateOwnerObjectives({ sellerFinanceMax: v })}
                  placeholder="e.g. $2,000,000"
                />
                <SelectInput
                  label="Employment Continuation Required?"
                  value={data.employmentContinuation}
                  onChange={(v) =>
                    updateOwnerObjectives({ employmentContinuation: v as typeof data.employmentContinuation })
                  }
                  options={YES_NO_OPTIONS}
                />
                <NumberInput
                  label="If Yes — How Many Years?"
                  value={data.employmentYears}
                  onChange={(v) => updateOwnerObjectives({ employmentYears: v })}
                  placeholder="Years"
                  min={0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

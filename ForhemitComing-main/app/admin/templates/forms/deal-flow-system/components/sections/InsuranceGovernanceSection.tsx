// ── INSURANCE & GOVERNANCE SECTION ───────────────────────────────────────────

import React from "react";
import type { Stage3Data, DDDocument } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import {
  TextInput,
  SelectInput,
} from "../inputs";
import { DD_SECTIONS, DD_STATUS_OPTIONS, TRUSTEE_TYPE_OPTIONS, YES_NO_TBD_OPTIONS } from "../../constants";

interface InsuranceGovernanceSectionProps {
  insurance: Stage3Data["insurance"];
  governance: Stage3Data["governance"];
  updateDDDocument: UseDealFlowFormReturn["updateDDDocument"];
  updateGovernance: UseDealFlowFormReturn["updateGovernance"];
}

function DDItem({
  label,
  document,
  onChange,
  critical,
}: {
  label: string;
  document: DDDocument;
  onChange: (updates: Partial<DDDocument>) => void;
  critical?: boolean;
}) {
  return (
    <div className={`dfs-dd-item ${document.checked ? "checked" : ""}`}>
      <input
        type="checkbox"
        checked={document.checked}
        onChange={(e) => onChange({ checked: e.target.checked })}
        className="dfs-dd-checkbox"
      />
      <span className="dfs-dd-text">
        {label}
        {critical && <span className="dfs-dd-critical">⚠ ESOP-SPECIFIC</span>}
      </span>
      <select
        value={document.status}
        onChange={(e) => onChange({ status: e.target.value as DDDocument["status"] })}
        className="dfs-dd-status"
      >
        <option value="">—</option>
        {DD_STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function InsuranceGovernanceSection({
  insurance,
  governance,
  updateDDDocument,
  updateGovernance,
}: InsuranceGovernanceSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-teal">
          <span className="dfs-card-badge">3.5</span>
          <span className="dfs-card-title">Insurance &amp; Governance</span>
        </div>
        <div className="dfs-card-body dfs-card-body-p0">
          {/* Insurance Review */}
          <div className="dfs-dd-section-title">Insurance Review</div>
          {DD_SECTIONS.insurance.map((item) => (
            <DDItem
              key={item.key}
              label={item.label}
              document={insurance[item.key as keyof typeof insurance]}
              onChange={(updates) =>
                updateDDDocument("insurance", item.key, updates)
              }
              critical={"critical" in item ? (item as { key: string; label: string; critical?: boolean }).critical : false}
            />
          ))}

          {/* Post-Transaction Governance */}
          <div className="dfs-dd-section-title">Post-Transaction Governance</div>
          <div className="dfs-card-body">
            <div className="dfs-grid dfs-grid-2">
              <div>
                <div className="dfs-grid dfs-grid-1" style={{ gap: "10px" }}>
                  <SelectInput
                    label="Trustee Selection"
                    value={governance.trusteeType}
                    onChange={(v) => updateGovernance({ trusteeType: v as typeof governance.trusteeType })}
                    options={TRUSTEE_TYPE_OPTIONS}
                  />
                  <SelectInput
                    label="ESOP Trustee Board Seat?"
                    value={governance.trusteeSeat}
                    onChange={(v) => updateGovernance({ trusteeSeat: v as typeof governance.trusteeSeat })}
                    options={YES_NO_TBD_OPTIONS}
                  />
                  <div className="dfs-field">
                    <label className="dfs-label">Admin Committee Structure</label>
                    <input
                      type="text"
                      value={governance.adminCommittee}
                      onChange={(e) =>
                        updateGovernance({ adminCommittee: e.target.value })
                      }
                      placeholder="Describe structure..."
                      className="dfs-input"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="dfs-grid dfs-grid-1" style={{ gap: "10px" }}>
                  <TextInput
                    label="Valuation Firm Retained"
                    value={governance.valuationFirm}
                    onChange={(v) => updateGovernance({ valuationFirm: v })}
                    placeholder="Firm name"
                  />
                  <TextInput
                    label="Recordkeeper Selected"
                    value={governance.recordkeeper}
                    onChange={(v) => updateGovernance({ recordkeeper: v })}
                    placeholder="Firm name"
                  />
                  <SelectInput
                    label="Board Representation Confirmed"
                    value={governance.boardRep}
                    onChange={(v) => updateGovernance({ boardRep: v as typeof governance.boardRep })}
                    options={YES_NO_TBD_OPTIONS}
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

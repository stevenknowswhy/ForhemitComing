// ── HR & EMPLOYEE BENEFITS DOCUMENTS SECTION ─────────────────────────────────

import React from "react";
import type { Stage3Data, DDDocument } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import { DD_SECTIONS, DD_STATUS_OPTIONS } from "../../constants";

interface HRDocumentsSectionProps {
  planDocs: Stage3Data["hrPlanDocs"];
  participantData: Stage3Data["hrParticipant"];
  compensation: Stage3Data["hrCompensation"];
  updateDDDocument: UseDealFlowFormReturn["updateDDDocument"];
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
        {critical && <span className="dfs-dd-critical">⚠ CRITICAL</span>}
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

export function HRDocumentsSection({
  planDocs,
  participantData,
  compensation,
  updateDDDocument,
}: HRDocumentsSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-teal">
          <span className="dfs-card-badge">3.2</span>
          <span className="dfs-card-title">Human Resources &amp; Employee Benefits</span>
        </div>
        <div className="dfs-card-body dfs-card-body-p0">
          {/* Plan Documents */}
          <div className="dfs-dd-section-title">
            Plan Documents <span className="dfs-dd-critical">⚠ CRITICAL</span>
          </div>
          {DD_SECTIONS.hrPlanDocs.map((item) => (
            <DDItem
              key={item.key}
              label={item.label}
              document={planDocs[item.key as keyof typeof planDocs]}
              onChange={(updates) =>
                updateDDDocument("hrPlanDocs", item.key, updates)
              }
              critical={"critical" in item ? (item as { key: string; label: string; critical?: boolean }).critical : false}
            />
          ))}

          {/* Participant Data */}
          <div className="dfs-dd-section-title">
            Participant Data <span className="dfs-dd-critical">⚠ #1 DEAL KILLER — VERIFY FIRST</span>
          </div>
          {DD_SECTIONS.hrParticipant.map((item) => (
            <DDItem
              key={item.key}
              label={item.label}
              document={participantData[item.key as keyof typeof participantData]}
              onChange={(updates) =>
                updateDDDocument("hrParticipant", item.key, updates)
              }
              critical={"critical" in item ? (item as { key: string; label: string; critical?: boolean }).critical : false}
            />
          ))}

          {/* Compensation, Classification & Testing */}
          <div className="dfs-dd-section-title">Compensation, Classification &amp; Testing</div>
          {DD_SECTIONS.hrCompensation.map((item) => (
            <DDItem
              key={item.key}
              label={item.label}
              document={compensation[item.key as keyof typeof compensation]}
              onChange={(updates) =>
                updateDDDocument("hrCompensation", item.key, updates)
              }
              critical={"critical" in item ? (item as { key: string; label: string; critical?: boolean }).critical : false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

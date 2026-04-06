// ── LEGAL & CORPORATE DOCUMENTS SECTION ──────────────────────────────────────

import React from "react";
import type { Stage3Data, DDDocument } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import { DD_SECTIONS, DD_STATUS_OPTIONS } from "../../constants";

interface LegalDocumentsSectionProps {
  data: Stage3Data["legalCorporate"];
  materialContracts: Stage3Data["materialContracts"];
  litigation: Stage3Data["litigation"];
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
        {critical && <span className="dfs-dd-critical">⚠ CHECK FIRST</span>}
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

export function LegalDocumentsSection({
  data,
  materialContracts,
  litigation,
  updateDDDocument,
}: LegalDocumentsSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-teal">
          <span className="dfs-card-badge">3.1</span>
          <span className="dfs-card-title">Legal &amp; Corporate Documents</span>
          <span className="dfs-card-note">Check off as documents are uploaded to data room</span>
        </div>
        <div className="dfs-card-body dfs-card-body-p0">
          {/* Entity Formation */}
          <div className="dfs-dd-section-title">Entity Formation &amp; Governance</div>
          {DD_SECTIONS.legalCorporate.map((item) => (
            <DDItem
              key={item.key}
              label={item.label}
              document={data[item.key as keyof typeof data]}
              onChange={(updates) =>
                updateDDDocument("legalCorporate", item.key, updates)
              }
              critical={"critical" in item ? (item as { key: string; label: string; critical?: boolean }).critical : false}
            />
          ))}

          {/* Material Contracts */}
          <div className="dfs-dd-section-title">Material Contracts</div>
          {DD_SECTIONS.materialContracts.map((item) => (
            <DDItem
              key={item.key}
              label={item.label}
              document={materialContracts[item.key as keyof typeof materialContracts]}
              onChange={(updates) =>
                updateDDDocument("materialContracts", item.key, updates)
              }
              critical={"critical" in item ? (item as { key: string; label: string; critical?: boolean }).critical : false}
            />
          ))}

          {/* Litigation & Compliance */}
          <div className="dfs-dd-section-title">Litigation &amp; Compliance</div>
          {DD_SECTIONS.litigation.map((item) => (
            <DDItem
              key={item.key}
              label={item.label}
              document={litigation[item.key as keyof typeof litigation]}
              onChange={(updates) =>
                updateDDDocument("litigation", item.key, updates)
              }
              critical={"critical" in item ? (item as { key: string; label: string; critical?: boolean }).critical : false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

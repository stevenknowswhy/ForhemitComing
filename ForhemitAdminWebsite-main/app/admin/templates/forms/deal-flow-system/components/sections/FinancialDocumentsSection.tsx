// ── FINANCIAL & TAX DOCUMENTS SECTION ────────────────────────────────────────

import React from "react";
import type { Stage3Data, DDDocument } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import { DD_SECTIONS, DD_STATUS_OPTIONS } from "../../constants";

interface FinancialDocumentsSectionProps {
  financials: Stage3Data["financials"];
  tax: Stage3Data["tax"];
  dealFinancials: Stage3Data["dealFinancials"];
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
        {critical && <span className="dfs-dd-critical">⚠ FRONT-LOAD THIS CONVERSATION</span>}
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

export function FinancialDocumentsSection({
  financials,
  tax,
  dealFinancials,
  updateDDDocument,
}: FinancialDocumentsSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-teal">
          <span className="dfs-card-badge">3.3</span>
          <span className="dfs-card-title">Financial &amp; Tax Due Diligence</span>
        </div>
        <div className="dfs-card-body dfs-card-body-p0">
          {/* Financial Statements */}
          <div className="dfs-dd-section-title">Financial Statements</div>
          {DD_SECTIONS.financials.map((item) => (
            <DDItem
              key={item.key}
              label={item.label}
              document={financials[item.key as keyof typeof financials]}
              onChange={(updates) =>
                updateDDDocument("financials", item.key, updates)
              }
              critical={"critical" in item ? (item as { key: string; label: string; critical?: boolean }).critical : false}
            />
          ))}

          {/* Tax Matters */}
          <div className="dfs-dd-section-title">Tax Matters</div>
          {DD_SECTIONS.tax.map((item) => (
            <DDItem
              key={item.key}
              label={item.label}
              document={tax[item.key as keyof typeof tax]}
              onChange={(updates) =>
                updateDDDocument("tax", item.key, updates)
              }
              critical={"critical" in item ? (item as { key: string; label: string; critical?: boolean }).critical : false}
            />
          ))}

          {/* Deal-Specific Financials */}
          <div className="dfs-dd-section-title">Deal-Specific Financials</div>
          {DD_SECTIONS.dealFinancials.map((item) => (
            <DDItem
              key={item.key}
              label={item.label}
              document={dealFinancials[item.key as keyof typeof dealFinancials]}
              onChange={(updates) =>
                updateDDDocument("dealFinancials", item.key, updates)
              }
              critical={"critical" in item ? (item as { key: string; label: string; critical?: boolean }).critical : false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

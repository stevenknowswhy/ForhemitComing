// ── ESOP STRUCTURE & FINANCING SECTION ───────────────────────────────────────

import React from "react";
import type { Stage2Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import {
  TextInput,
  SelectInput,
  NumberInput,
} from "../inputs";
import { SYNTHETIC_EQUITY_OPTIONS } from "../../constants";

interface ESOPStructureSectionProps {
  data: Stage2Data["esopStructure"];
  updateESOPStructure: UseDealFlowFormReturn["updateESOPStructure"];
}

const FINANCING_SOURCES = [
  { key: "seniorDebt", label: "Senior Debt" },
  { key: "subordinated", label: "Subordinated / Seller Note" },
  { key: "equity", label: "Equity / Secondary" },
] as const;

const FINANCING_STATUS_OPTIONS = {
  seniorDebt: ["LOI", "Commitment", "In Discussion", "None"],
  subordinated: ["Term Sheet", "In Negotiation", "None"],
  equity: ["Committed", "In Discussion", "None"],
};

export function ESOPStructureSection({
  data,
  updateESOPStructure,
}: ESOPStructureSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-blue">
          <span className="dfs-card-badge">2.4</span>
          <span className="dfs-card-title">ESOP Structure &amp; Preliminary Financing</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-grid dfs-grid-4">
            <NumberInput
              label="% Equity to ESOP"
              value={data.pctToEsop}
              onChange={(v) => updateESOPStructure({ pctToEsop: v })}
              placeholder="% (30–100)"
              min={1}
              max={100}
            />
            <NumberInput
              label="Initial Tranche (if phased)"
              value={data.initialTranche}
              onChange={(v) => updateESOPStructure({ initialTranche: v })}
              placeholder="%"
              min={1}
              max={100}
            />
            <TextInput
              label="Purchase Price ($)"
              value={data.purchasePrice}
              onChange={(v) => updateESOPStructure({ purchasePrice: v })}
              placeholder="Total consideration"
            />
            <SelectInput
              label="Synthetic Equity"
              value={data.syntheticEquity}
              onChange={(v) => updateESOPStructure({ syntheticEquity: v as typeof data.syntheticEquity })}
              options={SYNTHETIC_EQUITY_OPTIONS}
            />
          </div>

          <hr className="dfs-divider" />

          <p className="dfs-section-label">Financing Stack</p>
          <div className="dfs-table-wrap">
            <table className="dfs-table dfs-financing-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Amount ($)</th>
                  <th>Rate / Terms</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {FINANCING_SOURCES.map((source) => (
                  <tr key={source.key}>
                    <td>{source.label}</td>
                    <td>
                      <input
                        type="text"
                        value={data.financingStack[source.key as keyof typeof data.financingStack].amount}
                        onChange={(e) =>
                          updateESOPStructure({
                            financingStack: {
                              ...data.financingStack,
                              [source.key]: {
                                ...data.financingStack[source.key as keyof typeof data.financingStack],
                                amount: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="$"
                        className="dfs-input dfs-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={data.financingStack[source.key as keyof typeof data.financingStack].terms}
                        onChange={(e) =>
                          updateESOPStructure({
                            financingStack: {
                              ...data.financingStack,
                              [source.key]: {
                                ...data.financingStack[source.key as keyof typeof data.financingStack],
                                terms: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="e.g. 6% / 7yr"
                        className="dfs-input dfs-table-input"
                      />
                    </td>
                    <td>
                      <select
                        value={data.financingStack[source.key as keyof typeof data.financingStack].status}
                        onChange={(e) =>
                          updateESOPStructure({
                            financingStack: {
                              ...data.financingStack,
                              [source.key]: {
                                ...data.financingStack[source.key as keyof typeof data.financingStack],
                                status: e.target.value,
                              },
                            },
                          })
                        }
                        className="dfs-select dfs-table-select"
                      >
                        <option value="">Status...</option>
                        {FINANCING_STATUS_OPTIONS[source.key].map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

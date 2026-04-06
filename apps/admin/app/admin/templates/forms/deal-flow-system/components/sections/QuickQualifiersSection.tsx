// ── QUICK QUALIFIERS SECTION ─────────────────────────────────────────────────

import React from "react";
import type { Stage1Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import {
  SelectInput,
  NumberInput,
  Checkbox,
} from "../inputs";
import {
  HEADCOUNT_OPTIONS,
  REVENUE_OPTIONS,
  TIMELINE_OPTIONS,
  OWNERSHIP_OPTIONS,
} from "../../constants";

interface QuickQualifiersSectionProps {
  data: Stage1Data["quickQualifiers"];
  updateQuickQualifiers: UseDealFlowFormReturn["updateQuickQualifiers"];
  updateOwnership: UseDealFlowFormReturn["updateOwnership"];
}

export function QuickQualifiersSection({
  data,
  updateQuickQualifiers,
  updateOwnership,
}: QuickQualifiersSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-navy">
          <span className="dfs-card-badge">1.4</span>
          <span className="dfs-card-title">Quick Qualifiers</span>
          <span className="dfs-card-note">The &quot;Do We Even Have a Conversation?&quot; Test</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-grid dfs-grid-2">
            <div>
              <div className="dfs-grid dfs-grid-1" style={{ gap: "14px" }}>
                <SelectInput
                  label="Approximate Headcount"
                  value={data.headcountRange}
                  onChange={(v) => updateQuickQualifiers({ headcountRange: v as typeof data.headcountRange })}
                  options={HEADCOUNT_OPTIONS}
                />
                <SelectInput
                  label="Annual Revenue"
                  value={data.revenueRange}
                  onChange={(v) => updateQuickQualifiers({ revenueRange: v as typeof data.revenueRange })}
                  options={REVENUE_OPTIONS}
                />
                <div className="dfs-field">
                  <label className="dfs-label">Approximate EBITDA ($)</label>
                  <input
                    type="text"
                    value={data.approxEbitda}
                    onChange={(e) => updateQuickQualifiers({ approxEbitda: e.target.value })}
                    placeholder="e.g. $3,200,000"
                    className="dfs-input"
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="dfs-grid dfs-grid-1" style={{ gap: "14px" }}>
                <div className="dfs-field">
                  <label className="dfs-label">Ownership Structure</label>
                  <div className="dfs-checkbox-group dfs-cols-2">
                    {OWNERSHIP_OPTIONS.map((opt) => (
                      <Checkbox
                        key={opt.key}
                        label={opt.label}
                        checked={data.ownership[opt.key as keyof typeof data.ownership]}
                        onChange={(checked) =>
                          updateOwnership({ [opt.key]: checked } as Partial<
                            typeof data.ownership
                          >)
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="dfs-field">
                  <label className="dfs-label">% Equity Being Considered for ESOP</label>
                  <div className="dfs-inline-row">
                    <input
                      type="number"
                      value={data.pctEquity || ""}
                      onChange={(e) =>
                        updateQuickQualifiers({ pctEquity: Number(e.target.value) })
                      }
                      placeholder="%"
                      min={1}
                      max={100}
                      className="dfs-input"
                      style={{ width: "80px" }}
                    />
                    <span>%</span>
                    <label className="dfs-checkbox-label">
                      <input
                        type="checkbox"
                        checked={data.justExploring}
                        onChange={(e) =>
                          updateQuickQualifiers({ justExploring: e.target.checked })
                        }
                        className="dfs-checkbox"
                      />
                      <span>Just exploring options</span>
                    </label>
                  </div>
                </div>
                <SelectInput
                  label="Target Timeline"
                  value={data.timeline}
                  onChange={(v) => updateQuickQualifiers({ timeline: v as typeof data.timeline })}
                  options={TIMELINE_OPTIONS}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

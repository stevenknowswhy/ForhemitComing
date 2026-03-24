// ── DEAL FLOW OUTPUT / SUMMARY SECTION ───────────────────────────────────────

import React from "react";
import type { DealFlowInputs } from "../../types";
import { calculateTotalScore, getRecommendationLabel } from "../../lib/calculations";

interface DealFlowOutputProps {
  inputs: DealFlowInputs;
  onBack: () => void;
}

export function DealFlowOutput({ inputs, onBack }: DealFlowOutputProps) {
  const score = calculateTotalScore(inputs.stage2.scores);
  const recommendation = getRecommendationLabel(
    score >= 16 ? "proceed" : score >= 9 ? "conditional" : "pass"
  );

  const getCompletedDDCount = () => {
    let count = 0;
    const sections = [
      inputs.stage3.legalCorporate,
      inputs.stage3.materialContracts,
      inputs.stage3.litigation,
      inputs.stage3.hrPlanDocs,
      inputs.stage3.hrParticipant,
      inputs.stage3.hrCompensation,
      inputs.stage3.financials,
      inputs.stage3.tax,
      inputs.stage3.dealFinancials,
      inputs.stage3.insurance,
    ];
    sections.forEach((section) => {
      Object.values(section).forEach((doc) => {
        if (doc.checked) count++;
      });
    });
    return count;
  };

  const totalDDItems = 63; // Approximate total DD items

  return (
    <div className="dfs-output">
      <div className="dfs-output-header">
        <h2>Deal Flow Summary</h2>
        <p>Complete overview of the ESOP transaction pipeline</p>
      </div>

      <div className="dfs-output-grid">
        {/* Meta Info */}
        <div className="dfs-output-card">
          <h3>Deal Information</h3>
          <div className="dfs-output-row">
            <span>Project Code:</span>
            <strong>{inputs.meta.projectCode || "—"}</strong>
          </div>
          <div className="dfs-output-row">
            <span>Company:</span>
            <strong>{inputs.stage1.businessIdentity.companyName || "—"}</strong>
          </div>
          <div className="dfs-output-row">
            <span>Industry:</span>
            <strong>{inputs.stage1.businessIdentity.industry || "—"}</strong>
          </div>
          <div className="dfs-output-row">
            <span>Lead Advisor:</span>
            <strong>{inputs.meta.leadAdvisor || "—"}</strong>
          </div>
          <div className="dfs-output-row">
            <span>Status:</span>
            <strong>{inputs.meta.status || "—"}</strong>
          </div>
        </div>

        {/* Feasibility Score */}
        <div className="dfs-output-card">
          <h3>Feasibility Assessment</h3>
          <div className="dfs-output-score">
            <span className="dfs-output-score-value">{score}</span>
            <span className="dfs-output-score-denom">/ 20</span>
          </div>
          <div className="dfs-output-recommendation">
            {recommendation}
          </div>
          {inputs.stage2.goNoGo.decision && (
            <div className="dfs-output-decision">
              Decision: {inputs.stage2.goNoGo.decision.toUpperCase()}
            </div>
          )}
        </div>

        {/* DD Progress */}
        <div className="dfs-output-card">
          <h3>Due Diligence Progress</h3>
          <div className="dfs-output-dd-progress">
            <div className="dfs-output-dd-bar">
              <div
                className="dfs-output-dd-fill"
                style={{ width: `${(getCompletedDDCount() / totalDDItems) * 100}%` }}
              />
            </div>
            <span>
              {getCompletedDDCount()} / {totalDDItems} items checked
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dfs-output-card">
          <h3>Quick Stats</h3>
          <div className="dfs-output-row">
            <span>Years in Business:</span>
            <strong>{inputs.stage1.businessIdentity.yearsInBusiness || "—"}</strong>
          </div>
          <div className="dfs-output-row">
            <span>Est. EBITDA:</span>
            <strong>{inputs.stage1.quickQualifiers.approxEbitda || "—"}</strong>
          </div>
          <div className="dfs-output-row">
            <span>ESOP %:</span>
            <strong>{inputs.stage2.esopStructure.pctToEsop}%</strong>
          </div>
          <div className="dfs-output-row">
            <span>Target Timeline:</span>
            <strong>{inputs.stage1.quickQualifiers.timeline || "—"}</strong>
          </div>
        </div>
      </div>

      <div className="dfs-output-actions">
        <button onClick={onBack} className="dfs-btn-secondary">
          ← Back to Form
        </button>
        <button onClick={() => window.print()} className="dfs-btn-primary">
          🖨 Print / Save PDF
        </button>
      </div>
    </div>
  );
}

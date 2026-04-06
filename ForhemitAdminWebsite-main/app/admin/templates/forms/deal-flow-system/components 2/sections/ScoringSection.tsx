// ── FEASIBILITY SCORING MATRIX SECTION ───────────────────────────────────────

import React from "react";
import type { Stage2Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import { SCORING_CRITERIA, SCORE_MAX } from "../../constants";
import {
  calculateTotalScore,
  calculateScorePercentage,
  getScoreColor,
  getRecommendationLabel,
} from "../../lib/calculations";

interface ScoringSectionProps {
  data: Stage2Data["scores"];
  updateScores: UseDealFlowFormReturn["updateScores"];
}

export function ScoringSection({ data, updateScores }: ScoringSectionProps) {
  const totalScore = calculateTotalScore(data);
  const percentage = calculateScorePercentage(totalScore);
  const colorClass = getScoreColor(totalScore);
  const recommendation = getRecommendationLabel(
    totalScore >= 16 ? "proceed" : totalScore >= 9 ? "conditional" : "pass"
  );

  const updateScore = (key: keyof typeof data, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= SCORE_MAX) {
      updateScores({ [key]: num } as Partial<typeof data>);
    } else if (value === "") {
      updateScores({ [key]: 0 } as Partial<typeof data>);
    }
  };

  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-blue">
          <span className="dfs-card-badge">2.6</span>
          <span className="dfs-card-title">Feasibility Scoring Matrix</span>
          <span className="dfs-card-note">
            Score each 1–5 (5 = optimal) · Target ≥ 16 to advance
          </span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-score-matrix">
            {SCORING_CRITERIA.map((criterion) => (
              <div key={criterion.key} className="dfs-score-row">
                <div className="dfs-score-label">{criterion.label}</div>
                <div className="dfs-score-input-cell">
                  <input
                    type="number"
                    value={data[criterion.key as keyof typeof data] || ""}
                    onChange={(e) => updateScore(criterion.key as keyof typeof data, e.target.value)}
                    min={1}
                    max={SCORE_MAX}
                    placeholder="—"
                    className="dfs-score-input"
                  />
                  <span className="dfs-score-denom">/ {SCORE_MAX}</span>
                </div>
              </div>
            ))}
            <div className="dfs-score-row dfs-score-total-row">
              <div className="dfs-score-label">TOTAL SCORE</div>
              <div className="dfs-score-input-cell">
                <span className={`dfs-score-total dfs-score-${colorClass}`}>
                  {totalScore > 0 ? `${totalScore} / 20` : "— / 20"}
                </span>
              </div>
            </div>
          </div>

          <div className="dfs-score-bar">
            <div className="dfs-score-track">
              <div
                className="dfs-score-fill"
                style={{
                  width: `${percentage}%`,
                  background:
                    totalScore >= 16
                      ? "linear-gradient(90deg, #27ae60, #2ecc71)"
                      : totalScore >= 9
                      ? "linear-gradient(90deg, #f39c12, #f1c40f)"
                      : "linear-gradient(90deg, #e74c3c, #c0392b)",
                }}
              />
            </div>
            <div className="dfs-score-legend">
              <span>1–8: Pass / Consider alternatives</span>
              <span>9–15: Fix issues first</span>
              <span>16–20: Proceed to Due Diligence</span>
            </div>
          </div>

          {totalScore > 0 && (
            <div className={`dfs-score-recommendation dfs-score-${colorClass}`}>
              Recommendation: {recommendation}
            </div>
          )}

          <div className="dfs-field" style={{ marginTop: "12px" }}>
            <label className="dfs-label">Scoring Notes</label>
            <textarea
              value={data.notes}
              onChange={(e) => updateScores({ notes: e.target.value })}
              placeholder="Rationale for scores, conditions, context..."
              rows={2}
              className="dfs-textarea"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STAGE INDICATOR (PLATE) COMPONENT ────────────────────────────────────────

import React from "react";
import { STAGES } from "../../constants";

interface StageIndicatorProps {
  currentStage: number;
  onStageClick?: (stage: number) => void;
}

export function StageIndicator({ currentStage, onStageClick }: StageIndicatorProps) {
  return (
    <div className="dfs-stage-nav">
      {STAGES.map((stage, index) => {
        const isActive = index + 1 === currentStage;
        const isDone = index + 1 < currentStage;
        const isClickable = onStageClick && index + 1 <= currentStage;

        return (
          <button
            key={stage.id}
            type="button"
            className={`dfs-stage-btn ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
            onClick={() => isClickable && onStageClick?.(index + 1)}
            disabled={!isClickable}
          >
            <span className="dfs-stage-num">Stage {stage.id}</span>
            <span className="dfs-stage-title">{stage.label}</span>
            <span className="dfs-stage-subtitle">{stage.subtitle}</span>
          </button>
        );
      })}
    </div>
  );
}

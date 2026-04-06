"use client";

import { PipelineStage, STAGE_STYLES } from "../../types";

// ============================================
// Stage Badge Component
// ============================================

interface StageBadgeProps {
  stage: PipelineStage | string;
  size?: "sm" | "md";
}

export function StageBadge({ stage, size = "md" }: StageBadgeProps) {
  const style = STAGE_STYLES[stage as PipelineStage] || {
    color: "#94a3b8",
    bg: "#1e293b",
    borderColor: "#94a3b840",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-[11px]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: style.bg,
        color: style.color,
        borderColor: style.borderColor,
      }}
    >
      <span
        className="rounded-full"
        style={{
          width: size === "sm" ? 4 : 6,
          height: size === "sm" ? 4 : 6,
          backgroundColor: style.color,
        }}
      />
      {stage}
    </span>
  );
}

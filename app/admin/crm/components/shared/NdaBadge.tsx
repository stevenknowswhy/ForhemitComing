"use client";

import { NdaStatus } from "../../types";

// ============================================
// NDA Badge Component
// ============================================

interface NdaBadgeProps {
  status: NdaStatus | string;
  size?: "sm" | "md";
}

const STATUS_STYLES: Record<string, { bg: string; color: string; borderColor: string }> = {
  Signed: {
    bg: "#0d4a2a",
    color: "#2dd882",
    borderColor: "#1a8f52",
  },
  Pending: {
    bg: "#7a4f0a",
    color: "#f5a623",
    borderColor: "#f5a623",
  },
  None: {
    bg: "#162019",
    color: "#8aab96",
    borderColor: "#2a4035",
  },
};

export function NdaBadge({ status, size = "md" }: NdaBadgeProps) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.None;

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[9px]",
    md: "px-2 py-1 text-[10px]",
  };

  return (
    <span
      className={`inline-block rounded font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.borderColor}`,
      }}
    >
      {status}
    </span>
  );
}

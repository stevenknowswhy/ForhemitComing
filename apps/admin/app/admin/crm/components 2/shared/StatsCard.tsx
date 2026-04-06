"use client";

import { ReactNode } from "react";

// ============================================
// Stats Card Component
// ============================================

interface StatsCardProps {
  label: string;
  value: number | string;
  subtitle: string;
  color?: string;
  active?: boolean;
  onClick?: () => void;
}

export function StatsCard({
  label,
  value,
  subtitle,
  color = "#2dd882",
  active = false,
  onClick,
}: StatsCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex-1 min-w-[140px] px-5 py-3.5 border-r border-[var(--border)]
        cursor-pointer transition-colors last:border-r-0
        ${active ? "bg-[#0d4a2a]" : "hover:bg-[var(--surface3)]"}
      `}
    >
      <div
        className={`text-[10px] uppercase tracking-[1.5px] mb-1 ${
          active ? "text-[#1a8f52]" : "text-[var(--text3)]"
        }`}
      >
        {label}
      </div>
      <div
        className="text-[22px] font-semibold"
        style={{ fontFamily: "var(--serif)", color }}
      >
        {value}
      </div>
      <div className="text-[10px] text-[var(--text3)] mt-0.5">{subtitle}</div>
    </div>
  );
}

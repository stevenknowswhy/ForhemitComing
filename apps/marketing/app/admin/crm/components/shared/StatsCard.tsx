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
        shrink-0 snap-start border-r border-[var(--border)] px-4 py-3.5 transition-colors last:border-r-0
        w-[min(46vw,11rem)] sm:w-[min(42vw,12rem)] md:flex-1 md:min-w-[7.5rem] md:w-auto md:max-w-none md:px-5
        ${onClick ? "cursor-pointer" : "cursor-default"}
        ${active ? "bg-[#0d4a2a]" : onClick ? "hover:bg-[var(--surface3)]" : ""}
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

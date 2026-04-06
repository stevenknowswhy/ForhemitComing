"use client";

import { SORT_OPTIONS } from "../../constants";

// ============================================
// Sort Select Component
// ============================================

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-md
        px-3 py-2 text-[12px] text-[var(--text2)] font-mono
        focus:outline-none focus:border-[#1a8f52]
        cursor-pointer"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

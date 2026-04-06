"use client";

import { Search } from "lucide-react";

// ============================================
// Search Input Component
// ============================================

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) {
  return (
    <div className="relative flex-1 max-w-[400px]">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)]"
        size={14}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-md
          py-2 pl-9 pr-3 text-[12px] text-[var(--text)] font-mono
          placeholder:text-[var(--text3)]
          focus:outline-none focus:border-[#1a8f52] focus:ring-1 focus:ring-[#1a8f52]/10
          transition-all"
      />
    </div>
  );
}

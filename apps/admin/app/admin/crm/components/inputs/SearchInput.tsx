"use client";

import { AdminSearchInput } from "@/app/admin/components/AdminSearchInput";
import { cn } from "@/lib/utils";

// ============================================
// Search Input Component (CRM)
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
    <AdminSearchInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={placeholder}
      className="flex-1 min-w-0 max-w-full sm:max-w-[400px]"
      iconLeftClassName="left-3.5 h-[13px] w-[13px] text-[var(--text3)]"
      clearButtonClassName="text-[var(--text3)] hover:bg-[var(--surface2)] hover:text-[var(--text)] focus-visible:ring-[var(--green-dim)]"
      inputClassName={cn(
        "rounded-md border border-[var(--border)] bg-[var(--surface)] font-mono text-[11px] text-[var(--text)] sm:text-[12px]",
        "py-2 max-[375px]:py-1.5",
        "placeholder:text-[var(--text3)]",
        "focus:border-[var(--green-dim)] focus:ring-1 focus:ring-[var(--green-muted)]"
      )}
    />
  );
}

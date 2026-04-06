"use client";

import { Search, X } from "lucide-react";

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
  const hasValue = value.length > 0;

  return (
    <div className="relative min-w-0 w-full flex-1 sm:max-w-[min(100%,28rem)]">
      {!hasValue && (
        <Search
          className="pointer-events-none absolute left-3 top-1/2 z-[1] size-[16px] -translate-y-1/2 text-[var(--text3)]"
          aria-hidden
        />
      )}
      <input
        type="text"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "crm-search-input w-full min-h-[44px] min-w-0 rounded-md border border-[var(--border)] bg-[var(--surface)] font-mono text-[var(--text)] transition-all",
          "text-base sm:min-h-0 sm:text-[12px]",
          "placeholder:text-[var(--text3)]",
          "focus:border-[#1a8f52] focus:outline-none focus:ring-1 focus:ring-[#1a8f52]/10",
          hasValue ? "crm-search-input--filled" : "crm-search-input--empty",
        ].join(" ")}
      />
      {hasValue && (
        <button
          type="button"
          className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-[var(--text3)] hover:bg-[var(--surface3)] hover:text-[var(--text)]"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <X className="size-4 shrink-0" aria-hidden />
        </button>
      )}
    </div>
  );
}

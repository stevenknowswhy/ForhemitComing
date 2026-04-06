"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// Shared admin search field: leading search icon
// when empty; clear (X) on the right when typing.
// ============================================

export type AdminSearchInputProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  "aria-label"?: string;
  id?: string;
  name?: string;
  className?: string;
  /** Base input styles — omit horizontal padding (handled internally). */
  inputClassName?: string;
  /** Override left icon position/color (Tailwind classes). */
  iconLeftClassName?: string;
  /** Override clear button (Tailwind classes). */
  clearButtonClassName?: string;
};

export function AdminSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  "aria-label": ariaLabel,
  id,
  name,
  className,
  inputClassName,
  iconLeftClassName,
  clearButtonClassName,
}: AdminSearchInputProps) {
  const hasValue = value.trim().length > 0;

  return (
    <div className={cn("relative min-w-0", className)}>
      {!hasValue && (
        <Search
          className={cn(
            "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757c7d]",
            iconLeftClassName
          )}
          aria-hidden
        />
      )}
      <input
        id={id}
        name={name}
        type="text"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          "w-full py-2.5 text-sm transition-[padding] placeholder:text-neutral-500",
          hasValue ? "pl-3 pr-11" : "pl-11 pr-3",
          inputClassName
        )}
      />
      {hasValue && (
        <button
          type="button"
          className={cn(
            "absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[#757c7d] hover:bg-black/[0.06] hover:text-[#2d3435] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4c635d]/30 focus-visible:ring-offset-1",
            clearButtonClassName
          )}
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" strokeWidth={2} aria-hidden />
        </button>
      )}
    </div>
  );
}

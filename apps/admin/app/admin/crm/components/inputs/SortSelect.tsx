"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "../../constants";

// ============================================
// Sort Select Component
// ============================================

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !mounted) return;
    if (typeof window === "undefined" || window.matchMedia("(min-width: 1024px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, mounted]);

  const mobileSheet =
    mounted &&
    open &&
    typeof document !== "undefined" &&
    createPortal(
      <>
        <button
          type="button"
          className="fixed inset-0 z-[130] bg-slate-900/40 lg:hidden"
          aria-label="Close sort options"
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-[135] lg:hidden",
            "rounded-t-2xl border border-[var(--border)] border-b-0 bg-[var(--surface)] shadow-[0_-8px_32px_rgba(0,0,0,0.12)]",
            "pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Sort options"
        >
          <div className="mx-auto mb-2 h-1 w-10 shrink-0 rounded-full bg-[var(--border2)]" aria-hidden />
          <p className="px-4 pb-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text3)]">
            Sort by
          </p>
          <ul
            className="max-h-[min(50vh,320px)] overflow-y-auto overscroll-contain px-2 pb-2"
            role="listbox"
          >
            {SORT_OPTIONS.map((opt) => {
              const selected = opt.value === value;
              return (
                <li key={opt.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-3.5 text-left text-[15px] leading-snug text-[var(--text)]",
                      "min-h-[48px] hover:bg-[var(--surface2)] active:bg-[var(--surface3)]",
                      selected && "bg-emerald-50 font-medium text-emerald-900"
                    )}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      {selected ? (
                        <Check className="h-5 w-5 text-emerald-700" aria-hidden />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">{opt.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </>,
      document.body
    );

  return (
    <div className="relative min-w-0 flex-1 lg:flex-initial lg:max-w-none">
      {/* Mobile / tablet: opens bottom sheet (avoids overflow:hidden clipping in CRM layout) */}
      <div className="relative lg:hidden">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex min-h-[44px] w-full items-center justify-between gap-2 rounded-md border border-[var(--border)]",
            "bg-[var(--surface)] px-3 py-2 text-left text-[12px] font-mono text-[var(--text2)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green-dim)] focus-visible:ring-offset-1"
          )}
        >
          <span className="min-w-0 truncate">{current?.label ?? "Sort"}</span>
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 opacity-70 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>
        {mobileSheet}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "hidden w-full min-h-[44px] cursor-pointer rounded-md border border-[var(--border)] bg-[var(--surface)] lg:block",
          "px-3 py-2 text-[12px] font-mono text-[var(--text2)]",
          "focus:border-[var(--green-dim)] focus:outline-none"
        )}
        aria-label="Sort companies"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

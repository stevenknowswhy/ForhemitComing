"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { SORT_OPTIONS } from "../../constants";

/** When portaled to `body`, nodes are outside `.crm-container` where CRM tokens live — copy them here. */
const CRM_TOKEN_NAMES = [
  "--bg",
  "--surface",
  "--surface2",
  "--surface3",
  "--border",
  "--border2",
  "--text",
  "--text2",
  "--text3",
  "--green",
  "--green-dim",
] as const;

const FALLBACK_TOKENS: Record<(typeof CRM_TOKEN_NAMES)[number], string> = {
  "--bg": "#0a0f0d",
  "--surface": "#111a15",
  "--surface2": "#162019",
  "--surface3": "#1a2720",
  "--border": "#1e3025",
  "--border2": "#2a4035",
  "--text": "#e8f5ed",
  "--text2": "#8aab96",
  "--text3": "#4d6b58",
  "--green": "#2dd882",
  "--green-dim": "#1a8f52",
};

function readCrmTokensForPortal(): CSSProperties {
  const el = document.querySelector(".crm-container");
  const cs = el ? getComputedStyle(el) : null;
  const out: Record<string, string> = {};
  for (const name of CRM_TOKEN_NAMES) {
    const raw = cs?.getPropertyValue(name).trim();
    out[name] = raw || FALLBACK_TOKENS[name];
  }
  return out as CSSProperties;
}

// ============================================
// Sort Select Component
// ============================================

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  /** Extra classes on the outer wrapper (e.g. min-w-0 flex-1) */
  className?: string;
}

export function SortSelect({ value, onChange, className = "" }: SortSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const label = SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Sort";

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
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, mounted]);

  const portalTokens: CSSProperties = open ? readCrmTokensForPortal() : {};

  const mobileSheet =
    open && mounted
      ? createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[130] bg-black/40 lg:hidden"
              aria-label="Close sort options"
              onClick={() => setOpen(false)}
            />
            <div
              className="crm-sort-mobile-sheet fixed inset-x-0 bottom-0 z-[135] rounded-t-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-2xl lg:hidden"
              style={{
                ...portalTokens,
                paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
                isolation: "isolate",
              }}
              role="dialog"
              aria-label="Sort by"
            >
              <div className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-[var(--border)]" />
              <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wide text-[var(--text3)]">
                Sort by
              </p>
              <ul className="max-h-[min(50vh,320px)] overflow-y-auto overscroll-contain">
                {SORT_OPTIONS.map((opt) => {
                  const active = opt.value === value;
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        className={[
                          "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3.5 text-left text-[15px] text-[var(--text)]",
                          active ? "bg-[var(--surface3)] font-medium" : "hover:bg-[var(--surface2)]",
                        ].join(" ")}
                        onClick={() => {
                          onChange(opt.value);
                          setOpen(false);
                        }}
                      >
                        <span className="min-w-0 flex-1">{opt.label}</span>
                        {active ? <Check className="size-5 shrink-0 text-[#1a8f52]" aria-hidden /> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <div className={`min-w-0 ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort"
        className="hidden h-11 w-full min-w-[12rem] cursor-pointer rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 font-mono text-[12px] text-[var(--text2)] focus:border-[#1a8f52] focus:outline-none lg:block"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-left font-mono text-base text-[var(--text2)] focus:border-[#1a8f52] focus:outline-none focus:ring-1 focus:ring-[#1a8f52]/10 sm:text-[12px] lg:hidden"
      >
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <ChevronDown className="size-4 shrink-0 text-[var(--text3)]" aria-hidden />
      </button>

      {mobileSheet}
    </div>
  );
}

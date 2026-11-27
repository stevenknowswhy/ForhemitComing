// Visual tokens for the pipeline board, exactly per
// POLISH-SPEC-pipeline-v2-2026-11-26: light theme, one accent (Forhemit
// green), off-white canvas, white cards; color reserved for status,
// value and overdue — never decoration. Dates, counts and names stay
// near-black; grey is for labels only.

import type { CSSProperties } from "react";

export const INK = "#111827";
export const SECONDARY = "#475467";
export const LABEL = "#667085";
export const BORDER = "#E5E8EB";
export const CANVAS = "#F4F6F8";
export const ACCENT = "#0F5132";
export const ACCENT_TINT = "#E7F4EC";

export type PillTone = "red" | "amber" | "green" | "grey" | "slate";

const PILL_TONES: Record<PillTone, { bg: string; fg: string }> = {
  red: { bg: "#FDECEC", fg: "#B3261E" },
  amber: { bg: "#FFF4D6", fg: "#8A5A00" },
  green: { bg: ACCENT_TINT, fg: ACCENT },
  grey: { bg: "#EEF1F4", fg: SECONDARY },
  slate: { bg: "#E8EDF3", fg: "#415162" },
};

/** Status pill: soft tinted background, darker text, 999px radius,
 *  never a full-saturation fill (polish spec, card slot 2). */
export function pillStyle(tone: PillTone): CSSProperties {
  const t = PILL_TONES[tone];
  return {
    background: t.bg,
    color: t.fg,
    borderRadius: 999,
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
    lineHeight: 1.5,
  };
}

/** Footer time chip — same pill family, used for the DealFlow ramp:
 *  green (on track) / amber (approaching or due) / red (overdue, FAIL,
 *  past Day 120). */
export function chipStyle(tone: PillTone): CSSProperties {
  return { ...pillStyle(tone), fontVariantNumeric: "tabular-nums" };
}

export const NUMERIC: CSSProperties = { fontVariantNumeric: "tabular-nums" };

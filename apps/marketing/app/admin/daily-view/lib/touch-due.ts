// Touch-due computation for the TOF pilot (Backend Step 6).
//
// Model (exact, as ruled for Step 6):
// - Days are WHOLE days in Pacific time (America/Los_Angeles) between the
//   Pacific calendar date of the relevant touch's sent_at and today's
//   Pacific calendar date. Time-of-day never counts as a partial day.
// - No touches sent        -> Touch 1 is due.
// - Touch 1 only           -> Touch 2 is due when age(Touch 1) is 4-5 days,
//                             overdue when age(Touch 1) > 5 days, and
//                             waiting when age(Touch 1) < 4 days.
// - Touch 1 + Touch 2 sent -> Touch 3 is due when age(Touch 1) is 12-14
//                             days, overdue when > 14, waiting when < 12.
//                             (The Touch 3 window is anchored on Touch 1,
//                             per the spec's "Day 12-14 after Touch 1".)
// - All three touches sent -> nothing due (state "complete").
//
// Known spec discrepancy (flagged for Stefano, NOT silently resolved):
// the spec's Step 6 verify example says "Touch 1 nine days ago shows
// Touch 3 due, not Touch 2". Under the model above, a lone Touch 1 at
// day 9 is Touch 2 OVERDUE — Touch 3 cannot be due before Touch 2 has
// been sent. This function follows the window model; the example needs
// a ruling (see STEP6-REPORT.md).
//
// Pure function: no fetching, no env, `now` is injected for testing.

import type { OutreachTouchRow, TouchDueInfo } from "../types";

const PT = "America/Los_Angeles";

/** Pacific calendar date (YYYY-MM-DD) for an instant. */
function ptDateString(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PT,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** Whole days between two instants, measured on Pacific calendar dates. */
export function wholeDaysPt(from: Date, to: Date): number {
  const a = Date.parse(`${ptDateString(from)}T00:00:00Z`);
  const b = Date.parse(`${ptDateString(to)}T00:00:00Z`);
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

export function computeTouchDue(
  touches: Pick<OutreachTouchRow, "touch_no" | "sent_at">[],
  now: Date = new Date()
): TouchDueInfo {
  const sent = new Set(touches.map((t) => t.touch_no));
  const first = touches
    .filter((t) => t.touch_no === 1)
    .sort((a, b) => a.sent_at.localeCompare(b.sent_at))[0];
  // Anchor on Touch 1; if data ever has later touches without Touch 1,
  // fall back to the earliest touch so ages stay meaningful.
  const anchor =
    first ??
    [...touches].sort((a, b) => a.sent_at.localeCompare(b.sent_at))[0];
  const age = anchor ? wholeDaysPt(new Date(anchor.sent_at), now) : null;

  if (sent.size === 0) {
    return { nextTouch: 1, state: "due", daysSinceFirstTouch: null };
  }
  if (sent.has(1) && sent.has(2) && sent.has(3)) {
    return { nextTouch: null, state: "complete", daysSinceFirstTouch: age };
  }
  if (sent.has(2)) {
    // Next is Touch 3, window anchored on Touch 1 age: 12-14 due.
    const days = age ?? 0;
    return {
      nextTouch: 3,
      state: days > 14 ? "overdue" : days >= 12 ? "due" : "waiting",
      daysSinceFirstTouch: age,
    };
  }
  // Next is Touch 2 (Touch 1 sent, Touch 2 not): window 4-5 due.
  const days = age ?? 0;
  return {
    nextTouch: 2,
    state: days > 5 ? "overdue" : days >= 4 ? "due" : "waiting",
    daysSinceFirstTouch: age,
  };
}

/** The touch number a one-tap log should record next, or null if complete. */
export function nextTouchNo(
  touches: Pick<OutreachTouchRow, "touch_no" | "sent_at">[],
  now: Date = new Date()
): number | null {
  return computeTouchDue(touches, now).nextTouch;
}

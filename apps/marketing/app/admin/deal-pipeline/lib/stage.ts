// Pure stage derivation for the full deal pipeline (v1, no DB migration),
// conforming to DEAL-PIPELINE-OUTLINE-2026-11-26. Every function here is
// side-effect free and unit-tested (tests/stage.test).
//
// BAND A — Top of funnel (populated from outreach_contacts/outreach_touches):
//   a1-researched  company + founder researched/graded; no touches, no
//                  reply, no completed check, no intro call.
//   a2-outreach    >= 1 touch sent; still no reply / check / call.
//                  Touch 2 due Day 4-5 after Touch 1, Touch 3 Day 12-14.
//   a3-engaged     reply_status set OR check_completed.
//   a4-intro-call  intro_call_booked = true, no spine case linked.
//   Contact precedence is strict: a4 > a3 > a2 > a1 — never two columns.
//
// BAND B — Qualification & engagement (outline stages 5-10: Gate 1 Check,
//   Estimate, Gate 2 Company Fit, Gate 3 Application, Approval & path
//   choice, Documents-Ready). NO stored data home today (Gap G4; the Check
//   and Estimate are anonymous by ruling — G1). v1 defines these stages and
//   renders them unpopulated with their gap notes. Nothing is derived into
//   Band B, and no contact/case is ever guessed into it.
//
// BAND C — Transition, 120 days from Documents-Ready (spine cases):
//   c11 Phase 1 Ignition (Days 1-14) · c12 Phase 2 Build (Days 15-45,
//   Gate 1 Day 45) · c13 Phase 3 Validate (Days 46-75, Gates 2/3 Days
//   60/75) · c14 Phase 4 Close Prep (Days 76-105, Gate 4 Day 90) ·
//   c15 Phase 5 Closing (Days 106-120) · c16 Closed.
//   V1 LIMITATION, stated honestly: the spine mirror carries phase
//   (READY-TO-ENGAGE / CLIENT-ACTIVE) and gate results, but no
//   Documents-Ready date / clock day and no phase number, so v1 cannot
//   honestly split CLIENT-ACTIVE cases across c11-c15. Every non-closed
//   case lands in c11 with its real phase + path + gate results on the
//   card; c12-c15 render unpopulated until a clock-day source exists.
//   A case whose phase/stage is an explicit CLOSED marker -> c16.
//
// BAND D — Stewardship (Managed only; ST checklist, Gap G6):
//   d-s0 Activation · d-s1 First 90 Days · d-s2 Quarterly Cycle ·
//   d-s3 Annual Cycle · d-s4 Seller Note Refinance Window · d-s5 Term End.
//   Only a case with an explicit stewardship marker enters Band D (at
//   d-s0). No case carries one today, so Band D renders unpopulated.
//   Self Guided cases never enter Band D (annual check-in offer instead).
//
// SIDE STATES (outline E — flags on cards, never stages): v1 derives
//   on-hold (spine gate_status.holds non-empty; the 120-day clock keeps
//   running through a hold) and dormant-candidate (3 touches sent, no
//   engagement — reactivation is a new touch decision). Not fit / Deal dead
//   / Upgraded have no honest stored signal today and are NOT derived.
//
// LINKING: there is NO outreach->case foreign key today (Gap G3), so v1
// never guesses a link (no name matching). The proposed link column is
// drafted in supabase/003_deal_pipeline.sql (unapplied).

import type {
  CaseRow,
  OutreachContactRow,
  OutreachTouchRow,
  PipelineBandDef,
  PipelineStageDef,
  PipelineStageId,
  SideState,
  TouchDue,
} from "../types";

export const PIPELINE_BANDS: PipelineBandDef[] = [
  { id: "A", label: "A · Top of funnel", note: "No case exists yet — outreach founders." },
  { id: "B", label: "B · Qualification & engagement", note: "Ruled stages with no stored home today (Gap G4) — shown defined, unpopulated." },
  { id: "C", label: "C · Transition", note: "120 days from Documents-Ready — spine cases." },
  { id: "D", label: "D · Stewardship", note: "Post-close, Managed only — stewardship checklist (Gap G6)." },
];

const B_GAP = "G4";
const B_EMPTY = "Defined by ruling — no stored data today (Gap G4).";

export const PIPELINE_STAGES: PipelineStageDef[] = [
  { id: "a1-researched", band: "A", label: "Researched", detail: null, crmLabel: null, emptyNote: "No researched founders waiting for first touch.", gap: null },
  { id: "a2-outreach", band: "A", label: "Outreach", detail: "Touch 2 due Day 4–5 · Touch 3 Day 12–14", crmLabel: null, emptyNote: "No founders in active outreach.", gap: null },
  { id: "a3-engaged", band: "A", label: "Engaged", detail: null, crmLabel: "Qualified / Gate 2 Fit", emptyNote: "No replies or completed checks yet.", gap: null },
  { id: "a4-intro-call", band: "A", label: "Intro Call", detail: null, crmLabel: "Assessment Booked", emptyNote: "No intro calls booked.", gap: null },
  { id: "b5-gate1-check", band: "B", label: "Check — Gate 1 Prequalification", detail: "Anonymous, in-browser; no data collected", crmLabel: null, emptyNote: B_EMPTY, gap: B_GAP },
  { id: "b6-estimate", band: "B", label: "Estimate", detail: "Anonymous, browser-local", crmLabel: null, emptyNote: B_EMPTY, gap: B_GAP },
  { id: "b7-gate2-fit", band: "B", label: "Company Fit — Gate 2", detail: "16 questions; never shows a score", crmLabel: null, emptyNote: B_EMPTY, gap: B_GAP },
  { id: "b8-gate3-application", band: "B", label: "Application — Gate 3", detail: "First collection point, under NDA framing", crmLabel: null, emptyNote: B_EMPTY, gap: B_GAP },
  { id: "b9-approval-path", band: "B", label: "Approval & path choice", detail: "Team Review, decision within 2 business days", crmLabel: null, emptyNote: B_EMPTY, gap: B_GAP },
  { id: "b10-documents-ready", band: "B", label: "Documents-Ready", detail: "Phase 0 complete; Day 1 of the 120-day clock is the next business day", crmLabel: null, emptyNote: "The bridge stage: a case is created in the spine here. V1 shows spine cases in Band C — the contact→case link that would populate this stage is Gap G3.", gap: "G3" },
  { id: "c11-phase1-ignition", band: "C", label: "Phase 1 Ignition", detail: "Days 1–14", crmLabel: "Self Guided / Custom Services", emptyNote: "No spine cases in transition.", gap: null },
  { id: "c12-phase2-build", band: "C", label: "Phase 2 Build", detail: "Days 15–45 · Gate 1 Day 45 — FMV Adequacy Letter", crmLabel: null, emptyNote: "Unpopulated in v1 — the mirror carries no clock day to place a case here honestly.", gap: null },
  { id: "c13-phase3-validate", band: "C", label: "Phase 3 Validate", detail: "Days 46–75 · Gate 2 Day 60 · Gate 3 Day 75", crmLabel: null, emptyNote: "Unpopulated in v1 — the mirror carries no clock day to place a case here honestly.", gap: null },
  { id: "c14-phase4-close-prep", band: "C", label: "Phase 4 Close Prep", detail: "Days 76–105 · Gate 4 Day 90 — Trustee COOP Sign-off", crmLabel: null, emptyNote: "Unpopulated in v1 — the mirror carries no clock day to place a case here honestly.", gap: null },
  { id: "c15-phase5-closing", band: "C", label: "Phase 5 Closing", detail: "Days 106–120", crmLabel: null, emptyNote: "Unpopulated in v1 — the mirror carries no clock day to place a case here honestly.", gap: null },
  { id: "c16-closed", band: "C", label: "Closed", detail: "100% ESOP-owned; handoff receipt EC-119 opens stewardship", crmLabel: "Closed", emptyNote: "No case has closed yet.", gap: null },
  { id: "d-s0-activation", band: "D", label: "S0 Activation", detail: "Days 121–135 · EC-119 handoff", crmLabel: null, emptyNote: "No stewardship cases yet — no case has closed (Gap G6).", gap: "G6" },
  { id: "d-s1-first-90", band: "D", label: "S1 First 90 Days", detail: "Days 121–210", crmLabel: null, emptyNote: "No stewardship cases yet (Gap G6).", gap: "G6" },
  { id: "d-s2-quarterly", band: "D", label: "S2 Quarterly Cycle", detail: "From Day 211, recurring", crmLabel: null, emptyNote: "No stewardship cases yet (Gap G6).", gap: "G6" },
  { id: "d-s3-annual", band: "D", label: "S3 Annual Cycle", detail: "Annual Stewardship Fee 2.5% of EBITDA, 12–24 months", crmLabel: null, emptyNote: "No stewardship cases yet (Gap G6).", gap: "G6" },
  { id: "d-s4-refinance-window", band: "D", label: "S4 Seller Note Refinance Window", detail: "Months 14–18", crmLabel: null, emptyNote: "No stewardship cases yet (Gap G6).", gap: "G6" },
  { id: "d-s5-term-end", band: "D", label: "S5 Term End — Renewal or Graduation", detail: "Decision ≥60 days before term end", crmLabel: null, emptyNote: "No stewardship cases yet (Gap G6).", gap: "G6" },
];

export function deriveContactStage(
  contact: Pick<
    OutreachContactRow,
    "company" | "reply_status" | "check_completed" | "intro_call_booked"
  >,
  touches: Pick<OutreachTouchRow, "touch_no">[],
): PipelineStageId | null {
  if (!contact.company) return null; // unresearched slot — not a deal yet
  if (contact.intro_call_booked) return "a4-intro-call";
  if (contact.reply_status || contact.check_completed) return "a3-engaged";
  if (touches.length > 0) return "a2-outreach";
  return "a1-researched";
}

const CLOSED_MARKERS = new Set(["CLOSED", "CLOSED-WON", "CLOSED_WON"]);
const STEWARDSHIP_MARKERS = new Set(["STEWARDSHIP", "IN-STEWARDSHIP"]);

export function deriveCaseStage(
  kase: Pick<CaseRow, "phase" | "gate_status">,
): PipelineStageId {
  const phase = (kase.phase ?? "").toUpperCase();
  const stage = (kase.gate_status?.stage ?? "").toUpperCase();
  if (
    STEWARDSHIP_MARKERS.has(phase) ||
    STEWARDSHIP_MARKERS.has(stage) ||
    kase.gate_status?.stewardship === true
  ) {
    return "d-s0-activation";
  }
  if (CLOSED_MARKERS.has(phase) || CLOSED_MARKERS.has(stage)) {
    return "c16-closed";
  }
  // Documented fallback: every other case — READY-TO-ENGAGE, CLIENT-ACTIVE,
  // and any unknown/future phase — is shown at c11 with its real phase on
  // the card (see the v1 limitation in the header comment).
  return "c11-phase1-ignition";
}

export function deriveContactSideStates(
  contact: Pick<OutreachContactRow, "reply_status" | "check_completed" | "intro_call_booked">,
  touches: Pick<OutreachTouchRow, "touch_no">[],
): SideState[] {
  const engaged =
    contact.intro_call_booked || contact.reply_status || contact.check_completed;
  if (!engaged && touches.length >= 3) return ["dormant-candidate"];
  return [];
}

export function deriveCaseSideStates(
  kase: Pick<CaseRow, "gate_status">,
): SideState[] {
  const holds = kase.gate_status?.holds;
  if (holds && Object.keys(holds).length > 0) return ["on-hold"];
  return [];
}

// Touch-due model (spec windows, mirrored from the Backend Build Spec so
// this board does not depend on the Step 6 build): Touch 2 is due Day 4-5
// after Touch 1; Touch 3 is due Day 12-14 after Touch 1 (once Touch 2 has
// been sent). Days are whole days between sent_at and `now`.
const TOUCH_WINDOWS: Record<number, { start: number; end: number }> = {
  2: { start: 4, end: 5 },
  3: { start: 12, end: 14 },
};

function wholeDaysBetween(fromIso: string, now: Date): number {
  const ms = now.getTime() - new Date(fromIso).getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

export function deriveTouchDue(
  touches: Pick<OutreachTouchRow, "touch_no" | "sent_at">[],
  now: Date = new Date(),
): TouchDue {
  const sent = new Map(touches.map((t) => [t.touch_no, t.sent_at]));
  if (!sent.has(1)) {
    return { nextTouch: 1, state: "not-started", label: "Touch 1 not sent" };
  }
  const t1Age = wholeDaysBetween(sent.get(1)!, now);
  for (const next of [2, 3] as const) {
    if (sent.has(next)) continue;
    const w = TOUCH_WINDOWS[next];
    if (t1Age < w.start)
      return {
        nextTouch: next,
        state: "waiting",
        label: `Touch ${next} due in ${w.start - t1Age}d`,
      };
    if (t1Age <= w.end)
      return { nextTouch: next, state: "due", label: `Touch ${next} due now` };
    return {
      nextTouch: next,
      state: "overdue",
      label: `Touch ${next} overdue (${t1Age - w.end}d)`,
    };
  }
  return { nextTouch: null, state: "complete", label: "All 3 touches sent" };
}

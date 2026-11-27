// Pure stage derivation for the full deal pipeline v2 (no DB migration),
// conforming to DEAL-PIPELINE-OUTLINE-2026-11-26 + Stefano's ruled
// amendments of 2026-11-26 (P2 shape, P3 Onboarding, P5 side states).
// Every function here is side-effect free and unit-tested
// (tests/stage.test).
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
// BAND B — Qualification & engagement (outline stages 5-10). V2 SHAPE
//   (P2): stages 5-7 (Check / Estimate / Company Fit) are anonymous by
//   ruling (G1) and are NOT columns — see FUNNEL_STEPS, rendered as a
//   strip. The card-holding columns are:
//   b8-gate3-application  no stored home today (Gap G4) — unpopulated.
//   b9-approval-path      no stored home today (Gap G4) — unpopulated.
//   b-onboarding          NEW (P3): spine cases in READY-TO-ENGAGE —
//                         engagement letter signed / payment recorded,
//                         Documents-Ready still pending.
//   b10-documents-ready   the bridge stage; the contact->case link that
//                         would populate it from the contact side is G3.
//
// BAND C — Transition, 120 days from Documents-Ready (spine cases):
//   c11 Phase 1 Ignition (Days 1-14) · c12 Phase 2 Build (Days 15-45,
//   Gate 1 Day 45) · c13 Phase 3 Validate (Days 46-75, Gates 2/3 Days
//   60/75) · c14 Phase 4 Close Prep (Days 76-105, Gate 4 Day 90) ·
//   c15 Phase 5 Closing (Days 106-120) · c16 Closed.
//   Placement is by CLOCK DAY when the case row carries
//   documents_ready_at (C1: the spine writes it at EC-042 reviewed-pass;
//   migration 004 mirrors it). All live cases are NULL today, so in
//   practice every CLIENT-ACTIVE case still lands in c11 by the
//   documented fallback — a case is never split across phases without
//   the date. A case past Day 120 and not closed stays in c15 (closing
//   is its stage; the card's clock chip turns red). The Documents-Ready
//   day itself is Day 0 and the next day is Day 1 (outline stage 10);
//   business-day/holiday refinement is NOT modeled — whole calendar
//   days from the mirrored timestamp, same convention as touch-due.
//   A case whose phase/stage is an explicit CLOSED marker -> c16.
//
// BAND D — Stewardship (Managed only; ST checklist, Gap G6):
//   d-s0 Activation · d-s1 First 90 Days · d-s2 Quarterly Cycle ·
//   d-s3 Annual Cycle · d-s4 Seller Note Refinance Window · d-s5 Term End.
//   V2 renders Band D as a REGISTER (one row per case), not columns —
//   S2/S3/S4 are concurrent cycles (P2). Only a case with an explicit
//   stewardship marker enters Band D (at d-s0; finer placement has no
//   source). No case carries one today, so the register is empty.
//   Self Guided cases never enter Band D (annual check-in offer instead).
//
// SIDE STATES (outline E as amended by P5 — flags on cards, never
//   stages): v2 derives on-hold (spine gate_status.holds non-empty; the
//   120-day clock keeps running through a hold) and dormant-candidate
//   (3 touches sent, no engagement — reactivation is a new touch
//   decision). Nurture / Withdrawn / Not fit / Deal dead have no honest
//   stored signal today and are NOT derived. Upgraded is a
//   path-transition flag per P5, not a side state; the mirror records
//   no such flag, so nothing carries it.
//
// LINKING: there is NO outreach->case foreign key today (Gap G3), so
// the board never guesses a link (no name matching). The proposed link
// column is drafted in supabase/003_deal_pipeline.sql (unapplied, held
// by Stefano's M3 ruling).

import type {
  CaseDeal,
  CaseRow,
  FunnelStepDef,
  OutreachContactRow,
  OutreachTouchRow,
  PipelineBandDef,
  PipelineStageDef,
  PipelineStageId,
  SideState,
  StewardshipRow,
  TouchDue,
} from "../types";

export const PIPELINE_BANDS: PipelineBandDef[] = [
  { id: "A", label: "A · Top of funnel", note: "No case exists yet — outreach founders." },
  { id: "B", label: "B · Qualification & engagement", note: "Anonymous steps 5–7 run as a funnel strip (no per-deal data by ruling, G1); Application and Approval wait on pre-case storage (Gap G4); Onboarding and Documents-Ready bridge to the spine." },
  { id: "C", label: "C · Transition", note: "120 days from Documents-Ready — spine cases, placed by clock day when the Documents-Ready date is mirrored (C1)." },
  { id: "D", label: "D · Stewardship", note: "Post-close, Managed only — a register, not columns: the quarterly / annual / refinance cycles run concurrently (Gap G6)." },
];

// One muted dot color per band (polish spec: stage identity = a single
// small colored dot; lanes stay barely tinted, never pastel washes).
const DOT: Record<PipelineBandDef["id"], string> = {
  A: "#778AA3",
  B: "#957A68",
  C: "#0F5132",
  D: "#5F7088",
};

const B_GAP = "G4";
const B_EMPTY = "Defined by ruling — no stored data today (Gap G4).";

export const FUNNEL_STEPS: FunnelStepDef[] = [
  { id: "b5-gate1-check", label: "Check — Gate 1 Prequalification", detail: "Anonymous, in-browser; no data collected" },
  { id: "b6-estimate", label: "Estimate", detail: "Anonymous, browser-local" },
  { id: "b7-gate2-fit", label: "Company Fit — Gate 2", detail: "16 questions; never shows a score" },
];

export const PIPELINE_STAGES: PipelineStageDef[] = [
  { id: "a1-researched", band: "A", label: "Researched", detail: null, crmLabel: null, emptyNote: "No researched founders waiting for first touch.", gap: null, dot: DOT.A },
  { id: "a2-outreach", band: "A", label: "Outreach", detail: "Touch 2 due Day 4–5 · Touch 3 Day 12–14", crmLabel: null, emptyNote: "No founders in active outreach.", gap: null, dot: DOT.A },
  { id: "a3-engaged", band: "A", label: "Engaged", detail: null, crmLabel: "Qualified / Gate 2 Fit", emptyNote: "No replies or completed checks yet.", gap: null, dot: DOT.A },
  { id: "a4-intro-call", band: "A", label: "Intro Call", detail: null, crmLabel: "Assessment Booked", emptyNote: "No intro calls booked.", gap: null, dot: DOT.A },
  { id: "b8-gate3-application", band: "B", label: "Application — Gate 3", detail: "First collection point, under NDA framing", crmLabel: null, emptyNote: B_EMPTY, gap: B_GAP, dot: DOT.B },
  { id: "b9-approval-path", band: "B", label: "Approval & path choice", detail: "Team Review, decision within 2 business days", crmLabel: null, emptyNote: B_EMPTY, gap: B_GAP, dot: DOT.B },
  { id: "b-onboarding", band: "B", label: "Onboarding", detail: "READY-TO-ENGAGE — letter signed / payment recorded, Documents-Ready pending", crmLabel: null, emptyNote: "No cases in onboarding — a case lands here at READY-TO-ENGAGE, after approval and before Documents-Ready.", gap: null, dot: DOT.B },
  { id: "b10-documents-ready", band: "B", label: "Documents-Ready", detail: "Phase 0 complete; Day 1 of the 120-day clock is the next day", crmLabel: null, emptyNote: "The bridge stage: a case is created in the spine here. The board shows spine cases in Band C — the contact→case link that would populate this stage from the contact side is Gap G3.", gap: "G3", dot: DOT.B },
  { id: "c11-phase1-ignition", band: "C", label: "Phase 1 Ignition", detail: "Days 1–14", crmLabel: "Self Guided / Custom Services", emptyNote: "No spine cases in transition.", gap: null, dot: DOT.C },
  { id: "c12-phase2-build", band: "C", label: "Phase 2 Build", detail: "Days 15–45 · Gate 1 Day 45 — FMV Adequacy Letter", crmLabel: null, emptyNote: "No case at this clock day — placement is by Documents-Ready date (C1); cases without one sit in Phase 1.", gap: null, dot: DOT.C },
  { id: "c13-phase3-validate", band: "C", label: "Phase 3 Validate", detail: "Days 46–75 · Gate 2 Day 60 · Gate 3 Day 75", crmLabel: null, emptyNote: "No case at this clock day — placement is by Documents-Ready date (C1); cases without one sit in Phase 1.", gap: null, dot: DOT.C },
  { id: "c14-phase4-close-prep", band: "C", label: "Phase 4 Close Prep", detail: "Days 76–105 · Gate 4 Day 90 — Trustee COOP Sign-off", crmLabel: null, emptyNote: "No case at this clock day — placement is by Documents-Ready date (C1); cases without one sit in Phase 1.", gap: null, dot: DOT.C },
  { id: "c15-phase5-closing", band: "C", label: "Phase 5 Closing", detail: "Days 106–120", crmLabel: null, emptyNote: "No case at this clock day — placement is by Documents-Ready date (C1); cases without one sit in Phase 1.", gap: null, dot: DOT.C },
  { id: "c16-closed", band: "C", label: "Closed", detail: "100% ESOP-owned; handoff receipt EC-119 opens stewardship", crmLabel: "Closed", emptyNote: "No case has closed yet.", gap: null, dot: DOT.C },
  { id: "d-s0-activation", band: "D", label: "S0 Activation", detail: "Days 121–135 · EC-119 handoff", crmLabel: null, emptyNote: "No stewardship cases yet — no case has closed (Gap G6).", gap: "G6", dot: DOT.D },
  { id: "d-s1-first-90", band: "D", label: "S1 First 90 Days", detail: "Days 121–210", crmLabel: null, emptyNote: "No stewardship cases yet (Gap G6).", gap: "G6", dot: DOT.D },
  { id: "d-s2-quarterly", band: "D", label: "S2 Quarterly Cycle", detail: "From Day 211, recurring", crmLabel: null, emptyNote: "No stewardship cases yet (Gap G6).", gap: "G6", dot: DOT.D },
  { id: "d-s3-annual", band: "D", label: "S3 Annual Cycle", detail: "Annual Stewardship Fee 2.5% of EBITDA, 12–24 months", crmLabel: null, emptyNote: "No stewardship cases yet (Gap G6).", gap: "G6", dot: DOT.D },
  { id: "d-s4-refinance-window", band: "D", label: "S4 Seller Note Refinance Window", detail: "Months 14–18", crmLabel: null, emptyNote: "No stewardship cases yet (Gap G6).", gap: "G6", dot: DOT.D },
  { id: "d-s5-term-end", band: "D", label: "S5 Term End — Renewal or Graduation", detail: "Decision ≥60 days before term end", crmLabel: null, emptyNote: "No stewardship cases yet (Gap G6).", gap: "G6", dot: DOT.D },
];

export function stageDef(id: PipelineStageId): PipelineStageDef {
  return PIPELINE_STAGES.find((s) => s.id === id)!;
}

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
const ONBOARDING_MARKERS = new Set(["READY-TO-ENGAGE", "READY_TO_ENGAGE"]);

/** Whole calendar days between an ISO timestamp and `now` (floor;
 *  negative results clamp to 0). The one day-count convention used
 *  across the board — touch-due, clock day, idle age. */
export function wholeDaysBetween(fromIso: string, now: Date): number {
  const ms = now.getTime() - new Date(fromIso).getTime();
  return Math.max(0, Math.floor(ms / (24 * 60 * 60 * 1000)));
}

/** Day of the 120-day transition clock. The Documents-Ready day (the
 *  EC-042 pass the spine records) is Day 0; the next day is Day 1 —
 *  outline stage 10: "Day 1 of the 120-day clock is the next day." */
export function deriveClockDay(documentsReadyAt: string, now: Date): number {
  return wholeDaysBetween(documentsReadyAt, now);
}

function clockStage(clockDay: number): PipelineStageId {
  if (clockDay <= 14) return "c11-phase1-ignition";
  if (clockDay <= 45) return "c12-phase2-build";
  if (clockDay <= 75) return "c13-phase3-validate";
  if (clockDay <= 105) return "c14-phase4-close-prep";
  return "c15-phase5-closing"; // 106-120, and past 120 until closed
}

export function deriveCaseStage(
  kase: Pick<CaseRow, "phase" | "gate_status" | "documents_ready_at">,
  now: Date = new Date(),
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
  if (ONBOARDING_MARKERS.has(phase) || ONBOARDING_MARKERS.has(stage)) {
    return "b-onboarding";
  }
  if (kase.documents_ready_at) {
    return clockStage(deriveClockDay(kase.documents_ready_at, now));
  }
  // Documented fallback: a case with no Documents-Ready date (every
  // live case today) — CLIENT-ACTIVE, and any unknown/future phase —
  // is shown at c11 with its real phase on the card. Splitting it
  // across c11-c15 without the date would be invention.
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
// this board does not depend on the Step 6 build; S1 ruling 2026-11-26
// confirmed the window model): Touch 2 is due Day 4-5 after Touch 1;
// Touch 3 is due Day 12-14 after Touch 1 (once Touch 2 has been sent).
// A lone Touch 1 at Day 9 is Touch 2 OVERDUE, never Touch 3 due.
const TOUCH_WINDOWS: Record<number, { start: number; end: number }> = {
  2: { start: 4, end: 5 },
  3: { start: 12, end: 14 },
};

export function deriveTouchDue(
  touches: Pick<OutreachTouchRow, "touch_no" | "sent_at">[],
  now: Date = new Date(),
): TouchDue {
  const sent = new Map(touches.map((t) => [t.touch_no, t.sent_at]));
  if (!sent.has(1)) {
    return { nextTouch: 1, state: "not-started", label: "Touch 1 not sent", days: 0 };
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
        days: w.start - t1Age,
      };
    if (t1Age <= w.end)
      return { nextTouch: next, state: "due", label: `Touch ${next} due now`, days: 0 };
    return {
      nextTouch: next,
      state: "overdue",
      label: `Touch ${next} overdue (${t1Age - w.end}d)`,
      days: t1Age - w.end,
    };
  }
  return { nextTouch: null, state: "complete", label: "All 3 touches sent", days: 0 };
}

/** The single next action shown in a card footer — derived only from
 *  stored signals, never typed. */
export function deriveContactNextAction(deal: {
  introCallBooked: boolean;
  sideStates: SideState[];
  touchDue: TouchDue;
}): string {
  if (deal.introCallBooked) return "Intro call booked — hold the call";
  if (deal.sideStates.includes("dormant-candidate"))
    return "Dormant candidate — reactivation is a new touch decision";
  return deal.touchDue.label;
}

export function deriveCaseNextAction(deal: {
  gateFailures: number;
  checklist: { awaitingReview: number; open: number };
}): string {
  if (deal.gateFailures > 0)
    return `${deal.gateFailures} gate FAIL${deal.gateFailures === 1 ? "" : "s"} — needs Stefano`;
  if (deal.checklist.awaitingReview > 0)
    return `${deal.checklist.awaitingReview} item${deal.checklist.awaitingReview === 1 ? "" : "s"} awaiting review`;
  if (deal.checklist.open > 0)
    return `${deal.checklist.open} checklist items open`;
  return "Checklist complete";
}

/** Band D register row for a stewardship case. Post-close day, next
 *  deliverable and fee status have no source in the mirror today
 *  (Gap G6) — they stay null and render as "—". */
export function deriveStewardshipRow(
  deal: Pick<CaseDeal, "key" | "caseId" | "clientName" | "stage">,
): StewardshipRow {
  return {
    key: deal.key,
    caseId: deal.caseId,
    company: deal.clientName,
    stage: deal.stage,
    stageLabel: stageDef(deal.stage).label,
    postCloseDay: null,
    nextDeliverable: null,
    feeStatus: null,
  };
}

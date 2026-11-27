// Deal pipeline v2 (conforming to DEAL-PIPELINE-OUTLINE-2026-11-26 plus
// Stefano's ruled amendments of 2026-11-26, and POLISH-SPEC-pipeline-v2):
// types for the unified board — an action queue on top, then 4 bands
// (A Top of funnel · B Qualification & engagement · C Transition ·
// D Stewardship). P2 shape changes vs v1:
//   - stages 5-7 (Check / Estimate / Company Fit) are NO LONGER columns;
//     they are FunnelStepDefs rendered as an anonymous funnel strip.
//   - Band B card columns are Application, Approval & path choice,
//     Onboarding (NEW, P3), Documents-Ready.
//   - Band D is a register (StewardshipRow[]), not stage columns — the
//     stage defs remain for pill labels only.
// Data comes from the Supabase Phase 1 tables (serving layer); the spine
// remains the source of truth for case state. Stage is DERIVED from
// existing fields (no pipeline column exists yet — see the Gap list in
// the outline and supabase/003_deal_pipeline.sql draft, unapplied).

export type PipelineBandId = "A" | "B" | "C" | "D";

export type PipelineStageId =
  | "a1-researched"
  | "a2-outreach"
  | "a3-engaged"
  | "a4-intro-call"
  | "b8-gate3-application"
  | "b9-approval-path"
  | "b-onboarding"
  | "b10-documents-ready"
  | "c11-phase1-ignition"
  | "c12-phase2-build"
  | "c13-phase3-validate"
  | "c14-phase4-close-prep"
  | "c15-phase5-closing"
  | "c16-closed"
  | "d-s0-activation"
  | "d-s1-first-90"
  | "d-s2-quarterly"
  | "d-s3-annual"
  | "d-s4-refinance-window"
  | "d-s5-term-end";

/** The anonymous pre-application steps (outline stages 5-7). By ruling
 *  they collect NO per-deal data (G1), so in v2 they are not stages and
 *  never hold cards — they render as a labeled funnel strip in Band B. */
export type FunnelStepId = "b5-gate1-check" | "b6-estimate" | "b7-gate2-fit";

export interface FunnelStepDef {
  id: FunnelStepId;
  label: string;
  detail: string | null;
}

/** Side states (outline section E, as amended by P5 2026-11-26):
 *  available from every stage, never a stage themselves. v2 derives only
 *  the two with honest data signals (on-hold from spine holds;
 *  dormant-candidate from an exhausted touch sequence). Nurture,
 *  Withdrawn, Not fit / Declined and Deal dead are defined here per P5
 *  but are NOT derived — no stored signal exists for them today.
 *  "Upgraded" is no longer a side state at all: P5 reclassified it as a
 *  path-transition flag on the deal (with a credit audit event). The
 *  mirror records no such flag today, so no field carries it. */
export type SideState =
  | "dormant-candidate"
  | "on-hold"
  | "nurture"
  | "withdrawn"
  | "not-fit"
  | "deal-dead";

export interface PipelineStageDef {
  id: PipelineStageId;
  band: PipelineBandId;
  label: string;
  /** Clock / gate annotation from the outline, shown under the label. */
  detail: string | null;
  /** Ruled founder-pipeline vocabulary (CRM pilot 2026-11-22) where it
   *  maps honestly; null where no ruled label corresponds. */
  crmLabel: string | null;
  emptyNote: string;
  /** Gap id from the outline Gap list when this stage has no stored data
   *  home today (renders defined-but-unpopulated). */
  gap: string | null;
  /** Stage identity dot — one muted color per band (polish spec: a
   *  single small colored dot per stage, never a lane wash). */
  dot: string;
}

export interface PipelineBandDef {
  id: PipelineBandId;
  label: string;
  note: string;
}

export interface OutreachContactRow {
  id: string;
  packet_id: string;
  company: string | null;
  founder: string | null;
  grade: number | null;
  tof1_status: string | null;
  reply_status: string | null;
  check_completed: boolean;
  intro_call_booked: boolean;
  updated_at: string;
}

export interface OutreachTouchRow {
  id: string;
  contact_id: string;
  touch_no: number;
  sent_at: string;
  channel: string | null;
  outcome: string | null;
}

export interface CaseRow {
  id: string;
  client_name: string;
  phase: string;
  gate_status: {
    stage?: string | null;
    path?: string | null;
    gates?: Record<string, { result: string; at: string }>;
    items_by_status?: Record<string, number>;
    holds?: Record<string, unknown>;
    stewardship?: boolean;
  };
  /** C1: mirrored from the spine (EC-042 reviewed-pass writes it in the
   *  spine; migration 004 added the column). Null until a case is
   *  actually declared Documents-Ready — all cases are NULL today. */
  documents_ready_at: string | null;
  updated_at: string;
  synced_at: string;
}

export interface ChecklistCountRow {
  case_id: string;
  status: string;
}

export type TouchDueState =
  | "not-started"
  | "waiting"
  | "due"
  | "overdue"
  | "complete";

export interface TouchDue {
  nextTouch: 1 | 2 | 3 | null;
  state: TouchDueState;
  label: string;
  /** Days attached to the state: waiting = days until the window opens;
   *  overdue = days past the window end; due / not-started / complete = 0. */
  days: number;
}

export interface ContactDeal {
  kind: "contact";
  key: string;
  stage: PipelineStageId;
  packetId: string;
  company: string;
  founder: string | null;
  grade: number | null;
  tof1Status: string | null;
  replyStatus: string | null;
  checkCompleted: boolean;
  introCallBooked: boolean;
  touchCount: number;
  lastTouchAt: string | null;
  touchDue: TouchDue;
  sideStates: SideState[];
  /** Footer-left text: the single next action, derived (stage.ts). */
  nextAction: string;
  updatedAt: string;
  /** Whole days since the record last updated (idle-age signal). */
  updatedDaysAgo: number;
}

export interface CaseDeal {
  kind: "case";
  key: string;
  stage: PipelineStageId;
  caseId: string;
  clientName: string;
  phase: string;
  path: string | null;
  checklist: { total: number; reviewed: number; awaitingReview: number; open: number };
  gateResults: { gate: string; result: string; at: string }[];
  gateFailures: number;
  sideStates: SideState[];
  documentsReadyAt: string | null;
  /** Day of the 120-day clock (Documents-Ready day = Day 0, the next
   *  day = Day 1, per the outline). Null when the case carries no
   *  documents_ready_at — a clock day is never invented. */
  clockDay: number | null;
  /** Footer-left text: the single next action, derived (stage.ts). */
  nextAction: string;
  updatedAt: string;
  updatedDaysAgo: number;
}

export type Deal = ContactDeal | CaseDeal;

/** One row of the Band D register (P2: a table, not columns — S2/S3/S4
 *  are concurrent recurring cycles, so a case occupies one row).
 *  postCloseDay / nextDeliverable / feeStatus have NO source in the
 *  mirror today (the stewardship register is Gap G6): they stay null
 *  and the table renders "—" rather than inventing values. */
export interface StewardshipRow {
  key: string;
  caseId: string;
  company: string;
  stage: PipelineStageId;
  stageLabel: string;
  postCloseDay: number | null;
  nextDeliverable: string | null;
  feeStatus: string | null;
}

export type QueueUrgency = "overdue" | "due" | "attention";

/** One entry in the action queue (P2 daily default). Only deals with a
 *  due/overdue action, a gate FAIL, a dormant candidacy, or the panel's
 *  "unproven" guard condition appear here — see lib/queue.ts for the
 *  exact derivation rules. */
export interface QueueEntry {
  key: string;
  dealKey: string;
  kind: "contact" | "case";
  title: string;
  stage: PipelineStageId;
  reason: string;
  urgency: QueueUrgency;
  /** Ordering signal inside the overdue group (days overdue). */
  sortDays: number;
}

export interface PipelineData {
  bands: PipelineBandDef[];
  stages: PipelineStageDef[];
  funnelSteps: FunnelStepDef[];
  dealsByStage: Record<PipelineStageId, Deal[]>;
  actionQueue: QueueEntry[];
  stewardship: StewardshipRow[];
  counts: {
    perStage: Record<PipelineStageId, number>;
    totalDeals: number;
    totalResearched: number;
    totalSlots: number;
    activeCases: number;
    gateFailures: number;
    actionNeeded: number;
  };
}

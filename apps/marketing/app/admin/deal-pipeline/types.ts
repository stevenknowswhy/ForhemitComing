// Deal pipeline (full deal pipeline v1, conforming to
// DEAL-PIPELINE-OUTLINE-2026-11-26): types for the unified board —
// 4 bands (A Top of funnel · B Qualification & engagement · C Transition ·
// D Stewardship), stage columns inside each band.
// Data comes from the Supabase Phase 1 tables (serving layer); the spine
// remains the source of truth for case state. Stage is DERIVED from
// existing fields (no pipeline column exists yet — see the Gap list in the
// outline and supabase/003_deal_pipeline.sql draft, unapplied).

export type PipelineBandId = "A" | "B" | "C" | "D";

export type PipelineStageId =
  | "a1-researched"
  | "a2-outreach"
  | "a3-engaged"
  | "a4-intro-call"
  | "b5-gate1-check"
  | "b6-estimate"
  | "b7-gate2-fit"
  | "b8-gate3-application"
  | "b9-approval-path"
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

/** Side states (outline section E): available from every stage, never a
 *  stage themselves. v1 derives only the two with honest data signals
 *  (on-hold from spine holds; dormant-candidate from an exhausted touch
 *  sequence); the rest are defined here and flagged in the report. */
export type SideState =
  | "dormant-candidate"
  | "on-hold"
  | "not-fit"
  | "deal-dead"
  | "upgraded";

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
   *  home today (v1 renders it defined-but-unpopulated). */
  gap: string | null;
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
  updatedAt: string;
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
  updatedAt: string;
}

export type Deal = ContactDeal | CaseDeal;

export interface PipelineData {
  bands: PipelineBandDef[];
  stages: PipelineStageDef[];
  dealsByStage: Record<PipelineStageId, Deal[]>;
  counts: {
    perStage: Record<PipelineStageId, number>;
    totalDeals: number;
    totalResearched: number;
    totalSlots: number;
    activeCases: number;
    gateFailures: number;
  };
}

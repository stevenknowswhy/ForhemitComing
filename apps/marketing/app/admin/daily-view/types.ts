// Daily view (Backend Step 5, Option A ruling 2026-11-25): types for the
// Supabase Phase 1 mirror tables. Spine is the source of truth; these rows
// are the serving-layer mirror written by the spine -> Supabase sync.

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
  };
  updated_at: string;
  synced_at: string;
}

export interface ChecklistItemRow {
  id: string;
  case_id: string;
  code: string;
  title: string;
  owner: string | null;
  status: string;
  updated_at: string;
}

export interface AuditEventRow {
  id: string;
  case_id: string | null;
  event: string;
  actor: string | null;
  at: string;
  hash: string | null;
}

export interface OutreachContactRow {
  packet_id: string;
  company: string | null;
  founder: string | null;
  grade: number | null;
  tof1_status: string | null;
  reply_status: string | null;
  check_completed: boolean;
  intro_call_booked: boolean;
}

export interface ManualLogRow {
  id: string;
  kind: string;
  subject: string;
  detail: string | null;
  at: string;
  done: boolean;
}

export interface SyncHealthRow {
  source: string;
  last_ok_at: string | null;
  last_error: string | null;
  updated_at: string;
}

export interface AwaitingReviewItem {
  caseId: string;
  code: string;
  title: string;
  owner: string | null;
  updatedAt: string;
}

export interface GateFailure {
  caseId: string;
  gate: string;
  at: string;
}

export interface PipelineCase {
  id: string;
  clientName: string;
  phase: string;
  total: number;
  reviewed: number;
  awaitingReview: number;
  open: number;
  updatedAt: string;
}

export interface DoneSummary {
  windowLabel: string;
  totalEvents: number;
  byEvent: { event: string; count: number }[];
  latest: AuditEventRow[];
}

export interface DailyViewData {
  syncHealth: SyncHealthRow | null;
  awaitingReview: AwaitingReviewItem[];
  gateFailures: GateFailure[];
  manualOpen: ManualLogRow[];
  outreach: {
    totalSlots: number;
    researched: OutreachContactRow[];
    replies: number;
    checksCompleted: number;
    introCallsBooked: number;
  };
  pipeline: PipelineCase[];
  done: DoneSummary;
}

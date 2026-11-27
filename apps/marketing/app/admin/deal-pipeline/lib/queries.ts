// Server-side reads + board assembly for the full deal pipeline (v2).
// Reads only: this module never writes to Supabase. Stage derivation is
// the pure logic in ./stage, the action queue is ./queue; this file
// only fetches rows and groups them.

import { sbGet } from "./supabase";
import {
  FUNNEL_STEPS,
  PIPELINE_BANDS,
  PIPELINE_STAGES,
  deriveCaseNextAction,
  deriveCaseSideStates,
  deriveCaseStage,
  deriveClockDay,
  deriveContactNextAction,
  deriveContactSideStates,
  deriveContactStage,
  deriveStewardshipRow,
  deriveTouchDue,
  wholeDaysBetween,
} from "./stage";
import { deriveActionQueue } from "./queue";
import type {
  CaseDeal,
  CaseRow,
  ChecklistCountRow,
  ContactDeal,
  Deal,
  OutreachContactRow,
  OutreachTouchRow,
  PipelineData,
  PipelineStageId,
} from "../types";

function emptyByStage(): Record<PipelineStageId, Deal[]> {
  const out = {} as Record<PipelineStageId, Deal[]>;
  for (const s of PIPELINE_STAGES) out[s.id] = [];
  return out;
}

function buildContactDeal(
  contact: OutreachContactRow,
  touches: OutreachTouchRow[],
  now: Date,
): ContactDeal | null {
  const stage = deriveContactStage(contact, touches);
  if (!stage) return null;
  const sorted = [...touches].sort((a, b) => (a.sent_at < b.sent_at ? -1 : 1));
  const touchDue = deriveTouchDue(touches, now);
  const sideStates = deriveContactSideStates(contact, touches);
  const deal: ContactDeal = {
    kind: "contact",
    key: `contact:${contact.packet_id}`,
    stage,
    packetId: contact.packet_id,
    company: contact.company!,
    founder: contact.founder,
    grade: contact.grade,
    tof1Status: contact.tof1_status,
    replyStatus: contact.reply_status,
    checkCompleted: contact.check_completed,
    introCallBooked: contact.intro_call_booked,
    touchCount: touches.length,
    lastTouchAt: sorted.length ? sorted[sorted.length - 1].sent_at : null,
    touchDue,
    sideStates,
    nextAction: deriveContactNextAction({
      introCallBooked: contact.intro_call_booked,
      sideStates,
      touchDue,
    }),
    updatedAt: contact.updated_at,
    updatedDaysAgo: wholeDaysBetween(contact.updated_at, now),
  };
  return deal;
}

function buildCaseDeal(
  kase: CaseRow,
  counts: { total: number; reviewed: number; awaitingReview: number; open: number },
  now: Date,
): CaseDeal {
  const gateResults = Object.entries(kase.gate_status?.gates ?? {})
    .map(([gate, g]) => ({ gate, result: g.result, at: g.at }))
    .sort((a, b) => (a.at < b.at ? 1 : -1));
  const gateFailures = gateResults.filter((g) => g.result === "FAIL").length;
  return {
    kind: "case",
    key: `case:${kase.id}`,
    stage: deriveCaseStage(kase, now),
    caseId: kase.id,
    clientName: kase.client_name,
    phase: kase.phase,
    path: kase.gate_status?.path ?? null,
    checklist: counts,
    gateResults,
    gateFailures,
    sideStates: deriveCaseSideStates(kase),
    documentsReadyAt: kase.documents_ready_at ?? null,
    clockDay: kase.documents_ready_at
      ? deriveClockDay(kase.documents_ready_at, now)
      : null,
    nextAction: deriveCaseNextAction({ gateFailures, checklist: counts }),
    updatedAt: kase.updated_at,
    updatedDaysAgo: wholeDaysBetween(kase.updated_at, now),
  };
}

export async function getPipelineData(
  now: Date = new Date(),
): Promise<PipelineData> {
  const [contacts, touches, cases, items] = await Promise.all([
    sbGet<OutreachContactRow[]>(
      "outreach_contacts?select=id,packet_id,company,founder,grade,tof1_status,reply_status,check_completed,intro_call_booked,updated_at&order=packet_id",
    ),
    sbGet<OutreachTouchRow[]>(
      "outreach_touches?select=id,contact_id,touch_no,sent_at,channel,outcome&order=sent_at.asc",
    ),
    sbGet<CaseRow[]>("cases?select=*&order=id"),
    sbGet<ChecklistCountRow[]>("checklist_items?select=case_id,status"),
  ]);

  const touchesByContact = new Map<string, OutreachTouchRow[]>();
  for (const t of touches) {
    const list = touchesByContact.get(t.contact_id) ?? [];
    list.push(t);
    touchesByContact.set(t.contact_id, list);
  }

  const countsByCase = new Map<
    string,
    { total: number; reviewed: number; awaitingReview: number; open: number }
  >();
  for (const it of items) {
    const c =
      countsByCase.get(it.case_id) ??
      { total: 0, reviewed: 0, awaitingReview: 0, open: 0 };
    c.total += 1;
    if (it.status === "reviewed") c.reviewed += 1;
    else if (it.status === "completed") c.awaitingReview += 1;
    else c.open += 1;
    countsByCase.set(it.case_id, c);
  }

  const dealsByStage = emptyByStage();
  const allDeals: Deal[] = [];
  let totalResearched = 0;
  for (const contact of contacts) {
    const deal = buildContactDeal(
      contact,
      touchesByContact.get(contact.id) ?? [],
      now,
    );
    if (!deal) continue;
    totalResearched += 1;
    dealsByStage[deal.stage].push(deal);
    allDeals.push(deal);
  }

  let gateFailures = 0;
  for (const kase of cases) {
    const deal = buildCaseDeal(
      kase,
      countsByCase.get(kase.id) ?? {
        total: 0,
        reviewed: 0,
        awaitingReview: 0,
        open: 0,
      },
      now,
    );
    gateFailures += deal.gateFailures;
    dealsByStage[deal.stage].push(deal);
    allDeals.push(deal);
  }

  const actionQueue = deriveActionQueue(allDeals);
  const stewardship = allDeals
    .filter(
      (d): d is CaseDeal => d.kind === "case" && d.stage.startsWith("d-"),
    )
    .map(deriveStewardshipRow);

  const perStage = Object.fromEntries(
    PIPELINE_STAGES.map((s) => [s.id, dealsByStage[s.id].length]),
  ) as Record<PipelineStageId, number>;

  return {
    bands: PIPELINE_BANDS,
    stages: PIPELINE_STAGES,
    funnelSteps: FUNNEL_STEPS,
    dealsByStage,
    actionQueue,
    stewardship,
    counts: {
      perStage,
      totalDeals: Object.values(perStage).reduce((a, b) => a + b, 0),
      totalResearched,
      totalSlots: contacts.length,
      activeCases: cases.length,
      gateFailures,
      actionNeeded: actionQueue.length,
    },
  };
}

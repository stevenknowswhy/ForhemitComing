// Server-side reads + board assembly for the full deal pipeline.
// Reads only: this module never writes to Supabase. Stage derivation is the
// pure logic in ./stage; this file only fetches rows and groups them.

import { sbGet } from "./supabase";
import {
  PIPELINE_BANDS,
  PIPELINE_STAGES,
  deriveCaseSideStates,
  deriveCaseStage,
  deriveContactSideStates,
  deriveContactStage,
  deriveTouchDue,
} from "./stage";
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
  return {
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
    touchDue: deriveTouchDue(touches, now),
    sideStates: deriveContactSideStates(contact, touches),
    updatedAt: contact.updated_at,
  };
}

function buildCaseDeal(
  kase: CaseRow,
  counts: { total: number; reviewed: number; awaitingReview: number; open: number },
): CaseDeal {
  const gateResults = Object.entries(kase.gate_status?.gates ?? {})
    .map(([gate, g]) => ({ gate, result: g.result, at: g.at }))
    .sort((a, b) => (a.at < b.at ? 1 : -1));
  return {
    kind: "case",
    key: `case:${kase.id}`,
    stage: deriveCaseStage(kase),
    caseId: kase.id,
    clientName: kase.client_name,
    phase: kase.phase,
    path: kase.gate_status?.path ?? null,
    checklist: counts,
    gateResults,
    gateFailures: gateResults.filter((g) => g.result === "FAIL").length,
    sideStates: deriveCaseSideStates(kase),
    updatedAt: kase.updated_at,
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
    );
    gateFailures += deal.gateFailures;
    dealsByStage[deal.stage].push(deal);
  }

  const perStage = Object.fromEntries(
    PIPELINE_STAGES.map((s) => [s.id, dealsByStage[s.id].length]),
  ) as Record<PipelineStageId, number>;

  return {
    bands: PIPELINE_BANDS,
    stages: PIPELINE_STAGES,
    dealsByStage,
    counts: {
      perStage,
      totalDeals: Object.values(perStage).reduce((a, b) => a + b, 0),
      totalResearched,
      totalSlots: contacts.length,
      activeCases: cases.length,
      gateFailures,
    },
  };
}

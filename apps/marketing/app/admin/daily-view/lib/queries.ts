import { sbGet } from "./supabase";
import type {
  AuditEventRow,
  CaseRow,
  ChecklistItemRow,
  DailyViewData,
  ManualLogRow,
  OutreachContactRow,
  SyncHealthRow,
} from "../types";

const PT = "America/Los_Angeles";

function ptDateString(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PT,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function ptTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: PT,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatPt(iso: string | null): string {
  return iso ? ptTime(iso) : "never";
}

// "Done" = spine audit events from today + yesterday (Pacific), per spec:
// done is proven from the audit log, never typed into the UI.
function buildDone(events: AuditEventRow[]): DailyViewData["done"] {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const windowStart = ptDateString(yesterday);
  const inWindow = events.filter((e) => ptDateString(new Date(e.at)) >= windowStart);
  const counts = new Map<string, number>();
  for (const e of inWindow) counts.set(e.event, (counts.get(e.event) ?? 0) + 1);
  return {
    windowLabel: `today + yesterday (PT) — since ${windowStart}`,
    totalEvents: inWindow.length,
    byEvent: [...counts.entries()]
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    latest: inWindow.slice(0, 12),
  };
}

export async function getDailyViewData(): Promise<DailyViewData> {
  const [cases, allItems, awaiting, events, contacts, manualOpen, health] =
    await Promise.all([
      sbGet<CaseRow[]>("cases?select=*&order=id"),
      sbGet<Pick<ChecklistItemRow, "case_id" | "status">[]>(
        "checklist_items?select=case_id,status",
      ),
      sbGet<ChecklistItemRow[]>(
        "checklist_items?select=*&status=eq.completed&order=updated_at.asc",
      ),
      sbGet<AuditEventRow[]>("audit_events?select=*&order=at.desc&limit=500"),
      sbGet<OutreachContactRow[]>(
        "outreach_contacts?select=packet_id,company,founder,grade,tof1_status,reply_status,check_completed,intro_call_booked&order=packet_id",
      ),
      sbGet<ManualLogRow[]>("manual_log?select=*&done=eq.false&order=at.desc"),
      sbGet<SyncHealthRow[]>("sync_health?select=*&source=eq.spine"),
    ]);

  const countsByCase = new Map<string, { total: number; reviewed: number; awaitingReview: number; open: number }>();
  for (const it of allItems) {
    const c = countsByCase.get(it.case_id) ?? { total: 0, reviewed: 0, awaitingReview: 0, open: 0 };
    c.total += 1;
    if (it.status === "reviewed") c.reviewed += 1;
    else if (it.status === "completed") c.awaitingReview += 1;
    else c.open += 1;
    countsByCase.set(it.case_id, c);
  }

  const gateFailures: DailyViewData["gateFailures"] = [];
  for (const c of cases) {
    for (const [gate, g] of Object.entries(c.gate_status?.gates ?? {})) {
      if (g.result === "FAIL") gateFailures.push({ caseId: c.id, gate, at: g.at });
    }
  }
  gateFailures.sort((a, b) => (a.at < b.at ? 1 : -1));

  const researched = contacts.filter((c) => c.company);

  return {
    syncHealth: health[0] ?? null,
    awaitingReview: awaiting.map((i) => ({
      caseId: i.case_id,
      code: i.code,
      title: i.title,
      owner: i.owner,
      updatedAt: i.updated_at,
    })),
    gateFailures,
    manualOpen,
    outreach: {
      totalSlots: contacts.length,
      researched,
      replies: contacts.filter((c) => c.reply_status).length,
      checksCompleted: contacts.filter((c) => c.check_completed).length,
      introCallsBooked: contacts.filter((c) => c.intro_call_booked).length,
    },
    pipeline: cases.map((c) => {
      const n = countsByCase.get(c.id) ?? { total: 0, reviewed: 0, awaitingReview: 0, open: 0 };
      return {
        id: c.id,
        clientName: c.client_name,
        phase: c.phase,
        total: n.total,
        reviewed: n.reviewed,
        awaitingReview: n.awaitingReview,
        open: n.open,
        updatedAt: c.updated_at,
      };
    }),
    done: buildDone(events),
  };
}

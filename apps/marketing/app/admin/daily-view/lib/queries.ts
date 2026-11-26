import { sbGet } from "./supabase";
import { computeTouchDue } from "./touch-due";
import type {
  AuditEventRow,
  CaseRow,
  ChecklistItemRow,
  DailyViewData,
  ManualLogRow,
  OutreachContactRow,
  OutreachTouchRow,
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

// Spine sync-health read, shared by the daily view and the admin shell's
// sync-health slot (same query either way — the shell just needs it standalone).
export async function getSyncHealth(): Promise<SyncHealthRow | null> {
  const rows = await sbGet<SyncHealthRow[]>("sync_health?select=*&source=eq.spine");
  return rows[0] ?? null;
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
  const [cases, allItems, awaiting, events, contacts, touches, manualOpen, health] =
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
        "outreach_contacts?select=id,packet_id,company,founder,grade,tof1_status,reply_status,check_completed,intro_call_booked&order=packet_id",
      ),
      // Step 6: every recorded touch, oldest first, grouped by contact below.
      sbGet<OutreachTouchRow[]>(
        "outreach_touches?select=id,contact_id,touch_no,sent_at,channel,outcome&order=sent_at.asc",
      ),
      sbGet<ManualLogRow[]>("manual_log?select=*&done=eq.false&order=at.desc"),
      getSyncHealth(),
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

  const touchesByContact = new Map<string, OutreachTouchRow[]>();
  for (const t of touches) {
    const list = touchesByContact.get(t.contact_id) ?? [];
    list.push(t);
    touchesByContact.set(t.contact_id, list);
  }
  const now = new Date();
  const researched = contacts
    .filter((c) => c.company)
    .map((c) => {
      const own = touchesByContact.get(c.id) ?? [];
      return { ...c, touches: own, touchDue: computeTouchDue(own, now) };
    });
  const touchDue = researched
    .filter((c) => c.touchDue.state === "due" || c.touchDue.state === "overdue")
    .sort((a, b) =>
      a.touchDue.state === b.touchDue.state
        ? (b.touchDue.daysSinceFirstTouch ?? 0) - (a.touchDue.daysSinceFirstTouch ?? 0)
        : a.touchDue.state === "overdue"
          ? -1
          : 1
    );

  return {
    syncHealth: health,
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
      touchDue,
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

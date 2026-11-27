// Action queue derivation (P2: the daily default view — Lintel's
// "Action Required" pattern from the polish spec). Pure and tested
// (tests/stage.test). A deal enters the queue ONLY for one of these
// stored-signal reasons — nothing is inferred beyond them:
//
//   contact, touch overdue  -> urgency "overdue"   (Touch 2/3 past its
//   contact, touch due      -> urgency "due"        ruled window, S1)
//   case, gate FAIL(s)      -> urgency "overdue"   (a hard-gate failure
//                                                   is the board's
//                                                   strongest signal)
//   contact, dormant        -> urgency "attention" (sequence exhausted;
//     candidate                                   reactivation is a
//                                                   decision, per P6's
//                                                   reactivation queue)
//   case, "unproven"        -> urgency "attention" (the panel guard:
//     a NON-TERMINAL case with no next action and no evidence — in
//     stored terms: zero checklist items AND zero gate results in the
//     mirror, so nothing about it is proven. Closed and stewardship
//     cases are terminal/register states and never land here.)
//
// Deliberately NOT queued (named so the omission is a decision, not an
// oversight):
//   - Team Review inside its 2-day SLA: Band B has no stored home
//     (Gap G4), so no application timestamp exists to measure an SLA
//     against. It joins the queue when G4 lands.
//   - ST items due: the stewardship register/deadline store is not
//     mirrored (Gap G6); checklist_items carry no due dates.
//   - Touch 1 not sent / touches waiting: a future or first action is
//     not yet DUE — the queue is due-and-overdue only, per P2.
//   - On-hold cases: a hold is a state on the card (clock keeps
//     running), not an action by itself.

import { formatPt } from "./format";
import type { Deal, QueueEntry, QueueUrgency } from "../types";

const URGENCY_ORDER: Record<QueueUrgency, number> = {
  overdue: 0,
  due: 1,
  attention: 2,
};

export function deriveActionQueue(deals: Deal[]): QueueEntry[] {
  const entries: QueueEntry[] = [];
  for (const deal of deals) {
    if (deal.kind === "contact") {
      const td = deal.touchDue;
      if (td.state === "overdue" || td.state === "due") {
        entries.push({
          key: `${deal.key}:touch`,
          dealKey: deal.key,
          kind: "contact",
          title: deal.company,
          stage: deal.stage,
          reason: td.label,
          urgency: td.state,
          sortDays: td.days,
        });
      }
      if (deal.sideStates.includes("dormant-candidate")) {
        entries.push({
          key: `${deal.key}:dormant`,
          dealKey: deal.key,
          kind: "contact",
          title: deal.company,
          stage: deal.stage,
          reason: "Dormant candidate — sequence exhausted, reactivation decision",
          urgency: "attention",
          sortDays: 0,
        });
      }
      continue;
    }
    // case deals
    if (deal.gateFailures > 0) {
      const latest = deal.gateResults.find((g) => g.result === "FAIL");
      entries.push({
        key: `${deal.key}:gate-fail`,
        dealKey: deal.key,
        kind: "case",
        title: deal.clientName,
        stage: deal.stage,
        reason: latest
          ? `${deal.gateFailures} gate FAIL${deal.gateFailures === 1 ? "" : "s"} — latest: “${latest.gate}” FAIL · ${formatPt(latest.at)}`
          : `${deal.gateFailures} gate FAIL${deal.gateFailures === 1 ? "" : "s"}`,
        urgency: "overdue",
        sortDays: 0,
      });
      continue;
    }
    const terminal = deal.stage === "c16-closed" || deal.stage.startsWith("d-");
    if (
      !terminal &&
      deal.checklist.total === 0 &&
      deal.gateResults.length === 0
    ) {
      entries.push({
        key: `${deal.key}:unproven`,
        dealKey: deal.key,
        kind: "case",
        title: deal.clientName,
        stage: deal.stage,
        reason: "Unproven — no checklist or gate evidence in the mirror",
        urgency: "attention",
        sortDays: 0,
      });
    }
  }
  return entries.sort(
    (a, b) =>
      URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency] ||
      b.sortDays - a.sortDays ||
      a.title.localeCompare(b.title),
  );
}

import type { CSSProperties } from "react";
import type { CaseDeal, ContactDeal, Deal } from "../types";
import { formatPt, pathLabel } from "../lib/format";
import { ACCENT, INK, LABEL, SECONDARY, chipStyle, pillStyle } from "./tokens";
import type { PillTone } from "./tokens";

// Summary card only (Stefano's standing rule: summary on the surface,
// detail behind the click), rebuilt to the polish spec's 6-slot anatomy:
//   1 company (14px semibold)      2 ONE status pill, top-right
//   3 person line                  4 honest signal line
//   5 touch dots / progress bar    6 footer: next action + time chip
// Chrome: white, 1px #E5E8EB border, 10px radius, resting shadow
// 0 1px 2px rgba(16,24,40,.06); the hover lift lives in Board's
// <style> block (.dp-card) — inline styles cannot express :hover.

const card: CSSProperties = {
  background: "#fff",
  border: "1px solid #E5E8EB",
  borderRadius: 10,
  padding: 12,
  marginBottom: 8,
  boxShadow: "0 1px 2px rgba(16,24,40,.06)",
};
const titleRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 8,
};
const title: CSSProperties = { fontSize: 14, fontWeight: 600, color: INK, lineHeight: 1.35 };
const person: CSSProperties = { fontSize: 13, color: SECONDARY, marginTop: 2 };
const signal: CSSProperties = { fontSize: 13, color: SECONDARY, marginTop: 6 };
const footer: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
  marginTop: 10,
};
const nextAction: CSSProperties = { fontSize: 12, color: LABEL };
// Fix pass #2: the bar is 7px tall and each segment carries a
// minimum visible width when its count is > 0 — at 2 of 157 reviewed
// the old 5px bar's ~1.3% fill was effectively invisible.
const barTrack: CSSProperties = {
  height: 7,
  borderRadius: 999,
  background: "#EEF1F4",
  display: "flex",
  overflow: "hidden",
  marginTop: 6,
};
// Fix pass #4: date/time text never wraps mid-date ("Nov 24, 7:32 AM"
// split across lines on the Onboarding card). Space pressure is taken
// by the surrounding text, never by breaking the date itself.
const noWrap: CSSProperties = { whiteSpace: "nowrap" };

function touchChip(deal: ContactDeal): { text: string; tone: PillTone } | null {
  const td = deal.touchDue;
  switch (td.state) {
    case "overdue":
      return { text: `${td.days}d overdue`, tone: "red" };
    case "due":
      return { text: "Due now", tone: "amber" };
    case "waiting":
      return { text: `Due in ${td.days}d`, tone: "green" };
    case "complete":
      return { text: "Sequence done", tone: "grey" };
    default:
      return null; // not-started: no chip — the next action says it
  }
}

function ContactCard({ deal }: { deal: ContactDeal }) {
  // Exactly one pill, by priority: dormant > intro call > replied >
  // check completed. Touch urgency lives in the footer chip instead.
  const pill = deal.sideStates.includes("dormant-candidate")
    ? { text: "Dormant candidate", tone: "grey" as PillTone }
    : deal.introCallBooked
      ? { text: "Intro call booked", tone: "green" as PillTone }
      : deal.replyStatus
        ? { text: "Replied", tone: "green" as PillTone }
        : deal.checkCompleted
          ? { text: "Check completed", tone: "green" as PillTone }
          : null;
  const chip = touchChip(deal);
  return (
    <div style={card} className="dp-card">
      <div style={titleRow}>
        <span style={title}>{deal.company}</span>
        {pill ? <span style={pillStyle(pill.tone)}>{pill.text}</span> : null}
      </div>
      <div style={person}>
        {deal.packetId}
        {deal.founder ? ` · ${deal.founder}` : ""}
      </div>
      <div style={signal}>
        {deal.grade != null ? `Grade ${deal.grade} · ` : ""}
        {deal.touchCount > 0
          ? `${deal.touchCount} of 3 touches sent`
          : "No touches yet"}
        {deal.lastTouchAt ? (
          <>
            {" "}· last <span style={noWrap}>{formatPt(deal.lastTouchAt)}</span>
          </>
        ) : null}
      </div>
      <div style={{ marginTop: 6, fontSize: 10, letterSpacing: 3 }} aria-hidden>
        {[1, 2, 3].map((n) => (
          <span key={n} style={{ color: n <= deal.touchCount ? "#0F5132" : "#D5DBE1" }}>
            ●
          </span>
        ))}
      </div>
      <div style={footer}>
        <span style={nextAction}>{deal.nextAction}</span>
        {chip ? <span style={chipStyle(chip.tone)}>{chip.text}</span> : null}
      </div>
    </div>
  );
}

function CaseCard({ deal }: { deal: CaseDeal }) {
  // Exactly one pill, by priority: gate FAIL > on hold > path.
  const path = pathLabel(deal.path);
  const pill =
    deal.gateFailures > 0
      ? { text: "Gate FAIL", tone: "red" as PillTone }
      : deal.sideStates.includes("on-hold")
        ? { text: "On hold", tone: "grey" as PillTone }
        : path
          ? { text: path, tone: (path === "Managed" ? "green" : "slate") as PillTone }
          : null;
  const c = deal.checklist;
  const latestGate = deal.gateResults[0];
  const chip =
    deal.clockDay != null
      ? deal.clockDay === 0
        ? { text: "Documents-Ready today", tone: "green" as PillTone }
        : {
            text: `Day ${deal.clockDay} of 120`,
            tone: (deal.clockDay > 120 ? "red" : "grey") as PillTone,
          }
      : {
          text: deal.updatedDaysAgo === 0 ? "Updated today" : `${deal.updatedDaysAgo}d idle`,
          tone: (deal.updatedDaysAgo > 21
            ? "red"
            : deal.updatedDaysAgo >= 7
              ? "amber"
              : "green") as PillTone,
        };
  return (
    <div style={card} className="dp-card">
      <div style={titleRow}>
        <span style={title}>{deal.clientName}</span>
        {pill ? <span style={pillStyle(pill.tone)}>{pill.text}</span> : null}
      </div>
      <div style={person}>
        {deal.caseId} · {deal.phase}
        {deal.sideStates.includes("on-hold") ? " · clock keeps running" : ""}
      </div>
      <div style={signal}>
        Checklist: {c.reviewed} reviewed · {c.awaitingReview} awaiting ·{" "}
        {c.open} open of {c.total}
      </div>
      <div style={barTrack} role="img" aria-label="Checklist progress">
        {c.total > 0 ? (
          <>
            <div
              style={{
                width: `${(c.reviewed / c.total) * 100}%`,
                minWidth: c.reviewed > 0 ? 6 : 0,
                background: ACCENT,
              }}
            />
            <div
              style={{
                width: `${(c.awaitingReview / c.total) * 100}%`,
                minWidth: c.awaitingReview > 0 ? 4 : 0,
                background: "#9DBEAC",
              }}
            />
          </>
        ) : null}
      </div>
      <div style={signal}>
        {latestGate ? (
          <span style={latestGate.result === "FAIL" ? { color: "#B3261E", fontWeight: 600 } : undefined}>
            Gate “{latestGate.gate}”: {latestGate.result} ·{" "}
            <span style={noWrap}>{formatPt(latestGate.at)}</span>
          </span>
        ) : (
          "No gate results yet"
        )}
      </div>
      <div style={footer}>
        <span style={nextAction}>{deal.nextAction}</span>
        <span style={chipStyle(chip.tone)}>{chip.text}</span>
      </div>
    </div>
  );
}

export function DealCard({ deal }: { deal: Deal }) {
  return deal.kind === "contact" ? (
    <ContactCard deal={deal} />
  ) : (
    <CaseCard deal={deal} />
  );
}

import type { CSSProperties } from "react";
import type { CaseDeal, ContactDeal, Deal } from "../types";
import { formatPt, pathLabel } from "../lib/format";

// Summary card only (Stefano's standing rule: summary on the surface,
// detail behind the click). The full record lives in the daily view / CRM /
// spine; v1 keeps the card to the fields an operator scans in the morning.

const card: CSSProperties = {
  border: "1px solid rgba(127,127,127,0.35)",
  borderRadius: 8,
  padding: "10px 12px",
  marginBottom: 10,
  fontSize: 14,
};
const dim: CSSProperties = { opacity: 0.75, fontSize: 13 };
const fail: CSSProperties = { color: "#c0392b", fontWeight: 600 };

function ContactCard({ deal }: { deal: ContactDeal }) {
  return (
    <div style={card}>
      <div>
        <strong>{deal.packetId}</strong> · {deal.company}
      </div>
      {deal.founder ? <div style={dim}>{deal.founder}</div> : null}
      <div style={dim}>
        {deal.grade != null ? `grade ${deal.grade} · ` : ""}
        {deal.touchCount > 0
          ? `${deal.touchCount} touch${deal.touchCount > 1 ? "es" : ""} · ${deal.touchDue.label}`
          : "no touches yet"}
      </div>
      {deal.replyStatus ? <div style={dim}>reply: {deal.replyStatus}</div> : null}
      {deal.checkCompleted ? <div style={dim}>2-Minute Check completed</div> : null}
      {deal.introCallBooked ? <div style={dim}>intro call booked</div> : null}
      {deal.sideStates.map((st) => (
        <div key={st} style={dim}>side state: {st}</div>
      ))}
      <div style={dim}>updated {formatPt(deal.updatedAt)}</div>
    </div>
  );
}

function CaseCard({ deal }: { deal: CaseDeal }) {
  const path = pathLabel(deal.path);
  return (
    <div style={card}>
      <div>
        <strong>{deal.caseId}</strong> · {deal.clientName}
      </div>
      <div style={dim}>
        {deal.phase}
        {path ? ` · ${path}` : ""}
      </div>
      <div style={dim}>
        checklist: {deal.checklist.reviewed} reviewed /{" "}
        {deal.checklist.awaitingReview} awaiting review / {deal.checklist.open}{" "}
        open (of {deal.checklist.total})
      </div>
      {deal.gateResults.slice(0, 3).map((g) => (
        <div key={g.gate} style={g.result === "FAIL" ? fail : dim}>
          Gate “{g.gate}”: {g.result} · {formatPt(g.at)}
        </div>
      ))}
      {deal.sideStates.map((st) => (
        <div key={st} style={dim}>side state: {st} — clock keeps running</div>
      ))}
      <div style={dim}>updated {formatPt(deal.updatedAt)}</div>
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

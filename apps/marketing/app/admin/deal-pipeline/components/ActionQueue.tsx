import type { CSSProperties } from "react";
import type { PipelineData, QueueEntry } from "../types";
import { stageDef } from "../lib/stage";
import { INK, LABEL, SECONDARY, chipStyle } from "./tokens";
import type { PillTone } from "./tokens";

// The action queue (P2 daily default — Lintel's "Action Required"
// pattern): the first element on the board, holding only due/overdue
// actions, gate FAILs, dormant candidates and unproven cases. The
// derivation lives in lib/queue.ts; categories with no honest data
// source (Team Review SLA — Gap G4; ST items due — Gap G6) are omitted
// there, not faked here.

const sectionTitle: CSSProperties = { fontSize: 20, fontWeight: 700, color: INK, margin: "6px 0 2px" };
const note: CSSProperties = { fontSize: 13, color: SECONDARY, marginBottom: 12 };
const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
  alignItems: "start",
};
const card: CSSProperties = {
  background: "#fff",
  border: "1px solid #E5E8EB",
  borderRadius: 10,
  padding: 12,
  boxShadow: "0 1px 2px rgba(16,24,40,.06)",
};
const titleRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 8,
};
const title: CSSProperties = { fontSize: 14, fontWeight: 600, color: INK, lineHeight: 1.35 };
const stageLine: CSSProperties = { fontSize: 12, color: LABEL, marginTop: 2 };
const reason: CSSProperties = { fontSize: 13, color: SECONDARY, marginTop: 6 };
const empty: CSSProperties = { fontSize: 13, color: SECONDARY };

const URGENCY_TONE: Record<QueueEntry["urgency"], PillTone> = {
  overdue: "red",
  due: "amber",
  attention: "grey",
};
const URGENCY_LABEL: Record<QueueEntry["urgency"], string> = {
  overdue: "Overdue",
  due: "Due",
  attention: "Attention",
};

export function ActionQueue({ data }: { data: PipelineData }) {
  const queue = data.actionQueue;
  return (
    <section>
      <h2 style={sectionTitle}>Action queue ({queue.length})</h2>
      <p style={note}>
        Due and overdue only — touch windows, gate FAILs, dormant
        candidates, unproven cases. This is the daily default view (P2).
      </p>
      {queue.length === 0 ? (
        <p style={empty}>
          Nothing needs action — no touches due, no gate FAILs, no
          dormant candidates, no unproven cases.
        </p>
      ) : (
        <div style={grid}>
          {queue.map((entry) => (
            <div key={entry.key} style={card} className="dp-card">
              <div style={titleRow}>
                <span style={title}>{entry.title}</span>
                <span style={chipStyle(URGENCY_TONE[entry.urgency])}>
                  {URGENCY_LABEL[entry.urgency]}
                </span>
              </div>
              <div style={stageLine}>
                {entry.kind === "case" ? "Case" : "Contact"} ·{" "}
                {stageDef(entry.stage).label}
              </div>
              <div style={reason}>{entry.reason}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

import type { CSSProperties } from "react";
import type { StewardshipRow } from "../types";
import { INK, SECONDARY, NUMERIC, pillStyle } from "./tokens";
import type { PillTone } from "./tokens";

// Band D register (P2 — Nozti table pattern): stewardship is a table,
// not Kanban columns, because S2 Quarterly / S3 Annual / S4 Refinance
// run concurrently — one case, one row, with value and urgency reading
// together. Columns: Company | Stage pill | Post-close day | Next
// deliverable due | Fee status. The last three have no source in the
// mirror today (the stewardship register is Gap G6), so cells render
// "—" — stated in the empty note rather than filled with invention.

const table: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  border: "1px solid #E5E8EB",
  borderRadius: 10,
  fontSize: 13,
};
const th: CSSProperties = {
  textAlign: "left",
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: ".04em",
  color: "#667085",
  padding: "10px 12px",
  borderBottom: "1px solid #E5E8EB",
};
const td: CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid #F0F2F4",
  color: INK,
  verticalAlign: "middle",
};
const emptyNote: CSSProperties = { fontSize: 13, color: SECONDARY };

// Muted, distinct pill tints per S-stage (polish spec: muted only).
const STAGE_TONES: Record<string, PillTone> = {
  "d-s0-activation": "slate",
  "d-s1-first-90": "green",
  "d-s2-quarterly": "amber",
  "d-s3-annual": "grey",
  "d-s4-refinance-window": "amber",
  "d-s5-term-end": "slate",
};

const dash = "—";

export function RegisterTable({ rows }: { rows: StewardshipRow[] }) {
  if (rows.length === 0) {
    return (
      <p style={emptyNote}>
        No stewardship cases yet — the register fills when the first
        case closes (Gap G6). Post-close day, next deliverable and fee
        status show “{dash}” until the stewardship register is mirrored;
        nothing is estimated.
      </p>
    );
  }
  return (
    <table style={table}>
      <thead>
        <tr>
          <th style={th}>Company</th>
          <th style={th}>Stage</th>
          <th style={th}>Post-close day</th>
          <th style={th}>Next deliverable due</th>
          <th style={th}>Fee status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <td style={{ ...td, fontWeight: 600 }}>
              {row.company}
              <span style={{ color: "#667085", fontWeight: 400 }}> · {row.caseId}</span>
            </td>
            <td style={td}>
              <span style={pillStyle(STAGE_TONES[row.stage] ?? "grey")}>
                {row.stageLabel}
              </span>
            </td>
            <td style={{ ...td, ...NUMERIC }}>{row.postCloseDay ?? dash}</td>
            <td style={td}>{row.nextDeliverable ?? dash}</td>
            <td style={td}>{row.feeStatus ?? dash}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

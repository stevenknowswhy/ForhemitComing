import type { CSSProperties } from "react";
import type { DailyViewData, SyncHealthRow } from "../types";
import { formatPt } from "../lib/queries";

// Presentational blocks for the /admin daily view. Styling follows the
// existing admin pages (plain inline styles, no marketing chrome).

const section: CSSProperties = { marginBottom: 28 };
const h2: CSSProperties = { fontSize: 20, fontWeight: 600, margin: "0 0 8px" };
const dim: CSSProperties = { opacity: 0.75, fontSize: 14 };
const row: CSSProperties = { padding: "6px 0", borderBottom: "1px solid rgba(127,127,127,0.25)", fontSize: 15 };

export function SyncHealthLine({ health }: { health: SyncHealthRow | null }) {
  const h = health;
  if (!h) return <p style={dim}>Sync health: no sync record yet.</p>;
  const stale =
    h.last_ok_at && Date.now() - new Date(h.last_ok_at).getTime() > 30 * 60 * 1000;
  return (
    <p style={{ ...dim, marginBottom: 20 }}>
      Spine sync: last OK {formatPt(h.last_ok_at)}
      {stale ? " — STALE (>30 min)" : ""}
      {h.last_error ? ` — last error: ${h.last_error}` : ""}
    </p>
  );
}

export function NeedsYou({ data }: { data: DailyViewData }) {
  const empty =
    data.awaitingReview.length === 0 &&
    data.gateFailures.length === 0 &&
    data.manualOpen.length === 0;
  return (
    <section style={section}>
      <h2 style={h2}>Needs you today</h2>
      {empty && <p style={dim}>Nothing is blocked on you right now.</p>}
      {data.awaitingReview.map((i) => (
        <div key={`${i.caseId}:${i.code}`} style={row}>
          <strong>{i.caseId}</strong> · {i.code} awaiting review — {i.title}
          {i.owner ? <span style={dim}> (owner: {i.owner})</span> : null}
          <span style={dim}> · since {formatPt(i.updatedAt)}</span>
        </div>
      ))}
      {data.gateFailures.map((g) => (
        <div key={`${g.caseId}:${g.gate}`} style={row}>
          <strong>{g.caseId}</strong> · Gate “{g.gate}” last evaluated FAIL
          <span style={dim}> · {formatPt(g.at)}</span>
        </div>
      ))}
      {data.manualOpen.map((m) => (
        <div key={m.id} style={row}>
          <strong>{m.kind}</strong> — {m.subject}
          {m.detail ? <span style={dim}> · {m.detail}</span> : null}
          <span style={dim}> · {formatPt(m.at)}</span>
        </div>
      ))}
    </section>
  );
}

export function OutreachToday({ data }: { data: DailyViewData }) {
  const o = data.outreach;
  return (
    <section style={section}>
      <h2 style={h2}>Outreach today</h2>
      <p style={dim}>
        {o.researched.length} researched of {o.totalSlots} pilot slots ·{" "}
        {o.replies} replies · {o.checksCompleted} checks completed ·{" "}
        {o.introCallsBooked} intro calls booked
      </p>
      {o.researched.map((c) => (
        <div key={c.packet_id} style={row}>
          <strong>{c.packet_id}</strong> · {c.company}
          {c.founder ? <span> — {c.founder}</span> : null}
          {c.grade != null ? <span style={dim}> · grade {c.grade}</span> : null}
          {c.tof1_status ? <span style={dim}> · {c.tof1_status}</span> : null}
        </div>
      ))}
      <p style={dim}>Touch-due computation (Day 4–5 / Day 12–14) arrives in Step 6.</p>
    </section>
  );
}

export function Pipeline({ data }: { data: DailyViewData }) {
  return (
    <section style={section}>
      <h2 style={h2}>Pipeline</h2>
      {data.pipeline.length === 0 && <p style={dim}>No cases in the spine yet.</p>}
      {data.pipeline.map((c) => (
        <div key={c.id} style={row}>
          <strong>{c.id}</strong> · {c.clientName} — {c.phase}
          <span style={dim}>
            {" "}· checklist: {c.reviewed} reviewed / {c.awaitingReview} awaiting review /{" "}
            {c.open} open (of {c.total}) · updated {formatPt(c.updatedAt)}
          </span>
        </div>
      ))}
    </section>
  );
}

export function DoneToday({ data }: { data: DailyViewData }) {
  const d = data.done;
  return (
    <section style={section}>
      <h2 style={h2}>Done</h2>
      <p style={dim}>
        {d.totalEvents} spine audit events, {d.windowLabel}. Proven from the
        audit log — nothing here was typed in.
      </p>
      {d.byEvent.map((b) => (
        <div key={b.event} style={row}>
          {b.event} <span style={dim}>× {b.count}</span>
        </div>
      ))}
      {d.latest.length > 0 && (
        <p style={{ ...dim, marginTop: 10 }}>
          Latest: {d.latest[0].event} · {d.latest[0].case_id ?? "—"} ·{" "}
          {formatPt(d.latest[0].at)}
        </p>
      )}
    </section>
  );
}

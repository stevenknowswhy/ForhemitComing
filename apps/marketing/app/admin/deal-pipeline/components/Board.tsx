import type { CSSProperties } from "react";
import type { PipelineData, PipelineStageDef } from "../types";
import { DealCard } from "./DealCard";
import { ActionQueue } from "./ActionQueue";
import { FunnelStrip } from "./FunnelStrip";
import { RegisterTable } from "./RegisterTable";
import { INK, LABEL, SECONDARY, NUMERIC } from "./tokens";

// Presentational board for /admin/pipeline, v2 shape (P2) + polish
// spec: action queue first (the daily default), then the 4 bands.
// Band B opens with the anonymous funnel strip (stages 5-7 are not
// columns); Band D is a register table. Column headers follow the Bond
// pattern: small colored dot + stage name (12px semibold uppercase),
// count beneath it, and an honest right-aligned total where one exists
// (Band A: researched of slots; Band C: gate FAILs in the column —
// never a $ figure; Forhemit cards carry no deal $ at these stages).
// No data fetching here — DealPipeline assembles PipelineData
// server-side, so the service-role key never crosses into client code.

// The one piece of real CSS the board needs: the card hover lift
// (polish spec — shadow lift + translateY(-2px), 150-200ms ease).
// Inline styles cannot express :hover, so it rides in this block.
const BOARD_CSS = `
.dp-card { transition: box-shadow .18s ease, transform .18s ease; }
.dp-card:hover { box-shadow: 0 4px 12px rgba(16,24,40,.10); transform: translateY(-2px); }
`;

const summary: CSSProperties = { fontSize: 15, color: SECONDARY, margin: "0 0 20px" };
const bandTitle: CSSProperties = { fontSize: 21, fontWeight: 700, color: INK, margin: "30px 0 2px" };
const bandNote: CSSProperties = { fontSize: 13, color: SECONDARY, marginBottom: 12 };
const lanes: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
  alignItems: "start",
};
const lane: CSSProperties = {
  minWidth: 0,
  background: "#F9FAFB",
  border: "1px solid #ECEFF2",
  borderRadius: 12,
  padding: 10,
};
const headRow: CSSProperties = { display: "flex", justifyContent: "space-between", gap: 8 };
const stageName: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: ".04em",
  color: INK,
  display: "flex",
  alignItems: "center",
  gap: 6,
  margin: 0,
};
const dot: CSSProperties = { width: 8, height: 8, borderRadius: 999, flex: "none" };
const count: CSSProperties = { fontSize: 13, fontWeight: 600, color: INK, marginTop: 2, ...NUMERIC };
const total: CSSProperties = { fontSize: 12, color: LABEL, textAlign: "right", ...NUMERIC };
const totalFail: CSSProperties = { ...total, color: "#B3261E", fontWeight: 600 };
const detail: CSSProperties = { fontSize: 12, color: LABEL, margin: "2px 0 8px" };
const empty: CSSProperties = { fontSize: 13, color: SECONDARY, margin: "2px 0 4px" };

export function CountsHeader({ data }: { data: PipelineData }) {
  const c = data.counts;
  return (
    <p style={summary}>
      {c.totalDeals} deals on the board · {c.totalResearched} researched of{" "}
      {c.totalSlots} pilot slots · {c.activeCases} active spine cases ·{" "}
      {c.gateFailures} gate FAIL{c.gateFailures === 1 ? "" : "s"} across the
      pipeline
      {c.actionNeeded > 0
        ? ` · ${c.actionNeeded} need${c.actionNeeded === 1 ? "s" : ""} action below`
        : ""}
    </p>
  );
}

function stageTotal(
  stage: PipelineStageDef,
  data: PipelineData,
): { text: string; fail: boolean } | null {
  const deals = data.dealsByStage[stage.id];
  if (stage.id === "a1-researched") {
    return { text: `of ${data.counts.totalSlots} slots`, fail: false };
  }
  if (stage.band === "C") {
    const fails = deals.reduce(
      (n, d) => n + (d.kind === "case" ? d.gateFailures : 0),
      0,
    );
    if (fails > 0) return { text: `${fails} gate FAIL${fails === 1 ? "" : "s"}`, fail: true };
  }
  return null;
}

function StageColumn({
  stage,
  data,
}: {
  stage: PipelineStageDef;
  data: PipelineData;
}) {
  const deals = data.dealsByStage[stage.id];
  const tot = stageTotal(stage, data);
  return (
    <section style={lane}>
      <div style={headRow}>
        <div>
          <h3 style={stageName}>
            <span style={{ ...dot, background: stage.dot }} />
            {stage.label}
          </h3>
          <div style={count}>
            {deals.length} {deals.length === 1 ? "deal" : "deals"}
          </div>
        </div>
        {tot ? (
          <div style={tot.fail ? totalFail : total}>{tot.text}</div>
        ) : null}
      </div>
      {stage.detail ? <p style={detail}>{stage.detail}</p> : null}
      {stage.crmLabel ? <p style={detail}>{stage.crmLabel}</p> : null}
      {deals.length === 0 ? (
        <p style={empty}>{stage.emptyNote}</p>
      ) : (
        deals.map((deal) => <DealCard key={deal.key} deal={deal} />)
      )}
    </section>
  );
}

export function Board({ data }: { data: PipelineData }) {
  return (
    <div>
      <style>{BOARD_CSS}</style>
      <CountsHeader data={data} />
      <ActionQueue data={data} />
      {data.bands.map((band) => {
        const stages = data.stages.filter((s) => s.band === band.id);
        return (
          <div key={band.id}>
            <h2 style={bandTitle}>{band.label}</h2>
            <p style={bandNote}>{band.note}</p>
            {band.id === "B" ? <FunnelStrip steps={data.funnelSteps} /> : null}
            {band.id === "D" ? (
              <RegisterTable rows={data.stewardship} />
            ) : (
              <div style={lanes}>
                {stages.map((stage) => (
                  <StageColumn key={stage.id} stage={stage} data={data} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

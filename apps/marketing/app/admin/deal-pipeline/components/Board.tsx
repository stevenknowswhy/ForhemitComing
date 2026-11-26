import type { CSSProperties } from "react";
import type { PipelineData } from "../types";
import { DealCard } from "./DealCard";

// Presentational board for /admin/pipeline: counts header + 4 section
// bands (A Top of funnel · B Qualification & engagement · C Transition ·
// D Stewardship, per DEAL-PIPELINE-OUTLINE-2026-11-26) with stage columns
// inside each band. No data fetching here — the server component
// (DealPipeline) assembles PipelineData, so the service-role key never
// crosses into client code. Unpopulated stages render their honest empty
// note (Band B and the clock-split C/D stages included).

const header: CSSProperties = { fontSize: 15, opacity: 0.85, marginBottom: 16 };
const bandTitle: CSSProperties = { fontSize: 21, fontWeight: 700, margin: "26px 0 2px" };
const bandNote: CSSProperties = { opacity: 0.75, fontSize: 13, marginBottom: 12 };
const board: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
  alignItems: "start",
};
const column: CSSProperties = { minWidth: 0 };
const h3: CSSProperties = { fontSize: 16, fontWeight: 600, margin: "0 0 4px" };
const dim: CSSProperties = { opacity: 0.75, fontSize: 13 };

export function CountsHeader({ data }: { data: PipelineData }) {
  const c = data.counts;
  return (
    <p style={header}>
      {c.totalDeals} deals on the board · {c.totalResearched} researched of{" "}
      {c.totalSlots} pilot slots · {c.activeCases} active spine cases ·{" "}
      {c.gateFailures} gate FAIL{c.gateFailures === 1 ? "" : "s"} across the
      pipeline
    </p>
  );
}

export function Board({ data }: { data: PipelineData }) {
  return (
    <div>
      <CountsHeader data={data} />
      {data.bands.map((band) => {
        const stages = data.stages.filter((s) => s.band === band.id);
        return (
          <div key={band.id}>
            <h2 style={bandTitle}>{band.label}</h2>
            <p style={bandNote}>{band.note}</p>
            <div style={board}>
              {stages.map((stage) => {
                const deals = data.dealsByStage[stage.id];
                return (
                  <section key={stage.id} style={column}>
                    <h3 style={h3}>
                      {stage.label} ({deals.length})
                    </h3>
                    {stage.detail ? <p style={dim}>{stage.detail}</p> : null}
                    {stage.crmLabel ? <p style={dim}>{stage.crmLabel}</p> : null}
                    {deals.length === 0 ? (
                      <p style={dim}>{stage.emptyNote}</p>
                    ) : (
                      deals.map((deal) => <DealCard key={deal.key} deal={deal} />)
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import type { IntakeResultState } from "../types";

type Props = {
  result: IntakeResultState;
  onRestart: () => void;
};

export function ClassificationIntakeResult({ result, onRestart }: Props) {
  return (
    <div className="ci-result">
      <p className="ci-r-type">
        Type {result.type ?? "—"} — {result.label ?? "Your roadmap"}
        {result.preCOOP ? " — Lender Track Active" : ""}
      </p>

      <h3 className="ci-r-headline">{result.roadmap.headline}</h3>
      <p className="ci-r-sub">{result.roadmap.sub}</p>

      <div className="ci-r-meta">
        <div className="ci-r-meta-item">
          <span className="ci-r-meta-label">Timeline</span>
          <span className="ci-r-meta-val">{result.roadmap.timeline}</span>
        </div>
        <div className="ci-r-meta-item">
          <span className="ci-r-meta-label">Reference</span>
          <span className="ci-r-meta-val ci-r-mono">{result.clientId}</span>
        </div>
        {result.preCOOP && (
          <div className="ci-r-meta-item">
            <span className="ci-r-meta-label">Track</span>
            <span className="ci-r-meta-val ci-brass">{result.preCOOP.track}</span>
          </div>
        )}
        {result.roadmap.urgencyNote && (
          <div className="ci-r-meta-item">
            <span className="ci-r-meta-label">Close Mode</span>
            <span
              className={`ci-r-meta-val ${result.closeUrgency === "fast" ? "ci-brass" : ""}`}
            >
              {result.closeUrgency === "fast" ? "Fast Close" : "Full Preparation"}
            </span>
          </div>
        )}
      </div>

      <div className="ci-r-stations">
        {result.roadmap.stations.map((s, i) => (
          <span key={`${s}-${i}`} style={{ display: "contents" }}>
            <span className={`ci-r-station ${s.includes("Lender") ? "ci-lender" : ""}`}>{s}</span>
            {i < result.roadmap.stations.length - 1 && <span className="ci-r-station-sep">—</span>}
          </span>
        ))}
      </div>

      {result.roadmap.urgencyNote && (
        <p className="ci-r-note">{result.roadmap.urgencyNote}</p>
      )}

      {result.roadmap.trackNote && <p className="ci-r-note">{result.roadmap.trackNote}</p>}

      {result.preCOOP && (
        <div className="ci-precoop">
          <p className="ci-pc-id">
            {result.preCOOP.clientId} — {result.preCOOP.date}
          </p>

          <div className="ci-pc-bar-wrap">
            <div className="ci-pc-bar">
              <div className="ci-pc-bar-fill" style={{ width: `${result.preCOOP.pct}%` }} />
            </div>
            <span className="ci-pc-pct">{result.preCOOP.pct}%</span>
          </div>

          <div className="ci-pc-rows">
            {result.preCOOP.done.map((s) => (
              <div key={s} className="ci-pc-row">
                <span className="ci-pc-row-status ci-done">Complete</span>
                <span className="ci-pc-row-name">{s}</span>
              </div>
            ))}
            {result.preCOOP.active.map((s) => (
              <div key={s} className="ci-pc-row">
                <span className="ci-pc-row-status ci-active">Active</span>
                <span className="ci-pc-row-name">{s}</span>
              </div>
            ))}
            {result.preCOOP.pending.map((s) => (
              <div key={s} className="ci-pc-row">
                <span className="ci-pc-row-status ci-pending">Pending</span>
                <span className="ci-pc-row-name">{s}</span>
              </div>
            ))}
          </div>

          <div className="ci-pc-grid">
            <div className="ci-pc-cell">
              <p className="ci-pc-cell-label">Sale Track</p>
              <p className="ci-pc-cell-val">{result.preCOOP.track}</p>
            </div>
            <div className="ci-pc-cell">
              <p className="ci-pc-cell-label">Financing</p>
              <p className="ci-pc-cell-val">{result.preCOOP.fin}</p>
            </div>
            <div className="ci-pc-cell ci-pc-cell-last">
              <p className="ci-pc-cell-label">Closing Timeline</p>
              <p className="ci-pc-cell-val">To be confirmed</p>
            </div>
            <div className="ci-pc-cell ci-pc-cell-last">
              <p className="ci-pc-cell-label">Document Status</p>
              <p className="ci-pc-cell-val ci-brass">In Progress</p>
            </div>
          </div>
        </div>
      )}

      <div className="ci-r-actions">
        <button type="button" className="ci-cta-primary">
          Create Account to Get Started
        </button>
        {result.preCOOP && (
          <button type="button" className="ci-cta-secondary">
            Share Pre-COOP with Broker
          </button>
        )}
        <button type="button" className="ci-cta-ghost" onClick={onRestart}>
          Start over
        </button>
      </div>
    </div>
  );
}

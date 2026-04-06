"use client";

import { useState } from "react";
import {
  DUAL_TRACK_NOTE,
  FEE_PHASES,
  FEE_TOTALS,
  STATE_NOTES,
  STATES,
  TAG_DESCRIPTIONS,
  TAG_LABELS,
  type FeeTag,
  type StateKey,
} from "../lib/feeData";
import { FeeTransparencyPdfLink } from "./FeeTransparencyPdfLink";

function TagBadge({ tag }: { tag: FeeTag }) {
  return (
    <span
      className={`ft-tag ft-tag--${tag}`}
      title={TAG_DESCRIPTIONS[tag]}
      aria-label={`${TAG_LABELS[tag]}: ${TAG_DESCRIPTIONS[tag]}`}
    >
      {TAG_LABELS[tag]}
    </span>
  );
}

export function FeeTransparencyContent() {
  const [state, setState] = useState<StateKey>("florida");
  const [openPhase, setOpenPhase] = useState<string | null>("phase1");
  const [showDualTrack, setShowDualTrack] = useState(false);

  const stateNote = STATE_NOTES[state];

  return (
    <div className="ft-wrap">
      {/* Disclaimer banner */}
      <div className="ft-disclaimer" role="note">
        <span className="ft-disclaimer-icon" aria-hidden>⚠</span>
        <p>
          <strong>Approximation only.</strong> These figures are illustrative estimates based on NCEO 2024
          industry benchmarks for leveraged ESOP transactions in the $3M–$15M EBITDA range. They are{" "}
          <strong>not a quote, commitment, or legal advice.</strong> Actual costs vary by deal complexity,
          team experience, and timeline. Always obtain written proposals from NCEO/ESOP Association-listed
          providers and consult qualified legal and tax counsel.
        </p>
      </div>

      {/* Context: fees exist in any deal */}
      <div className="ft-context">
        <h3 className="ft-context-title">Every business sale has transaction costs</h3>
        <p className="ft-context-body">
          Whether you sell to a private buyer or through an ESOP, there are fees—attorneys, appraisers,
          advisors, and due diligence. We believe sellers deserve full transparency before committing to any
          path. The breakdown below shows what to expect, when to expect it, and whether each cost is
          ESOP-specific or applies to any sale.
        </p>
      </div>

      {/* Legend */}
      <div className="ft-legend">
        <div className="ft-legend-item">
          <TagBadge tag="universal" />
          <span>{TAG_DESCRIPTIONS.universal}</span>
        </div>
        <div className="ft-legend-item">
          <TagBadge tag="esop-specific" />
          <span>{TAG_DESCRIPTIONS["esop-specific"]}</span>
        </div>
        <div className="ft-legend-item">
          <TagBadge tag="varies" />
          <span>{TAG_DESCRIPTIONS.varies}</span>
        </div>
      </div>

      {/* State selector */}
      <div className="ft-state-row">
        <label htmlFor="ft-state-select" className="ft-state-label">
          Your state
        </label>
        <select
          id="ft-state-select"
          className="ft-state-select"
          value={state}
          onChange={(e) => setState(e.target.value as StateKey)}
        >
          {STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* State note */}
      <div className="ft-state-note" key={state}>
        <p className="ft-state-note-headline">{stateNote.headline}</p>
        <p className="ft-state-note-body">{stateNote.body}</p>
      </div>

      {/* Phase accordion */}
      <div className="ft-phases">
        {FEE_PHASES.map((phase) => {
          const isOpen = openPhase === phase.id;
          return (
            <div key={phase.id} className={`ft-phase ${isOpen ? "ft-phase--open" : ""}`}>
              <button
                type="button"
                className="ft-phase-hd"
                onClick={() => setOpenPhase(isOpen ? null : phase.id)}
                aria-expanded={isOpen}
              >
                <div className="ft-phase-hd-text">
                  <span className="ft-phase-label">{phase.label}</span>
                  <span className="ft-phase-sub">{phase.subtitle}</span>
                </div>
                <span className="ft-phase-chevron" aria-hidden>
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="ft-phase-body">
                  {phase.rows.map((row) => (
                    <div key={row.name} className="ft-fee-row">
                      <div className="ft-fee-row-top">
                        <span className="ft-fee-name">{row.name}</span>
                        <div className="ft-fee-right">
                          <span className="ft-fee-range">{row.range}</span>
                          <TagBadge tag={row.tag} />
                        </div>
                      </div>
                      <p className="ft-fee-note">{row.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="ft-totals">
        <div className="ft-totals-row">
          <span className="ft-totals-label">Total setup + Year 1</span>
          <span className="ft-totals-range">{FEE_TOTALS.low} – {FEE_TOTALS.high}</span>
        </div>
        <div className="ft-totals-typical">
          Most common in the $3M–$15M EBITDA range:{" "}
          <strong>{FEE_TOTALS.typical}</strong>
        </div>
        <p className="ft-totals-note">{FEE_TOTALS.note}</p>
      </div>

      {/* Dual-track toggle */}
      <div className="ft-dual-track">
        <button
          type="button"
          className="ft-dual-track-toggle"
          onClick={() => setShowDualTrack((v) => !v)}
          aria-expanded={showDualTrack}
        >
          {DUAL_TRACK_NOTE.headline}
          <span className="ft-phase-chevron" aria-hidden>{showDualTrack ? "−" : "+"}</span>
        </button>
        {showDualTrack && (
          <div className="ft-dual-track-body">
            <div className="ft-dual-track-item ft-dual-track-item--good">
              <span className="ft-dual-track-item-label">Universal fees (no double-spend)</span>
              <p>{DUAL_TRACK_NOTE.universal}</p>
            </div>
            <div className="ft-dual-track-item ft-dual-track-item--caution">
              <span className="ft-dual-track-item-label">ESOP-specific fees (sunk if M&amp;A wins)</span>
              <p>{DUAL_TRACK_NOTE.esopSunk}</p>
            </div>
            <div className="ft-dual-track-item ft-dual-track-item--note">
              <span className="ft-dual-track-item-label">Real-world data point</span>
              <p>{DUAL_TRACK_NOTE.offset}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer disclaimer */}
      <p className="ft-footer-note">
        Ranges are current as of 2026 and sourced from NCEO transaction surveys (237 responses, 2014–2023
        data). Figures represent the company&apos;s costs, not personal seller expenses.{" "}
        <strong>This is not legal or financial advice.</strong> Consult your attorney, CPA, and a
        licensed ESOP advisor before making any decisions.
      </p>

      <div className="ft-pdf-footer">
        <FeeTransparencyPdfLink className="ft-pdf-btn" surface="fee_modal">
          View printable PDF
        </FeeTransparencyPdfLink>
        <p className="ft-pdf-hint">
          Opens in a new tab — save or print from there. Same disclaimers as above; not a formal quote.
        </p>
      </div>
    </div>
  );
}

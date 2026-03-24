"use client";

import { useMemo, useState } from "react";
import { calculateDeal, fmt, fmtShort, STATE_RATES } from "../lib/dealCalculations";
import { STATES, type StateKey } from "../lib/feeData";
import { DealWaterfallTable } from "./DealWaterfallTable";

function SliderGroup({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="dc-slider-group">
      <div className="dc-slider-label-row">
        <label htmlFor={id} className="dc-label">
          {label}
        </label>
        <span className="dc-slider-value">{fmtShort(value)}</span>
      </div>
      <div className="dc-range-track">
        <div className="dc-range-fill" style={{ width: `${pct}%` }} aria-hidden />
        <input
          id={id}
          type="range"
          className="dc-range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
      <div className="dc-range-limits">
        <span>{fmtShort(min)}</span>
        <span>{fmtShort(max)}</span>
      </div>
      {hint && <p className="dc-slider-hint">{hint}</p>}
    </div>
  );
}

export function DealComparisonSection() {
  const [esopValue, setEsopValue] = useState(5_000_000);
  const [taxBasis, setTaxBasis] = useState(250_000);
  const [state, setState] = useState<StateKey>("florida");
  const [showWaterfall, setShowWaterfall] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [hasEngaged, setHasEngaged] = useState(false);

  const r = useMemo(
    () => calculateDeal({ esopValue, taxBasis, state }),
    [esopValue, taxBasis, state]
  );

  const peExtraNeeded = r.peEquivalentFor1042 - r.esopValue;
  const hasStateTax = STATE_RATES[state] > 0;

  function handleSliderChange(setter: (v: number) => void, value: number) {
    setter(value);
    if (!hasEngaged) setHasEngaged(true);
  }

  function handleStateChange(value: StateKey) {
    setState(value);
    if (!hasEngaged) setHasEngaged(true);
  }

  return (
    <section id="fmp-comparison" className="fmp-section dc-section" aria-labelledby="dc-heading">
      <h2 id="dc-heading" className="fmp-section-title">
        How much can I expect?
      </h2>
      <p className="fmp-section-lead">
        Adjust the sliders to match your situation and see your estimated net proceeds — including the
        §1042 tax election only ESOP sellers can use.{" "}
        <strong>Approximations only. Not a quote or financial advice.</strong>
      </p>

      {/* ── Entry button ── */}
      {!showInputs && (
        <span className="fmp-cta-shell fmp-cta-shell--inline fmp-cta-shell--mb-section">
          <span className="fmp-cta-shell__glow" aria-hidden />
          <button type="button" className="dc-entry-btn" onClick={() => setShowInputs(true)}>
            Calculate My Estimate
            <span className="dc-entry-btn-arrow" aria-hidden>→</span>
          </button>
        </span>
      )}

      {/* ── Inputs (revealed after button click) ── */}
      {showInputs && (
        <div className="dc-inputs">
          <SliderGroup
            id="dc-esop-value"
            label="Expected ESOP valuation"
            value={esopValue}
            min={3_000_000}
            max={25_000_000}
            step={500_000}
            onChange={(v) => handleSliderChange(setEsopValue, v)}
            hint="Your business's fair market value — the price the ESOP trust will pay you."
          />
          <SliderGroup
            id="dc-tax-basis"
            label="Your adjusted tax basis"
            value={taxBasis}
            min={0}
            max={3_000_000}
            step={50_000}
            onChange={(v) => handleSliderChange(setTaxBasis, v)}
            hint="What you originally paid for / invested in the business. If you founded it, this is often very low."
          />
          <div className="dc-select-group">
            <label htmlFor="dc-state" className="dc-label">
              Your state
            </label>
            <select
              id="dc-state"
              className="ft-state-select"
              value={state}
              onChange={(e) => handleStateChange(e.target.value as StateKey)}
            >
              {STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {state === "other" && (
              <p className="dc-state-note-inline">
                Using 8% as a representative state tax rate for &ldquo;other&rdquo; states. Your actual
                rate will vary — consult your CPA.
              </p>
            )}
            {!hasStateTax && (
              <p className="dc-state-note-inline dc-state-note-inline--good">
                {state === "florida" ? "Florida" : state === "texas" ? "Texas" : "Tennessee"} has no
                state income tax — your state tax on this sale is $0.
              </p>
            )}
          </div>

          {!hasEngaged && (
            <p className="dc-engage-prompt">
              Move a slider above to see your personalised estimate →
            </p>
          )}
        </div>
      )}

      {/* ── Everything below only shows once user has engaged ── */}
      {hasEngaged && (
        <>
      {/* ── Summary comparison ── */}
      <div className="dc-summary">
        <div className="dc-summary-col dc-summary-col--esop">
          <p className="dc-summary-path-label">ESOP via Forhemit</p>
          <p className="dc-summary-headline">{fmtShort(r.esopValue)}</p>
          <p className="dc-summary-headline-sub">purchase price</p>

          <div className="dc-summary-divider" aria-hidden />

          <div className="dc-metric">
            <span className="dc-metric-label">Net after-tax (base)</span>
            <span className="dc-metric-value">{fmt(r.esopNetAfterTax)}</span>
          </div>
          <div className="dc-metric">
            <span className="dc-metric-label">Total tax bill</span>
            <span className="dc-metric-value dc-metric-value--muted">({fmt(r.esopTotalTax)})</span>
          </div>

          <div className="dc-summary-divider" aria-hidden />

          <div className="dc-metric dc-metric--highlight">
            <span className="dc-metric-label">
              With §1042 election
              <span className="dc-badge">ESOP only</span>
            </span>
            <span className="dc-metric-value dc-metric-value--big">{fmt(r.esopWith1042)}</span>
            <span className="dc-metric-sub">Tax fully deferred — reinvest in QRP</span>
          </div>
        </div>

        <div className="dc-summary-vs" aria-hidden>
          vs.
        </div>

        <div className="dc-summary-col dc-summary-col--pe">
          <p className="dc-summary-path-label">Private buyer</p>
          <p className="dc-summary-headline">{fmtShort(r.peHeadline)}</p>
          <p className="dc-summary-headline-sub">typical headline offer</p>

          <div className="dc-summary-divider" aria-hidden />

          <div className="dc-metric">
            <span className="dc-metric-label">Net after-tax (realistic)</span>
            <span className="dc-metric-value">{fmt(r.peNetAfterTax)}</span>
          </div>
          <div className="dc-metric">
            <span className="dc-metric-label">Total tax + costs</span>
            <span className="dc-metric-value dc-metric-value--muted">
              ({fmt(r.peTotalTax + r.peSellerCosts)})
            </span>
          </div>

          <div className="dc-summary-divider" aria-hidden />

          <div className="dc-metric dc-metric--unavailable">
            <span className="dc-metric-label">§1042 election</span>
            <span className="dc-metric-value dc-metric-value--na">Not available</span>
            <span className="dc-metric-sub">No equivalent tax deferral mechanism</span>
          </div>
        </div>
      </div>

      {/* ── §1042 equivalence callout ── */}
      <div className="dc-equiv-callout">
        <div className="dc-equiv-callout-inner">
          <p className="dc-equiv-label">
            To match your ESOP §1042 result, a private buyer would need to offer:
          </p>
          <p className="dc-equiv-value">{fmt(r.peEquivalentFor1042)}</p>
          <p className="dc-equiv-note">
            That&apos;s{" "}
            <strong>{fmtShort(peExtraNeeded)} more</strong> than your ESOP price — before earnout
            risk, escrow holds, or a 5–7 year lockup on the rollover equity they&apos;d require you to
            keep.
          </p>
        </div>
      </div>

      {/* ── Earnout warning ── */}
      <div className="dc-insight-strip">
        <div className="dc-insight-item">
          <span className="dc-insight-icon" aria-hidden>⚠</span>
          <span>
            <strong>61.5%</strong> of that PE headline is cash at close. The rest — earnout, escrow,
            rollover equity — arrives over 5–7 years and is not guaranteed.
          </span>
        </div>
        <div className="dc-insight-item">
          <span className="dc-insight-icon" aria-hidden>📋</span>
          <span>
            PE earnout payments are taxed at <strong>ordinary income rates (~37%+)</strong>, not capital
            gains — eroding an already uncertain number.
          </span>
        </div>
        <div className="dc-insight-item">
          <span className="dc-insight-icon" aria-hidden>🔒</span>
          <span>
            Running both tracks in parallel is <strong>insurance</strong>: if a private buyer walks at
            the last minute, your ESOP closing is already funded and ready.
          </span>
        </div>
      </div>

      {/* ── Expandable waterfall ── */}
      <button
        type="button"
        className="dc-waterfall-toggle"
        onClick={() => setShowWaterfall((v) => !v)}
        aria-expanded={showWaterfall}
      >
        {showWaterfall ? "Hide" : "Show"} full line-by-line breakdown
        <span aria-hidden>{showWaterfall ? " −" : " +"}</span>
      </button>

      {showWaterfall && <DealWaterfallTable results={r} state={state} />}

      {/* ── Disclaimer ── */}
      <p className="dc-disclaimer">
        ⚠ <strong>Approximation only — not legal, tax, or financial advice.</strong> Figures use NCEO
        2024 benchmarks: PE headline 30% above ESOP; 61.5% PE cash at close; 45% earnout realization;
        1.8× rollover return over 6 years. Tax rates: 20% federal LT cap gains + 3.8% NIIT + state rate
        shown. "Other state" uses 8% as a representative rate. §1042 election requires a C-Corp stock
        sale with reinvestment in Qualified Replacement Property within 12 months of closing. Consult your
        CPA, ESOP attorney, and a licensed ESOP advisor before making any decisions.
      </p>
        </>
      )}
    </section>
  );
}

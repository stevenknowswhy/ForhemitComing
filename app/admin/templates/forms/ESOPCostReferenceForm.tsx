"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import type { TemplateFormHandle } from "../registry";

/* Re-export as alias for backward compatibility */
export type ESOPFormHandle = TemplateFormHandle;

/* ── Types ── */
type Stage = "preloi" | "mid" | "postfmv" | "custom";

interface FormInputs {
  purchasePrice: number;
  taxRate: number;
  forhemit_low: number;
  forhemit_high: number;
  trustee_low: number;
  trustee_high: number;
  appraisal_low: number;
  appraisal_high: number;
  counsel_low: number;
  counsel_high: number;
  sba_low: number;
  sba_high: number;
  stamp_low: number;
  stamp_high: number;
  qoe_low: number;
  qoe_high: number;
  legal_low: number;
  legal_high: number;
  cpa_low: number;
  cpa_high: number;
}

const defaultInputs: FormInputs = {
  purchasePrice: 10_000_000,
  taxRate: 23.8,
  forhemit_low: 25_000,
  forhemit_high: 25_000,
  trustee_low: 22_000,
  trustee_high: 55_000,
  appraisal_low: 18_000,
  appraisal_high: 40_000,
  counsel_low: 40_000,
  counsel_high: 55_000,
  sba_low: 120_000,
  sba_high: 175_000,
  stamp_low: 30_000,
  stamp_high: 42_000,
  qoe_low: 18_000,
  qoe_high: 28_000,
  legal_low: 15_000,
  legal_high: 30_000,
  cpa_low: 8_000,
  cpa_high: 20_000,
};

function fmt(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

/* ── Calculation helpers ── */
function calcCurrents(inputs: FormInputs, stage: Stage) {
  let forhemit_curr = inputs.forhemit_low;
  let trustee_curr = 0;
  let appraisal_curr = 0;
  let counsel_curr = 0;

  if (stage === "preloi") {
    // Only retainer
  } else if (stage === "mid") {
    trustee_curr = Math.round(
      (inputs.trustee_low + inputs.trustee_high) / 2
    );
    appraisal_curr = Math.round(
      (inputs.appraisal_low + inputs.appraisal_high) / 2
    );
    counsel_curr = Math.round(inputs.counsel_low * 0.3);
  } else if (stage === "postfmv") {
    trustee_curr = inputs.trustee_high;
    appraisal_curr = inputs.appraisal_high;
    counsel_curr = inputs.counsel_high;
  }

  const sunkTotal = forhemit_curr + trustee_curr + appraisal_curr + counsel_curr;
  const sunkLow =
    inputs.forhemit_low + inputs.trustee_low + inputs.appraisal_low + inputs.counsel_low;
  const sunkHigh =
    inputs.forhemit_high + inputs.trustee_high + inputs.appraisal_high + inputs.counsel_high;
  const structLow = inputs.sba_low + inputs.stamp_low;
  const structHigh = inputs.sba_high + inputs.stamp_high;
  const qoeCurrent = Math.round((inputs.qoe_low + inputs.qoe_high) / 2);
  const legalCurrent = Math.round((inputs.legal_low + inputs.legal_high) / 2);
  const cpaCurrent = Math.round((inputs.cpa_low + inputs.cpa_high) / 2);
  const lostBenefit = Math.round(
    inputs.purchasePrice * (inputs.taxRate / 100)
  );
  const netImpact = sunkTotal + lostBenefit;

  return {
    forhemit_curr,
    trustee_curr,
    appraisal_curr,
    counsel_curr,
    sunkTotal,
    sunkLow,
    sunkHigh,
    structLow,
    structHigh,
    qoeCurrent,
    legalCurrent,
    cpaCurrent,
    lostBenefit,
    netImpact,
  };
}

/* ── Component ── */
const ESOPCostReferenceForm = forwardRef<
  ESOPFormHandle,
  { initialData?: Partial<FormInputs & { stage: Stage }> }
>(function ESOPCostReferenceForm({ initialData }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>(
    (initialData?.stage as Stage) ?? "preloi"
  );
  const [inputs, setInputs] = useState<FormInputs>({
    ...defaultInputs,
    ...initialData,
  });

  // Custom-stage overrides
  const [customCurrents, setCustomCurrents] = useState({
    trustee_curr: 0,
    appraisal_curr: 0,
    counsel_curr: 0,
  });

  const update = useCallback(
    (field: keyof FormInputs, value: number) =>
      setInputs((prev) => ({ ...prev, [field]: value })),
    []
  );

  const calc = useMemo(() => calcCurrents(inputs, stage), [inputs, stage]);

  // If custom stage, use custom overrides
  const eff = useMemo(() => {
    if (stage !== "custom") return calc;
    const sunkTotal =
      calc.forhemit_curr +
      customCurrents.trustee_curr +
      customCurrents.appraisal_curr +
      customCurrents.counsel_curr;
    const lostBenefit = calc.lostBenefit;
    return {
      ...calc,
      trustee_curr: customCurrents.trustee_curr,
      appraisal_curr: customCurrents.appraisal_curr,
      counsel_curr: customCurrents.counsel_curr,
      sunkTotal,
      netImpact: sunkTotal + lostBenefit,
    };
  }, [stage, calc, customCurrents]);

  useImperativeHandle(ref, () => ({
    getFormData: () => ({ ...inputs, stage }),
    getContainerRef: () => containerRef.current,
  }));

  const stageLabels: Record<Stage, string> = {
    preloi: "Pre-LOI",
    mid: "Mid-Diligence",
    postfmv: "Post-FMV",
    custom: "Custom",
  };

  /* ── Helper: number input ── */
  const NumInput = ({
    value,
    readOnly,
    onChange,
    style,
    className,
  }: {
    value: number;
    readOnly?: boolean;
    onChange?: (v: number) => void;
    style?: React.CSSProperties;
    className?: string;
  }) => (
    <input
      type="number"
      className={`esop-input ${className ?? ""}`}
      value={value}
      readOnly={readOnly}
      style={style}
      onChange={(e) => onChange?.(Number(e.target.value) || 0)}
    />
  );

  return (
    <div ref={containerRef} className="esop-form-container">
      {/* Header */}
      <div className="esop-header">
        <h2 className="esop-title">Forhemit Stewardship Management Co.</h2>
        <p className="esop-subtitle">
          ESOP Cost Reference Calculator — Version 2 (Interactive)
        </p>
      </div>

      {/* Controls */}
      <div className="esop-controls">
        <div className="esop-control-group">
          <label className="esop-label">Purchase Price Illustration</label>
          <NumInput
            value={inputs.purchasePrice}
            onChange={(v) => update("purchasePrice", v)}
          />
        </div>

        <div className="esop-control-group">
          <label className="esop-label">Deal Stage Scenario</label>
          <div className="esop-stage-selector">
            {(Object.keys(stageLabels) as Stage[]).map((s) => (
              <button
                key={s}
                type="button"
                className={`esop-stage-btn ${stage === s ? "active" : ""}`}
                onClick={() => setStage(s)}
              >
                {stageLabels[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="esop-control-group">
          <label className="esop-label">Federal Capital Gains Rate</label>
          <div className="esop-rate-wrap">
            <NumInput
              value={inputs.taxRate}
              onChange={(v) => update("taxRate", v)}
            />
            <span className="esop-rate-pct">%</span>
          </div>
        </div>
      </div>

      {/* Cost Table */}
      <table className="esop-table">
        <thead>
          <tr>
            <th className="esop-col-item">Cost Item</th>
            <th className="esop-col-amount">Low Est.</th>
            <th className="esop-col-amount">High Est.</th>
            <th className="esop-col-calc">Current</th>
            <th className="esop-col-note">Notes</th>
          </tr>
        </thead>
        <tbody>
          {/* Section A — Sunk Costs */}
          <tr className="esop-category-header">
            <td colSpan={5}>
              A. Sunk Costs — Spent on ESOP-specific work; zero value to any
              conventional buyer
            </td>
          </tr>

          <tr>
            <td>
              <strong>Forhemit Engagement Retainer</strong>
              <br />
              <span className="esop-item-sub">
                Pre-flight deposit + COOP assessment
              </span>
            </td>
            <td>
              <NumInput
                value={inputs.forhemit_low}
                onChange={(v) => update("forhemit_low", v)}
              />
            </td>
            <td>
              <NumInput
                value={inputs.forhemit_high}
                onChange={(v) => update("forhemit_high", v)}
              />
            </td>
            <td>
              <NumInput value={eff.forhemit_curr} readOnly className="calc" />
            </td>
            <td className="esop-note-cell">
              Non-refundable. Converts to switch fee. Compensates Forhemit for
              COOP team deployment.
            </td>
          </tr>

          <tr>
            <td>
              <strong>Independent ESOP Trustee</strong>
              <br />
              <span className="esop-item-sub">ERISA fiduciary</span>
            </td>
            <td>
              <NumInput
                value={inputs.trustee_low}
                onChange={(v) => update("trustee_low", v)}
              />
            </td>
            <td>
              <NumInput
                value={inputs.trustee_high}
                onChange={(v) => update("trustee_high", v)}
              />
            </td>
            <td>
              {stage === "custom" ? (
                <NumInput
                  value={customCurrents.trustee_curr}
                  onChange={(v) =>
                    setCustomCurrents((p) => ({ ...p, trustee_curr: v }))
                  }
                />
              ) : (
                <NumInput value={eff.trustee_curr} readOnly className="calc" />
              )}
            </td>
            <td className="esop-note-cell">
              ERISA-mandated fiduciary acting solely for the employee trust.
              Engaged post-LOI.
            </td>
          </tr>

          <tr>
            <td>
              <strong>ERISA Fair Market Value Appraisal</strong>
              <br />
              <span className="esop-item-sub">
                Engaged by trustee; DOL/ERISA standard
              </span>
            </td>
            <td>
              <NumInput
                value={inputs.appraisal_low}
                onChange={(v) => update("appraisal_low", v)}
              />
            </td>
            <td>
              <NumInput
                value={inputs.appraisal_high}
                onChange={(v) => update("appraisal_high", v)}
              />
            </td>
            <td>
              {stage === "custom" ? (
                <NumInput
                  value={customCurrents.appraisal_curr}
                  onChange={(v) =>
                    setCustomCurrents((p) => ({ ...p, appraisal_curr: v }))
                  }
                />
              ) : (
                <NumInput
                  value={eff.appraisal_curr}
                  readOnly
                  className="calc"
                />
              )}
            </td>
            <td className="esop-note-cell">
              Conducted under ERISA/DOL independence standards. Not a §409A
              valuation.
            </td>
          </tr>

          <tr>
            <td>
              <strong>ESOP/ERISA Company Counsel</strong>
              <br />
              <span className="esop-item-sub">
                Plan documents, §1042 compliance, DOL filings
              </span>
            </td>
            <td>
              <NumInput
                value={inputs.counsel_low}
                onChange={(v) => update("counsel_low", v)}
              />
            </td>
            <td>
              <NumInput
                value={inputs.counsel_high}
                onChange={(v) => update("counsel_high", v)}
              />
            </td>
            <td>
              {stage === "custom" ? (
                <NumInput
                  value={customCurrents.counsel_curr}
                  onChange={(v) =>
                    setCustomCurrents((p) => ({ ...p, counsel_curr: v }))
                  }
                />
              ) : (
                <NumInput
                  value={eff.counsel_curr}
                  readOnly
                  className="calc"
                />
              )}
            </td>
            <td className="esop-note-cell">
              ESOP plan documents, §1042 compliance opinion, ERISA trust
              agreement.
            </td>
          </tr>

          {/* Subtotal A */}
          <tr className="esop-subtotal">
            <td>
              <strong>Subtotal — True Sunk Costs if Switch Occurs</strong>
            </td>
            <td>${fmt(eff.sunkLow)}</td>
            <td>${fmt(eff.sunkHigh)}</td>
            <td className="esop-subtotal-val">${fmt(eff.sunkTotal)}</td>
            <td className="esop-note-cell">
              This is the honest switching cost.
            </td>
          </tr>

          {/* Section B — Structural Costs */}
          <tr className="esop-category-header">
            <td colSpan={5}>
              B. Structural Cost Differences — Avoided (not lost) when
              switching; never paid pre-close
            </td>
          </tr>

          <tr>
            <td>
              <strong>SBA 7(a) Guarantee Fee</strong>
              <br />
              <span className="esop-item-sub">
                FY2026: 3.5% first $1M + 3.75% above $1M
              </span>
            </td>
            <td>
              <NumInput
                value={inputs.sba_low}
                onChange={(v) => update("sba_low", v)}
              />
            </td>
            <td>
              <NumInput
                value={inputs.sba_high}
                onChange={(v) => update("sba_high", v)}
              />
            </td>
            <td>
              <NumInput
                value={0}
                readOnly
                className="calc"
                style={{ background: "rgba(34,197,94,0.1)" }}
              />
            </td>
            <td className="esop-note-cell">
              Paid from SBA loan proceeds on closing day only. Never incurred if
              switching.
            </td>
          </tr>

          <tr>
            <td>
              <strong>Florida Documentary Stamp Tax on Debt</strong>
              <br />
              <span className="esop-item-sub">
                $0.35 per $100 of note principal
              </span>
            </td>
            <td>
              <NumInput
                value={inputs.stamp_low}
                onChange={(v) => update("stamp_low", v)}
              />
            </td>
            <td>
              <NumInput
                value={inputs.stamp_high}
                onChange={(v) => update("stamp_high", v)}
              />
            </td>
            <td>
              <NumInput
                value={0}
                readOnly
                className="calc"
                style={{ background: "rgba(34,197,94,0.1)" }}
              />
            </td>
            <td className="esop-note-cell">
              Imposed on promissory notes at recording. Only appears at closing
              table if ESOP closes.
            </td>
          </tr>

          {/* Subtotal B */}
          <tr className="esop-subtotal">
            <td>
              <strong>
                Subtotal — Structural Costs Avoided if Conventional Buyer Wins
              </strong>
            </td>
            <td>${fmt(eff.structLow)}</td>
            <td>${fmt(eff.structHigh)}</td>
            <td className="esop-subtotal-val" style={{ color: "#22c55e" }}>
              $0
            </td>
            <td className="esop-note-cell">
              These costs are never incurred unless the ESOP closes.
            </td>
          </tr>

          {/* Section C — Universal Costs */}
          <tr className="esop-category-header">
            <td colSpan={5}>
              C. Universal Costs — Incurred in any sale; work product transfers
              to any buyer
            </td>
          </tr>

          <tr>
            <td>
              <strong>Sell-Side Quality of Earnings</strong>
              <br />
              <span className="esop-item-sub">
                Physician practice specialist; required pre-LOI
              </span>
            </td>
            <td>
              <NumInput
                value={inputs.qoe_low}
                onChange={(v) => update("qoe_low", v)}
              />
            </td>
            <td>
              <NumInput
                value={inputs.qoe_high}
                onChange={(v) => update("qoe_high", v)}
              />
            </td>
            <td>
              <NumInput
                value={eff.qoeCurrent}
                readOnly
                className="calc"
                style={{ background: "rgba(59,130,246,0.1)" }}
              />
            </td>
            <td className="esop-note-cell">
              Fully transferable. Accelerates PE diligence.
            </td>
          </tr>

          <tr>
            <td>
              <strong>Seller&apos;s Own Legal Counsel</strong>
              <br />
              <span className="esop-item-sub">
                LOI review, deal protection, closing doc review
              </span>
            </td>
            <td>
              <NumInput
                value={inputs.legal_low}
                onChange={(v) => update("legal_low", v)}
              />
            </td>
            <td>
              <NumInput
                value={inputs.legal_high}
                onChange={(v) => update("legal_high", v)}
              />
            </td>
            <td>
              <NumInput
                value={eff.legalCurrent}
                readOnly
                className="calc"
                style={{ background: "rgba(59,130,246,0.1)" }}
              />
            </td>
            <td className="esop-note-cell">
              Every seller needs independent counsel in any transaction.
            </td>
          </tr>

          <tr>
            <td>
              <strong>Seller&apos;s CPA / Tax Advisor</strong>
              <br />
              <span className="esop-item-sub">
                Tax planning, §1042 analysis, capital gains modeling
              </span>
            </td>
            <td>
              <NumInput
                value={inputs.cpa_low}
                onChange={(v) => update("cpa_low", v)}
              />
            </td>
            <td>
              <NumInput
                value={inputs.cpa_high}
                onChange={(v) => update("cpa_high", v)}
              />
            </td>
            <td>
              <NumInput
                value={eff.cpaCurrent}
                readOnly
                className="calc"
                style={{ background: "rgba(59,130,246,0.1)" }}
              />
            </td>
            <td className="esop-note-cell">
              On ESOP track: models §1042 eligibility. On conventional track:
              same CPA models capital gains exposure.
            </td>
          </tr>

          {/* Section D — Lost Tax Benefit */}
          <tr className="esop-category-header esop-danger-header">
            <td colSpan={5}>
              D. Lost Tax Benefit — Not a dollar outlay; a deferred benefit that
              disappears with a conventional buyer
            </td>
          </tr>

          <tr className="esop-danger-row">
            <td>
              <strong>§1042 Federal Capital Gains Tax Deferral</strong>
              <br />
              <span className="esop-item-sub">
                C-corp seller; Florida (no state income tax)
              </span>
            </td>
            <td>${fmt(eff.lostBenefit)}</td>
            <td>${fmt(eff.lostBenefit)}</td>
            <td className="esop-lost-value">${fmt(eff.lostBenefit)}</td>
            <td className="esop-note-cell">
              §1042 election allows deferral of federal capital gains tax.{" "}
              <strong>
                {inputs.taxRate}% on ${fmt(inputs.purchasePrice)} = $
                {fmt(eff.lostBenefit)} tax deferred.
              </strong>{" "}
              Lost entirely with any conventional buyer.
            </td>
          </tr>

          {/* Grand Total */}
          <tr className="esop-grand-total">
            <td colSpan={3}>
              <strong>
                NET ECONOMIC IMPACT OF SWITCHING TO CONVENTIONAL BUYER
              </strong>
              <br />
              <span className="esop-grand-sub">
                (Sunk Costs Incurred + Lost Tax Benefit)
              </span>
            </td>
            <td className="esop-grand-value">${fmt(eff.netImpact)}</td>
            <td className="esop-grand-note">
              This number—not the professional fees—is why switching is almost
              never economically rational for a Florida seller at the same price.
            </td>
          </tr>
        </tbody>
      </table>

      {/* Warning */}
      <div className="esop-warning">
        <h4>⚠ C-Corp Conversion — Critical Warning for Two-Track Strategies</h4>
        <p>
          If an S-corp practice converts to C-corp to qualify for §1042 and a
          conventional buyer then wins, the conversion is irreversible. The seller
          is now a C-corp, §1042 is not triggered, and Built-In Gains (BIG) tax
          may apply.
        </p>
        <p>
          <strong>Rule:</strong> Do not initiate C-corp conversion on a two-track
          strategy. Confirm the ESOP track is the primary path before any
          conversion.
        </p>
      </div>

      {/* Assumptions */}
      <p className="esop-assumptions">
        <strong>Assumptions:</strong> Florida program • $
        {fmt(inputs.purchasePrice)} purchase price illustration • Assumes full
        gain (zero cost basis) • SBA 7(a) guarantee fee: 3.5% on first $1M +
        3.75% above $1M • Federal rate includes 20% LTCG + 3.8% NIIT
      </p>
    </div>
  );
});

export default ESOPCostReferenceForm;

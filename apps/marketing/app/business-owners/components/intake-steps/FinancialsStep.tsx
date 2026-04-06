import { EBITDA_LABELS, ENTITY_TYPES } from "../../constants";

interface FinancialsStepProps {
  form: Record<string, string>;
  setField: (k: string, v: string) => void;
  ebitdaIdx: number;
  onEbitdaChange: (idx: number) => void;
  onBack: () => void;
  onAdvance: () => void;
  canAdvance: boolean;
}

export function FinancialsStep({
  form,
  setField,
  ebitdaIdx,
  onEbitdaChange,
  onBack,
  onAdvance,
  canAdvance,
}: FinancialsStepProps) {
  return (
    <div>
      <p className="ci-step-q">A financial snapshot.</p>
      <p className="ci-step-hint">
        Approximate answers are fine&mdash;this helps us tell you quickly
        whether the structure works for your situation.
      </p>

      <div className="ci-field">
        <label className="ci-field-label">
          Approximate annual EBITDA&mdash;{EBITDA_LABELS[ebitdaIdx]}
        </label>
        <div className="ci-range-wrap">
          <input
            type="range"
            className="ci-range-input"
            min={0}
            max={6}
            value={ebitdaIdx}
            onChange={(e) => {
              const idx = Number(e.target.value);
              onEbitdaChange(idx);
              setField("ebitda", EBITDA_LABELS[idx]);
            }}
          />
          <span className="ci-range-val">{EBITDA_LABELS[ebitdaIdx]}</span>
        </div>
      </div>

      <div className="ci-field">
        <label className="ci-field-label">Business entity type</label>
        <div className="ci-opt-grid">
          {ENTITY_TYPES.map((o) => (
            <button
              key={o.value}
              className={`ci-opt-btn ${form.entity === o.value ? "ci-opt-sel" : ""}`}
              onClick={() => setField("entity", o.value)}
              type="button"
            >
              <span className="ci-opt-btn-left">
                <span className="ci-opt-btn-label">{o.value}</span>
                {o.sub && <span className="ci-opt-btn-sub">{o.sub}</span>}
              </span>
              <span className="ci-opt-arr">
                {form.entity === o.value ? "\u2192" : "\u2197"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="ci-step-nav">
        <button className="ci-btn-back" onClick={onBack} type="button">
          &larr; Back
        </button>
        <button
          className="ci-btn-next"
          disabled={!canAdvance}
          onClick={onAdvance}
          type="button"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

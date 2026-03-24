import { TIMELINE_OPTS } from "../../constants";

interface SituationStepProps {
  form: Record<string, string>;
  setField: (k: string, v: string) => void;
  onBack: () => void;
  onAdvance: () => void;
  canAdvance: boolean;
}

export function SituationStep({
  form,
  setField,
  onBack,
  onAdvance,
  canAdvance,
}: SituationStepProps) {
  return (
    <div>
      <p className="ci-step-q">What&rsquo;s your timeline?</p>
      <div className="ci-opt-grid">
        {TIMELINE_OPTS.map((o) => (
          <button
            key={o.value}
            className={`ci-opt-btn ${form.timeline === o.value ? "ci-opt-sel" : ""}`}
            onClick={() => setField("timeline", o.value)}
            type="button"
          >
            <span className="ci-opt-btn-left">
              <span className="ci-opt-btn-label">{o.label}</span>
              <span className="ci-opt-btn-sub">{o.sub}</span>
            </span>
            <span className="ci-opt-arr">
              {form.timeline === o.value ? "\u2192" : "\u2197"}
            </span>
          </button>
        ))}
      </div>

      <div className="ci-field" style={{ marginTop: "1.8rem" }}>
        <label className="ci-field-label">
          Anything else we should know? (optional)
        </label>
        <textarea
          className="ci-field-textarea"
          placeholder="Key man concerns, partner situations, health reasons, recent LOIs — anything relevant…"
          value={form.notes || ""}
          onChange={(e) => setField("notes", e.target.value)}
        />
      </div>

      <div className="ci-step-nav">
        <button className="ci-btn-back" onClick={onBack} type="button">
          &larr; Back
        </button>
        <button
          className="ci-btn-next ci-btn-primary"
          disabled={!canAdvance}
          onClick={onAdvance}
          type="button"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

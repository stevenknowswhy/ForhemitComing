import {
  INDUSTRY_OPTS,
  STATE_OPTS,
  EMPLOYEE_RANGES,
  YEAR_RANGES,
} from "../../constants";

interface BusinessStepProps {
  form: Record<string, string>;
  setField: (k: string, v: string) => void;
  onBack: () => void;
  onAdvance: () => void;
  canAdvance: boolean;
}

export function BusinessStep({
  form,
  setField,
  onBack,
  onAdvance,
  canAdvance,
}: BusinessStepProps) {
  return (
    <div>
      <p className="ci-step-q">Tell us about the business.</p>
      <div className="ci-field-row">
        <div className="ci-field">
          <label className="ci-field-label">Business name</label>
          <input
            className="ci-field-input"
            placeholder="Company name"
            value={form.bizName || ""}
            onChange={(e) => setField("bizName", e.target.value)}
          />
        </div>
        <div className="ci-field">
          <label className="ci-field-label">State of operation</label>
          <select
            className="ci-field-select ci-field-input"
            value={form.state || ""}
            onChange={(e) => setField("state", e.target.value)}
          >
            <option value="">Select state&hellip;</option>
            {STATE_OPTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="ci-field">
        <label className="ci-field-label">Industry</label>
        <select
          className="ci-field-select ci-field-input"
          value={form.industry || ""}
          onChange={(e) => setField("industry", e.target.value)}
        >
          <option value="">Select industry&hellip;</option>
          {INDUSTRY_OPTS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="ci-field-row">
        <div className="ci-field">
          <label className="ci-field-label">Number of employees</label>
          <select
            className="ci-field-select ci-field-input"
            value={form.employees || ""}
            onChange={(e) => setField("employees", e.target.value)}
          >
            <option value="">Select&hellip;</option>
            {EMPLOYEE_RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="ci-field">
          <label className="ci-field-label">Years in operation</label>
          <select
            className="ci-field-select ci-field-input"
            value={form.years || ""}
            onChange={(e) => setField("years", e.target.value)}
          >
            <option value="">Select&hellip;</option>
            {YEAR_RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
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

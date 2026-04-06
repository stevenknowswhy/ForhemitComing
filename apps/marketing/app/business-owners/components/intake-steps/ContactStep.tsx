import { ROLE_OPTS } from "../../constants";

interface ContactStepProps {
  form: Record<string, string>;
  setField: (k: string, v: string) => void;
  onBack: () => void;
  onAdvance: () => void;
  canAdvance: boolean;
}

export function ContactStep({
  form,
  setField,
  onBack,
  onAdvance,
  canAdvance,
}: ContactStepProps) {
  return (
    <div>
      <p className="ci-step-q">Who should we reach out to?</p>
      <div className="ci-field-row">
        <div className="ci-field">
          <label className="ci-field-label">Full name</label>
          <input
            className="ci-field-input"
            placeholder="Your name"
            value={form.name || ""}
            onChange={(e) => setField("name", e.target.value)}
          />
        </div>
        <div className="ci-field">
          <label className="ci-field-label">Best phone</label>
          <input
            className="ci-field-input"
            type="tel"
            placeholder="(555) 000-0000"
            value={form.phone || ""}
            onChange={(e) => setField("phone", e.target.value)}
          />
        </div>
      </div>
      <div className="ci-field">
        <label className="ci-field-label">Email address</label>
        <input
          className="ci-field-input"
          type="email"
          placeholder="you@company.com"
          value={form.email || ""}
          onChange={(e) => setField("email", e.target.value)}
        />
      </div>
      <div className="ci-field">
        <label className="ci-field-label">Your role in the business</label>
        <select
          className="ci-field-select ci-field-input"
          value={form.role || ""}
          onChange={(e) => setField("role", e.target.value)}
        >
          <option value="">Select&hellip;</option>
          {ROLE_OPTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
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

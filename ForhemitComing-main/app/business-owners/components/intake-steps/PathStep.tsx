interface PathStepProps {
  path: "nda" | "light" | null;
  onSelect: (p: "nda" | "light") => void;
}

export function PathStep({ path, onSelect }: PathStepProps) {
  return (
    <div>
      <p className="ci-path-intro">
        We have two ways to start. Both are free and take less than five minutes.
      </p>
      <p className="ci-path-nda-note">
        An NDA may be required to begin a formal consultation.
      </p>
      <div className="ci-path-grid">
        <button
          className={`ci-path-card ${path === "nda" ? "ci-path-sel" : ""}`}
          onClick={() => onSelect("nda")}
        >
          <div className="ci-path-badge">Recommended</div>
          <div className="ci-path-title">Sign NDA first</div>
          <div className="ci-path-sub">
            Share specifics under mutual confidentiality. We can discuss
            financials, structure, and your actual situation.
          </div>
          <ul className="ci-path-items">
            <li>Protected by a signed NDA</li>
            <li>Full financial intake</li>
            <li>Personalized analysis</li>
          </ul>
        </button>
        <button
          className={`ci-path-card ${path === "light" ? "ci-path-sel" : ""}`}
          onClick={() => onSelect("light")}
        >
          <div className="ci-path-badge ci-path-badge-muted">No commitment</div>
          <div className="ci-path-title">No NDA yet</div>
          <div className="ci-path-sub">
            Give us a high-level picture. We&rsquo;ll tell you if it looks like
            a fit before any formal process.
          </div>
          <ul className="ci-path-items">
            <li>No paperwork required</li>
            <li>General overview only</li>
            <li>We reach out to discuss</li>
          </ul>
        </button>
      </div>
    </div>
  );
}

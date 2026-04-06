interface DoneStepProps {
  path: "nda" | "light" | null;
  name?: string;
  onClose: () => void;
}

export function DoneStep({ path, name, onClose }: DoneStepProps) {
  const firstName = name ? name.split(" ")[0] : "";

  const nextSteps: [string, string][] =
    path === "nda"
      ? [
          [
            "Advisor review",
            "We review your full intake and confirm whether your business qualifies structurally.",
          ],
          [
            "Fit conversation",
            "A 20-minute call to walk through the numbers, your timeline, and your team situation.",
          ],
          [
            "Preliminary analysis",
            "We provide a no-obligation deal summary — estimated net proceeds, timeline, and structure.",
          ],
        ]
      : [
          [
            "Advisor review",
            "We review your overview and confirm whether your business qualifies structurally.",
          ],
          [
            "Fit conversation",
            "A 20-minute call to walk through the numbers, your timeline, and your team situation.",
          ],
          [
            "NDA & deeper dive",
            "If it looks like a fit, we'll invite you to sign an NDA and share financials for a full analysis.",
          ],
        ];

  return (
    <div style={{ padding: "1rem 0 0.5rem" }}>
      <div className="ci-success-icon">&#10003;</div>
      <h3 className="ci-success-title">
        {path === "nda" ? "Your intake is complete." : "Got it. We'll be in touch."}
      </h3>
      <p className="ci-success-sub">
        {path === "nda"
          ? `Thank you, ${firstName}. Your information is encrypted and protected by the NDA you signed. A Forhemit advisor will review your intake and reach out within one business day to discuss your situation and whether a structured ESOP sale makes sense.`
          : "Thanks for sharing. We'll review what you've sent and reach out within two business days. No broker pitch, no pressure — just an honest conversation about whether this fits."}
      </p>
      <div className="ci-next-steps">
        <p className="ci-next-steps-title">What happens next</p>
        {nextSteps.map(([title, desc], i) => (
          <div key={i} className="ci-next-step-item">
            <span className="ci-next-step-num">{i + 1}</span>
            <span className="ci-next-step-text">
              <strong>{title}.</strong> {desc}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button
          className="ci-btn-ghost"
          onClick={onClose}
          type="button"
          style={{ padding: "0.8rem 2rem" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

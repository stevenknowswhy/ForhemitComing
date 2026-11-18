const PRIVACY_POINTS = [
  {
    id: "confidential",
    icon: "\uD83D\uDD12",
    title: "Confidential from the first step",
    body: "Your inquiry is confidential. Nothing is shared with your employees, lenders, or anyone else.",
  },
  {
    id: "nda",
    icon: "\uD83D\uDEE1",
    title: "An NDA before details",
    body: "You sign an NDA with us before you upload anything that identifies your company.",
  },
  {
    id: "review",
    icon: "\uD83D\uDCC1",
    title: "A confidential review",
    body: "Month 1 begins with a confidential review of financials, headcount, and ownership structure.",
  },
  {
    id: "comms",
    icon: "\uD83D\uDCC5",
    title: "Employee communication is planned",
    body: "What is said to employees, when, and by whom is prepared as a plan in Month 3 \u2014 not improvised.",
  },
];

export function ConfidentialitySection() {
  return (
    <section id="fmp-privacy" className="fmp-section" aria-labelledby="fmp-privacy-heading">
      <h2 id="fmp-privacy-heading" className="fmp-section-title">
        Your privacy is protected
      </h2>
      <p className="fmp-section-lead">
        One of the biggest concerns sellers have: &ldquo;What if my employees find out before
        I&apos;m ready?&rdquo;
      </p>
      <div className="fmp-privacy-grid">
        {PRIVACY_POINTS.map((p) => (
          <div key={p.id} className="fmp-privacy-card">
            <span className="fmp-privacy-icon" aria-hidden>{p.icon}</span>
            <h3 className="fmp-privacy-card-title">{p.title}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

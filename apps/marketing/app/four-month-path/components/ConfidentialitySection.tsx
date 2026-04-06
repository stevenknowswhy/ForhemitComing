const PRIVACY_POINTS = [
  {
    id: "nda",
    icon: "\uD83D\uDD12",
    title: "NDAs first, always",
    body: "Non-disclosure agreements are signed before any business information is shared with any party.",
  },
  {
    id: "timing",
    icon: "\uD83D\uDCC5",
    title: "Employees learn in Month 3",
    body: "Your team learns about the ESOP only after financing is secured and the deal is effectively locked in.",
  },
  {
    id: "external",
    icon: "\uD83D\uDEE1",
    title: "No outside contact",
    body: "Competitors, customers, and vendors are never contacted during the process. The deal is between you, the bank, and the trust.",
  },
  {
    id: "docs",
    icon: "\uD83D\uDCC1",
    title: "Secure document handling",
    body: "All sensitive financials are shared through encrypted document rooms \u2014 never via unprotected email attachments.",
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

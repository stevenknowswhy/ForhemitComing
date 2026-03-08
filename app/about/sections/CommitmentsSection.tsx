const commitments = [
  {
    number: "01",
    title: "Reverse Management Fees",
    body: "Our management fee is literally clawed back if your employees' median wages and retention rates don't improve in our first year. We only get rich if your team thrives. Full stop.",
    tag: "Contractually Binding"
  },
  {
    number: "02",
    title: "The Portfolio Guardian",
    body: "We are the only PE firm to install a dedicated C-suite executive whose sole mandate is to audit our social contract, protect your workers, and verify that our promises are kept — not just stated.",
    tag: "C-Suite Mandate"
  },
  {
    number: "03",
    title: "The Council of Elders",
    body: "We grant the founder and key senior staff a formal governance seat with veto power over culture-destroying decisions — including layoffs and facility relocations — for the first 24 months post-acquisition.",
    tag: "24-Month Governance Right"
  }
];

export function CommitmentsSection() {
  return (
    <section id="commitments" style={{ background: 'var(--parchment)' }}>
      <div className="container">
        <div className="section-tag">Our Commitments</div>
        <h2 className="section-h2">We put our ethics<br/>in our <em>operating agreements</em>.</h2>
        <p className="section-body">
          Other buyers ask you to trust them with your legacy. We prove it contractually.
          Our human-centric commitments aren&apos;t talking points — they are legally binding obligations.
        </p>

        <div className="commitments-grid">
          {commitments.map((commitment) => (
            <div className="commitment-card" key={commitment.number}>
              <div className="commitment-number">{commitment.number}</div>
              <div className="commitment-title">{commitment.title}</div>
              <p className="commitment-body">{commitment.body}</p>
              <div className="commitment-tag">{commitment.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

export function StewardshipSection() {
  return (
    <section className="legal-section stewardship-section">
      <div className="container">
        <div className="stewardship-intro" data-animate="fade-up">
          <h2>
            There <em>is</em> a structurally different path
          </h2>
          <p className="stewardship-subtitle">Stewardship-based ESOP transitions</p>
        </div>

        <div className="comparison-blocks">
          <div className="comparison-block traditional" data-animate="slide-right">
            <div className="comparison-image">
              <img
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDnNRRtzSNaoHZhcXfKi2B3O8YTR0lmArFCIVG"
                alt="Traditional M&A corporate takeover"
              />
              <div className="comparison-image-overlay" />
            </div>
            <div className="comparison-content">
              <h3>Traditional M&A</h3>
              <p className="comparison-desc">
                Built to consolidate control — including control of legal relationships.
              </p>
              <div className="comparison-result negative">You&apos;re often replaced</div>
            </div>
          </div>

          <div className="comparison-connector" data-animate="fade-in">
            vs
          </div>

          <div className="comparison-block stewardship" data-animate="slide-left">
            <div className="comparison-image">
              <img
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD5DFKeJbJdhlvXzTciIMfp3OgtnGQKqaU1H5j"
                alt="Employee ownership collaboration"
              />
              <div className="comparison-image-overlay" />
            </div>
            <div className="comparison-content">
              <h3>Employee Ownership</h3>
              <p className="comparison-desc">
                Built to <strong>preserve</strong> what matters most.
              </p>
              <ul className="preserve-list">
                <li>The business</li>
                <li>The jobs</li>
                <li>The culture</li>
                <li>The founder&apos;s legacy</li>
                <li>The existing professional relationships</li>
              </ul>
              <div className="comparison-result positive">You remain at the center</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

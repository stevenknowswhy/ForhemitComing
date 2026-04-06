"use client";

export function BenefitsSection() {
  return (
    <section className="legal-section benefits-section">
      <div className="container">
        <h2 data-animate="fade-up">What partnering with us does for your firm</h2>

        <div className="benefit-rows">
          {/* Card 01 */}
          <div className="benefit-row" data-animate="fade-up" data-delay="0">
            <div className="benefit-row-header">
              <span className="benefit-row-number">01</span>
              <h3>You stop being replaceable</h3>
            </div>
            <div className="benefit-row-content">
              <p>
                Instead of waiting to find out about a sale, you become the one who brings a
                credible, values-aligned exit alternative. You raise the succession conversation
                from a place of
                <strong> insight, not fear</strong>.
              </p>
            </div>
            <div className="benefit-row-outcome">
              <span className="outcome-label">Outcome</span>
              <span className="outcome-text">
                Incredibly difficult for competing advisors to dislodge
              </span>
            </div>
          </div>

          {/* Card 02 */}
          <div className="benefit-row stacked" data-animate="fade-up" data-delay="100">
            <div className="benefit-row-top">
              <div className="benefit-row-header">
                <span className="benefit-row-number">02</span>
                <h3>Convert risk into revenue streams</h3>
              </div>
              <p>A Stewardship ESOP creates work across three phases:</p>
            </div>
            <div className="benefit-row-phases">
              <div className="phase-card">
                <span className="phase-label">Before</span>
                <span>Exit strategy, restructuring, estate planning</span>
              </div>
              <div className="phase-card">
                <span className="phase-label">During</span>
                <span>Transaction structuring, corporate counsel</span>
              </div>
              <div className="phase-card">
                <span className="phase-label">After</span>
                <span>Ongoing governance, compliance, next-gen planning</span>
              </div>
            </div>
          </div>

          {/* Card 03 */}
          <div className="benefit-row" data-animate="fade-up" data-delay="200">
            <div className="benefit-row-header">
              <span className="benefit-row-number">03</span>
              <h3>Differentiate in a way competitors can&apos;t copy</h3>
            </div>
            <div className="benefit-row-content">
              <blockquote className="benefit-quote">
                &quot;We offer a proven, stewardship-managed, employee-ownership transition path that
                preserves client relationships and community jobs, with our Stewardship Management
                approach providing long-term fiduciary partnership.&quot;
              </blockquote>
            </div>
            <div className="benefit-row-result">
              <p>
                Give your rainmakers a <strong>new, high-value conversation</strong> to have with
                aging founders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

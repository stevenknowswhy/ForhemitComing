"use client";

export function ProblemSolutionSection() {
  return (
    <section className="about-section-problem-solution">
      <div className="container">
        <div className="problem-solution-grid solution-only-grid">
          {/* Solution Column - Full Width */}
          <div className="problem-solution-column solution-column solution-only">
            <div className="solution-header">
              <span className="about-eyebrow">The Alternative</span>
              <h2>A Better Option</h2>
            </div>
            <div className="about-highlight">
              <img
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD9Ng4TJ32pSgTBVY98K3GtlLfwieHEIvuUMxF"
                alt="Employee ownership collaboration"
                className="highlight-image"
              />
              <span className="highlight-text">100% Employee Owned</span>
            </div>
            <div className="solution-content">
              <p>
                But there is a better option. A buyer who already knows your business, your
                customers, and your culture. Because you hired them.
              </p>
              <p>
                We help you transition your company to 100% employee ownership. You get the payout
                you&apos;ve earned. They get the future they deserve.
              </p>
              <p>
                And the company you spent your life building doesn&apos;t end with a &quot;Closed&quot;
                sign. It begins your legacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

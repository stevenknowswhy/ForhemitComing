"use client";

import { SignatureAnimation } from "@/components/visualizations/SignatureAnimation";

export function PromiseSection() {
  return (
    <section className="promise-section">
      <div className="container">
        <div className="promise-grid">
          <div className="promise-content" data-animate="slide-right">
            <span className="section-eyebrow">The Forhemit Difference</span>
            <h2>Disaster-Proof Transitions</h2>
            <p className="lead-text">
              Most ESOP advisors hand you a valuation report and wish you luck. We engineer
              operational continuity. Before founding Forhemit, our leadership spent a decade
              managing Continuity of Operations (COOP) for the City and County of San Francisco,
              ensuring critical infrastructure survived earthquakes, cyberattacks, and leadership
              vacuums.
            </p>
            <div className="promise-points">
              <div className="promise-point">
                <span className="point-check">✓</span>
                <span>
                  <strong>System Documentation:</strong> We map &quot;tribal knowledge&quot; and
                  formalize operational systems
                </span>
              </div>
              <div className="promise-point">
                <span className="point-check">✓</span>
                <span>
                  <strong>Leadership Succession:</strong> We identify, contractually secure, and
                  cross-train 2–3 key internal managers
                </span>
              </div>
              <div className="promise-point">
                <span className="point-check">✓</span>
                <span>
                  <strong>Financial Safeguards:</strong> We implement early-warning systems to
                  guarantee DSCR remains above 1.25x
                </span>
              </div>
              <div className="promise-point">
                <span className="point-check">✓</span>
                <span>
                  <strong>Long-Term Stewardship:</strong> We stay engaged for up to 10 years
                  post-close to monitor the business
                </span>
              </div>
            </div>
          </div>

          <div className="promise-visual" data-animate="slide-left">
            <SignatureAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}

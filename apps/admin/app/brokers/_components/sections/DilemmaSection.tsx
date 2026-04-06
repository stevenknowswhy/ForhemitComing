"use client";

import { TwentyFourHourFolder } from "@/components/visualizations/TwentyFourHourFolder";

export function DilemmaSection() {
  return (
    <section className="folder-section">
      <div className="container">
        <div className="folder-grid">
          <div className="folder-content" data-animate="slide-right">
            <span className="section-eyebrow">The Broker&apos;s Dilemma</span>
            <h2>The &quot;Dead Zone&quot;</h2>
            <p className="lead-text">
              You know this segment better than anyone. A solid business with $750K–$3M in EBITDA, 20
              to 75 employees, and a founder ready to retire. It should sell easily, but it is
              trapped in the middle-market gap.
            </p>
            <ul className="folder-features">
              <li>
                <span className="feature-icon">⚠️</span>
                <span>
                  <strong>Too Big for Main Street:</strong> Individual buyers lack the $1M–$3M down
                  payment required. They hit the collateral wall and fade away after wasting 90 days
                  of your time.
                </span>
              </li>
              <li>
                <span className="feature-icon">🏢</span>
                <span>
                  <strong>Too Small for Wall Street:</strong> Private Equity firms won&apos;t deploy
                  capital for sub-$3M EBITDA deals. If they do, their &quot;synergy&quot; strategy
                  usually involves terminating half of your seller&apos;s loyal staff.
                </span>
              </li>
              <li>
                <span className="feature-icon">💸</span>
                <span>
                  <strong>The Result:</strong> The listing sits. The founder gets frustrated and
                  distracted. The buyer pool evaporates. You earn zero commission on a great
                  business.
                </span>
              </li>
            </ul>
          </div>

          <div className="folder-visual" data-animate="slide-left">
            <TwentyFourHourFolder />
          </div>
        </div>
      </div>
    </section>
  );
}

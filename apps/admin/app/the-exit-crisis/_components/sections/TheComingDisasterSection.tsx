"use client";

export function TheComingDisasterSection() {
  return (
    <section className="about-section about-section-dark">
      <div className="container">
        <div className="coming-disaster-header">
          <span className="about-eyebrow">The Reality</span>
          <h2 className="section-title">The Coming Disaster</h2>
        </div>

        <div className="about-stat problem-stat">
          <span className="stat-number">70-80%</span>
          <span className="stat-label">of businesses never sell</span>
        </div>

        <div className="problem-points-row">
          <div className="problem-point">
            <span className="point-number">01</span>
            <div className="problem-visual ratio-visual">
              <span className="ratio-number">50</span>
              <span className="ratio-divider">:</span>
              <span className="ratio-number highlight">1</span>
            </div>
            <p>
              For every 50 businesses for sale, there is roughly <strong>one qualified buyer</strong>.
            </p>
          </div>
          <div className="problem-point">
            <span className="point-number">02</span>
            <div className="problem-visual crowd-visual">
              <svg viewBox="0 0 140 70" className="crowd-icon">
                <circle cx="10" cy="20" r="8" fill="currentColor" opacity="0.4" />
                <circle cx="30" cy="18" r="8" fill="currentColor" opacity="0.4" />
                <circle cx="50" cy="16" r="8" fill="currentColor" opacity="0.4" />
                <circle cx="70" cy="15" r="8" fill="currentColor" opacity="0.4" />
                <circle cx="90" cy="16" r="8" fill="currentColor" opacity="0.4" />
                <circle cx="110" cy="18" r="8" fill="currentColor" opacity="0.4" />
                <circle cx="130" cy="20" r="8" fill="currentColor" opacity="0.4" />
                <circle cx="20" cy="35" r="9" fill="currentColor" opacity="0.6" />
                <circle cx="40" cy="33" r="9" fill="currentColor" opacity="0.6" />
                <circle cx="60" cy="32" r="9" fill="currentColor" opacity="0.6" />
                <circle cx="80" cy="32" r="9" fill="currentColor" opacity="0.6" />
                <circle cx="100" cy="33" r="9" fill="currentColor" opacity="0.6" />
                <circle cx="120" cy="35" r="9" fill="currentColor" opacity="0.6" />
                <circle cx="15" cy="52" r="10" fill="currentColor" opacity="0.8" />
                <circle cx="35" cy="50" r="10" fill="currentColor" opacity="0.8" />
                <circle cx="55" cy="49" r="10" fill="currentColor" opacity="0.8" />
                <circle cx="75" cy="48" r="10" fill="currentColor" opacity="0.8" />
                <circle cx="95" cy="49" r="10" fill="currentColor" opacity="0.8" />
                <circle cx="115" cy="50" r="10" fill="currentColor" opacity="0.8" />
                <circle cx="135" cy="52" r="10" fill="currentColor" opacity="0.8" />
                <path
                  d="M70 8 L70 2 M70 8 L65 3 M70 8 L75 3"
                  stroke="var(--about-accent)"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.9"
                />
              </svg>
            </div>
            <p>
              Millions of Baby Boomers retiring will make that ratio <strong>much worse</strong>.
            </p>
          </div>
          <div className="problem-point">
            <span className="point-number">03</span>
            <div className="problem-visual">
              <div className="closed-sign">
                <div className="closed-chain left"></div>
                <div className="closed-chain right"></div>
                <div className="closed-plate">
                  <span className="closed-text">CLOSED</span>
                </div>
              </div>
            </div>
            <p>No buyer means your employees lose jobs and your legacy ends with a &quot;Closed&quot; sign.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

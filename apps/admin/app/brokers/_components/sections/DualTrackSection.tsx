"use client";

import { ComparisonTable } from "@/components/visualizations/ComparisonTable";

export function DualTrackSection() {
  return (
    <section className="matrix-section">
      <div className="container">
        <div className="matrix-grid-layout">
          <div className="matrix-visual" data-animate="slide-right">
            <ComparisonTable />
          </div>

          <div className="matrix-content" data-animate="slide-left">
            <span className="section-eyebrow">The Solution</span>
            <h2>The Dual-Track Strategy</h2>
            <p className="lead-text">
              We are not asking you to abandon the traditional M&A process; we are giving you a
              parallel track that turns &quot;maybe next year&quot; into &quot;closing this
              quarter.&quot;
            </p>
            <div className="matrix-insights">
              <div className="insight">
                <span className="insight-icon">🅰️</span>
                <span>
                  <strong>Track A (Traditional Search):</strong> You continue to market to strategic
                  buyers and PE firms. You hunt for the unicorn buyer who will pay a premium.
                </span>
              </div>
              <div className="insight">
                <span className="insight-icon">🅱️</span>
                <span>
                  <strong>Track B (The Forhemit ESOP):</strong> We simultaneously structure a 100%
                  employee buyout backed by SBA financing. The company&apos;s existing 20+ employees
                  become the buyers.
                </span>
              </div>
              <div className="insight">
                <span className="insight-icon">⚡</span>
                <span>
                  <strong>The Leverage Effect:</strong> When an external buyer tries to re-trade the
                  seller down 30%, your seller can say, &quot;I have a fully financed ESOP on the
                  table. Meet the number, or we activate Track B.&quot;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

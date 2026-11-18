"use client";

import { useState, Suspense, lazy } from "react";

const FeeTransparencyModal = lazy(() =>
  import("./FeeTransparencyModal").then((m) => ({ default: m.FeeTransparencyModal }))
);

export function FeeDisclosureSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="fmp-fees" className="fmp-section fmp-fee-disclosure" aria-labelledby="fmp-fee-disclosure-heading">
      <h2 id="fmp-fee-disclosure-heading" className="fmp-section-title">
        Fees
      </h2>
      <div className="fmp-fee-disclosure-inner">
        <div className="fmp-fee-disclosure-text">
          <p className="fmp-fee-disclosure-eyebrow">Full transparency</p>
          <p className="fmp-fee-disclosure-title">
            Every sale has fees. Here&apos;s exactly what to expect.
          </p>
          <p className="fmp-fee-disclosure-body">
            Total transition fees typically run 3&ndash;5% of valuation &mdash; one figure, covering the
            whole transition, set in writing before you sign anything. Here is what the total covers.
          </p>
        </div>
        <span className="fmp-cta-shell fmp-cta-shell--inline">
          <span className="fmp-cta-shell__glow" aria-hidden />
          <button type="button" className="fmp-fee-disclosure-btn" onClick={() => setIsOpen(true)}>
            See What the Total Covers
          </button>
        </span>
      </div>

      <Suspense fallback={null}>
        {isOpen && (
          <FeeTransparencyModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        )}
      </Suspense>
    </section>
  );
}

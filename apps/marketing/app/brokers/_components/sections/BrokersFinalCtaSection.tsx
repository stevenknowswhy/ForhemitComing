"use client";

import { useState } from "react";
import Link from "next/link";
import { trackScheduleCallClick } from "@/lib/analytics/highIntent";
import { RoadmapLink } from "@/app/four-month-path/components/RoadmapLink";
import { BrokersContactModal } from "../BrokersContactModal";

export function BrokersFinalCtaSection() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <section id="brk-founder" className="fmp-section" aria-labelledby="brk-founder-heading">
        <h2 id="brk-founder-heading" className="fmp-section-title">
          Who you are trusting
        </h2>
        <p className="fmp-section-lead">
          <strong>The person you are trusting with your client.</strong> Stefano Stokes —
          Founder &amp; CEO. I&apos;m the person you speak with first, the person who leads your
          client&apos;s transition, and the person accountable for coordinating the work through
          closing and handover. Forhemit has one principal. You work directly with me, supported
          by independent specialists where the transaction requires them.
        </p>
        <p className="fmp-section-lead">
          Forhemit is a California Public Benefit Corporation, based in San Francisco and working
          with founder-led businesses nationally. It was founded in 2026, and we do not point you
          at a track record we do not have. We point you at the standard we publish, the process
          we commit to in writing, and the monitoring that continues for 24 months after close.
        </p>
        <p className="fmp-section-lead">
          <strong>Forhemit was founded in 2026. We are new, and we say so.</strong>
        </p>
      </section>

      <section
        id="brk-get-started"
        className="fmp-section fmp-final-cta"
        aria-labelledby="brk-final-cta-heading"
      >
        <h2 id="brk-final-cta-heading" className="fmp-final-cta-headline">
          Start with a conversation between professionals.
        </h2>
        <p className="fmp-section-lead">
          Use the contact page and say you are a broker, not a founder. No client needs to be
          involved, and no client name is needed, for the first call. Or reach us directly:
          contact@forhemit.com · (510) 768-7588.
        </p>
        <div className="fmp-final-cta-actions">
          <span className="fmp-cta-shell fmp-cta-shell--block">
            <span className="fmp-cta-shell__glow" aria-hidden />
            <button
              type="button"
              className="fmp-btn fmp-btn-primary"
              onClick={() => {
                trackScheduleCallClick("brokers_footer");
                setIsContactOpen(true);
              }}
            >
              Message Forhemit
            </button>
          </span>
          <span className="fmp-cta-shell fmp-cta-shell--block">
            <span className="fmp-cta-shell__glow" aria-hidden />
            <RoadmapLink surface="brokers_footer_secondary" className="fmp-btn fmp-btn-secondary">
              Open the 120-Day Roadmap (HTML)
            </RoadmapLink>
          </span>
        </div>
        <p className="fmp-section-lead" style={{ marginTop: 24 }}>
          For the other professionals in your client&apos;s corner:{" "}
          <Link href="/legal-practices">Attorneys</Link> ·{" "}
          <Link href="/accounting-firms">CPAs</Link> ·{" "}
          <Link href="/wealth-managers">Wealth Managers</Link>
        </p>
      </section>

      <BrokersContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}

"use client";

import { useRef } from "react";
import { useCountUp } from "@/hooks/useCountUp";

export function StatsSection() {
  const statsRef = useRef<HTMLDivElement>(null);

  const stat1 = useCountUp({ end: 79, duration: 2000 });
  const stat2 = useCountUp({ end: 60, duration: 2000 });
  const stat3 = useCountUp({ end: 33, duration: 2000 });
  const stat4 = useCountUp({ end: 85, duration: 2000 });

  return (
    <section className="legal-section stats-section" ref={statsRef}>
      <div className="container">
        <div className="stats-intro">
          <p className="stats-context">
            Over the next decade, the clients that built your practice are going to exit. State-backed
            research for the California Employee Ownership Act found that:
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card" ref={stat1.ref}>
            <div className="stat-number">
              {stat1.count}
              <span>%</span>
            </div>
            <p className="stat-label">of business owners want to retire within 10 years</p>
          </div>
          <div className="stat-card" ref={stat2.ref}>
            <div className="stat-number">
              {stat2.count}
              <span>%</span>
            </div>
            <p className="stat-label">plan to do it in less than 5</p>
          </div>
          <div className="stat-card" ref={stat3.ref}>
            <div className="stat-number">
              {stat3.count}
              <span>%</span>
            </div>
            <p className="stat-label">are aiming to exit within 3</p>
          </div>
          <div className="stat-card warning" ref={stat4.ref}>
            <div className="stat-number">
              {stat4.count}
              <span>%</span>
            </div>
            <p className="stat-label">of work migrates to buyer-aligned counsel</p>
          </div>
        </div>

        <div className="stats-realization">
          <p>
            That&apos;s not a market trend &quot;out there.&quot; That&apos;s your firm&apos;s{" "}
            <strong>top 10–20 closely held business clients</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}

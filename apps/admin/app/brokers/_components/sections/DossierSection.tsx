"use client";

import { DossierCard } from "@/components/cards/DossierCard";
import { dossiers } from "../../_data/dossiers";

export function DossierSection() {
  return (
    <section className="briefing-section" id="dossiers">
      <div className="container">
        <div className="section-header" data-animate="fade-up">
          <span className="section-eyebrow">The Bottom Line</span>
          <h2>What&apos;s In It For You</h2>
          <p className="section-intro">
            Let&apos;s be direct: We do not compete with you. We complement you. We exist to solve the
            single biggest bottleneck in your pipeline—the great business that sits on the market for
            18 months because of the middle-market capital gap.
          </p>
        </div>

        <div className="dossier-grid">
          {dossiers.map((dossier, i) => (
            <DossierCard key={dossier.number} {...dossier} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { DealFlowSimulator } from "@/components/visualizations/DealFlowSimulator";

const stageDetails = [
  { num: "01", title: "Introduction", desc: "Confidential discussion about your client and their priorities" },
  { num: "02", title: "Diligence", desc: "Rapid 24-hour assessment using our COOP methodology" },
  { num: "03", title: "Structure", desc: "Custom ESOP architecture with SBA 7(a) compliance" },
  { num: "04", title: "Close", desc: "Clean execution in 90-120 days with full legacy protection" },
];

export function ProcessSection() {
  return (
    <section className="flow-section">
      <div className="container">
        <div className="section-header" data-animate="fade-up">
          <span className="section-eyebrow">The Math & Mechanics</span>
          <h2>How It Works</h2>
          <p className="section-intro">
            We have industrialized the ESOP process for businesses with 20+ employees. Why 20? Because
            that is the critical mass where a viable internal management layer exists, making the
            business highly attractive for SBA lending.
          </p>
        </div>

        <div className="flow-wrapper" data-animate="fade-up">
          <DealFlowSimulator />
        </div>

        <div className="flow-stages-detail" data-animate="fade-up">
          {stageDetails.map((stage) => (
            <div key={stage.num} className="stage-detail">
              <span className="stage-num">{stage.num}</span>
              <h4>{stage.title}</h4>
              <p>{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

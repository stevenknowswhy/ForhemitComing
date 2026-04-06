"use client";

import { ProcessStep } from "@/types";

const processSteps: ProcessStep[] = [
  {
    num: "01",
    title: "Confidential strategy session",
    desc: "We meet with your key partners to map out your highest-value, highest-risk clients and identify where a stewardship ESOP might be a serious alternative to traditional M&A.",
  },
  {
    num: "02",
    title: "Client risk mapping",
    desc: "Together we select 5–15 priority clients for exit-planning conversations in the next 12–36 months, developing a plan for how you will raise the topic naturally.",
  },
  {
    num: "03",
    title: "Joint client conversations",
    desc: "When appropriate, you introduce us as a specialized, values-aligned fiduciary partner. We listen first. If there isn't a fit, your relationship is still stronger for having brought a thoughtful option.",
  },
  {
    num: "04",
    title: "Structuring and execution",
    desc: "If there's alignment, we move into feasibility analysis and structure design. Your firm plays the lead role on corporate and estate planning.",
  },
  {
    num: "05",
    title: "Long-term stewardship",
    desc: "Post-transaction, we serve as long-term fiduciary and steward. Your firm maintains or expands its role as outside general counsel with recurring ESOP governance work.",
  },
];

export function ProcessSection() {
  return (
    <section className="legal-section process-section">
      <div className="container">
        <h2 data-animate="fade-up">How a partnership actually works</h2>
        <p className="process-subtitle" data-animate="fade-up">
          You don&apos;t need to become an ESOP expert to start. You just need to know your own client
          base.
        </p>

        <div className="process-steps">
          {processSteps.map((step, i) => (
            <div
              key={i}
              className="process-step"
              data-animate="slide-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="step-connector-line"></div>
              <div className="step-badge">{step.num}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

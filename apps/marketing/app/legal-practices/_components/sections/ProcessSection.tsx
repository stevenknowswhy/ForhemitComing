"use client";

import { ProcessStep } from "@/types";

const processSteps: ProcessStep[] = [
  {
    num: "01",
    title: "A conversation between professionals",
    desc: "Reach out directly at contact@forhemit.com or (510) 405-4330, or through our contact page, and say you are an attorney, not a founder. No client needs to be involved — and no client name is needed — for a first conversation.",
  },
  {
    num: "02",
    title: "Screen it together, against a published standard",
    desc: "We screen the business against the standard on this page, together. If a client of yours clears it, the conversation is worth having. If they do not, you will hear that from us fast, with the reasons.",
  },
  {
    num: "03",
    title: "A joint introduction, when you and your client are ready",
    desc: "Named introductions happen only when you say so, on a joint call if you want one, with you in the room and counsel of record from the first conversation to the last.",
  },
];

export function ProcessSection() {
  return (
    <section className="legal-section process-section">
      <div className="container">
        <h2 data-animate="fade-up">How an introduction works</h2>
        <p className="process-subtitle" data-animate="fade-up">
          Three steps, and your client stays unidentified until you say otherwise.
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

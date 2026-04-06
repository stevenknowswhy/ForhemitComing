"use client";

const riskSteps = [
  {
    num: "01",
    icon: "📊",
    title: "Client Concentration Risk",
    tag: "Immediate",
    objective: "Your Revenue is Tied to Aging Founders",
    body: `A handful of privately held, founder-led companies drive a disproportionate share of your fees. Their owners are now 55–75, and without warning, they could decide to sell.`,
  },
  {
    num: "02",
    icon: "👁️",
    title: "Limited Visibility",
    tag: "Hidden",
    objective: "Critical Relationships Are Uncatalogued",
    body: `Only a small leadership group truly knows which relationships are both aging and critical. Many are tied closely to one senior partner—creating concentration risk within your own firm.`,
  },
  {
    num: "03",
    icon: "📋",
    title: "No Real Succession Plan",
    tag: "warning",
    objective: "Relationships Can't Be Inherited",
    body: `The files are in order. The relationships are not. If that partner retires or a client suddenly sells, the firm is exposed—with no clear path to preserving decades of trust.`,
  },
  {
    num: "04",
    icon: "💼",
    title: "Private Equity Outreach",
    tag: "Active Threat",
    objective: "Your Clients Are Being Courted Now",
    body: `Owners are getting regular outreach about exit options. By the time they call you, they may already be committed to a buyer—and that buyer is bringing their own counsel.`,
  },
  {
    num: "05",
    icon: "🤔",
    title: "The Expertise Gap",
    tag: "highlight",
    objective: "Expected to Guide, But Without Tools",
    body: `You're not a PE fund. You're not an ESOP specialist. You don't want to spook the client, and you don't want to guess on complex structures. So you wait—and hope they call you first.`,
    isFinal: true,
  },
];

export function RiskSection() {
  return (
    <section className="legal-section risk-section">
      <div className="container">
        <div className="section-header" data-animate="fade-up">
          <h2>You&apos;re not just worried about one deal — you&apos;re worried about your entire book</h2>
          <p className="section-intro">Five critical vulnerabilities that put your firm&apos;s future at risk.</p>
        </div>

        <div className="risk-steps-container">
          <div className="risk-timeline-line"></div>

          {riskSteps.map((step, index) => (
            <div
              key={step.num}
              className={`risk-step-item ${step.isFinal ? "final" : ""}`}
              data-step={step.num}
              data-animate="fade-up"
              data-delay={index * 100}
            >
              <div className="risk-step-badge">
                <span className="risk-step-num">{step.num}</span>
                <div className="risk-step-icon">{step.icon}</div>
              </div>
              <div className={`risk-step-card ${step.isFinal ? "final" : ""}`}>
                <div className="risk-step-header">
                  <h3>{step.title}</h3>
                  <span className={`risk-step-tag ${step.tag === "warning" || step.tag === "highlight" ? step.tag : ""}`}>
                    {step.tag === "warning" ? "Critical" : step.tag === "highlight" ? "The Dilemma" : step.tag}
                  </span>
                </div>
                <span className="risk-step-objective">{step.objective}</span>
                <div className="risk-step-body">
                  <p>{step.body}</p>
                </div>
                {!step.isFinal && <div className="risk-step-connector"></div>}
                {step.isFinal && (
                  <div className="risk-step-complete">
                    <span className="risk-complete-icon">⚠</span>
                    <span>So Most Firms Wait</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="the-wait" data-animate="fade-up">
          <blockquote className="the-call">
            <p>
              &quot;We&apos;ve just signed an LOI with a private equity group. They&apos;re bringing their own
              counsel, but we&apos;ll keep you looped in.&quot;
            </p>
            <footer>You know how that story ends.</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

"use client";

const differentiators = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 4L4 14V20H44V14L24 4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 20V38H16V28H24V38H32V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 20V38H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 38H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
    title: "Public Benefit Corporation",
    description:
      "Our charter legally requires us to consider employees, communities, and long-term resilience — not just financial returns.",
    highlight: "Hardwired to care about the same stakeholders your client does.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
        <path d="M24 14V24L30 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M12 20C12 20 14 16 18 16C22 16 24 20 24 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M36 28C36 28 34 32 30 32C26 32 24 28 24 28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Principal steward, not just advisor",
    description:
      "We provide fiduciary oversight and become a long-term partner. That aligns us with the company's future, not just the closing date.",
    highlight: "Your client isn't a test case.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 4L6 14V22C6 34 14 42 24 44C34 42 42 34 42 22V14L24 4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M16 24L22 30L32 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Deep resilience expertise",
    description:
      "Our founder's background is in disaster planning and continuity of operations. We've adapted those frameworks to mid-market businesses.",
    highlight: "Proprietary stress-testing systems for multi-threat events.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="20" r="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="20" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M22 26C22 26 24 28 26 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M8 36C8 36 12 32 16 32C20 32 22 34 24 36C26 34 28 32 32 32C36 32 40 36 40 36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Designed to preserve YOUR role",
    description:
      'Most ESOP specialists view existing counsel as a variable. We designed our model so that you are a constant.',
    highlight: "We actively expand your engagement scope.",
  },
];

export function WhyDifferentSection() {
  return (
    <section className="legal-section why-different-section">
      <div className="container">
        <h2 data-animate="fade-up">Why Stewardship is different</h2>

        <div className="differentiator-rows">
          {differentiators.map((diff, index) => (
            <div
              key={index}
              className="differentiator-row"
              data-animate="fade-up"
              data-delay={index * 100}
            >
              <div className="diff-row-icon">{diff.icon}</div>
              <div className="diff-row-content">
                <h3>{diff.title}</h3>
                <p>{diff.description}</p>
              </div>
              <div className="diff-row-highlight">{diff.highlight}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

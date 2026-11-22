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
    title: "A fast no, with the reasons",
    description:
      "If a business you send us is not a fit, we say so quickly and say why, in terms you can take back to your client, along with what would have to change.",
    highlight: "Quickly — and in terms you can take back to your client.",
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
    title: "No surprises on price",
    description:
      "Our fee: 3 to 5% of the valuation, in writing after independent valuation. Professional partners are paid by your client directly, at estimates they approve first. The full cost picture is on our Pricing page, so you can answer your client's question before they ever talk to us.",
    highlight: "3 to 5% of the valuation, agreed in advance.",
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
    title: "No fees for introductions",
    description:
      "We are asked, fairly, what a partner gets for an introduction. We do not receive any money or anything else of value — monetary or non-monetary — from any of our professional partners. We do not pay referral fees or anything else of value for introductions, and we do not promise reciprocal referrals. What we offer is a clean handoff, a client who stays yours, and a partner who is kept informed at every phase.",
    highlight: "A clean handoff — nothing between firms.",
  }
];

export function WhyDifferentSection() {
  return (
    <section className="legal-section why-different-section">
      <div className="container">
        <h2 data-animate="fade-up">What we owe you, continued</h2>

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

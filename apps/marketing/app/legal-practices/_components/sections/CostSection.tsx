"use client";

const costData = [
  { value: "✓", label: "Profitable and founder-led" },
  { value: "✓", label: "$3M or more in revenue" },
  { value: "✓", label: "20 or more verifiable U.S. employees" },
  { value: "✓", label: "The owner holds a controlling stake of 51% or more" },
  { value: "✓", label: "The owner can allow about four months for the transition" },
  { value: "✓", label: "The owner is willing to be available for 4 to 12 months after closing — on call, not working hands-on" },
];

export function CostSection() {
  return (
    <section className="legal-section cost-section">
      <div className="container">
        <h2 data-animate="fade-up">Screen it together, against a published standard</h2>

        <div className="cost-reality" data-animate="fade-up">
          <p className="behind-doors">
            The businesses Forhemit can serve meet every one of these:
          </p>
          <p className="on-paper">
            If a client of yours clears that standard, the conversation is worth having. If
            they do not, you will hear that from us fast, with the reasons.
          </p>
        </div>

        <div className="cost-cards">
          {costData.map((cost, i) => (
            <div
              key={i}
              className="cost-card"
              data-animate="scale-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="cost-value">{cost.value}</div>
              <p>{cost.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

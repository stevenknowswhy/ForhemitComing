"use client";

const costData = [
  { value: "$1M–$5M", label: "Net present value of a good mid-market client over time" },
  { value: "3–5", label: "Comparable clients needed to replace that book" },
  { value: "5–10", label: "Years to develop equivalent relationships" },
  { value: "∞", label: "Competitors now hold the inside track with that buyer" },
];

export function CostSection() {
  return (
    <section className="legal-section cost-section">
      <div className="container">
        <h2 data-animate="fade-up">What losing one mid-market client actually costs your firm</h2>

        <div className="cost-reality" data-animate="fade-up">
          <p className="behind-doors">
            Behind closed doors, partners will say: &quot;We can always go win more clients.&quot;
          </p>
          <p className="on-paper">On paper, maybe. In reality:</p>
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

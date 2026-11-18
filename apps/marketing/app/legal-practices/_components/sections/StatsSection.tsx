"use client";

export function StatsSection() {
  return (
    <section className="legal-section stats-section">
      <div className="container">
        <div className="section-header" data-animate="fade-up">
          <h2>The catch-up problem</h2>
          <p className="section-intro">
            The train is already moving when counsel is called.
          </p>
        </div>

        <div data-animate="fade-up">
          <p>
            You know the sequence, because your own profession&apos;s advice is written against
            it: engage counsel before the letter of intent, because the terms agreed there are
            hard to change later. Yet the call usually comes after. A broker has the listing,
            or a buyer has made an approach, and the LOI has already anchored the price, the
            structure, and the exclusivity. What is left for the founder&apos;s counsel is to
            paper a deal shaped by other people, on a clock set by other people.
          </p>
          <p>
            And when that deal closes, it takes the client with it. A buyer or a private equity
            firm arrives with its own counsel and its own advisors, and keeps them. The
            relationship you built with the founder — in many practices, a client of decades —
            ends at the closing table, because the client no longer owns a company. You were
            not out-lawyered. You were out-sequenced.
          </p>
          <p>
            And the third-party path is not a sure thing: only about 20–30% of businesses
            taken to market actually sell (Exit Planning Institute).
          </p>
        </div>
      </div>
    </section>
  );
}

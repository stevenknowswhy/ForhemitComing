"use client";

export function CrisesSection() {
  return (
    <section className="about-section about-section-dark">
      <div className="container">
        <h2 className="section-title">The Three-Pronged Crisis</h2>
        <div className="crisis-grid">
          <div className="crisis-card">
            <h3>The Retirement Cliff</h3>
            <p>
              A &quot;Silver Tsunami&quot; is hitting the market. With up to 100 sellers for every
              one qualified buyer, the traditional market is saturated. For most owners, this math
              means their payout—and their retirement—is at risk.
            </p>
          </div>
          <div className="crisis-card">
            <h3>The Workforce Crisis</h3>
            <p>
              Your employees are facing a dual threat of displacement. They fear losing their
              livelihoods to a heartless new owner, the rapid rise of AI, or the &quot;Closed&quot;
              sign that appears when a business fails to find a buyer.
            </p>
          </div>
          <div className="crisis-card">
            <h3>The Community Collapse</h3>
            <p>
              When a local business vanishes, it isn&apos;t just a transaction that ends. The city
              loses its tax base, its history, and its economic heart.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

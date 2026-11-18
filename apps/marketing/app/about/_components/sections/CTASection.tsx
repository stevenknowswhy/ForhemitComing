"use client";

export function CTASection() {
  return (
    <section className="about-cta">
      <div className="container">
        <h2>Find out where you stand</h2>
        <p>
          Five Yes/No questions. Two minutes. Free and confidential — we only ask for your contact
          details at the end if you want your results.
        </p>
        <div className="about-cta-actions">
          <a href="/contact" className="cta-button">
            Start Your Free Assessment
          </a>
          <a href="/four-month-path" className="cta-button">
            See How It Works →
          </a>
        </div>
      </div>
    </section>
  );
}

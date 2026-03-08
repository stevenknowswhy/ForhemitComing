export function HeroSection() {
  return (
    <section className="hero" id="about">
      <div className="container">
        <div className="hero-eyebrow fade-up" style={{ justifyContent: 'center' }}>About Forhemit</div>

        <h1 className="fade-up delay-1" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', maxWidth: '900px', fontWeight: 200 }}>
          Preserve Your Life&apos;s Work<br/>or Liquidate It
        </h1>

        <p className="hero-sub fade-up delay-2" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
          Your legacy deserves a partner who builds upon your success, not one who drains it for a quick exit.
        </p>

        <a href="#contact" className="hero-cta fade-up delay-3" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          Start a Conversation <span className="hero-cta-arrow">→</span>
        </a>

        <div className="hero-stat-row fade-up delay-4" style={{ justifyContent: 'center' }}>
          <div>
            <span className="hero-stat-value">30yr</span>
            <span className="hero-stat-label">Investment horizon</span>
          </div>
          <div>
            <span className="hero-stat-value">≤40%</span>
            <span className="hero-stat-label">Leverage cap</span>
          </div>
          <div>
            <span className="hero-stat-value">3–5yr</span>
            <span className="hero-stat-label">Founder knowledge transfer</span>
          </div>
          <div>
            <span className="hero-stat-value">ESOP</span>
            <span className="hero-stat-label">Employee ownership model</span>
          </div>
        </div>
      </div>
    </section>
  );
}

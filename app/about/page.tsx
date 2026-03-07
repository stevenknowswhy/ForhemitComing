"use client";

import "./page.css";

export default function About() {
  return (
    <div className="about-wrapper">
      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo">Forhemit</a>
        <ul className="nav-links">
          <li><a href="/about">About</a></li>
          <li><a href="#model">Our Model</a></li>
          <li><a href="#commitments">Commitments</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* HERO */}
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

      {/* INTRO SECTION */}
      <section id="intro" style={{ background: 'var(--parchment)', padding: '4rem 0' }}>
        <div className="container">
          <div className="intro-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p className="section-body" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--ink)', marginBottom: '1.5rem' }}>
              Traditional private equity built its reputation on leverage and liquidation.
              We build ours on <strong>Continuity of Operations (COOP)</strong>.
            </p>
            <p className="section-body" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--ink)' }}>
              We are a holding company that acquires founder-led businesses to harden their infrastructure
              and transition them to employee ownership. We don&apos;t cut to the bone — <strong>we build muscle.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section id="philosophy" style={{ background: 'var(--parchment)' }}>
        <div className="container">
          <div className="philosophy-grid">
            <div className="philosophy-left">
              <div className="section-tag">Our Philosophy</div>
              <h2 className="section-h2">We treat companies like<br/><em>retirement investments</em>,<br/>not lottery tickets.</h2>
              <p className="section-body">
                The typical private equity playbook treats your life&apos;s work as an arbitrage opportunity —
                buy low, lever up, slash costs, and sell in five years with a return that leaves your people
                holding nothing but pink slips.
              </p>
              <p className="section-body" style={{ marginTop: '-1rem' }}>
                We are wired differently. We acquire founder-led businesses with intention of operating
                them indefinitely — generating steady dividends for owners, building real equity for employees,
                and preserving institutional knowledge that made company worth acquiring in first place.
              </p>
            </div>
            <div className="philosophy-right">
              <div className="philosophy-quote">
                &quot;A healthy company returns dividends.<br/>A sick company returns desperation.&quot;
              </div>
              <p className="philosophy-text">
                When a PE firm loads a company with debt to juice short-term returns, it isn&apos;t investing —
                it is borrowing against future of your employees, your customers, and your legacy.
                We cap leverage at 40% precisely because we intend to be here in thirty years.
                <br/><br/>
                This is not charity. It is simply better engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VS TABLE */}
      <section className="vs-section" id="model">
        <div className="container">
          <div className="section-tag">The Difference</div>
          <h2 className="section-h2">The Exit Industrial Complex<br/>vs. <em>The Stewardship Model</em></h2>
          <p className="section-body">
            Here is how the Forhemit Resilience Framework differs from the traditional Private Equity playbook —
            point by point.
          </p>

          <table className="vs-table">
            <thead>
              <tr>
                <th>The Traditional LBO Model</th>
                <th>The Forhemit COOP Model</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="td-label">Extraction-Focused</span>
                  Optimize for a 3–5 year exit and a quick flip. The company is a vehicle for a transaction, not a living institution.
                </td>
                <td>
                  <span className="td-label">Continuity-Focused</span>
                  Engineer for 30-year permanence and sustainable yield. We are building an institution, not staging an asset for resale.
                </td>
              </tr>
              <tr>
                <td>
                  <span className="td-label">Maximum Leverage</span>
                  Load the company with debt, creating structural fragility and limiting its ability to weather downturns.
                </td>
                <td>
                  <span className="td-label">Maximum Redundancy</span>
                  Cap leverage at 40% to ensure operations survive economic shocks. Resilience is engineered in from day one.
                </td>
              </tr>
              <tr>
                <td>
                  <span className="td-label">The 90-Day Push</span>
                  The founder is removed immediately — and their &quot;tribal knowledge&quot; walks out the door with them.
                </td>
                <td>
                  <span className="td-label">The Legacy Bond</span>
                  Founders transition to highly-compensated On-Call Experts, transferring institutional knowledge over 3–5 years on their terms.
                </td>
              </tr>
              <tr>
                <td>
                  <span className="td-label">Employees as Cost Centers</span>
                  Cut staff to temporarily inflate EBITDA. Loyalty and retention are irrelevant when the exit timeline is 36 months.
                </td>
                <td>
                  <span className="td-label">Employees as Ownership Centers</span>
                  Distribute equity through ESOPs to build anti-fragile loyalty. Your team becomes co-owners, not overhead.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* COMMITMENTS */}
      <section id="commitments" style={{ background: 'var(--parchment)' }}>
        <div className="container">
          <div className="section-tag">Our Commitments</div>
          <h2 className="section-h2">We put our ethics<br/>in our <em>operating agreements</em>.</h2>
          <p className="section-body">
            Other buyers ask you to trust them with your legacy. We prove it contractually.
            Our human-centric commitments aren&apos;t talking points — they are legally binding obligations.
          </p>

          <div className="commitments-grid">
            <div className="commitment-card">
              <div className="commitment-number">01</div>
              <div className="commitment-title">Reverse Management Fees</div>
              <p className="commitment-body">
                Our management fee is literally clawed back if your employees&apos; median wages and retention
                rates don&apos;t improve in our first year. We only get rich if your team thrives.
                Full stop.
              </p>
              <div className="commitment-tag">Contractually Binding</div>
            </div>

            <div className="commitment-card">
              <div className="commitment-number">02</div>
              <div className="commitment-title">The Portfolio Guardian</div>
              <p className="commitment-body">
                We are the only PE firm to install a dedicated C-suite executive whose sole mandate is to
                audit our social contract, protect your workers, and verify that our promises are kept —
                not just stated.
              </p>
              <div className="commitment-tag">C-Suite Mandate</div>
            </div>

            <div className="commitment-card">
              <div className="commitment-number">03</div>
              <div className="commitment-title">The Council of Elders</div>
              <p className="commitment-body">
                We grant the founder and key senior staff a formal governance seat with veto power over
                culture-destroying decisions — including layoffs and facility relocations — for the
                first 24 months post-acquisition.
              </p>
              <div className="commitment-tag">24-Month Governance Right</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="contact">
        <div className="cta-eyebrow">Don&apos;t Wait</div>
        <h2 className="cta-h2">Don&apos;t let your legacy become<br/>a <em>liquidity event</em>.</h2>
        <p className="cta-sub">
          If the traditional private equity playbook feels like feeding your life&apos;s work into a woodchipper,
          we should talk. Start with a free 30-day Vulnerability Assessment — an engineering review of your
          company&apos;s operational strength before we ever discuss valuation.
        </p>
        <div className="cta-buttons">
          <a href="#" className="btn-primary">Request a Free Assessment →</a>
          <a href="#model" className="btn-secondary">Learn Our Model</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <span>© 2026 Forhemit Capital. All rights reserved.</span>
        <span>
          <a href="#">Privacy Policy</a> &nbsp;·&nbsp;
          <a href="#">Terms</a> &nbsp;·&nbsp;
          <a href="#">Contact</a>
        </span>
      </footer>
    </div>
  );
}

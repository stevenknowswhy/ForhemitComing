"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Footer } from "../components/layout/Footer";
import "./accounting-firms.css";

// Scroll reveal hook
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export default function AccountingFirms() {
  const { ref: threatsRef, isVisible: threatsVisible } = useScrollReveal(0.2);
  const { ref: solutionRef, isVisible: solutionVisible } = useScrollReveal(0.2);

  // Global scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="accounting-wrapper">
      <div className="accounting-background"></div>

      <main className="accounting-main">
        {/* Hero Section */}
        <section className="accounting-hero">
          <div className="container">
            <div className="accounting-hero-content">
              <span className="accounting-eyebrow" data-animate="fade-up">
                For Accounting Firms
              </span>
              <h1 className="accounting-title" data-animate="fade-up" data-delay="100">
                94% of Accounting Firms Entered Last Tax Season{" "}
                <span className="highlight">Already Under-Resourced</span>
              </h1>
              <p className="accounting-lead" data-animate="fade-up" data-delay="200">
                While you were filing returns, three forces converged to make this your most vulnerable year yet. 
                Forhemit provides the capital, the resilience infrastructure, and the ownership transition to protect your life's work.
              </p>
              <div className="accounting-hero-cta" data-animate="fade-up" data-delay="300">
                <Link href="#assessment" className="cta-button magnetic">
                  Request a Confidential Vulnerability Assessment
                </Link>
              </div>
            </div>

            <div className="scroll-indicator">
              <div className="scroll-mouse">
                <div className="scroll-wheel"></div>
              </div>
              <span>Scroll to explore</span>
            </div>
          </div>
        </section>

        {/* Three Threats Section */}
        <section className="accounting-section threats-section" ref={threatsRef}>
          <div className="container">
            <h2 data-animate="fade-up">Three Forces Converged Against You</h2>
            <p className="section-context" data-animate="fade-up">
              The industry research is stark. While you were focused on client deadlines, these threats were accelerating.
            </p>

            <div className={`threats-grid ${threatsVisible ? "visible" : ""}`}>
              {/* Threat 1: Talent Extinction */}
              <div className="threat-card" data-animate="slide-right">
                <div className="threat-text-col">
                  <blockquote className="threat-quote">
                    &quot;We can&apos;t find people who can actually do the work.&quot;
                  </blockquote>
                  <p className="threat-desc">
                    You are likely doing the jobs of three people, turning away clients, and watching your succession plan walk out the door.
                  </p>
                </div>
                <ul className="threat-consequences">
                  <li>Doing 3 jobs simultaneously</li>
                  <li>Turning away profitable clients</li>
                  <li>Watching succession plans evaporate</li>
                </ul>
                <div className="threat-stats-col">
                  <span className="stat">-17%</span>
                  <h3>The Talent Extinction Event</h3>
                  <span className="stat-label">Workforce decline since 2020</span>
                </div>
              </div>

              {/* Threat 2: Cyber Time Bomb */}
              <div className="threat-card accent" data-animate="fade-up">
                <div className="threat-text-col">
                  <blockquote className="threat-quote">
                    &quot;We&apos;re a sitting duck.&quot;
                  </blockquote>
                  <p className="threat-desc">
                    You are managing highly sensitive financial data with infrastructure that is one phishing click away from a firm-ending disaster.
                  </p>
                </div>
                <ul className="threat-consequences">
                  <li>Sensitive client financial data at risk</li>
                  <li>One click from firm-ending disaster</li>
                  <li>No incident response plan in place</li>
                </ul>
                <div className="threat-stats-col">
                  <span className="stat">+300%</span>
                  <h3>The Cybersecurity Time Bomb</h3>
                  <span className="stat-label">Surge in cyberattacks</span>
                </div>
              </div>

              {/* Threat 3: Compliance Trap */}
              <div className="threat-card" data-animate="slide-left">
                <div className="threat-text-col">
                  <blockquote className="threat-quote">
                    &quot;The goalposts move every quarter.&quot;
                  </blockquote>
                  <p className="threat-desc">
                    Your senior partners are drowning in compliance updates instead of advising clients, leaving junior staff to handle sensitive data.
                  </p>
                </div>
                <ul className="threat-consequences">
                  <li>Senior partners buried in compliance</li>
                  <li>No time for high-margin advisory</li>
                  <li>Junior staff handling sensitive matters</li>
                </ul>
                <div className="threat-stats-col">
                  <span className="stat">+135%</span>
                  <h3>The Compliance Complexity Trap</h3>
                  <span className="stat-label">Tax authority inspections up</span>
                </div>
              </div>
            </div>

            <div className="threats-conclusion" data-animate="fade-up">
              <p>
                <strong>This is not a temporary squeeze.</strong> These are structural shifts that will not reverse themselves. 
                The firms that survive will be the ones that evolve their operating model.
              </p>
            </div>
          </div>
        </section>

        {/* The Pivot Section */}
        <section className="accounting-section pivot-section">
          <div className="container">
            <div className="pivot-content" data-animate="fade-up">
              <h2>You Cannot Hire Your Way Out of a Structural Crisis</h2>
              <p className="pivot-subtitle">You Must Harden the Infrastructure</p>
            </div>

            <div className="comparison-blocks" data-animate="fade-up">
              <div className="comparison-block negative" data-animate="slide-right">
                <h3>Traditional Private Equity</h3>
                <ul>
                  <li>Strip costs and merge operations</li>
                  <li>Extract value, then exit</li>
                  <li>Layoffs and asset stripping</li>
                  <li>High stress, broken trust</li>
                </ul>
                <div className="comparison-result">Destroys what you built</div>
              </div>

              <div className="comparison-connector">vs</div>

              <div className="comparison-block positive" data-animate="slide-left">
                <h3>The Forhemit Standard</h3>
                <ul>
                  <li>Fortify and preserve operations</li>
                  <li>Invest in resilience infrastructure</li>
                  <li>Employee wealth creation</li>
                  <li>Operational durability</li>
                </ul>
                <div className="comparison-result">Protects your legacy</div>
              </div>
            </div>

            <div className="pivot-mission" data-animate="fade-up">
              <p className="mission-statement">
                Forhemit is an entirely different class of capital. We are{" "}
                <strong>civil engineers for business legacies</strong>.
              </p>
              <p>
                We acquire successful, founder-led accounting firms and install our proprietary Stewardship Operating System 
                to neutralize your three biggest threats.
              </p>
            </div>
          </div>
        </section>

        {/* Solution Architecture Section */}
        <section className="accounting-section solution-section" ref={solutionRef}>
          <div className="container">
            <h2 data-animate="fade-up">The Forhemit Solution Architecture</h2>
            <p className="solution-context" data-animate="fade-up">
              Our three-pillar system maps directly to your three critical vulnerabilities.
            </p>

            <div className={`solution-pillars ${solutionVisible ? "visible" : ""}`}>
              {/* Pillar 1: Ownership Engine */}
              <div className="pillar-card" data-animate="fade-up">
                <div className="pillar-number">01</div>
                <div className="pillar-icon">🏛️</div>
                <h3>The Ownership Engine</h3>
                <p className="pillar-strategy">
                  <strong>Strategy:</strong> Transition your firm into a 100% Employee-Owned Trust (ESOP)
                </p>
                <div className="pillar-logic">
                  <h4>The Logic</h4>
                  <p>
                    When the accountants doing the work share in the equity, turnover stops. Employee ownership is the ultimate 
                    retention and recruitment moat. We turn your overworked staff into invested owners, permanently solving your talent pipeline.
                  </p>
                </div>
                <div className="pillar-outcome">
                  <span className="outcome-label">Solves</span>
                  <span className="outcome-text">The Talent Extinction Event</span>
                </div>
              </div>

              {/* Pillar 2: Resilience OS */}
              <div className="pillar-card" data-animate="fade-up" data-delay="100">
                <div className="pillar-number">02</div>
                <div className="pillar-icon">🛡️</div>
                <h3>The Resilience OS</h3>
                <p className="pillar-strategy">
                  <strong>Strategy:</strong> Install municipal-grade Continuity of Operations (COOP) protocols
                </p>
                <div className="pillar-logic">
                  <h4>The Logic</h4>
                  <p>
                    Led by our Chief Resilience Officer, we physically verify and harden your infrastructure. From zero-trust security 
                    implementation to password vaulting and unannounced site audits, we take the cybersecurity burden off the partners&apos; shoulders.
                  </p>
                </div>
                <div className="pillar-outcome">
                  <span className="outcome-label">Solves</span>
                  <span className="outcome-text">The Cybersecurity Time Bomb</span>
                </div>
              </div>

              {/* Pillar 3: Stewardship Support */}
              <div className="pillar-card" data-animate="fade-up" data-delay="200">
                <div className="pillar-number">03</div>
                <div className="pillar-icon">⚖️</div>
                <h3>The Stewardship Support</h3>
                <p className="pillar-strategy">
                  <strong>Strategy:</strong> Centralize regulatory and compliance burden at the Holding Company level
                </p>
                <div className="pillar-logic">
                  <h4>The Logic</h4>
                  <p>
                    Our dedicated ESOP and Compliance administration team handles the heavy lifting of trust regulations, reporting, 
                    and backend security. Your senior talent reclaims their time to focus purely on high-margin client advisory.
                  </p>
                </div>
                <div className="pillar-outcome">
                  <span className="outcome-label">Solves</span>
                  <span className="outcome-text">The Compliance Complexity Trap</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legacy Section */}
        <section className="accounting-section legacy-section">
          <div className="container">
            <div className="legacy-content" data-animate="fade-up">
              <h2>Your Legacy, Secured</h2>
              <p className="legacy-lead">
                For the retiring or exhausted founder who wants liquidity but refuses to abandon their team to a &quot;vulture&quot; PE firm.
              </p>

              <div className="legacy-value-prop" data-animate="fade-up">
                <p className="continuity-impl">
                  Selling to Forhemit means you don&apos;t get a &quot;liquidity event&quot;; you get a{" "}
                  <strong>Continuity Implementation</strong>.
                </p>
                <div className="legacy-benefits">
                  <div className="benefit-item">
                    <span className="benefit-check">✓</span>
                    <span>You receive your payout</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-check">✓</span>
                    <span>Your employees become owners</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-check">✓</span>
                    <span>Your firm is fortified against disaster</span>
                  </div>
                </div>
              </div>

              <div className="legacy-bond" data-animate="fade-up">
                <h3>The Legacy Bond</h3>
                <p>
                  We align our success with yours. Through our unique <strong>Legacy Bond</strong> structure, 
                  you are paid not just for the assets, but for successfully transferring your &quot;tribal knowledge&quot; 
                  to the next generation of firm leaders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="accounting-section cta-section" id="assessment">
          <div className="container">
            <div className="cta-content" data-animate="fade-up">
              <h2>Start With a Free Resilience Audit</h2>
              <p className="cta-context">
                If you are 12–24 months from considering a transition, the best next step isn&apos;t hiring an investment bank. 
                It is understanding your operational fragility.
              </p>
              <p className="cta-details">
                We will conduct a confidential, zero-obligation assessment of your firm&apos;s:
              </p>
              <div className="assessment-areas">
                <span className="assessment-item">Talent Risk</span>
                <span className="assessment-item">Cyber Vulnerability</span>
                <span className="assessment-item">Compliance Readiness</span>
              </div>
              <Link href="/introduction" className="cta-button magnetic">
                Schedule Your Firm&apos;s Assessment Today
              </Link>
              <p className="cta-note">Confidential • Zero Obligation • No Pressure</p>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="static" />
    </div>
  );
}

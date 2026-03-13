"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Footer } from "../components/layout/Footer";
import { SitemapModal } from "../components/modals/SitemapModal";
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
  const [showSitemapModal, setShowSitemapModal] = useState(false);
  const { ref: realityRef, isVisible: realityVisible } = useScrollReveal(0.2);

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
                The Partner-Centric Approach
              </span>
              <h1 className="accounting-title" data-animate="fade-up" data-delay="100">
                <span className="title-line-1">The Retention Crisis:</span>
                <span className="title-line-2">Are You at Risk of <span className="highlight">Losing Your Best Clients?</span></span>
              </h1>
              <p className="accounting-lead" data-animate="fade-up" data-delay="200">
                How to Defend Your AUM and Billable Hours Against the Silver Tsunami.
              </p>
              <div className="accounting-hero-cta" data-animate="fade-up" data-delay="300">
                <Link href="#contact" className="cta-button magnetic">
                  Contact Our Stewardship Team
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

        {/* The Silver Tsunami Section */}
        <section className="accounting-section tsunami-section">
          <div className="container">
            <div className="tsunami-grid" data-animate="fade-up">
              <div className="tsunami-text">
                <p className="tsunami-lead">
                  If your practice serves baby-boomer business owners, your biggest asset—and your biggest risk—is sitting on your books right now. 
                  Over the next decade, a historic transfer of wealth will take place as the majority of owners over 55 exit their companies.
                </p>
                <p className="tsunami-question">
                  The question isn&apos;t <em>if</em> your clients will transition, but <strong>who will control the outcome</strong>.
                </p>
                <Link href="#contact" className="tsunami-cta-link">
                  Will you be left behind, or will you become the architect of their legacy?
                </Link>
              </div>
              <div className="tsunami-image">
                <img 
                  src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD836AM0RQkVahrcQmOXG3UgxiZ2BuI795jYpy" 
                  alt="Business succession planning"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stark Reality Section */}
        <section className="accounting-section reality-section" ref={realityRef}>
          <div className="container">
            <h2 data-animate="fade-up">The Stark Reality of the Wealth Transfer</h2>
            <p className="section-context" data-animate="fade-up">
              Statistics show that the default outcome of a business sale is bad for your firm.
            </p>

            <div className={`reality-grid ${realityVisible ? "visible" : ""}`}>
              <div className="reality-card" data-animate="fade-up">
                <div className="reality-stat">
                  <span className="stat-number">70%</span>
                  <span className="stat-label">of heirs switch advisors</span>
                </div>
                <div className="reality-content">
                  <h3>You Lose the Wealth</h3>
                  <p>70% of heirs switch financial advisors after inheriting wealth. (Cerulli Associates)</p>
                </div>
              </div>

              <div className="reality-card" data-animate="fade-up" data-delay="100">
                <div className="reality-stat">
                  <span className="stat-icon">✕</span>
                  <span className="stat-label">consolidated out</span>
                </div>
                <div className="reality-content">
                  <h3>You Lose the Entity</h3>
                  <p>Private equity buyers consolidate vendors, cutting long-standing advisory relationships out of the equation.</p>
                </div>
              </div>

              <div className="reality-card" data-animate="fade-up" data-delay="200">
                <div className="reality-stat">
                  <span className="stat-number">23.8%</span>
                  <span className="stat-label">lost to taxes</span>
                </div>
                <div className="reality-content">
                  <h3>Your Client Loses to Taxes</h3>
                  <p>In a traditional sale, founders can lose up to 23.8%+ of their proceeds to federal capital gains taxes overnight.</p>
                </div>
              </div>
            </div>

            <div className="reality-conclusion" data-animate="fade-up">
              <p>You spend decades building relationships. <strong>Don&apos;t let a single transaction erase your AUM and billable hours.</strong></p>
            </div>
          </div>
        </section>

        {/* CPA Practice Multiplier Section */}
        <section className="accounting-section multiplier-section">
          <div className="container">
            <div className="multiplier-header" data-animate="fade-up">
              <span className="section-eyebrow">The Revenue Opportunity</span>
              <h2>The CPA Practice Multiplier: 5-Year Revenue Comparison</h2>
              <p className="multiplier-context">
                Let&apos;s look at a typical 15-person business with $10M in revenue in the San Francisco market.
              </p>
            </div>

            <div className="comparison-table-wrapper" data-animate="fade-up">
              <div className="comparison-table">
                <div className="table-header">
                  <div className="table-col metric-col">Revenue Metric</div>
                  <div className="table-col terminal-col">
                    <span className="col-title">Terminal Scenario</span>
                    <span className="col-subtitle">Business Closes / PE Sale</span>
                  </div>
                  <div className="table-col stefano-col">
                    <span className="col-title">The Forhemit Transition</span>
                    <span className="col-subtitle">ESOP + Resilience Model</span>
                  </div>
                  <div className="table-col why-col">Why It Explodes</div>
                </div>

                <div className="table-row">
                  <div className="table-col metric-col">
                    <span className="metric-name">Corporate Tax & Advisory</span>
                  </div>
                  <div className="table-col terminal-col">
                    <span className="amount zero">$0</span>
                    <span className="note">(Client Lost)</span>
                  </div>
                  <div className="table-col stefano-col">
                    <span className="amount">$175,000</span>
                    <span className="note">($35k/yr x 5)</span>
                  </div>
                  <div className="table-col why-col">
                    <span className="why-text">The entity remains local and loyal to the CPA firm.</span>
                  </div>
                </div>

                <div className="table-row">
                  <div className="table-col metric-col">
                    <span className="metric-name">New Individual Tax Revenue</span>
                  </div>
                  <div className="table-col terminal-col">
                    <span className="amount zero">$0</span>
                  </div>
                  <div className="table-col stefano-col">
                    <span className="amount">$112,500</span>
                    <span className="note">(15 Owners x $1,500/yr x 5)</span>
                  </div>
                  <div className="table-col why-col">
                    <span className="why-text">Employee-owners need complex K-1 tax filings.</span>
                  </div>
                </div>

                <div className="table-row">
                  <div className="table-col metric-col">
                    <span className="metric-name">Advisory & Succession Fees</span>
                  </div>
                  <div className="table-col terminal-col">
                    <span className="amount zero">$0</span>
                  </div>
                  <div className="table-col stefano-col">
                    <span className="amount">$50,000</span>
                    <span className="note">(One-time Transition Fee)</span>
                  </div>
                  <div className="table-col why-col">
                    <span className="why-text">Strategic consulting shared with the CPA partner.</span>
                  </div>
                </div>

                <div className="table-row">
                  <div className="table-col metric-col">
                    <span className="metric-name">Asset Management Referrals</span>
                  </div>
                  <div className="table-col terminal-col">
                    <span className="amount zero">$0</span>
                  </div>
                  <div className="table-col stefano-col">
                    <span className="amount highlight">High Potential</span>
                    <span className="note">15 new HNW clients</span>
                  </div>
                  <div className="table-col why-col">
                    <span className="why-text">15 new high-net-worth clients for the CPA&apos;s wealth arm.</span>
                  </div>
                </div>

                <div className="table-row total-row">
                  <div className="table-col metric-col">
                    <span className="metric-name total">TOTAL 5-YEAR FIRM VALUE</span>
                  </div>
                  <div className="table-col terminal-col">
                    <span className="amount total-zero">$0</span>
                  </div>
                  <div className="table-col stefano-col">
                    <span className="amount total-amount">$337,500+</span>
                  </div>
                  <div className="table-col why-col">
                    <span className="why-text total-why">A 100% Retention Rate vs. 0%.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ghost-practice-callout" data-animate="fade-up">
              <div className="callout-icon">👻</div>
              <div className="callout-content">
                <h3>The &quot;Ghost Practice&quot; Problem</h3>
                <blockquote>
                  &quot;Right now, your firm is facing a &apos;Ghost Practice&apos; problem. <strong>80% of your business-owner clients have no succession plan.</strong> When they retire, your billable revenue vanishes with them. I am offering you a way to lock in the Lifetime Value (LTV) of that business for the next 20 years. Instead of one aging client, I&apos;m giving you 15 new, younger clients who are just starting their journey as owners—and they will need you for decades.&quot;
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Build a Moat Section */}
        <section className="accounting-section moat-section">
          <div className="container">
            <div className="moat-header" data-animate="fade-up">
              <h2>Build a Moat Around Your Best Clients</h2>
              <p>
                We are a <strong>Stewardship Management Company</strong>. We partner with businesses to transition them into 
                Employee Ownership (ESOPs) using a framework designed for continuity. By introducing this model to your clients, 
                you don&apos;t just facilitate a sale; you <strong>secure your future role as their indispensable advisor</strong>.
              </p>
            </div>

            <div className="moat-delivers" data-animate="fade-up">
              <p className="delivers-lead">Here is exactly what the Stewardship model delivers for your firm:</p>
            </div>

            {/* For Wealth Managers */}
            <div className="deliverable-card" data-animate="slide-right">
              <div className="deliverable-number">01</div>
              <div className="deliverable-content">
                <h3>For Wealth Managers: Capture and Grow the Liquidity Event</h3>
                <p className="deliverable-hook">
                  When a C-Corporation founder sells to an ESOP, they can utilize <strong>IRC Section 1042</strong> to defer 100% of their capital gains taxes.
                </p>
                <ul className="deliverable-benefits">
                  <li>
                    <strong>Retain and Manage the Windfall:</strong> The proceeds must be reinvested into Qualified Replacement Property (QRP). 
                    This gives you the mandate to build and manage a substantial portfolio, capturing AUM that would otherwise walk out the door.
                  </li>
                  <li>
                    <strong>Offer a Superior Strategy:</strong> You position yourself as the expert who saved them hundreds of thousands 
                    (or millions) in taxes—a value proposition few competitors can match.
                  </li>
                </ul>
              </div>
            </div>

            {/* For CPAs */}
            <div className="deliverable-card" data-animate="slide-left">
              <div className="deliverable-number">02</div>
              <div className="deliverable-content">
                <h3>For CPAs: Deepen the Relationship and Increase Billables</h3>
                <p className="deliverable-hook">
                  When we transition a company via an ESOP, the business stays <strong>intact, local, and independent</strong>.
                </p>
                <ul className="deliverable-benefits">
                  <li>
                    <strong>Retain Corporate Work:</strong> You keep the corporate tax returns, audit work, and day-to-day accounting.
                  </li>
                  <li>
                    <strong>Unlock Specialized Recurring Revenue:</strong> ESOPs require annual valuations, complex trust returns, 
                    and ongoing compliance reporting. This creates a new, high-margin revenue stream for your firm that wasn&apos;t there before.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Window Closing Section */}
        <section className="accounting-section window-section">
          <div className="container">
            <h2 data-animate="fade-up">The Window of Opportunity is Closing</h2>
            
            <div className="window-content" data-animate="fade-up">
              <p className="window-warning">
                Your clients are being contacted by traditional private equity buyers <strong>right now</strong>. 
                If they accept that offer, your relationship is effectively over. The buyer controls the wealth and the transition.
              </p>

              <p className="window-path-intro">By presenting the Stewardship option first, you give your clients a superior path:</p>

              <div className="superior-path-grid">
                <div className="path-item" data-animate="fade-up">
                  <span className="path-check">✓</span>
                  <div>
                    <strong>Tax Efficiency</strong>
                    <p>They keep more of what they built.</p>
                  </div>
                </div>
                <div className="path-item" data-animate="fade-up" data-delay="100">
                  <span className="path-check">✓</span>
                  <div>
                    <strong>Legacy Protection</strong>
                    <p>Their employees become owners, preserving company culture.</p>
                  </div>
                </div>
                <div className="path-item" data-animate="fade-up" data-delay="200">
                  <span className="path-check">✓</span>
                  <div>
                    <strong>Independence</strong>
                    <p>The business remains a local entity.</p>
                  </div>
                </div>
                <div className="path-item highlight" data-animate="fade-up" data-delay="300">
                  <span className="path-check">✓</span>
                  <div>
                    <strong>Your Security</strong>
                    <p>Their wealth stays under your management, and their corporate work stays in your firm.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Hooks Section */}
        <section className="accounting-section hooks-section">
          <div className="container">
            <div className="hooks-header" data-animate="fade-up">
              <span className="section-eyebrow">Strategic Advantages</span>
              <h2>Why Your Clients Stay With You</h2>
            </div>

            <div className="hooks-grid">
              <div className="hook-card" data-animate="slide-right">
                <div className="hook-number">01</div>
                <div className="hook-icon">🔒</div>
                <h3>The &quot;Accountant of Record&quot; Lock</h3>
                <p>
                  In a traditional sale (to PE or a competitor), the new buyer almost always fires the old CPA 
                  and brings in their own &quot;Big 4&quot; or regional firm.
                </p>
                <div className="hook-difference">
                  <span className="difference-arrow">→</span>
                  <span className="difference-text">With our ESOP model, <strong>the CPA stays</strong> because the ownership stays local.</span>
                </div>
              </div>

              <div className="hook-card" data-animate="slide-left">
                <div className="hook-number">02</div>
                <div className="hook-icon">⚡</div>
                <h3>Capacity Control</h3>
                <p className="capacity-quote">
                  &quot;I only do three of these a quarter because I refuse to let a business fail due to poor structure. 
                  I want those three to be your best clients so we can secure your firm&apos;s revenue while we save their legacy.&quot;
                </p>
                <div className="hook-benefit">
                  <span className="benefit-tag">Exclusive Partnership</span>
                  <span className="benefit-text">Limited quarterly capacity ensures quality and attention.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Architect Section */}
        <section className="accounting-section architect-section">
          <div className="container">
            <div className="architect-content" data-animate="fade-up">
              <h2>Be the Architect of Their Legacy</h2>
              <p className="architect-choice">
                You have a choice. You can wait for the retirement announcement and hope they remember you. 
                Or, you can initiate the conversation today that <strong>locks in your AUM, secures your corporate billables, 
                and cements your role as their most trusted advisor</strong>.
              </p>
              <p className="architect-call">
                Don&apos;t let your best clients exit your portfolio. <span className="highlight">Help them exit their business instead.</span>
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="accounting-section cta-section" id="contact">
          <div className="container">
            <div className="cta-content" data-animate="fade-up">
              <Link href="/introduction" className="cta-button magnetic">
                Contact Our Stewardship Team
              </Link>
              <p className="cta-subtitle">
                Identify which clients are at risk and how we can structure a transition that benefits them, 
                their employees, and your practice.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="static" onSitemapClick={() => setShowSitemapModal(true)} />

      <SitemapModal isOpen={showSitemapModal} onClose={() => setShowSitemapModal(false)} />
    </div>
  );
}

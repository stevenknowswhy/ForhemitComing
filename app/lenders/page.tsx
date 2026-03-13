"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Footer } from "../components/layout/Footer";
import { LegalModal } from "../components/modals/LegalModal";
import { SitemapModal } from "../components/modals/SitemapModal";
import "./lenders.css";

// FAQ Accordion Component
function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={onClick}>
        <span>{question}</span>
        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
      </button>
      <div 
        className="faq-answer"
        style={{ height: `${height}px` }}
      >
        <div className="faq-answer-content" ref={contentRef}>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function LendersPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showSitemapModal, setShowSitemapModal] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      question: "How does this protect my SBA guaranty?",
      answer: "The best way to protect an SBA guaranty is to prevent the default in the first place. Our 90-day transition oversight and COOP framework ensures the business remains stable during its most vulnerable window, keeping your loans performing and avoiding the scrutiny that comes with early defaults."
    },
    {
      question: "What is the 20+ employee threshold requirement?",
      answer: "We focus on businesses with 20+ employees because that is the critical mass where a viable internal management layer exists, making the business highly attractive for SBA lending. This ensures successor management has the depth and capability to maintain operational continuity."
    },
    {
      question: "Do you compete with our lending services?",
      answer: "Absolutely not. We don't originate loans or compete for your banking relationships. We are an operational risk partner that acquires and stabilizes businesses through ESOP structures, making them better borrowers for you. Our stewardship management works alongside your existing credit facilities."
    },
    {
      question: "What types of businesses do you work with?",
      answer: "We focus on founder-dependent, closely held businesses with $750K–$3M in EBITDA and 20-75 employees. These are typically the types of companies that make up a significant portion of SBA loan portfolios—businesses where succession risk is highest and our continuity framework has the greatest impact."
    },
    {
      question: "What happens during the 90-day transition?",
      answer: "We implement our Continuity of Operations (COOP) framework: systematizing tribal knowledge, securing leadership succession from the 20+ employee pool, and installing disaster-proof operational systems. Throughout this period, we maintain close oversight with early warning systems to ensure the business—and your loan—remains stable."
    },
    {
      question: "How do you ensure SBA compliance?",
      answer: "We proactively structure every transaction to meet SOP 50 10 8 requirements. This includes comprehensive citizenship audits of ESOP beneficiaries, independent ERISA-compliant valuations, legal certifications from qualified ERISA/SBA counsel, and full disclosure of our advisory role as non-management transition consultants."
    }
  ];

  return (
    <div className="lenders-wrapper">
      <div className="lenders-background"></div>
      
      {/* Logo Header */}
      <header className="lenders-logo-header">
        <Link href="/" className="lenders-logo-link">
          <span className="lenders-logo-text">Forhemit</span>
          <span className="lenders-logo-underline"></span>
        </Link>
      </header>

      <main className="lenders-main">
        {/* Hero Section */}
        <section className="lenders-hero">
          <div className="container">
            <div className="lenders-hero-content">
              <span className="lenders-eyebrow" data-animate="fade-up">For Lending Institutions</span>
              <h1 className="lenders-title" data-animate="fade-up" data-delay="100">
                Securing the Transition
              </h1>
              <p className="lenders-lead" data-animate="fade-up" data-delay="200">
                We structure resilient, fully SBA-compliant transitions that protect your collateral, 
                empower successor management, and ensure operational continuity from day one.
              </p>
              <div className="lenders-hero-cta" data-animate="fade-up" data-delay="300">
                <a href="#contact" className="cta-button magnetic">
                  Schedule a Portfolio Risk Assessment
                </a>
              </div>
            </div>
            
            {/* Scroll indicator */}
            <div className="scroll-indicator" data-animate="fade-up" data-delay="500">
              <div className="scroll-mouse">
                <div className="scroll-wheel"></div>
              </div>
              <span>Scroll to explore</span>
            </div>
          </div>
        </section>

        {/* The Lender's Challenge Section */}
        <section className="lenders-section threat-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>The Lender&apos;s Challenge: Vulnerability in Transition</h2>
              <p className="section-intro">
                SBA portfolio data consistently highlights a critical vulnerability: early defaults in 
                acquisition financing are rarely caused by a flawed business model. They are driven by 
                execution missteps, leadership vacuums, and sudden operational disruptions following a founder&apos;s exit.
              </p>
            </div>

            <div className="threat-cards" data-animate="fade-up">
              <div className="threat-card">
                <span className="threat-icon">⚡</span>
                <h3>Rapid Activation</h3>
                <p>When the unexpected strikes during a transition, the business needs more than a financial model; it needs a tested operational playbook. We ensure backup systems activate within hours.</p>
              </div>
              <div className="threat-card">
                <span className="threat-icon">🔗</span>
                <h3>Seamless Operations</h3>
                <p>Critical vendors are notified through pre-established channels, and invoicing continues uninterrupted. The business keeps running even when leadership changes.</p>
              </div>
              <div className="threat-card">
                <span className="threat-icon">💰</span>
                <h3>Uninterrupted Debt Service</h3>
                <p>Cash flow is protected, the system absorbs the shock, and the monthly payment is made on schedule. Your collateral remains secure throughout the transition.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="lenders-section who-section section-alt">
          <div className="container">
            <div className="who-grid">
              <div className="who-content" data-animate="slide-right">
                <span className="lenders-eyebrow">Our Approach</span>
                <h2>Disaster-Tested Continuity of Operations (COOP)</h2>
                <p className="who-lead">
                  At Forhemit Stewardship Management Co., we treat business transitions with the same 
                  rigorous preparation required for crisis management.
                </p>
                <p>
                  Drawing on over a decade of experience leading disaster preparedness and response 
                  for the City and County of San Francisco, we apply specialized disciplines to protect 
                  your collateral. We engineer operational continuity—not just financial restructuring.
                </p>
                <div className="who-highlight">
                  <span className="highlight-icon">🛡️</span>
                  <p>We don't just structure the deal; we ensure the business survives the transition so your credit memo remains accurate.</p>
                </div>
              </div>
              <div className="who-image" data-animate="slide-left">
                <img 
                  src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD9Ng4TJ32pSgTBVY98K3GtlLfwieHEIvuUMxF" 
                  alt="COOP operational continuity framework" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* SBA Compliance Section */}
        <section className="lenders-section what-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>Uncompromising SBA Compliance</h2>
              <p className="section-intro">SOP 50 10 8 & Beyond</p>
            </div>

            <div className="coop-framework" data-animate="fade-up">
              <div className="coop-badge">Full Regulatory Alignment</div>
              <p className="coop-subtitle">We recognize the shifting regulatory landscape and proactively structure every transaction to meet the most rigorous SBA eligibility and compliance mandates, ensuring a smooth path through LGPC submission.</p>
            </div>

            <div className="hardening-steps">
              <div className="harden-step" data-animate="fade-up" data-delay="0">
                <div className="harden-icon">✓</div>
                <h3>1. Strict Eligibility & Citizenship Audits</h3>
                <p>We conduct comprehensive citizenship and residency audits of all ESOP beneficiaries to ensure absolute compliance with Policy Notice 5000-876441. 100% Verification: We certify that all participants are U.S. Citizens or Nationals whose principal residence is in the U.S.</p>
              </div>
              
              <div className="harden-step" data-animate="fade-up" data-delay="100">
                <div className="harden-icon">📊</div>
                <h3>2. ESOP Trust & ERISA Standards</h3>
                <p>The ESOP trust acquires 100% equity, easily satisfying the 51% requirement. All packages include an ERISA-compliant valuation report from an independent appraiser (Procedural Notice 5000-872764) and legal opinions confirming trust compliance.</p>
              </div>
              
              <div className="harden-step" data-animate="fade-up" data-delay="200">
                <div className="harden-icon">🎯</div>
                <h3>3. Transparent SBA Agent Governance</h3>
                <p>We operate with absolute clarity regarding governance, strictly adhering to SBA Agent guidelines (SOP 50 10 7.1). We serve as specialized transition consultants for a strict 90-day post-close period—the borrower's independent management team retains exclusive operational control.</p>
              </div>
            </div>

            <div className="sop-alert" data-animate="fade-up">
              <div className="sop-badge">Fee Transparency</div>
              <p className="sop-text">
                All compensation is a fixed, non-contingent advisory fee, fully disclosed on SBA Form 159. 
                We provide no guarantees or keepwells; the borrower's creditworthiness is assessed on a standalone basis.
              </p>
            </div>
          </div>
        </section>

        {/* 90-Day Early Warning System Section */}
        <section className="lenders-section why-section section-alt">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>Post-Close Observability</h2>
              <p className="section-intro">The 90-Day Early Warning System</p>
            </div>

            <div className="benefits-grid">
              <div className="benefit-card" data-animate="slide-right">
                <div className="benefit-content">
                  <span className="benefit-number">01</span>
                  <h3>DSCR Trajectory Drop</h3>
                  <p>When the Debt Service Coverage Ratio drops below 1.25x trailing 3-month average, we trigger immediate board notification and advisory review of non-essential distributions. Proactive intervention prevents default.</p>
                </div>
                <div className="benefit-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdGxJ5CeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" 
                    alt="Financial monitoring dashboard" 
                  />
                </div>
              </div>

              <div className="benefit-card reverse" data-animate="slide-left">
                <div className="benefit-content">
                  <span className="benefit-number">02</span>
                  <h3>Cyber / IT Breach Response</h3>
                  <p>In the event of any verified compromise, we activate our COOP Incident Response protocol immediately. A written incident report is delivered to the Lender within 72 hours, with full remediation steps outlined.</p>
                </div>
                <div className="benefit-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDmGV07k85Eem6OqKGFXsI071p4dSijCb2oYcR" 
                    alt="Cybersecurity monitoring" 
                  />
                </div>
              </div>

              <div className="benefit-card" data-animate="slide-right">
                <div className="benefit-content">
                  <span className="benefit-number">03</span>
                  <h3>Continuous Monitoring</h3>
                  <p>Following funding, we implement a continuous monitoring and reporting framework during the critical transition period to provide lenders with unparalleled visibility into borrower performance and operational health.</p>
                </div>
                <div className="benefit-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD9Ng4TJ32pSgTBVY98K3GtlLfwieHEIvuUMxF" 
                    alt="Real-time monitoring systems" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Credit Package Section */}
        <section className="lenders-section how-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>The Complete Credit Package</h2>
              <p className="section-intro">
                Without structured transition oversight, leveraged ESOP transactions face elevated default exposure. 
                We thoroughly mitigate this risk by delivering fully documented, underwriter-ready packages.
              </p>
            </div>

            <div className="process-timeline">
              <div className="timeline-line"></div>
              
              <div className="process-step" data-animate="fade-up" data-delay="0">
                <div className="step-badge">
                  <span className="step-num">📊</span>
                </div>
                <div className="step-card">
                  <h3>Financials</h3>
                  <p>3 years historical (tax-reconciled), 13-week post-close cash flow, and 5-year projections (including S-Corp tax benefits and ESOP contribution modeling).</p>
                </div>
              </div>

              <div className="process-step" data-animate="fade-up" data-delay="150">
                <div className="step-badge">
                  <span className="step-num">✓</span>
                </div>
                <div className="step-card">
                  <h3>Compliance Verification</h3>
                  <p>ESOP Beneficiary Citizenship Audit & Legal Certifications. Independent ERISA-Compliant Valuation, Equity Injection Verification, & Seller Standby Agreement (120 Months).</p>
                </div>
              </div>

              <div className="process-step" data-animate="fade-up" data-delay="300">
                <div className="step-badge">
                  <span className="step-num">📋</span>
                </div>
                <div className="step-card">
                  <h3>Operational Playbooks</h3>
                  <p>The 90-Day Transition Blueprint, COOP Operational Playbook, Completed SBA Form 159, & Management Separation Affidavits. Everything an underwriter needs for confident approval.</p>
                </div>
              </div>
            </div>

            <div className="five-d-content" data-animate="fade-up" style={{ marginTop: '4rem' }}>
              <div className="who-highlight" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <span className="highlight-icon">💡</span>
                <p style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
                  &quot;The founder is not the business. We ensure the tenured leadership team has the independent capacity, cross-training, and operational authority to run the company successfully.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="lenders-section faq-section section-alt">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>Frequently Asked Questions</h2>
            </div>

            <div className="faq-container" data-animate="fade-up">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === index}
                  onClick={() => toggleFaq(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="lenders-section cta-section" id="contact">
          <div className="container">
            <div className="cta-content" data-animate="fade-up">
              <h2>Secure Your Portfolio Today</h2>
              <p className="cta-subtitle">
                The regulatory landscape is tightening. Your portfolio concentration is showing. 
                The demographic cliff waits for no one. Partner with Forhemit to secure your collateral 
                through proven operational continuity frameworks.
              </p>
              
              <div className="cta-options">
                <div className="cta-option primary" data-animate="slide-right">
                  <div className="cta-option-badge">Recommended</div>
                  <h3>Schedule a Portfolio Risk Assessment</h3>
                  <p>Get a comprehensive assessment of succession risks in your commercial portfolio and learn how our COOP framework protects your SBA guaranty.</p>
                  <Link href="/introduction?join=true" className="cta-button magnetic">
                    Book Your Assessment
                  </Link>
                </div>
                
                <div className="cta-option secondary" data-animate="slide-left">
                  <h3>Learn More</h3>
                  <p>Explore our approach to lender partnerships, SBA compliance, and risk mitigation through structured transitions.</p>
                  <Link href="/introduction" className="cta-button secondary">
                    View Introduction
                  </Link>
                </div>
              </div>

              <div className="cta-contact" data-animate="fade-up">
                <p>Or contact us directly:</p>
                <a href="mailto:info@forhemit.com" className="cta-email">info@forhemit.com</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="static" onLegalClick={() => setShowLegalModal(true)} onSitemapClick={() => setShowSitemapModal(true)} />

      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
      />

      <SitemapModal isOpen={showSitemapModal} onClose={() => setShowSitemapModal(false)} />
    </div>
  );
}

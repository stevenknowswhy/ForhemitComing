"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Footer } from "../components/layout/Footer";
import { LegalModal } from "../components/modals/LegalModal";
import "./lenders.css";

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

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
      answer: "The best way to protect an SBA guaranty is to prevent the default in the first place. Our 18-month transition oversight ensures the business remains stable during its most vulnerable window, keeping your loans performing and avoiding the scrutiny that comes with early defaults."
    },
    {
      question: "Do you compete with our lending services?",
      answer: "Absolutely not. We don't originate loans or compete for your banking relationships. We are an operational risk partner that acquires and stabilizes businesses, making them better borrowers for you. Our stewardship management works alongside your existing credit facilities."
    },
    {
      question: "What types of businesses do you work with?",
      answer: "We focus on founder-dependent, closely held businesses with $2M-$50M in revenue—typically the types of companies that make up a significant portion of commercial loan portfolios. These are businesses where succession risk is highest and our continuity framework has the greatest impact."
    },
    {
      question: "How do you differ from traditional private equity?",
      answer: "Traditional PE firms strip assets and flip companies for quick returns. We are a human-centric holding company that hardens business infrastructure through employee ownership. We don't dismantle—we build resilience. Our timeline is measured in years of stability, not months of extraction."
    },
    {
      question: "What happens during the 18-month transition?",
      answer: "We implement our proprietary Continuity of Operations (COOP) framework: transitioning employees to owners, institutionalizing tribal knowledge into SOPs, and installing disaster-proof systems. Throughout this period, we maintain close oversight to ensure the business—and your loan—remains stable."
    },
    {
      question: "How do we refer a client or portfolio company?",
      answer: "Simply connect us with the business owner or send them our way. We'll conduct a rapid operational assessment to identify continuity risks that standard financial underwriting misses. If it's a fit, we handle the acquisition, transition, and stabilization while keeping you informed throughout the process."
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
                Protect Your Portfolio.
                <br />
                <span className="highlight">Fortify Your SBA Guaranty.</span>
              </h1>
              <p className="lenders-lead" data-animate="fade-up" data-delay="200">
                We transition fragile, founder-dependent businesses into resilient, employee-owned assets so your commercial loans stay out of Special Assets.
              </p>
              <div className="lenders-hero-cta" data-animate="fade-up" data-delay="300">
                <a href="#contact" className="cta-button magnetic">
                  Schedule a Portfolio Risk Audit
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

        {/* Threat Section - The Problem */}
        <section className="lenders-section threat-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>The Hidden Threat to Your Commercial Portfolio</h2>
              <p className="section-intro">
                You underwrite to Debt Service Coverage (DSC), collateral, and character. 
                But when a founder suddenly dies, divorces, or walks away, your comfortable 1.25x DSC can crater overnight.
              </p>
            </div>

            <div className="threat-visual" data-animate="fade-up">
              <img 
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDfemQfPYOIdcXFC34obyDPLkhgQVTv7ERqewA" 
                alt="Portfolio risk visualization" 
              />
              <div className="threat-overlay">
                <div className="threat-stat">
                  <span className="threat-stat-number">$397M</span>
                  <span className="threat-stat-label">SBA 7(a) Loss</span>
                </div>
                <p>First negative cash flow in 13 years</p>
              </div>
            </div>

            <div className="sop-alert" data-animate="fade-up">
              <div className="sop-badge">SOP 50 10 8</div>
              <p className="sop-text">
                The SBA is ruthlessly tightening underwriting standards and heavily auditing early defaults. 
                With mandatory 10% equity injections, strict $50K collateral rules, and the new minority owner guaranty trap, 
                the regulatory hurdles are higher than ever.
              </p>
            </div>

            <div className="threat-cards" data-animate="fade-up">
              <div className="threat-card">
                <span className="threat-icon">📉</span>
                <h3>Early Default Risk</h3>
                <p>If a transition fails during the fragile first 18 months, the SBA won't just scrutinize your collateral—they'll audit your initial credit analysis.</p>
              </div>
              <div className="threat-card">
                <span className="threat-icon">👤</span>
                <h3>Key-Person Dependency</h3>
                <p>Financials don't run companies—people do. When the founder leaves without a succession plan, tribal knowledge walks out the door.</p>
              </div>
              <div className="threat-card">
                <span className="threat-icon">📊</span>
                <h3>DSC Volatility</h3>
                <p>Your carefully modeled 1.25x Debt Service Coverage can evaporate overnight when leadership transitions fail.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="lenders-section who-section section-alt">
          <div className="container">
            <div className="who-grid">
              <div className="who-content" data-animate="slide-right">
                <span className="lenders-eyebrow">Who We Are</span>
                <h2>Your Operational Risk Partner</h2>
                <p className="who-lead">
                  We are <strong>Forhemit</strong>. Built by experts in municipal-grade disaster preparedness and response, 
                  we treat business continuity as a hard science.
                </p>
                <p>
                  We are not traditional private equity looking to strip and flip assets. We are a human-centric 
                  holding company that acquires vulnerable, founder-led businesses and hardens their infrastructure.
                </p>
                <div className="who-highlight">
                  <span className="highlight-icon">🛡️</span>
                  <p>We don't write your credit memo; we ensure the business survives the transition so your credit memo remains accurate.</p>
                </div>
              </div>
              <div className="who-image" data-animate="slide-left">
                <img 
                  src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD9Ng4TJ32pSgTBVY98K3GtlLfwieHEIvuUMxF" 
                  alt="Operational risk partnership" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="lenders-section what-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>What We Do</h2>
              <p className="section-intro">How We Harden the Asset</p>
            </div>

            <div className="coop-framework" data-animate="fade-up">
              <div className="coop-badge">Our COOP Framework</div>
              <p className="coop-subtitle">Continuity of Operations</p>
            </div>

            <div className="hardening-steps">
              <div className="harden-step" data-animate="fade-up" data-delay="0">
                <div className="harden-icon">👥</div>
                <h3>We Turn Employees Into Owners</h3>
                <p>By transitioning the business to employee ownership, we align incentives, vastly improving retention and virtually eliminating the apathy that destroys companies post-sale.</p>
              </div>
              
              <div className="harden-step" data-animate="fade-up" data-delay="100">
                <div className="harden-icon">📚</div>
                <h3>We Institutionalize "Tribal Knowledge"</h3>
                <p>We map shadow org charts and document the founder's secret sauce into formal Standard Operating Procedures, eliminating single-point-of-failure Key-Man risk.</p>
              </div>
              
              <div className="harden-step" data-animate="fade-up" data-delay="200">
                <div className="harden-icon">🔒</div>
                <h3>We Install Disaster-Proof Systems</h3>
                <p>From securing supply chains to locking down digital infrastructure, we build redundancy into every operational layer.</p>
              </div>
            </div>

            <div className="hardening-image" data-animate="fade-up">
              <img 
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDic78W35OPVhC3q4RatBL86y71kFW9UM2vGrz" 
                alt="Business continuity systems" 
              />
            </div>
          </div>
        </section>

        {/* Why Partner Section */}
        <section className="lenders-section why-section section-alt">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>Why Lenders Partner With Us</h2>
              <p className="section-intro">Partnering with Forhemit shifts your risk profile from fragile to bulletproof.</p>
            </div>

            <div className="benefits-grid">
              <div className="benefit-card" data-animate="slide-right">
                <div className="benefit-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdGxJ5CeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" 
                    alt="SBA guaranty protection" 
                  />
                </div>
                <div className="benefit-content">
                  <span className="benefit-number">01</span>
                  <h3>Defend Your Guaranty</h3>
                  <p>The best way to protect an SBA guaranty is to prevent the default in the first place. Our 18-month transition oversight ensures the business remains stable during its most vulnerable window.</p>
                </div>
              </div>

              <div className="benefit-card reverse" data-animate="slide-left">
                <div className="benefit-content">
                  <span className="benefit-number">02</span>
                  <h3>Cure Portfolio Concentration Risk</h3>
                  <p>De-risk the demographic time bomb of "Aging Owners" currently sitting in your commercial portfolio by securing their succession plans.</p>
                </div>
                <div className="benefit-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDmGV07k85Eem6OqKGFXsI071p4dSijCb2oYcR" 
                    alt="Portfolio risk management" 
                  />
                </div>
              </div>

              <div className="benefit-card" data-animate="slide-right">
                <div className="benefit-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD9Ng4TJ32pSgTBVY98K3GtlLfwieHEIvuUMxF" 
                    alt="Community reputation" 
                  />
                </div>
                <div className="benefit-content">
                  <span className="benefit-number">03</span>
                  <h3>Preserve Your Reputation</h3>
                  <p>When businesses fail, banks are forced into the nightmare of Special Assets and personal guarantee enforcement. We keep your loans performing and your community relationships intact.</p>
                </div>
              </div>

              <div className="benefit-card reverse" data-animate="slide-left">
                <div className="benefit-content">
                  <span className="benefit-number">04</span>
                  <h3>Beat the Fintechs</h3>
                  <p>Agile non-bank lenders are stealing clients with 48-hour approvals. You can't compete on algorithms, but you <em>can</em> compete on structural depth.</p>
                </div>
                <div className="benefit-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDfemQfPYOIdcXFC34obyDPLkhgQVTv7ERqewA" 
                    alt="Competitive advantage" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="lenders-section how-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>How the Partnership Works</h2>
              <p className="section-intro">We act as your specialized risk-mitigation buyer.</p>
            </div>

            <div className="process-timeline">
              <div className="timeline-line"></div>
              
              <div className="process-step" data-animate="fade-up" data-delay="0">
                <div className="step-badge">
                  <span className="step-num">01</span>
                </div>
                <div className="step-card">
                  <h3>Identify the Red Flags</h3>
                  <p>Before booking your next acquisition loan, or when you spot an aging founder without a succession plan in your existing portfolio, send the prospect our way.</p>
                </div>
              </div>

              <div className="process-step" data-animate="fade-up" data-delay="150">
                <div className="step-badge">
                  <span className="step-num">02</span>
                </div>
                <div className="step-card">
                  <h3>The Continuity Assessment</h3>
                  <p>Our team will conduct a rapid operational assessment to highlight the structural and human continuity risks that standard financial algorithms miss.</p>
                </div>
              </div>

              <div className="process-step" data-animate="fade-up" data-delay="300">
                <div className="step-badge">
                  <span className="step-num">03</span>
                </div>
                <div className="step-card">
                  <h3>Stabilization & Transition</h3>
                  <p>If it's a fit, we acquire the company, structure the transition, implement our Continuity of Operations plan, and secure the business. The result is a fully compliant, stabilized borrower primed to perform.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The 5 D's Section */}
        <section className="lenders-section five-d-section section-alt">
          <div className="container">
            <div className="five-d-content" data-animate="fade-up">
              <h2>Don't Let the "5 D's" Destroy Your DSC.</h2>
              <div className="five-d-grid">
                <div className="five-d-item">
                  <span className="five-d-icon">💀</span>
                  <span className="five-d-text">Death</span>
                </div>
                <div className="five-d-item">
                  <span className="five-d-icon">🏥</span>
                  <span className="five-d-text">Disability</span>
                </div>
                <div className="five-d-item">
                  <span className="five-d-icon">⚖️</span>
                  <span className="five-d-text">Divorce</span>
                </div>
                <div className="five-d-item">
                  <span className="five-d-icon">🗣️</span>
                  <span className="five-d-text">Disagreement</span>
                </div>
                <div className="five-d-item">
                  <span className="five-d-icon">📉</span>
                  <span className="five-d-text">Distress</span>
                </div>
              </div>
              <p className="five-d-warning">
                The regulatory landscape is tightening. Your portfolio concentration is showing. 
                The demographic cliff waits for no one. Secure your collateral today.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="lenders-section faq-section">
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
                The demographic cliff waits for no one.
              </p>
              
              <div className="cta-options">
                <div className="cta-option primary" data-animate="slide-right">
                  <div className="cta-option-badge">Recommended</div>
                  <h3>Schedule a Portfolio Risk Audit</h3>
                  <p>Get a comprehensive assessment of succession risks in your commercial portfolio.</p>
                  <Link href="/introduction?join=true" className="cta-button magnetic">
                    Book Your Audit
                  </Link>
                </div>
                
                <div className="cta-option secondary" data-animate="slide-left">
                  <h3>Learn More</h3>
                  <p>Explore our approach to lender partnerships and risk mitigation.</p>
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

      <Footer variant="static" onLegalClick={() => setShowLegalModal(true)} />

      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
      />
    </div>
  );
}

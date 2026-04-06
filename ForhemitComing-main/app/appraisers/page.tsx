"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./appraisers.css";

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
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOut * end));

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

// Recurring Revenue Calculator Component
function RevenueCalculator() {
  const [portfolioSize, setPortfolioSize] = useState(5);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const initialFee = 45000; // Average $45k initial valuation fee
  const annualFee = 15000;  // Average $15k annual update fee
  const firstYearRevenue = (portfolioSize * initialFee) + (portfolioSize * annualFee);
  const recurringRevenue = portfolioSize * annualFee;
  const fiveYearTotal = (portfolioSize * initialFee) + (portfolioSize * annualFee * 5);

  return (
    <div ref={ref} className={`revenue-calculator ${isVisible ? 'visible' : ''}`}>
      <div className="calculator-header">
        <span className="calculator-label">Portfolio Companies</span>
        <span className="calculator-value">{portfolioSize}</span>
      </div>
      <input
        type="range"
        min="1"
        max="20"
        value={portfolioSize}
        onChange={(e) => setPortfolioSize(Number(e.target.value))}
        className="calculator-slider"
      />
      <div className="calculator-results">
        <div className="result-item initial">
          <span className="result-label">Initial Valuation Fees</span>
          <span className="result-value">${(portfolioSize * initialFee / 1000).toFixed(0)}k</span>
          <span className="result-note">One-time per company</span>
        </div>
        <div className="result-item recurring">
          <span className="result-label">Annual Recurring Revenue</span>
          <span className="result-value">${(recurringRevenue / 1000).toFixed(0)}k</span>
          <span className="result-note">Every year guaranteed</span>
        </div>
        <div className="result-item total">
          <span className="result-label">5-Year Total Revenue</span>
          <span className="result-value">${(fiveYearTotal / 1000).toFixed(0)}k</span>
          <span className="result-note">From this portfolio alone</span>
        </div>
      </div>
    </div>
  );
}

// Partnership Step Component
function PartnershipStep({ step, title, description, details, side }: {
  step: number;
  title: string;
  description: string;
  details: string[];
  side: 'left' | 'right';
}) {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`partnership-step ${side} ${isActive ? 'active' : ''}`}
      data-animate={side === 'left' ? 'slide-right' : 'slide-left'}
    >
      <div className="step-content">
        <div className="step-number-badge">Step {step}</div>
        <h3>{title}</h3>
        <p className="step-description">{description}</p>
        <ul className="step-details">
          {details.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>
      </div>
      <div className="step-connector">
        <div className="connector-line" />
        <div className="connector-node">{step}</div>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, delay = 0 }: {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="feature-card-interactive"
      data-animate="fade-up"
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`feature-icon-wrapper ${isHovered ? 'hovered' : ''}`}>
        <span className="feature-icon">{icon}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={`feature-glow ${isHovered ? 'active' : ''}`} />
    </div>
  );
}

export default function AppraisersPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
      question: "What size companies do you focus on?",
      answer: "We specialize in the $3M–$15M EBITDA mid-market segment. This is the sweet spot where ESOP structures are most effective, and where the regulatory requirement for annual valuations creates the strongest recurring revenue opportunity for appraisal firms."
    },
    {
      question: "How quickly can I expect to build a recurring revenue base?",
      answer: "Immediately. Unlike traditional M&A where each engagement is one-and-done, ESOP valuations are mandated annually by ERISA and DOL regulations. Value just three Forhemit acquisitions this year, and you start next year with $45,000 in guaranteed annual recurring revenue already booked."
    },
    {
      question: "What makes Forhemit companies easier to value?",
      answer: "Before we close any deal, our Chief Resilience Officer implements our proprietary COOP framework. This means perpetually audited, clean financials in a 24-hour data room. You're not chasing distracted CFOs for weeks—you're working with standardized, defensible data from day one."
    },
    {
      question: "Do I maintain independence as the valuation specialist?",
      answer: "Absolutely. We understand and respect the regulatory environment. You work for the independent ESOP Trustee, not for us. We provide transparent, unvarnished access to management, ensuring your independence is never compromised. Our role is to make your job easier, not to influence your conclusions."
    },
    {
      question: "What is the typical fee structure?",
      answer: "For initial transaction valuations, you earn standard market rates for comprehensive FMV opinions—typically $35K–$60K depending on complexity. Annual updates are high-margin work at roughly 30-40% of the initial fee, requiring far less time since the models are already built. This creates a predictable, annuity-like revenue stream."
    },
    {
      question: "How do I become a preferred valuation partner?",
      answer: "Start with a 20-minute introductory call. We'll discuss our current deal pipeline, our timeline for upcoming initial appraisals in the $3M–$15M range, and how you can become the valuation partner of choice. We review your credentials, discuss our mutual expectations, and establish the framework for a long-term partnership."
    }
  ];

  return (
    <div className="appraisers-wrapper">
      <div className="appraisers-background"></div>
      
      <main className="appraisers-main">
        {/* Hero Section */}
        <section className="appraisers-hero">
          <div className="container">
            <div className="appraisers-hero-content">
              <span className="appraisers-eyebrow" data-animate="fade-up">For Business Appraisers & Valuation Specialists</span>
              <h1 className="appraisers-title" data-animate="fade-up" data-delay="100">
                Stop Hunting for Your Next Engagement.
                <br />
                <span className="highlight">Build a Book of Recurring Valuation Revenue.</span>
              </h1>
              <p className="appraisers-lead" data-animate="fade-up" data-delay="200">
                Partner with Forhemit to transition $3M–$15M mid-market businesses to employee ownership—
                and turn one-off appraisals into mandated, annual engagements for the next decade.
              </p>
              <div className="appraisers-hero-cta" data-animate="fade-up" data-delay="300">
                <Link
                  href="/contact?contactType=partner&interest=appraisal"
                  className="cta-button magnetic"
                >
                  Schedule a Pipeline & Partnership Call
                </Link>
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

        {/* The Valuation Treadmill Section */}
        <section className="appraisers-section problem-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>The Valuation Treadmill: The Curse of Traditional M&A</h2>
              <p className="section-intro">
                As a business appraiser, you know the grind of the traditional M&A lifecycle. 
                You spend weeks digging deep, building complex models, defending your conclusions—
                and then you are back to zero.
              </p>
            </div>

            <div className="problem-grid" data-animate="fade-up">
              <div className="problem-card">
                <span className="problem-icon">📉</span>
                <h3>The Transactional Trap</h3>
                <p>Once the business is sold to private equity or a strategic buyer, your job is done. The deep institutional knowledge you just built is essentially thrown away.</p>
              </div>
              <div className="problem-card">
                <span className="problem-icon">🏃</span>
                <h3>The Endless Hunt</h3>
                <p>You are forced back onto the treadmill, hunting for the next founder, the next broker, or the next deal just to keep your revenue flowing.</p>
              </div>
              <div className="problem-card">
                <span className="problem-icon">⚖️</span>
                <h3>Trading Expertise for Transactions</h3>
                <p>You are trading your high-level expertise for one-time transactions, never building the predictable, recurring revenue that makes a practice truly valuable.</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Solution Section */}
        <section className="appraisers-section solution-section section-alt">
          <div className="container">
            <div className="solution-grid">
              <div className="solution-content" data-animate="slide-right">
                <span className="appraisers-eyebrow">The Forhemit Solution</span>
                <h2>Valuation as an Annuity</h2>
                <p className="solution-lead">
                  Forhemit is a California public benefit corporation that partners with founders to
                  transition $3M–$15M businesses into 100% Employee Stock Ownership Plans (ESOPs)—with
                  long-term stewardship, not a quick flip.
                </p>
                <p>
                  For an evaluation specialist, the ESOP model is the holy grail of valuation work. 
                  Why? Because it is a <strong>regulatory requirement</strong>. Under ERISA and Department 
                  of Labor (DOL) regulations, an ESOP trust must update the value of its privately held 
                  shares <strong>every single year</strong>.
                </p>
                <div className="solution-highlight">
                  <span className="highlight-icon">💡</span>
                  <p>When you value a Forhemit portfolio company, you aren't just pricing a transaction—you are onboarding a client for life.</p>
                </div>
              </div>
              <div className="solution-visual" data-animate="slide-left">
                <RevenueCalculator />
              </div>
            </div>
          </div>
        </section>

        {/* How the Partnership Works Section */}
        <section className="appraisers-section steps-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>How the Partnership Works</h2>
              <p className="section-intro">
                We view our valuation partners not as vendors, but as critical, long-term infrastructure. 
                Here is how working within the Forhemit ecosystem shifts your practice from a transactional 
                model to a recurring revenue engine:
              </p>
            </div>

            <div className="partnership-steps">
              <PartnershipStep
                step={1}
                title="The Initial Transaction (The Heavy Lifting)"
                description="We bring you a qualified, vetted $3M–$15M target company. You perform the initial, comprehensive valuation required to establish the transaction FMV for the independent ESOP Trustee."
                details={[
                  "Full-scale DCF modeling and risk assessment",
                  "Defense of Fair Market Value conclusion",
                  "You earn your standard, full-scale transactional fee",
                  "Typical range: $35K–$60K depending on complexity"
                ]}
                side="left"
              />
              
              <PartnershipStep
                step={2}
                title="The Mandated Annual Update (The Recurring Revenue)"
                description="Next year, the ESOP needs its annual update. Because you have already built the complex financial models, you are the logical, frictionless choice for the Trustee to hire again."
                details={[
                  "High-margin, highly predictable work",
                  "Requires a fraction of the initial setup time",
                  "Models already built, risk profiles understood",
                  "Annual fee: ~30-40% of initial valuation fee"
                ]}
                side="right"
              />
              
              <PartnershipStep
                step={3}
                title="The Portfolio Multiplier (Scaling Your Book)"
                description="As Forhemit scales its portfolio, so does your baseline revenue. We do the deal sourcing; you reap the long-term compliance rewards."
                details={[
                  "Value 3 companies this year",
                  "Walk into next January with $45K+ already booked",
                  "Compound growth with each new acquisition",
                  "Build a sellable, annuity-based practice"
                ]}
                side="left"
              />
            </div>
          </div>
        </section>

        {/* Why Appraisers Love Forhemit Section */}
        <section className="appraisers-section features-section section-alt">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>Why Appraisers Love Forhemit Companies</h2>
              <p className="section-intro">
                Valuation specialists often dread annual updates when the target company has messy books, 
                high turnover, or erratic leadership. Forhemit eliminates this friction.
              </p>
            </div>

            <div className="features-grid">
              <FeatureCard
                icon="📊"
                title="The 24-Hour Data Room"
                description="Our portfolio companies maintain perpetually audited, clean financials. When it's time for your annual update, you aren't chasing a distracted CFO for three weeks. The data is clean, standardized, and ready."
                delay={0}
              />
              <FeatureCard
                icon="🛡️"
                title="Operational Stability"
                description="Because our companies are 100% employee-owned, they boast significantly lower turnover and higher engagement than traditional PE-backed firms. You are valuing stable, resilient assets."
                delay={100}
              />
              <FeatureCard
                icon="⚖️"
                title="Strict Fiduciary Respect"
                description="We understand the regulatory environment. We know you work for the independent Trustee, not for us. We provide transparent, unvarnished access to management, ensuring your independence is never compromised."
                delay={200}
              />
            </div>

            <div className="coop-highlight" data-animate="fade-up">
              <div className="coop-badge">Our COOP Framework</div>
              <p>
                Before we close a deal, our Chief Resilience Officer implements our proprietary 
                <strong> Continuity of Operations (COOP) </strong> 
                framework. We treat mid-market businesses like critical infrastructure—because to your valuation practice, they are.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="appraisers-section faq-section">
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
        <section className="appraisers-section cta-section" id="contact">
          <div className="container">
            <div className="cta-content" data-animate="fade-up">
              <h2>Let's Build Your Baseline Revenue</h2>
              <p className="cta-subtitle">
                If you are tired of the feast-or-famine cycle of traditional M&A and want to build a 
                predictable, high-margin practice based on regulatory compliance, you need to be working 
                in the ESOP space.
              </p>
              <p className="cta-lead">
                We are currently building our network of preferred, independent valuation specialists 
                for our upcoming deal pipeline in the <strong>$3M–$15M EBITDA range</strong>.
              </p>
              
              <div className="cta-options">
                <div className="cta-option primary" data-animate="slide-right">
                  <div className="cta-option-badge">Get Started</div>
                  <h3>Schedule a 20-Minute Introductory Call</h3>
                  <p>Discuss our current deal flow, timeline for upcoming initial appraisals, and how you can become the valuation partner of choice for the next generation of employee-owned businesses.</p>
                  <Link href="/introduction?join=true" className="cta-button magnetic">
                    Schedule Your Call
                  </Link>
                </div>
                
                <div className="cta-option secondary" data-animate="slide-left">
                  <h3>Learn More</h3>
                  <p>Explore how our partnership program works and what it takes to become a preferred valuation partner in the Forhemit ecosystem.</p>
                  <Link href="/introduction" className="cta-button secondary">
                    View Introduction
                  </Link>
                </div>
              </div>

              <div className="cta-contact" data-animate="fade-up">
                <p>Or contact us directly:</p>
                <a href="mailto:appraisers@forhemit.com" className="cta-email">appraisers@forhemit.com</a>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

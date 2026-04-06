"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./wealth-managers.css";

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

// Tax Comparison Calculator Component
function TaxComparisonCalculator() {
  const [saleAmount, setSaleAmount] = useState(10);
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

  const federalCapGainsRate = 0.238; // up to 23.8% federal LTCG + NIIT (illustrative)
  const traditionalNet =
    Math.round(saleAmount * (1 - federalCapGainsRate) * 100) / 100;
  const esopNet = saleAmount; // 0% with 1042 (illustrative)
  const difference = Math.round((esopNet - traditionalNet) * 100) / 100;

  return (
    <div ref={ref} className={`tax-calculator ${isVisible ? 'visible' : ''}`}>
      <div className="calculator-header">
        <span className="calculator-label">Adjust Sale Amount</span>
        <span className="calculator-value">${saleAmount}M</span>
      </div>
      <input
        type="range"
        min="2"
        max="50"
        value={saleAmount}
        onChange={(e) => setSaleAmount(Number(e.target.value))}
        className="calculator-slider"
      />
      <div className="calculator-results">
        <div className="result-item traditional">
          <span className="result-label">Traditional Sale</span>
          <span className="result-value">${traditionalNet}M</span>
          <span className="result-note">After up to 23.8% federal capital gains</span>
        </div>
        <div className="result-divider">
          <span className="vs">VS</span>
          <span className="diff">+${difference}M</span>
        </div>
        <div className="result-item esop">
          <span className="result-label">ESOP + 1042</span>
          <span className="result-value">${esopNet}M</span>
          <span className="result-note">Tax-deferred reinvestment</span>
        </div>
      </div>
    </div>
  );
}

// Benefit Card with hover effect
function BenefitCard({ number, title, description, icon, delay = 0 }: {
  number: string;
  title: string;
  description: string;
  icon: string;
  delay?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="benefit-card-interactive"
      data-animate="fade-up"
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`benefit-icon-wrapper ${isHovered ? 'hovered' : ''}`}>
        <span className="benefit-icon">{icon}</span>
        <span className="benefit-number">{number}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={`benefit-glow ${isHovered ? 'active' : ''}`} />
    </div>
  );
}

// Partnership Step Component
function PartnershipStep({ step, title, description, side }: {
  step: number;
  title: string;
  description: string;
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
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`partnership-step ${side} ${isActive ? 'active' : ''}`}>
      <div className="step-connector">
        <div className="step-dot" />
        <div className="step-line" />
      </div>
      <div className="step-content">
        <span className="step-badge">0{step}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function WealthManagersPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrollY, setScrollY] = useState(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const aumStat = useCountUp(3, 2000);

  const faqs = [
    {
      question: "How does the Section 1042 rollover actually work?",
      answer: "Section 1042 of the Internal Revenue Code allows sellers of stock to an ESOP to defer capital gains taxes indefinitely, provided the proceeds are reinvested in Qualified Replacement Property (QRP) within 12 months. QRP includes stocks and bonds of operating companies incorporated in the U.S. As the wealth manager, you construct and manage this QRP portfolio—dramatically expanding your AUM while providing the founder with tax-efficient wealth preservation."
    },
    {
      question: "What happens to my relationship if the founder passes away?",
      answer: "The ESOP structure actually strengthens your position. The founder's QRP portfolio transfers to their estate, where you continue managing it. Meanwhile, the ESOP Trust requires ongoing institutional asset management, and the growing employee-owners become your next generation of clients. Rather than a single relationship ending, you gain multiple enduring ones."
    },
    {
      question: "How do you handle the 'Legacy Bond' seller note?",
      answer: "The Legacy Bond is a carefully structured promissory note from the company to the selling founder, typically yielding 8-12% over 5-10 years. We structure it with appropriate collateral and covenants, then you integrate the income stream into the founder's estate plan. It's predictable, high-yield fixed income that creates ongoing touchpoints with your client."
    },
    {
      question: "Do I need ESOP expertise to introduce this to clients?",
      answer: "No. You bring the client relationship and wealth management expertise; we bring the ESOP structuring and transaction execution. We handle the regulatory complexity, valuation coordination, and legal architecture. Your role is to identify suitable candidates and guide their personal financial planning—we handle the rest."
    },
    {
      question: "What types of businesses work best for this model?",
      answer: "Ideal candidates have $3M–$15M in EBITDA, stable cash flows, strong company culture, and founders aged 55-70 who care about legacy. Professional services, manufacturing, distribution, and niche service companies tend to transition especially well. The key factor is a founder who values their people and community as much as the purchase price."
    },
    {
      question: "How is this different from other ESOP advisors?",
      answer: "Most ESOP advisors focus narrowly on the transaction. Forhemit—a California public benefit corporation—stays involved for years post-close, ensuring the business thrives under employee ownership. For you, this means the client relationship doesn't end at closing—it evolves into ongoing governance work, employee wealth management, and multi-generational planning."
    }
  ];

  return (
    <div className="wealth-wrapper">
      <div className="wealth-background">
        <div 
          className="wealth-bg-gradient"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
      </div>
      
      <main className="wealth-main">
        {/* Hero Section */}
        <section className="wealth-hero">
          <div className="container">
            <div className="wealth-hero-content">
              <span className="wealth-eyebrow" data-animate="fade-up">For Wealth Advisors</span>
              <h1 className="wealth-title" data-animate="fade-up" data-delay="100">
                Transform Your Client&apos;s Exit Into
                <br />
                <span className="highlight">Your Greatest AUM Opportunity</span>
              </h1>
              <p className="wealth-lead" data-animate="fade-up" data-delay="200">
                When founders sell to traditional buyers, taxes destroy wealth and relationships evaporate. 
                The ESOP alternative defers capital gains, multiplies your assets under management, 
                and creates a legacy that endures.
              </p>
              <div className="wealth-hero-cta" data-animate="fade-up" data-delay="300">
                <Link
                  href="/contact?contactType=partner&interest=wealth"
                  className="cta-button magnetic"
                >
                  Schedule an Advisor Partnership Call
                </Link>
              </div>
            </div>
            
            {/* Floating AUM Stat */}
            <div 
              className="floating-stat" 
              data-animate="fade-up" 
              data-delay="400"
              style={{ transform: `translateY(${scrollY * -0.05}px)` }}
            >
              <div className="stat-ring" ref={aumStat.ref}>
                <span className="stat-number">{aumStat.count}x</span>
                <span className="stat-label">AUM Potential</span>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="scroll-indicator" data-animate="fade-up" data-delay="500">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
            <span>Discover the opportunity</span>
          </div>
        </section>

        {/* The Liquidity Event Warning */}
        <section className="wealth-section warning-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">The Hidden Risk</span>
              <h2>The Liquidity Event Trap</h2>
              <p className="section-intro">
                When a successful business owner decides to sell, wealth managers face a crisis 
                disguised as a celebration. The traditional path destroys more value than it creates.
              </p>
            </div>

            <div className="warning-comparison" data-animate="fade-up">
              <div className="warning-path traditional">
                <div className="path-header">
                  <span className="path-icon">⚠</span>
                  <h3>Traditional Sale</h3>
                </div>
                <div className="path-flow">
                  <div className="flow-step">
                    <span className="step-label">Sale</span>
                    <span className="step-value">$10M</span>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step loss">
                    <span className="step-label">Taxes</span>
                    <span className="step-value">-$2.38M</span>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step final">
                    <span className="step-label">You Manage</span>
                    <span className="step-value">$7.62M</span>
                  </div>
                </div>
                <div className="path-consequence">
                  <span className="consequence-label">Plus:</span>
                  <span className="consequence-item">PE firm brings their own advisors</span>
                  <span className="consequence-item">Relationship ends within 18 months</span>
                </div>
              </div>

              <div className="warning-vs">
                <span className="vs-text">VS</span>
              </div>

              <div className="warning-path esop">
                <div className="path-header">
                  <span className="path-icon">✓</span>
                  <h3>Forhemit ESOP Path</h3>
                </div>
                <div className="path-flow">
                  <div className="flow-step">
                    <span className="step-label">Sale</span>
                    <span className="step-value">$10M</span>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step gain">
                    <span className="step-label">1042 Rollover</span>
                    <span className="step-value">$0 Tax</span>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step final">
                    <span className="step-label">You Manage</span>
                    <span className="step-value">$10M+</span>
                  </div>
                </div>
                <div className="path-benefits">
                  <span className="benefit-label">Plus:</span>
                  <span className="benefit-item">ESOP Trust management fees</span>
                  <span className="benefit-item">Growing employee client base</span>
                  <span className="benefit-item">Multi-generational relationship</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three Benefits Section */}
        <section className="wealth-section benefits-section section-alt">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">The Catalyst</span>
              <h2>Why ESOP Transitions Multiply Your Practice</h2>
              <p className="section-intro">
                An ESOP sale isn&apos;t just a transaction—it&apos;s structural tax arbitrage 
                that requires your expertise at every turn.
              </p>
            </div>

            <div className="benefits-grid">
              <BenefitCard
                number="01"
                title="The 1042 Tax Deferral"
                description="Maximize investable capital. Instead of managing diminished post-tax proceeds, you construct and oversee a Qualified Replacement Property portfolio equal to the entire pre-tax sale price."
                icon="📈"
                delay={0}
              />
              <BenefitCard
                number="02"
                title="The Legacy Bond"
                description="Create predictable income. The seller note provides your client with a high-yield, fixed-income stream over 5-10 years—integrated into their estate plan under your management."
                icon="🔗"
                delay={100}
              />
              <BenefitCard
                number="03"
                title="Expanding Client Roster"
                description="Grow with the company. The ESOP Trust needs institutional management. Employee-owners build equity and need financial planning. One relationship becomes many."
                icon="👥"
                delay={200}
              />
            </div>

            {/* Interactive Tax Calculator */}
            <div className="calculator-section" data-animate="fade-up">
              <h3>See the Capital Retention Difference</h3>
              <TaxComparisonCalculator />
            </div>
          </div>
        </section>

        {/* Partnership Roles Section */}
        <section className="wealth-section roles-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">Partnership</span>
              <h2>How We Work Together</h2>
              <p className="section-intro">
                We are operators and continuity engineers. You are the trusted confidant. 
                Together, we engineer the most tax-efficient, wealth-generating transition possible.
              </p>
            </div>

            <div className="roles-visualization" data-animate="fade-up">
              <div className="role-card advisor">
                <div className="role-icon">💼</div>
                <h3>Your Role</h3>
                <ul className="role-list">
                  <li>Guide personal financial goals</li>
                  <li>Construct the QRP portfolio</li>
                  <li>Manage the liquid wealth</li>
                  <li>Lead estate planning strategy</li>
                </ul>
              </div>

              <div className="partnership-connector">
                <div className="connector-line" />
                <div className="connector-center">
                  <span className="partnership-icon">🤝</span>
                  <span className="partnership-label">Partnership</span>
                </div>
              </div>

              <div className="role-card forhemit">
                <div className="role-icon">🏛️</div>
                <h3>Our Role</h3>
                <ul className="role-list">
                  <li>Structure ESOP transaction financing</li>
                  <li>Architect the ESOP structure</li>
                  <li>Install COOP resilience systems</li>
                  <li>Ensure operational continuity</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The Reluctant Seller Section */}
        <section className="wealth-section reluctant-section section-alt">
          <div className="container">
            <div className="reluctant-grid">
              <div className="reluctant-content" data-animate="slide-right">
                <span className="section-eyebrow">The Opportunity</span>
                <h2>The &quot;Reluctant Seller&quot;</h2>
                <p className="reluctant-lead">
                  You likely have clients past retirement age who refuse to sell. They fear that 
                  traditional private equity will strip their company, fire their loyal employees, 
                  and destroy the legacy they spent a lifetime building.
                </p>
                <p>
                  We are the solution you can bring to them. By introducing the Forhemit 
                  model, you are no longer just asking about their retirement timeline—you are bringing 
                  a sophisticated structural solution.
                </p>

                <div className="protection-pillars">
                  <div className="pillar">
                    <span className="pillar-icon">🛡️</span>
                    <span className="pillar-label">Protects Their People</span>
                  </div>
                  <div className="pillar">
                    <span className="pillar-icon">💰</span>
                    <span className="pillar-label">Protects Their Wealth</span>
                  </div>
                  <div className="pillar">
                    <span className="pillar-icon">⭐</span>
                    <span className="pillar-label">Protects Their Legacy</span>
                  </div>
                </div>
              </div>

              <div className="reluctant-visual" data-animate="slide-left">
                <img 
                  src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDic78W35OPVhC3q4RatBL86y71kFW9UM2vGrz" 
                  alt="Trusted advisor consultation" 
                />
                <div className="visual-overlay">
                  <div className="overlay-stat">
                    <span className="overlay-number">85%</span>
                    <span className="overlay-label">of founders prefer legacy preservation over maximum price</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="wealth-section process-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">The Journey</span>
              <h2>From Introduction to Partnership</h2>
            </div>

            <div className="partnership-timeline">
              <PartnershipStep
                step={1}
                title="Confidential Discussion"
                description="We meet to understand your practice, your client base, and how ESOP transitions might fit your advisory approach."
                side="left"
              />
              <PartnershipStep
                step={2}
                title="Client Opportunity Mapping"
                description="Together, we identify which of your clients fit the stewardship model—founders aged 55-70 with $3M–$15M EBITDA who value legacy."
                side="right"
              />
              <PartnershipStep
                step={3}
                title="Joint Client Meeting"
                description="You introduce us as a specialized partner. We listen first. If there's alignment, we proceed; if not, your relationship is stronger for the thoughtful introduction."
                side="left"
              />
              <PartnershipStep
                step={4}
                title="Structure & Execute"
                description="We handle the ESOP architecture and transaction execution. You lead the QRP portfolio construction and personal wealth strategy."
                side="right"
              />
              <PartnershipStep
                step={5}
                title="Ongoing Stewardship"
                description="Post-close, we manage operational continuity. You expand your role with the ESOP Trust, employee financial planning, and multi-generational estate work."
                side="left"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="wealth-section faq-section section-alt">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">Questions</span>
              <h2>Common Questions from Advisors</h2>
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
        <section className="wealth-section cta-section" id="contact">
          <div className="container">
            <div className="cta-content" data-animate="fade-up">
              <span className="cta-eyebrow">Let&apos;s Discuss Your Clients</span>
              <h2>Preserve Their Legacy. Secure Your Future.</h2>
              <p className="cta-subtitle">
                You don&apos;t need to be an ESOP expert to present this option—that&apos;s what we&apos;re here for. 
                If you have a client generating $3M–$15M in EBITDA who is concerned about taxes, 
                employee welfare, and their legacy, let&apos;s talk.
              </p>
              
              <div className="cta-options">
                <div className="cta-option primary" data-animate="slide-right">
                  <div className="cta-option-badge">Recommended</div>
                  <h3>Schedule an Advisor Partnership Call</h3>
                  <p>A confidential discussion about your client base and how we might work together.</p>
                  <Link href="/introduction?join=true" className="cta-button magnetic">
                    Book Your Call
                  </Link>
                </div>
                
                <div className="cta-option secondary" data-animate="slide-left">
                  <h3>Download the 1042 QRP Guide</h3>
                  <p>A detailed guide for wealth managers on structuring Qualified Replacement Property portfolios.</p>
                  <Link href="/introduction" className="cta-button secondary">
                    Request the Guide
                  </Link>
                </div>
              </div>

              <div className="cta-contact" data-animate="fade-up">
                <p>Or contact us directly:</p>
                <a href="mailto:advisors@forhemit.com" className="cta-email">advisors@forhemit.com</a>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

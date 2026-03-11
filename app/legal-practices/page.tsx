"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Footer } from "../components/layout/Footer";
import "./legal-practices.css";

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
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
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

// Scroll reveal component
function ScrollReveal({ 
  children, 
  animation = "fade-up", 
  delay = 0,
  className = ""
}: { 
  children: React.ReactNode; 
  animation?: string; 
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`${className}`}
      data-animate={animation}
      data-delay={delay}
      data-visible={isVisible}
    >
      {children}
    </div>
  );
}

// Global scroll reveal effect
function useGlobalScrollReveal() {
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
}

// FAQ Accordion Item
function FAQItem({ question, answer, isOpen, onClick, index }: {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`} style={{ animationDelay: `${index * 80}ms` }}>
      <button className="faq-question" onClick={onClick}>
        <span>{question}</span>
        <span className="faq-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" className="faq-plus" />
            <path d="M5 12h14" className="faq-minus" />
          </svg>
        </span>
      </button>
      <div className="faq-answer-wrapper" style={{ height }}>
        <div ref={contentRef} className="faq-answer">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function LegalPractices() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  
  // Global scroll reveal for all animated elements
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
  
  // Stats section observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const stat1 = useCountUp(79, 2000);
  const stat2 = useCountUp(60, 2000);
  const stat3 = useCountUp(33, 2000);
  const stat4 = useCountUp(85, 2000);

  const faqs = [
    {
      question: "Are you a law firm? Do you compete with us?",
      answer: (
        <>
          <p>No. We&apos;re a <strong>public benefit holding company and investor</strong>, not a law practice.</p>
          <p>We do not draft corporate or estate documents for your clients, and we do not solicit their legal work. We rely on firms like yours as essential partners.</p>
        </>
      )
    },
    {
      question: "What if we don't have ESOP experience?",
      answer: (
        <>
          <p>That&apos;s fine. We bring the <strong>ESOP and employee-ownership expertise</strong>. You bring:</p>
          <ul>
            <li>Deep knowledge of the client&apos;s business and history</li>
            <li>The existing trust relationship</li>
            <li>Your corporate, tax, employment, and estate-planning capabilities</li>
          </ul>
          <p>You&apos;ll learn the ESOP-specific pieces alongside us, at a pace that makes sense for you.</p>
        </>
      )
    },
    {
      question: "Will working with you mean we lose potential M&A work?",
      answer: (
        <>
          <p>In practice, the opposite.</p>
          <p>Without a stewardship alternative, many founder-led businesses either:</p>
          <ul>
            <li><strong>Never transact</strong>, leaving the succession problem unsolved, or</li>
            <li><strong>Sell to PE or a strategic buyer</strong>, where you often <em>don&apos;t</em> lead the deal and <em>do</em> lose ongoing work</li>
          </ul>
          <p>A Stewardship ESOP gives you a transaction you are much more likely to help lead, and a stronger, longer-lived post-transaction client.</p>
        </>
      )
    },
    {
      question: "What kinds of clients are the best fit?",
      answer: (
        <>
          <p>We&apos;re generally a fit for:</p>
          <ul>
            <li>Privately held businesses with <strong>stable cash flows</strong>, strong culture, and material employee bases</li>
            <li>Owners who care about <strong>legacy, employees, and community</strong>, not just top-dollar valuation</li>
            <li>Companies large enough for an ESOP or similar structure to make economic sense</li>
          </ul>
          <p>We&apos;re less likely to be a fit for purely speculative or asset-light startups, or owners solely focused on maximizing short-term price with no other priorities.</p>
        </>
      )
    },
    {
      question: "How are you compensated?",
      answer: (
        <>
          <p>We earn our return primarily through <strong>our investment in the business</strong>, not by taking a cut of your legal fees.</p>
          <p>You bill your work to the client as you normally would. Where other specialists (ESOP valuation, independent trustees, etc.) are required, we help coordinate them.</p>
        </>
      )
    }
  ];

  return (
    <div className="legal-wrapper">
      <div className="legal-background"></div>

      <main className="legal-main">
        {/* Hero Section */}
        <section className="legal-hero">
          <div className="container">
            <div className="legal-hero-content">
              <span className="legal-eyebrow" data-animate="fade-up">For Legal Practices</span>
              <h1 className="legal-title" data-animate="fade-up" data-delay="100">
                Turn the Great Wealth Transfer into Your Firm&apos;s{" "}
                <span className="highlight">Most Defensible Advantage</span>
              </h1>
              <p className="legal-lead" data-animate="fade-up" data-delay="200">
                Protect the clients you&apos;ve spent a career winning — before someone else owns the relationship
              </p>
              <div className="legal-hero-cta" data-animate="fade-up" data-delay="300">
                <Link href="#consultation" className="cta-button magnetic">
                  Schedule a Confidential Consultation
                </Link>
              </div>
            </div>
            
            {/* Animated scroll indicator */}
            <div className="scroll-indicator">
              <div className="scroll-mouse">
                <div className="scroll-wheel"></div>
              </div>
              <span>Scroll to explore</span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="legal-section stats-section" ref={statsRef}>
          <div className="container">
            <div className={`stats-intro ${statsVisible ? 'visible' : ''}`}>
              <p className="stats-context">
                Over the next decade, the clients that built your practice are going to exit.
                State-backed research for the California Employee Ownership Act found that:
              </p>
            </div>
            
            <div className={`stats-grid ${statsVisible ? 'visible' : ''}`}>
              <div className="stat-card" ref={stat1.ref}>
                <div className="stat-number">{stat1.count}<span>%</span></div>
                <p className="stat-label">of business owners want to retire within 10 years</p>
              </div>
              <div className="stat-card" ref={stat2.ref}>
                <div className="stat-number">{stat2.count}<span>%</span></div>
                <p className="stat-label">plan to do it in less than 5</p>
              </div>
              <div className="stat-card" ref={stat3.ref}>
                <div className="stat-number">{stat3.count}<span>%</span></div>
                <p className="stat-label">are aiming to exit within 3</p>
              </div>
              <div className="stat-card warning" ref={stat4.ref}>
                <div className="stat-number">{stat4.count}<span>%</span></div>
                <p className="stat-label">of work migrates to buyer-aligned counsel</p>
              </div>
            </div>

            <div className={`stats-realization ${statsVisible ? 'visible' : ''}`}>
              <p>That&apos;s not a market trend &quot;out there.&quot; That&apos;s your firm&apos;s <strong>top 10–20 closely held business clients</strong>.</p>
            </div>
          </div>
        </section>

        {/* Hard Questions Section */}
        <section className="legal-section questions-section">
          <div className="container">
            <div className="questions-visual">
              {/* Question 1 - Image Left, Text Right */}
              <div className="question-row" data-animate="fade-up">
                <div className="question-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDeEk3OSLE239wP7JIxTHYvlCMa8pdWbngVFGq" 
                    alt="Business owner considering sale" 
                  />
                  <div className="question-image-overlay" />
                </div>
                <div className="question-content">
                  <span className="question-label">Scenario One</span>
                  <p className="question-text">
                    If your largest privately held client signed a letter of intent to sell tomorrow,{" "}
                    <strong>would you be leading the deal — or reading about it in a press release drafted by someone else?</strong>
                  </p>
                </div>
              </div>

              {/* Question 2 - Text Left, Image Right */}
              <div className="question-row reverse" data-animate="fade-up" data-delay="150">
                <div className="question-content">
                  <span className="question-label">Scenario Two</span>
                  <p className="question-text">
                    If a private equity buyer walks in,{" "}
                    <strong>how much of that client&apos;s legal work will follow their preferred counsel out the door?</strong>
                  </p>
                </div>
                <div className="question-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdGxJ5CeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" 
                    alt="Private equity meeting" 
                  />
                  <div className="question-image-overlay" />
                </div>
              </div>
            </div>

            <div className="questions-conclusion" data-animate="fade-up">
              <p className="data-blunt">Most firms don&apos;t want to dwell on those questions. But the data is blunt:</p>
              <ul className="data-points">
                <li>A majority of firms report <strong>losing clients or key matters because of continuity and handover failures</strong></li>
                <li>When a strategic or PE buyer takes over, firms routinely see <strong>80–90% of ongoing work migrate to buyer-aligned counsel</strong></li>
              </ul>
              <p className="structural-truth">
                You don&apos;t lose that work because you did anything wrong. You lose it because traditional M&A is structurally designed to <span className="highlight-text">replace</span> you.
              </p>
              <p className="our-purpose">Our work exists to change that.</p>
            </div>
          </div>
        </section>

        {/* Risk Factors Section */}
        <section className="legal-section risk-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <h2>You&apos;re not just worried about one deal — you&apos;re worried about your entire book</h2>
              <p className="section-intro">
                Five critical vulnerabilities that put your firm&apos;s future at risk.
              </p>
            </div>

            <div className="risk-steps-container">
              <div className="risk-timeline-line"></div>
              
              <div className="risk-step-item" data-step="1" data-animate="fade-up">
                <div className="risk-step-badge">
                  <span className="risk-step-num">01</span>
                  <div className="risk-step-icon">📊</div>
                </div>
                <div className="risk-step-card">
                  <div className="risk-step-header">
                    <h3>Client Concentration Risk</h3>
                    <span className="risk-step-tag">Immediate</span>
                  </div>
                  <span className="risk-step-objective">Your Revenue is Tied to Aging Founders</span>
                  <div className="risk-step-body">
                    <p>
                      A handful of privately held, founder-led companies drive a disproportionate 
                      share of your fees. Their owners are now 55–75, and without warning, they 
                      could decide to sell.
                    </p>
                  </div>
                  <div className="risk-step-connector"></div>
                </div>
              </div>

              <div className="risk-step-item" data-step="2" data-animate="fade-up" data-delay="100">
                <div className="risk-step-badge">
                  <span className="risk-step-num">02</span>
                  <div className="risk-step-icon">👁️</div>
                </div>
                <div className="risk-step-card">
                  <div className="risk-step-header">
                    <h3>Limited Visibility</h3>
                    <span className="risk-step-tag">Hidden</span>
                  </div>
                  <span className="risk-step-objective">Critical Relationships Are Uncatalogued</span>
                  <div className="risk-step-body">
                    <p>
                      Only a small leadership group truly knows which relationships are both aging 
                      and critical. Many are tied closely to one senior partner—creating 
                      concentration risk within your own firm.
                    </p>
                  </div>
                  <div className="risk-step-connector"></div>
                </div>
              </div>

              <div className="risk-step-item" data-step="3" data-animate="fade-up" data-delay="200">
                <div className="risk-step-badge">
                  <span className="risk-step-num">03</span>
                  <div className="risk-step-icon">📋</div>
                </div>
                <div className="risk-step-card">
                  <div className="risk-step-header">
                    <h3>No Real Succession Plan</h3>
                    <span className="risk-step-tag warning">Critical</span>
                  </div>
                  <span className="risk-step-objective">Relationships Can&apos;t Be Inherited</span>
                  <div className="risk-step-body">
                    <p>
                      The files are in order. The relationships are not. If that partner retires 
                      or a client suddenly sells, the firm is exposed—with no clear path to 
                      preserving decades of trust.
                    </p>
                  </div>
                  <div className="risk-step-connector"></div>
                </div>
              </div>

              <div className="risk-step-item" data-step="4" data-animate="fade-up" data-delay="300">
                <div className="risk-step-badge">
                  <span className="risk-step-num">04</span>
                  <div className="risk-step-icon">💼</div>
                </div>
                <div className="risk-step-card">
                  <div className="risk-step-header">
                    <h3>Private Equity Outreach</h3>
                    <span className="risk-step-tag">Active Threat</span>
                  </div>
                  <span className="risk-step-objective">Your Clients Are Being Courted Now</span>
                  <div className="risk-step-body">
                    <p>
                      Owners are getting regular outreach about exit options. By the time they 
                      call you, they may already be committed to a buyer—and that buyer is bringing 
                      their own counsel.
                    </p>
                  </div>
                  <div className="risk-step-connector"></div>
                </div>
              </div>

              <div className="risk-step-item final" data-step="5" data-animate="fade-up" data-delay="400">
                <div className="risk-step-badge">
                  <span className="risk-step-num">05</span>
                  <div className="risk-step-icon">🤔</div>
                </div>
                <div className="risk-step-card final">
                  <div className="risk-step-header">
                    <h3>The Expertise Gap</h3>
                    <span className="risk-step-tag highlight">The Dilemma</span>
                  </div>
                  <span className="risk-step-objective">Expected to Guide, But Without Tools</span>
                  <div className="risk-step-body">
                    <p>
                      You&apos;re not a PE fund. You&apos;re not an ESOP specialist. You don&apos;t want to spook 
                      the client, and you don&apos;t want to guess on complex structures. So you wait—and 
                      hope they call you first.
                    </p>
                  </div>
                  <div className="risk-step-complete">
                    <span className="risk-complete-icon">⚠</span>
                    <span>So Most Firms Wait</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="the-wait" data-animate="fade-up">
              <blockquote className="the-call">
                <p>&quot;We&apos;ve just signed an LOI with a private equity group. They&apos;re bringing their own counsel, but we&apos;ll keep you looped in.&quot;</p>
                <footer>You know how that story ends.</footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Cost Section */}
        <section className="legal-section cost-section">
          <div className="container">
            <h2 data-animate="fade-up">What losing one mid-market client actually costs your firm</h2>
            
            <div className="cost-reality" data-animate="fade-up">
              <p className="behind-doors">Behind closed doors, partners will say: &quot;We can always go win more clients.&quot;</p>
              <p className="on-paper">On paper, maybe. In reality:</p>
            </div>

            <div className="cost-cards">
              {[
                { value: "$1M–$5M", label: "Net present value of a good mid-market client over time" },
                { value: "3–5", label: "Comparable clients needed to replace that book" },
                { value: "5–10", label: "Years to develop equivalent relationships" },
                { value: "∞", label: "Competitors now hold the inside track with that buyer" },
              ].map((cost, i) => (
                <div 
                  key={i} 
                  className="cost-card" 
                  data-animate="scale-up" 
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div className="cost-value">{cost.value}</div>
                  <p>{cost.label}</p>
                </div>
              ))}
            </div>

            <div className="cost-evaporating" data-animate="fade-up">
              <p className="not-just">This isn&apos;t just about this year&apos;s billings.</p>
              <div className="evaporating-list">
                <div className="evap-item">
                  <span className="evap-icon">📅</span>
                  <span><strong>Multi-decade estate planning work</strong> you&apos;ll never see</span>
                </div>
                <div className="evap-item">
                  <span className="evap-icon">🌐</span>
                  <span><strong>Cross-referrals and network effects</strong> that quietly disappear</span>
                </div>
                <div className="evap-item">
                  <span className="evap-icon">🎓</span>
                  <span><strong>The training ground for your next generation of partners</strong> evaporating with no equivalent pipeline</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stewardship Path Section */}
        <section className="legal-section stewardship-section">
          <div className="container">
            <div className="stewardship-intro" data-animate="fade-up">
              <h2>There <em>is</em> a structurally different path</h2>
              <p className="stewardship-subtitle">Stewardship-based ESOP transitions</p>
            </div>

            <div className="comparison-blocks">
              <div className="comparison-block traditional" data-animate="slide-right">
                <div className="comparison-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDnNRRtzSNaoHZhcXfKi2B3O8YTR0lmArFCIVG" 
                    alt="Traditional M&A corporate takeover"
                  />
                  <div className="comparison-image-overlay" />
                </div>
                <div className="comparison-content">
                  <h3>Traditional M&A</h3>
                  <p className="comparison-desc">Built to consolidate control — including control of legal relationships.</p>
                  <div className="comparison-result negative">You&apos;re often replaced</div>
                </div>
              </div>
              
              <div className="comparison-connector" data-animate="fade-in">vs</div>
              
              <div className="comparison-block stewardship" data-animate="slide-left">
                <div className="comparison-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD5DFKeJbJdhlvXzTciIMfp3OgtnGQKqaU1H5j" 
                    alt="Employee ownership collaboration"
                  />
                  <div className="comparison-image-overlay" />
                </div>
                <div className="comparison-content">
                  <h3>Employee Ownership</h3>
                  <p className="comparison-desc">Built to <strong>preserve</strong> what matters most.</p>
                  <ul className="preserve-list">
                    <li>The business</li>
                    <li>The jobs</li>
                    <li>The culture</li>
                    <li>The founder&apos;s legacy</li>
                    <li>The existing professional relationships</li>
                  </ul>
                  <div className="comparison-result positive">You remain at the center</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="legal-section benefits-section">
          <div className="container">
            <h2 data-animate="fade-up">What partnering with us does for your firm</h2>
            
            <div className="benefit-rows">
              {/* Card 01 - 3 columns: Number/Title | Text | Outcome */}
              <div className="benefit-row" data-animate="fade-up" data-delay="0">
                <div className="benefit-row-header">
                  <span className="benefit-row-number">01</span>
                  <h3>You stop being replaceable</h3>
                </div>
                <div className="benefit-row-content">
                  <p>
                    Instead of waiting to find out about a sale, you become the one who brings a credible, 
                    values-aligned exit alternative. You raise the succession conversation from a place of 
                    <strong> insight, not fear</strong>.
                  </p>
                </div>
                <div className="benefit-row-outcome">
                  <span className="outcome-label">Outcome</span>
                  <span className="outcome-text">Incredibly difficult for competing advisors to dislodge</span>
                </div>
              </div>

              {/* Card 02 - 2 rows: Top (Number/Title/Text) | Bottom (Before/During/After) */}
              <div className="benefit-row stacked" data-animate="fade-up" data-delay="100">
                <div className="benefit-row-top">
                  <div className="benefit-row-header">
                    <span className="benefit-row-number">02</span>
                    <h3>Convert risk into revenue streams</h3>
                  </div>
                  <p>A Stewardship ESOP creates work across three phases:</p>
                </div>
                <div className="benefit-row-phases">
                  <div className="phase-card">
                    <span className="phase-label">Before</span>
                    <span>Exit strategy, restructuring, estate planning</span>
                  </div>
                  <div className="phase-card">
                    <span className="phase-label">During</span>
                    <span>Transaction structuring, corporate counsel</span>
                  </div>
                  <div className="phase-card">
                    <span className="phase-label">After</span>
                    <span>Ongoing governance, compliance, next-gen planning</span>
                  </div>
                </div>
              </div>

              {/* Card 03 - 3 columns: Number/Title | Text | Result */}
              <div className="benefit-row" data-animate="fade-up" data-delay="200">
                <div className="benefit-row-header">
                  <span className="benefit-row-number">03</span>
                  <h3>Differentiate in a way competitors can&apos;t copy</h3>
                </div>
                <div className="benefit-row-content">
                  <blockquote className="benefit-quote">
                    &quot;We offer a proven, investor-backed, employee-ownership transition path that preserves 
                    client relationships and community jobs, with a Stewardship Holding Company as long-term 
                    capital partner.&quot;
                  </blockquote>
                </div>
                <div className="benefit-row-result">
                  <p>Give your rainmakers a <strong>new, high-value conversation</strong> to have with aging founders.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Different Section */}
        <section className="legal-section why-different-section">
          <div className="container">
            <h2 data-animate="fade-up">Why Stewardship is different</h2>
            
            <div className="differentiator-rows">
              <div className="differentiator-row" data-animate="fade-up" data-delay="0">
                <div className="diff-row-icon">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4L4 14V20H44V14L24 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 20V38H16V28H24V38H32V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M40 20V38H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 38H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="24" cy="12" r="2" fill="currentColor"/>
                  </svg>
                </div>
                <div className="diff-row-content">
                  <h3>Public Benefit Corporation</h3>
                  <p>Our charter legally requires us to consider employees, communities, and long-term resilience — not just financial returns.</p>
                </div>
                <div className="diff-row-highlight">
                  Hardwired to care about the same stakeholders your client does.
                </div>
              </div>

              <div className="differentiator-row" data-animate="fade-up" data-delay="100">
                <div className="diff-row-icon">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2"/>
                    <path d="M24 14V24L30 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 20C12 20 14 16 18 16C22 16 24 20 24 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M36 28C36 28 34 32 30 32C26 32 24 28 24 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="diff-row-content">
                  <h3>Principal investor, not just advisor</h3>
                  <p>We put capital at risk and become a long-term owner. That aligns us with the company&apos;s future, not just the closing date.</p>
                </div>
                <div className="diff-row-highlight">
                  Your client isn&apos;t a test case.
                </div>
              </div>

              <div className="differentiator-row" data-animate="fade-up" data-delay="200">
                <div className="diff-row-icon">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4L6 14V22C6 34 14 42 24 44C34 42 42 34 42 22V14L24 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 24L22 30L32 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="diff-row-content">
                  <h3>Deep resilience expertise</h3>
                  <p>Our founder&apos;s background is in disaster planning and continuity of operations. We&apos;ve adapted those frameworks to mid-market businesses.</p>
                </div>
                <div className="diff-row-highlight">
                  Proprietary stress-testing systems for multi-threat events.
                </div>
              </div>

              <div className="differentiator-row" data-animate="fade-up" data-delay="300">
                <div className="diff-row-icon">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="20" r="8" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="32" cy="20" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M22 26C22 26 24 28 26 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 36C8 36 12 32 16 32C20 32 22 34 24 36C26 34 28 32 32 32C36 32 40 36 40 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="diff-row-content">
                  <h3>Designed to preserve YOUR role</h3>
                  <p>Most ESOP specialists view existing counsel as a variable. We designed our model so that you are a constant.</p>
                </div>
                <div className="diff-row-highlight">
                  We actively expand your engagement scope.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="legal-section process-section">
          <div className="container">
            <h2 data-animate="fade-up">How a partnership actually works</h2>
            <p className="process-subtitle" data-animate="fade-up">You don&apos;t need to become an ESOP expert to start. You just need to know your own client base.</p>
            
            <div className="process-steps">
              {[
                { num: "01", title: "Confidential strategy session", desc: "We meet with your key partners to map out your highest-value, highest-risk clients and identify where a stewardship ESOP might be a serious alternative to traditional M&A." },
                { num: "02", title: "Client risk mapping", desc: "Together we select 5–15 priority clients for exit-planning conversations in the next 12–36 months, developing a plan for how you will raise the topic naturally." },
                { num: "03", title: "Joint client conversations", desc: "When appropriate, you introduce us as a specialized, values-aligned capital partner. We listen first. If there isn't a fit, your relationship is still stronger for having brought a thoughtful option." },
                { num: "04", title: "Structuring and execution", desc: "If there's alignment, we move into feasibility analysis and structure design. Your firm plays the lead role on corporate and estate planning." },
                { num: "05", title: "Long-term stewardship", desc: "Post-transaction, we serve as long-term owner and steward. Your firm maintains or expands its role as outside general counsel with recurring ESOP governance work." },
              ].map((step, i) => (
                <div 
                  key={i} 
                  className="process-step" 
                  data-animate="slide-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="step-connector-line"></div>
                  <div className="step-badge">{step.num}</div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fit Check Section */}
        <section className="legal-section fit-section">
          <div className="container">
            <h2 data-animate="fade-up">Is this right for your firm?</h2>
            
            <div className="fit-grid">
              <div className="fit-column good-fit" data-animate="slide-right">
                <h3>You&apos;re likely a strong fit if:</h3>
                <ul>
                  <li>You have <strong>10+ closely held business clients</strong> whose owners are 55+ and important to your firm&apos;s economics</li>
                  <li>You worry that a traditional sale would lead to <strong>significant loss of work</strong></li>
                  <li>You value your clients&apos; <strong>employees and communities</strong>, not just their deal size</li>
                  <li>You&apos;re open to a <strong>strategic, long-term partnership</strong>, not a one-off transaction</li>
                </ul>
              </div>
              
              <div className="fit-column not-fit" data-animate="slide-left">
                <h3>You&apos;re probably not a fit if:</h3>
                <ul>
                  <li>Your focus is mainly <strong>one-off, high-volume deal execution</strong></li>
                  <li>You see clients purely as <strong>files and matters</strong>, not people whose legacies you&apos;re helping shape</li>
                  <li>You&apos;re looking for <strong>immediate, high-volume referrals</strong> rather than carefully curated high-impact engagements</li>
                </ul>
              </div>
            </div>

            <div className="limited-partnerships" data-animate="fade-up">
              <p>Because our stewardship model is hands-on and capital-intensive, we <strong>intentionally partner with only a small number of law firms</strong> each year.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="legal-section faq-section">
          <div className="container">
            <h2 data-animate="fade-up">Common questions from firms like yours</h2>
            
            <div className="faq-list" data-animate="fade-up">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === i}
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Urgency Section */}
        <section className="legal-section urgency-section">
          <div className="container">
            <h2 data-animate="fade-up">The window is open — but it is not open indefinitely</h2>
            
            <div className="demographic-wave" data-animate="fade-up">
              <p className="wave-intro">The demographic wave is not theoretical:</p>
              <div className="wave-points">
                <div className="wave-point">
                  <span className="wave-age">Early 60s</span>
                  <span className="wave-status">In the decision zone right now</span>
                </div>
                <div className="wave-point">
                  <span className="wave-age">3–5 years</span>
                  <span className="wave-status">Most valuable owner-founders will have exited or drifted into reactive decisions</span>
                </div>
              </div>
            </div>

            <div className="urgency-factors" data-animate="fade-up">
              <p>Meanwhile:</p>
              <ul>
                <li>Private equity and consolidators are <strong>systematically courting</strong> them</li>
                <li>ESOPs are getting more attention — often from people who <strong>don&apos;t</strong> care about preserving your role</li>
                <li>The number of businesses that can sustainably support a stewardship ESOP is <strong>finite</strong></li>
              </ul>
            </div>

            <div className="the-choice" data-animate="fade-up">
              <p>If you want to be the advisor who <strong>brings</strong> a credible, resilient option — not the one who finds out about the sale after it&apos;s signed — this is the time to act.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="legal-section cta-section" id="consultation">
          <div className="container">
            <div className="cta-content" data-animate="fade-up">
              <h2>Take the next step</h2>
              
              <div className="cta-options">
                <div className="cta-option primary" data-animate="slide-right">
                  <div className="cta-option-badge">Recommended</div>
                  <h3>Schedule a confidential Stewardship consultation</h3>
                  <p>Spend 60–90 minutes with us mapping which of your clients are most vulnerable to transition risk and where a stewardship ESOP could be realistic.</p>
                  <Link href="/introduction" className="cta-button magnetic">
                    Request a Stewardship Consultation
                  </Link>
                  <span className="cta-note">Limited new firm partnerships each quarter</span>
                </div>

                <div className="cta-option secondary" data-animate="slide-left">
                  <h3>Get your Client Transition Risk Snapshot</h3>
                  <p>Start with a brief framework to categorize your top clients by age, intent, and vulnerability — and identify where you face the greatest concentration and exit risk.</p>
                  <Link href="/introduction" className="cta-button outline magnetic">
                    Request a Client Risk Snapshot
                  </Link>
                </div>
              </div>

              <div className="cta-bottom-row">
                <div className="who-we-are-card" data-animate="slide-right">
                  <h3>Who we are</h3>
                  <p className="pbc-badge">California Public Benefit Corporation</p>
                  <p className="stewardship-desc">
                    We partner with law firms to convert closely held businesses into employee-owned companies, 
                    investing capital and expertise as a <strong>long-term owner, not a short-term flipper</strong>.
                  </p>
                  <div className="key-points">
                    <span className="key-point">Not a law firm</span>
                    <span className="key-point">Don&apos;t compete for legal work</span>
                    <span className="key-point accent">Your role is protected</span>
                  </div>
                </div>

                <div className="cta-closing" data-animate="slide-left">
                  <p>You&apos;ve spent a career earning your clients&apos; trust.</p>
                  <p className="cta-final">Let&apos;s make sure that when they finally decide how to exit, <strong>you are still the one they call first — and the one who helps write the next chapter.</strong></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

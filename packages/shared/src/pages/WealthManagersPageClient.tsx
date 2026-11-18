"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

const SECTION_1042_CONDITIONS = [
  "The company is a C corporation at the time of the sale",
  "The ESOP owns at least 30% of the company after the sale",
  "The seller has held the stock for at least three years",
  "The seller makes the §1042 election",
  "The seller reinvests the proceeds in qualified replacement property within the statutory replacement period",
];

const SCREEN_CRITERIA = [
  "Profitable, founder-led, with a consistent track record",
  "Annual revenue of $3M or more",
  "20 or more verifiable U.S. employees",
  "The owner holds a controlling stake (51% or more)",
  "The owner can allow about four months for the transition",
  "The owner is willing to be available to the company for a transition period of 4 to 12 months after closing — on call for agreed check-ins, introductions, and questions, not working hands-on",
];

export function WealthManagersPageClient() {
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

  const studyStat = useCountUp(96, 2000);

  const faqs = [
    {
      question: "What does an introduction earn me?",
      answer: "Nothing between firms. There are no referral fees or compensation arrangements for introductions. " + "We do not receive any money or anything else of value — monetary or non-monetary — from any of our professional partners. We do not pay referral fees or anything else of value for introductions, and we do not promise reciprocal referrals." + " What we offer is a clean handoff, a client who stays yours, and a partner who is kept informed at every phase."
    },
    {
      question: "Do you manage assets, or compete for my client?",
      answer: "No. Forhemit does not manage assets, and does not provide investment, legal, tax, or accounting advice: we do not compete for the relationship you built, and we do not solicit it. The wealth relationship continues through the transition and beyond it — with you."
    },
    {
      question: "What is Section 1042, in one paragraph?",
      answer: "Where Section 1042 applies, a qualifying sale into employee ownership can provide tax-deferred treatment for the seller's gain — deferral, not forgiveness, and never automatic. The deferral is not forgiveness: the deferred gain reduces the seller's basis in the qualified replacement property, and tax comes due when that property is sold. Eligibility itself stays where it belongs: with you and your client's tax and legal professionals. Forhemit coordinates; it does not give tax advice."
    },
    {
      question: "Which of my clients fit?",
      answer: "The standard we screen against is published on this page: profitable and founder-led, $3M or more in revenue, 20 or more verifiable U.S. employees, an owner holding 51% or more who can allow about four months and be available on call for 4 to 12 months after close. If a client of yours clears this standard, a first conversation costs nothing and commits no one. If they don't, we will tell you quickly — and tell you what would have to change."
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
              <span className="wealth-eyebrow" data-animate="fade-up">For wealth managers</span>
              <h1 className="wealth-title" data-animate="fade-up" data-delay="100">
                Raise succession before someone else sets the terms.
              </h1>
              <p className="wealth-lead" data-animate="fade-up" data-delay="200">
                Traditionally, your founder client talks to a broker, a private equity firm, or a
                buyer first — and calls you when the terms are already set. Raise succession
                first, and the structure, the timing, and the tax planning are still open when
                you sit down to plan them. This page is about that order: you bring the option
                while there is still time to plan it, with a firm that structures the transition
                and leaves the wealth relationship exactly where it belongs — with you.
              </p>
              <div className="wealth-hero-cta" data-animate="fade-up" data-delay="300">
                <Link
                  href="/contact?contactType=partner&interest=wealth"
                  className="cta-button magnetic"
                >
                  Start a Conversation
                </Link>
              </div>
            </div>
            
            {/* Floating study stat */}
            <div 
              className="floating-stat" 
              data-animate="fade-up" 
              data-delay="400"
              style={{ transform: `translateY(${scrollY * -0.05}px)` }}
            >
              <div className="stat-ring" ref={studyStat.ref}>
                <span className="stat-number">{studyStat.count}%</span>
                <span className="stat-label">of owners in a 2025 study were open to leaving their advisor after a sale</span>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="scroll-indicator" data-animate="fade-up" data-delay="500">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
            <span>Scroll to explore</span>
          </div>
        </section>

        {/* The catch-up problem */}
        <section className="wealth-section warning-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">The catch-up problem</span>
              <h2>Catching a train that&apos;s already leaving the station</h2>
              <p className="section-intro">
                When a founder decides to sell, the first calls usually go to a broker, a private
                equity firm, or a buyer. The wealth manager is brought in after — when the
                structure is chosen, the timeline is fixed, and the tax picture is whatever the
                deal left behind. You are asked to plan the largest wealth event of your
                client&apos;s life around decisions you had no part in.
              </p>
              <p className="section-intro">
                In one 2025 national study of 750 business owners, 96% said they were open to
                leaving their financial advisor after selling their business — and the most
                common reason was that the advisor never started the conversation about what came
                next. (Cornerstone Business Services, 2025 National Study on Selling Your
                Business.)
              </p>
            </div>

            <div className="warning-comparison" data-animate="fade-up">
              <div className="warning-path traditional">
                <div className="path-header">
                  <span className="path-icon">⚠</span>
                  <h3>The deal framed without you</h3>
                </div>
                <div className="path-flow">
                  <div className="flow-step">
                    <span className="step-label">First call</span>
                    <span className="step-value">Broker or buyer</span>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step loss">
                    <span className="step-label">Terms</span>
                    <span className="step-value">Already set</span>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step final">
                    <span className="step-label">Your role</span>
                    <span className="step-value">Plan around it</span>
                  </div>
                </div>
                <div className="path-consequence">
                  <span className="consequence-label">Plus:</span>
                  <span className="consequence-item">A buyer arrives with its own professionals</span>
                  <span className="consequence-item">The relationship can end at the moment it was about to matter most</span>
                </div>
              </div>

              <div className="warning-vs">
                <span className="vs-text">VS</span>
              </div>

              <div className="warning-path esop">
                <div className="path-header">
                  <span className="path-icon">✓</span>
                  <h3>Raise it first</h3>
                </div>
                <div className="path-flow">
                  <div className="flow-step">
                    <span className="step-label">First call</span>
                    <span className="step-value">You</span>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step gain">
                    <span className="step-label">Terms</span>
                    <span className="step-value">Still open</span>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step final">
                    <span className="step-label">Your role</span>
                    <span className="step-value">Plan it</span>
                  </div>
                </div>
                <div className="path-benefits">
                  <span className="benefit-label">Plus:</span>
                  <span className="benefit-item">§1042 timing coordinated with your reinvestment window</span>
                  <span className="benefit-item">The wealth relationship continues through the transition</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What changes */}
        <section className="wealth-section benefits-section section-alt">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">What changes</span>
              <h2>Making something happen</h2>
              <p className="section-intro">
                Advisors who raise the option early are the advisors still in the room when the
                proceeds need a plan.
              </p>
            </div>

            <div className="benefits-grid">
              <BenefitCard
                number="01"
                title="You bring the option first"
                description="Your client hears about employee ownership from the professional they already trust, while timing, structure, and tax planning are still open — not after a broker or a buyer has set them."
                icon="◆"
                delay={0}
              />
              <BenefitCard
                number="02"
                title="The founder sells to the people who already work there"
                description="A 100% employee-ownership transition at a full-price exit, at a price set by an independent appraiser who works for neither side, closing in about four months."
                icon="◇"
                delay={100}
              />
              <BenefitCard
                number="03"
                title="Your planning starts before the clock does"
                description="Where Section 1042 applies, we coordinate timing and documentation so your qualified replacement property strategy can be executed without a scramble at closing — and closing dates are set with your reinvestment window in mind."
                icon="▣"
                delay={200}
              />
            </div>

            {/* Section 1042 note */}
            <div className="calculator-section" data-animate="fade-up">
              <h3>A note on Section 1042</h3>
              <p>
                Where Section 1042 applies, a qualifying sale into employee ownership can provide
                tax-deferred treatment for the seller&apos;s gain — deferral, not
                forgiveness, and never automatic. The deferral is available only where the
                statutory conditions are met:
              </p>
              <ul className="role-list">
                {SECTION_1042_CONDITIONS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                The deferral is not forgiveness: the deferred gain reduces the seller&apos;s
                basis in the qualified replacement property, and tax comes due when that property
                is sold. §1042 rewards the advisor who is in the room early: the election,
                the holding period, and the reinvestment window are all set before the closing
                date is.
              </p>
            </div>
          </div>
        </section>

        {/* After the exit */}
        <section className="wealth-section roles-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">After the exit</span>
              <h2>One founder becomes a company of owners</h2>
              <p className="section-intro">
                A traditional sale ends your relationship twice over: the founder leaves, and the
                company passes to owners who bring their own professionals. An employee-ownership
                transition runs the other way.
              </p>
            </div>

            <div className="roles-visualization" data-animate="fade-up">
              <div className="role-card advisor">
                <div className="role-icon">◆</div>
                <h3>Your client</h3>
                <ul className="role-list">
                  <li>Available to the company for 4 to 12 months after close — on call, not working hands-on</li>
                  <li>After that, leaves on their own timing, not a buyer&apos;s</li>
                  <li>The proceeds of a full-price exit need the plan only you can build</li>
                  <li>The wealth relationship continues through the transition and beyond it</li>
                </ul>
              </div>

              <div className="partnership-connector">
                <div className="connector-line" />
                <div className="connector-center">
                  <span className="partnership-icon">✓</span>
                  <span className="partnership-label">After the exit</span>
                </div>
              </div>

              <div className="role-card forhemit">
                <div className="role-icon">◇</div>
                <h3>The company now</h3>
                <ul className="role-list">
                  <li>Belongs to its employees — 20 or more new owners</li>
                  <li>They hold ownership statements and retirement accounts</li>
                  <li>They face financial questions they have never had before</li>
                  <li>And you are the professional the founder already trusts inside it</li>
                </ul>
              </div>
            </div>

            <p className="section-intro" data-animate="fade-up">
              Whether any of them become your clients is their choice and yours, and nothing here
              promises it. But the room you are standing in is no longer one founder. It is the
              whole company. Forhemit does not manage assets, and does not provide investment,
              legal, tax, or accounting advice: we do not compete for the relationship you built,
              and we do not solicit it.
            </p>
          </div>
        </section>

        {/* The qualification standard */}
        <section className="wealth-section reluctant-section section-alt">
          <div className="container">
            <div className="reluctant-grid">
              <div className="reluctant-content" data-animate="slide-right">
                <span className="section-eyebrow">The qualification standard</span>
                <h2>The clients this fits</h2>
                <p className="reluctant-lead">
                  The standard we screen against on a first call, so you can judge a client
                  against it before you ever raise our name:
                </p>
                <ul className="role-list">
                  {SCREEN_CRITERIA.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>
                  If a client of yours clears this standard, a first conversation costs nothing
                  and commits no one. If they don&apos;t, we will tell you quickly — and
                  tell you what would have to change.
                </p>
              </div>

              <div className="reluctant-visual" data-animate="slide-left">
                <Image
                  src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDic78W35OPVhC3q4RatBL86y71kFW9UM2vGrz"
                  alt="A founder in conversation with an advisor"
                  width={2787}
                  height={1267}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How an introduction works */}
        <section className="wealth-section process-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">How an introduction works</span>
              <h2>How an introduction works</h2>
            </div>

            <div className="partnership-timeline">
              <PartnershipStep
                step={1}
                title="Start without a name"
                description="One call to align on the client's timeline and tax picture — no client name needed, and nothing about your client is required for that first conversation. You can describe a situation without giving us the client's name, and we will not contact or identify your client on the basis of that conversation."
                side="left"
              />
              <PartnershipStep
                step={2}
                title="A named introduction, when you are ready"
                description="A named introduction happens only when you and your client are ready, with you in the room if you want to be."
                side="right"
              />
              <PartnershipStep
                step={3}
                title="Kept informed at every phase"
                description="With your client's authorisation, we keep you informed at each phase gate — when the introduction lands, when the business is screened, when the structure is set, and when it closes — and closing dates are set with your reinvestment window in mind."
                side="left"
              />
            </div>

            <div className="section-header" data-animate="fade-up">
              <h3>No surprises on price.</h3>
              <p className="section-intro">
                Your client pays total transition fees that typically run 3 to 5% of the
                valuation, agreed in advance. The full breakdown is on our How It Works page.
              </p>
              <h3>Nothing between firms.</h3>
              <p className="section-intro">
                We do not receive any money or anything else of value — monetary or non-monetary — from any of our professional partners. We do not pay referral fees or anything else of value for introductions, and we do not promise reciprocal referrals.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="wealth-section faq-section section-alt">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">Questions</span>
              <h2>Common questions from wealth managers</h2>
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

        {/* Founder block */}
        <section className="wealth-section warning-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">Who you are trusting</span>
              <h2>The person you are trusting with your client</h2>
              <p className="section-intro">
                Stefano Stokes — Founder &amp; CEO. I&apos;m the person you speak with
                first, the person who leads your client&apos;s transition, and the person
                accountable for coordinating the work through closing and handover. Forhemit has
                one principal. You work directly with me, supported by independent specialists
                where the transaction requires them.
              </p>
              <p className="section-intro">
                Forhemit is a California Public Benefit Corporation, based in San Francisco and
                working with founder-led businesses nationally. Every transition is stress-tested
                during readiness, before the transaction is structured, under our Resilience
                Framework, and the founder sees the results in writing. After close, the company
                is monitored for 24 months under our 24-Month Early Warning System, on indicators
                agreed with the founder up front, and reported on a schedule agreed with the
                founder — so the client you send us is looked after after the signing, not
                just up to it.
              </p>
              <p className="section-intro">
                <strong>Forhemit was founded in 2026. We are new, and we say so.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="wealth-section cta-section" id="contact">
          <div className="container">
            <div className="cta-content" data-animate="fade-up">
              <span className="cta-eyebrow">The first step</span>
              <h2>Start with a conversation between professionals</h2>
              <p className="cta-subtitle">
                Use the contact page and say you are a wealth manager, not a founder. No client
                needs to be involved, and nothing about your client is needed, for the first call.
                You can also reach Stefano directly: contact@forhemit.com · (510) 768-7588.
              </p>
              
              <div className="cta-options">
                <div className="cta-option primary" data-animate="slide-right">
                  <h3>Talk to us first</h3>
                  <p>A direct conversation — no client involved, and nothing about your client needed.</p>
                  <Link
                    href="/contact?contactType=partner&interest=wealth"
                    className="cta-button magnetic"
                  >
                    Start a Conversation
                  </Link>
                </div>
              </div>

              <div className="cta-contact" data-animate="fade-up">
                <p>
                  For the other professionals in your client&apos;s corner:{" "}
                  <Link href="/legal-practices">Attorneys</Link> ·{" "}
                  <Link href="/brokers">Brokers</Link> ·{" "}
                  <Link href="/accounting-firms">CPAs</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

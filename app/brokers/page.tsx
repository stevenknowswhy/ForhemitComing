"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Footer } from "../components/layout/Footer";
import { LegalModal } from "../components/modals/LegalModal";
import "./brokers.css";

// Types
interface DossierCardProps {
  number: string;
  headline: string;
  title: string;
  copy: string;
  cta: string;
  delay?: number;
  icon: string;
}

interface RiskMetric {
  label: string;
  traditional: number;
  forhemit: number;
}

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

// Deal Radar Hero Component
function DealRadar() {
  const [rotation, setRotation] = useState(0);
  const [pulses, setPulses] = useState<number[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => (r + 0.5) % 360);
    }, 16);
    
    // Generate random blips
    const pulseInterval = setInterval(() => {
      setPulses(prev => {
        const newPulses = [...prev, Date.now()];
        return newPulses.slice(-5);
      });
    }, 2000);
    
    return () => {
      clearInterval(interval);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <div className="deal-radar">
      <div className="radar-grid">
        {/* Concentric circles */}
        <div className="radar-ring ring-1" />
        <div className="radar-ring ring-2" />
        <div className="radar-ring ring-3" />
        <div className="radar-ring ring-4" />
        
        {/* Crosshairs */}
        <div className="radar-crosshair horizontal" />
        <div className="radar-crosshair vertical" />
        
        {/* Sweep arm */}
        <div 
          className="radar-sweep"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        
        {/* Center target - Forhemit */}
        <div className="radar-center">
          <div className="center-pulse" />
          <div className="center-core">SAFE<br/>CLOSE</div>
        </div>
        
        {/* Deal blips */}
        {pulses.map((pulse, i) => (
          <DealBlip key={pulse} angle={(i * 72) + 45} delay={i * 200} />
        ))}
        
        {/* Zone labels */}
        <div className="radar-zone zone-risk">RISK ZONE</div>
        <div className="radar-zone zone-safe">SAFE HARBOR</div>
      </div>
    </div>
  );
}

// Animated deal blip
function DealBlip({ angle, delay }: { angle: number; delay: number }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    const hideTimer = setTimeout(() => setVisible(false), delay + 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [delay]);
  
  const radius = 35 + Math.random() * 25;
  const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
  const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
  
  return (
    <div 
      className={`deal-blip ${visible ? 'visible' : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="blip-ring" />
      <div className="blip-dot" />
    </div>
  );
}

// Dossier Card Component - Fan out effect
function DossierCard({ number, headline, title, copy, cta, delay = 0, icon }: DossierCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`dossier-card ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="dossier-tab">
        <span className="dossier-number">{number}</span>
        <span className="dossier-classification">CLASSIFIED</span>
      </div>
      
      <div className="dossier-content">
        <div className="dossier-stamp">APPROVED</div>
        <div className="dossier-icon">{icon}</div>
        <span className="dossier-headline">{headline}</span>
        <h3>{title}</h3>
        <p>{copy}</p>
        <button className="dossier-cta">
          <span className="cta-icon">↓</span>
          <span className="cta-text">{cta}</span>
        </button>
      </div>
      
      <div className="dossier-folds">
        <div className="fold fold-1" />
        <div className="fold fold-2" />
      </div>
      
      <div className={`dossier-highlight ${isHovered ? 'active' : ''}`} />
    </div>
  );
}

// 24-Hour Folder Component
function TwentyFourHourFolder() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && progress === 0) {
          // Animate folder opening
          setTimeout(() => setIsOpen(true), 500);
          // Animate progress
          let current = 0;
          const interval = setInterval(() => {
            current += 2;
            setProgress(Math.min(current, 100));
            if (current >= 100) clearInterval(interval);
          }, 40);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [progress]);

  const documents = [
    { name: "Financials.pdf", status: "VERIFIED", icon: "📊" },
    { name: "SOPs.pdf", status: "VERIFIED", icon: "📋" },
    { name: "Risk Assessment", status: "VERIFIED", icon: "⚡" },
    { name: "COOP Framework", status: "VERIFIED", icon: "🛡️" },
  ];

  return (
    <div ref={ref} className="folder-container">
      <div className={`folder ${isOpen ? 'open' : ''}`}>
        <div className="folder-front">
          <div className="folder-tab">
            <span className="folder-label">COOP</span>
          </div>
          <div className="folder-title">
            <span className="folder-icon">📁</span>
            <span>24-HOUR FOLDER</span>
          </div>
          <div className="folder-seal">MUNICIPAL GRADE</div>
        </div>
        
        <div className="folder-contents">
          {documents.map((doc, i) => (
            <div 
              key={doc.name}
              className="folder-document"
              style={{ transitionDelay: `${i * 150 + 300}ms` }}
            >
              <span className="doc-icon">{doc.icon}</span>
              <span className="doc-name">{doc.name}</span>
              <span className="doc-status">{doc.status}</span>
            </div>
          ))}
        </div>
        
        <div className="folder-back" />
      </div>
      
      <div className="folder-metrics">
        <div className="metric">
          <span className="metric-label">Readiness</span>
          <div className="metric-bar">
            <div className="metric-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="metric-value">{progress}%</span>
        </div>
        <div className="metric-badge">
          <span className="badge-icon">⚡</span>
          <span>Audit Ready</span>
        </div>
      </div>
    </div>
  );
}

// Risk Matrix Component
function RiskMatrix() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  const metrics: RiskMetric[] = [
    { label: "Reputation Risk", traditional: 85, forhemit: 15 },
    { label: "Deal Certainty", traditional: 60, forhemit: 95 },
    { label: "Employee Retention", traditional: 40, forhemit: 98 },
    { label: "Structural Integrity", traditional: 55, forhemit: 92 },
    { label: "AI Resilience", traditional: 30, forhemit: 88 },
  ];

  return (
    <div className="risk-matrix">
      <div className="matrix-header">
        <span className="matrix-label">Risk Assessment Matrix</span>
        <div className="matrix-legend">
          <div className="legend-item">
            <span className="legend-color traditional" />
            <span>Traditional PE</span>
          </div>
          <div className="legend-item">
            <span className="legend-color forhemit" />
            <span>Forhemit</span>
          </div>
        </div>
      </div>
      
      <div className="matrix-grid">
        {metrics.map((metric, i) => (
          <div 
            key={metric.label}
            className={`matrix-row ${hoveredRow === i ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredRow(i)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <span className="row-label">{metric.label}</span>
            <div className="row-bars">
              <div className="bar-container">
                <div 
                  className="bar traditional-bar"
                  style={{ width: `${metric.traditional}%` }}
                />
                <span className="bar-value">{metric.traditional}%</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar forhemit-bar"
                  style={{ width: `${metric.forhemit}%` }}
                />
                <span className="bar-value">{metric.forhemit}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Deal Flow Simulator
function DealFlowSimulator() {
  const [stage, setStage] = useState(0);
  const stages = [
    { name: "Introduction", icon: "🤝" },
    { name: "Diligence", icon: "🔍" },
    { name: "Structure", icon: "🏗️" },
    { name: "Close", icon: "✓" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(s => (s + 1) % stages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="deal-flow">
      <div className="flow-track">
        {stages.map((s, i) => (
          <div 
            key={s.name}
            className={`flow-stage ${i === stage ? 'active' : ''} ${i < stage ? 'complete' : ''}`}
          >
            <div className="stage-node">
              <span className="stage-icon">{s.icon}</span>
              {i === stage && <div className="stage-pulse" />}
            </div>
            <span className="stage-name">{s.name}</span>
          </div>
        ))}
      </div>
      <div className="flow-progress">
        <div 
          className="progress-fill"
          style={{ width: `${((stage + 1) / stages.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Signature Animation Component
function SignatureAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isAnimating) {
          setIsAnimating(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isAnimating]);

  return (
    <div ref={ref} className="signature-container">
      <div className="contract-paper">
        <div className="contract-lines">
          <div className="contract-line" />
          <div className="contract-line" />
          <div className="contract-line short" />
        </div>
        <div className="signature-block">
          <span className="signature-label">Authorized Signature</span>
          <svg 
            className={`signature-svg ${isAnimating ? 'animate' : ''}`}
            viewBox="0 0 200 60"
          >
            <path 
              className="signature-path"
              d="M10,45 Q30,20 50,35 T90,30 T130,35 T170,25 T190,30"
              fill="none"
              stroke="#FF6B00"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="contract-stamp">
          <span>APPROVED</span>
        </div>
      </div>
    </div>
  );
}

export default function BrokersPage() {
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const dossiers: Omit<DossierCardProps, 'delay'>[] = [
    {
      number: "01",
      headline: "The Anti-Vulture Buyer",
      title: "Protecting Your Referral Reputation",
      copy: "Selling a client's life work to traditional private equity can be a gamble for your reputation. As a Public Benefit Corporation, we are legally mandated to preserve the health of the businesses we acquire. We don't engage in asset-stripping or mass layoffs.",
      cta: "The Broker's Guide to PBC Stewardship",
      icon: "🛡️"
    },
    {
      number: "02",
      headline: "Municipal-Grade Diligence Speed",
      title: "Certainty of Execution: The 24-Hour Folder",
      copy: "We bring the rigor of municipal disaster preparedness to the M&A process. Our 'Continuity of Operations' (COOP) framework allows us to move through diligence with surgical precision. We don't stall deals with endless requests; we close with clarity.",
      cta: "The Forhemit Diligence & Closing Protocol",
      icon: "⚡"
    },
    {
      number: "03",
      headline: "Closing the Gap Between Price and Heart",
      title: "Solving the 'Reluctant Seller' Problem",
      copy: "Many high-quality deals stall because the founder is afraid of what happens to their 'family' of employees after the sale. We solve this emotional bottleneck by offering 100% employee ownership transitions. We turn 'Reluctant Sellers' into 'Legacy Stewards.'",
      cta: "Navigating the Emotional Exit: A Toolkit",
      icon: "💝"
    },
    {
      number: "04",
      headline: "Sophisticated SBA & ESOP Architectures",
      title: "Pre-Vetted Structural Alpha",
      copy: "Our deals are built on a foundation of structural tax arbitrage. By utilizing S-Corp ESOP structures, we eliminate federal corporate tax, significantly improving the company's DSCR. We are experts in SOP 50 10 8 regulatory compliance.",
      cta: "Technical Memo: SBA 50 10 8 & ESOP Compliance",
      icon: "🏗️"
    },
    {
      number: "05",
      headline: "Selling a Fortress, Not a Target",
      title: "Future-Proofing the Asset: The AI Shield",
      copy: "Buyers are increasingly wary of businesses vulnerable to AI disruption. We mitigate this risk by installing an 'AI Shield' through worker ownership. We ensure that AI is used to augment the workforce's productivity rather than replace it.",
      cta: "The AI Shield: Protecting LMM Assets",
      icon: "🤖"
    },
    {
      number: "06",
      headline: "Aligned with Your Client's Philosophy",
      title: "Respectable Returns, Rooted in Reality",
      copy: "We deliver respectable market returns that align with the business requirements and long-term goals of the partners we work with. By staying rooted and giving employees ownership, we capture the 'Stewardship Dividend'—superior performance driven by motivated owner-operators.",
      cta: "The Stewardship Dividend: ROI through Resilience",
      icon: "📈"
    }
  ];

  return (
    <div className="brokers-wrapper">
      {/* Blueprint Grid Background */}
      <div className="brokers-bg">
        <div className="blueprint-grid" style={{ transform: `translateY(${scrollY * 0.05}px)` }} />
        <div className="gradient-overlay" />
      </div>
      
      {/* Logo Header */}
      <header className="brokers-header">
        <Link href="/" className="brokers-logo">
          <span className="logo-text">Forhemit</span>
          <span className="logo-underline" />
        </Link>
      </header>

      <main className="brokers-main">
        {/* Hero Section with Deal Radar */}
        <section className="brokers-hero">
          <div className="hero-grid">
            <div className="hero-content" data-animate="fade-up">
              <div className="hero-eyebrow">
                <span className="eyebrow-pulse" />
                <span>For Business Brokers & M&A Advisors</span>
              </div>
              <h1 className="hero-title">
                The <span className="highlight">Safe Close</span>
              </h1>
              <p className="hero-subtitle">
                When you represent a founder whose primary concern is the survival of their 
                legacy and the protection of their people, we are the buyer that eliminates 
                the reputation risk of a traditional &quot;strip and flip&quot; exit.
              </p>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="stat-value">100%</span>
                  <span className="stat-label">Employee Ownership</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-value">24hr</span>
                  <span className="stat-label">Diligence Ready</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-value">PBC</span>
                  <span className="stat-label">Public Benefit Corp</span>
                </div>
              </div>
            </div>
            
            <div className="hero-visual" data-animate="fade-in">
              <DealRadar />
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="scroll-indicator" data-animate="fade-up">
            <div className="indicator-line" />
            <span>Access Dossiers</span>
          </div>
        </section>

        {/* Mission Briefing Section - Dossier Cards */}
        <section className="briefing-section" id="dossiers">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">Mission Briefing</span>
              <h2>The Reliable Partner for Legacy Transitions</h2>
              <p className="section-intro">
                Six classified advantages that make Forhemit the buyer your clients can trust.
              </p>
            </div>
            
            <div className="dossier-grid">
              {dossiers.map((dossier, i) => (
                <DossierCard key={dossier.number} {...dossier} delay={i * 100} />
              ))}
            </div>
          </div>
        </section>

        {/* 24-Hour Folder Section */}
        <section className="folder-section">
          <div className="container">
            <div className="folder-grid">
              <div className="folder-content" data-animate="slide-right">
                <span className="section-eyebrow">Certainty of Execution</span>
                <h2>The 24-Hour Investment Folder</h2>
                <p className="lead-text">
                  We bring the rigor of municipal disaster preparedness to the M&A process. 
                  Our &quot;Continuity of Operations&quot; (COOP) framework allows us to move through 
                  diligence with surgical precision.
                </p>
                <ul className="folder-features">
                  <li>
                    <span className="feature-icon">⚡</span>
                    <span>Financials ready for immediate audit</span>
                  </li>
                  <li>
                    <span className="feature-icon">📋</span>
                    <span>SOPs documented and accessible</span>
                  </li>
                  <li>
                    <span className="feature-icon">🛡️</span>
                    <span>Risk assessments pre-completed</span>
                  </li>
                  <li>
                    <span className="feature-icon">✓</span>
                    <span>No endless document requests</span>
                  </li>
                </ul>
              </div>
              
              <div className="folder-visual" data-animate="slide-left">
                <TwentyFourHourFolder />
              </div>
            </div>
          </div>
        </section>

        {/* Risk Matrix Section */}
        <section className="matrix-section">
          <div className="container">
            <div className="matrix-grid-layout">
              <div className="matrix-visual" data-animate="slide-right">
                <RiskMatrix />
              </div>
              
              <div className="matrix-content" data-animate="slide-left">
                <span className="section-eyebrow">Comparative Analysis</span>
                <h2>Risk Assessment Matrix</h2>
                <p className="lead-text">
                  Traditional private equity prioritizes short-term returns. We optimize for 
                  long-term resilience—protecting your referral reputation and your client's legacy.
                </p>
                <div className="matrix-insights">
                  <div className="insight">
                    <span className="insight-icon">🎯</span>
                    <span>Lower reputation risk through ethical stewardship</span>
                  </div>
                  <div className="insight">
                    <span className="insight-icon">🔒</span>
                    <span>Higher deal certainty with pre-vetted structures</span>
                  </div>
                  <div className="insight">
                    <span className="insight-icon">👥</span>
                    <span>Superior employee retention protects value</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deal Flow Section */}
        <section className="flow-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">Partnership Protocol</span>
              <h2>From Introduction to Close</h2>
              <p className="section-intro">
                A streamlined process designed for certainty and speed.
              </p>
            </div>
            
            <div className="flow-wrapper" data-animate="fade-up">
              <DealFlowSimulator />
            </div>
            
            <div className="flow-stages-detail" data-animate="fade-up">
              <div className="stage-detail">
                <span className="stage-num">01</span>
                <h4>Introduction</h4>
                <p>Confidential discussion about your client and their priorities</p>
              </div>
              <div className="stage-detail">
                <span className="stage-num">02</span>
                <h4>Diligence</h4>
                <p>Rapid assessment using our 24-Hour Folder methodology</p>
              </div>
              <div className="stage-detail">
                <span className="stage-num">03</span>
                <h4>Structure</h4>
                <p>Custom ESOP architecture with SBA compliance</p>
              </div>
              <div className="stage-detail">
                <span className="stage-num">04</span>
                <h4>Close</h4>
                <p>Clean execution with full legacy protection</p>
              </div>
            </div>
          </div>
        </section>

        {/* Safe Close Promise Section */}
        <section className="promise-section">
          <div className="container">
            <div className="promise-grid">
              <div className="promise-content" data-animate="slide-right">
                <span className="section-eyebrow">Our Commitment</span>
                <h2>The Safe Close Promise</h2>
                <p className="lead-text">
                  When you bring a deal to Forhemit, you are recommending a buyer that keeps 
                  the business in the community and keeps the founder's legacy intact.
                </p>
                <div className="promise-points">
                  <div className="promise-point">
                    <span className="point-check">✓</span>
                    <span>No asset-stripping</span>
                  </div>
                  <div className="promise-point">
                    <span className="point-check">✓</span>
                    <span>No mass layoffs</span>
                  </div>
                  <div className="promise-point">
                    <span className="point-check">✓</span>
                    <span>Community retention</span>
                  </div>
                  <div className="promise-point">
                    <span className="point-check">✓</span>
                    <span>Legacy preservation</span>
                  </div>
                </div>
              </div>
              
              <div className="promise-visual" data-animate="slide-left">
                <SignatureAnimation />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="brokers-cta" id="contact">
          <div className="container">
            <div className="cta-content" data-animate="fade-up">
              <span className="cta-eyebrow">Secure the Close</span>
              <h2>Protect Your Reputation.<br/>Preserve Their Legacy.</h2>
              <p className="cta-subtitle">
                Have a client who values their people as much as their purchase price? 
                Let&apos;s discuss how we can work together to deliver the Safe Close.
              </p>
              
              <div className="cta-actions">
                <Link href="/introduction?join=true" className="cta-button primary">
                  <span className="btn-icon">📋</span>
                  <span>Submit a Deal Confidentially</span>
                </Link>
                <Link href="/introduction" className="cta-button secondary">
                  <span className="btn-icon">📚</span>
                  <span>Download Broker Dossier Pack</span>
                </Link>
              </div>
              
              <div className="cta-contact">
                <span>Or reach us directly:</span>
                <a href="mailto:brokers@forhemit.com">brokers@forhemit.com</a>
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

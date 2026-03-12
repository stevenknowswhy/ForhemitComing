"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Footer } from "../components/layout/Footer";
import { Navigation } from "../components/layout/Navigation";
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

// Comparison Table Component
function ComparisonTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  const rows = [
    { label: "Broker Commission", traditional: "Standard Fee (Paid at Close)", forhemit: "Standard Fee (Paid at Close)" },
    { label: "Transaction Timeline", traditional: "12 – 24 Months (High uncertainty)", forhemit: "90 – 120 Days (Pre-underwritten)" },
    { label: "Purchase Price", traditional: "Subject to aggressive negotiation", forhemit: "100% of Independent Fair Market Value" },
    { label: "Capital Stack", traditional: "Buyer Cash + Bank Debt", forhemit: "SBA 7(a) Senior Debt (up to $5M) + Seller Note" },
    { label: "Tax Advantages", traditional: "Standard Capital Gains", forhemit: "Potential $0 Cap Gains (Sec. 1042 Rollover)" },
    { label: "Employee Outcome", traditional: "High risk of layoffs", forhemit: "100% Employee Ownership; Jobs preserved" },
  ];

  return (
    <div className="comparison-table">
      <div className="table-header">
        <div className="table-cell metric-label">Metric</div>
        <div className="table-cell traditional-header">Traditional External Buyer</div>
        <div className="table-cell forhemit-header">The Forhemit ESOP Exit</div>
      </div>
      {rows.map((row, i) => (
        <div 
          key={row.label}
          className={`table-row ${hoveredRow === i ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredRow(i)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <div className="table-cell metric-label">{row.label}</div>
          <div className="table-cell traditional-cell">{row.traditional}</div>
          <div className="table-cell forhemit-cell">{row.forhemit}</div>
        </div>
      ))}
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

// Data Ticker Component - Tactical feel
function DataTicker() {
  const [tick, setTick] = useState(0);
  
  const dataPoints = [
    { label: "STATUS", value: "ACTIVE", type: "good" },
    { label: "COOP READY", value: "100%", type: "good" },
    { label: "PBC CERT", value: "VERIFIED", type: "good" },
    { label: "ESOP STRUCT", value: "PRE-VETTED", type: "good" },
    { label: "SECURE COMMS", value: "ENCRYPTED", type: "good" },
    { label: "DILIGENCE", value: "24-HOUR", type: "good" },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => (t + 1) % 10);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="data-ticker">
      <div className="ticker-label">SYSTEM STATUS</div>
      <div className="ticker-items">
        {dataPoints.map((point, i) => (
          <div 
            key={point.label}
            className={`ticker-item ${tick === i ? 'active' : ''}`}
          >
            <span className="ticker-label-sm">{point.label}</span>
            <span className={`ticker-value ${point.type}`}>{point.value}</span>
          </div>
        ))}
      </div>
      <div className="ticker-time">
        {new Date().toISOString().split('T')[1].split('.')[0]} UTC
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
      headline: "Your Full Commission",
      title: "100% Standard Fee at Closing",
      copy: "You receive your standard, undiluted brokerage fee at closing, calculated on the total transaction value. We do not touch your commission. We exist to solve the single biggest bottleneck in your pipeline.",
      cta: "Commission Structure Details",
      icon: "💰"
    },
    {
      number: "02",
      headline: "Accelerated Timeline",
      title: "Close in 90–120 Days",
      copy: "Fully financed ESOP transactions close in 90–120 days. No more waiting 12-24 months for deals to die in due diligence. We turn 'maybe next year' into 'closing this quarter.'",
      cta: "Our Closing Timeline",
      icon: "⚡"
    },
    {
      number: "03",
      headline: "Maximum Leverage",
      title: "The Ultimate BATNA",
      copy: "We provide a fully-funded 'Plan B' that acts as your ultimate BATNA. When an external buyer tries to re-trade down 30%, your seller can activate the ESOP. If they walk, you still get paid.",
      cta: "Dual-Track Strategy Guide",
      icon: "🎯"
    },
    {
      number: "04",
      headline: "Guilt-Free Exits",
      title: "Preserve the Legacy",
      copy: "Your founder gets a clean exit, and their 20+ loyal employees get to own the company they helped build. No mass layoffs, no asset-stripping—just a clean transfer to the people who know the business best.",
      cta: "Employee Ownership Benefits",
      icon: "🛡️"
    },
    {
      number: "05",
      headline: "Disaster-Proof Transition",
      title: "Municipal-Grade COOP",
      copy: "Before closing, we build a 90-Day Transition Blueprint. We map tribal knowledge, secure leadership succession from the 20+ employee pool, and implement financial safeguards. Your reputation stays pristine.",
      cta: "Our COOP Framework",
      icon: "🏗️"
    },
    {
      number: "06",
      headline: "Tax Arbitrage Advantage",
      title: "Section 1042 Rollover",
      copy: "By utilizing S-Corp ESOP structures, we eliminate federal corporate tax and offer sellers potential $0 capital gains via Section 1042. This significantly improves deal economics for your clients.",
      cta: "Tax Strategy Memo",
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
        <Navigation variant="dark" />
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
                Stop Losing Commissions in the <span className="highlight">$3M–$15M &quot;Dead Zone&quot;</span>
              </h1>
              <p className="hero-subtitle">
                We provide a fully financed, 90-day ESOP exit for your stalled 20+ employee listings. 
                You keep 100% of your commission.
              </p>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="stat-value">100%</span>
                  <span className="stat-label">Commission Kept</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-value">90-120</span>
                  <span className="stat-label">Days to Close</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-value">20+</span>
                  <span className="stat-label">Employee Threshold</span>
                </div>
              </div>
            </div>
            
            <div className="hero-visual" data-animate="fade-in">
              <DealRadar />
            </div>
          </div>
          
          {/* Data Ticker */}
          <DataTicker />
          
          {/* Scroll indicator */}
          <div className="scroll-indicator" data-animate="fade-up">
            <div className="indicator-line" />
            <span>The Bottom Line</span>
          </div>
        </section>

        {/* The Bottom Line Section */}
        <section className="briefing-section" id="dossiers">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">The Bottom Line</span>
              <h2>What&apos;s In It For You</h2>
              <p className="section-intro">
                Let&apos;s be direct: We do not compete with you. We complement you. We exist to solve 
                the single biggest bottleneck in your pipeline—the great business that sits on the 
                market for 18 months because of the middle-market capital gap.
              </p>
            </div>
            
            <div className="dossier-grid">
              {dossiers.map((dossier, i) => (
                <DossierCard key={dossier.number} {...dossier} delay={i * 100} />
              ))}
            </div>
          </div>
        </section>

        {/* The Broker's Dilemma Section */}
        <section className="folder-section">
          <div className="container">
            <div className="folder-grid">
              <div className="folder-content" data-animate="slide-right">
                <span className="section-eyebrow">The Broker&apos;s Dilemma</span>
                <h2>The &quot;Dead Zone&quot;</h2>
                <p className="lead-text">
                  You know this segment better than anyone. A solid business with $750K–$3M in EBITDA, 
                  20 to 75 employees, and a founder ready to retire. It should sell easily, but it is 
                  trapped in the middle-market gap.
                </p>
                <ul className="folder-features">
                  <li>
                    <span className="feature-icon">⚠️</span>
                    <span><strong>Too Big for Main Street:</strong> Individual buyers lack the $1M–$3M down payment required. They hit the collateral wall and fade away after wasting 90 days of your time.</span>
                  </li>
                  <li>
                    <span className="feature-icon">🏢</span>
                    <span><strong>Too Small for Wall Street:</strong> Private Equity firms won&apos;t deploy capital for sub-$3M EBITDA deals. If they do, their &quot;synergy&quot; strategy usually involves terminating half of your seller&apos;s loyal staff.</span>
                  </li>
                  <li>
                    <span className="feature-icon">💸</span>
                    <span><strong>The Result:</strong> The listing sits. The founder gets frustrated and distracted. The buyer pool evaporates. You earn zero commission on a great business.</span>
                  </li>
                </ul>
              </div>
              
              <div className="folder-visual" data-animate="slide-left">
                <TwentyFourHourFolder />
              </div>
            </div>
          </div>
        </section>

        {/* The Solution: Dual-Track Strategy */}
        <section className="matrix-section">
          <div className="container">
            <div className="matrix-grid-layout">
              <div className="matrix-visual" data-animate="slide-right">
                <ComparisonTable />
              </div>
              
              <div className="matrix-content" data-animate="slide-left">
                <span className="section-eyebrow">The Solution</span>
                <h2>The Dual-Track Strategy</h2>
                <p className="lead-text">
                  We are not asking you to abandon the traditional M&A process; we are giving you 
                  a parallel track that turns &quot;maybe next year&quot; into &quot;closing this quarter.&quot;
                </p>
                <div className="matrix-insights">
                  <div className="insight">
                    <span className="insight-icon">🅰️</span>
                    <span><strong>Track A (Traditional Search):</strong> You continue to market to strategic buyers and PE firms. You hunt for the unicorn buyer who will pay a premium.</span>
                  </div>
                  <div className="insight">
                    <span className="insight-icon">🅱️</span>
                    <span><strong>Track B (The Forhemit ESOP):</strong> We simultaneously structure a 100% employee buyout backed by SBA financing. The company&apos;s existing 20+ employees become the buyers.</span>
                  </div>
                  <div className="insight">
                    <span className="insight-icon">⚡</span>
                    <span><strong>The Leverage Effect:</strong> When an external buyer tries to re-trade the seller down 30%, your seller can say, &quot;I have a fully financed ESOP on the table. Meet the number, or we activate Track B.&quot;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Math & Mechanics Section */}
        <section className="flow-section">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <span className="section-eyebrow">The Math & Mechanics</span>
              <h2>How It Works</h2>
              <p className="section-intro">
                We have industrialized the ESOP process for businesses with 20+ employees. Why 20? 
                Because that is the critical mass where a viable internal management layer exists, 
                making the business highly attractive for SBA lending.
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
                <p>Rapid 24-hour assessment using our COOP methodology</p>
              </div>
              <div className="stage-detail">
                <span className="stage-num">03</span>
                <h4>Structure</h4>
                <p>Custom ESOP architecture with SBA 7(a) compliance</p>
              </div>
              <div className="stage-detail">
                <span className="stage-num">04</span>
                <h4>Close</h4>
                <p>Clean execution in 90-120 days with full legacy protection</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Forhemit Difference Section */}
        <section className="promise-section">
          <div className="container">
            <div className="promise-grid">
              <div className="promise-content" data-animate="slide-right">
                <span className="section-eyebrow">The Forhemit Difference</span>
                <h2>Disaster-Proof Transitions</h2>
                <p className="lead-text">
                  Most ESOP advisors hand you a valuation report and wish you luck. We engineer 
                  operational continuity. Before founding Forhemit, our leadership spent a decade 
                  managing Continuity of Operations (COOP) for the City and County of San Francisco, 
                  ensuring critical infrastructure survived earthquakes, cyberattacks, and leadership vacuums.
                </p>
                <div className="promise-points">
                  <div className="promise-point">
                    <span className="point-check">✓</span>
                    <span><strong>System Documentation:</strong> We map &quot;tribal knowledge&quot; and formalize operational systems</span>
                  </div>
                  <div className="promise-point">
                    <span className="point-check">✓</span>
                    <span><strong>Leadership Succession:</strong> We identify, contractually secure, and cross-train 2–3 key internal managers</span>
                  </div>
                  <div className="promise-point">
                    <span className="point-check">✓</span>
                    <span><strong>Financial Safeguards:</strong> We implement early-warning systems to guarantee DSCR remains above 1.25x</span>
                  </div>
                  <div className="promise-point">
                    <span className="point-check">✓</span>
                    <span><strong>Long-Term Stewardship:</strong> We stay engaged for up to 10 years post-close to monitor the business</span>
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
              <span className="cta-eyebrow">Next Steps</span>
              <h2>Clearing Your Pipeline</h2>
              <p className="cta-subtitle">
                Your time is your inventory. Every month spent on a dead deal is a month you can&apos;t 
                spend closing new ones. Scan your CRM right now. Do you have a listing with $750K–$3M 
                EBITDA, 20 to 75 employees, and strong recurring cash flow that has been stalled for 
                more than 6 months?
              </p>
              <p className="cta-lead">
                Let&apos;s schedule a brief call. I will provide a complimentary ESOP feasibility screen 
                for your stalled listing. We don&apos;t need a commitment today; we just need a conversation 
                about how to turn your unsellable inventory into closed commissions.
              </p>
              
              <div className="cta-actions">
                <Link href="/introduction?join=true" className="cta-button primary">
                  <span className="btn-icon">📅</span>
                  <span>Schedule a 15-Minute Pipeline Review</span>
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

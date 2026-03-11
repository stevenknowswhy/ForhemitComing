"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "../components/layout/Footer";
import "./about-page.css";

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="about-wrapper">
      <div className="about-background"></div>
      
      {/* Logo Header */}
      <header className="about-logo-header">
        <Link href="/" className="about-logo-link">
          <span className="about-logo-text">Forhemit</span>
          <span className="about-logo-underline"></span>
        </Link>
      </header>
      
      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <span className="about-eyebrow">Our Story</span>
            <h1 className="about-title">Your Legacy Deserves Better</h1>
            <p className="about-subtitle">
              The real risk isn't choosing the wrong option. It's assuming you have one.
            </p>
          </div>
        </section>

        {/* Combined Problem/Solution Section - Two Column 100vh */}
        <section className="about-section-problem-solution">
          <div className="container">
            <div className="problem-solution-grid">
              {/* Left Column - The Problem */}
              <div className="problem-solution-column problem-column">
                <div className="problem-section-header">
                  <span className="about-eyebrow">The Reality</span>
                  <h2>The Coming Disaster</h2>
                </div>
                <div className="about-stat problem-stat">
                  <span className="stat-number">70-80%</span>
                  <span className="stat-label">of businesses never sell</span>
                </div>
                <div className="problem-points-row">
                  <div className="problem-point">
                    <span className="point-number">01</span>
                    <div className="problem-visual ratio-visual">
                      <span className="ratio-number">50</span>
                      <span className="ratio-divider">:</span>
                      <span className="ratio-number highlight">1</span>
                    </div>
                    <p>For every 50 businesses for sale, there is roughly <strong>one qualified buyer</strong>.</p>
                  </div>
                  <div className="problem-point">
                    <span className="point-number">02</span>
                    <div className="problem-visual crowd-visual">
                      <svg viewBox="0 0 140 70" className="crowd-icon">
                        {/* Row 1 - Back row (smaller, lighter) */}
                        <circle cx="10" cy="20" r="8" fill="currentColor" opacity="0.4"/>
                        <circle cx="30" cy="18" r="8" fill="currentColor" opacity="0.4"/>
                        <circle cx="50" cy="16" r="8" fill="currentColor" opacity="0.4"/>
                        <circle cx="70" cy="15" r="8" fill="currentColor" opacity="0.4"/>
                        <circle cx="90" cy="16" r="8" fill="currentColor" opacity="0.4"/>
                        <circle cx="110" cy="18" r="8" fill="currentColor" opacity="0.4"/>
                        <circle cx="130" cy="20" r="8" fill="currentColor" opacity="0.4"/>
                        {/* Row 2 - Middle row */}
                        <circle cx="20" cy="35" r="9" fill="currentColor" opacity="0.6"/>
                        <circle cx="40" cy="33" r="9" fill="currentColor" opacity="0.6"/>
                        <circle cx="60" cy="32" r="9" fill="currentColor" opacity="0.6"/>
                        <circle cx="80" cy="32" r="9" fill="currentColor" opacity="0.6"/>
                        <circle cx="100" cy="33" r="9" fill="currentColor" opacity="0.6"/>
                        <circle cx="120" cy="35" r="9" fill="currentColor" opacity="0.6"/>
                        {/* Row 3 - Front row (larger, darker) */}
                        <circle cx="15" cy="52" r="10" fill="currentColor" opacity="0.8"/>
                        <circle cx="35" cy="50" r="10" fill="currentColor" opacity="0.8"/>
                        <circle cx="55" cy="49" r="10" fill="currentColor" opacity="0.8"/>
                        <circle cx="75" cy="48" r="10" fill="currentColor" opacity="0.8"/>
                        <circle cx="95" cy="49" r="10" fill="currentColor" opacity="0.8"/>
                        <circle cx="115" cy="50" r="10" fill="currentColor" opacity="0.8"/>
                        <circle cx="135" cy="52" r="10" fill="currentColor" opacity="0.8"/>
                        {/* Arrow pointing down */}
                        <path d="M70 8 L70 2 M70 8 L65 3 M70 8 L75 3" stroke="var(--about-accent)" strokeWidth="2" fill="none" opacity="0.9"/>
                      </svg>
                    </div>
                    <p>Millions of Baby Boomers retiring will make that ratio <strong>much worse</strong>.</p>
                  </div>
                  <div className="problem-point">
                    <span className="point-number">03</span>
                    <div className="problem-visual">
                      <div className="closed-sign">
                        <div className="closed-chain left"></div>
                        <div className="closed-chain right"></div>
                        <div className="closed-plate">
                          <span className="closed-text">CLOSED</span>
                        </div>
                      </div>
                    </div>
                    <p>No buyer means your employees lose jobs and your legacy ends with a &quot;Closed&quot; sign.</p>
                  </div>
                </div>
              </div>
              
              {/* Right Column - The Solution */}
              <div className="problem-solution-column solution-column">
                <div className="solution-header">
                  <span className="about-eyebrow">The Alternative</span>
                  <h2>A Better Option</h2>
                </div>
                <div className="about-highlight">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD9Ng4TJ32pSgTBVY98K3GtlLfwieHEIvuUMxF" 
                    alt="Employee ownership collaboration" 
                    className="highlight-image"
                  />
                  <span className="highlight-text">100% Employee Owned</span>
                </div>
                <div className="solution-content">
                  <p>
                    But there is a better option. A buyer who already knows your business, 
                    your customers, and your culture. Because you hired them.
                  </p>
                  <p>
                    We help you transition your company to 100% employee ownership. You get 
                    the payout you&apos;ve earned. They get the future they deserve.
                  </p>
                  <p>
                    And the company you spent your life building doesn&apos;t end with a &quot;Closed&quot; 
                    sign. It begins your legacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="about-section about-section-mission">
          <div className="container">
            <div className="mission-grid">
              <div className="mission-content">
                <span className="about-eyebrow">The Founder</span>
                <h2>Our Mission is Our Mandate</h2>
                <p className="lead">
                  Stefano&apos;s background isn&apos;t in traditional investment banking—it&apos;s in 
                  disaster planning and mitigation. In that field, you don&apos;t wait for the 
                  catastrophe to happen; you see the convergence of threats on the horizon 
                  and build a strategy to stop the damage before it starts.
                </p>
                <p>
                  Looking at the current landscape, that convergence is here. We are facing 
                  a three-pronged disaster that threatens to cripple the market:
                </p>
                <div className="crisis-list">
                  <div className="crisis-item">
                    <strong>The Retirement Cliff:</strong> There are simply not enough qualified 
                    buyers to meet the demand of retiring owners. Even if a seller finds a buyer, 
                    the market saturation is driving valuations down, threatening the payout 
                    owners deserve.
                  </div>
                  <div className="crisis-item">
                    <strong>The Workforce Crisis:</strong> Employees are facing a dual threat of 
                    displacement. They fear losing their jobs either to a new, unknown owner 
                    or to the rising tide of AI and automation.
                  </div>
                  <div className="crisis-item">
                    <strong>Community Collapse:</strong> When businesses close rather than 
                    transition, the community loses its tax base, its history, and its 
                    economic heart.
                  </div>
                </div>
                <p className="mission-closing">
                  Forhemit was created to mitigate that disaster.
                </p>
              </div>
              <div className="mission-image-wrapper">
                <img 
                  src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDMAmOxFsP54wZ3MdlKIGHYbcXi6ROrhpmgC1x" 
                  alt="Stefano - Founder of Forhemit" 
                  className="mission-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Three Crises Section */}
        <section className="about-section about-section-dark">
          <div className="container">
            <h2 className="section-title">The Three-Pronged Crisis</h2>
            <div className="crisis-grid">
              <div className="crisis-card">
                <h3>The Retirement Cliff</h3>
                <p>
                  A &quot;Silver Tsunami&quot; is hitting the market. With up to 100 sellers for every 
                  one qualified buyer, the traditional market is saturated. For most owners, 
                  this math means their payout—and their retirement—is at risk.
                </p>
              </div>
              <div className="crisis-card">
                <h3>The Workforce Crisis</h3>
                <p>
                  Your employees are facing a dual threat of displacement. They fear losing 
                  their livelihoods to a heartless new owner, the rapid rise of AI, or the 
                  &quot;Closed&quot; sign that appears when a business fails to find a buyer.
                </p>
              </div>
              <div className="crisis-card">
                <h3>The Community Collapse</h3>
                <p>
                  When a local business vanishes, it isn&apos;t just a transaction that ends. 
                  The city loses its tax base, its history, and its economic heart.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Stop the Disasters Section */}
        <section className="about-section about-section-solutions">
          <div className="container">
            <div className="solutions-header">
              <span className="about-eyebrow">The Solution</span>
              <h2>One Solution. Three Problems Solved.</h2>
              <p className="solutions-intro">
                The &quot;Silver Tsunami&quot; of retiring owners, the displacement of workers by AI, 
                and the erosion of local tax bases are often treated as separate crises. They aren&apos;t. 
                They are three dimensions of the same disaster. Employee ownership is the single 
                mechanism that addresses all three simultaneously.
              </p>
            </div>
            <div className="solutions-list">
              <div className="solution-item">
                <h3><span className="solution-num">1.</span> Your Exit Plan — <em>Solved</em></h3>
                <div className="solution-content">
                  <p className="problem-text">
                    <strong>The Problem:</strong> The market is saturated. With roughly 50 sellers for every 
                    one qualified buyer, most owners face a grim choice: sell at a steep discount, wait 
                    years for a deal that never comes, or simply close the doors.
                  </p>
                  <p className="mitigation-text">
                    <strong>The Mitigation:</strong> Employee ownership eliminates the search. Your buyers 
                    are already in the building—trained, invested, and ready. You don&apos;t have to compete 
                    for a shrinking pool of outside investors or endure months of soul-crushing due diligence. 
                    We structure a professional, fair-market transaction that delivers the payout you&apos;ve 
                    earned on a timeline you control.
                  </p>
                </div>
              </div>
              <div className="solution-item">
                <h3><span className="solution-num">2.</span> Your Employees&apos; Fears — <em>Solved</em></h3>
                <div className="solution-content">
                  <p className="problem-text">
                    <strong>The Problem:</strong> Employees are caught between two fires: heartless outside 
                    acquirers who cut staff to &quot;optimize&quot; returns, and the rising tide of AI automation. 
                    In both scenarios, the people who built your company are treated as line items to be erased.
                  </p>
                  <p className="mitigation-text">
                    <strong>The Mitigation:</strong> We flip the equation. Instead of being victims of a 
                    transition, your employees become the buyers. Their jobs aren&apos;t just preserved; they 
                    are transformed into equity. When the workforce owns the company, AI isn&apos;t a threat 
                    from above—it&apos;s a tool they collectively control. The fear of being replaced is replaced 
                    by the agency of ownership.
                  </p>
                </div>
              </div>
              <div className="solution-item">
                <h3><span className="solution-num">3.</span> Business Vanishing — <em>Solved</em></h3>
                <div className="solution-content">
                  <p className="problem-text">
                    <strong>The Problem:</strong> When a local pillar closes or is relocated by a distant 
                    corporate office, the community loses more than a company. It loses its tax base, its 
                    history, and its economic heart. One closure creates a ripple effect that touches every 
                    neighboring family and business.
                  </p>
                  <p className="mitigation-text">
                    <strong>The Mitigation:</strong> Employee-owned businesses stay put. They are owned by 
                    the people who live in the neighborhood, whose kids go to local schools, and who spend 
                    their earnings at the coffee shop next door. The tax base remains, the jobs remain, and 
                    the identity of the community stays intact. Employee ownership doesn&apos;t just keep a 
                    company in town—it roots it there permanently.
                  </p>
                </div>
              </div>
            </div>
            <div className="solutions-result">
              <p className="result-text">
                <strong>The Result:</strong> One mechanism. Three crises resolved. You get your payout. 
                Your employees get ownership. Your community keeps its foundation.
              </p>
              <p className="result-closing">
                This is the resilience Forhemit was built to deliver.
              </p>
            </div>
          </div>
        </section>

        {/* PBC Section */}
        <section className="about-section">
          <div className="container">
            <div className="about-content-centered">
              <span className="about-eyebrow">Public Benefit Corporation</span>
              <h2>Beyond Profit</h2>
              <p className="lead">
                Forhemit was born to mitigate these disasters. We aren&apos;t here to &quot;flip&quot; 
                a company; we are here to preserve a legacy.
              </p>
              <p>
                Because we believe this mission is too important to be left to chance, 
                Forhemit is a Public Benefit Corporation. Our commitment to serving owners, 
                protecting employees, and strengthening communities isn&apos;t a page on our 
                website—it is written into our corporate bylaws.
              </p>
              <p>
                We exist to ensure that the story you spent decades writing doesn&apos;t end 
                in a disaster. It ends with a transition to the people who helped you build it.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="about-section about-section-faq">
          <div className="container">
            <div className="faq-header">
              <span className="about-eyebrow">Common Questions</span>
              <h2>Understanding the Forhemit Model</h2>
              <p className="faq-intro">
                The transition to employee ownership is a significant decision. Here are answers 
                to the questions owners ask most.
              </p>
            </div>

            <div className="faq-container">
              {/* Section 1: The Vision & The Model */}
              <div className="faq-section">
                <h3 className="faq-section-title">
                  <span className="section-num">01</span>
                  The Vision & The Model
                  <span className="section-subtitle">Defining the &quot;Anti-Private Equity&quot; Approach</span>
                </h3>
                
                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'pe-buyout' ? 'active' : ''}`}
                    onClick={() => toggleFaq('pe-buyout')}
                  >
                    <span>How is this different from a traditional Private Equity (PE) buyout?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'pe-buyout' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p className="answer-intro"><strong>The Structural Difference:</strong></p>
                      <p>Private equity firms typically operate with fund lifecycles of approximately 10 years and target hold periods averaging 5-6 years (up from the historical 3-5 year standard). This creates structural incentives to prioritize exit timing and returns to limited partners.</p>
                      
                      <div className="comparison-table">
                        <div className="table-row table-header">
                          <span>Aspect</span>
                          <span>Traditional PE</span>
                          <span>Our Stewardship Model</span>
                        </div>
                        <div className="table-row">
                          <span>Hold Period</span>
                          <span>5-6 years (target)</span>
                          <span>No predetermined timeline</span>
                        </div>
                        <div className="table-row">
                          <span>Fund Structure</span>
                          <span>10-year fund life</span>
                          <span>Permanent capital</span>
                        </div>
                        <div className="table-row">
                          <span>Exit Pressure</span>
                          <span>High - must return capital to LPs</span>
                          <span>None - timing based on readiness</span>
                        </div>
                        <div className="table-row">
                          <span>Value Creation</span>
                          <span>Focus on exit multiples</span>
                          <span>Focus on sustainable cash flow</span>
                        </div>
                        <div className="table-row">
                          <span>Employee Impact</span>
                          <span>Variable - depends on strategy</span>
                          <span>Core mission - broad-based ownership</span>
                        </div>
                      </div>
                      
                      <p className="answer-summary">We operate on a &quot;Continuity&quot; model. We reinvest in the foundation, keep the existing team intact, and transition the company to a 100% Employee Stock Ownership Plan (ESOP). Our goal is multi-generational endurance, not a quick exit.</p>
                      <p className="answer-source">Sources: Private Equity Info 2025; Bain & Company 2025; Preqin 2023</p>
                    </div>
                  </div>
                </div>

                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'stewardship' ? 'active' : ''}`}
                    onClick={() => toggleFaq('stewardship')}
                  >
                    <span>What does &quot;Stewardship Management&quot; actually mean in practice?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'stewardship' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>It means we don&apos;t view your company as a &quot;deal&quot; to be flipped, but as an institution to be preserved. While traditional firms install new management and cut costs for short-term gains, our role is to act as a specialized holding entity that &quot;hardens&quot; your existing success.</p>
                      
                      <div className="two-column-list">
                        <div className="column">
                          <h4>What We Provide:</h4>
                          <ul>
                            <li>Structural systems for long-term operational resilience</li>
                            <li>Succession frameworks that develop internal leadership</li>
                            <li>Governance oversight that maintains accountability</li>
                            <li>Regulatory compliance management for ESOP requirements</li>
                            <li>Ownership culture development that engages employees</li>
                          </ul>
                        </div>
                        <div className="column">
                          <h4>What We Don&apos;t Do:</h4>
                          <ul>
                            <li>Replace your management team</li>
                            <li>Interfere in day-to-day operations</li>
                            <li>Impose arbitrary cost-cutting targets</li>
                            <li>Set artificial exit timelines</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'pbc-needed' ? 'active' : ''}`}
                    onClick={() => toggleFaq('pbc-needed')}
                  >
                    <span>Why do I need a Stewardship PBC? Can&apos;t I just set up an ESOP on my own?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'pbc-needed' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>While any owner can technically start an ESOP, the process involves significant complexity that benefits from specialized expertise:</p>
                      
                      <h4>Regulatory Complexity:</h4>
                      <ul>
                        <li>ERISA compliance requirements</li>
                        <li>IRS qualification standards</li>
                        <li>Annual valuation requirements</li>
                        <li>Form 5500 reporting obligations</li>
                        <li>Department of Labor oversight</li>
                      </ul>
                      
                      <h4>Ongoing Administration:</h4>
                      <ul>
                        <li>Repurchase obligation management</li>
                        <li>Participant communication and education</li>
                        <li>Trustee oversight and fiduciary responsibilities</li>
                        <li>Distribution processing and compliance</li>
                      </ul>
                      
                      <h4>The PBC Difference:</h4>
                      <p>As a Public Benefit Corporation, we are legally required to balance financial returns with our stated public benefit mission. Our charter commits us to employee well-being and community impact—not just profit maximization. This creates structural alignment with your goals for your people and your legacy.</p>
                      
                      <h4>The Data Supports ESOP Success:</h4>
                      <ul className="stats-list">
                        <li>ESOP companies are <strong>50% less likely to fail</strong> than comparable non-ESOP companies</li>
                        <li>ESOP participants have <strong>2x the retirement savings</strong> of non-ESOP employees</li>
                        <li>ESOP companies experience <strong>2.3% faster sales growth</strong> than peers</li>
                        <li>Employee-owners are <strong>40-50% less likely</strong> to look for new jobs</li>
                      </ul>
                      <p className="answer-source">Sources: NCEO 2014; Rutgers/Blasi & Kruse Studies; NCEO 2021 Retirement Savings Study</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Financials & Risk Mitigation */}
              <div className="faq-section">
                <h3 className="faq-section-title">
                  <span className="section-num">02</span>
                  Financials & Risk Mitigation
                  <span className="section-subtitle">Removing the &quot;deal-killers&quot; and explaining the math</span>
                </h3>
                
                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'employees-buy' ? 'active' : ''}`}
                    onClick={() => toggleFaq('employees-buy')}
                  >
                    <span>My employees don&apos;t have millions of dollars; how can they &quot;buy&quot; the company?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'employees-buy' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>Employees do not use their personal savings. Instead, ESOP transactions are structured so that employees earn equity through continued service, not direct purchase.</p>
                      
                      <h4>How It Works:</h4>
                      <ol>
                        <li><strong>Leveraged ESOP Structure:</strong> The company borrows funds from lenders to acquire shares on behalf of employees</li>
                        <li><strong>Tax-Deductible Repayment:</strong> The company repays the loan using tax-deductible contributions to the ESOP trust</li>
                        <li><strong>Employee Allocation:</strong> Shares are allocated to employee accounts based on compensation or years of service</li>
                        <li><strong>Vesting:</strong> Employees earn full ownership rights over time through vesting schedules</li>
                      </ol>
                      
                      <p><strong>The Result:</strong> Employees become owners without contributing personal capital. The company&apos;s cash flow services the debt, and tax benefits often offset much of the cost.</p>
                      
                      <p className="highlight-box"><strong>Key Advantage:</strong> In a 100% ESOP-owned S-corporation, the company pays no federal income tax at the corporate level, preserving significantly more cash flow for debt service, reinvestment, and growth.</p>
                      <p className="answer-source">Sources: IRS; Berman Skinner 2026; NCEO</p>
                    </div>
                  </div>
                </div>

                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'personal-guarantee' ? 'active' : ''}`}
                    onClick={() => toggleFaq('personal-guarantee')}
                  >
                    <span>Will I or my employees have to sign a personal guarantee for the debt?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'personal-guarantee' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>ESOP transactions typically avoid personal guarantees for sellers and employees because the loan is made to the company, not to individuals.</p>
                      
                      <div className="two-column-list">
                        <div className="column">
                          <h4>Traditional Business Sale:</h4>
                          <ul>
                            <li>Seller financing often requires personal guarantees</li>
                            <li>SBA loans mandate personal guarantees from 20%+ owners</li>
                            <li>Buyers typically must pledge personal assets</li>
                          </ul>
                        </div>
                        <div className="column">
                          <h4>ESOP Structure:</h4>
                          <ul>
                            <li>Loan is made to the corporation</li>
                            <li>Repayment comes from company cash flow</li>
                            <li>Tax-deductible contributions fund repayment</li>
                            <li>No personal assets at risk for sellers or employees</li>
                          </ul>
                        </div>
                      </div>
                      
                      <p className="note"><strong>Important Note:</strong> Specific guarantee requirements depend on the financing structure, lender policies, and company financial strength. While ESOP structures typically avoid personal guarantees, we evaluate each transaction individually.</p>
                      <p className="answer-source">Sources: NCEO ESOP Financing Guidelines; SBA Loan Requirements</p>
                    </div>
                  </div>
                </div>

                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'competitive-price' ? 'active' : ''}`}
                    onClick={() => toggleFaq('competitive-price')}
                  >
                    <span>Can you really offer a competitive purchase price compared to a PE firm?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'competitive-price' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>Yes. A 100% ESOP-owned S-corporation pays no federal income tax at the corporate level, allowing the company to retain significantly more cash flow for debt service, reinvestment, and growth.</p>
                      
                      <h4>The Math:</h4>
                      <div className="comparison-table simple">
                        <div className="table-row table-header">
                          <span>Factor</span>
                          <span>Traditional Sale</span>
                          <span>ESOP Sale</span>
                        </div>
                        <div className="table-row">
                          <span>Corporate Tax Rate</span>
                          <span>21% federal</span>
                          <span>0% (100% ESOP S-corp)</span>
                        </div>
                        <div className="table-row">
                          <span>Cash Flow Retention</span>
                          <span>79% of earnings</span>
                          <span>100% of earnings</span>
                        </div>
                        <div className="table-row">
                          <span>Debt Service Capacity</span>
                          <span>Lower</span>
                          <span>Higher</span>
                        </div>
                        <div className="table-row">
                          <span>Growth Capital</span>
                          <span>Reduced</span>
                          <span>Enhanced</span>
                        </div>
                      </div>
                      
                      <h4>Additional Tax Benefits for Sellers (C-Corps):</h4>
                      <ul>
                        <li>Section 1042 rollover allows capital gains tax deferral</li>
                        <li>Sellers can reinvest proceeds in Qualified Replacement Property</li>
                        <li>Potential for permanent tax elimination if held until death</li>
                      </ul>
                      
                      <p><strong>The Result:</strong> The tax efficiency of the ESOP model supports competitive valuations while preserving the company&apos;s financial strength post-transition.</p>
                      <p className="answer-source">Sources: IRS Section 1042; Berman Skinner 2026; NCEO</p>
                    </div>
                  </div>
                </div>

                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'how-paid' ? 'active' : ''}`}
                    onClick={() => toggleFaq('how-paid')}
                  >
                    <span>How do you get paid if you aren&apos;t flipping the company?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'how-paid' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>We are compensated through a transparent management fee (typically 2-3%) for:</p>
                      <ul>
                        <li>Transition oversight and project management</li>
                        <li>ESOP implementation and plan administration</li>
                        <li>Ongoing fiduciary governance and compliance</li>
                        <li>Ownership culture development and employee engagement</li>
                        <li>Repurchase obligation planning and management</li>
                      </ul>
                      <p>Our incentives are aligned with the company&apos;s long-term health—we only succeed if the company endures and thrives under employee ownership.</p>
                      <p className="answer-source">Source: Financial Models Lab ESOP Administration Cost Analysis 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Operational Resilience */}
              <div className="faq-section">
                <h3 className="faq-section-title">
                  <span className="section-num">03</span>
                  Operational Resilience
                  <span className="section-subtitle">Applying &quot;Disaster Preparedness&quot; principles to business continuity</span>
                </h3>
                
                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'coop-standard' ? 'active' : ''}`}
                    onClick={() => toggleFaq('coop-standard')}
                  >
                    <span>How does the &quot;Resilience Framework&quot; protect my company?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'coop-standard' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>Drawing from federal Continuity of Operations (COOP) standards—originally developed for government agencies and now applied to critical infrastructure—we implement resilience planning that secures your operation against disruption.</p>
                      
                      <h4>Federal COOP Standards (PPD-40, FCD-1, FCD-2):</h4>
                      <ul>
                        <li><strong>Essential Functions Identification:</strong> What must continue, no matter what</li>
                        <li><strong>Orders of Succession:</strong> Deep leadership bench (typically 3+ levels)</li>
                        <li><strong>Delegations of Authority:</strong> Clear decision-making authority</li>
                        <li><strong>Continuity Facilities:</strong> Backup operational capabilities</li>
                        <li><strong>Vital Records Management:</strong> Secure data and document access</li>
                        <li><strong>Communication Systems:</strong> Redundant communication channels</li>
                      </ul>
                      
                      <h4>Application to Your Business:</h4>
                      <p>We adapt these proven frameworks to private company needs, creating operational &quot;hardening&quot; that protects against:</p>
                      <ul>
                        <li>Market volatility and economic downturns</li>
                        <li>Leadership transitions and key person risk</li>
                        <li>Supply chain disruptions</li>
                        <li>Technology and cybersecurity threats</li>
                        <li>Natural disasters and external shocks</li>
                      </ul>
                      <p className="answer-source">Source: FEMA Federal Continuity Directives; Presidential Policy Directive 40</p>
                    </div>
                  </div>
                </div>

                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'management-team' ? 'active' : ''}`}
                    onClick={() => toggleFaq('management-team')}
                  >
                    <span>What happens to my current management team?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'management-team' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>You control what your succession looks like. We prioritize &quot;hiring from within&quot; and stabilizing the leaders you&apos;ve already built.</p>
                      
                      <h4>Our Approach:</h4>
                      <ul>
                        <li>Assess current leadership capabilities and development needs</li>
                        <li>Create succession plans for key positions</li>
                        <li>Provide governance oversight without operational interference</li>
                        <li>Support leadership development and ownership mindset training</li>
                        <li>Maintain continuity of relationships with customers, suppliers, and stakeholders</li>
                      </ul>
                      
                      <p><strong>The Goal:</strong> Transform your current team from employees into long-term stewards of the business.</p>
                    </div>
                  </div>
                </div>

                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'strategic-buyer' ? 'active' : ''}`}
                    onClick={() => toggleFaq('strategic-buyer')}
                  >
                    <span>Why should I sell to my employees instead of a strategic buyer?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'strategic-buyer' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <h4>Legacy Preservation:</h4>
                      <p>A strategic buyer often acquires to &quot;absorb&quot;—meaning your brand, local office, and culture may disappear. Selling to your employees preserves your legacy and maintains the identity you spent decades building.</p>
                      
                      <h4>Financial Advantages:</h4>
                      <ul>
                        <li><strong>Tax Efficiency:</strong> 100% S-corp ESOP pays zero federal income tax</li>
                        <li><strong>Cash Flow:</strong> More internal capital for growth than under traditional corporate ownership</li>
                        <li><strong>Competitive Price:</strong> Tax benefits support competitive valuations</li>
                      </ul>
                      
                      <h4>Employee Benefits:</h4>
                      <ul>
                        <li><strong>Wealth Building:</strong> ESOP participants accumulate 2x the retirement savings</li>
                        <li><strong>Job Security:</strong> ESOP companies are 50% less likely to fail</li>
                        <li><strong>Engagement:</strong> Employee-owners are more productive and less likely to leave</li>
                      </ul>
                      
                      <h4>Community Impact:</h4>
                      <ul>
                        <li>Local ownership maintained</li>
                        <li>Jobs preserved</li>
                        <li>Community investment continues</li>
                      </ul>
                      <p className="answer-source">Sources: NCEO; Rutgers Studies; Mathematica Research</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Legacy & The Transition */}
              <div className="faq-section">
                <h3 className="faq-section-title">
                  <span className="section-num">04</span>
                  Legacy & The Transition
                  <span className="section-subtitle">Managing the &quot;Human Element&quot; and the founder&apos;s exit</span>
                </h3>
                
                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'brand-stay' ? 'active' : ''}`}
                    onClick={() => toggleFaq('brand-stay')}
                  >
                    <span>Will my brand and my name stay on the building?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'brand-stay' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>Yes. Our model is designed to preserve local identity. Because the employees become the owners, they have a vested interest in maintaining the reputation and brand you spent decades building.</p>
                      
                      <h4>What Stays:</h4>
                      <ul>
                        <li>Company name and brand identity</li>
                        <li>Local office locations and facilities</li>
                        <li>Customer relationships and contracts</li>
                        <li>Supplier partnerships</li>
                        <li>Community presence and involvement</li>
                      </ul>
                      
                      <p>You are being cemented in your community, not folded into a conglomerate.</p>
                    </div>
                  </div>
                </div>

                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'announce-staff' ? 'active' : ''}`}
                    onClick={() => toggleFaq('announce-staff')}
                  >
                    <span>How do we announce this to the staff without causing a panic?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'announce-staff' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>We frame the transition as an &quot;evolution and a gift.&quot;</p>
                      
                      <p><strong>Research shows:</strong> Most employees receive this news with deep gratitude because it offers them a path to wealth-building they never thought possible.</p>
                      
                      <h4>Our Communication Strategy:</h4>
                      <ul>
                        <li><strong>Leadership First:</strong> Brief key leaders before broader announcement</li>
                        <li><strong>Positive Framing:</strong> Emphasize stability, opportunity, and legacy preservation</li>
                        <li><strong>Transparency:</strong> Clear explanation of what changes and what stays the same</li>
                        <li><strong>Education:</strong> Comprehensive ESOP education to build ownership mindset</li>
                        <li><strong>Ongoing Engagement:</strong> Regular communication and updates throughout transition</li>
                      </ul>
                      
                      <h4>Key Messages:</h4>
                      <ul>
                        <li>&quot;The company you helped build will remain independent&quot;</li>
                        <li>&quot;You will share in the future success you help create&quot;</li>
                        <li>&quot;Jobs, culture, and community presence are preserved&quot;</li>
                        <li>&quot;This is an evolution, not a disruption&quot;</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'social-contract' ? 'active' : ''}`}
                    onClick={() => toggleFaq('social-contract')}
                  >
                    <span>What is your commitment to the workers?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'social-contract' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>As a PBC, we have a fiduciary duty to balance stakeholder interests. Our stewardship model includes specific commitments to employee well-being:</p>
                      
                      <h4>Governance Safeguards:</h4>
                      <ul>
                        <li>Independent ESOP trustee representing employee interests</li>
                        <li>Annual valuations by independent appraisers</li>
                        <li>Transparent financial reporting to employees</li>
                        <li>Employee participation in governance (e.g., ESOP committee)</li>
                      </ul>
                      
                      <h4>Wealth Building Focus:</h4>
                      <ul>
                        <li>Broad-based ownership (not just executives)</li>
                        <li>Vesting schedules that reward tenure</li>
                        <li>Diversification options as accounts grow</li>
                        <li>Retirement education and financial wellness programs</li>
                      </ul>
                      
                      <h4>Job Quality:</h4>
                      <ul>
                        <li>Competitive wages and benefits</li>
                        <li>Professional development opportunities</li>
                        <li>Safe and inclusive workplace</li>
                        <li>Voice in workplace decisions</li>
                      </ul>
                      <p className="answer-source">Source: NCEO Corporate Governance Guidelines; DOL ESOP Regulations</p>
                    </div>
                  </div>
                </div>

                <div className="faq-item">
                  <button 
                    className={`faq-question ${openFaq === 'role-after' ? 'active' : ''}`}
                    onClick={() => toggleFaq('role-after')}
                  >
                    <span>What happens to my role after the sale?</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === 'role-after' ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>Your role shifts from <strong>Operator</strong> to <strong>Sage</strong>.</p>
                      
                      <h4>Immediate Post-Sale (0-12 months):</h4>
                      <ul>
                        <li>Continue in operational role with gradual responsibility transfer</li>
                        <li>Mentor incoming leadership team</li>
                        <li>Transfer &quot;tribal knowledge&quot; and historical context</li>
                        <li>Maintain customer and supplier relationships</li>
                      </ul>
                      
                      <h4>Medium-Term (1-3 years):</h4>
                      <ul>
                        <li>Transition to board advisor or strategic consultant</li>
                        <li>Available for major decisions and crisis management</li>
                        <li>Focus on high-level wisdom and industry relationships</li>
                        <li>Reduced day-to-day involvement</li>
                      </ul>
                      
                      <h4>Long-Term (3+ years):</h4>
                      <ul>
                        <li>Honorary role as &quot;founder emeritus&quot;</li>
                        <li>Optional ongoing board seat</li>
                        <li>Legacy preservation and storytelling</li>
                        <li>Freedom to pursue other interests</li>
                      </ul>
                      
                      <p><strong>The Goal:</strong> You get to step back from the daily grind while remaining the honorary protector of the mission—without the stress of payroll, firefighting, or singular risk.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="container">
            <h2>Let&apos;s Talk About Your Legacy</h2>
            <p>
              It&apos;s an option you may not have known existed. We&apos;d love to talk about 
              whether it&apos;s the right one for you.
            </p>
            <a href="/introduction" className="cta-button">
              Schedule a Discussion
            </a>
          </div>
        </section>
      </main>
      
      <Footer variant="static" />
    </div>
  );
}

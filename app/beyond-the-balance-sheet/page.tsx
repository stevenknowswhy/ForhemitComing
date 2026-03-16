"use client";

import { useState, useEffect, lazy } from "react";
import Link from "next/link";
// Lazy load ContactModal for better performance
const ContactModal = lazy(() => import("../components/modals/ContactModal").then((mod) => ({ default: mod.ContactModal })));
import { ClientOnly } from "@/components/ClientOnly";
import "./beyond-balance-sheet.css";

export default function BeyondBalanceSheetPage() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll(".bbs-section").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bbs-wrapper">
      <div className="bbs-background"></div>

      {/* Logo Header */}
      <header className="bbs-logo-header">
        <Link href="/" className="bbs-logo-link">
          <span className="bbs-logo-text">Forhemit</span>
          <span className="bbs-logo-underline"></span>
        </Link>
      </header>

      <main className="bbs-main">
        {/* ① Hero Section */}
        <section id="hero" className={`bbs-section bbs-hero ${visibleSections.has("hero") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-eyebrow">How our planning is different</div>
            <h1 className="bbs-title">A great business is worthless if the doors aren&apos;t open.</h1>
            <p className="bbs-subhead">
              Financial modeling tells you what you have. COOP ensures you don&apos;t lose it.
            </p>
          </div>
        </section>

        {/* ② Complementary Framing */}
        <section id="framing" className={`bbs-section bbs-framing ${visibleSections.has("framing") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">Two frameworks. One complete picture.</div>
            <h2 className="bbs-section-title">
              Financial models are the snapshot.<br />
              <span className="highlight">COOP is the movie.</span>
            </h2>
            <div className="bbs-content">
              <p>
                A financial model captures what a business is worth right now. The assets, the revenue, 
                the collateral, the people in the seats today. It&apos;s the foundation — what lenders 
                underwrite, what brokers present, what sellers point to with pride. Every number on 
                that page represents something built over years.
              </p>
              <p>
                But a snapshot doesn&apos;t tell you what happens next. It doesn&apos;t show you what 
                the business does when a key operator leaves, when servers go down, when a cyberattack 
                locks every file on the network. It doesn&apos;t show you whether the business keeps 
                delivering — to customers, to employees, to lenders — when conditions change.
              </p>
              <p>
                That&apos;s what COOP shows you. Not what the business is worth today. What it does 
                tomorrow. Under pressure, under disruption, under the kind of circumstances no balance 
                sheet anticipates.
              </p>
              <p>
                In a 100% ESOP sale governed by IRC §1042 and ERISA fiduciary requirements, that 
                distinction matters more than most transactions acknowledge. The business is simultaneously 
                the borrower, the collateral, and the vehicle for employee ownership. Its continuity 
                isn&apos;t a soft benefit. It&apos;s a structural requirement.
              </p>
            </div>
            <blockquote className="bbs-pull-quote">
              Together, the snapshot and the movie tell the complete story. One shows you the foundation. 
              The other shows you what the business is built to do with it.
            </blockquote>
          </div>
        </section>

        {/* ③ Ransomware Story */}
        <section id="story" className={`bbs-section bbs-story ${visibleSections.has("story") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">COOP in action</div>
            <h2 className="bbs-section-title">
              Same business. Same attack.<br />
              <span className="highlight">Two completely different outcomes.</span>
            </h2>
            <p className="bbs-lead">
              Imagine two businesses. Same industry. Same revenue. Same financials. One has a COOP plan. 
              One does not.
            </p>
            <p className="bbs-lead">
              On a Wednesday morning, both discover ransomware has encrypted every file on their servers 
              — customer records, invoices, payroll. All locked. Payment demanded in 48 hours.
            </p>

            <div className="scenario-grid">
              <div className="scenario-card bad">
                <div className="card-tag">
                  <span className="tag-icon">✕</span>
                  No COOP plan
                </div>
                <p>No offline backups. No manual workarounds. No communication protocol.</p>
                <p>Orders stop. Invoices stop. Payroll is uncertain. The lender never receives the monthly payment.</p>
                <div className="outcome">The business never fully recovers.</div>
              </div>
              <div className="scenario-card good">
                <div className="card-tag">
                  <span className="tag-icon">✓</span>
                  COOP plan activated
                </div>
                <p>Offline backups restored by noon. Manual invoicing initiated. Emergency communications live.</p>
                <p>Payroll runs on time. The attack is contained. The lender receives payment as scheduled.</p>
                <div className="outcome">The business never stops operating.</div>
              </div>
            </div>

            <div className="story-closer">
              Same ransomware. Same demand. The difference wasn&apos;t on the balance sheet.
              <br />
              <strong>The difference was a plan.</strong>
            </div>
          </div>
        </section>

        {/* ④ 9/11 Proof */}
        <section id="proof" className={`bbs-section bbs-proof ${visibleSections.has("proof") ? "visible" : ""}`}>
          <div className="container">
            <div className="proof-section">
              <div className="bbs-label light">Proven over decades</div>
              <h2 className="bbs-section-title light">This isn&apos;t a new idea. It&apos;s a tested one.</h2>
              <p>
                This isn&apos;t a new idea. Governments have relied on it for decades.
              </p>
              <p>
                When the Twin Towers fell, the federal government didn&apos;t stop working. Checks went out. 
                Applications were processed. Services were delivered. Not by accident — by design. Continuity 
                of Operations Planning, the same discipline used by every major government agency since the 
                Cold War, exists for exactly this moment: when the unthinkable happens and the people counting 
                on you still need you to show up.
              </p>
              <blockquote className="bbs-pull-quote light">
                We bring that same framework to your business.
              </blockquote>
            </div>
          </div>
        </section>

        {/* ⑤ What COOP Does — Pillars */}
        <section id="pillars" className={`bbs-section bbs-pillars ${visibleSections.has("pillars") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">The methodology</div>
            <h2 className="bbs-section-title">What COOP actually does.</h2>
            <div className="bbs-content">
              <p>
                Continuity of Operations Planning identifies the functions critical to your business, maps 
                every single point of failure, and builds the redundancies that prevent disruption from 
                becoming collapse. It doesn&apos;t predict every scenario. It addresses the ones that matter.
              </p>
              <p>
                Most businesses have fewer critical vulnerabilities than they think — and more than they&apos;ve 
                addressed. A structured assessment typically surfaces 8 to 12 functions that, if interrupted, 
                would genuinely threaten operations. That&apos;s the list we build around.
              </p>
            </div>

            <div className="pillars-grid">
              <div className="pillar">
                <div className="pillar-num">Pillar 01</div>
                <h3>Critical function mapping</h3>
                <p>Identify the 8–12 functions that, if interrupted, would genuinely threaten operations.</p>
              </div>
              <div className="pillar">
                <div className="pillar-num">Pillar 02</div>
                <h3>Single point of failure elimination</h3>
                <p>Reduce key-person dependency through cross-training and documented succession orders.</p>
              </div>
              <div className="pillar">
                <div className="pillar-num">Pillar 03</div>
                <h3>Redundancy architecture</h3>
                <p>Offline backups, alternate sites, remote protocols — systems that activate before insurance has to.</p>
              </div>
              <div className="pillar">
                <div className="pillar-num">Pillar 04</div>
                <h3>Continuity testing</h3>
                <p>Plans that are documented, drilled, and ready — not sitting in a drawer waiting for a crisis.</p>
              </div>
            </div>

            <blockquote className="bbs-pull-quote">
              The goal isn&apos;t to see the future. It&apos;s to build a business that doesn&apos;t need to.
            </blockquote>
          </div>
        </section>

        {/* ⑥ Comparison Chart */}
        <section id="comparison" className={`bbs-section bbs-comparison ${visibleSections.has("comparison") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">Side by side</div>
            <h2 className="bbs-section-title">The planning difference.</h2>
            <p className="bbs-lead">
              Traditional financial modeling and COOP aren&apos;t competing frameworks. They&apos;re asking 
              different questions — and both answers are required.
            </p>

            <div className="comp-table-wrapper">
              <table className="comp-table">
                <thead>
                  <tr>
                    <th></th>
                    <th className="col-traditional">
                      Traditional model
                      <span className="col-subtitle">Underwriting focus</span>
                    </th>
                    <th className="col-forhemit">
                      The Forhemit model
                      <span className="col-subtitle">Continuity focus</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="row-label">Core question</td>
                    <td className="col-traditional">
                      <span className="tag-inline tag-bad">Wrong question</span>
                      <p>&quot;If you fail, how do we get our money back?&quot;</p>
                    </td>
                    <td className="col-forhemit">
                      <span className="tag-inline tag-good">Right question</span>
                      <p>&quot;How do we build a system that never stops delivering?&quot;</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="row-label">Primary focus</td>
                    <td className="col-traditional">
                      <span className="tag-inline tag-bad">Protect capital</span>
                      <p>Preserve assets. Secure debt recovery. Plan for failure.</p>
                    </td>
                    <td className="col-forhemit">
                      <span className="tag-inline tag-good">Protect the mission</span>
                      <p>Preserve operations. Ensure continuity of delivery — no matter what.</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="row-label">What they measure</td>
                    <td className="col-traditional">
                      <span className="tag-inline tag-bad">Rear-view mirror</span>
                      <p>Past financials. Balance sheets. Collateral value.</p>
                    </td>
                    <td className="col-forhemit">
                      <span className="tag-inline tag-good">Live readiness</span>
                      <p>Critical function mapping. Real-time redundancies. Tolerable downtime limits.</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="row-label">Stance on risk</td>
                    <td className="col-traditional">
                      <span className="tag-inline tag-bad">Reactive</span>
                      <p>Waits for crisis. Relies on insurance or liquidation after the fact.</p>
                    </td>
                    <td className="col-forhemit">
                      <span className="tag-inline tag-good">Proactive</span>
                      <p>Anticipates threats. Engineers systems to bypass failure before it arrives.</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="row-label">Internal threats</td>
                    <td className="col-traditional">
                      <span className="tag-inline tag-bad">The blind spot</span>
                      <p>Ignored until it appears as a revenue drop months later.</p>
                    </td>
                    <td className="col-forhemit">
                      <span className="tag-inline tag-good">Actively mitigated</span>
                      <p>Cross-training. Succession orders. Zero-trust cloud architecture.</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="row-label">Who it protects</td>
                    <td className="col-traditional">
                      <span className="tag-inline tag-bad">The lender</span>
                      <p>Ensures capital can be extracted even if the company collapses.</p>
                    </td>
                    <td className="col-forhemit">
                      <span className="tag-inline tag-good">Your customers and team</span>
                      <p>Ensures seamless service delivery and uninterrupted operations.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ⑦ Audience Blocks */}
        <section id="audience" className={`bbs-section bbs-audience ${visibleSections.has("audience") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">What this means for your transaction</div>
            <h2 className="bbs-section-title">Built for every party at the table.</h2>

            <div className="audience-grid">
              <div className="audience-card">
                <div className="audience-tag">For the seller</div>
                <h3>Confidence the business will continue.</h3>
                <p>
                  You&apos;ve spent years building something that works. A COOP-structured transition means 
                  your employees have a documented playbook, critical functions are covered, and the business 
                  doesn&apos;t depend on any single person — including you. That&apos;s not just peace of 
                  mind. It&apos;s proof that what you built was built to last.
                </p>
              </div>
              <div className="audience-card">
                <div className="audience-tag">For the broker</div>
                <h3>A deal that&apos;s easier to fund and close.</h3>
                <p>
                  The most common failure point in an ESOP transaction isn&apos;t valuation — it&apos;s 
                  lender confidence. COOP demonstrates that the business has been operationally de-risked 
                  before closing. Key-person dependency reduced. Continuity engineered, not assumed. 
                  That&apos;s a story lenders can underwrite.
                </p>
              </div>
              <div className="audience-card">
                <div className="audience-tag">For the lender</div>
                <h3>A security layer before insurance has to be triggered.</h3>
                <p>
                  In a 100% ESOP transaction, the business is both the borrower and the collateral. 
                  COOP is the protection that sits before a missed payment, before a default, before 
                  insurance ever enters the conversation. You&apos;re not underwriting a hope. You&apos;re 
                  underwriting a system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ⑧ Closing CTA */}
        <section id="closer" className={`bbs-section bbs-closer ${visibleSections.has("closer") ? "visible" : ""}`}>
          <div className="container">
            <div className="closer-box">
              <h2 className="closer-headline">
                Financial modeling tells you you have a great business.
                <br />
                COOP tells you it will continue to be one — even when conditions change.
              </h2>
              <p className="closer-sub">
                Most transactions plan for the deal. This one plans for everything that comes after.
              </p>
              <button onClick={() => setShowContactModal(true)} className="bbs-cta-btn">
                Talk to us about your transition →
              </button>
            </div>
          </div>
        </section>
      </main>

      <ClientOnly>
        <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      </ClientOnly>
    </div>
  );
}

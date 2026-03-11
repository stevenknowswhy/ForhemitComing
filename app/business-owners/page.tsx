"use client";

import Link from "next/link";
import { Footer } from "../components/layout/Footer";
import "./business-owners.css";

export default function BusinessOwnersPage() {
  return (
    <div className="business-owners-wrapper">
      <div className="business-owners-background"></div>
      
      {/* Logo Header */}
      <header className="business-owners-logo-header">
        <Link href="/" className="business-owners-logo-link">
          <span className="business-owners-logo-text">Forhemit</span>
          <span className="business-owners-logo-underline"></span>
        </Link>
      </header>
      
      <main className="business-owners-main">
        {/* Hero Section */}
        <section className="business-owners-hero">
          <div className="container">
            <div className="hero-content">
              <span className="business-owners-eyebrow">For Business Owners</span>
              <h1 className="business-owners-title">
                Be Ready for Tomorrow, Today:
                <br />
                <span className="highlight">The Systematic Path to Successful Succession</span>
              </h1>
              <p className="business-owners-subtitle">
                Protect your life&apos;s work with a comprehensive transition plan.
              </p>
              <a href="/introduction" className="hero-cta-button">
                Start Your Readiness Plan
              </a>
            </div>
            <div className="hero-image">
              <img 
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDfemQfPYOIdcXFC34obyDPLkhgQVTv7ERqewA" 
                alt="Business succession planning" 
              />
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="business-owners-section">
          <div className="container">
            <div className="content-block">
              <h2>The Ultimate Luxury: Leaving on Your Own Terms</h2>
              <p>
                One of the greatest advantages of an employee‑ownership path is control: you 
                decide when and how you step away—gradually, all at once, or not at all for a 
                while. You are not sitting around hoping the &quot;perfect buyer&quot; appears or forced 
                to accept terms you do not like because time or health is running out.
              </p>
              <p>
                Our model is built so you can:
              </p>
              <ul>
                <li>Set your own timeline and adjust it as life changes.</li>
                <li>Step back in stages—hours, responsibilities, and risk—while maintaining income.</li>
                <li>Choose the moment your role truly ends, instead of having it chosen for you.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="business-owners-section section-alt">
          <div className="container">
            <div className="comparison-grid">
              <div className="comparison-card negative">
                <div className="comparison-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDic78W35OPVhC3q4RatBL86y71kFW9UM2vGrz" 
                    alt="Chaotic business transition"
                  />
                </div>
                <div className="comparison-header">
                  <span className="comparison-icon">⚠</span>
                  <h3>The &quot;Mad Scramble&quot;</h3>
                </div>
                <p className="comparison-intro">
                  If you have ever watched a peer sell their business to a competitor or a 
                  private equity firm, you know the chaos it brings.
                </p>
                <ul className="comparison-list">
                  <li>External buyers demand everything under the sun</li>
                  <li>Interrogation of your team with out-of-the-blue questions</li>
                  <li>New people brought in to shake things up</li>
                  <li>Disruptive, exhausting, and stressful</li>
                </ul>
              </div>

              <div className="comparison-card positive">
                <div className="comparison-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDmGV07k85Eem6OqKGFXsI071p4dSijCb2oYcR" 
                    alt="Peaceful business succession"
                  />
                </div>
                <div className="comparison-header">
                  <span className="comparison-icon">✓</span>
                  <h3>The Peaceful Rollover</h3>
                </div>
                <p className="comparison-intro">
                  Our succession blueprint is the exact opposite. We make your transition 
                  almost boring.
                </p>
                <ul className="comparison-list">
                  <li>Financial, legal, and operational frameworks built in advance</li>
                  <li>No surprises or sudden interrogations</li>
                  <li>Everyone prepared, simply falling into their roles</li>
                  <li>Quiet, peaceful, gentle rollover into a new beginning</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stakeholders Section */}
        <section className="business-owners-section">
          <div className="container">
            <div className="section-header">
              <h2>A Systematic Plan for Every Stakeholder</h2>
              <p className="section-intro">
                We serve as the fiduciary bridge, coordinating a complex process so that 
                every party is aligned, protected, and prepared.
              </p>
            </div>

            <div className="stakeholders-grid">
              <div className="stakeholder-card hover-reveal">
                <div className="stakeholder-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDm9zJtzP85Eem6OqKGFXsI071p4dSijCb2oYc" 
                    alt="Business owner"
                  />
                  <div className="stakeholder-overlay">
                    <h3>For the Owner (You)</h3>
                    <div className="stakeholder-description">
                      <p>
                        We map out a secure exit strategy that protects your wealth, relieves you 
                        of singular operational risk, and preserves your legacy—executed only when 
                        you give the green light.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stakeholder-card hover-reveal">
                <div className="stakeholder-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD9Ng4TJ32pSgTBVY98K3GtlLfwieHEIvuUMxF" 
                    alt="Employees collaborating"
                  />
                  <div className="stakeholder-overlay">
                    <h3>For the Employees</h3>
                    <div className="stakeholder-description">
                      <p>
                        We systematically prepare your key team members for the responsibilities of 
                        ownership. We provide the structural framework they need to thrive, ensuring 
                        they are ready to step up calmly and confidently.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stakeholder-card hover-reveal">
                <div className="stakeholder-image">
                  <img 
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDH6KI9uFakxJUPrlnIVYC9XNH5uEWetF2KO67" 
                    alt="Advisory team meeting"
                  />
                  <div className="stakeholder-overlay">
                    <h3>For Your Advisory Team</h3>
                    <div className="stakeholder-description">
                      <p>
                        We align directly with your existing accountants, attorneys, and wealth managers. 
                        By providing clear legal frameworks and fiduciary oversight, we ensure your 
                        advisors have exactly what they need to execute a compliant, tax-efficient 
                        transition without the usual M&A friction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Steps Section */}
        <section className="business-owners-section section-dark">
          <div className="container">
            <div className="section-header">
              <h2>The Readiness Journey: Step-by-Step</h2>
              <p className="section-intro">
                Here is exactly what the systematic transition looks like when you partner with us.
              </p>
            </div>

            <div className="journey-cards">
              <div className="journey-card">
                <span className="journey-number">01</span>
                <h3>The Assessment</h3>
                <span className="journey-phase">Today</span>
                <p>
                  Everything begins with a no-pressure assessment of your timeline, financial 
                  needs, and the current health of the business. We identify structural 
                  gaps and lay out a preliminary roadmap for transitioning ownership.
                </p>
              </div>

              <div className="journey-card">
                <span className="journey-number">02</span>
                <h3>The Blueprint</h3>
                <span className="journey-phase">Pre-Transition</span>
                <p>
                  We align your accountants and legal counsel to structure the exact financial 
                  frameworks required. We begin communicating with your future 
                  employee-owners, building their readiness for the transition ahead.
                </p>
              </div>

              <div className="journey-card highlight">
                <span className="journey-number">03</span>
                <h3>Execution & Handover</h3>
                <span className="journey-phase">Transition</span>
                <p>
                  The legal transition of ownership takes place, employees calmly gain their 
                  stake, financial obligations are secured, and the operational handover happens 
                  seamlessly.
                </p>
              </div>

              <div className="journey-card success">
                <span className="journey-number">04</span>
                <h3>Continuity & Legacy</h3>
                <span className="journey-phase">Post-Sale</span>
                <p>
                  You transition from operator to mentor. Lose the stress of daily operations, 
                  watch your team thrive as owners, and stay protected with us as your 
                  fiduciary bridge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="business-owners-cta">
          <div className="container">
            <h2>Secure Your Legacy on Your Terms</h2>
            <p>
              Waiting until you are ready to leave to start planning creates chaos, vulnerability, 
              and risk. The best time to build a continuity plan was five years ago. The second 
              best time is today.
            </p>
            <p className="cta-subtitle">
              Let&apos;s sit down and draft the blueprint for your company&apos;s resilient future.
            </p>
            <a href="/introduction" className="cta-button">
              Schedule a Confidential Conversation
            </a>
          </div>
        </section>
      </main>

      <Footer variant="static" />
    </div>
  );
}

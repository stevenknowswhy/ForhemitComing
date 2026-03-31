"use client";

import { lazy, Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientOnly } from "@/components/ClientOnly";
import {
  BusinessOwnersClosingSections,
  SavingsStrip,
  BrokerComparisonSection,
  ConfidentialIntakeModal,
} from "./components";
import "./business-owners.css";

const TwoMinuteCheckModal = lazy(() =>
  import("@/app/home/intake").then((mod) => ({ default: mod.TwoMinuteCheckModal }))
);

export default function BusinessOwnersPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [showTwoMinuteCheck, setShowTwoMinuteCheck] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [intakePath, setIntakePath] = useState<"nda" | "light" | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const openIntake = (path?: "nda" | "light") => {
    setIntakePath(path ?? null);
    setShowIntake(true);
  };

  const faqs = [
    {
      id: "committed",
      question: "If I start the planning process today, does that mean I'm committed to leaving soon?",
      answer: "Absolutely not. Building your blueprint today is simply sound business continuity—like buying insurance before the storm hits. It means putting the framework in place so that whether you decide to transition in two years or ten years, the plan is ready to execute. You remain in total control of the timeline; we just make sure the vehicle is built and ready to drive when you are."
    },
    {
      id: "pe-vs-eo",
      question: "But wouldn't a private equity firm pay more for my company?",
      answer: "On paper, maybe. In reality, that 'premium' price tag is often an illusion. When comparing your options, you have to look at the actual NET cash in your pocket, not the top-line vanity metric:\n\nThe PE Catch: High offers are almost always tied to risky 'earn-outs.' You only see the full payout if the company hits aggressive new targets after you have given up control. Plus, you get hit with hefty broker fees and maximum taxes.\n\nThe Employee Ownership Advantage: You sell at a fair, independent market valuation. But because you are selling to your employees, you eliminate broker fees and unlock massive structural tax advantages (like capital gains deferrals) that PE deals simply cannot offer.\n\nThe bottom line: When you factor in the tax savings, the lack of fees, and the removal of risky earn-outs, your actual take-home pay is highly competitive. You get fair market value for your life's work—without the mad scramble, never-ending due diligence driving down the purchase price and strangers going through your book and records.\n\n(This is not financial or legal advice. We encourage you to talk to your accountant, attorney and advisors to create the best deal for you.)"
    },
    {
      id: "distracted",
      question: "Will my employees be distracted by the transition process?",
      answer: "No. A core part of our fiduciary role is ensuring your day-to-day operations remain uninterrupted. We handle the complex financial structuring, the legal frameworks, and the heavy lifting. While we do help prepare key team members for an ownership mindset over time, we do it systematically so they remain focused on running a profitable business.\n\nOne of the biggest advantages of transitioning to employee ownership is the drastic reduction in due diligence. When you sell to a private equity firm or an outside buyer, they typically unleash an army of analysts to interrogate every aspect of your business, distracting your team and causing widespread anxiety."
    },
    {
      id: "sell-later",
      question: "Can I still sell to a private buyer at a later date?",
      answer: "Absolutely. Stewardship and succession planning don't lock you in—they give you leverage.\n\nGoing through our readiness process actually makes your business more valuable to outside buyers. A company that has been operationally stress-tested, has a proven succession plan, and isn't solely dependent on its founder commands a much higher market multiple.\n\nBy building your blueprint today, you create the ultimate win-win scenario:\n\nIf a great buyer comes along: You have a highly optimized, turnkey business ready to sell at a premium.\n\nIf outside offers fall short (or demand too much control): You already have a fully engineered, peaceful rollover plan ready to execute with your employees.\n\nHaving a plan simply gives you the freedom to walk away on your own terms. You always retain the power to decide exactly what is best for you and your legacy."
    },
    {
      id: "advisors",
      question: "I already have a CPA and an Attorney. Do you replace them?",
      answer: "We don't replace your advisory team; we empower them. Traditional sales often put a founder's advisors in a frantic, reactive position, scrambling to respond to an external buyer's demands. We provide your existing team with a clear, compliant blueprint. This allows your CPA and attorney to facilitate a tax-efficient, seamless transition without the usual friction of an M&A deal."
    },
    {
      id: "different",
      question: "How is your approach different from selling to a competitor or Private Equity?",
      answer: "When you sell to an outside buyer, you lose control. They dictate the timeline, they interrogate your business, and they often dismantle the culture you built to extract value. Our approach is the opposite. You sell to the people who helped build the business, on a timeline you control. We serve as the steward to ensure the company remains independent, your legacy is protected, and the transition is peaceful."
    },
    {
      id: "buy",
      question: 'How do the employees actually "buy" the company?',
      answer: "This is a common misconception—your employees do not need to empty their savings accounts or take out second mortgages to buy the business. We help structure the transition using proven legal and financial frameworks (such as an ESOP or an Employee Ownership Trust) that allow the company itself to finance the buyout over time, paying you fair market value out of its future profits."
    },
    {
      id: "after",
      question: "What happens to me after the transition is complete?",
      answer: "That is entirely up to you. Because the transition is gradual and planned, you don't have to vanish on day one. Most founders transition from the primary operator carrying all the stress into an invaluable mentor or board advisor. You get to watch your team thrive as owners while providing high-level wisdom and historical context."
    }
  ];
  return (
    <>
    <div className="business-owners-wrapper">
      <div className="business-owners-background"></div>
      
      <main className="business-owners-main">
        {/* Hero Section */}
        <section className="business-owners-hero hch-hero-section">
          <div className="container">
            <div className="hero-content">
              <span className="business-owners-eyebrow">For Owners: Sell to Your Team, Keep Your Legacy</span>
              <h1 className="business-owners-title">
                Beyond the Balance Sheet™: Sell to Your Team at Fair Market Value
                <br />
                <span className="highlight">While Others Disappear at Closing, We Steward Your Legacy Through the Critical First 24 Months</span>
              </h1>
              <p className="business-owners-subtitle">
                We don&apos;t just plan your exit. We ensure your business survives it. 
                The only exit advisor that stays after the wire hits—structuring your ESOP end to end 
                with post-close stewardship built in.
              </p>
              <div className="hch-hero-ctas" role="group" aria-label="Primary actions">
                <button
                  type="button"
                  className="hch-hero-cta hch-hero-cta-primary"
                  onClick={() => setShowTwoMinuteCheck(true)}
                >
                  Start My 2-Minute Check
                </button>
                <button
                  type="button"
                  className="hch-hero-cta hch-hero-cta-secondary"
                  onClick={() => openIntake("nda")}
                >
                  Begin Confidential Intake
                </button>
              </div>
            </div>
            <div className="hero-image">
              <div className="bo-glow-shell bo-glow-shell--hero-img">
                <div className="bo-glow-shell__glow" aria-hidden />
                <div className="bo-glow-inner">
                  <img
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDfemQfPYOIdcXFC34obyDPLkhgQVTv7ERqewA"
                    alt="Business succession planning"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Savings Strip */}
        <SavingsStrip />

        {/* Timeline Section */}
        <section className="business-owners-section luxury-section">
          <div className="container">
            <div className="luxury-grid">
              <div className="luxury-content">
                <h2>You steer the sale—and the closing timeline</h2>
                <p>
                  Traditional sale: 12–18 months. Forhemit ESOP: 4 months. Selling to an ESOP is 
                  still a real sale: independent appraisal, negotiated price, bank financing, and 
                  a closing date. The difference is the buyer is your company and your people—not 
                  a stranger doing diligence in the hallways.
                </p>
                <p>
                  That gives you room to:
                </p>
                <ul>
                  <li>Run a traditional process in parallel if you want optionality—without giving up a funded ESOP path.</li>
                  <li>Stage your exit (hours and responsibilities) while the deal is structured and funded.</li>
                  <li>Close when the file is clean—not because an outside buyer forced the calendar.</li>
                </ul>
              </div>
              <div className="luxury-image">
                <img 
                  src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDZKoRg4zMdXfDn1J0ilT8SKbAWux5a7pqNCcH" 
                  alt="Business owner enjoying freedom after succession planning" 
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          <BusinessOwnersClosingSections />
        </div>

        {/* Broker Comparison */}
        <BrokerComparisonSection />

        {/* Journey Steps Section */}
        <section className="business-owners-section section-dark">
          <div className="container">
            <div className="section-header">
              <h2>From first conversation to closing day</h2>
              <p className="section-intro">
                How we move you from assessment to a funded purchase of your shares—without the chaos 
                of a typical third-party sale.
              </p>
            </div>

            <div className="steps-container">
              <div className="timeline-line"></div>
              
              <div className="step-item" data-step="1">
                <div className="step-badge">
                  <span className="step-num">01</span>
                  <div className="step-icon">🔍</div>
                </div>
                <div className="bo-glow-shell bo-glow-shell--step">
                  <div className="bo-glow-shell__glow" aria-hidden />
                  <div className="bo-glow-inner step-card">
                  <div className="step-header">
                    <h3>The Assessment</h3>
                    <span className="step-tag">Today</span>
                  </div>
                  <span className="step-objective">Mapping the Vulnerabilities and Vision</span>
                  <div className="step-body">
                    <p>
                      Everything begins with a no-pressure assessment of your timeline, financial 
                      needs, and the current health of the business. We identify any structural 
                      gaps and lay out a preliminary roadmap for transitioning ownership.
                    </p>
                  </div>
                  <div className="step-connector"></div>
                </div>
                </div>
              </div>

              <div className="step-item" data-step="2">
                <div className="step-badge">
                  <span className="step-num">02</span>
                  <div className="step-icon">📐</div>
                </div>
                <div className="bo-glow-shell bo-glow-shell--step">
                  <div className="bo-glow-shell__glow" aria-hidden />
                  <div className="bo-glow-inner step-card">
                  <div className="step-header">
                    <h3>The Blueprint</h3>
                    <span className="step-tag">Pre-Transition</span>
                  </div>
                  <span className="step-objective">Building the Framework</span>
                  <div className="step-body">
                    <p>
                      We step into our role as your fiduciary guide. We align your accountants 
                      and legal counsel to structure the exact financial frameworks required. 
                      Simultaneously, we begin transparently communicating with your future 
                      employee-owners, building their capacity and readiness for the transition ahead.
                    </p>
                  </div>
                  <div className="step-connector"></div>
                </div>
                </div>
              </div>

              <div className="step-item" data-step="3">
                <div className="step-badge">
                  <span className="step-num">03</span>
                  <div className="step-icon">⚡</div>
                </div>
                <div className="bo-glow-shell bo-glow-shell--step">
                  <div className="bo-glow-shell__glow" aria-hidden />
                  <div className="bo-glow-inner step-card">
                  <div className="step-header">
                    <h3>Execution & Handover</h3>
                    <span className="step-tag highlight">Transition</span>
                  </div>
                  <span className="step-objective">A &quot;Boring&quot; and Seamless Transition</span>
                  <div className="step-body">
                    <p>
                      Because we systematically prepared every stakeholder, this milestone is 
                      simply the execution of a well-tested blueprint. The legal transition of 
                      ownership takes place, employees calmly gain their stake, financial 
                      obligations are secured, and the operational handover happens seamlessly.
                    </p>
                  </div>
                  <div className="step-connector"></div>
                </div>
                </div>
              </div>

              <div className="step-item" data-step="4">
                <div className="step-badge">
                  <span className="step-num">04</span>
                  <div className="step-icon">✨</div>
                </div>
                <div className="bo-glow-shell bo-glow-shell--step">
                  <div className="bo-glow-shell__glow" aria-hidden />
                  <div className="bo-glow-inner step-card final">
                  <div className="step-header">
                    <h3>Continuity & Legacy</h3>
                    <span className="step-tag success">Post-Sale</span>
                  </div>
                  <span className="step-objective">Sustainable Success</span>
                  <div className="step-body">
                    <p>
                      Post-sale, you transition from the primary operator to an invaluable mentor 
                      or board advisor.
                    </p>
                    <ul className="step-benefits">
                      <li><strong>Lose the stress:</strong> You no longer carry the weight of payroll, daily emergencies, or singular risk.</li>
                      <li><strong>Watch them thrive:</strong> See the people you trained flourish as owners.</li>
                      <li><strong>Stay protected:</strong> We remain in place as the fiduciary bridge, ensuring the company continues to honor the structural and financial principles agreed upon at closing.</li>
                    </ul>
                  </div>
                  <div className="step-complete">
                    <span className="complete-icon">✓</span>
                    <span>Your Legacy Secured</span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="business-owners-section section-alt">
          <div className="container">
            <div className="comparison-grid">
              <div className="bo-glow-shell">
                <div className="bo-glow-shell__glow" aria-hidden />
                <div className="bo-glow-inner comparison-card negative">
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
              </div>

              <div className="bo-glow-shell">
                <div className="bo-glow-shell__glow" aria-hidden />
                <div className="bo-glow-inner comparison-card positive">
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
              <div className="bo-glow-shell stakeholder-glow-wrap">
                <div className="bo-glow-shell__glow" aria-hidden />
                <div className="bo-glow-inner">
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
                </div>
              </div>

              <div className="bo-glow-shell stakeholder-glow-wrap">
                <div className="bo-glow-shell__glow" aria-hidden />
                <div className="bo-glow-inner">
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
                </div>
              </div>

              <div className="bo-glow-shell stakeholder-glow-wrap">
                <div className="bo-glow-shell__glow" aria-hidden />
                <div className="bo-glow-inner">
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
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="business-owners-section faq-section">
          <div className="container">
            <div className="section-header">
              <h2>Frequently Asked Questions</h2>
              <p className="section-intro">
                Answers to the most common questions business owners ask about the transition process.
              </p>
            </div>

            <div className="bo-faq-list" role="list">
              {faqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`bo-faq-item ${isOpen ? "bo-faq-item--open" : ""}`}
                    role="listitem"
                  >
                    <button
                      type="button"
                      className="bo-faq-trigger"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <span className="bo-faq-q">{faq.question}</span>
                      <span className="bo-faq-chevron" aria-hidden>
                        +
                      </span>
                    </button>
                    <div className="bo-faq-panel">
                      <div className="bo-faq-panel-inner">
                        <div className="bo-faq-body">
                          {faq.answer.split("\n\n").map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="business-owners-cta">
          <div className="container">
            <h2>Ready to see if this fits?</h2>
            <p>
              A two-minute intake is all it takes to know if your business qualifies.
              No commitment, no broker pitch, no obligation.
            </p>
            <div className="bo-cta-buttons">
              <button
                type="button"
                className="cta-button"
                onClick={() => openIntake("nda")}
              >
                Begin Confidential Intake
              </button>
              <button
                type="button"
                className="cta-button-ghost"
                onClick={() => openIntake("light")}
              >
                Tell Us a Little First
              </button>
            </div>
          </div>
        </section>
      </main>

    </div>

    <ClientOnly fallback={null}>
      {showTwoMinuteCheck && (
        <Suspense fallback={null}>
          <TwoMinuteCheckModal
            isOpen={showTwoMinuteCheck}
            onClose={() => setShowTwoMinuteCheck(false)}
            onPassProceed={() => {
              setShowTwoMinuteCheck(false);
              router.push("/four-month-path");
            }}
          />
        </Suspense>
      )}
    </ClientOnly>

    {showIntake && (
      <ConfidentialIntakeModal
        isOpen={showIntake}
        defaultPath={intakePath}
        onClose={() => {
          setShowIntake(false);
          setIntakePath(null);
        }}
      />
    )}
    </>
  );
}

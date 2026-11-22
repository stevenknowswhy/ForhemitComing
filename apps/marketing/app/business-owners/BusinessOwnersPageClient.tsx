"use client";

import { useFaqToggle } from "@forhemit/shared/hooks/useFaqToggle";

import { lazy, Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

export function BusinessOwnersPageClient() {
  const router = useRouter();
  const [openFaq, toggleFaq] = useFaqToggle<string>(null);
  const [showTwoMinuteCheck, setShowTwoMinuteCheck] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [intakePath, setIntakePath] = useState<"nda" | "light" | null>(null);


  const openIntake = (path?: "nda" | "light") => {
    setIntakePath(path ?? null);
    setShowIntake(true);
  };

  const faqs = [
    {
      id: "sell-100",
      question: "Do I have to sell 100% of the company?",
      answer: "Forhemit's model is a 100% transition \u2014 the full company moves into employee ownership. That completeness is what unlocks the strongest tax treatment, the cleanest financing, and an unambiguous new chapter for the business. If a partial sale fits you better, we will tell you honestly and point you to advisors who do that work."
    },
    {
      id: "price",
      question: "How is the price for my company set?",
      answer: "By an independent, qualified appraiser engaged for the transaction \u2014 never by Forhemit and never by you alone. The trustee reviews the valuation on behalf of employees and must conclude the price is no more than fair market value. That independence protects you as much as it protects them: the price can be defended to the IRS, the DOL, and your own family."
    },
    {
      id: "s1042",
      question: "What is the Section 1042 deferral, in plain terms?",
      answer: "If your company is a C corporation and the ESOP ends up owning at least 30% of the company, Section 1042 of the tax code lets you defer the capital-gains tax on the sale \u2014 potentially indefinitely \u2014 by reinvesting the proceeds in qualified replacement property. On a lifetime's worth of gains, that deferral can be worth more than a nominally higher offer from a taxable buyer. Your tax advisor confirms how it applies to you; we structure the deal so it can."
    },
    {
      id: "guarantees",
      question: "Am I personally guaranteeing anything?",
      answer: "Our standard is no personal guarantees \u2014 a term sheet demanding one is flagged as off-standard. Financing is carried by the transaction structure and the company's future earnings \u2014 that is precisely why the business must be profitable and of sufficient scale to qualify."
    },
    {
      id: "employees",
      question: "What do my employees actually receive?",
      answer: "Shares in the company, held in the ESOP trust and allocated to their individual accounts over time, on top of their regular pay. They do not buy in and they do not take on the company's debts. As the company performs and the acquisition financing is repaid, the value of what they hold grows \u2014 which is the point: the people doing the work share in what the work creates."
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
              <span className="business-owners-eyebrow">For owners</span>
              <h1 className="business-owners-title">
                You built it.
                <br />
                <span className="highlight">Your people can own it.</span>
              </h1>
              <p className="business-owners-subtitle">
                This page is for founders weighing what comes next. It covers
                who qualifies, how the tax treatment works, what you risk, and
                what your life looks like after close.
              </p>
              <div className="hch-hero-ctas" role="group" aria-label="Primary actions">
                <button
                  type="button"
                  className="hch-hero-cta hch-hero-cta-primary"
                  onClick={() => setShowTwoMinuteCheck(true)}
                >
                  Start your free assessment
                </button>
                <Link
                  href="/four-month-path"
                  className="hch-hero-cta hch-hero-cta-secondary"
                >
                  See the Four-Month Path
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="bo-glow-shell bo-glow-shell--hero-img">
                <div className="bo-glow-shell__glow" aria-hidden />
                <div className="bo-glow-inner">
                  <Image
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDfemQfPYOIdcXFC34obyDPLkhgQVTv7ERqewA"
                    alt="A family at sunset"
                    width={2033}
                    height={1156}
                    sizes="(max-width: 900px) 100vw, 650px"
                    priority
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
                <h2>The part no spreadsheet settles.</h2>
                <p>
                  Founders rarely start this search because of a spreadsheet.
                  Something prompts it — retirement on the horizon, a partner who
                  wants out, a team you cannot imagine handing to strangers. But
                  when owners who have sold to their employees explain the final
                  decision, they do not talk about the trigger. They talk about
                  what they were protecting.
                </p>
                <p>
                  An employee-ownership sale has to work financially, and this
                  page will not ask you to pretend otherwise — the price is full,
                  independently set, and the tax treatment is real. But the
                  reason this path exists is the part no spreadsheet settles:
                </p>
                <ul>
                  <li>The people who gave the company their best twenty years — and what happens to those people under each kind of buyer.</li>
                  <li>The name on the building staying the name on the building.</li>
                  <li>A business that remains independent and rooted where it was built, instead of becoming a line in someone else&apos;s portfolio.</li>
                </ul>
              </div>
              <div className="luxury-image">
                <Image
                  src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDZKoRg4zMdXfDn1J0ilT8SKbAWux5a7pqNCcH"
                  alt="A business owner looking to what comes next"
                  width={1376}
                  height={768}
                  sizes="(max-width: 900px) 100vw, 50vw"
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
              <h2>120 days, in four defined stages</h2>
              <p className="section-intro">
                The whole route from first review to a company your employees
                own outright — with the fee and the tax treatment stated in
                writing before you commit.
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
                    <h3>Readiness &amp; Valuation</h3>
                    <span className="step-tag">Month 1</span>
                  </div>
                  <span className="step-objective">Know whether the business qualifies</span>
                  <div className="step-body">
                    <p>
                      We start by understanding the business you have built — its
                      financials, its people, its culture, and what you want the
                      next chapter to look like. If the fit is wrong, we say so
                      now, not in month three.
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
                    <h3>Structure &amp; Financing</h3>
                    <span className="step-tag">Month 2</span>
                  </div>
                  <span className="step-objective">The transaction is designed</span>
                  <div className="step-body">
                    <p>
                      The transaction is designed: the ESOP acquires 100% of the
                      company, the seller note and outside financing are fitted
                      together, and the tax treatment, including Section 1042
                      where it applies, is worked through with your own tax
                      advisor before anything is signed.
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
                    <h3>Legal &amp; Compliance</h3>
                    <span className="step-tag highlight">Month 3</span>
                  </div>
                  <span className="step-objective">Paperwork that withstands scrutiny</span>
                  <div className="step-body">
                    <p>
                      Paperwork is where transitions succeed or quietly fail. Plan
                      documents, the trust, and the trustee relationship are put
                      in place to satisfy the Department of Labor and the IRS —
                      and to withstand scrutiny years later.
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
                    <h3>Close &amp; Handover</h3>
                    <span className="step-tag success">Month 4</span>
                  </div>
                  <span className="step-objective">Your employees own the company</span>
                  <div className="step-body">
                    <p>
                      The sale closes. Shares move to the trust, employees become
                      owners, and your 4-to-12-month transition availability
                      begins — on call, not working hands-on.
                    </p>
                    <ul className="step-benefits">
                      <li><strong>One table:</strong> Closing executed with trustee, lender, and counsel at one table.</li>
                      <li><strong>Welcomed as owners:</strong> Employees receive a clear explanation of what they now hold.</li>
                      <li><strong>Stewardship continues:</strong> Ongoing governance, culture, and repurchase planning under Forhemit stewardship.</li>
                    </ul>
                  </div>
                  <div className="step-complete">
                    <span className="complete-icon">✓</span>
                    <span>Your employees own the company</span>
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
                  <Image
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDic78W35OPVhC3q4RatBL86y71kFW9UM2vGrz"
                    alt="Before the transition: the business as it runs today"
                    width={2787}
                    height={1267}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="comparison-header">
                  <span className="comparison-icon">⚠</span>
                  <h3>Private Equity &mdash; the outside buyer</h3>
                </div>
                <p className="comparison-intro">
                  A real option that works well for some founders: you sell to a
                  financial buyer, on terms the buyer largely sets.
                </p>
                <ul className="comparison-list">
                  <li><strong>Price:</strong> A competitive price is possible — though part of the price may be tied to future performance.</li>
                  <li><strong>Employees:</strong> Their future is the buyer&apos;s call once the deal closes.</li>
                  <li><strong>Legacy:</strong> The name may carry on; the direction it takes is no longer yours to set.</li>
                  <li><strong>Timeline:</strong> Diligence and negotiation commonly run 12–18 months.</li>
                </ul>
                </div>
              </div>

              <div className="bo-glow-shell">
                <div className="bo-glow-shell__glow" aria-hidden />
                <div className="bo-glow-inner comparison-card positive">
                <div className="comparison-image">
                  <Image
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDmGV07k85Eem6OqKGFXsI071p4dSijCb2oYcR"
                    alt="After the transition: the business under employee ownership"
                    width={2816}
                    height={1345}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="comparison-header">
                  <span className="comparison-icon">✓</span>
                  <h3>Employee Ownership via Forhemit &mdash; the continuity path</h3>
                </div>
                <p className="comparison-intro">
                  You sell 100% of the business to the people who helped build it,
                  at a price set independently — and the company carries on.
                </p>
                <ul className="comparison-list">
                  <li><strong>Price:</strong> A full-price exit at independent fair market value.</li>
                  <li><strong>Employees:</strong> They become the owners — the team stays intact, and so does everything it knows.</li>
                  <li><strong>Legacy:</strong> The name, the customers, and the culture continue under the people who built them.</li>
                  <li><strong>Timeline:</strong> 120 days from Documents-Ready — the clock starts when your documents are complete and accepted.</li>
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
<h2>Who this touches</h2>
              <p className="section-intro">
                One transition, three groups whose interests have to be served at once.
              </p>
            </div>

            <div className="stakeholders-grid">
              <div className="bo-glow-shell stakeholder-glow-wrap">
                <div className="bo-glow-shell__glow" aria-hidden />
                <div className="bo-glow-inner">
                  <div className="stakeholder-card hover-reveal">
                <div className="stakeholder-image">
                  <Image
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDm9zJtzP85Eem6OqKGFXsI071p4dSijCb2oYc"
                    alt="Business owner"
                    width={3712}
                    height={5568}
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                  <div className="stakeholder-overlay">
                    <h3>For the Owner (You)</h3>
                    <div className="stakeholder-description">
                      <p>
                        Stefano Stokes, Founder &amp; CEO. The person you meet first is
                        the person who leads your transition — and the person
                        accountable for coordinating the work through closing and
                        handover.
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
                  <Image
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD9Ng4TJ32pSgTBVY98K3GtlLfwieHEIvuUMxF"
                    alt="Employees collaborating"
                    width={2034}
                    height={1637}
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                  <div className="stakeholder-overlay">
                    <h3>For the Employees</h3>
                    <div className="stakeholder-description">
                      <p>
                        Shares in the company, held in the ESOP trust and allocated to
                        their individual accounts over time, on top of their regular
                        pay. They do not buy in and they do not take on the
                        company&apos;s debts.
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
                  <Image
                    src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDH6KI9uFakxJUPrlnIVYC9XNH5uEWetF2KO67"
                    alt="Advisory team meeting"
                    width={1024}
                    height={844}
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                  <div className="stakeholder-overlay">
                    <h3>For Your Advisory Team</h3>
                    <div className="stakeholder-description">
                      <p>
                        Your CPA and tax counsel confirm the treatment for your
                        situation — we work alongside them, never instead of them.
                        The fee document and the 120-Day Roadmap are provided at
                        assessment, so your advisors see the same numbers you do.
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
<h2>Asked by founders, answered straight.</h2>
              <p className="section-intro">
                The five questions every founder asks first.
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
<h2>Find out whether your business qualifies.</h2>
            <p>
              Five questions. Two minutes. Free and confidential — we only ask
              for your contact details at the end if you want your results. If
              the fit is wrong, you will hear that from us first, along with
              what might fit better.
            </p>
            <div className="bo-cta-buttons">
              <button
                type="button"
                className="cta-button touch-target"
                onClick={() => openIntake("nda")}
              >
                Begin Confidential Intake
              </button>
              <Link href="/pricing" className="cta-button-ghost touch-target">
                See pricing and the guarantee
              </Link>
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

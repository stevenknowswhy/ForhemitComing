"use client";

import { useState } from "react";
import Link from "next/link";
import "./financial-accounting.css";

type TabId = "wealth-managers" | "cpas";

export default function FinancialAccounting() {
  const [activeTab, setActiveTab] = useState<TabId>("wealth-managers");

  return (
    <div className="financial-wrapper">
      <div className="financial-background"></div>

      {/* Logo Header */}
      <header className="financial-accounting-logo-header">
        <Link href="/" className="financial-logo-link">
          <span className="financial-logo-text">Forhemit</span>
          <span className="financial-logo-underline"></span>
        </Link>
      </header>

      <main className="financial-main">
        {/* Hero Section */}
        <section className="financial-hero">
          <div className="container">
            <div className="financial-hero-content">
              <span className="financial-eyebrow">Professional Partnerships</span>
              <h1 className="financial-title">
                Partner With Us to <span className="highlight">Serve Your Clients</span> Through Their Most Important Transition
              </h1>
              <p className="financial-intro">
                Financial advisors, CPAs, and accounting firms: Connect with us to explore how we can work together to help business owners navigate succession planning with ESOPs.
              </p>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="financial-tabs-section">
          <div className="container">
            {/* Tab Navigation */}
            <div className="tabs-nav">
              <button
                className={`tab-button ${activeTab === "wealth-managers" ? "active" : ""}`}
                onClick={() => setActiveTab("wealth-managers")}
              >
                <span className="tab-icon">📊</span>
                <span className="tab-label">Wealth Managers & Financial Advisors</span>
              </button>
              <button
                className={`tab-button ${activeTab === "cpas" ? "active" : ""}`}
                onClick={() => setActiveTab("cpas")}
              >
                <span className="tab-icon">📋</span>
                <span className="tab-label">CPAs & Accounting Firms</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "wealth-managers" ? (
                <div className="tab-panel">
                  <div className="panel-header">
                    <h2>You&apos;ve Spent Years Earning Their Trust. Don&apos;t Let One Transaction End It.</h2>
                    <p className="panel-lead">
                      The clients you&apos;ve guided through market cycles, retirement planning, and generational wealth decisions are quietly approaching the most consequential financial moment of their lives — and most of them haven&apos;t told you yet.
                    </p>
                  </div>

                  <div className="content-block">
                    <h3>The Transition Most Advisors Miss</h3>
                    <p>
                      More than half of small-business owners over age 55 will exit their companies within the next decade. That&apos;s an estimated 6 million businesses in the United States, representing trillions in accumulated value — most of it tied up in a single illiquid asset.
                    </p>
                    <p>
                      For your clients, this transition is personal. They didn&apos;t just build a business. They built a livelihood, a team, a legacy. How they exit will shape their financial future for decades. And it will determine whether you remain at the center of that future — or find yourself on the outside looking in.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-number">70%</div>
                      <p className="stat-description">of heirs switch financial advisors after inheriting wealth</p>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">52%+</div>
                      <p className="stat-description">of employer businesses are owned by people 55 and older</p>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">30%</div>
                      <p className="stat-description">of sale proceeds can be lost to capital gains taxes</p>
                    </div>
                  </div>

                  <div className="content-block">
                    <p>
                      When a founder sells to a private equity firm or strategic buyer, the dynamics shift immediately. New ownership consolidates vendors. Wealth management relationships are reviewed. The proceeds leave the business — and often leave your purview — in ways that are difficult or impossible to recapture.
                    </p>
                    <p>
                      This isn&apos;t a hypothetical. It happens every day to advisors who were never brought into the conversation early enough.
                    </p>
                  </div>

                  <div className="content-block highlight-block">
                    <h3>The Stewardship Model: A Better Path for Your Clients — and for You</h3>
                    <p>
                      Stewardship Management Company works with business owners to transition their companies into employee ownership through ESOPs (Employee Stock Ownership Plans). Our approach isn&apos;t just about closing a transaction. It&apos;s about building a transition that protects the seller&apos;s employees, preserves the company&apos;s independence, and — critically — unlocks a tax structure most advisors have never offered their clients.
                    </p>
                  </div>

                  <div className="content-block">
                    <h3>IRC Section 1042: The Tax Advantage Most Advisors Don&apos;t Know</h3>
                    <p>
                      When a C-Corporation founder sells to an ESOP, they may elect to defer <strong>100% of their capital gains taxes</strong> under IRC Section 1042 — provided they reinvest the proceeds into Qualified Replacement Property (QRP) within a specific window.
                    </p>
                    <p>
                      <strong>What this means for you:</strong> You build and manage the QRP portfolio. Your client defers a tax bill that could otherwise consume a quarter or more of their proceeds. You capture the full liquidity event as investable assets under your management — not a reduced remainder after taxes.
                    </p>
                    <p>
                      For a business owner selling a $10 million company, the difference between a traditional sale and a 1042-qualified ESOP sale could represent $2–3 million in capital gains taxes deferred or avoided entirely. That&apos;s $2–3 million that stays in your client&apos;s portfolio.
                    </p>
                    <p className="note">
                      <strong>Important:</strong> IRC Section 1042 applies to C-Corporations only. S-Corporation ESOPs have distinct but meaningful tax advantages — including elimination of corporate income tax on the ESOP-owned portion. We&apos;ll help you understand which structure applies to your client&apos;s situation.
                    </p>
                  </div>

                  <div className="content-block">
                    <h3>How the Partnership Works</h3>
                    <ol className="process-list">
                      <li>You introduce the Stewardship transition model to a client who is thinking about an exit — at any stage, even years before they&apos;re ready.</li>
                      <li>We collaborate with you and the client&apos;s advisory team to structure a transition that prioritizes their financial and personal goals.</li>
                      <li>You remain the architect of their wealth strategy — building and managing the QRP portfolio, guiding their post-exit financial plan, and deepening a relationship that could span decades more.</li>
                      <li>The client sells to an ESOP, their employees become owners, and their legacy stays intact. Their wealth stays with you.</li>
                    </ol>
                  </div>

                  <div className="content-block warning-block">
                    <h3>The Window Is Narrower Than You Think</h3>
                    <p>
                      Your clients are being approached. Private equity firms, business brokers, and M&A advisors are reaching out to boomer business owners every week. Once a client accepts a traditional offer, the transition is locked. The tax elections are gone. The relationship often follows.
                    </p>
                    <p>
                      By introducing the Stewardship model early — before your client gets deep into another process — you become the advisor who opened a door they didn&apos;t know existed. That&apos;s not just good service. That&apos;s irreplaceable positioning.
                    </p>
                  </div>

                  <div className="content-block">
                    <h3>What We&apos;re Asking You to Do</h3>
                    <p>
                      Think about two or three of your closest business-owner clients. Are any of them over 55? Have any of them mentioned a desire to slow down, transition, or protect their team? Have any of them received unsolicited interest from buyers?
                    </p>
                    <p>
                      That&apos;s where we start. We&apos;ll work with you to review which clients may be approaching a transition, model what a Stewardship exit could mean for their specific situation, and equip you with the language and materials to start the conversation naturally.
                    </p>
                    <p>
                      You don&apos;t need to be an ESOP expert. You need to be the advisor who brought the right people to the table.
                    </p>
                  </div>

                  <div className="cta-block">
                    <h3>Ready to explore a partnership?</h3>
                    <p>Contact our Stewardship team to schedule a confidential conversation about your client base and how we can work together to serve them through their most important financial transition.</p>
                    <Link href="/introduction" className="cta-button">
                      Connect With Us
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="tab-panel">
                  <div className="panel-header">
                    <h2>Your Best Corporate Clients Are Planning to Sell. Here&apos;s How to Make Sure You&apos;re Still Their CPA When They Do.</h2>
                    <p className="panel-lead">
                      As a trusted CPA, you may be the first person a business owner thinks of when they start to seriously consider an exit. That trust is built over years of tax filings, audits, and financial guidance. The Stewardship model is designed to help you honor that trust — and deepen it — at the moment it matters most.
                    </p>
                  </div>

                  <div className="content-block">
                    <h3>The Problem with a Traditional Business Sale</h3>
                    <p>
                      When one of your long-term corporate clients sells to a private equity firm or a strategic acquirer, the outcome is rarely good for your relationship — even when it&apos;s good for them financially.
                    </p>
                    <p>
                      PE buyers consolidate professional service vendors. Out-of-state acquirers bring their own accounting firms. Merged entities restructure their finance functions. In each of these scenarios, a client relationship you&apos;ve maintained for a decade or more can end within months of the transaction closing — not because you did anything wrong, but because the new ownership doesn&apos;t need what you offer.
                    </p>
                    <p>
                      And if the sale was poorly structured from a tax perspective, your client may look back and wonder why you didn&apos;t alert them to alternatives sooner.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-number">52%+</div>
                      <p className="stat-description">of employer businesses are owned by people over 55</p>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">$0</div>
                      <p className="stat-description">in federal corporate income tax owed on the ESOP-owned portion of an S-Corporation</p>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">📈</div>
                      <p className="stat-description">Growing compliance and valuation requirements for ESOPs</p>
                    </div>
                  </div>

                  <div className="content-block highlight-block">
                    <h3>The Stewardship Approach: What It Means for Your Practice</h3>
                    <p>
                      When a business transitions to employee ownership through a Stewardship ESOP, the company doesn&apos;t disappear into a PE roll-up. It stays intact. It stays local. And it continues to need exactly the kind of rigorous, relationship-based accounting support you already provide.
                    </p>
                    <p>
                      In fact, it needs more of it.
                    </p>
                  </div>

                  <div className="content-block">
                    <h3>The Corporate Work Stays With You</h3>
                    <p>
                      An ESOP transaction doesn&apos;t displace your corporate client — it deepens your role with them. The business continues to file taxes, conduct audits, and manage its financial operations. Because the company remains independent and locally rooted, there&apos;s no acquirer consolidating vendors or importing their own CPA relationship.
                    </p>
                    <p>
                      You keep the client you&apos;ve built. And in most cases, the work grows.
                    </p>
                  </div>

                  <div className="content-block">
                    <h3>ESOPs Create Specialized, Recurring Billable Work</h3>
                    <p>
                      ESOPs are not simple structures. They carry meaningful compliance obligations under ERISA and DOL regulations, and they require ongoing specialized accounting support that most general-practice CPAs aren&apos;t currently offering. Positioning your firm to serve ESOP clients — particularly as employee ownership grows nationally — is a durable way to expand your practice.
                    </p>
                    <ul className="feature-list">
                      <li>Annual independent valuations mandated by ERISA and DOL regulations</li>
                      <li>Complex plan administration and compliance filings specific to ESOP structures</li>
                      <li>Ongoing tax strategy for both the ESOP trust and the operating company</li>
                      <li>Form 5500 preparation and coordination with plan trustees and legal counsel</li>
                      <li>Seller tax planning, including QRP coordination for C-Corp 1042 elections</li>
                    </ul>
                    <p>
                      These are not one-time engagements. They are recurring, specialized, and increasingly valuable as employee ownership expands across the country.
                    </p>
                  </div>

                  <div className="content-block">
                    <h3>A Note on C-Corp vs. S-Corp ESOP Tax Treatment</h3>
                    <p>
                      Tax treatment differs meaningfully depending on corporate structure, and your clients will rely on you to guide them through these distinctions:
                    </p>
                    <div className="comparison-boxes">
                      <div className="comparison-box">
                        <h4>C-Corporation Sellers</h4>
                        <p>May elect to defer 100% of capital gains under IRC Section 1042 by reinvesting in Qualified Replacement Property. This is one of the most powerful — and underutilized — tax deferral mechanisms in the tax code.</p>
                      </div>
                      <div className="comparison-box">
                        <h4>S-Corporation Sellers</h4>
                        <p>Do not qualify for Section 1042 deferral, but benefit from a distinct advantage: the ESOP-owned portion of an S-Corp pays no federal income tax. For a 100% ESOP-owned S-Corp, this creates a permanent, ongoing tax benefit.</p>
                      </div>
                    </div>
                    <p className="note">
                      <strong>Note:</strong> Beginning in 2028, the SECURE 2.0 Act will allow S-Corp sellers to defer up to 10% of gains — a meaningful but distinct benefit from the C-Corp 1042 election.
                    </p>
                    <p>
                      Understanding these structures — and communicating them clearly to clients — positions you as an indispensable advisor during the transaction, not just afterward.
                    </p>
                  </div>

                  <div className="content-block">
                    <h3>The Conversation to Start Now</h3>
                    <p>
                      You likely have corporate clients who are in their late 50s or 60s, generating healthy cash flow, and quietly thinking about what comes next. Many of them haven&apos;t told you explicitly — but they&apos;ve dropped hints. They&apos;ve mentioned their kids aren&apos;t interested in taking over. They&apos;ve asked about what similar companies have sold for. They&apos;ve started paying themselves differently.
                    </p>
                    <p>
                      These are the clients worth approaching now, before they&apos;ve engaged a broker or received an offer. The earlier the conversation begins, the more options remain on the table — including options that protect your relationship, their employees, and their tax position simultaneously.
                    </p>
                  </div>

                  <div className="content-block">
                    <h3>How a Stewardship Partnership Works</h3>
                    <ol className="process-list">
                      <li>You introduce us to a client who is approaching, considering, or open to exploring a business transition.</li>
                      <li>We collaborate with you to model the tax and structural implications specific to their situation — C-Corp vs. S-Corp, deal size, ownership concentration, workforce profile.</li>
                      <li>We handle the transaction and transition process. You remain the trusted tax and accounting advisor throughout.</li>
                      <li>Post-transition, you continue to serve the company — with deeper, more specialized, and more valuable engagements.</li>
                    </ol>
                    <p>
                      We&apos;re not asking you to become an ESOP specialist. We&apos;re asking you to stay close to clients who are about to make the most significant financial decision of their professional lives — and to make sure they have all the options in front of them before they choose.
                    </p>
                  </div>

                  <div className="cta-block">
                    <h3>Let&apos;s talk about your client base.</h3>
                    <p>Schedule a confidential conversation with our Stewardship team to explore which of your clients may be approaching a transition and how we can help you serve them through it.</p>
                    <Link href="/introduction" className="cta-button">
                      Connect With Us
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sources Section */}
        <section className="sources-section">
          <div className="container">
            <h3>Sources & References</h3>
            <ol className="sources-list">
              <li>SEI / Cerulli Associates — Wealth Transfer Research (2021). Found that 70% of heirs switch financial advisors after inheriting wealth.</li>
              <li>McKinsey & Company — The Great Ownership Transfer (2026). Approximately 6 million small businesses will exit ownership over the next decade; 52.3% of employer businesses are run by owners age 55 and older.</li>
              <li>IRS Capital Gains Tax Rates (2025). Combined federal long-term capital gains rate can reach 23.8% for high earners. State taxes vary (e.g., California up to 13.3%).</li>
              <li>National Center for Employee Ownership (NCEO) — ESOPs in S Corporations. S-Corp ESOPs pay no federal income tax on the ESOP-owned portion.</li>
              <li>Corporate Valuations Inc. — ESOP Valuation Guide. ERISA and DOL regulations mandate annual independent valuations for ESOPs.</li>
              <li>RSM US LLP — Tax Deferral on ESOP Sales FAQ (2025). The SECURE 2.0 Act will allow S-Corp sellers to defer 10% of gains starting in 2028.</li>
            </ol>
            <p className="disclaimer">
              This document is for informational purposes only and does not constitute tax, legal, or investment advice. Consult qualified professionals before making any financial decisions.
            </p>
          </div>
        </section>
      </main>

    </div>
  );
}

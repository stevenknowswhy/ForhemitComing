"use client";

import Link from "next/link";

export function SolutionsSection() {
  return (
    <section className="about-section about-section-solutions">
      <div className="container">
        <div className="solutions-header">
          <span className="about-eyebrow">The Solution</span>
          <h2>One Solution. Three Problems Solved.</h2>
          <p className="solutions-intro">
            The &quot;Silver Tsunami&quot; of retiring owners, the displacement of workers by AI,
            and the erosion of local tax bases are often treated as separate crises. They
            aren&apos;t. They are three dimensions of the same disaster. Employee ownership is the
            single mechanism that addresses all three simultaneously.
          </p>
        </div>
        <div className="solutions-list">
          <div className="solution-item">
            <h3>
              <span className="solution-num">1.</span> Your Exit Plan — <em>Solved</em>
            </h3>
            <div className="solution-content">
              <p className="problem-text">
                <strong>The Problem:</strong> The market is saturated. With roughly 50 sellers for
                every one qualified buyer, most owners face a grim choice: sell at a steep discount,
                wait years for a deal that never comes, or simply close the doors.
              </p>
              <p className="mitigation-text">
                <strong>The Mitigation:</strong> Employee ownership eliminates the search. Your
                buyers are already in the building—trained, invested, and ready. You don&apos;t have
                to compete for a shrinking pool of outside investors or endure months of
                soul-crushing due diligence. We structure a professional, fair-market transaction
                that delivers the payout you&apos;ve earned on a timeline you control.
              </p>
            </div>
          </div>
          <div className="solution-item">
            <h3>
              <span className="solution-num">2.</span> Your Employees&apos; Fears — <em>Solved</em>
            </h3>
            <div className="solution-content">
              <p className="problem-text">
                <strong>The Problem:</strong> Employees are caught between two fires: heartless
                outside acquirers who cut staff to &quot;optimize&quot; returns, and the rising tide
                of AI automation. In both scenarios, the people who built your company are treated
                as line items to be erased.
              </p>
              <p className="mitigation-text">
                <strong>The Mitigation:</strong> We flip the equation. Instead of being victims of a
                transition, your employees become the buyers. Their jobs aren&apos;t just preserved;
                they are transformed into equity. When the workforce owns the company, AI isn&apos;t
                a threat from above—it&apos;s a tool they collectively control. The fear of being
                replaced is replaced by the agency of ownership.
              </p>
            </div>
          </div>
          <div className="solution-item">
            <h3>
              <span className="solution-num">3.</span> Business Vanishing — <em>Solved</em>
            </h3>
            <div className="solution-content">
              <p className="problem-text">
                <strong>The Problem:</strong> When a local pillar closes or is relocated by a
                distant corporate office, the community loses more than a company. It loses its tax
                base, its history, and its economic heart. One closure creates a ripple effect that
                touches every neighboring family and business.
              </p>
              <p className="mitigation-text">
                <strong>The Mitigation:</strong> Employee-owned businesses stay put. They are owned
                by the people who live in the neighborhood, whose kids go to local schools, and who
                spend their earnings at the coffee shop next door. The tax base remains, the jobs
                remain, and the identity of the community stays intact. Employee ownership
                doesn&apos;t just keep a company in town—it roots it there permanently.
              </p>
            </div>
          </div>
        </div>
        <div className="solutions-result">
          <p className="result-text">
            <strong>The Result:</strong> One mechanism. Three crises resolved. You get your payout.
            Your employees get ownership. Your community keeps its foundation.
          </p>
          <p className="result-closing">This is the resilience Forhemit was built to deliver.</p>
          <p className="result-next">
            <Link href="/four-month-path">See our 4-month path →</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

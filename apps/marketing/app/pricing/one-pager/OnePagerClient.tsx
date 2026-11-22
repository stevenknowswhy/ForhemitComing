"use client";

import Link from "next/link";
import "./onepager.css";

export function OnePagerClient() {
  return (
    <div className="op-outer">
      <div className="op-sheet">
        <header className="op-head">
          <p className="op-wordmark">Forhemit</p>
          <button type="button" className="op-print-btn" onClick={() => window.print()}>
            Print / save as PDF
          </button>
        </header>

        <h1 className="op-title">Selling your business to your employees — the two offers</h1>
        <p className="op-lede">
          Forhemit helps founders sell their business to their employees — 100% employee
          ownership, at a price set by an independent valuation. There are two ways to work
          with us.
        </p>

        <div className="op-offers">
          <div className="op-offer">
            <h2>Self Guided Transition Service — $3,000 one-time</h2>
            <p>
              You run your own transition, with the complete toolkit: your personalized
              120-Day Roadmap, vetted Preferred Partners introduced at each stage, financing
              help to lender standard, the checklist-first document vault, and closing
              coordination. Support by portal messaging within one business day, plus one
              kickoff call.
            </p>
            <p>
              <strong>Guarantee:</strong> full refund at any time before your roadmap is
              delivered, and for 14 days after — any reason, no argument. Full refund at any
              time if Forhemit declines you.
            </p>
            <p>
              <strong>Upgrade Credit:</strong> start Custom Services within 12 months and the
              full $3,000 is credited toward it.
            </p>
          </div>
          <div className="op-offer">
            <h2>Custom Services — 3–5% of valuation</h2>
            <p>
              A dedicated lead runs the Four-Month Path with you — the same roadmap, partners, financing, and closing, with Forhemit doing the running. Our fee: 3–5% of valuation, in writing after independent valuation. Professional partners are paid by you directly, at estimates you approve first — the full cost picture is on our Pricing page.
            </p>
            <p>
              <strong>Start:</strong> book a call. No figure is agreed until you have seen it
              in writing, after an independent valuation.
            </p>
          </div>
        </div>

        <h2 className="op-h2">How buying works — payment only after approval</h2>
        <p className="op-body">
          It works like a loan application. <strong>1. Prequalification:</strong> the free
          2-Minute Check — five yes-or-no questions, an instant answer.{" "}
          <strong>2. Company Fit:</strong> sixteen questions about the company's shape; you
          see a band and the reasons, never a bare score. <strong>3. Application:</strong>{" "}
          company details and document declarations under an NDA — then, and only then, you
          can pay. If your company doesn't qualify, you pay nothing. Your inquiry is
          confidential: nothing is shared with your employees, lenders, or anyone else.
        </p>

        <h2 className="op-h2">How we make money — and how we don't</h2>
        <p className="op-body">
          We make money two ways: the $3,000 Self Guided price, and the Custom Services fee.
          That is all. We do not receive any money or anything else of value — monetary or
          non-monetary — from any of our professional partners. We do not pay referral fees
          or anything else of value for introductions, and we do not promise reciprocal
          referrals. Partner recommendations are never requirements: use your own
          professionals, or change any of ours at any time — your price, your roadmap, and
          our support stay exactly the same.
        </p>

        <footer className="op-foot">
          <p>
            Forhemit was founded in 2026. We are new, and we say so. Forhemit is run by
            Stefano Stokes, Founder &amp; CEO.
          </p>
          <p>
            contact@forhemit.com · (510) 768-7588 · Full details:{" "}
            <Link href="/pricing">forhemit.com/pricing</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

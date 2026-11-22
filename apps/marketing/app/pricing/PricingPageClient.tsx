"use client";

import Link from "next/link";
import { useState, lazy, Suspense } from "react";
import "./pricing.css";

/** Canonical partner-compensation disclaimer (harmonised site-wide 2026-11-17). */
const PARTNER_COMPENSATION_DISCLAIMER =
  "We do not receive any money or anything else of value — monetary or non-monetary — from any of our professional partners. We do not pay referral fees or anything else of value for introductions, and we do not promise reciprocal referrals.";

const TwoMinuteCheckModal = lazy(() =>
  import("@/app/home/intake").then((mod) => ({ default: mod.TwoMinuteCheckModal }))
);

const PARTNER_FREEDOM_LINE =
  "These are recommendations, not requirements. Use your own professionals, or change any of ours at any time — your price, your roadmap, and our support stay exactly the same.";

const SELF_SERVICE_SHORT_LIST = [
  "Your 120-Day Roadmap — a plan built from your company's own answers and documents",
  "Preferred Partners — vetted ESOP professionals, introduced at the right stage",
  "Financing Help — your package brought to lender standard",
  "Document Storage & Organization — the checklist-first vault for every document",
  "Closing Services — the closing run as a coordinated checklist",
];

const CONTRAST_ROWS: { label: string; self: string; custom: string }[] = [
  {
    label: "Who runs the work",
    self: "You do, with the toolkit and our support behind you",
    custom: "A dedicated Forhemit lead runs it with you",
  },
  {
    label: "The plan",
    self: "Your personalized 120-Day Roadmap, tracked in the portal",
    custom: "The Four-Month Path, worked month by month with your lead",
  },
  {
    label: "Partners",
    self: "Vetted introductions at each stage; you engage them directly",
    custom: "The same partners, coordinated for you",
  },
  {
    label: "Price",
    self: "$3,000 one-time",
    custom: "3–5% of valuation, set in a written fee document",
  },
  {
    label: "Support",
    self: "Portal messaging answered within one business day, plus one kickoff call",
    custom: "Your lead, throughout the 120 days",
  },
  {
    label: "If it goes wrong",
    self: "Full refund before your roadmap is delivered, and for 14 days after",
    custom: "No figure is agreed until you have seen it in writing, after an independent valuation",
  },
];

const PARTNER_CATEGORIES = [
  "ESOP / employee-ownership attorney",
  "CPA with ESOP transaction experience",
  "Independent valuation firm — the appraisal the price rests on",
  "ESOP lender(s)",
  "Independent trustee",
  "Third-party administrator (TPA) for the plan after closing",
  "§1042 qualified-replacement-property advisor, for your personal side",
];

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "How does the Upgrade Credit work?",
    a: "Buy Self Guided and start Custom Services within 12 months, and the full $3,000 is credited toward the Custom Services fee. After 12 months, the credit no longer applies.",
  },
  {
    q: "What happens if Forhemit declines my application?",
    a: "You are refunded in full, at any time — the decline refund has no window. And you are never charged before approval in the first place: payment happens only after an approved application.",
  },
  {
    q: "How long does my access last?",
    a: "Twelve months of full access from purchase. After that, the portal goes read-only — and your documents stay exportable forever.",
  },
  {
    q: "Who are the partners, and do you earn referral fees?",
    a: (
      <>
        The categories are listed above, and the vetting criteria are published on this page. On
        fees: {PARTNER_COMPENSATION_DISCLAIMER}
      </>
    ),
  },
  {
    q: "Can I use my own professionals?",
    a: PARTNER_FREEDOM_LINE,
  },
  {
    q: "When do I pay?",
    a: "Only after your application is approved — never before. The check and Company Fit are free and anonymous; identifying details begin only at the application, under an NDA.",
  },
  {
    q: "What does Self Guided never include?",
    a: "A dedicated lead, or Forhemit performing the transition steps — that is Custom Services. Legal, tax, or valuation work itself — partners do that work under their own engagements. Any guarantee of financing, valuation, or closing — the guarantee in this product is the money-back guarantee, and it is about our fee, not the deal's outcome. And holding client funds, in any amount, at any stage.",
  },
];

export function PricingPageClient() {
  const [showCheck, setShowCheck] = useState(false);

  const openCheck = () => setShowCheck(true);

  return (
    <div className="pr-outer">
      {/* ── Hero ── */}
      <section className="pr-hero">
        <p className="pr-eyebrow">Pricing</p>
        <h1 className="pr-title">Two ways to sell your business to your employees.</h1>
        <p className="pr-lede">
          Run the transition yourself, with the complete toolkit and our partners behind you — or
          have Forhemit run it with you, month by month. Either way, the destination is the same:
          your employees own 100% of the company.
        </p>
      </section>

      {/* ── The two offers ── */}
      <section className="pr-section" id="offers">
        <h2 className="pr-h2">The two offers, in the open.</h2>
        <div className="pr-cards">
          <article className="pr-card">
            <p className="pr-card-eyebrow">Self Guided Transition Service</p>
            <p className="pr-price">
              $3,000 <span className="pr-price-note">one-time</span>
            </p>
            <p className="pr-card-body">
              Why $3,000: everything a transition needs except the person running it — the roadmap,
              the partners, the financing help, the document system, and closing coordination. A
              led engagement costs 3–5% of valuation because a dedicated lead runs the 120 days with you.
            </p>
            <ul className="pr-list">
              {SELF_SERVICE_SHORT_LIST.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="pr-card-body">
              Partner fees are separate, paid by you directly to the professional — you receive a
              written estimate and approve it before any work starts.
            </p>
            <button type="button" className="pr-btn pr-btn-primary" onClick={openCheck}>
              Check if you qualify
            </button>
            <p className="pr-under-cta">
              Covered by the money-back guarantee below: full refund before your roadmap is
              delivered, and for 14 days after.
            </p>
            <p className="pr-credit">
              Start Custom Services within 12 months and the full $3,000 is credited toward it.
            </p>
          </article>

          <article className="pr-card">
            <p className="pr-card-eyebrow">Custom Services</p>
            <p className="pr-price">
              3–5% <span className="pr-price-note">of valuation</span>
            </p>
            <p className="pr-card-body">
              Forhemit's Custom Services fee is 3–5% of the independent valuation, set in a written fee document after that valuation. It is our fee for running your transition. The independent professionals your transition needs — attorney, valuation firm, trustee, lender, administrator — are engaged by you directly and paid by you directly, each after a written estimate you approve. Their fees are not included in our 3–5%, and we publish what they typically add, below, because you should see the whole cost before you start, not after.
            </p>
            <p className="pr-card-body">
              What it adds: a dedicated lead runs the Four-Month Path with you — the same roadmap,
              partners, financing, and closing, with Forhemit doing the running: scheduling,
              chasing, coordinating, and keeping the sequence in order.
            </p>
            <Link href="/contact" className="pr-btn pr-btn-secondary">
              Book a call
            </Link>
            <p className="pr-under-cta">
              No figure is agreed until you have seen it in writing, after an independent
              valuation — the appraiser works for neither side.
            </p>
            <p className="pr-credit">
              Start with Self Guided and the full $3,000 is credited toward Custom Services if you start within 12 months.
            </p>
          </article>
        </div>
        <p className="pr-onepager-line">
          Deciding with a spouse, a CPA, or a co-owner?{" "}
          <Link href="/pricing/one-pager">The one-page summary</Link> puts both offers, the
          guarantee, and the gates on a single page you can hand them.
        </p>
      </section>

      {/* ── What the whole transition costs (P0 D1/D2) ── */}
      <section className="pr-section" id="costs">
        <h2 className="pr-h2">What the whole transition costs.</h2>
        <p className="pr-body pr-narrow">
          Our fee is only one part of the cost of selling to an ESOP. On market ranges published
          by the National Center for Employee Ownership (2026), the professional work around a
          transition typically adds: legal $50,000–$150,000; independent valuation
          $20,000–$50,000; trustee $25,000–$70,000; and, if a formal feasibility study is
          required, $25,000–$50,000. Simpler transactions can come in below these ranges.
        </p>
        <table className="pr-cost-table">
          <thead>
            <tr>
              <th scope="col">Professional component</th>
              <th scope="col">Market range</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Legal</td>
              <td>$50,000–$150,000</td>
            </tr>
            <tr>
              <td>Independent valuation</td>
              <td>$20,000–$50,000</td>
            </tr>
            <tr>
              <td>Trustee</td>
              <td>$25,000–$70,000</td>
            </tr>
            <tr>
              <td>Feasibility study, if required</td>
              <td>$25,000–$50,000</td>
            </tr>
            <tr className="pr-cost-total">
              <td>Components in total</td>
              <td>$120,000–$320,000</td>
            </tr>
          </tbody>
        </table>
        <p className="pr-note">
          Market ranges — National Center for Employee Ownership (2026). These are market
          ranges, not Forhemit partner prices; named partner estimates replace them when those
          are published.
        </p>
        <p className="pr-body pr-narrow">
          At a $5M valuation, a realistic all-in cost — our fee included — is roughly
          $270,000–$570,000, in line with the $250,000–$500,000 NCEO reports for most ESOP
          deals. At a $2M valuation those same fixed costs are a much larger share of the price,
          and for some companies an ESOP does not pencil at all. Our Company Fit check tests
          that before you pay anything, and if the numbers do not work we will tell you so — you
          pay nothing unless your application is approved.
        </p>
      </section>

      {/* ── Feasibility comparison + boundary (P0 D7 — always together) ── */}
      <section className="pr-section" id="feasibility">
        <h2 className="pr-h2">Why this costs $3,000, not $25,000.</h2>
        <p className="pr-body pr-narrow">
          A standalone ESOP feasibility study typically costs $25,000–$50,000 (National Center
          for Employee Ownership, 2026). The Self Guided Transition Service is not that study —
          read the boundary below before you compare them. What the $3,000 buys is the plan and
          the machinery around it: your personalised 120-Day Roadmap built from your own
          company's answers and documents, introductions to vetted professionals at the right
          stage, your financing package brought to lender standard, the document vault, and
          closing coordination — with a full refund before your roadmap is delivered and for 14
          days after, and the full $3,000 credited toward Custom Services if you start within 12
          months.
        </p>
        <div className="pr-boundary">
          <h3 className="pr-h3">What a formal feasibility study adds — and who provides it.</h3>
          <p className="pr-body">
            A formal feasibility study models your transaction before you commit: an estimated
            transaction price, after-tax cash flow to you as seller, your financing options, a
            C-corp vs S-corp recommendation, and expected costs and timeline. If your lender,
            trustee, or your own advisors require one, it is provided by a qualified partner —
            market range $25,000–$50,000 — and, like every partner engagement, you receive a
            written estimate and approve it before any work starts. The roadmap directs your
            transition; it does not replace a study your deal's parties require.
          </p>
        </div>
      </section>

      {/* ── Which offer ── */}
      <section className="pr-section" id="which">
        <h2 className="pr-h2">Which offer is for you?</h2>
        <p className="pr-body pr-narrow">
          Choose Self Guided if you have the time to run your own transition and want the
          toolkit, the partners, and the plan. Choose Custom Services if you want a dedicated
          lead running the 120 days with you.
        </p>
        <div className="pr-contrast" role="table" aria-label="Self Guided compared with Custom Services">
          <div className="pr-contrast-head" role="row">
            <span role="columnheader" aria-label="Compared point" />
            <span role="columnheader">Self Guided</span>
            <span role="columnheader">Custom Services</span>
          </div>
          {CONTRAST_ROWS.map((row) => (
            <div className="pr-contrast-row" role="row" key={row.label}>
              <span className="pr-contrast-label" role="rowheader">{row.label}</span>
              <span role="cell">{row.self}</span>
              <span role="cell">{row.custom}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── What's inside Self Guided ── */}
      <section className="pr-section" id="inside">
        <h2 className="pr-h2">What's inside Self Guided.</h2>
        <p className="pr-body pr-narrow">
          Five deliverables, spelled out — including what each one does not include.
        </p>

        <div className="pr-deliverables">
          <article className="pr-deliverable">
            <h3 className="pr-h3">1. The 120-Day Roadmap</h3>
            <p className="pr-body">
              A written plan for your transition — not the generic path. It is generated from
              your own answers and checklist declarations, so the steps, owners, and dates
              reflect your company: your entity type, your owners, your gaps.
            </p>
            <ul className="pr-list">
              <li>Month by month across the four stages: Readiness &amp; Valuation, Structure &amp; Financing, Legal &amp; Compliance, Close &amp; Handover.</li>
              <li>Every step named with what happens, who does it, and what "done" looks like — the document, signature, or decision that closes it.</li>
              <li>Your gaps built in as tasks, with a how-to note for each — never as surprises.</li>
              <li>It lives in the portal as a tracker, and exports as a single document you can hand to your CPA, attorney, or co-owners.</li>
            </ul>
            <p className="pr-note">
              The roadmap is a plan built from your own documents — 120 days from Documents-Ready when documents and partners move on time. It is a plan, not a promise of outcome.
            </p>
            <p className="pr-not-included">
              Not included: Forhemit does not perform the steps that belong to you or your
              partners — preparing financials, drafting plan documents, the valuation itself.
              The roadmap directs the work; Custom Services is the offer where we run it with
              you.
            </p>
          </article>

          <article className="pr-deliverable">
            <h3 className="pr-h3">2. Preferred Partners</h3>
            <p className="pr-body">
              The named professionals and firms a Self Guided client needs and does not know
              how to find — vetted by Forhemit, introduced through the portal when your roadmap
              reaches their stage. You are never handed a cold list and left to guess the
              order.
            </p>
            <ul className="pr-list">
              {PARTNER_CATEGORIES.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="pr-body">
              How a professional gets on the list — the published criteria: ESOP-specific
              experience, meaning transactions like yours, not general practice. For each
              category you receive at least one named partner — firm, contact person, direct
              details — and a short note on what to send first and what questions to ask before
              signing.
            </p>
            <p className="pr-note">{PARTNER_FREEDOM_LINE}</p>
            <p className="pr-body">
              Before you engage any recommended professional, you receive a written estimate of
              their fee and approve it before work starts. Their fees are paid by you,
              directly — never marked up or collected by Forhemit. A typical range for partner
              fees will be published once real transaction data exists.
            </p>
          </article>

          <article className="pr-deliverable">
            <h3 className="pr-h3">3. Financing Help</h3>
            <p className="pr-body">
              Getting your financing package to lender standard and in front of ESOP lenders —
              the step where self-run transitions most often stall.
            </p>
            <ul className="pr-list">
              <li>A readiness review of your package against what lenders ask for, with every gap named and a task to close it.</li>
              <li>Your package assembled in the vault in the order lenders review it, so what they receive is complete the first time.</li>
              <li>Introductions to ESOP lenders from the partners list — or the same help with your own lender, if you prefer. Partner freedom applies here too.</li>
              <li>A term-sheet comparison worksheet when offers come back: rate, term, covenants, and personal-guarantee requirements side by side. Our standard is no personal guarantees — a term sheet demanding one is flagged as off-standard.</li>
            </ul>
            <p className="pr-not-included">
              Not included: Forhemit is not a lender, does not broker loans, and cannot promise
              an approval, a rate, or a timeline — those are the lender's decisions. Negotiation
              and signing are yours, with your own counsel and CPA. No fee is charged by
              Forhemit on the financing, and no lender pays Forhemit.
            </p>
          </article>

          <article className="pr-deliverable">
            <h3 className="pr-h3">4. Document Storage &amp; Organization</h3>
            <p className="pr-body">
              One structured place for every document the transition needs — the portal vault,
              replacing the email-and-shared-drive sprawl that loses documents and stalls
              closings.
            </p>
            <ul className="pr-list">
              <li>A checklist in seven sections: Company &amp; ownership; Financials; Tax &amp; compliance; People &amp; payroll; Debts &amp; contracts; Legal &amp; insurance; Founder.</li>
              <li>Declaration first, uploads second: for every item you first say Have it / Don't have it / Doesn't apply / Need help getting it. Only "Have it" opens an upload slot; "Don't have it" becomes a task with a how-to note. A missing document is never a dead end.</li>
              <li>Every upload is reviewed and lands as Accepted, or Needs Replacement with a plain-language reason — no silent rejections. Each item shows why it is needed and who will see it before you upload anything.</li>
              <li>One-click full export at any time — your documents are yours. After the access period the vault is read-only, and export stays available.</li>
            </ul>
            <p className="pr-body">
              Access to the vault is limited to you and the Forhemit reviewers named in the
              item descriptions.
            </p>
          </article>

          <article className="pr-deliverable">
            <h3 className="pr-h3">5. Closing Services</h3>
            <p className="pr-body">
              Forhemit runs the closing as a coordinated process — the checklist, the sequence,
              the people — so the deal you built actually lands.
            </p>
            <ul className="pr-list">
              <li>A closing checklist derived from your roadmap's Month 4: every document, signature, approval, and payment instruction, each with its owner and its status.</li>
              <li>Closing coordination: scheduling, tracking which party holds each open item, chasing the gaps, keeping the sequence in order.</li>
              <li>A closing call run by Forhemit, walking the checklist to zero open items before signatures are exchanged.</li>
              <li>A post-close handover checklist — including your transition-period availability schedule, set up in writing: 4 to 12 months after close, on call for check-ins, introductions, and questions, not working hands-on.</li>
            </ul>
            <p className="pr-not-included">
              Not included: legal advice, tax advice, and signing authority — those stay with
              your own attorney and CPA. Forhemit runs the closing checklist and coordinates
              the closing; the parties and their own counsel sign; funds move through their
              own arrangements. Forhemit never holds client funds.
            </p>
          </article>
        </div>

        <div className="pr-never">
          <h3 className="pr-h3">What Self Guided never includes</h3>
          <ul className="pr-list">
            <li>A dedicated lead, or Forhemit performing the transition steps — that is Custom Services.</li>
            <li>Legal, tax, or valuation work itself — partners do that work under their own engagements.</li>
            <li>Any guarantee of financing, valuation, or closing — the guarantee in this product is the money-back guarantee, and it is about our fee, not the deal's outcome.</li>
            <li>Holding client funds, in any amount, at any stage.</li>
          </ul>
          <p className="pr-body">
            And a named human: support runs through portal messaging, answered within one
            business day, plus one kickoff call where we walk your roadmap through with you.
          </p>
        </div>
      </section>

      {/* ── How we make money ── */}
      <section className="pr-section" id="money">
        <h2 className="pr-h2">How we make money — and how we don't.</h2>
        <p className="pr-body pr-narrow">
          We make money two ways: the $3,000 Self Guided price, and the Custom Services fee of 3–5% of valuation. That is all.
        </p>
        <p className="pr-body pr-narrow">{PARTNER_COMPENSATION_DISCLAIMER}</p>
        <p className="pr-body pr-narrow">
          Partners pay us nothing and we pay partners nothing. Their fees are yours to agree
          with them directly — always with a written estimate you approve before work starts.
        </p>
      </section>

      {/* ── How buying works ── */}
      <section className="pr-section" id="how-buying-works">
        <h2 className="pr-h2">How buying works.</h2>
        <p className="pr-callout">
          Your inquiry is confidential. Nothing is shared with your employees, lenders, or
          anyone else. You sign an NDA with us before you upload anything that identifies your
          company.
        </p>
        <p className="pr-body pr-narrow">
          It works like a loan application: prequalify, show us the shape of your company, then
          the full application.
        </p>
        <div className="pr-gates-grid">
          <div className="pr-gate-fact">
            <h3 className="pr-h4">Why the gates exist</h3>
            <p>So you never pay for a transition your company cannot support. The standard is the same one our full engagements use.</p>
          </div>
          <div className="pr-gate-fact">
            <h3 className="pr-h4">If you don't qualify, you pay nothing</h3>
            <p>Payment happens only after your application is approved. An ineligible company is never charged.</p>
          </div>
          <div className="pr-gate-fact">
            <h3 className="pr-h4">How long it takes</h3>
            <p>The check answers instantly. Company Fit takes a few minutes. An application gets a response within 2 business days: a decision, or a specific named request for what's missing.</p>
          </div>
          <div className="pr-gate-fact">
            <h3 className="pr-h4">What we ask</h3>
            <p>Questions about your company first. Documents by declaration — you tell us what you have before you upload anything. Your name and company details only at the application, under the NDA.</p>
          </div>
        </div>
        <ol className="pr-steps">
          <li>
            <h3 className="pr-h3">1. Check you qualify — Prequalification</h3>
            <p className="pr-body">
              The free 2-Minute Check: five yes-or-no questions about the business, and an
              instant eligibility answer. Nothing you type into the check identifies you — the
              site records anonymous metadata only (founder or professional, kind of work,
              industry, and the answers), so we can understand who the check serves.
            </p>
            <button type="button" className="pr-text-btn" onClick={openCheck}>
              Run the check →
            </button>
          </li>
          <li>
            <h3 className="pr-h3">2. Show us the shape of your company — Company Fit</h3>
            <p className="pr-body">
              Sixteen questions in four groups — financial, company &amp; ownership, people,
              founder. You see a band and the reasons, never a bare score, and "not sure" never
              fails you on its own. Some companies pass with a conversation: a structural gap
              we talk through with you rather than a verdict from a form.
            </p>
          </li>
          <li>
            <h3 className="pr-h3">3. Your application — then you can pay</h3>
            <p className="pr-body">
              Company details and document-checklist declarations, under the terms and the NDA —
              with a plain-language summary of the NDA beside the agreement itself. Then you
              can pay: $3,000 by card, only after approval. Uploads unlock inside the portal
              after payment.
            </p>
          </li>
        </ol>
        <p className="pr-body pr-narrow">
          On the Custom path instead? <Link href="/contact">Book a call</Link> — the call stays
          available at every step of both paths.
        </p>
      </section>

      {/* ── Guarantee ── */}
      <section className="pr-section" id="guarantee">
        <h2 className="pr-h2">The guarantee, in the open.</h2>
        <p className="pr-body pr-narrow">
          Full refund at any time before your 120-Day Roadmap is delivered, and for 14 days
          after delivery — any reason, no argument, one click in the portal. If Forhemit
          declines your application, the refund is full at any time.
        </p>
        <p className="pr-body pr-narrow">
          On a refund, portal access closes and live services end. Documents already delivered
          stay yours; your uploads are exportable, then deleted from our side.
        </p>
        <p className="pr-body pr-narrow">
          <strong>If we miss a date that is ours, it costs us, not you.</strong> If a milestone
          Forhemit controls slips by more than ten business days, Self Guided clients may take a
          full $3,000 refund — the roadmap already delivered stays yours — and Custom Services
          clients receive a $3,000 credit against the fee for each such milestone, and may end
          the engagement at the next stage gate with fees only for stages already completed.
        </p>
      </section>

      {/* ── The clock (P0 D4/D5) ── */}
      <section className="pr-section" id="clock">
        <h2 className="pr-h2">120 days from Documents-Ready.</h2>
        <p className="pr-body pr-narrow">
          The clock starts the day your documents are complete and accepted — not the day you
          first talk to us. Most ESOPs take six to twelve months. Ours is built to run in 120
          days because the four tracks run in parallel and the gates come first, before you pay.
        </p>
        <h3 className="pr-h3">When the clock starts.</h3>
        <p className="pr-body pr-narrow">
          Documents-Ready means three things have happened: (1) your application is approved;
          (2) every CORE item on your document checklist is Accepted, or waived in writing by
          Forhemit; (3) your kickoff call has been held and your roadmap issued. Day 1 is the
          first business day after all three. You can see your clock, and what it is waiting on,
          in your portal at any time.
        </p>
        <h3 className="pr-h3">The four tracks run in parallel.</h3>
        <p className="pr-body pr-narrow">
          Days 1–30: valuation instructed and running; financing package assembled. Days 31–60:
          valuation delivered; lender term sheets compared; structure and legal drafting under
          way. Days 61–90: legal documents completed; trustee review; employee communication
          prepared (your employees learn of the transition in this window, on the schedule you
          approved). Days 91–120: closing checklist walked to zero; signatures; handover
          schedule set in writing.
        </p>
        <h3 className="pr-h3">When the clock pauses.</h3>
        <p className="pr-body pr-narrow">
          The clock pauses — visibly, in your portal, with the reason named — when it is waiting
          on: documents requested from you that are outstanding more than five business days; a
          valuation question that needs information only you or your CPA hold; a lender or
          trustee queue beyond the window they stated when engaged; a hold you ask for; or a
          regulatory or filing delay outside any party's control.{" "}
          <strong>The clock never pauses for a delay that is Forhemit's.</strong>
        </p>
      </section>

      {/* ── New, and verifiable ── */}
      <section className="pr-section" id="verify">
        <h2 className="pr-h2">New, and verifiable.</h2>
        <p className="pr-body pr-narrow">
          Forhemit was founded in 2026. We are new, and we say so.
        </p>
        <p className="pr-body pr-narrow">
          What stands in place of a track record: the money-back guarantee above; a full refund
          if we decline you; and, on Custom engagements, a price that rests on an independent
          valuation — set by an appraiser who works for neither side.
        </p>
        <p className="pr-body pr-narrow">
          Verify us for yourself. Forhemit is run by Stefano Stokes, Founder &amp; CEO — one
          accountable lead, named on the <Link href="/about">About page</Link>. Read the fee
          document before you sign anything, ask any partner on the list how they were vetted,
          and run the free check before you spend a dollar.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section className="pr-section" id="faq">
        <h2 className="pr-h2">Questions, answered straight.</h2>
        <div className="pr-faqs">
          {FAQS.map((f) => (
            <div className="pr-faq" key={f.q}>
              <h3 className="pr-h4">{f.q}</h3>
              <p className="pr-body">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing ── */}
      <section className="pr-section pr-closing">
        <h2 className="pr-h2">Find out whether your business qualifies.</h2>
        <p className="pr-body pr-narrow">
          The check is free, anonymous, and takes about two minutes. It is the same standard we
          apply to every business — and if the answer is not yet, it tells you exactly what
          would have to change.
        </p>
        <button type="button" className="pr-btn pr-btn-primary" onClick={openCheck}>
          Start the free assessment
        </button>
        <p className="pr-onepager-line">
          Or hand someone the whole picture first:{" "}
          <Link href="/pricing/one-pager">the one-page summary</Link>.
        </p>
      </section>

      {showCheck && (
        <Suspense fallback={null}>
          <TwoMinuteCheckModal
            isOpen={showCheck}
            onClose={() => setShowCheck(false)}
            onPassProceed={() => {
              setShowCheck(false);
              document
                .querySelector("#how-buying-works")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

import type { ELData } from "./types";
import { calcFee, fmt } from "./calculations";

function formatContractDate(iso: string): string {
  if (!iso?.trim()) return "—";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  return new Date(t).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Printable / PDF-capture contract — mirrors forhemit_engagement_form_REVISED.html `generatePDF` text.
 */
export default function EngagementContractDocument({
  d,
  fee,
}: {
  d: ELData;
  fee: ReturnType<typeof calcFee>;
}) {
  const evNum = parseFloat(d.ev) || 0;
  const evDisplay = evNum > 0 ? fmt(evNum) : "—";
  const successFee = fee.tier === 0 ? "$25,000" : fee.fee;
  const genDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const venueParagraph = d.venue_county.trim()
    ? `County / venue for arbitration administration ("Arbitration County"): ${d.venue_county.trim()} County, ${d.gov_law || "__________"}. The Parties agree this county is used to establish the arbitration location, and that any court proceeding permitted solely for injunctive relief to protect confidential information or proprietary rights may be brought in the state or federal courts located in the Arbitration County.`
    : `County / venue for arbitration administration: The Parties will use the county specified by the Company to establish the arbitration location, and any court proceeding permitted solely for injunctive relief may be brought in the state or federal courts located in such county.`;

  const tailNote = d.tail
    ? `Tail election (form): ${d.tail}. If Company closes a transaction with a party introduced or identified by Forhemit within 180 days of termination, the success fee is owed, provided Forhemit gave written notice prior to termination. Tail does NOT apply if terminated for Forhemit's material breach.`
    : "Tail provision: as set forth in the fully executed agreement.";

  return (
    <div className="el-contract-inner">
      <header className="el-cd-cover">
        <h1 className="el-cd-brand">FORHEMIT</h1>
        <p className="el-cd-tag">Transition Stewardship</p>
        <h2 className="el-cd-title">ENGAGEMENT LETTER</h2>
        <p className="el-cd-subtitle">Transaction Stewardship Services Agreement (Revised v1.1)</p>
        <hr className="el-cd-rule" />
        <dl className="el-cd-meta">
          <div><dt>Company (Client)</dt><dd>{d.s_company.trim() || "—"}</dd></div>
          <div><dt>Authorized Officer</dt><dd>{[d.officer_name, d.officer_title].filter(Boolean).join(", ") || "—"}</dd></div>
          <div><dt>Effective Date</dt><dd>{formatContractDate(d.s_date)}</dd></div>
          <div><dt>Engagement Reference</dt><dd>{d.s_ref.trim() || "—"}</dd></div>
        </dl>
        <hr className="el-cd-rule" />
        <p className="el-cd-footer-note">Forhemit Transition Stewardship | forhemit.com | deals@forhemit.com</p>
      </header>

      <div className="el-cd-terms">
      <section className="el-cd-section">
        <h3>1. Parties and Nature of Engagement</h3>
        <p>
          This Engagement Letter (&quot;Agreement&quot;) is entered into between Forhemit Transition Stewardship, a California Public Benefit Corporation (&quot;Forhemit&quot;), and{" "}
          {d.s_company.trim() || "__________"} (&quot;Company&quot;), acting through {d.officer_name.trim() || "__________"}, {d.officer_title.trim() || "__________"}.
        </p>
        <p>
          Forhemit is a transaction stewardship firm. Forhemit facilitates employee ownership transitions — coordinating the transaction team, managing the process timeline, preparing the lender and trustee package, and providing post-close operational stewardship.
        </p>
        <p>
          <strong>IMPORTANT:</strong> Forhemit is not a buyer, investor, lender, broker, attorney, or financial advisor. All fees are paid by the Company as operating business expenses.
        </p>
        <p>
          <strong>ERISA DISCLAIMER:</strong> Forhemit is NOT an ERISA fiduciary. All ERISA matters must be reviewed by independent ERISA counsel.
        </p>
        <p>
          <strong>TAX DISCLAIMER:</strong> Forhemit does NOT provide tax advice. All tax matters must be reviewed by independent tax professionals.
        </p>
      </section>

      <section className="el-cd-section">
        <h3>3. Retainer</h3>
        <p>
          The Company agrees to pay Forhemit a non-refundable retainer of $25,000, payable from the Company&apos;s operating account by {formatContractDate(d.retainer_date)} via {d.retainer_method}. The Retainer is earned in full at execution. It does not apply toward the Transition Success Fee.
        </p>
        <p>
          <strong>LIMITED REFUND EXCEPTION:</strong> The Retainer is non-refundable except in the event that Forhemit materially breaches this Agreement, fails to substantially perform services, or the Agreement is terminated by Company prior to Forhemit&apos;s commencement of material services.
        </p>
      </section>

      <section className="el-cd-section">
        <h3>4. Transition Success Fee</h3>
        <p>
          Based on an estimated enterprise value of {evDisplay}, the applicable Transition Success Fee is {successFee}, payable by the Company from operating funds at the Closing Date.
        </p>
        <p>
          <strong>FEE ADJUSTMENT:</strong> If actual Enterprise Value at closing differs by more than 10% from estimate, parties agree to good faith renegotiation.
        </p>
        <p>
          <strong>LATE PAYMENT:</strong> Fee not paid within 10 business days accrues interest at 1.5% per month plus collection costs including attorneys&apos; fees.
        </p>
      </section>

      <section className="el-cd-section">
        <h3>7. Governing Law &amp; Tail Provision</h3>
        <p>This Agreement is governed by the laws of the State of {d.gov_law.trim() || "__________"}.</p>
        <p>{venueParagraph}</p>
        <p>{tailNote}</p>
        {d.special_terms.trim() ? <p><strong>Special Terms:</strong> {d.special_terms.trim()}</p> : null}
      </section>

      <section className="el-cd-section">
        <h3>8. Dispute Resolution</h3>
        <p>
          Any dispute shall be resolved by binding arbitration administered by JAMS. The arbitration shall be conducted in the Arbitration County (as identified above) within the State of {d.gov_law.trim() || "__________"}, before a single arbitrator with commercial services experience. Either Party may seek injunctive relief in court solely to protect confidential information or proprietary rights.
        </p>
      </section>

      <section className="el-cd-section">
        <h3>9. Limitation of Liability</h3>
        <p>
          EXCEPT FOR WILLFUL MISCONDUCT OR GROSS NEGLIGENCE, FORHEMIT&apos;S TOTAL LIABILITY SHALL NOT EXCEED FEES PAID. IN NO EVENT SHALL FORHEMIT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
        </p>
      </section>

      <section className="el-cd-section">
        <h3>10. Indemnification</h3>
        <p>
          Each Party agrees to indemnify the other for losses arising from third-party claims caused by its own gross negligence, willful misconduct, or material breach. Company additionally indemnifies Forhemit for claims arising from Company&apos;s material breach, fraud, or intellectual property infringement caused by Company&apos;s materials.
        </p>
      </section>
      </div>

      <section className="el-cd-signatures">
        <h3>Signatures</h3>
        <div className="el-cd-sig-grid">
          <div className="el-cd-sig-col">
            <p className="el-cd-sig-party">FORHEMIT TRANSITION STEWARDSHIP</p>
            <p className="el-cd-sig-sub">California Public Benefit Corporation</p>
            <div className="el-cd-sig-line" />
            <p className="el-cd-sig-label">Signature</p>
            <div className="el-cd-sig-line" />
            <p className="el-cd-sig-label">Printed Name &amp; Title: {d.fhm_signer.trim() || "__________"}, {d.fhm_title.trim() || "__________"}</p>
            <div className="el-cd-sig-line" />
            <p className="el-cd-sig-label">Date</p>
          </div>
          <div className="el-cd-sig-col">
            <p className="el-cd-sig-party">COMPANY (CLIENT)</p>
            <p className="el-cd-sig-sub">Authorized Officer — signing on behalf of Company</p>
            <div className="el-cd-sig-line" />
            <p className="el-cd-sig-label">Signature</p>
            <div className="el-cd-sig-line" />
            <p className="el-cd-sig-label">
              Printed Name &amp; Title: {d.officer_name.trim() || "__________"}, {d.officer_title.trim() || "__________"}
            </p>
            <div className="el-cd-sig-line" />
            <p className="el-cd-sig-label">Date</p>
          </div>
        </div>
      </section>

      {d.has_broker === "yes" ? (
        <section className="el-cd-broker">
          <h4>Broker Acknowledgment (Witness — Not a Party)</h4>
          <p className="el-cd-broker-note">
            The undersigned broker acknowledges having reviewed the fee and retainer terms with the authorized officer prior to execution. This creates no agency relationship between Forhemit and the broker.
          </p>
          <div className="el-cd-sig-line" />
          <p>
            Broker: {d.broker_name.trim() || "_______________"} &nbsp;&nbsp; Firm: {d.broker_firm.trim() || "_______________"}
          </p>
        </section>
      ) : null}

      <footer className="el-cd-doc-footer">
        <p>Generated: {genDate} | deals@forhemit.com | forhemit.com</p>
        <p>CONFIDENTIAL — This document requires wet or electronic signatures before becoming effective.</p>
      </footer>
    </div>
  );
}

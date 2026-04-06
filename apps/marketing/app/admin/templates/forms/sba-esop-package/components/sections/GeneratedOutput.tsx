"use client";

import React from "react";
import { PackageInputs, ComplianceChecklist } from "../../types";
import { CHECKLIST_ITEMS } from "../../constants";

interface GeneratedOutputProps {
  inputs: PackageInputs;
  onBack: () => void;
}

export function GeneratedOutput({ inputs, onBack }: GeneratedOutputProps) {
  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMemberDisplay = (member: { name: string; tenure: string; role: string; status: string }) => {
    if (!member.name) return "TBD";
    return `${member.name} — Tenure: ${member.tenure || "TBD"} — Role: ${member.role || "TBD"} — Retention: ${member.status || "TBD"}`;
  };

  const checklistShortMap: Record<keyof ComplianceChecklist, string> = {
    feeStructureDeliverables: "Fee structure tied to deliverables",
    sbaCounselReview: "SBA counsel review and non-affiliation confirmation",
    sellerGuarantee: "Seller guarantee with 24-month release",
    twentyFourMonthStop: "24-month hard termination",
    trusteeIndependence: "Trustee independence documented",
    controlDisclaimer: "Control disclaimer present",
    feesModeled: "Fees modeled as SG&A with DSCR sensitivity",
    erisaDisclaimer: "ERISA non-fiduciary disclaimer",
    sellerNoteStandby: "Seller Note on full standby (120 months)",
    month20Transition: "Month-20 Governance Transition Report",
  };

  return (
    <div className="pkg-output-container">
      <div className="pkg-output-header">
        <div className="pkg-output-brand">FORHEMIT STEWARDSHIP MANAGEMENT CO.</div>
        <h1>SBA ESOP Lender Package — Executive Summary</h1>
        <div className="pkg-output-meta">
          <div>
            <span>Date:</span> {inputs.lender.submissionDate || formatDate()}
          </div>
          <div>
            <span>To:</span> {inputs.lender.lenderName}, {inputs.lender.institution}
          </div>
          <div>
            <span>Re:</span> {inputs.lender.companyName} — {inputs.lender.industry}
          </div>
        </div>
      </div>

      {/* Section I: Who Is Forhemit */}
      <div className="pkg-output-section">
        <h2>I. Who Is Forhemit</h2>
        <p>
          <strong>Forhemit PBC</strong> is a California Public Benefit Corporation.
          Founded by {inputs.forhemit.founderName || "[Founder Name]"}, with{" "}
          {inputs.forhemit.founderYears || "[X]"}+ years of experience with the City
          and County of San Francisco in disaster preparedness and emergency
          response.
        </p>
        <p>
          Our methodology brings the same operational rigor that guides municipal
          disaster response to business continuity: redundant systems, clear
          escalation protocols, and governance resilience testing.
        </p>
        <p>
          <strong>The Boring Operations Standard:</strong> We believe the best ESOPs
          are boring. Boring cash flow. Boring management transitions. Boring
          governance. No surprises at Month 18.
        </p>
      </div>

      {/* Section II: SBA Compliance Structure */}
      <div className="pkg-output-section">
        <h2>II. SBA Compliance Structure</h2>
        
        <h3>Affiliation Firewall — 13 CFR 121.301</h3>
        <ul>
          <li>Forhemit has no equity interest in the borrower</li>
          <li>No board seat, no voting rights, no management control</li>
          <li>Fees are fixed to administrative deliverables (COOP, EWS, transition reports)</li>
          <li>24-month hard stop — no evergreen clauses</li>
          <li>Written non-affiliation determination from SBA district counsel obtained</li>
        </ul>

        <h3>Trustee Independence — Mandatory</h3>
        <p>
          Forhemit plays no role in trustee selection, vetting, interviewing, or
          compensation. The independent trustee ({inputs.advisory.trustee || "TBD"})
          provides written acknowledgment confirming this independence.
        </p>

        <h3>ERISA Firewall</h3>
        <p>
          Forhemit is <strong>not</strong> a fiduciary under ERISA Section 3(21). All
          recommendations are advisory only and non-binding. The ESOP trustee and
          plan administrator retain all fiduciary authority.
        </p>
      </div>

      {/* Section III: Financial Snapshot */}
      <div className="pkg-output-section">
        <h2>III. Financial Snapshot</h2>
        <table className="pkg-output-table">
          <tbody>
            <tr>
              <td>TTM Revenue</td>
              <td>{inputs.financial.revenue || "TBD"}</td>
            </tr>
            <tr>
              <td>Adjusted EBITDA</td>
              <td>{inputs.financial.ebitda || "TBD"}</td>
            </tr>
            <tr>
              <td>Projected DSCR (post-close)</td>
              <td>{inputs.financial.dscr || "TBD"}</td>
            </tr>
            <tr>
              <td>Key Person Insurance</td>
              <td>{inputs.financial.kpInsurance || "TBD"}</td>
            </tr>
          </tbody>
        </table>
        <p className="pkg-output-note">
          <strong>Note:</strong> Forhemit&apos;s stewardship fee ($50K–$75K annually) is
          modeled as SG&A in financial projections. DSCR sensitivity analysis
          included showing fee expense impact.
        </p>
      </div>

      {/* Section IV: Management Team */}
      <div className="pkg-output-section">
        <h2>IV. Management Team — Day 1 Ready</h2>
        <table className="pkg-output-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {inputs.management.members.map((member, i) => (
              <tr key={i}>
                <td>Key Person {i + 1}</td>
                <td>{getMemberDisplay(member)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {inputs.management.notes && (
          <p className="pkg-output-note">
            <strong>Readiness notes:</strong> {inputs.management.notes}
          </p>
        )}
      </div>

      {/* Section V: Advisory Team */}
      <div className="pkg-output-section">
        <h2>V. Advisory Team</h2>
        <table className="pkg-output-table">
          <tbody>
            <tr>
              <td>ESOP Legal Counsel</td>
              <td>{inputs.advisory.esopCounsel || "TBD"}</td>
            </tr>
            <tr>
              <td>ESOP Administrator</td>
              <td>{inputs.advisory.esopAdmin || "TBD"}</td>
            </tr>
            <tr>
              <td>Seller&apos;s CPA</td>
              <td>{inputs.advisory.sellerCpa || "TBD"}</td>
            </tr>
            <tr>
              <td>Seller&apos;s Attorney</td>
              <td>{inputs.advisory.sellerAttorney || "TBD"}</td>
            </tr>
            <tr>
              <td>Independent Trustee</td>
              <td>{inputs.advisory.trustee || "TBD (selected independently)"}</td>
            </tr>
            <tr>
              <td>Valuation Firm</td>
              <td>{inputs.advisory.valuationFirm || "TBD"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section VI: Governance Layers */}
      <div className="pkg-output-section">
        <h2>VI. Three Governance Layers</h2>
        
        <h3>Layer 1: Board of Directors</h3>
        <p>
          Standard corporate governance. Forhemit has no seat, no vote, no
          management hiring/firing authority.
        </p>

        <h3>Layer 2: ESOP Fiduciary Committee</h3>
        <p>
          Plan administration oversight. Forhemit serves as non-fiduciary advisor
          only.
        </p>

        <h3>Layer 3: Forhemit post-close stewardship (Non-Fiduciary)</h3>
        <p>
          COOP maintenance, Early Warning System monitoring, transition
          preparedness. Deliverable-based. No control.
        </p>
      </div>

      {/* Section VII: Early Warning System */}
      <div className="pkg-output-section">
        <h2>VII. Early Warning System — Deliverable-Based Triggers</h2>
        <table className="pkg-output-table">
          <thead>
            <tr>
              <th>Trigger</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Missed covenant reporting</td>
              <td>Stewardship call within 48 hours</td>
            </tr>
            <tr>
              <td>DSCR deterioration</td>
              <td>COOP activation review</td>
            </tr>
            <tr>
              <td>Key person departure</td>
              <td>Transition protocol engagement</td>
            </tr>
            <tr>
              <td>Month 20 assessment</td>
              <td>Governance Transition Report</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section VIII: Fee Structure */}
      <div className="pkg-output-section">
        <h2>VIII. Fee Structure</h2>
        <p>
          <strong>Base Stewardship Fee:</strong> $50,000–$75,000 annually (scaled to
          transaction size)
        </p>
        <p>
          <strong>Success Contingency (40%):</strong> Fee tied to COOP-success
          metrics — not DSCR, EBITDA, or revenue. Metrics include:
        </p>
        <ul>
          <li>Quarterly continuity plan updates completed</li>
          <li>Early warning system operational</li>
          <li>Governance Transition Report delivered at Month 20</li>
          <li>Zero material control events</li>
        </ul>
        <p>
          <strong>Seller Guarantee Terms:</strong> 24-month automatic release upon
          satisfactory payment history or full SBA repayment.
        </p>
      </div>

      {/* Section IX: Next Steps */}
      <div className="pkg-output-section">
        <h2>IX. Next Steps</h2>
        <ol>
          <li>Submit to SBA district counsel for non-affiliation determination</li>
          <li>Finalize Stewardship Agreement execution</li>
          <li>Confirm independent trustee engagement</li>
          <li>Complete LGPC package assembly</li>
        </ol>
      </div>

      {/* Section X: Compliance Checklist Confirmed */}
      <div className="pkg-output-section">
        <h2>X. SBA Compliance Checklist — Confirmed</h2>
        <ul className="pkg-output-checklist">
          {CHECKLIST_ITEMS.map((item) => (
            <li key={item.key}>
              {inputs.checklist[item.key] ? "✓" : "○"} {checklistShortMap[item.key]}
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Block */}
      <div className="pkg-output-contact">
        <h3>Forhemit Contact</h3>
        <p>
          <strong>{inputs.forhemit.founderName || "[Founder Name]"}</strong>
          <br />
          Founder, Forhemit PBC
          <br />
          {inputs.forhemit.email || "[Email]"}
          {inputs.forhemit.phone && <><br />{inputs.forhemit.phone}</>}
          {inputs.forhemit.website && <><br />{inputs.forhemit.website}</>}
        </p>
      </div>

      {/* Back Button */}
      <div className="pkg-output-actions">
        <button className="pkg-btn-back" onClick={onBack}>
          ← Back to form
        </button>
      </div>
    </div>
  );
}

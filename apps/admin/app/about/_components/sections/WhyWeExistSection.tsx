"use client";

import { Users, Building, Wallet, Truck, Shield } from "lucide-react";

const comparisonData = [
  {
    feature: "Focus",
    standard: "Financial review (P&L analysis).",
    forhemit: "Operational Monitoring (Leading indicators).",
  },
  {
    feature: "Timing",
    standard: "Lagging indicators (Quarterly reports).",
    forhemit: "Early Warning (Real-time operational pulse).",
  },
  {
    feature: "Deliverable",
    standard: "Compliance verification.",
    forhemit: "Continuity of Operations (COOP) Plans & Impact Assessments.",
  },
  {
    feature: "Role",
    standard: "Passive reviewer.",
    forhemit: "Active operational partner to stakeholders.",
  },
  {
    feature: "Goal",
    standard: 'Verify the "books."',
    forhemit: "Protect the balance sheet from operational shocks.",
  },
];

const resilienceDomains = [
  {
    icon: Users,
    title: "People",
    description:
      'We monitor "key person" dependencies and ensure "tribal knowledge" is codified. If the operations manager leaves, we ensure the successor plan is active, preventing a productivity collapse.',
  },
  {
    icon: Building,
    title: "Property",
    description:
      'We audit physical assets for "Black Swan" vulnerabilities. We flag facility risks before they disrupt production.',
  },
  {
    icon: Wallet,
    title: "Financial Operations",
    description:
      "We track the operational triggers that impact cash flow (e.g., vendor payment terms, customer concentration), alerting stakeholders to liquidity risks months before they appear on financial statements.",
  },
  {
    icon: Truck,
    title: "Vendors",
    description:
      'We verify supply chain redundancy. If a primary supplier fails, we ensure the "Plan B" playbook is ready to execute, protecting revenue continuity.',
  },
  {
    icon: Shield,
    title: "Technology",
    description:
      'We ensure the digital "keys to the kingdom" are secure and transferable, preventing data loss or security breaches during the transition.',
  },
];

const stewardshipPoints = [
  {
    title: "The 24-Month Early Warning System",
    description:
      "We remain engaged for the critical two-year window post-close. We monitor the operational layer and issue alerts to the board, lender, or seller before a disruption hits the financials. We provide the \"breathing room\" needed to course-correct.",
  },
  {
    title: "Performance-Based Alignment",
    description:
      "We are confident in our ability to spot risks. We operate on a Reverse Management Fee model: 40% of our fee is contingent on stability metrics. If the company suffers preventable operational shocks during the transition, we share in that loss. We only succeed if the transition is smooth.",
  },
  {
    title: "A Legal Mandate for Independence",
    description:
      "Forhemit is structured as a Public Benefit Corporation. This legally mandates us to prioritize the resilience of the enterprise over short-term extraction. We serve as an objective \"operational auditor,\" ensuring the business remains a going concern for the benefit of the employee-owners.",
  },
];

export function WhyWeExistSection() {
  return (
    <section className="about-section about-section-why-we-exist">
      <div className="container">
        {/* Header */}
        <div className="why-header">
          <span className="about-eyebrow">Our Purpose</span>
          <h2>
            Why We Exist:<br />
            Eliminating the &quot;Transition Blind Spot&quot;
          </h2>
          <div className="why-intro">
            <p>
              The first 24 months after an ESOP transaction are the most critical—and the most
              dangerous. When a founder exits, the company often loses its &quot;institutional
              radar.&quot; Critical operational knowledge leaves with the seller, and new management
              teams are often unprepared for the shocks that follow.
            </p>
            <p>
              Standard lenders and trustees rely on lagging indicators—quarterly financial
              statements that tell you what happened three months ago. By the time a problem hits
              the balance sheet, it is often a crisis.
            </p>
            <p className="why-mission">
              <strong>Forhemit exists to solve this visibility gap.</strong> We are not managers; we
              are stewards of continuity. We function as an independent Early Warning System,
              monitoring the operational &quot;pulse&quot; of the company to ensure that everyday
              disruptions don&apos;t become balance sheet disasters.
            </p>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="comparison-section">
          <div className="comparison-header">
            <h3>The Forhemit Difference</h3>
            <p className="comparison-subtitle">
              Operational Visibility vs. Financial Reporting
            </p>
          </div>
          <p className="comparison-intro">
            For Brokers, Lenders, and CPAs, recommending Forhemit provides a layer of risk
            mitigation that standard due diligence cannot. We don&apos;t run the business; we ensure
            the business doesn&apos;t run off the rails.
          </p>

          {/* Comparison Table */}
          <div className="comparison-table-wrapper">
            <div className="comparison-header-row">
              <span>How We Compare:</span>
            </div>
            <div className="comparison-grid">
              {/* Header Row */}
              <div className="comp-header">Feature</div>
              <div className="comp-header">Standard Post-Close Oversight</div>
              <div className="comp-header">
                <span className="comp-highlight">The Forhemit Stewardship Model</span>
              </div>
              
              {/* Data Rows */}
              {comparisonData.map((row) => (
                <div key={row.feature} className="comp-row" style={{ display: 'contents' }}>
                  <div className="comp-cell comp-feature">
                    {row.feature}
                  </div>
                  <div className="comp-cell">
                    {row.standard}
                  </div>
                  <div className="comp-cell">
                    {row.forhemit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resilience Framework */}
        <div className="resilience-section">
          <div className="resilience-header">
            <span className="about-eyebrow">Our Methodology</span>
            <h3>The Resilience Framework</h3>
            <p>
              We do not manage the company. Instead, we equip the new leadership with the
              &quot;playbooks&quot; they need and monitor the execution. We draw on municipal
              disaster preparedness protocols to audit and track five critical operational domains:
            </p>
          </div>

          <div className="domains-grid">
            {resilienceDomains.map((domain, index) => (
              <div key={domain.title} className="domain-card">
                <div className="domain-header">
                  <div className="domain-icon">
                    <domain.icon size={22} strokeWidth={1.5} />
                  </div>
                  <span className="domain-number">0{index + 1}</span>
                </div>
                <h4>{domain.title}</h4>
                <p>{domain.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission-Locked Stewardship */}
        <div className="stewardship-section">
          <div className="stewardship-header">
            <h3>Mission-Locked Stewardship</h3>
            <p>
              Our role is to protect the interests of the Stakeholders—the Lender, the Seller (often
              holding a note), and the ESOP Trust.
            </p>
          </div>

          <div className="stewardship-list">
            {stewardshipPoints.map((point, index) => (
              <div key={point.title} className="stewardship-item">
                <div className="stewardship-number">{index + 1}</div>
                <div className="stewardship-content">
                  <h4>{point.title}</h4>
                  <p>{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

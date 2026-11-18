"use client";

import { Users, Building, Wallet, Truck, Shield } from "lucide-react";

const resilienceDomains = [
  {
    icon: Users,
    title: "People",
    description:
      'We map "key person" dependencies and check whether tribal knowledge is written down. If the operations manager left tomorrow, the successor plan should already exist.',
  },
  {
    icon: Building,
    title: "Property",
    description:
      "We look at physical assets for single points of failure — facility risks that could disrupt production.",
  },
  {
    icon: Wallet,
    title: "Financial Operations",
    description:
      "We look at the operational triggers that hit cash flow — vendor payment terms, customer concentration — and where liquidity could tighten.",
  },
  {
    icon: Truck,
    title: "Vendors",
    description:
      'We check supply-chain redundancy: if a primary supplier failed, is there a "Plan B" ready to execute?',
  },
  {
    icon: Shield,
    title: "Technology",
    description:
      'We check that the digital "keys to the kingdom" are documented and transferable, so access never leaves with one person.',
  },
];

const stewardshipPoints = [
  {
    title: "The 24-Month Early Warning System",
    description:
      "For 24 months after close, the company is monitored against warning indicators agreed with the founder up front, reported on a schedule agreed with the founder — so problems surface while they are still small enough to fix.",
  },
  {
    title: "Our fee is agreed in advance",
    description:
      "Total transition fees typically run 3–5% of valuation — one figure, covering the whole transition, set in writing before you sign anything.",
  },
  {
    title: "A Legal Mandate for Independence",
    description:
      "Forhemit is structured as a Public Benefit Corporation. That legally requires us to balance profit with the durability of the enterprise — we are built to protect the company's continuity for its employee-owners, not to extract from it.",
  },
];

export function WhyWeExistSection() {
  return (
    <section className="about-section about-section-why-we-exist">
      <div className="container">
        {/* Header */}
        <div className="why-header">
          <span className="about-eyebrow">Our Purpose</span>
          <h2>Why I built Forhemit</h2>
          <div className="why-intro">
            <p>
              I built Forhemit because the usual exit asks founders to betray what they built.
              I spent years in disaster planning and policy for the City of San Francisco, where
              the work was continuity: making sure the city kept running when something went
              wrong. A founder&apos;s exit is the same kind of event for a company. Handled by
              reaction, it is expensive and often fatal. Handled by preparation, the company, its
              people, and its name carry on.
            </p>
            <p className="why-mission">
              <strong>Reacting is expensive. Planning is not.</strong> Preparation determines how
              well people come through a transition — so Forhemit plans the whole exit before it
              starts: the valuation, the structure, the financing, and the first two years after
              close.
            </p>
          </div>
        </div>

        {/* One accountable lead */}
        <div className="comparison-section">
          <div className="comparison-header">
            <h3>One accountable lead, not five vendors</h3>
          </div>
          <p className="comparison-intro">
            An ESOP transition requires independent checks, by law and by design: an independent
            appraiser who works for neither side, an independent trustee, ESOP counsel, and
            accountants. Forhemit coordinates all of it under one accountable lead, so you are
            never managing five vendors on your own — and every check stays independent.
          </p>
        </div>

        {/* Resilience Framework */}
        <div className="resilience-section">
          <div className="resilience-header">
            <span className="about-eyebrow">Our Methodology</span>
            <h3>The Resilience Framework</h3>
            <p>
              Before any transaction is structured, we run a stress test during readiness,
              drawing on municipal disaster preparedness protocols across five critical
              operational domains. You see the results in writing, and they shape how the
              transition is planned:
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

        {/* After the close */}
        <div className="stewardship-section">
          <div className="stewardship-header">
            <h3>After the close</h3>
            <p>
              Closing is not the end of our work. Three commitments carry through the transition
              and the two years after it.
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

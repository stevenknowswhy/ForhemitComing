"use client";

import { Badge } from "@/components/ui/badge";

const comparisonData = [
  {
    feature: "Governance / Control",
    consultant: "None",
    partner: "High (Creates regulatory/SBA issues)",
    forhemit: "None (100% compliant with SBA/ERISA)",
  },
  {
    feature: "Enforcement Power",
    consultant: "None (Ignorable)",
    partner: "Voting power / Board control",
    forhemit: "Loan Covenants (The lender holds the power)",
  },
  {
    feature: "Fee Structure",
    consultant: "Fixed / Hourly",
    partner: "Equity extraction",
    forhemit: "40% At-Risk (Tied to KPI success)",
  },
  {
    feature: "Value to Lender",
    consultant: "Just another expense",
    partner: "Competes for control",
    forhemit: "Early Warning Radar (Protects the collateral)",
  },
];

export function ComparisonSection() {
  return (
    <section className="about-section about-section-dark faq-comparison-section">
      <div className="container">
        <div className="faq-comparison-header">
          <Badge variant="outline" className="about-eyebrow">
            Stewardship Model
          </Badge>
          <h2 className="section-title">Observational Layer, Not Governance</h2>
          <p className="faq-comparison-subtitle">
            How Forhemit fits into the capital stack without creating regulatory complications
          </p>
        </div>

        <div className="faq-comparison-table-wrapper">
          <div className="faq-comparison-table">
            {/* Header Row */}
            <div className="comp-table-header">Feature</div>
            <div className="comp-table-header">Traditional Consultant</div>
            <div className="comp-table-header">Equity Partner / Board Member</div>
            <div className="comp-table-header comp-table-highlight">Forhemit Stewardship Model</div>

            {/* Data Rows */}
            {comparisonData.map((row) => (
              <div key={row.feature} className="comp-table-row">
                <div className="comp-table-feature">{row.feature}</div>
                <div className="comp-table-cell">{row.consultant}</div>
                <div className="comp-table-cell">{row.partner}</div>
                <div className="comp-table-cell comp-table-emphasis">{row.forhemit}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="faq-comparison-note">
          <p>
            <strong>The Forhemit Difference:</strong> We provide the oversight lenders need without
            the governance complications. Our loan covenant-based structure means the lender retains
            all enforcement power—we simply provide the early warning system that protects your
            collateral.
          </p>
        </div>
      </div>
    </section>
  );
}

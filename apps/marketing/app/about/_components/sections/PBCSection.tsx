"use client";

import { TrendingUp, Users, Building2 } from "lucide-react";

const duties = [
  {
    icon: TrendingUp,
    title: "To Our Investors",
    description:
      "Drive sustainable, long-term value and returns (the same expectation any C-corp must meet).",
  },
  {
    icon: Users,
    title: "To the Employees in Our Stewardship",
    description:
      "Lead with dignity and stability, protecting the human capital that makes the business run.",
  },
  {
    icon: Building2,
    title: "To Our Community",
    description:
      "Preserve local jobs, services, and the tax base that depends on these businesses surviving and thriving.",
  },
];

export function PBCSection() {
  return (
    <section className="about-section about-section-pbc">
      <div className="container">
        <div className="pbc-wrapper">
          {/* Header */}
          <div className="pbc-header">
            <span className="about-eyebrow">Public Benefit Corporation</span>
            <h2>Our Benefit</h2>
            <p className="pbc-intro">
              Forhemit is structured as a California Public Benefit Corporation. This isn&apos;t
              just a label—it&apos;s a legal mandate that guides how we operate and make decisions.
            </p>
          </div>

          {/* Context */}
          <div className="pbc-context">
            <p>
              Unlike a traditional corporation that is primarily driven to maximize shareholder
              value, a Public Benefit Corporation is required to balance a three-part duty:
            </p>
          </div>

          {/* Duty Cards */}
          <div className="duty-grid">
            {duties.map((duty, index) => (
              <div key={duty.title} className="duty-card">
                <div className="duty-number">0{index + 1}</div>
                <div className="duty-icon">
                  <duty.icon size={28} strokeWidth={1.5} />
                </div>
                <h3>{duty.title}</h3>
                <p>{duty.description}</p>
              </div>
            ))}
          </div>

          {/* Closing Statement */}
          <div className="pbc-closing">
            <p>
              This structure gives us a longer view than extracting maximum profit at any cost. It
              ensures we balance short-term performance with long-term durability—so a business
              isn&apos;t just here today, but positioned to be here 20 years from now.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

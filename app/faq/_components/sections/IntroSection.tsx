"use client";

import { Shield, Users, Heart } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Preserve Legacies",
    description: "Protecting what you've built for generations to come",
  },
  {
    icon: Users,
    title: "Employee Ownership",
    description: "Turning workers into stakeholders with real equity",
  },
  {
    icon: Heart,
    title: "Transparency First",
    description: "Complete clarity in how we operate and partner",
  },
];

export function IntroSection() {
  return (
    <section className="about-section about-section-alt faq-intro-section">
      <div className="container">
        <div className="faq-intro-header">
          <span className="about-eyebrow">Our Approach</span>
          <h2 className="section-title">Built Different. Built to Last.</h2>
        </div>

        <div className="faq-intro-content">
          <p className="faq-intro-lead">
            At Forhemit, we operate differently than traditional private equity. We believe in
            preserving legacies, fortifying operations, and turning employees into owners.
          </p>
          <p className="faq-intro-sub">
            Whether you are a founder looking to transition, a capital partner evaluating our model,
            or an employee navigating a recent acquisition, we want to be completely transparent
            about how we work.
          </p>
        </div>

        <div className="faq-values-grid">
          {values.map((value) => (
            <div key={value.title} className="faq-value-card">
              <div className="faq-value-icon">
                <value.icon size={24} strokeWidth={1.5} />
              </div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import "@forhemit/shared/styles/privacy-page.css";

export function TermsPageClient() {
  return (
    <div className="legal-page-wrapper">
      <main className="legal-main">
        <section className="legal-hero">
          <div className="container">
            <span className="legal-eyebrow">Legal</span>
            <h1 className="legal-title">Terms of Use</h1>
            <p className="legal-subtitle">Last updated: November 17, 2026</p>
          </div>
        </section>

        <section className="legal-content-section">
          <div className="container">
            <div className="legal-text-content">
              <h2>About this site</h2>
              <p>
                This website is published by Forhemit, an advisory firm that
                structures 100% employee-ownership (ESOP) transitions for
                founder-led businesses. The site describes our services; it does
                not offer or sell any product, security, or software.
              </p>
              <p>
                Forhemit is a California Public Benefit Corporation, based at 55
                9th Street, San Francisco, CA. Questions about these terms:{" "}
                <a href="mailto:contact@forhemit.com">contact@forhemit.com</a>.
              </p>

              <h2>Not professional advice</h2>
              <p>
                Content on this site — including explanations of Section 1042,
                valuation, financing, and timelines — is general educational
                information, not legal, tax, accounting, or investment advice for
                your specific situation. Consult your own qualified advisors before
                acting. An engagement with Forhemit begins only under a signed
                written agreement.
              </p>

              <h2>The free assessment</h2>
              <p>
                The assessment is a preliminary, no-cost evaluation of fit based on
                the information you provide. It is not a valuation, an offer, or a
                commitment to engage. Qualification standards referenced on this
                site (including revenue, headcount, and profitability) are
                guidelines applied in our judgment to each business individually.
              </p>

              <h2>Accuracy</h2>
              <p>
                We work to keep this site accurate, including statistics about the
                business-sale market, which reflect published industry estimates
                and may change over time. We make no warranty that any figure
                predicts an outcome for a particular business.
              </p>

              <h2>Intellectual property</h2>
              <p>
                &quot;Beyond the Balance Sheet™&quot; and the Forhemit name and site
                content are the property of Forhemit and may not be reproduced
                without permission, except for brief quotations with attribution.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

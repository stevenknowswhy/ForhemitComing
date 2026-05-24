import { HomeClient } from "./HomeClient";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Forhemit PBC",
  url: "https://www.forhemit.com",
  description:
    "Forhemit helps founder-led businesses pursue 100% employee-ownership succession with ESOP structuring and post-close stewardship support.",
  "@id": "https://www.forhemit.com/#organization",
  sameAs: [],
  areaServed: "US",
  knowsAbout: [
    "ESOP structuring",
    "Employee ownership succession",
    "Section 1042 tax deferral",
    "Business succession planning",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Forhemit",
  url: "https://www.forhemit.com",
  publisher: {
    "@id": "https://www.forhemit.com/#organization",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Server-rendered static content for crawlers (hidden when JS loads) */}
      <div data-ssr-fallback>
        <section aria-label="Hero">
          <h1>Founder Succession Without Selling Out</h1>
          <p>
            Forhemit structures 100% employee-ownership transitions for founder-led businesses
            and stays involved after close to protect continuity.
          </p>
          <p>Start Your Free Assessment</p>
        </section>
        <section aria-label="Trust signals">
          <p>Secure &amp; Confidential · DOL / IRS Compliant · Independent Valuation · Lender-Ready Packaging</p>
        </section>
        <section aria-label="Exit path comparison">
          <h2>Three exit paths. One clear winner.</h2>
          <p>Complete Liquidation (Worst outcome): Fire sale, job losses, massive tax hit.</p>
          <p>Private Equity Sale (Uncertain): Loss of control, culture gutted, buyer can walk.</p>
          <p>Founder Succession Through Employee Ownership (Recommended): Independent valuation, Section 1042 tax deferral, post-close stewardship.</p>
        </section>
        <section aria-label="Cost of waiting">
          <h2>The cost of waiting</h2>
          <p>50:1 sellers for every qualified buyer. 30-40% of listed businesses never sell. 4 months vs 12-18 months traditional sale.</p>
        </section>
        <section aria-label="Qualification criteria">
          <h2>Who this is NOT for</h2>
          <p>Revenue under $3M annually. Pre-profit or revenue declining. Fewer than 20 employees. Need cash within 30 days. Unwilling to support transition through handoff period.</p>
          <p>If none of that describes you, you&apos;re likely an excellent fit.</p>
        </section>
      </div>
      {/* Client-side interactive layer (replaces SSR fallback via JS) */}
      <HomeClient />
    </>
  );
}

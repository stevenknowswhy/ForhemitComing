import type { Metadata } from "next";

const canonicalUrl = "https://www.forhemit.com/signal-os";

export const metadata: Metadata = {
  title: "Signal OS | Evidence-First AI Visibility Audits",
  description:
    "A local-first audit workstation for consultants and agencies that turns dated AI-answer evidence into transparent priorities and client-ready deliverables.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "Signal OS | Evidence-First AI Visibility Audits",
    description:
      "Capture dated AI-answer evidence, citations, competitors, factual gaps, and next actions without pretending a sample is a customer result.",
    type: "website",
    url: canonicalUrl,
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Signal OS",
  description:
    "A downloadable, local-first workstation for evidence-based AI visibility audits and client delivery.",
  brand: {
    "@type": "Brand",
    name: "Forhemit",
  },
  url: canonicalUrl,
  offers: [
    {
      "@type": "Offer",
      name: "Signal OS Solo",
      price: "99",
      priceCurrency: "USD",
      priceValidUntil: "2026-08-03",
      availability: "https://schema.org/InStock",
      url: `${canonicalUrl}#signal-editions`,
    },
    {
      "@type": "Offer",
      name: "Signal OS Agency",
      price: "349",
      priceCurrency: "USD",
      priceValidUntil: "2026-08-03",
      availability: "https://schema.org/InStock",
      url: `${canonicalUrl}#signal-editions`,
    },
    {
      "@type": "Offer",
      name: "Signal OS Studio",
      price: "749",
      priceCurrency: "USD",
      priceValidUntil: "2026-08-03",
      availability: "https://schema.org/InStock",
      url: `${canonicalUrl}#signal-editions`,
    },
  ],
};

const tiers = [
  {
    name: "Solo",
    price: "$99",
    fit: "For one operator running a rigorous audit workflow.",
  },
  {
    name: "Agency",
    price: "$349",
    fit: "For consultants delivering the work commercially to clients.",
  },
  {
    name: "Studio",
    price: "$749",
    fit: "For teams standardizing delivery, training, and operations.",
  },
];

export default function SignalOsPage() {
  return (
    <main className="signal-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <section className="signal-hero" aria-labelledby="signal-title">
        <p className="signal-kicker">Forhemit Labs · Signal OS</p>
        <h1 id="signal-title">Run AI visibility audits you can defend.</h1>
        <p className="signal-lede">
          Signal OS is a downloadable, local-first workstation for freelancers,
          consultants, and agencies. Capture the exact dated answer, cited sources,
          brand presence, competitors, factual gaps, and the next action—then turn
          that evidence into a client-ready audit.
        </p>
        <div className="signal-actions">
          <a className="signal-primary" href="#signal-editions">
            View editions and buy
          </a>
          <a className="signal-secondary" href="#signal-sample">
            Inspect the labeled sample
          </a>
        </div>
        <p className="signal-note">
          One-time purchase. Immediate download after Stripe verification. The founding
          prices below are valid only through August 3, 2026 at 2:22 PM Pacific;
          Stripe shows the authoritative price before payment.
        </p>
      </section>

      <section className="signal-section" aria-labelledby="signal-workflow">
        <div>
          <p className="signal-eyebrow">The workflow</p>
          <h2 id="signal-workflow">Observation before interpretation.</h2>
        </div>
        <ol className="signal-steps">
          <li><span><strong>Define</strong> the commercial questions buyers actually ask.</span></li>
          <li><span><strong>Capture</strong> dated answers, sources, mentions, and factual issues.</span></li>
          <li><span><strong>Prioritize</strong> the changes supported by the evidence.</span></li>
          <li><span><strong>Deliver</strong> a transparent report and next-action roadmap.</span></li>
        </ol>
      </section>

      <section className="signal-section signal-sample" id="signal-sample" aria-labelledby="signal-sample-title">
        <div>
          <p className="signal-eyebrow">Illustrative sample · fictional</p>
          <h2 id="signal-sample-title">See the evidence boundary.</h2>
        </div>
        <dl className="signal-sample-card">
          <div>
            <dt>Business</dt>
            <dd>Fictional B2B analytics studio</dd>
          </div>
          <div>
            <dt>Buyer question</dt>
            <dd>“Which AI visibility audit workflow is best for a small agency?”</dd>
          </div>
          <div>
            <dt>Dated observation</dt>
            <dd>The fictional brand was absent; four third-party sources were cited.</dd>
          </div>
          <div>
            <dt>Supported next action</dt>
            <dd>Publish a comparison page using first-party workflow evidence, then observe again.</dd>
          </div>
        </dl>
      </section>

      <section className="signal-section signal-pricing" aria-labelledby="signal-editions">
        <div>
          <p className="signal-eyebrow">Choose by delivery model</p>
          <h2 id="signal-editions">One system, three licenses.</h2>
        </div>
        <div className="signal-grid">
          {tiers.map((tier) => (
            <article className="signal-card" key={tier.name}>
              <h3>{tier.name}</h3>
              <p className="signal-price-label">Founding price</p>
              <p className="signal-price">{tier.price}</p>
              <p>{tier.fit}</p>
              <form method="post" action="/api/signal-os/checkout">
                <input type="hidden" name="edition" value={tier.name.toLowerCase()} />
                <button className="signal-tier-cta" type="submit">
                  Open secure checkout <span aria-hidden="true">→</span>
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section className="signal-section signal-boundaries" aria-labelledby="signal-boundaries">
        <div>
          <p className="signal-eyebrow">Transparent by design</p>
          <h2 id="signal-boundaries">What Signal OS does—and does not do.</h2>
        </div>
        <div className="signal-grid signal-grid-two">
          <article className="signal-card">
            <h3>It helps you document</h3>
            <p>
              Prompts, answers, citations, competitors, accuracy problems, decisions,
              priorities, and deliverables in a repeatable local workflow.
            </p>
          </article>
          <article className="signal-card">
            <h3>It does not manufacture certainty</h3>
            <p>
              No passive mention monitoring, guaranteed rankings, promised citations,
              or invented customer proof. The public sample is explicitly fictional.
            </p>
          </article>
        </div>
      </section>

      <section className="signal-close" aria-labelledby="signal-close">
        <p className="signal-kicker">Sold and fulfilled by Forhemit</p>
        <h2 id="signal-close">Turn scattered AI answers into auditable client work.</h2>
        <a className="signal-primary" href="#signal-editions">
          Choose an edition
        </a>
      </section>

      <style>{`
        .signal-page {
          --ink: #17211d;
          --muted: #5d6762;
          --paper: #f4f0e8;
          --card: #fffdf8;
          --line: rgba(23, 33, 29, 0.16);
          --accent: #8c5b2f;
          color: var(--ink);
          background: var(--paper);
          min-height: 100vh;
        }
        .signal-hero, .signal-section, .signal-close {
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto;
        }
        .signal-hero {
          padding: 112px 0 84px;
        }
        .signal-kicker, .signal-eyebrow {
          margin: 0 0 18px;
          font: 500 0.75rem/1.4 var(--font-dm-mono), monospace;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .signal-hero h1 {
          max-width: 880px;
          margin: 0;
          font: 500 clamp(3.3rem, 8vw, 7rem)/0.91 var(--font-cormorant), serif;
          letter-spacing: -0.045em;
        }
        .signal-lede {
          max-width: 760px;
          margin: 34px 0 0;
          font: 300 clamp(1.08rem, 2vw, 1.38rem)/1.65 var(--font-outfit), sans-serif;
          color: var(--muted);
        }
        .signal-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }
        .signal-primary, .signal-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 0 22px;
          border: 1px solid var(--ink);
          text-decoration: none;
          font: 500 0.82rem/1 var(--font-dm-mono), monospace;
          letter-spacing: 0.04em;
        }
        .signal-primary { color: var(--paper); background: var(--ink); }
        .signal-secondary { color: var(--ink); background: transparent; }
        .signal-primary:hover, .signal-secondary:hover { transform: translateY(-1px); }
        .signal-note {
          margin: 18px 0 0;
          font: 400 0.76rem/1.6 var(--font-dm-mono), monospace;
          color: var(--muted);
        }
        .signal-section {
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: 60px;
          padding: 78px 0;
          border-top: 1px solid var(--line);
        }
        .signal-section h2, .signal-close h2 {
          margin: 0;
          font: 500 clamp(2.25rem, 4.5vw, 4rem)/1 var(--font-cormorant), serif;
          letter-spacing: -0.025em;
        }
        .signal-steps {
          margin: 0;
          padding: 0;
          list-style: none;
          counter-reset: steps;
        }
        .signal-steps li {
          counter-increment: steps;
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid var(--line);
          font: 300 1.06rem/1.55 var(--font-outfit), sans-serif;
        }
        .signal-steps li::before {
          content: "0" counter(steps);
          color: var(--accent);
          font: 500 0.75rem/1.8 var(--font-dm-mono), monospace;
        }
        .signal-steps strong { display: block; margin-bottom: 6px; }
        .signal-pricing, .signal-boundaries { display: block; }
        .signal-sample-card {
          margin: 0;
          padding: 8px 30px;
          border: 1px solid var(--line);
          background: var(--card);
        }
        .signal-sample-card div {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 22px;
          padding: 20px 0;
          border-bottom: 1px solid var(--line);
        }
        .signal-sample-card div:last-child { border-bottom: 0; }
        .signal-sample-card dt {
          color: var(--accent);
          font: 500 0.74rem/1.6 var(--font-dm-mono), monospace;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .signal-sample-card dd {
          margin: 0;
          color: var(--muted);
          font: 300 1rem/1.6 var(--font-outfit), sans-serif;
        }
        .signal-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 38px;
        }
        .signal-grid-two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .signal-card {
          padding: 30px;
          border: 1px solid var(--line);
          background: var(--card);
        }
        .signal-card h3 {
          margin: 0;
          font: 500 1.65rem/1.1 var(--font-cormorant), serif;
        }
        .signal-card p {
          color: var(--muted);
          font: 300 0.98rem/1.6 var(--font-outfit), sans-serif;
        }
        .signal-card .signal-price {
          margin: 4px 0 12px;
          color: var(--ink);
          font: 500 2.55rem/1 var(--font-cormorant), serif;
        }
        .signal-card .signal-price-label {
          margin: 18px 0 0;
          color: var(--accent);
          font: 500 0.7rem/1.4 var(--font-dm-mono), monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .signal-tier-cta {
          display: inline-block;
          margin-top: 12px;
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--accent);
          cursor: pointer;
          font: 500 0.8rem/1.4 var(--font-dm-mono), monospace;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .signal-close {
          padding: 88px 0 112px;
          border-top: 1px solid var(--line);
        }
        .signal-close h2 { max-width: 760px; margin-bottom: 30px; }
        @media (max-width: 760px) {
          .signal-hero { padding: 76px 0 60px; }
          .signal-section { grid-template-columns: 1fr; gap: 34px; padding: 58px 0; }
          .signal-grid, .signal-grid-two { grid-template-columns: 1fr; }
          .signal-sample-card div { grid-template-columns: 1fr; gap: 4px; }
          .signal-actions { align-items: stretch; flex-direction: column; }
          .signal-primary, .signal-secondary { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .signal-primary:hover, .signal-secondary:hover { transform: none; }
        }
      `}</style>
    </main>
  );
}

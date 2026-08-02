import styles from "./signal-os.module.css";
import { tiers } from "./constants";
import type { SignalOsPageProps } from "./types";

export function SignalOsPage({ foundingActive, productJsonLd }: SignalOsPageProps) {
  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: productJsonLd }}
      />

      <section className={styles.hero} aria-labelledby="signal-title">
        <p className={styles.kicker}>Forhemit Labs · Signal OS</p>
        <h1 id="signal-title">Run AI visibility audits you can defend.</h1>
        <p className={styles.lede}>
          Signal OS is a downloadable, local-first workstation for freelancers,
          consultants, and agencies. Capture the exact dated answer, cited sources,
          brand presence, competitors, factual gaps, and the next action—then turn
          that evidence into a client-ready audit.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#signal-editions">View editions and buy</a>
          <a className={styles.secondary} href="#signal-sample">Inspect the labeled sample</a>
        </div>
        <p className={styles.scorecardPath}>
          Not ready to buy?{" "}
          <a href="https://signal-os-evidence.stefano94103.chatgpt.site/15-minute-ai-visibility-scorecard?utm_source=forhemit&utm_medium=owned_storefront&utm_campaign=founding72&utm_content=hero_scorecard">
            Try the free 15-minute scorecard <span aria-hidden="true">→</span>
          </a>
        </p>
        <p className={styles.note}>
          {foundingActive
            ? "One-time purchase. Immediate download after Stripe verification. The founding prices below are valid only through August 3, 2026 at 2:22 PM Pacific; Stripe shows the authoritative price before payment."
            : "One-time purchase. Immediate download after Stripe verification. Founding pricing has ended; Stripe shows the authoritative current price before payment."}
        </p>
      </section>

      <section className={styles.section} aria-labelledby="signal-workflow">
        <div>
          <p className={styles.eyebrow}>The workflow</p>
          <h2 id="signal-workflow">Observation before interpretation.</h2>
        </div>
        <ol className={styles.steps}>
          <li><span><strong>Define</strong> the commercial questions buyers actually ask.</span></li>
          <li><span><strong>Capture</strong> dated answers, sources, mentions, and factual issues.</span></li>
          <li><span><strong>Prioritize</strong> the changes supported by the evidence.</span></li>
          <li><span><strong>Deliver</strong> a transparent report and next-action roadmap.</span></li>
        </ol>
      </section>

      <section className={`${styles.section} ${styles.sample}`} id="signal-sample" aria-labelledby="signal-sample-title">
        <div>
          <p className={styles.eyebrow}>Illustrative sample · fictional</p>
          <h2 id="signal-sample-title">See the evidence boundary.</h2>
        </div>
        <div className={styles.sampleBody}>
          <dl className={styles.sampleCard}>
            <div><dt>Business</dt><dd>Fictional B2B analytics studio</dd></div>
            <div><dt>Buyer question</dt><dd>“Which AI visibility audit workflow is best for a small agency?”</dd></div>
            <div><dt>Dated observation</dt><dd>The fictional brand was absent; four third-party sources were cited.</dd></div>
            <div><dt>Supported next action</dt><dd>Publish a comparison page using first-party workflow evidence, then observe again.</dd></div>
          </dl>
          <p className={styles.freeResource}>
            <span>Free · CSV · no account</span>
            <strong>Test the method before buying.</strong>{" "}
            <a href="https://github.com/stevenknowswhy/ForhemitComing/tree/main/resources/ai-visibility-audit-evidence-log">
              Use the free evidence log <span aria-hidden="true">→</span>
            </a>
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.blockSection}`} aria-labelledby="signal-editions">
        <div>
          <p className={styles.eyebrow}>Choose by delivery model</p>
          <h2 id="signal-editions">One system, three licenses.</h2>
        </div>
        <div className={styles.grid}>
          {tiers.map((tier) => (
            <article className={styles.card} key={tier.id}>
              <h3>{tier.name}</h3>
              <p className={styles.priceLabel}>{foundingActive ? "Founding price" : "Current pricing"}</p>
              <p className={styles.price}>{foundingActive ? tier.price : "See Stripe Checkout"}</p>
              <p>{tier.fit}</p>
              <ul className={styles.features}>
                {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <form method="post" action="/api/signal-os/checkout">
                <input type="hidden" name="edition" value={tier.id} />
                <button className={styles.tierCta} type="submit">
                  Open secure checkout <span aria-hidden="true">→</span>
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.blockSection}`} aria-labelledby="signal-boundaries">
        <div>
          <p className={styles.eyebrow}>Transparent by design</p>
          <h2 id="signal-boundaries">What Signal OS does—and does not do.</h2>
        </div>
        <div className={`${styles.grid} ${styles.gridTwo}`}>
          <article className={styles.card}>
            <h3>It helps you document</h3>
            <p>Prompts, answers, citations, competitors, accuracy problems, decisions, priorities, and deliverables in a repeatable local workflow.</p>
          </article>
          <article className={styles.card}>
            <h3>It does not manufacture certainty</h3>
            <p>No passive mention monitoring, guaranteed rankings, promised citations, or invented customer proof. The public sample is explicitly fictional.</p>
          </article>
        </div>
      </section>

      <section className={styles.close} aria-labelledby="signal-close">
        <p className={styles.kicker}>Sold and fulfilled by Forhemit</p>
        <h2 id="signal-close">Turn scattered AI answers into auditable client work.</h2>
        <a className={styles.primary} href="#signal-editions">Choose an edition</a>
        <a
          className={styles.directoryProof}
          href="https://www.promptfrenzy.com/directory"
          target="_blank"
          rel="noopener"
          title="Featured on PromptFrenzy AI Directory"
        >
          <img
            src="/promptfrenzy-directory.svg"
            alt="Featured on PromptFrenzy AI Directory"
            width="220"
            height="44"
            loading="lazy"
          />
        </a>
      </section>
    </main>
  );
}

export default SignalOsPage;

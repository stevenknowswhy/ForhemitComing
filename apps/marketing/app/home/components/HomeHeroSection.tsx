import Link from "next/link";
import { AssessmentCta } from "./AssessmentCta";
import { HomePathSelectionBridge } from "./HomePathSelectionBridge";

/** Set to true to show the "I am a ..." owner / broker path cards below the hero. */
const SHOW_HOME_PATH_SELECTION = false;

/** Fully static hero markup; the CTA is the only hydrated island. */
export function HomeHeroSection() {
  return (
    <>
      {/* ── Full-viewport hero ── */}
      <section className="hch-hero-section" aria-label="Hero">
        <div className="hch-hero-bg">
          <div className="hch-hero-inner hch-hero-inner--centered">
            <p className="hch-hero-eyebrow">
              <span className="hch-hero-eyebrow-line" aria-hidden />
              Employee-Ownership Succession · For Founder-Led Businesses
            </p>

            <h1 className="hch-hero-headline">Sell Your Business to Your Employees</h1>

            <p className="hch-hero-sub">
              Turn your profitable company — 20+ employees, $3M+ in revenue — into a 100%
              employee-owned business in 120 days from Documents-Ready. The purchase is structured and
              financed, so your employees don&apos;t need the cash to buy it. Section 1042
              tax-deferred treatment may be available to qualifying sellers.
            </p>

            <div className="hch-hero-ctas" role="group" aria-label="Primary actions">
              <AssessmentCta className="hch-hero-cta hch-hero-cta-primary">
                Start Your Free Assessment
              </AssessmentCta>
              <Link href="/brokers" className="hch-hero-cta-link">
                I&apos;m a Broker →
              </Link>
            </div>

            <p className="hch-hero-trust-note">
              🔒 Free assessment · Confidential · 2 minutes
            </p>

            <nav className="hch-hero-pro-links" aria-label="Professional audiences">
              <span className="hch-hero-pro-label">For professionals:</span>
              <Link href="/legal-practices">Legal</Link>
              <span className="hch-hero-pro-sep" aria-hidden>·</span>
              <Link href="/wealth-managers">Wealth</Link>
              <span className="hch-hero-pro-sep" aria-hidden>·</span>
              <Link href="/accounting-firms">Accounting</Link>
            </nav>
          </div>
        </div>
      </section>

      {SHOW_HOME_PATH_SELECTION ? <HomePathSelectionBridge /> : null}
    </>
  );
}

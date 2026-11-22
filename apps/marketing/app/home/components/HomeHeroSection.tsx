import Link from "next/link";
import Image from "next/image";
import { HomePathSelectionBridge } from "./HomePathSelectionBridge";

/** Set to true to show the "I am a ..." owner / broker path cards below the hero. */
const SHOW_HOME_PATH_SELECTION = false;

/** Fully static hero markup — no hero CTA (W4: nav + closing carry the assessment). */
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

            <p className="hch-hero-trust-note">
              Free assessment · Confidential · 2 minutes
            </p>

            <nav className="hch-hero-pro-links" aria-label="Professional audiences">
              <span className="hch-hero-pro-label">For professionals:</span>
              <Link href="/legal-practices">Attorneys</Link>
              <span className="hch-hero-pro-sep" aria-hidden>·</span>
              <Link href="/brokers">Brokers</Link>
              <span className="hch-hero-pro-sep" aria-hidden>·</span>
              <Link href="/accounting-firms">CPAs</Link>
              <span className="hch-hero-pro-sep" aria-hidden>·</span>
              <Link href="/wealth-managers">Wealth Managers</Link>
            </nav>

            <figure className="hch-hero-photo">
              <Image
                src="/images/home/hero-encounter.webp"
                alt="A founder reviewing a document with his advisor at a table in a professional office"
                width={2048}
                height={1152}
                priority
                sizes="(max-width: 760px) 100vw, 700px"
              />
            </figure>
          </div>
        </div>
      </section>

      {SHOW_HOME_PATH_SELECTION ? <HomePathSelectionBridge /> : null}
    </>
  );
}

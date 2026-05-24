"use client";

import Link from "next/link";
import {
  HomePathSelectionSection,
  type HomePathRole,
} from "./HomePathSelectionSection";

/** Set to true to show the "I am a ..." owner / broker path cards below the hero. */
const SHOW_HOME_PATH_SELECTION = false;

export type HomeHeroSectionProps = {
  /** Opens the 2-Minute Check qualifier (owner primary CTA). */
  onStartTwoMinuteCheck?: () => void;
  /** Opens classification intake modal for the path the user expanded (owner vs broker). */
  onStartIntake?: (role: HomePathRole) => void;
};

export function HomeHeroSection({ onStartTwoMinuteCheck, onStartIntake }: HomeHeroSectionProps) {
  return (
    <>
      {/* ── Full-viewport hero ── */}
      <section className="hch-hero-section" aria-label="Hero">
        <div className="hch-hero-bg">
          <div className="hch-hero-inner hch-hero-inner--centered">
            <p className="hch-hero-eyebrow">
              <span className="hch-hero-eyebrow-line" aria-hidden />
              Beyond the Balance Sheet™ · Employee ownership transitions
            </p>

            <h1 className="hch-hero-headline">Founder Succession Without Selling Out</h1>

            <p className="hch-hero-sub">
              Forhemit structures 100% employee-ownership transitions for founder-led businesses
              and stays involved after close to protect continuity.
            </p>

            <div className="hch-hero-ctas" role="group" aria-label="Primary actions">
              <button
                type="button"
                className="hch-hero-cta hch-hero-cta-primary"
                onClick={() => {
                  if (onStartTwoMinuteCheck) onStartTwoMinuteCheck();
                  else onStartIntake?.("owner");
                }}
              >
                Start Your Free Assessment
              </button>
              <Link href="/brokers" className="hch-hero-cta-link">
                I&apos;m a Broker →
              </Link>
            </div>

            <p className="hch-hero-trust-note">
              🔒 Free assessment · Confidential · 2 minutes
            </p>

            <nav className="hch-hero-pro-links" aria-label="Professional audiences">
              <span className="hch-hero-pro-label">For professionals:</span>
              <Link href="/lenders">Lenders</Link>
              <span className="hch-hero-pro-sep" aria-hidden>·</span>
              <Link href="/legal-practices">Legal</Link>
              <span className="hch-hero-pro-sep" aria-hidden>·</span>
              <Link href="/wealth-managers">Wealth</Link>
              <span className="hch-hero-pro-sep" aria-hidden>·</span>
              <Link href="/appraisers">Appraisers</Link>
              <span className="hch-hero-pro-sep" aria-hidden>·</span>
              <Link href="/accounting-firms">Accounting</Link>
              <span className="hch-hero-pro-sep" aria-hidden>·</span>
              <Link href="/financial-accounting">Finance</Link>
            </nav>
          </div>
        </div>
      </section>

      {SHOW_HOME_PATH_SELECTION ? (
        <HomePathSelectionSection onStartIntake={onStartIntake} />
      ) : null}
    </>
  );
}

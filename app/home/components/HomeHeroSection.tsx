"use client";

import Link from "next/link";
import {
  HomePathSelectionSection,
  type HomePathRole,
} from "./HomePathSelectionSection";

/** Set to true to show the “I am a …” owner / broker path cards below the hero. */
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
              Employee ownership transitions · 3–4 month close
            </p>

            <h1 className="hch-hero-headline">Sell Your Business Today</h1>

            <p className="hch-hero-sub">
              Have a clear path to close in as little as four months
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
                Start My 2-Minute Check
              </button>
              <Link href="/brokers" className="hch-hero-cta hch-hero-cta-secondary">
                I&apos;m a Broker →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {SHOW_HOME_PATH_SELECTION ? (
        <HomePathSelectionSection onStartIntake={onStartIntake} />
      ) : null}
    </>
  );
}

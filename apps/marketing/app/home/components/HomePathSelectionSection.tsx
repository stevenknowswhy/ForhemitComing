"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { HOME_HERO_FAQ_BROKER, HOME_HERO_FAQ_OWNER } from "../constants";

export type HomePathRole = "owner" | "broker";

export type HomePathSelectionSectionProps = {
  onStartIntake?: (role: HomePathRole) => void;
};

export function HomePathSelectionSection({ onStartIntake }: HomePathSelectionSectionProps) {
  const [heroActive, setHeroActive] = useState<HomePathRole | null>(null);
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [faqOpen, setFaqOpen] = useState<{ owner: number | null; broker: number | null }>({
    owner: null,
    broker: null,
  });

  const handleHeroCard = (role: HomePathRole) => {
    if (heroActive === role) {
      setHeroExpanded(false);
      window.setTimeout(() => setHeroActive(null), 300);
    } else {
      setHeroActive(role);
      setHeroExpanded(false);
      window.setTimeout(() => setHeroExpanded(true), 60);
    }
  };

  const handleHeroAdvance = () => {
    if (!heroActive || heroActive === "broker") return;
    onStartIntake?.(heroActive);
  };

  const handlePathCardKeyDown = (role: HomePathRole, e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleHeroCard(role);
    }
  };

  const toggleFaqColumn = (col: HomePathRole) => {
    setFaqOpen((f) => ({
      ...f,
      [col]: f[col] !== null ? null : 0,
    }));
  };

  const toggleFaqItem = (col: HomePathRole, index: number) => {
    setFaqOpen((f) => ({
      ...f,
      [col]: f[col] === index ? null : index,
    }));
  };

  return (
    <section className="home-classification-hero" aria-label="Choose your path">
      <div className="hch-paths-bg">
        <div className="hch-hero-inner">
          <p className="hch-hero-fork-label">I am a …</p>

          <div className="hch-hero-fork">
            <div className="hch-path-col">
              <div
                role="button"
                tabIndex={0}
                className={`hch-path-card ${heroActive === "owner" ? "hch-active" : ""}`}
                onClick={() => handleHeroCard("owner")}
                onKeyDown={(e) => handlePathCardKeyDown("owner", e)}
                aria-expanded={heroActive === "owner"}
              >
                <span className="hch-path-card-role">
                  <span className="hch-path-dot" aria-hidden />
                  For business owners
                </span>
                <span className="hch-path-card-value">
                  Sell your business at <strong>fair market value</strong>
                </span>
                <span className="hch-path-card-sub">
                  Your employees own the business. You get a full-price exit — plus major tax advantages.
                </span>
                <span className="hch-path-free-tag">Free assessment</span>

                <div
                  className={`hch-path-expand ${heroActive === "owner" && heroExpanded ? "hch-open" : ""}`}
                  aria-hidden={!(heroActive === "owner" && heroExpanded)}
                >
                  <div className="hch-path-steps">
                    <div className="hch-path-step-row">
                      <span className="hch-path-step-num">1</span>
                      <div className="hch-path-step-text">
                        <strong>15-min confidential call</strong> — we assess fit and walk you through the economics
                      </div>
                    </div>
                    <div className="hch-path-step-row">
                      <span className="hch-path-step-num">2</span>
                      <div className="hch-path-step-text">
                        <strong>Preliminary valuation</strong> — see what your ESOP exit looks like in real numbers
                      </div>
                    </div>
                    <div className="hch-path-step-row">
                      <span className="hch-path-step-num">3</span>
                      <div className="hch-path-step-text">
                        <strong>Full transition plan</strong> — timeline, financing, tax strategy, all mapped out
                      </div>
                    </div>
                    <button
                      type="button"
                      className="hch-path-cta"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHeroAdvance();
                      }}
                    >
                      Start my free assessment →
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={`hch-faq-toggle ${faqOpen.owner !== null ? "hch-open" : ""}`}
                onClick={() => toggleFaqColumn("owner")}
                aria-expanded={faqOpen.owner !== null}
              >
                Common questions <span className="hch-faq-toggle-arrow">▼</span>
              </button>
              <div className={`hch-faq-panel ${faqOpen.owner !== null ? "hch-open" : ""}`}>
                <div className="hch-faq-list" role="list">
                  {HOME_HERO_FAQ_OWNER.map((item, i) => (
                    <div key={item.q} className="hch-faq-item" role="listitem">
                      <button
                        type="button"
                        className={`hch-faq-q ${faqOpen.owner === i ? "hch-open" : ""}`}
                        onClick={() => toggleFaqItem("owner", i)}
                        aria-expanded={faqOpen.owner === i}
                      >
                        {item.q}
                        <span className="hch-faq-q-icon" aria-hidden>
                          +
                        </span>
                      </button>
                      <div className={`hch-faq-a ${faqOpen.owner === i ? "hch-open" : ""}`}>
                        <div className="hch-faq-a-inner">{item.a}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hch-path-col">
              <div
                role="button"
                tabIndex={0}
                className={`hch-path-card ${heroActive === "broker" ? "hch-active" : ""}`}
                onClick={() => handleHeroCard("broker")}
                onKeyDown={(e) => handlePathCardKeyDown("broker", e)}
                aria-expanded={heroActive === "broker"}
              >
                <span className="hch-path-card-role">
                  <span className="hch-path-dot" aria-hidden />
                  For brokers &amp; advisors
                </span>
                <span className="hch-path-card-value">
                  A <strong>more certain close</strong> on every listing you work
                </span>
                <span className="hch-path-card-sub">
                  Run our ESOP close in parallel with your traditional sale. If your buyer walks, your fee is still
                  protected.
                </span>
                <span className="hch-path-free-tag">No cost to your listing</span>

                <div
                  className={`hch-path-expand ${heroActive === "broker" && heroExpanded ? "hch-open" : ""}`}
                  aria-hidden={!(heroActive === "broker" && heroExpanded)}
                >
                  <div className="hch-path-steps">
                    <div className="hch-path-step-row">
                      <span className="hch-path-step-num">1</span>
                      <div className="hch-path-step-text">
                        <strong>See how dual-track works</strong> — Track A (traditional) + Track B (ESOP) run
                        simultaneously
                      </div>
                    </div>
                    <div className="hch-path-step-row">
                      <span className="hch-path-step-num">2</span>
                      <div className="hch-path-step-text">
                        <strong>Add it to a live deal</strong> — we spin up Track B in the background at no cost to you
                      </div>
                    </div>
                    <div className="hch-path-step-row">
                      <span className="hch-path-step-num">3</span>
                      <div className="hch-path-step-text">
                        <strong>Close either way</strong> — buyer closes? Great. Buyer walks? Track B is already in
                        motion.
                      </div>
                    </div>
                    <Link
                      href="/brokers"
                      className="hch-path-cta"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Add a protected close →
                    </Link>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={`hch-faq-toggle ${faqOpen.broker !== null ? "hch-open" : ""}`}
                onClick={() => toggleFaqColumn("broker")}
                aria-expanded={faqOpen.broker !== null}
              >
                Common questions <span className="hch-faq-toggle-arrow">▼</span>
              </button>
              <div className={`hch-faq-panel ${faqOpen.broker !== null ? "hch-open" : ""}`}>
                <div className="hch-faq-list" role="list">
                  {HOME_HERO_FAQ_BROKER.map((item, i) => (
                    <div key={item.q} className="hch-faq-item" role="listitem">
                      <button
                        type="button"
                        className={`hch-faq-q ${faqOpen.broker === i ? "hch-open" : ""}`}
                        onClick={() => toggleFaqItem("broker", i)}
                        aria-expanded={faqOpen.broker === i}
                      >
                        {item.q}
                        <span className="hch-faq-q-icon" aria-hidden>
                          +
                        </span>
                      </button>
                      <div className={`hch-faq-a ${faqOpen.broker === i ? "hch-open" : ""}`}>
                        <div className="hch-faq-a-inner">{item.a}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

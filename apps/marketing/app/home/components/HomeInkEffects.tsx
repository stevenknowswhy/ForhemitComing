"use client";

import { useEffect } from "react";

/**
 * Motion island for the ink homepage — a direct translation of the
 * prototype's inline script:
 * - hero video fades in on canplay and is removed under reduced motion;
 * - each section's .ink-reveal elements get a 90ms reading-order stagger
 *   and reveal once via IntersectionObserver;
 * - counters tick up once (easeOutCubic, ~1.1s) when the band scrolls in.
 * Content is fully visible without JS: hidden states live behind html.js
 * in home-ink.css and this component only adds the .ink-in class.
 */
export function HomeInkEffects() {
  useEffect(() => {
    const root = document.querySelector(".home-ink");
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Hero video ──
    const heroVideo = root.querySelector<HTMLVideoElement>(".ink-hero-video");
    if (heroVideo) {
      if (reduceMotion) {
        heroVideo.removeAttribute("autoplay");
        heroVideo.pause();
        heroVideo.remove();
      } else {
        const onCanPlay = () => heroVideo.classList.add("ink-on");
        heroVideo.addEventListener("canplay", onCanPlay);
        if (heroVideo.readyState >= 3) heroVideo.classList.add("ink-on");
      }
    }

    // ── Counters ──
    const animateCount = (el: HTMLElement) => {
      const target = parseInt(el.getAttribute("data-count") ?? "", 10);
      if (Number.isNaN(target)) return;
      const comma = el.getAttribute("data-format") === "comma";
      const render = (v: number) => {
        el.textContent = comma ? Math.round(v).toLocaleString("en-US") : String(Math.round(v));
      };
      if (reduceMotion || !("requestAnimationFrame" in window)) {
        render(target);
        return;
      }
      const duration = 1100;
      let start: number | null = null;
      const frame = (ts: number) => {
        if (start === null) start = ts;
        const t = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic — settles gently
        render(target * eased);
        if (t < 1) requestAnimationFrame(frame);
        else render(target);
      };
      requestAnimationFrame(frame);
    };

    let counted = false;
    const runCounters = () => {
      if (counted) return;
      counted = true;
      root.querySelectorAll<HTMLElement>("[data-count]").forEach(animateCount);
    };

    // ── Reveals: per-section stagger, once each ──
    const revealEls = Array.from(root.querySelectorAll<HTMLElement>(".ink-reveal"));
    const observers: IntersectionObserver[] = [];

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("ink-in"));
      runCounters();
    } else {
      const sectionCounts = new Map<Element, number>();
      revealEls.forEach((el) => {
        const section = el.closest("section, header, footer") ?? document.body;
        const idx = sectionCounts.get(section) ?? 0;
        sectionCounts.set(section, idx + 1);
        el.style.transitionDelay = `${Math.min(idx * 90, 540)}ms`;
      });

      const revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              (e.target as HTMLElement).classList.add("ink-in");
              revealObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      revealEls.forEach((el) => revealObs.observe(el));
      observers.push(revealObs);

      const band = root.querySelector(".ink-counters");
      if (band) {
        const bandObs = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                runCounters();
                bandObs.disconnect();
              }
            });
          },
          { threshold: 0.25 },
        );
        bandObs.observe(band);
        observers.push(bandObs);
      } else {
        runCounters();
      }
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return null;
}

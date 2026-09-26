"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealSectionProps = {
  className: string;
  ariaLabel: string;
  children: ReactNode;
};

/**
 * Section wrapper for the scroll-reveal behavior. Children render on the
 * server; only the `hps-revealed` class toggle hydrates. The pre-reveal
 * hidden state is gated behind `html.js` in CSS, so no-JS contexts always
 * see the full content (P1-2).
 */
export function RevealSection({ className, ariaLabel, children }: RevealSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`${className}${isRevealed ? " hps-revealed" : ""}`}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
}

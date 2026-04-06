"use client";

import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { id: "fmp-why", label: "Why Forhemit" },
  { id: "fmp-eligibility", label: "Is This for Me?" },
  { id: "fmp-timeline", label: "The Timeline" },
  { id: "fmp-realism", label: "Realistic Timing" },
  { id: "fmp-checkpoints", label: "Checkpoints" },
  { id: "fmp-money", label: "How Money Moves" },
  { id: "fmp-roles", label: "Your Role" },
  { id: "fmp-privacy", label: "Your Privacy" },
  { id: "fmp-comparison", label: "Compare Paths" },
  { id: "fmp-1042", label: "§1042 Tax Election" },
  { id: "fmp-cost-glance", label: "Cost at a Glance" },
  { id: "fmp-fees", label: "Fee Breakdown" },
  { id: "fmp-after-close", label: "After Close" },
  { id: "fmp-first-call", label: "Your First Call" },
  { id: "fmp-get-started", label: "Get Started" },
];

export function FloatingNav() {
  const [activeId, setActiveId] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible: { id: string; top: number }[] = [];

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.push({
              id: entry.target.id,
              top: entry.boundingClientRect.top,
            });
          }
        });

        if (visible.length > 0) {
          visible.sort((a, b) => Math.abs(a.top) - Math.abs(b.top));
          setActiveId(visible[0].id);
        }
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: [0, 0.15] }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="fmp-floating-nav" aria-label="Page sections">
      <p className="fmp-floating-nav__title">On this page</p>
      <ul className="fmp-floating-nav__list">
        {NAV_ITEMS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`fmp-floating-nav__link${activeId === id ? " fmp-floating-nav__link--active" : ""}`}
              onClick={(e) => handleClick(e, id)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

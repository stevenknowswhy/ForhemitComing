"use client";

import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { id: "brk-why", label: "Why Forhemit" },
  { id: "brk-workload", label: "Your Time" },
  { id: "brk-qualify", label: "Who Qualifies" },
  { id: "brk-buyer", label: "Who Is the Buyer" },
  { id: "brk-outcomes", label: "Dual-Track Outcomes" },
  { id: "brk-timeline", label: "The Timeline" },
  { id: "brk-realism", label: "Realistic Timing" },
  { id: "brk-pdf", label: "Roadmap HTML" },
  { id: "brk-checkpoints", label: "Checkpoints" },
  { id: "brk-process", label: "How It Runs" },
  { id: "brk-insurance", label: "Insurance Mindset" },
  { id: "brk-first-call", label: "First Conversation" },
  { id: "brk-get-started", label: "Get Started" },
];

export function BrokersFloatingNav() {
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

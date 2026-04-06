"use client";

import { useEffect } from "react";
import { useGlobalScrollReveal } from "@/hooks/useIntersectionObserver";

export function useLegalPageAnimations() {
  // Global scroll reveal for all animated elements
  useGlobalScrollReveal();

  // Stats section observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    const statsElements = document.querySelectorAll(".stats-intro, .stats-grid, .stats-realization");
    statsElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

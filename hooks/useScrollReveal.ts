"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions {
  animation?: string;
  delay?: number;
  threshold?: number;
}

interface UseScrollRevealReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
}

export function useScrollReveal({
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
}: UseScrollRevealOptions = {}): UseScrollRevealReturn {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isVisible };
}

// Simple parallax hook
export function useParallax(speed: number = 0.1): {
  ref: React.RefObject<HTMLDivElement | null>;
  offset: number;
} {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const offset = scrollY * speed;

  return { ref, offset };
}

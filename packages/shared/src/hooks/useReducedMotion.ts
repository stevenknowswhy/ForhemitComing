"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the user has requested reduced motion
 * for accessibility purposes.
 * 
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference on mount
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Configuration object for animation durations
 * based on reduced motion preference
 */
export interface AnimationConfig {
  duration: number;
  delay: number;
  easing?: string;
}

export function getAnimationConfig(
  reducedMotion: boolean,
  normalConfig: AnimationConfig,
  reducedConfig: AnimationConfig
): AnimationConfig {
  return reducedMotion ? reducedConfig : normalConfig;
}

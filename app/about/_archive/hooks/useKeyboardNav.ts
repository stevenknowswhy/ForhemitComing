"use client";

import { useEffect, useCallback } from "react";

interface UseKeyboardNavOptions {
  onLeft: () => void;
  onRight: () => void;
  onEscape?: () => void;
  enabled?: boolean;
  debounceMs?: number;
}

/**
 * Hook for keyboard navigation in gallery
 * Handles arrow keys with debouncing for rapid keypresses
 */
export function useKeyboardNav({
  onLeft,
  onRight,
  onEscape,
  enabled = true,
  debounceMs = 300,
}: UseKeyboardNavOptions) {
  // Track last navigation time for debouncing
  const getLastNavTime = useCallback(() => {
    if (typeof window === "undefined") return 0;
    const time = (window as Window & { __galleryNavTime?: number }).__galleryNavTime;
    return time || 0;
  }, []);

  const setLastNavTime = useCallback(() => {
    if (typeof window === "undefined") return;
    (window as Window & { __galleryNavTime?: number }).__galleryNavTime = Date.now();
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Debounce rapid keypresses
      const now = Date.now();
      const lastNav = getLastNavTime();
      if (now - lastNav < debounceMs) {
        event.preventDefault();
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          setLastNavTime();
          onLeft();
          // Audible feedback for accessibility
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(10);
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          setLastNavTime();
          onRight();
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(10);
          }
          break;
        case "Escape":
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
      }
    },
    [enabled, debounceMs, onLeft, onRight, onEscape, getLastNavTime, setLastNavTime]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Focus management - ensure gallery is focusable
  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    // Set initial focus to gallery container for screen readers
    const galleryContainer = document.querySelector("[role='region'][aria-roledescription='carousel']");
    if (galleryContainer && !document.activeElement?.closest("[role='region'][aria-roledescription='carousel']")) {
      // Only set focus if no element within gallery is already focused
      (galleryContainer as HTMLElement)?.focus({ preventScroll: true });
    }
  }, [enabled]);
}

/**
 * Hook for focus trap within gallery
 * Keeps keyboard navigation within gallery when active
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || typeof document === "undefined" || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    return () => container.removeEventListener("keydown", handleTabKey);
  }, [containerRef, enabled]);
}

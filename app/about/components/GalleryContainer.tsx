"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { GalleryContainerProps, GalleryState } from "../types/gallery";
import { GalleryItem } from "./GalleryItem";
import { useKeyboardNav, useFocusTrap } from "../hooks/useKeyboardNav";
import { useGalleryGestures, useWheelNav } from "../hooks/useGalleryGestures";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Gallery Container - Manages gallery state, gestures, and layout
 * Handles swipe, drag, keyboard, and wheel navigation
 */
export function GalleryContainer({ slides }: GalleryContainerProps) {
  const [state, setState] = useState<GalleryState>({
    currentIndex: 0,
    direction: 0,
    isDragging: false,
    dragOffset: 0,
    isTransitioning: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const totalSlides = slides.length;
  const isSingleSlide = totalSlides <= 1;

  // Navigation handlers
  const goToSlide = useCallback(
    (index: number) => {
      if (
        index === state.currentIndex ||
        index < 0 ||
        index >= totalSlides ||
        state.isTransitioning
      ) {
        return;
      }

      const direction = index > state.currentIndex ? 1 : -1;

      setState((prev) => ({
        ...prev,
        direction,
        currentIndex: index,
        isTransitioning: true,
      }));

      // Reset transition state after animation
      setTimeout(() => {
        setState((prev) => ({ ...prev, isTransitioning: false }));
      }, prefersReducedMotion ? 0 : 500);
    },
    [state.currentIndex, state.isTransitioning, totalSlides, prefersReducedMotion]
  );

  const goToNext = useCallback(() => {
    if (state.currentIndex < totalSlides - 1) {
      goToSlide(state.currentIndex + 1);
    }
  }, [state.currentIndex, totalSlides, goToSlide]);

  const goToPrevious = useCallback(() => {
    if (state.currentIndex > 0) {
      goToSlide(state.currentIndex - 1);
    }
  }, [state.currentIndex, goToSlide]);

  // Keyboard navigation
  useKeyboardNav({
    onLeft: goToPrevious,
    onRight: goToNext,
    enabled: !isSingleSlide,
    debounceMs: 300,
  });

  // Focus trap
  useFocusTrap(containerRef, !isSingleSlide);

  // Touch/mouse gestures
  const { containerStyle, dragProps } = useGalleryGestures({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    onDragStart: () =>
      setState((prev) => ({ ...prev, isDragging: true })),
    onDragEnd: () =>
      setState((prev) => ({ ...prev, isDragging: false })),
    enabled: !isSingleSlide,
  });

  // Wheel/trackpad navigation
  const { handleWheel } = useWheelNav({
    onScrollLeft: goToPrevious,
    onScrollRight: goToNext,
    enabled: !isSingleSlide,
    throttleMs: 500,
  });

  // Handle wheel events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Preload next image
  useEffect(() => {
    const preloadIndex = state.currentIndex + 1;
    if (preloadIndex < totalSlides) {
      const img = new Image();
      img.src = slides[preloadIndex].image;
    }
  }, [state.currentIndex, slides, totalSlides]);

  // Determine visible slides for animation
  const getSlideState = (index: number) => {
    const diff = index - state.currentIndex;
    return {
      isActive: diff === 0,
      isAdjacent: Math.abs(diff) === 1,
      position: diff,
    };
  };

  return (
    <div
      ref={containerRef}
      className="gallery-container"
      role="region"
      aria-roledescription="carousel"
      aria-label="About us story"
      tabIndex={0}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        outline: "none",
        ...containerStyle,
      }}
    >
      {/* Slides */}
      <motion.div
        className="gallery-slides"
        drag={isSingleSlide ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        {...dragProps}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <AnimatePresence initial={false} custom={state.direction} mode="popLayout">
          {slides.map((slide, index) => {
            const { isActive, isAdjacent } = getSlideState(index);

            // Only render active and adjacent slides for performance
            if (!isActive && !isAdjacent) return null;

            return (
              <GalleryItem
                key={slide.id}
                slide={slide}
                isActive={isActive}
                isAdjacent={isAdjacent}
                direction={state.direction}
                index={index}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Navigation Arrows - Desktop Only */}
      {!isSingleSlide && (
        <>
          <NavigationArrow
            direction="left"
            onClick={goToPrevious}
            disabled={state.currentIndex === 0}
            ariaLabel="Previous slide"
          />
          <NavigationArrow
            direction="right"
            onClick={goToNext}
            disabled={state.currentIndex === totalSlides - 1}
            ariaLabel="Next slide"
          />
        </>
      )}

      {/* Screen reader live region for slide announcements */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Slide {state.currentIndex + 1} of {totalSlides}: {slides[state.currentIndex]?.title}
      </div>
    </div>
  );
}

/**
 * Navigation Arrow Button Component
 */
interface NavigationArrowProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
}

function NavigationArrow({
  direction,
  onClick,
  disabled,
  ariaLabel,
}: NavigationArrowProps) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      className={`gallery-nav-arrow gallery-nav-arrow-${direction}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      style={{
        position: "absolute",
        top: "50%",
        [direction]: "1rem",
        transform: "translateY(-50%)",
        zIndex: 20,
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "rgba(14, 14, 12, 0.6)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(139, 90, 43, 0.3)",
        color: "#f5f0e8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.3 : 1,
        transition: "all 0.3s ease",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = "rgba(139, 90, 43, 0.4)";
          e.currentTarget.style.borderColor = "rgba(139, 90, 43, 0.6)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(14, 14, 12, 0.6)";
        e.currentTarget.style.borderColor = "rgba(139, 90, 43, 0.3)";
      }}
      onFocus={(e) => {
        if (!disabled) {
          e.currentTarget.style.boxShadow = "0 0 0 2px rgba(139, 90, 43, 0.5)";
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Icon size={24} strokeWidth={1.5} />
    </button>
  );
}

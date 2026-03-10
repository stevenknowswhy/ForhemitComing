"use client";

import { useRef, useCallback, useState } from "react";
import { PanInfo } from "framer-motion";
import { GESTURE_CONFIG } from "../lib/galleryData";

interface UseGalleryGesturesOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  enabled?: boolean;
}

interface DragState {
  isDragging: boolean;
  offset: number;
  velocity: number;
}

/**
 * Hook for handling touch/mouse gestures in gallery
 * Implements velocity-based snapping with physics
 */
export function useGalleryGestures({
  onSwipeLeft,
  onSwipeRight,
  onDragStart,
  onDragEnd,
  enabled = true,
}: UseGalleryGesturesOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    offset: 0,
    velocity: 0,
  });

  // Track if user prefers reduced motion
  const prefersReducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
    : false;

  const handleDragStart = useCallback(() => {
    if (!enabled) return;
    
    setDragState((prev) => ({ ...prev, isDragging: true }));
    onDragStart?.();

    // Change cursor to grabbing
    if (containerRef.current) {
      containerRef.current.style.cursor = "grabbing";
    }
  }, [enabled, onDragStart]);

  const handleDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!enabled) return;

      setDragState({
        isDragging: true,
        offset: info.offset.x,
        velocity: info.velocity.x,
      });
    },
    [enabled]
  );

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!enabled) return;

      const offset = info.offset.x;
      const velocity = info.velocity.x;
      const absOffset = Math.abs(offset);
      const absVelocity = Math.abs(velocity);

      // Determine if we should change slides based on velocity or displacement
      const shouldChangeSlide =
        absOffset > GESTURE_CONFIG.swipeThreshold ||
        absVelocity > GESTURE_CONFIG.velocityThreshold;

      if (shouldChangeSlide) {
        // Velocity-based direction detection (more responsive than offset alone)
        const direction = velocity !== 0 ? Math.sign(velocity) : Math.sign(offset);
        
        if (direction > 0) {
          // Dragged right -> go to previous slide
          onSwipeRight();
        } else {
          // Dragged left -> go to next slide
          onSwipeLeft();
        }

        // Haptic feedback on supported devices
        if (typeof navigator !== "undefined" && navigator.vibrate && !prefersReducedMotion) {
          navigator.vibrate(10);
        }
      }

      setDragState({
        isDragging: false,
        offset: 0,
        velocity: 0,
      });

      onDragEnd?.();

      // Reset cursor
      if (containerRef.current) {
        containerRef.current.style.cursor = "grab";
      }
    },
    [enabled, onSwipeLeft, onSwipeRight, onDragEnd, prefersReducedMotion]
  );

  // Cursor style for grab state
  const containerStyle = {
    cursor: enabled ? ("grab" as const) : ("default" as const),
    touchAction: "pan-y pinch-zoom" as const, // Allow vertical scroll, handle horizontal ourselves
  };

  return {
    containerRef,
    dragState,
    containerStyle,
    dragProps: {
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
    },
  };
}

/**
 * Hook for handling wheel/trackpad horizontal scrolling
 */
export function useWheelNav({
  onScrollLeft,
  onScrollRight,
  enabled = true,
  throttleMs = 500,
}: {
  onScrollLeft: () => void;
  onScrollRight: () => void;
  enabled?: boolean;
  throttleMs?: number;
}) {
  const lastScrollTime = useRef(0);
  const accumulatedDelta = useRef(0);
  const threshold = 50; // Accumulated delta threshold

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (!enabled) return;

      // Only handle horizontal scrolling or trackpad horizontal gestures
      const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      
      if (!isHorizontal) {
        // Reset accumulated delta on vertical scroll
        accumulatedDelta.current = 0;
        return;
      }

      event.preventDefault();

      const now = Date.now();
      if (now - lastScrollTime.current < throttleMs) {
        return;
      }

      accumulatedDelta.current += event.deltaX;

      if (Math.abs(accumulatedDelta.current) > threshold) {
        lastScrollTime.current = now;
        
        if (accumulatedDelta.current > 0) {
          onScrollRight();
        } else {
          onScrollLeft();
        }
        
        accumulatedDelta.current = 0;
      }
    },
    [enabled, throttleMs, onScrollLeft, onScrollRight]
  );

  return { handleWheel };
}

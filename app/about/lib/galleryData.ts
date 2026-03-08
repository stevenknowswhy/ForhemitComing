/**
 * Gallery Data - Content configuration for About page slides
 * Phase 1: Placeholder content (colored divs with text)
 * Phase 2: Replace with actual storytelling content
 */

import { GallerySlide } from "../types/gallery";

export const gallerySlides: GallerySlide[] = [
  {
    id: "origin",
    index: 0,
    image: "/gallery/placeholder-1.jpg",
    imageAlt: "Our origin story",
    title: "Where It Began",
    subtitle: "A vision to transform how exceptional talent connects with purpose-driven capital. Every great movement starts with a single insight.",
    accent: "Chapter One",
  },
  {
    id: "philosophy",
    index: 1,
    image: "/gallery/placeholder-2.jpg",
    imageAlt: "Our investment philosophy",
    title: "The Philosophy",
    subtitle: "We don't just invest in companies. We invest in people who see what others don't. Conviction over consensus, always.",
    accent: "Our Approach",
  },
  {
    id: "process",
    index: 2,
    image: "/gallery/placeholder-3.jpg",
    imageAlt: "Our selection process",
    title: "Rigorous Selection",
    subtitle: "Less than 3% of applicants make it through. We seek the exceptional—the outliers who redefine what's possible.",
    accent: "The Standard",
  },
  {
    id: "partnership",
    index: 3,
    image: "/gallery/placeholder-4.jpg",
    imageAlt: "Partnership model",
    title: "True Partnership",
    subtitle: "Capital is just the beginning. We provide strategic guidance, operational expertise, and a network built over decades.",
    accent: "Beyond Capital",
  },
  {
    id: "future",
    index: 4,
    image: "/gallery/placeholder-5.jpg",
    imageAlt: "Looking forward",
    title: "The Future",
    subtitle: "We're building something that lasts. A new model where talent and capital create value that extends far beyond returns.",
    accent: "What's Next",
  },
];

// Theme configuration matching home page aesthetic
export const galleryTheme = {
  colors: {
    background: "#1a1209",
    backgroundSecondary: "#0e0e0c",
    textPrimary: "#f5f0e8",
    textSecondary: "#a09a90",
    accent: "#8b5a2b",
    accentLight: "#c9a86c",
    muted: "#5a544a",
  },
  fonts: {
    heading: "var(--font-outfit), 'Outfit', sans-serif",
    body: "var(--font-inter), 'Inter', sans-serif",
    mono: "var(--font-dm-mono), 'DM Mono', monospace",
  },
  animation: {
    slideTransition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
    scaleTransition: {
      type: "tween" as const,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom ease-out-cubic
      duration: 0.4,
    },
  },
};

// Swipe/drag thresholds for gesture physics
export const GESTURE_CONFIG = {
  swipeThreshold: 50, // Minimum px to trigger slide change
  velocityThreshold: 0.5, // Minimum velocity for flick gesture
  dragElastic: 0.1, // Resistance when dragging beyond bounds
  snapDuration: 0.3, // Duration for snap animation
};

/**
 * Gallery Data - Content configuration for About page slides
 * Uses curated Unsplash images for premium visual experience
 */

import { GallerySlide } from "../types/gallery";
import { curatedGalleryImages, getGalleryImage, getImageCredit } from "./unsplash";

export const gallerySlides: GallerySlide[] = [
  {
    id: "tidal-wave",
    index: 0,
    image: curatedGalleryImages[0].url,
    imageAlt: curatedGalleryImages[0].alt,
    title: "The $10 Trillion Tidal Wave",
    subtitleAccent: "The Transfer No One Is Ready For",
    subtitle: "A generational transfer of ownership is coming. Most founder led companies have no clear succession plan or exit. Without Buyers, trillions in value with millions of jobs will simply disappear. There are not enough Buyers to take over the number of businesses coming up for sale.",
    accent: "Chapter One",
  },
  {
    id: "philosophy",
    index: 1,
    image: curatedGalleryImages[1].url,
    imageAlt: curatedGalleryImages[1].alt,
    title: "The Philosophy",
    subtitleAccent: "The AI Disruption Is Already Here",
    subtitle: "Artificial intelligence isn't a future problem — it's a present reality reshaping every industry. In the coming years, millions of jobs will be transformed or eliminated. Workers without equity, without ownership, without a stake in companies they serve will be most vulnerable. A paycheck is no longer a safety net.",
    accent: "Our Approach",
  },
  {
    id: "process",
    index: 2,
    image: curatedGalleryImages[2].url,
    imageAlt: curatedGalleryImages[2].alt,
    title: "Rigorous Selection",
    subtitle: "Less than 3% of applicants make it through. We seek the exceptional—the outliers who redefine what's possible.",
    accent: "The Standard",
  },
  {
    id: "partnership",
    index: 3,
    image: curatedGalleryImages[3].url,
    imageAlt: curatedGalleryImages[3].alt,
    title: "True Partnership",
    subtitle: "Capital is just the beginning. We provide strategic guidance, operational expertise, and a network built over decades.",
    accent: "Beyond Capital",
  },
  {
    id: "future",
    index: 4,
    image: curatedGalleryImages[4].url,
    imageAlt: curatedGalleryImages[4].alt,
    title: "The Future",
    subtitle: "We're building something that lasts. A new model where talent and capital create value that extends far beyond returns.",
    accent: "What's Next",
  },
];

// Export helper functions for image handling
export { getGalleryImage, getImageCredit };

// Theme configuration matching home page aesthetic
export const galleryTheme = {
  colors: {
    background: "#1a1209",
    backgroundSecondary: "#0e0e0c",
    textPrimary: "#f5f0e8",
    textSecondary: "#a09a90",
    accent: "#FF6B00",
    accentLight: "#ff8c33",
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

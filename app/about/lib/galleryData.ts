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
    title: "The AI Disruption",
    subtitleAccent: "The AI Disruption Is Already Here",
    subtitle: "Artificial intelligence isn't a future problem — it's a present reality reshaping every industry. In the coming years, millions of jobs will be transformed or eliminated. Workers without equity, without ownership, without a stake in companies they serve will be most vulnerable. A paycheck is no longer a safety net.",
    accent: "Our Approach",
  },
  {
    id: "process",
    index: 2,
    image: curatedGalleryImages[2].url,
    imageAlt: curatedGalleryImages[2].alt,
    title: "Extract vs. Build",
    subtitleAccent: "Why Private Equity Lost the Public Trust",
    subtitle: "Traditional PE has become synonymous with strip-mining: leveraged buyouts, asset stripping, and 3-5 year flip cycles that prioritize IRR over impact. The model works mathematically but has earned the industry a reputation for destroying companies and communities. That model is no longer sustainable.",
    accent: "The Standard",
  },
  {
    id: "partnership",
    index: 3,
    image: curatedGalleryImages[3].url,
    imageAlt: curatedGalleryImages[3].alt,
    title: "Forhemit Does Private Equity Differently",
    subtitleAccent: "We don't extract value. We build it—permanently.",
    subtitle: "We don't extract value from businesses. We use stewardship capital to continue building the company you spent a lifetime creating. Forhemit acquires companies and transitions your company into 100% employee-owned ESOPs, where the people who build the business own the business. We become a permanent holding company, not a temporary landlord looking for the fastest exit.",
    accent: "Beyond Capital",
  },
  {
    id: "future",
    index: 4,
    image: curatedGalleryImages[4].url,
    imageAlt: curatedGalleryImages[4].alt,
    title: "Who Benefits",
    subtitleAccent: "Aligned Success",
    subtitle: "Sellers preserve their name and legacy.\nEmployees gain ownership and long-term security.\nInvestors earn reliable returns from healthy companies.\nMid-market businesses, the backbone in most neighborhoods, stays in the community.",
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

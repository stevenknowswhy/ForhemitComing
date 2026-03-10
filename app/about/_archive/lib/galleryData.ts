/**
 * Gallery Data - Content configuration for About page slides
 * Uses curated Unsplash images for premium visual experience
 */

import { GallerySlide } from "../types";
import { curatedGalleryImages, getGalleryImage, getImageCredit } from "./unsplash";

export const gallerySlides: GallerySlide[] = [
  {
    id: "saving-jobs",
    index: 0,
    image: curatedGalleryImages[0].url,
    imageAlt: curatedGalleryImages[0].alt,
    title: "Your Legacy Deserves Better",
    subtitleAccent: "The real risk isn't choosing the wrong option. It's assuming you have one.",
    subtitle: "Here's a secret your broker won't tell you: today, 70-80% of businesses that go to market never sell. Not because they were bad. It's because for every 50 businesses for sale, there is roughly one qualified buyer. And with millions of Baby Boomers retiring over the next decade, that ratio is about to get much worse.\n\nDo the math. What happens when you're ready to retire, and there is no buyer waiting? Your employees lose their jobs. Your business vanishes from the community. Everything you've spent decades building ends with a \"Closed\" sign on the door.\n\nBut there is a better option.\n\nA buyer who already knows your business, your customers, and your culture. Because you hired them.\n\nWe help you transition your company to 100% employee ownership. You get the payout you've earned. They get the future they deserve.\n\nAnd the company you spent your life building doesn't end with a \"Closed\" sign. It begins your legacy.",
    accent: "Our Mission",
  },
  {
    id: "disaster-response",
    index: 1,
    image: curatedGalleryImages[1].url,
    imageAlt: curatedGalleryImages[1].alt,
    title: "From Disaster Response to Business Resilience",
    subtitleAccent: "A Foundation in Fortification",
    subtitle: "Forhemit was born from a career spent protecting the critical infrastructure of San Francisco. In the world of disaster preparedness, \"Continuity of Operations\" isn't just a plan—it's a requirement for survival.",
    extendedContent: "## The Coming Disaster\n\nForhemit was not founded by a broker or a financial guru. It was founded by a specialist in Disaster Preparedness.\n\nStefano's background isn't in finance; it's in mitigation. In the world of emergency management, the goal is to see a crisis before it arrives and transition people through the disaster safely. We are now approaching an economic disaster, one that threatens not just a single business, but the very fabric of local communities.\n\n### The three-pronged crisis converging on the American business owner:\n\n**The Retirement Cliff:** A \"Silver Tsunami\" is hitting the market. With up to 100 sellers for every one qualified buyer, the traditional market is saturated. For most owners, this math means their payout—and their retirement—is at risk.\n\n**The Workforce Crisis:** Your employees are facing a dual threat of displacement. They fear losing their livelihoods to a heartless new owner, the rapid rise of AI, or the \"Closed\" sign that appears when a business fails to find a buyer.\n\n**The Community Collapse:** When a local business vanishes, it isn't just a transaction that ends. The city loses its tax base, its history, and its economic heart.\n\n## Our Mission is Our Mandate\n\nForhemit was born to mitigate these disasters. We aren't here to \"flip\" a company; we are here to preserve a legacy.\n\nBecause we believe this mission is too important to be left to chance, Forhemit is a Public Benefit Corporation. Our commitment to serving owners, protecting employees, and strengthening communities isn't a page on our website—it is written into our corporate bylaws.\n\nWe exist to ensure that the story you spent decades writing doesn't end in a disaster. It ends with a transition to the people who helped you build it.",
    accent: "Chapter One",
  },
  {
    id: "public-benefit",
    index: 2,
    image: curatedGalleryImages[2].url,
    imageAlt: curatedGalleryImages[2].alt,
    title: "The Public Benefit Mandate",
    subtitleAccent: "Legacy is Our Legal Requirement",
    subtitle: "We are not a traditional stewardship management organization; we are a Public Benefit Corporation. This means we are legally chartered to prioritize the health of our businesses, the welfare of their employees, and the stability of their communities. We don't \"strip and flip\"—we inherit and improve. Our mandate is to build healthy businesses that stay rooted exactly where they were built.\n\n[Download PDF: Our PBC Charter & Social Impact Framework]",
    accent: "Our Approach",
  },
  {
    id: "ai-shield",
    index: 3,
    image: curatedGalleryImages[3].url,
    imageAlt: curatedGalleryImages[3].alt,
    title: "The AI Shield: Ownership as Defense",
    subtitleAccent: "A Hedge Against AI Apocalypse",
    subtitle: "We believe AI should be a tool for augmentation, not a reason for displacement. In the coming shift, only way to ensure technology benefits people is to make people the owners of technology. By converting businesses to employee ownership, we ensure that when efficiency increases, wealth stays with workers rather than being extracted.\n\n[Download PDF: The AI Perfect Storm: Why Ownership is the Ultimate Hedge]",
    accent: "The Standard",
  },
  {
    id: "investor-thesis",
    index: 4,
    image: curatedGalleryImages[4].url,
    imageAlt: curatedGalleryImages[4].alt,
    title: "For Investors: The Stewardship Alpha",
    subtitleAccent: "Respectable Returns, Rooted in Reality",
    subtitle: "We provide family offices and pension funds with respectable market returns that align with their long-term fiduciary goals. By utilizing structural tax advantages (S-Corp ESOPs) and reducing the \"Key-Man Risk\" of retiring founders, we deliver a \"Stewardship Alpha\"—yield that is protected by operational resilience rather than aggressive financial leverage.\n\n[Download PDF: The Investor Thesis: Resilience as an Asset Class]",
    accent: "Beyond Capital",
  },
  {
    id: "employee-equity",
    index: 5,
    image: curatedGalleryImages[5].url,
    imageAlt: curatedGalleryImages[5].alt,
    title: "For Employees: The IKEA Effect of Equity",
    subtitleAccent: "From Line Items to Owners",
    subtitle: "We give employees a stake in the company they helped build. When workers become owners, they don't just \"show up\"—they steward. Through our framework, we provide a path to equity for everyone from shop floor to the executive suite, creating a \"Golden Parachute\" for the workforce that ensures long-term wealth creation for those who drive the value.\n\n[Download PDF: The Employee Ownership Transition Framework]",
    accent: "What's Next",
  },
  {
    id: "community-pledge",
    index: 6,
    image: curatedGalleryImages[6].url,
    imageAlt: curatedGalleryImages[6].alt,
    title: "For Community: The Continuity Pledge",
    subtitleAccent: "Protecting Local Engine",
    subtitle: "When a local business is sold to traditional buyers, jobs and taxes often leave the community. Our Continuity Pledge is a commitment to keeping businesses rooted in their neighborhoods. We preserve \"tribal knowledge\" of the founder and ensure that that business remains an anchor of the local economy for the next twenty years and beyond.\n\n[Download PDF: The Continuity Pledge: Our Commitment to Community]",
    accent: "Our Foundation",
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

import { ReactNode } from "react";

// ============================================================================
// FAQ Types
// ============================================================================

export interface FAQ {
  question: string;
  answer: ReactNode | string;
}

export interface FAQSectionData {
  title: string;
  subtitle?: string;
  faqs: FAQ[];
}

// ============================================================================
// Card Types
// ============================================================================

export interface DossierCardProps {
  number: string;
  headline: string;
  title: string;
  copy: string;
  cta: string;
  icon: string;
}

export interface BenefitCardProps {
  number: string;
  title: string;
  description: string;
  icon: string;
}

// ============================================================================
// Contact & Form Types
// ============================================================================

export type ContactType =
  | "business-owner"
  | "partner"
  | "existing-business"
  | "website-visitor"
  | "marketing";

export type InterestType =
  | "esop-transition"
  | "accounting"
  | "legal"
  | "lending"
  | "broker"
  | "wealth"
  | "appraisal"
  | "career"
  | "general";

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "interview-scheduled"
  | "rejected"
  | "hired";

export type ContactStatus = "new" | "in-progress" | "responded" | "closed";

// ============================================================================
// Animation Types
// ============================================================================

export type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-up"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "fade-in";

export interface ScrollRevealConfig {
  animation: AnimationType;
  delay?: number;
  threshold?: number;
}

// ============================================================================
// Page Section Types
// ============================================================================

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

export interface ComparisonRow {
  label: string;
  traditional: string;
  forhemit: string;
}

export interface StatItem {
  value: string;
  label: string;
}

// ============================================================================
// Admin Types
// ============================================================================

export interface ListOptions {
  limit?: number;
  status?: string;
}

export interface ApplicationStats {
  total: number;
  byStatus: Record<string, number>;
  byPosition: Record<string, number>;
}

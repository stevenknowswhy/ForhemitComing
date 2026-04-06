/**
 * Introduction Letter Generator - Type Definitions
 * Professional letter generation tool for Forhemit
 */

// ── Recipient Types ────────────────────────────────────────────────────────

export type RecipientType =
  | "seller"
  | "broker"
  | "attorney"
  | "lender"
  | "esop"
  | "valuation"
  | "cpa"
  | "wealth"
  | "accountant";

export interface RecipientOption {
  value: RecipientType;
  label: string;
}

// ── Contact Information ────────────────────────────────────────────────────

export interface ContactInfo {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  cityState: string;
}

export interface SenderInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  website: string;
}

export interface CompanyInfo {
  address: string;
  letterDate: string;
}

// ── Main Input Type ────────────────────────────────────────────────────────

export interface LetterGeneratorInputs {
  recipientType: RecipientType;
  contact: ContactInfo;
  sender: SenderInfo;
  company: CompanyInfo;
}

// ── Letter Content Structure ───────────────────────────────────────────────

export interface LetterTemplate {
  subject: string;
  opening: string;
  valueHeader: string;
  value: string[];
  cta: string;
}

export type LetterTemplates = Record<RecipientType, LetterTemplate>;

// ── Rendered Letter Data ───────────────────────────────────────────────────

export interface RenderedLetter {
  subject: string;
  greeting: string;
  opening: string;
  valueHeader: string;
  valuePoints: string[];
  cta: string;
  contactName: string;
  contactTitle: string;
  contactCompany: string;
  contactCity: string;
  senderName: string;
  senderTitle: string;
  senderPhone: string;
  senderEmail: string;
  senderWeb: string;
  addressHtml: string;
  date: string;
}

/**
 * Introduction Letter Generator
 * Professional letter generation tool for Forhemit
 */

// Main component
export { default, LetterGeneratorForm } from "./LetterGeneratorForm";

// Types
export type {
  LetterGeneratorInputs,
  RecipientType,
  ContactInfo,
  SenderInfo,
  CompanyInfo,
  LetterTemplate,
  RenderedLetter,
} from "./types";

// Constants
export {
  RECIPIENT_OPTIONS,
  LETTER_TEMPLATES,
  DEFAULT_INPUTS,
  PLACEHOLDERS,
} from "./constants";

// Hooks
export { useLetterGenerator } from "./hooks/useLetterGenerator";

// Library functions
export {
  getTodayDate,
  formatAddressHtml,
  getContactName,
  getGreeting,
  processTemplate,
  getValueOrPlaceholder,
  renderLetter,
  formatMultilineText,
} from "./lib";

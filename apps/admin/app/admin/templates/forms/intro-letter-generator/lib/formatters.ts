/**
 * Introduction Letter Generator - Formatters
 */

import { LetterGeneratorInputs, LetterTemplate, RenderedLetter } from "../types";
import { LETTER_TEMPLATES, PLACEHOLDERS } from "../constants";

/**
 * Get today's date formatted
 */
export function getTodayDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format multiline address for HTML display
 */
export function formatAddressHtml(address: string): string {
  return address.replace(/\n/g, "<br>");
}

/**
 * Get full contact name
 */
export function getContactName(
  firstName: string,
  lastName: string
): { fullName: string; isPlaceholder: boolean } {
  if (firstName.trim() || lastName.trim()) {
    return { fullName: `${firstName} ${lastName}`.trim(), isPlaceholder: false };
  }
  return { fullName: PLACEHOLDERS.contactName, isPlaceholder: true };
}

/**
 * Get greeting based on first name
 */
export function getGreeting(firstName: string): { text: string; isPlaceholder: boolean } {
  if (firstName.trim()) {
    return { text: `Dear ${firstName},`, isPlaceholder: false };
  }
  return { text: `Dear ${PLACEHOLDERS.contactFirst},`, isPlaceholder: true };
}

/**
 * Process template text with variable substitution
 */
export function processTemplate(
  template: string,
  senderName: string,
  senderTitle: string
): string {
  return template
    .replace(/{SENDER_NAME}/g, senderName.trim() || PLACEHOLDERS.senderName)
    .replace(/{SENDER_TITLE}/g, senderTitle.trim() || PLACEHOLDERS.senderTitle);
}

/**
 * Get value or placeholder
 */
export function getValueOrPlaceholder(
  value: string,
  placeholder: string
): { text: string; isPlaceholder: boolean } {
  if (value.trim()) {
    return { text: value.trim(), isPlaceholder: false };
  }
  return { text: placeholder, isPlaceholder: true };
}

/**
 * Render the complete letter from inputs
 */
export function renderLetter(inputs: LetterGeneratorInputs): RenderedLetter {
  const template = LETTER_TEMPLATES[inputs.recipientType];
  const { fullName: contactName, isPlaceholder: contactNameIsPlaceholder } = getContactName(
    inputs.contact.firstName,
    inputs.contact.lastName
  );
  const { text: greeting, isPlaceholder: greetingIsPlaceholder } = getGreeting(
    inputs.contact.firstName
  );

  const contactTitleResult = getValueOrPlaceholder(
    inputs.contact.title,
    PLACEHOLDERS.contactTitle
  );
  const contactCompanyResult = getValueOrPlaceholder(
    inputs.contact.company,
    PLACEHOLDERS.contactCompany
  );
  const contactCityResult = getValueOrPlaceholder(
    inputs.contact.cityState,
    PLACEHOLDERS.contactCity
  );
  const senderNameResult = getValueOrPlaceholder(
    inputs.sender.name,
    PLACEHOLDERS.senderName
  );
  const senderTitleResult = getValueOrPlaceholder(
    inputs.sender.title,
    PLACEHOLDERS.senderTitle
  );
  const senderPhoneResult = getValueOrPlaceholder(
    inputs.sender.phone,
    PLACEHOLDERS.senderPhone
  );
  const senderEmailResult = getValueOrPlaceholder(
    inputs.sender.email,
    PLACEHOLDERS.senderEmail
  );
  const addressResult = getValueOrPlaceholder(
    inputs.company.address,
    PLACEHOLDERS.address
  );

  return {
    subject: template.subject,
    greeting,
    opening: processTemplate(
      template.opening,
      inputs.sender.name,
      inputs.sender.title
    ),
    valueHeader: template.valueHeader,
    valuePoints: template.value,
    cta: template.cta,
    contactName,
    contactTitle: contactTitleResult.text,
    contactCompany: contactCompanyResult.text,
    contactCity: contactCityResult.text,
    senderName: senderNameResult.text,
    senderTitle: senderTitleResult.text,
    senderPhone: senderPhoneResult.text,
    senderEmail: senderEmailResult.text,
    senderWeb: inputs.sender.website || "www.forhemit.com",
    addressHtml: formatAddressHtml(addressResult.text),
    date: inputs.company.letterDate || getTodayDate(),
  };
}

/**
 * Format text for display in letter (preserving line breaks)
 */
export function formatMultilineText(text: string): string {
  return text.replace(/\n/g, "<br>");
}

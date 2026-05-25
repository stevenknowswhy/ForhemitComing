import { v } from "convex/values";

/**
 * Validate company data against business rules
 */
export function validateCompanyData(data: any) {
  const errors: string[] = [];

  // Required fields
  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    errors.push("Company name is required and must be a non-empty string");
  }

  // Website validation (if provided)
  if (data.website && typeof data.website === "string") {
    const urlRegex = /^https?:\/\/.+?\..+/;
    if (!urlRegex.test(data.website)) {
      errors.push("Website must be a valid URL (http:// or https://)");
    }
  }

  // Revenue validation (if provided) - schema says it's a string
  if (data.revenue !== undefined && typeof data.revenue === "string") {
    if (data.revenue.trim().length === 0) {
      errors.push("Revenue must be a non-empty string when provided");
    }
  }

  // Stage validation
  const validStages = [
    "First contact",
    "Intro call",
    "NDA sent",
    "Feasibility",
    "Term sheet",
    "LOI signed",
    "Closed",
    "On hold",
    "Dead"
  ];
  if (data.stage && !validStages.includes(data.stage)) {
    errors.push(`Stage must be one of: ${validStages.join(", ")}`);
  }

  // NDA status validation
  const validNdaStatus = ["None", "Pending", "Signed"];
  if (data.ndaStatus && !validNdaStatus.includes(data.ndaStatus)) {
    errors.push(`NDA status must be one of: ${validNdaStatus.join(", ")}`);
  }

  // Date validation (if provided)
  if (data.lastContactDate && typeof data.lastContactDate === "string") {
    const date = new Date(data.lastContactDate);
    if (isNaN(date.getTime())) {
      errors.push("Last contact date must be a valid date (YYYY-MM-DD)");
    }
  }

  if (data.nextStepDate && typeof data.nextStepDate === "string") {
    const date = new Date(data.nextStepDate);
    if (isNaN(date.getTime())) {
      errors.push("Next step date must be a valid date (YYYY-MM-DD)");
    }
  }

  if (data.expectedCloseDate && typeof data.expectedCloseDate === "string") {
    const date = new Date(data.expectedCloseDate);
    if (isNaN(date.getTime())) {
      errors.push("Expected close date must be a valid date (YYYY-MM-DD)");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize company data for storage
 */
export function sanitizeCompanyData(data: any) {
  const sanitized = { ...data };

  // Trim strings
  if (sanitized.name) sanitized.name = sanitized.name.trim();
  if (sanitized.industry) sanitized.industry = sanitized.industry.trim();
  if (sanitized.size) sanitized.size = sanitized.size.trim();
  if (sanitized.revenue) sanitized.revenue = sanitized.revenue.trim();
  if (sanitized.website) sanitized.website = sanitized.website.trim();
  if (sanitized.address) sanitized.address = sanitized.address.trim();
  if (sanitized.advisor) sanitized.advisor = sanitized.advisor.trim();
  if (sanitized.referralSource) sanitized.referralSource = sanitized.referralSource.trim();
  if (sanitized.nextStep) sanitized.nextStep = sanitized.nextStep.trim();
  if (sanitized.notes) sanitized.notes = sanitized.notes.trim();

  // Convert empty strings to null for optional fields
  const optionalFields = ["industry", "size", "revenue", "website", "address", "advisor", "referralSource", "lastContactDate", "nextStep", "nextStepDate", "expectedCloseDate", "notes", "createdBy"];
  for (const field of optionalFields) {
    if (sanitized[field] === "") {
      sanitized[field] = null;
    }
  }

  return sanitized;
}

/**
 * Check if a company is eligible for certain operations
 */
export function checkCompanyEligibility(company: any, operation: string) {
  switch (operation) {
    case "delete":
      return company.stage !== "Closed" && company.stage !== "Dead";

    case "archive":
      return company.stage === "Closed" || company.stage === "Dead";

    case "reopen":
      return company.stage === "Closed" || company.stage === "On hold";

    default:
      return true;
  }
}
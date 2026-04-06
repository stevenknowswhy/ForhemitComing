/**
 * Lender Q&A Tracker - Validation Utilities
 */
import { DealHeader, QAItem, ValidationError } from "../types";
import { SBA_LOAN_LIMITS } from "../constants";

export function validateEmail(email: string): boolean {
  if (!email) return true; // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateDealId(dealId: string): boolean {
  if (!dealId) return false;
  return /^[A-Za-z0-9-]+$/.test(dealId);
}

export function validatePositiveNumber(value: string): boolean {
  if (!value) return false;
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return null; // Optional
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length >= 10) {
    return phone; // Keep original if already formatted
  }

  return null; // Invalid
}

export function formatPhone(phone: string): string {
  const result = validatePhone(phone);
  return result || phone;
}

export function validateDates(subdate: string, closedate: string): {
  valid: boolean;
  daysDiff: number;
} {
  if (!subdate || !closedate) return { valid: true, daysDiff: 0 };

  const sub = new Date(subdate);
  const close = new Date(closedate);
  const diffDays = Math.ceil((close.getTime() - sub.getTime()) / (1000 * 60 * 60 * 24));

  return { valid: diffDays >= 30, daysDiff: diffDays };
}

export function checkLoanLimit(loanType: string, amount: string): {
  valid: boolean;
  warning: boolean;
  message: string;
} {
  if (!loanType || !amount) {
    return { valid: true, warning: false, message: "" };
  }

  const amt = parseFloat(amount);
  const max = SBA_LOAN_LIMITS[loanType];

  if (!max) {
    return { valid: true, warning: false, message: "" };
  }

  if (amt > max) {
    return {
      valid: false,
      warning: false,
      message: `ERROR: Maximum is $${max.toLocaleString()}`,
    };
  } else if (amt > max * 0.9) {
    return {
      valid: true,
      warning: true,
      message: `Warning: Near SBA limit ($${max.toLocaleString()})`,
    };
  }

  return { valid: true, warning: false, message: "" };
}

export function validateDealHeader(header: DealHeader): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!header.company.trim()) {
    errors.push({ field: "company", message: "Company name is required" });
  }
  if (!header.dealid.trim()) {
    errors.push({ field: "dealid", message: "Deal ID is required" });
  } else if (!validateDealId(header.dealid)) {
    errors.push({ field: "dealid", message: "Deal ID can only contain letters, numbers, and hyphens" });
  }
  if (!header.loantype) {
    errors.push({ field: "loantype", message: "Loan type is required" });
  }
  if (!header.loanamt) {
    errors.push({ field: "loanamt", message: "Loan amount is required" });
  } else if (!validatePositiveNumber(header.loanamt)) {
    errors.push({ field: "loanamt", message: "Valid loan amount required (must be positive)" });
  }
  if (!header.lender.trim()) {
    errors.push({ field: "lender", message: "Lender name is required" });
  }
  if (!header.lcontact.trim()) {
    errors.push({ field: "lcontact", message: "Lender contact name is required" });
  }
  if (!header.lemail.trim()) {
    errors.push({ field: "lemail", message: "Lender email is required" });
  } else if (!validateEmail(header.lemail)) {
    errors.push({ field: "lemail", message: "Valid email address required" });
  }
  if (!header.subdate) {
    errors.push({ field: "subdate", message: "Submission date is required" });
  }
  if (!header.closedate) {
    errors.push({ field: "closedate", message: "Target close date is required" });
  }
  if (!header.dealstage) {
    errors.push({ field: "dealstage", message: "Deal stage is required" });
  }

  // Date validation
  const dateValidation = validateDates(header.subdate, header.closedate);
  if (!dateValidation.valid) {
    errors.push({ field: "closedate", message: "Target close date must be at least 30 days after submission" });
  }

  // Loan limit validation
  const limitCheck = checkLoanLimit(header.loantype, header.loanamt);
  if (!limitCheck.valid) {
    errors.push({ field: "loanamt", message: limitCheck.message });
  }

  // Optional email validation
  if (header.advisoremail && !validateEmail(header.advisoremail)) {
    errors.push({ field: "advisoremail", message: "Valid advisor email required" });
  }

  return errors;
}

export function validateQAItem(item: Partial<QAItem>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!item.cat) {
    errors.push({ field: "cat", message: "Category is required" });
  }
  if (!item.q?.trim()) {
    errors.push({ field: "q", message: "Condition text is required" });
  }
  if (!item.status) {
    errors.push({ field: "status", message: "Status is required" });
  }
  if (!item.pri) {
    errors.push({ field: "pri", message: "Priority is required" });
  }

  // Blocked status requires notes
  if (item.status === "Blocked" && !item.notes?.trim()) {
    errors.push({ field: "notes", message: "Notes are required when status is Blocked" });
  }

  // Resolved/Waived requires resolved fields
  if (item.status === "Resolved" || item.status === "Waived") {
    if (!item.resdate) {
      errors.push({ field: "resdate", message: "Resolved date is required" });
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (item.resdate > today) {
        errors.push({ field: "resdate", message: "Resolved date cannot be in the future" });
      }
    }
    if (!item.resby?.trim()) {
      errors.push({ field: "resby", message: "Resolver name is required" });
    }
  }

  return errors;
}

export function isOverdue(item: QAItem): boolean {
  if (!item.due || item.status === "Resolved" || item.status === "Waived") {
    return false;
  }
  const today = new Date().toISOString().split("T")[0];
  return item.due < today;
}

export function isNearDue(item: QAItem, closeDate: string): boolean {
  if (!item.due || !closeDate || item.status === "Resolved" || item.status === "Waived") {
    return false;
  }
  return item.due <= closeDate;
}

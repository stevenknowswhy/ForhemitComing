// Pure email validation for the coming-soon notify capture.
// Same rule as EarlyAccessForm: something@something.tld, no whitespace.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns an error message for invalid input, or null when the email is acceptable. */
export function validateEmail(raw: string): string | null {
	const email = raw.trim();
	if (!email) {
		return "Please enter your email address.";
	}
	if (!EMAIL_PATTERN.test(email)) {
		return "Please enter a valid email address.";
	}
	return null;
}

/** Trims and lowercases — the normalized form persisted by the Convex mutation. */
export function normalizeEmail(raw: string): string {
	return raw.trim().toLowerCase();
}

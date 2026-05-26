import { describe, it, expect } from "vitest";
import { formatPhoneNumber } from "@forhemit/shared/lib/formatters";

describe("formatPhoneNumber", () => {
	it("returns empty string for empty input", () => {
		expect(formatPhoneNumber("")).toBe("");
	});

	it("formats partial number with opening paren", () => {
		expect(formatPhoneNumber("2")).toBe("(2");
		expect(formatPhoneNumber("21")).toBe("(21");
		expect(formatPhoneNumber("212")).toBe("(212");
	});

	it("formats 4-6 digits with area code", () => {
		expect(formatPhoneNumber("2125")).toBe("(212) 5");
		expect(formatPhoneNumber("21255")).toBe("(212) 55");
		expect(formatPhoneNumber("212555")).toBe("(212) 555");
	});

	it("formats full 10-digit number", () => {
		expect(formatPhoneNumber("2125551234")).toBe("(212) 555-1234");
	});

	it("strips non-digit characters from formatted input", () => {
		expect(formatPhoneNumber("(212) 555-1234")).toBe("(212) 555-1234");
	});

	it("truncates to 10 digits", () => {
		expect(formatPhoneNumber("21255512345678")).toBe("(212) 555-1234");
	});

	it("handles only non-digits", () => {
		expect(formatPhoneNumber("abc-()")).toBe("");
	});
});

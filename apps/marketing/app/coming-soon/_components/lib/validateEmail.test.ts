import { describe, expect, it } from "vitest";
import { normalizeEmail, validateEmail } from "./validateEmail";

describe("validateEmail", () => {
	it("accepts a plain address", () => {
		expect(validateEmail("founder@example.com")).toBeNull();
	});

	it("accepts padded input (trimmed)", () => {
		expect(validateEmail("  founder@example.com ")).toBeNull();
	});

	it("rejects empty input", () => {
		expect(validateEmail("")).toBe("Please enter your email address.");
		expect(validateEmail("   ")).toBe("Please enter your email address.");
	});

	it("rejects addresses without a TLD", () => {
		expect(validateEmail("founder@example")).toBe(
			"Please enter a valid email address.",
		);
	});

	it("rejects addresses with interior whitespace", () => {
		expect(validateEmail("founder example.com")).toBe(
			"Please enter a valid email address.",
		);
	});
});

describe("normalizeEmail", () => {
	it("trims and lowercases", () => {
		expect(normalizeEmail("  Founder@Example.COM ")).toBe(
			"founder@example.com",
		);
	});
});

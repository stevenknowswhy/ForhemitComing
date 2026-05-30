import { describe, it, expect } from "vitest";
import {
	escapeHtml,
	getTypeColors,
	getEngagementColor,
	formatRelativeDate,
	formatDaysShort,
} from "@forhemit/shared/features/esop-partners/lib/formatters";

describe("escapeHtml", () => {
	it("returns empty string for null", () => {
		expect(escapeHtml(null)).toBe("");
	});

	it("returns empty string for undefined", () => {
		expect(escapeHtml(undefined)).toBe("");
	});

	it("escapes HTML special characters", () => {
		expect(escapeHtml('<script>alert("xss")</script>')).toContain("&lt;");
		expect(escapeHtml('<script>alert("xss")</script>')).toContain("&gt;");
	});

	it("passes through safe strings unchanged", () => {
		expect(escapeHtml("Hello World")).toBe("Hello World");
	});
});

describe("getTypeColors", () => {
	it("returns colors for known type", () => {
		const colors = getTypeColors("Attorney");
		expect(colors).toHaveProperty("bg");
		expect(colors).toHaveProperty("text");
	});

	it("returns fallback colors for unknown type", () => {
		const colors = getTypeColors("UnknownType");
		expect(colors).toHaveProperty("bg");
		expect(colors).toHaveProperty("text");
	});
});

describe("getEngagementColor", () => {
	it("returns a hex color string", () => {
		const color = getEngagementColor(90);
		expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
	});

	it("returns different colors for different scores", () => {
		expect(getEngagementColor(90)).not.toBe(getEngagementColor(10));
	});
});

describe("formatRelativeDate", () => {
	it("returns — for null", () => {
		expect(formatRelativeDate(null)).toBe("—");
	});

	it("returns — for undefined", () => {
		expect(formatRelativeDate(undefined)).toBe("—");
	});

	it("returns a relative time string for valid date", () => {
		const today = new Date().toISOString().split("T")[0];
		const result = formatRelativeDate(today);
		expect(typeof result).toBe("string");
		expect(result.length).toBeGreaterThan(0);
	});
});

describe("formatDaysShort", () => {
	it("returns 999d for null", () => {
		expect(formatDaysShort(null)).toBe("999d");
	});

	it("returns 999d for undefined", () => {
		expect(formatDaysShort(undefined)).toBe("999d");
	});

	it("returns days ago for valid date", () => {
		const tenDaysAgo = new Date(Date.now() - 10 * 86400000)
			.toISOString()
			.split("T")[0];
		const result = formatDaysShort(tenDaysAgo);
		expect(result).toMatch(/^\d+d$/);
	});
});

import { describe, it, expect } from "vitest";
import { trackEvent, trackCRM } from "@forhemit/shared/lib/analytics";

describe("analytics stubs", () => {
	it("trackEvent accepts any event name and data", () => {
		expect(() => trackEvent("test_event", { key: "value" })).not.toThrow();
	});

	it("trackEvent works with no data", () => {
		expect(() => trackEvent("test_event")).not.toThrow();
	});

	it("trackCRM accepts any event name and data", () => {
		expect(() =>
			trackCRM("test_crm", { email: "test@test.com" }),
		).not.toThrow();
	});

	it("trackCRM works with no data", () => {
		expect(() => trackCRM("test_crm")).not.toThrow();
	});
});

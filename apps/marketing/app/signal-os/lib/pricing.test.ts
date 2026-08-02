// @vitest-environment node

import { describe, expect, it } from "vitest";
import { FOUNDING_DEADLINE_MS } from "../constants";
import { buildProductJsonLd, isFoundingPricingActive } from "./pricing";

describe("Signal OS founding pricing state", () => {
  it("is active only before the exact founding deadline", () => {
    expect(isFoundingPricingActive(FOUNDING_DEADLINE_MS - 1)).toBe(true);
    expect(isFoundingPricingActive(FOUNDING_DEADLINE_MS)).toBe(false);
    expect(isFoundingPricingActive(FOUNDING_DEADLINE_MS + 1)).toBe(false);
  });

  it("publishes priced offers only while founding pricing is active", () => {
    const active = buildProductJsonLd(true);
    const expired = buildProductJsonLd(false);

    expect(active.offers).toHaveLength(3);
    expect(expired).not.toHaveProperty("offers");
  });
});

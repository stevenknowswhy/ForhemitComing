// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

describe("Signal OS owned-domain checkout bridge", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects editions outside the server-owned allowlist without calling upstream", async () => {
    const upstream = vi.spyOn(globalThis, "fetch");
    const form = new FormData();
    form.set("edition", "enterprise");

    const response = await POST(
      new Request("https://www.forhemit.com/api/signal-os/checkout", {
        method: "POST",
        body: form,
      }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://www.forhemit.com/signal-os?checkout=invalid#signal-editions",
    );
    expect(upstream).not.toHaveBeenCalled();
  });

  it("requests an attributed session and redirects only to Stripe Checkout", async () => {
    const upstream = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ url: "https://checkout.stripe.com/c/pay/cs_live_example" }),
    );
    const form = new FormData();
    form.set("edition", "agency");

    const response = await POST(
      new Request("https://www.forhemit.com/api/signal-os/checkout", {
        method: "POST",
        body: form,
      }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://checkout.stripe.com/c/pay/cs_live_example",
    );
    expect(upstream).toHaveBeenCalledOnce();
    expect(upstream).toHaveBeenCalledWith(
      "https://signal-os-evidence.stefano94103.chatgpt.site/api/checkout",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edition: "agency",
          attribution: {
            utm_source: "forhemit",
            utm_medium: "owned",
            utm_campaign: "founding72",
            utm_content: "owned_domain_agency_checkout",
          },
        }),
      },
    );
  });

  it("does not redirect to a non-Stripe URL returned by upstream", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ url: "https://evil.example/collect" }),
    );
    const form = new FormData();
    form.set("edition", "solo");

    const response = await POST(
      new Request("https://www.forhemit.com/api/signal-os/checkout", {
        method: "POST",
        body: form,
      }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://www.forhemit.com/signal-os?checkout=error#signal-editions",
    );
  });
});

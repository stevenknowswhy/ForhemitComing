import { describe, expect, it, vi } from "vitest";

import { withTimeout } from "./withTimeout";

describe("withTimeout", () => {
  it("resolves with the wrapped value when the promise settles in time", async () => {
    const result = await withTimeout(Promise.resolve("ok"), 1000, "too slow");
    expect(result).toBe("ok");
  });

  it("rejects with the original error when the promise rejects in time", async () => {
    const boom = new Error("boom");
    await expect(
      withTimeout(Promise.reject(boom), 1000, "too slow"),
    ).rejects.toBe(boom);
  });

  it("rejects with the timeout error when the promise never settles", async () => {
    vi.useFakeTimers();
    const pending = new Promise<string>(() => {});
    const rejection = withTimeout(pending, 50, "The request timed out.");
    const expectation = expect(rejection).rejects.toThrow(
      "The request timed out.",
    );
    vi.advanceTimersByTime(60);
    await expectation;
    vi.useRealTimers();
  });
});

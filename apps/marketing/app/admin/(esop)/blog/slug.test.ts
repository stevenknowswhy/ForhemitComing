import { describe, expect, it } from "vitest";
import { titleToSlug } from "./slug";

describe("titleToSlug", () => {
  it("kebab-cases a plain title", () => {
    expect(titleToSlug("The Exit Crisis")).toBe("the-exit-crisis");
  });

  it("lowercases and collapses punctuation runs", () => {
    expect(titleToSlug("Trust, Craft &  Reputation!")).toBe(
      "trust-craft-and-reputation"
    );
  });

  it("trims leading and trailing separators", () => {
    expect(titleToSlug("  --Hello, World--  ")).toBe("hello-world");
  });

  it("caps length at 80 characters without a dangling hyphen", () => {
    const slug = titleToSlug("word ".repeat(40));
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith("-")).toBe(false);
  });

  it("falls back to 'post' when nothing slug-safe remains", () => {
    expect(titleToSlug("???")).toBe("post");
    expect(titleToSlug("")).toBe("post");
  });

  it("matches the Convex slug validator for any title", () => {
    const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    for (const title of [
      "Émigré — a French departure",
      "2026 outlook: the succession wave",
      "Multiple   spaces    here",
      "Ampersands & Hyphens - Review",
    ]) {
      expect(titleToSlug(title)).toMatch(SLUG_RE);
    }
  });
});

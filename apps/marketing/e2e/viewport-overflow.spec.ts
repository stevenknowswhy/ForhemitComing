import { test, expect, type Page } from "@playwright/test";

/**
 * P0-1 regression guard: no public marketing route may overflow a 390px viewport.
 *
 * A route fails when documentElement.scrollWidth (or body.scrollWidth) exceeds
 * the viewport width. On failure, the assertion message lists the widest
 * offending elements so the fix can be aimed without re-probing by hand.
 */

const MOBILE_VIEWPORT = { width: 390, height: 844 };

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/accounting-firms",
  "/appraisers",
  "/assess",
  "/beyond-the-balance-sheet",
  "/blog",
  "/blog/slug-that-does-not-exist", // exercises the blog not-found surface
  "/broker-screening",
  "/brokers",
  "/business-owners",
  "/coming-soon",
  "/contact",
  "/faq",
  "/financial-accounting",
  "/four-month-path",
  "/introduction",
  "/legal-practices",
  "/lenders",
  "/opt-in",
  "/privacy",
  "/signal-os",
  "/terms",
  "/the-exit-crisis",
  "/this-page-does-not-exist", // exercises the global 404 surface
  "/wealth-managers",
];

/** Widest elements extending past the viewport, for failure diagnostics. */
async function overflowOffenders(page: Page, viewportWidth: number): Promise<string[]> {
  return page.evaluate((vw) => {
    const bySelector = new Map<string, { count: number; maxRight: number }>();
    for (const el of document.querySelectorAll("*")) {
      const rect = el.getBoundingClientRect();
      if (rect.right <= vw + 1 && rect.left >= -1) continue;
      const classes = typeof el.className === "string" ? el.className.split(" ").slice(0, 2).join(".") : "";
      const key = `${el.tagName.toLowerCase()}${classes ? `.${classes}` : ""}`;
      const prev = bySelector.get(key) ?? { count: 0, maxRight: 0 };
      prev.count += 1;
      prev.maxRight = Math.max(prev.maxRight, Math.round(rect.right));
      bySelector.set(key, prev);
    }
    return Array.from(bySelector.entries())
      .sort((a, b) => b[1].maxRight - a[1].maxRight)
      .slice(0, 10)
      .map(([key, v]) => `${key} (x${v.count}, right=${v.maxRight}px)`);
  }, viewportWidth);
}

test.describe("Mobile viewport overflow guard (390px)", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`no horizontal overflow: ${route}`, async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto(route, { waitUntil: "load", timeout: 60000 });
      // Let hydration-driven layout shifts settle before measuring.
      await page.waitForTimeout(500);

      const [htmlWidth, bodyWidth, offenders] = await Promise.all([
        page.evaluate(() => document.documentElement.scrollWidth),
        page.evaluate(() => document.body.scrollWidth),
        overflowOffenders(page, MOBILE_VIEWPORT.width),
      ]);

      const diagnostic = offenders.length
        ? `Widest offenders: ${offenders.join("; ")}`
        : "no elements beyond viewport found";

      expect(htmlWidth, `documentElement.scrollWidth on ${route} — ${diagnostic}`).toBeLessThanOrEqual(
        MOBILE_VIEWPORT.width,
      );
      expect(bodyWidth, `body.scrollWidth on ${route} — ${diagnostic}`).toBeLessThanOrEqual(
        MOBILE_VIEWPORT.width,
      );
    });
  }
});

import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.FORHEMIT_TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("Signal OS offers the free 15-minute scorecard as a tertiary hero path", async () => {
  const response = await fetch(new URL("/signal-os", baseUrl));

  assert.equal(response.status, 200);

  const html = await response.text();
  const actionsIndex = html.indexOf("View editions and buy");
  const scorecardIndex = html.indexOf("Try the free 15-minute scorecard");
  const pricingNoteIndex = html.indexOf("One-time purchase. Immediate download");

  assert.ok(actionsIndex >= 0, "expected the existing hero actions");
  assert.ok(scorecardIndex > actionsIndex, "expected the scorecard after the hero buttons");
  assert.ok(pricingNoteIndex > scorecardIndex, "expected the scorecard before the pricing note");
  assert.match(
    html,
    /href="https:\/\/signal-os-evidence\.stefano94103\.chatgpt\.site\/15-minute-ai-visibility-scorecard\?utm_source=forhemit(?:&|&amp;)utm_medium=owned_storefront(?:&|&amp;)utm_campaign=founding72(?:&|&amp;)utm_content=hero_scorecard"/,
  );
});

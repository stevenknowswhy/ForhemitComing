import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.FORHEMIT_TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("Signal OS offers the free evidence log between the sample and paid editions", async () => {
  const response = await fetch(new URL("/signal-os", baseUrl));

  assert.equal(response.status, 200);

  const html = await response.text();
  const sampleIndex = html.indexOf('id="signal-sample"');
  const freeIndex = html.indexOf("Use the free evidence log");
  const editionsIndex = html.indexOf('id="signal-editions"');

  assert.ok(sampleIndex >= 0, "expected the labeled sample section");
  assert.ok(freeIndex > sampleIndex, "expected the free resource after the sample");
  assert.ok(editionsIndex > freeIndex, "expected paid editions after the free resource");
  assert.match(html, /Free · CSV · no account/);
  assert.match(
    html,
    /href="https:\/\/github\.com\/stevenknowswhy\/ForhemitComing\/tree\/main\/resources\/ai-visibility-audit-evidence-log"/,
  );
});

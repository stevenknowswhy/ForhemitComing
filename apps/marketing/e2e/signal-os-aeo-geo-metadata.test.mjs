import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.FORHEMIT_TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("Signal OS exposes explicit AEO and GEO discovery metadata", async () => {
  const response = await fetch(new URL("/signal-os", baseUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /<title>Signal OS \| AEO &amp; GEO AI Visibility Audits<\/title>/,
  );

  const description =
    html.match(/<meta[^>]+name="description"[^>]*>/)?.[0] ?? "";
  assert.match(description, /AEO and GEO audit workstation/);

  const keywords = html.match(/<meta[^>]+name="keywords"[^>]*>/)?.[0] ?? "";
  assert.match(keywords, /AEO audit/);
  assert.match(keywords, /GEO audit/);
  assert.match(keywords, /AI visibility audit/);
});

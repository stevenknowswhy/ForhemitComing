import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.FORHEMIT_TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("the global footer links to Signal OS with owned-site attribution", async () => {
  const response = await fetch(new URL("/", baseUrl));

  assert.equal(response.status, 200);

  const html = await response.text();

  assert.match(
    html,
    /href="\/signal-os\?utm_source=forhemit(?:&amp;|&)utm_medium=owned_site(?:&amp;|&)utm_campaign=founding72(?:&amp;|&)utm_content=global_footer"/,
  );
});

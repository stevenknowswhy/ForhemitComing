import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.FORHEMIT_TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("Signal OS serves the PromptFrenzy proof link without changing checkout", async () => {
  const pageResponse = await fetch(new URL("/signal-os", baseUrl));
  assert.equal(pageResponse.status, 200);

  const html = await pageResponse.text();
  const linkStart = html.indexOf(
    '<a href="https://www.promptfrenzy.com/directory"',
  );

  assert.ok(linkStart >= 0, "expected the static PromptFrenzy directory link");

  const linkEnd = html.indexOf("</a>", linkStart);
  const link = html.slice(linkStart, linkEnd);

  assert.match(link, /rel="noopener"/);
  assert.doesNotMatch(link, /nofollow|sponsored/);
  assert.match(link, /target="_blank"/);
  assert.match(link, /src="\/promptfrenzy-directory\.svg"/);

  const checkoutForms = html.match(
    /<form[^>]*action="\/api\/signal-os\/checkout"[^>]*method="post"[^>]*>/g,
  );
  assert.equal(checkoutForms?.length, 3);

  const badgeResponse = await fetch(
    new URL("/promptfrenzy-directory.svg", baseUrl),
  );
  assert.equal(badgeResponse.status, 200);
  assert.match(
    badgeResponse.headers.get("content-type") ?? "",
    /image\/svg\+xml/,
  );
});

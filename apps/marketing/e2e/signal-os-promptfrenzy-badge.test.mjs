import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.FORHEMIT_TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("Signal OS serves the PromptFrenzy proof link without changing checkout", async () => {
  const pageResponse = await fetch(new URL("/signal-os", baseUrl));
  assert.equal(pageResponse.status, 200);

  const html = await pageResponse.text();
  const hrefIndex = html.indexOf(
    'href="https://www.promptfrenzy.com/directory"',
  );

  assert.ok(hrefIndex >= 0, "expected the static PromptFrenzy directory link");

  const linkStart = html.lastIndexOf("<a", hrefIndex);
  const linkEnd = html.indexOf("</a>", linkStart);
  assert.ok(linkStart >= 0, "expected the directory href inside an anchor");
  assert.ok(linkStart < hrefIndex, "expected the directory href after the anchor start");
  assert.ok(linkEnd > linkStart, "expected the directory link to close");
  const link = html.slice(linkStart, linkEnd);

  assert.match(link, /rel="noopener"/);
  assert.doesNotMatch(link, /nofollow|sponsored/);
  assert.match(link, /target="_blank"/);
  assert.match(link, /src="\/promptfrenzy-directory\.svg"/);

  const checkoutForms = html.match(/<form[^>]*>/g) ?? [];
  const signalCheckoutForms = checkoutForms.filter(
    (form) =>
      /action="\/api\/signal-os\/checkout"/.test(form) &&
      /method="post"/.test(form),
  );
  assert.equal(signalCheckoutForms.length, 3);

  const proofResponse = await fetch(
    new URL("/signal-os-directory-proof.html", baseUrl),
  );
  assert.equal(proofResponse.status, 200);
  assert.match(
    proofResponse.headers.get("content-type") ?? "",
    /text\/html/,
  );

  const proofHtml = await proofResponse.text();
  assert.match(
    proofHtml,
    /href="https:\/\/www\.promptfrenzy\.com\/directory"/,
  );
  assert.doesNotMatch(proofHtml, /nofollow|sponsored/);
  assert.match(proofHtml, /name="robots" content="noindex,follow"/);

  const badgeResponse = await fetch(
    new URL("/promptfrenzy-directory.svg", baseUrl),
  );
  assert.equal(badgeResponse.status, 200);
  assert.match(
    badgeResponse.headers.get("content-type") ?? "",
    /image\/svg\+xml/,
  );
});

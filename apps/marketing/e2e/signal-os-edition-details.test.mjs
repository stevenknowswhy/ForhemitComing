import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.FORHEMIT_TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("Signal OS explains each edition before its checkout control", async () => {
  const response = await fetch(new URL("/signal-os", baseUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  const editions = [
    ["Solo", "Offline evidence workstation", "Solo field manual"],
    ["Agency", "Commercial client-use license", "QA and delivery checklists"],
    ["Studio", "Up to 5 internal team users", "Team QA operating manual"],
  ];

  for (const [name, firstFeature, lastFeature] of editions) {
    const cardStart = html.indexOf(`<h3>${name}</h3>`);
    const cardEnd = html.indexOf("</article>", cardStart);

    assert.ok(cardStart >= 0, `expected the ${name} edition card`);
    assert.ok(cardEnd > cardStart, `expected the ${name} edition card to close`);

    const firstFeatureIndex = html.indexOf(firstFeature, cardStart);
    const lastFeatureIndex = html.indexOf(lastFeature, cardStart);
    const checkoutIndex = html.indexOf("<form", cardStart);
    const checkoutEnd = html.indexOf("</form>", checkoutIndex);

    assert.ok(firstFeatureIndex > cardStart, `expected ${name} edition details`);
    assert.ok(lastFeatureIndex > firstFeatureIndex, `expected the complete ${name} feature list`);
    assert.ok(
      checkoutIndex > lastFeatureIndex && checkoutIndex < cardEnd,
      `expected ${name} details before checkout`,
    );
    assert.ok(
      checkoutEnd > checkoutIndex && checkoutEnd < cardEnd,
      `expected the ${name} checkout form to close inside its edition card`,
    );

    const checkoutForm = html.slice(checkoutIndex, checkoutEnd);
    assert.match(checkoutForm, /action="\/api\/signal-os\/checkout"/);
    assert.match(checkoutForm, /method="post"/);
  }
});

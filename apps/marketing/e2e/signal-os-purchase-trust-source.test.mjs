import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = new URL("../app/signal-os/SignalOsPage.tsx", import.meta.url);

test("canonical Signal OS page states seller and refund path before checkout", async () => {
  const page = await readFile(pageSource, "utf8");

  assert.match(page, /Forhemit PBC · Signal OS/);
  assert.doesNotMatch(page, /Forhemit Labs/);
  assert.match(page, /Signal OS is sold and fulfilled by Forhemit PBC/);
  assert.match(page, /signal-os-concierge@agentmail\.to/);
  assert.match(page, /For refund requests, contact product support with your Stripe receipt and the issue/);
  assert.match(page, /Requests are considered under applicable law and the facts of the order/);
  assert.match(page, /A fully\s+refunded order loses private download access/);
  assert.match(page, /href="\/terms"/);
  assert.match(page, /href="\/privacy"/);
  assert.doesNotMatch(page, /risk-free|money-back guarantee/i);

  const trustCopy = page.indexOf("Signal OS is sold and fulfilled by Forhemit PBC");
  const checkoutForm = page.indexOf('action="/api/signal-os/checkout"');
  assert.ok(trustCopy >= 0 && trustCopy < checkoutForm);
});

# Spec: Signal OS free evidence-log CTA

## Objective

Give qualified Signal OS storefront visitors a truthful try-before-buy path after the labeled sample and before the paid editions. The path must open the already-public, ungated GitHub evidence log without changing prices, checkout, fulfillment, or delivery controls.

## Assumptions

- Qualified reach and buyer confidence remain the launch constraints; product scope is stable.
- The public GitHub resource is the durable free destination.
- One contextual CTA below the sample is less distracting than a third hero action.

## Commands

- Rendered-page check: `FORHEMIT_TEST_BASE_URL=<url> node --test apps/marketing/e2e/signal-os-free-resource.test.mjs`
- Marketing tests: `pnpm --filter forhemit-coming-soon test`
- Type check: `pnpm --filter forhemit-coming-soon exec tsc --noEmit`
- Production build: `pnpm --filter forhemit-coming-soon build`

## Project structure

- `apps/marketing/app/signal-os/SignalOsPage.tsx`: contextual CTA markup.
- `apps/marketing/app/signal-os/signal-os.module.css`: existing Signal OS design-system styles.
- `apps/marketing/e2e/signal-os-free-resource.test.mjs`: rendered-page regression check.

## Code style

Use semantic elements, existing CSS-module tokens, and an ordinary accessible link:

```tsx
<p className={styles.freeResource}>
  <strong>Test the method before buying.</strong>
  <a href="https://github.com/...">Use the free evidence log</a>
</p>
```

## Testing strategy

1. Run the rendered-page test against current production and require it to fail because the CTA is absent.
2. Add the minimum markup and styles.
3. Require the same test to pass against the exact Vercel preview.
4. Run the existing marketing test suite, type check, and production build through repository checks.
5. After merge, require the permanent page and destination to return HTTP 200 and rerun the rendered-page test against production.

## Boundaries

- Always: say the resource is free, ungated, manual, and a CSV; keep the paid editions primary; preserve keyboard access and responsive layout.
- Ask first: new analytics providers, dependencies, pricing changes, checkout changes, or lead-capture forms.
- Never: expose paid files, imply automated monitoring, promise outcomes, invent testimonials, add scarcity, or weaken Stripe verification and private delivery.

## Success criteria

- The storefront renders one link labeled `Use the free evidence log` after the fictional sample and before paid editions.
- The link targets the public GitHub guide at `resources/ai-visibility-audit-evidence-log`.
- Nearby copy states `Free · CSV · no account` and makes no outcome promise.
- The link is a native keyboard-accessible anchor and follows existing Signal OS typography and colors.
- Preview and production checks pass without new browser errors.
- Rollback is a single squash-commit revert.

## Open questions

None. The approved launch mandate authorizes a reversible zero-cost storefront improvement without changing the offer or checkout.

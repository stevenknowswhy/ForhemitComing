# Spec: Signal OS hero scorecard CTA

## Objective

Give visitors arriving at the permanent storefront a low-friction, truthful way to test the Signal OS method before buying. Add one visually subordinate hero link to the existing free 15-minute scorecard without changing pricing, checkout, fulfillment, or the two primary hero actions.

## Assumptions

- Revenue and checkout starts are still zero, so reducing first-screen commitment is the highest-leverage reversible storefront change.
- The existing scorecard is public, ungated, manual, and already validated on the Signal OS site.
- The paid-edition CTA remains primary; the scorecard link is tertiary text below the button group.

## Commands

- Production regression check: `FORHEMIT_TEST_BASE_URL=https://www.forhemit.com node --test apps/marketing/e2e/signal-os-hero-scorecard.test.mjs`
- Marketing tests: `pnpm --filter forhemit-coming-soon test --run`
- Type check: `pnpm --filter forhemit-coming-soon exec tsc --noEmit`
- Production build: `pnpm --filter forhemit-coming-soon build`

## Project structure

- `apps/marketing/app/signal-os/SignalOsPage.tsx`: tertiary hero link.
- `apps/marketing/app/signal-os/signal-os.module.css`: subordinate link styling and focus state.
- `apps/marketing/e2e/signal-os-hero-scorecard.test.mjs`: rendered-page regression check.

## Boundaries

- Always: label the scorecard as free and 15 minutes; retain the current buy and sample actions; use the existing public scorecard; include source attribution for measurement.
- Ask first: pricing, checkout, fulfillment, delivery, lead capture, or analytics-provider changes.
- Never: promise outcomes, invent proof, add false scarcity, expose paid files, or weaken Stripe verification.

## Success criteria

- Exactly one hero link says `Try the free 15-minute scorecard`.
- It appears after the existing hero buttons and before founding-price copy.
- It points to the public scorecard with owned-storefront campaign attribution.
- The link is a native keyboard-accessible anchor with a visible focus state.
- Existing marketing tests, type checking, build, and production smoke checks pass.
- Rollback is one commit revert.

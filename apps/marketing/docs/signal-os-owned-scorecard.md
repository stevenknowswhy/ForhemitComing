# Spec: Signal OS owned-domain scorecard

## Objective

Host the existing free 15-Minute AI Visibility Scorecard at the permanent URL
`https://www.forhemit.com/signal-os/scorecard` so every current and pending
acquisition channel can send a qualified visitor to an owned-domain, no-account
worksheet before the paid Signal OS offer.

The scorecard is for founders, consultants, and agency operators who want a fast,
manual baseline. It must preserve the current evidence boundaries: nine
observations are a small convenience sample, not a universal visibility grade or
a promise of rankings, citations, leads, sales, or revenue.

This change removes a trust-breaking host transition. It does not change the
paid product, prices, Stripe Checkout, fulfillment, licenses, founding deadline,
or delivery controls.

## Tech stack

- Next.js 15 App Router
- React 19 and TypeScript
- CSS Modules
- Node's built-in test runner for rendered-page regression checks
- Existing Forhemit production deployment and rollback workflow

No dependency is added.

## Commands

- Focused rendered-page check:
  `FORHEMIT_TEST_BASE_URL=http://127.0.0.1:3000 node --test apps/marketing/e2e/signal-os-owned-scorecard.test.mjs`
- Existing hero regression:
  `FORHEMIT_TEST_BASE_URL=http://127.0.0.1:3000 node --test apps/marketing/e2e/signal-os-hero-scorecard.test.mjs`
- Marketing tests:
  `pnpm --filter forhemit-coming-soon test --run`
- Type check:
  `pnpm --filter forhemit-coming-soon exec tsc --noEmit`
- Production build:
  `pnpm --filter forhemit-coming-soon build`
- Production smoke checks after deploy:
  `FORHEMIT_TEST_BASE_URL=https://www.forhemit.com node --test apps/marketing/e2e/signal-os-owned-scorecard.test.mjs apps/marketing/e2e/signal-os-hero-scorecard.test.mjs`

## Project structure

- `apps/marketing/app/signal-os/scorecard/page.tsx`
  - Server route and page-specific metadata.
  - Canonical and Open Graph URL use the owned domain.
- `apps/marketing/app/signal-os/scorecard/Scorecard.tsx`
  - Client-rendered worksheet and deliberate share/print interactions.
  - Forwards only allowlisted public attribution to the paid offer.
- `apps/marketing/app/signal-os/scorecard/scorecard.module.css`
  - Responsive, print, focus, and reduced-motion styles scoped to the page.
- `apps/marketing/app/signal-os/SignalOsPage.tsx`
  - Changes the existing tertiary hero link from the temporary host to the
    owned scorecard path while preserving its campaign attribution.
- `apps/marketing/e2e/signal-os-owned-scorecard.test.mjs`
  - Verifies the rendered route, content boundaries, links, and interactive
    control hooks.
- `apps/marketing/docs/signal-os-owned-scorecard.md`
  - This specification and rollback contract.

## Code style

Match the existing Signal OS route: named components, CSS Modules, semantic
HTML, native controls, concise copy, and no new abstraction for a single page.

```tsx
<a
  className={styles.upgrade}
  href="/signal-os?utm_source=scorecard&utm_medium=owned&utm_campaign=founding72&utm_content=completed_scorecard#signal-editions"
>
  See Signal OS editions <span aria-hidden="true">→</span>
</a>
```

- Use double quotes in the Signal OS route files.
- Prefer native `input`, `button`, `table`, `label`, and `a` elements.
- Every deliberate action has a visible keyboard focus state.
- Do not introduce an API route, database record, analytics SDK, or form post.

## Behavior and data contract

1. The route contains three buyer prompts across three answer engines, producing
   nine manually editable observations.
2. Brand, domain, market, date, prompt, answer-grid, checklist, mention-rate,
   and citation-rate fields remain local to the browser page. They are never
   submitted, persisted, logged, or sent to Forhemit.
3. Print / save PDF uses `window.print()` only after a user click.
4. Share uses a fixed public owned-domain URL. Native Web Share is preferred;
   clipboard copy is the fallback; a visible selectable URL is the final
   fallback. Canceling a native share does not copy anything.
5. Email share uses a recipient-free `mailto:?` link with accurate language.
6. The paid-offer link points to `/signal-os#signal-editions`. It may forward
   only `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and
   `ref` values matching `[a-zA-Z0-9._~-]{1,80}`. Private or unknown query
   fields are discarded.
7. The existing paid storefront hero link keeps its current visible copy and
   position but points to `/signal-os/scorecard`.
8. The temporary hosted scorecard remains live as a rollback/fallback during
   the launch. No redirect is added in this change.

## Testing strategy

### Rendered-page regression

The focused Node test starts from an actual HTTP response and verifies:

- `GET /signal-os/scorecard` returns 200.
- Owned canonical and Open Graph URLs are present.
- The page says free, no account, manual, nine observations, and explicitly
  states that the sample is inconclusive.
- It contains three prompt rows, nine evidence rows, six quality checks,
  mention and citation readouts, print, share, recipient-free email, and paid
  continuation controls.
- The paid link targets the owned `/signal-os#signal-editions` section.
- No form action, email input, phone input, remote temporary-host canonical, or
  outcome guarantee appears.
- The paid storefront contains exactly one tertiary scorecard link to the new
  owned path with its current campaign attribution.

### Component behavior

Use the smallest existing test mechanism available in the marketing app. The
share behavior must cover native share success, cancellation, clipboard
fallback, visible-link fallback, and the public-query allowlist. If a focused
component test would require a new dependency, keep behavior in a small exported
helper and test it with the existing Vitest setup.

### Release verification

Run focused checks on a preview first, then the same checks against
`https://www.forhemit.com`. Confirm all three Stripe checkout controls still
render on `/signal-os` and that no new production errors appear.

## Boundaries

### Always do

- Preserve every truthful limitation and the required nine-observation
  interpretation.
- Keep the worksheet free, public, and usable without an account.
- Use owned-domain canonical, share, email, and paid-continuation URLs.
- Keep all worksheet inputs browser-local.
- Retain keyboard, mobile, print, and reduced-motion support.
- Keep a one-commit rollback path and validate production after deployment.

### Ask first

- Any change to prices, Stripe Checkout, fulfillment, licenses, founding
  deadline, product ZIPs, or delivery verification.
- Any lead capture, persistence, email collection, CRM connection, analytics
  SDK, cookie, or server submission.
- Redirecting or removing the temporary hosted scorecard.
- Adding a dependency or changing shared site layout/configuration.

### Never do

- Send entered worksheet data anywhere.
- Add automated calls, emails, DMs, or shares.
- Promise rankings, citations, traffic, leads, sales, or revenue.
- Invent testimonials, results, customers, urgency, or scarcity.
- Expose paid files, credentials, customer data, or secrets.
- Weaken Stripe payment verification or private delivery controls.

## Success criteria

- The permanent scorecard route returns HTTP 200 and is usable on desktop,
  mobile, keyboard, and print layouts.
- The page contains the complete current worksheet and share behavior.
- Canonical, Open Graph, share, email, storefront, and paid-upgrade links use
  `www.forhemit.com`; no primary journey requires the temporary host.
- The new page collects and transmits no personal or worksheet data.
- Existing prices, three checkout forms, payment verification, fulfillment, and
  licenses are unchanged.
- Focused tests, existing marketing tests, type check, build, preview smoke
  tests, and production smoke tests pass, or any inherited unrelated failure is
  reported without being concealed.
- Production logs show no new errors after deployment.
- Rollback is a single commit revert.

## Rollback

Revert the implementation commit. The current temporary hosted scorecard remains
available throughout the launch, so the storefront link can be restored without
losing the free resource.

## Open questions for review

1. Approve `/signal-os/scorecard` as the permanent canonical path.
2. Approve keeping the temporary scorecard live as a fallback until after the
   72-hour launch rather than redirecting it immediately.
3. Approve the no-persistence rule even though it means worksheet entries do not
   survive a refresh.

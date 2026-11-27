import Link from "next/link";
import { AssessmentCta } from "./AssessmentCta";

/**
 * Ink homepage chrome: announcement bar + floating pill nav.
 * Rendered only on "/" — the global header/nav hide on the homepage
 * (same pattern as /blog and /admin) so this is the page's only chrome.
 * The gold pill opens the 2-Minute Check via the AssessmentCta island.
 */
export function HomeInkHeader() {
  return (
    <>
      <div className="ink-announce">
        <Link href="/benefits">See why employees love us! →</Link>
      </div>

      <div className="ink-nav-shell">
        <nav className="ink-nav" aria-label="Main">
          <Link className="ink-wordmark" href="/">
            FORHEMIT
          </Link>
          <div className="ink-nav-links">
            <Link href="/#how">How it works</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/#professionals">For Professionals</Link>
            <Link href="/#about">About</Link>
          </div>
          <AssessmentCta className="ink-nav-cta ink-gold">Take the 2-Minute Check</AssessmentCta>
        </nav>
      </div>
    </>
  );
}

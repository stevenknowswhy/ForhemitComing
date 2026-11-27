import Link from "next/link";

/**
 * Ink homepage footer (prototype translation). Carries id="professionals" —
 * the anchor the nav and the hero's professional CTA route to, exactly as
 * in the prototype.
 */
export function HomeInkFooter() {
  return (
    <footer className="ink-footer" id="professionals">
      <div className="ink-wrap">
        <div className="ink-footer-row">
          <Link className="ink-wordmark" href="/">
            FORHEMIT
          </Link>
          <nav className="ink-footer-nav" aria-label="Footer">
            <Link href="#how">How it works</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="#professionals">For Professionals</Link>
            <Link href="#about">About</Link>
          </nav>
        </div>
        <div className="ink-footer-meta">
          <a href="tel:+15104054330">(510) 405-4330</a>
          <a href="mailto:Stefano.stokes@forhemit.com">Stefano.stokes@forhemit.com</a>
          <span>Employee-ownership transitions, done in the open.</span>
          <span>Hero video: Edmond Dant&egrave;s via Pexels — prototype placeholder.</span>
        </div>
      </div>
    </footer>
  );
}

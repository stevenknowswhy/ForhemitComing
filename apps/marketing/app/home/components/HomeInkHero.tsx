import { AssessmentCta } from "./AssessmentCta";

const HERO_VIDEO_SRC =
  "https://videos.pexels.com/video-files/8643577/8643577-hd_1920_1080_24fps.mp4";

/** Still frame extracted from the hero video — poster + CSS fallback. */
const HERO_POSTER_SRC = "/images/hero-employees.jpg";

/**
 * Ink hero: background video (Pexels 8643577, hotlinked — prototype
 * placeholder footage) under an ink gradient, low-anchored ruled headline,
 * third-option subhead, and the dual audience CTAs Stefano ruled:
 * owners (filled accent) open the 2-Minute Check; professionals (outline)
 * route to the footer profession anchor. Video fade-in and the
 * reduced-motion removal live in HomeInkEffects.
 *
 * F2 fix (2026-11-27): the live hero never played. The page bails out to
 * client-side rendering, so React creates this element in the DOM — where
 * React's `muted` prop sets the attribute but NOT the muted IDL property,
 * and browsers gate autoplay on the property: autoplay was blocked and,
 * with no poster, the hero sat on a black first frame that never arrived.
 * So: `src` sits on the <video> itself (no <source> child to re-resolve),
 * a poster frame is declared, the same frame is the hero's CSS background,
 * and HomeInkEffects sets the muted property + calls play() explicitly.
 */
export function HomeInkHero() {
  return (
    <header className="ink-hero">
      <video
        className="ink-hero-video"
        src={HERO_VIDEO_SRC}
        poster={HERO_POSTER_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="ink-wrap">
        <p className="ink-eyebrow ink-reveal">Employee-Ownership Transitions</p>
        <h1 className="ink-reveal">Sell Your Business to Your Employees</h1>
        <p className="ink-subhead ink-reveal">
          <strong>The third option.</strong> Not a broker. Not private equity. Your own people.
        </p>
        <div className="ink-cta-row ink-reveal">
          <AssessmentCta className="ink-btn ink-btn-accent">I&rsquo;m a business owner</AssessmentCta>
          <a className="ink-btn ink-btn-outline" href="/#professionals">
            I&rsquo;m a professional
          </a>
        </div>
        <p className="ink-hero-fineprint ink-reveal">
          Free 2-Minute Check &middot; No obligation &middot; No personal guarantee
        </p>
      </div>
    </header>
  );
}

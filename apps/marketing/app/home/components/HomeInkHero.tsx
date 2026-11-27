import { AssessmentCta } from "./AssessmentCta";

const HERO_VIDEO_SRC =
  "https://videos.pexels.com/video-files/8643577/8643577-hd_1920_1080_24fps.mp4";

/**
 * Ink hero: background video (Pexels 8643577, hotlinked — prototype
 * placeholder footage) under an ink gradient, low-anchored ruled headline,
 * third-option subhead, and the dual audience CTAs Stefano ruled:
 * owners (paper-filled) open the 2-Minute Check; professionals (outline)
 * route to the footer profession anchor. Video fade-in and the
 * reduced-motion removal live in HomeInkEffects.
 *
 * F2 fix (2026-11-27): the live hero never played. The page bails out to
 * client-side rendering, so React creates this element in the DOM — where
 * React's `muted` prop sets the attribute but NOT the muted IDL property,
 * and browsers gate autoplay on the property: autoplay was blocked and,
 * with no poster, the hero sat on a black first frame that never arrived.
 * So: `src` sits on the <video> itself (no <source> child to re-resolve),
 * a still frame from the video is the hero's CSS background in
 * home-ink.css (data URI — the push route cannot commit binaries), and
 * HomeInkEffects sets the muted property + calls play() explicitly.
 */
export function HomeInkHero() {
  return (
    <header className="ink-hero">
      <video
        className="ink-hero-video"
        src={HERO_VIDEO_SRC}
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
          <AssessmentCta className="ink-btn ink-btn-paper">I&rsquo;m a business owner</AssessmentCta>
          <a className="ink-btn ink-btn-outline" href="/#professionals">
            I&rsquo;m a professional
          </a>
        </div>
        <p className="ink-hero-fineprint ink-reveal">
          Free 2-Minute Check &middot; No obligation &middot; No personal guarantee
        </p>
      </div>

      {/* Counters band — the four ruled numbers, moved inside the hero
          (panel fix P3, 2026-11-27) so the proof lands in the first
          viewport instead of below a full-screen hero. */}
      <div className="ink-counters">
        <div className="ink-wrap">
          <div className="ink-counters-grid">
            <div className="ink-counter ink-reveal">
              <div className="ink-num">
                <span data-count="120">120</span>
              </div>
              <p className="ink-lbl">days, start to close — the transition clock</p>
            </div>
            <div className="ink-counter ink-reveal">
              <div className="ink-num">
                <span data-count="4">4</span>
              </div>
              <p className="ink-lbl">gates, each one verified before the next begins</p>
            </div>
            <div className="ink-counter ink-reveal">
              <div className="ink-num">
                <span data-count="100">100</span>
                <span className="ink-unit">%</span>
              </div>
              <p className="ink-lbl">employee-owned at close — your people own it all</p>
            </div>
            <div className="ink-counter ink-reveal">
              <div className="ink-num">
                <span className="ink-unit">$</span>
                <span data-count="3000" data-format="comma">
                  3,000
                </span>
              </div>
              <p className="ink-lbl">Self Guided, flat — the map, the documents, the support</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

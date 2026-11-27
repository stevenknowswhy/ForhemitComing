import { AssessmentCta } from "./AssessmentCta";

const HERO_VIDEO_SRC =
  "https://videos.pexels.com/video-files/8643577/8643577-hd_1920_1080_24fps.mp4";

/**
 * Ink hero: background video (Pexels 8643577, hotlinked — prototype
 * placeholder footage) under an ink gradient, low-anchored ruled headline,
 * third-option subhead, and the dual audience CTAs Stefano ruled:
 * owners (filled accent) open the 2-Minute Check; professionals (outline)
 * route to the footer profession anchor. Video fade-in and the
 * reduced-motion removal live in HomeInkEffects.
 */
export function HomeInkHero() {
  return (
    <header className="ink-hero">
      <video
        className="ink-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
      <div className="ink-wrap">
        <p className="ink-eyebrow ink-reveal">Employee-Ownership Transitions</p>
        <h1 className="ink-reveal">Sell Your Business to Your Employees</h1>
        <p className="ink-subhead ink-reveal">
          <strong>The third option.</strong> Not a broker. Not private equity. Your own people.
        </p>
        <div className="ink-cta-row ink-reveal">
          <AssessmentCta className="ink-btn ink-btn-accent">I&rsquo;m a business owner</AssessmentCta>
          <a className="ink-btn ink-btn-outline" href="#professionals">
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

import { AssessmentCta } from "./AssessmentCta";

/**
 * The closing Check CTA pattern, shared by the homepage and the ink
 * subpages (/benefits, /how-we-do-it-differently): headline, "This is
 * free." on the LEFT of the gold-foil Check button, phone line below.
 * Extracted from HomeInkSections (2026-11-27 fix pass) so every ink page
 * closes identically — one source for the pattern.
 */
export function HomeInkClosing() {
  return (
    <section className="ink-closing" id="check">
      <div className="ink-wrap">
        <h2 className="ink-reveal">Find out if the third option fits.</h2>
        <div className="ink-closing-cta-row ink-reveal">
          <p className="ink-closing-free">This is free.</p>
          <AssessmentCta className="ink-btn ink-closing-btn ink-gold">
            Take the 2-Minute Check
          </AssessmentCta>
        </div>
        <p className="ink-phone ink-reveal">
          Prefer to talk? Call <a href="tel:+15104054330">(510) 405-4330</a>
        </p>
      </div>
    </section>
  );
}

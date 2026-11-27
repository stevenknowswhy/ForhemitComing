import Link from "next/link";

/**
 * The single closing action for blog article pages (ruling D2 A,
 * 2026-11-27): no mid-page or in-grid CTA buttons — one action at the
 * foot of the page, the free 2-Minute Check. Copy is taken verbatim
 * from the ruled prototype (PROTOTYPE-blog-awwwards-2026-11-27.html).
 * The check itself lives at /assess ("Free 2-Minute Check").
 */
export function ClosingCheck() {
  return (
    <section
      aria-label="Take the 2-Minute Check"
      className="border-t border-stone/20 mt-12 sm:mt-16 pt-10 sm:pt-12 pb-4 text-center"
    >
      <h2 className="font-serif text-2xl sm:text-3xl text-ink mb-3">
        Wondering if your company could be ready?
      </h2>
      <p className="text-stone text-base sm:text-lg max-w-xl mx-auto mb-6">
        The free 2-Minute Check at forhemit.com is the first step.
      </p>
      <Link
        href="/assess"
        className="inline-flex min-h-10 items-center bg-sage text-white font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
      >
        Take the 2-Minute Check →
      </Link>
    </section>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    "Two essays by Stefano Stokes, Forhemit's founder, on the exit crisis facing retiring founders and the philosophy that answers it.",
};

const ESSAYS = [
  {
    href: '/the-exit-crisis',
    sequenceLabel: 'Start here · The problem',
    readTime: '8 minute read',
    title: 'The Exit Crisis',
    standfirst:
      'A generation of founders is reaching retirement with no successor and too few buyers. Most businesses taken to market never sell at all — and the founders who learn that late have the fewest options left.',
  },
  {
    href: '/beyond-the-balance-sheet',
    sequenceLabel: 'Read next · The philosophy',
    readTime: '7 minute read',
    title: 'Beyond the Balance Sheet',
    standfirst:
      'The most valuable things in a founder-led company — trust, craft, reputation, the people themselves — appear nowhere in its financial statements. The right exit is the one that prices them anyway.',
  },
];

export default function BlogPage() {
  return (
    <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <header className="mb-8 sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone mb-3">
            Insights
          </p>
          <h1 className="font-serif text-display text-ink mb-3 sm:mb-4">
            Thinking for founders at the succession crossroads.
          </h1>
          <p className="text-stone text-base sm:text-xl max-w-2xl mb-5 sm:mb-6">
            Two essays by Stefano Stokes, Forhemit&apos;s founder, frame everything
            the firm does. Start with the structural crisis facing retiring
            founders. Then read the philosophy that answers it.
          </p>
        </header>

        <section aria-label="Essays">
          <div className="grid gap-6 md:grid-cols-2">
            {ESSAYS.map((essay) => (
              <article
                key={essay.href}
                className="flex flex-col border border-stone/20 bg-white p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
                  {essay.sequenceLabel}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone">
                  Essay · {essay.readTime}
                </p>
                <h2 className="mt-4 font-serif text-3xl text-ink">{essay.title}</h2>
                <p className="mt-2 text-sm font-medium text-stone">
                  By Stefano Stokes, Founder &amp; CEO
                </p>
                <p className="mt-4 flex-1 text-base text-stone">{essay.standfirst}</p>
                <Link
                  href={essay.href}
                  className="mt-6 self-start text-base font-semibold text-ink underline underline-offset-4"
                >
                  Read the essay →
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-stone">
            More essays follow as they are written. No schedule, and no filler.
          </p>
        </section>
      </div>
    </main>
  );
}

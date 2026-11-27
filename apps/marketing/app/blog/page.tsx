import type { Metadata } from 'next';
import { BlogIndex, type BlogEssay } from './_components/BlogIndex';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    "Two essays by Stefano Stokes, Forhemit's founder, on the exit crisis facing retiring founders and the philosophy that answers it.",
};

/**
 * Audience assignments (ruling D1 A filter model, applied 2026-11-27):
 * both essays are written for founders, so both carry "owners".
 * The Exit Crisis additionally carries "evidence": it is the
 * structural-evidence piece (the market arithmetic), as the companion
 * essay itself describes it. The CPAs / Attorneys / Brokers filters
 * therefore show the ruled empty state until essays for those
 * audiences exist — no posts were invented to fill them.
 */
const ESSAYS: BlogEssay[] = [
  {
    href: '/the-exit-crisis',
    sequenceLabel: 'Start here · The problem',
    readTime: '8 minute read',
    title: 'The Exit Crisis',
    standfirst:
      'A generation of founders is reaching retirement with no successor and too few buyers. Most businesses taken to market never sell at all — and the founders who learn that late have the fewest options left.',
    audienceLabel: 'For Owners',
    audiences: ['owners', 'evidence'],
    editorsPick: true,
  },
  {
    href: '/beyond-the-balance-sheet',
    sequenceLabel: 'Read next · The philosophy',
    readTime: '7 minute read',
    title: 'Beyond the Balance Sheet',
    standfirst:
      'The most valuable things in a founder-led company — trust, craft, reputation, the people themselves — appear nowhere in its financial statements. The right exit is the one that prices them anyway.',
    audienceLabel: 'For Owners',
    audiences: ['owners'],
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

        <BlogIndex essays={ESSAYS} />
      </div>
    </main>
  );
}

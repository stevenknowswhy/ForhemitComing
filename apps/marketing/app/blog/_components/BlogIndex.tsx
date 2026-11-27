"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Blog home modelled on The Explora Journal (ruling D1 A, 2026-11-27):
 * audience filter pills, an Editors Pick featured card, and a Latest
 * grid. Every card carries category • read-time, a large visual, the
 * headline, and a one-line hook — in the site's existing tokens
 * (canvas / parchment / ink / stone / sage), not a new palette.
 *
 * Visual standard (ruling P5 A, 2026-11-27): blog visuals are bespoke
 * diagrams, timeline schematics, charts, and checklists only — no
 * lifestyle stock photography.
 *
 * Filter gating (ruling P2 A, 2026-11-27): an audience pill renders
 * only when at least one post carries that audience; the "All" pill
 * always renders. The five audiences stay in the data model — a pill
 * returns automatically when its first post is added.
 */

export type BlogAudience =
  | "owners"
  | "cpas"
  | "attorneys"
  | "brokers"
  | "evidence";

export interface BlogEssay {
  href: string;
  sequenceLabel: string;
  readTime: string;
  title: string;
  standfirst: string;
  /** Filter label shown on the card, e.g. "For Owners". */
  audienceLabel: string;
  audiences: BlogAudience[];
  editorsPick?: boolean;
}

const FILTERS: { key: BlogAudience | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "owners", label: "For Owners" },
  { key: "cpas", label: "For CPAs" },
  { key: "attorneys", label: "For Attorneys" },
  { key: "brokers", label: "For Brokers" },
  { key: "evidence", label: "Costs & Evidence" },
];

/** Bespoke inline-SVG visual per essay, drawn in the site's tokens. */
function EssayVisual({ href }: { href: string }) {
  if (href === "/the-exit-crisis") {
    return (
      <svg
        viewBox="0 0 600 380"
        role="img"
        aria-label="Illustration: a generation of founders reaching the horizon with too few buyers"
        className="block h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="600" height="380" fill="#F0EBE3" />
        <path d="M0 300 L600 235 L600 380 L0 380 Z" fill="#C5CEBD" />
        <circle cx="470" cy="105" r="46" fill="#2C3E2D" />
        <path
          d="M60 292 L200 268 M240 262 L380 244 M420 240 L540 228"
          stroke="#5A5A5A"
          strokeWidth="3"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
        <text
          x="300"
          y="345"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="19"
          fill="#1A1A1A"
        >
          No successor. Too few buyers.
        </text>
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 600 380"
      role="img"
      aria-label="Illustration: a balance scale weighing the things financial statements cannot hold"
      className="block h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="600" height="380" fill="#F0EBE3" />
      <path
        d="M300 70v190M170 120h260M170 120l-42 74h84zM430 120l-42 74h84z"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="4"
      />
      <rect x="255" y="260" width="90" height="10" fill="#2C3E2D" />
      <text
        x="300"
        y="325"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="19"
        fill="#1A1A1A"
      >
        Trust. Craft. Reputation. People.
      </text>
    </svg>
  );
}

function CardMeta({ essay }: { essay: BlogEssay }) {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
        {essay.sequenceLabel}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone">
        {essay.audienceLabel} • {essay.readTime}
      </p>
    </>
  );
}

export function BlogIndex({ essays }: { essays: BlogEssay[] }) {
  const [filter, setFilter] = useState<BlogAudience | "all">("all");

  // P2 A gating: derive the rendered pills from the posts data — a
  // pill appears only when at least one essay carries that audience.
  const renderedFilters = FILTERS.filter((f) => {
    if (f.key === "all") return true;
    const key = f.key;
    return essays.some((e) => e.audiences.includes(key));
  });

  const visible =
    filter === "all"
      ? essays
      : essays.filter((e) => e.audiences.includes(filter));
  const featured = visible.find((e) => e.editorsPick);
  const latest = visible.filter((e) => e !== featured);
  const activeLabel = FILTERS.find((f) => f.key === filter)?.label;

  return (
    <>
      <div
        className="flex flex-wrap items-center gap-2 border-t border-stone/20 pt-6 mb-10 sm:mb-14"
        role="group"
        aria-label="Filter essays by audience"
      >
        {renderedFilters.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={`inline-flex min-h-10 items-center border px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-sage text-white border-sage"
                : "bg-white text-ink border-stone/30 hover:border-sage"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-stone">
          Sort by: <strong className="text-ink">Latest</strong> · Editors
          Picks
        </span>
      </div>

      {visible.length === 0 && (
        <p className="text-center text-sm text-stone py-10">
          No essays for {activeLabel} yet. More essays follow as they are
          written. No schedule, and no filler.
        </p>
      )}

      {featured && (
        <section aria-label="Editors Pick" className="mb-12 sm:mb-16">
          <h2 className="font-serif text-2xl text-ink mb-5">Editors Pick</h2>
          <article className="grid overflow-hidden border border-stone/20 bg-white md:grid-cols-2">
            <div className="min-h-56">
              <EssayVisual href={featured.href} />
            </div>
            <div className="flex flex-col p-8 sm:p-10">
              <CardMeta essay={featured} />
              <h3 className="mt-4 font-serif text-3xl sm:text-4xl text-ink">
                {featured.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-stone">
                By Stefano Stokes, Founder &amp; CEO
              </p>
              <p className="mt-4 flex-1 text-base sm:text-lg text-stone">
                {featured.standfirst}
              </p>
              <Link
                href={featured.href}
                className="mt-6 self-start text-base font-semibold text-ink underline underline-offset-4"
              >
                Read the essay →
              </Link>
            </div>
          </article>
        </section>
      )}

      {latest.length > 0 && (
        <section aria-label="Latest essays">
          <h2 className="font-serif text-2xl text-ink mb-5">Latest</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {latest.map((essay) => (
              <article
                key={essay.href}
                className="flex flex-col overflow-hidden border border-stone/20 bg-white"
              >
                <div className="aspect-[3/2]">
                  <EssayVisual href={essay.href} />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <CardMeta essay={essay} />
                  <h3 className="mt-4 font-serif text-3xl text-ink">
                    {essay.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-stone">
                    By Stefano Stokes, Founder &amp; CEO
                  </p>
                  <p className="mt-4 flex-1 text-base text-stone">
                    {essay.standfirst}
                  </p>
                  <Link
                    href={essay.href}
                    className="mt-6 self-start text-base font-semibold text-ink underline underline-offset-4"
                  >
                    Read the essay →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <p className="mt-10 text-center text-sm text-stone">
        More essays follow as they are written. No schedule, and no filler.
      </p>
    </>
  );
}

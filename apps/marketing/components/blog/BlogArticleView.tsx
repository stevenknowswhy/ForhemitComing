import Link from "next/link";
import type { Doc } from "@/convex/_generated/dataModel";
import { postDocToArticle, postDocToListItem } from "@/lib/blog-map";
import { ArticleSidebar } from "@/components/blog/ArticleSidebar";
import { PathwayBadge } from "@/components/ui/CustomBadge";
import { ReadingTimePills } from "@/components/blog/ReadingTimePills";
import { ResilienceSummary } from "@/components/blog/ResilienceSummary";
import { ScrollProgress } from "@/components/blog/ScrollProgress";
import { TipTapRenderer } from "@/components/blog/TipTapRenderer";
import { ClosingCheck } from "@/app/blog/_components/ClosingCheck";

type ListItem = ReturnType<typeof postDocToListItem>;

interface BlogArticleViewProps {
  doc: Doc<"posts">;
  relatedItems: ListItem[];
  preview?: boolean;
  editHref?: string;
  /**
   * Article template variant (rulings D2 A / D3 A, 2026-11-27).
   * "standard" (default) is the calm editorial template. "flagship"
   * is reserved for evidence pieces (Evidence Register, cost report,
   * annual report): it renders the post's own resilience-summary
   * points as a Key evidence stat grid instead of the standard
   * summary block. No content is invented for the variant — it only
   * re-presents fields the post already carries.
   */
  variant?: "standard" | "flagship";
}

export function BlogArticleView({
  doc,
  relatedItems,
  preview = false,
  editHref,
  variant = "standard",
}: BlogArticleViewProps) {
  const article = postDocToArticle(doc);

  return (
    <main className="pt-20 sm:pt-24 pb-24 sm:pb-32">
      <ScrollProgress />

      {preview && (
        <div className="bg-amber-950/90 border-b border-amber-700/50 text-amber-50 text-sm px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <span className="font-medium">
              Draft preview — not visible on the public blog until published.
            </span>
            <div className="flex flex-wrap gap-3">
              {editHref && (
                <Link
                  href={editHref}
                  className="underline underline-offset-2 hover:text-white"
                >
                  Edit post
                </Link>
              )}
              <Link
                href="/admin/blog"
                className="underline underline-offset-2 hover:text-white"
              >
                All posts
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <ArticleSidebar />

          <article className="flex-1 min-w-0 max-w-reading mx-auto lg:mx-0">
            <nav className="text-meta text-stone-light mb-4 sm:mb-6">
              <a href="/blog" className="hover:text-sage transition-colors">
                Blog
              </a>
              <span className="mx-2">/</span>
              <span>{article.category}</span>
            </nav>

            <header className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <PathwayBadge pathway={article.pathway} />
                <span className="text-meta text-stone-light">
                  {article.category}
                </span>
              </div>

              <h1 className="font-serif text-h1 text-ink mb-3 sm:mb-4">
                {article.title}
              </h1>

              <p className="text-stone text-base sm:text-xl mb-4 sm:mb-6">
                {article.subtitle}
              </p>

              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sage font-medium text-sm sm:text-base">
                    {article.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 3) || "F"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-ink text-sm sm:text-base">
                    {article.author.name}
                  </p>
                  <p className="text-meta text-stone-light truncate">
                    {article.author.credentials}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="block text-meta text-stone-light">
                  {preview && !article.publishedAt
                    ? "Not published yet"
                    : article.publishedAt}
                </span>
                <ReadingTimePills
                  overview={article.readTime.overview}
                  deepDive={article.readTime.deepDive}
                  methodology={article.readTime.methodology}
                />
              </div>
            </header>

            {variant === "flagship" &&
              article.resilienceSummary.length > 0 && (
                <section
                  aria-label="Key evidence"
                  className="mb-8 sm:mb-10 border border-border-light bg-parchment p-6 sm:p-8"
                >
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone mb-5">
                    Key evidence
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {article.resilienceSummary.map((point) => (
                      <p
                        key={point}
                        className="border border-border-light bg-white p-4 font-serif text-lg leading-snug text-ink"
                      >
                        {point}
                      </p>
                    ))}
                  </div>
                </section>
              )}

            {variant === "standard" &&
              article.resilienceSummary.length > 0 && (
                <ResilienceSummary
                  summary={article.resilienceSummary}
                  pathway={article.pathway}
                  author={article.author}
                  reviewedBy={article.reviewedBy}
                />
              )}

            <TipTapRenderer content={doc.content} />

            <section id="methodology" className="mt-12 sm:mt-16">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-parchment rounded-lg border border-border-light hover:border-sage transition-colors">
                  <h2 className="font-serif text-lg sm:text-xl text-ink">
                    Methodology &amp; data
                  </h2>
                  <svg
                    className="w-5 h-5 text-stone transition-transform group-open:rotate-180 flex-shrink-0 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <div className="p-4 sm:p-6 border-t border-border-light">
                  <p className="text-stone">
                    This article reflects Forhemit&apos;s stewardship and
                    transition practice. Methodology notes may be expanded per
                    topic; contact us for advisory context specific to your
                    situation.
                  </p>
                </div>
              </details>
            </section>

            {relatedItems.length > 0 && (
              <section className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border-light">
                <h3 className="font-serif text-lg text-ink mb-4">
                  Continue your research
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedItems.map((r) => (
                    <Link
                      key={r.id}
                      href={`/blog/${r.slug}`}
                      className="p-4 bg-parchment rounded-lg border border-border-light hover:border-sage transition-colors"
                    >
                      <span className="badge mb-2 capitalize">
                        For {r.pathway}
                      </span>
                      <h4 className="font-medium text-ink">{r.title}</h4>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Single closing action (ruling D2 A): the scroll-triggered
                DossierBar and the sidebar dossier CTA were removed so
                this is the only action on the article page. */}
            <ClosingCheck />
          </article>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useCallback, useState } from "react";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { usePathway } from "@forhemit/shared/hooks/useBlog";
import { ArticleCard, QuickTakeCard } from "@/components/ui/CustomCard";
import {
  BlogListItem,
  filterListByPathway,
  postDocToListItem,
} from "@/lib/blog-map";
import { withTimeout } from "@/lib/blog-timeout";

/** Hard deadline for the client-side retry attempt. */
const RETRY_TIMEOUT_MS = 8000;
const POSTS_LIMIT = 50;

type RetryState = { status: "retrying" } | { status: "idle" };

interface BentoGridProps {
  /**
   * Articles fetched server-side by the blog page. `null` means the server
   * could not reach Convex (down, slow, or unconfigured) and the grid
   * renders its error state with a client-side retry. An empty array means
   * Convex answered and there are genuinely no published articles.
   */
  initialPosts: BlogListItem[] | null;
}

export function BentoGrid({ initialPosts }: BentoGridProps) {
  const [posts, setPosts] = useState<BlogListItem[] | null>(initialPosts);
  const [retry, setRetry] = useState<RetryState>({ status: "idle" });
  const { pathway } = usePathway();

  const handleRetry = useCallback(async () => {
    setRetry({ status: "retrying" });
    try {
      const url = process.env.NEXT_PUBLIC_CONVEX_URL;
      if (!url) {
        throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
      }
      const client = new ConvexHttpClient(url);
      const docs = await withTimeout(
        client.query(api.posts.listPublished, { limit: POSTS_LIMIT }),
        RETRY_TIMEOUT_MS
      );
      setPosts((docs as Doc<"posts">[]).map(postDocToListItem));
    } catch (error) {
      // Keep the error state on screen — the retry button stays available.
      console.error("[blog] retry failed:", error);
    } finally {
      setRetry({ status: "idle" });
    }
  }, []);

  // --- Error state: server fetch failed or no data (never an infinite spinner).
  if (posts === null) {
    return (
      <div
        role="alert"
        className="col-span-12 py-16 text-center"
        data-testid="blog-error-state"
      >
        <p className="font-serif text-2xl text-ink mb-2">
          The article library is not responding right now.
        </p>
        <p className="text-stone text-sm mb-6 max-w-md mx-auto">
          We couldn&rsquo;t load the articles in time. Please try again &mdash;
          if this keeps happening, the publishing service may be temporarily
          down.
        </p>
        <button
          onClick={handleRetry}
          disabled={retry.status === "retrying"}
          className="inline-flex items-center justify-center rounded-full bg-ink text-canvas px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {retry.status === "retrying" ? "Retrying…" : "Try again"}
        </button>
      </div>
    );
  }

  // --- Empty state: Convex answered, zero published articles.
  if (posts.length === 0) {
    return (
      <div
        className="col-span-12 py-16 text-center"
        data-testid="blog-empty-state"
      >
        <p className="font-serif text-2xl text-ink mb-2">
          No articles have been published yet.
        </p>
        <p className="text-stone text-sm">
          Check back soon &mdash; new insights are on the way.
        </p>
      </div>
    );
  }

  const filteredArticles = filterListByPathway(posts, pathway) as BlogListItem[];

  const featured = filteredArticles.filter((_, i) => i < 2);
  const standard = filteredArticles.filter((_, i) => i >= 2 && i < 6);
  const quickTakes = filteredArticles.slice(6, 9);

  // --- Filter-empty state: articles exist, none match this perspective.
  if (filteredArticles.length === 0) {
    return (
      <div
        className="col-span-12 py-16 text-center"
        data-testid="blog-filter-empty-state"
      >
        <p className="text-stone text-lg mb-4">
          No articles match this perspective yet.
        </p>
        <p className="text-stone-light text-sm">
          Subscribe to be notified when new content is published.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
      {pathway === "all" && (
        <>
          {featured.map((article, index) => (
            <ArticleCard
              key={article.id}
              slug={article.slug}
              title={article.title}
              subtitle={article.subtitle}
              pathway={article.pathway}
              category={article.category}
              readTime={`${article.readTime.deepDive} min read`}
              excerpt={article.excerpt}
              variant={index === 0 ? "featured" : "standard"}
              imageUrl={article.imageUrl}
            />
          ))}
        </>
      )}

      {standard.map((article) => (
        <ArticleCard
          key={article.id}
          slug={article.slug}
          title={article.title}
          subtitle={article.subtitle}
          pathway={article.pathway}
          category={article.category}
          readTime={`${article.readTime.deepDive} min read`}
          excerpt={article.excerpt}
          variant="standard"
          imageUrl={article.imageUrl}
        />
      ))}

      {quickTakes.map((article) => (
        <QuickTakeCard
          key={article.id}
          slug={article.slug}
          title={article.title}
          readTime={`${article.readTime.overview}s`}
        />
      ))}
    </div>
  );
}

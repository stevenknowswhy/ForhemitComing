"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathway } from "@/hooks/useBlog";
import { ArticleCard, QuickTakeCard } from "@/components/ui/CustomCard";
import {
  filterListByPathway,
  postDocToListItem,
} from "@/lib/blog-map";

export function BentoGrid() {
  const { pathway } = usePathway();
  const posts = useQuery(api.posts.listPublished, { limit: 50 });

  const listItems =
    posts?.map((doc) => postDocToListItem(doc)) ?? [];

  const filteredArticles = filterListByPathway(listItems, pathway);

  const featured = filteredArticles.filter((_, i) => i < 2);
  const standard = filteredArticles.filter((_, i) => i >= 2 && i < 6);
  const quickTakes = filteredArticles.slice(6, 9);

  if (posts === undefined) {
    return (
      <div className="col-span-12 py-16 text-center text-stone">
        Loading articles…
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

      {filteredArticles.length === 0 && (
        <div className="col-span-12 py-16 text-center">
          <p className="text-stone text-lg mb-4">
            No articles match this perspective yet.
          </p>
          <p className="text-stone-light text-sm">
            Subscribe to be notified when new content is published.
          </p>
        </div>
      )}
    </div>
  );
}

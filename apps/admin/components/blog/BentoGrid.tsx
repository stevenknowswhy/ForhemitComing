"use client";

import { mockArticles } from '@/lib/blog-data';
import { usePathway } from '@/hooks/useBlog';
import { ArticleCard, QuickTakeCard } from '@/components/ui/CustomCard';

export function BentoGrid() {
  const { pathway } = usePathway();
  
  const filteredArticles = pathway === 'all' 
    ? mockArticles 
    : mockArticles.filter(a => a.pathway === pathway || (a.relatedPathways && a.relatedPathways.includes(pathway)));

  const featured = filteredArticles.filter((_, i) => i < 2);
  const standard = filteredArticles.filter((_, i) => i >= 2 && i < 6);
  const quickTakes = filteredArticles.slice(6, 9);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
      {pathway === 'all' && (
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
              variant={index === 0 ? 'featured' : 'standard'}
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

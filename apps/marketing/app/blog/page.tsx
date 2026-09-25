import { Metadata } from 'next';
import { PathwaySelector, PathwayContext } from '@/components/ui/PathwaySelector';
import { BentoGrid } from '@/components/blog/BentoGrid';
import { fetchIndexPosts } from '@/lib/blog-convex-server';
import { postDocToListItem, type BlogListItem } from '@/lib/blog-map';

// The index re-fetches published posts on every request so error and empty
// states reflect the backend's actual condition instead of a stale snapshot.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Institutional intelligence for business transitions and legacy preservation.',
};

export default async function BlogPage() {
  const result = await fetchIndexPosts(50);
  const initialPosts: BlogListItem[] | null = result.ok
    ? result.posts.map(postDocToListItem)
    : null;
  return (
    <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Hero Section */}
        <header className="mb-8 sm:mb-12">
          <h1 className="font-serif text-display text-ink mb-3 sm:mb-4">
            Blog
          </h1>
          <p className="text-stone text-base sm:text-xl max-w-2xl mb-5 sm:mb-6">
            Institutional intelligence for business transitions and legacy preservation. 
            Insights for founders, advisors, and stakeholders navigating stewardship transitions.
          </p>
          
          <div className="mb-2">
            <PathwaySelector />
          </div>
          <PathwayContext />
        </header>

        {/* Bento Grid */}
        <section aria-label="Articles">
          <BentoGrid initialPosts={initialPosts} />
        </section>
      </div>
    </main>
  );
}

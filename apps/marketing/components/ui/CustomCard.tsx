import { ReactNode } from 'react';
import Link from 'next/link';
import { PathwayBadge } from './CustomBadge';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div 
      className={`
        bg-parchment border border-border-light rounded-lg p-5 sm:p-6
        transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        ${hover ? 'hover:translate-y-[-2px] hover:shadow-hover hover:border-sage' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface ArticleCardProps {
  slug: string;
  title: string;
  subtitle: string;
  pathway: string;
  category: string;
  readTime: string;
  excerpt: string;
  variant?: 'featured' | 'standard' | 'compact' | 'framework';
  author?: string;
  imageUrl?: string;
}

export function ArticleCard({
  slug,
  title,
  subtitle,
  pathway,
  category,
  readTime,
  excerpt,
  variant = 'standard',
  author,
  imageUrl,
}: ArticleCardProps) {
  /* 
   * Mobile: all cards full-width (col-span-1 on the 1-col grid)
   * Tablet+: featured gets 8/12, standard gets 6/12, compact 4/12
   */
  const variantClasses = {
    featured: 'md:col-span-8 md:row-span-2',
    standard: 'md:col-span-6 lg:col-span-4',
    compact: 'md:col-span-4',
    framework: 'md:col-span-4',
  };

  return (
    <Link 
      href={`/blog/${slug}`}
      className={`${variantClasses[variant]} block`}
      data-analytics="article-click"
      data-slug={slug}
      data-pathway={pathway}
    >
      <Card className="h-full flex flex-col overflow-hidden">
        {imageUrl && variant === 'featured' && (
          <div className="w-full relative h-[300px] mb-5 -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 border-b border-border-light overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl} 
              alt={title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        {imageUrl && variant !== 'featured' && (
          <div className="w-full relative h-[200px] mb-5 -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 border-b border-border-light overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl} 
              alt={title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <PathwayBadge pathway={pathway} />
          <span className="text-meta text-stone-light">{readTime}</span>
        </div>
        
        <h3 className="font-serif text-h3 text-ink mb-2 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-stone text-body mb-4 line-clamp-3 flex-grow">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-border-light mt-auto">
          <span className="text-meta text-stone-light">{category}</span>
          <span className="text-sage text-sm font-medium group-hover:underline">
            Read →
          </span>
        </div>
      </Card>
    </Link>
  );
}

interface QuickTakeCardProps {
  slug: string;
  title: string;
  readTime: string;
}

export function QuickTakeCard({ slug, title, readTime }: QuickTakeCardProps) {
  return (
    <Link 
      href={`/blog/${slug}`}
      className="md:col-span-4 block"
      data-analytics="article-click"
      data-slug={slug}
      data-type="quick-take"
    >
      <Card hover={true} className="h-full">
        <div className="flex items-center justify-between mb-2">
          <span className="badge">Quick Take</span>
          <span className="text-meta text-stone-light">{readTime}</span>
        </div>
        <h4 className="font-serif text-lg text-ink line-clamp-2">
          {title}
        </h4>
      </Card>
    </Link>
  );
}

interface FrameworkCardProps {
  title: string;
  description: string;
  steps: string[];
}

export function FrameworkCard({ title, description, steps }: FrameworkCardProps) {
  return (
    <div className="md:col-span-4">
      <Card className="h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="badge">Framework</span>
        </div>
        
        <h4 className="font-serif text-lg text-ink mb-2">{title}</h4>
        <p className="text-stone text-sm mb-4">{description}</p>
        
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-sage text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-stone">{step}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

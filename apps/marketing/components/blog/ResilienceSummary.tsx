"use client";

import Link from "next/link";
import { PathwayBadge } from '@/components/ui/CustomBadge';
import { Button } from '@/components/ui/CustomButton';
import { contactHrefFromBlogPathway } from '@/lib/contact-deeplink';

interface ResilienceSummaryProps {
  summary: string[];
  pathway: string;
  author: {
    name: string;
    title: string;
    credentials: string;
  };
  reviewedBy?: {
    name: string;
    title: string;
    credentials: string;
  };
}

export function ResilienceSummary({ summary, pathway, author, reviewedBy }: ResilienceSummaryProps) {
  const handleCite = () => {
    console.log('[Analytics] Cite this article clicked');
    alert('Citation copied to clipboard (APA format)');
  };

  return (
    <div 
      id="overview"
      className="bg-canvas border border-sage rounded-lg p-5 sm:p-6 md:p-8 mb-8 sm:mb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-serif text-xl text-sage">Key Findings</h2>
        </div>
        <PathwayBadge pathway={pathway} />
      </div>

      <ul className="space-y-3 sm:space-y-4 mb-6">
        {summary.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-sage mt-2 flex-shrink-0" />
            <span className="text-ink text-sm sm:text-base">{item}</span>
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t border-border-light space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div className="text-meta text-stone-light">
          <span>By {author.name}, {author.title}</span>
          {reviewedBy && (
            <span className="block">
              Reviewed by {reviewedBy.name}, {reviewedBy.title}
            </span>
          )}
        </div>
        
        <div className="flex gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" onClick={handleCite}>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Cite This
          </Button>
          <Link
            href={contactHrefFromBlogPathway(pathway)}
            className="inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] px-3 py-1.5 text-sm bg-transparent border border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-[var(--text-inverse)]"
          >
            Schedule a briefing →
          </Link>
        </div>
      </div>
    </div>
  );
}

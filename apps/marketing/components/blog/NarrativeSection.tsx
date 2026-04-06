"use client";

import { useState } from 'react';

interface NarrativeSectionProps {
  children: React.ReactNode;
}

export function NarrativeSection({ children }: NarrativeSectionProps) {
  return (
    <div 
      id="narrative"
      className="max-w-reading mx-auto"
    >
      <div className="prose prose-base sm:prose-lg prose-stone">
        {children}
      </div>
    </div>
  );
}

interface PullQuoteProps {
  children: React.ReactNode;
}

export function PullQuote({ children }: PullQuoteProps) {
  return (
    <blockquote className="font-serif text-lg sm:text-xl md:text-2xl text-stone italic border-l-4 border-sage pl-4 sm:pl-6 my-6 sm:my-8 not-prose">
      {children}
    </blockquote>
  );
}

interface GlossaryTermProps {
  term: string;
  definition: string;
}

export function GlossaryTerm({ term, definition }: GlossaryTermProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className="border-b border-dotted cursor-help relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      {term}
      {isVisible && (
        <span className="absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 px-3 py-2 bg-ink text-canvas text-sm rounded-md max-w-[280px] sm:whitespace-nowrap z-10">
          {definition}
        </span>
      )}
    </span>
  );
}

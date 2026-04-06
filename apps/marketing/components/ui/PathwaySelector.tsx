"use client";

import { Pathway, pathways } from '@/lib/blog-data';
import { usePathway } from '@/hooks/useBlog';

export function PathwaySelector() {
  const { pathway, setPathway, isInitialized } = usePathway();

  if (!isInitialized) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {pathways.map((p) => (
          <div
            key={p.value}
            className="h-9 w-20 bg-parchment rounded-full animate-pulse flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-none"
      role="tablist"
      aria-label="Filter by perspective"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {pathways.map((p) => (
        <button
          key={p.value}
          role="tab"
          aria-selected={pathway === p.value}
          onClick={() => setPathway(p.value)}
          data-analytics="pathway-filter"
          data-value={p.value}
          className={`
            px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
            flex-shrink-0 whitespace-nowrap
            ${pathway === p.value 
              ? 'bg-sage text-white' 
              : 'bg-parchment text-stone hover:bg-sage/10 hover:text-sage border border-border-light'
            }
          `}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export function PathwayContext() {
  const { pathway, isInitialized } = usePathway();
  
  if (!isInitialized) return null;

  const currentPathway = pathways.find(p => p.value === pathway);
  
  if (!currentPathway || pathway === 'all') return null;

  return (
    <p className="text-stone text-meta mt-2">
      Curated for {currentPathway.context.toLowerCase()}
    </p>
  );
}

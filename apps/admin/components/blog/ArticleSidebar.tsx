"use client";

import { useScrollProgress } from '@/hooks/useBlog';

export function ProgressSentinel() {
  const progress = useScrollProgress();

  return (
    <div className="fixed left-4 top-0 bottom-0 w-0.5 bg-border-light hidden lg:block z-30">
      <div 
        className="w-full bg-sage transition-all duration-100"
        style={{ height: `${progress}%` }}
      />
    </div>
  );
}

export function ArticleSidebar() {
  const progress = useScrollProgress();

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-8 space-y-8">
        {/* Progress Sentinel */}
        <div className="space-y-2">
          <span className="text-meta text-stone-light">Reading Progress</span>
          <div className="h-1 bg-border-light rounded-full overflow-hidden">
            <div 
              className="h-full bg-sage transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-meta text-stone-light">{Math.round(progress)}%</span>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button 
            className="flex items-center gap-2 text-sm text-stone hover:text-sage transition-colors"
            onClick={() => {
              console.log('[Analytics] Cite this article clicked');
              navigator.clipboard.writeText('Citation copied');
              alert('Citation copied to clipboard');
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Cite This Article
          </button>
          
          <button className="flex items-center gap-2 text-sm text-stone hover:text-sage transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </aside>
  );
}

export function JourneyCompanion() {
  const progress = useScrollProgress();

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-8 space-y-6">
        {/* Dynamic content based on scroll position */}
        {progress < 20 && (
          <div className="space-y-3">
            <h4 className="font-medium text-ink">In This Article</h4>
            <ul className="space-y-2 text-sm text-stone">
              <li>Key Findings</li>
              <li>Narrative Analysis</li>
              <li>Methodology</li>
              <li>Supporting Materials</li>
            </ul>
          </div>
        )}

        {progress >= 20 && progress < 60 && (
          <div className="space-y-3">
            <h4 className="font-medium text-ink">Continue Reading</h4>
            <p className="text-sm text-stone">
              Explore the detailed analysis in the narrative section.
            </p>
          </div>
        )}

        {progress >= 60 && (
          <div className="space-y-4">
            <h4 className="font-medium text-ink">Ready to Dive Deeper?</h4>
            <p className="text-sm text-stone">
              Download the complete framework with all supporting materials.
            </p>
            <a 
              href="#dossier"
              className="inline-flex items-center gap-2 text-sm text-sage font-medium hover:underline"
            >
              Get the Dossier →
            </a>
          </div>
        )}

        {/* Related Reading */}
        <div className="pt-4 border-t border-border-light">
          <h4 className="font-medium text-ink mb-3">Related Reading</h4>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-sm text-stone hover:text-sage transition-colors">
                ESOP Tax Implications for 2026
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-stone hover:text-sage transition-colors">
                Governance Gap Analysis Framework
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

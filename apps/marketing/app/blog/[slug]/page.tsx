import { notFound } from 'next/navigation';
import { mockArticles } from '@/lib/blog-data';
import { ArticleSidebar, JourneyCompanion } from '@/components/blog/ArticleSidebar';
import { PathwayBadge } from '@/components/ui/CustomBadge';
import { ReadingTimePills } from '@/components/blog/ReadingTimePills';
import { ResilienceSummary } from '@/components/blog/ResilienceSummary';
import { NarrativeSection, PullQuote } from '@/components/blog/NarrativeSection';
import { DossierBar } from '@/components/blog/DossierBar';
import { ScrollProgress } from '@/components/blog/ScrollProgress';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return mockArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = mockArticles.find((a) => a.slug === slug);
  
  if (!article) return { title: 'Article Not Found' };
  
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = mockArticles.find((a) => a.slug === slug);
  
  if (!article) {
    notFound();
  }

  return (
    <main className="pt-20 sm:pt-24 pb-24 sm:pb-32">
      {/* Progress Sentinel */}
      <ScrollProgress />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar — hidden on mobile/tablet */}
          <ArticleSidebar />
          
          {/* Main Content */}
          <article className="flex-1 min-w-0 max-w-reading mx-auto lg:mx-0">
            {/* Breadcrumb */}
            <nav className="text-meta text-stone-light mb-4 sm:mb-6">
              <a href="/blog" className="hover:text-sage transition-colors">Blog</a>
              <span className="mx-2">/</span>
              <span>{article.category}</span>
            </nav>

            {/* Header */}
            <header className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <PathwayBadge pathway={article.pathway} />
                <span className="text-meta text-stone-light">{article.category}</span>
              </div>
              
              <h1 className="font-serif text-h1 text-ink mb-3 sm:mb-4">
                {article.title}
              </h1>
              
              <p className="text-stone text-base sm:text-xl mb-4 sm:mb-6">
                {article.subtitle}
              </p>

              {/* Author Block */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sage font-medium text-sm sm:text-base">
                    {article.author.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-ink text-sm sm:text-base">{article.author.name}</p>
                  <p className="text-meta text-stone-light truncate">{article.author.credentials}</p>
                </div>
              </div>

              {/* Meta — stacked on mobile */}
              <div className="space-y-3">
                <span className="block text-meta text-stone-light">{article.publishedAt}</span>
                <ReadingTimePills 
                  overview={article.readTime.overview}
                  deepDive={article.readTime.deepDive}
                  methodology={article.readTime.methodology}
                />
              </div>
            </header>

            {/* Layer 1: Resilience Summary */}
            <ResilienceSummary 
              summary={article.resilienceSummary}
              pathway={article.pathway}
              author={article.author}
              reviewedBy={article.reviewedBy}
            />

            {/* Layer 2: Narrative */}
            <NarrativeSection>
              <p>
                The regulatory landscape for family enterprise transitions has shifted dramatically 
                in recent years. What worked a decade ago may now expose counsel to significant 
                liability. As we navigate increasingly complex stakeholder landscapes, the need 
                for rigorous frameworks has never been more pressing.
              </p>

              <p>
                Consider the case of a mid-sized manufacturing company in the Pacific Northwest. 
                When the founding family sought to transition ownership to the next generation, 
                they discovered that their existing governance documents—drafted years prior—contained 
                critical gaps that threatened to derail the entire process.
              </p>

              <PullQuote>
                The difference between a successful stewardship transition and a protracted 
                dispute often comes down to the quality of preparation before any documents 
                are drafted.
              </PullQuote>

              <h2>The Expanding Scope of Fiduciary Duty</h2>

              <p>
                When advising on multi-generational transitions, counsel must account for an 
                expanding set of fiduciary obligations. The Delaware Chancery Court&apos;s recent 
                decisions have established new precedents regarding minority shareholder protections 
                that directly impact family enterprises.
              </p>

              <p>
                Traditional exit structures—designed for arm&apos;s length transactions between 
                unrelated parties—often fail to address the unique dynamics of family governance. 
                This is where the Stewardship Covenant framework provides superior protection.
              </p>

              <h2>Reducing Litigation Risk</h2>

              <p>
                Our analysis of 340 transitions over 14 years reveals that properly structured 
                Stewardship Covenants reduce litigation risk by 34% compared to traditional 
                exit structures. This is not merely a matter of better documentation—it&apos;s 
                about fundamentally rethinking the relationship between stakeholders.
              </p>
            </NarrativeSection>

            {/* Layer 3: Methodology */}
            <section id="methodology" className="mt-12 sm:mt-16">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-parchment rounded-lg border border-border-light hover:border-sage transition-colors">
                  <h2 className="font-serif text-lg sm:text-xl text-ink">Methodology &amp; Data</h2>
                  <svg 
                    className="w-5 h-5 text-stone transition-transform group-open:rotate-180 flex-shrink-0 ml-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                
                <div className="p-4 sm:p-6 border-t border-border-light">
                  <h3 className="font-serif text-lg text-ink mb-4">Research Framework</h3>
                  <p className="text-stone mb-4">
                    Our analysis is based on a comprehensive review of 340 stewardship transitions 
                    across multiple industries, with particular attention to governance structures, 
                    tax implications, and stakeholder outcomes.
                  </p>

                  <h3 className="font-serif text-lg text-ink mb-4">Data Sources</h3>
                  <ul className="space-y-2 text-stone mb-6">
                    <li>• Delaware Chancery Court decisions (2010-2024)</li>
                    <li>• IRS Revenue Rulings related to ESOPs and family transfers</li>
                    <li>• Primary interviews with 142 transition advisors</li>
                    <li>• Financial performance data from transitioned enterprises</li>
                  </ul>

                  {article.dossierContents && (
                    <div className="pt-4 border-t border-border-light">
                      <h4 className="font-medium text-ink mb-3">Attached Protocols</h4>
                      <ul className="space-y-2">
                        {article.dossierContents.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-sage">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
            </section>

            {/* Related Content */}
            <section className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border-light">
              <h3 className="font-serif text-lg text-ink mb-4">Continue Your Research</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="/blog/esop-tax-2026" className="p-4 bg-parchment rounded-lg border border-border-light hover:border-sage transition-colors">
                  <span className="badge mb-2">For CPAs</span>
                  <h4 className="font-medium text-ink">ESOP Tax Implications: What Changes in 2026</h4>
                </a>
                <a href="/blog/governance-gap-analysis" className="p-4 bg-parchment rounded-lg border border-border-light hover:border-sage transition-colors">
                  <span className="badge mb-2">For Attorneys</span>
                  <h4 className="font-medium text-ink">The Governance Gap: Where Family Enterprises Fail</h4>
                </a>
              </div>
            </section>
          </article>

          {/* Right Sidebar — hidden on mobile/tablet */}
          <JourneyCompanion />
        </div>
      </div>

      {/* Layer 4: Dossier Bar */}
      <DossierBar pathway={article.pathway} />
    </main>
  );
}

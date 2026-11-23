"use client";

import Image from "next/image";

export function ProblemSolutionSection() {
  return (
    <section className="about-section-problem-solution">
      <div className="container">
        <div className="problem-solution-grid solution-only-grid">
          {/* Solution Column - Full Width */}
          <div className="problem-solution-column solution-column solution-only">
            <div className="solution-header">
              <span className="about-eyebrow">The Alternative</span>
              <h2>The third option was there all along</h2>
            </div>
            <div className="about-highlight">
              <Image
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD9Ng4TJ32pSgTBVY98K3GtlLfwieHEIvuUMxF"
                alt="Employee ownership collaboration"
                className="highlight-image"
                width={2034}
                height={1637}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <span className="highlight-text">100% Employee Owned</span>
            </div>
            <div className="solution-content">
              <p>
                Employee ownership through an ESOP answers each failure of the
                market in turn. The buyers are already inside the building, so
                there is no market search at all. The transaction is structured
                and financed in advance, so it closes in 120 days from Documents-Ready
                instead of expiring. The price is set by independent appraisal,
                not by a buyer&apos;s opportunism. And Congress, recognizing
                exactly this problem, attached serious tax incentives —
                including the Section 1042 deferral — to founders who choose it.
              </p>
              <p>
                The exit crisis is real, but it is a crisis of imagination as
                much as of markets. The founders who navigate it best are the
                ones who learn, early enough to act, that &quot;sell the
                company&quot; and &quot;sell out&quot; were never the same
                sentence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

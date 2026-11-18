"use client";

import Link from "next/link";

export function SolutionsSection() {
  return (
    <section className="about-section about-section-solutions">
      <div className="container">
        <div className="solutions-header">
          <span className="about-eyebrow">Continue reading</span>
          <h2>Read next</h2>
          <p className="solutions-intro">
            The crisis has an answer, and it is not a better broker. Beyond the
            Balance Sheet sets out the philosophy behind selling to the people
            who built the value.
          </p>
          <p className="result-next">
            <Link href="/beyond-the-balance-sheet">Read Beyond the Balance Sheet →</Link>
          </p>
        </div>
        <div className="solutions-result">
          <p className="result-text">
            Stefano Stokes is the Founder &amp; CEO of Forhemit, an
            employee-ownership succession firm in San Francisco. He leads every
            engagement personally.
          </p>
          <p className="result-next">
            <Link href="/about">More about Stefano and Forhemit →</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

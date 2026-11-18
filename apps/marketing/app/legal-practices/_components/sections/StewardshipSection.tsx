"use client";

import Image from "next/image";

export function StewardshipSection() {
  return (
    <section className="legal-section stewardship-section">
      <div className="container">
        <div className="stewardship-intro" data-animate="fade-up">
          <h2>
            Two ways the story ends
          </h2>
          <p className="stewardship-subtitle">What happens to the client relationship at closing</p>
        </div>

        <div className="comparison-blocks">
          <div className="comparison-block traditional" data-animate="slide-right">
            <div className="comparison-image">
              <Image
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDnNRRtzSNaoHZhcXfKi2B3O8YTR0lmArFCIVG"
                alt="A train station"
                width={1220}
                height={639}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <div className="comparison-image-overlay" />
            </div>
            <div className="comparison-content">
              <h3>Traditional M&amp;A</h3>
              <p className="comparison-desc">
                A third-party sale ends the story: the company is someone else&apos;s, and so
                is the client.
              </p>
              <div className="comparison-result negative">The relationship ends at the closing table</div>
            </div>
          </div>

          <div className="comparison-connector" data-animate="fade-in">
            vs
          </div>

          <div className="comparison-block stewardship" data-animate="slide-left">
            <div className="comparison-image">
              <Image
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD5DFKeJbJdhlvXzTciIMfp3OgtnGQKqaU1H5j"
                alt="Employee ownership collaboration"
                width={1315}
                height={637}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <div className="comparison-image-overlay" />
            </div>
            <div className="comparison-content">
              <h3>Employee Ownership</h3>
              <p className="comparison-desc">
                An employee-ownership transition <strong>continues</strong> it.
              </p>
              <ul className="preserve-list">
                <li>The company keeps its name</li>
                <li>The team stays intact</li>
                <li>The founder stays in it, on call, for 4 to 12 months</li>
                <li>The legal work recurs instead of concluding</li>
                <li>Counsel of record stays counsel of record</li>
              </ul>
              <div className="comparison-result positive">Still counsel of record. You.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

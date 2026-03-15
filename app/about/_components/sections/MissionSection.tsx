"use client";

export function MissionSection() {
  return (
    <section className="about-section about-section-mission">
      <div className="container">
        <div className="mission-grid">
          <div className="mission-content">
            <span className="about-eyebrow">The Founder</span>
            <h2>Our Mission is Our Mandate</h2>
            <p className="lead">
              Stefano&apos;s background isn&apos;t in traditional investment banking—it&apos;s in
              disaster planning and mitigation. In that field, you don&apos;t wait for the
              catastrophe to happen; you see the convergence of threats on the horizon and build a
              strategy to stop the damage before it starts.
            </p>
            <p>
              Looking at the current landscape, that convergence is here. We are facing a
              three-pronged disaster that threatens to cripple the market:
            </p>
            <div className="crisis-list">
              <div className="crisis-item">
                <strong>The Retirement Cliff:</strong> There are simply not enough qualified buyers
                to meet the demand of retiring owners. Even if a seller finds a buyer, the market
                saturation is driving valuations down, threatening the payout owners deserve.
              </div>
              <div className="crisis-item">
                <strong>The Workforce Crisis:</strong> Employees are facing a dual threat of
                displacement. They fear losing their jobs either to a new, unknown owner or to the
                rising tide of AI and automation.
              </div>
              <div className="crisis-item">
                <strong>Community Collapse:</strong> When businesses close rather than transition,
                the community loses its tax base, its history, and its economic heart.
              </div>
            </div>
            <p className="mission-closing">Forhemit was created to mitigate that disaster.</p>
          </div>
          <div className="mission-image-wrapper">
            <img
              src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDMAmOxFsP54wZ3MdlKIGHYbcXi6ROrhpmgC1x"
              alt="Stefano - Founder of Forhemit"
              className="mission-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

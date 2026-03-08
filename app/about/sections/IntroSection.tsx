export function IntroSection() {
  return (
    <section id="intro" style={{ background: 'var(--parchment)', padding: '4rem 0' }}>
      <div className="container">
        <div className="intro-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="section-body" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--ink)', marginBottom: '1.5rem' }}>
            Traditional private equity built its reputation on leverage and liquidation.
            We build ours on <strong>Continuity of Operations (COOP)</strong>.
          </p>
          <p className="section-body" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--ink)' }}>
            We are a holding company that acquires founder-led businesses to harden their infrastructure
            and transition them to employee ownership. We don&apos;t cut to the bone — <strong>we build muscle.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

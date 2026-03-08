export function PhilosophySection() {
  return (
    <section id="philosophy" style={{ background: 'var(--parchment)' }}>
      <div className="container">
        <div className="philosophy-grid">
          <div className="philosophy-left">
            <div className="section-tag">Our Philosophy</div>
            <h2 className="section-h2">We treat companies like<br/><em>retirement investments</em>,<br/>not lottery tickets.</h2>
            <p className="section-body">
              The typical private equity playbook treats your life&apos;s work as an arbitrage opportunity —
              buy low, lever up, slash costs, and sell in five years with a return that leaves your people
              holding nothing but pink slips.
            </p>
            <p className="section-body" style={{ marginTop: '-1rem' }}>
              We are wired differently. We acquire founder-led businesses with intention of operating
              them indefinitely — generating steady dividends for owners, building real equity for employees,
              and preserving institutional knowledge that made company worth acquiring in first place.
            </p>
          </div>
          <div className="philosophy-right">
            <div className="philosophy-quote">
              &quot;A healthy company returns dividends.<br/>A sick company returns desperation.&quot;
            </div>
            <p className="philosophy-text">
              When a PE firm loads a company with debt to juice short-term returns, it isn&apos;t investing —
              it is borrowing against future of your employees, your customers, and your legacy.
              We cap leverage at 40% precisely because we intend to be here in thirty years.
              <br/><br/>
              This is not charity. It is simply better engineering.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

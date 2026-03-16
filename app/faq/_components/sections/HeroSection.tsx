"use client";

export function HeroSection() {
  return (
    <section
      className="about-hero faq-hero"
      style={{
        backgroundImage: `url('https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDxhHE1RrDCTYEeowLu4zXJVgBrFMRPNbGKnf3')`,
        minHeight: "70vh",
      }}
    >
      <div className="container">
        <span className="about-eyebrow about-eyebrow-hero">Resources</span>
        <h1 className="about-title">Frequently Asked Questions</h1>
        <p className="about-subtitle">The Forhemit Approach</p>
      </div>
    </section>
  );
}

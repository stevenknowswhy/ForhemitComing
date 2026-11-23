"use client";

export function HeroSection() {
  return (
    <section
      className="about-hero"
      style={{
        backgroundImage: `url('https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDLIM7aG7U5RqmliJOUfha4pgWxoQEH2FLYC7w')`,
      }}
    >
      <div className="container">
        <span className="about-eyebrow about-eyebrow-hero">Essay</span>
        <h1 className="about-title">The Exit Crisis</h1>
        <p className="about-subtitle">
          A generation of founders is reaching retirement with no successor and
          too few buyers. Most businesses taken to market never sell at all —
          and the founders who learn that late have the fewest options left.
        </p>
        <p className="about-eyebrow">By Stefano Stokes, Founder &amp; CEO of Forhemit</p>
        <p className="about-eyebrow">Published April 6, 2026</p>
      </div>
    </section>
  );
}

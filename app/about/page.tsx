"use client";

import Link from "next/link";
import { Navigation } from "../components/layout/Navigation";
import { Footer } from "../components/layout/Footer";
import "../components/layout/navigation.css";
import "../components/layout/footer.css";
import "./about-page.css";

export default function AboutPage() {
  return (
    <div className="about-wrapper">
      <div className="about-background"></div>
      
      {/* Logo Header */}
      <header className="about-logo-header">
        <Link href="/" className="about-logo-link">
          <span className="about-logo-text">Forhemit</span>
          <span className="about-logo-underline"></span>
        </Link>
      </header>
      
      <Navigation />
      
      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <span className="about-eyebrow">Our Story</span>
            <h1 className="about-title">Your Legacy Deserves Better</h1>
            <p className="about-subtitle">
              The real risk isn't choosing the wrong option. It's assuming you have one.
            </p>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <h2>The Coming Disaster</h2>
                <p>
                  Here&apos;s a secret your broker won&apos;t tell you: today, 70-80% of businesses 
                  that go to market never sell. Not because they were bad. It&apos;s because for 
                  every 50 businesses for sale, there is roughly one qualified buyer. And with 
                  millions of Baby Boomers retiring over the next decade, that ratio is about 
                  to get much worse.
                </p>
                <p>
                  Do the math. What happens when you&apos;re ready to retire, and there is no buyer 
                  waiting? Your employees lose their jobs. Your business vanishes from the 
                  community. Everything you&apos;ve spent decades building ends with a &quot;Closed&quot; 
                  sign on the door.
                </p>
              </div>
              <div className="about-stat">
                <span className="stat-number">70-80%</span>
                <span className="stat-label">of businesses never sell</span>
              </div>
            </div>
          </div>
        </section>

        {/* The Solution Section */}
        <section className="about-section about-section-alt">
          <div className="container">
            <div className="about-grid about-grid-reverse">
              <div className="about-content">
                <h2>A Better Option</h2>
                <p>
                  But there is a better option. A buyer who already knows your business, 
                  your customers, and your culture. Because you hired them.
                </p>
                <p>
                  We help you transition your company to 100% employee ownership. You get 
                  the payout you&apos;ve earned. They get the future they deserve.
                </p>
                <p>
                  And the company you spent your life building doesn&apos;t end with a &quot;Closed&quot; 
                  sign. It begins your legacy.
                </p>
              </div>
              <div className="about-highlight">
                <span className="highlight-text">100% Employee Owned</span>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="about-section">
          <div className="container">
            <div className="about-content-centered">
              <h2>Our Mission is Our Mandate</h2>
              <p className="lead">
                Forhemit was not founded by a broker or a financial guru. It was founded 
                by a specialist in Disaster Preparedness.
              </p>
              <p>
                Stefano&apos;s background isn&apos;t in finance; it&apos;s in mitigation. In the world 
                of emergency management, the goal is to see a crisis before it arrives 
                and transition people through the disaster safely. We are now approaching 
                an economic disaster, one that threatens not just a single business, but 
                the very fabric of local communities.
              </p>
            </div>
          </div>
        </section>

        {/* Three Crises Section */}
        <section className="about-section about-section-dark">
          <div className="container">
            <h2 className="section-title">The Three-Pronged Crisis</h2>
            <div className="crisis-grid">
              <div className="crisis-card">
                <h3>The Retirement Cliff</h3>
                <p>
                  A &quot;Silver Tsunami&quot; is hitting the market. With up to 100 sellers for every 
                  one qualified buyer, the traditional market is saturated. For most owners, 
                  this math means their payout—and their retirement—is at risk.
                </p>
              </div>
              <div className="crisis-card">
                <h3>The Workforce Crisis</h3>
                <p>
                  Your employees are facing a dual threat of displacement. They fear losing 
                  their livelihoods to a heartless new owner, the rapid rise of AI, or the 
                  &quot;Closed&quot; sign that appears when a business fails to find a buyer.
                </p>
              </div>
              <div className="crisis-card">
                <h3>The Community Collapse</h3>
                <p>
                  When a local business vanishes, it isn&apos;t just a transaction that ends. 
                  The city loses its tax base, its history, and its economic heart.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PBC Section */}
        <section className="about-section">
          <div className="container">
            <div className="about-content-centered">
              <span className="about-eyebrow">Public Benefit Corporation</span>
              <h2>Beyond Profit</h2>
              <p className="lead">
                Forhemit was born to mitigate these disasters. We aren&apos;t here to &quot;flip&quot; 
                a company; we are here to preserve a legacy.
              </p>
              <p>
                Because we believe this mission is too important to be left to chance, 
                Forhemit is a Public Benefit Corporation. Our commitment to serving owners, 
                protecting employees, and strengthening communities isn&apos;t a page on our 
                website—it is written into our corporate bylaws.
              </p>
              <p>
                We exist to ensure that the story you spent decades writing doesn&apos;t end 
                in a disaster. It ends with a transition to the people who helped you build it.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="container">
            <h2>Let&apos;s Talk About Your Legacy</h2>
            <p>
              It&apos;s an option you may not have known existed. We&apos;d love to talk about 
              whether it&apos;s the right one for you.
            </p>
            <a href="/introduction" className="cta-button">
              Schedule a Discussion
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

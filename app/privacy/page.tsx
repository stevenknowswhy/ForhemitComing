"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "../components/layout/Footer";
import { SitemapModal } from "../components/modals/SitemapModal";
import "./privacy-page.css";

export default function PrivacyPage() {
  const [showSitemapModal, setShowSitemapModal] = useState(false);

  return (
    <div className="legal-page-wrapper">
      {/* Logo Header */}
      <header className="legal-logo-header">
        <Link href="/" className="legal-logo-link">
          <span className="legal-logo-text">Forhemit</span>
          <span className="legal-logo-underline"></span>
        </Link>
      </header>

      <main className="legal-main">
        <section className="legal-hero">
          <div className="container">
            <span className="legal-eyebrow">Legal</span>
            <h1 className="legal-title">Privacy Policy</h1>
            <p className="legal-subtitle">Last updated: March 2026</p>
          </div>
        </section>

        <section className="legal-content-section">
          <div className="container">
            <div className="legal-text-content">
              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us when you use our website, 
                fill out forms, or communicate with us. This may include:
              </p>
              <ul>
                <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address</li>
                <li><strong>Business Information:</strong> Company name, industry, and business details</li>
                <li><strong>Professional Information:</strong> Resume, work history, and qualifications (for job applicants)</li>
                <li><strong>Communication Data:</strong> Messages, inquiries, and feedback you provide</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our website</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Evaluate business opportunities and partnership inquiries</li>
                <li>Process job applications and communicate with candidates</li>
                <li>Respond to your questions and provide customer support</li>
                <li>Send you updates, newsletters, and marketing communications (with your consent)</li>
                <li>Improve our website, services, and user experience</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>

              <h2>3. Information Sharing and Disclosure</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              <ul>
                <li><strong>Service Providers:</strong> With trusted third parties who assist us in operating our website and conducting our business</li>
                <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Protection of Rights:</strong> To protect our rights, property, or safety, and that of our users</li>
              </ul>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect 
                your personal information against unauthorized access, alteration, disclosure, 
                or destruction. However, no method of transmission over the Internet or 
                electronic storage is 100% secure.
              </p>

              <h2>5. Your Rights and Choices</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul>
                <li>Access and receive a copy of your personal information</li>
                <li>Correct or update inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict certain processing of your data</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Data portability - receive your data in a structured format</li>
              </ul>
              <p>
                To exercise these rights, please contact us at privacy@forhemit.com.
              </p>

              <h2>6. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience 
                on our website. You can control cookie preferences through your browser settings. 
                For more information, please see our Cookie Policy.
              </p>

              <h2>7. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible 
                for the privacy practices or content of these external sites. We encourage 
                you to review the privacy policies of any third-party sites you visit.
              </p>

              <h2>8. Children&apos;s Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of 18. We do not 
                knowingly collect personal information from children. If we become aware that 
                we have collected information from a child, we will take steps to delete it.
              </p>

              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of 
                any material changes by posting the new policy on this page with an updated 
                &quot;Last updated&quot; date.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <p>
                <strong>Email:</strong> privacy@forhemit.com<br />
                <strong>Address:</strong> Forhemit Capital, Attn: Privacy Officer<br />
                <strong>Website:</strong> <Link href="/introduction">Contact Form</Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="static" onSitemapClick={() => setShowSitemapModal(true)} />

      <SitemapModal isOpen={showSitemapModal} onClose={() => setShowSitemapModal(false)} />
    </div>
  );
}

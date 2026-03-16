"use client";

import "./privacy-page.css";

export default function PrivacyPage() {
  return (
    <div className="legal-page-wrapper">
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
                <li>Send SMS/text messages for appointment reminders, updates, and notifications (with your explicit consent)</li>
                <li>Improve our website, services, and user experience</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>

              <h2>3. SMS/Text Messaging (TCPA Compliance)</h2>
              <p>
                By providing your mobile phone number and opting in to receive text messages, 
                you expressly consent to receive SMS communications from Forhemit Capital in 
                accordance with the Telephone Consumer Protection Act (TCPA).
              </p>
              <h3>Message Types and Frequency</h3>
              <ul>
                <li><strong>Account Notifications:</strong> Updates about your inquiry or application status</li>
                <li><strong>Appointment Reminders:</strong> Confirmation and reminder messages for scheduled calls or meetings</li>
                <li><strong>Educational Content:</strong> Occasional ESOP resources and succession planning insights</li>
                <li><strong>Customer Care:</strong> Responses to your inquiries and support requests</li>
              </ul>
              <p>
                Message frequency may vary based on your interactions with us. You may receive 
                up to 10 messages per month depending on your engagement level and active business 
                relationships.
              </p>
              <h3>Message and Data Rates</h3>
              <p>
                Message and data rates may apply depending on your mobile carrier and plan. 
                Forhemit Capital is not responsible for any charges incurred from receiving 
                text messages.
              </p>
              <h3>How to Opt Out</h3>
              <p>
                You can opt out of SMS communications at any time by:
              </p>
              <ul>
                <li>Replying <strong>STOP</strong> to any text message you receive from us</li>
                <li>Contacting us at privacy@forhemit.com</li>
                <li>Visiting our <Link href="/opt-in">Communication Preferences</Link> page</li>
              </ul>
              <p>
                After opting out, you will receive one final confirmation message confirming 
                your unsubscription. You will not receive any further marketing or promotional 
                text messages unless you opt back in.
              </p>
              <h3>Help and Support</h3>
              <p>
                For help with SMS communications, reply <strong>HELP</strong> to any message 
                or contact us at privacy@forhemit.com or call +1 (800) 555-0199.
              </p>

              <h2>4. Email Communications (CAN-SPAM Compliance)</h2>
              <p>
                In accordance with the CAN-SPAM Act, all marketing emails from Forhemit Capital include:
              </p>
              <ul>
                <li>Clear identification that the message is an advertisement or promotional</li>
                <li>Our physical mailing address</li>
                <li>A clear and conspicuous opt-out mechanism</li>
                <li>Honor opt-out requests within 10 business days</li>
              </ul>
              <p>
                You may opt out of marketing emails at any time by clicking the 
                &quot;Unsubscribe&quot; link in any email or by updating your preferences on our 
                <Link href="/opt-in">Communication Preferences</Link> page.
              </p>

              <h2>6. Information Sharing and Disclosure</h2>
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

              <h2>7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect 
                your personal information against unauthorized access, alteration, disclosure, 
                or destruction. However, no method of transmission over the Internet or 
                electronic storage is 100% secure.
              </p>

              <h2>8. Your Rights and Choices</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul>
                <li>Access and receive a copy of your personal information</li>
                <li>Correct or update inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict certain processing of your data</li>
                <li>Withdraw consent for marketing communications (email, SMS, or phone)</li>
                <li>Data portability - receive your data in a structured format</li>
              </ul>
              <p>
                To exercise these rights, please contact us at privacy@forhemit.com or 
                call +1 (800) 555-0199.
              </p>

              <h2>9. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience 
                on our website. You can control cookie preferences through your browser settings. 
                For more information, please see our Cookie Policy.
              </p>

              <h2>10. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible 
                for the privacy practices or content of these external sites. We encourage 
                you to review the privacy policies of any third-party sites you visit.
              </p>

              <h2>11. Children&apos;s Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of 18. We do not 
                knowingly collect personal information from children. If we become aware that 
                we have collected information from a child, we will take steps to delete it.
              </p>

              <h2>12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of 
                any material changes by posting the new policy on this page with an updated 
                &quot;Last updated&quot; date.
              </p>

              <h2>13. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <p>
                <strong>Email:</strong> privacy@forhemit.com<br />
                <strong>Phone:</strong> +1 (800) 555-0199<br />
                <strong>Address:</strong> Forhemit Capital, Attn: Privacy Officer<br />
                <strong>Website:</strong> <Link href="/introduction">Contact Form</Link>
              </p>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

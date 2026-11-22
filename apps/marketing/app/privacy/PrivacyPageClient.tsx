"use client";

import "@forhemit/shared/styles/privacy-page.css";

export function PrivacyPageClient() {
	return (
		<div className="legal-page-wrapper">
			<main className="legal-main">
				<section className="legal-hero">
					<div className="container">
						<span className="legal-eyebrow">Legal</span>
						<h1 className="legal-title">Privacy Policy</h1>
						<p className="legal-subtitle">Last updated: November 17, 2026</p>
					</div>
				</section>

				<section className="legal-content-section">
					<div className="container">
						<div className="legal-text-content">
							<h2>What we collect</h2>
							<p>
								Forhemit is an employee-ownership succession advisory firm. This
								website collects only what you choose to send us. The assessment
								first asks whether you are a founder or a professional, the kind
								of work you do, and your industry — then five yes-or-no questions
								about your business — whether it has $3M or more in revenue, 20 or
								more verifiable U.S. employees, has been profitable for 3 years or
								more, can allow 120 days for a transition, and whether you can
								be available to the company for a transition period of 4 to 12
								months after closing — on call for check-ins, introductions, and
								questions, not working hands-on. We record those answers
								anonymously, together with the result the assessment gives you.
								The record holds no name, email address, or anything else that
								identifies you or your company, and we use it only to understand
								who the assessment serves. If you choose to continue after your
								result, we ask for your name, email address, and company name,
								and save those details so we can respond to you personally. The
								contact form collects your name, email address, and your message.
							</p>

							<h2>How we use it</h2>
							<p>
								Submissions are used solely to evaluate and respond to your
								inquiry about an employee-ownership transition or a partnership
								introduction. We do not sell, rent, or share your information
								with third parties for marketing, and we do not add you to a
								mailing list.
							</p>
							<p>
								Submissions are stored for us by the providers that host this
								website and deliver its forms. They process your information
								only to run the site, never for their own purposes.
							</p>

							<h2>Confidentiality</h2>
							<p>
								Succession planning is sensitive. Information you share about
								your company&apos;s financials, headcount, and intentions is
								treated as confidential and is reviewed only by Forhemit
								personnel involved in responding to you.
							</p>

							<h2>Retention and your choices</h2>
							<p>
								We keep submissions only as long as needed to respond and, where
								a professional relationship follows, to serve it. You may ask us
								at any time to see, correct, or delete the information you
								submitted. Write to{" "}
								<a href="mailto:contact@forhemit.com">contact@forhemit.com</a>,
								or use the contact form, and we will comply promptly.
							</p>

							<h2>Tracking and analytics</h2>
							<p>
								We use Vercel Analytics to understand how this site is used — which
								pages are read, and whether the steps toward an application are
								completed. It is cookieless, it does not identify you, and it
								does not follow you across other websites. We set no advertising
								trackers, and no other party collects information about your
								activity across other websites through this site. If you buy the
								Self Guided Transition Service, payment is handled by Stripe on
								its own pages — your card details go to Stripe and never touch
								our systems. Because the site does not track you across other
								websites, it does not respond to browser &quot;Do Not Track&quot;
								signals.
							</p>

							<h2>Changes to this policy</h2>
							<p>
								If we change this policy in a way that matters, we will post the
								new version on this page and update the date at the top. The
								version posted here is the one that applies.
							</p>

							<h2>Who we are and how to reach us</h2>
							<p>
								This site is published by Forhemit, a California Public Benefit
								Corporation, 55 9th Street, San Francisco, CA. Questions about
								this policy:{" "}
								<a href="mailto:contact@forhemit.com">contact@forhemit.com</a>{" "}
								or <a href="tel:+15107687588">(510) 768-7588</a>.
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

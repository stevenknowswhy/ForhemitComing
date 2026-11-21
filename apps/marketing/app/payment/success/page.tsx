import type { Metadata } from "next";
import "../payment.css";

export const metadata: Metadata = {
  title: "Payment received | Forhemit",
  description: "Your Self Guided Transition Service payment is confirmed.",
  robots: { index: false, follow: false },
};

/**
 * Stripe success_url target. Stripe sends the applicant here only after a
 * completed payment; the record itself is marked paid by the
 * signature-verified webhook, not by this page.
 */
export default function PaymentSuccessPage() {
  return (
    <main className="pm-shell">
      <div className="pm-card">
        <p className="pm-eyebrow">Payment received</p>
        <h1 className="pm-title">You&rsquo;re in. Here&rsquo;s what happens next.</h1>
        <p className="pm-body">
          Your $3,000 payment for the Self Guided Transition Service is
          confirmed, and a receipt is on its way from Stripe. Your transition
          starts now:
        </p>
        <ol className="pm-steps">
          <li>
            We open your portal and email your access — that&rsquo;s where
            your documents, checklist, and messages live.
          </li>
          <li>
            We schedule your kickoff call and walk your 120-Day Roadmap
            through with you.
          </li>
          <li>
            Your roadmap is built from your company&rsquo;s own answers and
            documents, month by month.
          </li>
        </ol>
        <p className="pm-note">
          Covered by the money-back guarantee: a full refund at any time
          before your roadmap is delivered, and for 14 days after. Questions
          before your portal email arrives? contact@forhemit.com or
          (510) 768-7588.
        </p>
      </div>
    </main>
  );
}

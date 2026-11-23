import type { Metadata } from "next";
import Link from "next/link";
import "../payment.css";

export const metadata: Metadata = {
  title: "Payment not completed | Forhemit",
  description: "Your Self Guided Transition Service payment step is still open.",
  robots: { index: false, follow: false },
};

/**
 * Stripe cancel_url target. Leaving checkout charges nothing and does not
 * affect the approval — the same payment step stays payable.
 */
export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const { payment } = await searchParams;

  return (
    <main className="pm-shell">
      <div className="pm-card">
        <p className="pm-eyebrow">Payment</p>
        <h1 className="pm-title">No charge — your place is held.</h1>
        <p className="pm-body">
          You left checkout before paying, so nothing was charged. Your
          approval stands, and your payment step for the Self Guided
          Transition Service stays open — pick it up whenever you&rsquo;re
          ready.
        </p>
        {payment ? (
          <Link className="pm-button" href={`/pay/${payment}`}>
            Return to payment
          </Link>
        ) : (
          <Link className="pm-button" href="/contact">
            Contact us
          </Link>
        )}
        <p className="pm-note">
          Questions? contact@forhemit.com or (510) 405-4330.
        </p>
      </div>
    </main>
  );
}

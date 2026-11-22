import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchAction } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import "../../payment/payment.css";

export const metadata: Metadata = {
  title: "Complete your payment | Forhemit",
  description: "The payment step for an approved Self Guided Transition Service application.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * The payment step for an approved application. This route is never linked
 * from public navigation — the approval email (and later the portal) links
 * here with the payment record's ID. It asks Convex to mint or reuse the
 * Stripe Checkout Session bound to that record and redirects to Stripe.
 * The amount always comes from the Stripe price object; nothing here can
 * influence it. A paid record lands on the success page instead.
 */
export default async function PayPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;

  let result: { status: string; url?: string } = { status: "error" };
  try {
    result = await fetchAction(api.stripeCheckout.createOrReuseSession, {
      paymentId: paymentId as Id<"selfServicePayments">,
    });
  } catch {
    result = { status: "not_found" };
  }

  if (result.status === "open" && result.url) {
    redirect(result.url);
  }
  if (result.status === "paid") {
    redirect(`/payment/success?payment=${paymentId}`);
  }

  return (
    <main className="pm-shell">
      <div className="pm-card">
        <p className="pm-eyebrow">Payment</p>
        <h1 className="pm-title">This payment link isn&rsquo;t active.</h1>
        <p className="pm-body">
          Payment links are issued once an application is approved, and each
          one belongs to a single company. If you arrived here from an
          approval email and the link isn&rsquo;t working, we&rsquo;ll sort
          it out — no charge has been made.
        </p>
        <p className="pm-note">
          Contact us at contact@forhemit.com or (510) 405-4330 and mention
          that your payment link isn&rsquo;t active.
        </p>
      </div>
    </main>
  );
}

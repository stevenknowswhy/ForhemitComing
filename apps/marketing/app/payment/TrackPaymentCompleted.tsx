"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * W8 funnel: Stripe sends the applicant to /payment/success only after a
 * completed payment (the record itself is marked paid by the webhook).
 * Mounting this page is the payment stage of the funnel.
 */
export function TrackPaymentCompleted() {
  useEffect(() => {
    track("payment_completed");
  }, []);
  return null;
}

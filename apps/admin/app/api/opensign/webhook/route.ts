import { type NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { strictLimiter, getClientIp, checkRateLimit } from "@/lib/ratelimit";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * OpenSign webhook receiver
 * Receives signature status updates from OpenSign
 */
export async function POST(request: NextRequest) {
  // Rate limit by IP
  const rateLimitResponse = await checkRateLimit(strictLimiter, getClientIp(request));
  if (rateLimitResponse) return rateLimitResponse;
  try {
    // Verify webhook signature if OpenSign provides one
    const signature = request.headers.get("x-opensign-signature");
    // TODO: verify signature when OpenSign provides verification method

    const body = await request.json();

    // Extract envelope data from webhook payload
    const {
      envelopeId,
      status,
      signedDocumentUrl,
      recipientEmail,
    } = body;

    if (!envelopeId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: envelopeId, status" },
        { status: 400 }
      );
    }

    // Call Convex mutation to handle the webhook
    const result = await convex.mutation(api.opensign.handleWebhook, {
      envelopeId,
      status,
      signedDocumentUrl,
      recipientEmail,
    });

    if (!result.success) {
      console.warn("OpenSign webhook: task not found for envelope", envelopeId);
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("OpenSign webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

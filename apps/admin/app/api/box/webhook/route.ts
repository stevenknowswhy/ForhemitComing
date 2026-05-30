import { type NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { strictLimiter, getClientIp, checkRateLimit } from "@/lib/ratelimit";
import { createHmac } from "node:crypto";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const WEBHOOK_PRIMARY_KEY = process.env.BOX_WEBHOOK_PRIMARY_KEY;

/**
 * Verify Box webhook signature.
 * Box sends BOX-SIGNATURE-PRIMARY header = HMAC-SHA256(rawBody, primaryKey)
 */
function verifyBoxSignature(
  body: string,
  signature: string | null,
  key: string | undefined,
): boolean {
  if (!key || !signature) return false;
  const expected = createHmac("sha256", key).update(body).digest("base64");
  return expected === signature;
}

/**
 * Box webhook receiver
 * Receives sign request status updates from Box Sign
 */
export async function POST(request: NextRequest) {
  // Rate limit by IP
  const rateLimitResponse = await checkRateLimit(
    strictLimiter,
    getClientIp(request),
  );
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawBody = await request.text();

    // Verify webhook signature
    const signature = request.headers.get("box-signature-primary");
    if (WEBHOOK_PRIMARY_KEY && !verifyBoxSignature(rawBody, signature, WEBHOOK_PRIMARY_KEY)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 },
      );
    }

    const body = JSON.parse(rawBody);

    // Handle webhook challenge (Box sends this during webhook setup)
    if (body.type === "webhook_challenge") {
      return NextResponse.json({
        challenge: body.challenge,
      });
    }

    // Extract sign request data from event
    const eventType = body.event_type;
    const signRequest = body.sign_request;

    if (!eventType || !signRequest?.id) {
      return NextResponse.json(
        { error: "Missing required fields: event_type, sign_request.id" },
        { status: 400 },
      );
    }

    // Only handle sign-related events
    const handledEvents = [
      "SIGN_REQUEST.SENT",
      "SIGN_REQUEST.VIEWED",
      "SIGN_REQUEST.SIGNED",
      "SIGN_REQUEST.COMPLETED",
      "SIGN_REQUEST.DECLINED",
      "SIGN_REQUEST.EXPIRED",
    ];

    if (!handledEvents.includes(eventType)) {
      return NextResponse.json({ success: true, skipped: true });
    }

    // Get signed file ID if available
    const signedFileId =
      signRequest.sign_files?.files?.[0]?.id || null;

    // Call Convex mutation to update the task
    const result = await convex.mutation(api.box.handleBoxWebhook, {
      signRequestId: signRequest.id,
      eventType,
      signStatus: signRequest.status,
      signedFileId: signedFileId || undefined,
    });

    if (!result.success) {
      console.warn(
        "Box webhook: task not found for sign request",
        signRequest.id,
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Box webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

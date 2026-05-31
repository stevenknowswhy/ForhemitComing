import { type NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Resend webhook — tracks email open/click events for journal digests
// Configure at: https://resend.com/webhooks

const convex = new ConvexHttpClient(
	process.env.NEXT_PUBLIC_CONVEX_URL || "https://striped-puma-587.convex.cloud",
);

// Map Resend event types to human-readable labels
const EVENT_LABELS: Record<string, string> = {
	"email.sent": "sent",
	"email.delivered": "delivered",
	"email.delivery_delayed": "delayed",
	"email.complained": "complained",
	"email.bounced": "bounced",
	"email.opened": "opened",
	"email.clicked": "clicked",
};

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Resend sends events in the format: { type, created_at, data: { email_id, ... } }
		const eventType = body.type as string;
		const resendEmailId = body.data?.email_id as string | undefined;

		if (!eventType || !resendEmailId) {
			return NextResponse.json(
				{ error: "Missing event type or email ID" },
				{ status: 400 },
			);
		}

		const label = EVENT_LABELS[eventType];
		if (!label) {
			// Unknown event type — acknowledge but don't process
			return NextResponse.json({ ok: true, skipped: eventType });
		}

		// Only track opens and clicks for engagement
		if (eventType === "email.opened" || eventType === "email.clicked") {
			try {
				// Look up the digest by Resend email ID
				const digest = await convex.query(api.journalDigests.getByResendId, {
					resendId: resendEmailId,
				});

				if (digest) {
					// Update the journal's engagement data
					await convex.mutation(api.clientJournals.recordEmailOpen, {
						journalId: digest.journalId,
					});
				}
			} catch (err) {
				console.error("Failed to update journal engagement:", err);
				// Non-fatal — webhook should still return 200
			}
		}

		return NextResponse.json({ ok: true, event: label });
	} catch (err) {
		console.error("Resend webhook error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

import { type NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { createHash } from "node:crypto";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function validateSession(request: NextRequest) {
	const sessionCookie = request.cookies.get("box-session");
	if (!sessionCookie) return null;

	const sessionCookieHash = createHash("sha256")
		.update(sessionCookie.value)
		.digest("hex");

	const sessions = await convex.query(api.boxLogSessions.findByHash, {
		tokenHash: sessionCookieHash,
	});

	if (!sessions || sessions.revokedAt || sessions.expiresAt < Date.now()) {
		return null;
	}

	return sessions;
}

export async function POST(request: NextRequest) {
	try {
		const session = await validateSession(request);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { action, eventId } = body;

		if (!action || !eventId) {
			return NextResponse.json(
				{ error: "Missing action or eventId" },
				{ status: 400 },
			);
		}

		if (action === "acknowledge") {
			await convex.mutation(api.businessLogInteractions.recordAcknowledged, {
				eventId,
				companyId: session.companyId,
				embedSessionId: session._id,
			});
		} else if (action === "open_link") {
			await convex.mutation(api.businessLogInteractions.recordAcknowledged, {
				eventId,
				companyId: session.companyId,
				embedSessionId: session._id,
			});
			// Log link opened (best-effort)
			const linkLabel = body.linkLabel || "link";
			convex
				.mutation(api.businessLogInteractions.logLinkOpened, {
					companyId: session.companyId,
					embedSessionId: session._id,
					linkLabel,
				})
				.catch(() => {});
		} else {
			return NextResponse.json({ error: "Unknown action" }, { status: 400 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[box-log/interactions] failed:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

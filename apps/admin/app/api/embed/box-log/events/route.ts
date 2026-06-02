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

	// Find session by cookie hash — query all sessions for the company
	// (In production, index by sessionCookieHash; for now, validate via token hash)
	const sessions = await convex.query(api.boxLogSessions.findByHash, {
		tokenHash: sessionCookieHash,
	});

	if (!sessions || sessions.revokedAt || sessions.expiresAt < Date.now()) {
		return null;
	}

	return sessions;
}

export async function GET(request: NextRequest) {
	try {
		const session = await validateSession(request);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const cursor = searchParams.get("cursor") ?? undefined;
		const limit = Math.min(
			Number.parseInt(searchParams.get("limit") ?? "25", 10),
			50,
		);
		const severity = searchParams.get("severity") ?? undefined;

		const result = await convex.query(api.businessLog.listClientPreview, {
			companyId: session.companyId,
			limit,
			cursor,
			severity,
		});

		// Log feed opened on first page load (no cursor)
		if (!cursor) {
			convex
				.mutation(api.businessLogInteractions.logFeedOpened, {
					companyId: session.companyId,
					embedSessionId: session._id,
				})
				.catch(() => {}); // best-effort
		}

		return NextResponse.json(result);
	} catch (error) {
		console.error("[box-log/events] failed:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

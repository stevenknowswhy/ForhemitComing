import { type NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { createHash } from "node:crypto";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const SESSION_MAX_AGE = 8 * 60 * 60; // 8 hours

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { token } = body;

		if (!token || typeof token !== "string") {
			return NextResponse.json({ error: "Missing token" }, { status: 400 });
		}

		// Hash the incoming token to match stored hash
		const tokenHash = createHash("sha256").update(token).digest("hex");

		// Find session by hash
		const session = await convex.query(api.boxLogSessions.findByHash, {
			tokenHash,
		});

		if (!session) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 404 },
			);
		}

		// Check if already exchanged (one-time use)
		if (session.exchangeCount > 0) {
			return NextResponse.json(
				{ error: "Token already used" },
				{ status: 403 },
			);
		}

		// Check expiry
		if (session.expiresAt < Date.now()) {
			return NextResponse.json({ error: "Token expired" }, { status: 403 });
		}

		// Check revocation
		if (session.revokedAt) {
			return NextResponse.json({ error: "Token revoked" }, { status: 403 });
		}

		// Generate session cookie value
		const sessionCookieValue = crypto.randomUUID();
		const sessionCookieHash = createHash("sha256")
			.update(sessionCookieValue)
			.digest("hex");

		// Mark token as exchanged
		await convex.mutation(api.boxLogSessions.markExchanged, {
			sessionId: session._id,
			sessionCookieHash,
		});

		// Set HttpOnly session cookie
		const response = NextResponse.json({ success: true });
		response.cookies.set("box-session", sessionCookieValue, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			path: "/embed",
			maxAge: SESSION_MAX_AGE,
		});

		return response;
	} catch (error) {
		console.error("[box-log/session] exchange failed:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

import { type NextRequest, NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";

export async function GET(req: NextRequest) {
	try {
		const email = req.nextUrl.searchParams.get("email");
		if (!email) {
			return NextResponse.json({ error: "Email required" }, { status: 400 });
		}

		// Get Box shared link from client_journals via Convex or hardcoded for demo
		const sharedLink = "https://app.box.com/s/y0ieus2iogburc69j7ai71tb36urb37u";

		return NextResponse.json({ sharedLink });
	} catch (err) {
		console.error("Failed to load Box link:", err);
		return NextResponse.json(
			{ error: "Failed to load Box link" },
			{ status: 500 },
		);
	}
}

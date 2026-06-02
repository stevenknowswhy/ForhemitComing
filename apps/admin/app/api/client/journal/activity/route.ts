import { type NextRequest, NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";

interface ActivityEntry {
	id: string;
	event_type: string;
	event_date: string;
	phase: string;
	title: string;
	description: string | null;
}

export async function GET(req: NextRequest) {
	try {
		const email = req.nextUrl.searchParams.get("email");
		if (!email) {
			return NextResponse.json({ error: "Email required" }, { status: 400 });
		}

		// Look up client's journal via Convex (or use hardcoded for demo)
		// For now, use Ghost directly since we have the data
		const entries = await queryGhost<ActivityEntry>(
			`SELECT id, event_type, event_date, phase, title, description
			 FROM client_activity_log
			 WHERE journal_id = $1
			 ORDER BY event_date DESC
			 LIMIT 50`,
			["pn7dr450q7zb0fj0j4jsy8shr187vaqp"], // Demo journal ID
		);

		return NextResponse.json({ entries });
	} catch (err) {
		console.error("Failed to load activity:", err);
		return NextResponse.json(
			{ error: "Failed to load activity" },
			{ status: 500 },
		);
	}
}

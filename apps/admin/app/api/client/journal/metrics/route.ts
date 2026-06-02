import { type NextRequest, NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";

export async function GET(req: NextRequest) {
	try {
		const email = req.nextUrl.searchParams.get("email");
		if (!email) {
			return NextResponse.json({ error: "Email required" }, { status: 400 });
		}

		const metrics = await queryGhost(
			`SELECT week_starting, total_entries, entries_by_theme, entries_by_effort,
			        touchpoints, milestones, active_phase, days_in_current_phase
			 FROM journal_metrics
			 WHERE journal_id = $1
			 ORDER BY week_starting DESC`,
			["pn7dr450q7zb0fj0j4jsy8shr187vaqp"],
		);

		return NextResponse.json({ metrics });
	} catch (err) {
		console.error("Failed to load metrics:", err);
		return NextResponse.json(
			{ error: "Failed to load metrics" },
			{ status: 500 },
		);
	}
}

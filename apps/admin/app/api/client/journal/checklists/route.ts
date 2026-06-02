import { type NextRequest, NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";

export async function GET(req: NextRequest) {
	try {
		const email = req.nextUrl.searchParams.get("email");
		if (!email) {
			return NextResponse.json({ error: "Email required" }, { status: 400 });
		}

		const checklists = await queryGhost(
			`SELECT id, phase, phase_name, total_tasks, completed_tasks, in_progress_tasks, tasks
			 FROM phase_checklists
			 WHERE journal_id = $1
			 ORDER BY phase`,
			["pn7dr450q7zb0fj0j4jsy8shr187vaqp"],
		);

		return NextResponse.json({ checklists });
	} catch (err) {
		console.error("Failed to load checklists:", err);
		return NextResponse.json(
			{ error: "Failed to load checklists" },
			{ status: 500 },
		);
	}
}

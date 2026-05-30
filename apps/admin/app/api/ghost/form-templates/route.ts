import { NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";

/**
 * GET /api/ghost/form-templates
 *
 * Lists all active form templates from Ghost.
 * Optional query params:
 *   ?category=<string> — filter by category
 *   ?status=<string>   — filter by status (default: all)
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const category = searchParams.get("category");
		const status = searchParams.get("status");

		const conditions: string[] = [];
		const params: unknown[] = [];
		let paramIndex = 1;

		if (category) {
			conditions.push(`category = $${paramIndex++}`);
			params.push(category);
		}
		if (status) {
			conditions.push(`status = $${paramIndex++}`);
			params.push(status);
		}

		const where =
			conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

		const rows = await queryGhost(
			`SELECT id, form_key, name, description, category, version, status, is_active, created_at, updated_at
			 FROM form_templates
			 ${where}
			 ORDER BY category, name`,
			params,
		);

		return NextResponse.json({ success: true, templates: rows });
	} catch (error) {
		console.error("Ghost form-templates GET error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}

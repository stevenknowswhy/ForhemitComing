import { NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";

/**
 * GET /api/ghost/generation-log
 *
 * Lists document generation history from Ghost.
 * Optional query params:
 *   ?templateId=<uuid> — filter by template
 *   ?limit=<number>    — max rows (default 50, max 200)
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const templateId = searchParams.get("templateId");
		const limit = Math.min(
			Number.parseInt(searchParams.get("limit") || "50"),
			200,
		);

		let rows;
		if (templateId) {
			rows = await queryGhost(
				`SELECT id, template_id, template_name, form_data, action,
				        generated_by, status, created_at
				 FROM document_generations
				 WHERE template_id = $1
				 ORDER BY created_at DESC
				 LIMIT $2`,
				[templateId, limit],
			);
		} else {
			rows = await queryGhost(
				`SELECT id, template_id, template_name, form_data, action,
				        generated_by, status, created_at
				 FROM document_generations
				 ORDER BY created_at DESC
				 LIMIT $1`,
				[limit],
			);
		}

		return NextResponse.json({ success: true, generations: rows });
	} catch (error) {
		console.error("Ghost generation-log GET error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}

/**
 * POST /api/ghost/generation-log
 *
 * Logs a document generation event to Ghost.
 * Body (JSON):
 *   { templateId, templateName, formData, action, generatedBy? }
 */
export async function POST(request: Request) {
	try {
		const body = await request.json();

		if (!body.templateId || !body.templateName || !body.formData || !body.action) {
			return NextResponse.json(
				{ success: false, error: "Missing required fields: templateId, templateName, formData, action" },
				{ status: 400 },
			);
		}

		const [row] = await queryGhost<{ id: string }>(
			`INSERT INTO document_generations (template_id, template_name, form_data, action, generated_by)
			 VALUES ($1, $2, $3, $4, $5)
			 RETURNING id`,
			[
				body.templateId,
				body.templateName,
				body.formData,
				body.action,
				body.generatedBy || "admin-ui",
			],
		);

		return NextResponse.json({ success: true, id: row.id });
	} catch (error) {
		console.error("Ghost generation-log POST error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}

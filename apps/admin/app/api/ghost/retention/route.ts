import { NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";

/**
 * GET /api/ghost/retention
 *
 * Lists retention policies and compliance events.
 * Query params:
 *   ?type=policies — return retention policies (default)
 *   ?type=events — return compliance events
 *   ?unresolved=true — only unresolved compliance events
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const type = searchParams.get("type") || "policies";

		if (type === "events") {
			const unresolved = searchParams.get("unresolved") === "true";
			const sql = unresolved
				? `SELECT * FROM compliance_events WHERE NOT resolved ORDER BY created_at DESC LIMIT 100`
				: `SELECT * FROM compliance_events ORDER BY created_at DESC LIMIT 100`;

			const events = await queryGhost(sql, []);
			return NextResponse.json({ success: true, events });
		}

		// Default: retention policies
		const policies = await queryGhost(
			`SELECT * FROM retention_policies ORDER BY document_type`,
			[],
		);

		// Check for documents approaching retention limit
		const approachingExpiry = await queryGhost<{
			document_type: string;
			count: string;
			oldest: string;
		}>(
			`SELECT
				document_type,
				COUNT(*)::text as count,
				MIN(created_at)::text as oldest
			 FROM document_audit
			 WHERE action = 'generated'
			   AND created_at < NOW() - INTERVAL '6 years'
			 GROUP BY document_type
			 ORDER BY oldest`,
			[],
		);

		return NextResponse.json({
			success: true,
			policies,
			approachingExpiry: approachingExpiry.map((r) => ({
				documentType: r.document_type,
				count: parseInt(r.count),
				oldest: r.oldest,
			})),
		});
	} catch (error) {
		console.error("Ghost retention read error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}

/**
 * PUT /api/ghost/retention
 *
 * Update a retention policy.
 */
export async function PUT(request: Request) {
	try {
		const body = await request.json();
		const { documentType, retentionDays, description, autoDelete } = body;

		if (!documentType) {
			return NextResponse.json(
				{ error: "Missing documentType" },
				{ status: 400 },
			);
		}

		const rows = await queryGhost<{ id: string }>(
			`UPDATE retention_policies
			 SET retention_days = COALESCE($2, retention_days),
			     description = COALESCE($3, description),
			     auto_delete = COALESCE($4, auto_delete),
			     updated_at = now()
			 WHERE document_type = $1
			 RETURNING id`,
			[documentType, retentionDays, description, autoDelete],
		);

		return NextResponse.json({ success: true, id: rows[0]?.id });
	} catch (error) {
		console.error("Ghost retention update error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}

import { NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";

/**
 * GET /api/ghost/audit
 *
 * Read-only audit log from Ghost.
 * Query params:
 *   ?limit=50 — max results
 *   ?action=generated — filter by action type
 *   ?companyId=<uuid> — filter by company
 *   ?days=30 — lookback window (default 90)
 *
 * POST /api/ghost/audit
 *
 * Write audit event to Ghost (called by Convex or API routes).
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "100");
		const action = searchParams.get("action");
		const companyId = searchParams.get("companyId");
		const days = parseInt(searchParams.get("days") || "90");

		let sql = `
			SELECT
				id,
				company_id,
				task_id,
				document_type,
				action,
				actor,
				metadata,
				ip_address,
				created_at
			FROM document_audit
			WHERE created_at >= NOW() - INTERVAL '${days} days'
		`;
		const params: unknown[] = [];

		if (action) {
			params.push(action);
			sql += ` AND action = $${params.length}`;
		}

		if (companyId) {
			params.push(companyId);
			sql += ` AND company_id = $${params.length}`;
		}

		sql += ` ORDER BY created_at DESC LIMIT ${Math.min(limit, 500)}`;

		const rows = await queryGhost<{
			id: string;
			company_id: string | null;
			task_id: string | null;
			document_type: string;
			action: string;
			actor: string;
			metadata: unknown;
			ip_address: string | null;
			created_at: string;
		}>(sql, params);

		// Get summary stats for the same period
		const [stats] = await queryGhost<{
			total: string;
			generated: string;
			uploaded: string;
			shared: string;
			signed: string;
			viewed: string;
			downloaded: string;
		}>(
			`SELECT
				COUNT(*)::text as total,
				COUNT(*) FILTER (WHERE action = 'generated')::text as generated,
				COUNT(*) FILTER (WHERE action = 'uploaded')::text as uploaded,
				COUNT(*) FILTER (WHERE action = 'shared')::text as shared,
				COUNT(*) FILTER (WHERE action = 'signed')::text as signed,
				COUNT(*) FILTER (WHERE action = 'viewed')::text as viewed,
				COUNT(*) FILTER (WHERE action = 'downloaded')::text as downloaded
			 FROM document_audit
			 WHERE created_at >= NOW() - INTERVAL '${days} days'`,
			[],
		);

		return NextResponse.json({
			success: true,
			stats: {
				total: parseInt(stats?.total || "0"),
				generated: parseInt(stats?.generated || "0"),
				uploaded: parseInt(stats?.uploaded || "0"),
				shared: parseInt(stats?.shared || "0"),
				signed: parseInt(stats?.signed || "0"),
				viewed: parseInt(stats?.viewed || "0"),
				downloaded: parseInt(stats?.downloaded || "0"),
			},
			events: rows,
		});
	} catch (error) {
		console.error("Ghost audit read error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const {
			companyId,
			taskId,
			documentType,
			action,
			actor,
			metadata,
			ipAddress,
		} = body;

		if (!documentType || !action || !actor) {
			return NextResponse.json(
				{ error: "Missing required fields: documentType, action, actor" },
				{ status: 400 },
			);
		}

		const rows = await queryGhost<{ id: string }>(
			`INSERT INTO document_audit (company_id, task_id, document_type, action, actor, metadata, ip_address)
			 VALUES ($1, $2, $3, $4, $5, $6, $7)
			 RETURNING id`,
			[
				companyId || null,
				taskId || null,
				documentType,
				action,
				actor,
				metadata ? JSON.stringify(metadata) : null,
				ipAddress || null,
			],
		);

		return NextResponse.json({ success: true, id: rows[0]?.id });
	} catch (error) {
		console.error("Ghost audit write error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}

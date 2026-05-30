import { NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";

export async function GET() {
	try {
		const [totalRow] = await queryGhost<{ count: string }>(
			"SELECT COUNT(*) as count FROM external_document_log",
		);

		const byType = await queryGhost<{
			document_type: string;
			count: string;
			last_generated: string;
		}>(
			`SELECT document_type, COUNT(*) as count, MAX(created_at) as last_generated
			 FROM external_document_log
			 GROUP BY document_type
			 ORDER BY count DESC`,
		);

		const [errorRow] = await queryGhost<{ count: string }>(
			"SELECT COUNT(*) as count FROM document_generation_errors",
		);

		return NextResponse.json({
			success: true,
			total: Number.parseInt(totalRow.count),
			error_count: Number.parseInt(errorRow.count),
			by_type: byType.map((r) => ({
				type: r.document_type,
				count: Number.parseInt(r.count),
				last_generated: r.last_generated,
			})),
		});
	} catch (error) {
		console.error("Ghost stats error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}

import { NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";

interface DailyVolumeRow {
	day: string;
	count: string;
}

interface TypeBreakdownRow {
	document_type: string;
	count: string;
}

interface RecentDocumentRow {
	company_name: string;
	document_type: string;
	file_name: string;
	created_at: string;
}

interface ErrorRow {
	count: string;
}

export async function GET() {
	try {
		const [totalRow, errorRow, dailyVolume, typeBreakdown, recentDocs] =
			await Promise.all([
				queryGhost<ErrorRow>(
					"SELECT COUNT(*) as count FROM external_document_log",
				),
				queryGhost<ErrorRow>(
					"SELECT COUNT(*) as count FROM document_generation_errors",
				),
				queryGhost<DailyVolumeRow>(
					`SELECT DATE(created_at) as day, COUNT(*) as count
					 FROM external_document_log
					 WHERE created_at > NOW() - INTERVAL '30 days'
					 GROUP BY DATE(created_at)
					 ORDER BY day`,
				),
				queryGhost<TypeBreakdownRow>(
					`SELECT document_type, COUNT(*) as count
					 FROM external_document_log
					 GROUP BY document_type
					 ORDER BY count DESC`,
				),
				queryGhost<RecentDocumentRow>(
					`SELECT company_name, document_type, file_name, created_at
					 FROM external_document_log
					 ORDER BY created_at DESC
					 LIMIT 8`,
				),
			]);

		return NextResponse.json({
			success: true,
			total: Number.parseInt(totalRow[0]?.count ?? "0"),
			errorCount: Number.parseInt(errorRow[0]?.count ?? "0"),
			dailyVolume: dailyVolume.map((r) => ({
				day: r.day,
				count: Number.parseInt(r.count),
			})),
			typeBreakdown: typeBreakdown.map((r) => ({
				type: r.document_type,
				count: Number.parseInt(r.count),
			})),
			recentDocs: recentDocs.map((r) => ({
				company: r.company_name,
				type: r.document_type,
				fileName: r.file_name,
				createdAt: r.created_at,
			})),
		});
	} catch (error) {
		console.error("Ghost dashboard error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}

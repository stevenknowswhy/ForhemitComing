import { NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const company = searchParams.get("company");
		const limit = Math.min(
			Number.parseInt(searchParams.get("limit") || "100"),
			500,
		);

		let rows;
		if (company) {
			rows = await queryGhost(
				`SELECT id, company_name, document_type, file_name, file_path,
				        file_size_bytes, generated_by, ref, status, metadata, created_at
				 FROM external_document_log
				 WHERE company_name = $1
				 ORDER BY created_at DESC
				 LIMIT $2`,
				[company, limit],
			);
		} else {
			rows = await queryGhost(
				`SELECT id, company_name, document_type, file_name, file_path,
				        file_size_bytes, generated_by, ref, status, metadata, created_at
				 FROM external_document_log
				 ORDER BY created_at DESC
				 LIMIT $1`,
				[limit],
			);
		}

		return NextResponse.json({ success: true, documents: rows });
	} catch (error) {
		console.error("Ghost query error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}

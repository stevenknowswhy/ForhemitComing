import { NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";
import { env } from "@/lib/env";

interface QueueTask {
	taskId: string;
	templateTitle: string;
	recipientName: string;
	recipientEmail: string;
	dealData: Record<string, string>;
	companyId?: string;
	boxFolderId?: string;
	stage?: string;
}

export async function POST(request: Request) {
	const adminToken = request.headers.get("x-admin-token");
	if (!adminToken || adminToken !== env.ADMIN_TOKEN) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();

		// Single task or batch
		const tasks: QueueTask[] = body.tasks ?? [body];

		if (tasks.length === 0) {
			return NextResponse.json({ success: true, processed: 0 });
		}

		const results = [];

		for (const task of tasks) {
			try {
				// Call generate-document for each task
				const resp = await fetch(`${getBaseUrl()}/api/generate-document`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						templateTitle: task.templateTitle,
						recipientName: task.recipientName,
						recipientEmail: task.recipientEmail,
						dealData: task.dealData,
						companyId: task.companyId,
						boxFolderId: task.boxFolderId,
						stage: task.stage,
						taskId: task.taskId,
					}),
				});

				const result = await resp.json();
				results.push({
					taskId: task.taskId,
					success: result.success,
					error: result.error,
					boxFileId: result.boxFileId,
				});
			} catch (err) {
				results.push({
					taskId: task.taskId,
					success: false,
					error: err instanceof Error ? err.message : String(err),
				});
			}
		}

		const succeeded = results.filter((r) => r.success).length;
		const failed = results.filter((r) => !r.success).length;

		return NextResponse.json({
			success: true,
			processed: results.length,
			succeeded,
			failed,
			results,
		});
	} catch (error) {
		console.error("process-queue error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}

function getBaseUrl(): string {
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5050";
}

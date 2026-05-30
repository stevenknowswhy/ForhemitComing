import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getFileSharedLink } from "@/lib/box";

/**
 * GET /api/client/documents/[fileId]/download
 *
 * Returns a Box shared link for downloading a file.
 * The client must be authenticated via Clerk.
 */
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ fileId: string }> },
) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { fileId } = await params;

		if (!fileId) {
			return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
		}

		// Get or create a shared link for this file
		const sharedLink = await getFileSharedLink(fileId);

		return NextResponse.json({
			success: true,
			fileId,
			downloadUrl: sharedLink,
		});
	} catch (error) {
		console.error("Client download error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

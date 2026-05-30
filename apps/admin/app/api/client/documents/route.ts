import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { queryGhost } from "@/lib/ghost";
import { listFolderItems } from "@/lib/box";

/**
 * GET /api/client/documents
 *
 * Lists documents in the client's Box folder.
 * Identifies the client by matching their Clerk email to company contacts.
 *
 * Optional query params:
 *   ?folderId=<id> — list a specific subfolder instead of root
 */
export async function GET(request: Request) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const requestedFolderId = searchParams.get("folderId");

		// Get the user's email from Clerk
		const { clerkClient } = await import("@clerk/nextjs/server");
		const client = await clerkClient();
		const user = await client.users.getUser(userId);
		const email = user.emailAddresses?.[0]?.emailAddress;

		if (!email) {
			return NextResponse.json(
				{ error: "No email on account" },
				{ status: 400 },
			);
		}

		// Find the company this client is associated with
		// Check seller, broker, lender, trustee, counsel contact emails
		const company = await findClientCompany(email);

		if (!company) {
			return NextResponse.json(
				{ error: "No company associated with this account", email },
				{ status: 404 },
			);
		}

		if (!company.boxFolderId) {
			return NextResponse.json(
				{ error: "No document folder configured for this company" },
				{ status: 404 },
			);
		}

		// List items in the requested folder or the company's root Box folder
		const folderId = requestedFolderId || company.boxFolderId;
		const items = await listFolderItems(folderId);

		return NextResponse.json({
			success: true,
			company: {
				name: company.name,
				ref: company.ref,
			},
			folderId,
			items: items.map((item) => ({
				id: item.id,
				type: item.type,
				name: item.name,
				size: item.size,
				modifiedAt: item.modified_at,
				extension: item.extension,
			})),
		});
	} catch (error) {
		console.error("Client documents error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

/**
 * Find the company a client user is associated with by matching their email
 * against company contact records in Ghost or Convex.
 *
 * For now, uses Ghost's deal_pipeline table which has company data.
 * Falls back to matching against the company's known contact fields.
 */
async function findClientCompany(
	email: string,
): Promise<{ name: string; ref: string; boxFolderId: string | null } | null> {
	// Try Ghost deal_pipeline first (has company data with contact info)
	try {
		const [company] = await queryGhost<{
			name: string;
			ref: string;
			box_folder_id: string | null;
		}>(
			`SELECT name, ref, box_folder_id
			 FROM deal_pipeline
			 WHERE seller_email = $1
			    OR broker_email = $1
			    OR lender_email = $1
			    OR counsel_email = $1
			 LIMIT 1`,
			[email],
		);

		if (company) {
			return {
				name: company.name,
				ref: company.ref,
				boxFolderId: company.box_folder_id,
			};
		}
	} catch {
		// Ghost query failed — table might not have email columns
	}

	// Fallback: search by company name pattern in Box root folder
	// This is a placeholder — in production, the client-to-company mapping
	// should be stored explicitly in a Convex or Ghost table.
	return null;
}

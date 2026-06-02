/**
 * Upload generated journal PDFs to Box folders.
 * Reads PDFs from tmp/journal-pdfs/ and uploads to the correct Box folders.
 *
 * Usage: npx tsx scripts/upload-journal-pdfs.ts <rootFolderId>
 */

import fs from "node:fs";
import path from "node:path";

const ROOT_FOLDER_ID = process.argv[2];
if (!ROOT_FOLDER_ID) {
	console.error("Usage: npx tsx scripts/upload-journal-pdfs.ts <rootFolderId>");
	process.exit(1);
}

// ── Box API Helpers ─────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
	const clientId = process.env.BOX_CLIENT_ID;
	const clientSecret = process.env.BOX_CLIENT_SECRET;
	const enterpriseId = process.env.BOX_ENTERPRISE_ID;

	if (!clientId || !clientSecret || !enterpriseId) {
		throw new Error(
			"Box credentials not set. Set BOX_CLIENT_ID, BOX_CLIENT_SECRET, BOX_ENTERPRISE_ID env vars.",
		);
	}

	const response = await fetch("https://api.box.com/oauth2/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "client_credentials",
			client_id: clientId,
			client_secret: clientSecret,
			box_subject_type: "enterprise",
			box_subject_id: enterpriseId,
		}),
	});

	if (!response.ok) {
		throw new Error(
			`Box OAuth failed: ${response.status} ${await response.text()}`,
		);
	}

	const data = (await response.json()) as { access_token: string };
	return data.access_token;
}

async function findFolder(
	token: string,
	parentId: string,
	name: string,
): Promise<string | null> {
	const response = await fetch(
		`https://api.box.com/2.0/folders/${parentId}/items?limit=1000&fields=id,type,name`,
		{ headers: { Authorization: `Bearer ${token}` } },
	);

	if (!response.ok) return null;

	const data = (await response.json()) as {
		entries: Array<{ id: string; type: string; name: string }>;
	};

	const match = data.entries.find(
		(e) => e.type === "folder" && e.name === name,
	);
	return match?.id ?? null;
}

async function createFolder(
	token: string,
	name: string,
	parentId: string,
): Promise<string> {
	const response = await fetch("https://api.box.com/2.0/folders", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name, parent: { id: parentId } }),
	});

	if (!response.ok) {
		throw new Error(
			`Create folder failed: ${response.status} ${await response.text()}`,
		);
	}

	const data = (await response.json()) as { id: string };
	return data.id;
}

async function getOrCreateFolder(
	token: string,
	name: string,
	parentId: string,
): Promise<string> {
	const existing = await findFolder(token, parentId, name);
	if (existing) return existing;
	return createFolder(token, name, parentId);
}

async function findFileByName(
	token: string,
	folderId: string,
	fileName: string,
): Promise<string | null> {
	const response = await fetch(
		`https://api.box.com/2.0/folders/${folderId}/items?limit=1000&fields=id,type,name`,
		{ headers: { Authorization: `Bearer ${token}` } },
	);

	if (!response.ok) return null;

	const data = (await response.json()) as {
		entries: Array<{ id: string; type: string; name: string }>;
	};

	const match = data.entries.find(
		(e) => e.type === "file" && e.name === fileName,
	);
	return match?.id ?? null;
}

async function uploadNewVersion(
	token: string,
	fileId: string,
	fileName: string,
	content: Buffer,
): Promise<{ id: string; name: string }> {
	const formData = new FormData();
	formData.append(
		"file",
		new Blob([new Uint8Array(content)], { type: "application/pdf" }),
		fileName,
	);

	const response = await fetch(
		`https://upload.box.com/api/2.0/files/${fileId}/content`,
		{
			method: "POST",
			headers: { Authorization: `Bearer ${token}` },
			body: formData,
		},
	);

	if (!response.ok) {
		throw new Error(
			`Version upload failed: ${response.status} ${await response.text()}`,
		);
	}

	const data = (await response.json()) as {
		entries: Array<{ id: string; name: string }>;
	};
	console.log(`  ♻️  Updated existing: ${fileName}`);
	return data.entries[0];
}

async function uploadFile(
	token: string,
	fileName: string,
	content: Buffer,
	folderId: string,
): Promise<{ id: string; name: string }> {
	const formData = new FormData();
	formData.append(
		"attributes",
		JSON.stringify({ name: fileName, parent: { id: folderId } }),
	);
	formData.append(
		"file",
		new Blob([new Uint8Array(content)], { type: "application/pdf" }),
		fileName,
	);

	const response = await fetch("https://upload.box.com/api/2.0/files/content", {
		method: "POST",
		headers: { Authorization: `Bearer ${token}` },
		body: formData,
	});

	if (response.status === 409) {
		const existingId = await findFileByName(token, folderId, fileName);
		if (existingId) {
			return await uploadNewVersion(token, existingId, fileName, content);
		}
	}

	if (!response.ok) {
		throw new Error(
			`Upload failed: ${response.status} ${await response.text()}`,
		);
	}

	const data = (await response.json()) as {
		entries: Array<{ id: string; name: string }>;
	};
	return data.entries[0];
}

// ── Phase Definitions ───────────────────────────────────────────────────────

const PHASES = [
	{ id: "ignition", name: "01 — Ignition (Days 1–14)" },
	{ id: "build", name: "02 — Build (Days 15–45)" },
	{ id: "validate", name: "03 — Validate (Days 46–75)" },
	{ id: "close-prep", name: "04 — Close Prep (Days 76–105)" },
	{ id: "closing", name: "05 — Closing (Days 106–120)" },
	{ id: "post-close", name: "06 — Post-Close" },
];

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
	console.log("\n📤 Uploading journal PDFs to Box...\n");

	const pdfDir = path.join(process.cwd(), "tmp", "journal-pdfs");
	if (!fs.existsSync(pdfDir)) {
		console.error("❌ No PDFs found. Run generate-journal-pdfs.ts first.");
		process.exit(1);
	}

	const token = await getAccessToken();
	console.log("  ✅ Box authentication successful\n");

	// 1. Upload Welcome PDF
	console.log("  📄 Uploading Welcome PDF...");
	const welcomeFolderId = await getOrCreateFolder(
		token,
		"00 — Welcome",
		ROOT_FOLDER_ID,
	);
	const welcomePdf = fs.readFileSync(path.join(pdfDir, "Welcome.pdf"));
	const welcomeResult = await uploadFile(
		token,
		"Welcome to Your ESOP Transition.pdf",
		welcomePdf,
		welcomeFolderId,
	);
	console.log(`  ✅ ${welcomeResult.name} (ID: ${welcomeResult.id})\n`);

	// 2. Upload Phase Checklists
	for (const phase of PHASES) {
		console.log(`  📋 Uploading ${phase.name} checklist...`);
		const phaseFolderId = await getOrCreateFolder(
			token,
			phase.name,
			ROOT_FOLDER_ID,
		);

		// Ensure Documents and Journal subfolders exist
		await getOrCreateFolder(token, "Documents", phaseFolderId);
		await getOrCreateFolder(token, "Journal", phaseFolderId);

		const checklistPath = path.join(pdfDir, `Checklist-${phase.id}.pdf`);
		if (fs.existsSync(checklistPath)) {
			const checklistPdf = fs.readFileSync(checklistPath);
			const result = await uploadFile(
				token,
				"Phase Overview & Checklist.pdf",
				checklistPdf,
				phaseFolderId,
			);
			console.log(`  ✅ ${result.name} (ID: ${result.id})`);
		} else {
			console.log(`  ⚠️  No checklist PDF found for ${phase.id}`);
		}
	}

	console.log("\n✅ All PDFs uploaded to Box!\n");
}

main().catch((err) => {
	console.error("❌ Upload failed:", err.message);
	process.exit(1);
});

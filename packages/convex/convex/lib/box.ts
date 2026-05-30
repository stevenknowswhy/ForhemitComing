/**
 * Box API Client
 *
 * OAuth 2.0 Client Credentials Grant authentication.
 * Fetches a fresh access token per action invocation (tokens valid 60 min).
 *
 * Required Convex environment variables:
 *   BOX_CLIENT_ID      — Platform App client ID
 *   BOX_CLIENT_SECRET  — Platform App client secret
 *   BOX_ENTERPRISE_ID  — Enterprise ID for CCG auth
 *   BOX_ROOT_FOLDER_ID — Root "Forhemit Deals" folder ID in Box
 */

interface TokenResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
}

interface BoxFolder {
	id: string;
	type: "folder";
	name: string;
}

interface BoxFile {
	id: string;
	type: "file";
	name: string;
}

/**
 * Get a fresh Box access token using Client Credentials Grant.
 */
async function getAccessToken(): Promise<string> {
	const clientId = process.env.BOX_CLIENT_ID;
	const clientSecret = process.env.BOX_CLIENT_SECRET;
	const enterpriseId = process.env.BOX_ENTERPRISE_ID;

	if (!clientId || !clientSecret || !enterpriseId) {
		throw new Error(
			"Box credentials not configured. Set BOX_CLIENT_ID, BOX_CLIENT_SECRET, and BOX_ENTERPRISE_ID as Convex environment variables.",
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
		const error = await response.text();
		throw new Error(`Box OAuth failed: ${response.status} ${error}`);
	}

	const data: TokenResponse = await response.json();
	return data.access_token;
}

/**
 * Generic Box API call.
 */
export async function boxFetch<T>(
	path: string,
	options: { method?: string; body?: unknown } = {},
): Promise<T> {
	const token = await getAccessToken();
	const url = `https://api.box.com/2.0${path}`;

	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
	};

	const fetchOptions: RequestInit = {
		method: options.method || "GET",
		headers,
	};

	if (options.body) {
		headers["Content-Type"] = "application/json";
		fetchOptions.body = JSON.stringify(options.body);
	}

	const response = await fetch(url, fetchOptions);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(
			`Box API ${options.method || "GET"} ${path} failed: ${response.status} ${error}`,
		);
	}

	return response.json() as Promise<T>;
}

/**
 * Create a folder in Box.
 */
export async function createFolder(
	name: string,
	parentFolderId: string,
): Promise<BoxFolder> {
	return boxFetch<BoxFolder>("/folders", {
		method: "POST",
		body: {
			name,
			parent: { id: parentFolderId },
		},
	});
}

/**
 * List items in a folder. Returns entries matching the given name, if any.
 */
export async function findFolderByName(
	parentFolderId: string,
	name: string,
): Promise<BoxFolder | null> {
	const data = await boxFetch<{
		entries: Array<{ id: string; type: string; name: string }>;
	}>(`/folders/${parentFolderId}/items?limit=1000&fields=id,type,name`);

	const match = data.entries.find(
		(e) => e.type === "folder" && e.name === name,
	);
	return match ? (match as BoxFolder) : null;
}

/**
 * Get or create a folder. Returns existing folder if one with the same name exists.
 */
export async function getOrCreateFolder(
	name: string,
	parentFolderId: string,
): Promise<BoxFolder> {
	const existing = await findFolderByName(parentFolderId, name);
	if (existing) return existing;
	return createFolder(name, parentFolderId);
}

/**
 * Upload a file to a Box folder.
 * Content is a Uint8Array (PDF bytes).
 */
export async function uploadFile(
	name: string,
	content: Uint8Array,
	parentFolderId: string,
): Promise<BoxFile> {
	const token = await getAccessToken();

	const formData = new FormData();
	formData.append(
		"attributes",
		JSON.stringify({
			name,
			parent: { id: parentFolderId },
		}),
	);
	formData.append(
		"file",
		new Blob([content.buffer as ArrayBuffer], { type: "application/pdf" }),
		name,
	);

	const response = await fetch("https://upload.box.com/api/2.0/files/content", {
		method: "POST",
		headers: { Authorization: `Bearer ${token}` },
		body: formData,
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Box upload failed: ${response.status} ${error}`);
	}

	const data = await response.json();
	const file = data.entries?.[0];
	if (!file) throw new Error("Box upload returned no file entries");

	return { id: file.id, type: "file", name: file.name };
}

/**
 * Download a file from Box. Returns the file content as Uint8Array.
 */
export async function downloadFile(fileId: string): Promise<Uint8Array> {
	const token = await getAccessToken();

	const response = await fetch(
		`https://api.box.com/2.0/files/${fileId}/content`,
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Box download failed: ${response.status} ${error}`);
	}

	const buffer = await response.arrayBuffer();
	return new Uint8Array(buffer);
}

/**
 * Get the root folder ID from environment.
 */
export function getRootFolderId(): string {
	const rootId = process.env.BOX_ROOT_FOLDER_ID;
	if (!rootId) {
		throw new Error(
			"BOX_ROOT_FOLDER_ID not configured. Set it as a Convex environment variable with the Box folder ID for 'Forhemit Deals'.",
		);
	}
	return rootId;
}

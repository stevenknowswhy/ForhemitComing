/**
 * Box API Client for Admin App
 *
 * Provides OAuth 2.0 CCG authentication and common Box operations
 * for the client portal and admin API routes.
 *
 * Required env vars:
 *   BOX_CLIENT_ID, BOX_CLIENT_SECRET, BOX_ENTERPRISE_ID, BOX_ROOT_FOLDER_ID
 */

interface TokenResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
}

interface BoxFolderItem {
	id: string;
	type: "file" | "folder" | "web_link";
	name: string;
	size?: number;
	modified_at?: string;
	created_at?: string;
	extension?: string;
}

interface BoxSharedLink {
	shared_link: {
		url: string;
		download_url: string;
		access: string;
	};
}

// ── OAuth ───────────────────────────────────────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getBoxAccessToken(): Promise<string> {
	if (cachedToken && cachedToken.expiresAt > Date.now()) {
		return cachedToken.token;
	}

	const clientId = process.env.BOX_CLIENT_ID;
	const clientSecret = process.env.BOX_CLIENT_SECRET;
	const enterpriseId = process.env.BOX_ENTERPRISE_ID;

	if (!clientId || !clientSecret || !enterpriseId) {
		throw new Error("Box credentials not configured");
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
	cachedToken = {
		token: data.access_token,
		expiresAt: Date.now() + (data.expires_in - 60) * 1000, // 60s buffer
	};
	return cachedToken.token;
}

// ── API Calls ───────────────────────────────────────────────────────────────

async function boxFetch<T>(
	path: string,
	options: { method?: string; body?: unknown } = {},
): Promise<T> {
	const token = await getBoxAccessToken();
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
 * List items in a Box folder.
 */
export async function listFolderItems(
	folderId: string,
): Promise<BoxFolderItem[]> {
	const data = await boxFetch<{
		entries: BoxFolderItem[];
	}>(
		`/folders/${folderId}/items?limit=1000&fields=id,type,name,size,modified_at,created_at,extension`,
	);
	return data.entries;
}

/**
 * Get a shared link for a file. Creates one if it doesn't exist.
 */
export async function getFileSharedLink(
	fileId: string,
): Promise<string> {
	try {
		const data = await boxFetch<BoxSharedLink>(
			`/files/${fileId}?fields=shared_link`,
		);
		if (data.shared_link?.url) {
			return data.shared_link.url;
		}
	} catch {
		// No shared link exists yet
	}

	// Create a shared link
	const data = await boxFetch<BoxSharedLink>(`/files/${fileId}`, {
		method: "PUT",
		body: {
			shared_link: {
				access: "open",
				permissions: {
					can_download: true,
					can_preview: true,
				},
			},
		},
	});

	return data.shared_link.url;
}

/**
 * Get a shared link for a folder. Creates one if it doesn't exist.
 */
export async function getFolderSharedLink(
	folderId: string,
): Promise<string> {
	try {
		const data = await boxFetch<BoxSharedLink>(
			`/folders/${folderId}?fields=shared_link`,
		);
		if (data.shared_link?.url) {
			return data.shared_link.url;
		}
	} catch {
		// No shared link exists yet
	}

	const data = await boxFetch<BoxSharedLink>(`/folders/${folderId}`, {
		method: "PUT",
		body: {
			shared_link: {
				access: "open",
				permissions: {
					can_download: true,
					can_preview: true,
				},
			},
		},
	});

	return data.shared_link.url;
}

/**
 * Get a direct download URL for a file (authenticated, expires).
 */
export async function getFileDownloadUrl(
	fileId: string,
): Promise<string> {
	const data = await boxFetch<{ download_url: string }>(
		`/files/${fileId}?fields=download_url`,
	);
	return data.download_url;
}

/**
 * Get folder info (name, parent, etc.).
 */
export async function getFolderInfo(
	folderId: string,
): Promise<{ id: string; name: string; parent?: { id: string } }> {
	return boxFetch(`/folders/${folderId}?fields=id,name,parent`);
}

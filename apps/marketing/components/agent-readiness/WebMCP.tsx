"use client";

import { useEffect } from "react";

export function WebMCP() {
	useEffect(() => {
		try {
			// Model Context Protocol — experimental browser API, no TypeScript types yet
			const nav = navigator as unknown as Record<string, unknown>;
			const api = nav.modelContext as Record<string, ((...args: unknown[]) => void) | undefined> | undefined;
			if (api?.registerTool) {
				api.registerTool({
					name: "get_page_content",
					description: "Retrieve content from Forhemit pages",
					parameters: { path: { type: "string", description: "URL path" } },
				});
				api.registerTool({
					name: "get_site_info",
					description: "Get information about Forhemit services",
					parameters: {},
				});
			}
		} catch {
			// WebMCP not available
		}
	}, []);

	return null;
}

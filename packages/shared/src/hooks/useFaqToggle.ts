"use client";

import { useState, useCallback } from "react";

/**
 * Generic FAQ accordion toggle hook.
 * Works with both numeric indices and string IDs.
 *
 * @param initialOpen - The ID/index of the initially open item, or null
 * @returns [openId, toggle] — the currently open item and the toggle function
 */
export function useFaqToggle<T extends string | number>(initialOpen: T | null = null) {
	const [openId, setOpenId] = useState<T | null>(initialOpen);

	const toggle = useCallback((id: T) => {
		setOpenId((prev) => (prev === id ? null : id));
	}, []);

	return [openId, toggle] as const;
}

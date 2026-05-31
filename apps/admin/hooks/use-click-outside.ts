"use client";

import { useEffect, type RefObject } from "react";

/**
 * Fires `handler` when a mousedown or touchstart occurs outside `ref`.
 * Safe for SSR — only attaches listeners on the client.
 */
export function useClickOutside<T extends HTMLElement>(
	ref: RefObject<T | null>,
	handler: () => void,
): void {
	useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent) => {
			const target = event.target as Node;
			if (!ref.current || ref.current.contains(target)) return;
			handler();
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, handler]);
}

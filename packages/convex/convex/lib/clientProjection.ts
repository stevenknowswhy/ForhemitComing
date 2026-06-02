import type { Doc } from "../_generated/dataModel";

export interface ClientEventProjection {
	id: string;
	occurredAt: number;
	eventType: string;
	category: string;
	severity: "info" | "warning" | "critical";
	summary: string; // always a string — never undefined
	actorLabel: string; // always a string — never undefined
	publicMetadata: Record<string, unknown> | undefined;
	links: ClientLink[];
}

export interface ClientLink {
	label: string;
	type: string;
	href?: string;
	boxFileId?: string;
}

/**
 * MANDATORY on all client/Box responses.
 * Strips internal fields — only client-safe data leaves the server.
 *
 * Runtime guard catches data written before fail-closed check existed.
 * The fallback "Your deal team completed an action." is safe, generic,
 * and never leaks internal data.
 */
export function toClientProjection(
	event: Doc<"businessLog">,
): ClientEventProjection {
	if (!event.clientSummary) {
		console.error(
			"[clientProjection] clientVisible event missing clientSummary",
			{ eventType: event.eventType, id: event._id },
		);
	}

	return {
		id: event._id,
		occurredAt: event.occurredAt,
		eventType: event.eventType,
		category: event.category,
		severity: event.severity,
		summary: event.clientSummary ?? "Your deal team completed an action.",
		actorLabel: event.clientActorLabel ?? "Forhemit Team",
		publicMetadata: event.publicMetadata as Record<string, unknown> | undefined,
		links: (event.links ?? [])
			.filter((l) => l.clientVisible)
			.map(({ label, type, href, boxFileId }) => ({
				label,
				type,
				href,
				boxFileId,
			})),
	};
}

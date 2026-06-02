import type { MutationCtx } from "../_generated/server";

/**
 * Resolves the current actor from Convex auth context.
 *
 * Policy: clientActorLabel is always "Forhemit Team".
 * Individual names are NEVER shown to clients.
 * This is enforced here, not at call sites.
 */
export async function resolveActor(ctx: MutationCtx) {
	const identity = await ctx.auth.getUserIdentity();

	if (!identity) {
		return {
			actorType: "system" as const,
			actorId: "system",
			actorLabel: "System",
			clientActorLabel: "Forhemit Team",
		};
	}

	return {
		actorType: "user" as const,
		actorId: identity.subject,
		actorLabel: identity.name ?? identity.email ?? identity.subject,
		clientActorLabel: "Forhemit Team",
	};
}

/** For agent call sites — pass explicitly */
export function agentActor(agentName: string) {
	return {
		actorType: "agent" as const,
		actorId: `agent:${agentName}`,
		actorLabel: agentName,
		clientActorLabel: "Forhemit Team",
	};
}

/** For webhook call sites — pass explicitly */
export function webhookActor(source: string) {
	return {
		actorType: "webhook" as const,
		actorId: `webhook:${source}`,
		actorLabel: source,
		clientActorLabel: "Forhemit Team",
	};
}

/** For Box webhook events — "Box" is an approved client-visible actor */
export function boxActor() {
	return {
		actorType: "box" as const,
		actorId: "box-webhook",
		actorLabel: "Box",
		clientActorLabel: "Box",
	};
}

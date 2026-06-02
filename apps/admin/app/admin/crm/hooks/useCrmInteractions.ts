"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useCallback } from "react";

export function useCrmInteractions(companyId?: Id<"crmCompanies">) {
	const interactions = useQuery(
		api.crmInteractions.listByCompany,
		companyId ? { companyId } : "skip",
	);

	const createInteraction = useMutation(api.crmInteractions.create);
	const updateInteraction = useMutation(api.crmInteractions.update);
	const deleteInteraction = useMutation(api.crmInteractions.remove);

	const logChange = useCallback(
		async (
			companyId: Id<"crmCompanies">,
			field: string,
			oldValue: string,
			newValue: string,
		) => {
			await createInteraction({
				companyId,
				date: new Date().toISOString().split("T")[0],
				type: "Note",
				summary: `Field updated: ${field} — from "${oldValue}" to "${newValue}"`,
			});
		},
		[createInteraction],
	);

	return {
		interactions,
		createInteraction,
		updateInteraction,
		deleteInteraction,
		logChange,
	};
}

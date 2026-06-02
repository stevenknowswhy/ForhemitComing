"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useCallback } from "react";
import type { CompanyFormValues } from "../lib/company-form-schema";

/**
 * Hook for creating/updating companies with their associated contacts.
 * Replaces the old createCompany/updateCompany for the new stewardship form.
 */
export function useCompanyWithContacts() {
	const createWithContacts = useMutation(
		api.crmCompaniesWithContacts.createWithContacts,
	);
	const updateWithContacts = useMutation(
		api.crmCompaniesWithContacts.updateWithContacts,
	);

	const createCompany = useCallback(
		async (data: CompanyFormValues) => {
			const {
				owners,
				broker,
				advisors,
				tags,
				primaryAssets,
				resourcesSentTo,
				referredByContactId,
				...companyFields
			} = data;

			return await createWithContacts({
				...companyFields,
				referredByContactId: referredByContactId as
					| Id<"crmContacts">
					| undefined,
				name: companyFields.name,
				stage: companyFields.stage,
				ndaStatus: companyFields.ndaStatus || "None",
				owners: owners.map((o) => ({
					firstName: o.firstName,
					lastName: o.lastName,
					phone: o.phone || undefined,
					email: o.email || undefined,
					address: o.address || undefined,
					ownershipPct: o.ownershipPct || undefined,
					roleInBusiness: o.roleInBusiness || undefined,
					linkedInUrl: o.linkedInUrl || undefined,
					preferredContact: o.preferredContact || undefined,
					birthday: o.birthday || undefined,
					spouseName: o.spouseName || undefined,
					personalInterests: o.personalInterests || undefined,
				})),
				broker:
					data.hasBroker && broker
						? {
								firstName: broker.firstName,
								lastName: broker.lastName,
								phone: broker.phone || undefined,
								email: broker.email || undefined,
								website: broker.website || undefined,
								dateMet: broker.dateMet || undefined,
								firm: broker.firm || undefined,
							}
						: undefined,
				advisors: advisors?.map((a) => ({
					firstName: a.firstName,
					lastName: a.lastName,
					phone: a.phone || undefined,
					email: a.email || undefined,
					type: a.type,
					firm: a.firm || undefined,
					relationshipStrength: a.relationshipStrength || undefined,
					advisorOpenToUs: a.advisorOpenToUs || undefined,
					date: a.date || undefined,
					notes: a.notes || undefined,
				})),
			});
		},
		[createWithContacts],
	);

	const updateCompany = useCallback(
		async (companyId: Id<"crmCompanies">, data: CompanyFormValues) => {
			const {
				owners,
				broker,
				advisors,
				tags,
				primaryAssets,
				resourcesSentTo,
				referredByContactId,
				...companyFields
			} = data;

			return await updateWithContacts({
				companyId,
				...companyFields,
				referredByContactId: referredByContactId as
					| Id<"crmContacts">
					| undefined,
				hasBroker: data.hasBroker,
				owners: owners.map((o) => ({
					contactId: o.contactId as Id<"crmContacts"> | undefined,
					firstName: o.firstName,
					lastName: o.lastName,
					phone: o.phone || undefined,
					email: o.email || undefined,
					address: o.address || undefined,
					ownershipPct: o.ownershipPct || undefined,
					roleInBusiness: o.roleInBusiness || undefined,
					linkedInUrl: o.linkedInUrl || undefined,
					preferredContact: o.preferredContact || undefined,
					birthday: o.birthday || undefined,
					spouseName: o.spouseName || undefined,
					personalInterests: o.personalInterests || undefined,
				})),
				broker:
					data.hasBroker && broker
						? {
								contactId: broker.contactId as Id<"crmContacts"> | undefined,
								firstName: broker.firstName,
								lastName: broker.lastName,
								phone: broker.phone || undefined,
								email: broker.email || undefined,
								website: broker.website || undefined,
								dateMet: broker.dateMet || undefined,
								firm: broker.firm || undefined,
							}
						: undefined,
				advisors: advisors?.map((a) => ({
					contactId: a.contactId as Id<"crmContacts"> | undefined,
					firstName: a.firstName,
					lastName: a.lastName,
					phone: a.phone || undefined,
					email: a.email || undefined,
					type: a.type,
					firm: a.firm || undefined,
					relationshipStrength: a.relationshipStrength || undefined,
					advisorOpenToUs: a.advisorOpenToUs || undefined,
					date: a.date || undefined,
					notes: a.notes || undefined,
				})),
			});
		},
		[updateWithContacts],
	);

	return { createCompany, updateCompany };
}

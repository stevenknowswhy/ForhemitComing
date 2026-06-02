import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

/**
 * Create a company with all associated contacts (owners, broker, advisors) in one transaction.
 * Returns the new company ID.
 */
export const createWithContacts = mutation({
	args: {
		// Company fields
		name: v.string(),
		stage: v.string(),
		industry: v.optional(v.string()),
		subIndustry: v.optional(v.string()),
		businessModel: v.optional(v.string()),
		yearsInBusiness: v.optional(v.number()),
		revenueRange: v.optional(v.string()),
		employeeCountRange: v.optional(v.string()),
		city: v.optional(v.string()),
		state: v.optional(v.string()),
		website: v.optional(v.string()),
		address: v.optional(v.string()),
		phone: v.optional(v.string()),
		howWeHeardAboutThem: v.optional(v.string()),
		dateFirstContact: v.optional(v.string()),
		referredByContactId: v.optional(v.id("crmContacts")),

		// Transition readiness
		transitionTimeline: v.optional(v.string()),
		targetTransitionDate: v.optional(v.string()),
		retirementGoalAge: v.optional(v.number()),
		ownerAge: v.optional(v.number()),
		primaryMotivation: v.optional(v.string()),
		motivationDetail: v.optional(v.string()),
		urgencyLevel: v.optional(v.string()),
		hasSuccessorInMind: v.optional(v.string()),
		familyInBusiness: v.optional(v.boolean()),
		familyMemberNames: v.optional(v.string()),
		identityTiedToBusiness: v.optional(v.string()),
		openToConversation: v.optional(v.string()),
		trustLevel: v.optional(v.string()),
		whatTheyCareMostAbout: v.optional(v.string()),
		dealBreakers: v.optional(v.string()),
		readinessScore: v.optional(v.number()),
		nextNurtureAction: v.optional(v.string()),
		nurtureStage: v.optional(v.string()),

		// Business snapshot
		ebitdaRange: v.optional(v.string()),
		askingPriceExpectation: v.optional(v.string()),
		ourValuationEstimate: v.optional(v.string()),
		profitability: v.optional(v.string()),
		revenueGrowthTrend: v.optional(v.string()),
		realEstateOwned: v.optional(v.boolean()),
		debtOnBusiness: v.optional(v.string()),
		ownerCompensation: v.optional(v.string()),
		businessDependentOnOwner: v.optional(v.string()),
		financialNotes: v.optional(v.string()),

		// Pipeline & nurture
		ndaStatus: v.optional(v.string()),
		estimatedCloseDate: v.optional(v.string()),
		probabilityPct: v.optional(v.number()),
		closeConfidence: v.optional(v.string()),
		whyWeWinThis: v.optional(v.string()),
		whyWeMightLose: v.optional(v.string()),
		recycleDate: v.optional(v.string()),
		recycleReason: v.optional(v.string()),
		contactFrequencyGoal: v.optional(v.string()),
		eventsAttendedTogether: v.optional(v.string()),
		referralsMadeForThem: v.optional(v.string()),

		// Notes & next steps
		notes: v.optional(v.string()),
		internalNotes: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
		nextAction: v.optional(v.string()),
		nextActionDate: v.optional(v.string()),
		reminderSet: v.optional(v.boolean()),
		reminderDate: v.optional(v.string()),

		// Contacts
		owners: v.array(
			v.object({
				firstName: v.string(),
				lastName: v.string(),
				phone: v.optional(v.string()),
				email: v.optional(v.string()),
				address: v.optional(v.string()),
				ownershipPct: v.optional(v.number()),
				roleInBusiness: v.optional(v.string()),
				linkedInUrl: v.optional(v.string()),
				preferredContact: v.optional(v.string()),
				birthday: v.optional(v.string()),
				spouseName: v.optional(v.string()),
				personalInterests: v.optional(v.array(v.string())),
			}),
		),
		broker: v.optional(
			v.object({
				firstName: v.string(),
				lastName: v.string(),
				phone: v.optional(v.string()),
				email: v.optional(v.string()),
				website: v.optional(v.string()),
				dateMet: v.optional(v.string()),
				firm: v.optional(v.string()),
			}),
		),
		advisors: v.optional(
			v.array(
				v.object({
					firstName: v.string(),
					lastName: v.string(),
					phone: v.optional(v.string()),
					email: v.optional(v.string()),
					type: v.string(),
					firm: v.optional(v.string()),
					relationshipStrength: v.optional(v.string()),
					advisorOpenToUs: v.optional(v.string()),
					date: v.optional(v.string()),
					notes: v.optional(v.string()),
				}),
			),
		),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const now = Date.now();

		// 1. Create owner contacts first (we need IDs for primaryOwnerContactId)
		const ownerContactIds = [];
		for (const owner of args.owners) {
			const contactId = await ctx.db.insert("crmContacts", {
				companyId: undefined, // will patch after company is created
				contactType: "owner",
				firstName: owner.firstName,
				lastName: owner.lastName,
				phone: owner.phone,
				email: owner.email,
				ownershipPct: owner.ownershipPct,
				roleInBusiness: owner.roleInBusiness,
				linkedInUrl: owner.linkedInUrl,
				preferredContact: owner.preferredContact,
				birthday: owner.birthday,
				spouseName: owner.spouseName,
				personalInterests: owner.personalInterests,
				createdAt: now,
				updatedAt: now,
			});
			ownerContactIds.push(contactId);
		}

		// 2. Create broker contact if provided
		let brokerContactId;
		if (args.broker) {
			brokerContactId = await ctx.db.insert("crmContacts", {
				companyId: undefined,
				contactType: "broker",
				firstName: args.broker.firstName,
				lastName: args.broker.lastName,
				phone: args.broker.phone,
				email: args.broker.email,
				firm: args.broker.firm,
				website: args.broker.website,
				dateMet: args.broker.dateMet,
				createdAt: now,
				updatedAt: now,
			});
		}

		// 3. Create advisor contacts
		const advisorContactIds = [];
		if (args.advisors) {
			for (const advisor of args.advisors) {
				const contactId = await ctx.db.insert("crmContacts", {
					companyId: undefined,
					contactType: "advisor",
					firstName: advisor.firstName,
					lastName: advisor.lastName,
					phone: advisor.phone,
					email: advisor.email,
					advisorType: advisor.type,
					firm: advisor.firm,
					relationshipStrength: advisor.relationshipStrength,
					advisorOpenToUs: advisor.advisorOpenToUs,
					dateMet: advisor.date,
					notes: advisor.notes,
					createdAt: now,
					updatedAt: now,
				});
				advisorContactIds.push(contactId);
			}
		}

		// 4. Create the company
		const { owners, broker, advisors, ...companyFields } = args;
		const companyId = await ctx.db.insert("crmCompanies", {
			...companyFields,
			stage: companyFields.stage as any,
			ndaStatus: (companyFields.ndaStatus || "None") as
				| "None"
				| "Pending"
				| "Signed",
			primaryOwnerContactId: ownerContactIds[0],
			brokerContactId,
			createdAt: now,
			updatedAt: now,
		});

		// 5. Link all contacts to the company
		for (const contactId of [...ownerContactIds, ...advisorContactIds]) {
			await ctx.db.patch(contactId, { companyId });
		}
		if (brokerContactId) {
			await ctx.db.patch(brokerContactId, { companyId });
		}

		// 6. Log the creation as an interaction
		await ctx.db.insert("crmInteractions", {
			companyId,
			date: new Date(now).toISOString().split("T")[0],
			type: "Note",
			summary: `Company created with ${owners.length} owner(s)${broker ? ", broker" : ""}${advisors ? `, ${advisors.length} advisor(s)` : ""}`,
			createdAt: now,
		});

		return companyId;
	},
});

/**
 * Update a company and its associated contacts.
 * Handles creating new contacts, updating existing ones, and removing deleted ones.
 */
export const updateWithContacts = mutation({
	args: {
		companyId: v.id("crmCompanies"),

		// Company fields (all optional for partial updates)
		name: v.optional(v.string()),
		stage: v.optional(v.string()),
		industry: v.optional(v.string()),
		subIndustry: v.optional(v.string()),
		businessModel: v.optional(v.string()),
		yearsInBusiness: v.optional(v.number()),
		revenueRange: v.optional(v.string()),
		employeeCountRange: v.optional(v.string()),
		city: v.optional(v.string()),
		state: v.optional(v.string()),
		website: v.optional(v.string()),
		address: v.optional(v.string()),
		phone: v.optional(v.string()),
		howWeHeardAboutThem: v.optional(v.string()),
		dateFirstContact: v.optional(v.string()),
		referredByContactId: v.optional(v.id("crmContacts")),
		transitionTimeline: v.optional(v.string()),
		targetTransitionDate: v.optional(v.string()),
		retirementGoalAge: v.optional(v.number()),
		ownerAge: v.optional(v.number()),
		primaryMotivation: v.optional(v.string()),
		motivationDetail: v.optional(v.string()),
		urgencyLevel: v.optional(v.string()),
		hasSuccessorInMind: v.optional(v.string()),
		familyInBusiness: v.optional(v.boolean()),
		familyMemberNames: v.optional(v.string()),
		identityTiedToBusiness: v.optional(v.string()),
		openToConversation: v.optional(v.string()),
		trustLevel: v.optional(v.string()),
		whatTheyCareMostAbout: v.optional(v.string()),
		dealBreakers: v.optional(v.string()),
		readinessScore: v.optional(v.number()),
		nextNurtureAction: v.optional(v.string()),
		nurtureStage: v.optional(v.string()),
		ebitdaRange: v.optional(v.string()),
		askingPriceExpectation: v.optional(v.string()),
		ourValuationEstimate: v.optional(v.string()),
		profitability: v.optional(v.string()),
		revenueGrowthTrend: v.optional(v.string()),
		realEstateOwned: v.optional(v.boolean()),
		debtOnBusiness: v.optional(v.string()),
		ownerCompensation: v.optional(v.string()),
		businessDependentOnOwner: v.optional(v.string()),
		financialNotes: v.optional(v.string()),
		ndaStatus: v.optional(v.string()),
		estimatedCloseDate: v.optional(v.string()),
		probabilityPct: v.optional(v.number()),
		closeConfidence: v.optional(v.string()),
		whyWeWinThis: v.optional(v.string()),
		whyWeMightLose: v.optional(v.string()),
		recycleDate: v.optional(v.string()),
		recycleReason: v.optional(v.string()),
		contactFrequencyGoal: v.optional(v.string()),
		eventsAttendedTogether: v.optional(v.string()),
		referralsMadeForThem: v.optional(v.string()),
		notes: v.optional(v.string()),
		internalNotes: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
		nextAction: v.optional(v.string()),
		nextActionDate: v.optional(v.string()),
		reminderSet: v.optional(v.boolean()),
		reminderDate: v.optional(v.string()),

		// Contact updates
		owners: v.optional(
			v.array(
				v.object({
					contactId: v.optional(v.id("crmContacts")),
					firstName: v.string(),
					lastName: v.string(),
					phone: v.optional(v.string()),
					email: v.optional(v.string()),
					address: v.optional(v.string()),
					ownershipPct: v.optional(v.number()),
					roleInBusiness: v.optional(v.string()),
					linkedInUrl: v.optional(v.string()),
					preferredContact: v.optional(v.string()),
					birthday: v.optional(v.string()),
					spouseName: v.optional(v.string()),
					personalInterests: v.optional(v.array(v.string())),
				}),
			),
		),
		broker: v.optional(
			v.object({
				contactId: v.optional(v.id("crmContacts")),
				firstName: v.string(),
				lastName: v.string(),
				phone: v.optional(v.string()),
				email: v.optional(v.string()),
				website: v.optional(v.string()),
				dateMet: v.optional(v.string()),
				firm: v.optional(v.string()),
			}),
		),
		hasBroker: v.optional(v.boolean()),
		advisors: v.optional(
			v.array(
				v.object({
					contactId: v.optional(v.id("crmContacts")),
					firstName: v.string(),
					lastName: v.string(),
					phone: v.optional(v.string()),
					email: v.optional(v.string()),
					type: v.string(),
					firm: v.optional(v.string()),
					relationshipStrength: v.optional(v.string()),
					advisorOpenToUs: v.optional(v.string()),
					date: v.optional(v.string()),
					notes: v.optional(v.string()),
				}),
			),
		),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const now = Date.now();
		const { companyId, owners, broker, hasBroker, advisors, ...companyFields } =
			args;

		// 1. Update company fields
		const updateData: Record<string, unknown> = { updatedAt: now };
		for (const [key, value] of Object.entries(companyFields)) {
			if (value !== undefined) {
				updateData[key] = value;
			}
		}
		await ctx.db.patch(companyId, updateData);

		// 2. Update/create owner contacts
		if (owners) {
			for (const owner of owners) {
				const ownerData = {
					companyId,
					contactType: "owner" as const,
					firstName: owner.firstName,
					lastName: owner.lastName,
					phone: owner.phone,
					email: owner.email,
					address: owner.address,
					ownershipPct: owner.ownershipPct,
					roleInBusiness: owner.roleInBusiness,
					linkedInUrl: owner.linkedInUrl,
					preferredContact: owner.preferredContact,
					birthday: owner.birthday,
					spouseName: owner.spouseName,
					personalInterests: owner.personalInterests,
					updatedAt: now,
				};

				if (owner.contactId) {
					await ctx.db.patch(owner.contactId, ownerData);
				} else {
					const newId = await ctx.db.insert("crmContacts", {
						...ownerData,
						createdAt: now,
					});
					// Set as primary owner if first owner
					if (owners.indexOf(owner) === 0) {
						await ctx.db.patch(companyId, { primaryOwnerContactId: newId });
					}
				}
			}
		}

		// 3. Update/create broker contact
		if (broker) {
			const brokerData = {
				companyId,
				contactType: "broker" as const,
				firstName: broker.firstName,
				lastName: broker.lastName,
				phone: broker.phone,
				email: broker.email,
				brokerFirm: broker.firm,
				brokerWebsite: broker.website,
				dateMet: broker.dateMet,
				updatedAt: now,
			};

			if (broker.contactId) {
				await ctx.db.patch(broker.contactId, brokerData);
			} else {
				const newId = await ctx.db.insert("crmContacts", {
					...brokerData,
					createdAt: now,
				});
				await ctx.db.patch(companyId, { brokerContactId: newId });
			}
		} else if (hasBroker === false) {
			// Broker was removed
			await ctx.db.patch(companyId, { brokerContactId: undefined });
		}

		// 4. Update/create advisor contacts
		if (advisors) {
			for (const advisor of advisors) {
				const advisorData = {
					companyId,
					contactType: "advisor" as const,
					firstName: advisor.firstName,
					lastName: advisor.lastName,
					phone: advisor.phone,
					email: advisor.email,
					advisorType: advisor.type,
					advisorFirm: advisor.firm,
					relationshipStrength: advisor.relationshipStrength,
					advisorOpenToUs: advisor.advisorOpenToUs,
					dateMet: advisor.date,
					notes: advisor.notes,
					updatedAt: now,
				};

				if (advisor.contactId) {
					await ctx.db.patch(advisor.contactId, advisorData);
				} else {
					await ctx.db.insert("crmContacts", {
						...advisorData,
						createdAt: now,
					});
				}
			}
		}

		return companyId;
	},
});

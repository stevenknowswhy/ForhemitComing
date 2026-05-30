/**
 * Box.com + Box Sign Integration
 *
 * Manages deal folder structure and document lifecycle in Box.
 * Each deal (crmCompanies row) gets a Box folder with stage subfolders.
 *
 * Prerequisites (Convex env vars):
 *   BOX_CLIENT_ID, BOX_CLIENT_SECRET, BOX_ENTERPRISE_ID, BOX_ROOT_FOLDER_ID
 */

import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import {
	getOrCreateFolder,
	uploadFile,
	downloadFile,
	getRootFolderId,
} from "./lib/box";
import type { Id } from "./_generated/dataModel";

// Stage folder names — mirror the pipeline
const STAGE_FOLDERS = [
	"01-first-touch",
	"02-qualification",
	"03-engagement",
	"04-diligence",
	"05-closing",
	"06-post-close",
];

// ============================================
// ensureDealFolders — create Box folder hierarchy for a deal
// ============================================

export const ensureDealFolders = action({
	args: {
		companyId: v.id("crmCompanies"),
	},
	handler: async (ctx, args): Promise<{ folderId: string; created: boolean }> => {
		// Check if already provisioned
		const company = await ctx.runQuery(api.box.getCompanyBoxInfo, {
			companyId: args.companyId,
		});

		if (company?.boxFolderId) {
			return { folderId: company.boxFolderId, created: false };
		}

		if (!company) {
			throw new Error(`Company ${args.companyId} not found`);
		}

		const rootFolderId = getRootFolderId();
		const dealFolderName = company.ref
			? `${company.name} (${company.ref})`
			: company.name;

		// Create deal folder under root
		const dealFolder = await getOrCreateFolder(dealFolderName, rootFolderId);

		// Create stage subfolders
		for (const stage of STAGE_FOLDERS) {
			await getOrCreateFolder(stage, dealFolder.id);
		}

		// Store the folder ID on the company
		await ctx.runMutation(api.box.setCompanyBoxFolderId, {
			companyId: args.companyId,
			boxFolderId: dealFolder.id,
		});

		return { folderId: dealFolder.id, created: true };
	},
});

// ============================================
// uploadDealDocument — upload a PDF to a deal's stage folder
// ============================================

export const uploadDealDocument = action({
	args: {
		companyId: v.id("crmCompanies"),
		stage: v.string(),
		fileName: v.string(),
		// Content passed as base64 to avoid binary encoding issues in Convex args
		contentBase64: v.string(),
	},
	handler: async (
		ctx,
		args,
	): Promise<{ fileId: string; fileName: string }> => {
		const company = await ctx.runQuery(api.box.getCompanyBoxInfo, {
			companyId: args.companyId,
		});

		if (!company?.boxFolderId) {
			throw new Error(
				`Company ${args.companyId} has no Box folder. Call ensureDealFolders first.`,
			);
		}

		// Find the stage subfolder
		const stageFolderName = STAGE_FOLDERS.find((s) =>
			s.includes(args.stage),
		) || args.stage;

		const { getOrCreateFolder: findOrCreate } = await import("./lib/box");
		const stageFolder = await findOrCreate(
			stageFolderName,
			company.boxFolderId,
		);

		// Decode base64 content
		const binaryString = atob(args.contentBase64);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}

		const file = await uploadFile(args.fileName, bytes, stageFolder.id);
		return { fileId: file.id, fileName: file.name };
	},
});

// ============================================
// getSignStatus — check status of a Box Sign request
// ============================================

export const getSignStatus = action({
	args: {
		boxSignRequestId: v.string(),
	},
	handler: async (
		_ctx,
		args,
	): Promise<{
		status: string;
		sign_files?: { files: Array<{ id: string; name: string }> };
	}> => {
		const { boxFetch } = await import("./lib/box");
		return boxFetch(`/sign_requests/${args.boxSignRequestId}`);
	},
});

// ============================================
// createSignRequest — send a document for Box Sign
// ============================================

export const createSignRequest = action({
	args: {
		companyId: v.id("crmCompanies"),
		boxFileId: v.string(),
		signerEmail: v.string(),
		signerName: v.string(),
		emailSubject: v.optional(v.string()),
		emailMessage: v.optional(v.string()),
		daysValid: v.optional(v.number()),
	},
	handler: async (
		ctx,
		args,
	): Promise<{ signRequestId: string; status: string }> => {
		const company = await ctx.runQuery(api.box.getCompanyBoxInfo, {
			companyId: args.companyId,
		});

		if (!company?.boxFolderId) {
			throw new Error(
				`Company ${args.companyId} has no Box folder. Call ensureDealFolders first.`,
			);
		}

		// Signed docs go to the current stage folder (or root if unknown)
		const parentFolderId = company.boxFolderId;

		const { boxFetch } = await import("./lib/box");

		interface SignRequestResponse {
			id: string;
			status: string;
		}

		const result = await boxFetch<SignRequestResponse>("/sign_requests", {
			method: "POST",
			body: {
				signers: [
					{
						role: "signer",
						email: args.signerEmail,
						name: args.signerName,
					},
				],
				source_files: [
					{
						type: "file",
						id: args.boxFileId,
					},
				],
				parent_folder: {
					type: "folder",
					id: parentFolderId,
				},
				...(args.emailSubject && { email_subject: args.emailSubject }),
				...(args.emailMessage && { email_message: args.emailMessage }),
				...(args.daysValid && { days_valid: args.daysValid }),
				are_text_signatures_enabled: true,
			},
		});

		// Store sign request ID on workflow task if one exists for this company + file
		await ctx.runMutation(api.box.updateCompanySignStatus, {
			companyId: args.companyId,
			boxSignRequestId: result.id,
			boxSignStatus: result.status,
		});

		return { signRequestId: result.id, status: result.status };
	},
});

// ============================================
// Queries — read-side helpers
// ============================================

export const getCompanyBoxInfo = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		const company = await ctx.db.get(args.companyId);
		if (!company) return null;
		return {
			name: company.name,
			ref: company.ref,
			boxFolderId: company.boxFolderId,
		};
	},
});

// ============================================
// Mutations — write-side helpers
// ============================================

export const setCompanyBoxFolderId = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		boxFolderId: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.companyId, {
			boxFolderId: args.boxFolderId,
			updatedAt: Date.now(),
		});
	},
});

export const updateCompanySignStatus = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		boxSignRequestId: v.string(),
		boxSignStatus: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.companyId, {
			boxSignRequestId: args.boxSignRequestId,
			boxSignStatus: args.boxSignStatus,
			updatedAt: Date.now(),
		});
	},
});

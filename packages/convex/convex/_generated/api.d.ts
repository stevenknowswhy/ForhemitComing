/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agentOutputs from "../agentOutputs.js";
import type * as agentQueue from "../agentQueue.js";
import type * as agentQueueConfig from "../agentQueueConfig.js";
import type * as agentQueueHelpers from "../agentQueueHelpers.js";
import type * as auditLogs from "../auditLogs.js";
import type * as authEmails from "../authEmails.js";
import type * as box from "../box.js";
import type * as boxLogSessions from "../boxLogSessions.js";
import type * as brokerEmails from "../brokerEmails.js";
import type * as businessLog from "../businessLog.js";
import type * as businessLogInteractions from "../businessLogInteractions.js";
import type * as clientEmails from "../clientEmails.js";
import type * as clientJournals from "../clientJournals.js";
import type * as companyFinancials from "../companyFinancials.js";
import type * as contactSubmissions from "../contactSubmissions.js";
import type * as crm_companies_index from "../crm/companies/index.js";
import type * as crm_companies_mutations from "../crm/companies/mutations.js";
import type * as crm_companies_queries from "../crm/companies/queries.js";
import type * as crm_companies_validators from "../crm/companies/validators.js";
import type * as crmActivities from "../crmActivities.js";
import type * as crmCompanies from "../crmCompanies.js";
import type * as crmCompaniesWithContacts from "../crmCompaniesWithContacts.js";
import type * as crmContacts from "../crmContacts.js";
import type * as crmDocuments from "../crmDocuments.js";
import type * as crmInteractions from "../crmInteractions.js";
import type * as crmTasks from "../crmTasks.js";
import type * as cronJobs from "../cronJobs.js";
import type * as crons from "../crons.js";
import type * as dealDocuments from "../dealDocuments.js";
import type * as dealEngine from "../dealEngine.js";
import type * as dealTracker from "../dealTracker.js";
import type * as dealTrackerChart from "../dealTrackerChart.js";
import type * as documentAudit from "../documentAudit.js";
import type * as earlyAccessSignups from "../earlyAccessSignups.js";
import type * as emailCore from "../emailCore.js";
import type * as emailEvents from "../emailEvents.js";
import type * as emails from "../emails.js";
import type * as feeCalculator from "../feeCalculator.js";
import type * as formSubmissions from "../formSubmissions.js";
import type * as gates from "../gates.js";
import type * as http from "../http.js";
import type * as jobApplications from "../jobApplications.js";
import type * as journalBox from "../journalBox.js";
import type * as journalChapters from "../journalChapters.js";
import type * as journalDigests from "../journalDigests.js";
import type * as journalEntries from "../journalEntries.js";
import type * as journalNarratives from "../journalNarratives.js";
import type * as journalPdf from "../journalPdf.js";
import type * as journalSeed from "../journalSeed.js";
import type * as lib_box from "../lib/box.js";
import type * as lib_clientProjection from "../lib/clientProjection.js";
import type * as lib_correlationId from "../lib/correlationId.js";
import type * as lib_dealTrackerSeed from "../lib/dealTrackerSeed.js";
import type * as lib_logEvent from "../lib/logEvent.js";
import type * as lib_requireAdmin from "../lib/requireAdmin.js";
import type * as lib_requireAuth from "../lib/requireAuth.js";
import type * as lib_resolveActor from "../lib/resolveActor.js";
import type * as migrateTemplateContent from "../migrateTemplateContent.js";
import type * as migrations_backfillClientSummary from "../migrations/backfillClientSummary.js";
import type * as migrations_crmRefocus from "../migrations/crmRefocus.js";
import type * as notes from "../notes.js";
import type * as notifications from "../notifications.js";
import type * as phoneMessages from "../phoneMessages.js";
import type * as pipelinePhases from "../pipelinePhases.js";
import type * as posts from "../posts.js";
import type * as seed from "../seed.js";
import type * as seedStageRequirements from "../seedStageRequirements.js";
import type * as stages from "../stages.js";
import type * as testBusinessLog from "../testBusinessLog.js";
import type * as triggers from "../triggers.js";
import type * as workflowService from "../workflowService.js";
import type * as workflowTasks from "../workflowTasks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agentOutputs: typeof agentOutputs;
  agentQueue: typeof agentQueue;
  agentQueueConfig: typeof agentQueueConfig;
  agentQueueHelpers: typeof agentQueueHelpers;
  auditLogs: typeof auditLogs;
  authEmails: typeof authEmails;
  box: typeof box;
  boxLogSessions: typeof boxLogSessions;
  brokerEmails: typeof brokerEmails;
  businessLog: typeof businessLog;
  businessLogInteractions: typeof businessLogInteractions;
  clientEmails: typeof clientEmails;
  clientJournals: typeof clientJournals;
  companyFinancials: typeof companyFinancials;
  contactSubmissions: typeof contactSubmissions;
  "crm/companies/index": typeof crm_companies_index;
  "crm/companies/mutations": typeof crm_companies_mutations;
  "crm/companies/queries": typeof crm_companies_queries;
  "crm/companies/validators": typeof crm_companies_validators;
  crmActivities: typeof crmActivities;
  crmCompanies: typeof crmCompanies;
  crmCompaniesWithContacts: typeof crmCompaniesWithContacts;
  crmContacts: typeof crmContacts;
  crmDocuments: typeof crmDocuments;
  crmInteractions: typeof crmInteractions;
  crmTasks: typeof crmTasks;
  cronJobs: typeof cronJobs;
  crons: typeof crons;
  dealDocuments: typeof dealDocuments;
  dealEngine: typeof dealEngine;
  dealTracker: typeof dealTracker;
  dealTrackerChart: typeof dealTrackerChart;
  documentAudit: typeof documentAudit;
  earlyAccessSignups: typeof earlyAccessSignups;
  emailCore: typeof emailCore;
  emailEvents: typeof emailEvents;
  emails: typeof emails;
  feeCalculator: typeof feeCalculator;
  formSubmissions: typeof formSubmissions;
  gates: typeof gates;
  http: typeof http;
  jobApplications: typeof jobApplications;
  journalBox: typeof journalBox;
  journalChapters: typeof journalChapters;
  journalDigests: typeof journalDigests;
  journalEntries: typeof journalEntries;
  journalNarratives: typeof journalNarratives;
  journalPdf: typeof journalPdf;
  journalSeed: typeof journalSeed;
  "lib/box": typeof lib_box;
  "lib/clientProjection": typeof lib_clientProjection;
  "lib/correlationId": typeof lib_correlationId;
  "lib/dealTrackerSeed": typeof lib_dealTrackerSeed;
  "lib/logEvent": typeof lib_logEvent;
  "lib/requireAdmin": typeof lib_requireAdmin;
  "lib/requireAuth": typeof lib_requireAuth;
  "lib/resolveActor": typeof lib_resolveActor;
  migrateTemplateContent: typeof migrateTemplateContent;
  "migrations/backfillClientSummary": typeof migrations_backfillClientSummary;
  "migrations/crmRefocus": typeof migrations_crmRefocus;
  notes: typeof notes;
  notifications: typeof notifications;
  phoneMessages: typeof phoneMessages;
  pipelinePhases: typeof pipelinePhases;
  posts: typeof posts;
  seed: typeof seed;
  seedStageRequirements: typeof seedStageRequirements;
  stages: typeof stages;
  testBusinessLog: typeof testBusinessLog;
  triggers: typeof triggers;
  workflowService: typeof workflowService;
  workflowTasks: typeof workflowTasks;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

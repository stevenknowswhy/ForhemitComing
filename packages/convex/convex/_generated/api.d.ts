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
import type * as brokerEmails from "../brokerEmails.js";
import type * as companyFinancials from "../companyFinancials.js";
import type * as contactSubmissions from "../contactSubmissions.js";
import type * as crm_companies_index from "../crm/companies/index.js";
import type * as crm_companies_mutations from "../crm/companies/mutations.js";
import type * as crm_companies_queries from "../crm/companies/queries.js";
import type * as crm_companies_validators from "../crm/companies/validators.js";
import type * as crmActivities from "../crmActivities.js";
import type * as crmCompanies from "../crmCompanies.js";
import type * as crmContacts from "../crmContacts.js";
import type * as crmTasks from "../crmTasks.js";
import type * as cronJobs from "../cronJobs.js";
import type * as crons from "../crons.js";
import type * as dealDocuments from "../dealDocuments.js";
import type * as dealEngine from "../dealEngine.js";
import type * as dealProcessor from "../dealProcessor.js";
import type * as documentPipeline from "../documentPipeline.js";
import type * as documentTemplates from "../documentTemplates.js";
import type * as earlyAccessSignups from "../earlyAccessSignups.js";
import type * as emailCore from "../emailCore.js";
import type * as emailEvents from "../emailEvents.js";
import type * as emails from "../emails.js";
import type * as externalDocuments from "../externalDocuments.js";
import type * as feeCalculator from "../feeCalculator.js";
import type * as formSubmissions from "../formSubmissions.js";
import type * as gates from "../gates.js";
import type * as generatedDocuments from "../generatedDocuments.js";
import type * as http from "../http.js";
import type * as jobApplications from "../jobApplications.js";
import type * as lib_box from "../lib/box.js";
import type * as lib_requireAdmin from "../lib/requireAdmin.js";
import type * as lib_requireAuth from "../lib/requireAuth.js";
import type * as lib_templateContent from "../lib/templateContent.js";
import type * as migrateTemplateContent from "../migrateTemplateContent.js";
import type * as notes from "../notes.js";
import type * as notifications from "../notifications.js";
import type * as pdfGenerator from "../pdfGenerator.js";
import type * as phoneMessages from "../phoneMessages.js";
import type * as posts from "../posts.js";
import type * as seed from "../seed.js";
import type * as seedStageRequirements from "../seedStageRequirements.js";
import type * as seedTemplates from "../seedTemplates.js";
import type * as stages from "../stages.js";
import type * as templateEmailer from "../templateEmailer.js";
import type * as templateGenerator from "../templateGenerator.js";
import type * as templateRenderer from "../templateRenderer.js";
import type * as templateRules from "../templateRules.js";
import type * as templates from "../templates.js";
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
  brokerEmails: typeof brokerEmails;
  companyFinancials: typeof companyFinancials;
  contactSubmissions: typeof contactSubmissions;
  "crm/companies/index": typeof crm_companies_index;
  "crm/companies/mutations": typeof crm_companies_mutations;
  "crm/companies/queries": typeof crm_companies_queries;
  "crm/companies/validators": typeof crm_companies_validators;
  crmActivities: typeof crmActivities;
  crmCompanies: typeof crmCompanies;
  crmContacts: typeof crmContacts;
  crmTasks: typeof crmTasks;
  cronJobs: typeof cronJobs;
  crons: typeof crons;
  dealDocuments: typeof dealDocuments;
  dealEngine: typeof dealEngine;
  dealProcessor: typeof dealProcessor;
  documentPipeline: typeof documentPipeline;
  documentTemplates: typeof documentTemplates;
  earlyAccessSignups: typeof earlyAccessSignups;
  emailCore: typeof emailCore;
  emailEvents: typeof emailEvents;
  emails: typeof emails;
  externalDocuments: typeof externalDocuments;
  feeCalculator: typeof feeCalculator;
  formSubmissions: typeof formSubmissions;
  gates: typeof gates;
  generatedDocuments: typeof generatedDocuments;
  http: typeof http;
  jobApplications: typeof jobApplications;
  "lib/box": typeof lib_box;
  "lib/requireAdmin": typeof lib_requireAdmin;
  "lib/requireAuth": typeof lib_requireAuth;
  "lib/templateContent": typeof lib_templateContent;
  migrateTemplateContent: typeof migrateTemplateContent;
  notes: typeof notes;
  notifications: typeof notifications;
  pdfGenerator: typeof pdfGenerator;
  phoneMessages: typeof phoneMessages;
  posts: typeof posts;
  seed: typeof seed;
  seedStageRequirements: typeof seedStageRequirements;
  seedTemplates: typeof seedTemplates;
  stages: typeof stages;
  templateEmailer: typeof templateEmailer;
  templateGenerator: typeof templateGenerator;
  templateRenderer: typeof templateRenderer;
  templateRules: typeof templateRules;
  templates: typeof templates;
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

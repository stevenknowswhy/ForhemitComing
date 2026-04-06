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
import type * as auditLogs from "../auditLogs.js";
import type * as companyFinancials from "../companyFinancials.js";
import type * as contactSubmissions from "../contactSubmissions.js";
import type * as crmActivities from "../crmActivities.js";
import type * as crmCompanies from "../crmCompanies.js";
import type * as crmContacts from "../crmContacts.js";
import type * as crmTasks from "../crmTasks.js";
import type * as dealDocuments from "../dealDocuments.js";
import type * as documentTemplates from "../documentTemplates.js";
import type * as earlyAccessSignups from "../earlyAccessSignups.js";
import type * as emails from "../emails.js";
import type * as generatedDocuments from "../generatedDocuments.js";
import type * as jobApplications from "../jobApplications.js";
import type * as lib_requireAdmin from "../lib/requireAdmin.js";
import type * as phoneMessages from "../phoneMessages.js";
import type * as posts from "../posts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agentOutputs: typeof agentOutputs;
  agentQueue: typeof agentQueue;
  auditLogs: typeof auditLogs;
  companyFinancials: typeof companyFinancials;
  contactSubmissions: typeof contactSubmissions;
  crmActivities: typeof crmActivities;
  crmCompanies: typeof crmCompanies;
  crmContacts: typeof crmContacts;
  crmTasks: typeof crmTasks;
  dealDocuments: typeof dealDocuments;
  documentTemplates: typeof documentTemplates;
  earlyAccessSignups: typeof earlyAccessSignups;
  emails: typeof emails;
  generatedDocuments: typeof generatedDocuments;
  jobApplications: typeof jobApplications;
  "lib/requireAdmin": typeof lib_requireAdmin;
  phoneMessages: typeof phoneMessages;
  posts: typeof posts;
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

import { v } from "convex/values";
import { query } from "./_generated/server";
import { get } from "./crm/companies/queries";
import { create, update, remove } from "./crm/companies/mutations";

// CRM Companies Queries
export { list, get, getByStage, getStats, getWithUpcomingTasks } from "./crm/companies/queries";

// CRM Companies Mutations
export { create, update, remove } from "./crm/companies/mutations";
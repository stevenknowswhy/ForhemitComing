import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useCallback } from "react";
import { ActivityFormData } from "../types";

// ============================================
// CRM Activities Hook
// ============================================

interface UseCrmActivitiesOptions {
  companyId?: Id<"crmCompanies"> | null;
  limit?: number;
}

interface UseCrmActivitiesReturn {
  activities: Doc<"crmActivities">[] | undefined;
  isLoading: boolean;
  createActivity: (data: ActivityFormData) => Promise<Id<"crmActivities">>;
  updateActivity: (id: Id<"crmActivities">, data: Partial<ActivityFormData>) => Promise<Id<"crmActivities">>;
  deleteActivity: (id: Id<"crmActivities">) => Promise<{ success: boolean }>;
  logNote: (companyId: Id<"crmCompanies">, note: string) => Promise<Id<"crmActivities">>;
}

export function useCrmActivities(options: UseCrmActivitiesOptions = {}): UseCrmActivitiesReturn {
  const { companyId, limit } = options;

  // Query activities
  const activities = useQuery(
    api.crmActivities.listByCompany,
    companyId ? { companyId, limit } : "skip"
  );

  // Mutations
  const createMutation = useMutation(api.crmActivities.create);
  const updateMutation = useMutation(api.crmActivities.update);
  const deleteMutation = useMutation(api.crmActivities.remove);
  const logNoteMutation = useMutation(api.crmActivities.logNote);

  // Create activity handler
  const createActivity = useCallback(
    async (data: ActivityFormData): Promise<Id<"crmActivities">> => {
      return await createMutation({
        companyId: data.companyId as Id<"crmCompanies">,
        type: data.type,
        title: data.title,
        description: data.description,
        date: data.date,
        performedBy: data.performedBy,
      });
    },
    [createMutation]
  );

  // Update activity handler
  const updateActivity = useCallback(
    async (id: Id<"crmActivities">, data: Partial<ActivityFormData>): Promise<Id<"crmActivities">> => {
      return await updateMutation({
        id,
        title: data.title,
        description: data.description,
        date: data.date,
        performedBy: data.performedBy,
      });
    },
    [updateMutation]
  );

  // Delete activity handler
  const deleteActivity = useCallback(
    async (id: Id<"crmActivities">): Promise<{ success: boolean }> => {
      return await deleteMutation({ id });
    },
    [deleteMutation]
  );

  // Log quick note handler
  const logNote = useCallback(
    async (companyId: Id<"crmCompanies">, note: string): Promise<Id<"crmActivities">> => {
      return await logNoteMutation({
        companyId,
        note,
      });
    },
    [logNoteMutation]
  );

  return {
    activities,
    isLoading: activities === undefined && companyId !== undefined,
    createActivity,
    updateActivity,
    deleteActivity,
    logNote,
  };
}

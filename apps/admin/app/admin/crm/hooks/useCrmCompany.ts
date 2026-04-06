import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useCallback } from "react";
import { CompanyFormData } from "../types";

// ============================================
// Single CRM Company Hook
// ============================================

interface CompanyWithRelations {
  company: Doc<"crmCompanies">;
  contacts: Doc<"crmContacts">[];
  activities: Doc<"crmActivities">[];
  tasks: Doc<"crmTasks">[];
}

interface UseCrmCompanyReturn {
  data: CompanyWithRelations | null | undefined;
  isLoading: boolean;
  update: (data: Partial<CompanyFormData>) => Promise<Id<"crmCompanies">>;
  remove: () => Promise<{ success: boolean }>;
}

export function useCrmCompany(id: Id<"crmCompanies"> | null): UseCrmCompanyReturn {
  // Query company with relations
  const data = useQuery(
    api.crmCompanies.get,
    id ? { id } : "skip"
  );

  // Mutations
  const updateMutation = useMutation(api.crmCompanies.update);
  const deleteMutation = useMutation(api.crmCompanies.remove);

  // Update handler
  const update = useCallback(
    async (formData: Partial<CompanyFormData>): Promise<Id<"crmCompanies">> => {
      if (!id) throw new Error("Company ID is required");
      return await updateMutation({
        id,
        ...formData,
      });
    },
    [id, updateMutation]
  );

  // Delete handler
  const remove = useCallback(async (): Promise<{ success: boolean }> => {
    if (!id) throw new Error("Company ID is required");
    return await deleteMutation({ id });
  }, [id, deleteMutation]);

  return {
    data: data || undefined,
    isLoading: data === undefined && id !== null,
    update,
    remove,
  };
}

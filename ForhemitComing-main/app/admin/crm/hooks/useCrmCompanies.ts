import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCallback, useMemo } from "react";
import { Company, CompanyFilters, SortConfig, CompanyFormData } from "../types";
import { filterCompanies, sortCompanies } from "../lib";

// ============================================
// CRM Companies Hook
// ============================================

interface UseCrmCompaniesOptions {
  filters?: CompanyFilters;
  sort?: SortConfig;
}

interface UseCrmCompaniesReturn {
  companies: Company[] | undefined;
  isLoading: boolean;
  error: Error | null;
  createCompany: (data: CompanyFormData) => Promise<Id<"crmCompanies">>;
  updateCompany: (id: Id<"crmCompanies">, data: Partial<CompanyFormData>) => Promise<Id<"crmCompanies">>;
  deleteCompany: (id: Id<"crmCompanies">) => Promise<{ success: boolean }>;
  filteredCompanies: Company[];
}

export function useCrmCompanies(options: UseCrmCompaniesOptions = {}): UseCrmCompaniesReturn {
  const { filters, sort } = options;

  // Query all companies
  const companies = useQuery(api.crmCompanies.list);

  // Mutations
  const createMutation = useMutation(api.crmCompanies.create);
  const updateMutation = useMutation(api.crmCompanies.update);
  const deleteMutation = useMutation(api.crmCompanies.remove);

  // Apply filters and sorting
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];

    let result = [...companies];

    if (filters) {
      result = filterCompanies(result, filters);
    }

    if (sort) {
      result = sortCompanies(result, sort);
    }

    return result;
  }, [companies, filters, sort]);

  // Create company handler
  const createCompany = useCallback(
    async (data: CompanyFormData): Promise<Id<"crmCompanies">> => {
      return await createMutation({
        name: data.name,
        industry: data.industry,
        size: data.size,
        revenue: data.revenue,
        website: data.website,
        address: data.address,
        stage: data.stage,
        ndaStatus: data.ndaStatus,
        advisor: data.advisor,
        referralSource: data.referralSource,
        lastContactDate: data.lastContactDate,
        nextStep: data.nextStep,
        nextStepDate: data.nextStepDate,
        expectedCloseDate: data.expectedCloseDate,
        notes: data.notes,
      });
    },
    [createMutation]
  );

  // Update company handler
  const updateCompany = useCallback(
    async (
      id: Id<"crmCompanies">,
      data: Partial<CompanyFormData>
    ): Promise<Id<"crmCompanies">> => {
      return await updateMutation({
        id,
        ...data,
      });
    },
    [updateMutation]
  );

  // Delete company handler
  const deleteCompany = useCallback(
    async (id: Id<"crmCompanies">): Promise<{ success: boolean }> => {
      return await deleteMutation({ id });
    },
    [deleteMutation]
  );

  return {
    companies,
    isLoading: companies === undefined,
    error: null,
    createCompany,
    updateCompany,
    deleteCompany,
    filteredCompanies,
  };
}

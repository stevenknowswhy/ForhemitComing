import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useCallback } from "react";
import { ContactFormData } from "../types";

// ============================================
// CRM Contacts Hook
// ============================================

interface UseCrmContactsOptions {
  companyId?: Id<"crmCompanies"> | null;
}

interface UseCrmContactsReturn {
  contacts: Doc<"crmContacts">[] | undefined;
  isLoading: boolean;
  createContact: (data: ContactFormData) => Promise<Id<"crmContacts">>;
  updateContact: (id: Id<"crmContacts">, data: Partial<ContactFormData>) => Promise<Id<"crmContacts">>;
  deleteContact: (id: Id<"crmContacts">) => Promise<{ success: boolean }>;
}

export function useCrmContacts(options: UseCrmContactsOptions = {}): UseCrmContactsReturn {
  const { companyId } = options;

  // Query contacts
  const contacts = useQuery(
    api.crmContacts.listByCompany,
    companyId ? { companyId } : "skip"
  );

  // Mutations
  const createMutation = useMutation(api.crmContacts.create);
  const updateMutation = useMutation(api.crmContacts.update);
  const deleteMutation = useMutation(api.crmContacts.remove);

  // Create contact handler
  const createContact = useCallback(
    async (data: ContactFormData): Promise<Id<"crmContacts">> => {
      return await createMutation({
        companyId: data.companyId as Id<"crmCompanies">,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        isPrimary: data.isPrimary,
      });
    },
    [createMutation]
  );

  // Update contact handler
  const updateContact = useCallback(
    async (id: Id<"crmContacts">, data: Partial<ContactFormData>): Promise<Id<"crmContacts">> => {
      return await updateMutation({
        id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        isPrimary: data.isPrimary,
      });
    },
    [updateMutation]
  );

  // Delete contact handler
  const deleteContact = useCallback(
    async (id: Id<"crmContacts">): Promise<{ success: boolean }> => {
      return await deleteMutation({ id });
    },
    [deleteMutation]
  );

  return {
    contacts,
    isLoading: contacts === undefined && companyId !== undefined,
    createContact,
    updateContact,
    deleteContact,
  };
}

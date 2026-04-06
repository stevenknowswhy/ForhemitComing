"use client";

import { useState, useCallback } from "react";
import {
  PackageInputs,
  LenderInfo,
  FinancialSnapshot,
  ManagementTeam,
  AdvisoryTeam,
  ForhemitTeam,
  ComplianceChecklist,
  ManagementPerson,
  ValidationErrors,
} from "../types";
import { DEFAULT_INPUTS } from "../constants";

// ── HOOK ─────────────────────────────────────────────────────────────────────

export function usePackageForm(initialData?: Partial<PackageInputs>) {
  const [inputs, setInputs] = useState<PackageInputs>({
    ...DEFAULT_INPUTS,
    ...initialData,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // ── Update Handlers ────────────────────────────────────────────────────────

  const updateLender = useCallback((updates: Partial<LenderInfo>) => {
    setInputs((prev) => ({
      ...prev,
      lender: { ...prev.lender, ...updates },
    }));
    // Clear related errors
    setErrors((prev) => {
      const next = { ...prev };
      if (updates.lenderName) delete next.lenderName;
      if (updates.institution) delete next.institution;
      if (updates.companyName) delete next.companyName;
      if (updates.industry) delete next.industry;
      if (updates.yearsInOperation) delete next.yearsInOperation;
      return next;
    });
  }, []);

  const updateFinancial = useCallback((updates: Partial<FinancialSnapshot>) => {
    setInputs((prev) => ({
      ...prev,
      financial: { ...prev.financial, ...updates },
    }));
    // Clear related errors
    setErrors((prev) => {
      const next = { ...prev };
      if (updates.revenue) delete next.revenue;
      if (updates.ebitda) delete next.ebitda;
      if (updates.dscr) delete next.dscr;
      return next;
    });
  }, []);

  const updateManagementPerson = useCallback(
    (index: number, updates: Partial<ManagementPerson>) => {
      setInputs((prev) => {
        const newMembers = [...prev.management.members];
        newMembers[index] = { ...newMembers[index], ...updates };
        return {
          ...prev,
          management: { ...prev.management, members: newMembers as [ManagementPerson, ManagementPerson, ManagementPerson] },
        };
      });
    },
    []
  );

  const updateManagementNotes = useCallback((notes: string) => {
    setInputs((prev) => ({
      ...prev,
      management: { ...prev.management, notes },
    }));
  }, []);

  const updateAdvisory = useCallback((updates: Partial<AdvisoryTeam>) => {
    setInputs((prev) => ({
      ...prev,
      advisory: { ...prev.advisory, ...updates },
    }));
  }, []);

  const updateForhemit = useCallback((updates: Partial<ForhemitTeam>) => {
    setInputs((prev) => ({
      ...prev,
      forhemit: { ...prev.forhemit, ...updates },
    }));
    // Clear related errors
    setErrors((prev) => {
      const next = { ...prev };
      if (updates.founderName) delete next.founderName;
      if (updates.email) delete next.founderEmail;
      if (updates.founderYears) delete next.founderYears;
      return next;
    });
  }, []);

  const updateChecklist = useCallback(
    (key: keyof ComplianceChecklist, value: boolean) => {
      setInputs((prev) => ({
        ...prev,
        checklist: { ...prev.checklist, [key]: value },
      }));
    },
    []
  );

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: ValidationErrors = {};

      if (step === 0) {
        // Lender & Transaction
        if (!inputs.lender.lenderName) {
          newErrors.lenderName = "Lender name is required";
        }
        if (!inputs.lender.institution) {
          newErrors.institution = "Institution is required";
        }
        if (!inputs.lender.companyName) {
          newErrors.companyName = "Company name is required";
        }
        if (!inputs.lender.industry) {
          newErrors.industry = "Industry is required";
        }
        if (!inputs.lender.yearsInOperation || inputs.lender.yearsInOperation < 1) {
          newErrors.yearsInOperation = "Years in operation is required";
        }
      }

      if (step === 1) {
        // Financial Snapshot
        if (!inputs.financial.revenue) {
          newErrors.revenue = "TTM Revenue is required";
        }
        if (!inputs.financial.ebitda) {
          newErrors.ebitda = "Adjusted EBITDA is required";
        }
        if (!inputs.financial.dscr) {
          newErrors.dscr = "Projected DSCR is required";
        }
      }

      if (step === 4) {
        // Forhemit Team
        if (!inputs.forhemit.founderName) {
          newErrors.founderName = "Founder name is required";
        }
        if (!inputs.forhemit.founderYears) {
          newErrors.founderYears = "Years in SF disaster preparedness is required";
        }
        if (!inputs.forhemit.email) {
          newErrors.founderEmail = "Email address is required";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [inputs]
  );

  // ── Checklist Validation ───────────────────────────────────────────────────

  const allChecklistItemsConfirmed = Object.values(inputs.checklist).every(
    Boolean
  );

  // ── Export ─────────────────────────────────────────────────────────────────

  return {
    inputs,
    errors,
    updateLender,
    updateFinancial,
    updateManagementPerson,
    updateManagementNotes,
    updateAdvisory,
    updateForhemit,
    updateChecklist,
    validateStep,
    allChecklistItemsConfirmed,
    setErrors,
  };
}

// ── ESOP DEAL FLOW SYSTEM FORM HOOK ──────────────────────────────────────────

import { useState, useCallback, useMemo } from "react";
import type {
  DealFlowInputs,
  DealFlowStage,
  ValidationErrors,
  SourceReferral,
  BusinessIdentity,
  KeyContacts,
  ContactPerson,
  QuickQualifiers,
  OwnershipStructure,
  Motivation,
  RedFlags,
  NextSteps,
  Stage1Data,
  OwnerObjectives,
  PreliminaryValuation,
  ValuationScenario,
  EmployeePopulation,
  EmployeeCategory,
  ESOPStructure,
  FeasibilityRedFlags,
  FeasibilityScores,
  GoNoGo,
  Stage2Data,
  DDDocument,
  LegalCorporateDocs,
  MaterialContracts,
  LitigationCompliance,
  HRPlanDocuments,
  HRParticipantData,
  HRCompensation,
  FinancialStatements,
  TaxMatters,
  DealSpecificFinancials,
  Liabilities,
  Liability,
  Insurance,
  Governance,
  Rollover1042,
  GapItem,
  Stage3Data,
  DealFlowMeta,
} from "../types";
import { DEFAULT_INPUTS } from "../constants";
import { calculateTotalScore, getScoreRecommendation } from "../lib/calculations";

// ═════════════════════════════════════════════════════════════════════════════
// MAIN HOOK
// ═════════════════════════════════════════════════════════════════════════════

export function useDealFlowForm(initialData?: Partial<DealFlowInputs>) {
  const [inputs, setInputs] = useState<DealFlowInputs>(() => ({
    ...DEFAULT_INPUTS,
    ...initialData,
  }));
  
  const [errors, setErrors] = useState<ValidationErrors>({});

  // ── Meta Updates ───────────────────────────────────────────────────────────

  const updateMeta = useCallback((updates: Partial<DealFlowMeta>) => {
    setInputs((prev) => ({
      ...prev,
      meta: { ...prev.meta, ...updates },
    }));
  }, []);

  // ── Stage 1 Updates ────────────────────────────────────────────────────────

  const updateSourceReferral = useCallback((updates: Partial<SourceReferral>) => {
    setInputs((prev) => ({
      ...prev,
      stage1: {
        ...prev.stage1,
        sourceReferral: { ...prev.stage1.sourceReferral, ...updates },
      },
    }));
  }, []);

  const updateBusinessIdentity = useCallback((updates: Partial<BusinessIdentity>) => {
    setInputs((prev) => ({
      ...prev,
      stage1: {
        ...prev.stage1,
        businessIdentity: { ...prev.stage1.businessIdentity, ...updates },
      },
    }));
    // Clear errors when user updates
    if (updates.companyName) {
      setErrors((e) => ({ ...e, companyName: undefined }));
    }
    if (updates.industry) {
      setErrors((e) => ({ ...e, industry: undefined }));
    }
  }, []);

  const updateKeyContact = useCallback(
    (role: keyof KeyContacts, updates: Partial<ContactPerson>) => {
      setInputs((prev) => ({
        ...prev,
        stage1: {
          ...prev.stage1,
          keyContacts: {
            ...prev.stage1.keyContacts,
            [role]: { ...prev.stage1.keyContacts[role], ...updates },
          },
        },
      }));
    },
    []
  );

  const updateQuickQualifiers = useCallback((updates: Partial<QuickQualifiers>) => {
    setInputs((prev) => ({
      ...prev,
      stage1: {
        ...prev.stage1,
        quickQualifiers: { ...prev.stage1.quickQualifiers, ...updates },
      },
    }));
  }, []);

  const updateOwnership = useCallback((updates: Partial<OwnershipStructure>) => {
    setInputs((prev) => ({
      ...prev,
      stage1: {
        ...prev.stage1,
        quickQualifiers: {
          ...prev.stage1.quickQualifiers,
          ownership: { ...prev.stage1.quickQualifiers.ownership, ...updates },
        },
      },
    }));
  }, []);

  const updateMotivation = useCallback((updates: Partial<Motivation>) => {
    setInputs((prev) => ({
      ...prev,
      stage1: {
        ...prev.stage1,
        motivation: { ...prev.stage1.motivation, ...updates },
      },
    }));
  }, []);

  const updateRedFlags = useCallback((updates: Partial<RedFlags>) => {
    setInputs((prev) => ({
      ...prev,
      stage1: {
        ...prev.stage1,
        redFlags: { ...prev.stage1.redFlags, ...updates },
      },
    }));
  }, []);

  const updateNextSteps = useCallback((updates: Partial<NextSteps>) => {
    setInputs((prev) => ({
      ...prev,
      stage1: {
        ...prev.stage1,
        nextSteps: { ...prev.stage1.nextSteps, ...updates },
      },
    }));
  }, []);

  const updateStage1Notes = useCallback((notes: string) => {
    setInputs((prev) => ({
      ...prev,
      stage1: { ...prev.stage1, internalNotes: notes },
    }));
  }, []);

  // ── Stage 2 Updates ────────────────────────────────────────────────────────

  const updateOwnerObjectives = useCallback((updates: Partial<OwnerObjectives>) => {
    setInputs((prev) => ({
      ...prev,
      stage2: {
        ...prev.stage2,
        ownerObjectives: { ...prev.stage2.ownerObjectives, ...updates },
      },
    }));
  }, []);

  const updateValuation = useCallback((updates: Partial<PreliminaryValuation>) => {
    setInputs((prev) => ({
      ...prev,
      stage2: {
        ...prev.stage2,
        valuation: { ...prev.stage2.valuation, ...updates },
      },
    }));
  }, []);

  const updateValuationScenario = useCallback(
    (field: keyof PreliminaryValuation, scenario: Partial<ValuationScenario>) => {
      setInputs((prev) => ({
        ...prev,
        stage2: {
          ...prev.stage2,
          valuation: {
            ...prev.stage2.valuation,
            [field]: { ...(prev.stage2.valuation[field] as ValuationScenario), ...scenario },
          },
        },
      }));
    },
    []
  );

  const updateEmployeeCategory = useCallback(
    (category: keyof EmployeePopulation, updates: Partial<EmployeeCategory> & Record<string, unknown>) => {
      setInputs((prev) => ({
        ...prev,
        stage2: {
          ...prev.stage2,
          employeePopulation: {
            ...prev.stage2.employeePopulation,
            [category]: { ...(prev.stage2.employeePopulation[category] as EmployeeCategory), ...updates },
          },
        },
      }));
    },
    []
  );

  const updateEmployeePopulation = useCallback((updates: Partial<EmployeePopulation>) => {
    setInputs((prev) => ({
      ...prev,
      stage2: {
        ...prev.stage2,
        employeePopulation: { ...prev.stage2.employeePopulation, ...updates },
      },
    }));
  }, []);

  const updateESOPStructure = useCallback((updates: Partial<ESOPStructure>) => {
    setInputs((prev) => ({
      ...prev,
      stage2: {
        ...prev.stage2,
        esopStructure: { ...prev.stage2.esopStructure, ...updates },
      },
    }));
  }, []);

  const updateFeasibilityRedFlags = useCallback((updates: Partial<FeasibilityRedFlags>) => {
    setInputs((prev) => ({
      ...prev,
      stage2: {
        ...prev.stage2,
        redFlags: { ...prev.stage2.redFlags, ...updates },
      },
    }));
  }, []);

  const updateScores = useCallback((updates: Partial<FeasibilityScores>) => {
    setInputs((prev) => ({
      ...prev,
      stage2: {
        ...prev.stage2,
        scores: { ...prev.stage2.scores, ...updates },
      },
    }));
  }, []);

  const updateGoNoGo = useCallback((updates: Partial<GoNoGo>) => {
    setInputs((prev) => ({
      ...prev,
      stage2: {
        ...prev.stage2,
        goNoGo: { ...prev.stage2.goNoGo, ...updates },
      },
    }));
  }, []);

  const updateSignOff = useCallback(
    (role: keyof GoNoGo["signOffs"], value: string) => {
      setInputs((prev) => ({
        ...prev,
        stage2: {
          ...prev.stage2,
          goNoGo: {
            ...prev.stage2.goNoGo,
            signOffs: { ...prev.stage2.goNoGo.signOffs, [role]: value },
          },
        },
      }));
    },
    []
  );

  // ── Stage 3 Updates ────────────────────────────────────────────────────────

  const updateDDDocument = useCallback(
    (
      section: keyof Stage3Data,
      key: string,
      updates: Partial<DDDocument>
    ) => {
      setInputs((prev) => {
        const sectionData = prev.stage3[section] as unknown as Record<string, DDDocument>;
        return {
          ...prev,
          stage3: {
            ...prev.stage3,
            [section]: {
              ...sectionData,
              [key]: { ...sectionData[key], ...updates },
            },
          },
        };
      });
    },
    []
  );

  const updateLiability = useCallback(
    (key: keyof Liabilities, updates: Partial<Liability>) => {
      setInputs((prev) => ({
        ...prev,
        stage3: {
          ...prev.stage3,
          liabilities: {
            ...prev.stage3.liabilities,
            [key]: { ...prev.stage3.liabilities[key], ...updates },
          },
        },
      }));
    },
    []
  );

  const updateGovernance = useCallback((updates: Partial<Governance>) => {
    setInputs((prev) => ({
      ...prev,
      stage3: {
        ...prev.stage3,
        governance: { ...prev.stage3.governance, ...updates },
      },
    }));
  }, []);

  const updateRollover1042 = useCallback((updates: Partial<Rollover1042>) => {
    setInputs((prev) => ({
      ...prev,
      stage3: {
        ...prev.stage3,
        rollover1042: { ...prev.stage3.rollover1042, ...updates },
      },
    }));
  }, []);

  const updateGapItem = useCallback((index: number, updates: Partial<GapItem>) => {
    setInputs((prev) => {
      const newItems = [...prev.stage3.gapItems];
      newItems[index] = { ...newItems[index], ...updates };
      return {
        ...prev,
        stage3: { ...prev.stage3, gapItems: newItems },
      };
    });
  }, []);

  const updateStage3Notes = useCallback((notes: string) => {
    setInputs((prev) => ({
      ...prev,
      stage3: { ...prev.stage3, advisorNotes: notes },
    }));
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateStage = useCallback((stage: DealFlowStage): boolean => {
    const newErrors: ValidationErrors = {};

    if (stage === 1) {
      if (!inputs.stage1.businessIdentity.companyName.trim()) {
        newErrors.companyName = "Company name is required";
      }
      if (!inputs.stage1.businessIdentity.industry.trim()) {
        newErrors.industry = "Industry is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [inputs]);

  // ── Computed Values ────────────────────────────────────────────────────────

  const feasibilityScore = useMemo(() => {
    return calculateTotalScore(inputs.stage2.scores);
  }, [inputs.stage2.scores]);

  const feasibilityRecommendation = useMemo(() => {
    return getScoreRecommendation(feasibilityScore);
  }, [feasibilityScore]);

  const canProceedToStage3 = useMemo(() => {
    return feasibilityScore >= 16 && inputs.stage2.goNoGo.decision === "proceed";
  }, [feasibilityScore, inputs.stage2.goNoGo.decision]);

  // ── Return ─────────────────────────────────────────────────────────────────

  return {
    inputs,
    errors,
    feasibilityScore,
    feasibilityRecommendation,
    canProceedToStage3,
    // Meta
    updateMeta,
    // Stage 1
    updateSourceReferral,
    updateBusinessIdentity,
    updateKeyContact,
    updateQuickQualifiers,
    updateOwnership,
    updateMotivation,
    updateRedFlags,
    updateNextSteps,
    updateStage1Notes,
    // Stage 2
    updateOwnerObjectives,
    updateValuation,
    updateValuationScenario,
    updateEmployeeCategory,
    updateEmployeePopulation,
    updateESOPStructure,
    updateFeasibilityRedFlags,
    updateScores,
    updateGoNoGo,
    updateSignOff,
    // Stage 3
    updateDDDocument,
    updateLiability,
    updateGovernance,
    updateRollover1042,
    updateGapItem,
    updateStage3Notes,
    // Validation
    validateStage,
  };
}

export type UseDealFlowFormReturn = ReturnType<typeof useDealFlowForm>;

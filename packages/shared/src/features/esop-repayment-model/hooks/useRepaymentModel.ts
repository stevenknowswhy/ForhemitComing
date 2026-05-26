/**
 * ESOP Repayment & Amortization Model - Form State Hook
 */

import { useState, useCallback, useMemo } from "react";
import {
  RepaymentModelInputs,
  DealHeader,
  AdvisorTeam,
  SellingShareholder,
  SBALoan,
  SellerNote,
  FinancialProjections,
  ViewTab,
  ScenarioTab,
  ValidationError,
} from "../types";
import {
  DEFAULT_INPUTS,
} from "../constants";
import {
  buildAmortizationSchedule,
  buildScenarios,
  calculateWaterfall,
  calculateMetrics,
  validateStep1 as validateStep1Calc,
  validateStep2 as validateStep2Calc,
} from "../lib";

export interface UseRepaymentModelReturn {
  inputs: RepaymentModelInputs;
  currentStep: number;
  activeView: ViewTab;
  activeScenario: ScenarioTab;
  validationErrors: ValidationError[];

  // Actions
  setCurrentStep: (step: number) => void;
  updateHeaderField: <K extends keyof DealHeader>(field: K, value: DealHeader[K]) => void;
  updateAdvisorField: <K extends keyof AdvisorTeam>(field: K, value: AdvisorTeam[K]) => void;
  updateSellerField: <K extends keyof SellingShareholder>(field: K, value: SellingShareholder[K]) => void;
  updateSBALoanField: <K extends keyof SBALoan>(field: K, value: SBALoan[K]) => void;
  updateSellerNoteField: <K extends keyof SellerNote>(field: K, value: SellerNote[K]) => void;
  updateProjectionField: <K extends keyof FinancialProjections>(field: K, value: FinancialProjections[K]) => void;
  setActiveView: (view: ViewTab) => void;
  setActiveScenario: (scenario: ScenarioTab) => void;

  // Validation
  validateStep1: () => boolean;
  validateStep2: () => boolean;

  // Derived data
  schedule: ReturnType<typeof buildAmortizationSchedule>;
  scenarios: ReturnType<typeof buildScenarios>;
  waterfall: ReturnType<typeof calculateWaterfall>;
  metrics: ReturnType<typeof calculateMetrics>;
}

export function useRepaymentModel(
  initialData?: Partial<RepaymentModelInputs>
): UseRepaymentModelReturn {
  const [inputs, setInputs] = useState<RepaymentModelInputs>({
    ...DEFAULT_INPUTS,
    ...initialData,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [activeView, setActiveView] = useState<ViewTab>("amort");
  const [activeScenario, setActiveScenario] = useState<ScenarioTab>("base");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Field updaters
  const updateHeaderField = useCallback(<K extends keyof DealHeader>(
    field: K,
    value: DealHeader[K]
  ) => {
    setInputs((prev) => ({
      ...prev,
      header: { ...prev.header, [field]: value },
    }));
  }, []);

  const updateAdvisorField = useCallback(<K extends keyof AdvisorTeam>(
    field: K,
    value: AdvisorTeam[K]
  ) => {
    setInputs((prev) => ({
      ...prev,
      advisors: { ...prev.advisors, [field]: value },
    }));
  }, []);

  const updateSellerField = useCallback(<K extends keyof SellingShareholder>(
    field: K,
    value: SellingShareholder[K]
  ) => {
    setInputs((prev) => ({
      ...prev,
      seller: { ...prev.seller, [field]: value },
    }));
  }, []);

  const updateSBALoanField = useCallback(<K extends keyof SBALoan>(
    field: K,
    value: SBALoan[K]
  ) => {
    setInputs((prev) => ({
      ...prev,
      sbaLoan: { ...prev.sbaLoan, [field]: value },
    }));
  }, []);

  const updateSellerNoteField = useCallback(<K extends keyof SellerNote>(
    field: K,
    value: SellerNote[K]
  ) => {
    setInputs((prev) => ({
      ...prev,
      sellerNote: { ...prev.sellerNote, [field]: value },
    }));
  }, []);

  const updateProjectionField = useCallback(<K extends keyof FinancialProjections>(
    field: K,
    value: FinancialProjections[K]
  ) => {
    setInputs((prev) => ({
      ...prev,
      projections: { ...prev.projections, [field]: value },
    }));
  }, []);

  // Validation
  const validateStep1 = useCallback((): boolean => {
    const errors = validateStep1Calc(inputs);
    setValidationErrors(errors);
    return errors.length === 0;
  }, [inputs]);

  const validateStep2 = useCallback((): boolean => {
    const errors = validateStep2Calc(inputs);
    setValidationErrors(errors);
    return errors.length === 0;
  }, [inputs]);

  // Derived calculations
  const schedule = useMemo(() => buildAmortizationSchedule(inputs), [inputs]);
  const scenarios = useMemo(() => buildScenarios(inputs), [inputs]);
  const waterfall = useMemo(() => calculateWaterfall(inputs), [inputs]);
  const metrics = useMemo(() => calculateMetrics(inputs), [inputs]);

  return {
    inputs,
    currentStep,
    activeView,
    activeScenario,
    validationErrors,

    setCurrentStep,
    updateHeaderField,
    updateAdvisorField,
    updateSellerField,
    updateSBALoanField,
    updateSellerNoteField,
    updateProjectionField,
    setActiveView,
    setActiveScenario,

    validateStep1,
    validateStep2,

    schedule,
    scenarios,
    waterfall,
    metrics,
  };
}

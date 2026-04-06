/**
 * Introduction Letter Generator - Form State Hook
 */

import { useState, useCallback, useMemo } from "react";
import {
  LetterGeneratorInputs,
  RecipientType,
  ContactInfo,
  SenderInfo,
  CompanyInfo,
} from "../types";
import { DEFAULT_INPUTS } from "../constants";
import { renderLetter, getTodayDate } from "../lib";

export interface UseLetterGeneratorReturn {
  inputs: LetterGeneratorInputs;
  renderedLetter: ReturnType<typeof renderLetter>;

  // Actions
  setRecipientType: (type: RecipientType) => void;
  updateContactField: <K extends keyof ContactInfo>(field: K, value: ContactInfo[K]) => void;
  updateSenderField: <K extends keyof SenderInfo>(field: K, value: SenderInfo[K]) => void;
  updateCompanyField: <K extends keyof CompanyInfo>(field: K, value: CompanyInfo[K]) => void;
  resetForm: () => void;
}

export function useLetterGenerator(
  initialData?: Partial<LetterGeneratorInputs>
): UseLetterGeneratorReturn {
  const [inputs, setInputs] = useState<LetterGeneratorInputs>({
    ...DEFAULT_INPUTS,
    ...initialData,
    company: {
      ...DEFAULT_INPUTS.company,
      ...initialData?.company,
      letterDate: initialData?.company?.letterDate || getTodayDate(),
    },
  });

  const setRecipientType = useCallback((type: RecipientType) => {
    setInputs((prev) => ({ ...prev, recipientType: type }));
  }, []);

  const updateContactField = useCallback(<K extends keyof ContactInfo>(
    field: K,
    value: ContactInfo[K]
  ) => {
    setInputs((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  }, []);

  const updateSenderField = useCallback(<K extends keyof SenderInfo>(
    field: K,
    value: SenderInfo[K]
  ) => {
    setInputs((prev) => ({
      ...prev,
      sender: { ...prev.sender, [field]: value },
    }));
  }, []);

  const updateCompanyField = useCallback(<K extends keyof CompanyInfo>(
    field: K,
    value: CompanyInfo[K]
  ) => {
    setInputs((prev) => ({
      ...prev,
      company: { ...prev.company, [field]: value },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setInputs({
      ...DEFAULT_INPUTS,
      company: {
        ...DEFAULT_INPUTS.company,
        letterDate: getTodayDate(),
      },
    });
  }, []);

  const renderedLetter = useMemo(() => renderLetter(inputs), [inputs]);

  return {
    inputs,
    renderedLetter,
    setRecipientType,
    updateContactField,
    updateSenderField,
    updateCompanyField,
    resetForm,
  };
}

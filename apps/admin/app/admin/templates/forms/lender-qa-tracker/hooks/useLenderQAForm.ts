/**
 * Lender Q&A Tracker - Form State Hook
 */
import { useState, useCallback, useMemo } from "react";
import {
  LenderQAInputs,
  DealHeader,
  QAItem,
  QAStatus,
  QAPriority,
  QACategory,
  QASource,
  QAFilter,
  ValidationError,
} from "../types";
import { DEFAULT_INPUTS, DEFAULT_QA_ITEM, ESOP_TEMPLATE_ITEMS } from "../constants";
import { validateDealHeader, validateQAItem, formatPhone } from "../lib/validation";
import { calculateMetrics, generateItemId } from "../lib/calculations";

export interface UseLenderQAFormReturn {
  inputs: LenderQAInputs;
  currentStep: number;
  activeFilter: QAFilter;
  expandedItem: number | null;
  validationErrors: ValidationError[];
  isModalOpen: boolean;
  editingItemIndex: number | null;

  // Actions
  setCurrentStep: (step: number) => void;
  updateHeader: (updates: Partial<DealHeader>) => void;
  updateHeaderField: <K extends keyof DealHeader>(field: K, value: DealHeader[K]) => void;
  formatPhoneField: () => void;
  setActiveFilter: (filter: QAFilter) => void;
  setExpandedItem: (index: number | null) => void;
  openModal: (index?: number) => void;
  closeModal: () => void;
  saveItem: (item: Partial<QAItem>) => { success: boolean; errors?: ValidationError[] };
  deleteItem: (index: number) => void;
  loadTemplate: () => void;
  clearAll: () => void;

  // Validation
  validateStep1: () => boolean;

  // Derived data
  metrics: ReturnType<typeof calculateMetrics>;
  filteredItems: (QAItem & { _idx: number })[];
  dealIdPrefix: string;
}

export function useLenderQAForm(initialData?: Partial<LenderQAInputs>): UseLenderQAFormReturn {
  const [inputs, setInputs] = useState<LenderQAInputs>({
    ...DEFAULT_INPUTS,
    ...initialData,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [activeFilter, setActiveFilter] = useState<QAFilter>("all");
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  // Update header fields
  const updateHeader = useCallback((updates: Partial<DealHeader>) => {
    setInputs((prev) => ({
      ...prev,
      header: { ...prev.header, ...updates },
    }));
  }, []);

  const updateHeaderField = useCallback(<K extends keyof DealHeader>(field: K, value: DealHeader[K]) => {
    setInputs((prev) => ({
      ...prev,
      header: { ...prev.header, [field]: value },
    }));
  }, []);

  // Format phone number
  const formatPhoneField = useCallback(() => {
    setInputs((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        lphone: formatPhone(prev.header.lphone),
      },
    }));
  }, []);

  // Validate step 1
  const validateStep1 = useCallback((): boolean => {
    const errors = validateDealHeader(inputs.header);
    setValidationErrors(errors);
    return errors.length === 0;
  }, [inputs.header]);

  // Modal actions
  const openModal = useCallback((index?: number) => {
    if (index !== undefined) {
      setEditingItemIndex(index);
    } else {
      setEditingItemIndex(null);
    }
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItemIndex(null);
  }, []);

  // Save item
  const saveItem = useCallback(
    (itemData: Partial<QAItem>): { success: boolean; errors?: ValidationError[] } => {
      const errors = validateQAItem(itemData);
      if (errors.length > 0) {
        return { success: false, errors };
      }

      const now = new Date().toISOString();
      const dealId = inputs.header.dealid;

      if (editingItemIndex !== null) {
        // Update existing
        setInputs((prev) => {
          const newItems = [...prev.items];
          newItems[editingItemIndex] = {
            ...newItems[editingItemIndex],
            ...itemData,
            lastModified: now,
          } as QAItem;
          return { ...prev, items: newItems };
        });
      } else {
        // Add new
        const newItem: QAItem = {
          ...(DEFAULT_QA_ITEM as QAItem),
          ...itemData,
          id: generateItemId(dealId, inputs.items),
          dateReceived: now.split("T")[0],
          lastModified: now,
        } as QAItem;

        setInputs((prev) => ({
          ...prev,
          items: [...prev.items, newItem],
        }));
      }

      return { success: true };
    },
    [editingItemIndex, inputs.header.dealid, inputs.items]
  );

  // Delete item
  const deleteItem = useCallback((index: number) => {
    setInputs((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    if (expandedItem === index) {
      setExpandedItem(null);
    }
  }, [expandedItem]);

  // Load ESOP template
  const loadTemplate = useCallback(() => {
    const now = new Date().toISOString();
    const dealId = inputs.header.dealid;

    const newItems: QAItem[] = ESOP_TEMPLATE_ITEMS.map((template, i) => ({
      ...template,
      id: generateItemId(dealId, [...inputs.items, ...newItems.slice(0, i)]),
      dateReceived: now.split("T")[0],
      lastModified: now,
    }));

    setInputs((prev) => ({
      ...prev,
      items: [...prev.items, ...newItems],
    }));
  }, [inputs.header.dealid, inputs.items]);

  // Clear all
  const clearAll = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
    setCurrentStep(1);
    setActiveFilter("all");
    setExpandedItem(null);
    setValidationErrors([]);
  }, []);

  // Derived data
  const metrics = useMemo(() => calculateMetrics(inputs.items), [inputs.items]);

  const filteredItems = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return inputs.items
      .map((item, idx) => ({ ...item, _idx: idx }))
      .filter((item) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "high") return item.pri === "High";
        if (activeFilter === "overdue") {
          return (
            !!item.due &&
            item.due < today &&
            item.status !== "Resolved" &&
            item.status !== "Waived"
          );
        }
        return item.status === activeFilter;
      });
  }, [inputs.items, activeFilter]);

  const dealIdPrefix = inputs.header.dealid.trim() || "LQ";

  return {
    inputs,
    currentStep,
    activeFilter,
    expandedItem,
    validationErrors,
    isModalOpen,
    editingItemIndex,

    setCurrentStep,
    updateHeader,
    updateHeaderField,
    formatPhoneField,
    setActiveFilter: (f) => setActiveFilter(f as QAFilter),
    setExpandedItem,
    openModal,
    closeModal,
    saveItem,
    deleteItem,
    loadTemplate,
    clearAll,

    validateStep1,

    metrics,
    filteredItems,
    dealIdPrefix,
  };
}

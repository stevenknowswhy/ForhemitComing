"use client";

import React, { forwardRef, useRef, useImperativeHandle, useCallback } from "react";
import { TemplateFormHandle } from "../../registry";
import { useLenderQAForm } from "./hooks/useLenderQAForm";
import { ValidationSummary } from "./components/inputs";
import {
  StepIndicator,
  DealHeaderSection,
  LenderInfoSection,
  TimelineSection,
  MetricsPanel,
  FilterBar,
  QAList,
  AddItemModal,
  SummaryPanel,
  CategoryProgress,
  PrintList,
} from "./components/sections";

const LenderQATrackerForm = forwardRef<TemplateFormHandle, { initialData?: Record<string, unknown> }>(
  function LenderQATrackerForm({ initialData }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const {
      inputs,
      currentStep,
      activeFilter,
      expandedItem,
      validationErrors,
      isModalOpen,
      editingItemIndex,
      setCurrentStep,
      updateHeaderField,
      formatPhoneField,
      setActiveFilter,
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
    } = useLenderQAForm(initialData as Partial<typeof inputs>);

    const errorMap = new Map(validationErrors.map((e) => [e.field, e.message]));

    const handleStepClick = useCallback(
      (step: number) => {
        if (step === 2 && currentStep === 1) {
          if (!validateStep1()) return;
        }
        setCurrentStep(step);
      },
      [currentStep, validateStep1, setCurrentStep]
    );

    const handleToggleExpand = useCallback(
      (index: number) => {
        setExpandedItem(expandedItem === index ? null : index);
      },
      [expandedItem, setExpandedItem]
    );

    const handleContinueToQA = useCallback(() => {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    }, [validateStep1, setCurrentStep]);

    // Imperative handle for PDF generation
    useImperativeHandle(
      ref,
      () => ({
        getFormData: () => inputs as unknown as Record<string, unknown>,
        getContainerRef: () => containerRef.current,
      }),
      [inputs]
    );

    const editingItem = editingItemIndex !== null ? inputs.items[editingItemIndex] : null;

    return (
      <div className="lqa-form-container" ref={containerRef}>
        {/* Stepper Navigation */}
        <StepIndicator
          currentStep={currentStep}
          onStepClick={handleStepClick}
          hasErrors={validationErrors.length > 0}
        />

        <div className="lqa-page">
          {/* STEP 1: Deal Header */}
          {currentStep === 1 && (
            <>
              <ValidationSummary errors={validationErrors} />

              <DealHeaderSection
                header={inputs.header}
                onUpdateField={updateHeaderField}
                errors={errorMap}
              />

              <LenderInfoSection
                header={inputs.header}
                onUpdateField={updateHeaderField}
                onFormatPhone={formatPhoneField}
                errors={errorMap}
              />

              <TimelineSection
                header={inputs.header}
                onUpdateField={updateHeaderField}
                errors={errorMap}
              />

              <div className="lqa-form-nav">
                <div />
                <button className="lqa-btn lqa-btn-primary" onClick={handleContinueToQA}>
                  Continue to Q&A Items →
                </button>
              </div>
            </>
          )}

          {/* STEP 2: Q&A Items */}
          {currentStep === 2 && (
            <>
              <MetricsPanel metrics={metrics} />

              {/* Data Actions */}
              <div className="lqa-data-actions">
                <button className="lqa-btn lqa-btn-secondary" onClick={loadTemplate}>
                  Load Common ESOP Questions
                </button>
                <button className="lqa-btn lqa-btn-ghost" onClick={clearAll}>
                  Clear All Data
                </button>
              </div>

              <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

              <QAList
                items={filteredItems}
                expandedItem={expandedItem}
                closeDate={inputs.header.closedate}
                onToggleExpand={handleToggleExpand}
                onEdit={openModal}
                onDelete={deleteItem}
              />

              <button className="lqa-add-item-btn" onClick={() => openModal()}>
                + Add lender condition or question
              </button>

              <div className="lqa-form-nav">
                <button className="lqa-btn lqa-btn-ghost" onClick={() => setCurrentStep(1)}>
                  ← Back
                </button>
                <button className="lqa-btn lqa-btn-primary" onClick={() => setCurrentStep(3)}>
                  Review & Print →
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Summary & Print */}
          {currentStep === 3 && (
            <>
              <SummaryPanel header={inputs.header} />

              <CategoryProgress items={inputs.items} />

              <div className="lqa-form-card">
                <div className="lqa-card-header">
                  <span className="lqa-card-header-label">All items</span>
                </div>
                <PrintList items={inputs.items} />
              </div>

              <div className="lqa-form-nav">
                <button className="lqa-btn lqa-btn-ghost" onClick={() => setCurrentStep(2)}>
                  ← Back to items
                </button>
                <button className="lqa-btn lqa-btn-primary" onClick={() => window.print()}>
                  ⎙ Print / Save PDF
                </button>
              </div>
            </>
          )}
        </div>

        {/* Add/Edit Item Modal */}
        <AddItemModal
          isOpen={isModalOpen}
          editingItem={editingItem}
          dealIdPrefix={dealIdPrefix}
          closeDate={inputs.header.closedate}
          onClose={closeModal}
          onSave={saveItem}
        />
      </div>
    );
  }
);

export default LenderQATrackerForm;
export { LenderQATrackerForm };

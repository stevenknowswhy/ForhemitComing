/**
 * Template Form Registry
 * ──────────────────────
 * To add a new template form:
 *   1. Create a form component in ./forms/YourForm.tsx
 *      - It must accept `ref` (forwardRef) with a `TemplateFormHandle`
 *      - It must accept `initialData?: Record<string, unknown>`
 *   2. Add an entry to `templateFormRegistry` below
 *   3. Seed the template in Convex (documentTemplates.seed) with a matching `formKey`
 *
 * That's it — the TemplatesTab and DocumentPreviewModal will pick it up automatically.
 */

import type { ComponentType, Ref } from "react";

/** Every template form must expose this handle via forwardRef + useImperativeHandle */
export interface TemplateFormHandle {
  /** Returns the current form data for logging / reprinting */
  getFormData: () => Record<string, unknown>;
  /** Returns the form's root DOM node for PDF rendering */
  getContainerRef: () => HTMLDivElement | null;
}

/** Props that every template form component must accept */
export interface TemplateFormProps {
  ref?: Ref<TemplateFormHandle>;
  initialData?: Record<string, unknown>;
}

/** Registry entry – connects a Convex `formKey` to a lazy-loaded React component */
export interface TemplateFormEntry {
  /** Must match `formKey` on the Convex documentTemplates record */
  formKey: string;
  /** Human-readable label (used as PDF filename prefix) */
  label: string;
  /** Lazy-loaded component */
  component: () => Promise<{
    default: ComponentType<TemplateFormProps>;
  }>;
}

/**
 * ╔══════════════════════════════════════════╗
 * ║  REGISTER NEW TEMPLATE FORMS HERE       ║
 * ╚══════════════════════════════════════════╝
 *
 * Each entry maps a `formKey` (stored in Convex) to a lazy-loaded form component.
 * The `formKey` is how the modal knows which form to render for a given template.
 */
export const templateFormRegistry: TemplateFormEntry[] = [
  {
    formKey: "esop-cost-reference",
    label: "ESOP Cost Reference",
    component: () => import("./forms/ESOPCostReferenceForm"),
  },
  {
    formKey: "esop-head-to-head",
    label: "ESOP Head-to-Head",
    component: () => import("./forms/ESOPHeadToHeadForm"),
  },
   {
     formKey: "template-builder-guide",
     label: "Template Builder Guide",
     component: () => import("./forms/TemplateBuilderGuide"),
   },
   {
     formKey: "esop-term-sheet",
     label: "ESOP Term Sheet",
     component: () => import("./forms/esop-term-sheet"),
   },
   // ───────── Add new forms below ─────────
  // {
  //   formKey: "deal-structure-summary",
  //   label: "Deal Structure Summary",
  //   component: () => import("./forms/DealStructureSummaryForm"),
  // },
];

/** Look up a form entry by its formKey */
export function getFormEntry(
  formKey: string
): TemplateFormEntry | undefined {
  return templateFormRegistry.find((entry) => entry.formKey === formKey);
}

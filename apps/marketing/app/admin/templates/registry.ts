export type TemplateFormHandle = {
  getFormData: () => Record<string, unknown>;
  getContainerRef: () => HTMLElement | null;
};


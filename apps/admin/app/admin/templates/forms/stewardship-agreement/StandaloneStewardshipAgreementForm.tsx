"use client";

import React, { forwardRef } from "react";
import StewardshipAgreementForm from "./StewardshipAgreementForm";
import type { TemplateFormHandle } from "../../registry";

/**
 * Standalone version of the Stewardship Agreement form.
 * Disables localStorage syncing for shared fields (Company, Reference, Date)
 * so it can be used completely independently of the Engagement Letter.
 */
const StandaloneStewardshipAgreementForm = forwardRef<TemplateFormHandle, { initialData?: Record<string, unknown> }>(
  function StandaloneStewardshipAgreementForm(props, ref) {
    return <StewardshipAgreementForm {...props} ref={ref} isStandalone={true} />;
  }
);

export default StandaloneStewardshipAgreementForm;

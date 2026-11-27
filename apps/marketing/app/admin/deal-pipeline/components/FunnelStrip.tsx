import type { CSSProperties } from "react";
import type { FunnelStepDef } from "../types";
import { INK, LABEL, SECONDARY } from "./tokens";

// The anonymous funnel strip (P2): outline stages 5-7 — Check,
// Estimate, Company Fit — are anonymous by ruling (G1) and collect no
// per-deal data, so they are NOT board columns. This slim strip names
// them, in order, and states plainly that no counts are shown: there
// is no stored aggregate source for them today, and invented counts
// would be worse than none. When an aggregate source exists, counts
// slot into the step blocks without changing the shape.

const strip: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "stretch",
  gap: 8,
  background: "#F9FAFB",
  border: "1px solid #E5E8EB",
  borderRadius: 10,
  padding: "10px 14px",
  marginBottom: 16,
};
const stepBox: CSSProperties = { minWidth: 180, flex: "1 1 180px" };
const stepLabel: CSSProperties = { fontSize: 13, fontWeight: 600, color: INK };
const stepDetail: CSSProperties = { fontSize: 12, color: LABEL };
const arrow: CSSProperties = { alignSelf: "center", color: LABEL, fontSize: 14 };
const caption: CSSProperties = {
  flexBasis: "100%",
  fontSize: 12,
  color: SECONDARY,
  marginTop: 2,
};

export function FunnelStrip({ steps }: { steps: FunnelStepDef[] }) {
  return (
    <div style={strip} aria-label="Anonymous funnel steps">
      {steps.map((step, i) => (
        <div key={step.id} style={{ display: "contents" }}>
          {i > 0 ? <span style={arrow}>→</span> : null}
          <div style={stepBox}>
            <div style={stepLabel}>{step.label}</div>
            {step.detail ? <div style={stepDetail}>{step.detail}</div> : null}
          </div>
        </div>
      ))}
      <p style={caption}>
        Anonymous funnel — aggregate only, no data source yet. No
        per-deal data is collected at these steps by ruling (G1), and no
        counts are shown until an aggregate source exists.
      </p>
    </div>
  );
}

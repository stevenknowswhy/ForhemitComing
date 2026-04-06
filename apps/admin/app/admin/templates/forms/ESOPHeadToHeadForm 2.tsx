"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import type { TemplateFormHandle } from "../registry";

export type ESOPHeadToHeadFormHandle = TemplateFormHandle;

interface FormInputs {
  ebitda: number;
  purchasePrice: number;
  basis: number;
  cgRate: number;
}

const defaultInputs: FormInputs = {
  ebitda: 2_000_000,
  purchasePrice: 10_000_000,
  basis: 500_000,
  cgRate: 23.8,
};

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function fmtM(n: number) {
  return "$" + (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
}

function calcESOP(inputs: FormInputs) {
  const { ebitda, purchasePrice, basis, cgRate } = inputs;
  const multiple = purchasePrice / ebitda;

  const grossCash = Math.round(purchasePrice * 0.659);
  const tax = 0;
  const netCash = grossCash;
  const note = Math.round(purchasePrice * 0.341);
  const notePV = Math.round(note * 0.584);
  const totalValue = netCash + notePV;
  const taxSavings = Math.round(purchasePrice * (cgRate / 100));

  return {
    id: "esop",
    name: "ESOP / Forhemit",
    sub: "Employee Ownership Transaction",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#86efac",
    dark: "#14532d",
    grossCash,
    tax,
    netCash,
    note,
    noteType: "Full standby — $0 payments during SBA term",
    notePV,
    totalValue,
    taxSavings,
    structure: `SBA 7(a) $${fmtM(purchasePrice * 0.5)} + ESOP Leveraged Loan $${fmtM(purchasePrice * 0.244)} + Seller Note $${fmtM(note)} (standby)`,
    noteCounterparty: "MSO operating company (ESOP-owned entity)",
    dealCertainty: "High — pre-assembled deal team, QofE before LOI, no individual financing risk",
    multiple,
  };
}

function calcIndividual(inputs: FormInputs) {
  const { ebitda, purchasePrice, basis, cgRate } = inputs;
  const multiple = purchasePrice / ebitda;

  const grossCash = Math.round(purchasePrice * 0.85);
  const tax = Math.round((grossCash - basis) * (inputs.cgRate / 100));
  const netCash = grossCash - tax;
  const note = Math.round(purchasePrice * 0.15);
  const noteAfterTax = Math.round(note * 0.65);
  const totalValue = netCash + noteAfterTax;
  const equityRequired = purchasePrice - grossCash - note;

  return {
    id: "indiv",
    name: "Individual Physician",
    sub: "SBA 7(a) Financed",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fcd34d",
    dark: "#78350f",
    grossCash,
    tax,
    netCash,
    note,
    noteType: "Active installment payments — taxed as received over ~5 years",
    noteAfterTax,
    totalValue,
    equityRequired,
    structure: `SBA 7(a) $${fmtM(purchasePrice * 0.5)} + Seller Note $${fmtM(note)} (active) + Buyer equity injection $${fmtM(equityRequired)}`,
    noteCounterparty: "Individual buyer — personal creditworthiness and financial stability",
    dealCertainty: "Moderate — individual buyer SBA approval, personal financials, higher fall-through risk",
    multiple,
  };
}

const NAVY = "#1e3a8a";

const ESOPHeadToHeadForm = forwardRef<
  ESOPHeadToHeadFormHandle,
  { initialData?: Partial<FormInputs> }
>(function ESOPHeadToHeadForm({ initialData }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<string>("verdict");
  const [inputs, setInputs] = useState<FormInputs>({
    ...defaultInputs,
    ...initialData,
  });

  const update = useCallback(
    (field: keyof FormInputs, value: number) =>
      setInputs((prev) => ({ ...prev, [field]: value })),
    []
  );

  const esop = useMemo(() => calcESOP(inputs), [inputs]);
  const indiv = useMemo(() => calcIndividual(inputs), [inputs]);

  const advantage = esop.netCash - indiv.netCash;

  useImperativeHandle(ref, () => ({
    getFormData: () => ({ ...inputs } as Record<string, unknown>),
    getContainerRef: () => containerRef.current,
  }));

  const tabs = [
    { id: "verdict", label: "The Verdict" },
    { id: "waterfall", label: "Tax Waterfall" },
    { id: "notes", label: "Seller Notes" },
    { id: "structure", label: "Deal Structure" },
  ];

  const NumInput = ({
    value,
    onChange,
    step = 1,
  }: {
    value: number;
    onChange: (v: number) => void;
    step?: number;
  }) => (
    <input
      type="text"
      inputMode="decimal"
      pattern="[0-9]*"
      className="h2h-input"
      value={value}
      onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9.]/g, "")) || 0)}
    />
  );

  return (
    <div ref={containerRef} className="h2h-form-container">
      <div className="h2h-header">
        <div className="h2h-header-main">
          <div className="h2h-brand">Forhemit Transition Stewardship Co.</div>
          <h2 className="h2h-title">ESOP vs. Individual Physician Buyer</h2>
          <div className="h2h-subtitle">Head-to-Head · Net Cash at Closing · After Tax</div>
        </div>
        <div className="h2h-header-scenario">
          <div className="h2h-scenario-label">Scenario</div>
          <div className="h2h-scenario-value">${fmtM(inputs.ebitda)} EBITDA</div>
          <div className="h2h-scenario-detail">
            ${fmtM(inputs.purchasePrice)} Purchase Price · {esop.multiple.toFixed(1)}x · Florida
          </div>
        </div>
      </div>

      <div className="h2h-controls">
        <div className="h2h-control-group">
          <label className="h2h-label">EBITDA</label>
          <NumInput value={inputs.ebitda} onChange={(v) => update("ebitda", v)} step={50000} />
        </div>
        <div className="h2h-control-group">
          <label className="h2h-label">Purchase Price</label>
          <NumInput value={inputs.purchasePrice} onChange={(v) => update("purchasePrice", v)} step={100000} />
        </div>
        <div className="h2h-control-group">
          <label className="h2h-label">Cost Basis</label>
          <NumInput value={inputs.basis} onChange={(v) => update("basis", v)} step={50000} />
        </div>
        <div className="h2h-control-group">
          <label className="h2h-label">Capital Gains Rate</label>
          <div className="h2h-rate-wrap">
            <NumInput value={inputs.cgRate} onChange={(v) => update("cgRate", v)} step={0.1} />
            <span className="h2h-rate-pct">%</span>
          </div>
        </div>
      </div>

      <div className="h2h-finding">
        <div className="h2h-finding-label">Key Finding</div>
        <div className="h2h-finding-content">
          <div className="h2h-finding-item">
            <div className="h2h-finding-item-label">ESOP Net Cash at Close</div>
            <div className="h2h-finding-item-value esop">{fmt(esop.netCash)}</div>
          </div>
          <div className="h2h-finding-vs">vs.</div>
          <div className="h2h-finding-item">
            <div className="h2h-finding-item-label">Individual Buyer Net Cash at Close</div>
            <div className="h2h-finding-item-value indiv">{fmt(indiv.netCash)}</div>
          </div>
          <div className="h2h-finding-item">
            <div className="h2h-finding-item-label">ESOP Advantage</div>
            <div className={`h2h-finding-item-value ${advantage >= 0 ? "esop" : "indiv"}`}>
              {advantage >= 0 ? "+" : ""}{fmt(advantage)}
            </div>
            <div className="h2h-finding-item-note">
              §1042 closes the gap {advantage >= 0 ? "entirely" : "significantly"}
            </div>
          </div>
        </div>
      </div>

      <div className="h2h-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`h2h-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="h2h-content">
        {tab === "verdict" && (
          <div className="h2h-verdict">
            <div className="h2h-callout esop-callout">
              <div className="h2h-callout-title">The §1042 Election Closes the Gap Entirely</div>
              <p>
                The individual buyer puts {fmt(indiv.grossCash - esop.grossCash)} more gross cash on the table at closing.
                The §1042 election eliminates {fmt(esop.taxSavings)} in immediate capital gains tax for the ESOP seller.
                The net result: both buyers deliver essentially identical cash to the seller at closing —
                a difference of {fmt(Math.abs(advantage))} on a {fmt(inputs.purchasePrice)} transaction.
              </p>
            </div>

            <div className="h2h-comparison-grid">
              <div className="h2h-comparison-card esop-card">
                <div className="h2h-card-sub">{esop.sub}</div>
                <div className="h2h-card-name">{esop.name}</div>
                <div className="h2h-card-row">
                  <span>Gross Cash at Close</span>
                  <span>{fmt(esop.grossCash)}</span>
                </div>
                <div className="h2h-card-row">
                  <span>Capital Gains Tax</span>
                  <span className="esop">$0 — §1042 deferred</span>
                </div>
                <div className="h2h-card-row highlight">
                  <span>NET Cash at Closing</span>
                  <span className="esop">{fmt(esop.netCash)}</span>
                </div>
                <div className="h2h-card-total">
                  <span>Total Value</span>
                  <span className="esop">{fmt(esop.totalValue)}</span>
                </div>
              </div>

              <div className="h2h-comparison-card indiv-card">
                <div className="h2h-card-sub">{indiv.sub}</div>
                <div className="h2h-card-name">{indiv.name}</div>
                <div className="h2h-card-row">
                  <span>Gross Cash at Close</span>
                  <span>{fmt(indiv.grossCash)}</span>
                </div>
                <div className="h2h-card-row">
                  <span>Capital Gains Tax</span>
                  <span className="indiv">({fmt(indiv.tax)})</span>
                </div>
                <div className="h2h-card-row highlight">
                  <span>NET Cash at Closing</span>
                  <span className="indiv">{fmt(indiv.netCash)}</span>
                </div>
                <div className="h2h-card-total">
                  <span>Total Value</span>
                  <span className="indiv">{fmt(indiv.totalValue)}</span>
                </div>
              </div>
            </div>

            <div className="h2h-section">
              <h3 className="h2h-section-title">What the Numbers Don't Show</h3>
              <div className="h2h-insight">
                <div className="h2h-insight-title" style={{ color: "#16a34a" }}>The §1042 advantage compounds</div>
                <p>The ESOP seller invests {fmt(esop.netCash)} with no tax drag from day one. The individual-buyer seller invests {fmt(indiv.netCash)} after paying {fmt(indiv.tax)} in tax.</p>
              </div>
              <div className="h2h-insight">
                <div className="h2h-insight-title" style={{ color: "#1d4ed8" }}>Deal fall-through risk</div>
                <p>Individual physician buyers face SBA approval contingencies. The ESOP deal team is pre-assembled. Financing contingency risk is materially lower.</p>
              </div>
            </div>
          </div>
        )}

        {tab === "waterfall" && (
          <div className="h2h-waterfall">
            <div className="h2h-callout blue-callout">
              <div className="h2h-callout-title">How §1042 Closes a ${fmtM(indiv.grossCash - esop.grossCash)} Gross Cash Gap</div>
              <p>
                The individual buyer offers {fmt(indiv.grossCash - esop.grossCash)} more gross cash at closing.
                Federal capital gains tax ({inputs.cgRate}%) consumes {fmt(indiv.tax)} of that immediately.
                The §1042 election defers that entire obligation for the ESOP seller.
              </p>
            </div>

            <div className="h2h-waterfall-bar">
              <div className="h2h-waterfall-label">
                <span>ESOP</span>
                <span>{fmt(esop.grossCash)}</span>
              </div>
              <div className="h2h-waterfall-track">
                <div className="h2h-waterfall-segment gross" style={{ width: "65.9%" }}>
                  <span>Gross: {fmt(esop.grossCash)}</span>
                </div>
                <div className="h2h-waterfall-segment tax" style={{ width: "0%" }}>
                  <span>Tax: $0</span>
                </div>
              </div>
              <div className="h2h-waterfall-net">
                <span>NET: {fmt(esop.netCash)}</span>
              </div>
            </div>

            <div className="h2h-waterfall-bar">
              <div className="h2h-waterfall-label">
                <span>Individual</span>
                <span>{fmt(indiv.grossCash)}</span>
              </div>
              <div className="h2h-waterfall-track">
                <div className="h2h-waterfall-segment gross" style={{ width: "65.9%" }}>
                  <span>Gross: {fmt(esop.grossCash)}</span>
                </div>
                <div className="h2h-waterfall-segment tax" style={{ width: "19.2%", background: "#fee2e2", border: "1px dashed #fca5a5" }}>
                  <span>Tax: ({fmt(indiv.tax)})</span>
                </div>
              </div>
              <div className="h2h-waterfall-net">
                <span>NET: {fmt(indiv.netCash)}</span>
              </div>
            </div>

            <div className="h2h-section">
              <h3 className="h2h-section-title">The §1042 Math</h3>
              <div className="h2h-math-grid">
                <div className="h2h-math-item">
                  <div className="h2h-math-label">Tax at {inputs.cgRate}% — without §1042</div>
                  <div className="h2h-math-value indiv">{fmt(esop.taxSavings)}</div>
                </div>
                <div className="h2h-math-item">
                  <div className="h2h-math-label">Tax with §1042 election</div>
                  <div className="h2h-math-value esop">$0 at closing</div>
                </div>
                <div className="h2h-math-item">
                  <div className="h2h-math-label">Immediate tax savings</div>
                  <div className="h2h-math-value esop">{fmt(esop.taxSavings)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "notes" && (
          <div className="h2h-notes">
            <div className="h2h-callout blue-callout">
              <div className="h2h-callout-title">Two Very Different Instruments</div>
              <p>Both structures include a seller note, but the size, timing, counterparty, and risk profile are fundamentally different.</p>
            </div>

            <div className="h2h-notes-comparison">
              <div className="h2h-notes-row">
                <div className="h2h-notes-label">Seller Note Amount</div>
                <div className="h2h-notes-esop">
                  <strong>{fmt(esop.note)}</strong>
                  <span>{((esop.note / inputs.purchasePrice) * 100).toFixed(1)}% of price</span>
                </div>
                <div className="h2h-notes-indiv">
                  <strong>{fmt(indiv.note)}</strong>
                  <span>{((indiv.note / inputs.purchasePrice) * 100).toFixed(1)}% of price</span>
                </div>
              </div>
              <div className="h2h-notes-row">
                <div className="h2h-notes-label">Payment Structure</div>
                <div className="h2h-notes-esop">
                  <strong>$0 during SBA term</strong>
                  <span>Full standby · payments begin after SBA loan retires (~yr 10)</span>
                </div>
                <div className="h2h-notes-indiv">
                  <strong>Active — monthly payments</strong>
                  <span>Seller receives principal + interest starting immediately post-close</span>
                </div>
              </div>
              <div className="h2h-notes-row">
                <div className="h2h-notes-label">Counterparty</div>
                <div className="h2h-notes-esop">
                  <strong>MSO Operating Company</strong>
                  <span>ESOP-owned entity with Forhemit stewardship</span>
                </div>
                <div className="h2h-notes-indiv">
                  <strong>Individual physician buyer</strong>
                  <span>Single individual — default risk</span>
                </div>
              </div>
              <div className="h2h-notes-row">
                <div className="h2h-notes-label">Net Present Value</div>
                <div className="h2h-notes-esop">
                  <strong>{fmt(esop.notePV)}</strong>
                  <span>PV at 5% discount rate over ~11-year midpoint</span>
                </div>
                <div className="h2h-notes-indiv">
                  <strong>{fmt(indiv.noteAfterTax)}</strong>
                  <span>After installment-sale tax</span>
                </div>
              </div>
            </div>

            <div className="h2h-section">
              <h3 className="h2h-section-title">Which Note Is Actually Better?</h3>
              <p>
                On a present value basis, the ESOP note ({fmt(esop.notePV)}) exceeds the individual buyer's note ({fmt(indiv.noteAfterTax)}) by {fmt(esop.notePV - indiv.noteAfterTax)}.
              </p>
            </div>
          </div>
        )}

        {tab === "structure" && (
          <div className="h2h-structure">
            <div className="h2h-section">
              <h3 className="h2h-section-title">Capital Structure</h3>
              <div className="h2h-structure-grid">
                <div className="h2h-structure-card esop-card">
                  <div className="h2h-structure-name">ESOP / Forhemit</div>
                  <div className="h2h-structure-value">{esop.structure}</div>
                </div>
                <div className="h2h-structure-card indiv-card">
                  <div className="h2h-structure-name">Individual Buyer</div>
                  <div className="h2h-structure-value">{indiv.structure}</div>
                </div>
              </div>
            </div>

            <div className="h2h-section">
              <h3 className="h2h-section-title">Deal Certainty</h3>
              <div className="h2h-structure-grid">
                <div className="h2h-structure-card esop-card">
                  <div className="h2h-structure-name esop">ESOP / Forhemit</div>
                  <div className="h2h-structure-value">{esop.dealCertainty}</div>
                </div>
                <div className="h2h-structure-card indiv-card">
                  <div className="h2h-structure-name indiv">Individual Buyer</div>
                  <div className="h2h-structure-value">{indiv.dealCertainty}</div>
                </div>
              </div>
            </div>

            <div className="h2h-section">
              <h3 className="h2h-section-title">Employee & Legacy Outcomes</h3>
              <div className="h2h-structure-grid">
                <div className="h2h-structure-card esop-card">
                  <div className="h2h-structure-name esop">ESOP / Forhemit</div>
                  <ul className="h2h-outcomes-list">
                    <li>Employees become equity owners through ESOP trust</li>
                    <li>Staff continuity is a structural priority</li>
                    <li>Seller's career legacy preserved through employee ownership</li>
                    <li>No forced re-sale timeline</li>
                  </ul>
                </div>
                <div className="h2h-structure-card indiv-card">
                  <div className="h2h-structure-name indiv">Individual Buyer</div>
                  <ul className="h2h-outcomes-list">
                    <li>New single owner — staff outcomes depend on buyer</li>
                    <li>No structural employee protections</li>
                    <li>Buyer may change compensation, hours, or staffing</li>
                    <li>Seller's legacy tied to one individual's decisions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h2h-footer">
        <span>Forhemit Transition Stewardship Co. · California PBC · Florida Program</span>
        <span>ILLUSTRATIVE · NOT TAX OR LEGAL ADVICE · March 2026</span>
      </div>
    </div>
  );
});

export default ESOPHeadToHeadForm;

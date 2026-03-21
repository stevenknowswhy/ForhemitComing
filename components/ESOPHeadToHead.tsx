import { useState } from "react";

const fmt  = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const fmtM = (n: number) => "$" + (n / 1_000_000).toFixed(3).replace(/\.?0+$/, "") + "M";

// ── DATA ──────────────────────────────────────────────────────────────────────
const DATA = {
  ebitda: 2_000_000,
  pp: 10_000_000,
  basis: 500_000,
  cgRate: 0.238,

  esop: {
    id: "esop",
    name: "ESOP / Forhemit",
    sub: "Employee Ownership Transaction",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#86efac",
    dark: "#14532d",
    grossCash: 6_590_000,
    tax: 0,
    netCash: 6_590_000,
    note: 3_410_000,
    noteType: "Full standby — $0 payments during SBA term",
    notePV: 1_993_756,
    totalValue: 8_583_756,
    taxSavings: 1_489_999,
    structure: "SBA 7(a) $5M + ESOP Leveraged Loan $2.44M + Seller Note $3.41M (standby)",
    noteCounterparty: "MSO operating company (ESOP-owned entity)",
    dealCertainty: "High — pre-assembled deal team, QofE before LOI, no individual financing risk",
  },

  indiv: {
    id: "indiv",
    name: "Individual Physician",
    sub: "SBA 7(a) Financed",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fcd34d",
    dark: "#78350f",
    grossCash: 8_500_000,
    tax: 1_921_850,
    netCash: 6_578_150,
    note: 1_500_000,
    noteType: "Active installment payments — taxed as received over ~5 years",
    noteAftertax: 1_160_850,
    totalValue: 7_739_000,
    equityRequired: 1_000_000,
    structure: "SBA 7(a) $5M + Seller Note $1.5M (active) + Buyer equity injection $1M",
    noteCounterparty: "Individual buyer — personal creditworthiness and financial stability",
    dealCertainty: "Moderate — individual buyer SBA approval, personal financials, higher fall-through risk",
  },
};

const NAVY = "#1e3a5f";
const BLUE = { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" };
const GRAY = { color: "#374151", bg: "#f9fafb", border: "#e5e7eb" };
const AMBER_T = { color: "#b45309", bg: "#fffbeb", border: "#fcd34d" };

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function Callout({ theme, title, children }: { theme: any, title?: string, children: React.ReactNode }) {
  return (
    <div style={{ padding: "12px 16px", borderRadius: 6, marginBottom: 16,
      backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
      {title && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11,
        fontWeight: 700, color: theme.color, marginBottom: 5 }}>{title}</div>}
      <div style={{ fontFamily: "Georgia, serif", fontSize: 12,
        color: theme.color, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function Section({ title, children, accent }: { title: string, children: React.ReactNode, accent?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ borderBottom: `2px solid ${accent || NAVY}`,
        paddingBottom: 5, marginBottom: 14 }}>
        <span style={{ fontFamily: "'Crimson Pro', Georgia, serif",
          fontSize: 12, fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: accent || NAVY }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ── SIDE-BY-SIDE CARD ─────────────────────────────────────────────────────────
function CompareRow({ label, esopVal, indivVal, esopNote, indivNote,
                      esopColor, indivColor, bold, highlight }: {
                      label: string | React.ReactNode, esopVal: string, indivVal: string,
                      esopNote?: React.ReactNode, indivNote?: React.ReactNode,
                      esopColor?: string, indivColor?: string, bold?: boolean, highlight?: boolean
                    }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
      gap: 12, marginBottom: 10 }}>
      <div style={{ padding: "10px 14px", borderRadius: 6,
        backgroundColor: highlight ? DATA.esop.bg : "#f9fafb",
        border: `1px solid ${highlight ? DATA.esop.border : "#e5e7eb"}` }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9,
          color: "#9ca3af", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
        <div style={{ fontFamily: "'Crimson Pro', serif",
          fontSize: bold ? 22 : 16, fontWeight: 700,
          color: esopColor || (highlight ? DATA.esop.color : "#0f172a") }}>
          {esopVal}
        </div>
        {esopNote && <div style={{ fontFamily: "Georgia, serif", fontSize: 11,
          color: "#6b7280", lineHeight: 1.4, marginTop: 3 }}>{esopNote}</div>}
      </div>
      <div style={{ padding: "10px 14px", borderRadius: 6,
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9,
          color: "#9ca3af", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
        <div style={{ fontFamily: "'Crimson Pro', serif",
          fontSize: bold ? 22 : 16, fontWeight: 700,
          color: indivColor || "#0f172a" }}>
          {indivVal}
        </div>
        {indivNote && <div style={{ fontFamily: "Georgia, serif", fontSize: 11,
          color: "#6b7280", lineHeight: 1.4, marginTop: 3 }}>{indivNote}</div>}
      </div>
    </div>
  );
}

// ── WATERFALL BAR ─────────────────────────────────────────────────────────────
function WaterfallBar({ buyer, maxVal }: { buyer: any, maxVal: number }) {
  const d = buyer.id === "esop" ? DATA.esop : DATA.indiv;
  const grossW  = (d.grossCash / maxVal) * 100;
  const taxW    = (d.tax / maxVal) * 100;
  const netW    = (d.netCash / maxVal) * 100;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12,
        fontWeight: 700, color: d.color, marginBottom: 6 }}>{d.name}</div>

      {/* Gross cash bar */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          marginBottom: 3 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10,
            color: "#6b7280" }}>Gross cash at closing</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10,
            fontWeight: 600, color: "#374151" }}>{fmt(d.grossCash)}</span>
        </div>
        <div style={{ height: 12, backgroundColor: "#e5e7eb", borderRadius: 3 }}>
          <div style={{ height: "100%", width: `${grossW}%`,
            backgroundColor: d.color, borderRadius: 3, opacity: 0.4 }} />
        </div>
      </div>

      {/* Tax */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          marginBottom: 3 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10,
            color: "#6b7280" }}>
            {d.id === "esop" ? "Capital gains tax — §1042 deferred" : "Capital gains tax @ 23.8% (paid now)"}
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10,
            fontWeight: 600,
            color: d.id === "esop" ? "#16a34a" : "#dc2626" }}>
            {d.id === "esop" ? "$0" : `(${fmt(d.tax)})`}
          </span>
        </div>
        <div style={{ height: 12, backgroundColor: "#e5e7eb", borderRadius: 3 }}>
          <div style={{ height: "100%", width: `${taxW}%`,
            backgroundColor: d.id === "esop" ? "#dcfce7" : "#fee2e2",
            borderRadius: 3, border: `1px dashed ${d.id === "esop" ? "#86efac" : "#fca5a5"}` }} />
        </div>
      </div>

      {/* Net */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between",
          marginBottom: 3 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11,
            fontWeight: 700, color: "#374151" }}>NET cash at closing</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13,
            fontWeight: 700, color: d.color }}>{fmt(d.netCash)}</span>
        </div>
        <div style={{ height: 16, backgroundColor: "#e5e7eb", borderRadius: 3 }}>
          <div style={{ height: "100%", width: `${netW}%`,
            backgroundColor: d.color, borderRadius: 3 }} />
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function HeadToHead() {
  const [tab, setTab] = useState("verdict");

  const tabs = [
    { id: "verdict",   label: "The Verdict" },
    { id: "waterfall", label: "Tax Waterfall" },
    { id: "notes",     label: "Seller Notes" },
    { id: "structure", label: "Deal Structure" },
    { id: "talking",   label: "Talking Points" },
  ];

  return (
    <div style={{ fontFamily: "Georgia, serif", backgroundColor: "#f8f9fa",
      minHeight: "100vh", padding: "24px 16px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Mono:wght@400;500;600&display=swap');`}</style>

      {/* ── HEADER ── */}
      <div style={{ maxWidth: 820, margin: "0 auto 0", backgroundColor: NAVY,
        borderRadius: "8px 8px 0 0", padding: "22px 28px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9,
              color: "#7dd3fc", letterSpacing: "0.14em",
              textTransform: "uppercase", marginBottom: 4 }}>
              Forhemit Stewardship Management Co.
            </div>
            <div style={{ fontFamily: "'Crimson Pro', serif",
              fontSize: 22, fontWeight: 700, marginBottom: 3 }}>
              ESOP vs. Individual Physician Buyer
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace",
              fontSize: 10, color: "#93c5fd" }}>
              Head-to-Head · Net Cash at Closing · After Tax
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9,
              color: "#7dd3fc", textTransform: "uppercase", marginBottom: 2 }}>
              Scenario A — Conservative
            </div>
            <div style={{ fontFamily: "'Crimson Pro', serif",
              fontSize: 22, fontWeight: 700 }}>$2.0M EBITDA</div>
            <div style={{ fontFamily: "'DM Mono', monospace",
              fontSize: 10, color: "#bfdbfe" }}>
              $10M Purchase Price · 5.0x · Florida
            </div>
          </div>
        </div>

        {/* The headline finding */}
        <div style={{ marginTop: 16, padding: "12px 16px",
          backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 6,
          borderLeft: "3px solid #34d399" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9,
            color: "#6ee7b7", textTransform: "uppercase",
            letterSpacing: "0.1em", marginBottom: 5 }}>Key Finding</div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9,
                color: "#7dd3fc", textTransform: "uppercase", marginBottom: 2 }}>
                ESOP Net Cash at Close
              </div>
              <div style={{ fontFamily: "'Crimson Pro', serif",
                fontSize: 26, fontWeight: 700, color: "#4ade80" }}>
                $6,590,000
              </div>
            </div>
            <div style={{ color: "#475569", fontSize: 20 }}>vs.</div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9,
                color: "#7dd3fc", textTransform: "uppercase", marginBottom: 2 }}>
                Individual Buyer Net Cash at Close
              </div>
              <div style={{ fontFamily: "'Crimson Pro', serif",
                fontSize: 26, fontWeight: 700, color: "#fbbf24" }}>
                $6,578,150
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9,
                color: "#6ee7b7", textTransform: "uppercase", marginBottom: 2 }}>
                ESOP Advantage
              </div>
              <div style={{ fontFamily: "'Crimson Pro', serif",
                fontSize: 26, fontWeight: 700, color: "#4ade80" }}>
                $11,850
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace",
                fontSize: 9, color: "#6ee7b7" }}>
                §1042 closes the gap entirely
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "7px 16px", fontFamily: "'DM Mono', monospace",
              fontSize: 11, fontWeight: tab === t.id ? 700 : 400,
              color: tab === t.id ? "#fff" : "#374151",
              backgroundColor: tab === t.id ? NAVY : "#e5e7eb",
              border: "none", cursor: "pointer",
              letterSpacing: "0.05em", textTransform: "uppercase" }}>{t.label}</button>
          ))}
        </div>

        <div style={{ backgroundColor: "#fff", border: "1px solid #d1d5db",
          borderRadius: "0 4px 4px 4px", padding: "28px 32px", minHeight: 500 }}>

          {/* ── VERDICT ── */}
          {tab === "verdict" && (
            <div>
              <Callout theme={{ color: "#14532d", bg: "#f0fdf4", border: "#86efac" }}
                title="The §1042 Election Closes the Gap Entirely">
                The individual buyer puts $1.91M more gross cash on the table at closing.
                The §1042 election eliminates $1.49M in immediate capital gains tax for the ESOP seller.
                The net result: both buyers deliver essentially identical cash to the seller at closing —
                a difference of $11,850 on a $10M transaction. Everything the ESOP structure offers
                beyond that — employee ownership, legacy preservation, deal certainty, total value —
                comes at zero net cost to the seller on a conservative EBITDA basis.
              </Callout>

              {/* Side-by-side headline cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: 16, marginBottom: 24 }}>
                {[DATA.esop, DATA.indiv].map(d => (
                  <div key={d.id} style={{ padding: "20px", borderRadius: 8,
                    border: `2px solid ${d.border}`, backgroundColor: d.bg }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10,
                      color: d.dark, textTransform: "uppercase",
                      letterSpacing: "0.1em", marginBottom: 4 }}>{d.sub}</div>
                    <div style={{ fontFamily: "'Crimson Pro', serif",
                      fontSize: 18, fontWeight: 700,
                      color: d.dark, marginBottom: 16 }}>{d.name}</div>
                    {[
                      ["Gross Cash at Close", fmt(d.grossCash)],
                      ["Capital Gains Tax", d.id === "esop" ? "$0 — §1042 deferred" : `(${fmt(d.tax)})`],
                      ["NET Cash at Closing", fmt(d.netCash)],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                        padding: "5px 0" }}>
                        <span style={{ fontFamily: "'DM Mono', monospace",
                          fontSize: 11, color: d.dark }}>{label}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace",
                          fontSize: label.includes("NET") ? 13 : 11,
                          fontWeight: label.includes("NET") ? 700 : 400,
                          color: label.includes("Tax") && d.id !== "esop"
                            ? "#dc2626"
                            : label.includes("Tax") ? "#16a34a" : d.dark }}>
                          {val}
                        </span>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, padding: "8px 10px",
                      backgroundColor: "rgba(0,0,0,0.04)", borderRadius: 4 }}>
                      <div style={{ fontFamily: "'DM Mono', monospace",
                        fontSize: 9, color: d.dark, textTransform: "uppercase",
                        marginBottom: 2 }}>Total Value (note incl.)</div>
                      <div style={{ fontFamily: "'Crimson Pro', serif",
                        fontSize: 18, fontWeight: 700, color: d.color }}>
                        {d.id === "esop" ? fmt(DATA.esop.totalValue) : fmt(DATA.indiv.totalValue)}
                      </div>
                      <div style={{ fontFamily: "Georgia, serif",
                        fontSize: 10, color: d.dark, marginTop: 2 }}>
                        {d.id === "esop"
                          ? `Net cash + seller note PV (${fmt(DATA.esop.notePV)} @ 5%/11yr)`
                          : `Net cash + note after-tax (${fmt(DATA.indiv.noteAftertax)})`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Section title="What the Numbers Don't Show">
                {[
                  {
                    label: "The §1042 advantage compounds",
                    color: "#16a34a",
                    body: "The ESOP seller invests $6.59M with no tax drag from day one. The individual-buyer seller invests $6.58M after paying $1.92M in tax. Over time, the ESOP seller's capital compounds on a larger base — and if the QRP is held until death, the deferred capital gains tax is eliminated entirely through the step-up in basis."
                  },
                  {
                    label: "Employee outcomes are not equivalent",
                    color: "#1d4ed8",
                    body: "An individual physician buyer acquires the practice for their own benefit. Staff continuity depends entirely on the new owner's preferences. In an ESOP acquisition, employees become equity participants — structurally, not as a contractual promise."
                  },
                  {
                    label: "Seller note counterparty risk is materially different",
                    color: "#d97706",
                    body: "The individual buyer's seller note ($1.5M, active payments) is backed by one person's financial stability and the continued success of the practice under new ownership. The ESOP seller note ($3.41M, full standby) is an obligation of the MSO operating entity — a company with a stewardship team and COOP infrastructure in place. Not the same counterparty."
                  },
                  {
                    label: "Deal fall-through risk",
                    color: "#dc2626",
                    body: "Individual physician buyers face SBA approval contingencies tied to their personal financial profile. If the buyer's personal financials don't underwrite cleanly, the deal falls through. The ESOP deal team is assembled before LOI with pre-qualified lenders. Financing contingency risk is materially lower."
                  },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom: 14,
                    paddingBottom: 14, borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace",
                      fontSize: 12, fontWeight: 700,
                      color: item.color, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontFamily: "Georgia, serif",
                      fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
                      {item.body}
                    </div>
                  </div>
                ))}
              </Section>
            </div>
          )}

          {/* ── TAX WATERFALL ── */}
          {tab === "waterfall" && (
            <div>
              <Callout theme={BLUE} title="How §1042 Closes a $1.91M Gross Cash Gap">
                The individual buyer offers $1.91M more gross cash at closing.
                Federal capital gains tax (20%) plus NIIT (3.8%) consumes $1.92M of that
                immediately. The §1042 election defers that entire obligation for the ESOP seller.
                The result: nearly identical net cash at closing, with the tax difference
                of $1.49M working in the ESOP seller's favor.
              </Callout>

              <Section title="Gross-to-Net Waterfall">
                <WaterfallBar buyer={DATA.esop} maxVal={10_500_000} />
                <WaterfallBar buyer={DATA.indiv} maxVal={10_500_000} />
              </Section>

              <Section title="The §1042 Math">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: 12, marginBottom: 16 }}>
                  {[
                    { label: "Gain on cash proceeds (ESOP)", val: fmt(DATA.esop.grossCash - DATA.basis * DATA.esop.grossCash / DATA.pp), color: "#374151" },
                    { label: "Tax at 23.8% — without §1042", val: fmt(DATA.esop.taxSavings), color: "#dc2626" },
                    { label: "Tax with §1042 election", val: "$0 at closing", color: "#16a34a" },
                    { label: "Immediate tax savings", val: fmt(DATA.esop.taxSavings), color: "#16a34a" },
                  ].map(item => (
                    <div key={item.label} style={{ padding: "12px 14px",
                      borderRadius: 6, backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace",
                        fontSize: 10, color: "#9ca3af",
                        textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontFamily: "'Crimson Pro', serif",
                        fontSize: 18, fontWeight: 700, color: item.color }}>{item.val}</div>
                    </div>
                  ))}
                </div>
                <Callout theme={GRAY}>
                  The §1042 election defers — it does not eliminate — capital gains tax.
                  Tax becomes due when the Qualified Replacement Property (QRP) is sold.
                  If the seller holds QRP until death, the stepped-up basis at death eliminates
                  the deferred gain entirely. Seller must confirm all §1042 mechanics with
                  qualified tax counsel. Florida has no state income tax — sellers in other
                  states face additional state tax calculations.
                </Callout>
              </Section>

              <Section title="Individual Buyer — Installment Sale Treatment">
                <Callout theme={AMBER_T}>
                  The individual buyer's seller note ($1.5M) uses installment sale treatment —
                  the seller is taxed as payments are received, not all at closing.
                  The gross profit ratio (~95%) means approximately 95 cents of every dollar
                  received on the note is taxable gain at the applicable cap gains rate.
                  After-tax value of the $1.5M note is approximately $1.16M.
                  The note is also backed by an individual buyer's personal financial stability
                  and the practice's continued performance under new ownership.
                </Callout>
              </Section>
            </div>
          )}

          {/* ── SELLER NOTES ── */}
          {tab === "notes" && (
            <div>
              <Callout theme={BLUE} title="Two Very Different Instruments">
                Both structures include a seller note, but the size, timing, counterparty,
                and risk profile are fundamentally different. The comparison is not just
                about which note is larger — it's about what the seller is actually owed,
                by whom, and when.
              </Callout>

              <CompareRow
                label="Seller Note Amount"
                esopVal={fmt(DATA.esop.note)}
                indivVal={fmt(DATA.indiv.note)}
                esopNote="34.1% of purchase price"
                indivNote="15.0% of purchase price"
                bold
              />
              <CompareRow
                label="Payment Structure"
                esopVal="$0 during SBA term"
                indivVal="Active — monthly payments"
                esopNote="Full standby per SOP 50 10 8 · payments begin after SBA loan retires (~yr 10)"
                indivNote="Seller receives principal + interest starting immediately post-close"
              />
              <CompareRow
                label="Counterparty"
                esopVal="MSO Operating Company"
                indivVal="Individual physician buyer"
                esopNote="ESOP-owned entity with Forhemit stewardship infrastructure and COOP in place"
                indivNote="Single individual — default risk tied to personal finances and practice performance"
              />
              <CompareRow
                label="Tax Treatment"
                esopVal="Deferred — taxed when received"
                indivVal="Installment sale — taxed as received"
                esopNote="Taxed at long-term cap gains rate when payments begin in year 10+"
                indivNote="~95% of each payment is taxable gain; after-tax value ~$1.16M"
              />
              <CompareRow
                label="Net Present Value"
                esopVal={fmt(DATA.esop.notePV)}
                indivVal={fmt(DATA.indiv.noteAftertax)}
                esopNote="PV at 5% discount rate over ~11-year midpoint"
                indivNote="After installment-sale tax; assumes note paid on schedule"
                bold
              />

              <div style={{ marginTop: 20 }}>
                <Section title="Which Note Is Actually Better for the Seller?">
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 13,
                    color: "#374151", lineHeight: 1.75 }}>
                    The individual buyer's note is smaller ($1.5M vs. $3.41M) but begins paying
                    immediately. The ESOP note is larger but deferred ~10 years and carries no
                    active payments during that period.
                  </div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 13,
                    color: "#374151", lineHeight: 1.75, marginTop: 12 }}>
                    On a present value basis, the ESOP note ($1.99M PV) exceeds the individual
                    buyer's note ($1.16M after-tax) by $833,000 — meaning the ESOP delivers
                    more total value when both notes are counted on a fair comparison basis.
                    The ESOP seller who needs current income from the note is better served
                    by a structure that converts part of the standby note to non-standby
                    subordinated debt — a question for ESOP counsel pre-LOI.
                  </div>
                </Section>
              </div>
            </div>
          )}

          {/* ── DEAL STRUCTURE ── */}
          {tab === "structure" && (
            <div>
              <Section title="Capital Structure Comparison">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: 16, marginBottom: 20 }}>
                  {[DATA.esop, DATA.indiv].map(d => (
                    <div key={d.id} style={{ padding: "16px", borderRadius: 8,
                      border: `1px solid ${d.border}`,
                      backgroundColor: d.bg }}>
                      <div style={{ fontFamily: "'DM Mono', monospace",
                        fontSize: 11, fontWeight: 700, color: d.dark,
                        marginBottom: 12 }}>{d.name}</div>
                      <div style={{ fontFamily: "Georgia, serif",
                        fontSize: 12, color: d.dark, lineHeight: 1.6 }}>
                        {d.structure}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Deal Certainty">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[DATA.esop, DATA.indiv].map(d => (
                    <div key={d.id} style={{ padding: "14px 16px", borderRadius: 6,
                      backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace",
                        fontSize: 11, fontWeight: 700, color: d.color,
                        marginBottom: 8 }}>{d.name}</div>
                      <div style={{ fontFamily: "Georgia, serif",
                        fontSize: 12, color: "#374151", lineHeight: 1.65 }}>
                        {d.dealCertainty}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Employee & Legacy Outcomes">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ padding: "14px 16px", borderRadius: 6,
                    backgroundColor: DATA.esop.bg,
                    border: `1px solid ${DATA.esop.border}` }}>
                    <div style={{ fontFamily: "'DM Mono', monospace",
                      fontSize: 11, fontWeight: 700,
                      color: DATA.esop.dark, marginBottom: 8 }}>ESOP / Forhemit</div>
                    {["Employees become equity owners through ESOP trust",
                      "Staff continuity is a structural priority — not a promise",
                      "Seller's career legacy preserved through employee ownership",
                      "No forced re-sale — the ESOP doesn't have an exit timeline",
                      "Forhemit COOP ensures operational continuity post-close",
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                        <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
                        <span style={{ fontFamily: "Georgia, serif",
                          fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "14px 16px", borderRadius: 6,
                    backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace",
                      fontSize: 11, fontWeight: 700,
                      color: DATA.indiv.dark, marginBottom: 8 }}>Individual Buyer</div>
                    {["New single owner — staff outcomes depend on buyer",
                      "No structural employee protections post-close",
                      "Buyer may change compensation, hours, or staffing",
                      "Practice culture shifts to reflect new owner's preferences",
                      "Seller's legacy tied to the decisions of one individual",
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                        <span style={{ color: "#6b7280" }}>—</span>
                        <span style={{ fontFamily: "Georgia, serif",
                          fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            </div>
          )}

          {/* ── TALKING POINTS ── */}
          {tab === "talking" && (
            <div>
              <Section title="When the Seller Says: 'The Individual Buyer Is Offering More Cash'">
                <Callout theme={GRAY} title="The response — direct, not defensive">
                  {"They're right about gross cash. They're not right about net cash."}
                </Callout>
                {[
                  {
                    prompt: "\"The individual buyer is putting $8.5M on the table. You're only offering $6.59M.\"",
                    response: "That's correct on gross cash. But before you spend it, the IRS takes $1.92M at closing — capital gains plus the net investment income tax. After that, you're left with $6.58M. Under the ESOP structure, the §1042 election defers that entire tax obligation. You walk away with $6.59M in your account at closing — essentially the same number. The difference between the two offers, after tax, is $11,850 on a $10 million transaction."
                  },
                  {
                    prompt: "\"What about the seller note? I'd rather have a smaller active note than a larger deferred one.\"",
                    response: "That's a fair point and worth modeling directly. The individual buyer's $1.5M note starts paying immediately — but each payment is taxed at ~95% gross profit ratio, so the after-tax value of that note is about $1.16M. The ESOP note is $3.41M, deferred until year 10 — but on a present value basis at 5%, that's $1.99M of value today. The ESOP delivers more total value including the notes. If you need current income from the note, that's a structuring question we can address with ESOP counsel before LOI."
                  },
                  {
                    prompt: "\"What if the individual buyer can't get SBA approval or their financing falls through?\"",
                    response: "That's real deal risk. Individual buyers are underwritten on their personal financials, and SBA approval for an individual can fail for reasons that have nothing to do with the practice. The ESOP deal team — lenders, trustee, QofE — is pre-assembled and pre-qualified before we bring you a LOI. The financing contingency risk is materially lower."
                  },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 20, paddingBottom: 20,
                    borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ padding: "10px 14px", marginBottom: 10,
                      backgroundColor: "#f0f6ff",
                      border: "1px solid #bfdbfe", borderRadius: 6,
                      fontFamily: "Georgia, serif", fontSize: 12,
                      color: "#1e40af", fontStyle: "italic" }}>
                      {item.prompt}
                    </div>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 13,
                      color: "#374151", lineHeight: 1.75, paddingLeft: 4 }}>
                      {item.response}
                    </div>
                  </div>
                ))}
              </Section>

              <Section title="The One Sentence That Reframes the Entire Conversation"
                accent="#16a34a">
                <div style={{ padding: "20px 24px", borderRadius: 8,
                  backgroundColor: DATA.esop.bg,
                  border: `2px solid ${DATA.esop.border}` }}>
                  <div style={{ fontFamily: "'Crimson Pro', serif",
                    fontSize: 18, fontWeight: 700,
                    color: DATA.esop.dark, lineHeight: 1.5, fontStyle: "italic" }}>
                    "At conservative EBITDA, the ESOP delivers the same net cash at closing as an
                    individual buyer — after the §1042 election closes the tax gap —
                    and your employees become owners instead of working for someone else."
                  </div>
                </div>
              </Section>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 820, margin: "12px auto 0",
        display: "flex", justifyContent: "space-between",
        flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontFamily: "'DM Mono', monospace",
          fontSize: 10, color: "#9ca3af" }}>
          Forhemit Stewardship Management Co. · California PBC · San Francisco, CA
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace",
          fontSize: 10, color: "#9ca3af" }}>
          ILLUSTRATIVE · NOT TAX OR LEGAL ADVICE · March 2026
        </span>
      </div>
    </div>
  );
}
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Forhemit — 120-Day ESOP Transaction Calendar</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy:       #1E2D45;
  --navy-lt:    #2A3E5E;
  --brass:      #C4954A;
  --brass-dim:  rgba(196,149,74,0.10);
  --cream:      #FDFAF6;
  --bg:         #F4F0E8;
  --surface:    #EDE8DF;
  --text:       #1A1714;
  --text-mid:   #3D3830;
  --text-dim:   #7A7068;
  --rule:       rgba(26,23,20,0.09);
  --rule-mid:   rgba(26,23,20,0.16);

  --forhemit:   #8A6A2A; --forhemit-bg: rgba(138,106,42,0.10); --forhemit-bd: rgba(138,106,42,0.32);
  --broker:     #1E2D45; --broker-bg: rgba(30,45,69,0.08);     --broker-bd: rgba(30,45,69,0.28);
  --owner:      #2A5C3A; --owner-bg: rgba(42,92,58,0.09);      --owner-bd: rgba(42,92,58,0.30);
  --lender:     #5C2A45; --lender-bg: rgba(92,42,69,0.09);     --lender-bd: rgba(92,42,69,0.30);
  --trustee:    #2A455C; --trustee-bg: rgba(42,69,92,0.09);     --trustee-bd: rgba(42,69,92,0.30);
  --legal:      #5C452A; --legal-bg: rgba(92,69,42,0.09);       --legal-bd: rgba(92,69,42,0.30);
  --cpa:        #3A2A5C; --cpa-bg: rgba(58,42,92,0.09);         --cpa-bd: rgba(58,42,92,0.30);
  --gate:       #7A2020; --gate-bg: rgba(122,32,32,0.08);        --gate-bd: rgba(122,32,32,0.40);

  --p1: #B8965A; --p2: #6A9E6A; --p3: #5A7EA0; --p4: #9A6A8A; --p5: #5A8A8A;

  --ff-d: 'Cormorant Garamond', Georgia, serif;
  --ff-b: 'Jost', system-ui, sans-serif;
}

html, body { height: 100%; font-family: var(--ff-b); background: var(--bg); color: var(--text); }

body {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ═══ HEADER ═══ */
.app-header {
  height: 56px;
  background: var(--navy);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  flex-shrink: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-logo {
  font-family: var(--ff-d);
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #EDE8E0;
}

.header-subtitle {
  font-size: 0.58rem;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(237,232,224,0.35);
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.nav-arrow {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255,255,255,0.12);
  background: none;
  color: rgba(237,232,224,0.6);
  cursor: pointer;
  border-radius: 3px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-family: var(--ff-b);
}

.nav-arrow:hover { border-color: var(--brass); color: var(--brass); }

.nav-month-label {
  font-family: var(--ff-d);
  font-size: 1.1rem;
  font-weight: 400;
  color: #EDE8E0;
  min-width: 160px;
  text-align: center;
}

.nav-today {
  font-family: var(--ff-b);
  font-size: 0.58rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brass);
  background: none;
  border: 1px solid rgba(196,149,74,0.35);
  padding: 0.3rem 0.8rem;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s;
  margin-left: 0.5rem;
}

.nav-today:hover { background: rgba(196,149,74,0.12); }

/* ═══ CONTROLS BAR ═══ */
.controls-bar {
  background: var(--cream);
  border-bottom: 1px solid var(--rule-mid);
  padding: 0.6rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  overflow-x: auto;
}

.controls-bar::-webkit-scrollbar { display: none; }

.ctrl-label {
  font-size: 0.52rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-dim);
  flex-shrink: 0;
}

.ctrl-sep {
  width: 1px;
  height: 22px;
  background: var(--rule-mid);
  flex-shrink: 0;
}

.role-chip {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.6rem;
  border: 1px solid var(--rule);
  background: none;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.15s;
  flex-shrink: 0;
  font-family: var(--ff-b);
}

.role-chip:hover { background: var(--surface); }

.role-chip.active { border-color: currentColor; }

.rc-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

.rc-label {
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.role-chip.inactive { opacity: 0.35; }
.role-chip.inactive .rc-label { text-decoration: line-through; }

.phase-chips {
  display: flex;
  gap: 0.35rem;
  margin-left: auto;
  flex-shrink: 0;
}

.phase-chip {
  font-family: var(--ff-b);
  font-size: 0.56rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.22rem 0.55rem;
  border-radius: 2px;
  color: white;
  cursor: pointer;
  transition: opacity 0.15s;
  border: none;
  white-space: nowrap;
}

.phase-chip:hover { opacity: 0.8; }

.start-date-ctrl {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.start-date-ctrl label {
  font-size: 0.56rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  white-space: nowrap;
}

.start-date-ctrl input {
  font-family: var(--ff-b);
  font-size: 0.68rem;
  padding: 0.25rem 0.4rem;
  border: 1px solid var(--rule-mid);
  border-radius: 3px;
  background: var(--bg);
  color: var(--text);
  width: 130px;
}

/* ═══ CALENDAR GRID ═══ */
.calendar-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 1rem 3rem;
  -webkit-overflow-scrolling: touch;
}

.cal-month {
  margin-bottom: 2rem;
}

.cal-month-header {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
  padding: 0 0.2rem;
}

.cmh-name {
  font-family: var(--ff-d);
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--text);
}

.cmh-year {
  font-size: 0.7rem;
  font-weight: 300;
  color: var(--text-dim);
}

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--rule-mid);
  margin-bottom: 2px;
}

.cal-wd {
  font-size: 0.56rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-align: center;
  padding: 0.4rem 0;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--rule);
  border: 1px solid var(--rule);
  border-radius: 4px;
  overflow: hidden;
}

.cal-cell {
  background: var(--cream);
  min-height: 100px;
  padding: 0.35rem 0.4rem;
  position: relative;
  transition: background 0.12s;
  cursor: default;
}

.cal-cell.outside {
  background: var(--bg);
}

.cal-cell.outside .cc-num { color: var(--text-dim); opacity: 0.35; }

.cal-cell.has-events:hover { background: #F7F3EC; }

.cc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}

.cc-num {
  font-size: 0.72rem;
  font-weight: 400;
  color: var(--text-mid);
  line-height: 1;
}

.cc-day-badge {
  font-size: 0.48rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 0.12rem 0.35rem;
  border-radius: 2px;
  line-height: 1;
}

.cc-today .cc-num {
  background: var(--navy);
  color: white;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 500;
}

.cc-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cc-ev {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 4px;
  border-radius: 2px;
  border-left: 2px solid;
  cursor: pointer;
  transition: all 0.1s;
  min-height: 18px;
}

.cc-ev:hover {
  filter: brightness(0.95);
  transform: translateX(1px);
}

.cc-ev-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cc-ev-text {
  font-size: 0.58rem;
  font-weight: 500;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cc-ev.is-gate {
  border-left-width: 3px;
  animation: gatePulse 3s ease-in-out infinite;
}

@keyframes gatePulse {
  0%, 100% { box-shadow: none; }
  50%      { box-shadow: inset 0 0 0 1px rgba(122,32,32,0.15); }
}

.cc-more {
  font-size: 0.52rem;
  font-weight: 500;
  color: var(--brass);
  cursor: pointer;
  padding: 1px 4px;
  letter-spacing: 0.05em;
}

.cc-more:hover { text-decoration: underline; }

/* Phase stripe at top of cell */
.cc-phase-stripe {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
}

/* Gate day marker */
.cc-gate-diamond {
  width: 7px;
  height: 7px;
  background: var(--gate);
  transform: rotate(45deg);
  position: absolute;
  top: 6px;
  right: 6px;
}

/* ═══ DETAIL PANEL ═══ */
.detail-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(26,23,20,0.25);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 300;
}

.detail-backdrop.open { opacity: 1; pointer-events: auto; }

.detail-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  max-width: 90vw;
  background: var(--cream);
  transform: translateX(100%);
  transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
  z-index: 400;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(26,23,20,0.12);
}

.detail-panel.open { transform: translateX(0); }

.dp-header {
  padding: 1.2rem 1.4rem 0.8rem;
  border-bottom: 1px solid var(--rule);
  flex-shrink: 0;
}

.dp-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-dim);
  font-size: 1.1rem;
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.15s;
}

.dp-close:hover { color: var(--text); }

.dp-date-label {
  font-size: 0.56rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 0.3rem;
}

.dp-title {
  font-family: var(--ff-d);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--text);
  line-height: 1.15;
  padding-right: 2rem;
}

.dp-phase-tag {
  display: inline-block;
  font-size: 0.54rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.18rem 0.55rem;
  border-radius: 2px;
  margin-top: 0.5rem;
  color: white;
}

.dp-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.4rem 2rem;
  -webkit-overflow-scrolling: touch;
}

.dp-gate-box {
  background: var(--gate-bg);
  border: 1px solid var(--gate-bd);
  border-left: 3px solid var(--gate);
  padding: 0.9rem 1.1rem;
  border-radius: 3px;
  margin-bottom: 1.2rem;
}

.dpg-label {
  font-size: 0.52rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gate);
  margin-bottom: 0.25rem;
}

.dpg-title {
  font-family: var(--ff-d);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gate);
  margin-bottom: 0.3rem;
}

.dpg-desc {
  font-size: 0.72rem;
  font-weight: 300;
  color: var(--text-mid);
  line-height: 1.65;
}

.dp-event {
  border-left: 3px solid;
  border-radius: 3px;
  padding: 0.8rem 1rem;
  margin-bottom: 0.6rem;
  animation: dpFadeUp 0.2s ease both;
}

@keyframes dpFadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.dpe-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.dpe-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

.dpe-role {
  font-size: 0.52rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.dpe-type {
  font-size: 0.52rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.dpe-title {
  font-family: var(--ff-d);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--text);
  line-height: 1.25;
  margin-bottom: 0.3rem;
}

.dpe-desc {
  font-size: 0.73rem;
  font-weight: 300;
  color: var(--text-mid);
  line-height: 1.65;
}

.dp-divider {
  font-size: 0.52rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-dim);
  padding: 0.6rem 0 0.4rem;
  border-bottom: 1px solid var(--rule);
  margin-bottom: 0.6rem;
}

/* ═══ RESPONSIVE ═══ */
@media (max-width: 900px) {
  .cal-cell { min-height: 80px; }
  .header-subtitle { display: none; }
  .phase-chips { display: none; }
}

@media (max-width: 640px) {
  .app-header { padding: 0 0.75rem; }
  .controls-bar { padding: 0.5rem 0.75rem; }
  .calendar-wrap { padding: 0.5rem 0.5rem 3rem; }
  .cal-cell { min-height: 64px; padding: 0.25rem 0.25rem; }
  .cc-ev-text { font-size: 0.5rem; }
  .cc-num { font-size: 0.62rem; }
  .cc-day-badge { font-size: 0.42rem; }
  .nav-month-label { min-width: 120px; font-size: 0.95rem; }
  .cmh-name { font-size: 1.2rem; }
  .detail-panel { width: 100%; max-width: 100%; }
}

/* scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(26,23,20,0.12); border-radius: 3px; }
</style>
</head>
<body>

<header class="app-header">
  <div class="header-left">
    <span class="header-logo">Forhemit</span>
    <span class="header-subtitle">120-Day ESOP Transaction Calendar</span>
  </div>
  <div class="header-nav">
    <button class="nav-arrow" id="prevMonth">‹</button>
    <span class="nav-month-label" id="monthLabel"></span>
    <button class="nav-arrow" id="nextMonth">›</button>
    <button class="nav-today" id="todayBtn">Today</button>
  </div>
</header>

<div class="controls-bar" id="controlsBar">
  <div class="start-date-ctrl">
    <label>Day 1 =</label>
    <input type="date" id="startDateInput">
  </div>
  <span class="ctrl-sep"></span>
  <span class="ctrl-label">Roles</span>
  <div id="roleChips"></div>
  <span class="ctrl-sep"></span>
  <div class="phase-chips" id="phaseChips"></div>
</div>

<div class="calendar-wrap" id="calWrap"></div>

<!-- Detail panel -->
<div class="detail-backdrop" id="detailBackdrop"></div>
<div class="detail-panel" id="detailPanel">
  <div class="dp-header">
    <button class="dp-close" id="dpClose">✕</button>
    <div class="dp-date-label" id="dpDateLabel"></div>
    <div class="dp-title" id="dpTitle"></div>
    <div id="dpPhaseTag"></div>
  </div>
  <div class="dp-scroll" id="dpScroll"></div>
</div>

<script>
// ═══════════════════════════════════════
// DATA — same dataset as the list/swimlane view
// ═══════════════════════════════════════
const PHASES = [
  { id:1, name:'Ignition',   start:1,   end:14,  color:'#B8965A', label:'01 Ignition' },
  { id:2, name:'Build',      start:15,  end:45,  color:'#6A9E6A', label:'02 Build' },
  { id:3, name:'Validate',   start:46,  end:75,  color:'#5A7EA0', label:'03 Validate' },
  { id:4, name:'Close Prep', start:76,  end:105, color:'#9A6A8A', label:'04 Close Prep' },
  { id:5, name:'Closing',    start:106, end:120, color:'#5A8A8A', label:'05 Closing' },
];

const GATES = {
  45:{ name:'Gate 1 — FMV Adequacy Letter', desc:'The trustee\'s appraiser must confirm the purchase price is fair to the ESOP under ERISA. No letter = no LOI. Full stop.' },
  60:{ name:'Gate 2 — SBA Commitment Letter', desc:'Lender issues formal commitment defining the capital stack. No legal document drafting begins before this arrives.' },
  75:{ name:'Gate 3 — QofE EBITDA Within 15% of LOI', desc:'Adjusted EBITDA must be within 15% of the LOI assumption. Outside that band: stop, renegotiate the structure, then draft.' },
  90:{ name:'Gate 4 — Trustee COOP Sign-off', desc:'Forhemit delivers this gate. The trustee formally accepts the COOP, confirming the business is operationally viable post-close.' },
};

const ROLE_META = {
  forhemit: { label:'Forhemit',   color:'#8A6A2A', bg:'rgba(138,106,42,0.10)', bd:'rgba(138,106,42,0.32)' },
  broker:   { label:'Broker',     color:'#1E2D45', bg:'rgba(30,45,69,0.08)',    bd:'rgba(30,45,69,0.28)' },
  owner:    { label:'Owner',      color:'#2A5C3A', bg:'rgba(42,92,58,0.09)',    bd:'rgba(42,92,58,0.30)' },
  lender:   { label:'Lender',     color:'#5C2A45', bg:'rgba(92,42,69,0.09)',    bd:'rgba(92,42,69,0.30)' },
  trustee:  { label:'Trustee',    color:'#2A455C', bg:'rgba(42,69,92,0.09)',    bd:'rgba(42,69,92,0.30)' },
  legal:    { label:'Legal',      color:'#5C452A', bg:'rgba(92,69,42,0.09)',    bd:'rgba(92,69,42,0.30)' },
  cpa:      { label:'CPA / QofE', color:'#3A2A5C', bg:'rgba(58,42,92,0.09)',   bd:'rgba(58,42,92,0.30)' },
};

const EVENTS = [
  {day:1,dur:1,role:'owner',type:'Milestone',title:'$25K Retainer Wire',short:'Retainer wire',desc:'The $25,000 non-refundable retainer wire initiates the Forhemit engagement. Covers COOP pre-assessment, deal structuring coordination, and advisor assembly from Day 1 through closing.'},
  {day:1,dur:7,role:'owner',type:'Deliverable',title:'Upload: Tax Returns & Financials',short:'Upload financials',desc:'Last 3 years business tax returns + year-end financials + current YTD P&L, balance sheet, cash flow + AR and AP agings.'},
  {day:1,dur:14,role:'forhemit',type:'Action',title:'COOP Intake — Engagement Begins',short:'COOP intake',desc:'Forhemit retained Day 1. COOP intake across all four tracks begins immediately. Early findings directly inform the FMV appraisal, lender package, and trustee\'s initial risk assessment.'},
  {day:1,dur:10,role:'lender',type:'Action',title:'SBA Credit Pre-Screen',short:'Credit pre-screen',desc:'Lender credit pre-screen: industry fit, collateral mix, goodwill percentage, deal size vs. SBA limits. Output: Credit fit memo.'},
  {day:3,dur:10,role:'broker',type:'Action',title:'Marketability Analysis',short:'Marketability analysis',desc:'Broker prepares marketability analysis and preliminary valuation range. Seller expectations check: books, management depth, landlord situation, key contracts.'},
  {day:6,dur:8,role:'owner',type:'Deliverable',title:'Upload: Entity Docs & Org Chart',short:'Entity docs',desc:'Legal entity documents + detailed org chart with titles and reporting lines.'},
  {day:6,dur:8,role:'legal',type:'Action',title:'Corporate Clean-up',short:'Corporate clean-up',desc:'Sell-side counsel: entity verification, minute book, options/warrants review, contract and legal risk inventory.'},
  {day:8,dur:6,role:'owner',type:'Deliverable',title:'Upload: Bank Accounts & Debt',short:'Bank/debt docs',desc:'List of all bank accounts and existing loans/lines with latest statements and full debt schedule.'},
  {day:10,dur:4,role:'owner',type:'Deliverable',title:'Upload: Contracts & Key Customers',short:'Contracts upload',desc:'Key customer list + top vendor list + major contracts with change-of-control clauses.'},
  {day:10,dur:12,role:'legal',type:'Action',title:'Initial ERISA Review',short:'ERISA review',desc:'ESOP/ERISA counsel reviews corporate structure, preliminary ESOP plan design, ERISA compliance, and 409(p) testing considerations.'},
  {day:12,dur:2,role:'owner',type:'Deliverable',title:'Upload: Facilities & Tech',short:'Facilities/tech',desc:'Real estate info + technology inventory.'},
  {day:13,dur:1,role:'owner',type:'Deliverable',title:'Upload: HR Data & Employee Census',short:'HR data',desc:'Employee census + summary of benefits + employment/non-compete agreements + list of key people.'},
  {day:7,dur:7,role:'forhemit',type:'Deadline',title:'Trustee & ERISA Counsel Seated',short:'Team seated',desc:'Independent ESOP trustee retained by Day 7. ESOP/ERISA counsel engaged by Day 7. SBA lender confirmed with ESOP-specific vetting call by Day 10.'},
  {day:1,dur:7,role:'broker',type:'Action',title:'Confirm Listing Agreement Covers ESOP',short:'Listing check',desc:'Verify listing agreement covers ESOP transaction. Commission rate applies regardless of buyer type.'},
  {day:14,dur:1,role:'forhemit',type:'Milestone',title:'Phase 1 Gate Check',short:'Phase 1 check',desc:'Trustee seated. ERISA counsel engaged. SBA lender confirmed. Entity structure decided. COOP intake complete.'},
  {day:15,dur:30,role:'forhemit',type:'Action',title:'Full COOP Plan Draft — All 4 Tracks',short:'COOP drafted',desc:'Continuity plans written for all 4 tracks: people, systems, financial systems, governance.'},
  {day:15,dur:11,role:'legal',type:'Action',title:'ERISA Structure Memo',short:'ERISA memo',desc:'ERISA counsel issues preliminary structure memo confirming compliance, 409(p) testing, §1042 issues.'},
  {day:15,dur:6,role:'owner',type:'Deliverable',title:'Upload: Monthly Financials',short:'Monthly financials',desc:'Monthly financials for last 12–24 months + detailed revenue by customer for 3 years.'},
  {day:18,dur:17,role:'lender',type:'Action',title:'Underwriting File Assembly',short:'Underwriting file',desc:'Lender assembles underwriting file. Credit memo drafted and committee date set before Day 45 Gate 1.'},
  {day:18,dur:7,role:'owner',type:'Deliverable',title:'Upload: Add-backs & Projections',short:'Add-backs',desc:'Schedule of owner add-backs and normalizations + 2–3 year forecast P&L with key assumptions.'},
  {day:18,dur:1,role:'forhemit',type:'Deadline',title:'Trustee Orders FMV Appraisal',short:'FMV ordered',desc:'The trustee — not the seller, not Forhemit — selects and directs the appraiser. ERISA independence requirement.'},
  {day:20,dur:15,role:'legal',type:'Action',title:'ESOP Plan Documents Drafted',short:'Plan docs',desc:'Draft ESOP Plan Document, Trust Agreement, Summary Plan Description, corporate governance documents.'},
  {day:25,dur:8,role:'owner',type:'Deliverable',title:'Upload: Loan Docs & Litigation',short:'Loan/litigation',desc:'Copies of all existing loan agreements, guarantees, UCCs + litigation, claims, regulatory issues.'},
  {day:25,dur:20,role:'broker',type:'Action',title:'Financing Coordination',short:'Financing coord.',desc:'Broker coordinates lender approach, structures capital stack, analyzes financing terms.'},
  {day:30,dur:16,role:'forhemit',type:'Action',title:'Post-Close CEO / GM Identification',short:'GM search',desc:'Forhemit identifies post-close management candidates. Trustee requires a named, contracted person before Gate 4.'},
  {day:35,dur:10,role:'cpa',type:'Action',title:'Tax Structure Finalization',short:'Tax structure',desc:'CPA finalizes tax flow-through analysis, §1042 rollover structuring, entity confirmation.'},
  {day:35,dur:5,role:'owner',type:'Deliverable',title:'Upload: Final Data Refresh for Appraiser',short:'Data refresh',desc:'Most recent month-end close, updated AR aging, material changes since initial submission.'},
  {day:45,dur:1,role:'trustee',type:'Gate',title:'GATE 1 — FMV Adequacy Letter',short:'⬥ Gate 1',desc:'Trustee\'s appraiser confirms purchase price is fair to the ESOP. No letter = no LOI.',gate:true},
  {day:46,dur:30,role:'forhemit',type:'Action',title:'COOP Delivery to Trustee & Q&A',short:'COOP to trustee',desc:'Full COOP package submitted. Forhemit leads trustee review on operational readiness.'},
  {day:46,dur:7,role:'legal',type:'Action',title:'LOI ERISA Review',short:'LOI review',desc:'ERISA counsel LOI review complete before execution.'},
  {day:48,dur:5,role:'owner',type:'Deliverable',title:'Owner Decisions: Structure & Post-Close Role',short:'Structure decisions',desc:'Owner feedback on structure + post-close role confirmation.'},
  {day:50,dur:20,role:'legal',type:'Action',title:'PSA Drafted (ERISA Counsel)',short:'PSA drafted',desc:'ERISA counsel drafts the Purchase and Sale Agreement.'},
  {day:52,dur:15,role:'broker',type:'Action',title:'LOI Negotiation with Trustee & Lender',short:'LOI negotiation',desc:'Broker runs LOI negotiation loop with trustee and lender input.'},
  {day:55,dur:10,role:'owner',type:'Deliverable',title:'Upload: SBA Forms & QofE Clarifications',short:'SBA forms',desc:'SBA forms and personal items + additional QofE clarifications.'},
  {day:55,dur:15,role:'cpa',type:'Action',title:'QofE Report Preparation',short:'QofE prep',desc:'CPA prepares Quality of Earnings report. Adjusted EBITDA calculation.'},
  {day:55,dur:5,role:'forhemit',type:'Deadline',title:'TPA Engaged',short:'TPA engaged',desc:'Third Party Administrator engaged for annual plan administration.'},
  {day:52,dur:1,role:'owner',type:'Milestone',title:'LOI Executed',short:'LOI signed',desc:'Price, structure, capital stack locked. The deal becomes real.'},
  {day:60,dur:1,role:'lender',type:'Gate',title:'GATE 2 — SBA Commitment Letter',short:'⬥ Gate 2',desc:'Lender issues formal commitment defining the capital stack.',gate:true},
  {day:70,dur:5,role:'owner',type:'Deliverable',title:'QofE Follow-up & Key Customer Confirms',short:'QofE follow-up',desc:'Final answers for QofE follow-up requests + key customer confirmations.'},
  {day:75,dur:1,role:'cpa',type:'Gate',title:'GATE 3 — QofE EBITDA Validated',short:'⬥ Gate 3',desc:'QofE adjusted EBITDA must be within 15% of the LOI assumption.',gate:true},
  {day:76,dur:30,role:'trustee',type:'Action',title:'Trustee COOP Review & Counsel Review',short:'Trustee review',desc:'Trustee reviews operational readiness, key-man mitigation, post-close plans.'},
  {day:80,dur:5,role:'owner',type:'Deliverable',title:'Decisions: ESOP Plan Design & Governance',short:'Plan design',desc:'Owner decisions on ESOP plan design + desired governance post-close.'},
  {day:80,dur:20,role:'legal',type:'Action',title:'Seller Note, PSA Resolution & Closing Prep',short:'Legal close prep',desc:'Seller note and subordination agreement drafted. PSA business-point resolution by Day 88.'},
  {day:82,dur:18,role:'broker',type:'Action',title:'Final Terms Negotiation',short:'Final terms',desc:'Broker negotiates final purchase price adjustments, working capital targets, closing conditions.'},
  {day:85,dur:15,role:'lender',type:'Action',title:'SBA Closing Checklist Issued',short:'SBA checklist',desc:'SBA closing checklist issued listing all required items. Final credit sign-off.'},
  {day:88,dur:7,role:'owner',type:'Deliverable',title:'PSA Redlines & Contract Consents',short:'PSA redlines',desc:'Redline feedback on PSA business points + remaining consents.'},
  {day:90,dur:1,role:'forhemit',type:'Gate',title:'GATE 4 — Trustee COOP Sign-off',short:'⬥ Gate 4',desc:'Forhemit delivers Gate 4. Trustee confirms operational viability post-close.',gate:true},
  {day:92,dur:8,role:'owner',type:'Deliverable',title:'Management Agreement Decisions',short:'Mgmt. agreements',desc:'Owner decisions on management and key-employee agreements.'},
  {day:100,dur:5,role:'owner',type:'Deliverable',title:'Upload: Final Cap Table & Census',short:'Final cap table',desc:'Final cap table and share allocation + employee census in final form.'},
  {day:100,dur:1,role:'forhemit',type:'Deadline',title:'Day 121 Operational Readiness Confirmed',short:'D121 readiness',desc:'Every system login transferred, bank authority updated, payroll confirmed. Written confirmation to trustee.'},
  {day:106,dur:15,role:'forhemit',type:'Action',title:'Day 121 Readiness & Stewardship Activation',short:'Stewardship active',desc:'Final deliverable under $25,000 retainer. Post-close stewardship activates Day 121.'},
  {day:110,dur:8,role:'legal',type:'Action',title:'Plan Implementation & IRS Filing',short:'IRS filing',desc:'Legal files ESOP plan with IRS, completes trust formation.'},
  {day:110,dur:3,role:'owner',type:'Deliverable',title:'Wire Instructions Verified by Phone',short:'Wire verified',desc:'Signed wire instructions confirmed by live phone call. Email alone is insufficient.'},
  {day:112,dur:3,role:'owner',type:'Deliverable',title:'Final Sources & Uses Sign-off',short:'S&U sign-off',desc:'Final sign-off on sources & uses / closing statement.'},
  {day:115,dur:5,role:'cpa',type:'Action',title:'Closing Accounting & 1042 Docs',short:'Closing accounting',desc:'CPA prepares closing balance sheet, final purchase price adjustments, §1042 documentation.'},
  {day:118,dur:2,role:'broker',type:'Milestone',title:'Commission & Closing Statement Review',short:'Commission review',desc:'Broker reviews closing statement and confirms commission mechanics.'},
  {day:120,dur:1,role:'owner',type:'Gate',title:'CLOSING DAY',short:'⬥ Closing Day',desc:'Seller executes all closing documents. Funds wired same day.',gate:true},
  {day:120,dur:1,role:'forhemit',type:'Milestone',title:'Close Complete — 100% Employee Owned',short:'Close complete',desc:'ESOP plan adopted. Trustee takes title. Every eligible employee is now an owner.'},
  {day:120,dur:1,role:'broker',type:'Milestone',title:'Commission Paid from Proceeds',short:'Commission paid',desc:'Broker commission paid from SBA loan proceeds at closing.'},
  {day:120,dur:1,role:'lender',type:'Milestone',title:'SBA Loan Proceeds Wired',short:'Funds wired',desc:'SBA loan proceeds disbursed. All closing costs settled.'},
];

const ROLES = ['forhemit','broker','owner','lender','trustee','legal','cpa'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MAX_VISIBLE_EVENTS = 3;

// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════
let startDate = new Date();
startDate.setDate(startDate.getDate() + 1); // default: tomorrow
let viewMonth = new Date(startDate);
let activeRoles = new Set(ROLES);

// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════
function dayToDate(dayNum) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + dayNum - 1);
  return d;
}

function dateToDay(date) {
  const diff = Math.round((date - startDate) / 86400000) + 1;
  return diff;
}

function phaseOf(day) {
  return PHASES.find(p => day >= p.start && day <= p.end) || null;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isToday(date) {
  return sameDay(date, new Date());
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
}

// ═══════════════════════════════════════
// BUILD CONTROLS
// ═══════════════════════════════════════
function buildControls() {
  // Start date input
  const inp = document.getElementById('startDateInput');
  inp.value = startDate.toISOString().split('T')[0];
  inp.addEventListener('change', () => {
    startDate = new Date(inp.value + 'T00:00:00');
    viewMonth = new Date(startDate);
    render();
  });

  // Role chips
  const container = document.getElementById('roleChips');
  container.style.display = 'flex';
  container.style.gap = '0.3rem';
  ROLES.forEach(role => {
    const rm = ROLE_META[role];
    const btn = document.createElement('button');
    btn.className = 'role-chip active';
    btn.dataset.role = role;
    btn.style.color = rm.color;
    btn.innerHTML = `<span class="rc-dot" style="background:${rm.color}"></span><span class="rc-label">${rm.label}</span>`;
    btn.onclick = () => {
      if (activeRoles.has(role)) {
        if (activeRoles.size === 1) return;
        activeRoles.delete(role);
        btn.classList.remove('active');
        btn.classList.add('inactive');
      } else {
        activeRoles.add(role);
        btn.classList.add('active');
        btn.classList.remove('inactive');
      }
      render();
    };
    container.appendChild(btn);
  });

  // Phase chips
  const pc = document.getElementById('phaseChips');
  PHASES.forEach(phase => {
    const btn = document.createElement('button');
    btn.className = 'phase-chip';
    btn.style.background = phase.color;
    btn.textContent = phase.label;
    btn.onclick = () => {
      const target = dayToDate(phase.start);
      viewMonth = new Date(target.getFullYear(), target.getMonth(), 1);
      render();
      // Scroll to the month
      setTimeout(() => {
        const el = document.querySelector(`[data-month-key="${target.getFullYear()}-${target.getMonth()}"]`);
        if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
      }, 50);
    };
    pc.appendChild(btn);
  });

  // Navigation
  document.getElementById('prevMonth').onclick = () => {
    viewMonth.setMonth(viewMonth.getMonth() - 1);
    render();
  };
  document.getElementById('nextMonth').onclick = () => {
    viewMonth.setMonth(viewMonth.getMonth() + 1);
    render();
  };
  document.getElementById('todayBtn').onclick = () => {
    viewMonth = new Date();
    viewMonth.setDate(1);
    render();
  };
}

// ═══════════════════════════════════════
// BUILD EVENT INDEX (date → events)
// ═══════════════════════════════════════
function buildEventIndex() {
  const index = {};
  EVENTS.forEach(ev => {
    const date = dayToDate(ev.day);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (!index[key]) index[key] = [];
    index[key].push(ev);
  });
  return index;
}

// ═══════════════════════════════════════
// RENDER
// ═══════════════════════════════════════
function render() {
  const wrap = document.getElementById('calWrap');
  wrap.innerHTML = '';
  const eventIndex = buildEventIndex();

  // Determine which months to show (cover Day 1 through Day 120)
  const firstDate = dayToDate(1);
  const lastDate  = dayToDate(120);
  const startMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
  const endMonth   = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);

  // Update header label
  document.getElementById('monthLabel').textContent =
    MONTH_NAMES[viewMonth.getMonth()] + ' ' + viewMonth.getFullYear();

  // Render from viewMonth -1 to viewMonth +1 (3 months visible)
  const monthsToShow = [];
  for (let m = -1; m <= 1; m++) {
    const d = new Date(viewMonth);
    d.setMonth(d.getMonth() + m);
    monthsToShow.push(new Date(d.getFullYear(), d.getMonth(), 1));
  }

  // Actually: render all months that overlap with the 120-day window
  const allMonths = [];
  let cursor = new Date(startMonth);
  while (cursor <= endMonth) {
    allMonths.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  allMonths.forEach(monthStart => {
    const year  = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDow = monthStart.getDay(); // 0=Sun

    const monthEl = document.createElement('div');
    monthEl.className = 'cal-month';
    monthEl.dataset.monthKey = `${year}-${month}`;

    // Header
    const hdr = document.createElement('div');
    hdr.className = 'cal-month-header';
    hdr.innerHTML = `<span class="cmh-name">${MONTH_NAMES[month]}</span><span class="cmh-year">${year}</span>`;
    monthEl.appendChild(hdr);

    // Weekday labels
    const wdRow = document.createElement('div');
    wdRow.className = 'cal-weekdays';
    DAY_NAMES.forEach(d => {
      const wd = document.createElement('div');
      wd.className = 'cal-wd';
      wd.textContent = d;
      wdRow.appendChild(wd);
    });
    monthEl.appendChild(wdRow);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'cal-grid';

    // Leading empty cells
    const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayOfMonth = i - firstDow + 1;
      const cell = document.createElement('div');
      cell.className = 'cal-cell';

      if (dayOfMonth < 1 || dayOfMonth > daysInMonth) {
        cell.classList.add('outside');
        // Show adjacent month dates
        const adjDate = new Date(year, month, dayOfMonth);
        cell.innerHTML = `<div class="cc-top"><span class="cc-num">${adjDate.getDate()}</span></div>`;
        grid.appendChild(cell);
        continue;
      }

      const cellDate = new Date(year, month, dayOfMonth);
      const transDay = dateToDay(cellDate);
      const key = `${year}-${month}-${dayOfMonth}`;
      const dayEvents = (eventIndex[key] || []).filter(e => activeRoles.has(e.role));
      const phase = (transDay >= 1 && transDay <= 120) ? phaseOf(transDay) : null;
      const isGateDay = GATES[transDay];

      if (dayEvents.length > 0) cell.classList.add('has-events');
      if (isToday(cellDate)) cell.classList.add('cc-today');

      // Phase stripe
      let stripeHtml = '';
      if (phase) {
        stripeHtml = `<div class="cc-phase-stripe" style="background:${phase.color}"></div>`;
      }

      // Gate diamond
      let gateHtml = '';
      if (isGateDay) {
        gateHtml = `<div class="cc-gate-diamond"></div>`;
      }

      // Day badge
      let badgeHtml = '';
      if (transDay >= 1 && transDay <= 120) {
        const bgColor = phase ? phase.color + '18' : 'transparent';
        const txtColor = phase ? phase.color : '#7A7068';
        badgeHtml = `<span class="cc-day-badge" style="background:${bgColor};color:${txtColor}">D${transDay}</span>`;
      }

      // Events
      let eventsHtml = '';
      const visible = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
      const overflow = dayEvents.length - MAX_VISIBLE_EVENTS;

      visible.forEach(ev => {
        const rm = ROLE_META[ev.role];
        const borderColor = ev.gate ? '#7A2020' : rm.color;
        const bg = ev.gate ? 'rgba(122,32,32,0.08)' : rm.bg;
        const txtColor = ev.gate ? '#7A2020' : rm.color;
        eventsHtml += `<div class="cc-ev ${ev.gate ? 'is-gate' : ''}" style="border-color:${borderColor};background:${bg}" data-eid="${ev.day}-${ev.role}" onclick="openDetail(${ev.day}, '${ev.role}', '${ev.title.replace(/'/g,"\\'")}')"><span class="cc-ev-text" style="color:${txtColor}">${ev.short}</span></div>`;
      });

      if (overflow > 0) {
        eventsHtml += `<span class="cc-more" onclick="openDayDetail(${transDay})">+${overflow} more</span>`;
      }

      cell.innerHTML = `
        ${stripeHtml}
        ${gateHtml}
        <div class="cc-top">
          <span class="cc-num">${dayOfMonth}</span>
          ${badgeHtml}
        </div>
        <div class="cc-events">${eventsHtml}</div>
      `;

      if (dayEvents.length > 0) {
        cell.ondblclick = () => openDayDetail(transDay);
      }

      grid.appendChild(cell);
    }

    monthEl.appendChild(grid);
    wrap.appendChild(monthEl);
  });
}

// ═══════════════════════════════════════
// DETAIL PANEL
// ═══════════════════════════════════════
function openDetail(dayNum, role, title) {
  const ev = EVENTS.find(e => e.day === dayNum && e.role === role && e.title === title.replace(/\\'/g, "'"));
  if (!ev) {
    // Fallback: first event matching day + role
    const fallback = EVENTS.find(e => e.day === dayNum && e.role === role);
    if (fallback) return openDetailForEvent(fallback);
    return openDayDetail(dayNum);
  }
  openDetailForEvent(ev);
}

function openDetailForEvent(ev) {
  const panel = document.getElementById('detailPanel');
  const backdrop = document.getElementById('detailBackdrop');
  const scroll = document.getElementById('dpScroll');
  const phase = phaseOf(ev.day);
  const calDate = dayToDate(ev.day);

  document.getElementById('dpDateLabel').textContent = `Day ${ev.day} of 120 — ${formatDate(calDate)}`;
  document.getElementById('dpTitle').textContent = ev.title;
  document.getElementById('dpPhaseTag').innerHTML = phase
    ? `<span class="dp-phase-tag" style="background:${phase.color}">${phase.label}</span>`
    : '';

  scroll.innerHTML = '';

  // Gate box
  if (ev.gate && GATES[ev.day]) {
    const g = GATES[ev.day];
    scroll.innerHTML += `
      <div class="dp-gate-box">
        <div class="dpg-label">⬥ Hard Gate — Process Stops If Not Cleared</div>
        <div class="dpg-title">${g.name}</div>
        <div class="dpg-desc">${g.desc}</div>
      </div>
    `;
  }

  // Primary event
  const rm = ROLE_META[ev.role];
  scroll.innerHTML += buildEventCard(ev, rm, 0);

  // Other events on same day
  const others = EVENTS.filter(e => e.day === ev.day && e !== ev && activeRoles.has(e.role));
  if (others.length > 0) {
    scroll.innerHTML += `<div class="dp-divider">Also on Day ${ev.day}</div>`;
    others.forEach((other, i) => {
      const orm = ROLE_META[other.role];
      scroll.innerHTML += buildEventCard(other, orm, i + 1);
    });
  }

  panel.classList.add('open');
  backdrop.classList.add('open');
}

function openDayDetail(dayNum) {
  const dayEvents = EVENTS.filter(e => e.day === dayNum && activeRoles.has(e.role));
  if (dayEvents.length === 0) return;
  if (dayEvents.length === 1) return openDetailForEvent(dayEvents[0]);

  const panel = document.getElementById('detailPanel');
  const backdrop = document.getElementById('detailBackdrop');
  const scroll = document.getElementById('dpScroll');
  const phase = phaseOf(dayNum);
  const calDate = dayToDate(dayNum);

  document.getElementById('dpDateLabel').textContent = `Day ${dayNum} of 120 — ${formatDate(calDate)}`;
  document.getElementById('dpTitle').textContent = `${dayEvents.length} Events`;
  document.getElementById('dpPhaseTag').innerHTML = phase
    ? `<span class="dp-phase-tag" style="background:${phase.color}">${phase.label}</span>`
    : '';

  scroll.innerHTML = '';

  // Gate
  if (GATES[dayNum]) {
    const g = GATES[dayNum];
    scroll.innerHTML += `
      <div class="dp-gate-box">
        <div class="dpg-label">⬥ Hard Gate</div>
        <div class="dpg-title">${g.name}</div>
        <div class="dpg-desc">${g.desc}</div>
      </div>
    `;
  }

  dayEvents.forEach((ev, i) => {
    const rm = ROLE_META[ev.role];
    scroll.innerHTML += buildEventCard(ev, rm, i);
  });

  panel.classList.add('open');
  backdrop.classList.add('open');
}

function buildEventCard(ev, rm, index) {
  const borderColor = ev.gate ? '#7A2020' : rm.color;
  const bg = ev.gate ? 'rgba(122,32,32,0.06)' : rm.bg;
  return `
    <div class="dp-event" style="border-color:${borderColor};background:${bg};animation-delay:${index*0.04}s">
      <div class="dpe-header">
        <span class="dpe-dot" style="background:${rm.color}"></span>
        <span class="dpe-role" style="color:${rm.color}">${rm.label}</span>
        <span class="dpe-type">${ev.type}</span>
      </div>
      <div class="dpe-title">${ev.title}</div>
      <div class="dpe-desc">${ev.desc}</div>
    </div>
  `;
}

function closeDetail() {
  document.getElementById('detailPanel').classList.remove('open');
  document.getElementById('detailBackdrop').classList.remove('open');
}

document.getElementById('detailBackdrop').onclick = closeDetail;
document.getElementById('dpClose').onclick = closeDetail;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
buildControls();
render();
</script>
</body>
</html>
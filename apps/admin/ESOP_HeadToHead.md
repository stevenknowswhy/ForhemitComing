<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ESOP Cost Reference Calculator - Forhemit Transition Stewardship</title>
    <style>
        :root {
            --primary: #1a1a1a;
            --secondary: #4a4a4a;
            --accent: #2c5282;
            --border: #d1d5db;
            --bg-alt: #f3f4f6;
            --danger: #dc2626;
            --warning-bg: #fef3c7;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.4;
            color: var(--primary);
            background: white;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        @media print {
            body {
                padding: 0;
                font-size: 10pt;
            }
            .no-print {
                display: none !important;
            }
            input {
                border: none !important;
                background: transparent !important;
                padding: 0 !important;
            }
            .calculated {
                font-weight: bold !important;
            }
        }
        
        header {
            border-bottom: 3px solid var(--primary);
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        h1 {
            font-size: 18pt;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .subtitle {
            font-size: 11pt;
            color: var(--secondary);
            font-style: italic;
        }
        
        .controls {
            background: var(--bg-alt);
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            border: 1px solid var(--border);
        }
        
        .control-group {
            display: inline-block;
            margin-right: 30px;
            margin-bottom: 10px;
        }
        
        label {
            font-weight: 600;
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: block;
            margin-bottom: 4px;
            color: var(--secondary);
        }
        
        input[type="number"], input[type="text"], select {
            padding: 6px 8px;
            border: 1px solid var(--border);
            border-radius: 3px;
            font-family: inherit;
            font-size: 10pt;
            width: 150px;
        }
        
        input[type="number"] {
            text-align: right;
            font-family: 'Courier New', monospace;
        }
        
        input:read-only, input:disabled {
            background: var(--bg-alt);
            color: var(--primary);
            font-weight: 600;
            border-color: transparent;
        }
        
        .currency::before {
            content: "$";
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--secondary);
        }
        
        .input-wrap {
            position: relative;
            display: inline-block;
        }
        
        .input-wrap input {
            padding-left: 20px;
            width: 130px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            font-size: 10pt;
        }
        
        th {
            background: var(--primary);
            color: white;
            text-align: left;
            padding: 10px;
            font-weight: 600;
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        td {
            padding: 8px 10px;
            border-bottom: 1px solid var(--border);
            vertical-align: top;
        }
        
        tr:nth-child(even) {
            background: #fafafa;
        }
        
        .category-header {
            background: var(--bg-alt) !important;
            border-top: 2px solid var(--primary);
        }
        
        .category-header td {
            font-weight: 700;
            font-size: 11pt;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding-top: 15px;
        }
        
        .subtotal {
            background: #e5e7eb !important;
            font-weight: 700;
        }
        
        .grand-total {
            background: var(--primary) !important;
            color: white !important;
            font-size: 12pt;
            font-weight: 700;
        }
        
        .grand-total input {
            background: transparent !important;
            color: white !important;
            font-weight: 700;
            font-size: 12pt;
        }
        
        .col-item {
            width: 25%;
        }
        
        .col-amount {
            width: 15%;
            text-align: right;
        }
        
        .col-calc {
            width: 15%;
            text-align: right;
        }
        
        .col-note {
            width: 45%;
            font-size: 9pt;
            color: var(--secondary);
            line-height: 1.3;
        }
        
        .warning-box {
            background: var(--warning-bg);
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            font-size: 9pt;
        }
        
        .warning-box h3 {
            color: #92400e;
            margin-bottom: 8px;
            font-size: 10pt;
        }
        
        .lost-benefit {
            color: var(--danger);
            font-weight: 700;
        }
        
        .stage-selector {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .stage-btn {
            padding: 8px 16px;
            border: 1px solid var(--border);
            background: white;
            cursor: pointer;
            border-radius: 3px;
            font-size: 9pt;
            font-weight: 600;
        }
        
        .stage-btn.active {
            background: var(--accent);
            color: white;
            border-color: var(--accent);
        }
        
        .note {
            font-size: 8pt;
            color: var(--secondary);
            font-style: italic;
            margin-top: 10px;
        }
        
        .print-btn {
            background: var(--accent);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10pt;
            font-weight: 600;
            float: right;
        }
        
        .print-btn:hover {
            background: #1e3a8a;
        }
        
        .highlight {
            background: #fef3c7;
            padding: 2px 4px;
            border-radius: 3px;
        }
    </style>
<base target="_blank">
</head>
<body>

<header>
    <h1>Forhemit Transition Stewardship Co.</h1>
    <div class="subtitle">ESOP Cost Reference Calculator — Version 2 (Interactive)</div>
    <button class="print-btn no-print" onclick="window.print()">Print / Save PDF</button>
</header>

<div class="controls no-print">
    <div class="control-group">
        <label>Purchase Price Illustration</label>
        <div class="input-wrap">
            <input type="number" id="purchasePrice" value="10000000" step="100000" onchange="calculateAll()">
        </div>
    </div>
    
    <div class="control-group">
        <label>Deal Stage Scenario</label>
        <div class="stage-selector">
            <button type="button" class="stage-btn active" onclick="setStage('preloi')" id="btn-preloi">Pre-LOI</button>
            <button type="button" class="stage-btn" onclick="setStage('mid')" id="btn-mid">Mid-Diligence</button>
            <button type="button" class="stage-btn" onclick="setStage('postfmv')" id="btn-postfmv">Post-FMV</button>
            <button type="button" class="stage-btn" onclick="setStage('custom')" id="btn-custom">Custom</button>
        </div>
    </div>
    
    <div class="control-group">
        <label>Federal Capital Gains Rate</label>
        <div class="input-wrap">
            <input type="number" id="taxRate" value="23.8" step="0.1" onchange="calculateAll()" style="width: 80px;">
            <span style="margin-left: 5px;">%</span>
        </div>
    </div>
</div>

<table id="costTable">
    <thead>
        <tr>
            <th class="col-item">Cost Item</th>
            <th class="col-amount">Low Est.</th>
            <th class="col-amount">High Est.</th>
            <th class="col-calc">Current</th>
            <th class="col-note">Notes for Broker & Seller CPA</th>
        </tr>
    </thead>
    
    <tbody>
        <!-- SUNK COSTS -->
        <tr class="category-header">
            <td colspan="5">
                A. Sunk Costs — Spent on ESOP-specific work; zero value to any conventional buyer
            </td>
        </tr>
        
        <tr data-stage="preloi">
            <td><strong>Forhemit Engagement Retainer</strong><br>Pre-flight deposit + COOP assessment</td>
            <td class="input-wrap"><input type="number" id="forhemit_low" value="25000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="forhemit_high" value="25000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="forhemit_curr" value="25000" readonly class="calculated"></td>
            <td>Non-refundable. Converts to switch fee. Compensates Forhemit for COOP team deployment and committed deal time from Day 1.</td>
        </tr>
        
        <tr data-stage="mid">
            <td><strong>Independent ESOP Trustee</strong><br>ERISA fiduciary</td>
            <td class="input-wrap"><input type="number" id="trustee_low" value="22000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="trustee_high" value="55000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="trustee_curr" value="0" readonly class="calculated"></td>
            <td>ERISA-mandated fiduciary acting solely for the employee trust. No role exists in PE or individual buyer transactions. Engaged post-LOI.</td>
        </tr>
        
        <tr data-stage="mid">
            <td><strong>ERISA Fair Market Value Appraisal</strong><br>Engaged by trustee; DOL/ERISA standard</td>
            <td class="input-wrap"><input type="number" id="appraisal_low" value="18000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="appraisal_high" value="40000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="appraisal_curr" value="0" readonly class="calculated"></td>
            <td>Conducted under ERISA/DOL independence standards. Not a §409A valuation. A PE buyer uses proprietary methodology; cannot use this format.</td>
        </tr>
        
        <tr data-stage="postfmv">
            <td><strong>ESOP/ERISA Company Counsel</strong><br>Plan documents, §1042 compliance, DOL filings</td>
            <td class="input-wrap"><input type="number" id="counsel_low" value="40000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="counsel_high" value="55000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="counsel_curr" value="0" readonly class="calculated"></td>
            <td>ESOP plan documents, §1042 compliance opinion, ERISA trust agreement. 80-90% ESOP-specific. General M&A framework has modest transferable value.</td>
        </tr>
        
        <tr class="subtotal">
            <td><strong>Subtotal — True Sunk Costs if Switch Occurs</strong></td>
            <td><input type="number" id="sunk_low_total" value="105000" readonly></td>
            <td><input type="number" id="sunk_high_total" value="175000" readonly></td>
            <td><input type="number" id="sunk_current" value="25000" readonly class="calculated"></td>
            <td>This is the honest switching cost. Not $300K+. SBA and doc stamp costs below are never incurred unless the ESOP closes.</td>
        </tr>
        
        <!-- STRUCTURAL COSTS -->
        <tr class="category-header">
            <td colspan="5">
                B. Structural Cost Differences — Avoided (not lost) when switching; never paid pre-close
            </td>
        </tr>
        
        <tr>
            <td><strong>SBA 7(a) Guarantee Fee</strong><br>FY2026: 3.5% first $1M + 3.75% above $1M</td>
            <td class="input-wrap"><input type="number" id="sba_low" value="120000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="sba_high" value="175000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="sba_current" value="0" readonly class="calculated" style="background: #e8f5e9;"></td>
            <td>Paid from SBA loan proceeds on closing day only. If conventional buyer wins, ESOP loan never funds and this fee is never incurred. Not at risk during diligence.</td>
        </tr>
        
        <tr>
            <td><strong>Florida Documentary Stamp Tax on Debt</strong><br>$0.35 per $100 of note principal</td>
            <td class="input-wrap"><input type="number" id="stamp_low" value="30000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="stamp_high" value="42000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="stamp_current" value="0" readonly class="calculated" style="background: #e8f5e9;"></td>
            <td>Imposed on promissory notes at recording. If PE or cash buyer wins, no SBA debt is recorded and this tax is never paid. Only appears at closing table if ESOP closes.</td>
        </tr>
        
        <tr class="subtotal">
            <td><strong>Subtotal — Structural Costs Avoided if Conventional Buyer Wins</strong></td>
            <td><input type="number" id="struct_low_total" value="150000" readonly></td>
            <td><input type="number" id="struct_high_total" value="217000" readonly></td>
            <td><input type="number" id="struct_current" value="0" readonly style="background: #c8e6c9; font-weight: bold;"></td>
            <td>These costs are never incurred unless the ESOP closes. Presenting them as sunk costs in broker conversations is factually incorrect.</td>
        </tr>
        
        <!-- UNIVERSAL COSTS -->
        <tr class="category-header">
            <td colspan="5">
                C. Universal Costs — Incurred in any sale; work product transfers to any buyer
            </td>
        </tr>
        
        <tr>
            <td><strong>Sell-Side Quality of Earnings</strong><br>Physician practice specialist; required pre-LOI</td>
            <td class="input-wrap"><input type="number" id="qoe_low" value="18000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="qoe_high" value="28000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="qoe_current" value="0" readonly class="calculated" style="background: #e3f2fd;"></td>
            <td>Fully transferable. Accelerates PE diligence. If PE buyer wins, QofE is an asset that speeds their process. Frame as insurance for the seller.</td>
        </tr>
        
        <tr>
            <td><strong>Seller's Own Legal Counsel</strong><br>LOI review, deal protection, closing doc review</td>
            <td class="input-wrap"><input type="number" id="legal_low" value="15000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="legal_high" value="30000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="legal_current" value="0" readonly class="calculated" style="background: #e3f2fd;"></td>
            <td>Every seller needs independent counsel in any transaction. LOI review and closing document review fully applicable to conventional buyer process.</td>
        </tr>
        
        <tr>
            <td><strong>Seller's CPA / Tax Advisor</strong><br>Tax planning, §1042 analysis, capital gains modeling</td>
            <td class="input-wrap"><input type="number" id="cpa_low" value="8000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="cpa_high" value="20000" onchange="calculateAll()"></td>
            <td class="input-wrap"><input type="number" id="cpa_current" value="0" readonly class="calculated" style="background: #e3f2fd;"></td>
            <td>On ESOP track: models §1042 eligibility. On conventional track: same CPA has already modeled capital gains exposure. No work is wasted.</td>
        </tr>
        
        <!-- LOST TAX BENEFIT -->
        <tr class="category-header">
            <td colspan="5" style="background: #fee2e2; color: #991b1b;">
                D. Lost Tax Benefit — Not a dollar outlay; a deferred benefit that disappears with a conventional buyer
            </td>
        </tr>
        
        <tr style="background: #fef2f2;">
            <td><strong>§1042 Federal Capital Gains Tax Deferral</strong><br>C-corp seller; Florida (no state income tax)</td>
            <td class="input-wrap"><input type="number" id="tax_low" value="2380000" readonly></td>
            <td class="input-wrap"><input type="number" id="tax_high" value="2380000" readonly></td>
            <td class="input-wrap"><input type="number" id="tax_current" value="2380000" readonly class="calculated lost-benefit" style="background: #fecaca; color: #7f1d1d;"></td>
            <td>The §1042 election allows deferral of federal capital gains tax by reinvesting in Qualified Replacement Property. <strong>Illustration: 23.8% on $10M full-gain sale = $2.38M tax deferred.</strong> Lost entirely with any conventional buyer.</td>
        </tr>
        
        <tr class="grand-total">
            <td colspan="3"><strong>NET ECONOMIC IMPACT OF SWITCHING TO CONVENTIONAL BUYER</strong><br><span style="font-size: 9pt; font-weight: normal;">(Sunk Costs Incurred + Lost Tax Benefit - Structural Costs Avoided)</span></td>
            <td><input type="number" id="net_impact" value="2405000" readonly></td>
            <td style="font-size: 9pt; font-weight: normal;">This number—not the professional fees—is why switching is almost never economically rational for a Florida seller at the same price.</td>
        </tr>
    </tbody>
</table>

<div class="warning-box">
    <h3>⚠ C-Corp Conversion — Critical Warning for Two-Track Strategies</h3>
    <p>If an S-corp practice converts to C-corp to qualify for §1042 and a conventional buyer then wins, the conversion is irreversible. The seller is now a C-corp, §1042 is not triggered, and Built-In Gains (BIG) tax may apply to any asset sale within 5 years of conversion — potentially making the seller worse off than if no conversion had occurred.</p>
    <p><strong>Rule:</strong> Do not initiate C-corp conversion on a two-track strategy. Confirm the ESOP track is the primary path before any conversion. Seller's CPA must model BIG tax exposure first.</p>
</div>

<div class="note">
    <strong>Assumptions:</strong> Florida program • $10M purchase price illustration • Assumes full gain (zero cost basis) for maximum transparency • SBA 7(a) guarantee fee calculation: 3.5% on first $1M guaranteed + 3.75% on amount above $1M • Federal rate includes 20% LTCG + 3.8% NIIT
</div>

<script>
let currentStage = 'preloi';

function formatMoney(num) {
    return Math.round(num).toLocaleString();
}

function setStage(stage) {
    currentStage = stage;
    document.querySelectorAll('.stage-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + stage).classList.add('active');
    
    // Auto-populate based on stage from document reference:
    // Pre-LOI: Days 1-10 (Deposit only: ~$25k)
    // Mid-Diligence: Days 21-45 (Deposit + Trustee + Appraisal + partial counsel: $60k-$105k)
    // Post-FMV: Days 46-60 (All ESOP-specific fees: $105k-$175k)
    
    if (stage === 'preloi') {
        document.getElementById('forhemit_curr').value = document.getElementById('forhemit_low').value;
        document.getElementById('trustee_curr').value = 0;
        document.getElementById('appraisal_curr').value = 0;
        document.getElementById('counsel_curr').value = 0;
    } else if (stage === 'mid') {
        document.getElementById('forhemit_curr').value = document.getElementById('forhemit_low').value;
        document.getElementById('trustee_curr').value = Math.round((parseFloat(document.getElementById('trustee_low').value) + parseFloat(document.getElementById('trustee_high').value)) / 2);
        document.getElementById('appraisal_curr').value = Math.round((parseFloat(document.getElementById('appraisal_low').value) + parseFloat(document.getElementById('appraisal_high').value)) / 2);
        document.getElementById('counsel_curr').value = Math.round(parseFloat(document.getElementById('counsel_low').value) * 0.3); // 30% of counsel work done
    } else if (stage === 'postfmv') {
        document.getElementById('forhemit_curr').value = document.getElementById('forhemit_low').value;
        document.getElementById('trustee_curr').value = document.getElementById('trustee_high').value;
        document.getElementById('appraisal_curr').value = document.getElementById('appraisal_high').value;
        document.getElementById('counsel_curr').value = document.getElementById('counsel_high').value;
    } else if (stage === 'custom') {
        // Allow user to manually edit current values
        document.getElementById('trustee_curr').removeAttribute('readonly');
        document.getElementById('appraisal_curr').removeAttribute('readonly');
        document.getElementById('counsel_curr').removeAttribute('readonly');
        document.getElementById('trustee_curr').style.background = 'white';
        document.getElementById('appraisal_curr').style.background = 'white';
        document.getElementById('counsel_curr').style.background = 'white';
        return;
    }
    
    // Lock calculated fields if not custom
    if (stage !== 'custom') {
        ['trustee_curr', 'appraisal_curr', 'counsel_curr'].forEach(id => {
            document.getElementById(id).setAttribute('readonly', true);
            document.getElementById(id).style.background = '';
        });
    }
    
    calculateAll();
}

function calculateAll() {
    const price = parseFloat(document.getElementById('purchasePrice').value) || 0;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    
    // Calculate Lost Tax Benefit based on current price and rate
    const lostBenefit = Math.round(price * (taxRate / 100));
    document.getElementById('tax_low').value = lostBenefit;
    document.getElementById('tax_high').value = lostBenefit;
    document.getElementById('tax_current').value = lostBenefit;
    
    // Get current values (either auto-set by stage or manually entered)
    const forhemit = parseFloat(document.getElementById('forhemit_curr').value) || 0;
    const trustee = parseFloat(document.getElementById('trustee_curr').value) || 0;
    const appraisal = parseFloat(document.getElementById('appraisal_curr').value) || 0;
    const counsel = parseFloat(document.getElementById('counsel_curr').value) || 0;
    
    // Universal costs are always present in any sale (transferable)
    const qoe = Math.round((parseFloat(document.getElementById('qoe_low').value) + parseFloat(document.getElementById('qoe_high').value)) / 2);
    const legal = Math.round((parseFloat(document.getElementById('legal_low').value) + parseFloat(document.getElementById('legal_high').value)) / 2);
    const cpa = Math.round((parseFloat(document.getElementById('cpa_low').value) + parseFloat(document.getElementById('cpa_high').value)) / 2);
    
    document.getElementById('qoe_current').value = qoe;
    document.getElementById('legal_current').value = legal;
    document.getElementById('cpa_current').value = cpa;
    
    // Sunk costs subtotal
    const sunkTotal = forhemit + trustee + appraisal + counsel;
    document.getElementById('sunk_current').value = sunkTotal;
    
    // Structural costs (avoided if switch - shown as negative or separate)
    const sba = parseFloat(document.getElementById('sba_low').value) || 0; // Using low estimate for "avoided" calc
    const stamp = parseFloat(document.getElementById('stamp_low').value) || 0;
    document.getElementById('sba_current').value = 0; // Not incurred if switching
    document.getElementById('stamp_current').value = 0; // Not incurred if switching
    
    // Calculate totals
    document.getElementById('struct_current').value = 0; // These are avoided, so 0 cost
    
    // Net Impact = Sunk Costs + Lost Tax Benefit (Structural are avoided, Universal are transferable/sunk in either case but not lost)
    // Actually per document: The "True sunk cost" is the subtotal from Section A. 
    // The Universal costs (C) are incurred in any sale and transfer to buyer, so they are not "switching costs" per se.
    // The calculation should be: Sunk Costs (A) + Lost Tax Benefit (D) = Total Cost of Switching
    // Structural costs (B) are avoided, so they reduce the pain (but since they were never paid, they don't offset the loss)
    
    const netImpact = sunkTotal + lostBenefit;
    document.getElementById('net_impact').value = netImpact;
    
    // Update subtotals for low/high ranges
    const sunkLow = parseFloat(document.getElementById('forhemit_low').value) + 
                    parseFloat(document.getElementById('trustee_low').value) + 
                    parseFloat(document.getElementById('appraisal_low').value) + 
                    parseFloat(document.getElementById('counsel_low').value);
    const sunkHigh = parseFloat(document.getElementById('forhemit_high').value) + 
                     parseFloat(document.getElementById('trustee_high').value) + 
                     parseFloat(document.getElementById('appraisal_high').value) + 
                     parseFloat(document.getElementById('counsel_high').value);
    
    document.getElementById('sunk_low_total').value = sunkLow;
    document.getElementById('sunk_high_total').value = sunkHigh;
    
    const structLow = parseFloat(document.getElementById('sba_low').value) + parseFloat(document.getElementById('stamp_low').value);
    const structHigh = parseFloat(document.getElementById('sba_high').value) + parseFloat(document.getElementById('stamp_high').value);
    
    document.getElementById('struct_low_total').value = structLow;
    document.getElementById('struct_high_total').value = structHigh;
}

// Initialize calculations on load
window.onload = function() {
    calculateAll();
};
</script>

</body>
</html>
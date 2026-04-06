# FORHEMIT STEWARDSHIP AGREEMENT — COMPREHENSIVE LEGAL REVIEW
**Document**: forhemit_stewardship_form.html (Document 11)
**Review Date**: March 30, 2026
**Review Method**: 5-Agent Parallel Analysis

---

## ⚠️ LEGAL DISCLAIMER

This analysis is AI-generated and does not constitute legal advice. It is intended as a starting point for review. Always consult a licensed attorney before signing contracts or relying on generated legal documents.

---

## EXECUTIVE SUMMARY

The Forhemit **Transition Stewardship Agreement** is a 7-section HTML form that generates a PDF agreement governing post-close operational stewardship services for ESOP-owned companies. The agreement is for a 12-24 month term with a fee of 2.5% of EBITDA, paid in declining tranches (60%, 20%, 10%, 10%).

**Overall Risk Level: 🔴 CRITICAL**

This document has more critical gaps than the Engagement Letter. The most significant issue is that the generated PDF contains only **4 numbered sections** despite the form collecting data for **7 sections**. The Service Pillars section—the core of what services Forhemit will provide—is completely absent from the generated agreement.

### Critical Findings Summary

| Category | Count | Severity |
|----------|-------|----------|
| Completely Absent Provisions | 12 | Critical |
| Form-to-PDF Disconnects | 5 | High |
| Inadequate Disclosures | 2 | Critical |
| Undefined Terms | 4 | High-Medium |
| Total Issues Identified | 23 | — |

---

## AGENT 1: STRUCTURAL ANALYSIS

### Document Structure Overview

The form is logically organized with 7 collapsible sections:

| Section | Content | Lines | In PDF? |
|---------|---------|-------|---------|
| 01 | Parties & Closing Details | 233-272 | ✅ Yes |
| 02 | Stewardship Term | 274-303 | ⚠️ Partial |
| 03 | EBITDA Baseline & Annual Fee | 305-393 | ✅ Yes |
| 04 | Service Pillars | 395-456 | ❌ **NO** |
| 05 | Lender & Trustee Disclosure | 458-493 | ✅ Yes |
| 06 | Governing Terms | 495-547 | ⚠️ Partial |
| 07 | Final Acknowledgment & Delivery | 549-575 | Signature only |

### Critical Structural Issue: Form-to-PDF Disconnect

The most significant structural problem is that the PDF generation JavaScript (lines 856-874) only generates **4 numbered sections**:

```
1. Parties, Recitals, and Purpose
3. Stewardship Fee
5. Lender & Trustee Disclosure
10. Governing Law
```

**Section 4 (Service Pillars)**—the core scope of services—is collected in the form with 6 detailed checkboxes but **does not appear in the generated agreement at all**.

Additional disconnects:
- Variance threshold selection (±15%, ±10%, ±20%) — not in PDF
- Lender notification trigger selection — not in PDF
- Special terms — mentioned but not fully integrated

### Missing Sections (Critical Gaps)

1. **Termination Provisions** — No dedicated section addressing termination for cause, termination for convenience, notice requirements, fee consequences, or wind-down obligations.

2. **Breach Consequences & Remedies** — No provision addressing material breach definition, cure periods, or specific performance options.

3. **Limitation of Liability** — No liability cap or limitation language. Critical for a service agreement where operational failures could have significant business consequences.

4. **Indemnification** — No mutual indemnification provisions addressing third-party claims, IP infringement, or data breaches.

5. **Force Majeure** — No provision for excusable delays due to circumstances beyond control.

6. **Amendment & Modification** — No specification of how agreement terms may be modified.

7. **Assignment & Successors** — No clarity on whether the agreement may be assigned or binds successors.

8. **Severability** — Standard boilerplate ensuring invalid provisions don't affect entire agreement.

9. **Entire Agreement / Integration** — No clause stating this agreement supersedes prior discussions.

10. **Dispute Resolution** — Only briefly mentioned in line 871 without detail.

11. **Confidentiality** — Footer says "CONFIDENTIAL" but no provision exists.

12. **Standard of Care** — No definition of performance standards.

---

## AGENT 2: RISK & COMPLIANCE ANALYSIS

### ERISA Compliance Risks

#### Risk 2.1: Inadequate Section 408(b)(2) Disclosure Framework
**Severity**: 🔴 Critical

**Issue**: The form references "Section 408(b)(2) disclosure" at lines 488 and 868, stating it will be delivered as a "separate instrument." However:
- No specification of what constitutes adequate disclosure
- No timing requirements relative to agreement execution
- No acknowledgment of receipt from the trustee
- No description of services covered vs. excluded

**Impact**: Under ERISA Section 408(b)(2), service providers to plan fiduciaries must disclose specific information including: (1) services to be provided; (2) all direct and indirect compensation; (3) fiduciary status; and (4) any policies/arrangements related to fiduciary decisions. Failure to provide complete disclosure prior to contract execution can render the agreement voidable and the compensation prohibited.

#### Risk 2.2: Ambiguous Fiduciary Status Language
**Severity**: 🟡 High

**Issue**: Lines 491, 859, and 868 state "Forhemit is not a fiduciary of the ESOP plan," but do not provide the legal analysis or factual predicate for this conclusion. The agreement describes services (governance, succession planning, COOP oversight) that could be construed as fiduciary in nature.

**Impact**: Under ERISA, a party can become a fiduciary by: (1) exercising discretionary authority over plan management; (2) rendering investment advice; or (3) having discretionary authority or responsibility in plan administration. If Forhemit's stewardship services effectively direct plan asset decisions, the disclaimer may be ineffective.

### Fee Structure Risks

#### Risk 2.3: No Enforcement Mechanism for Fee Payment
**Severity**: 🔴 Critical

**Issue**: The fee clause specifies the 2.5% EBITDA fee and tranche schedule but contains NO provisions addressing:
- What happens if Company refuses to pay
- Interest on late payments
- Forhemit's remedies for non-payment
- Whether Forhemit can withhold services for non-payment

**Impact**: Without enforcement provisions, the fee obligation may be unenforceable or require costly litigation. The 10% extension tranches (Months 13-24) are particularly vulnerable as they require "written election by both parties"—Company could refuse election to avoid payment.

#### Risk 2.4: No Fee Adjustment for Material EBITDA Decline
**Severity**: 🟢 Moderate

**Issue**: The fee is calculated as a flat 2.5% of the QofE EBITDA at closing with no mechanism for adjustment if EBITDA declines significantly post-close.

**Impact**: If Company experiences a 50%+ EBITDA decline, the 2.5% fee becomes proportionally burdensome and may breach lender covenants.

### Termination & Breach Risks

#### Risk 2.5: Complete Absence of Termination Provisions
**Severity**: 🔴 Critical

**Issue**: The agreement form contains NO termination provisions whatsoever.

**Impact**: Without termination provisions, the parties are bound for the full selected term (12/18/24 months) regardless of changed circumstances. Forhemit cannot exit if Company becomes hostile or unable to pay. Company cannot terminate even if Forhemit's services are deficient.

### Extension Election Risks

#### Risk 2.6: No Deadlock Resolution for Extension Disagreements
**Severity**: 🟢 Moderate

**Issue**: Months 13-24 extensions require "written election by both parties." No provision exists for resolving disagreement if one party wants extension and the other does not.

**Impact**: Creates uncertainty at Month 11/17 decision points.

### Lender Notification Risks

#### Risk 2.7: Ambiguous Trigger for Lender Notification
**Severity**: 🟡 High

**Issue**: Lines 535-538 specify "Lender RM Notification Trigger" options, but the underlying criteria for "material risk" are undefined.

**Impact**: Forhemit may notify lender of "material risk" without clear definition, potentially triggering SBA loan reviews or technical defaults. If Forhemit fails to notify when it should have, liability exposure exists for negligent non-disclosure.

---

## AGENT 3: CLAUSE ANALYSIS

### Existing Clauses Assessment

#### Clause 3.1: Parties Clause (Lines 857-860)
**Assessment**: PROBLEMATIC

**Issues**:
1. Undefined authority—no representation of authority language
2. Missing entity information (Forhemit's entity type, state of organization)
3. Incomplete recitals—no statement of Company's entity type or successor status
4. Ambiguous relationship disclaimer—lists what Forhemit is NOT but doesn't clearly articulate what Forhemit IS
5. No reference to related documents (Engagement Letter, ESOP transaction documents)

#### Clause 3.2: Fee Clause (Lines 861-865)
**Assessment**: HIGHLY PROBLEMATIC

**Issues**:
1. No payment timing (when invoices issued, payment due dates)
2. No EBITDA adjustment mechanism for material changes
3. No refund policy for early termination
4. No late fee or interest provision
5. Ambiguous tranche election (no timeline, method, or consequences)
6. No expense reimbursement specification
7. No tax characterization

#### Clause 3.3: Disclosure Clause (Lines 866-869)
**Assessment**: PROBLEMATIC

**Issues**:
1. Imperfect timing language—"prior to Closing Date" creates ambiguity for post-close agreement
2. No acknowledgment requirement from lender/trustee
3. Incomplete Section 408(b)(2) reference
4. No ongoing disclosure obligation for amendments

#### Clause 3.4: Governing Law Clause (Lines 870-873)
**Assessment**: PROBLEMATIC

**Issues**:
1. Overly concise—dispute resolution condensed into single sentence
2. No jury trial waiver
3. Incomplete arbitration reference (no rules, location, arbitrator count)
4. No venue for equitable relief
5. Special terms placed in governing law section

### Missing Clauses Summary

| Clause | Status | Risk Level |
|--------|--------|------------|
| Termination for Cause | Missing | High |
| Termination for Convenience | Missing | High |
| Effects of Termination | Missing | High |
| Limitation of Liability | Missing - Critical | Very High |
| Indemnification | Missing - Critical | Very High |
| Force Majeure | Missing | Medium |
| Confidentiality | Missing - Critical | High |
| Amendment Provisions | Missing | Medium |
| Assignment Restrictions | Missing | Medium |
| Entire Agreement/Merger | Missing | Medium |
| Severability | Missing | Low |
| Waiver Provisions | Missing | Low |

---

## AGENT 4: MISSING PROTECTIONS ANALYSIS

### Forhemit Protections (Service Provider)

| Protection | Status | Risk Level |
|------------|--------|------------|
| Limitation of liability cap | Missing | Critical |
| Consequential damages disclaimer | Missing | High |
| No obligation to guarantee results | Missing | High |
| Reliance on company-provided data disclaimer | Missing | Medium-High |
| Right to withhold services if unpaid | Missing | Medium |

### Company Protections (Client)

| Protection | Status | Risk Level |
|------------|--------|------------|
| Detailed scope of services definition | Partial | High |
| Standard of care | Missing | Medium-High |
| Documentation/deliverables requirements | Partial | Medium |
| Response time commitments | Partial | Medium |

### Mutual Protections

| Protection | Status | Risk Level |
|------------|--------|------------|
| Confidentiality obligations | Missing | Critical |
| Data security/privacy | Missing | High |
| Independent contractor status confirmation | Partial | Medium-High |
| Non-solicitation of staff | Missing | Medium |

### Process Protections

| Protection | Status | Risk Level |
|------------|--------|------------|
| Amendment procedure | Missing | High |
| Notice provisions | Missing | Medium-High |
| Dispute resolution escalation ladder | Missing | Medium |
| Cure period for breaches | Missing | High |

### Exit Protections

| Protection | Status | Risk Level |
|------------|--------|------------|
| Termination rights (both parties) | Missing | Critical |
| Effects of termination | Missing | High |
| Survival of key clauses | Missing | Medium-High |

### Summary of Missing Protections

| Category | Critical | High | Medium-High | Medium | Total |
|----------|----------|------|-------------|--------|-------|
| Forhemit Protections | 1 | 2 | 1 | 1 | 5 |
| Company Protections | 0 | 1 | 1 | 2 | 4 |
| Mutual Protections | 1 | 1 | 1 | 1 | 4 |
| Process Protections | 0 | 2 | 1 | 1 | 4 |
| Exit Protections | 1 | 1 | 1 | 0 | 3 |
| **TOTAL** | **3** | **6** | **5** | **5** | **20** |

---

## AGENT 5: SERVICE SCOPE ANALYSIS

### Service Pillars Assessment

#### P1 - Operational Continuity Monitoring (Lines 406-412)
**Clarity**: Needs Clarification

**Issues**:
1. COOP Definition Undefined—references a Continuity of Operations Plan (COOP) that is not defined in the agreement
2. "Actual Conditions" Subjective—what methodology applies?
3. Report Content Not Specified—the 10-business-day delivery is measurable, but content is undefined

#### P2 - Key-Person Risk Tracking (Lines 414-420)
**Clarity**: Vague

**Issues**:
1. "Critical Personnel" Undefined—no criteria for who qualifies
2. "Succession Readiness" Subjective—what metrics determine readiness?
3. "Escalation Protocol Active" Empty Reference—references a protocol that is not defined

#### P3 - Financial Baseline Reporting (Lines 422-428)
**Clarity**: Clear (with minor issues)

**Issues**:
1. "CPA Coordination" Ambiguous—what does coordination entail?
2. Data Source Responsibility—who provides monthly financials?

#### P4 - Governance Documentation (Lines 430-436)
**Clarity**: Needs Clarification

**Issues**:
1. "Maintenance" Ambiguous—does this mean creating, updating, or storing?
2. "Officer Succession Plan" Undefined—is this a deliverable or review of existing plan?
3. No Baseline Established—are documents created from scratch or reviewed/updated?

#### P5 - Lender Covenant Monitoring (Lines 438-444)
**Clarity**: Clear (strongest pillar)

**Issues**:
1. "Projected Breach" Methodology—how are projections calculated?
2. Lender RM Coordination Scope—what information is shared?

#### P6 - Succession Progress Reporting (Lines 446-452)
**Clarity**: Vague

**Issues**:
1. "Successor Readiness" Undefined—no metrics or criteria specified
2. "Final Transition Report" Completely Undefined—the most important deliverable has zero specification
3. "Quarterly Updates" Content—what is being reported?

### Critical Gap: Final Transition Report

Line 380 mentions this as the final deliverable, yet it is completely undefined. This is the single most important service ambiguity.

**Recommended Specification**:
- Summary of stewardship activities completed
- Current operational continuity status
- Key-person succession assessment
- Financial performance vs. baseline summary
- Governance recommendations
- Outstanding risks requiring attention
- Recommended ongoing service providers

### Missing Service Exclusions

The agreement lacks explicit service exclusions, creating risk of scope creep:
- Tax preparation or tax advice
- Legal services or legal opinions
- Audit or review services
- Executive search or recruitment
- Day-to-day operational management
- Banking relationship management
- Trustee services or fiduciary advice
- ERP/system implementation
- Loan guaranty or personal guarantees

### Dependencies on Company Actions

Several pillars depend on Company actions that are not acknowledged:
1. Data Availability—All reporting depends on timely Company financial data
2. Access to Personnel—Key-person tracking requires cooperation from HR/management
3. Access to Documents—Governance documentation requires access to existing records
4. Access to Lender Information—Covenant monitoring requires access to loan agreements

---

## CROSS-DOCUMENT CONSISTENCY ISSUES

### Shared Fields (Correctly Implemented)

| Field | Engagement Letter | Stewardship Agreement | Status |
|-------|-------------------|----------------------|--------|
| Company Legal Name | s_company | company (prefilled) | ✅ Aligned |
| Engagement Reference | s_ref | eng_ref (prefilled) | ✅ Aligned |
| Effective Date | s_date | disp_date (read-only) | ✅ Aligned |

### Inconsistencies Identified

1. **Governing Law State**: No mechanism to ensure same state is selected for both agreements

2. **Forhemit Signatory**: Default value "Founder & Managing Director" is consistent, but if changed in one document, it does NOT sync

3. **Special Terms**: Independent fields with no cross-population mechanism

4. **Company Email**: Not a shared field; could be entered differently

---

## PRIORITY RECOMMENDATIONS

### Immediate Action Required (Before Use)

1. **Expand Generated PDF Content**: Add all 7 sections to the PDF (not just 4); include Service Pillars section with selected pillars

2. **Add Termination Section**: Create Section 8 with termination for cause, termination for convenience, notice periods, and fee consequences

3. **Add Limitation of Liability Section**: Create Section 9 with liability cap and consequential damages waiver

4. **Add Indemnification Section**: Mutual indemnification provisions

5. **Synchronize Governing Law**: Add governing law to shared fields

6. **Add Confidentiality Section**: Comprehensive data protection framework

7. **Add Fee Enforcement Provisions**: Late payment interest, suspension rights, collection costs

### High Priority

8. **Add Dispute Resolution Detail**: Expand beyond brief mention; specify arbitration rules, venue, cost allocation

9. **Clarify Fiduciary Status**: Add factual basis for non-fiduciary conclusion

10. **Define "Material Risk"**: Add objective criteria for lender notification trigger

11. **Define Final Transition Report**: Specify comprehensive content requirements

12. **Add Standard of Care**: Define performance expectations

### Secondary Priority

13. **Add Amendment & Entire Agreement Clauses**: Standard contract boilerplate

14. **Add Force Majeure**: Excusable delay provision

15. **Define "Escalation Protocol"**: Create and attach as exhibit

16. **Define "Critical Personnel"**: Add objective criteria

---

## ATTORNEY IMPLEMENTATION GUIDE

### Step 1: Review Checklists
Open `Attorney_Revision_Checklist_Stewardship_Agreement.md` for detailed item-by-item action list.

### Step 2: Review Redrafted Language
Open `Redrafted_Clauses_Stewardship_For_Attorney_Review.md` for copy-ready clause language.

### Step 3: Technical Implementation
The following JavaScript modifications are required:
1. Add Service Pillars to PDF generation sections array (around line 856)
2. Add new sections for missing provisions (6-12)
3. Update section numbering in existing sections array
4. Add form fields for new options (termination notice periods, liability cap, etc.)

### Step 4: Test Document Generation
After implementing changes, test with sample data to verify all form fields appear correctly in generated PDF.

---

## CONCLUSION

The Stewardship Agreement has more critical gaps than the Engagement Letter and requires substantial revision before use. The most urgent need is to:

1. Fix the form-to-PDF disconnect (Service Pillars not appearing)
2. Add termination provisions
3. Add limitation of liability and indemnification
4. Strengthen ERISA 408(b)(2) disclosure framework
5. Add confidentiality provisions

**Risk Assessment**: 🔴 CRITICAL — Do not use without attorney revisions.

---

**End of Comprehensive Legal Review**

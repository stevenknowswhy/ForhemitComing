# ATTORNEY REVISION CHECKLIST — STEWARDSHIP AGREEMENT
**Document**: Forhemit Transition Stewardship Agreement (Doc 11)
**Source**: /Users/stephenstokes/Downloads/files/forhemit_stewardship_form.html
**Review Date**: March 30, 2026

---

## INSTRUCTIONS

This checklist organizes revisions by priority. Address all **Critical** items before using this document. **High** priority items should be addressed as soon as practicable. **Moderate** items are recommended improvements.

---

## PART 1: CRITICAL REVISIONS (Must Address Before Use)

### 1.1 Termination Provisions — COMPLETELY ABSENT
**Location**: No such section exists in form or PDF
**Risk**: Parties locked into 12/18/24 month term regardless of changed circumstances
**Recommended Action**: Add Section 8 to the form with the following elements:

- [ ] Termination for cause (material breach, non-payment, insolvency, fraud)
- [ ] Termination for convenience (Company: 60 days notice; Forhemit: 90 days notice)
- [ ] Cure period specification (15 days for breach; 10 days for payment)
- [ ] Effect of termination (earned fees, proration, data return)
- [ ] Immediate termination rights for material breach

**See Redrafted Clauses, Section 8.1-8.4 for suggested language.**

---

### 1.2 Fee Enforcement Mechanism — COMPLETELY ABSENT
**Location**: Lines 353-383, 861-865 define fee but no enforcement
**Risk**: Fee obligation may be unenforceable without costly litigation
**Recommended Action**: Add fee default provisions to Section 3 or new Section 9:

- [ ] Payment timing (e.g., "within 30 days of invoice")
- [ ] Late payment interest (e.g., "1.5% per month or maximum permitted by law")
- [ ] Right to suspend services for non-payment
- [ ] Collection costs including attorney fees
- [ ] Security interest or lien on Company assets (if permitted by law)

**See Redrafted Clauses, Section 3.4-3.5 for suggested language.**

---

### 1.3 ERISA Section 408(b)(2) Disclosure Framework — INADEQUATE
**Location**: Lines 488, 868 — mentioned but not specified
**Risk**: Potential prohibited transaction exposure; compensation may be voidable
**Recommended Action**: Strengthen disclosure requirements in Section 5:

- [ ] Specify disclosure content (services, compensation, fiduciary status, policies)
- [ ] Require trustee acknowledgment of receipt PRIOR to execution
- [ ] Specify timing relative to agreement effective date
- [ ] Add ongoing disclosure obligation for material amendments
- [ ] Separate 408(b)(2) disclosure as exhibit or separate instrument

**See Redrafted Clauses, Section 5.2-5.4 for suggested language.**

---

### 1.4 Limitation of Liability — COMPLETELY ABSENT
**Location**: No such provision exists
**Risk**: Unlimited Forhemit exposure for all claims, including consequential damages
**Recommended Action**: Add Section 9 (or renumber as Section 10):

- [ ] Liability cap (e.g., 12 months of fees paid or fixed dollar amount)
- [ ] Consequential damages waiver (lost profits, lost revenue, ESOP disqualification)
- [ ] carve-outs for gross negligence, willful misconduct, confidentiality breach
- [ ] No guarantee of results disclaimer
- [ ] Reliance on company-provided data disclaimer

**See Redrafted Clauses, Section 9.1-9.3 for suggested language.**

---

### 1.5 Indemnification — COMPLETELY ABSENT
**Location**: No such provision exists
**Risk**: No protection against third-party claims (IP infringement, data breaches, etc.)
**Recommended Action**: Add Section 8 (before or merged with limitation of liability):

- [ ] Company indemnification of Forhemit (breach, operations, third-party claims)
- [ ] Forhemit indemnification of Company (gross negligence, willful misconduct, misappropriation)
- [ ] Indemnification procedure (notice, control, cooperation)
- [ ] Indemnification exceptions and limitations

**See Redrafted Clauses, Section 8.1-8.3 for suggested language.**

---

### 1.6 Confidentiality — COMPLETELY ABSENT
**Location**: Footer says "CONFIDENTIAL" but no provision exists
**Risk**: No data protection framework; potential trade secret disclosure
**Recommended Action**: Add Section 7:

- [ ] Definition of Confidential Information
- [ ] Confidentiality obligations (use, protection, no disclosure)
- [ ] Exceptions (publicly known, independently developed, compelled by law)
- [ ] Compelled disclosure notice requirement
- [ ] Return/destruction of materials upon termination
- [ ] Survival period (e.g., 3 years post-termination)

**See Redrafted Clauses, Section 7.1-7.5 for suggested language.**

---

## PART 2: HIGH PRIORITY REVISIONS

### 2.1 Form-to-PDF Mapping — SERVICE PILLARS MISSING
**Location**: Form Section 4 (lines 395-456) vs PDF sections array (lines 856-874)
**Risk**: Form collects Service Pillar selections but they don't appear in generated agreement
**Recommended Action**: Update PDF generation JavaScript:

- [ ] Add Section 4 to the `sections` array in JavaScript
- [ ] Include selected Service Pillars with descriptions
- [ ] Include variance threshold selection (Section 6, line 525)
- [ ] Include lender notification trigger selection (Section 6, line 533)
- [ ] Verify all form fields are reflected in PDF

**Technical Implementation**: Modify lines 856-874 in the JavaScript.

---

### 2.2 Dispute Resolution — INCOMPLETE
**Location**: Line 871 — single sentence mentions mediation/arbitration
**Risk**: Insufficient dispute resolution framework; expensive litigation risk
**Recommended Action**: Expand Section 10:

- [ ] Mediation specification (AAA, location, timeline, cost allocation)
- [ ] Arbitration specification (AAA Commercial Rules, venue, arbitrator count)
- [ ] Jury trial waiver
- [ ] Exception for injunctive/equitable relief
- [ ] Prevailing party attorney fees definition

**See Redrafted Clauses, Section 10.2-10.4 for suggested language.**

---

### 2.3 Fiduciary Status Disclaimer — MAY BE INEFFECTIVE
**Location**: Lines 491, 859, 868
**Risk**: Services described (governance, succession, COOP oversight) could be construed as fiduciary; disclaimer may be ineffective without factual predicate
**Recommended Action**: Strengthen non-fiduciary language:

- [ ] Add factual basis: "Forhemit provides services solely to the Company as an operating entity"
- [ ] Specify no authority over plan assets, investments, distributions, or trustee decisions
- [ ] Clarify advisory vs. discretionary authority distinction
- [ ] Consider obtaining ERISA counsel opinion letter

**See Redrafted Clauses, Section 1.3 for suggested language.**

---

### 2.4 Lender Notification Trigger — UNDEFINED
**Location**: Lines 535-538 (form) — not in PDF
**Risk**: "Material risk" is undefined; premature or negligent notification creates liability
**Recommended Action**: Define "material risk" with objective criteria:

- [ ] DSCR below 1.25x for two consecutive months
- [ ] Actual or projected covenant breach
- [ ] Loss of key person without qualified successor
- [ ] Condition that could result in SBA loan acceleration
- [ ] Add safe harbor for notification made in good faith

**See Redrafted Clauses, Section 5.5 for suggested language.**

---

### 2.5 Late Payment Interest — ABSENT
**Location**: Not addressed
**Risk**: Collection difficulty; no consequence for delayed payment
**Recommended Action**: Add to fee enforcement provision:

- [ ] Interest rate specification (e.g., 1.5% per month)
- [ ] Maximum rate permitted by law limitation
- [ ] Accrual from due date until paid

---

### 2.6 Standard of Care — UNDEFINED
**Location**: Not addressed
**Risk**: Service quality disputes; unclear performance expectations
**Recommended Action**: Add standard of care provision:

- [ ] "Commercially reasonable manner consistent with industry standards"
- [ ] No discretionary authority over Company operations
- [ ] No management decision-making authority
- [ ] No guarantee of results

---

### 2.7 Amendment Procedure — ABSENT
**Location**: Not addressed
**Risk**: Contract modification ambiguity; oral agreements potentially enforceable
**Recommended Action**: Add Section 11.1:

- [ ] Written amendment requirement
- [ ] Authorized representative signatures
- [ ] No oral modification clause
- [ ] Waiver provisions (no failure to enforce = waiver)

---

### 2.8 Final Transition Report — COMPLETELY UNDEFINED
**Location**: Line 380 mentions it but no specification
**Risk**: Most important deliverable has no defined content; expectations mismatch
**Recommended Action**: Specify Final Transition Report content:

- [ ] Summary of stewardship activities completed
- [ ] Operational continuity status
- [ ] Key-person succession assessment
- [ ] Financial performance vs. baseline summary
- [ ] Governance recommendations
- [ ] Outstanding risks requiring attention
- [ ] Recommended ongoing service providers

---

## PART 3: MODERATE PRIORITY REVISIONS

### 3.1 Force Majeure — ABSENT
**Location**: Not addressed
**Risk**: No excusable delay provision for events outside control
**Recommended Action**: Add force majeure clause with:
- [ ] Defined events (acts of God, war, pandemic, government actions)
- [ ] Notice requirement
- [ ] Good faith resumption efforts
- [ ] Fee proration for extended events (>30 days)

---

### 3.2 Assignment Restrictions — ABSENT
**Location**: Not addressed
**Risk**: Uncertainty if either party is acquired or restructured
**Recommended Action**: Add Section 11.2:

- [ ] No assignment without consent (except to affiliates or successors)
- [ ] Merger/acquisition exception with notice
- [ ] Void assignment clause

---

### 3.3 Entire Agreement/Merger Clause — ABSENT
**Location**: Not addressed
**Risk**: Prior agreements could supplement or contradict written agreement
**Recommended Action**: Add Section 11.3:

- [ ] Entire agreement statement
- [ ] Supersedes prior agreements clause
- [ ] Reference to Engagement Letter as related but distinct

---

### 3.4 Severability — ABSENT
**Location**: Not addressed
**Risk**: One invalid provision could invalidate entire agreement
**Recommended Action**: Add Section 11.4:

- [ ] Remaining provisions continue in force
- [ ] Reform invalid provision to minimum extent necessary

---

### 3.5 Notice Provisions — INCOMPLETE
**Location**: Company email collected (line 267) but no notice clause
**Risk**: Unclear how notices must be delivered
**Recommended Action**: Add Section 12.1:

- [ ] Permitted methods (personal delivery, overnight courier, certified mail, email)
- [ ] Forhemit notice address (deals@forhemit.com)
- [ ] Company notice address (from form field)
- [ ] Deemed effective upon confirmation of receipt

---

### 3.6 Cure Period for Breach — ABSENT
**Location**: Not addressed
**Risk**: No opportunity to cure before termination actions
**Recommended Action**: Add to termination provision:

- [ ] 30-day cure period for general breaches
- [ ] 10-day cure period for payment breaches
- [ ] Written notice requirement
- [ ] Specification of what constitutes cure

---

## PART 4: STATE LAW CONSIDERATIONS

### 4.1 Governing Law Selection
**Location**: Lines 507-521 (all 50 states)
**Considerations**:
- [ ] California: Strong forfeiture doctrine; non-refundable fees at risk
- [ ] New York: Enforceable non-refundable fees with clear language
- [ ] Delaware: Generally business-friendly
- [ ] Consider whether governing law should match Engagement Letter

---

### 4.2 Arbitration Enforceability
**Location**: Line 871 mentions AAA arbitration
**Considerations**:
- [ ] Some states restrict arbitration agreements (e.g., California requires specific language)
- [ ] Federal Arbitration Act preemption analysis
- [ ] Consider carve-out for equitable relief

---

## PART 5: REGULATORY COMPLIANCE

### 5.1 ERISA Compliance
**Status**: Partially addressed
**Remaining Actions**:
- [ ] Complete 408(b)(2) disclosure package prepared
- [ ] Trustee acknowledgment process established
- [ ] Fiduciary status analysis documented
- [ ] Ongoing monitoring obligation clarified (if any)

---

### 5.2 SBA Lender Compliance
**Status**: Partially addressed
**Remaining Actions**:
- [ ] SBA SOP 50 10 5(J) management agreement disclosure requirements confirmed
- [ ] Lender notification protocol documented
- [ ] Material risk definition aligned with lender expectations

---

### 5.3 Independent Contractor Status
**Status**: Partially addressed
**Remaining Actions**:
- [ ] Formal independent contractor provision added
- [ ] No employee benefits or tax withholding specified
- [ ] Company has no authority to bind Forhemit confirmed

---

## PART 6: ATTORNEY SIGN-OFF

| Section | Attorney Review Status | Notes |
|---------|----------------------|-------|
| 1.1 Termination Provisions | ☐ Pending | |
| 1.2 Fee Enforcement | ☐ Pending | |
| 1.3 ERISA 408(b)(2) Disclosure | ☐ Pending | |
| 1.4 Limitation of Liability | ☐ Pending | |
| 1.5 Indemnification | ☐ Pending | |
| 1.6 Confidentiality | ☐ Pending | |
| 2.1 Form-to-PDF Mapping | ☐ Pending | |
| 2.2 Dispute Resolution | ☐ Pending | |
| 2.3 Fiduciary Status | ☐ Pending | |
| 2.4 Lender Notification | ☐ Pending | |
| 2.5 Late Payment Interest | ☐ Pending | |
| 2.6 Standard of Care | ☐ Pending | |
| 2.7 Amendment Procedure | ☐ Pending | |
| 2.8 Final Transition Report | ☐ Pending | |
| 3.1-3.6 Moderate Priority | ☐ Pending | |
| State Law Considerations | ☐ Pending | |
| Regulatory Compliance | ☐ Pending | |

**Overall Status**: ☐ Approved for Use | ☐ Approved with Conditions | ☐ Requires Revision

**Attorney**: __________________________

**Date**: __________________________

**Additional Notes**:
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________

---

*End of Checklist*

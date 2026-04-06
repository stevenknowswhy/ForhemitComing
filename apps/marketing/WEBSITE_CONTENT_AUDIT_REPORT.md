# Forhemit Website Content Audit Report
**Date:** March 24, 2026  
**Scope:** Complete website content analysis for accuracy and consistency  
**Pages Audited:** 24 main pages + component sections

---

## Executive Summary

This audit identifies **content inconsistencies, conflicting information, and areas for improvement** across the Forhemit website. The site serves multiple audiences (business owners, brokers, advisors, lenders, etc.) with overlapping but sometimes divergent messaging.

### Overall Assessment
- **Tone Consistency:** Generally consistent professional/fiduciary tone
- **Terminology:** Some inconsistency in business description ("Stewardship Management" vs "Private Equity")
- **Numerical Claims:** Mostly consistent but some discrepancies in tax/fee percentages
- **Timeline Claims:** Generally consistent (~4 months/90-120 days)

---

## Critical Issues (High Priority)

### 1. Business Model Description Inconsistency

**Issue:** The company describes itself differently across pages, potentially causing confusion.

| Page | Description Used |
|------|------------------|
| `/appraisers` | "human-centric private equity firm that acquires $3M–$15M businesses" |
| `/lenders` | "Forhemit Stewardship Management Co." / "operational risk partner" |
| `/accounting-firms` | "We are a Stewardship Management Company" |
| `/about` | "Stewardship Management" |
| `/business-owners` | ESOP sale facilitator (no explicit business model label) |

**Recommendation:** Standardize on one primary descriptor with optional secondary clarifications.

---

### 2. Company Name Variations

**Issue:** Multiple name variations appear:
- "Forhemit" (most common)
- "Forhemit PBC" (Privacy Policy, Terms, opt-in page)
- "Forhemit Capital" (Terms of Service - Section 7)

**Specific Finding:**
- `/terms/page.tsx` line 82: "FORHEMIT CAPITAL" is used in liability disclaimer
- All other pages use "Forhemit PBC" or just "Forhemit"

**Recommendation:** Standardize all legal references to "Forhemit PBC" (Public Benefit Corporation).

---

### 3. Tax Percentage Inconsistencies

**Issue:** Different tax figures cited for traditional sales:

| Page | Tax/Fee Claim |
|------|---------------|
| `/business-owners` (FAQ) | "up to 23.8%+ of their proceeds to federal capital gains taxes overnight" |
| `/wealth-managers` | "~28% effective tax" (calculator default) |
| `/accounting-firms` | "23.8%" specifically |
| `/financial-accounting` | "30% of sale proceeds can be lost to capital gains taxes" |

**Recommendation:** Standardize on "up to 23.8% federal capital gains (plus state taxes)" with clear footnotes about state variations.

---

### 4. EBITDA Range Inconsistencies

**Issue:** Different target business sizes cited:

| Page | EBITDA Range |
|------|--------------|
| `/appraisers` | "$3M–$15M EBITDA" |
| `/lenders` | "$750K–$3M in EBITDA" |
| `/wealth-managers` | "$2M–$10M in EBITDA" |
| `/brokers` | "$3M+ revenue" (not EBITDA) |
| `/business-owners` | No specific range stated |

**Impact:** Confusing for advisors who may refer multiple pages

**Recommendation:** Create a clear segmentation: Primary target ($3M-$15M) with expanded range for specific partners.

---

### 5. Timeline Inconsistencies

**Issue:** Timeline language varies:

| Page | Timeline Stated |
|------|-----------------|
| `/four-month-path` | "4-Month Path" / "Days 91-120" |
| `/brokers` | "~90–120 day execution" / "roughly four months" |
| `/business-owners` | "close in months, not years" (vague) |
| Appraisers page | Mentions 20-minute call but no transaction timeline |

**Specific Discrepancy:**
- Hero says "close in months, not years"
- Four-month-path says "roughly four months"
- Brokers page says "90-120 days"

**Recommendation:** Standardize on "approximately 4 months (90-120 days)" across all pages.

---

### 6. Employee Count Threshold Inconsistencies

**Issue:** Different minimum employee counts:

| Page | Employee Threshold |
|------|-------------------|
| `/lenders` | "20+ employees" (critical mass for management layer) |
| `/brokers` | "at least ~20 full-time employees" |
| `/appraisers` | "15-person business" (example used) vs "$3M-$15M" focus |
| `/accounting-firms` | "15-person business" (example) |

**Recommendation:** Standardize on "20+ employees" as the viability threshold.

---

### 7. Fee Structure Transparency Gaps

**Issue:** Fee information is scattered and inconsistent:

| Page | Fee Information |
|------|-----------------|
| `/four-month-path` | Mentions "Fee Transparency" PDF |
| `/brokers` | "standard success fee" mentioned but no specifics |
| `/appraisers` | Specific ranges given ($35K-$60K initial, 30-40% annual) |
| `/business-owners` | "No commitment, no broker pitch, no obligation" |
| `/accounting-firms` | "$50,000 (One-time Transition Fee)" mentioned |

**Finding:** Appraisers page has most specific fee information; other pages are vague.

**Recommendation:** Create consistent fee messaging tiered by audience (appraisers get specifics, owners get ranges).

---

## Medium Priority Issues

### 8. Contact Information Variations

**Issue:** Different contact emails/phones:

| Page | Email | Phone |
|------|-------|-------|
| `/privacy` | privacy@forhemit.com | +1 (800) 555-0199 |
| `/terms` | legal@forhemit.com | Not listed |
| `/appraisers` | appraisers@forhemit.com | Not listed |
| `/wealth-managers` | advisors@forhemit.com | Not listed |
| `/lenders` | info@forhemit.com | Not listed |

**Recommendation:** Create a contact directory page and ensure all pages reference consistent primary contact methods.

---

### 9. 1042 Tax Deferral Explanation Variations

**Issue:** Different levels of detail about Section 1042:

| Page | 1042 Explanation |
|------|-----------------|
| `/accounting-firms` | "defer 100% of their capital gains taxes" |
| `/financial-accounting` | "defer 100% of their capital gains taxes under IRC Section 1042" (with QRP explanation) |
| `/wealth-managers` | "0% Tax" / "Tax-deferred reinvestment" |

**Note:** C-Corp vs S-Corp distinction is clear on `/financial-accounting` but less emphasized elsewhere.

**Recommendation:** Ensure all pages mention C-Corp requirement for 1042 (with S-Corp note).

---

### 10. "COOP Framework" Terminology

**Issue:** COOP is described differently:

| Page | COOP Description |
|------|-----------------|
| `/beyond-the-balance-sheet` | "Continuity of Operations Planning" (full explanation) |
| `/appraisers` | "COOP framework" / "Continuity of Operations (COOP)" |
| `/lenders` | "Continuity of Operations (COOP)" / "COOP playbook" |

**Finding:** Good consistency overall, but some pages could use the full name on first reference.

---

### 11. "2-Minute Check" vs "Two Minute Check"

**Issue:** Inconsistent hyphenation/spacing:
- `/business-owners`: "2-Minute Check" (button text)
- `/four-month-path`: "2-Minute Check" (in text)
- `/brokers`: "2-Minute Check" referenced

**Finding:** Generally consistent but watch for variations.

---

## Low Priority / Minor Issues

### 12. Statistic Consistency

**Consistent Statistics (Good):**
- 70% of heirs switch advisors (used on `/accounting-firms` and `/financial-accounting`)
- 52%+ of employer businesses owned by people 55+ (consistent)

**Needs Verification:**
- "23.8%" tax rate - verify current federal rate
- "$337,500+" 5-year CPA revenue (accounting-firms) - verify calculation basis

---

### 13. Image Alt Text Review

**Issue:** Some images have generic alt text:
- Multiple images use "Business succession planning" as alt text
- Consider more descriptive alt text for accessibility

---

### 14. Page Title/Metadata Inconsistencies

**Finding:** Title formats vary:
- `/brokers`: "For Brokers & M&A Advisors | Dual-Track ESOP | Forhemit"
- `/four-month-path`: "Your 4-Month ESOP Path"
- Blog: Just "Blog"

**Recommendation:** Standardize format: "[Descriptive Title] | Forhemit"

---

### 15. Date References

**Issue:** Some pages reference future dates:
- `/financial-accounting`: "Beginning in 2028, the SECURE 2.0 Act..."
- Ensure this remains accurate as time passes

---

## Content Gaps

### 16. Missing Cross-References

**Finding:** Pages don't consistently cross-reference related content:
- `/brokers` doesn't link to `/four-month-path` for seller details
- `/wealth-managers` and `/accounting-firms` don't reference each other
- `/faq` is comprehensive but not linked from all relevant pages

### 17. Testimonial/Social Proof Gap

**Finding:** No testimonials, case studies, or social proof visible in any audited pages.

**Recommendation:** Consider adding anonymized case studies or advisor testimonials.

---

## Recommendations Summary

### Immediate Actions (High Priority)
1. **Standardize company name** - Replace "Forhemit Capital" with "Forhemit PBC" in Terms
2. **Align tax percentage claims** - Use consistent 23.8% figure with state tax note
3. **Clarify EBITDA ranges** - Create clear segmentation messaging
4. **Unify business model description** - Choose "Stewardship Management Company" or standardize explanation

### Short-term Actions (Medium Priority)
5. **Create contact directory** - Centralize email/phone references
6. **Standardize timeline language** - "~4 months (90-120 days)"
7. **Add C-Corp qualifier** to all 1042 references
8. **Unify employee threshold** - Standardize on "20+ employees"

### Long-term Actions (Low Priority)
9. **Add case studies** - Social proof content
10. **Improve cross-linking** - Connect related pages
11. **Update date-sensitive content** - Review annually

---

## Appendix: Page-by-Page Quick Reference

| Page | Primary Audience | Key Message | Issues Found |
|------|-----------------|-------------|--------------|
| `/` (home) | Business Owners | 2-Minute Check entry | None major |
| `/business-owners` | Owners | Sell to team, fair market value | Tax % inconsistency |
| `/brokers` | M&A Advisors | Dual-track ESOP | Timeline wording |
| `/four-month-path` | Owners (qualified) | 4-month timeline | None major |
| `/accounting-firms` | CPAs | Revenue retention | EBITDA example vs target |
| `/appraisers` | Valuation Pros | Recurring revenue | "Private equity" description |
| `/lenders` | Banks | SBA compliance, COOP | EBITDA range differs |
| `/wealth-managers` | Advisors | 1042, AUM growth | Tax % inconsistency |
| `/legal-practices` | Attorneys | Risk mitigation | Uses section components |
| `/financial-accounting` | Both CPAs & Advisors | Partnership model | Good detail on 1042 |
| `/faq` | All | Comprehensive FAQ | None major |
| `/about` | All | Mission/story | None major |
| `/beyond-the-balance-sheet` | All | COOP explanation | None major |
| `/the-exit-crisis` | All | Problem education | Uses section components |
| `/privacy` | All | Legal | Phone number used |
| `/terms` | All | Legal | "Forhemit Capital" error |
| `/opt-in` | All | Preferences | None major |
| `/introduction` | All | Contact options | None major |
| `/coming-soon` | All | Placeholder | None major |

---

## Conclusion

The Forhemit website contains comprehensive, well-written content tailored to multiple professional audiences. The primary areas for improvement are:

1. **Numerical consistency** (tax rates, EBITDA ranges, timelines)
2. **Business model description** (standardize terminology)
3. **Legal accuracy** (company name in Terms)

No critical factual errors were found, but standardizing the inconsistencies will improve credibility and reduce confusion for prospects comparing information across pages.

---

*Report generated by content audit analysis tool*  
*No code changes were made during this audit*

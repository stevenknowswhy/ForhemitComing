/**
 * Email Configuration for External Document Templates
 *
 * Subject line, HTML body, and PDF filename for each template that is
 * sent externally with a PDF attachment. Keys match templates.name in
 * the template manifest.
 *
 * All strings support {{placeholder}} syntax which is resolved at send time.
 */

export interface EmailTemplateConfig {
  subject: string;
  body: string;
  filename: string;
}

// ── Shared layout fragments ────────────────────────────────────────────────

const OPEN = `<div style="font-family: Jost, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">`;

const SIGNATURE = `
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0;">
      Best regards,<br><br>
      <strong>Forhemit Transition Stewardship</strong><br>
      deals@forhemit.com<br>
      forhemit.com
    </p>
  </div>
`;

const FOOTER = `
  <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center;">
    <p>Forhemit Stewardship Management Co. &middot; California Public Benefit Corporation</p>
    <p>548 Market St, Suite 36451, San Francisco, CA 94104</p>
  </div>
</div>`;

const CLOSE = SIGNATURE + FOOTER;

function p(text: string): string {
  return `<p style="font-size: 14px; line-height: 1.6; color: #444;">${text}</p>`;
}

function greeting(name: string): string {
  return `<p style="font-size: 15px; line-height: 1.6; color: #333;">Dear ${name},</p>`;
}

function wrap(greetingBlock: string, ...bodyBlocks: string[]): string {
  return OPEN + greetingBlock + bodyBlocks.join("") + CLOSE;
}

// ── Email configs ──────────────────────────────────────────────────────────

export const emailConfigs: Record<string, EmailTemplateConfig> = {

  // ==========================================================================
  // 02-QUALIFICATION
  // ==========================================================================

  "Deal screener response": {
    subject: "Re: {{companyName}} — Deal Screening Response",
    filename: "Forhemit-Deal-Screener-Response-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Thank you for submitting {{companyName}} for our review. We have completed our initial screening and the results are attached."),
      p("{{#if isFit}}We are pleased to confirm that this opportunity aligns with our acquisition criteria. A member of our team will reach out within 2 business days to discuss next steps.{{else}}After careful review, this opportunity does not meet our current acquisition criteria. Please see the attached document for details. We welcome future submissions that may be a stronger fit.{{/if}}"),
      p("Please do not hesitate to reach out if you have any questions."),
    ),
  },

  "Pre-flight cover letter": {
    subject: "Pre-Flight Checklist — {{companyName}}",
    filename: "Forhemit-PreFlight-Cover-Letter-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Thank you for your continued interest in working with Forhemit. Attached you will find our Pre-Flight Checklist for {{companyName}}."),
      p("This document outlines the mutual commitments and readiness items that must be confirmed before we proceed to formal engagement. It includes a $15,000 non-refundable deposit that will be held uncashed until all conditions are satisfied."),
      p("Please review the checklist carefully, sign where indicated, and return it at your earliest convenience. We are available to walk through any questions you may have."),
    ),
  },

  "Conditional go letter": {
    subject: "Conditional Approval — {{companyName}}",
    filename: "Forhemit-Conditional-Go-Letter-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("We are pleased to inform you that Forhemit has conditionally approved {{companyName}} to proceed. The attached letter details the specific conditions that must be met before we can move to full engagement."),
      p("Your deposit will be held uncashed until all conditions outlined in the attached document have been satisfied. Once cleared, we will proceed with the formal engagement letter and begin the transaction process."),
      p("Please review the conditions carefully and let us know if you have any questions. We look forward to working together."),
    ),
  },

  "NDA Receipt Confirmation": {
    subject: "NDA Receipt Confirmation — {{companyName}} — {{ref}}",
    filename: "Forhemit-NDA-Confirmation-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Thank you for executing the {{ndaType}}. Please find attached your official receipt confirmation from Forhemit Transition Stewardship."),
      p("With the NDA in place, we can now share confidential transaction materials. You will receive a follow-up within 2 business days outlining next steps."),
    ),
  },

  "Transaction cost disclosure": {
    subject: "Transaction Cost Disclosure — {{companyName}}",
    filename: "Forhemit-Transaction-Cost-Disclosure-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("As part of our commitment to full transparency, please find attached the itemized Transaction Cost Disclosure for {{companyName}}."),
      p("This document presents cost estimates across low, realistic, and high scenarios, along with a comparison of the ESOP path versus a traditional third-party sale under Section 1042. We encourage you to review this with your CPA or financial advisor."),
      p("We are available to discuss any questions about the figures or assumptions presented."),
    ),
  },

  "Offer summary": {
    subject: "Offer Summary — {{companyName}}",
    filename: "Forhemit-Offer-Summary-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Please find attached the Offer Summary for {{companyName}}. This document outlines the proposed capital stack, estimated seller proceeds, and projected transaction timeline."),
      p("We have prepared this summary based on the financial information provided and our preliminary analysis. The figures are illustrative and subject to confirmation during diligence."),
      p("Please review the attached summary at your convenience. We are happy to schedule a call to walk through the details and answer any questions."),
    ),
  },

  "Honest Review document": {
    subject: "Honest Review — {{companyName}}",
    filename: "Forhemit-Honest-Review-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Attached is our Honest Review document for {{companyName}}. This is a candid assessment designed to surface the objections, concerns, and questions that business owners typically have when considering an ESOP transition."),
      p("We believe that addressing these topics openly — before any commitments are made — leads to better outcomes for everyone involved. There are no obligations attached to this document."),
      p("We welcome an open conversation about anything in the attached review."),
    ),
  },

  "§1042 rollover explainer": {
    subject: "Section 1042 Rollover Explainer — {{companyName}}",
    filename: "Forhemit-1042-Rollover-Explainer-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Please find attached our Section 1042 Rollover Explainer, prepared for {{companyName}}. This document covers the Qualified Replacement Property mechanics, reinvestment window, and basis implications relevant to the potential ESOP transaction."),
      p("We recommend reviewing this document with your CPA or tax advisor to understand how the Section 1042 election may apply to your specific situation."),
      p("We are available to coordinate with your tax professionals if that would be helpful."),
    ),
  },

  // ==========================================================================
  // 03-ENGAGEMENT
  // ==========================================================================

  "Engagement letter": {
    subject: "For Your Signature — Engagement Letter — {{companyName}}",
    filename: "Forhemit-Engagement-Letter-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Thank you for choosing to move forward with Forhemit. Attached you will find the formal Engagement Letter for {{companyName}}."),
      p("This document outlines our fee structure, milestone schedule, and cancellation terms. Please review it carefully, sign where indicated, and return the signed copy at your earliest convenience."),
      p("Once we receive the executed engagement letter, we will formally begin the transaction process and your onboarding sequence will start immediately."),
    ),
  },

  "LOI template": {
    subject: "Letter of Intent — {{companyName}} — For Review",
    filename: "Forhemit-LOI-Transmittal-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("We are pleased to present the Letter of Intent for {{companyName}}. Attached you will find a transmittal letter that summarizes the key terms in plain language before you review the full legal document."),
      p("The LOI is non-binding and is intended to establish the framework for the transaction. Signing the LOI will trigger the uncashing of your deposit and begin the exclusivity window."),
      p("Please review the attached summary first, then the full LOI. We are available to discuss any terms or questions before you sign."),
    ),
  },

  "Broker deal acceptance email": {
    subject: "Deal Accepted — {{companyName}} — Commission Confirmation",
    filename: "Forhemit-Broker-Deal-Acceptance-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("We are pleased to confirm that Forhemit has formally accepted the deal for {{companyName}}. Attached you will find the commission confirmation and terms."),
      p("Your commission is protected under the terms outlined in the attached document. We will keep you informed of progress through our regular broker status updates as the transaction moves through diligence and closing."),
      p("Thank you for bringing this opportunity to us. We look forward to a successful transaction."),
    ),
  },

  "Referral fee agreement": {
    subject: "Referral Fee Agreement — {{companyName}}",
    filename: "Forhemit-Referral-Fee-Agreement-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("As discussed, please find attached the Referral Fee Agreement for {{companyName}}. This document formalizes the referral arrangement and is separate from any broker commission."),
      p("Please review the terms, sign where indicated, and return the executed agreement. If you have any questions about the fee structure or payment timing, please do not hesitate to reach out."),
    ),
  },

  "Advisor introduction email (trustee)": {
    subject: "Deal Introduction — {{companyName}} — Trustee Engagement",
    filename: "Forhemit-Trustee-Introduction-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("We would like to introduce you to an ESOP transaction for {{companyName}}. Attached you will find a summary of the deal, Forhemit's role, and what you can expect to receive and when."),
      p("Forhemit acts as the transaction coordinator. We do not serve as trustee, counsel, or valuation provider. Our role is to ensure the deal progresses efficiently through each gate while maintaining ERISA compliance."),
      p("Please review the attached materials and let us know if you would like to discuss this opportunity further."),
    ),
  },

  "Advisor introduction email (ERISA counsel)": {
    subject: "Deal Introduction — {{companyName}} — ERISA Counsel Engagement",
    filename: "Forhemit-Counsel-Introduction-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("We are reaching out to introduce an ESOP transaction for {{companyName}} that may benefit from your ERISA expertise. Attached you will find the deal summary and our standard engagement terms."),
      p("We specifically need counsel with experience in LLC-to-C-corp conversion ESOP structures. Please initiate your conflict check at your earliest convenience and confirm availability."),
      p("We look forward to hearing from you and are happy to provide additional information as needed."),
    ),
  },

  "SBA lender introduction package cover email": {
    subject: "SBA ESOP Opportunity — {{companyName}} — Lender Package",
    filename: "Forhemit-Lender-Introduction-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Please find attached the lender introduction package for {{companyName}}. This includes a deal summary, capital structure overview, and our timeline for SBA financing."),
      p("We are seeking a lending partner experienced in SBA 7(a) ESOP transactions. The attached document outlines what Forhemit needs from the lender and our expected timeline."),
      p("Please review the package and let us know if you would like to schedule a call to discuss the opportunity in more detail."),
    ),
  },

  "Seller onboarding email — Day 1: Welcome + what to expect": {
    subject: "Welcome to Forhemit — Day 1 of Your ESOP Journey",
    filename: "Forhemit-Onboarding-Day1-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Welcome to Forhemit. We are excited to begin working with you on the ESOP transition for {{companyName}}."),
      p("Over the next five days, you will receive a series of onboarding emails designed to set you up for success. Today, we want to introduce you to the process, share what to expect, and provide your key contacts."),
      p("Please review the attached welcome document and do not hesitate to reach out with any questions. We are here to guide you through every step."),
    ),
  },

  "Seller onboarding email — Day 2: Document request list": {
    subject: "Day 2 — Documents We Need From You",
    filename: "Forhemit-Onboarding-Day2-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("As part of your onboarding, we need to gather certain documents to begin the transaction process. Attached you will find an organized list of what we need, along with deadlines for each item."),
      p("Please begin gathering these documents as soon as possible. Having them ready on schedule will help keep the transaction on track and avoid delays."),
      p("If you have questions about any of the requested items, please reach out to your deal lead."),
    ),
  },

  "Seller onboarding email — Day 3: Calendar link": {
    subject: "Day 3 — Schedule Your Check-In",
    filename: "Forhemit-Onboarding-Day3-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("As part of your onboarding, we would like to establish a regular check-in cadence. Attached you will find details on scheduling your recurring check-in calls with your Forhemit deal lead."),
      p("These calls are designed to keep you informed of progress, surface any blockers, and ensure we are aligned on priorities. We recommend scheduling at a consistent time each week."),
      p("Please use the attached information to book your first call. We look forward to staying connected throughout the process."),
    ),
  },

  "Seller onboarding email — Day 4: Team introduction": {
    subject: "Day 4 — Meet Your Deal Team",
    filename: "Forhemit-Onboarding-Day4-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Today we would like to introduce you to the deal team members who will be supporting your ESOP transition. Attached you will find a summary of each team member, their role, and how to reach them."),
      p("Your deal team includes specialists across transaction coordination, legal, valuation, and lending. Each member plays a specific role in moving your deal through the gate process."),
      p("Please do not hesitate to reach out to any team member directly. We work best when communication is open and frequent."),
    ),
  },

  "Seller onboarding email — Day 5: First check-in": {
    subject: "Day 5 — How Are Things Going?",
    filename: "Forhemit-Onboarding-Day5-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("You have completed your first week with Forhemit. We wanted to check in and see how things are going."),
      p("Have you had a chance to review the onboarding materials? Are there any questions or concerns we can address? Attached you will find a summary of what has been covered so far and what comes next."),
      p("We are here to support you. Please do not hesitate to reach out at any time."),
    ),
  },

  // ==========================================================================
  // 04-DILIGENCE
  // ==========================================================================

  "Gate 1 passage confirmation": {
    subject: "Gate 1 Passed — {{companyName}} — Capital Confirmed",
    filename: "Forhemit-Gate1-Confirmation-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("We are pleased to confirm that {{companyName}} has passed Gate 1. Capital for the transaction has been committed, including confirmation of the SBA indication."),
      p("This is a significant milestone. The deal now proceeds to Gate 2, which focuses on valuation confirmation. Please review the attached document for a summary of what was cleared and what comes next."),
      p("We will keep you informed of progress as we move through the next phase. Thank you for your continued partnership."),
    ),
  },

  "Gate 2 passage confirmation": {
    subject: "Gate 2 Passed — {{companyName}} — Valuation Confirmed",
    filename: "Forhemit-Gate2-Confirmation-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("We are pleased to confirm that {{companyName}} has passed Gate 2. The independent valuation has been completed and falls within the acceptable range of our LOI assumptions."),
      p("With valuation confirmed, we are now moving into the Quality of Earnings (QofE) scope. Please review the attached document for details on what was confirmed and the next steps."),
      p("The transaction continues to progress well. We will provide another update as we approach Gate 3."),
    ),
  },

  "Gate 3 passage confirmation": {
    subject: "Gate 3 Passed — {{companyName}} — Operations Cleared",
    filename: "Forhemit-Gate3-Confirmation-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("We are pleased to confirm that {{companyName}} has passed Gate 3. Operational diligence is complete, the COOP V3.0 has been finalized, and key management documents have been executed."),
      p("The deal now moves to Gate 4, which is the final legal clearance stage before closing. Please review the attached document for a full summary."),
      p("We are in the final stretch. We will keep you closely informed as we prepare for closing."),
    ),
  },

  "Gate failure / extension notice": {
    subject: "Update — {{companyName}} — Gate Extension Required",
    filename: "Forhemit-Gate-Extension-Notice-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("We are writing to inform you that the current gate for {{companyName}} has not cleared on its originally scheduled timeline. This is not uncommon, and there is no cause for alarm."),
      p("The attached document explains what items remain outstanding, what is needed to clear the gate, and a revised timeline. We want to be transparent about where things stand."),
      p("Please review the attached notice and let us know if you have any questions. We remain fully committed to moving this transaction forward."),
    ),
  },

  "Document request follow-up": {
    subject: "Friendly Reminder — Outstanding Documents — {{companyName}}",
    filename: "Forhemit-Document-Followup-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("We are following up on the document request sent previously for {{companyName}}. Several items remain outstanding, and we want to ensure the transaction stays on schedule."),
      p("The attached document lists the specific items we still need along with the requested deadlines. Timely receipt of these documents is important for keeping the deal on track."),
      p("If you are experiencing any difficulty gathering these materials, please let us know and we will work with you to find a solution."),
    ),
  },

  "Weekly deal status update (seller-facing)": {
    subject: "Weekly Status Update — {{companyName}} — Week of {{weekDate}}",
    filename: "Forhemit-Weekly-Status-{{companyName}}-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Please find attached your weekly deal status update for {{companyName}}. This update covers where things stand, what is needed from you this week, and the next upcoming milestone."),
      p("We send these updates every week to keep you fully informed and ensure nothing falls through the cracks. Please review the attached summary and let us know if you have any questions."),
      p("Thank you for your continued engagement. We appreciate your partnership."),
    ),
  },

  "Weekly deal status update (broker-facing)": {
    subject: "Deal Status — {{companyName}} — Week of {{weekDate}}",
    filename: "Forhemit-Broker-Status-{{companyName}}-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Please find attached the weekly status update for {{companyName}}. This is a summary of current deal progress and any items relevant to the broker relationship."),
      p("We provide these updates to keep our broker partners informed while protecting seller confidentiality. If you need additional detail on any item, please reach out directly."),
      p("Thank you for your continued partnership on this transaction."),
    ),
  },

  "Lender update email": {
    subject: "Lender Update — {{companyName}} — Week of {{weekDate}}",
    filename: "Forhemit-Lender-Update-{{companyName}}-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Please find attached the weekly lender update for {{companyName}}. This covers current underwriting status, any new items, and the estimated timeline for closing open conditions."),
      p("Proactive communication is important to us. We want to ensure you have the information you need to keep the SBA process moving smoothly."),
      p("Please do not hesitate to reach out if you need any additional documentation or clarification."),
    ),
  },

  "Trustee update memo": {
    subject: "Trustee Update — {{companyName}} — {{monthDate}}",
    filename: "Forhemit-Trustee-Update-{{companyName}}-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Please find attached the trustee update memo for {{companyName}}. This summarizes what Forhemit has delivered to date and any items that are still pending."),
      p("We keep our trustee partners informed throughout the transaction lifecycle to ensure alignment on timeline and deliverables. The attached memo covers the current status and next steps."),
      p("Please let us know if you have any questions or need additional information."),
    ),
  },

  "Broker pipeline status update template": {
    subject: "Pipeline Status — {{companyName}} — Gate {{currentGate}}",
    filename: "Forhemit-Broker-Pipeline-Status-{{companyName}}-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Please find attached the pipeline status update for {{companyName}}. This transaction is currently at Gate {{currentGate}} and progressing through the diligence process."),
      p("We send these recurring updates to keep our broker partners informed of deal milestones. The attached summary covers the current gate status and anticipated timeline."),
      p("Thank you for your continued partnership. Please reach out if you have any questions."),
    ),
  },

  // ==========================================================================
  // 05-CLOSING
  // ==========================================================================

  "Closing date confirmation": {
    subject: "Closing Date Confirmed — {{companyName}} — {{closingDate}}",
    filename: "Forhemit-Closing-Date-Confirmation-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("We are pleased to confirm that the closing for {{companyName}} has been scheduled for {{closingDate}}. Attached you will find the formal confirmation along with instructions on what you need to do, where to be, and what to bring."),
      p("Please review the attached document carefully and confirm your availability. If there are any conflicts or concerns, please let us know immediately so we can address them."),
      p("We are excited to reach this milestone with you. Thank you for your partnership throughout this process."),
    ),
  },

  "Closing congratulations letter": {
    subject: "Congratulations — {{companyName}} — Transaction Complete",
    filename: "Forhemit-Closing-Congratulations-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Congratulations. The ESOP transaction for {{companyName}} is now complete. This is a significant achievement, and we want to express our sincere appreciation for your trust and partnership throughout this process."),
      p("Attached you will find a closing congratulations letter summarizing the transaction and outlining the next phase of our relationship — the COOP stewardship program that begins on Day 121."),
      p("Today is a day to celebrate. We look forward to supporting you and your employee-owners in the years ahead."),
    ),
  },

  "Broker commission confirmation": {
    subject: "Commission Confirmation — {{companyName}} — Closing",
    filename: "Forhemit-Broker-Commission-Confirmation-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Please find attached the official commission confirmation for the {{companyName}} transaction. This document confirms the commission amount and the expected wire timing."),
      p("The commission will be wired in accordance with the terms agreed upon at deal acceptance. If you have any questions about the payment, please do not hesitate to reach out."),
      p("Thank you for your partnership on this transaction. We look forward to working with you on future deals."),
    ),
  },

  "Employee announcement template": {
    subject: "Employee Announcement Template — {{companyName}}",
    filename: "Forhemit-Employee-Announcement-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Attached you will find a draft employee announcement template for {{companyName}}. This template is designed to communicate the ESOP transition to your employees in plain, accessible language."),
      p("The announcement answers the most common employee questions: what does this mean for me, what changes, and what happens next. Please review and customize it to reflect your company's voice before distributing."),
      p("We recommend delivering this announcement within the first week after closing. We are available to help you prepare for any employee questions that may arise."),
    ),
  },

  "Press release template": {
    subject: "Press Release Template — {{companyName}}",
    filename: "Forhemit-Press-Release-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("As discussed, attached you will find a draft press release template for the {{companyName}} ESOP transition. This template positions the transaction as an employee ownership milestone rather than a traditional M&A event."),
      p("Please review the draft and customize it to your preferences. We recommend coordinating the timing of any public announcement with your legal counsel."),
      p("If you choose not to issue a press release, no action is needed. This template is provided as a resource for those who wish to share the news publicly."),
    ),
  },

  // ==========================================================================
  // 06-POST-CLOSE
  // ==========================================================================

  "COOP kickoff letter": {
    subject: "COOP Stewardship Kickoff — {{companyName}}",
    filename: "Forhemit-COOP-Kickoff-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Welcome to the COOP stewardship program for {{companyName}}. Beginning today, Forhemit transitions from transaction coordinator to long-term stewardship partner."),
      p("The attached kickoff letter outlines the four COOP tracks — People, Systems, Financial, and Governance — along with our meeting schedule, your Forhemit contacts, and the fee structure for the stewardship engagement."),
      p("We are committed to helping {{companyName}} thrive as an employee-owned company. Please review the attached materials and let us know if you have any questions as we begin this phase together."),
    ),
  },

  "Monthly COOP check-in agenda": {
    subject: "Monthly COOP Check-In — {{companyName}} — {{monthDate}}",
    filename: "Forhemit-COOP-Monthly-Agenda-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Please find attached the agenda for this month's COOP stewardship check-in for {{companyName}}. The agenda covers progress across all four tracks: People, Systems, Financial, and Governance."),
      p("Please review the attached agenda before our call and come prepared to discuss any items that require attention. If there are additional topics you would like to cover, please let us know in advance."),
      p("We appreciate your continued engagement with the stewardship program."),
    ),
  },

  "COOP track status report": {
    subject: "Quarterly COOP Status Report — {{companyName}} — {{quarter}}",
    filename: "Forhemit-COOP-Status-Report-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Please find attached the quarterly COOP track status report for {{companyName}}. This report provides a detailed assessment of progress across People, Systems, Financial, and Governance tracks versus the stewardship plan."),
      p("This report is shared with both the company and the independent trustee to ensure transparency and alignment on stewardship outcomes."),
      p("Please review the attached report and let us know if you have any questions or would like to discuss any items in more detail."),
    ),
  },

  "Refinance trigger notification": {
    subject: "Refinance Window Now Open — {{companyName}}",
    filename: "Forhemit-Refinance-Trigger-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("This is to notify you that the mandatory conventional refinance window for {{companyName}} is now open. As outlined in the original transaction documents, the SBA loan must be refinanced within this window."),
      p("The attached document provides details on the refinance timeline, requirements, and recommended next steps. Forhemit will coordinate with lending partners to facilitate this process."),
      p("Please review the attached notification and let us know if you have any questions. We will be in touch shortly to discuss the lender outreach plan."),
    ),
  },

  "Seller note retirement confirmation": {
    subject: "Seller Note Retired — {{companyName}}",
    filename: "Forhemit-Seller-Note-Retirement-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("We are pleased to inform you that the seller note for {{companyName}} has been fully paid and retired. Attached you will find the formal confirmation letter."),
      p("This marks the completion of the financial obligations from the original ESOP transaction. The employee trust now holds full equity in the company without any remaining seller financing."),
      p("Congratulations on reaching this milestone. If you have any questions, please do not hesitate to reach out."),
    ),
  },

  "COOP completion letter": {
    subject: "COOP Stewardship Complete — {{companyName}}",
    filename: "Forhemit-COOP-Completion-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("After 24 months of stewardship, the COOP program for {{companyName}} is now complete. Attached you will find a formal completion letter summarizing the outcomes achieved across all four tracks."),
      p("We are proud of what has been accomplished together. The attached document includes a summary of outcomes and any transition recommendations for the company going forward."),
      p("Thank you for your trust and partnership. Forhemit remains available as a resource should you need support in the future."),
    ),
  },

  "Employee ownership anniversary note": {
    subject: "Happy Anniversary — {{companyName}} — One Year of Employee Ownership",
    filename: "Forhemit-Anniversary-Note-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("Congratulations on the first anniversary of employee ownership at {{companyName}}. This is a meaningful milestone worth celebrating."),
      p("Over the past year, your company has taken significant steps toward building a sustainable employee-owned culture. We hope the attached note serves as a reminder of what has been achieved and what lies ahead."),
      p("We remain proud to have been part of your ESOP journey and wish you continued success."),
    ),
  },

  "Case study request": {
    subject: "Would You Share Your Story? — {{companyName}}",
    filename: "Forhemit-Case-Study-Request-{{ref}}.pdf",
    body: wrap(
      greeting("{{recipientName}}"),
      p("As we reflect on the successful ESOP transition for {{companyName}}, we would like to ask if you would be open to participating in an anonymized case study."),
      p("Case studies are one of the most effective ways to help other business owners understand the ESOP process. The attached document explains what participation involves, how your information would be protected, and how the case study would be used."),
      p("There is no obligation, and we completely understand if you prefer not to participate. Please let us know either way at your convenience."),
    ),
  },
};

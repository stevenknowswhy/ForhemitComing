"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Check, Plus, Trash2 } from "lucide-react";
import {
	Field,
	FieldLabel,
	FieldError,
	FieldSeparator,
} from "@/components/ui/field";
import {
	FormHeader,
	FormFooter,
	StepFields,
	PreviousButton,
	NextButton,
	SubmitButton,
	MultiStepFormContent,
} from "@/components/multi-step-viewer";
import { MultiStepFormProvider } from "@/hooks/use-multi-step-viewer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
	companyFormSchema,
	defaultCompanyFormValues,
	type CompanyFormValues,
} from "../lib/company-form-schema";

// ── Option imports ───────────────────────────────────────────────────────────
import {
	DEAL_STAGE_OPTIONS,
	NDA_OPTIONS,
	INDUSTRY_OPTIONS,
	BUSINESS_MODEL_OPTIONS,
	FINANCIAL_RANGE_OPTIONS,
	EMPLOYEE_RANGE_OPTIONS,
	TRANSITION_TIMELINE_OPTIONS,
	PRIMARY_MOTIVATION_OPTIONS,
	NURTURE_STAGE_OPTIONS,
	URGENCY_OPTIONS,
	TRUST_LEVEL_OPTIONS,
	IDENTITY_ATTACHMENT_OPTIONS,
	OPENNESS_OPTIONS,
	SUCCESSOR_OPTIONS_LIST,
	PROFITABILITY_OPTIONS,
	GROWTH_TREND_OPTIONS,
	OWNER_DEPENDENCY_OPTIONS,
	ADVISOR_TYPE_OPTIONS,
	ADVISOR_OPENNESS_OPTIONS,
	RELATIONSHIP_STRENGTH_OPTIONS,
	NEXT_NURTURE_ACTION_OPTIONS,
	CLOSE_CONFIDENCE_OPTIONS,
	CONTACT_FREQUENCY_OPTIONS,
	HOW_WE_HEARD_OPTIONS_LIST,
	PREFERRED_CONTACT_OPTIONS,
} from "@forhemit/shared/features/crm";

// ============================================================================
// CompanyForm — 7-step stewardship CRM wizard
// ============================================================================

interface CompanyFormProps {
	onSubmit: (data: CompanyFormValues) => Promise<void>;
	onCancel: () => void;
	defaultValues?: Partial<CompanyFormValues>;
	isEditing?: boolean;
}

export function CompanyForm({
	onSubmit,
	onCancel,
	defaultValues,
	isEditing = false,
}: CompanyFormProps) {
	const form = useForm<CompanyFormValues>({
		resolver: zodResolver(companyFormSchema) as any,
		defaultValues: {
			...defaultCompanyFormValues,
			...defaultValues,
		},
	});

	const {
		fields: ownerFields,
		append: appendOwner,
		remove: removeOwner,
	} = useFieldArray({ control: form.control, name: "owners" });

	const {
		fields: advisorFields,
		append: appendAdvisor,
		remove: removeAdvisor,
	} = useFieldArray({ control: form.control, name: "advisors" });

	const { formState } = form;
	const hasBroker = form.watch("hasBroker");

	const handleSubmit = form.handleSubmit(async (data) => {
		try {
			await onSubmit(data);
			form.reset();
		} catch (error) {
			console.error("Form submission error:", error);
		}
	});

	// ── Step definitions ─────────────────────────────────────────────────────

	const stepsFields = [
		// ============================================================
		// STEP 1: Business Basics
		// ============================================================
		{
			fields: [
				"name",
				"industry",
				"subIndustry",
				"businessModel",
				"yearsInBusiness",
				"revenueRange",
				"employeeCountRange",
				"city",
				"state",
				"website",
				"address",
				"phone",
				"howWeHeardAboutThem",
				"dateFirstContact",
			],
			component: (
				<>
					<h2 className="mt-4 mb-1 font-bold text-2xl tracking-tight col-span-full">
						Business Basics
					</h2>
					<p className="tracking-wide text-muted-foreground mb-5 text-wrap text-sm col-span-full">
						Tell us about the business
					</p>

					<TextField
						name="name"
						label="Company Name *"
						control={form.control}
						placeholder="Acme Manufacturing Co."
					/>
					<SelectField
						name="industry"
						label="Industry"
						control={form.control}
						options={INDUSTRY_OPTIONS}
						placeholder="Select industry"
					/>
					<TextField
						name="subIndustry"
						label="Sub-Industry"
						control={form.control}
						placeholder="e.g. Precision machining"
					/>
					<SelectField
						name="businessModel"
						label="Business Model"
						control={form.control}
						options={BUSINESS_MODEL_OPTIONS}
						placeholder="Select model"
					/>
					<TextField
						name="yearsInBusiness"
						label="Years in Business"
						control={form.control}
						type="number"
						placeholder="25"
					/>
					<SelectField
						name="revenueRange"
						label="Annual Revenue"
						control={form.control}
						options={FINANCIAL_RANGE_OPTIONS}
						placeholder="Select range"
					/>
					<SelectField
						name="employeeCountRange"
						label="Employee Count"
						control={form.control}
						options={EMPLOYEE_RANGE_OPTIONS}
						placeholder="Select range"
					/>
					<TextField
						name="city"
						label="City"
						control={form.control}
						placeholder="Grand Rapids"
					/>
					<TextField
						name="state"
						label="State"
						control={form.control}
						placeholder="MI"
					/>
					<TextField
						name="website"
						label="Website"
						control={form.control}
						placeholder="https://acme.com"
					/>
					<TextField
						name="address"
						label="Address"
						control={form.control}
						placeholder="123 Main St"
					/>
					<TextField
						name="phone"
						label="Company Phone"
						control={form.control}
						placeholder="(616) 555-1234"
					/>
					<SelectField
						name="howWeHeardAboutThem"
						label="How We Heard"
						control={form.control}
						options={HOW_WE_HEARD_OPTIONS_LIST}
						placeholder="Select source"
					/>
					<TextField
						name="dateFirstContact"
						label="Date of First Contact"
						control={form.control}
						type="date"
					/>
				</>
			),
		},

		// ============================================================
		// STEP 2: Owner Info
		// ============================================================
		{
			fields: ["owners"],
			component: (
				<>
					<h2 className="mt-4 mb-1 font-bold text-2xl tracking-tight col-span-full">
						Owner Information
					</h2>
					<p className="tracking-wide text-muted-foreground mb-5 text-wrap text-sm col-span-full">
						Primary owner and any additional owners
					</p>

					{ownerFields.map((field, index) => (
						<div
							key={field.id}
							className="col-span-full border rounded-lg p-4 space-y-4"
						>
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-sm">
									{index === 0 ? "Primary Owner" : `Additional Owner ${index}`}
								</h3>
								{index > 0 && (
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										onClick={() => removeOwner(index)}
									>
										<Trash2 className="h-4 w-4 text-destructive" />
									</Button>
								)}
							</div>

							<div className="grid grid-cols-6 gap-4">
								<TextField
									name={`owners.${index}.firstName`}
									label="First Name *"
									control={form.control}
									placeholder="John"
								/>
								<TextField
									name={`owners.${index}.lastName`}
									label="Last Name *"
									control={form.control}
									placeholder="Smith"
								/>
								<TextField
									name={`owners.${index}.phone`}
									label="Phone"
									control={form.control}
									placeholder="(616) 555-5678"
								/>
								<TextField
									name={`owners.${index}.email`}
									label="Email"
									control={form.control}
									type="email"
									placeholder="john@acme.com"
								/>
								<TextField
									name={`owners.${index}.address`}
									label="Address"
									control={form.control}
									placeholder="Personal address"
								/>
								<TextField
									name={`owners.${index}.ownershipPct`}
									label="Ownership %"
									control={form.control}
									type="number"
									placeholder="100"
								/>
								<TextField
									name={`owners.${index}.roleInBusiness`}
									label="Role in Business"
									control={form.control}
									placeholder="CEO / Founder"
								/>
								<SelectField
									name={`owners.${index}.preferredContact`}
									label="Preferred Contact"
									control={form.control}
									options={PREFERRED_CONTACT_OPTIONS}
									placeholder="Select"
								/>
								<TextField
									name={`owners.${index}.linkedInUrl`}
									label="LinkedIn"
									control={form.control}
									placeholder="https://linkedin.com/in/..."
								/>
								<TextField
									name={`owners.${index}.birthday`}
									label="Birthday"
									control={form.control}
									type="date"
								/>
								<TextField
									name={`owners.${index}.spouseName`}
									label="Spouse Name"
									control={form.control}
									placeholder="Jane"
								/>
								<TextField
									name={`owners.${index}.personalInterests`}
									label="Personal Interests"
									control={form.control}
									placeholder="Golf, Fishing, Family (comma-separated)"
								/>
							</div>
						</div>
					))}

					<div className="col-span-full">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() =>
								appendOwner({ firstName: "", lastName: "", isNew: true })
							}
						>
							<Plus className="h-4 w-4 mr-1" />
							Add Owner
						</Button>
					</div>
				</>
			),
		},

		// ============================================================
		// STEP 3: Transition Readiness
		// ============================================================
		{
			fields: [
				"transitionTimeline",
				"targetTransitionDate",
				"retirementGoalAge",
				"ownerAge",
				"primaryMotivation",
				"motivationDetail",
				"urgencyLevel",
				"hasSuccessorInMind",
				"familyInBusiness",
				"familyMemberNames",
				"identityTiedToBusiness",
				"openToConversation",
				"trustLevel",
				"whatTheyCareMostAbout",
				"dealBreakers",
				"readinessScore",
				"nextNurtureAction",
				"nurtureStage",
			],
			component: (
				<>
					<h2 className="mt-4 mb-1 font-bold text-2xl tracking-tight col-span-full">
						Transition Readiness
					</h2>
					<p className="tracking-wide text-muted-foreground mb-5 text-wrap text-sm col-span-full">
						Your unique advantage — where is this owner in their journey?
					</p>

					<SelectField
						name="transitionTimeline"
						label="Transition Timeline"
						control={form.control}
						options={TRANSITION_TIMELINE_OPTIONS}
						placeholder="Select timeline"
					/>
					<TextField
						name="targetTransitionDate"
						label="Target Transition Date"
						control={form.control}
						type="date"
					/>
					<TextField
						name="ownerAge"
						label="Owner Age"
						control={form.control}
						type="number"
						placeholder="58"
					/>
					<TextField
						name="retirementGoalAge"
						label="Retirement Goal Age"
						control={form.control}
						type="number"
						placeholder="65"
					/>
					<SelectField
						name="primaryMotivation"
						label="Primary Motivation"
						control={form.control}
						options={PRIMARY_MOTIVATION_OPTIONS}
						placeholder="Select motivation"
					/>
					<div className="col-span-full">
						<TextAreaField
							name="motivationDetail"
							label="Motivation Detail (their words)"
							control={form.control}
							placeholder="What did they say about why they're considering this?"
						/>
					</div>
					<SelectField
						name="urgencyLevel"
						label="Urgency Level"
						control={form.control}
						options={URGENCY_OPTIONS}
						placeholder="Select"
					/>
					<SelectField
						name="hasSuccessorInMind"
						label="Has Successor in Mind?"
						control={form.control}
						options={SUCCESSOR_OPTIONS_LIST}
						placeholder="Select"
					/>
					<CheckboxField
						name="familyInBusiness"
						label="Family in Business"
						control={form.control}
					/>
					<TextField
						name="familyMemberNames"
						label="Family Member Names"
						control={form.control}
						placeholder="Names of family in the business"
					/>
					<SelectField
						name="identityTiedToBusiness"
						label="Identity Tied to Business"
						control={form.control}
						options={IDENTITY_ATTACHMENT_OPTIONS}
						placeholder="Select"
					/>
					<SelectField
						name="openToConversation"
						label="Openness to Conversation"
						control={form.control}
						options={OPENNESS_OPTIONS}
						placeholder="Select"
					/>
					<SelectField
						name="trustLevel"
						label="Trust Level"
						control={form.control}
						options={TRUST_LEVEL_OPTIONS}
						placeholder="Select"
					/>
					<div className="col-span-full">
						<TextAreaField
							name="whatTheyCareMostAbout"
							label="What They Care Most About"
							control={form.control}
							placeholder="Legacy / Employees / Family / Price / Speed / Continuity"
						/>
					</div>
					<div className="col-span-full">
						<TextAreaField
							name="dealBreakers"
							label="Deal Breakers"
							control={form.control}
							placeholder="What would kill a deal for them?"
						/>
					</div>
					<TextField
						name="readinessScore"
						label="Readiness Score (1–10)"
						control={form.control}
						type="number"
						placeholder="5"
					/>
					<SelectField
						name="nextNurtureAction"
						label="Next Nurture Action"
						control={form.control}
						options={NEXT_NURTURE_ACTION_OPTIONS}
						placeholder="Select"
					/>
					<SelectField
						name="nurtureStage"
						label="Nurture Stage"
						control={form.control}
						options={NURTURE_STAGE_OPTIONS}
						placeholder="Select"
					/>
				</>
			),
		},

		// ============================================================
		// STEP 4: Business Snapshot
		// ============================================================
		{
			fields: [
				"ebitdaRange",
				"askingPriceExpectation",
				"ourValuationEstimate",
				"profitability",
				"revenueGrowthTrend",
				"primaryAssets",
				"realEstateOwned",
				"debtOnBusiness",
				"ownerCompensation",
				"businessDependentOnOwner",
				"financialNotes",
			],
			component: (
				<>
					<h2 className="mt-4 mb-1 font-bold text-2xl tracking-tight col-span-full">
						Business Snapshot
					</h2>
					<p className="tracking-wide text-muted-foreground mb-5 text-wrap text-sm col-span-full">
						Light financials — enough to have an intelligent conversation
					</p>

					<SelectField
						name="ebitdaRange"
						label="EBITDA Range"
						control={form.control}
						options={FINANCIAL_RANGE_OPTIONS}
						placeholder="Select range"
					/>
					<TextField
						name="askingPriceExpectation"
						label="Asking Price Expectation"
						control={form.control}
						placeholder="$5M"
					/>
					<TextField
						name="ourValuationEstimate"
						label="Our Valuation Estimate"
						control={form.control}
						placeholder="$4.2M"
					/>
					<SelectField
						name="profitability"
						label="Profitability"
						control={form.control}
						options={PROFITABILITY_OPTIONS}
						placeholder="Select"
					/>
					<SelectField
						name="revenueGrowthTrend"
						label="Revenue Growth Trend"
						control={form.control}
						options={GROWTH_TREND_OPTIONS}
						placeholder="Select"
					/>
					<SelectField
						name="businessDependentOnOwner"
						label="Business Dependent on Owner"
						control={form.control}
						options={OWNER_DEPENDENCY_OPTIONS}
						placeholder="Select"
					/>
					<CheckboxField
						name="realEstateOwned"
						label="Real Estate Owned"
						control={form.control}
					/>
					<TextField
						name="debtOnBusiness"
						label="Debt on Business"
						control={form.control}
						placeholder="$1.2M SBA loan"
					/>
					<TextField
						name="ownerCompensation"
						label="Owner Compensation"
						control={form.control}
						placeholder="$350K"
					/>
					<div className="col-span-full">
						<TextAreaField
							name="financialNotes"
							label="Financial Notes"
							control={form.control}
							placeholder="Books kept by wife, uses QuickBooks, no audit history"
						/>
					</div>
				</>
			),
		},

		// ============================================================
		// STEP 5: Broker & Advisors
		// ============================================================
		{
			fields: ["hasBroker", "broker", "advisors"],
			component: (
				<>
					<h2 className="mt-4 mb-1 font-bold text-2xl tracking-tight col-span-full">
						Broker & Advisors
					</h2>
					<p className="tracking-wide text-muted-foreground mb-5 text-wrap text-sm col-span-full">
						Who else is involved in this deal?
					</p>

					{/* Broker toggle */}
					<div className="col-span-full">
						<CheckboxField
							name="hasBroker"
							label="This deal has a broker"
							control={form.control}
						/>
					</div>

					{/* Broker fields (conditional) */}
					{hasBroker && (
						<>
							<FieldSeparator className="col-span-full">
								Broker Information
							</FieldSeparator>
							<TextField
								name="broker.firstName"
								label="Broker First Name *"
								control={form.control}
								placeholder="First name"
							/>
							<TextField
								name="broker.lastName"
								label="Broker Last Name *"
								control={form.control}
								placeholder="Last name"
							/>
							<TextField
								name="broker.phone"
								label="Phone"
								control={form.control}
								placeholder="(616) 555-9999"
							/>
							<TextField
								name="broker.email"
								label="Email"
								control={form.control}
								type="email"
								placeholder="broker@firm.com"
							/>
							<TextField
								name="broker.firm"
								label="Firm"
								control={form.control}
								placeholder="Morgan Stanley"
							/>
							<TextField
								name="broker.website"
								label="Website"
								control={form.control}
								placeholder="https://..."
							/>
							<TextField
								name="broker.dateMet"
								label="Date Met"
								control={form.control}
								type="date"
							/>
						</>
					)}

					{/* Advisors */}
					<FieldSeparator className="col-span-full">Advisors</FieldSeparator>

					{advisorFields.map((field, index) => (
						<div
							key={field.id}
							className="col-span-full border rounded-lg p-4 space-y-4"
						>
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-sm">Advisor {index + 1}</h3>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									onClick={() => removeAdvisor(index)}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
							</div>

							<div className="grid grid-cols-6 gap-4">
								<TextField
									name={`advisors.${index}.firstName`}
									label="First Name *"
									control={form.control}
									placeholder="First name"
								/>
								<TextField
									name={`advisors.${index}.lastName`}
									label="Last Name *"
									control={form.control}
									placeholder="Last name"
								/>
								<SelectField
									name={`advisors.${index}.type`}
									label="Type *"
									control={form.control}
									options={ADVISOR_TYPE_OPTIONS}
									placeholder="Select type"
								/>
								<TextField
									name={`advisors.${index}.phone`}
									label="Phone"
									control={form.control}
									placeholder="Phone"
								/>
								<TextField
									name={`advisors.${index}.email`}
									label="Email"
									control={form.control}
									type="email"
									placeholder="Email"
								/>
								<TextField
									name={`advisors.${index}.firm`}
									label="Firm"
									control={form.control}
									placeholder="Firm name"
								/>
								<SelectField
									name={`advisors.${index}.relationshipStrength`}
									label="Relationship"
									control={form.control}
									options={RELATIONSHIP_STRENGTH_OPTIONS}
									placeholder="Select"
								/>
								<SelectField
									name={`advisors.${index}.advisorOpenToUs`}
									label="Open to Us"
									control={form.control}
									options={ADVISOR_OPENNESS_OPTIONS}
									placeholder="Select"
								/>
								<TextField
									name={`advisors.${index}.date`}
									label="Date Met"
									control={form.control}
									type="date"
								/>
								<div className="col-span-full">
									<TextAreaField
										name={`advisors.${index}.notes`}
										label="Notes"
										control={form.control}
										placeholder="Their CPA has been with them 20 years — key gatekeeper"
									/>
								</div>
							</div>
						</div>
					))}

					<div className="col-span-full">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() =>
								appendAdvisor({
									firstName: "",
									lastName: "",
									type: "",
									isNew: true,
								})
							}
						>
							<Plus className="h-4 w-4 mr-1" />
							Add Advisor
						</Button>
					</div>
				</>
			),
		},

		// ============================================================
		// STEP 6: Pipeline & Nurture
		// ============================================================
		{
			fields: [
				"stage",
				"ndaStatus",
				"estimatedCloseDate",
				"probabilityPct",
				"closeConfidence",
				"whyWeWinThis",
				"whyWeMightLose",
				"recycleDate",
				"recycleReason",
				"contactFrequencyGoal",
				"eventsAttendedTogether",
				"referralsMadeForThem",
			],
			component: (
				<>
					<h2 className="mt-4 mb-1 font-bold text-2xl tracking-tight col-span-full">
						Pipeline & Relationship
					</h2>
					<p className="tracking-wide text-muted-foreground mb-5 text-wrap text-sm col-span-full">
						Where is this deal and how is the relationship?
					</p>

					<SelectField
						name="stage"
						label="Deal Stage *"
						control={form.control}
						options={DEAL_STAGE_OPTIONS}
						placeholder="Select stage"
					/>
					<SelectField
						name="ndaStatus"
						label="NDA Status"
						control={form.control}
						options={NDA_OPTIONS}
						placeholder="Select"
					/>
					<TextField
						name="estimatedCloseDate"
						label="Estimated Close Date"
						control={form.control}
						type="date"
					/>
					<TextField
						name="probabilityPct"
						label="Probability %"
						control={form.control}
						type="number"
						placeholder="50"
					/>
					<SelectField
						name="closeConfidence"
						label="Close Confidence"
						control={form.control}
						options={CLOSE_CONFIDENCE_OPTIONS}
						placeholder="Select"
					/>
					<div className="col-span-full">
						<TextAreaField
							name="whyWeWinThis"
							label="Why We Win This"
							control={form.control}
							placeholder="What's working in our favor?"
						/>
					</div>
					<div className="col-span-full">
						<TextAreaField
							name="whyWeMightLose"
							label="Why We Might Lose"
							control={form.control}
							placeholder="What could go wrong?"
						/>
					</div>
					<TextField
						name="recycleDate"
						label="Recycle Date"
						control={form.control}
						type="date"
					/>
					<TextField
						name="recycleReason"
						label="Recycle Reason"
						control={form.control}
						placeholder="Check back in Q2 2026"
					/>
					<SelectField
						name="contactFrequencyGoal"
						label="Contact Frequency Goal"
						control={form.control}
						options={CONTACT_FREQUENCY_OPTIONS}
						placeholder="Select"
					/>
					<TextField
						name="eventsAttendedTogether"
						label="Events Attended Together"
						control={form.control}
						placeholder="Golf tourney May 2024"
					/>
					<TextField
						name="referralsMadeForThem"
						label="Referrals Made for Them"
						control={form.control}
						placeholder="Referred to Dr. Smith - dentist"
					/>
				</>
			),
		},

		// ============================================================
		// STEP 7: Notes & Next Steps
		// ============================================================
		{
			fields: [
				"notes",
				"internalNotes",
				"tags",
				"nextAction",
				"nextActionDate",
				"reminderSet",
				"reminderDate",
			],
			component: (
				<>
					<h2 className="mt-4 mb-1 font-bold text-2xl tracking-tight col-span-full">
						Notes & Next Steps
					</h2>
					<p className="tracking-wide text-muted-foreground mb-5 text-wrap text-sm col-span-full">
						Capture what matters and what comes next
					</p>

					<div className="col-span-full">
						<TextAreaField
							name="notes"
							label="Notes"
							control={form.control}
							placeholder="Anything worth remembering..."
						/>
					</div>
					<div className="col-span-full">
						<TextAreaField
							name="internalNotes"
							label="Internal Notes (not visible to client)"
							control={form.control}
							placeholder="Sensitive observations..."
						/>
					</div>
					<TextField
						name="tags"
						label="Tags"
						control={form.control}
						placeholder="#urgent #healthcare #revisit (comma-separated)"
					/>
					<TextField
						name="nextAction"
						label="Next Action"
						control={form.control}
						placeholder="Send valuation guide"
					/>
					<TextField
						name="nextActionDate"
						label="Next Action Date"
						control={form.control}
						type="date"
					/>
					<CheckboxField
						name="reminderSet"
						label="Set Reminder"
						control={form.control}
					/>
					<TextField
						name="reminderDate"
						label="Reminder Date"
						control={form.control}
						type="date"
					/>
				</>
			),
		},
	];

	// ── Render ───────────────────────────────────────────────────────────────

	if (formState.isSubmitSuccessful) {
		return (
			<div className="p-2 sm:p-5 md:p-8 w-full rounded-md gap-2 border">
				<motion.div
					initial={{ opacity: 0, y: -16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
					className="h-full py-6 px-3"
				>
					<motion.div
						initial={{ scale: 0.5 }}
						animate={{ scale: 1 }}
						transition={{
							delay: 0.3,
							type: "spring",
							stiffness: 500,
							damping: 15,
						}}
						className="mb-4 flex justify-center border rounded-full w-fit mx-auto p-2"
					>
						<Check className="size-8" />
					</motion.div>
					<h2 className="text-center text-2xl text-pretty font-bold mb-2">
						{isEditing ? "Company Updated" : "Company Created"}
					</h2>
					<p className="text-center text-lg text-pretty text-muted-foreground">
						{isEditing
							? "Changes saved successfully."
							: "New company added to your pipeline."}
					</p>
				</motion.div>
			</div>
		);
	}

	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-4xl gap-2 border"
			>
				<MultiStepFormProvider
					stepsFields={stepsFields}
					onStepValidation={async (step) => {
						const isValid = await form.trigger(step.fields as any);
						return isValid;
					}}
				>
					<MultiStepFormContent>
						<FormHeader />
						<StepFields />
						<FormFooter>
							<div className="flex items-center justify-between w-full">
								<Button type="button" variant="ghost" onClick={onCancel}>
									Cancel
								</Button>
								<div className="flex gap-2">
									<PreviousButton>
										<ChevronLeft />
										Previous
									</PreviousButton>
									<NextButton>
										Next <ChevronRight />
									</NextButton>
									<SubmitButton type="submit" disabled={formState.isSubmitting}>
										{formState.isSubmitting
											? "Saving..."
											: isEditing
												? "Save Changes"
												: "Create Company"}
									</SubmitButton>
								</div>
							</div>
						</FormFooter>
					</MultiStepFormContent>
				</MultiStepFormProvider>
			</form>
		</div>
	);
}

// ============================================================================
// Reusable Field Components
// ============================================================================

function TextField({
	name,
	label,
	control,
	placeholder,
	type = "text",
}: {
	name: string;
	label: string;
	control: any;
	placeholder?: string;
	type?: string;
}) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid} className="gap-1 col-span-3">
					<FieldLabel htmlFor={name}>{label}</FieldLabel>
					<Input
						{...field}
						id={name}
						type={type}
						value={field.value ?? ""}
						onChange={(e) => {
							if (type === "number") {
								field.onChange(
									e.target.value === "" ? undefined : e.target.valueAsNumber,
								);
							} else {
								field.onChange(e.target.value);
							}
						}}
						aria-invalid={fieldState.invalid}
						placeholder={placeholder}
					/>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}

function SelectField({
	name,
	label,
	control,
	options,
	placeholder,
}: {
	name: string;
	label: string;
	control: any;
	options: { value: string; label: string }[];
	placeholder?: string;
}) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid} className="gap-1 col-span-3">
					<FieldLabel htmlFor={name}>{label}</FieldLabel>
					<Select value={field.value ?? ""} onValueChange={field.onChange}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}

function TextAreaField({
	name,
	label,
	control,
	placeholder,
}: {
	name: string;
	label: string;
	control: any;
	placeholder?: string;
}) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid} className="gap-1">
					<FieldLabel htmlFor={name}>{label}</FieldLabel>
					<Textarea
						{...field}
						aria-invalid={fieldState.invalid}
						id={name}
						value={field.value ?? ""}
						placeholder={placeholder}
						rows={3}
					/>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}

function CheckboxField({
	name,
	label,
	control,
}: {
	name: string;
	label: string;
	control: any;
}) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid} className="gap-1">
					<div className="flex items-center gap-2">
						<Checkbox
							id={name}
							checked={field.value ?? false}
							onCheckedChange={field.onChange}
							aria-invalid={fieldState.invalid}
						/>
						<FieldLabel htmlFor={name}>{label}</FieldLabel>
					</div>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}

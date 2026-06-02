import type * as z from "zod";
import { formSchema } from "@/lib/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { motion } from "motion/react";
import { Check } from "lucide-react";
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

import { FileUpload } from "@/components/form-fields/file-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

//------------------------------
type Schema = z.infer<typeof formSchema>;

export function GeneratedForm() {
	const form = useForm<Schema>({
		resolver: zodResolver(formSchema as any),
	});
	const {
		formState: { isSubmitting, isSubmitSuccessful },
	} = form;

	const handleSubmit = form.handleSubmit(async (data: Schema) => {
		try {
			// TODO: implement form submission
			console.log(data);
			form.reset();
		} catch (error) {
			// TODO: handle error
		}
	});
	const stepsFields = [
		{
			fields: ["firstName", "lastName", "email", "phone", "years-owned1"],
			component: (
				<>
					<h2 className="mt-4 mb-1 font-bold text-2xl tracking-tight col-span-full">
						Owner Information
					</h2>

					<Controller
						name="firstName"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="gap-1 md:col-span-3"
							>
								<FieldLabel htmlFor="firstName">Owner First Name </FieldLabel>
								<Input
									{...field}
									id="firstName"
									type="text"
									onChange={(e) => {
										field.onChange(e.target.value);
									}}
									aria-invalid={fieldState.invalid}
									placeholder="Enter your first name"
								/>

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="lastName"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="gap-1 md:col-span-3"
							>
								<FieldLabel htmlFor="lastName">Owner Last Name </FieldLabel>
								<Input
									{...field}
									id="lastName"
									type="text"
									onChange={(e) => {
										field.onChange(e.target.value);
									}}
									aria-invalid={fieldState.invalid}
									placeholder="Enter your last name"
								/>

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="email"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="gap-1 md:col-span-3"
							>
								<FieldLabel htmlFor="email">Email Address </FieldLabel>
								<Input
									{...field}
									id="email"
									type="text"
									onChange={(e) => {
										field.onChange(e.target.value);
									}}
									aria-invalid={fieldState.invalid}
									placeholder="Enter your email address"
								/>

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="phone"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="gap-1 md:col-span-3"
							>
								<FieldLabel htmlFor="phone">Phone Number </FieldLabel>
								<Input
									{...field}
									id="phone"
									type="text"
									onChange={(e) => {
										field.onChange(e.target.value);
									}}
									aria-invalid={fieldState.invalid}
									placeholder="Enter your phone number"
								/>

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="years-owned1"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="gap-1 md:col-span-2"
							>
								<FieldLabel htmlFor="years-owned1">
									Years Owned Business{" "}
								</FieldLabel>
								<Input
									{...field}
									id="years-owned1"
									type="number"
									onChange={(e) => {
										field.onChange(e.target.valueAsNumber);
									}}
									aria-invalid={fieldState.invalid}
									placeholder="Enter your text"
								/>

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</>
			),
		},
		{
			fields: ["company-name", "formation-type"],
			component: (
				<>
					<h2 className="mt-4 mb-1 font-bold text-2xl tracking-tight col-span-full">
						Business Details
					</h2>
					<p className="tracking-wide text-muted-foreground mb-5 text-wrap text-sm col-span-full">
						Please provide the business information
					</p>

					<Controller
						name="company-name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="gap-1 col-span-full"
							>
								<FieldLabel htmlFor="company-name">Company Name *</FieldLabel>
								<Input
									{...field}
									id="company-name"
									type="text"
									onChange={(e) => {
										field.onChange(e.target.value);
									}}
									aria-invalid={fieldState.invalid}
									placeholder="Company Name"
								/>

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="formation-type"
						control={form.control}
						render={({ field, fieldState }) => {
							const options = [
								{ value: "c-corp", label: "C-Corp" },
								{ value: "s-corp", label: "S-Corp" },
								{ value: "llc", label: "LLC" },
								{ value: "sole_prop", label: "Sole_prop" },
								{ value: "unknown", label: "Unknown" },
							];
							return (
								<Field
									data-invalid={fieldState.invalid}
									className="gap-1 col-span-full"
								>
									<FieldLabel htmlFor="formation-type">
										Business Formation Type{" "}
									</FieldLabel>

									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a formation" />
										</SelectTrigger>
										<SelectContent>
											{options.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							);
						}}
					/>
				</>
			),
		},
		{
			fields: [
				"emergencyContactName",
				"emergencyContactRelationship",
				"emergencyContactPhone",
				"emergencyContactEmail",
			],
			component: (
				<>
					<h2 className="mt-4 mb-1 font-bold text-2xl tracking-tight col-span-full">
						Emergency Contact
					</h2>
					<p className="tracking-wide text-muted-foreground mb-5 text-wrap text-sm col-span-full">
						Please provide emergency contact information
					</p>

					<div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
						<Controller
							name="emergencyContactName"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									className="gap-1 col-span-full"
								>
									<FieldLabel htmlFor="emergencyContactName">
										Emergency Contact Name *
									</FieldLabel>
									<Input
										{...field}
										id="emergencyContactName"
										type="text"
										onChange={(e) => {
											field.onChange(e.target.value);
										}}
										aria-invalid={fieldState.invalid}
										placeholder={`Enter contact's full name`}
									/>

									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="emergencyContactRelationship"
							control={form.control}
							render={({ field, fieldState }) => {
								const options = [
									{ label: "Spouse", value: "spouse" },
									{ label: "Parent", value: "parent" },
									{ label: "Sibling", value: "sibling" },
									{ label: "Child", value: "child" },
									{ label: "Friend", value: "friend" },
									{ label: "Other", value: "other" },
								];
								return (
									<Field
										data-invalid={fieldState.invalid}
										className="gap-1 col-span-full"
									>
										<FieldLabel htmlFor="emergencyContactRelationship">
											Relationship *
										</FieldLabel>

										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select relationship" />
											</SelectTrigger>
											<SelectContent>
												{options.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								);
							}}
						/>
					</div>

					<div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
						<Controller
							name="emergencyContactPhone"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									className="gap-1 col-span-full"
								>
									<FieldLabel htmlFor="emergencyContactPhone">
										Emergency Contact Phone *
									</FieldLabel>
									<Input
										{...field}
										id="emergencyContactPhone"
										type="text"
										onChange={(e) => {
											field.onChange(e.target.value);
										}}
										aria-invalid={fieldState.invalid}
										placeholder={`Enter contact's phone number`}
									/>

									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="emergencyContactEmail"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									className="gap-1 col-span-full"
								>
									<FieldLabel htmlFor="emergencyContactEmail">
										Emergency Contact Email{" "}
									</FieldLabel>
									<Input
										{...field}
										id="emergencyContactEmail"
										type="text"
										onChange={(e) => {
											field.onChange(e.target.value);
										}}
										aria-invalid={fieldState.invalid}
										placeholder={`Enter contact's email address`}
									/>

									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</div>
				</>
			),
		},
		{
			fields: [
				"resume",
				"idDocument",
				"handbookAgreement",
				"confidentialityAgreement",
				"codeOfConductAgreement",
				"additionalNotes",
			],
			component: (
				<>
					<h2 className="mt-4 mb-1 font-bold text-2xl tracking-tight col-span-full">
						Documents & Agreements
					</h2>
					<p className="tracking-wide text-muted-foreground mb-5 text-wrap text-sm col-span-full">
						Please upload required documents and review agreements
					</p>

					<Controller
						name="resume"
						control={form.control}
						render={({ field, fieldState }) => (
							<div>
								<Field
									data-invalid={fieldState.invalid}
									className="gap-1 col-span-full"
								>
									<FieldLabel htmlFor="resume">Resume/CV *</FieldLabel>

									<FileUpload
										{...field}
										setValue={form.setValue as any}
										name="resume"
										placeholder="Upload your resume (PDF, DOC, DOCX)"
										accept={`application/pdf, application/doc, application/docx`}
										maxFiles={1}
										maxSize={1048576}
									/>
								</Field>
								{Array.isArray(fieldState.error) ? (
									fieldState.error?.map((error, i) => (
										<p
											key={i}
											role="alert"
											data-slot="field-error"
											className="text-destructive text-sm"
										>
											{error.message}
										</p>
									))
								) : (
									<FieldError errors={[fieldState.error]} />
								)}
							</div>
						)}
					/>

					<Controller
						name="idDocument"
						control={form.control}
						render={({ field, fieldState }) => (
							<div>
								<Field
									data-invalid={fieldState.invalid}
									className="gap-1 col-span-full"
								>
									<FieldLabel htmlFor="idDocument">Government ID *</FieldLabel>

									<FileUpload
										{...field}
										setValue={form.setValue as any}
										name="idDocument"
										placeholder="Upload a copy of your government ID (PDF, JPG, PNG)"
										accept={`application/pdf, image/jpeg, image/png`}
										maxFiles={1}
										maxSize={1048576}
									/>
								</Field>
								{Array.isArray(fieldState.error) ? (
									fieldState.error?.map((error, i) => (
										<p
											key={i}
											role="alert"
											data-slot="field-error"
											className="text-destructive text-sm"
										>
											{error.message}
										</p>
									))
								) : (
									<FieldError errors={[fieldState.error]} />
								)}
							</div>
						)}
					/>
					<FieldSeparator className="my-4 col-span-full">
						Agreements
					</FieldSeparator>
					<Controller
						name="handbookAgreement"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="gap-1 col-span-full"
							>
								<div className="flex items-center gap-2 mb-1">
									<Checkbox
										id="handbookAgreement"
										checked={field.value}
										onCheckedChange={field.onChange}
										aria-invalid={fieldState.invalid}
									/>
									<FieldLabel htmlFor="handbookAgreement">
										I have read and agree to the Employee Handbook *
									</FieldLabel>
								</div>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name="confidentialityAgreement"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="gap-1 col-span-full"
							>
								<div className="flex items-center gap-2 mb-1">
									<Checkbox
										id="confidentialityAgreement"
										checked={field.value}
										onCheckedChange={field.onChange}
										aria-invalid={fieldState.invalid}
									/>
									<FieldLabel htmlFor="confidentialityAgreement">
										I agree to the Confidentiality Agreement *
									</FieldLabel>
								</div>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name="codeOfConductAgreement"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="gap-1 col-span-full"
							>
								<div className="flex items-center gap-2 mb-1">
									<Checkbox
										id="codeOfConductAgreement"
										checked={field.value}
										onCheckedChange={field.onChange}
										aria-invalid={fieldState.invalid}
									/>
									<FieldLabel htmlFor="codeOfConductAgreement">
										I agree to abide by the Company Code of Conduct *
									</FieldLabel>
								</div>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="additionalNotes"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="gap-1 col-span-full"
							>
								<FieldLabel htmlFor="additionalNotes">
									Additional Notes or Questions{" "}
								</FieldLabel>
								<Textarea
									{...field}
									aria-invalid={fieldState.invalid}
									id="additionalNotes"
									placeholder={`Any additional information or questions you'd like to share...`}
								/>

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</>
			),
		},
	];

	if (isSubmitSuccessful) {
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
						Thank you
					</h2>
					<p className="text-center text-lg text-pretty text-muted-foreground">
						Form submitted successfully, we will get back to you soon
					</p>
				</motion.div>
			</div>
		);
	}
	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border"
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
							<PreviousButton>
								<ChevronLeft />
								Previous
							</PreviousButton>
							<NextButton>
								Next <ChevronRight />
							</NextButton>
							<SubmitButton type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Submitting..." : "Submit"}
							</SubmitButton>
						</FormFooter>
					</MultiStepFormContent>
				</MultiStepFormProvider>
			</form>
		</div>
	);
}

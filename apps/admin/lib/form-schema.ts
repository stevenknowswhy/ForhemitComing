import * as z from "zod";

export interface ActionResponse<T = any> {
	success: boolean;
	message: string;
	errors?: {
		[K in keyof T]?: string[];
	};
	inputs?: T;
}
export const formSchema = z.object({
	firstName: z.string({ error: "This field is required" }).optional(),
	lastName: z.string({ error: "This field is required" }).optional(),
	email: z.email({ error: "Please enter a valid email" }).optional(),
	phone: z.coerce
		.number({ error: "Please enter a valid phone number" })
		.optional(),
	"years-owned1": z.coerce
		.number({ error: "Please enter a valid number" })
		.optional(),
	"company-name": z.string({ error: "This field is required" }),
	"formation-type": z.string().min(1, "Please select an item").optional(),
	emergencyContactName: z.string({ error: "This field is required" }),
	emergencyContactRelationship: z.string().min(1, "Please select an item"),
	emergencyContactPhone: z.coerce.number({
		error: "Please enter a valid phone number",
	}),
	emergencyContactEmail: z
		.email({ error: "Please enter a valid email" })
		.optional(),
	resume: z.union([
		z.file().mime(["application/pdf", "application/doc", "application/docx"]),
		z
			.array(
				z
					.file()
					.mime(["application/pdf", "application/doc", "application/docx"]),
			)
			.nonempty({ message: "Please select a file" }),
		z.string().min(1, "Please select a file"),
		z.instanceof(FileList),
	]),
	idDocument: z.union([
		z.file().mime(["application/pdf", "image/jpeg", "image/png"]),
		z
			.array(z.file().mime(["application/pdf", "image/jpeg", "image/png"]))
			.nonempty({ message: "Please select a file" }),
		z.string().min(1, "Please select a file"),
		z.instanceof(FileList),
	]),
	handbookAgreement: z.literal(true, { error: "This field is required" }),
	confidentialityAgreement: z.literal(true, {
		error: "This field is required",
	}),
	codeOfConductAgreement: z.literal(true, { error: "This field is required" }),
	additionalNotes: z.string({ error: "This field is required" }).optional(),
});

"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import DOMPurify from "isomorphic-dompurify";

export default function FormPage() {
	const params = useParams();
	const router = useRouter();
	const taskId = params.taskId as Id<"workflowTasks">;

	const formData = useQuery(api.formSubmissions.getFormData, {
		workflowTaskId: taskId,
	});
	const submitForm = useMutation(api.formSubmissions.submitForm);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [formDataState, setFormDataState] = useState<Record<string, string>>(
		{},
	);
	const [templateHtml, setTemplateHtml] = useState<string | null>(null);

	// Fetch template content from File Storage URL when available
	useEffect(() => {
		if (!formData?.template) return;

		// Prefer File Storage URL (migrated templates)
		if (formData.template.contentUrl) {
			fetch(formData.template.contentUrl)
				.then((res) => res.text())
				.then((html) => setTemplateHtml(html))
				.catch(() => setTemplateHtml(formData.template?.content ?? null));
		} else {
			// Fall back to inline content (pre-migration)
			setTemplateHtml(formData.template.content ?? null);
		}
	}, [formData]);

	if (!formData) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-stone-50">
				<div className="text-stone-500">Loading form...</div>
			</div>
		);
	}

	if (
		formData.task.status === "received" ||
		formData.task.status === "completed"
	) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-stone-50">
				<div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-stone-200 p-8 text-center">
					<div className="text-4xl mb-4">✓</div>
					<h1 className="text-xl font-semibold text-stone-900 mb-2">
						Form Already Submitted
					</h1>
					<p className="text-stone-600">
						This form has already been submitted. Thank you for your response.
					</p>
				</div>
			</div>
		);
	}

	if (submitted) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-stone-50">
				<div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-stone-200 p-8 text-center">
					<div className="text-4xl mb-4">✓</div>
					<h1 className="text-xl font-semibold text-stone-900 mb-2">
						Thank You!
					</h1>
					<p className="text-stone-600">
						Your form has been submitted successfully. We&apos;ll be in touch
						soon.
					</p>
				</div>
			</div>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await submitForm({
				workflowTaskId: taskId,
				responseData: formDataState,
				submittedBy: formData.contact?.email,
			});
			setSubmitted(true);
		} catch (error) {
			console.error("Form submission error:", error);
			alert("Failed to submit form. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (field: string, value: string) => {
		setFormDataState((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="min-h-screen bg-stone-50 py-12 px-4">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-t-lg shadow-sm border border-stone-200 border-b-0 p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-8 h-8 bg-brass-100 rounded-full flex items-center justify-center">
							<span className="text-brass-700 font-semibold text-sm">F</span>
						</div>
						<span className="text-sm text-stone-500">Forhemit</span>
					</div>
					<h1 className="text-2xl font-semibold text-stone-900">
						{formData.template?.title}
					</h1>
					<p className="text-stone-600 mt-2">
						{formData.template?.description}
					</p>

					{formData.company && (
						<div className="mt-4 pt-4 border-t border-stone-100">
							<p className="text-sm text-stone-500">
								Company:{" "}
								<span className="text-stone-700 font-medium">
									{formData.company.name}
								</span>
							</p>
							<p className="text-sm text-stone-500">
								Stage:{" "}
								<span className="text-stone-700">{formData.company.stage}</span>
							</p>
						</div>
					)}
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="bg-white rounded-b-lg shadow-sm border border-stone-200 p-6"
				>
					{/* Dynamic form fields based on template content */}
					{templateHtml ? (
						<div className="prose prose-stone max-w-none mb-6">
							<div
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(templateHtml),
								}}
							/>
						</div>
					) : (
						<div className="space-y-4 mb-6">
							{/* Default form fields */}
							<div>
								<label className="block text-sm font-medium text-stone-700 mb-1">
									Full Name
								</label>
								<input
									type="text"
									value={formDataState.name || ""}
									onChange={(e) => handleChange("name", e.target.value)}
									className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brass-500 focus:border-transparent"
									placeholder={
										formData.contact
											? `${formData.contact.firstName} ${formData.contact.lastName}`
											: "Your name"
									}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-stone-700 mb-1">
									Email
								</label>
								<input
									type="email"
									value={formDataState.email || ""}
									onChange={(e) => handleChange("email", e.target.value)}
									className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brass-500 focus:border-transparent"
									placeholder={formData.contact?.email || "your@email.com"}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-stone-700 mb-1">
									Additional Notes
								</label>
								<textarea
									value={formDataState.notes || ""}
									onChange={(e) => handleChange("notes", e.target.value)}
									rows={4}
									className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brass-500 focus:border-transparent"
									placeholder="Any additional information..."
								/>
							</div>
						</div>
					)}

					{/* Submit button */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full bg-brass-600 text-white py-3 px-4 rounded-md hover:bg-brass-700 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isSubmitting ? "Submitting..." : "Submit"}
					</button>
				</form>

				{/* Footer */}
				<div className="text-center mt-6 text-sm text-stone-400">
					<p>Forhemit Transition Stewardship</p>
					<p>548 Market St, Suite 36451, San Francisco, CA 94104</p>
				</div>
			</div>
		</div>
	);
}

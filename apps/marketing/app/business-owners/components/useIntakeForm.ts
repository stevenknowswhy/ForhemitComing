"use client";

import { useState, useCallback } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
export interface IntakeFormState {
	path: "nda" | "light" | null;
	stepIdx: number;
	agreed: boolean;
	signed: boolean;
	form: Record<string, string>;
	ebitdaIdx: number;
	isSubmitting: boolean;
}

const INITIAL_STATE: IntakeFormState = {
	path: null,
	stepIdx: 0,
	agreed: false,
	signed: false,
	form: {},
	ebitdaIdx: 2,
	isSubmitting: false,
};

const STEP_REQUIREMENTS: Record<
	string,
	(
		form: Record<string, string>,
		agreed: boolean,
		signed: boolean,
		path?: string | null,
	) => boolean
> = {
	path: (_f, _a, _s, path) => !!path,
	nda: (_f, agreed, signed) => agreed && signed,
	contact: (form) => !!(form.name && form.email && form.phone),
	business: (form) => !!(form.bizName && form.industry && form.employees),
	financials: () => true,
	situation: (form) => !!form.timeline,
};

export function useIntakeForm(defaultPath?: "nda" | "light" | null) {
	const [state, setState] = useState<IntakeFormState>({
		...INITIAL_STATE,
		path: defaultPath ?? null,
		stepIdx: defaultPath ? 1 : 0,
	});

	const submitContact = useMutation(api.contactSubmissions.submit);
	const sendIntakeNotification = useAction(
		api.emails.sendConfidentialIntakeNotification,
	);

	const setField = useCallback(
		(k: string, v: string) =>
			setState((s) => ({ ...s, form: { ...s.form, [k]: v } })),
		[],
	);

	const setEbitdaIdx = useCallback(
		(idx: number) => setState((s) => ({ ...s, ebitdaIdx: idx })),
		[],
	);

	const reset = useCallback(() => {
		setState({
			...INITIAL_STATE,
			path: defaultPath ?? null,
			stepIdx: defaultPath ? 1 : 0,
		});
	}, [defaultPath]);

	const canAdvance = useCallback(
		(currentStepId: string | undefined): boolean => {
			if (state.isSubmitting || !currentStepId) return false;
			const check = STEP_REQUIREMENTS[currentStepId];
			return check
				? check(state.form, state.agreed, state.signed, state.path)
				: true;
		},
		[state.isSubmitting, state.form, state.agreed, state.signed, state.path],
	);

	const buildMessage = useCallback((): string => {
		const intakePath = state.path || "light";
		const f = state.form;
		return [
			`Intake path: ${intakePath === "nda" ? "Confidential (NDA signed)" : "Light intake"}`,
			f.bizName ? `Business: ${f.bizName}` : "",
			f.state ? `State: ${f.state}` : "",
			f.industry ? `Industry: ${f.industry}` : "",
			f.employees ? `Employees: ${f.employees}` : "",
			f.years ? `Years: ${f.years}` : "",
			f.ebitda ? `EBITDA: ${f.ebitda}` : "",
			f.entity ? `Entity: ${f.entity}` : "",
			f.timeline ? `Timeline: ${f.timeline}` : "",
			f.notes ? `Notes: ${f.notes}` : "",
		]
			.filter(Boolean)
			.join("\n");
	}, [state.path, state.form]);

	const submitIntake = useCallback(async () => {
		setState((s) => ({ ...s, isSubmitting: true }));
		const intakePath = state.path || "light";
		const f = state.form;
		const nameParts = (f.name || "").trim().split(/\s+/);

		try {
			await submitContact({
				contactType: "business-owner",
				firstName: nameParts[0] || "",
				lastName: nameParts.slice(1).join(" ") || "",
				email: f.email || "",
				phone: f.phone,
				company: f.bizName,
				interest: "esop-transition",
				message: buildMessage(),
				source: `business-owners-intake-${intakePath}`,
			});
		} catch (err) {
			console.error("Convex submission error:", err);
		}

		try {
			await sendIntakeNotification({
				path: intakePath,
				name: f.name || "",
				email: f.email || "",
				phone: f.phone || "",
				role: f.role || undefined,
				bizName: f.bizName || undefined,
				state: f.state || undefined,
				industry: f.industry || undefined,
				employees: f.employees || undefined,
				years: f.years || undefined,
				ebitda: f.ebitda || undefined,
				entity: f.entity || undefined,
				timeline: f.timeline || undefined,
				notes: f.notes || undefined,
				ndaSigned: intakePath === "nda" ? true : undefined,
			});
		} catch (err) {
			console.error("Notification error:", err);
		}

		setState((s) => ({ ...s, isSubmitting: false }));
	}, [
		state.path,
		state.form,
		submitContact,
		sendIntakeNotification,
		buildMessage,
	]);

	return {
		state,
		setState,
		setField,
		setEbitdaIdx,
		reset,
		canAdvance,
		submitIntake,
	};
}

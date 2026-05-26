"use client";

import { NDA_STEPS, NON_NDA_STEPS } from "../constants";
import {
	PathStep,
	NdaStep,
	ContactStep,
	BusinessStep,
	FinancialsStep,
	SituationStep,
	DoneStep,
} from "./intake-steps";
import { useIntakeForm } from "./useIntakeForm";

interface ConfidentialIntakeModalProps {
	isOpen: boolean;
	defaultPath?: "nda" | "light" | null;
	onClose: () => void;
}

const STEP_TITLES: Record<string, string> = {
	path: "How would you like to start?",
	nda: "A quick confidentiality agreement",
	contact: "Let\u2019s start with you",
	business: "Tell us about the business",
	financials: "Financial snapshot",
	situation: "Your situation",
	done: "We\u2019ll be in touch",
};

const EXCLUDED_STEP_IDS = new Set(["path", "done"]);

export function ConfidentialIntakeModal({
	isOpen,
	defaultPath,
	onClose,
}: ConfidentialIntakeModalProps) {
	const {
		state,
		setState,
		setField,
		setEbitdaIdx,
		reset,
		canAdvance,
		submitIntake,
	} = useIntakeForm(defaultPath);

	const steps = state.path === "nda" ? NDA_STEPS : NON_NDA_STEPS;
	const currentStep = steps[state.stepIdx];
	const currentStepId = currentStep?.id;

	const handleClose = () => {
		reset();
		onClose();
	};

	const advance = async () => {
		if (state.stepIdx >= steps.length - 1) return;
		const nextStep = steps[state.stepIdx + 1];
		if (nextStep?.id === "done") await submitIntake();
		setState((s) => ({ ...s, stepIdx: s.stepIdx + 1 }));
	};

	const back = () => {
		if (state.stepIdx > 0) setState((s) => ({ ...s, stepIdx: s.stepIdx - 1 }));
	};

	const selectPath = (p: "nda" | "light") => {
		setState((s) => ({ ...s, path: p, stepIdx: 1 }));
	};

	const totalActiveSteps = steps.filter(
		(s) => !EXCLUDED_STEP_IDS.has(s.id),
	).length;
	const currentActiveIdx = steps
		.slice(0, state.stepIdx)
		.filter((s) => !EXCLUDED_STEP_IDS.has(s.id)).length;

	if (!isOpen) return null;

	const headerLabel =
		currentStepId === "done"
			? "All done"
			: state.path === "nda"
				? "Confidential Intake"
				: "Quick Overview";

	return (
		<div
			className="ci-overlay"
			onClick={(e) => {
				if (e.target === e.currentTarget) handleClose();
			}}
		>
			<div className="ci-modal" role="dialog" aria-modal="true">
				<div className="ci-header">
					<div>
						<p className="ci-header-label">{headerLabel}</p>
						<h2 className="ci-header-title">
							{STEP_TITLES[currentStepId ?? ""] ?? ""}
						</h2>
					</div>
					<button
						className="ci-close"
						onClick={handleClose}
						type="button"
						aria-label="Close"
					>
						&#10005;
					</button>
				</div>

				<div className="ci-body">
					{currentStepId !== "path" && currentStepId !== "done" && (
						<div className="ci-step-prog">
							{Array.from({ length: totalActiveSteps }).map((_, i) => (
								<div
									key={i}
									className={`ci-step-seg ${i < currentActiveIdx ? "ci-seg-done" : i === currentActiveIdx ? "ci-seg-active" : ""}`}
								/>
							))}
						</div>
					)}

					{currentStepId === "path" && !state.path && (
						<PathStep path={state.path} onSelect={selectPath} />
					)}

					{currentStepId === "nda" && (
						<NdaStep
							agreed={state.agreed}
							signed={state.signed}
							onAgreeToggle={() =>
								setState((s) => ({ ...s, agreed: !s.agreed }))
							}
							onSign={() => setState((s) => ({ ...s, signed: true }))}
							onClearSig={() => setState((s) => ({ ...s, signed: false }))}
							onBack={back}
							onAdvance={advance}
							canAdvance={canAdvance(currentStepId)}
						/>
					)}

					{currentStepId === "contact" && (
						<ContactStep
							form={state.form}
							setField={setField}
							onBack={back}
							onAdvance={advance}
							canAdvance={canAdvance(currentStepId)}
						/>
					)}

					{currentStepId === "business" && (
						<BusinessStep
							form={state.form}
							setField={setField}
							onBack={back}
							onAdvance={advance}
							canAdvance={canAdvance(currentStepId)}
						/>
					)}

					{currentStepId === "financials" && (
						<FinancialsStep
							form={state.form}
							setField={setField}
							ebitdaIdx={state.ebitdaIdx}
							onEbitdaChange={setEbitdaIdx}
							onBack={back}
							onAdvance={advance}
							canAdvance={canAdvance(currentStepId)}
						/>
					)}

					{currentStepId === "situation" && (
						<SituationStep
							form={state.form}
							setField={setField}
							onBack={back}
							onAdvance={advance}
							canAdvance={canAdvance(currentStepId)}
						/>
					)}

					{currentStepId === "done" && (
						<DoneStep
							path={state.path}
							name={state.form.name}
							onClose={handleClose}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

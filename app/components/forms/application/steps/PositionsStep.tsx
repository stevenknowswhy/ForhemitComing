"use client";

interface PositionsStepProps {
  onBack: () => void;
  onContinue: () => void;
  onSelectPosition: (position: string) => void;
}

interface JobPosition {
  title: string;
  description: string;
  isOpen: boolean;
}

const JOBS: JobPosition[] = [
  {
    title: "Chief Operating Officer (COO) Stewardship",
    description: "Focus: Cultural continuity, employee-owner development, human systems. Distinct from: Financial performance monitoring.",
    isOpen: true,
  },
  {
    title: "Director ESOP Architect",
    description: "Focus: Designing the ownership vehicle, vesting structures, repurchase obligations, feasibility studies. Note: Likely a consultant/contractor role initially, not necessarily full-time, unless doing 3+ deals/year.",
    isOpen: false,
  },
  {
    title: "Funding Director",
    description: "Focus: Pre-investment storytelling (unions, family offices, sellers). Distinct from: Post-investment investor management.",
    isOpen: true,
  },
  {
    title: "Director of Investor Relations",
    description: "Focus: LP communications, distributions, reporting, \"keeping them happy\" after the check clears.",
    isOpen: false,
  },
  {
    title: "Director of Origination & Acquisitions",
    description: "Focus: Deal flow, initial screening, separating great from good.",
    isOpen: false,
  },
];

export function PositionsStep({ onBack, onContinue, onSelectPosition }: PositionsStepProps) {
  return (
    <div className="form-step active">
      <div className="step-content">
        <h2>Open Positions</h2>
        <table className="positions-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {JOBS.map((job, index) => (
              <tr key={index}>
                <td className="position-title">{job.title}</td>
                <td className="position-description">{job.description}</td>
                <td className="position-status">
                  {job.isOpen ? (
                    <button
                      className="status-link"
                      onClick={() => onSelectPosition(job.title)}
                    >
                      Open
                    </button>
                  ) : (
                    <span className="status-closed">Closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-row">
        <button className="nav-link-btn back-link" onClick={onBack}>
          Back
        </button>
        <button className="nav-link-btn continue-link" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

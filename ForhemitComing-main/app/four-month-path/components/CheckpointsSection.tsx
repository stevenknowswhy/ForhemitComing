import type { CheckpointRow } from "../constants";

type Props = {
  checkpoints: CheckpointRow[];
  sectionId?: string;
  headingId?: string;
  title?: string;
  lead?: string;
};

export function CheckpointsSection({
  checkpoints,
  sectionId = "fmp-checkpoints",
  headingId = "fmp-checkpoints-heading",
  title = "The 4 checkpoints that must clear",
  lead = "Instead of hard gates, think of these as the four checkpoints everyone needs to see before closing. If any checkpoint fails, we pause and fix it—no surprises at closing.",
}: Props) {
  return (
    <section id={sectionId} className="fmp-section fmp-checkpoints" aria-labelledby={headingId}>
      <h2 id={headingId} className="fmp-section-title">
        {title}
      </h2>
      <p className="fmp-section-lead">{lead}</p>
      <ul className="fmp-checkpoint-list">
        {checkpoints.map((c, i) => (
          <li key={`${c.title}-${c.day}-${i}`} className="fmp-checkpoint-item">
            <div className="fmp-checkpoint-shell">
              <div className="fmp-checkpoint-shell__glow" aria-hidden />
              <div className="fmp-checkpoint-card">
                <div className="fmp-checkpoint-head">
                  <span className="fmp-checkpoint-name">{c.title}</span>
                  <span className="fmp-checkpoint-day">{c.day}</span>
                </div>
                <p className="fmp-checkpoint-body">{c.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

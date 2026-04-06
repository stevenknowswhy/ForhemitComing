"use client";

import { useCallback, useEffect, useId, useState, type KeyboardEvent } from "react";
import type { PhaseBlock } from "../constants";

type Props = {
  phases: PhaseBlock[];
};

function usePrefersCoarsePrimary() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return coarse;
}

export function FourPhaseTimeline({ phases }: Props) {
  const coarsePointer = usePrefersCoarsePrimary();
  const hintId = useId();
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const toggleCard = useCallback(
    (id: string) => {
      if (!coarsePointer) return;
      setFlippedId((prev) => (prev === id ? null : id));
    },
    [coarsePointer]
  );

  const onKeyToggle = useCallback(
    (e: KeyboardEvent<HTMLDivElement>, id: string) => {
      if (!coarsePointer) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCard(id);
      }
    },
    [coarsePointer, toggleCard]
  );

  return (
    <div className="fmp-timeline-wrap">
      <p id={hintId} className="fmp-timeline-hint">
        Tap a card to see what happens in that month. Tap again to return.
      </p>
      <ul className="fmp-timeline" aria-label="Four month path timeline">
        {phases.map((phase) => {
          const isFlipped = coarsePointer && flippedId === phase.id;
          return (
            <li key={phase.id} className="fmp-timeline-item">
              <div
                className={`fmp-phase-shell ${isFlipped ? "fmp-phase-shell--flipped" : ""}`}
                role={coarsePointer ? "button" : undefined}
                tabIndex={coarsePointer ? 0 : undefined}
                aria-expanded={coarsePointer ? isFlipped : undefined}
                aria-label={
                  coarsePointer
                    ? `${phase.monthLabel}. ${phase.checkpoint}. Tap for phase details.`
                    : undefined
                }
                aria-describedby={coarsePointer ? hintId : undefined}
                onClick={() => toggleCard(phase.id)}
                onKeyDown={(e) => onKeyToggle(e, phase.id)}
              >
                <div className="fmp-phase-shell__glow" aria-hidden />
                <div className="fmp-flip-card">
                  <div className="fmp-flip-inner">
                    <div
                      className="fmp-flip-face fmp-flip-face--front"
                      aria-hidden={coarsePointer ? isFlipped : undefined}
                    >
                      <p className="fmp-phase-days fmp-phase-days--front">{phase.dayRange}</p>
                      <p className="fmp-phase-title fmp-phase-title--front">{phase.monthLabel}</p>
                      <p className="fmp-phase-checkpoint fmp-phase-checkpoint--front">{phase.checkpoint}</p>
                      <span className="fmp-flip-cue" aria-hidden>
                        {coarsePointer ? "Tap for details" : "Hover for details"}
                      </span>
                    </div>
                    <div
                      className="fmp-flip-face fmp-flip-face--back"
                      aria-hidden={coarsePointer ? !isFlipped : undefined}
                    >
                      <p className="fmp-phase-days fmp-phase-days--back">{phase.dayRange}</p>
                      <p className="fmp-flip-back-label">What happens</p>
                      <ul className="fmp-phase-list fmp-phase-list--back">
                        {phase.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

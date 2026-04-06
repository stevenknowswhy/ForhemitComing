"use client";

import { useEffect, useRef } from "react";
import { NDA_TEXT } from "../../constants";

interface NdaStepProps {
  agreed: boolean;
  signed: boolean;
  onAgreeToggle: () => void;
  onSign: () => void;
  onClearSig: () => void;
  onBack: () => void;
  onAdvance: () => void;
  canAdvance: boolean;
}

export function NdaStep({
  agreed,
  signed,
  onAgreeToggle,
  onSign,
  onClearSig,
  onBack,
  onAdvance,
  canAdvance,
}: NdaStepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "var(--color-brand)";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const getPos = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      const src = "touches" in e ? e.touches[0] : e;
      return { x: src.clientX - r.left, y: src.clientY - r.top };
    };

    const start = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      drawing.current = true;
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    };

    const move = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!drawing.current) return;
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      onSign();
    };

    const end = () => {
      drawing.current = false;
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", move);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
      canvas.removeEventListener("touchend", end);
    };
  }, [onSign]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    onClearSig();
  };

  return (
    <div>
      <div
        className="ci-nda-box"
        dangerouslySetInnerHTML={{ __html: NDA_TEXT }}
      />

      <div className="ci-checkbox-row" onClick={onAgreeToggle}>
        <div className={`ci-checkbox-box ${agreed ? "ci-checked" : ""}`}>
          {agreed && <span className="ci-checkbox-check">&#10003;</span>}
        </div>
        <span className="ci-checkbox-label">
          I have read and agree to the terms of this{" "}
          <span>Mutual Non-Disclosure Agreement</span>. I understand this
          agreement is mutual&mdash;both parties are bound.
        </span>
      </div>

      <label className="ci-field-label" style={{ marginBottom: "0.5rem" }}>
        Sign here
      </label>
      <canvas ref={canvasRef} className="ci-sig-canvas" width={500} height={80} />
      <div className="ci-sig-controls">
        <button className="ci-sig-clear" onClick={clearCanvas} type="button">
          Clear signature
        </button>
      </div>

      <div className="ci-step-nav">
        <button className="ci-btn-back" onClick={onBack} type="button">
          &larr; Back
        </button>
        <button
          className={`ci-btn-next ${canAdvance ? "ci-btn-primary" : ""}`}
          disabled={!canAdvance}
          onClick={onAdvance}
          type="button"
        >
          Sign &amp; Continue
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import { ScenarioResult } from "../../types";
import { fmtX, getDscrColor } from "../../lib";
import { SCENARIOS, MIN_DSCR_COVENANT } from "../../constants";

interface ScenarioPanelProps {
  scenarios: ScenarioResult[];
}

export function ScenarioPanel({ scenarios }: ScenarioPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || scenarios.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get data
    const labels = scenarios[0]?.rows.map((r) => `Yr ${r.year}`) || [];

    // Draw grid
    ctx.strokeStyle = "rgba(138, 160, 184, 0.2)";
    ctx.lineWidth = 1;
    const yMax = 3;
    const gridLines = 6;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = "#8AA0B8";
      ctx.font = "10px DM Mono, monospace";
      ctx.textAlign = "right";
      const value = yMax * (1 - i / gridLines);
      ctx.fillText(value.toFixed(1) + "x", padding.left - 10, y + 3);
    }

    // Draw X-axis labels
    labels.forEach((label, i) => {
      if (i % 2 === 0 || labels.length <= 10) {
        const x = padding.left + (i / (labels.length - 1)) * chartWidth;
        ctx.fillStyle = "#8AA0B8";
        ctx.font = "10px DM Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, x, height - padding.bottom + 20);
      }
    });

    // Draw 1.25x reference line
    const minDscrY = padding.top + chartHeight - (MIN_DSCR_COVENANT / yMax) * chartHeight;
    ctx.strokeStyle = "rgba(184, 92, 0, 0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(padding.left, minDscrY);
    ctx.lineTo(width - padding.right, minDscrY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw scenario lines
    scenarios.forEach((scen, scenIdx) => {
      const color = SCENARIOS[scenIdx]?.color || "#1B4F8A";
      const isBase = scenIdx === 0;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      if (!isBase) {
        ctx.setLineDash(scenIdx === 2 ? [3, 2] : [5, 3]);
      }

      ctx.beginPath();
      scen.rows.forEach((row, i) => {
        if (row.dscr === null) return;
        const x = padding.left + (i / (labels.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - (Math.min(row.dscr, yMax) / yMax) * chartHeight;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw points
      ctx.fillStyle = color;
      scen.rows.forEach((row, i) => {
        if (row.dscr === null) return;
        const x = padding.left + (i / (labels.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - (Math.min(row.dscr, yMax) / yMax) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }, [scenarios]);

  return (
    <div>
      <div className="erm-legend">
        {SCENARIOS.map((scen) => (
          <div key={scen.key} className="erm-legend-item">
            <div className="erm-legend-sq" style={{ background: scen.color }} />
            {scen.label}
          </div>
        ))}
        <div className="erm-legend-item">
          <div className="erm-legend-sq" style={{ background: "#B85C00", opacity: 0.7 }} />
          SBA floor 1.25x
        </div>
      </div>
      <div className="erm-chart-wrap">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Scenario summary cards */}
      <div className="erm-scen-summary">
        {scenarios.map((scen, idx) => {
          const color = getDscrColor(scen.year1Dscr);
          return (
            <div key={scen.name} className="erm-scen-card">
              <div
                className="erm-scen-card-title"
                style={{ color: SCENARIOS[idx]?.color || "#4F637A" }}
              >
                {scen.name}
              </div>
              <div className="erm-scen-card-value" style={{ color }}>
                {scen.year1Dscr ? fmtX(scen.year1Dscr) : "—"}
              </div>
              <div className="erm-scen-card-sub">Yr 1 DSCR</div>
              <div className="erm-scen-card-min" style={{ color: getDscrColor(scen.minDscr) }}>
                {scen.minDscr ? fmtX(scen.minDscr) : "—"} min
              </div>
              {scen.yearsBelowMin > 0 ? (
                <div className="erm-scen-card-warning">
                  {scen.yearsBelowMin} yr{scen.yearsBelowMin > 1 ? "s" : ""} below 1.25x
                </div>
              ) : (
                <div className="erm-scen-card-success">All years ≥ 1.25x</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

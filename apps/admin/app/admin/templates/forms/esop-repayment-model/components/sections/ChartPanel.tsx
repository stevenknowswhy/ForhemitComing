"use client";

import React, { useEffect, useRef } from "react";
import { AmortizationRow } from "../../types";
import { fmtK, fmt } from "../../lib";

interface ChartPanelProps {
  rows: AmortizationRow[];
}

export function ChartPanel({ rows }: ChartPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || rows.length === 0) return;

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
    const padding = { top: 40, right: 80, bottom: 60, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get data
    const labels = rows.map((r) => `Yr ${r.year}`);
    const sbaData = rows.map((r) => r.sbaBalance);
    const snData = rows.map((r) => r.snBalance);
    const fcfData = rows.map((r) => r.fcf);

    // Find max value for scaling
    const maxValue = Math.max(
      ...sbaData,
      ...snData,
      ...fcfData.filter((v) => v > 0)
    );

    // Draw grid
    ctx.strokeStyle = "rgba(138, 160, 184, 0.2)";
    ctx.lineWidth = 1;
    const gridLines = 5;
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
      const value = maxValue * (1 - i / gridLines);
      ctx.fillText(fmtK(value), padding.left - 10, y + 3);
    }

    // Draw bars
    const barWidth = chartWidth / labels.length * 0.6;
    const barGap = chartWidth / labels.length * 0.4;

    labels.forEach((_, i) => {
      const x = padding.left + i * (chartWidth / labels.length) + barGap / 2;

      // SBA bar
      const sbaHeight = (sbaData[i] / maxValue) * chartHeight;
      ctx.fillStyle = "#B5D4F4";
      ctx.fillRect(x, padding.top + chartHeight - sbaHeight, barWidth / 2, sbaHeight);

      // Seller note bar
      const snHeight = (snData[i] / maxValue) * chartHeight;
      ctx.fillStyle = "#FAC775";
      ctx.fillRect(
        x + barWidth / 2,
        padding.top + chartHeight - snHeight,
        barWidth / 2,
        snHeight
      );

      // X-axis labels
      ctx.fillStyle = "#8AA0B8";
      ctx.font = "10px DM Mono, monospace";
      ctx.textAlign = "center";
      if (i % 2 === 0 || labels.length <= 10) {
        ctx.fillText(labels[i], x + barWidth / 2, height - padding.bottom + 20);
      }
    });

    // Draw FCF line
    ctx.strokeStyle = "#0D6E5A";
    ctx.lineWidth = 2;
    ctx.beginPath();
    fcfData.forEach((value, i) => {
      const x = padding.left + i * (chartWidth / labels.length) + barWidth / 2 + barGap / 2;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw FCF points
    ctx.fillStyle = "#0D6E5A";
    fcfData.forEach((value, i) => {
      const x = padding.left + i * (chartWidth / labels.length) + barWidth / 2 + barGap / 2;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Legend
    const legendY = 20;
    let legendX = width / 2 - 150;

    // SBA legend
    ctx.fillStyle = "#B5D4F4";
    ctx.fillRect(legendX, legendY - 8, 12, 12);
    ctx.fillStyle = "#4F637A";
    ctx.font = "11px DM Sans, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("SBA balance", legendX + 18, legendY);

    // Seller note legend
    legendX += 100;
    ctx.fillStyle = "#FAC775";
    ctx.fillRect(legendX, legendY - 8, 12, 12);
    ctx.fillStyle = "#4F637A";
    ctx.fillText("Seller note", legendX + 18, legendY);

    // FCF legend
    legendX += 100;
    ctx.strokeStyle = "#0D6E5A";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(legendX, legendY - 2);
    ctx.lineTo(legendX + 12, legendY - 2);
    ctx.stroke();
    ctx.fillStyle = "#0D6E5A";
    ctx.beginPath();
    ctx.arc(legendX + 6, legendY - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4F637A";
    ctx.fillText("Free cash flow", legendX + 18, legendY);
  }, [rows]);

  return (
    <div>
      <div className="erm-legend">
        <div className="erm-legend-item">
          <div className="erm-legend-sq" style={{ background: "#B5D4F4" }} />
          SBA balance
        </div>
        <div className="erm-legend-item">
          <div className="erm-legend-sq" style={{ background: "#FAC775" }} />
          Seller note balance
        </div>
        <div className="erm-legend-item">
          <div className="erm-legend-sq" style={{ background: "#0D6E5A" }} />
          Free cash flow
        </div>
      </div>
      <div className="erm-chart-wrap">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

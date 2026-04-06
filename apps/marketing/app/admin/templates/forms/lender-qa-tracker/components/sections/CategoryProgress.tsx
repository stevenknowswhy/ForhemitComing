"use client";

import React from "react";
import { calculateCategoryProgress } from "../../lib/calculations";
import { QAItem } from "../../types";

interface CategoryProgressProps {
  items: QAItem[];
}

export function CategoryProgress({ items }: CategoryProgressProps) {
  const progress = calculateCategoryProgress(items);

  return (
    <div className="lqa-form-card">
      <div className="lqa-card-header">
        <span className="lqa-card-header-label">Completion by category</span>
      </div>
      <div className="lqa-card-body">
        <div className="lqa-cat-progress">
          {progress.map((cat) => (
            <div key={cat.category} className="lqa-cat-prog-row">
              <div className="lqa-cat-name">
                {cat.category}
                {cat.hasOverdue && " ⚠"}
              </div>
              <div className="lqa-cat-bar">
                <div
                  className={`lqa-cat-fill ${
                    cat.percentage < 50 ? "danger" : cat.percentage < 100 ? "warning" : ""
                  }`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              <div className="lqa-cat-count">
                {cat.resolved}/{cat.total}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { Company } from "../../types";
import { daysUntil } from "../../lib";

// ============================================
// Calendar View Component
// ============================================

interface CalendarViewProps {
  companies: Company[];
  onSelect: (company: Company) => void;
  onAddWithDate: (date: string) => void;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({ companies, onSelect, onAddWithDate }: CalendarViewProps) {
  const { days, firstDayOffset } = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return {
      days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      firstDayOffset: firstDay,
    };
  }, []);

  const today = new Date().getDate();

  // Group companies by due date
  const byDate = useMemo(() => {
    const grouped: Record<string, Company[]> = {};
    companies.forEach((company) => {
      if (company.nextStepDate) {
        const date = company.nextStepDate.split("-")[2]; // Get day from YYYY-MM-DD
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(company);
      }
    });
    return grouped;
  }, [companies]);

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-5 bg-[var(--bg)]">
      <div className="grid grid-cols-7 gap-1 sm:gap-2 max-w-[1200px] mx-auto">
        {/* Header */}
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-center py-2.5 text-[11px] uppercase tracking-[1px] text-[var(--text3)] font-medium"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[120px]" />
        ))}

        {/* Days */}
        {days.map((day) => {
          const dayStr = String(day).padStart(2, "0");
          const dayCompanies = byDate[dayStr] || [];
          const isToday = day === today;

          return (
            <CalendarDay
              key={day}
              day={day}
              isToday={isToday}
              companies={dayCompanies}
              onSelect={onSelect}
              onClick={() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, "0");
                onAddWithDate(`${year}-${month}-${dayStr}`);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// Calendar Day Component
// ============================================

interface CalendarDayProps {
  day: number;
  isToday: boolean;
  companies: Company[];
  onSelect: (company: Company) => void;
  onClick: () => void;
}

function CalendarDay({ day, isToday, companies, onSelect, onClick }: CalendarDayProps) {
  return (
    <div
      onClick={onClick}
      className={`
        min-h-[72px] sm:min-h-[120px] p-1 sm:p-2 rounded-lg border cursor-pointer transition-colors
        ${isToday ? "border-emerald-500 bg-emerald-50" : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border2)]"}
      `}
    >
      <div className={`text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${isToday ? "text-emerald-800" : "text-[var(--text)]"}`}>
        {day}
      </div>

      <div className="flex flex-col gap-1">
        {companies.map((company) => {
          const days = daysUntil(company.nextStepDate);
          let borderLeftColor = "var(--green-dim)"; // Future
          if (days !== null && days < 0) borderLeftColor = "var(--red)"; // Overdue
          else if (days === 0) borderLeftColor = "var(--amber-dim)"; // Today

          return (
            <div
              key={company._id}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(company);
              }}
              className="bg-[var(--surface2)] border border-[var(--border2)] rounded px-1.5 py-1 text-[9px] sm:text-[10px]
                cursor-pointer truncate hover:border-[var(--green-dim)] hover:bg-[var(--surface3)] transition-all"
              style={{ borderLeftWidth: 2, borderLeftColor }}
            >
              <strong>{company.name}</strong>
              {company.nextStep && (
                <div className="opacity-70 truncate">{company.nextStep}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

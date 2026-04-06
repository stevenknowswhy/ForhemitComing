"use client";

// ============================================
// Stats Card Component
// ============================================

interface StatsCardProps {
  label: string;
  value: number | string;
  subtitle: string;
  color?: string;
  active?: boolean;
  onClick?: () => void;
}

export function StatsCard({
  label,
  value,
  subtitle,
  color = "var(--green)",
  active = false,
  onClick,
}: StatsCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex-1 min-w-[118px] max-[375px]:min-w-[112px] sm:min-w-[140px] px-3 max-[375px]:px-2.5 sm:px-5 py-3 max-[375px]:py-2 sm:py-3.5 border-r border-[var(--border)] snap-start
        cursor-pointer transition-colors last:border-r-0
        ${active ? "bg-emerald-50" : "hover:bg-[var(--surface3)]"}
      `}
    >
      <div
        className={`text-[9px] max-[375px]:text-[8px] sm:text-[10px] uppercase tracking-[1.2px] max-[375px]:tracking-[1px] sm:tracking-[1.5px] mb-1 max-[375px]:mb-0.5 ${
          active ? "text-emerald-800" : "text-[var(--text3)]"
        }`}
      >
        {label}
      </div>
      <div
        className="text-[18px] sm:text-[22px] font-semibold"
        style={{ fontFamily: "var(--serif)", color }}
      >
        {value}
      </div>
      <div className="text-[9px] max-[375px]:text-[8px] sm:text-[10px] text-[var(--text3)] mt-0.5 max-[375px]:mt-px leading-relaxed max-[375px]:leading-snug line-clamp-2">
        {subtitle}
      </div>
    </div>
  );
}

'use client';

interface MetricsProps {
  total: number;
  preferred: number;
  active: number;
  nudge: number;
  typeCount: number;
}

export function Metrics({ total, preferred, active, nudge, typeCount }: MetricsProps) {
  const metrics = [
    { label: 'Total partners', value: total, sub: `${typeCount} types`, color: '#0E1C2F' },
    { label: 'Preferred', value: preferred, sub: 'Vetted go-to partners', color: '#B8860B' },
    { label: 'Active', value: active, sub: 'Working deals', color: '#0D7A55' },
    { label: 'Follow-up needed', value: nudge, sub: 'Overdue touchpoints', color: '#C47A0A' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {metrics.map(metric => (
        <div 
          key={metric.label}
          className="bg-white border border-[#E8EDF5] rounded-xl p-3.5"
        >
          <div className="text-[11px] text-[#8298AE] font-medium mb-1">
            {metric.label}
          </div>
          <div 
            className="text-2xl font-semibold font-mono leading-none"
            style={{ color: metric.color }}
          >
            {metric.value}
          </div>
          <div className="text-[11px] text-[#8298AE] mt-1">
            {metric.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

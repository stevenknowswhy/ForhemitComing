import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'sage' | 'clay' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-stone/10 text-stone',
    sage: 'bg-sage-muted text-sage',
    clay: 'bg-alert-clay/10 text-alert-clay',
    outline: 'bg-transparent border border-sage text-sage',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}

interface PathwayBadgeProps {
  pathway: string;
  className?: string;
}

export function PathwayBadge({ pathway, className = '' }: PathwayBadgeProps) {
  const labels: Record<string, string> = {
    founders: 'For Founders',
    attorneys: 'For Attorneys',
    lenders: 'For Lenders',
    cpas: 'For CPAs',
    employees: 'For Employees',
  };

  return (
    <Badge variant="sage" className={className}>
      {labels[pathway] || pathway}
    </Badge>
  );
}

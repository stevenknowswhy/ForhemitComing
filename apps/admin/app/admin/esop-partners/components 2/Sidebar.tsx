'use client';

import { useMemo } from 'react';
import type { ViewMode } from '../types';
import { 
  Users, 
  Star, 
  GitBranch, 
  Flag, 
  Route,
  Building2,
  Scale,
  Calculator,
  UserCog,
  Award,
  Shield
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  currentType: string | null;
  contactCounts: {
    all: number;
    preferred: number;
    nudges: number;
    onboarding: number;
    byType: Record<string, number>;
  };
  onSetView: (view: ViewMode) => void;
  onFilterType: (type: string | null) => void;
}

const viewItems = [
  { id: 'all' as ViewMode, label: 'All partners', icon: Users, color: '#8298AE' },
  { id: 'preferred' as ViewMode, label: 'Preferred', icon: Star, color: '#B8860B' },
  { id: 'pipeline' as ViewMode, label: 'Pipeline', icon: GitBranch, color: '#1A5FA8' },
  { id: 'nudges' as ViewMode, label: 'Follow-up needed', icon: Flag, color: '#C47A0A' },
  { id: 'onboarding' as ViewMode, label: 'Onboarding', icon: Route, color: '#534AB7' },
] as const;

const typeItems = [
  { id: 'Lender', label: 'Lenders', icon: Building2, color: '#185FA5' },
  { id: 'Attorney', label: 'Attorneys', icon: Scale, color: '#534AB7' },
  { id: 'CPA', label: 'CPAs', icon: Calculator, color: '#0D7A55' },
  { id: 'Administrator', label: 'Administrators', icon: UserCog, color: '#854F0B' },
  { id: 'Appraiser', label: 'Appraisers', icon: Award, color: '#993C1D' },
  { id: 'Trustee', label: 'Trustees', icon: Shield, color: '#5B3FA8' },
] as const;

export function Sidebar({ 
  currentView, 
  currentType, 
  contactCounts, 
  onSetView, 
  onFilterType 
}: SidebarProps) {
  const isViewActive = (view: ViewMode) => currentView === view && !currentType;
  const isTypeActive = (type: string) => currentType === type;

  const getViewCount = (view: ViewMode): number => {
    switch (view) {
      case 'all': return contactCounts.all;
      case 'preferred': return contactCounts.preferred;
      case 'nudges': return contactCounts.nudges;
      case 'onboarding': return contactCounts.onboarding;
      default: return 0;
    }
  };

  return (
    <nav className="w-56 bg-[#0E1C2F] min-h-screen flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-5 pb-4 border-b border-white/10">
        <div className="font-serif text-lg text-white leading-tight">
          ESOP<br />Partners
        </div>
        <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
          CRM · v2.1
        </div>
      </div>

      {/* Views Section */}
      <div className="pt-4 pb-2 px-2.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-white/30 px-2 mb-1">
          Views
        </div>
        {viewItems.map(item => {
          const Icon = item.icon;
          const isActive = isViewActive(item.id);
          const count = getViewCount(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => onSetView(item.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all text-left ${
                isActive 
                  ? 'bg-white/15 text-white' 
                  : 'text-white/50 hover:bg-white/10 hover:text-white/90'
              }`}
            >
              <span 
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="flex-1">{item.label}</span>
              {count > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white/80' : 'bg-white/10 text-white/50'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Partner Types Section */}
      <div className="pt-4 pb-2 px-2.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-white/30 px-2 mb-1">
          Partner types
        </div>
        {typeItems.map(item => {
          const Icon = item.icon;
          const isActive = isTypeActive(item.id);
          const count = contactCounts.byType[item.id] || 0;
          
          return (
            <button
              key={item.id}
              onClick={() => onFilterType(isActive ? null : item.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all text-left ${
                isActive 
                  ? 'bg-white/15 text-white' 
                  : 'text-white/50 hover:bg-white/10 hover:text-white/90'
              }`}
            >
              <span 
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="flex-1">{item.label}</span>
              {count > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white/80' : 'bg-white/10 text-white/50'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-white/10 text-[10px] text-white/25">
        ESOP Transaction Forms · 2025<br />
        Auto-saved locally
      </div>
    </nav>
  );
}

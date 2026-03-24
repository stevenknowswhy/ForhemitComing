'use client';

import type { PartnerContact } from '../types';
import { 
  getInitials, 
  getFullName, 
  getTypeColors, 
  getStageMeta, 
  getEngagementColor,
  calculateJourneyProgress,
  formatRelativeDate,
  needsNudge,
  escapeHtml
} from '../lib/formatters';
import { Star } from 'lucide-react';

interface ContactCardProps {
  contact: PartnerContact;
  onClick: () => void;
}

export function ContactCard({ contact, onClick }: ContactCardProps) {
  const colors = getTypeColors(contact.type);
  const stage = getStageMeta(contact.stage);
  const score = stage.score;
  const engagementColor = getEngagementColor(score);
  const journeyProgress = calculateJourneyProgress(contact);
  const isOverdue = needsNudge(contact);
  const displayStates = contact.states.slice(0, 3).join(', ') + 
    (contact.states.length > 3 ? ` +${contact.states.length - 3}` : '');

  const stageClasses: Record<string, string> = {
    prospect: 'bg-amber-50 text-amber-700 border-amber-200',
    introduced: 'bg-blue-50 text-blue-700 border-blue-200',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    preferred: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dormant: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <article 
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`Contact card for ${getFullName(contact)}`}
      className={`bg-white border rounded-xl overflow-hidden cursor-pointer transition-all hover:border-[#1A5FA8] hover:-translate-y-0.5 hover:shadow-md ${
        contact.preferred ? 'border-[#B8860B] border-2' : 'border-[#E8EDF5]'
      }`}
    >
      {/* Header */}
      <div className="p-4 pb-2.5 flex items-start gap-2.5">
        <div 
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold font-mono shrink-0"
          style={{ backgroundColor: colors.bg, color: colors.text }}
          role="img"
          aria-label="Initials"
        >
          {getInitials(contact)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[#0E1C2F] truncate">
            {getFullName(contact)}
          </div>
          <div className="text-xs text-[#526070] truncate">
            {contact.firm}
          </div>
        </div>
        {contact.preferred && (
          <Star className="w-4 h-4 text-[#B8860B] fill-[#B8860B] shrink-0" aria-label="Preferred" />
        )}
      </div>

      {/* Tags */}
      <div className="px-4 pb-2.5 flex flex-wrap gap-1.5">
        <span 
          className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
          style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.bg }}
        >
          {contact.type}
        </span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${stageClasses[contact.stage]}`}>
          {stage.label}
        </span>
        {displayStates && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F2F5F9] text-[#526070]">
            {displayStates}
          </span>
        )}
      </div>

      {/* Journey Progress */}
      <div className="px-4 pb-2.5">
        <div className="flex justify-between text-[10px] text-[#8298AE] mb-1">
          <span>Partnership journey</span>
          <span>{journeyProgress.done}/{journeyProgress.total}</span>
        </div>
        <div className="h-0.5 bg-[#E8EDF5] rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${journeyProgress.pct}%`,
              backgroundColor: journeyProgress.pct === 100 ? '#0D7A55' : '#534AB7'
            }}
            aria-label={`${journeyProgress.pct}% complete`}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[#E8EDF5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#8298AE]">Engagement</span>
          <div className="w-14 h-1 bg-[#E8EDF5] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full"
              style={{ width: `${score}%`, backgroundColor: engagementColor }}
              aria-label={`${score}% engagement`}
            />
          </div>
          <span className="text-[10px] font-mono text-[#8298AE]">{score}%</span>
        </div>
        <div 
          className={`text-[10px] ${isOverdue ? 'text-[#C47A0A] font-medium' : 'text-[#8298AE]'}`}
          aria-label={isOverdue ? 'Follow up needed' : 'Recent contact'}
        >
          {isOverdue && '⚑ '}
          {formatRelativeDate(contact.lastContact)}
        </div>
      </div>
    </article>
  );
}

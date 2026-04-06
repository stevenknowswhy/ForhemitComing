'use client';

import type { PartnerContact } from '../types';
import { STAGE_META } from '../constants';
import { 
  getInitials, 
  getFullName, 
  getTypeColors,
  calculateJourneyProgress,
  formatDaysShort,
  needsNudge,
  escapeHtml
} from '../lib/formatters';
import { Star } from 'lucide-react';

interface PipelineViewProps {
  contacts: PartnerContact[];
  onSelectContact: (contact: PartnerContact) => void;
}

const STAGES = ['prospect', 'introduced', 'active', 'preferred', 'dormant'] as const;

export function PipelineView({ contacts, onSelectContact }: PipelineViewProps) {
  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = contacts.filter(c => c.stage === stage);
    return acc;
  }, {} as Record<string, PartnerContact[]>);

  return (
    <div>
      <p className="text-xs text-[#526070] mb-4">
        Click any card to view full profile and advance the journey.
      </p>
      <div className="flex gap-3 overflow-x-auto pb-3">
        {STAGES.map(stage => {
          const stageContacts = grouped[stage];
          const meta = STAGE_META[stage];

          return (
            <div key={stage} className="min-w-[210px] max-w-[210px] bg-[#F2F5F9] rounded-xl p-3 shrink-0">
              {/* Column Header */}
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[11px] font-semibold text-[#0E1C2F]">{meta.label}</span>
                <span className="text-[10px] font-mono bg-[#D0D9E6] text-[#526070] px-1.5 py-0.5 rounded-full">
                  {stageContacts.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {stageContacts.map(contact => {
                  const colors = getTypeColors(contact.type);
                  const journeyProgress = calculateJourneyProgress(contact);
                  const isOverdue = needsNudge(contact);

                  return (
                    <div
                      key={contact.id}
                      onClick={() => onSelectContact(contact)}
                      onKeyDown={(e) => e.key === 'Enter' && onSelectContact(contact)}
                      tabIndex={0}
                      role="button"
                      className={`bg-white border border-[#E8EDF5] rounded-lg p-2.5 cursor-pointer hover:border-[#1A5FA8] hover:shadow-sm transition-all ${
                        contact.preferred ? 'border-l-2 border-l-[#B8860B]' : ''
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#0E1C2F] mb-0.5">
                        {escapeHtml(getFullName(contact))}
                        {contact.preferred && <span className="text-[#B8860B] ml-1">★</span>}
                      </div>
                      <div className="text-[10px] text-[#8298AE] mb-1.5">
                        {escapeHtml(contact.firm)}
                      </div>
                      <div className="h-0.5 bg-[#E8EDF5] rounded-full overflow-hidden mb-1.5">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${journeyProgress.pct}%`,
                            backgroundColor: journeyProgress.pct === 100 ? '#0D7A55' : '#534AB7'
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span 
                          className="text-[9px] px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {contact.type}
                        </span>
                        <span className={`text-[10px] ${isOverdue ? 'text-[#C47A0A]' : 'text-[#8298AE]'}`}>
                          {isOverdue && '⚑ '}
                          {formatDaysShort(contact.lastContact)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {stageContacts.length === 0 && (
                  <div className="text-center py-4 text-[#8298AE] text-[11px]">None</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

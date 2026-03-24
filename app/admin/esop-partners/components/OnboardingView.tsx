'use client';

import type { PartnerContact } from '../types';
import { calculateJourneyProgress, getTypeColors, getInitials, getFullName, formatDate, getJourneySteps, escapeHtml } from '../lib/formatters';

interface OnboardingViewProps {
  contacts: PartnerContact[];
  onSelectContact: (contact: PartnerContact) => void;
}

export function OnboardingView({ contacts, onSelectContact }: OnboardingViewProps) {
  const inProgress = contacts.filter(c => {
    const p = calculateJourneyProgress(c);
    return p.pct > 0 && p.pct < 100;
  });
  
  const notStarted = contacts.filter(c => {
    const p = calculateJourneyProgress(c);
    return p.pct === 0;
  });
  
  const done = contacts.filter(c => {
    const p = calculateJourneyProgress(c);
    return p.pct === 100;
  });

  const stageClasses: Record<string, string> = {
    prospect: 'bg-amber-50 text-amber-700 border-amber-200',
    introduced: 'bg-blue-50 text-blue-700 border-blue-200',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    preferred: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dormant: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div>
      <p className="text-xs text-[#526070] mb-4">
        Track partnership onboarding progress across all contact types.
      </p>
      <table className="w-full border-collapse bg-white rounded-xl overflow-hidden border border-[#E8EDF5]">
        <thead>
          <tr>
            <th className="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] bg-[#F2F5F9] border-b border-[#E8EDF5]">
              Name
            </th>
            <th className="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] bg-[#F2F5F9] border-b border-[#E8EDF5]">
              Type
            </th>
            <th className="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] bg-[#F2F5F9] border-b border-[#E8EDF5]">
              Next step
            </th>
            <th className="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] bg-[#F2F5F9] border-b border-[#E8EDF5]">
              Progress
            </th>
            <th className="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] bg-[#F2F5F9] border-b border-[#E8EDF5]">
              Last contact
            </th>
          </tr>
        </thead>
        <tbody>
          {[...inProgress, ...notStarted].map(contact => {
            const colors = getTypeColors(contact.type);
            const progress = calculateJourneyProgress(contact);
            const steps = getJourneySteps(contact.type);
            const journey = contact.journey || {};
            const nextStep = steps.find(s => journey[s.id]?.status === 'current') || 
                            steps.find(s => !journey[s.id] || journey[s.id].status === 'pending');

            return (
              <tr 
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                onKeyDown={(e) => e.key === 'Enter' && onSelectContact(contact)}
                tabIndex={0}
                className="cursor-pointer hover:bg-[#FAFBFD] transition-colors"
              >
                <td className="px-3.5 py-3 border-b border-[#E8EDF5]">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-semibold"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {getInitials(contact)}
                    </div>
                    <span className="font-medium text-sm text-[#0E1C2F]">
                      {escapeHtml(getFullName(contact))}
                    </span>
                  </div>
                </td>
                <td className="px-3.5 py-3 border-b border-[#E8EDF5]">
                  <span 
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                    style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.bg }}
                  >
                    {contact.type}
                  </span>
                </td>
                <td className="px-3.5 py-3 border-b border-[#E8EDF5] text-xs text-[#526070]">
                  {nextStep ? escapeHtml(nextStep.name) : '—'}
                </td>
                <td className="px-3.5 py-3 border-b border-[#E8EDF5]">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-[#E8EDF5] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#534AB7] rounded-full"
                        style={{ width: `${progress.pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#8298AE]">{progress.pct}%</span>
                  </div>
                </td>
                <td className="px-3.5 py-3 border-b border-[#E8EDF5] text-sm">
                  {formatDate(contact.lastContact)}
                </td>
              </tr>
            );
          })}

          {done.length > 0 && (
            <tr>
              <td 
                colSpan={5} 
                className="px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] bg-[#F2F5F9] border-b border-[#E8EDF5]"
              >
                Completed ({done.length})
              </td>
            </tr>
          )}

          {done.map(contact => {
            const colors = getTypeColors(contact.type);
            
            return (
              <tr 
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                onKeyDown={(e) => e.key === 'Enter' && onSelectContact(contact)}
                tabIndex={0}
                className="cursor-pointer hover:bg-[#FAFBFD] transition-colors opacity-60"
              >
                <td className="px-3.5 py-3 border-b border-[#E8EDF5]">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-semibold"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {getInitials(contact)}
                    </div>
                    <span className="font-medium text-sm text-[#0E1C2F]">
                      {escapeHtml(getFullName(contact))}
                    </span>
                  </div>
                </td>
                <td className="px-3.5 py-3 border-b border-[#E8EDF5]">
                  <span 
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                    style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.bg }}
                  >
                    {contact.type}
                  </span>
                </td>
                <td className="px-3.5 py-3 border-b border-[#E8EDF5] text-xs text-[#0D7A55] font-medium">
                  ✓ Complete
                </td>
                <td className="px-3.5 py-3 border-b border-[#E8EDF5]">
                  <span className="text-[10px] font-mono text-[#0D7A55]">100%</span>
                </td>
                <td className="px-3.5 py-3 border-b border-[#E8EDF5] text-sm">
                  {formatDate(contact.lastContact)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

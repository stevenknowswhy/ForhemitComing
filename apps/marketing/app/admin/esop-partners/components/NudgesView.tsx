'use client';

import type { PartnerContact } from '../types';
import { NUDGE_ACTIONS, STAGE_META } from '../constants';
import { 
  getInitials, 
  getFullName, 
  getTypeColors,
  formatDate,
  daysSince,
  escapeHtml
} from '../lib/formatters';
import { NUDGE_DAYS } from '../constants';

interface NudgesViewProps {
  contacts: PartnerContact[];
  onSelectContact: (contact: PartnerContact) => void;
}

export function NudgesView({ contacts, onSelectContact }: NudgesViewProps) {
  // Sort by days overdue (most overdue first)
  const overdueContacts = [...contacts].sort((a, b) => 
    daysSince(b.lastContact) - daysSince(a.lastContact)
  );

  if (overdueContacts.length === 0) {
    return (
      <div className="text-center py-16 text-[#8298AE]">
        <div className="text-2xl opacity-30 mb-2">✓</div>
        <div className="text-sm">All contacts are up to date.</div>
      </div>
    );
  }

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
        Contacts that haven&apos;t been touched within their recommended cadence.
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
              Stage
            </th>
            <th className="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] bg-[#F2F5F9] border-b border-[#E8EDF5]">
              Last contact
            </th>
            <th className="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] bg-[#F2F5F9] border-b border-[#E8EDF5]">
              Days over
            </th>
            <th className="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] bg-[#F2F5F9] border-b border-[#E8EDF5]">
              Next action
            </th>
          </tr>
        </thead>
        <tbody>
          {overdueContacts.map(contact => {
            const colors = getTypeColors(contact.type);
            const stage = STAGE_META[contact.stage];
            const threshold = NUDGE_DAYS[contact.stage] || 30;
            const over = daysSince(contact.lastContact) - threshold;

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
                <td className="px-3.5 py-3 border-b border-[#E8EDF5]">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${stageClasses[contact.stage]}`}>
                    {stage.label}
                  </span>
                </td>
                <td className="px-3.5 py-3 border-b border-[#E8EDF5] text-sm">
                  {formatDate(contact.lastContact)}
                </td>
                <td className="px-3.5 py-3 border-b border-[#E8EDF5] text-[#C47A0A] font-semibold font-mono">
                  +{over}d
                </td>
                <td className="px-3.5 py-3 border-b border-[#E8EDF5] text-xs text-[#526070]">
                  {NUDGE_ACTIONS[contact.stage] || 'Follow up'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

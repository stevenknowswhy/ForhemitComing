'use client';

import type { PartnerContact, SortConfig } from '../types';
import { 
  getInitials, 
  getFullName, 
  getTypeColors, 
  getStageMeta, 
  calculateJourneyProgress,
  formatDate,
  needsNudge,
  escapeHtml
} from '../lib/formatters';
import { Star, ChevronUp, ChevronDown } from 'lucide-react';

interface ContactListProps {
  contacts: PartnerContact[];
  sort: SortConfig;
  onSort: (field: SortConfig['field']) => void;
  onSelect: (contact: PartnerContact) => void;
}

const stageClasses: Record<string, string> = {
  prospect: 'bg-amber-50 text-amber-700 border-amber-200',
  introduced: 'bg-blue-50 text-blue-700 border-blue-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  preferred: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  dormant: 'bg-red-50 text-red-700 border-red-200',
};

export function ContactList({ contacts, sort, onSort, onSelect }: ContactListProps) {
  const SortIcon = ({ field }: { field: SortConfig['field'] }) => {
    if (sort.field !== field) return <ChevronUp className="w-3 h-3 opacity-30" />;
    return sort.dir === 'asc' 
      ? <ChevronUp className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3" />;
  };

  const HeaderCell = ({ 
    field, 
    children, 
    className = '' 
  }: { 
    field: SortConfig['field']; 
    children: React.ReactNode;
    className?: string;
  }) => (
    <th 
      scope="col"
      onClick={() => onSort(field)}
      className={`px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] bg-[#F2F5F9] border-b border-[#E8EDF5] whitespace-nowrap cursor-pointer select-none hover:bg-[#e6eaef] ${className}`}
    >
      <div className="flex items-center gap-1">
        {children}
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <table className="w-full border-collapse bg-white rounded-xl overflow-hidden border border-[#E8EDF5]" role="table" aria-label="Contacts list">
      <thead>
        <tr role="row">
          <HeaderCell field="name">Name</HeaderCell>
          <HeaderCell field="firm">Firm</HeaderCell>
          <HeaderCell field="type">Type</HeaderCell>
          <HeaderCell field="stage">Stage</HeaderCell>
          <th scope="col" className="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] bg-[#F2F5F9] border-b border-[#E8EDF5] whitespace-nowrap">
            States
          </th>
          <th scope="col" className="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] bg-[#F2F5F9] border-b border-[#E8EDF5] whitespace-nowrap">
            Journey
          </th>
          <HeaderCell field="lastcontact">Last contact</HeaderCell>
        </tr>
      </thead>
      <tbody>
        {contacts.map(contact => {
          const colors = getTypeColors(contact.type);
          const stage = getStageMeta(contact.stage);
          const journeyProgress = calculateJourneyProgress(contact);
          const isOverdue = needsNudge(contact);
          const displayStates = contact.states.slice(0, 2).join(', ') + 
            (contact.states.length > 2 ? ` +${contact.states.length - 2}` : '');

          return (
            <tr 
              key={contact.id}
              onClick={() => onSelect(contact)}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(contact)}
              tabIndex={0}
              role="row"
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
                  {contact.preferred && (
                    <Star className="w-3 h-3 text-[#B8860B] fill-[#B8860B]" aria-label="Preferred" />
                  )}
                </div>
              </td>
              <td className="px-3.5 py-3 border-b border-[#E8EDF5] text-sm text-[#526070]">
                {escapeHtml(contact.firm)}
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
              <td className="px-3.5 py-3 border-b border-[#E8EDF5] text-xs text-[#526070]">
                {escapeHtml(displayStates) || '—'}
              </td>
              <td className="px-3.5 py-3 border-b border-[#E8EDF5]">
                <div className="flex items-center gap-1.5">
                  <div className="w-12 h-0.5 bg-[#E8EDF5] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${journeyProgress.pct}%`,
                        backgroundColor: journeyProgress.pct === 100 ? '#0D7A55' : '#534AB7'
                      }}
                      aria-label={`${journeyProgress.pct}%`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[#8298AE]">
                    {journeyProgress.pct}%
                  </span>
                </div>
              </td>
              <td 
                className={`px-3.5 py-3 border-b border-[#E8EDF5] text-sm ${isOverdue ? 'text-[#C47A0A] font-medium' : ''}`}
                aria-label={isOverdue ? 'Follow up needed' : ''}
              >
                {isOverdue && '⚑ '}
                {formatDate(contact.lastContact)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

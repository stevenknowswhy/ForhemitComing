'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { PartnerContact, PartnerType, EngagementStage } from '../types';
import { X, Trash2 } from 'lucide-react';
import { ALL_STATES, JOURNEY_STEPS } from '../constants';
import { getJourneySteps } from '../lib/formatters';
import { validateEmail as validateEmailFormat } from '../lib/calculations';
import { ModalDialog } from '../../../components/ui/ModalDialog';

interface ContactModalProps {
  isOpen: boolean;
  contact: PartnerContact | null;
  onClose: () => void;
  onSave: (data: Partial<PartnerContact>) => void;
  onDelete: () => void;
}

const PARTNER_TYPES: PartnerType[] = [
  'Lender', 'Attorney', 'CPA', 'Administrator', 'Appraiser', 'Trustee', 'Financial Advisor', 'Other'
];

const ENGAGEMENT_STAGES: { value: EngagementStage; label: string }[] = [
  { value: 'prospect', label: 'Prospect' },
  { value: 'introduced', label: 'Introduced' },
  { value: 'active', label: 'Active partner' },
  { value: 'preferred', label: 'Preferred partner' },
  { value: 'dormant', label: 'Dormant' },
];

export function ContactModal({ isOpen, contact, onClose, onSave, onDelete }: ContactModalProps) {
  const [formData, setFormData] = useState<Partial<PartnerContact>>({});
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [preferred, setPreferred] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msOpen, setMsOpen] = useState(false);
  const msRef = useRef<HTMLDivElement>(null);

  const isEditing = !!contact;

  useEffect(() => {
    if (isOpen) {
      if (contact) {
        setFormData({
          first: contact.first,
          last: contact.last,
          firm: contact.firm,
          type: contact.type,
          email: contact.email,
          phone: contact.phone,
          stage: contact.stage,
          lastContact: contact.lastContact,
          notes: contact.notes,
        });
        setSelectedStates(contact.states || []);
        setPreferred(contact.preferred);
      } else {
        setFormData({
          first: '',
          last: '',
          firm: '',
          type: '' as PartnerType,
          email: '',
          phone: '',
          stage: '' as EngagementStage,
          lastContact: '',
          notes: '',
        });
        setSelectedStates([]);
        setPreferred(false);
      }
      setErrors({});
    }
  }, [isOpen, contact]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (msRef.current && !msRef.current.contains(e.target as Node)) {
        setMsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first?.trim()) newErrors.first = 'First name is required';
    if (!formData.last?.trim()) newErrors.last = 'Last name is required';
    if (!formData.firm?.trim()) newErrors.firm = 'Firm name is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.stage) newErrors.stage = 'Stage is required';
    if (selectedStates.length === 0) newErrors.states = 'Select at least one state';
    if (formData.email && !validateEmailFormat(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      ...formData,
      states: selectedStates,
      preferred,
    });
    onClose();
  };

  const toggleState = (state: string) => {
    if (state === 'Nationwide') {
      setSelectedStates(['Nationwide']);
    } else {
      setSelectedStates(prev => {
        const filtered = prev.filter(s => s !== 'Nationwide');
        if (filtered.includes(state)) {
          return filtered.filter(s => s !== state);
        }
        return [...filtered, state];
      });
    }
    setErrors(prev => ({ ...prev, states: '' }));
  };

  const handleInputChange = (field: keyof PartnerContact, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const journeySteps = formData.type ? getJourneySteps(formData.type) : [];

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit partner contact' : 'Add partner contact'}
      overlayClassName="fixed inset-0 bg-[#0E1C2F]/55 z-[200] flex items-start justify-center pt-10 overflow-y-auto"
      className="bg-white rounded-2xl w-full max-w-2xl mx-4 my-8 flex flex-col max-h-[calc(100vh-80px)]"
      closeButtonAriaLabel="Close partner contact modal"
      renderCloseButton={({ onClose, ariaLabel }) => (
        <button
          onClick={onClose}
          aria-label={ariaLabel}
          type="button"
          className="text-[#8298AE] hover:text-[#0E1C2F] p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    >
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-[#E8EDF5] flex justify-between items-center">
            <h2 className="font-serif text-lg text-[#0E1C2F]">
              {isEditing ? 'Edit partner contact' : 'Add partner contact'}
            </h2>
            <div />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-[#526070] font-medium mb-1">
                  First name <span className="text-[#B83232]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.first || ''}
                  onChange={(e) => handleInputChange('first', e.target.value)}
                  placeholder="Jane"
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-[#1A5FA8] ${
                    errors.first ? 'border-[#B83232] bg-[#FBE9E9]' : 'border-[#D0D9E6]'
                  }`}
                />
                {errors.first && <div className="text-[10px] text-[#B83232] mt-1">{errors.first}</div>}
              </div>
              <div>
                <label className="block text-xs text-[#526070] font-medium mb-1">
                  Last name <span className="text-[#B83232]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.last || ''}
                  onChange={(e) => handleInputChange('last', e.target.value)}
                  placeholder="Smith"
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-[#1A5FA8] ${
                    errors.last ? 'border-[#B83232] bg-[#FBE9E9]' : 'border-[#D0D9E6]'
                  }`}
                />
                {errors.last && <div className="text-[10px] text-[#B83232] mt-1">{errors.last}</div>}
              </div>
            </div>

            {/* Firm & Type */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-[#526070] font-medium mb-1">
                  Firm / organization <span className="text-[#B83232]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firm || ''}
                  onChange={(e) => handleInputChange('firm', e.target.value)}
                  placeholder="First Community Bank"
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-[#1A5FA8] ${
                    errors.firm ? 'border-[#B83232] bg-[#FBE9E9]' : 'border-[#D0D9E6]'
                  }`}
                />
                {errors.firm && <div className="text-[10px] text-[#B83232] mt-1">{errors.firm}</div>}
              </div>
              <div>
                <label className="block text-xs text-[#526070] font-medium mb-1">
                  Partner type <span className="text-[#B83232]">*</span>
                </label>
                <select
                  value={formData.type || ''}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-[#1A5FA8] ${
                    errors.type ? 'border-[#B83232] bg-[#FBE9E9]' : 'border-[#D0D9E6]'
                  }`}
                >
                  <option value="">Select…</option>
                  {PARTNER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.type && <div className="text-[10px] text-[#B83232] mt-1">{errors.type}</div>}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-[#526070] font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => {
                    if (formData.email && !validateEmailFormat(formData.email)) {
                      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
                    }
                  }}
                  placeholder="jane@firm.com"
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-[#1A5FA8] ${
                    errors.email ? 'border-[#B83232] bg-[#FBE9E9]' : 'border-[#D0D9E6]'
                  }`}
                />
                {errors.email && <div className="text-[10px] text-[#B83232] mt-1">{errors.email}</div>}
              </div>
              <div>
                <label className="block text-xs text-[#526070] font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 555-0100"
                  className="w-full px-3 py-2 text-sm border border-[#D0D9E6] rounded-md focus:outline-none focus:border-[#1A5FA8]"
                />
              </div>
            </div>

            {/* States & Stage */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div ref={msRef}>
                <label className="block text-xs text-[#526070] font-medium mb-1">
                  States / regions served <span className="text-[#B83232]">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMsOpen(!msOpen)}
                    className={`w-full min-h-[38px] px-3 py-2 text-sm border rounded-md text-left flex flex-wrap gap-1 items-center focus:outline-none focus:border-[#1A5FA8] ${
                      errors.states ? 'border-[#B83232] bg-[#FBE9E9]' : 'border-[#D0D9E6]'
                    }`}
                    aria-expanded={msOpen}
                    aria-haspopup="listbox"
                  >
                    {selectedStates.length === 0 ? (
                      <span className="text-[#8298AE]">Select states…</span>
                    ) : (
                      selectedStates.map(s => (
                        <span key={s} className="text-[10px] bg-[#E8F1FB] text-[#185FA5] px-1.5 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))
                    )}
                  </button>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8298AE] text-xs pointer-events-none">
                    ▾
                  </span>
                  
                  {msOpen && (
                    <div 
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D0D9E6] rounded-md z-50 max-h-52 overflow-y-auto shadow-lg"
                      role="listbox"
                      aria-label="Select states"
                    >
                      {ALL_STATES.map(state => (
                        <div
                          key={state}
                          onClick={() => toggleState(state)}
                          className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-[#F2F5F9] ${
                            selectedStates.includes(state) ? 'bg-[#E8F1FB]' : ''
                          }`}
                          role="option"
                          aria-selected={selectedStates.includes(state)}
                        >
                          <div className={`w-3.5 h-3.5 border-1.5 border-[#D0D9E6] rounded flex items-center justify-center text-[9px] ${
                            selectedStates.includes(state) ? 'bg-[#1A5FA8] border-[#1A5FA8] text-white' : ''
                          }`}>
                            {selectedStates.includes(state) ? '✓' : ''}
                          </div>
                          <span>{state}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.states && <div className="text-[10px] text-[#B83232] mt-1">{errors.states}</div>}
              </div>
              <div>
                <label className="block text-xs text-[#526070] font-medium mb-1">
                  Engagement stage <span className="text-[#B83232]">*</span>
                </label>
                <select
                  value={formData.stage || ''}
                  onChange={(e) => handleInputChange('stage', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-[#1A5FA8] ${
                    errors.stage ? 'border-[#B83232] bg-[#FBE9E9]' : 'border-[#D0D9E6]'
                  }`}
                >
                  <option value="">Select…</option>
                  {ENGAGEMENT_STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                {errors.stage && <div className="text-[10px] text-[#B83232] mt-1">{errors.stage}</div>}
              </div>
            </div>

            {/* Last Contact & Preferred Toggle */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-[#526070] font-medium mb-1">Last contact date</label>
                <input
                  type="date"
                  value={formData.lastContact || ''}
                  onChange={(e) => handleInputChange('lastContact', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D0D9E6] rounded-md focus:outline-none focus:border-[#1A5FA8]"
                />
              </div>
              <div className="flex items-end pb-2">
                <button
                  type="button"
                  onClick={() => setPreferred(!preferred)}
                  className={`w-9 h-5 rounded-full relative transition-colors ${preferred ? 'bg-[#B8860B]' : 'bg-[#D0D9E6]'}`}
                  role="switch"
                  aria-checked={preferred}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setPreferred(!preferred);
                    }
                  }}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                    preferred ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
                <span className="text-xs text-[#526070] ml-2">Mark as preferred partner</span>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-xs text-[#526070] font-medium mb-1">Specialties / bio notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="SBA 7(a) specialist, Midwest focus…"
                className="w-full min-h-[80px] px-3 py-2 text-sm border border-[#D0D9E6] rounded-md focus:outline-none focus:border-[#1A5FA8] resize-y leading-relaxed"
              />
            </div>

            {/* Journey Preview */}
            {journeySteps.length > 0 && (
              <div className="mt-4 p-3 bg-[#F2F5F9] rounded-lg">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8298AE] mb-2">
                  Partnership journey for this type
                </div>
                <div className="space-y-1">
                  {journeySteps.map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-4 rounded-full bg-[#D0D9E6] flex items-center justify-center text-[9px] font-bold text-[#8298AE] shrink-0">
                        {idx + 1}
                      </div>
                      <span className="font-medium">{step.name}</span>
                      {step.docLabel && (
                        <span className="text-[10px] text-[#534AB7]">· {step.docLabel}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white z-10 px-6 py-3 border-t border-[#E8EDF5] flex justify-between items-center">
            {isEditing ? (
              <button 
                type="button"
                onClick={onDelete}
                className="px-3 py-2 text-xs text-[#B83232] bg-[#FBE9E9] rounded hover:bg-[#f5d0d0] transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove contact
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs border border-[#D0D9E6] rounded hover:bg-[#F2F5F9] transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-xs bg-[#1A5FA8] text-white rounded hover:bg-[#0E1C2F] transition-colors"
              >
                Save contact
              </button>
            </div>
          </div>
    </ModalDialog>
  );
}

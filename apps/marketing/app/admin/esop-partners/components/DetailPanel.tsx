'use client';

import { useState } from 'react';
import type { PartnerContact, ActivityType } from '../types';
import { X, Star, Plus, Trash2, ChevronRight } from 'lucide-react';
import { 
  getInitials, 
  getFullName, 
  getTypeColors, 
  getStageMeta, 
  getStageClass,
  getEngagementColor,
  getJourneySteps,
  getActivityColor,
  calculateJourneyProgress,
  formatDate,
  formatTimestamp,
  escapeHtml,
  getTodayDate,
  getCurrentTime
} from '../lib/formatters';
import { getNextStage } from '../lib/calculations';

interface DetailPanelProps {
  contact: PartnerContact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMarkStepDone: (stepId: string) => void;
  onMarkDocSent: (stepId: string) => void;
  onUndoStep: (stepId: string) => void;
  onAddNote: (text: string) => void;
  onDeleteNote: (noteId: string) => void;
  onAddActivity: (text: string, type: ActivityType) => void;
  onDeleteActivity: (activityId: string) => void;
  onAdvanceStage: () => void;
}

export function DetailPanel({
  contact,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onMarkStepDone,
  onMarkDocSent,
  onUndoStep,
  onAddNote,
  onDeleteNote,
  onAddActivity,
  onDeleteActivity,
  onAdvanceStage,
}: DetailPanelProps) {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [activityText, setActivityText] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('call');

  if (!contact) return null;

  const colors = getTypeColors(contact.type);
  const stage = getStageMeta(contact.stage);
  const journeyProgress = calculateJourneyProgress(contact);
  const steps = getJourneySteps(contact.type);
  const journey = contact.journey || {};
  const notes = contact.notes_log || [];
  const activities = contact.activities || [];
  const nextStage = getNextStage(contact.stage);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    onAddNote(noteText.trim());
    setNoteText('');
    setShowNoteForm(false);
  };

  const handleAddActivity = () => {
    if (!activityText.trim()) return;
    onAddActivity(activityText.trim(), activityType);
    setActivityText('');
    setShowActivityForm(false);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-[#0E1C2F]/40 z-[150] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      
      {/* Panel */}
      <div 
        className={`fixed top-0 right-0 w-[480px] h-screen bg-white border-l border-[#D0D9E6] z-[160] overflow-y-auto transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Contact details"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-[#E8EDF5]">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-[#8298AE] hover:text-[#0E1C2F] hover:bg-[#F2F5F9] p-1 rounded transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div 
            className="w-13 h-13 rounded-xl flex items-center justify-center text-lg font-semibold font-mono mb-2.5"
            style={{ backgroundColor: colors.bg, color: colors.text }}
            role="img"
            aria-label="Contact initials"
          >
            {getInitials(contact)}
          </div>
          
          <div className="flex items-start gap-2">
            <div>
              <div className="font-serif text-xl text-[#0E1C2F] leading-tight">
                {getFullName(contact)}
              </div>
              <div className="text-xs text-[#526070] mt-0.5">
                {contact.firm}
              </div>
            </div>
            {contact.preferred && (
              <Star className="w-4 h-4 text-[#B8860B] fill-[#B8860B] ml-1" aria-label="Preferred partner" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Engagement */}
          <Section title="Engagement">
            <div className="flex items-center gap-2.5">
              <div className="flex-1 h-1.5 bg-[#E8EDF5] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ width: `${stage.score}%`, backgroundColor: getEngagementColor(stage.score) }}
                  aria-label={`${stage.score}% engagement`}
                />
              </div>
              <span className="text-[11px] font-mono min-w-7 text-right">{stage.score}%</span>
            </div>
          </Section>

          {/* Contact Info */}
          <Section title="Contact info">
            <InfoRow label="Type" value={contact.type} />
            <InfoRow 
              label="Email" 
              value={contact.email || '—'} 
              valueClass={contact.email ? 'text-[#1A5FA8]' : ''}
            />
            <InfoRow label="Phone" value={contact.phone || '—'} />
            <InfoRow label="States" value={contact.states.join(', ') || '—'} />
            <InfoRow label="Last contact" value={formatDate(contact.lastContact)} />
            <InfoRow 
              label="Stage" 
              value={
                <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStageClass(contact.stage)}`}>
                  {stage.label}
                </span>
              } 
            />
            <InfoRow 
              label="Preferred" 
              value={contact.preferred ? '★ Yes' : 'No'}
              valueClass={contact.preferred ? 'text-[#B8860B]' : 'text-[#8298AE]'}
            />
            {contact.notes && (
              <InfoRow label="Notes" value={contact.notes} isBlock />
            )}
          </Section>

          {/* Partnership Journey */}
          <Section 
            title="Partnership journey" 
            rightContent={
              <span className={`text-[11px] font-mono ${journeyProgress.pct === 100 ? 'text-[#0D7A55]' : 'text-[#534AB7]'}`}>
                {journeyProgress.done}/{journeyProgress.total} · {journeyProgress.pct}%
              </span>
            }
          >
            <div className="space-y-2">
              {steps.map((step, idx) => {
                const stepState = journey[step.id] || { status: 'pending' };
                const isDone = stepState.status === 'done';
                const isCurrent = stepState.status === 'current';

                return (
                  <div key={step.id} className="flex items-start gap-2.5 py-1">
                    <div 
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold shrink-0 ${
                        isDone 
                          ? 'bg-[#0D7A55] border-[#0D7A55] text-white' 
                          : isCurrent 
                            ? 'bg-[#1A5FA8] border-[#1A5FA8] text-white'
                            : 'bg-white border-[#D0D9E6] text-[#8298AE]'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium ${isDone ? 'text-[#526070]' : 'text-[#0E1C2F]'}`}>
                        {step.name}
                        {stepState.docSent && step.docLabel && (
                          <span className="text-[10px] text-[#0D7A55] font-medium ml-1">
                            · {step.docLabel} sent ✓
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#8298AE] leading-tight">
                        {step.desc}
                      </div>
                      {stepState.date && (
                        <div className="text-[10px] font-mono text-[#8298AE] mt-0.5">
                          {formatDate(stepState.date)}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {!isDone && step.docLabel && !stepState.docSent && (
                          <button 
                            onClick={() => onMarkDocSent(step.id)}
                            className="px-2 py-0.5 text-[10px] border border-[#D0D9E6] rounded hover:bg-[#F2F5F9] hover:border-[#1A5FA8] hover:text-[#1A5FA8] transition-colors"
                          >
                            Mark &quot;{step.docLabel}&quot; sent
                          </button>
                        )}
                        {!isDone && (
                          <button 
                            onClick={() => onMarkStepDone(step.id)}
                            className="px-2 py-0.5 text-[10px] bg-[#1A5FA8] text-white rounded hover:bg-[#0E1C2F] transition-colors"
                          >
                            Mark complete ✓
                          </button>
                        )}
                        {isDone && (
                          <button 
                            onClick={() => onUndoStep(step.id)}
                            className="px-2 py-0.5 text-[10px] text-[#8298AE] hover:text-[#0E1C2F] transition-colors"
                          >
                            Undo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Notes Log */}
          <Section 
            title="Notes log" 
            rightContent={
              <button 
                onClick={() => setShowNoteForm(!showNoteForm)}
                className="p-1 hover:bg-[#F2F5F9] rounded transition-colors"
                title="Add note"
                aria-label="Add note"
              >
                <Plus className="w-4 h-4 text-[#8298AE]" />
              </button>
            }
          >
            {notes.length === 0 && (
              <div className="text-xs text-[#8298AE] italic py-1">No notes yet.</div>
            )}
            {notes.slice(0, 10).map(note => (
              <div key={note.id} className="bg-[#F2F5F9] rounded-lg p-2.5 mb-1.5 relative pr-8">
                <div className="text-xs text-[#0E1C2F] leading-relaxed">
                  {escapeHtml(note.text)}
                </div>
                <div className="text-[10px] font-mono text-[#8298AE] mt-1">
                  {formatTimestamp(note.ts)}
                </div>
                <button 
                  onClick={() => onDeleteNote(note.id)}
                  className="absolute top-2 right-2 text-[#8298AE] hover:text-[#B83232] hover:bg-[#FBE9E9] p-0.5 rounded transition-colors"
                  aria-label="Delete note"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {notes.length > 10 && (
              <div className="text-[11px] text-[#8298AE] italic text-center py-2">
                ...and {notes.length - 10} more notes
              </div>
            )}
            
            {showNoteForm && (
              <div className="flex gap-1.5 mt-2 items-start">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note…"
                  className="flex-1 min-h-[52px] resize-none text-xs p-2 border border-[#D0D9E6] rounded focus:border-[#1A5FA8] focus:outline-none"
                  aria-label="New note"
                />
                <button 
                  onClick={handleAddNote}
                  className="px-3 py-1.5 text-xs bg-[#1A5FA8] text-white rounded hover:bg-[#0E1C2F] transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </Section>

          {/* Activity Log */}
          <Section 
            title="Activity log" 
            rightContent={
              <button 
                onClick={() => setShowActivityForm(!showActivityForm)}
                className="p-1 hover:bg-[#F2F5F9] rounded transition-colors"
                title="Log activity"
                aria-label="Log activity"
              >
                <Plus className="w-4 h-4 text-[#8298AE]" />
              </button>
            }
          >
            {activities.length === 0 && (
              <div className="text-xs text-[#8298AE] italic py-1">No activity yet.</div>
            )}
            {activities.slice(0, 10).map((activity, idx) => {
              const isLast = idx === Math.min(activities.length, 10) - 1;
              return (
                <div key={activity.id} className="flex gap-2.5 mb-2">
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-1.5 h-1.5 rounded-full mt-1"
                      style={{ backgroundColor: getActivityColor(activity.type) }}
                    />
                    {!isLast && <div className="w-px flex-1 bg-[#E8EDF5] mt-0.5 min-h-3" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-[#0E1C2F] leading-snug">
                      {escapeHtml(activity.text)}
                    </div>
                    <div className="text-[10px] font-mono text-[#8298AE]">
                      {activity.date}{activity.time ? ` · ${activity.time}` : ''}
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteActivity(activity.id)}
                    className="text-transparent hover:text-[#8298AE] hover:bg-[#F2F5F9] p-0.5 rounded transition-colors shrink-0"
                    aria-label="Delete activity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
            {activities.length > 10 && (
              <div className="text-[11px] text-[#8298AE] italic text-center py-2">
                ...and {activities.length - 10} more activities
              </div>
            )}
            
            {showActivityForm && (
              <div className="flex gap-1.5 mt-2 items-center">
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as ActivityType)}
                  className="w-24 text-xs p-1.5 border border-[#D0D9E6] rounded focus:border-[#1A5FA8] focus:outline-none"
                  aria-label="Activity type"
                >
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="doc">Document</option>
                  <option value="deal">Deal</option>
                  <option value="event">Event</option>
                  <option value="referral">Referral</option>
                </select>
                <input
                  type="text"
                  value={activityText}
                  onChange={(e) => setActivityText(e.target.value)}
                  placeholder="Describe the activity…"
                  className="flex-1 text-xs p-1.5 border border-[#D0D9E6] rounded focus:border-[#1A5FA8] focus:outline-none"
                  aria-label="Activity description"
                />
                <button 
                  onClick={handleAddActivity}
                  className="px-3 py-1.5 text-xs bg-[#1A5FA8] text-white rounded hover:bg-[#0E1C2F] transition-colors"
                >
                  Log
                </button>
              </div>
            )}
          </Section>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button 
              onClick={onEdit}
              className="flex-1 px-4 py-2 text-xs border border-[#D0D9E6] rounded hover:bg-[#F2F5F9] transition-colors"
            >
              Edit contact
            </button>
            {nextStage && (
              <button 
                onClick={onAdvanceStage}
                className="flex-1 px-4 py-2 text-xs bg-[#1A5FA8] text-white rounded hover:bg-[#0E1C2F] transition-colors flex items-center justify-center gap-1"
              >
                Advance stage
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <button 
            onClick={onDelete}
            className="w-full mt-2 px-4 py-2 text-xs text-[#B83232] bg-[#FBE9E9] rounded hover:bg-[#f5d0d0] transition-colors"
          >
            Remove contact
          </button>
        </div>
      </div>
    </>
  );
}

function Section({ 
  title, 
  children, 
  rightContent 
}: { 
  title: string; 
  children: React.ReactNode;
  rightContent?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#E8EDF5]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8298AE]">
          {title}
        </span>
        {rightContent}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ 
  label, 
  value, 
  valueClass = '',
  isBlock = false
}: { 
  label: string; 
  value: React.ReactNode; 
  valueClass?: string;
  isBlock?: boolean;
}) {
  if (isBlock) {
    return (
      <div className="flex flex-col gap-1 py-1.5 border-b border-[#E8EDF5] last:border-0">
        <span className="text-xs text-[#8298AE]">{label}</span>
        <span className={`text-xs ${valueClass}`}>{value}</span>
      </div>
    );
  }
  
  return (
    <div className="flex justify-between py-1.5 text-xs border-b border-[#E8EDF5] last:border-0">
      <span className="text-[#8298AE]">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, Plus, Download, Upload, Printer, LayoutGrid, List, Search, X, RotateCcw } from 'lucide-react';
import { usePartnerCRM } from '../hooks/usePartnerCRM';
import { Sidebar } from './Sidebar';
import { Metrics } from './Metrics';
import { ContactCard } from './ContactCard';
import { ContactList } from './ContactList';
import { DetailPanel } from './DetailPanel';
import { ContactModal } from './ContactModal';
import { PipelineView } from './PipelineView';
import { NudgesView } from './NudgesView';
import { OnboardingView } from './OnboardingView';
import { Toast } from './Toast';
import { STAGE_META, STAGE_ORDER } from '../constants';
import { needsNudge, calculateJourneyProgress } from '../lib/formatters';
import type { PartnerContact, ViewMode } from '../types';

const VIEW_TITLES: Record<ViewMode, string> = {
  all: 'All partners',
  preferred: 'Preferred partners',
  pipeline: 'Partnership pipeline',
  nudges: 'Follow-up needed',
  onboarding: 'Onboarding tracker',
};

export function ESOPPartnerCRM() {
  const {
    contacts,
    filteredContacts,
    isLoaded,
    currentView,
    currentType,
    searchQuery,
    cardView,
    sort,
    selectedContact,
    editingContact,
    toast,
    metrics,
    setSearchQuery,
    setCardView,
    setSelectedContactId,
    setEditingContactId,
    addContact,
    updateContact,
    deleteContact,
    markJourneyStepDone,
    markJourneyDocSent,
    undoJourneyStep,
    addNote,
    deleteNote,
    addActivity,
    deleteActivity,
    advanceStage,
    exportData,
    importData,
    resetData,
    toggleSort,
    setFilter,
  } = usePartnerCRM();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importAreaVisible, setImportAreaVisible] = useState(false);
  const [importText, setImportText] = useState('');

  // Contact counts for sidebar
  const contactCounts = useMemo(() => ({
    all: contacts.length,
    preferred: contacts.filter(c => c.preferred).length,
    nudges: contacts.filter(needsNudge).length,
    onboarding: contacts.filter(c => {
      const p = calculateJourneyProgress(c);
      return p.pct > 0 && p.pct < 100;
    }).length,
    byType: {
      Lender: contacts.filter(c => c.type === 'Lender').length,
      Attorney: contacts.filter(c => c.type === 'Attorney').length,
      CPA: contacts.filter(c => c.type === 'CPA').length,
      Administrator: contacts.filter(c => c.type === 'Administrator').length,
      Appraiser: contacts.filter(c => c.type === 'Appraiser').length,
      Trustee: contacts.filter(c => c.type === 'Trustee').length,
    },
  }), [contacts]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        else if (isDetailOpen) setIsDetailOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isDetailOpen]);

  const handleSetView = (view: ViewMode) => {
    setFilter(view, null);
  };

  const handleFilterType = (type: string | null) => {
    setFilter('all', type);
  };

  const handleSelectContact = (contact: PartnerContact) => {
    setSelectedContactId(contact.id);
    setIsDetailOpen(true);
  };

  const handleEditContact = () => {
    if (selectedContact) {
      setEditingContactId(selectedContact.id);
      setIsModalOpen(true);
    }
  };

  const handleDeleteContact = () => {
    if (selectedContact) {
      deleteContact(selectedContact.id);
      setIsDetailOpen(false);
      setIsModalOpen(false);
    }
  };

  const handleSaveContact = (data: Partial<PartnerContact>) => {
    if (editingContact) {
      updateContact(editingContact.id, data);
    } else {
      addContact(data);
    }
  };

  const handleImport = () => {
    if (importData(importText)) {
      setImportAreaVisible(false);
      setImportText('');
    }
  };

  const handleStageFilterClick = (stage: string) => {
    if (stage === 'all') {
      setFilter('all', currentType);
    } else {
      setFilter(stage as ViewMode, currentType);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen bg-[#F2F5F9]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#526070]">Loading...</div>
        </div>
      </div>
    );
  }

  const hasNudges = metrics.nudge > 0 && currentView === 'all' && !currentType;

  // Get nudge names for banner
  const nudgeNames = contacts
    .filter(needsNudge)
    .slice(0, 2)
    .map(c => `${c.first} ${c.last}`)
    .join(', ');

  return (
    <div className="flex min-h-screen bg-[#F2F5F9]">
      <Sidebar 
        currentView={currentView}
        currentType={currentType}
        contactCounts={contactCounts}
        onSetView={handleSetView}
        onFilterType={handleFilterType}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="bg-white border-b border-[#E8EDF5] px-6 h-13 flex items-center gap-3 sticky top-0 z-50">
          <h1 className="font-serif text-base text-[#0E1C2F] flex-1">
            {currentType ? `${currentType}s` : VIEW_TITLES[currentView]}
          </h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8298AE]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts…"
              className="bg-[#F2F5F9] border border-[#E8EDF5] rounded-full pl-8 pr-3 py-1.5 text-xs text-[#0E1C2F] w-48 focus:outline-none focus:border-[#1A5FA8] focus:w-56 transition-all"
              aria-label="Search contacts"
            />
          </div>

          {/* Actions */}
          <button 
            onClick={() => { setEditingContactId(null); setIsModalOpen(true); }}
            className="px-3 py-1.5 text-xs border border-[#D0D9E6] rounded hover:bg-[#F2F5F9] transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add contact
          </button>
          <button 
            onClick={exportData}
            className="px-3 py-1.5 text-xs border border-[#D0D9E6] rounded hover:bg-[#F2F5F9] transition-colors flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button 
            onClick={() => setImportAreaVisible(!importAreaVisible)}
            className="px-3 py-1.5 text-xs border border-[#D0D9E6] rounded hover:bg-[#F2F5F9] transition-colors flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" />
            Import
          </button>
          <button 
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs bg-[#1A5FA8] text-white rounded hover:bg-[#0E1C2F] transition-colors flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Import Area */}
          {importAreaVisible && (
            <div className="mb-4">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste JSON data here to import contacts..."
                className="w-full min-h-[100px] border-2 border-dashed border-[#D0D9E6] rounded-lg p-3 text-xs font-mono bg-[#F2F5F9] resize-y focus:outline-none focus:border-[#1A5FA8]"
              />
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={handleImport}
                  className="px-3 py-1.5 text-xs bg-[#1A5FA8] text-white rounded hover:bg-[#0E1C2F] transition-colors"
                >
                  Import Data
                </button>
                <button 
                  onClick={() => { setImportAreaVisible(false); setImportText(''); }}
                  className="px-3 py-1.5 text-xs border border-[#D0D9E6] rounded hover:bg-[#F2F5F9] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Special Views */}
          {currentView === 'pipeline' && (
            <PipelineView contacts={contacts} onSelectContact={handleSelectContact} />
          )}
          
          {currentView === 'nudges' && (
            <NudgesView contacts={filteredContacts} onSelectContact={handleSelectContact} />
          )}
          
          {currentView === 'onboarding' && (
            <OnboardingView contacts={contacts} onSelectContact={handleSelectContact} />
          )}

          {/* Standard Views */}
          {currentView !== 'pipeline' && currentView !== 'nudges' && currentView !== 'onboarding' && (
            <>
              <Metrics 
                total={metrics.total}
                preferred={metrics.preferred}
                active={metrics.active}
                nudge={metrics.nudge}
                typeCount={metrics.typeCount}
              />

              {/* Nudge Banner */}
              {hasNudges && (
                <div className="bg-[#FEF3DC] border border-[#E8C97A] rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2.5">
                  <span className="text-sm">⚑</span>
                  <span className="text-xs text-[#C47A0A]">
                    <strong>{metrics.nudge} contact{metrics.nudge > 1 ? 's' : ''}</strong> overdue — {nudgeNames}
                    {metrics.nudge > 2 ? ', and more' : ''}
                  </span>
                  <button 
                    onClick={() => handleSetView('nudges')}
                    className="ml-auto px-3 py-1 text-xs border border-[#E8C97A] rounded hover:bg-white transition-colors"
                  >
                    View all →
                  </button>
                </div>
              )}

              {/* Filters & View Toggle */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {['all', ...STAGE_ORDER].map(stage => {
                  const label = stage === 'all' ? 'All' : STAGE_META[stage].label;
                  const count = stage === 'all' 
                    ? filteredContacts.length 
                    : filteredContacts.filter(c => c.stage === stage).length;
                  const isActive = (stage === 'all' && !STAGE_ORDER.includes(currentView as any)) || currentView === stage;

                  return (
                    <button
                      key={stage}
                      onClick={() => handleStageFilterClick(stage)}
                      className={`text-[11px] font-medium px-3 py-1 rounded-full border transition-colors ${
                        isActive 
                          ? 'bg-[#0E1C2F] text-white border-[#0E1C2F]' 
                          : 'bg-white text-[#526070] border-[#D0D9E6] hover:border-[#1A5FA8] hover:text-[#1A5FA8]'
                      }`}
                    >
                      {label} <span className="opacity-60">{count}</span>
                    </button>
                  );
                })}

                <div className="flex-1" />

                <div className="flex border border-[#D0D9E6] rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setCardView('grid')}
                    className={`px-2.5 py-1 text-[11px] flex items-center gap-1 transition-colors ${
                      cardView === 'grid' ? 'bg-[#0E1C2F] text-white' : 'bg-white text-[#8298AE] hover:bg-[#F2F5F9]'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Grid
                  </button>
                  <button 
                    onClick={() => setCardView('list')}
                    className={`px-2.5 py-1 text-[11px] flex items-center gap-1 transition-colors ${
                      cardView === 'list' ? 'bg-[#0E1C2F] text-white' : 'bg-white text-[#8298AE] hover:bg-[#F2F5F9]'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    List
                  </button>
                </div>
              </div>

              {/* Content */}
              {filteredContacts.length === 0 ? (
                <div className="text-center py-16 text-[#8298AE]">
                  <div className="text-2xl opacity-30 mb-2">○</div>
                  <div className="text-sm">No contacts match your criteria.</div>
                  <button 
                    onClick={() => { setSearchQuery(''); setFilter('all', null); }}
                    className="mt-3 px-3 py-1.5 text-xs border border-[#D0D9E6] rounded hover:bg-[#F2F5F9] transition-colors flex items-center gap-1 mx-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Clear filters
                  </button>
                </div>
              ) : cardView === 'list' ? (
                <ContactList 
                  contacts={filteredContacts}
                  sort={sort}
                  onSort={toggleSort}
                  onSelect={handleSelectContact}
                />
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3.5">
                  {filteredContacts.map(contact => (
                    <ContactCard 
                      key={contact.id}
                      contact={contact}
                      onClick={() => handleSelectContact(contact)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <DetailPanel
        contact={selectedContact}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
        onMarkStepDone={(stepId) => selectedContact && markJourneyStepDone(selectedContact.id, stepId)}
        onMarkDocSent={(stepId) => selectedContact && markJourneyDocSent(selectedContact.id, stepId)}
        onUndoStep={(stepId) => selectedContact && undoJourneyStep(selectedContact.id, stepId)}
        onAddNote={(text) => selectedContact && addNote(selectedContact.id, text)}
        onDeleteNote={(noteId) => selectedContact && deleteNote(selectedContact.id, noteId)}
        onAddActivity={(text, type) => selectedContact && addActivity(selectedContact.id, text, type)}
        onDeleteActivity={(activityId) => selectedContact && deleteActivity(selectedContact.id, activityId)}
        onAdvanceStage={() => selectedContact && advanceStage(selectedContact.id)}
      />

      {/* Modal */}
      <ContactModal
        isOpen={isModalOpen}
        contact={editingContact}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
        onDelete={handleDeleteContact}
      />

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  PartnerContact, 
  ViewMode, 
  CardViewMode, 
  SortConfig, 
  ActivityType,
  PartnerType,
  EngagementStage,
  StorageMeta,
  ExportedData
} from '../types';
import { DEFAULT_CONTACTS, STAGE_ORDER } from '../constants';
import { 
  getTodayDate, 
  getCurrentTime, 
  getCurrentTimestamp, 
  getJourneySteps,
  calculateJourneyProgress 
} from '../lib/formatters';
import { 
  filterContacts, 
  sortContacts, 
  calculateMetrics,
  getNextStage,
  groupByStage,
  getOnboardingLists,
  validateEmail
} from '../lib/calculations';

const STORAGE_KEY = 'esop_crm_contacts';
const META_KEY = 'esop_crm_meta';

export function usePartnerCRM() {
  // Data state
  const [contacts, setContacts] = useState<PartnerContact[]>([]);
  const [nextId, setNextId] = useState(6);
  const [nextNid, setNextNid] = useState(100);
  const [nextAid, setNextAid] = useState(200);
  const [isLoaded, setIsLoaded] = useState(false);

  // UI state
  const [currentView, setCurrentView] = useState<ViewMode>('all');
  const [currentType, setCurrentType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cardView, setCardView] = useState<CardViewMode>('grid');
  const [sort, setSort] = useState<SortConfig>({ field: null, dir: 'asc' });
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [importAreaVisible, setImportAreaVisible] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const meta = localStorage.getItem(META_KEY);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        setContacts(parsed);
        if (meta) {
          const m: StorageMeta = JSON.parse(meta);
          setNextId(m.nextId || 6);
          setNextNid(m.nextNid || 100);
          setNextAid(m.nextAid || 200);
        }
        showToast('Loaded saved data');
      } else {
        // Deep clone default contacts
        setContacts(JSON.parse(JSON.stringify(DEFAULT_CONTACTS)));
        saveToStorage(JSON.parse(JSON.stringify(DEFAULT_CONTACTS)), { nextId: 6, nextNid: 100, nextAid: 200 });
      }
    } catch (e) {
      console.error('Load failed:', e);
      setContacts(JSON.parse(JSON.stringify(DEFAULT_CONTACTS)));
    }
    setIsLoaded(true);
  }, []);

  // Auto-save when contacts change
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(contacts, { nextId, nextNid, nextAid });
    }
  }, [contacts, nextId, nextNid, nextAid, isLoaded]);

  const saveToStorage = (data: PartnerContact[], meta: StorageMeta) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(META_KEY, JSON.stringify(meta));
    } catch (e) {
      console.error('Storage failed:', e);
    }
  };

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  }, []);

  // Derived data
  const filteredContacts = useMemo(() => {
    const filtered = filterContacts(contacts, {
      view: currentView,
      type: currentType,
      searchQuery,
    });
    return sortContacts(filtered, sort);
  }, [contacts, currentView, currentType, searchQuery, sort]);

  const metrics = useMemo(() => calculateMetrics(contacts), [contacts]);
  
  const pipelineGroups = useMemo(() => groupByStage(contacts), [contacts]);
  
  const onboardingLists = useMemo(() => getOnboardingLists(contacts), [contacts]);

  const selectedContact = useMemo(() => {
    return contacts.find(c => c.id === selectedContactId) || null;
  }, [contacts, selectedContactId]);

  const editingContact = useMemo(() => {
    return contacts.find(c => c.id === editingContactId) || null;
  }, [contacts, editingContactId]);

  // Actions
  const addContact = useCallback((data: Partial<PartnerContact>) => {
    const type = data.type as PartnerType || 'Other';
    const steps = getJourneySteps(type);
    const journey: Record<string, { status: 'pending' | 'current' | 'done'; date: string | null }> = {};
    
    steps.forEach((s, i) => {
      journey[s.id] = { status: i === 0 ? 'current' : 'pending', date: null };
    });

    const newContact: PartnerContact = {
      id: nextId,
      first: data.first || '',
      last: data.last || '',
      firm: data.firm || '',
      type,
      email: data.email || '',
      phone: data.phone || '',
      states: data.states || [],
      stage: (data.stage as EngagementStage) || 'prospect',
      lastContact: data.lastContact || getTodayDate(),
      notes: data.notes || '',
      preferred: data.preferred || false,
      journey,
      notes_log: [],
      activities: [{
        id: `a${nextAid}`,
        text: 'Contact added',
        date: getTodayDate(),
        time: getCurrentTime(),
        type: 'call',
      }],
    };

    setContacts(prev => [...prev, newContact]);
    setNextId(prev => prev + 1);
    setNextAid(prev => prev + 1);
    showToast('Contact created');
    return newContact;
  }, [nextId, nextAid, showToast]);

  const updateContact = useCallback((id: number, data: Partial<PartnerContact>) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, ...data } : c
    ));
    showToast('Contact updated');
  }, [showToast]);

  const deleteContact = useCallback((id: number) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    showToast('Contact removed');
  }, [showToast]);

  const markJourneyStepDone = useCallback((contactId: number, stepId: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id !== contactId) return c;
      
      const journey = { ...c.journey };
      journey[stepId] = { ...journey[stepId], status: 'done', date: getTodayDate() };
      
      const activities = [...(c.activities || [])];
      const step = getJourneySteps(c.type).find(s => s.id === stepId);
      activities.unshift({
        id: `a${nextAid}`,
        text: `Completed: ${step?.name || stepId}`,
        date: getTodayDate(),
        time: getCurrentTime(),
        type: 'deal',
      });

      setNextAid(prev => prev + 1);
      
      return {
        ...c,
        journey,
        activities,
        lastContact: getTodayDate(),
      };
    }));
  }, [nextAid]);

  const markJourneyDocSent = useCallback((contactId: number, stepId: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id !== contactId) return c;
      
      const journey = { ...c.journey };
      journey[stepId] = { 
        ...journey[stepId], 
        docSent: true, 
        status: journey[stepId]?.status || 'current' 
      };
      
      const activities = [...(c.activities || [])];
      const step = getJourneySteps(c.type).find(s => s.id === stepId);
      activities.unshift({
        id: `a${nextAid}`,
        text: `Sent: ${step?.docLabel || 'document'}`,
        date: getTodayDate(),
        time: getCurrentTime(),
        type: 'doc',
      });

      setNextAid(prev => prev + 1);
      
      return {
        ...c,
        journey,
        activities,
        lastContact: getTodayDate(),
      };
    }));
  }, [nextAid]);

  const undoJourneyStep = useCallback((contactId: number, stepId: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id !== contactId) return c;
      
      const journey = { ...c.journey };
      journey[stepId] = { status: 'pending', date: null, docSent: false };
      
      return { ...c, journey };
    }));
  }, []);

  const addNote = useCallback((contactId: number, text: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id !== contactId) return c;
      
      const note = {
        id: `n${nextNid}`,
        text,
        ts: getCurrentTimestamp(),
      };
      
      setNextNid(prev => prev + 1);
      
      return {
        ...c,
        notes_log: [note, ...(c.notes_log || [])],
      };
    }));
  }, [nextNid]);

  const deleteNote = useCallback((contactId: number, noteId: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id !== contactId) return c;
      return {
        ...c,
        notes_log: (c.notes_log || []).filter(n => n.id !== noteId),
      };
    }));
  }, []);

  const addActivity = useCallback((contactId: number, text: string, type: ActivityType) => {
    setContacts(prev => prev.map(c => {
      if (c.id !== contactId) return c;
      
      const activity = {
        id: `a${nextAid}`,
        text,
        date: getTodayDate(),
        time: getCurrentTime(),
        type,
      };
      
      setNextAid(prev => prev + 1);
      
      return {
        ...c,
        activities: [activity, ...(c.activities || [])],
        lastContact: getTodayDate(),
      };
    }));
  }, [nextAid]);

  const deleteActivity = useCallback((contactId: number, activityId: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id !== contactId) return c;
      return {
        ...c,
        activities: (c.activities || []).filter(a => a.id !== activityId),
      };
    }));
  }, []);

  const advanceStage = useCallback((contactId: number) => {
    setContacts(prev => prev.map(c => {
      if (c.id !== contactId) return c;
      
      const nextStage = getNextStage(c.stage);
      if (!nextStage) return c;
      
      const activities = [...(c.activities || [])];
      activities.unshift({
        id: `a${nextAid}`,
        text: `Stage advanced to: ${nextStage}`,
        date: getTodayDate(),
        time: getCurrentTime(),
        type: 'deal',
      });

      setNextAid(prev => prev + 1);
      
      return {
        ...c,
        stage: nextStage as EngagementStage,
        preferred: nextStage === 'preferred' ? true : c.preferred,
        activities,
        lastContact: getTodayDate(),
      };
    }));
  }, [nextAid]);

  const exportData = useCallback(() => {
    const data: ExportedData = {
      contacts,
      exportedAt: new Date().toISOString(),
      version: '2.1',
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esop-crm-backup-${getTodayDate()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported');
  }, [contacts, showToast]);

  const importData = useCallback((jsonString: string) => {
    try {
      const data: ExportedData = JSON.parse(jsonString);
      if (data.contacts && Array.isArray(data.contacts)) {
        setContacts(data.contacts);
        showToast('Import successful');
        return true;
      }
      showToast('Invalid data format');
      return false;
    } catch (e) {
      showToast('Invalid JSON');
      return false;
    }
  }, [showToast]);

  const resetData = useCallback(() => {
    const defaults = JSON.parse(JSON.stringify(DEFAULT_CONTACTS));
    setContacts(defaults);
    setNextId(6);
    setNextNid(100);
    setNextAid(200);
    showToast('Reset to demo data');
  }, [showToast]);

  const toggleSort = useCallback((field: SortConfig['field']) => {
    setSort(prev => {
      if (prev.field === field) {
        return { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
      }
      return { field, dir: 'asc' };
    });
  }, []);

  const setFilter = useCallback((view: ViewMode, type: string | null = null) => {
    setCurrentView(view);
    setCurrentType(type);
  }, []);

  return {
    // Data
    contacts,
    filteredContacts,
    isLoaded,
    
    // State
    currentView,
    currentType,
    searchQuery,
    cardView,
    sort,
    selectedContact,
    editingContact,
    toast,
    importAreaVisible,
    metrics,
    pipelineGroups,
    onboardingLists,
    
    // Actions
    setSearchQuery,
    setCardView,
    setSelectedContactId,
    setIsModalOpen,
    setEditingContactId,
    setImportAreaVisible,
    
    // CRUD
    addContact,
    updateContact,
    deleteContact,
    
    // Journey
    markJourneyStepDone,
    markJourneyDocSent,
    undoJourneyStep,
    
    // Notes & Activities
    addNote,
    deleteNote,
    addActivity,
    deleteActivity,
    advanceStage,
    
    // Import/Export
    exportData,
    importData,
    resetData,
    
    // UI
    toggleSort,
    setFilter,
    showToast,
    
    // Modals
    isModalOpen,
    selectedContactId,
  };
}

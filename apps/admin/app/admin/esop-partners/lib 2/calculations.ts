// ESOP Partner CRM Calculations

import type { PartnerContact, SortConfig } from '../types';
import { getFullName, daysSince, needsNudge, calculateJourneyProgress } from './formatters';

export function filterContacts(
  contacts: PartnerContact[],
  options: {
    view?: string;
    type?: string | null;
    searchQuery?: string;
  }
): PartnerContact[] {
  const { view = 'all', type = null, searchQuery = '' } = options;
  const q = searchQuery.toLowerCase().trim();

  return contacts.filter(contact => {
    if (!contact) return false;
    if (type && contact.type !== type) return false;
    if (view === 'preferred' && !contact.preferred) return false;
    if (view === 'nudges' && !needsNudge(contact)) return false;
    if (view === 'onboarding') {
      const progress = calculateJourneyProgress(contact);
      if (progress.pct === 0 || progress.pct === 100) return false;
    }
    if (q) {
      const haystack = `${getFullName(contact)} ${contact.firm || ''} ${contact.type || ''} ${(contact.states || []).join(' ')} ${contact.email || ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function sortContacts(
  contacts: PartnerContact[],
  sort: SortConfig
): PartnerContact[] {
  if (!sort.field) return contacts;

  const { field, dir } = sort;
  const sorted = [...contacts];

  return sorted.sort((a, b) => {
    let aVal: string;
    let bVal: string;

    switch (field) {
      case 'name':
        aVal = getFullName(a);
        bVal = getFullName(b);
        break;
      case 'firm':
        aVal = a.firm || '';
        bVal = b.firm || '';
        break;
      case 'type':
        aVal = a.type || '';
        bVal = b.type || '';
        break;
      case 'stage':
        aVal = a.stage || '';
        bVal = b.stage || '';
        break;
      case 'lastcontact':
        aVal = a.lastContact || '';
        bVal = b.lastContact || '';
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return dir === 'asc' ? -1 : 1;
    if (aVal > bVal) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

export function calculateMetrics(contacts: PartnerContact[]) {
  const total = contacts.length;
  const preferred = contacts.filter(c => c.preferred).length;
  const nudge = contacts.filter(needsNudge).length;
  const active = contacts.filter(c => c.stage === 'active' || c.stage === 'preferred').length;
  
  const typeCount = new Set(contacts.map(c => c.type)).size;

  return { total, preferred, nudge, active, typeCount };
}

export function getNextStage(currentStage: string): string | null {
  const order = ['prospect', 'introduced', 'active', 'preferred'];
  const idx = order.indexOf(currentStage);
  if (idx >= 0 && idx < order.length - 1) {
    return order[idx + 1];
  }
  return null;
}

export function getNextStageIndex(currentStage: string): number {
  const order = ['prospect', 'introduced', 'active', 'preferred'];
  return order.indexOf(currentStage);
}

export function groupByStage(contacts: PartnerContact[]): Record<string, PartnerContact[]> {
  const stages = ['prospect', 'introduced', 'active', 'preferred', 'dormant'];
  const grouped: Record<string, PartnerContact[]> = {};
  
  stages.forEach(stage => {
    grouped[stage] = contacts.filter(c => c.stage === stage);
  });
  
  return grouped;
}

export function getOnboardingLists(contacts: PartnerContact[]) {
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

  return { inProgress, notStarted, done };
}

export function validateEmail(email: string): boolean {
  if (!email) return true; // Email is optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function countByType(contacts: PartnerContact[], type: string): number {
  return contacts.filter(c => c.type === type).length;
}

export function getRecentActivities(contacts: PartnerContact[], limit = 5) {
  const allActivities = contacts.flatMap(contact => 
    (contact.activities || []).map(act => ({
      ...act,
      contactName: getFullName(contact),
      contactId: contact.id,
    }))
  );

  return allActivities
    .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime())
    .slice(0, limit);
}

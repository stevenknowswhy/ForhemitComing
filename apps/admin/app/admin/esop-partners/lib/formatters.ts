// ESOP Partner CRM Formatters

import { NUDGE_DAYS, STAGE_META, TYPE_COLORS, JOURNEY_STEPS, ACTIVITY_COLORS } from '../constants';
import type { PartnerContact, JourneyStep } from '../types';

export function getInitials(contact: PartnerContact | null): string {
  if (!contact || !contact.first || !contact.last) return '??';
  return (contact.first[0] + contact.last[0]).toUpperCase();
}

export function getFullName(contact: PartnerContact | null): string {
  if (!contact || !contact.first || !contact.last) return 'Unknown';
  return `${contact.first} ${contact.last}`;
}

export function getTypeColors(type: string): { bg: string; text: string } {
  return TYPE_COLORS[type] || TYPE_COLORS['Other'];
}

export function getStageMeta(stage: string): { label: string; score: number } {
  return STAGE_META[stage] || STAGE_META['prospect'];
}

export function getStageClass(stage: string): string {
  const classes: Record<string, string> = {
    prospect: 'bg-amber-100 text-amber-800',
    introduced: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    preferred: 'bg-yellow-100 text-yellow-800',
    dormant: 'bg-red-100 text-red-800',
  };
  return classes[stage] || classes['prospect'];
}

export function daysSince(dateStr: string | null | undefined): number {
  if (!dateStr) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = new Date(dateStr);
  check.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - check.getTime()) / 86400000);
}

export function needsNudge(contact: PartnerContact): boolean {
  if (!contact || !contact.lastContact) return true;
  const threshold = NUDGE_DAYS[contact.stage] || 30;
  return daysSince(contact.lastContact) >= threshold;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return '—';
    return `${month}/${day}/${year}`;
  } catch {
    return '—';
  }
}

export function formatTimestamp(ts: string | null | undefined): string {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) + 
           ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function getTodayDate(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getCurrentTime(): string {
  return new Date().toTimeString().slice(0, 5);
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function getActivityColor(type: string): string {
  return ACTIVITY_COLORS[type] || '#8298AE';
}

export function getJourneySteps(type: string): JourneyStep[] {
  return JOURNEY_STEPS[type] || JOURNEY_STEPS['default'];
}

export function calculateJourneyProgress(contact: PartnerContact): { done: number; total: number; pct: number } {
  if (!contact || !contact.type) return { done: 0, total: 0, pct: 0 };
  const steps = getJourneySteps(contact.type);
  const journey = contact.journey || {};
  const done = steps.filter(s => journey[s.id]?.status === 'done').length;
  return { done, total: steps.length, pct: Math.round((done / steps.length) * 100) };
}

export function getEngagementColor(score: number): string {
  if (score >= 80) return '#1D9E75';
  if (score >= 50) return '#185FA5';
  if (score >= 25) return '#C47A0A';
  return '#8298AE';
}

export function formatRelativeDate(dateStr: string | null | undefined): string {
  const days = daysSince(dateStr);
  if (days === 0) return 'Today';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatDate(dateStr);
}

export function formatDaysShort(dateStr: string | null | undefined): string {
  const days = daysSince(dateStr);
  if (days < 1) return 'Today';
  return `${days}d`;
}

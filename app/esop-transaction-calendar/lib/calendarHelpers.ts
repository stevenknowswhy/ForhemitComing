import {
  PRIMARY_ROLES,
  SECONDARY_ROLES,
  TWO_LENDER_SECONDARY_ROLES,
  PHASES,
  TOTAL_DAYS,
} from "../constants";
import type { CalendarEvent, CalendarPhase, CalendarRole, PartyTier, RoleFilter } from "../types";

const primaryRoleSet = new Set<string>(PRIMARY_ROLES);
const secondaryRoleSet = new Set<string>(SECONDARY_ROLES);
const twoLenderSecondarySet = new Set<string>(TWO_LENDER_SECONDARY_ROLES);

export function isPrimaryRole(role: CalendarRole): boolean {
  return primaryRoleSet.has(role);
}

export function isSecondaryRole(role: CalendarRole): boolean {
  return secondaryRoleSet.has(role);
}

export function passesTwoLenderFilter(event: CalendarEvent, twoLenderOn: boolean): boolean {
  if (!event.twoLender) return true;
  return twoLenderOn;
}

/**
 * Whether an event belongs in the calendar grid for the active party tier
 * (primary vs secondary). Hard gates always match. Two-lender-only events
 * require twoLenderOn.
 */
export function eventMatchesPartyTier(
  event: CalendarEvent,
  tier: PartyTier,
  twoLenderOn: boolean,
): boolean {
  if (!passesTwoLenderFilter(event, twoLenderOn)) return false;
  if (event.gate) return true;
  if (tier === "primary") return isPrimaryRole(event.role);
  if (!isSecondaryRole(event.role)) return false;
  if (twoLenderSecondarySet.has(event.role) && !twoLenderOn) return false;
  return true;
}

/** Role chips shown for the current tier (hides sec-lender / sec-counsel when two-lender is off). */
export function rolesForTierChips(tier: PartyTier, twoLenderOn: boolean): CalendarRole[] {
  if (tier === "primary") return [...PRIMARY_ROLES];
  return SECONDARY_ROLES.filter((r) => twoLenderOn || !twoLenderSecondarySet.has(r));
}

export function countEventsForRole(
  events: readonly CalendarEvent[],
  role: CalendarRole,
  tier: PartyTier,
  twoLenderOn: boolean,
): number {
  return events.filter(
    (e) => e.role === role && eventMatchesPartyTier(e, tier, twoLenderOn),
  ).length;
}

export function filterEventsForCalendar(
  events: readonly CalendarEvent[],
  tier: PartyTier,
  twoLenderOn: boolean,
): CalendarEvent[] {
  return events.filter((e) => eventMatchesPartyTier(e, tier, twoLenderOn));
}

export function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function dayToDate(startDate: Date, dayNum: number): Date {
  const d = new Date(startDate);
  d.setDate(d.getDate() + dayNum - 1);
  return d;
}

export function dateToDay(startDate: Date, date: Date): number {
  const s = stripTime(startDate).getTime();
  const t = stripTime(date).getTime();
  return Math.round((t - s) / 86400000) + 1;
}

export function phaseOf(day: number): CalendarPhase | null {
  return PHASES.find((p) => day >= p.start && day <= p.end) ?? null;
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(date: Date): boolean {
  return sameDay(date, new Date());
}

export function formatCalendarDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export type EventIndex = Record<string, CalendarEvent[]>;

export function buildEventIndex(events: CalendarEvent[], startDate: Date): EventIndex {
  const index: EventIndex = {};
  for (const ev of events) {
    const cal = dayToDate(startDate, ev.day);
    const key = `${cal.getFullYear()}-${cal.getMonth()}-${cal.getDate()}`;
    if (!index[key]) index[key] = [];
    index[key].push(ev);
  }
  return index;
}

export function dateKeyFromParts(year: number, month: number, day: number): string {
  return `${year}-${month}-${day}`;
}

export function monthsSpanningTransaction(startDate: Date): Date[] {
  const first = dayToDate(startDate, 1);
  const last = dayToDate(startDate, TOTAL_DAYS);
  const startMonth = new Date(first.getFullYear(), first.getMonth(), 1);
  const endMonth = new Date(last.getFullYear(), last.getMonth(), 1);
  const out: Date[] = [];
  const cursor = new Date(startMonth);
  while (cursor <= endMonth) {
    out.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return out;
}

export function monthKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

/** Hard gates (`gate: true`) apply to every party and always appear, regardless of party filter. */
export function eventMatchesRoleFilter(event: CalendarEvent, filter: RoleFilter): boolean {
  if (event.gate) return true;
  if (filter === "all") return true;
  return event.role === filter;
}

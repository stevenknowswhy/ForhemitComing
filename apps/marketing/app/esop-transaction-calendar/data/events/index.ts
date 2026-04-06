import type { CalendarEvent } from "../../types";
import { primaryCalendarEvents } from "./primaryCalendarEvents";
import { secondaryCalendarEvents } from "./secondaryCalendarEvents";
import { twoLenderCalendarEvents } from "./twoLenderCalendarEvents";

export const CALENDAR_EVENTS: CalendarEvent[] = [
  ...primaryCalendarEvents,
  ...secondaryCalendarEvents,
  ...twoLenderCalendarEvents,
];

export { primaryCalendarEvents, secondaryCalendarEvents, twoLenderCalendarEvents };

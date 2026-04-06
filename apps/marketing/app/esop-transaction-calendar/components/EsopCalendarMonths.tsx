"use client";

import type { MutableRefObject } from "react";
import { cn } from "@/lib/utils";
import { DAY_NAMES, MAX_VISIBLE_EVENTS, MONTH_NAMES, TOTAL_DAYS } from "../constants";
import { GATES } from "../data/gates";
import { ROLE_META } from "../data/roleMeta";
import type { EventIndex } from "../lib/calendarHelpers";
import {
  dateKeyFromParts,
  dateToDay,
  eventMatchesRoleFilter,
  isToday,
  monthKey,
  phaseOf,
} from "../lib/calendarHelpers";
import type { CalendarEvent, RoleFilter } from "../types";

type Props = {
  months: Date[];
  startDate: Date;
  eventIndex: EventIndex;
  roleFilter: RoleFilter;
  monthEls: MutableRefObject<Record<string, HTMLDivElement | null>>;
  onOpenEvent: (ev: CalendarEvent) => void;
  onOpenDay: (dayNum: number) => void;
};

export function EsopCalendarMonths({
  months,
  startDate,
  eventIndex,
  roleFilter,
  monthEls,
  onOpenEvent,
  onOpenDay,
}: Props) {
  return (
    <div className="etc-calendar-wrap">
      {months.map((monthStart) => {
        const year = monthStart.getFullYear();
        const month = monthStart.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDow = monthStart.getDay();
        const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;
        const mk = monthKey(monthStart);
        const cells: React.ReactNode[] = [];

        for (let i = 0; i < totalCells; i++) {
          const dayOfMonth = i - firstDow + 1;
          if (dayOfMonth < 1 || dayOfMonth > daysInMonth) {
            const adjDate = new Date(year, month, dayOfMonth);
            cells.push(
              <div key={`o-${i}`} className="etc-cal-cell etc-cal-cell--outside">
                <div className="etc-cc-top">
                  <span className="etc-cc-num">{adjDate.getDate()}</span>
                </div>
              </div>,
            );
            continue;
          }

          const cellDate = new Date(year, month, dayOfMonth);
          const transDay = dateToDay(startDate, cellDate);
          const key = dateKeyFromParts(year, month, dayOfMonth);
          const raw = eventIndex[key] ?? [];
          const dayEvents = raw.filter((e) => eventMatchesRoleFilter(e, roleFilter));
          const ph = transDay >= 1 && transDay <= TOTAL_DAYS ? phaseOf(transDay) : null;
          const gateDay = GATES[transDay];
          const hasEv = dayEvents.length > 0;
          const visible = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
          const overflow = dayEvents.length - MAX_VISIBLE_EVENTS;

          cells.push(
            <div
              key={key}
              className={cn(
                "etc-cal-cell",
                hasEv && "etc-cal-cell--has-events",
                isToday(cellDate) && "etc-cal-cell--today",
              )}
            >
              {ph ? <div className="etc-cc-phase-stripe" style={{ background: ph.color }} /> : null}
              {gateDay ? <div className="etc-cc-gate-diamond" aria-hidden /> : null}
              <div className="etc-cc-top">
                <span className="etc-cc-num">{dayOfMonth}</span>
                {transDay >= 1 && transDay <= TOTAL_DAYS ? (
                  <span
                    className="etc-cc-day-badge"
                    style={{
                      background: ph ? `${ph.color}18` : "transparent",
                      color: ph ? ph.color : "#7A7068",
                    }}
                  >
                    D{transDay}
                  </span>
                ) : null}
              </div>
              <div className="etc-cc-events">
                {visible.map((ev) => {
                  const rm = ROLE_META[ev.role];
                  const borderColor = ev.gate ? "#7A2020" : rm.color;
                  const bg = ev.gate ? "rgba(122,32,32,0.08)" : rm.bg;
                  const txt = ev.gate ? "#7A2020" : rm.color;
                  return (
                    <button
                      key={`${ev.day}-${ev.role}-${ev.title}`}
                      type="button"
                      className={cn(
                        "etc-cc-ev",
                        ev.gate && "etc-cc-ev--gate",
                        ev.twoLender && "etc-cc-ev--2l",
                      )}
                      style={{ borderColor, background: bg }}
                      onClick={() => onOpenEvent(ev)}
                    >
                      <span className="etc-cc-ev-text" style={{ color: txt }}>
                        {ev.short}
                      </span>
                      {ev.tags && ev.tags.length > 0 ? (
                        <span className="etc-cc-ev-tags">
                          {ev.tags.map((t) => (
                            <span
                              key={t}
                              className="etc-cc-ev-tag"
                              style={{ background: ROLE_META[t].color }}
                              title={ROLE_META[t].label}
                            />
                          ))}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
                {overflow > 0 ? (
                  <button type="button" className="etc-cc-more" onClick={() => onOpenDay(transDay)}>
                    +{overflow} more
                  </button>
                ) : null}
              </div>
            </div>,
          );
        }

        return (
          <div
            key={mk}
            ref={(el) => {
              monthEls.current[mk] = el;
            }}
            className="etc-cal-month"
            data-month-key={mk}
          >
            <div className="etc-cal-month-header">
              <span className="etc-cmh-name">{MONTH_NAMES[month]}</span>
              <span className="etc-cmh-year">{year}</span>
            </div>
            <div className="etc-cal-weekdays">
              {DAY_NAMES.map((d) => (
                <div key={d} className="etc-cal-wd">
                  {d}
                </div>
              ))}
            </div>
            <div className="etc-cal-grid">{cells}</div>
          </div>
        );
      })}
    </div>
  );
}

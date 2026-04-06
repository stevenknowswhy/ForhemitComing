"use client";

import { Cormorant_Garamond, Jost } from "next/font/google";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { MONTH_NAMES, PHASES, TOTAL_DAYS } from "./constants";
import { CALENDAR_EVENTS } from "./data/events";
import { GATES } from "./data/gates";
import { ROLE_META } from "./data/roleMeta";
import {
  buildEventIndex,
  countEventsForRole,
  dayToDate,
  eventMatchesRoleFilter,
  filterEventsForCalendar,
  formatCalendarDate,
  monthKey,
  monthsSpanningTransaction,
  phaseOf,
  rolesForTierChips,
  stripTime,
} from "./lib/calendarHelpers";
import type {
  CalendarEvent,
  CalendarRole,
  EsopTransactionCalendarProps,
  PartyTier,
  RoleFilter,
} from "./types";
import { EsopCalendarDetailPanel } from "./components/EsopCalendarDetailPanel";
import { EsopCalendarMonths } from "./components/EsopCalendarMonths";
import "./styles/esop-transaction-calendar.css";

const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-etc-display",
  display: "swap",
});

const fontBody = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-etc-body",
  display: "swap",
});

function tomorrowLocal(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return stripTime(d);
}

function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type DetailState =
  | { kind: "closed" }
  | { kind: "event"; event: CalendarEvent }
  | { kind: "day"; dayNum: number };

function EventCard({ ev, index }: { ev: CalendarEvent; index: number }) {
  const rm = ROLE_META[ev.role];
  const borderColor = ev.gate ? "#7A2020" : rm.color;
  const bg = ev.gate ? "rgba(122,32,32,0.06)" : rm.bg;
  return (
    <div
      className={cn("etc-dp-event", ev.twoLender && "etc-dp-event--2l")}
      style={{
        borderColor,
        background: bg,
        animationDelay: `${index * 0.04}s`,
      }}
    >
      <div className="etc-dpe-header">
        <span className="etc-dpe-dot" style={{ background: rm.color }} />
        <span className="etc-dpe-role" style={{ color: rm.color }}>
          {rm.label}
        </span>
        <span className="etc-dpe-type">{ev.type}</span>
        {ev.twoLender ? <span className="etc-dpe-2l">Two-lender</span> : null}
      </div>
      <div className="etc-dpe-title">{ev.title}</div>
      <div className="etc-dpe-desc">{ev.desc}</div>
      {ev.tags && ev.tags.length > 0 ? (
        <div className="etc-dpe-tags">
          {ev.tags.map((t) => {
            const tm = ROLE_META[t];
            return (
              <span
                key={t}
                className="etc-dpe-ptag"
                style={{ color: tm.color, borderColor: tm.bd, background: tm.bg }}
              >
                <span className="etc-dpe-ptag-dot" style={{ background: tm.color }} aria-hidden />
                {tm.label}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function EsopTransactionCalendar({
  className,
  variant = "embedded",
  defaultStartDate,
  showBrandHeader = true,
  ariaLabelledBy,
}: EsopTransactionCalendarProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState<Date | null>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [partyTier, setPartyTier] = useState<PartyTier>("primary");
  const [twoLenderOn, setTwoLenderOn] = useState(false);
  const [detail, setDetail] = useState<DetailState>({ kind: "closed" });
  const monthEls = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const d = defaultStartDate ? stripTime(new Date(defaultStartDate)) : tomorrowLocal();
    setStartDate(d);
    setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  }, [defaultStartDate]);

  useLayoutEffect(() => {
    if (!viewMonth) return;
    const key = monthKey(viewMonth);
    const el = monthEls.current[key];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [viewMonth]);

  useEffect(() => {
    if (detail.kind === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetail({ kind: "closed" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail.kind]);

  const visibleCalendarEvents = useMemo(
    () => filterEventsForCalendar(CALENDAR_EVENTS, partyTier, twoLenderOn),
    [partyTier, twoLenderOn],
  );

  useEffect(() => {
    setRoleFilter((prev) => {
      if (prev === "all") return prev;
      const allowed = new Set(rolesForTierChips(partyTier, twoLenderOn));
      return allowed.has(prev) ? prev : "all";
    });
  }, [partyTier, twoLenderOn]);

  const eventIndex = useMemo(() => {
    if (!startDate) return {};
    return buildEventIndex(visibleCalendarEvents, startDate);
  }, [startDate, visibleCalendarEvents]);

  const openEvent = useCallback((ev: CalendarEvent) => {
    setDetail({ kind: "event", event: ev });
  }, []);

  const openDay = useCallback(
    (dayNum: number) => {
      const list = visibleCalendarEvents.filter(
        (e) => e.day === dayNum && eventMatchesRoleFilter(e, roleFilter),
      );
      if (list.length === 0) return;
      if (list.length === 1) {
        setDetail({ kind: "event", event: list[0] });
        return;
      }
      setDetail({ kind: "day", dayNum });
    },
    [roleFilter, visibleCalendarEvents],
  );

  const closeDetail = useCallback(() => setDetail({ kind: "closed" }), []);

  const onStartDateChange = useCallback((ymd: string) => {
    const d = new Date(`${ymd}T00:00:00`);
    setStartDate(d);
    setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  }, []);

  const goPrevMonth = useCallback(() => {
    setViewMonth((vm) => {
      if (!vm) return vm;
      const n = new Date(vm);
      n.setMonth(n.getMonth() - 1);
      return n;
    });
  }, []);

  const goNextMonth = useCallback(() => {
    setViewMonth((vm) => {
      if (!vm) return vm;
      const n = new Date(vm);
      n.setMonth(n.getMonth() + 1);
      return n;
    });
  }, []);

  const goTodayNav = useCallback(() => {
    const t = new Date();
    setViewMonth(new Date(t.getFullYear(), t.getMonth(), 1));
  }, []);

  const jumpToPhase = useCallback(
    (phaseStartDay: number) => {
      if (!startDate) return;
      const target = dayToDate(startDate, phaseStartDay);
      setViewMonth(new Date(target.getFullYear(), target.getMonth(), 1));
      setTimeout(() => {
        const key = monthKey(new Date(target.getFullYear(), target.getMonth(), 1));
        monthEls.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    },
    [startDate],
  );

  const months = useMemo(() => {
    if (!startDate) return [];
    return monthsSpanningTransaction(startDate);
  }, [startDate]);

  const detailView = useMemo(() => {
    if (detail.kind === "closed" || !startDate) {
      return { open: false, dateLabel: "", title: "", phaseTag: null, body: null as ReactNode };
    }
    if (detail.kind === "event") {
      const ev = detail.event;
      const calDate = dayToDate(startDate, ev.day);
      const ph = phaseOf(ev.day);
      const sameDay = visibleCalendarEvents.filter(
        (e) => e.day === ev.day && e !== ev && eventMatchesRoleFilter(e, roleFilter),
      );
      const gateBlock =
        ev.gate && GATES[ev.day] ? (
          <div className="etc-dp-gate-box">
            <div className="etc-dpg-label">⬥ Hard Gate — Process Stops If Not Cleared</div>
            <div className="etc-dpg-title">{GATES[ev.day].name}</div>
            <div className="etc-dpg-desc">{GATES[ev.day].desc}</div>
          </div>
        ) : null;
      const rest =
        sameDay.length > 0 ? (
          <>
            <div className="etc-dp-divider">Also on Day {ev.day}</div>
            {sameDay.map((e, i) => (
              <EventCard key={`${e.day}-${e.role}-${e.title}`} ev={e} index={i + 1} />
            ))}
          </>
        ) : null;
      return {
        open: true,
        dateLabel: `Day ${ev.day} of ${TOTAL_DAYS} — ${formatCalendarDate(calDate)}`,
        title: ev.title,
        phaseTag: ph ? { label: ph.label, color: ph.color } : null,
        body: (
          <>
            {gateBlock}
            <EventCard ev={ev} index={0} />
            {rest}
          </>
        ),
      };
    }
    const dayNum = detail.dayNum;
    const list = visibleCalendarEvents.filter(
      (e) => e.day === dayNum && eventMatchesRoleFilter(e, roleFilter),
    );
    const calDate = dayToDate(startDate, dayNum);
    const ph = phaseOf(dayNum);
    const gateBox = GATES[dayNum] ? (
      <div className="etc-dp-gate-box">
        <div className="etc-dpg-label">⬥ Hard Gate</div>
        <div className="etc-dpg-title">{GATES[dayNum].name}</div>
        <div className="etc-dpg-desc">{GATES[dayNum].desc}</div>
      </div>
    ) : null;
    return {
      open: true,
      dateLabel: `Day ${dayNum} of ${TOTAL_DAYS} — ${formatCalendarDate(calDate)}`,
      title: `${list.length} Events`,
      phaseTag: ph ? { label: ph.label, color: ph.color } : null,
      body: (
        <>
          {gateBox}
          {list.map((e, i) => (
            <EventCard key={`${e.day}-${e.role}-${e.title}`} ev={e} index={i} />
          ))}
        </>
      ),
    };
  }, [detail, startDate, roleFilter, visibleCalendarEvents]);

  if (!startDate || !viewMonth) {
    return (
      <div
        className={cn(
          fontDisplay.variable,
          fontBody.variable,
          "etc-root",
          variant === "embedded" ? "etc-root--embedded" : "etc-root--standalone",
          "etc-skeleton",
          className,
        )}
        aria-busy
        aria-label="Loading calendar"
      />
    );
  }

  return (
    <div
      className={cn(
        fontDisplay.variable,
        fontBody.variable,
        "etc-root",
        variant === "embedded" ? "etc-root--embedded" : "etc-root--standalone",
        className,
      )}
      aria-labelledby={ariaLabelledBy}
      data-etc-calendar
    >
      {showBrandHeader ? (
        <header className="etc-header">
          <div className="etc-header-left">
            <span className="etc-header-logo">Forhemit</span>
            <span className="etc-header-subtitle">120-Day ESOP Transaction Calendar</span>
          </div>
          <div className="etc-header-nav">
            <button type="button" className="etc-nav-arrow" onClick={goPrevMonth} aria-label="Previous month">
              ‹
            </button>
            <span className="etc-nav-month-label">
              {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </span>
            <button type="button" className="etc-nav-arrow" onClick={goNextMonth} aria-label="Next month">
              ›
            </button>
            <button type="button" className="etc-nav-today" onClick={goTodayNav}>
              Today
            </button>
          </div>
        </header>
      ) : (
        <header className="etc-header">
          <div className="etc-header-left" />
          <div className="etc-header-nav">
            <button type="button" className="etc-nav-arrow" onClick={goPrevMonth} aria-label="Previous month">
              ‹
            </button>
            <span className="etc-nav-month-label">
              {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </span>
            <button type="button" className="etc-nav-arrow" onClick={goNextMonth} aria-label="Next month">
              ›
            </button>
            <button type="button" className="etc-nav-today" onClick={goTodayNav}>
              Today
            </button>
          </div>
        </header>
      )}

      <div className="etc-controls">
        <div className="etc-controls__row etc-controls__row--main">
          <div className="etc-start-date">
            <label htmlFor="etc-start-date-input">Day 1 =</label>
            <input
              id="etc-start-date-input"
              type="date"
              value={toYmd(startDate)}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
          <span className="etc-ctrl-sep" aria-hidden />
          <div className="etc-party-tier" role="group" aria-label="Primary or secondary parties">
            <button
              type="button"
              className={cn("etc-tier-btn", partyTier === "primary" && "etc-tier-btn--on")}
              onClick={() => setPartyTier("primary")}
              aria-pressed={partyTier === "primary"}
            >
              Primary
            </button>
            <button
              type="button"
              className={cn("etc-tier-btn", partyTier === "secondary" && "etc-tier-btn--on")}
              onClick={() => setPartyTier("secondary")}
              aria-pressed={partyTier === "secondary"}
            >
              Secondary
            </button>
          </div>
          <span className="etc-ctrl-sep" aria-hidden />
          <div
            className="etc-role-chips"
            role="group"
            aria-label={partyTier === "primary" ? "Filter by primary party" : "Filter by secondary party"}
          >
            <button
              type="button"
              className={cn(
                "etc-role-chip",
                "etc-role-chip--all",
                roleFilter === "all" && "etc-role-chip--selected",
              )}
              onClick={() => setRoleFilter("all")}
              aria-pressed={roleFilter === "all"}
            >
              <span className="etc-rc-label">All parties</span>
            </button>
            {rolesForTierChips(partyTier, twoLenderOn).map((role) => {
              const rm = ROLE_META[role];
              const selected = roleFilter === role;
              const cnt = countEventsForRole(CALENDAR_EVENTS, role, partyTier, twoLenderOn);
              return (
                <button
                  key={role}
                  type="button"
                  className={cn("etc-role-chip", selected && "etc-role-chip--selected")}
                  style={{ color: rm.color }}
                  onClick={() => setRoleFilter(role)}
                  aria-pressed={selected}
                >
                  <span className="etc-rc-dot" style={{ background: rm.color }} />
                  <span className="etc-rc-label">{rm.label}</span>
                  <span className="etc-rc-count">{cnt}</span>
                </button>
              );
            })}
          </div>
          <div className="etc-two-lender">
            <span className="etc-two-lender-label" id="etc-two-lender-label">
              Two-lender deal
            </span>
            <button
              type="button"
              className={cn("etc-two-lender-switch", twoLenderOn && "etc-two-lender-switch--on")}
              onClick={() => setTwoLenderOn((v) => !v)}
              aria-labelledby="etc-two-lender-label"
              aria-pressed={twoLenderOn}
            />
          </div>
        </div>
        <div className="etc-controls__row etc-controls__row--phases" role="group" aria-label="Jump to phase">
          <span className="etc-ctrl-label etc-ctrl-label--inline">Phases</span>
          <div className="etc-phase-chips">
            {PHASES.map((p) => (
              <button
                key={p.id}
                type="button"
                className="etc-phase-chip"
                style={{ background: p.color }}
                onClick={() => jumpToPhase(p.start)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <EsopCalendarMonths
        months={months}
        startDate={startDate}
        eventIndex={eventIndex}
        roleFilter={roleFilter}
        monthEls={monthEls}
        onOpenEvent={openEvent}
        onOpenDay={openDay}
      />

      <EsopCalendarDetailPanel
        isOpen={detailView.open}
        onClose={closeDetail}
        dateLabel={detailView.dateLabel}
        title={detailView.title}
        phaseTag={detailView.phaseTag}
      >
        {detailView.body}
      </EsopCalendarDetailPanel>
    </div>
  );
}

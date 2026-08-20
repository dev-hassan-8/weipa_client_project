import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAY_KEYS, DayKey, WorkingHoursSchedule, DEFAULT_WORKING_HOURS, normalizeSchedule } from '@/lib/workingHours';
import { BRISBANE_TZ, parseBrisbaneDateTime } from '@/lib/brisbaneTime';

export { brisbaneTodayYmd } from '@/lib/brisbaneTime';

export type ScheduleKind = 'confirmed' | 'manual' | 'calendar';

export type ScheduleItem = {
  id: string;
  kind: ScheduleKind;
  title: string;
  subtitle?: string;
  date: string;
  startMin: number;
  endMin: number;
};

const HOUR_PX = 56;
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const KIND_COLORS: Record<ScheduleKind, { bg: string; border: string; text: string }> = {
  confirmed: { bg: 'rgba(10, 115, 255, 0.88)', border: '#60a5fa', text: '#fff' },
  manual: { bg: 'rgba(16, 185, 129, 0.88)', border: '#34d399', text: '#fff' },
  calendar: { bg: 'rgba(139, 92, 246, 0.88)', border: '#c4b5fd', text: '#fff' },
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function ymdFromParts(y: number, m: number, d: number) {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function parseYmd(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  return { y, m, d, date: new Date(y, m - 1, d, 12, 0, 0) };
}

export function addDays(ymd: string, days: number) {
  const { date } = parseYmd(ymd);
  date.setDate(date.getDate() + days);
  return ymdFromParts(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function mondayOfWeek(ymd: string) {
  const { date } = parseYmd(ymd);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return ymdFromParts(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function weekDays(monday: string) {
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function hhmmToMinutes(hhmm: string) {
  const [h, m] = String(hhmm || '00:00').split(':');
  return (parseInt(h, 10) || 0) * 60 + (parseInt(m, 10) || 0);
}

export function parseClockToMinutes(label: string): number | null {
  const m = String(label || '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const period = m[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

export function bookingMinutes(timeLabel: string, durationHours?: number | string | null) {
  const raw = String(timeLabel || '').trim();
  const range = raw.match(/^(.+?)\s*[–-]\s*(.+)$/);
  if (range) {
    const start = parseClockToMinutes(range[1].trim());
    const end = parseClockToMinutes(range[2].trim());
    if (start != null && end != null) {
      return { startMin: start, endMin: end > start ? end : start + 60 };
    }
  }
  const start = parseClockToMinutes(raw);
  if (start == null) return null;
  const hours = Number(durationHours);
  const mins = Number.isFinite(hours) && hours > 0 ? hours * 60 : 60;
  return { startMin: start, endMin: start + mins };
}

export function parseSqlLocal(value: string | null | undefined) {
  return parseBrisbaneDateTime(value);
}

export function minutesOnDay(dt: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BRISBANE_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(dt);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value || 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value || 0);
  return hour * 60 + minute;
}

export function ymdOf(dt: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BRISBANE_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dt);
}

function formatHourLabel(mins: number) {
  const h = Math.floor(mins / 60);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12} ${period}`;
}

function dayKeyForYmd(ymd: string): DayKey {
  const { date } = parseYmd(ymd);
  return DAY_KEYS[date.getDay()];
}

function clipToHours(startMin: number, endMin: number, openMin: number, closeMin: number) {
  const start = Math.max(startMin, openMin);
  const end = Math.min(endMin, closeMin);
  if (end - start < 10) return null;
  return { startMin: start, endMin: end };
}

type LaidOut = ScheduleItem & { col: number; colCount: number };

function packOverlaps(items: ScheduleItem[]): LaidOut[] {
  const sorted = [...items].sort((a, b) => a.startMin - b.startMin || b.endMin - a.endMin);
  const laid: LaidOut[] = [];
  let cluster: LaidOut[] = [];
  let clusterEnd = -1;
  const colEnds: number[] = [];

  const flush = () => {
    const n = cluster.length ? Math.max(...cluster.map((e) => e.col)) + 1 : 1;
    cluster.forEach((e) => {
      e.colCount = n;
    });
    laid.push(...cluster);
    cluster = [];
  };

  for (const ev of sorted) {
    if (cluster.length && ev.startMin >= clusterEnd) {
      flush();
      colEnds.length = 0;
      clusterEnd = -1;
    }
    let col = 0;
    while (col < colEnds.length && colEnds[col] > ev.startMin) col += 1;
    if (col === colEnds.length) colEnds.push(ev.endMin);
    else colEnds[col] = ev.endMin;
    clusterEnd = Math.max(clusterEnd, ev.endMin);
    cluster.push({ ...ev, col, colCount: 1 });
  }
  if (cluster.length) flush();
  return laid;
}

function weekTitle(monday: string) {
  const sunday = addDays(monday, 6);
  const start = parseYmd(monday).date;
  const end = parseYmd(sunday).date;
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = start.toLocaleDateString('en-AU', { day: 'numeric', month: sameMonth ? undefined : 'short' });
  const endLabel = end.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${startLabel} – ${endLabel}`;
}

type Props = {
  monday: string;
  todayYmd: string;
  schedule: WorkingHoursSchedule;
  items: ScheduleItem[];
  loading?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onSelect: (item: ScheduleItem) => void;
};

export default function WeekSchedule({
  monday,
  todayYmd,
  schedule,
  items,
  loading,
  onPrev,
  onNext,
  onToday,
  onSelect,
}: Props) {
  const hours = useMemo(() => normalizeSchedule(schedule || DEFAULT_WORKING_HOURS), [schedule]);
  const days = useMemo(() => weekDays(monday), [monday]);

  const { gridStart, gridEnd } = useMemo(() => {
    let start = 24 * 60;
    let end = 0;
    for (const key of DAY_KEYS) {
      const row = hours[key];
      const open = hhmmToMinutes(row.opens);
      const close = hhmmToMinutes(row.closes);
      start = Math.min(start, open);
      end = Math.max(end, close);
    }
    if (start >= end) {
      start = 8 * 60;
      end = 17 * 60;
    }
    start = Math.floor(start / 60) * 60;
    end = Math.ceil(end / 60) * 60;
    return { gridStart: start, gridEnd: end };
  }, [hours]);

  const hourMarks = useMemo(() => {
    const marks: number[] = [];
    for (let m = gridStart; m < gridEnd; m += 60) marks.push(m);
    return marks;
  }, [gridStart, gridEnd]);

  const gridHeight = ((gridEnd - gridStart) / 60) * HOUR_PX;

  const byDay = useMemo(() => {
    const map: Record<string, LaidOut[]> = {};
    for (const ymd of days) {
      const key = dayKeyForYmd(ymd);
      const row = hours[key];
      if (row.closed) {
        map[ymd] = [];
        continue;
      }
      const openMin = hhmmToMinutes(row.opens);
      const closeMin = hhmmToMinutes(row.closes);
      const clipped: ScheduleItem[] = [];
      for (const item of items) {
        if (item.date !== ymd) continue;
        const vis = clipToHours(item.startMin, item.endMin, Math.max(openMin, gridStart), Math.min(closeMin, gridEnd));
        if (!vis) continue;
        clipped.push({ ...item, ...vis });
      }
      map[ymd] = packOverlaps(clipped);
    }
    return map;
  }, [days, hours, items, gridStart, gridEnd]);

  const nowTop = useMemo(() => {
    if (!days.includes(todayYmd)) return null;
    const now = new Date();
    const mins = minutesOnDay(now);
    if (mins < gridStart || mins > gridEnd) return null;
    return ((mins - gridStart) / 60) * HOUR_PX;
  }, [days, todayYmd, gridStart, gridEnd]);

  const formatEventTime = (startMin: number, endMin: number) => {
    const fmt = (m: number) => {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const period = h >= 12 ? 'pm' : 'am';
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return min === 0 ? `${h12}${period}` : `${h12}:${pad2(min)}${period}`;
    };
    return `${fmt(startMin)} – ${fmt(endMin)}`;
  };

  return (
    <div className="gc-wrap">
      <div className="gc-toolbar">
        <div className="gc-toolbar-left">
          <button type="button" className="gc-nav-btn" onClick={onToday}>Today</button>
          <button type="button" className="gc-icon-btn" onClick={onPrev} title="Previous week">
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="gc-icon-btn" onClick={onNext} title="Next week">
            <ChevronRight size={18} />
          </button>
          <h3 className="gc-title">{weekTitle(monday)}</h3>
        </div>
        <div className="gc-legend">
          <span><i style={{ background: KIND_COLORS.confirmed.bg }} /> Confirmed</span>
          <span><i style={{ background: KIND_COLORS.manual.bg }} /> Manual</span>
          <span><i style={{ background: KIND_COLORS.calendar.bg }} /> Calendar</span>
        </div>
      </div>

      <div className="gc-scroll">
        <div className="gc-head">
          <div className="gc-gutter" />
          {days.map((ymd, i) => {
            const { d } = parseYmd(ymd);
            const isToday = ymd === todayYmd;
            const closed = hours[dayKeyForYmd(ymd)].closed;
            return (
              <div key={ymd} className={`gc-day-head${isToday ? ' is-today' : ''}${closed ? ' is-closed' : ''}`}>
                <div className="gc-dow">{WEEKDAY_LABELS[i]}</div>
                <div className={`gc-dom${isToday ? ' is-today' : ''}`}>{d}</div>
              </div>
            );
          })}
        </div>

        <div className="gc-body" style={{ height: gridHeight }}>
          <div className="gc-gutter">
            {hourMarks.map((mins) => (
              <div key={mins} className="gc-hour-label" style={{ top: ((mins - gridStart) / 60) * HOUR_PX }}>
                {formatHourLabel(mins)}
              </div>
            ))}
          </div>

          {days.map((ymd) => {
            const key = dayKeyForYmd(ymd);
            const row = hours[key];
            const closed = row.closed;
            const openMin = hhmmToMinutes(row.opens);
            const closeMin = hhmmToMinutes(row.closes);
            const events = byDay[ymd] || [];
            return (
              <div key={ymd} className={`gc-day${closed ? ' is-closed' : ''}${ymd === todayYmd ? ' is-today' : ''}`}>
                {hourMarks.map((mins) => (
                  <div
                    key={mins}
                    className="gc-hour-line"
                    style={{ top: ((mins - gridStart) / 60) * HOUR_PX }}
                  />
                ))}
                {!closed && openMin > gridStart && (
                  <div
                    className="gc-out-hours"
                    style={{ top: 0, height: ((openMin - gridStart) / 60) * HOUR_PX }}
                  />
                )}
                {!closed && closeMin < gridEnd && (
                  <div
                    className="gc-out-hours"
                    style={{
                      top: ((closeMin - gridStart) / 60) * HOUR_PX,
                      height: ((gridEnd - closeMin) / 60) * HOUR_PX,
                    }}
                  />
                )}
                {closed && <div className="gc-out-hours" style={{ top: 0, height: '100%' }} />}
                {ymd === todayYmd && nowTop != null && (
                  <div className="gc-now" style={{ top: nowTop }}>
                    <span />
                  </div>
                )}
                {events.map((ev) => {
                  const top = ((ev.startMin - gridStart) / 60) * HOUR_PX;
                  const height = Math.max(22, ((ev.endMin - ev.startMin) / 60) * HOUR_PX - 2);
                  const widthPct = 100 / ev.colCount;
                  const leftPct = ev.col * widthPct;
                  const color = KIND_COLORS[ev.kind];
                  return (
                    <button
                      key={`${ev.kind}-${ev.id}-${ev.startMin}`}
                      type="button"
                      className="gc-event"
                      title={`${ev.title}${ev.subtitle ? ` · ${ev.subtitle}` : ''}`}
                      style={{
                        top,
                        height,
                        left: `calc(${leftPct}% + 3px)`,
                        width: `calc(${widthPct}% - 6px)`,
                        background: color.bg,
                        borderLeftColor: color.border,
                        color: color.text,
                      }}
                      onClick={() => onSelect(ev)}
                    >
                      <div className="gc-event-title">{ev.title}</div>
                      <div className="gc-event-time">{formatEventTime(ev.startMin, ev.endMin)}</div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {loading && <div className="gc-loading">Updating week…</div>}

      <style>{`
        .gc-wrap {
          background: #0b1118;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        .gc-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.9rem 1.15rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          flex-wrap: wrap;
        }
        .gc-toolbar-left {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          min-width: 0;
        }
        .gc-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          color: #fff;
          margin: 0 0 0 0.4rem;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .gc-nav-btn, .gc-icon-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
        }
        .gc-nav-btn {
          padding: 0.35rem 0.8rem;
          font-size: 0.82rem;
          font-weight: 600;
        }
        .gc-icon-btn {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .gc-nav-btn:hover, .gc-icon-btn:hover { border-color: #0a73ff; color: #fff; }
        .gc-legend {
          display: flex;
          gap: 0.9rem;
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .gc-legend span { display: inline-flex; align-items: center; gap: 0.35rem; }
        .gc-legend i {
          width: 10px;
          height: 10px;
          border-radius: 3px;
          display: inline-block;
        }
        .gc-scroll { overflow-x: auto; }
        .gc-head, .gc-body {
          display: grid;
          grid-template-columns: 64px repeat(7, minmax(110px, 1fr));
          min-width: 920px;
        }
        .gc-head {
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background: #0b1118;
          position: sticky;
          top: 0;
          z-index: 2;
        }
        .gc-gutter { position: relative; }
        .gc-day-head {
          text-align: center;
          padding: 0.65rem 0.4rem 0.75rem;
          border-left: 1px solid rgba(255,255,255,0.06);
        }
        .gc-day-head.is-closed { opacity: 0.55; }
        .gc-dow {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
        }
        .gc-day-head.is-today .gc-dow { color: #0a73ff; }
        .gc-dom {
          margin: 0.25rem auto 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #fff;
        }
        .gc-dom.is-today { background: #0a73ff; }
        .gc-body { position: relative; }
        .gc-hour-label {
          position: absolute;
          right: 8px;
          transform: translateY(-50%);
          font-size: 0.68rem;
          color: #64748b;
          font-weight: 600;
        }
        .gc-day {
          position: relative;
          border-left: 1px solid rgba(255,255,255,0.06);
          background: #0b1118;
        }
        .gc-day.is-today { background: rgba(10, 115, 255, 0.04); }
        .gc-hour-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }
        .gc-out-hours {
          position: absolute;
          left: 0;
          right: 0;
          background: repeating-linear-gradient(
            -45deg,
            rgba(255,255,255,0.015),
            rgba(255,255,255,0.015) 8px,
            rgba(0,0,0,0.18) 8px,
            rgba(0,0,0,0.18) 16px
          );
          pointer-events: none;
        }
        .gc-now {
          position: absolute;
          left: 0;
          right: 0;
          height: 0;
          border-top: 2px solid #ea4335;
          z-index: 3;
          pointer-events: none;
        }
        .gc-now span {
          position: absolute;
          left: -5px;
          top: -5px;
          width: 10px;
          height: 10px;
          background: #ea4335;
          border-radius: 50%;
        }
        .gc-event {
          position: absolute;
          z-index: 2;
          border: none;
          border-left: 3px solid;
          border-radius: 4px;
          padding: 0.2rem 0.4rem;
          overflow: hidden;
          cursor: pointer;
          text-align: left;
          box-shadow: 0 1px 2px rgba(0,0,0,0.25);
        }
        .gc-event:hover { filter: brightness(1.08); z-index: 4; }
        .gc-event-title {
          font-size: 0.75rem;
          font-weight: 700;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .gc-event-time {
          font-size: 0.68rem;
          opacity: 0.9;
          margin-top: 0.1rem;
        }
        .gc-loading {
          padding: 0.55rem 1.15rem;
          font-size: 0.78rem;
          color: #64748b;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>
    </div>
  );
}

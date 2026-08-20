import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Calendar, Inbox, DollarSign, ArrowRight, Eye } from 'lucide-react';
import { formatBrisbaneDateTime } from '@/lib/brisbaneTime';
import { useIntakeStore } from '@/lib/useIntakeStore';
import WeekSchedule, {
  ScheduleItem,
  addDays,
  bookingMinutes,
  brisbaneTodayYmd,
  mondayOfWeek,
  parseSqlLocal,
  minutesOnDay,
  ymdOf,
  weekDays,
} from '@/components/WeekSchedule';
import { DEFAULT_WORKING_HOURS, WorkingHoursSchedule, normalizeSchedule } from '@/lib/workingHours';

interface ConfirmedBookingRow {
  id: string;
  customer_name?: string;
  car_make?: string;
  booking_date: string;
  booking_time: string;
  duration_hours?: number;
  status?: string;
}

interface ManualBookingRow {
  id: string;
  customer_name?: string;
  service_type?: string;
  booking_date: string;
  booking_time: string;
  duration_hours?: number;
  status?: string;
}

interface CalendarEventRow {
  id: number;
  summary?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  status?: string | null;
}

export default function BackofficeDashboardPage() {
  const navigate = useNavigate();
  const { quotes, bookings, enquiries } = useIntakeStore();
  const todayYmd = brisbaneTodayYmd();
  const [monday, setMonday] = useState(() => mondayOfWeek(todayYmd));
  const [hours, setHours] = useState<WorkingHoursSchedule>(DEFAULT_WORKING_HOURS);
  const [calItems, setCalItems] = useState<ScheduleItem[]>([]);
  const [calLoading, setCalLoading] = useState(true);

  const weekYmds = useMemo(() => weekDays(monday), [monday]);
  const weekSet = useMemo(() => new Set(weekYmds), [weekYmds]);
  const sunday = addDays(monday, 6);

  useEffect(() => {
    fetch('/api/working-hours', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.schedule) setHours(normalizeSchedule(data.schedule));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setCalLoading(true);
      try {
        const [confirmedRes, manualRes, eventsRes] = await Promise.all([
          fetch('/api/confirmed-bookings', { credentials: 'include' }),
          fetch('/api/manual-bookings', { credentials: 'include' }),
          fetch(`/api/calendar-events?from=${monday}&to=${sunday}`, { credentials: 'include' }),
        ]);
        const confirmedJson = confirmedRes.ok ? await confirmedRes.json() : [];
        const manualJson = manualRes.ok ? await manualRes.json() : [];
        const eventsJson = eventsRes.ok ? await eventsRes.json() : { items: [] };
        if (cancelled) return;

        const next: ScheduleItem[] = [];
        const confirmed = Array.isArray(confirmedJson) ? confirmedJson as ConfirmedBookingRow[] : [];
        confirmed.forEach((b) => {
          const dateKey = String(b.booking_date || '').slice(0, 10);
          if (!dateKey || !weekSet.has(dateKey)) return;
          if (String(b.status || '').toUpperCase() === 'CANCELLED') return;
          const mins = bookingMinutes(b.booking_time, b.duration_hours);
          if (!mins) return;
          next.push({
            id: b.id,
            kind: 'confirmed',
            title: b.customer_name || 'Confirmed booking',
            subtitle: b.car_make || '',
            date: dateKey,
            startMin: mins.startMin,
            endMin: mins.endMin,
          });
        });

        const manuals = Array.isArray(manualJson) ? manualJson as ManualBookingRow[] : [];
        manuals.forEach((b) => {
          const dateKey = String(b.booking_date || '').slice(0, 10);
          if (!dateKey || !weekSet.has(dateKey)) return;
          if (String(b.status || '').toUpperCase() === 'CANCELLED') return;
          const mins = bookingMinutes(b.booking_time, b.duration_hours);
          if (!mins) return;
          next.push({
            id: b.id,
            kind: 'manual',
            title: b.customer_name || 'Manual booking',
            subtitle: b.service_type || '',
            date: dateKey,
            startMin: mins.startMin,
            endMin: mins.endMin,
          });
        });

        const events = Array.isArray(eventsJson.items) ? eventsJson.items as CalendarEventRow[] : [];
        events.forEach((ev) => {
          if (String(ev.status || '').toLowerCase() === 'cancelled') return;
          const start = parseSqlLocal(ev.start_time);
          const end = parseSqlLocal(ev.end_time);
          if (!start || !end) return;
          weekYmds.forEach((ymd) => {
            const dayStart = parseSqlLocal(`${ymd} 00:00:00`);
            const dayEnd = parseSqlLocal(`${addDays(ymd, 1)} 00:00:00`);
            if (!dayStart || !dayEnd) return;
            const visStart = start > dayStart ? start : dayStart;
            const visEnd = end < dayEnd ? end : dayEnd;
            if (visEnd <= visStart) return;
            const startMin = ymdOf(visStart) === ymd ? minutesOnDay(visStart) : 0;
            const endMin = visEnd.getTime() >= dayEnd.getTime() ? 24 * 60 : minutesOnDay(visEnd);
            if (endMin <= startMin) return;
            next.push({
              id: String(ev.id),
              kind: 'calendar',
              title: ev.summary || 'Calendar event',
              date: ymd,
              startMin,
              endMin,
            });
          });
        });

        setCalItems(next);
      } catch {
        if (!cancelled) setCalItems([]);
      } finally {
        if (!cancelled) setCalLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [monday, sunday, weekSet, weekYmds]);

  const totalQuotes = quotes.length;
  const newQuotes = quotes.filter((q) => q.status === 'NEW').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
  const unreadEnquiries = enquiries.filter((e) => e.status === 'UNREAD').length;

  const totalPipelineValue = quotes
    .filter((q) => q.status !== 'CANCELLED')
    .reduce((acc, curr) => acc + (curr.estimatedPrice || 0), 0);

  const recentQuotes = quotes.slice(0, 5);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'NEW': return 'b-status-badge b-status-new';
      case 'CONTACTED': return 'b-status-badge b-status-contacted';
      case 'QUOTED': return 'b-status-badge b-status-quoted';
      case 'BOOKED': return 'b-status-badge b-status-booked';
      case 'COMPLETED': return 'b-status-badge b-status-completed';
      case 'CANCELLED': return 'b-status-badge b-status-cancelled';
      default: return 'b-status-badge b-status-completed';
    }
  };

  return (
    <div>
      {/* 1. METRICS OVERVIEW CARDS */}
      <div className="b-stats-grid">
        
        {/* Metric 1 */}
        <div className="b-stat-card">
          <div>
            <div className="b-stat-label">Total Quote Intakes</div>
            <div className="b-stat-number">{totalQuotes}</div>
            <div style={{ fontSize: '0.78rem', color: '#0a73ff', marginTop: '0.4rem', fontWeight: 600 }}>
              {newQuotes} new unread requests
            </div>
          </div>
          <div className="b-stat-icon-wrapper">
            <FileText size={24} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="b-stat-card">
          <div>
            <div className="b-stat-label">Active Bookings</div>
            <div className="b-stat-number">{confirmedBookings}</div>
            <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.4rem', fontWeight: 600 }}>
              Installation Schedule Active
            </div>
          </div>
          <div className="b-stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
            <Calendar size={24} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="b-stat-card">
          <div>
            <div className="b-stat-label">Contact Enquiries</div>
            <div className="b-stat-number">{enquiries.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '0.4rem', fontWeight: 600 }}>
              {unreadEnquiries} pending replies
            </div>
          </div>
          <div className="b-stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' }}>
            <Inbox size={24} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="b-stat-card">
          <div>
            <div className="b-stat-label">Pipeline Value</div>
            <div className="b-stat-number">${totalPipelineValue.toLocaleString()}</div>
            <div style={{ fontSize: '0.78rem', color: '#8b5cf6', marginTop: '0.4rem', fontWeight: 600 }}>
              Active Estimates & Jobs
            </div>
          </div>
          <div className="b-stat-icon-wrapper" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', borderColor: 'rgba(139, 92, 246, 0.3)', color: '#8b5cf6' }}>
            <DollarSign size={24} />
          </div>
        </div>

      </div>

      <WeekSchedule
        monday={monday}
        todayYmd={todayYmd}
        schedule={hours}
        items={calItems}
        loading={calLoading}
        onPrev={() => setMonday((prev) => addDays(prev, -7))}
        onNext={() => setMonday((prev) => addDays(prev, 7))}
        onToday={() => setMonday(mondayOfWeek(todayYmd))}
        onSelect={(item) => {
          if (item.kind === 'calendar') {
            navigate(`/admin/calendar-events?id=${item.id}`);
            return;
          }
          if (item.kind === 'manual') {
            navigate(`/admin/bookings/${item.id}?type=manual`);
            return;
          }
          navigate(`/admin/bookings/${item.id}?type=confirmed`);
        }}
      />

      {/* 2. RECENT QUOTE INTAKES TABLE */}
      <div className="b-table-card">
        <div className="b-table-header">
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff' }}>
              RECENT WEBSITE QUOTE INTAKES
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Latest quote requests received from public website forms.
            </p>
          </div>

          <Link to="/admin/quotes" className="btn-outline-blue" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            VIEW ALL QUOTES ({totalQuotes})
            <ArrowRight size={16} />
          </Link>
        </div>

        <table className="b-table">
          <thead>
            <tr>
              <th>Intake ID</th>
              <th>Customer Name</th>
              <th>Phone / Email</th>
              <th>Vehicle / Details</th>
              <th>Tint Selected</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentQuotes.map((q) => (
              <tr key={q.id}>
                <td style={{ fontWeight: 700, color: '#0a73ff' }}>{q.id}</td>
                <td style={{ fontWeight: 600, color: '#fff' }}>{q.name}</td>
                <td>
                  <div>{q.phone}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{q.email}</div>
                </td>
                <td>{q.carMake} {q.yearModel}</td>
                <td>
                  <span style={{ fontSize: '0.82rem', color: q.tintType.includes('Ceramic') ? '#ffffff' : '#cbd5e1', fontWeight: q.tintType.includes('Ceramic') ? 600 : 400 }}>
                    {q.tintType}
                  </span>
                </td>
                <td>
                  <span className={getStatusBadgeClass(q.status)}>
                    {q.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  {formatBrisbaneDateTime(q.createdAt, { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td>
                  <Link
                    to={`/admin/quotes/${q.id}`}
                    className="b-icon-btn"
                    title="Manage Quote"
                  >
                    <Eye size={15} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarDays, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatBrisbaneDateTime } from '@/lib/brisbaneTime';

interface CalendarEventRow {
  id: number;
  google_event_id: string;
  summary: string | null;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
  updated_at?: string | null;
}

const PAGE_SIZE = 20;

const formatWhen = (value: string | null) => formatBrisbaneDateTime(value);

export default function CalendarEventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<CalendarEventRow[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CalendarEventRow | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const loadPage = useCallback(async (nextPage: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/calendar-events?page=${nextPage}&limit=${PAGE_SIZE}`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load calendar events');
      }
      setItems(Array.isArray(data.items) ? data.items : []);
      setTotal(typeof data.total === 'number' ? data.total : 0);
      setPages(Math.max(1, typeof data.pages === 'number' ? data.pages : 1));
      setPage(typeof data.page === 'number' ? data.page : nextPage);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load calendar events');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (!idParam) return;
    const eventId = Number(idParam);
    if (!Number.isFinite(eventId)) return;
    let cancelled = false;
    fetch(`/api/calendar-events/${eventId}`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((row) => {
        if (!cancelled && row && row.id) setSelected(row);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [searchParams]);

  const closeDetails = () => {
    setSelected(null);
    if (searchParams.get('id')) {
      const next = new URLSearchParams(searchParams);
      next.delete('id');
      setSearchParams(next, { replace: true });
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/calendar-events/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete calendar event.');
        return;
      }
      if (selected?.id === id) setSelected(null);
      if (searchParams.get('id') === String(id)) {
        const next = new URLSearchParams(searchParams);
        next.delete('id');
        setSearchParams(next, { replace: true });
      }
      const nextPage = items.length === 1 && page > 1 ? page - 1 : page;
      await loadPage(nextPage);
    } catch (err) {
      console.error(err);
      alert('Error deleting calendar event.');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const linkStyle: React.CSSProperties = {
    fontWeight: 700,
    color: '#0a73ff',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    textAlign: 'left',
    textDecoration: 'none',
  };

  return (
    <div>
      <div className="b-table-card" style={{ marginBottom: '2rem' }}>
        <div className="b-table-header">
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarDays size={18} color="#0a73ff" /> Calendar Events
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Google Calendar events synced into the site. Newest start times appear first.
            </p>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{total} event{total === 1 ? '' : 's'}</div>
        </div>
      </div>

      <div className="b-table-card">
        {error && (
          <div style={{ padding: '1rem 1.25rem', color: '#f87171' }}>{error}</div>
        )}
        <table className="b-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Google Event ID</th>
              <th style={{ width: '48px' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  Loading calendar events...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No calendar events found.
                </td>
              </tr>
            ) : (
              items.map((event) => (
                <tr key={event.id}>
                  <td>
                    <button type="button" style={linkStyle} onClick={() => setSelected(event)} title="View event details">
                      {event.id}
                    </button>
                  </td>
                  <td>
                    <button type="button" style={linkStyle} onClick={() => setSelected(event)} title="View event details">
                      {event.summary || '(No title)'}
                    </button>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatWhen(event.start_time)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatWhen(event.end_time)}</td>
                  <td>
                    <span className={event.status === 'cancelled' ? 'b-status-badge b-status-cancelled' : 'b-status-badge b-status-booked'}>
                      {event.status || 'confirmed'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {event.google_event_id}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="b-icon-btn b-icon-btn-danger"
                      title="Delete event"
                      onClick={() => setConfirmDeleteId(event.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.82rem' }}>
            Page {page} of {pages}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-outline-blue"
              disabled={page <= 1 || loading}
              onClick={() => loadPage(page - 1)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.85rem', fontSize: '0.82rem', opacity: page <= 1 ? 0.45 : 1 }}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              type="button"
              className="btn-outline-blue"
              disabled={page >= pages || loading}
              onClick={() => loadPage(page + 1)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.85rem', fontSize: '0.82rem', opacity: page >= pages ? 0.45 : 1 }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="b-modal-overlay">
          <div className="b-modal-card ce-modal">
            <div className="ce-modal-header">
              <div>
                <div className="ce-modal-id">#{selected.id}</div>
                <h2 className="ce-modal-title">{selected.summary || 'Untitled event'}</h2>
              </div>
              <button type="button" onClick={closeDetails} className="b-modal-close">
                <X size={22} />
              </button>
            </div>

            <div className="ce-section">
              <div className="ce-section-head">Event details</div>
              <div className="ce-fields">
                <div>
                  <div className="ce-field-label">Start</div>
                  <div className="ce-field-value">{formatWhen(selected.start_time)}</div>
                </div>
                <div>
                  <div className="ce-field-label">End</div>
                  <div className="ce-field-value">{formatWhen(selected.end_time)}</div>
                </div>
                <div>
                  <div className="ce-field-label">Status</div>
                  <div className="ce-field-value">
                    <span className={selected.status === 'cancelled' ? 'b-status-badge b-status-cancelled' : 'b-status-badge b-status-booked'}>
                      {selected.status || 'confirmed'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="ce-field-label">Updated</div>
                  <div className="ce-field-value">{formatWhen(selected.updated_at || null)}</div>
                </div>
                <div>
                  <div className="ce-field-label">Record ID</div>
                  <div className="ce-field-value" style={{ color: '#0a73ff' }}>{selected.id}</div>
                </div>
                <div>
                  <div className="ce-field-label">Google Event ID</div>
                  <div className="ce-field-value ce-mono">{selected.google_event_id || '—'}</div>
                </div>
              </div>
            </div>

            <div className="ce-section">
              <div className="ce-section-head">Description</div>
              <div className="ce-description">
                {selected.description || 'No description'}
              </div>
            </div>

            <div className="ce-modal-footer">
              <button
                type="button"
                className="b-icon-btn b-icon-btn-danger"
                title="Delete event"
                onClick={() => setConfirmDeleteId(selected.id)}
              >
                <Trash2 size={16} />
              </button>
              <button type="button" className="btn-outline-blue" onClick={closeDetails}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ce-modal {
          max-width: 720px;
          padding: 0;
          overflow: hidden;
        }
        .ce-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.35rem 1.6rem 1.15rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .ce-modal-id {
          color: #0a73ff;
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
        }
        .ce-modal-title {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          color: #fff;
          text-transform: uppercase;
          margin: 0;
          line-height: 1.25;
        }
        .ce-section {
          padding: 1.25rem 1.6rem 0;
        }
        .ce-section-head {
          color: #cbd5e1;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.9rem;
          padding-bottom: 0.7rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .ce-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.15rem 1.25rem;
        }
        .ce-field-label {
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.3rem;
        }
        .ce-field-value {
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          word-break: break-word;
        }
        .ce-mono {
          color: #94a3b8;
          font-size: 0.82rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-weight: 500;
        }
        .ce-description {
          background: #05080d;
          border: 1px solid rgba(255,255,255,0.07);
          border-left: 3px solid #0a73ff;
          border-radius: 6px;
          padding: 0.85rem 1rem;
          color: #cbd5e1;
          font-size: 0.9rem;
          white-space: pre-wrap;
          line-height: 1.6;
        }
        .ce-modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.15rem 1.6rem 1.35rem;
        }
        @media (max-width: 640px) {
          .ce-fields { grid-template-columns: 1fr; }
        }
      `}</style>

      {confirmDeleteId !== null && (
        <div className="b-modal-overlay">
          <div className="b-modal-card" style={{ maxWidth: '420px', padding: '2rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.75rem' }}>Delete calendar event</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Delete event <strong style={{ color: '#0a73ff' }}>#{confirmDeleteId}</strong>? This cannot be undone. Google Calendar itself is not changed.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }} onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId === confirmDeleteId}
                onClick={() => handleDelete(confirmDeleteId)}
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                {deletingId === confirmDeleteId ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

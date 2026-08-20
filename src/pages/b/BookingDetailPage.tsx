import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, Loader2, User, Calendar, Clock, FileText,
  ExternalLink, CheckCircle2, Car, Trash2,
} from 'lucide-react';
import { formatBrisbaneDateTime } from '@/lib/brisbaneTime';
import { BookingIntake, QuoteIntake } from '@/lib/useIntakeStore';

interface ConfirmedBooking {
  id: string;
  quote_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  service: string;
  car_make: string;
  tint_type: string;
  quotation_amount: number;
  booking_date: string;
  booking_time: string;
  duration_hours: number;
  status: string;
  created_at: string;
}

interface ManualBooking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  service_type: string;
  vehicle_details?: string | null;
  booking_date: string;
  booking_time: string;
  duration_hours: number;
  status: string;
  notes?: string | null;
  created_at?: string;
}

type DetailKind = 'request' | 'confirmed' | 'manual';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="bd-field-label">{label}</div>
      <div className="bd-field-value">{children}</div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
  actions,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="b-table-card bd-section">
      <div className="bd-section-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {icon}
          <h2>{title}</h2>
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'NEW': return 'b-status-badge b-status-new';
    case 'PENDING': return 'b-status-badge b-status-new';
    case 'CONTACTED': return 'b-status-badge b-status-contacted';
    case 'QUOTED': return 'b-status-badge b-status-quoted';
    case 'CONFIRMED':
    case 'BOOKED': return 'b-status-badge b-status-booked';
    case 'COMPLETED': return 'b-status-badge b-status-completed';
    case 'CANCELLED': return 'b-status-badge b-status-cancelled';
    default: return 'b-status-badge b-status-completed';
  }
};

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preferredType = searchParams.get('type') as DetailKind | null;

  const [kind, setKind] = useState<DetailKind | null>(null);
  const [request, setRequest] = useState<BookingIntake | null>(null);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);
  const [manual, setManual] = useState<ManualBooking | null>(null);
  const [relatedQuotes, setRelatedQuotes] = useState<QuoteIntake[]>([]);
  const [linkedQuote, setLinkedQuote] = useState<QuoteIntake | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      setRequest(null);
      setConfirmed(null);
      setManual(null);
      setRelatedQuotes([]);
      setLinkedQuote(null);

      const tryRequest = async () => {
        const res = await fetch(`/api/bookings/${id}`);
        if (!res.ok) return null;
        return res.json();
      };

      const tryConfirmed = async () => {
        const res = await fetch(`/api/confirmed-bookings/${id}`);
        if (!res.ok) return null;
        return res.json();
      };

      const tryManual = async () => {
        const res = await fetch(`/api/manual-bookings/${id}`);
        if (!res.ok) return null;
        return res.json();
      };

      try {
        let data = null as any;
        if (preferredType === 'confirmed') {
          data = await tryConfirmed();
          if (!data) data = await tryRequest();
          if (!data) data = await tryManual();
        } else if (preferredType === 'manual') {
          data = await tryManual();
          if (!data) data = await tryConfirmed();
          if (!data) data = await tryRequest();
        } else if (preferredType === 'request') {
          data = await tryRequest();
          if (!data) data = await tryConfirmed();
          if (!data) data = await tryManual();
        } else {
          data = await tryRequest();
          if (!data) data = await tryConfirmed();
          if (!data) data = await tryManual();
        }

        if (cancelled) return;

        if (!data) {
          setError('Booking not found.');
          setKind(null);
          return;
        }

        if (data.type === 'manual' || data.booking?.service_type) {
          setKind('manual');
          setManual(data.booking as ManualBooking);
        } else if (data.type === 'confirmed' || data.booking?.quote_id) {
          setKind('confirmed');
          setConfirmed(data.booking as ConfirmedBooking);
          setLinkedQuote((data.quote as QuoteIntake) || null);
        } else {
          setKind('request');
          setRequest(data.booking as BookingIntake);
          setRelatedQuotes(Array.isArray(data.relatedQuotes) ? data.relatedQuotes : []);
        }
      } catch {
        if (!cancelled) setError('Failed to load booking details.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id, preferredType]);

  const updateRequestStatus = async (status: BookingIntake['status']) => {
    if (!request) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok && data.booking) {
        setRequest(data.booking);
      } else if (res.ok) {
        setRequest((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch (err) {
      console.error('Update booking status failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!request) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/bookings/${request.id}`, { method: 'DELETE' });
      if (res.ok) {
        navigate('/admin/bookings');
      } else {
        alert('Failed to delete booking request.');
      }
    } catch (err) {
      console.error('Delete booking failed:', err);
      alert('Error deleting booking request.');
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#94a3b8', padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
        Loading booking details...
      </div>
    );
  }

  if (error || (!request && !confirmed && !manual)) {
    return (
      <div className="b-table-card" style={{ padding: '2rem' }}>
        <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error || 'Booking not found.'}</p>
        <button className="btn-outline-blue" onClick={() => navigate('/admin/bookings')}>
          <ArrowLeft size={16} /> Back to Bookings
        </button>
      </div>
    );
  }

  const quotesToShow: QuoteIntake[] = linkedQuote
    ? [linkedQuote]
    : relatedQuotes;

  return (
    <div className="bd-page">
      <div className="bd-page-header">
        <div>
          <button className="bd-back" onClick={() => navigate('/admin/bookings')}>
            <ArrowLeft size={16} /> Back to Bookings
          </button>
          <div className="bd-page-id">{id}</div>
          <h1 className="bd-page-title">
            {kind === 'confirmed' ? 'Confirmed Booking Details' : kind === 'manual' ? 'Manual Booking Details' : 'Booking Request Details'}
          </h1>
        </div>
        {kind === 'request' && request && request.status !== 'COMPLETED' && request.status !== 'CANCELLED' && (
          <button onClick={() => setConfirmDelete(true)} className="bd-delete-btn">
            <Trash2 size={14} /> Delete
          </button>
        )}
      </div>

      <div className="bd-layout">
        <div className="bd-col">
          {kind === 'request' && request && (
            <>
              <Section icon={<User size={18} color="#0a73ff" />} title="Customer Details">
                <div className="bd-fields">
                  <Field label="Name">{request.name}</Field>
                  <Field label="Phone">
                    <a href={`tel:${request.phone}`}><Phone size={14} /> {request.phone}</a>
                  </Field>
                  <Field label="Email">
                    <a href={`mailto:${request.email}`}><Mail size={14} /> {request.email}</a>
                  </Field>
                  <Field label="Service">{request.service}</Field>
                  <Field label="Vehicle / Property">{request.vehicleDetails || 'Not specified'}</Field>
                  <Field label="Submitted">{formatBrisbaneDateTime(request.createdAt)}</Field>
                </div>
              </Section>

              <Section icon={<Calendar size={18} color="#0a73ff" />} title="Schedule">
                <div className="bd-fields">
                  <Field label="Preferred Date">{request.preferredDate}</Field>
                  <Field label="Time Slot">{request.preferredTime}</Field>
                  <Field label="Status">
                    <span className={getStatusBadgeClass(request.status)}>{request.status}</span>
                  </Field>
                </div>
              </Section>

              {request.notes && (
                <Section icon={<FileText size={18} color="#0a73ff" />} title="Customer Notes">
                  <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{request.notes}</p>
                </Section>
              )}
            </>
          )}

          {kind === 'confirmed' && confirmed && (
            <>
              <Section icon={<User size={18} color="#0a73ff" />} title="Customer Details">
                <div className="bd-fields">
                  <Field label="Name">{confirmed.customer_name}</Field>
                  <Field label="Phone">
                    <a href={`tel:${confirmed.customer_phone}`}><Phone size={14} /> {confirmed.customer_phone}</a>
                  </Field>
                  <Field label="Email">
                    <a href={`mailto:${confirmed.customer_email}`}><Mail size={14} /> {confirmed.customer_email}</a>
                  </Field>
                  <Field label="Service">{confirmed.service}</Field>
                  <Field label="Created">{formatBrisbaneDateTime(confirmed.created_at)}</Field>
                </div>
              </Section>

              <Section icon={<Car size={18} color="#0a73ff" />} title="Vehicle & Quote Summary">
                <div className="bd-fields">
                  <Field label="Vehicle">{confirmed.car_make}</Field>
                  <Field label="Film">
                    <span style={{ color: '#0a73ff' }}>{confirmed.tint_type}</span>
                  </Field>
                  <Field label="Price">
                    <span style={{ color: '#10b981' }}>${Number(confirmed.quotation_amount).toFixed(2)}</span>
                  </Field>
                  <Field label="Quote ID">
                    {confirmed.quote_id ? (
                      <button
                        type="button"
                        className="bd-link-btn"
                        onClick={() => navigate(`/admin/quotes/${confirmed.quote_id}`)}
                      >
                        {confirmed.quote_id} <ExternalLink size={13} />
                      </button>
                    ) : '—'}
                  </Field>
                </div>
              </Section>

              <Section icon={<Calendar size={18} color="#0a73ff" />} title="Appointment">
                <div className="bd-fields">
                  <Field label="Date">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} color="#0a73ff" /> {confirmed.booking_date}
                    </span>
                  </Field>
                  <Field label="Time">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={14} color="#0a73ff" /> {confirmed.booking_time}
                    </span>
                  </Field>
                  <Field label="Duration">{confirmed.duration_hours} Hours</Field>
                  <Field label="Status">
                    <span className={getStatusBadgeClass(confirmed.status || 'CONFIRMED')}>
                      {confirmed.status || 'CONFIRMED'}
                    </span>
                  </Field>
                </div>
              </Section>
            </>
          )}

          {kind === 'manual' && manual && (
            <>
              <Section icon={<User size={18} color="#0a73ff" />} title="Customer Details">
                <div className="bd-fields">
                  <Field label="Name">{manual.customer_name}</Field>
                  <Field label="Phone">
                    <a href={`tel:${manual.customer_phone}`}><Phone size={14} /> {manual.customer_phone}</a>
                  </Field>
                  <Field label="Email">
                    <a href={`mailto:${manual.customer_email}`}><Mail size={14} /> {manual.customer_email}</a>
                  </Field>
                  <Field label="Service">{manual.service_type}</Field>
                  <Field label="Vehicle / Details">{manual.vehicle_details || '—'}</Field>
                </div>
              </Section>

              <Section icon={<Calendar size={18} color="#0a73ff" />} title="Appointment">
                <div className="bd-fields">
                  <Field label="Date">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} color="#0a73ff" /> {manual.booking_date}
                    </span>
                  </Field>
                  <Field label="Time">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={14} color="#0a73ff" /> {manual.booking_time}
                    </span>
                  </Field>
                  <Field label="Duration">{manual.duration_hours} Hours</Field>
                  <Field label="Status">
                    <span className={getStatusBadgeClass(manual.status || 'CONFIRMED')}>
                      {manual.status || 'CONFIRMED'}
                    </span>
                  </Field>
                </div>
              </Section>

              {manual.notes && (
                <Section icon={<FileText size={18} color="#0a73ff" />} title="Notes">
                  <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{manual.notes}</p>
                </Section>
              )}
            </>
          )}

          {kind !== 'manual' && (
          <Section
            icon={<FileText size={18} color="#0a73ff" />}
            title={linkedQuote ? 'Linked Quote Details' : 'Related Quote Details'}
            actions={
              quotesToShow.length === 1 ? (
                <button
                  type="button"
                  className="btn-outline-blue"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                  onClick={() => navigate(`/admin/quotes/${quotesToShow[0].id}`)}
                >
                  Open Quote
                </button>
              ) : null
            }
          >
            {quotesToShow.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                No related quote found for this customer yet.
              </div>
            ) : (
              <div className="bd-quote-list">
                {quotesToShow.map((q) => (
                  <div key={q.id} className="bd-quote-card">
                    <div className="bd-quote-card-top">
                      <button
                        type="button"
                        className="bd-link-btn"
                        onClick={() => navigate(`/admin/quotes/${q.id}`)}
                      >
                        {q.id} <ExternalLink size={13} />
                      </button>
                      <span className={getStatusBadgeClass(q.status)}>{q.status}</span>
                    </div>
                    <div className="bd-fields" style={{ marginTop: '0.9rem' }}>
                      <Field label="Customer">{q.name}</Field>
                      <Field label="Contact">
                        <div>{q.phone}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{q.email}</div>
                      </Field>
                      <Field label="Vehicle">{q.carMake} {q.yearModel}</Field>
                      <Field label="Film">
                        <span style={{ color: '#0a73ff' }}>{q.tintType}</span>
                      </Field>
                      <Field label="Old Tint Removal">{q.oldTintRemoval}</Field>
                      <Field label="Window Visors">{q.windowVisors}</Field>
                      <Field label="Preferred Date">{q.preferredDate || 'Flexible'}</Field>
                      <Field label="Price">
                        {q.estimatedPrice != null ? (
                          <span style={{ color: '#10b981' }}>${Number(q.estimatedPrice).toFixed(2)}</span>
                        ) : 'Unquoted'}
                      </Field>
                      <Field label="Duration">
                        {q.bookingHours ? `${q.bookingHours} Hours` : 'Not set'}
                      </Field>
                      <Field label="Submitted">{formatBrisbaneDateTime(q.createdAt)}</Field>
                    </div>
                    {(q.comments || q.quoteNotes) && (
                      <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
                        {q.comments && (
                          <div>
                            <div className="bd-field-label">Customer Comments</div>
                            <div style={{ color: '#cbd5e1', fontSize: '0.88rem', whiteSpace: 'pre-wrap' }}>{q.comments}</div>
                          </div>
                        )}
                        {q.quoteNotes && (
                          <div>
                            <div className="bd-field-label">Admin Notes</div>
                            <div style={{ color: '#cbd5e1', fontSize: '0.88rem', whiteSpace: 'pre-wrap' }}>{q.quoteNotes}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>
          )}
        </div>

        {kind === 'request' && request && (
          <div className="bd-col">
            <Section icon={<CheckCircle2 size={18} color="#0a73ff" />} title="Update Status">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.15rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Current</span>
                <span className={getStatusBadgeClass(request.status)}>{request.status}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {request.status === 'PENDING' && (
                  <button
                    className="btn-primary"
                    disabled={updating}
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
                    onClick={() => updateRequestStatus('CONFIRMED')}
                  >
                    {updating ? 'Updating...' : 'Confirm Booking'}
                  </button>
                )}
                {request.status === 'CONFIRMED' && (
                  <button
                    className="btn-outline-blue"
                    disabled={updating}
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
                    onClick={() => updateRequestStatus('COMPLETED')}
                  >
                    Mark Completed
                  </button>
                )}
                {request.status !== 'COMPLETED' && request.status !== 'CANCELLED' && (
                  <button
                    disabled={updating}
                    onClick={() => updateRequestStatus('CANCELLED')}
                    style={{
                      padding: '0.55rem 1.1rem',
                      fontSize: '0.85rem',
                      background: 'transparent',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#f59e0b',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </Section>
          </div>
        )}
      </div>

      {confirmDelete && request && (
        <div className="b-modal-overlay">
          <div className="b-modal-card" style={{ maxWidth: '420px', padding: '2rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.75rem' }}>Confirm Delete Booking</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Delete booking request <strong style={{ color: '#0a73ff' }}>{request.id}</strong>? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmDelete(false)} className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}>
                Cancel
              </button>
              <button
                onClick={handleDeleteRequest}
                disabled={deleting}
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.88rem',
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .bd-page { display: flex; flex-direction: column; gap: 1.25rem; }
        .bd-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
          gap: 1.25rem;
          align-items: start;
        }
        .bd-col { display: flex; flex-direction: column; gap: 1.25rem; min-width: 0; }
        .bd-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }
        .bd-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 0.82rem;
          cursor: pointer;
          padding: 0;
          margin-bottom: 0.45rem;
        }
        .bd-back:hover { color: #0a73ff; }
        .bd-page-id { color: #0a73ff; font-weight: 700; font-size: 0.85rem; }
        .bd-page-title {
          font-family: var(--font-heading);
          font-size: 1.55rem;
          color: #fff;
          text-transform: uppercase;
          margin: 0.15rem 0 0;
        }
        .bd-delete-btn {
          padding: 0.45rem 0.9rem;
          font-size: 0.8rem;
          background-color: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .bd-section { padding: 1.5rem 1.75rem; }
        .bd-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          padding-bottom: 0.9rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .bd-section-head h2 {
          margin: 0;
          color: #fff;
          font-family: var(--font-heading);
          font-size: 1.05rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .bd-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.15rem 1.25rem;
        }
        .bd-field-label {
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.3rem;
        }
        .bd-field-value {
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          word-break: break-word;
        }
        .bd-field-value a {
          color: #0a73ff;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 600;
        }
        .bd-link-btn {
          background: none;
          border: none;
          color: #0a73ff;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.95rem;
        }
        .bd-link-btn:hover { text-decoration: underline; }
        .bd-quote-list { display: flex; flex-direction: column; gap: 1rem; }
        .bd-quote-card {
          background: #05080d;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 1rem 1.15rem;
        }
        .bd-quote-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        @media (max-width: 1100px) {
          .bd-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .bd-fields { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

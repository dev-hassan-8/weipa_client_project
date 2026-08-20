import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, RefreshCw, Clock, Calendar as CalendarIcon, Plus, Eye, Check, Trash2, Ban, CalendarClock } from 'lucide-react';
import { brisbaneTodayYmd } from '@/lib/brisbaneTime';
import { useIntakeStore, BookingIntake } from '@/lib/useIntakeStore';

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
  vehicle_details: string;
  booking_date: string;
  booking_time: string;
  duration_hours: number;
  status: string;
  recurrence: string;
}

export default function BookingsManagerPage() {
  const navigate = useNavigate();
  const { bookings } = useIntakeStore();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'CONFIRMED' | 'MANUAL' | 'LEGACY'>('CONFIRMED');

  const [legacyBookings, setLegacyBookings] = useState<BookingIntake[]>(bookings);
  const [manualBookings, setManualBookings] = useState<ManualBooking[]>([]);
  const [loadingManual, setLoadingManual] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    customerName: '', customerPhone: '', customerEmail: '', serviceType: 'Automotive Tint', vehicleDetails: '',
    bookingDate: '', bookingTime: '08:00 AM', durationHours: 1, notes: '', recurrence: 'none'
  });

  const fetchManualBookings = async () => {
    setLoadingManual(true);
    try {
      const res = await fetch('/api/manual-bookings');
      if (res.ok) setManualBookings(await res.json());
    } catch (e) {} finally { setLoadingManual(false); }
  };

  const fetchLegacyBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setLegacyBookings(data);
        useIntakeStore.setState({ bookings: data });
      }
    } catch (e) {
      console.error('[Bookings] Failed to fetch legacy bookings:', e);
    }
  };

  useEffect(() => {
    if (activeTab === 'MANUAL') fetchManualBookings();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'CONFIRMED' && statusFilter === 'PENDING') {
      setStatusFilter('ALL');
    }
  }, [activeTab, statusFilter]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/manual-bookings', { method: 'POST', body: JSON.stringify(addForm) });
      if (res.ok) {
        setShowAddModal(false);
        fetchManualBookings();
      }
    } catch(e) {}
  };
  
  const handleSendReschedule = async (id: string, type: string) => {
    try {
      await fetch('/api/send-reschedule-link', { method: 'POST', body: JSON.stringify({ bookingId: id, bookingType: type }) });
      alert('Reschedule link sent!');
    } catch(e) {}
  };

  useEffect(() => {
    fetchLegacyBookings();
  }, []);

  // Confirmed bookings from /book/[token] workflow
  const [confirmedBookings, setConfirmedBookings] = useState<ConfirmedBooking[]>([]);
  const [loadingConfirmed, setLoadingConfirmed] = useState(false);

  const [dateFilter, setDateFilter] = useState<'ALL'|'TODAY'|'TOMORROW'|'UPCOMING'|'PAST'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'date-asc'|'date-desc'>('date-asc');
  
  const [selectedBooking, setSelectedBooking] = useState<ConfirmedBooking | null>(null);
  const legacyStatusOptions = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;
  const confirmedStatusOptions = ['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;

  const fetchConfirmedBookings = async () => {
    setLoadingConfirmed(true);
    try {
      const res = await fetch('/api/confirmed-bookings');
      if (res.ok) {
        const data = await res.json();
        setConfirmedBookings(data);
      }
    } catch (err) {
      console.error('[Bookings] Failed to fetch confirmed bookings:', err);
    } finally {
      setLoadingConfirmed(false);
    }
  };

  const updateLegacyBooking = async (id: string, status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error('Failed to update booking');
    }

    await fetchLegacyBookings();
  };

  const deleteLegacyBooking = async (id: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete booking');
    }

    await fetchLegacyBookings();
  };

  useEffect(() => {
    if (activeTab === 'CONFIRMED') fetchConfirmedBookings();
  }, [activeTab]);

  const todayStr = brisbaneTodayYmd();
  const [y, m, d] = todayStr.split('-').map(Number);
  const tomorrow = new Date(y, m - 1, d + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const filteredConfirmedBookings = confirmedBookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    let matchesDate = true;
    if (dateFilter === 'TODAY') matchesDate = b.booking_date === todayStr;
    else if (dateFilter === 'TOMORROW') matchesDate = b.booking_date === tomorrowStr;
    else if (dateFilter === 'UPCOMING') matchesDate = b.booking_date > todayStr;
    else if (dateFilter === 'PAST') matchesDate = b.booking_date < todayStr;

    const matchesSearch =
      b.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_phone?.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.car_make?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDate && matchesSearch;
  }).sort((a, b) => {
    const timeA = new Date(`${a.booking_date}T00:00:00`).getTime();
    const timeB = new Date(`${b.booking_date}T00:00:00`).getTime();
    if (sortOption === 'date-asc') return timeA - timeB;
    return timeB - timeA;
  });

  const filteredBookings = legacyBookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'TODAY') matchesDate = b.preferredDate === todayStr;
    else if (dateFilter === 'TOMORROW') matchesDate = b.preferredDate === tomorrowStr;
    else if (dateFilter === 'UPCOMING') matchesDate = b.preferredDate > todayStr;
    else if (dateFilter === 'PAST') matchesDate = b.preferredDate < todayStr;

    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicleDetails.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDate && matchesSearch;
  }).sort((a, b) => {
    const timeA = new Date(`${a.preferredDate}T00:00:00`).getTime();
    const timeB = new Date(`${b.preferredDate}T00:00:00`).getTime();
    if (sortOption === 'date-asc') return timeA - timeB;
    return timeB - timeA;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'b-status-badge b-status-contacted';
      case 'CONFIRMED': return 'b-status-badge b-status-booked';
      case 'COMPLETED': return 'b-status-badge b-status-completed';
      case 'CANCELLED': return 'b-status-badge b-status-cancelled';
      default: return 'b-status-badge b-status-completed';
    }
  };

  const statusOptions = activeTab === 'CONFIRMED' ? confirmedStatusOptions : legacyStatusOptions;
  const statusCounts = {
    ALL: activeTab === 'CONFIRMED' ? confirmedBookings.length : legacyBookings.length,
    PENDING: legacyBookings.filter((b) => b.status === 'PENDING').length,
    CONFIRMED:
      activeTab === 'CONFIRMED'
        ? confirmedBookings.filter((b) => b.status === 'CONFIRMED').length
        : legacyBookings.filter((b) => b.status === 'CONFIRMED').length,
    COMPLETED:
      activeTab === 'CONFIRMED'
        ? confirmedBookings.filter((b) => b.status === 'COMPLETED').length
        : legacyBookings.filter((b) => b.status === 'COMPLETED').length,
    CANCELLED:
      activeTab === 'CONFIRMED'
        ? confirmedBookings.filter((b) => b.status === 'CANCELLED').length
        : legacyBookings.filter((b) => b.status === 'CANCELLED').length,
  };

  return (
    <div>
      {/* TAB SWITCHER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div className="b-table-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.4rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', width: 'fit-content' }}>
            {(['CONFIRMED', 'MANUAL', 'LEGACY'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.6rem 1.4rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)',
                  fontSize: '0.88rem', fontWeight: 600, letterSpacing: '0.04em',
                  backgroundColor: activeTab === tab ? '#0a73ff' : 'transparent',
                  color: activeTab === tab ? '#fff' : '#94a3b8', transition: 'all 0.2s ease'
                }}
              >
                {tab === 'CONFIRMED' ? '✅ CONFIRMED BOOKINGS' : tab === 'MANUAL' ? '📝 MANUAL BOOKINGS' : '📩 BOOKING REQUESTS'}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0a73ff', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Plus size={18} /> Add Booking
        </button>
      </div>

      {/* GLOBAL FILTERS APPLIED TO BOTH TABS */}
      <div className="b-table-card" style={{ marginBottom: '2rem' }}>
        <div className="b-table-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff' }}>
              FILTERS & SEARCH
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Find specific bookings across dates and statuses.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {(['ALL', 'TODAY', 'TOMORROW', 'UPCOMING', 'PAST'] as const).map(df => (
                <button
                  key={df}
                  onClick={() => setDateFilter(df)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '50px',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: dateFilter === df ? '#0a73ff' : 'rgba(255, 255, 255, 0.05)',
                    color: dateFilter === df ? '#ffffff' : '#94a3b8',
                  }}
                >
                  {df}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, or car..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="b-input"
              style={{ width: '250px', padding: '0.45rem 1rem', fontSize: '0.82rem' }}
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="b-input"
              style={{ width: '160px', padding: '0.45rem 1rem', fontSize: '0.82rem' }}
            >
              <option value="date-asc">Soonest</option>
              <option value="date-desc">Furthest</option>
            </select>
            <button
              onClick={() => {
                if (activeTab === 'CONFIRMED') fetchConfirmedBookings();
              }}
              className="btn-outline-blue"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <RefreshCw size={15} style={{ animation: loadingConfirmed ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
          </div>
        </div>

        {/* STATUS FILTERS FOR BOOKING REQUESTS / CONFIRMED BOOKINGS */}
        {activeTab !== 'MANUAL' && (
          <div className="b-table-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginRight: '0.5rem' }}>STATUS:</span>
              {statusOptions.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    backgroundColor: statusFilter === st ? '#1e293b' : 'transparent',
                    color: statusFilter === st ? '#ffffff' : '#94a3b8',
                  }}
                >
                  {st} {st !== 'ALL' && statusCounts[st] > 0 && `(${statusCounts[st]})`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── TAB 1: CONFIRMED BOOKINGS FROM /book/[token] workflow ─── */}
      {activeTab === 'CONFIRMED' && (
        <div className="b-table-card">
          {loadingConfirmed && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              Loading confirmed bookings...
            </div>
          )}

          {!loadingConfirmed && confirmedBookings.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              No confirmed bookings yet. Quote bookings will appear here when customers select their date and time.
            </div>
          )}
          
          {!loadingConfirmed && confirmedBookings.length > 0 && filteredConfirmedBookings.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              No bookings matching filters.
            </div>
          )}

          {!loadingConfirmed && filteredConfirmedBookings.length > 0 && (
            <table className="b-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Vehicle / Film</th>
                  <th>Date &amp; Time</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredConfirmedBookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700, color: '#0a73ff' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/bookings/${b.id}?type=confirmed`)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontWeight: 700,
                          color: '#0a73ff',
                          cursor: 'pointer',
                        }}
                      >
                        {b.id}
                      </button>
                    </td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{b.customer_name}</td>
                    <td>
                      <div>
                        <a href={`tel:${b.customer_phone}`} style={{ color: '#0a73ff', textDecoration: 'none', fontSize: '0.85rem' }}>
                          {b.customer_phone}
                        </a>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.customer_email}</div>
                    </td>
                    <td>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>{b.car_make}</div>
                      <div style={{ color: '#0a73ff', fontSize: '0.78rem' }}>{b.tint_type}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fff', fontWeight: 600 }}>
                        <CalendarIcon size={13} color="#0a73ff" />
                        {b.booking_date}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0a73ff', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                        <Clock size={13} />
                        {b.booking_time}
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      {b.duration_hours}h
                    </td>
                    <td style={{ fontWeight: 700, color: '#10b981' }}>
                      ${Number(b.quotation_amount).toFixed(2)}
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(b.status || 'CONFIRMED')}>
                        {b.status || 'CONFIRMED'}
                      </span>
                    </td>
                    <td>
                      <div className="b-icon-actions">
                        <button
                          onClick={() => navigate(`/admin/bookings/${b.id}?type=confirmed`)}
                          className="b-icon-btn"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleSendReschedule(b.id, 'confirmed')}
                          className="b-icon-btn"
                          title="Send Reschedule Link"
                        >
                          <CalendarClock size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* MODAL FOR BOOKING DETAILS */}
      {selectedBooking && (
        <div className="b-modal-overlay">
          <div className="b-modal-card" style={{ maxWidth: '600px' }}>
            <div className="b-modal-header">
              <div>
                <span style={{ color: '#0a73ff', fontWeight: 700, fontSize: '0.85rem' }}>
                  {selectedBooking.id}
                </span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', textTransform: 'uppercase' }}>
                  Booking Details
                </h2>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="b-modal-close">
                <XCircle size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', padding: '1.25rem', backgroundColor: '#05080d', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>CUSTOMER</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>{selectedBooking.customer_name}</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <a href={`tel:${selectedBooking.customer_phone}`} style={{ color: '#0a73ff', fontSize: '0.85rem', textDecoration: 'none' }}>
                    {selectedBooking.customer_phone}
                  </a>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>{selectedBooking.customer_email}</div>
                </div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>SCHEDULE</div>
                <div style={{ marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', fontWeight: 700 }}>
                  <CalendarIcon size={16} color="#0a73ff" /> {selectedBooking.booking_date}
                </div>
                <div style={{ marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0a73ff' }}>
                  <Clock size={16} /> {selectedBooking.booking_time} ({selectedBooking.duration_hours}h)
                </div>
              </div>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>VEHICLE</div>
                  <div style={{ color: '#fff', fontWeight: 600, marginTop: '0.2rem' }}>{selectedBooking.car_make}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>TINT FILM</div>
                  <div style={{ color: '#fff', fontWeight: 600, marginTop: '0.2rem' }}>{selectedBooking.tint_type}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>QUOTED PRICE</div>
                  <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.2rem' }}>${Number(selectedBooking.quotation_amount).toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>QUOTE REF</div>
                  <div style={{ color: '#94a3b8', fontWeight: 600, marginTop: '0.2rem' }}>{selectedBooking.quote_id}</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* ─── TAB: MANUAL BOOKINGS ─── */}
      {activeTab === 'MANUAL' && (
        <div className="b-table-card">
          <table className="b-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Recurrence</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {manualBookings.map(b => (
                <tr key={b.id}>
                  <td style={{ color: '#0a73ff', fontWeight: 'bold' }}>{b.id}</td>
                  <td>{b.customer_name}<br/><small>{b.customer_phone}</small></td>
                  <td>{b.service_type}<br/><small>{b.vehicle_details}</small></td>
                  <td>{b.booking_date}<br/><small style={{ color: '#0a73ff' }}>{b.booking_time}</small></td>
                  <td>{b.duration_hours}h</td>
                  <td>{b.recurrence}</td>
                  <td>
                    <div className="b-icon-actions">
                      <button onClick={() => handleSendReschedule(b.id, 'manual')} className="b-icon-btn" title="Send Reschedule Link">
                        <CalendarClock size={15} />
                      </button>
                      <button
                        onClick={() => {
                          fetch('/api/manual-bookings/' + b.id, { method: 'DELETE' }).then(() => fetchManualBookings());
                        }}
                        className="b-icon-btn b-icon-btn-danger"
                        title="Cancel"
                      >
                        <Ban size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div className="b-modal-overlay" style={{ zIndex: 9999 }}>
          <div className="b-modal-card" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="b-modal-header">
              <h2>Add Manual Booking</h2>
              <button onClick={() => setShowAddModal(false)} className="b-modal-close"><XCircle /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
              <input required placeholder="Customer Name" value={addForm.customerName} onChange={e => setAddForm({...addForm, customerName: e.target.value})} className="b-input" />
              <input required placeholder="Phone" value={addForm.customerPhone} onChange={e => setAddForm({...addForm, customerPhone: e.target.value})} className="b-input" />
              <input type="email" required placeholder="Email" value={addForm.customerEmail} onChange={e => setAddForm({...addForm, customerEmail: e.target.value})} className="b-input" />
              <select value={addForm.serviceType} onChange={e => setAddForm({...addForm, serviceType: e.target.value})} className="b-input">
                <option>Automotive Tint</option><option>Residential Window Tint</option><option>Commercial Window Tint</option><option>Other</option>
              </select>
              <input placeholder="Vehicle Details (Optional)" value={addForm.vehicleDetails} onChange={e => setAddForm({...addForm, vehicleDetails: e.target.value})} className="b-input" />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="date" required min={brisbaneTodayYmd()} value={addForm.bookingDate} onChange={e => setAddForm({...addForm, bookingDate: e.target.value})} className="b-input" style={{ flex: 1 }} />
                <input type="time" required value={addForm.bookingTime} onChange={e => setAddForm({...addForm, bookingTime: e.target.value})} className="b-input" style={{ flex: 1 }} />
              </div>
              <select value={addForm.durationHours} onChange={e => setAddForm({...addForm, durationHours: Number(e.target.value)})} className="b-input">
                <option value={1}>1 Hour</option><option value={2}>2 Hours</option><option value={3}>3 Hours</option><option value={4}>4 Hours</option>
              </select>
              <select value={addForm.recurrence} onChange={e => setAddForm({...addForm, recurrence: e.target.value})} className="b-input">
                <option value="none">Does not repeat</option><option value="daily">Every day</option><option value="weekly">Every week</option><option value="monthly">Every month</option>
              </select>
              <textarea placeholder="Notes" value={addForm.notes} onChange={e => setAddForm({...addForm, notes: e.target.value})} className="b-input" />
              <button type="submit" style={{ background: '#0a73ff', color: '#fff', padding: '0.8rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save Booking</button>
            </form>
          </div>
        </div>
      )}

      {/* ─── TAB 2: BOOKING REQUESTS FROM /api/bookings ─── */}
      {activeTab === 'LEGACY' && (
        <>
          {/* Bookings Table */}
          <div className="b-table-card">
            <table className="b-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer Name</th>
                  <th>Phone / Email</th>
                  <th>Service</th>
                  <th>Vehicle / Property</th>
                  <th>Scheduled Date &amp; Slot</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      No bookings found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/bookings/${b.id}?type=request`)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            fontWeight: 700,
                            color: '#0a73ff',
                            cursor: 'pointer',
                          }}
                        >
                          {b.id}
                        </button>
                      </td>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{b.name}</td>
                      <td>
                        <div>{b.phone}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.email}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                          {b.service}
                        </span>
                      </td>
                      <td>{b.vehicleDetails}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{b.preferredDate}</div>
                        <div style={{ fontSize: '0.78rem', color: '#0a73ff' }}>{b.preferredTime}</div>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(b.status)}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <div className="b-icon-actions">
                          <button
                            onClick={() => navigate(`/admin/bookings/${b.id}?type=request`)}
                            className="b-icon-btn"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          {b.status === 'PENDING' && (
                            <button
                              onClick={async () => {
                                try {
                                  await updateLegacyBooking(b.id, 'CONFIRMED');
                                } catch (err) {
                                  console.error('[Bookings] Confirm failed:', err);
                                }
                              }}
                              className="b-icon-btn b-icon-btn-primary"
                              title="Confirm"
                            >
                              <Check size={15} />
                            </button>
                          )}
                          {b.status === 'CONFIRMED' && (
                            <button
                              onClick={async () => {
                                try {
                                  await updateLegacyBooking(b.id, 'COMPLETED');
                                } catch (err) {
                                  console.error('[Bookings] Mark done failed:', err);
                                }
                              }}
                              className="b-icon-btn b-icon-btn-success"
                              title="Mark Done"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                          )}
                          {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                            <button
                              onClick={async () => {
                                try {
                                  await updateLegacyBooking(b.id, 'CANCELLED');
                                } catch (err) {
                                  console.error('[Bookings] Cancel failed:', err);
                                }
                              }}
                              className="b-icon-btn b-icon-btn-warning"
                              title="Cancel"
                            >
                              <Ban size={15} />
                            </button>
                          )}
                          {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                            <button
                              onClick={async () => {
                                try {
                                  await deleteLegacyBooking(b.id);
                                } catch (err) {
                                  console.error('[Bookings] Delete failed:', err);
                                }
                              }}
                              className="b-icon-btn b-icon-btn-danger"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

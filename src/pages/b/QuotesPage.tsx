import React, { useState, Suspense } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, Trash2, Eye } from 'lucide-react';
import { formatBrisbaneDateTime, brisbaneTodayYmd } from '@/lib/brisbaneTime';
import { useIntakeStore, QuoteIntake } from '@/lib/useIntakeStore';

type FilmTier = 'BUDGET' | 'PREMIUM';

const FILM_LABELS: Record<FilmTier, string> = {
  BUDGET: 'CC Extreme Nanocarbon',
  PREMIUM: 'Black Armor',
};

const inferFilmTier = (tintType?: string): FilmTier => {
  const value = (tintType || '').toLowerCase();
  return value.includes('black') || value.includes('armour') || value.includes('armor') || value.includes('ceramic') ? 'PREMIUM' : 'BUDGET';
};

function QuotesManagerContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('id');

  const { quotes } = useIntakeStore();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quotesList, setQuotesList] = useState<QuoteIntake[]>(quotes);
  const [confirmDeleteQuoteId, setConfirmDeleteQuoteId] = useState<string | null>(null);
  const [deletingQuoteId, setDeletingQuoteId] = useState<string | null>(null);

  const handleDeleteQuote = async (id: string) => {
    setDeletingQuoteId(id);
    try {
      const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuotesList(prev => prev.filter(q => q.id !== id));
      } else {
        alert('Failed to delete quote intake record.');
      }
    } catch (err) {
      console.error('Delete quote error:', err);
      alert('Error deleting quote intake record.');
    } finally {
      setDeletingQuoteId(null);
      setConfirmDeleteQuoteId(null);
    }
  };

  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [nqForm, setNqForm] = useState({ name: '', phone: '', email: '', carMake: '', yearModel: '', tintType: FILM_LABELS.BUDGET, oldTintRemoval: 'NO', windowVisors: 'NO', comments: '', quoteNotes: '' });
  const [isSubmittingNq, setIsSubmittingNq] = useState(false);
  const [sortOption, setSortOption] = useState<string>('newest');

  React.useEffect(() => {
    if (highlightId) {
      navigate(`/admin/quotes/${highlightId}`, { replace: true });
    }
  }, [highlightId, navigate]);

  React.useEffect(() => {
    fetch('/api/quotes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setQuotesList(data);
          useIntakeStore.setState({ quotes: data });
        }
      })
      .catch(console.error);
  }, []);

  const todayStr = brisbaneTodayYmd();
  const [ty, tm, td] = todayStr.split('-').map(Number);
  const tomorrow = new Date(ty, tm - 1, td + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  const [dateFilter, setDateFilter] = useState<'ALL'|'TODAY'|'TOMORROW'|'UPCOMING'|'PAST'>('ALL');

  const filteredQuotes = quotesList.filter((q) => {
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;

    let matchesDate = true;
    if (q.preferredDate) {
      if (dateFilter === 'TODAY') matchesDate = q.preferredDate === todayStr;
      else if (dateFilter === 'TOMORROW') matchesDate = q.preferredDate === tomorrowStr;
      else if (dateFilter === 'UPCOMING') matchesDate = q.preferredDate > todayStr;
      else if (dateFilter === 'PAST') matchesDate = q.preferredDate < todayStr;
    } else if (dateFilter !== 'ALL') {
      matchesDate = false;
    }

    const matchesSearch =
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.carMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.yearModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.phone.includes(searchQuery);
    return matchesStatus && matchesSearch && matchesDate;
  }).sort((a, b) => {
    if (sortOption === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortOption === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortOption === 'price-high') return (b.estimatedPrice || 0) - (a.estimatedPrice || 0);
    if (sortOption === 'price-low') return (a.estimatedPrice || 0) - (b.estimatedPrice || 0);
    return 0;
  });

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

  const handleCreateManualQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingNq(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nqForm,
          quoteNotes: nqForm.quoteNotes.trim() || null,
        })
      });
      if (res.ok) {
        const data = await res.json();
        setQuotesList([data.quote, ...quotesList]);
        setShowNewQuoteModal(false);
        setNqForm({ name: '', phone: '', email: '', carMake: '', yearModel: '', tintType: FILM_LABELS.BUDGET, oldTintRemoval: 'NO', windowVisors: 'NO', comments: '', quoteNotes: '' });
      } else {
        alert('Failed to create manual quote.');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating quote');
    } finally {
      setIsSubmittingNq(false);
    }
  };

  return (
    <div>
      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="b-table-card" style={{ marginBottom: '2rem' }}>
        <div className="b-table-header">
          
          {/* Status Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {(['ALL', 'NEW', 'CONTACTED', 'QUOTED', 'BOOKED', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '50px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: statusFilter === st ? '#0a73ff' : 'rgba(255, 255, 255, 0.05)',
                  color: statusFilter === st ? '#ffffff' : '#94a3b8',
                }}
              >
                {st} {st === 'NEW' && quotesList.filter(q => q.status === 'NEW').length > 0 && `(${quotesList.filter(q => q.status === 'NEW').length})`}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginRight: '0.5rem', alignSelf: 'center' }}>DATE:</span>
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

          {/* Search Box & New Quote Button */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search name, vehicle, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="b-table-search"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="b-input"
              style={{ width: '150px', padding: '0.45rem 1rem', fontSize: '0.82rem' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
            <button
              onClick={() => setShowNewQuoteModal(true)}
              className="btn-primary"
              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
            >
              + Create Quote
            </button>
          </div>

        </div>
      </div>

      {/* QUOTES TABLE */}
      <div className="b-table-card">
        <table className="b-table">
          <thead>
            <tr>
              <th>Submitted Date</th>
              <th>Quote ID</th>
              <th>Customer</th>
              <th>Contact Info</th>
              <th>Vehicle Make / Model</th>
              <th>Selected Tint Film</th>
              <th>Booking Hours</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No quote requests found matching current filter.
                </td>
              </tr>
            ) : (
              filteredQuotes.map((q) => (
                <tr key={q.id}>
                  <td style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    {formatBrisbaneDateTime(q.createdAt, { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <Link
                      to={`/admin/quotes/${q.id}`}
                      style={{
                        fontWeight: 700,
                        color: '#0a73ff',
                        textDecoration: 'none',
                      }}
                      title="View quote details"
                    >
                      {q.id}
                    </Link>
                  </td>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{q.name}</td>
                  <td>
                    <div>{q.phone}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{q.email}</div>
                  </td>
                  <td>{q.carMake} {q.yearModel}</td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: inferFilmTier(q.tintType) === 'PREMIUM' ? '#ffffff' : '#cbd5e1', fontWeight: inferFilmTier(q.tintType) === 'PREMIUM' ? 600 : 400 }}>
                      {q.tintType}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: q.bookingHours ? '#fff' : '#64748b' }}>
                    {q.bookingHours ? `${q.bookingHours} Hours` : 'Not set'}
                  </td>
                  <td style={{ fontWeight: 700, color: q.estimatedPrice ? '#10b981' : '#64748b' }}>
                    {q.estimatedPrice ? `$${q.estimatedPrice}` : 'Unquoted'}
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(q.status)}>
                      {q.status}
                    </span>
                  </td>
                  <td>
                    <div className="b-icon-actions">
                      <button
                        onClick={() => navigate(`/admin/quotes/${q.id}`)}
                        className="b-icon-btn"
                        title="View Intake"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteQuoteId(q.id)}
                        className="b-icon-btn b-icon-btn-danger"
                        title="Delete Quote Intake"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CONFIRM DELETE QUOTE MODAL */}
      {confirmDeleteQuoteId && (
        <div className="b-modal-overlay">
          <div className="b-modal-card" style={{ maxWidth: '420px', padding: '2rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.75rem' }}>Confirm Delete Quote</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to delete quote intake <strong style={{ color: '#0a73ff' }}>{confirmDeleteQuoteId}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmDeleteQuoteId(null)}
                className="btn-secondary"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuote(confirmDeleteQuoteId)}
                disabled={deletingQuoteId === confirmDeleteQuoteId}
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.88rem',
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {deletingQuoteId === confirmDeleteQuoteId ? 'Deleting...' : 'Delete Quote'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* NEW QUOTE MODAL */}
      {showNewQuoteModal && (
        <div className="b-modal-overlay">
          <div className="b-modal-card" style={{ maxWidth: '600px' }}>
            <div className="b-modal-header">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', textTransform: 'uppercase' }}>
                Create Manual Quote
              </h2>
              <button onClick={() => setShowNewQuoteModal(false)} className="b-modal-close">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateManualQuote} style={{ display: 'grid', gap: '1rem' }}>
              <div className="b-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="b-label">Customer Name</label>
                  <input required className="b-input" value={nqForm.name} onChange={e => setNqForm({...nqForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="b-label">Phone Number</label>
                  <input required className="b-input" value={nqForm.phone} onChange={e => setNqForm({...nqForm, phone: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="b-label">Email Address</label>
                <input required type="email" className="b-input" value={nqForm.email} onChange={e => setNqForm({...nqForm, email: e.target.value})} />
              </div>

              <div className="b-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="b-label">Vehicle Make/Model</label>
                  <input required className="b-input" placeholder="e.g. Toyota Hilux" value={nqForm.carMake} onChange={e => setNqForm({...nqForm, carMake: e.target.value})} />
                </div>
                <div>
                  <label className="b-label">Year</label>
                  <input required className="b-input" value={nqForm.yearModel} onChange={e => setNqForm({...nqForm, yearModel: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="b-label">Tint Type</label>
                <select className="b-input" value={nqForm.tintType} onChange={e => setNqForm({...nqForm, tintType: e.target.value})}>
                  <option value={FILM_LABELS.BUDGET}>Budget - {FILM_LABELS.BUDGET}</option>
                  <option value={FILM_LABELS.PREMIUM}>Premium - {FILM_LABELS.PREMIUM}</option>
                </select>
              </div>

              <div className="b-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="b-label">Old Tint Removal?</label>
                  <select className="b-input" value={nqForm.oldTintRemoval} onChange={e => setNqForm({...nqForm, oldTintRemoval: e.target.value})}>
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="b-label">Window Visors?</label>
                  <select className="b-input" value={nqForm.windowVisors} onChange={e => setNqForm({...nqForm, windowVisors: e.target.value})}>
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="b-label">Notes</label>
                <textarea
                  className="b-input"
                  rows={4}
                  placeholder="Add any additional information for the client..."
                  value={nqForm.quoteNotes}
                  onChange={e => setNqForm({...nqForm, quoteNotes: e.target.value})}
                  style={{ resize: 'vertical', minHeight: '90px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setShowNewQuoteModal(false)} className="btn-outline-blue">Cancel</button>
                <button type="submit" disabled={isSubmittingNq} className="btn-primary">
                  {isSubmittingNq ? 'Creating...' : 'Create Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function QuotesManagerPage() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', padding: '2rem' }}>Loading Quotes Manager...</div>}>
      <QuotesManagerContent />
    </Suspense>
  );
}

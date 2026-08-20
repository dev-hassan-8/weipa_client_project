import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Phone, Mail, Send, Loader2, CheckCircle2, ExternalLink, Trash2, ArrowLeft, MessageSquare, User, FileText, RefreshCw, Pencil, X, Copy, Check } from 'lucide-react';
import { formatBrisbaneDateTime } from '@/lib/brisbaneTime';
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

type EditFormState = {
  name: string;
  phone: string;
  email: string;
  carMake: string;
  yearModel: string;
  tintType: string;
  oldTintRemoval: 'YES' | 'NO';
  windowVisors: 'YES' | 'NO';
  preferredDate: string;
  comments: string;
  quoteNotes: string;
  bookingHours: string;
  estimatedPrice: string;
};

const quoteToEditForm = (q: QuoteIntake): EditFormState => {
  const tier = (q.filmTier as FilmTier) || inferFilmTier(q.tintType);
  return {
    name: q.name || '',
    phone: q.phone || '',
    email: q.email || '',
    carMake: q.carMake || '',
    yearModel: q.yearModel || '',
    tintType: FILM_LABELS[tier],
    oldTintRemoval: q.oldTintRemoval || 'NO',
    windowVisors: q.windowVisors || 'NO',
    preferredDate: q.preferredDate || '',
    comments: q.comments || '',
    quoteNotes: q.quoteNotes || '',
    bookingHours: q.bookingHours ? String(q.bookingHours) : '2',
    estimatedPrice: q.estimatedPrice != null ? String(q.estimatedPrice) : '',
  };
};

const STATUS_OPTIONS: QuoteIntake['status'][] = ['NEW', 'CONTACTED', 'QUOTED', 'BOOKED', 'COMPLETED', 'CANCELLED'];

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

type DisplayNote = { key: string; source: 'customer' | 'admin' | 'sent'; label: string; text: string; meta?: string };

function buildDisplayNotes(quote: QuoteIntake): DisplayNote[] {
  const items: DisplayNote[] = [];
  if (quote.comments) {
    items.push({ key: 'comments', source: 'customer', label: 'Customer', text: quote.comments, meta: 'Quote request' });
  }
  if (quote.quoteNotes) {
    items.push({ key: 'quoteNotes', source: 'admin', label: 'Admin', text: quote.quoteNotes, meta: 'Intake notes' });
  }
  (quote.notes || []).forEach((n, i) => {
    const isClient = n.includes('[From Client]');
    const isSent = n.includes('[Sent to Client]');
    const timeMatch = n.match(/^\[([^\]]+?(?:AM|PM))\]/i);
    const clean = n
      .replace(/^\[[^\]]+\]\s*/, '')
      .replace(/\[Internal\]|\[Sent to Client\]|\[From Client\]/g, '')
      .trim();
    items.push({
      key: `n-${i}`,
      source: isClient ? 'customer' : isSent ? 'sent' : 'admin',
      label: isClient ? 'Customer' : isSent ? 'Admin → Customer' : 'Admin',
      text: clean,
      meta: timeMatch?.[1],
    });
  });
  return items;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="qd-field-label">{label}</div>
      <div className="qd-field-value">{children}</div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section className={`b-table-card qd-section${accent ? ' qd-section-accent' : ''}`}>
      <div className="qd-section-head">
        {icon}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const updateQuoteStatus = useIntakeStore((state) => state.updateQuoteStatus);

  const [quote, setQuote] = useState<QuoteIntake | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState>(quoteToEditForm({
    id: '', name: '', phone: '', email: '', carMake: '', yearModel: '', tintType: FILM_LABELS.BUDGET,
    oldTintRemoval: 'NO', windowVisors: 'NO', status: 'NEW', createdAt: '',
  }));
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  const [filmProfilePrices, setFilmProfilePrices] = useState({ budget: 420, premium: 550 });
  const [newNote, setNewNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<QuoteIntake['status']>('NEW');
  const [quotationAmount, setQuotationAmount] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('2');
  const [selectedFilmTier, setSelectedFilmTier] = useState<FilmTier>('BUDGET');
  const [sendingQuote, setSendingQuote] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [quoteSendError, setQuoteSendError] = useState('');
  const [sentBookingToken, setSentBookingToken] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendNoteToClient, setSendNoteToClient] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [editingQuoteDetails, setEditingQuoteDetails] = useState(false);
  const [quoteDetailsForm, setQuoteDetailsForm] = useState({ price: '', hours: '2' });
  const [savingQuoteDetails, setSavingQuoteDetails] = useState(false);
  const [quoteDetailsError, setQuoteDetailsError] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [sendUpdateEmail, setSendUpdateEmail] = useState(true);

  const openEditModal = (q: QuoteIntake) => {
    setEditForm(quoteToEditForm(q));
    setEditError('');
    setSendUpdateEmail(true);
    setShowEditModal(true);
  };

  const openQuoteDetailsEdit = (q: QuoteIntake) => {
    setQuoteDetailsForm({
      price: q.estimatedPrice != null ? String(q.estimatedPrice) : '',
      hours: q.bookingHours ? String(q.bookingHours) : '2',
    });
    setQuoteDetailsError('');
    setSendUpdateEmail(true);
    setEditingQuoteDetails(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditError('');
    if (searchParams.get('edit')) {
      const next = new URLSearchParams(searchParams);
      next.delete('edit');
      setSearchParams(next, { replace: true });
    }
  };

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setFilmProfilePrices({
          budget: typeof data.budgetFilmPrice === 'number' ? data.budgetFilmPrice : 420,
          premium: typeof data.premiumFilmPrice === 'number' ? data.premiumFilmPrice : 550,
        });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    fetch(`/api/quotes/${id}`)
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        // Fallback for older sessions: load from list
        const listRes = await fetch('/api/quotes');
        const data = await listRes.json();
        const found = Array.isArray(data) ? data.find((q: QuoteIntake) => q.id === id) : null;
        if (!found) throw new Error('not-found');
        return found;
      })
      .then((found: QuoteIntake) => {
        if (!found || !found.id) {
          setError('Quote not found.');
          setQuote(null);
          return;
        }
        const tier = (found.filmTier as FilmTier) || inferFilmTier(found.tintType);
        setQuote(found);
        setSelectedFilmTier(tier);
        setSelectedStatus(found.status);
        setQuoteSent(found.status === 'QUOTED' || found.status === 'BOOKED');
        setQuoteSendError('');
        setSentBookingToken(found.bookingToken || '');
        setEstimatedDuration(found.bookingHours ? String(found.bookingHours) : '2');
        setQuotationAmount(found.estimatedPrice ? found.estimatedPrice.toString() : '');
        if (searchParams.get('edit') === '1') {
          setEditForm(quoteToEditForm(found));
          setEditError('');
          setShowEditModal(true);
        }
      })
      .catch(() => setError('Failed to load quote.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!quote || quotationAmount) return;
    const defaultProfilePrice = selectedFilmTier === 'PREMIUM' ? filmProfilePrices.premium : filmProfilePrices.budget;
    setQuotationAmount(quote.estimatedPrice ? quote.estimatedPrice.toString() : defaultProfilePrice.toString());
  }, [quote, filmProfilePrices, selectedFilmTier, quotationAmount]);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote) return;
    setSavingEdit(true);
    setEditError('');
    try {
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          phone: editForm.phone.trim(),
          email: editForm.email.trim(),
          carMake: editForm.carMake.trim(),
          yearModel: editForm.yearModel.trim(),
          tintType: editForm.tintType,
          oldTintRemoval: editForm.oldTintRemoval,
          windowVisors: editForm.windowVisors,
          preferredDate: editForm.preferredDate.trim() || null,
          comments: editForm.comments.trim() || null,
          quoteNotes: editForm.quoteNotes.trim() || null,
          bookingHours: editForm.bookingHours ? parseInt(editForm.bookingHours, 10) : null,
          estimatedPrice: editForm.estimatedPrice !== '' ? parseFloat(editForm.estimatedPrice) : null,
          sendEmail: sendUpdateEmail === true,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.quote) {
        setEditError(data.error || 'Failed to update quote.');
        return;
      }
      const updated = data.quote as QuoteIntake;
      applyUpdatedQuote(updated);
      closeEditModal();
    } catch (err) {
      console.error('Update quote error:', err);
      setEditError('Network error. Check connection and try again.');
    } finally {
      setSavingEdit(false);
    }
  };

  const applyUpdatedQuote = (updated: QuoteIntake) => {
    setQuote(updated);
    setSelectedFilmTier((updated.filmTier as FilmTier) || inferFilmTier(updated.tintType));
    setEstimatedDuration(updated.bookingHours ? String(updated.bookingHours) : '2');
    setQuotationAmount(updated.estimatedPrice != null ? String(updated.estimatedPrice) : '');
    useIntakeStore.setState((state) => ({
      quotes: state.quotes.map((q) => (q.id === updated.id ? { ...q, ...updated } : q)),
    }));
  };

  const handleSaveQuoteDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote) return;
    setSavingQuoteDetails(true);
    setQuoteDetailsError('');
    try {
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: quote.name,
          phone: quote.phone,
          email: quote.email,
          carMake: quote.carMake,
          yearModel: quote.yearModel,
          tintType: quote.tintType,
          oldTintRemoval: quote.oldTintRemoval,
          windowVisors: quote.windowVisors,
          preferredDate: quote.preferredDate || null,
          comments: quote.comments || null,
          quoteNotes: quote.quoteNotes || null,
          bookingHours: quoteDetailsForm.hours ? parseInt(quoteDetailsForm.hours, 10) : null,
          estimatedPrice: quoteDetailsForm.price !== '' ? parseFloat(quoteDetailsForm.price) : null,
          sendEmail: sendUpdateEmail === true,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.quote) {
        setQuoteDetailsError(data.error || 'Failed to update quote details.');
        return;
      }
      applyUpdatedQuote(data.quote as QuoteIntake);
      setEditingQuoteDetails(false);
    } catch (err) {
      console.error('Update quote details error:', err);
      setQuoteDetailsError('Network error. Check connection and try again.');
    } finally {
      setSavingQuoteDetails(false);
    }
  };

  const handleDeleteQuote = async () => {
    if (!quote) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/quotes/${quote.id}`, { method: 'DELETE' });
      if (res.ok) {
        useIntakeStore.setState((state) => ({
          quotes: state.quotes.filter((q) => q.id !== quote.id),
        }));
        navigate('/admin/quotes');
      } else {
        alert('Failed to delete quote intake record.');
      }
    } catch (err) {
      console.error('Delete quote error:', err);
      alert('Error deleting quote intake record.');
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!quote || selectedStatus === quote.status) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/quotes/${quote.id}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus: selectedStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        updateQuoteStatus(quote.id, data.status);
        setQuote((prev) => prev ? { ...prev, status: data.status } : prev);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNote = async () => {
    if (!quote || !newNote.trim()) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/quotes/${quote.id}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStatus: quote.status,
          note: newNote.trim(),
          sendToClient: sendNoteToClient,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        updateQuoteStatus(quote.id, data.status, newNote.trim());
        setQuote((prev) => prev ? { ...prev, notes: data.notes } : prev);
        setNewNote('');
        setSendNoteToClient(false);
      }
    } catch (err) {
      console.error('Failed to save note', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleSendOfficialQuote = async () => {
    if (!quote) return;
    const amount = parseFloat(quotationAmount);
    const duration = parseInt(estimatedDuration, 10);

    if (!amount || amount <= 0) {
      setQuoteSendError('Please enter a valid quote amount.');
      return;
    }
    if (!duration || duration <= 0) {
      setQuoteSendError('Please enter a valid estimated duration.');
      return;
    }

    setSendingQuote(true);
    setQuoteSendError('');
    setQuoteSent(false);

    try {
      const selectedTintType = FILM_LABELS[selectedFilmTier];
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotationAmount: amount,
          estimatedDuration: duration,
          sendEmail,
          filmTier: selectedFilmTier,
          tintType: selectedTintType,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setQuoteSent(true);
        setSentBookingToken(data.bookingToken);
        setSelectedStatus('QUOTED');
        updateQuoteStatus(
          quote.id,
          'QUOTED',
          sendEmail
            ? `Official quote of $${amount} sent via email & SMS. Booking token: ${data.bookingToken}`
            : `Official quote of $${amount} created (No email sent). Booking token: ${data.bookingToken}`,
          amount
        );
        setQuote((prev) => prev ? {
          ...prev,
          status: 'QUOTED',
          estimatedPrice: amount,
          bookingHours: duration,
          filmTier: selectedFilmTier,
          tintType: selectedTintType,
          bookingToken: data.bookingToken || prev.bookingToken,
          bookingLink: data.bookingLink || (data.bookingToken ? `/book/${data.bookingToken}` : prev.bookingLink),
        } : prev);
      } else {
        setQuoteSendError(data.error || 'Failed to send quote. Please try again.');
      }
    } catch {
      setQuoteSendError('Network error. Check connection and try again.');
    } finally {
      setSendingQuote(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#94a3b8', padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
        Loading quote details...
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="b-table-card" style={{ padding: '2rem' }}>
        <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error || 'Quote not found.'}</p>
        <button className="btn-outline-blue" onClick={() => navigate('/admin/quotes')}>
          <ArrowLeft size={16} /> Back to Quotes
        </button>
      </div>
    );
  }

  const canSendQuote = quote.status !== 'BOOKED' && quote.status !== 'COMPLETED' && quote.status !== 'CANCELLED';
  const hasCompleteEstimate = quote.estimatedPrice != null && quote.bookingHours != null;
  const estimateActionLabel = hasCompleteEstimate ? 'Edit Estimate' : 'Create Estimate';
  const noteItems = buildDisplayNotes(quote);
  const bookingPath = sentBookingToken
    ? `/book/${sentBookingToken}`
    : quote.bookingToken
      ? `/book/${quote.bookingToken}`
      : (quote.bookingLink || '');
  const bookingHref = bookingPath;
  const bookingCopyUrl = bookingPath
    ? (bookingPath.startsWith('http') ? bookingPath : `${window.location.origin}${bookingPath.startsWith('/') ? '' : '/'}${bookingPath}`)
    : '';

  const handleCopyBookingLink = async () => {
    if (!bookingCopyUrl) return;
    try {
      await navigator.clipboard.writeText(bookingCopyUrl);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Copy booking link failed:', err);
    }
  };

  return (
    <div className="qd-page">
      <div className="qd-page-header">
        <div>
          <button className="qd-back" onClick={() => navigate('/admin/quotes')}>
            <ArrowLeft size={16} /> Back to Quotes
          </button>
          <div className="qd-page-id">{quote.id}</div>
          <h1 className="qd-page-title">Quote Intake Details</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => openEditModal(quote)}
            className="qd-edit-btn"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="qd-delete-btn"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="qd-layout">
      <div className="qd-col">
      <Section icon={<User size={18} color="#0a73ff" />} title="Customer Details">
        <div className="qd-fields">
          <Field label="Name">{quote.name}</Field>
          <Field label="Phone">
            <a href={`tel:${quote.phone}`}><Phone size={14} /> {quote.phone}</a>
          </Field>
          <Field label="Email">
            <a href={`mailto:${quote.email}`}><Mail size={14} /> {quote.email}</a>
          </Field>
          <Field label="Vehicle">{quote.carMake} {quote.yearModel}</Field>
          <Field label="Old Tint Removal">{quote.oldTintRemoval}</Field>
          <Field label="Window Visors">{quote.windowVisors}</Field>
          <Field label="Film Choice">
            <span style={{ color: '#0a73ff' }}>{quote.tintType}</span>
          </Field>
          <Field label="Preferred Date">{quote.preferredDate || 'Flexible'}</Field>
          <Field label="Submitted">{formatBrisbaneDateTime(quote.createdAt)}</Field>
        </div>
      </Section>

      <Section icon={<FileText size={18} color="#0a73ff" />} title="Quote" accent>
        {editingQuoteDetails ? (
          <form onSubmit={handleSaveQuoteDetails}>
            <div className="qd-form-grid" style={{ marginBottom: '1rem' }}>
              <div>
                <label className="b-label">Current Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="b-input"
                  style={{ marginTop: '0.4rem' }}
                  placeholder="e.g. 550"
                  value={quoteDetailsForm.price}
                  onChange={(e) => setQuoteDetailsForm({ ...quoteDetailsForm, price: e.target.value })}
                />
              </div>
              <div>
                <label className="b-label">Duration (hours)</label>
                <select
                  className="b-input"
                  style={{ marginTop: '0.4rem' }}
                  value={quoteDetailsForm.hours}
                  onChange={(e) => setQuoteDetailsForm({ ...quoteDetailsForm, hours: e.target.value })}
                >
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="4">4 Hours</option>
                  <option value="5">5 Hours</option>
                  <option value="6">6 Hours</option>
                </select>
              </div>
            </div>
            {quoteDetailsError && (
              <div className="qd-error">{quoteDetailsError}</div>
            )}
            <label className="qd-check">
              <input
                type="checkbox"
                checked={sendUpdateEmail}
                onChange={(e) => setSendUpdateEmail(e.target.checked)}
                style={{ accentColor: '#0a73ff' }}
              />
              Send updated quote email &amp; SMS to customer
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-outline-blue"
                style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
                onClick={() => {
                  setEditingQuoteDetails(false);
                  setQuoteDetailsError('');
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={savingQuoteDetails}
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
              >
                {savingQuoteDetails ? 'Saving...' : 'Save Quote Details'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="qd-fields" style={{ marginBottom: '1.15rem' }}>
              <Field label="Current Price">
                {quote.estimatedPrice ? `$${Number(quote.estimatedPrice).toFixed(2)}` : 'Not quoted yet'}
              </Field>
              <Field label="Duration">
                {quote.bookingHours ? `${quote.bookingHours} Hours` : 'Not set'}
              </Field>
              {hasCompleteEstimate && (
              <Field label="Booking Link">
                {bookingHref ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <a href={bookingHref} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                      <ExternalLink size={13} /> {bookingPath.startsWith('http') ? bookingPath : bookingPath}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyBookingLink}
                      title={linkCopied ? 'Copied!' : 'Copy booking link'}
                      className="qd-copy-btn"
                    >
                      {linkCopied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{linkCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                ) : (
                  <span style={{ color: '#64748b' }}>Creating...</span>
                )}
              </Field>
              )}
            </div>
            {hasCompleteEstimate && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => openQuoteDetailsEdit(quote)}
                className="qd-edit-btn"
              >
                <Pencil size={14} /> {estimateActionLabel}
              </button>
            </div>
            )}
          </>
        )}

        {canSendQuote && !editingQuoteDetails && (
          <>
            <div className="qd-divider" />
            {quoteSent && sentBookingToken ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#22c55e', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={20} />
                  <span style={{ fontWeight: 600 }}>Quote sent successfully. Customer will receive email &amp; SMS.</span>
                </div>
                <div style={{ backgroundColor: '#05080d', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>Booking link</div>
                  <a
                    href={`/book/${sentBookingToken}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0a73ff', wordBreak: 'break-all', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                  >
                    /book/{sentBookingToken} <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="qd-section-sub">Send official quote to customer</div>
                <div className="qd-form-grid">
                  <div>
                    <label className="b-label">Film Product *</label>
                    <select
                      value={selectedFilmTier}
                      onChange={(e) => {
                        const tier = e.target.value as FilmTier;
                        setSelectedFilmTier(tier);
                        const profilePrice = tier === 'PREMIUM' ? filmProfilePrices.premium : filmProfilePrices.budget;
                        setQuotationAmount(profilePrice.toString());
                      }}
                      className="b-input"
                      style={{ marginTop: '0.4rem' }}
                    >
                      <option value="BUDGET">Budget - {FILM_LABELS.BUDGET}</option>
                      <option value="PREMIUM">Premium - {FILM_LABELS.PREMIUM}</option>
                    </select>
                  </div>
                  <div>
                    <label className="b-label">Quote Price ($) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 490"
                      value={quotationAmount}
                      onChange={(e) => setQuotationAmount(e.target.value)}
                      className="b-input"
                      min="0"
                      step="0.01"
                      style={{ marginTop: '0.4rem' }}
                    />
                  </div>
                  <div>
                    <label className="b-label">Estimated Duration (hours) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 2"
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      className="b-input"
                      min="1"
                      max="8"
                      step="0.5"
                      style={{ marginTop: '0.4rem' }}
                    />
                  </div>
                </div>
                <p className="qd-help">
                  Profile prices: Budget ${filmProfilePrices.budget.toFixed(2)} | Premium ${filmProfilePrices.premium.toFixed(2)}. You can edit the final quote amount manually.
                </p>

                {quoteSendError && (
                  <div className="qd-error">{quoteSendError}</div>
                )}

                <label className="qd-check">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    style={{ accentColor: '#0a73ff' }}
                  />
                  Send email &amp; SMS notification to customer
                </label>

                <button
                  onClick={handleSendOfficialQuote}
                  disabled={sendingQuote}
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                >
                  {sendingQuote ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
                  ) : (
                    <><Send size={16} /> {sendEmail ? 'SEND QUOTE & BOOKING LINK' : 'SAVE QUOTE LOCALLY'}</>
                  )}
                </button>
                <p className="qd-help" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                  {sendEmail
                    ? 'This will send the customer their official priced quote via email and SMS, along with a unique one-time booking link.'
                    : 'This will save the quote locally without notifying the customer.'}
                </p>
              </>
            )}
          </>
        )}
      </Section>
      </div>

      <div className="qd-col">
      <Section icon={<RefreshCw size={18} color="#0a73ff" />} title="Update Status">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.15rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Current</span>
          <span className={getStatusBadgeClass(quote.status)}>{quote.status}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px' }}>
            <label className="b-label">Change Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as QuoteIntake['status'])}
              className="b-input"
              style={{ marginTop: '0.4rem' }}
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleUpdateStatus}
            disabled={updatingStatus || selectedStatus === quote.status}
            className="btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', opacity: selectedStatus === quote.status ? 0.55 : 1 }}
          >
            {updatingStatus ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </Section>

      <Section icon={<MessageSquare size={18} color="#0a73ff" />} title="Notes — Customer & Admin">
        <div className="qd-notes">
          {noteItems.length === 0 ? (
            <div className="qd-empty">No notes yet from customer or admin.</div>
          ) : noteItems.map((item) => {
            const colors = item.source === 'customer'
              ? { bg: 'rgba(34, 197, 94, 0.1)', border: '#22c55e', badge: '#22c55e', text: '#dcfce7' }
              : item.source === 'sent'
                ? { bg: 'rgba(10, 115, 255, 0.1)', border: '#0a73ff', badge: '#60a5fa', text: '#e0f2fe' }
                : { bg: '#05080d', border: '#475569', badge: '#94a3b8', text: '#cbd5e1' };
            return (
              <div
                key={item.key}
                className="qd-note"
                style={{ backgroundColor: colors.bg, borderLeftColor: colors.border }}
              >
                <div className="qd-note-meta">
                  <span className="qd-note-badge" style={{ color: colors.badge }}>{item.label}</span>
                  {item.meta && <span>{item.meta}</span>}
                </div>
                <div style={{ color: colors.text, fontSize: '0.88rem', lineHeight: 1.55 }}>{item.text}</div>
              </div>
            );
          })}
        </div>

        <div className="qd-divider" />
        <label className="b-label">Add Note</label>
        <textarea
          placeholder="e.g. Spoke to customer, confirmed appointment for Friday"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="b-input"
          rows={3}
          style={{ marginTop: '0.4rem', resize: 'vertical', minHeight: '80px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label className="qd-check" style={{ marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={sendNoteToClient}
              onChange={(e) => setSendNoteToClient(e.target.checked)}
              style={{ accentColor: '#0a73ff' }}
            />
            Send note to customer via email
          </label>
          <button
            onClick={handleSaveNote}
            disabled={savingNote || !newNote.trim()}
            className="btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          >
            {savingNote ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </Section>
      </div>
      </div>

      {showEditModal && (
        <div className="b-modal-overlay">
          <div className="b-modal-card" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="b-modal-header">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', textTransform: 'uppercase' }}>
                Edit Quote
              </h2>
              <button type="button" onClick={closeEditModal} className="b-modal-close">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="b-label">Customer Name *</label>
                  <input
                    required
                    className="b-input"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="b-label">Phone Number *</label>
                  <input
                    required
                    className="b-input"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="b-label">Email Address *</label>
                <input
                  required
                  type="email"
                  className="b-input"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="b-label">Vehicle Make/Model *</label>
                  <input
                    required
                    className="b-input"
                    value={editForm.carMake}
                    onChange={(e) => setEditForm({ ...editForm, carMake: e.target.value })}
                  />
                </div>
                <div>
                  <label className="b-label">Year *</label>
                  <input
                    required
                    className="b-input"
                    value={editForm.yearModel}
                    onChange={(e) => setEditForm({ ...editForm, yearModel: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="b-label">Tint Type</label>
                <select
                  className="b-input"
                  value={editForm.tintType}
                  onChange={(e) => setEditForm({ ...editForm, tintType: e.target.value })}
                >
                  <option value={FILM_LABELS.BUDGET}>Budget - {FILM_LABELS.BUDGET}</option>
                  <option value={FILM_LABELS.PREMIUM}>Premium - {FILM_LABELS.PREMIUM}</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="b-label">Old Tint Removal?</label>
                  <select
                    className="b-input"
                    value={editForm.oldTintRemoval}
                    onChange={(e) => setEditForm({ ...editForm, oldTintRemoval: e.target.value as 'YES' | 'NO' })}
                  >
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="b-label">Window Visors?</label>
                  <select
                    className="b-input"
                    value={editForm.windowVisors}
                    onChange={(e) => setEditForm({ ...editForm, windowVisors: e.target.value as 'YES' | 'NO' })}
                  >
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="b-label">Preferred Date</label>
                  <input
                    type="date"
                    className="b-input"
                    value={editForm.preferredDate}
                    onChange={(e) => setEditForm({ ...editForm, preferredDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="b-label">Estimated Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="b-input"
                    placeholder="Optional"
                    value={editForm.estimatedPrice}
                    onChange={(e) => setEditForm({ ...editForm, estimatedPrice: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="b-label">Customer Comments</label>
                <textarea
                  className="b-input"
                  rows={2}
                  value={editForm.comments}
                  onChange={(e) => setEditForm({ ...editForm, comments: e.target.value })}
                  style={{ resize: 'vertical', minHeight: '60px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', display: 'grid', gap: '1rem' }}>
                <div>
                  <label className="b-label">Admin Notes</label>
                  <textarea
                    className="b-input"
                    rows={3}
                    value={editForm.quoteNotes}
                    onChange={(e) => setEditForm({ ...editForm, quoteNotes: e.target.value })}
                    style={{ resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label className="b-label">Booking Hours</label>
                  <select
                    className="b-input"
                    value={editForm.bookingHours}
                    onChange={(e) => setEditForm({ ...editForm, bookingHours: e.target.value })}
                  >
                    <option value="2">2 Hours</option>
                    <option value="3">3 Hours</option>
                    <option value="4">4 Hours</option>
                    <option value="5">5 Hours</option>
                    <option value="6">6 Hours</option>
                  </select>
                </div>
              </div>

              {editError && (
                <div className="qd-error" style={{ marginBottom: 0 }}>{editError}</div>
              )}

              <label className="qd-check" style={{ marginBottom: 0 }}>
                <input
                  type="checkbox"
                  checked={sendUpdateEmail}
                  onChange={(e) => setSendUpdateEmail(e.target.checked)}
                  style={{ accentColor: '#0a73ff' }}
                />
                Send updated quote email &amp; SMS to customer
              </label>

              <div style={{ marginTop: '0.25rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={closeEditModal} className="btn-outline-blue">Cancel</button>
                <button type="submit" disabled={savingEdit} className="btn-primary">
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="b-modal-overlay">
          <div className="b-modal-card" style={{ maxWidth: '420px', padding: '2rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.75rem' }}>Confirm Delete Quote</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to delete quote intake <strong style={{ color: '#0a73ff' }}>{quote.id}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmDelete(false)} className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}>
                Cancel
              </button>
              <button
                onClick={handleDeleteQuote}
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
                {deleting ? 'Deleting...' : 'Delete Quote'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .qd-page { display: flex; flex-direction: column; gap: 1.25rem; }
        .qd-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
          gap: 1.25rem;
          align-items: start;
        }
        .qd-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          min-width: 0;
        }
        .qd-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }
        .qd-back {
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
        .qd-back:hover { color: #0a73ff; }
        .qd-page-id { color: #0a73ff; font-weight: 700; font-size: 0.85rem; }
        .qd-page-title {
          font-family: var(--font-heading);
          font-size: 1.55rem;
          color: #fff;
          text-transform: uppercase;
          margin: 0.15rem 0 0;
        }
        .qd-edit-btn {
          padding: 0.45rem 0.9rem;
          font-size: 0.8rem;
          background-color: rgba(10, 115, 255, 0.15);
          border: 1px solid rgba(10, 115, 255, 0.35);
          color: #60a5fa;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .qd-edit-btn:hover { background-color: rgba(10, 115, 255, 0.25); }
        .qd-copy-btn {
          padding: 0.25rem 0.55rem;
          font-size: 0.72rem;
          font-weight: 600;
          background-color: rgba(10, 115, 255, 0.12);
          border: 1px solid rgba(10, 115, 255, 0.3);
          color: #60a5fa;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          flex-shrink: 0;
        }
        .qd-copy-btn:hover { background-color: rgba(10, 115, 255, 0.22); }
        .qd-delete-btn {
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
        .qd-section { padding: 1.5rem 1.75rem; }
        .qd-section-accent { border-color: rgba(10, 115, 255, 0.28); }
        .qd-section-head {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.25rem;
          padding-bottom: 0.9rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .qd-section-head h2 {
          margin: 0;
          color: #fff;
          font-family: var(--font-heading);
          font-size: 1.05rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .qd-section-sub {
          color: #cbd5e1;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.9rem;
        }
        .qd-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.15rem 1.25rem;
        }
        .qd-field-label {
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.3rem;
        }
        .qd-field-value {
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          word-break: break-word;
        }
        .qd-field-value a {
          color: #0a73ff;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 600;
        }
        .qd-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.85rem;
          margin-bottom: 0.75rem;
        }
        .qd-help { color: #64748b; font-size: 0.8rem; margin: 0 0 1rem; }
        .qd-error {
          background-color: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 6px;
          padding: 0.65rem 1rem;
          margin-bottom: 1rem;
          color: #f87171;
          font-size: 0.88rem;
        }
        .qd-check {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
          font-size: 0.85rem;
          cursor: pointer;
          margin-bottom: 1rem;
        }
        .qd-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 0 0 1.25rem;
        }
        .qd-notes { display: flex; flex-direction: column; gap: 0.65rem; }
        .qd-empty { color: #64748b; font-size: 0.88rem; padding: 0.35rem 0 0.5rem; }
        .qd-note {
          padding: 0.75rem 0.9rem;
          border-left: 3px solid;
          border-radius: 6px;
        }
        .qd-note-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.3rem;
          flex-wrap: wrap;
          font-size: 0.72rem;
          color: #64748b;
        }
        .qd-note-badge {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background-color: rgba(0,0,0,0.25);
          padding: 0.15rem 0.45rem;
          border-radius: 999px;
        }
        @media (max-width: 1100px) {
          .qd-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .qd-fields { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

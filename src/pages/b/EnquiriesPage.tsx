import React, { useState } from 'react';
import { Inbox, Mail, Phone, CheckCircle2, MessageSquare, X, Trash2, Eye } from 'lucide-react';
import { formatBrisbaneDateTime } from '@/lib/brisbaneTime';
import { useIntakeStore, ContactIntake } from '@/lib/useIntakeStore';

export default function EnquiriesInboxPage() {
  const { enquiries, updateEnquiryStatus } = useIntakeStore();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const [enquiriesList, setEnquiriesList] = useState<ContactIntake[]>(enquiries);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  React.useEffect(() => {
    fetch('/api/contact')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEnquiriesList(data);
          useIntakeStore.setState({ enquiries: data });
        }
      })
      .catch(console.error);
  }, []);

  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactIntake | null>(null);

  const handleDeleteEnquiry = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiriesList(prev => prev.filter(e => e.id !== id));
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      } else {
        alert('Failed to delete enquiry record.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting enquiry record.');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const filteredEnquiries = enquiriesList.filter((e) => statusFilter === 'ALL' || e.status === statusFilter);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'UNREAD': return 'b-status-badge b-status-new';
      case 'READ': return 'b-status-badge b-status-contacted';
      case 'REPLIED': return 'b-status-badge b-status-booked';
      case 'ARCHIVED': return 'b-status-badge b-status-completed';
      default: return 'b-status-badge b-status-completed';
    }
  };

  return (
    <div>
      {/* FILTER CONTROL BAR */}
      <div className="b-table-card" style={{ marginBottom: '2rem' }}>
        <div className="b-table-header">
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff' }}>
              CONTACT ENQUIRIES INBOX
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Messages submitted via the public Contact Us page.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {(['ALL', 'UNREAD', 'READ', 'REPLIED', 'ARCHIVED'] as const).map((st) => (
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
                {st} {st === 'UNREAD' && enquiriesList.filter(e => e.status === 'UNREAD').length > 0 && `(${enquiriesList.filter(e => e.status === 'UNREAD').length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ENQUIRIES TABLE */}
      <div className="b-table-card">
        <table className="b-table">
          <thead>
            <tr>
              <th>Enquiry ID</th>
              <th>Customer</th>
              <th>Phone / Email</th>
              <th>Service Choice</th>
              <th>Message Snippet</th>
              <th>Status</th>
              <th>Received</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No enquiries found matching current filter.
                </td>
              </tr>
            ) : (
              filteredEnquiries.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 700, color: '#0a73ff' }}>{e.id}</td>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{e.name}</td>
                  <td>
                    <div>{e.phone}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{e.email}</div>
                  </td>
                  <td>{e.service}</td>
                  <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.message}
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(e.status)}>
                      {e.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    {formatBrisbaneDateTime(e.createdAt, { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div className="b-icon-actions">
                      <button
                        onClick={() => {
                          setSelectedEnquiry(e);
                          if (e.status === 'UNREAD') {
                            updateEnquiryStatus(e.id, 'READ');
                            setEnquiriesList(prev => prev.map(enq => enq.id === e.id ? { ...enq, status: 'READ' } : enq));
                          }
                        }}
                        className="b-icon-btn"
                        title="Read"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(e.id)}
                        className="b-icon-btn b-icon-btn-danger"
                        title="Delete"
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

      {/* CONFIRMATION DELETE DIALOG */}
      {confirmDeleteId && (
        <div className="b-modal-overlay">
          <div className="b-modal-card" style={{ maxWidth: '420px', padding: '2rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.75rem' }}>Confirm Delete</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to delete enquiry record <strong style={{ color: '#0a73ff' }}>{confirmDeleteId}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="btn-secondary"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEnquiry(confirmDeleteId)}
                disabled={deletingId === confirmDeleteId}
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
                {deletingId === confirmDeleteId ? 'Deleting...' : 'Delete Intake'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE DETAIL MODAL */}
      {selectedEnquiry && (
        <div className="b-modal-overlay">
          <div className="b-modal-card">
            
            <div className="b-modal-header">
              <div>
                <span style={{ color: '#0a73ff', fontWeight: 700, fontSize: '0.85rem' }}>
                  {selectedEnquiry.id}
                </span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: '#fff', textTransform: 'uppercase' }}>
                  Contact Enquiry
                </h2>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="b-modal-close">
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: '#05080d', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>{selectedEnquiry.name}</div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <a href={`tel:${selectedEnquiry.phone}`} style={{ color: '#0a73ff', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Phone size={14} /> {selectedEnquiry.phone}
                </a>
                <a href={`mailto:${selectedEnquiry.email}`} style={{ color: '#0a73ff', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Mail size={14} /> {selectedEnquiry.email}
                </a>
              </div>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'rgba(10, 115, 255, 0.08)', borderRadius: '8px', borderLeft: '3px solid #0a73ff', marginBottom: '1.5rem' }}>
              <div style={{ color: '#0a73ff', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                SERVICE: {selectedEnquiry.service}
              </div>
              <div style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.6 }}>
                "{selectedEnquiry.message}"
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
              <button
                onClick={() => setConfirmDeleteId(selectedEnquiry.id)}
                style={{
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.88rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Trash2 size={16} />
                Delete Intake
              </button>
              <button
                onClick={() => {
                  updateEnquiryStatus(selectedEnquiry.id, 'REPLIED');
                  setEnquiriesList(prev => prev.map(enq => enq.id === selectedEnquiry.id ? { ...enq, status: 'REPLIED' } : enq));
                  setSelectedEnquiry(null);
                }}
                className="btn-primary"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem' }}
              >
                Mark as Replied
              </button>
              <button
                onClick={() => {
                  updateEnquiryStatus(selectedEnquiry.id, 'ARCHIVED');
                  setEnquiriesList(prev => prev.map(enq => enq.id === selectedEnquiry.id ? { ...enq, status: 'ARCHIVED' } : enq));
                  setSelectedEnquiry(null);
                }}
                className="btn-secondary"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem' }}
              >
                Archive
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

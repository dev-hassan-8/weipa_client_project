import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Save, Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle2, Loader2, Calendar } from 'lucide-react';


export default function BackofficeSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    businessName: 'Weipa Tint',
    phone: '0498 367 791',
    email: 'weipatint@gmail.com',
    location: 'Weipa, QLD 4874',
    hoursMonFri: '8:00 am – 4:30 pm',
    hoursSat: 'By appointment',
    budgetFilmPrice: 420,
    premiumFilmPrice: 550,
    smsAlertNumber: '0498 367 791',
    autoReplyCustomerEmail: true,
    facebookLink: 'https://facebook.com',
    instagramLink: 'https://instagram.com',
    whatsappLink: 'https://wa.me/61498367791',
    tiktokLink: 'https://tiktok.com',
    heatRejectionPercentage: null as number | null,
    googleReviewCount: 22,
    googleServiceAccJson: '',
    googleCalendarEmail: '',
  });

  useEffect(() => {
    fetch('/api/settings', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setFormData((prev) => ({
          ...prev,
          ...data,
          googleServiceAccJson: data.googleServiceAccJson || '',
          googleCalendarEmail: data.googleCalendarEmail || '',
        }));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching settings:', err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return <div style={{ color: '#94a3b8', padding: '2rem' }}><Loader2 className="animate-spin" /> Loading settings...</div>;
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      
      {saved && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          fontSize: '0.95rem'
        }}>
          <CheckCircle2 size={20} />
          <span>Operational settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        
        {/* SECTION 1: BUSINESS CONTACT INFORMATION */}
        <div className="b-table-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
            BUSINESS CONTACT DETAILS
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="b-input-group">
              <label className="b-label">Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="b-input"
              />
            </div>

            <div className="b-input-group">
              <label className="b-label">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="b-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="b-input-group">
              <label className="b-label">Recipient Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="b-input"
              />
            </div>

            <div className="b-input-group">
              <label className="b-label">Workshop Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="b-input"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: SMS & INTAKE ALERTS */}
        <div className="b-table-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
            INTAKE NOTIFICATION ALERTS
          </h3>

          <div className="b-input-group">
            <label className="b-label">SMS Alert Mobile Number</label>
            <input
              type="text"
              value={formData.smsAlertNumber}
              onChange={(e) => setFormData({ ...formData, smsAlertNumber: e.target.value })}
              className="b-input"
            />
            <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
              Instant SMS text messages will be sent to this number when a customer submits a quote or booking.
            </span>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: '#fff', fontSize: '0.95rem' }}>
              <input
                type="checkbox"
                checked={formData.autoReplyCustomerEmail}
                onChange={(e) => setFormData({ ...formData, autoReplyCustomerEmail: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#0a73ff' }}
              />
              Send instant confirmation email to customer upon quote submission
            </label>
          </div>
        </div>

        {/* SECTION 3: FILM PRICING PROFILES */}
        <div className="b-table-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
            FILM PRICING PROFILES &amp; SITE STATS
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="b-input-group">
              <label className="b-label">Budget Price - CC Extreme Nanocarbon ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.budgetFilmPrice}
                onChange={(e) => setFormData({ ...formData, budgetFilmPrice: Number(e.target.value) || 0 })}
                className="b-input"
              />
            </div>

            <div className="b-input-group">
              <label className="b-label">Premium Price - Black Armor ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.premiumFilmPrice}
                onChange={(e) => setFormData({ ...formData, premiumFilmPrice: Number(e.target.value) || 0 })}
                className="b-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="b-input-group">
              <label className="b-label">Heat Rejection Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Leave blank for placeholder"
                value={formData.heatRejectionPercentage ?? ''}
                onChange={(e) => setFormData({ ...formData, heatRejectionPercentage: e.target.value === '' ? null : Number(e.target.value) })}
                className="b-input"
              />
              <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
                Displayed on the website hero section (e.g. 88%).
              </span>
            </div>

            <div className="b-input-group">
              <label className="b-label">Google Review Count</label>
              <input
                type="number"
                min="0"
                value={formData.googleReviewCount ?? 22}
                onChange={(e) => setFormData({ ...formData, googleReviewCount: Number(e.target.value) || 0 })}
                className="b-input"
              />
              <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
                Displayed on the Google Reviews badge (currently 22).
              </span>
            </div>
          </div>

          <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.5rem', display: 'inline-block' }}>
            These prices are used as quick-fill defaults in Quotes Manager. Admin can still manually override final quote prices.
          </span>
        </div>

        {/* SECTION 4: SOCIAL MEDIA LINKS */}
        <div className="b-table-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
            SOCIAL MEDIA LINKS
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="b-input-group">
              <label className="b-label">Facebook</label>
              <input
                type="text"
                value={formData.facebookLink}
                onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })}
                className="b-input"
              />
            </div>

            <div className="b-input-group">
              <label className="b-label">Instagram</label>
              <input
                type="text"
                value={formData.instagramLink}
                onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
                className="b-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div className="b-input-group">
              <label className="b-label">WhatsApp URL</label>
              <input
                type="text"
                value={formData.whatsappLink}
                onChange={(e) => setFormData({ ...formData, whatsappLink: e.target.value })}
                className="b-input"
              />
            </div>

            <div className="b-input-group">
              <label className="b-label">TikTok</label>
              <input
                type="text"
                value={formData.tiktokLink}
                onChange={(e) => setFormData({ ...formData, tiktokLink: e.target.value })}
                className="b-input"
              />
            </div>
          </div>
        </div>

        <div className="b-table-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar size={20} style={{ color: '#4285f4' }} />
            GOOGLE CALENDAR INTEGRATION
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Paste the Google service account JSON and the calendar email used for bookings and gsync.
          </p>
          <div className="b-input-group" style={{ marginBottom: '1.25rem' }}>
            <label className="b-label">Calendar email</label>
            <input
              type="email"
              value={formData.googleCalendarEmail}
              onChange={(e) => setFormData({ ...formData, googleCalendarEmail: e.target.value })}
              className="b-input"
              placeholder="calendar-id@gmail.com"
            />
          </div>
          <div className="b-input-group">
            <label className="b-label">Service account JSON</label>
            <textarea
              value={formData.googleServiceAccJson}
              maxLength={5000}
              rows={10}
              onChange={(e) => setFormData({ ...formData, googleServiceAccJson: e.target.value.slice(0, 5000) })}
              className="b-input"
              placeholder='{"type":"service_account", ... }'
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '0.82rem', minHeight: '180px', resize: 'vertical' }}
            />
            <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.4rem', textAlign: 'right' }}>
              {formData.googleServiceAccJson.length}/5000
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '0.9rem 2.25rem', fontSize: '1rem', opacity: saving ? 0.7 : 1 }}>
          <Save size={18} />
          {saving ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>

      </form>

      {/* SECTION 5: AVAILABILITY / WORKING HOURS */}
      <div className="b-table-card" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Clock size={20} style={{ color: '#f59e0b' }} />
          AVAILABILITY &amp; WORKING HOURS
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Manage your working hours and available booking slots. This controls when customers can see open time slots on the booking calendar.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', backgroundColor: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={22} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Set your working hours &amp; days off</div>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Configure available times and closed days. Closed days will not show slots on the booking form.</div>
          </div>
          <Link
            to="/admin/working-hours"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.7rem 1.35rem',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none', color: '#fff', borderRadius: '8px',
              cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700,
              textDecoration: 'none', whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
              flexShrink: 0,
            }}
          >
            <Clock size={15} />
            Manage Availability
          </Link>
        </div>
      </div>

    </div>

  );
}

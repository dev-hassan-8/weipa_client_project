import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle2, Clock3, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import CtaBanner from '@/components/CtaBanner';
import FilmProductDropdown from '@/components/FilmProductDropdown';
import { formatFilmSelection, isFilmSelectionComplete } from '@/lib/filmOptions';
import { useIntakeStore } from '@/lib/useIntakeStore';
import AnimatedSection from '@/components/AnimatedSection';

const SERVICE_OPTIONS = [
  'Automotive Tinting',
  'Residential Tinting',
  'Commercial Tinting',
];

const TIME_OPTIONS = [
  'Morning (8am - 12pm)',
  'Afternoon (12pm - 4:30pm)',
  'Saturday Appointment',
];

export default function BookingPage() {
  const addBooking = useIntakeStore((state) => state.addBooking);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [minDate, setMinDate] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Automotive Tinting',
    tintType: '',
    tintDetail: '',
    vehicleDetails: '',
    preferredDate: '',
    preferredTime: 'Morning (8am - 12pm)',
    notes: '',
  });

  useEffect(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    setMinDate(new Date(today.getTime() - offset).toISOString().split('T')[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.phone || !formData.email || !formData.preferredDate || !isFilmSelectionComplete({ tintType: formData.tintType, tintDetail: formData.tintDetail })) {
      setErrorMessage('Please fill in the required fields marked with an asterisk (*).');
      return;
    }

    const filmSelection = formatFilmSelection({ tintType: formData.tintType, tintDetail: formData.tintDetail });
    const notesWithFilm = formData.notes
      ? `${formData.notes}\n\nFilm selection: ${filmSelection}`
      : `Film selection: ${filmSelection}`;

    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          notes: notesWithFilm,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        addBooking({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service: formData.service,
          vehicleDetails: formData.vehicleDetails || 'Not specified',
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          notes: notesWithFilm,
        });
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section style={{
        position: 'relative',
        padding: '6rem 0 4rem',
        background: 'linear-gradient(135deg, #05080d 0%, #0b1118 100%)',
        textAlign: 'center',
      }}>
        <div className="container">
          <div className="section-badge animate-fade-down" style={{ justifyContent: 'center' }}>Reserve Your Visit</div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '1rem',
              lineHeight: 1.1,
            }}
          >
            BOOK YOUR <span style={{ color: '#0a73ff' }}>APPOINTMENT</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="section-subtitle" 
            style={{ margin: '0 auto' }}
          >
            Choose your service and preferred time, and we’ll confirm your tinting appointment for Weipa.
          </motion.p>
        </div>
      </section>

      <section style={{ padding: '4rem 0 6rem', backgroundColor: '#0b1118' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'start' }}>
            <AnimatedSection animation="fade-up">
              <div className="card-dark" style={{ borderTop: '4px solid #0a73ff' }}>
                <div style={{ marginBottom: '1.75rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: '#fff', marginBottom: '0.4rem' }}>
                    BOOK YOUR SERVICE
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    We recommend booking at least 24 hours in advance for the best availability.
                  </p>
                </div>

                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', padding: '2.5rem 1.25rem', backgroundColor: 'rgba(10, 115, 255, 0.08)', borderRadius: '10px', border: '1px solid rgba(10, 115, 255, 0.3)' }}
                  >
                    <CheckCircle2 size={64} color="#0a73ff" style={{ margin: '0 auto 1rem auto' }} />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', color: '#fff', marginBottom: '0.75rem' }}>
                      BOOKING REQUEST SENT!
                    </h3>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      Thanks <span style={{ color: '#fff', fontWeight: 600 }}>{formData.name}</span> — we’ve received your booking request for <span style={{ color: '#0a73ff' }}>{formData.service}</span> ({formatFilmSelection({ tintType: formData.tintType, tintDetail: formData.tintDetail })}) on <span style={{ color: '#fff' }}>{formData.preferredDate}</span>.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          service: 'Automotive Tinting',
                          tintType: '',
                          tintDetail: '',
                          vehicleDetails: '',
                          preferredDate: '',
                          preferredTime: 'Morning (8am - 12pm)',
                          notes: '',
                        });
                      }}
                      className="btn-outline-blue"
                    >
                      BOOK ANOTHER APPOINTMENT
                    </motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                    {errorMessage && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.88rem' }}
                      >
                        <AlertCircle size={18} />
                        <span>{errorMessage}</span>
                      </motion.div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label className="b-label">FULL NAME <span style={{ color: '#0a73ff' }}>*</span></label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                          className="b-input"
                        />
                      </div>

                      <div>
                        <label className="b-label">PHONE NUMBER <span style={{ color: '#0a73ff' }}>*</span></label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="04XX XXX XXX"
                          className="b-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="b-label">EMAIL ADDRESS <span style={{ color: '#0a73ff' }}>*</span></label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="b-input"
                      />
                    </div>

                    <div>
                      <label className="b-label">SERVICE TYPE</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="b-select"
                      >
                        {SERVICE_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <FilmProductDropdown
                      required
                      value={{ tintType: formData.tintType, tintDetail: formData.tintDetail }}
                      onChange={(filmSelection) =>
                        setFormData((prev) => ({
                          ...prev,
                          tintType: filmSelection.tintType,
                          tintDetail: filmSelection.tintDetail,
                        }))
                      }
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label className="b-label">PREFERRED DATE <span style={{ color: '#0a73ff' }}>*</span></label>
                        <div style={{ position: 'relative' }}>
                          <CalendarDays size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                          <input
                            type="date"
                            required
                            min={minDate}
                            value={formData.preferredDate}
                            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                            className="b-input"
                            style={{ paddingLeft: '2.6rem' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="b-label">PREFERRED TIME</label>
                        <div style={{ position: 'relative' }}>
                          <Clock3 size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                          <select
                            value={formData.preferredTime}
                            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                            className="b-select"
                            style={{ paddingLeft: '2.6rem' }}
                          >
                            {TIME_OPTIONS.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="b-label">VEHICLE / PROPERTY DETAILS</label>
                      <input
                        type="text"
                        value={formData.vehicleDetails}
                        onChange={(e) => setFormData({ ...formData, vehicleDetails: e.target.value })}
                        placeholder="e.g. 2024 Toyota Hilux / 4 bedroom residence"
                        className="b-input"
                      />
                    </div>

                    <div>
                      <label className="b-label">NOTES</label>
                      <textarea
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Share any extra details for the team"
                        className="b-input"
                        style={{ minHeight: '110px', resize: 'vertical' }}
                      />
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      className="btn-primary" 
                      style={{ width: '100%', padding: '1rem', justifyContent: 'center' }} 
                      disabled={loading}
                    >
                      {loading ? 'Submitting…' : 'CONFIRM BOOKING REQUEST'}
                      {!loading && <ArrowRight size={18} />}
                    </motion.button>
                  </form>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={150}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="card-dark feature-card" 
                  style={{ borderTop: '4px solid #0a73ff' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                    <div 
                      className="feature-icon-badge"
                      style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(10, 115, 255, 0.12)', border: '1px solid rgba(10, 115, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a73ff' }}
                    >
                      <Sparkles size={20} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff' }}>Why book with Weipa Tint?</h3>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', color: '#cbd5e1' }}>
                    {[
                      'Fast response from our local team in Weipa',
                      'Flexible appointment windows for residential, automotive and commercial jobs',
                      'Professional consultation before installation starts',
                    ].map((item) => (
                      <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', lineHeight: 1.5 }}>
                        <CheckCircle2 size={17} color="#0a73ff" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -4 }}
                  className="feature-card"
                  style={{ borderRadius: '10px', background: 'linear-gradient(135deg, rgba(10,115,255,0.16), rgba(10,115,255,0.04))', border: '1px solid rgba(10,115,255,0.25)', padding: '1.5rem', transition: 'all 0.3s ease' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.8rem', color: '#0a73ff' }}>
                    <ShieldCheck size={18} />
                    <span style={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.8rem' }}>Need help now?</span>
                  </div>
                  <p style={{ color: '#e2e8f0', lineHeight: 1.6, marginBottom: '1rem' }}>
                    Call us directly for urgent requests or to ask about available slots this week.
                  </p>
                  <a href="tel:0498367791" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#fff', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s ease' }}>
                    <Phone size={16} color="#0a73ff" />
                    0498 367 791
                  </a>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -4 }}
                  className="card-dark feature-card" 
                  style={{ padding: '1.25rem 1.4rem' }}
                >
                  <p style={{ color: '#94a3b8', marginBottom: '0.75rem' }}>Prefer to request a quote first?</p>
                  <Link to="/quote" className="btn-outline-blue" style={{ display: 'inline-flex', width: 'fit-content' }}>
                    GET A QUOTE
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Clock, Award, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import CtaBanner from '@/components/CtaBanner';
import FilmProductDropdown from '@/components/FilmProductDropdown';
import { FILM_OPTIONS, isFilmSelectionComplete } from '@/lib/filmOptions';
import { brisbaneTodayYmd } from '@/lib/brisbaneTime';
import { useIntakeStore } from '@/lib/useIntakeStore';
import AnimatedSection from '@/components/AnimatedSection';

function QuoteFormContent() {
  const [searchParams] = useSearchParams();
  const initialFilm = searchParams.get('film') === 'ceramic' ? FILM_OPTIONS.premium.value : '';
  const addQuote = useIntakeStore((state) => state.addQuote);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    carMake: '',
    yearModel: '',
    tintType: initialFilm,
    tintDetail: '',
    oldTintRemoval: 'NO' as 'YES' | 'NO',
    windowVisors: 'NO' as 'YES' | 'NO',
    preferredDate: '',
    comments: '',
  });

  const [minDate, setMinDate] = useState('');

  React.useEffect(() => {
    setMinDate(brisbaneTodayYmd());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.phone || !formData.email || !formData.carMake || !formData.yearModel || !isFilmSelectionComplete({ tintType: formData.tintType, tintDetail: formData.tintDetail })) {
      setErrorMessage('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        addQuote(data.quote);
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
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '6rem 0 4rem 0',
        backgroundColor: '#05080d',
        textAlign: 'center'
      }}>
        <div className="container">
          <div className="section-badge animate-fade-down" style={{ justifyContent: 'center' }}>Tailored Quote Request</div>
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
              lineHeight: 1.1
            }}
          >
            GET A <span style={{ color: '#0a73ff' }}>QUOTE</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="section-subtitle"
            style={{ margin: '0 auto' }}
          >
            Premium tinting, tailored to your drive. Fill out the form and we'll be in touch with a personalized quote.
          </motion.p>
        </div>
      </section>

      {/* TWO-COLUMN FORM SECTION */}
      <section style={{ padding: '4rem 0 6rem 0', backgroundColor: '#0b1118' }}>
        <div className="container">
          <div className="grid-2">

            {/* LEFT COLUMN: REQUEST FORM */}
            <AnimatedSection animation="fade-up">
              <div className="card-dark" style={{ borderTop: '4px solid #0a73ff' }}>
                <div style={{ marginBottom: '1.75rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: '#fff', marginBottom: '0.4rem' }}>
                    REQUEST YOUR QUOTE
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                    Fields marked with an asterisk (<span style={{ color: '#0a73ff' }}>*</span>) are mandatory.
                  </p>
                </div>

                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: 'rgba(10, 115, 255, 0.08)', borderRadius: '8px', border: '1px solid rgba(10, 115, 255, 0.3)' }}
                  >
                    <CheckCircle2 size={64} color="#0a73ff" style={{ margin: '0 auto 1.25rem auto' }} />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#fff', marginBottom: '0.75rem' }}>
                      QUOTE REQUEST SUBMITTED!
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      Thank you <span style={{ color: '#fff', fontWeight: 600 }}>{formData.name}</span>! We have received your request for <span style={{ color: '#0a73ff' }}>{formData.carMake} {formData.yearModel}</span> ({formData.tintType} — {formData.tintDetail}).
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
                      Our team will prepare your estimate and contact you via phone (<span style={{ color: '#fff' }}>{formData.phone}</span>) or email within 24 hours.
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
                          carMake: '',
                          yearModel: '',
                          tintType: initialFilm,
                          tintDetail: '',
                          oldTintRemoval: 'NO',
                          windowVisors: 'NO',
                          preferredDate: '',
                          comments: ''
                        });
                      }}
                      className="btn-outline-blue"
                    >
                      SUBMIT ANOTHER QUOTE
                    </motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label className="b-label">
                          NAME <span style={{ color: '#0a73ff' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="b-input"
                        />
                      </div>

                      <div>
                        <label className="b-label">
                          PHONE NUMBER <span style={{ color: '#0a73ff' }}>*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="04XX XXX XXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="b-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="b-label">
                        EMAIL ADDRESS <span style={{ color: '#0a73ff' }}>*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="youremail@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="b-input"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label className="b-label">
                          CAR MAKE <span style={{ color: '#0a73ff' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Toyota, Ford, Isuzu"
                          value={formData.carMake}
                          onChange={(e) => setFormData({ ...formData, carMake: e.target.value })}
                          className="b-input"
                        />
                      </div>

                      <div>
                        <label className="b-label">
                          YEAR AND MODEL <span style={{ color: '#0a73ff' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Model 3 Performance 2024"
                          value={formData.yearModel}
                          onChange={(e) => setFormData({ ...formData, yearModel: e.target.value })}
                          className="b-input"
                        />
                      </div>
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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label className="b-label" style={{ marginBottom: '0.5rem' }}>
                          OLD TINT REMOVAL <span style={{ color: '#0a73ff' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', paddingTop: '0.2rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                            <input
                              type="radio"
                              name="oldTint"
                              value="YES"
                              checked={formData.oldTintRemoval === 'YES'}
                              onChange={() => setFormData({ ...formData, oldTintRemoval: 'YES' })}
                              style={{ accentColor: '#0a73ff' }}
                            />
                            YES
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                            <input
                              type="radio"
                              name="oldTint"
                              value="NO"
                              checked={formData.oldTintRemoval === 'NO'}
                              onChange={() => setFormData({ ...formData, oldTintRemoval: 'NO' })}
                              style={{ accentColor: '#0a73ff' }}
                            />
                            NO
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="b-label" style={{ marginBottom: '0.5rem' }}>
                          WINDOW VISORS <span style={{ color: '#0a73ff' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', paddingTop: '0.2rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                            <input
                              type="radio"
                              name="visors"
                              value="YES"
                              checked={formData.windowVisors === 'YES'}
                              onChange={() => setFormData({ ...formData, windowVisors: 'YES' })}
                              style={{ accentColor: '#0a73ff' }}
                            />
                            YES
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                            <input
                              type="radio"
                              name="visors"
                              value="NO"
                              checked={formData.windowVisors === 'NO'}
                              onChange={() => setFormData({ ...formData, windowVisors: 'NO' })}
                              style={{ accentColor: '#0a73ff' }}
                            />
                            NO
                          </label>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                      <div>
                        <label className="b-label">
                          PREFERRED DATE
                        </label>
                        <input
                          type="date"
                          min={minDate}
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                          className="b-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="b-label">
                        ADDITIONAL COMMENTS
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Any additional details or special requests..."
                        value={formData.comments}
                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                        className="b-textarea"
                      />
                    </div>

                    {/* Google reCAPTCHA Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#05080d',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#94a3b8',
                      fontSize: '0.8rem'
                    }}>
                      <ShieldCheck size={20} color="#0a73ff" />
                      <span>Protected by Google reCAPTCHA v3 &amp; server-side rate limiting.</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                      style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    >
                      {loading ? 'SUBMITTING REQUEST...' : 'SUBMIT REQUEST'}
                    </motion.button>

                    <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.78rem' }}>
                      🔒 Your details are secure and will only be used to provide your personalized quote.
                    </p>

                  </form>
                )}
              </div>
            </AnimatedSection>

            {/* RIGHT COLUMN: FILM OPTIONS INFO & VALUE CARDS */}
            <AnimatedSection animation="fade-up" delay={150}>
              <div>
                <motion.div 
                  className="card-dark feature-card" 
                  whileHover={{ y: -4 }}
                  style={{ marginBottom: '2rem', borderLeft: '4px solid #0A73FF' }}
                >
                  <h3 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '1.25rem' }}>
                    OUR PREMIUM FILM OPTIONS
                  </h3>

                  <div style={{ marginBottom: '1.5rem', paddingBottom: '2.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1rem', marginBottom: '9px' }}>
                      BLACK ARMOUR CERAMIC FILM
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '16px', color: '#CBD5E1' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={15} color="#0A73FF" /> Around 18% better heat rejection</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={15} color="#0A73FF" /> Superior scratch resistance</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={15} color="#0A73FF" /> Thicker film construction</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={15} color="#0A73FF" /> Superior comfort and optical clarity</li>
                    </ul>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '1.25rem' }}>
                      OUR BUDGET FRIENDLY FILM OPTIONS
                    </h3>
                    <div style={{ color: '#0A73FF', fontWeight: 700, fontSize: '1rem', marginBottom: '9px' }}>
                      CCXTREME NANO CARBON
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '16px', color: '#CBD5E1' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={15} color="#0A73FF" /> Advanced nano carbon technology</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={15} color="#0A73FF" /> Excellent heat rejection</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={15} color="#0A73FF" /> Blocks UV rays up to 99%</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={15} color="#0A73FF" /> Reduces glare and eye strain</li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <CtaBanner title="READY TO UPGRADE YOUR DRIVE?" subtitle="Drive cooler. Look sharper. Trust Weipa's tinting experts." />
    </>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#05080d', color: '#fff' }}>
        Loading Quote Form...
      </div>
    }>
      <QuoteFormContent />
    </Suspense>
  );
}

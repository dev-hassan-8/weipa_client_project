import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import CtaBanner from '@/components/CtaBanner';
import FilmProductDropdown from '@/components/FilmProductDropdown';
import { formatFilmSelection, isFilmSelectionComplete } from '@/lib/filmOptions';
import { useIntakeStore } from '@/lib/useIntakeStore';
import AnimatedSection from '@/components/AnimatedSection';

export default function ContactPage() {
  const addEnquiry = useIntakeStore((state) => state.addEnquiry);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tintType: '',
    tintDetail: '',
    message: '',
  });

  const [settings, setSettings] = useState({
    phone: '0498 367 791',
    email: 'weipatint@gmail.com',
    location: 'Weipa, QLD 4874',
    hoursMonFri: '8:00am – 4:30pm',
    hoursSat: 'By appointment'
  });

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.phone) {
          setSettings(data);
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.phone || !formData.email || !formData.message || !isFilmSelectionComplete({ tintType: formData.tintType, tintDetail: formData.tintDetail })) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service: formatFilmSelection({ tintType: formData.tintType, tintDetail: formData.tintDetail }),
          message: formData.message,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        addEnquiry(data.enquiry);
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
          <div className="section-badge animate-fade-down" style={{ justifyContent: 'center' }}>We're Here To Help</div>
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
            CONTACT <span style={{ color: '#0a73ff' }}>US</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="section-subtitle" 
            style={{ margin: '0 auto 2rem auto' }}
          >
            Have questions or ready to upgrade your windows? We're here to help. Get in touch with our team today.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link to="/quote" className="btn-primary">GET A QUOTE</Link>
            </motion.div>
            <motion.a 
              whileHover={{ scale: 1.04 }} 
              whileTap={{ scale: 0.96 }}
              href="tel:0498367791" 
              className="btn-secondary" 
              style={{ textDecoration: 'none' }}
            >
              CALL US NOW
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* TWO-COLUMN CONTACT SECTION */}
      <section style={{ padding: '4rem 0 6rem 0', backgroundColor: '#0b1118' }}>
        <div className="container">
          <div className="grid-2">
            
            {/* LEFT COLUMN: GET IN TOUCH */}
            <AnimatedSection animation="fade-up">
              <div>
                <div className="section-badge">Get In Touch</div>
                <h2 className="section-title">OUR CONTACT INFORMATION</h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                  Reach out to us directly via phone, email, or visit our Weipa location. We respond promptly to all enquiries.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                  
                  {/* Phone Card */}
                  <motion.a 
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    href={`tel:${settings.phone.replace(/\s/g, '')}`} 
                    className="card-dark feature-card" 
                    style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.5rem', textDecoration: 'none' }}
                  >
                    <div 
                      className="feature-icon-badge"
                      style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(10, 115, 255, 0.12)', border: '1px solid rgba(10, 115, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a73ff' }}
                    >
                      <Phone size={22} />
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>PHONE</div>
                      <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>{settings.phone}</div>
                    </div>
                  </motion.a>

                  {/* Email Card */}
                  <motion.a 
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    href={`mailto:${settings.email}`} 
                    className="card-dark feature-card" 
                    style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.5rem', textDecoration: 'none' }}
                  >
                    <div 
                      className="feature-icon-badge"
                      style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(10, 115, 255, 0.12)', border: '1px solid rgba(10, 115, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a73ff' }}
                    >
                      <Mail size={22} />
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>EMAIL</div>
                      <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{settings.email}</div>
                    </div>
                  </motion.a>

                  {/* Location Card */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="card-dark feature-card" 
                    style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.5rem' }}
                  >
                    <div 
                      className="feature-icon-badge"
                      style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(10, 115, 255, 0.12)', border: '1px solid rgba(10, 115, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a73ff' }}
                    >
                      <MapPin size={22} />
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>LOCATION</div>
                      <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{settings.location}</div>
                    </div>
                  </motion.div>

                  {/* Hours Card */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="card-dark feature-card" 
                    style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.5rem' }}
                  >
                    <div 
                      className="feature-icon-badge"
                      style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(10, 115, 255, 0.12)', border: '1px solid rgba(10, 115, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a73ff' }}
                    >
                      <Clock size={22} />
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>BUSINESS HOURS</div>
                      <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>Mon - Fri: {settings.hoursMonFri}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Saturday: {settings.hoursSat}</div>
                    </div>
                  </motion.div>

                </div>
              </div>
            </AnimatedSection>

            {/* RIGHT COLUMN: SEND US A MESSAGE FORM */}
            <AnimatedSection animation="fade-up" delay={120}>
              <div className="card-dark" style={{ borderTop: '4px solid #0a73ff' }}>
                <div style={{ marginBottom: '1.75rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: '#fff', marginBottom: '0.4rem' }}>
                    SEND US A MESSAGE
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                    Fill in your details below and we will get back to you shortly.
                  </p>
                </div>

                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: 'rgba(10, 115, 255, 0.08)', borderRadius: '8px', border: '1px solid rgba(10, 115, 255, 0.3)' }}
                  >
                    <CheckCircle2 size={60} color="#0a73ff" style={{ margin: '0 auto 1.25rem auto' }} />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#fff', marginBottom: '0.75rem' }}>
                      MESSAGE SENT!
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      Thank you <span style={{ color: '#fff', fontWeight: 600 }}>{formData.name}</span>. Your enquiry has been delivered to Chris &amp; the Weipa Tint team.
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
                          tintType: '',
                          tintDetail: '',
                          message: ''
                        });
                      }}
                      className="btn-outline-blue"
                    >
                      SEND ANOTHER MESSAGE
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

                    <div>
                      <label className="b-label">
                        FULL NAME *
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="b-input"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label className="b-label">
                          PHONE NUMBER *
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

                      <div>
                        <label className="b-label">
                          EMAIL ADDRESS *
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
                    </div>

                    <FilmProductDropdown
                      label="SERVICE INTERESTED IN"
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

                    <div>
                      <label className="b-label">
                        MESSAGE *
                      </label>
                      <textarea 
                        rows={5}
                        required
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                      {loading ? 'SENDING MESSAGE...' : 'SEND MESSAGE'}
                    </motion.button>

                  </form>
                )}
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* FIND US IN WEIPA LOCATION SECTION */}
      <section style={{ padding: '6rem 0', backgroundColor: '#05080d' }}>
        <div className="container">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="section-badge" style={{ justifyContent: 'center' }}>LOCATION</div>
              <h2 className="section-title">FIND US IN WEIPA</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                Conveniently located to service vehicle owners and properties across Weipa and surrounding areas.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="scale-in" delay={120}>
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(10, 115, 255, 0.3)',
              height: '420px',
              backgroundColor: '#0b1118',
              boxShadow: '0 15px 40px rgba(0,0,0,0.7)'
            }}>
              <iframe 
                title="Weipa QLD Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62445.86431940989!2d141.84150534999998!3d-12.6322055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6984e7ad1d2a1387%3A0x500eef17f211330!2sWeipa%20QLD%204874%2C%20Australia!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.5rem',
                backgroundColor: 'rgba(5, 8, 13, 0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(10, 115, 255, 0.4)',
                padding: '1.25rem 1.75rem',
                borderRadius: '8px',
                maxWidth: '320px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0a73ff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                  <MapPin size={18} />
                  WEIPA TINT WORKSHOP
                </div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>{settings.location}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '0.2rem' }}>Phone: {settings.phone}</div>
              </div>
            </div>
          </AnimatedSection>

        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <CtaBanner title="READY TO UPGRADE YOUR DRIVE?" subtitle="Drive cooler. Look sharper. Trust Weipa's tinting experts." />
    </>
  );
}

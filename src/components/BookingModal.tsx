import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntakeStore } from '@/lib/useIntakeStore';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const addBooking = useIntakeStore((state) => state.addBooking);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Automotive Tinting',
    vehicleDetails: '',
    preferredDate: '',
    preferredTime: 'Morning (8am - 12pm)',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to Zustand intake store
    addBooking({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      service: formData.service,
      vehicleDetails: formData.vehicleDetails || 'Not specified',
      preferredDate: formData.preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: formData.preferredTime,
      notes: formData.notes,
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="b-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div 
            className="b-modal-card" 
            style={{ maxWidth: '560px' }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            
            <button 
              onClick={onClose}
              className="b-modal-close"
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', cursor: 'pointer' }}
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem 1rem' }}
              >
                <CheckCircle size={64} color="#0a73ff" style={{ margin: '0 auto 1.5rem auto' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                  Booking Request Received!
                </h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Thank you <span style={{ color: '#fff', fontWeight: 600 }}>{formData.name}</span>. We have received your reservation request for <span style={{ color: '#0a73ff' }}>{formData.service}</span> on <span style={{ color: '#fff' }}>{formData.preferredDate || 'your preferred date'}</span>. Our team will contact you shortly to confirm your time slot.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset} 
                  className="btn-primary" 
                  style={{ width: '100%' }}
                >
                  Close
                </motion.button>
              </motion.div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#0a73ff', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Online Reservation
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', textTransform: 'uppercase' }}>
                    Book Your Tinting Appointment
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    Schedule your premium window tinting with Weipa Tint.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label className="b-label">Full Name *</label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter your name" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="b-input"
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="mobile-stack">
                    <div>
                      <label className="b-label">Phone Number *</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input 
                          type="tel" 
                          required 
                          placeholder="04XX XXX XXX" 
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="b-input"
                          style={{ paddingLeft: '2.5rem' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="b-label">Email Address *</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input 
                          type="email" 
                          required 
                          placeholder="you@example.com" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="b-input"
                          style={{ paddingLeft: '2.5rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="b-label">Service Required</label>
                    <select 
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="b-select"
                    >
                      <option value="Automotive Tinting">Automotive Tinting (Car/Ute/4WD)</option>
                      <option value="Residential Tinting">Residential Tinting (Home)</option>
                      <option value="Commercial Tinting">Commercial Tinting (Office/Store)</option>
                    </select>
                  </div>

                  <div>
                    <label className="b-label">Vehicle Make / Model (if automotive)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2024 Toyota Landcruiser 79 Series" 
                      value={formData.vehicleDetails}
                      onChange={(e) => setFormData({ ...formData, vehicleDetails: e.target.value })}
                      className="b-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="mobile-stack">
                    <div>
                      <label className="b-label">Preferred Date</label>
                      <div style={{ position: 'relative' }}>
                        <Calendar size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input 
                          type="date" 
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                          className="b-input"
                          style={{ paddingLeft: '2.5rem' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="b-label">Preferred Time Slot</label>
                      <div style={{ position: 'relative' }}>
                        <Clock size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <select 
                          value={formData.preferredTime}
                          onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                          className="b-select"
                          style={{ paddingLeft: '2.5rem' }}
                        >
                          <option value="Morning (8am - 12pm)">Morning (8am - 12pm)</option>
                          <option value="Afternoon (12pm - 4:30pm)">Afternoon (12pm - 4:30pm)</option>
                          <option value="Saturday by Appointment">Saturday by Appointment</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="b-label">Special Requests / Notes</label>
                    <textarea 
                      rows={3} 
                      placeholder="Any specific film preferences or notes for our installer..." 
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="b-textarea"
                    />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="btn-primary" 
                    style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
                  >
                    Confirm Booking Request
                  </motion.button>
                </form>
              </div>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

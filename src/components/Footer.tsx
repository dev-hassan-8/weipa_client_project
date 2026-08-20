import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { FacebookIcon, InstagramIcon, WhatsappIcon, TiktokIcon } from './SocialIcons';

export default function Footer() {
  const [settings, setSettings] = useState({
    phone: '0498 367 791',
    email: 'weipatint@gmail.com',
    location: 'Weipa, QLD 4874',
    facebookLink: 'https://www.facebook.com/people/Weipa-Window-Tinting/61575595830852/',
    instagramLink: 'https://instagram.com',
    whatsappLink: 'https://wa.me/61498367791',
    tiktokLink: 'https://tiktok.com'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.phone) {
          setSettings(data);
        }
      })
      .catch(err => console.error('Error fetching settings for footer:', err));
  }, []);

  const columnVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        delay: i * 0.1,
        ease: [0.16, 1, 0.3, 1] as const,
      }
    })
  };

  return (
    <footer style={{
      backgroundColor: '#05080d',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      paddingTop: '4.5rem',
      paddingBottom: '2.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Subtle Ambient Glow */}
      <motion.div 
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.14, 0.08]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(10, 115, 255, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
          pointerEvents: 'none'
        }} 
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="footer-grid">
          
          {/* Column 1: Logo & Bio */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={columnVariants}
          >
            <Link to="/" style={{ display: 'inline-flex', flexDirection: 'column', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.08em' }}>
                  WEIPA
                </span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: '#0a73ff', letterSpacing: '0.08em' }}>
                  TINT
                </span>
              </div>
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.22em', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                PREMIUM WINDOW TINTING
              </span>
            </Link>

            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '320px' }}>
              Far North Queensland’s trusted specialists for premium automotive, residential, and commercial window tinting built to withstand Australia's harshest climate.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.85rem' }}>
              <Shield size={16} color="#0a73ff" />
              <span>Lifetime Manufacturer Warranty Supported</span>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={columnVariants}
          >
            <h4 style={{ 
              color: '#ffffff', 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.1rem', 
              letterSpacing: '0.05em',
              marginBottom: '1.25rem',
              borderLeft: '3px solid #0a73ff',
              paddingLeft: '0.6rem'
            }}>
              QUICK LINKS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', padding: 0, margin: 0 }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/quote', label: 'Get a Quote' },
                { to: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.to}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link 
                      to={link.to} 
                      style={{ 
                        color: '#cbd5e1', 
                        textDecoration: 'none',
                        display: 'inline-block',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#0a73ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Services */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={columnVariants}
          >
            <h4 style={{ 
              color: '#ffffff', 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.1rem', 
              letterSpacing: '0.05em',
              marginBottom: '1.25rem',
              borderLeft: '3px solid #0a73ff',
              paddingLeft: '0.6rem'
            }}>
              SERVICES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', padding: 0, margin: 0 }}>
              {[
                { to: '/automotive', label: 'Automotive Tinting' },
                { to: '/residential', label: 'Residential Tinting' },
                { to: '/commercial', label: 'Commercial Tinting' },
              ].map((service) => (
                <li key={service.to}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link 
                      to={service.to} 
                      style={{ 
                        color: '#cbd5e1', 
                        textDecoration: 'none',
                        display: 'inline-block',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#0a73ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                    >
                      {service.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact Us & Social */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={columnVariants}
          >
            <h4 style={{ 
              color: '#ffffff', 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.1rem', 
              letterSpacing: '0.05em',
              marginBottom: '1.25rem',
              borderLeft: '3px solid #0a73ff',
              paddingLeft: '0.6rem'
            }}>
              CONTACT US
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
              <motion.a 
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                href={`tel:${settings.phone.replace(/\s/g, '')}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0a73ff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
              >
                <div style={{ width: '30px', height: '30px', borderRadius: '6px', backgroundColor: 'rgba(10, 115, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={16} color="#0a73ff" />
                </div>
                <span>{settings.phone}</span>
              </motion.a>

              <motion.a 
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                href={`mailto:${settings.email}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0a73ff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
              >
                <div style={{ width: '30px', height: '30px', borderRadius: '6px', backgroundColor: 'rgba(10, 115, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={16} color="#0a73ff" />
                </div>
                <span>{settings.email}</span>
              </motion.a>

              <motion.div 
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}
              >
                <div style={{ width: '30px', height: '30px', borderRadius: '6px', backgroundColor: 'rgba(10, 115, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={16} color="#0a73ff" />
                </div>
                <span>{settings.location}</span>
              </motion.div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.25rem' }}>FOLLOW US</span>
              {settings.facebookLink && (
                <motion.a 
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(10, 115, 255, 0.25)', borderColor: '#0a73ff' }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                  href={settings.facebookLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
                >
                  <FacebookIcon size={18} />
                </motion.a>
              )}
              {settings.instagramLink && (
                <motion.a 
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(225, 48, 108, 0.25)', borderColor: '#E1306C' }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                  href={settings.instagramLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
                >
                  <InstagramIcon size={18} />
                </motion.a>
              )}
              {settings.whatsappLink && (
                <motion.a 
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(37, 211, 102, 0.25)', borderColor: '#25D366' }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                  href={settings.whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="WhatsApp"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
                >
                  <WhatsappIcon size={18} />
                </motion.a>
              )}
              {settings.tiktokLink && (
                <motion.a 
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: '#ffffff' }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                  href={settings.tiktokLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="TikTok"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
                >
                  <TiktokIcon size={18} />
                </motion.a>
              )}
            </div>
          </motion.div>

        </div>

        {/* Bottom copyright line */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            color: '#64748b',
            fontSize: '0.85rem'
          }}
        >
          <div>
            © {new Date().getFullYear()} Weipa Tint. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link 
              to="/contact" 
              style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#cbd5e1')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              Privacy Policy
            </Link>
            <Link 
              to="/contact" 
              style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#cbd5e1')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              Terms & Conditions
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

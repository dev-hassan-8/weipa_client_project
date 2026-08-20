import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOGO_URL } from '@/lib/logoUrl';

export default function Navbar() {
  const pathname = useLocation().pathname;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { 
      name: 'Services', 
      href: '/automotive',
      dropdown: [
        { name: 'Automotive Tinting', href: '/automotive' },
        { name: 'Residential Tinting', href: '/residential' },
        { name: 'Commercial Tinting', href: '/commercial' },
      ]
    },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Get a Quote', href: '/quote' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: isScrolled ? 'rgba(5, 8, 13, 0.95)' : 'rgba(5, 8, 13, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: isScrolled ? '0.75rem 0' : '1.1rem 0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <motion.img
              src={LOGO_URL}
              alt="Weipa Tint"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                height: isScrolled ? '56px' : '64px',
                width: 'auto',
                maxWidth: '220px',
                objectFit: 'contain',
                transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.dropdown && link.dropdown.some(sub => pathname === sub.href));
              
              if (link.dropdown) {
                return (
                  <div 
                    key={link.name}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'none',
                      border: 'none',
                      color: isActive ? '#0a73ff' : '#cbd5e1',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: '0.5rem 0',
                      transition: 'color 0.2s ease',
                    }}>
                      Services
                      <ChevronDown 
                        size={14} 
                        style={{ 
                          transform: servicesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' 
                        }} 
                      />
                    </button>

                    <AnimatePresence>
                      {servicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            backgroundColor: 'rgba(11, 17, 24, 0.98)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: '1px solid rgba(10, 115, 255, 0.3)',
                            borderRadius: '8px',
                            padding: '0.5rem 0',
                            minWidth: '220px',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.6), 0 0 20px rgba(10, 115, 255, 0.15)',
                            zIndex: 100,
                          }}
                        >
                          {link.dropdown.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link 
                                key={sub.name} 
                                to={sub.href}
                                style={{
                                  display: 'block',
                                  padding: '0.75rem 1.25rem',
                                  color: isSubActive ? '#0a73ff' : '#e2e8f0',
                                  fontSize: '0.88rem',
                                  fontWeight: 500,
                                  textDecoration: 'none',
                                  backgroundColor: isSubActive ? 'rgba(10, 115, 255, 0.12)' : 'transparent',
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(10, 115, 255, 0.16)';
                                  e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = isSubActive ? 'rgba(10, 115, 255, 0.12)' : 'transparent';
                                  e.currentTarget.style.transform = 'translateX(0)';
                                }}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link 
                  key={link.name} 
                  to={link.href}
                  style={{
                    color: isActive ? '#0a73ff' : '#cbd5e1',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    position: 'relative',
                    padding: '0.5rem 0',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-indicator"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: '#0a73ff',
                        boxShadow: '0 0 8px #0a73ff',
                        borderRadius: '2px',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Call & CTA Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <motion.a 
              href="tel:0498367791"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
              className="desktop-nav"
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(10, 115, 255, 0.15)',
                border: '1px solid rgba(10, 115, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0a73ff',
                boxShadow: '0 0 12px rgba(10, 115, 255, 0.25)',
              }}>
                <Phone size={15} />
              </div>
              <span style={{ letterSpacing: '0.02em' }}>0498 367 791</span>
            </motion.a>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link 
                to="/quote"
                className="btn-primary" 
                style={{ padding: '0.65rem 1.35rem', fontSize: '0.88rem' }}
              >
                GET A QUOTE
              </Link>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                padding: '0.4rem',
              }}
              className="mobile-toggle"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'rgba(5, 8, 13, 0.98)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(10, 115, 255, 0.3)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 20px 50px rgba(0,0,0,0.95)',
                overflow: 'hidden',
              }}
            >
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      color: pathname === link.href ? '#0a73ff' : '#fff',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.15rem',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      fontWeight: 600,
                      display: 'block',
                      padding: '0.4rem 0',
                    }}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
                      {link.dropdown.map(sub => (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none' }}
                        >
                          • {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              <motion.a 
                href="tel:0498367791"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#0a73ff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <Phone size={18} />
                <span>Call 0498 367 791</span>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Sun, Eye, Shield, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import GoogleReviews from '@/components/GoogleReviews';
import CtaBanner from '@/components/CtaBanner';
import { usePageMedia } from '@/lib/usePageMedia';
import AnimatedSection from '@/components/AnimatedSection';

export default function AutomotivePage() {
  const media = usePageMedia('automotive');
  
  const heroImg = media.get('hero', '/images/auto-hero.png');
  const galleryImgs = media.getAll('gallery');

  const benefits = [
    { icon: Flame, title: 'HEAT REJECTION', desc: 'Stay cooler drive comfortable.' },
    { icon: Sun, title: 'UV PROTECTION', desc: 'Blocks harmful UV rays. Protects your skin.' },
    { icon: Shield, title: 'GLARE REDUCTION', desc: 'Reduce glare. Drive safer.' },
    { icon: Eye, title: 'PRIVACY', desc: 'Enhanced privacy. Peace of mind.' },
    { icon: Award, title: 'PREMIUM FINISH', desc: 'Non-metallic films. Lasting clarity.' },
  ];

  const vehicleCategories = [
    { name: 'CARS', desc: 'Sedans, Hatchbacks & Coupes', image: galleryImgs[0] || '/images/automotive-cars.png' },
    { name: 'SUVS', desc: 'Compact & Full-size SUVs', image: galleryImgs[1] || '/images/automotive-suvs.png' },
    { name: 'UTES', desc: 'Single & Dual Cab Work Utes', image: galleryImgs[2] || '/images/automotive-utes.png' },
    { name: '4WDS', desc: 'Heavy Duty 4WD & Off-road Rigs', image: galleryImgs[3] || '/images/automotive-4wds.png' },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '7rem 0 5rem 0',
        backgroundColor: '#05080d',
        overflow: 'hidden'
      }}>
        <motion.div 
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35
          }} 
        />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #05080d 0%, rgba(5,8,13,0.92) 55%, rgba(5,8,13,0.5) 100%)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '650px' }}>
            
            <div className="section-badge animate-fade-down">Automotive Window Protection</div>
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.05,
                marginBottom: '1rem',
                textTransform: 'uppercase'
              }}
            >
              AUTOMOTIVE <br />
              <span style={{ color: '#0a73ff' }}>TINTING</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                color: '#cbd5e1',
                fontSize: '1.2rem',
                lineHeight: 1.6,
                marginBottom: '2.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600
              }}
            >
              DRIVE COOLER. PROTECT MORE. LOOK BETTER.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/quote" className="btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1rem' }}>
                  GET A QUOTE
                  <ArrowRight size={18} />
                </Link>
              </motion.div>

              <motion.a 
                whileHover={{ scale: 1.04 }} 
                whileTap={{ scale: 0.96 }}
                href="tel:0498367791"
                className="btn-secondary" 
                style={{ padding: '1rem 2.25rem', fontSize: '1rem', textDecoration: 'none' }}
              >
                CALL US NOW
              </motion.a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FIVE BENEFIT ICONS BAR */}
      <section style={{ padding: '3.5rem 0', backgroundColor: '#0b1118', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container">
          <div className="grid-5">
            {benefits.map((b, i) => {
              const IconComponent = b.icon;
              return (
                <AnimatedSection key={i} animation="fade-up" delay={i * 70}>
                  <motion.div 
                    whileHover={{ y: -4 }}
                    style={{ 
                      textAlign: 'center', 
                      padding: '1rem',
                      cursor: 'default',
                    }}
                  >
                    <div 
                      className="feature-icon-badge"
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(10, 115, 255, 0.12)',
                        border: '1px solid rgba(10, 115, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0a73ff',
                        margin: '0 auto 0.75rem auto'
                      }}
                    >
                      <IconComponent size={22} />
                    </div>
                    <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.25rem' }}>{b.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{b.desc}</p>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* PREMIUM WINDOW FILMS COMPARISON */}
      <section style={{ padding: '6rem 0', backgroundColor: '#05080d' }}>
        <div className="container">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div className="section-badge" style={{ justifyContent: 'center' }}>FILM TECHNOLOGY</div>
              <h2 className="section-title">PREMIUM WINDOW FILMS</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                Choose between our high-performance Nano-Carbon and ultimate Black Armour Ceramic range.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid-2">
            {/* Film Option 1: CCXTREME NANO CARBON */}
            <AnimatedSection animation="fade-up">
              <motion.div 
                className="card-dark feature-card" 
                whileHover={{ y: -6 }}
                style={{ borderTop: '4px solid #0a73ff', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{
                    backgroundColor: 'rgba(10, 115, 255, 0.12)',
                    color: '#0a73ff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginBottom: '1rem'
                  }}>
                    POPULAR CHOICE
                  </div>

                  <h3 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.75rem' }}>
                    CCXTREME NANO CARBON
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                    Advanced nano-carbon film technology designed for extreme heat blocking, deep dark aesthetics, and zero signal interference.
                  </p>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                    {[
                      'Advanced nano carbon technology',
                      'Excellent solar heat rejection',
                      'Blocks UV rays up to 99%',
                      'Reduces glare and eye strain',
                      'Premium everyday performance & color stability'
                    ].map((feature, i) => (
                      <motion.li 
                        key={i} 
                        whileHover={{ x: 4 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0', fontSize: '0.95rem' }}
                      >
                        <CheckCircle2 size={18} color="#0a73ff" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/quote?film=nano-carbon" className="btn-outline-blue" style={{ width: '100%' }}>
                    SELECT NANO CARBON QUOTE
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatedSection>

            {/* Film Option 2: BLACK ARMOUR CERAMIC FILM */}
            <AnimatedSection animation="fade-up" delay={150}>
              <motion.div 
                className="card-dark feature-card" 
                whileHover={{ y: -6 }}
                style={{ borderTop: '4px solid #ffffff', position: 'relative', backgroundColor: '#0e1622', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 20px rgba(10, 115, 255, 0.15)' }}
              >
                <div>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginBottom: '1rem'
                  }}>
                    ULTIMATE PERFORMANCE
                  </div>

                  <h3 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.75rem' }}>
                    BLACK ARMOUR CERAMIC FILM
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                    Our flagship ceramic film offering maximum infrared heat rejection, superior optical clarity, and ultimate cabin protection.
                  </p>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                    {[
                      'Around 18% better heat rejection than carbon',
                      'Superior scratch resistance & durability',
                      'Thicker film construction for added safety',
                      'Less internal glare with crystal optical clarity',
                      'Superior comfort and clarity in extreme FNQ heat'
                    ].map((feature, i) => (
                      <motion.li 
                        key={i} 
                        whileHover={{ x: 4 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0', fontSize: '0.95rem' }}
                      >
                        <CheckCircle2 size={18} color="#0a73ff" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/quote?film=ceramic" className="btn-primary" style={{ width: '100%' }}>
                    SELECT CERAMIC QUOTE
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatedSection>
          </div>

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: '2.5rem' }}>
            * Ceramic film delivers around 18% better heat rejection and enhanced scratch resistance. All performance claims backed by manufacturer testing.
          </p>

        </div>
      </section>

      {/* VEHICLES WE TINT GRID */}
      <section style={{ padding: '6rem 0', backgroundColor: '#0b1118', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="section-badge" style={{ justifyContent: 'center' }}>Comprehensive Fitting</div>
              <h2 className="section-title">VEHICLES WE TINT</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                We tint all vehicle makes, models, and sizes with custom precision.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid-4">
            {vehicleCategories.map((cat, idx) => (
              <AnimatedSection key={idx} animation="fade-up" delay={idx * 80}>
                <motion.div 
                  className="card-dark feature-card" 
                  whileHover={{ y: -6 }}
                  style={{ padding: '0', overflow: 'hidden' }}
                >
                  <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                      className="zoom-on-hover"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0b1118 0%, transparent 80%)' }} />
                  </div>
                  <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.25rem' }}>{cat.name}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{cat.desc}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS SECTION */}
      <GoogleReviews />

      {/* FINAL CTA BANNER */}
      <CtaBanner title="READY TO UPGRADE YOUR DRIVE?" subtitle="Premium tinting. Superior comfort. Lasting protection." image={heroImg} />
    </>
  );
}

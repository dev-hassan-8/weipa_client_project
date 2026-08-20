import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Shield, Eye, Flame, Award, ArrowRight, Home, Building2, CheckCircle, Phone, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import FacebookVideos from '@/components/FacebookVideos';
import { usePageMedia } from '@/lib/usePageMedia';
import { useSettings } from '@/lib/useSettings';
import GoogleReviews from '@/components/GoogleReviews';
import CtaBanner from '@/components/CtaBanner';
import AnimatedSection from '@/components/AnimatedSection';

// Feature Flag: Set to true when residential & commercial images are ready
const SHOW_RESIDENTIAL_COMMERCIAL = false;

export default function HomePage() {
  const media = usePageMedia('home');
  const settings = useSettings();

  const heatRejectionValue = settings?.heatRejectionPercentage ? `${settings.heatRejectionPercentage}%` : 'Superior';
  const heatRejectionDesc = settings?.heatRejectionPercentage
    ? `Blocks up to ${settings.heatRejectionPercentage}% of solar heat to keep your interior dramatically cooler.`
    : 'High-performance solar heat rejection engineered for Weipa\'s tropical climate.';

  const heroImg = media.get('hero', '/images/landcruiser-79_new.png');
  const section1Img = media.get('section', '/images/hilux.png');
  const teamImg = media.get('team', '/images/employee-1.png');
  const residentialCardImg = media.get('residential_card', '/images/residential-hero.png');
  const commercialCardImg = media.get('commercial_card', '/images/commercial-hero.png');

  const keyBenefits = [
    {
      icon: Flame,
      title: 'HEAT REJECTION',
      desc: heatRejectionDesc,
    },
    {
      icon: Sun,
      title: 'UV PROTECTION',
      desc: 'Blocks up to 99% of harmful UV rays to protect skin and prevent interior fading.',
    },
    {
      icon: Eye,
      title: 'PRIVACY',
      desc: 'Enhanced privacy and security to keep your valuables out of sight.',
    },
    {
      icon: Shield,
      title: 'REDUCED GLARE',
      desc: 'Minimizes blinding glare for safer, more comfortable day and night driving.',
    },
    {
      icon: Award,
      title: 'PREMIUM FINISH',
      desc: 'High-quality scratch-resistant films with a sleek, non-fading appearance.',
    },
  ];

  return (
    <>
      {/* SECTION 1: HERO */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#05080d',
        overflow: 'hidden',
        padding: '5.5rem 0'
      }}>
        {/* Background Image with subtle scale */}
        <motion.div 
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
          }} 
        />

        {/* Ambient Dark Gradient Overlays */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(119deg, #05080D 0%, rgba(5,8,13,0.92) 35%, rgba(5,8,13,0.45) 100%)'
        }} />

        {/* Subtle Ambient Glowing Orb */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(10, 115, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          animation: 'pulseGlowSubtle 6s infinite ease-in-out',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '680px' }}>

            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(10, 115, 255, 0.12)',
                border: '1px solid rgba(10, 115, 255, 0.3)',
                borderRadius: '50px',
                padding: '0.45rem 1.25rem',
                color: '#0a73ff',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
                boxShadow: '0 0 15px rgba(10, 115, 255, 0.2)',
              }}
            >
              <Sparkles size={14} />
              Far North Queensland Tinting Specialists
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.05,
                marginBottom: '1.25rem',
                textTransform: 'uppercase'
              }}
            >
              WINDOW TINTING <br />
              <span style={{ color: '#0a73ff' }}>BUILT FOR WEIPA.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                color: '#cbd5e1',
                fontSize: '1.25rem',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                fontWeight: 400
              }}
            >
              Reduce heat. Increase privacy. Reduce glare. Premium finish. Engineered specifically for Australia's toughest climate.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/quote" className="btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1rem' }}>
                  GET A QUOTE
                  <ArrowRight size={18} />
                </Link>
              </motion.div>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="tel:0498367791"
                className="btn-secondary"
                style={{ padding: '1rem 2.25rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
              >
                <Phone size={18} />
                CALL US
              </motion.a>
            </motion.div>

            {/* Quick feature highlights */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              style={{ display: 'flex', gap: '1.75rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>99%</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>UV Rays Blocked</div>
              </div>
              <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: '#0a73ff' }}>{heatRejectionValue}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Heat Rejection</div>
              </div>
              <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>100%</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Satisfaction</div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 2: AUTOMOTIVE INTRODUCTION */}
      <section style={{ padding: '6rem 0', backgroundColor: '#0b1118', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <AnimatedSection animation="fade-up">
              <div>
                <div className="section-badge">Superior Vehicle Protection</div>
                <h2 className="section-title">AUTOMOTIVE TINTING</h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Premium window films engineered for performance, comfort and style. Stay cooler, protect your interior, reduce glare and drive in total confidence across Weipa.
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                  {[
                    'Advanced Nano-Carbon and Ceramic Film options',
                    'Custom precision-cut window fitting for all makes and models',
                    'Maximum glare reduction for high-intensity sun conditions',
                    'Lifetime nationwide manufacturer warranty'
                  ].map((item, idx) => (
                    <motion.li 
                      key={idx} 
                      whileHover={{ x: 5 }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        color: '#e2e8f0', 
                        fontSize: '0.95rem',
                        cursor: 'default',
                      }}
                    >
                      <CheckCircle size={18} color="#0a73ff" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
                  <Link to="/automotive" className="btn-outline-blue">
                    EXPLORE AUTOMOTIVE TINTING
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="scale-in" delay={150}>
              <motion.div 
                className="img-zoom-container"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.35 }}
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(10, 115, 255, 0.25)', 
                  boxShadow: '0 15px 40px rgba(0,0,0,0.6)' 
                }}
              >
                <img
                  src={section1Img}
                  alt="Automotive Window Tinting Weipa"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  backgroundColor: 'rgba(5, 8, 13, 0.9)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(10, 115, 255, 0.35)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Black Armour Ceramic</div>
                  <div style={{ color: '#0a73ff', fontSize: '0.8rem', fontWeight: 600 }}>Ultra Heat &amp; Glare Defense</div>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SECTION 3: FIVE KEY BENEFITS */}
      <section style={{ padding: '5.5rem 0', backgroundColor: '#05080d' }}>
        <div className="container">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="section-badge" style={{ justifyContent: 'center' }}>Why Choose Weipa Tint</div>
              <h2 className="section-title">FIVE KEY BENEFITS</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                Our cutting-edge window films deliver unrivaled protection and comfort for every vehicle and property.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid-5">
            {keyBenefits.map((b, i) => {
              const IconComponent = b.icon;
              return (
                <AnimatedSection key={i} animation="fade-up" delay={i * 80}>
                  <motion.div 
                    className="card-dark feature-card" 
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    style={{ textAlign: 'center', padding: '2rem 1.25rem', height: '100%' }}
                  >
                    <div 
                      className="feature-icon-badge"
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(10, 115, 255, 0.12)',
                        border: '1px solid rgba(10, 115, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0a73ff',
                        margin: '0 auto 1.25rem auto'
                      }}
                    >
                      <IconComponent size={26} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#fff' }}>{b.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5 }}>{b.desc}</p>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3.5: TEAM/EMPLOYEE SHOWCASE */}
      <section style={{ padding: '6rem 0', backgroundColor: '#0b1118', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <AnimatedSection animation="scale-in">
              <motion.div 
                className="img-zoom-container"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.35 }}
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(10, 115, 255, 0.25)', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.7)' 
                }}
              >
                <img
                  src={teamImg}
                  alt="Weipa Tint Professional Installer"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </motion.div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={120}>
              <div>
                <div className="section-badge">Our Team</div>
                <h2 className="section-title">LOCAL EXPERTS. PREMIUM RESULTS.</h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Our skilled technicians are Weipa locals who take pride in every install. From consultation to final inspection, we deliver flawless results every time.
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                  {[
                    'Experienced, fully trained installation technicians',
                    'Precision heat-shrink fitting techniques',
                    'Micro-edge detailing for bubble-free results',
                    'Proudly serving Weipa and Cape York since day one'
                  ].map((item, idx) => (
                    <motion.li 
                      key={idx} 
                      whileHover={{ x: 5 }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        color: '#e2e8f0', 
                        fontSize: '0.95rem',
                        cursor: 'default',
                      }}
                    >
                      <CheckCircle size={18} color="#0a73ff" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
                  <Link to="/about" className="btn-outline-blue">
                    ABOUT WEIPA TINT
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOME & COMMERCIAL CARDS */}
      {SHOW_RESIDENTIAL_COMMERCIAL && (
        <section style={{ padding: '6rem 0', backgroundColor: '#05080d', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div className="container">
            <AnimatedSection animation="fade-up">
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <div className="section-badge" style={{ justifyContent: 'center' }}>Residential &amp; Commercial</div>
                <h2 className="section-title">HOME &amp; COMMERCIAL SOLUTIONS</h2>
                <p className="section-subtitle" style={{ margin: '0 auto' }}>
                  Extend comfort, privacy, and energy savings to your residence or workplace in Weipa.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid-2">
              {/* Card 1: Residential */}
              <AnimatedSection animation="fade-up">
                <motion.div 
                  className="card-dark feature-card" 
                  whileHover={{ y: -6 }}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '340px',
                    padding: '2.5rem'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0, right: 0, bottom: 0, left: 0,
                    backgroundImage: `url(${residentialCardImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.25,
                    transition: 'transform 0.5s ease',
                  }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#0a73ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '1.25rem' }}>
                      <Home size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.75rem' }}>RESIDENTIAL TINTING</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '420px' }}>
                      Enhance home comfort, reduce heavy electricity and air conditioning costs, and protect family furniture from UV fading.
                    </p>
                  </div>

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <Link to="/residential" className="btn-outline-blue">
                      VIEW RESIDENTIAL TINTING
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </motion.div>
              </AnimatedSection>

              {/* Card 2: Commercial */}
              <AnimatedSection animation="fade-up" delay={150}>
                <motion.div 
                  className="card-dark feature-card" 
                  whileHover={{ y: -6 }}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '340px',
                    padding: '2.5rem'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0, right: 0, bottom: 0, left: 0,
                    backgroundImage: `url(${commercialCardImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.25,
                    transition: 'transform 0.5s ease',
                  }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#0a73ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '1.25rem' }}>
                      <Building2 size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.75rem' }}>COMMERCIAL TINTING</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '420px' }}>
                      Improve energy efficiency, enhance building aesthetics, and create a cooler, glare-free workplace for staff and clients.
                    </p>
                  </div>

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <Link to="/commercial" className="btn-outline-blue">
                      VIEW COMMERCIAL TINTING
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </motion.div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: FACEBOOK VIDEOS */}
      <FacebookVideos />

      {/* SECTION 6: GOOGLE REVIEWS */}
      <GoogleReviews />

      {/* SECTION 7: FINAL CTA BANNER */}
      <CtaBanner />
    </>
  );
}

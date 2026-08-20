import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, MapPin, Wrench, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CtaBanner from '@/components/CtaBanner';
import { usePageMedia } from '@/lib/usePageMedia';
import AnimatedSection from '@/components/AnimatedSection';

export default function AboutPage() {
  const media = usePageMedia('about');
  
  const teamImg = media.get('team', '/images/employee-1.png');
  const heroImg = media.get('hero', '/images/employee-1.png');
  const section1Img = media.get('section', '/images/auto-hero.png');
  const valuePoints = [
    {
      icon: Award,
      title: 'PREMIUM FILMS',
      desc: 'We use industry-leading window films for superior heat rejection, clarity, and durability.',
    },
    {
      icon: Wrench,
      title: 'EXPERT CRAFTSMANSHIP',
      desc: 'Skilled installers, precise hand-cut & computer-designed techniques, and attention to every edge.',
    },
    {
      icon: MapPin,
      title: 'LOCAL & TRUSTED',
      desc: 'Proudly based in Weipa. Trusted by vehicle owners and local businesses across the Cape.',
    },
    {
      icon: ShieldCheck,
      title: 'BUILT FOR THE FAR NORTH',
      desc: 'Tinting solutions engineered specifically to withstand Australia\'s harsh tropical sun and heat.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'CONSULT',
      desc: 'We assess your needs and recommend the right film for your vehicle or property.',
    },
    {
      num: '02',
      title: 'PREPARE',
      desc: 'We carefully clean and prepare every window surface for a flawless, bubble-free finish.',
    },
    {
      num: '03',
      title: 'INSTALL',
      desc: 'Precision installation using premium heat-shrink techniques and micro-edge fitting.',
    },
    {
      num: '04',
      title: 'FINAL CHECK',
      desc: 'We thoroughly inspect every detail to ensure the highest standard of quality and clarity.',
    },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '6rem 0 4rem 0',
        backgroundColor: '#05080d',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="section-badge">Local Expertise • Proven Quality</div>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '1.25rem',
                lineHeight: 1.1
              }}>
                ABOUT <span style={{ color: '#0a73ff' }}>WEIPA TINT</span>
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: 1.65, marginBottom: '2rem' }}>
                Premium window tinting in Weipa and Far North Queensland. We deliver cooler, safer and more comfortable drives with industry-leading films and professional installation.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/quote" className="btn-primary">
                    GET A FREE QUOTE
                  </Link>
                </motion.div>
                <motion.a 
                  whileHover={{ scale: 1.04 }} 
                  whileTap={{ scale: 0.96 }}
                  href="tel:0498367791" 
                  className="btn-secondary" 
                  style={{ textDecoration: 'none' }}
                >
                  CALL 0498 367 791
                </motion.a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div 
                className="img-zoom-container"
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(10, 115, 255, 0.25)', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.7)' 
                }}
              >
                <img 
                  src={heroImg} 
                  alt="Weipa Tint Professional Installer"
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section style={{ padding: '6rem 0', backgroundColor: '#0b1118', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            
            <AnimatedSection animation="scale-in">
              <div 
                className="img-zoom-container"
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6)' 
                }}
              >
                <img 
                  src={section1Img} 
                  alt="Weipa Tint Craftsmanship"
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={120}>
              <div>
                <div className="section-badge">OUR STORY</div>
                <h2 className="section-title">LOCAL EXPERTS. PREMIUM RESULTS.</h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  Weipa Tint was built on a simple promise — deliver premium window tinting with honest advice, quality films and flawless workmanship.
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Proudly based in Weipa, we service the Far North with automotive tinting as our specialty, plus residential &amp; commercial tinting as our secondary services. Your comfort. Your protection. Our passion.
                </p>

                <div style={{
                  display: 'flex',
                  gap: '2rem',
                  padding: '1.5rem',
                  backgroundColor: 'rgba(5, 8, 13, 0.6)',
                  borderRadius: '8px',
                  border: '1px solid rgba(10, 115, 255, 0.2)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#0a73ff', fontWeight: 700 }}>100%</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Local Weipa Owned</div>
                  </div>
                  <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#fff', fontWeight: 700 }}>LIFETIME</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Manufacturer Warranty</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* VALUE POINTS GRID */}
      <section style={{ padding: '5.5rem 0', backgroundColor: '#05080d' }}>
        <div className="container">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="section-badge" style={{ justifyContent: 'center' }}>OUR CORE VALUES</div>
              <h2 className="section-title">WHY WEIPA TINT STANDS OUT</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                We never compromise on film quality or installation standards.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid-4">
            {valuePoints.map((v, i) => {
              const IconComp = v.icon;
              return (
                <AnimatedSection key={i} animation="fade-up" delay={i * 80}>
                  <motion.div 
                    className="card-dark feature-card" 
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    style={{ textAlign: 'center', height: '100%' }}
                  >
                    <div 
                      className="feature-icon-badge"
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(10, 115, 255, 0.12)',
                        border: '1px solid rgba(10, 115, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0a73ff',
                        margin: '0 auto 1.25rem auto'
                      }}
                    >
                      <IconComp size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.65rem' }}>{v.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5 }}>{v.desc}</p>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOUR SIMPLE STEPS PROCESS */}
      <section style={{ padding: '6rem 0', backgroundColor: '#0b1118', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="section-badge" style={{ justifyContent: 'center' }}>OUR PROCESS</div>
              <h2 className="section-title">FOUR SIMPLE STEPS</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                From initial consultation to final inspection, experience seamless professional service.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid-4">
            {steps.map((st, i) => (
              <AnimatedSection key={i} animation="fade-up" delay={i * 90}>
                <motion.div 
                  className="card-dark feature-card" 
                  whileHover={{ y: -6 }}
                  style={{ position: 'relative', borderTop: '3px solid #0a73ff', height: '100%' }}
                >
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '3rem',
                    fontWeight: 700,
                    color: 'rgba(10, 115, 255, 0.25)',
                    lineHeight: 1,
                    marginBottom: '0.5rem',
                    transition: 'color 0.3s ease',
                  }}>
                    {st.num}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.75rem' }}>{st.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{st.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <CtaBanner title="READY TO TINT YOUR VEHICLE?" subtitle="Premium films. Expert installation. Local service you can trust." image={teamImg} />
    </>
  );
}

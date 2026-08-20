import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Sun, Zap, Building2, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import CtaBanner from '@/components/CtaBanner';
import { usePageMedia } from '@/lib/usePageMedia';
import AnimatedSection from '@/components/AnimatedSection';

export default function CommercialPage() {
  const media = usePageMedia('commercial');
  
  const heroImg = media.get('hero', '/images/commercial-hero.png');
  const section1Img = media.get('section', '/images/commercial-hero.png');
  const secondaryImg = media.get('gallery', '/images/commercial-2.png');

  const benefits = [
    { icon: Eye, title: 'ENHANCED PRIVACY', desc: 'Protect sensitive areas, staff, and office assets from external view.' },
    { icon: Sun, title: 'GLARE REDUCTION', desc: 'Reduce harsh screen glare and eye strain for improved productivity.' },
    { icon: Zap, title: 'ENERGY EFFICIENCY', desc: 'Lower HVAC cooling costs with maximum solar heat rejection.' },
    { icon: Building2, title: 'PROFESSIONAL APPEARANCE', desc: 'Create a sleek, modern, uniform look for your building facade.' },
    { icon: Users, title: 'COMFORT FOR STAFF & CLIENTS', desc: 'Maintain a comfortable, temperature-regulated indoor environment.' },
  ];

  const businessTypes = [
    { title: 'OFFICES', desc: 'Corporate buildings & open-plan workspaces' },
    { title: 'SHOPFRONTS', desc: 'Retail stores & display windows' },
    { title: 'WAREHOUSES', desc: 'Industrial complexes & staff facilities' },
    { title: 'HEALTHCARE', desc: 'Medical centers, clinics & hospitals' },
    { title: 'SCHOOLS', desc: 'Educational centers & council facilities' },
  ];

  const whyChooseUs = [
    { title: 'PREMIUM QUALITY FILMS', desc: 'High-performance films built to last.' },
    { title: 'EXPERT INSTALLATION', desc: 'Skilled, experienced and detail-focused.' },
    { title: 'CUSTOM SOLUTIONS', desc: 'Tailored tinting for every workspace.' },
    { title: 'COMPLIANCE & SAFETY', desc: 'Meets Australian standards and safety regulations.' },
    { title: 'LOCAL & RELIABLE', desc: 'Proudly serving Weipa and surrounds.' },
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
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #05080d 0%, rgba(5,8,13,0.92) 55%, rgba(5,8,13,0.5) 100%)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '680px' }}>
            
            <div className="section-badge animate-fade-down">Building & Office Solutions</div>
            <h1 
              className="animate-fade-up delay-100"
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
              COMMERCIAL <br />
              <span style={{ color: '#0a73ff' }}>TINTING</span>
            </h1>

            <p 
              className="animate-fade-up delay-200"
              style={{
                color: '#cbd5e1',
                fontSize: '1.15rem',
                lineHeight: 1.6,
                marginBottom: '2.25rem'
              }}
            >
              Improve privacy, reduce heat and glare, and enhance your building's efficiency and appearance with premium commercial window tinting.
            </p>

            <div 
              className="animate-fade-up delay-300"
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}
            >
              <Link to="/quote" className="btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1rem' }}>
                GET A QUOTE
                <ArrowRight size={18} />
              </Link>

              <a 
                href="tel:0498367791"
                className="btn-secondary" 
                style={{ padding: '1rem 2.25rem', fontSize: '1rem', textDecoration: 'none' }}
              >
                CALL US NOW
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* FIVE BENEFITS BAR */}
      <section style={{ padding: '5rem 0', backgroundColor: '#0b1118', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container">
          <div className="grid-5">
            {benefits.map((b, i) => {
              const IconComp = b.icon;
              return (
                <AnimatedSection key={i} animation="fade-up" delay={i * 70}>
                  <div className="card-dark feature-card" style={{ textAlign: 'center', padding: '1.75rem 1rem', height: '100%' }}>
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
                        margin: '0 auto 1rem auto'
                      }}
                    >
                      <IconComp size={22} />
                    </div>
                    <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.4rem' }}>{b.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.5 }}>{b.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* DESIGNED FOR WORKSPACES */}
      <section style={{ padding: '6rem 0', backgroundColor: '#05080d' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            
            <AnimatedSection animation="fade-up">
              <div>
                <div className="section-badge">Commercial Efficiency</div>
                <h2 className="section-title">DESIGNED FOR WORKSPACES</h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Our commercial window films are engineered for high solar performance and durability — helping you create more comfortable, energy-efficient, and productive environments for your staff and clients.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
                  <div 
                    style={{ padding: '1.25rem', backgroundColor: '#0b1118', borderRadius: '8px', borderLeft: '3px solid #0a73ff', transition: 'transform 0.25s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Glare Reduction</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Eliminates computer screen reflections</div>
                  </div>
                  <div 
                    style={{ padding: '1.25rem', backgroundColor: '#0b1118', borderRadius: '8px', borderLeft: '3px solid #0a73ff', transition: 'transform 0.25s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>HVAC Savings</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Reduces commercial air conditioning load</div>
                  </div>
                </div>

                <Link to="/quote" className="btn-primary">
                  REQUEST A COMMERCIAL CONSULTATION
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="scale-in" delay={120}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div 
                  className="img-zoom-container"
                  style={{ 
                    borderRadius: '12px', 
                    border: '1px solid rgba(10, 115, 255, 0.25)', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.7)' 
                  }}
                >
                  <img 
                    src={section1Img} 
                    alt="Commercial Window Tinting Weipa" 
                    style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div 
                  className="img-zoom-container"
                  style={{ 
                    borderRadius: '12px', 
                    border: '1px solid rgba(10, 115, 255, 0.2)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                >
                  <img 
                    src={secondaryImg} 
                    alt="Commercial Building Tinting" 
                    style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* BUSINESSES WE SERVE GRID */}
      <section style={{ padding: '6rem 0', backgroundColor: '#0b1118', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="section-badge" style={{ justifyContent: 'center' }}>Sectors &amp; Properties</div>
              <h2 className="section-title">BUSINESSES WE SERVE</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                Custom tailored tinting applications for every commercial facility.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid-5">
            {businessTypes.map((biz, idx) => (
              <AnimatedSection key={idx} animation="fade-up" delay={idx * 70}>
                <div className="card-dark feature-card" style={{ textAlign: 'center', padding: '2rem 1rem', height: '100%' }}>
                  <Building2 size={32} color="#0a73ff" style={{ margin: '0 auto 1rem auto', transition: 'transform 0.3s ease' }} />
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>{biz.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{biz.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE WEIPA TINT */}
      <section style={{ padding: '6rem 0', backgroundColor: '#05080d' }}>
        <div className="container">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="section-badge" style={{ justifyContent: 'center' }}>The Weipa Advantage</div>
              <h2 className="section-title">WHY CHOOSE WEIPA TINT</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                Trusted by commercial managers and business owners across Far North Queensland.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid-5">
            {whyChooseUs.map((item, idx) => (
              <AnimatedSection key={idx} animation="fade-up" delay={idx * 70}>
                <div className="card-dark feature-card" style={{ borderTop: '3px solid #0a73ff', textAlign: 'center', height: '100%' }}>
                  <CheckCircle2 size={24} color="#0a73ff" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{item.title}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.4 }}>{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <CtaBanner title="READY TO UPGRADE YOUR BUSINESS?" subtitle="Get in touch today for a free, no-obligation quote and expert advice tailored to your business." image={heroImg} />
    </>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Sun, Shield, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import CtaBanner from '@/components/CtaBanner';
import { usePageMedia } from '@/lib/usePageMedia';
import AnimatedSection from '@/components/AnimatedSection';

export default function ResidentialPage() {
  const media = usePageMedia('residential');
  
  const heroImg = media.get('hero', '/images/residential-hero.png');
  const section1Img = media.get('section', '/images/residential-hero.png');
  
  // get fallback
  const getGallery = (index: number, fallback: string) => {
    const galleryItems = Array.from(media.items).filter(m => m.position === 'gallery');
    return galleryItems[index]?.url || fallback;
  };
  
  const w1Img = getGallery(0, '/images/window-1.png');
  const w2Img = getGallery(1, '/images/window-2.png');

  const benefits = [
    {
      icon: Flame,
      title: 'HEAT REDUCTION',
      desc: 'Keep your home cooler and dramatically reduce air conditioning usage.',
    },
    {
      icon: Sun,
      title: 'UV PROTECTION',
      desc: 'Blocks harmful UV rays. Protects your family skin and prevents timber/furniture fading.',
    },
    {
      icon: Shield,
      title: 'ENHANCED PRIVACY',
      desc: 'Increase daytime privacy without sacrificing natural sunlight and outside views.',
    },
    {
      icon: Zap,
      title: 'ENERGY EFFICIENCY',
      desc: 'Lower power bills by improving window thermal insulation against harsh solar heat.',
    },
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
            
            <div className="section-badge animate-fade-down">Home Window Films</div>
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
              RESIDENTIAL <br />
              <span style={{ color: '#0a73ff' }}>TINTING</span>
            </h1>

            <p 
              className="animate-fade-up delay-200"
              style={{
                color: '#cbd5e1',
                fontSize: '1.1rem',
                lineHeight: 1.6,
                marginBottom: '2.25rem',
                fontWeight: 500
              }}
            >
              ENHANCE COMFORT, PRIVACY AND STYLE WITH PREMIUM WINDOW TINTING. REDUCE HEAT, GLARE AND UV RAYS FOR A BETTER HOME ENVIRONMENT.
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

      {/* FOUR BENEFITS */}
      <section style={{ padding: '5rem 0', backgroundColor: '#0b1118', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container">
          <div className="grid-4">
            {benefits.map((b, i) => {
              const IconComp = b.icon;
              return (
                <AnimatedSection key={i} animation="fade-up" delay={i * 80}>
                  <div className="card-dark feature-card" style={{ textAlign: 'center', height: '100%' }}>
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
                    <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.65rem' }}>{b.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5 }}>{b.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* COOLER HOMES. BETTER LIVING FEATURE SECTION */}
      <section style={{ padding: '6rem 0', backgroundColor: '#05080d' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            
            <AnimatedSection animation="scale-in">
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
                  alt="Cooler Homes Better Living Weipa"
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={120}>
              <div>
                <div className="section-badge">Residential Comfort</div>
                <h2 className="section-title">COOLER HOMES. BETTER LIVING.</h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                  Living in Weipa means enduring intense solar radiation throughout the year. Our architectural window tinting solutions keep heat outdoors while maintaining clear views.
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                  {[
                    'Significantly reduces heat and glare for year-round comfort',
                    'Blocks up to 99% of damaging UV rays to protect family and interiors',
                    'Adds privacy and security while enhancing the aesthetic look of your home',
                    'Dramatically reduces air conditioning electricity costs'
                  ].map((item, idx) => (
                    <li 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '0.85rem', 
                        color: '#e2e8f0', 
                        fontSize: '1rem', 
                        lineHeight: 1.5,
                        transition: 'transform 0.25s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      <CheckCircle2 size={20} color="#0a73ff" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/quote" className="btn-primary">
                  GET A FREE RESIDENTIAL QUOTE TODAY
                </Link>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* WINDOW FILM SHOWCASE */}
      <section style={{ padding: '6rem 0', backgroundColor: '#0b1118', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="section-badge" style={{ justifyContent: 'center' }}>Our Work</div>
              <h2 className="section-title">WINDOW FILM SOLUTIONS</h2>
            </div>
          </AnimatedSection>
          <div className="grid-2">
            <AnimatedSection animation="scale-in">
              <div 
                className="img-zoom-container"
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(10, 115, 255, 0.2)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              >
                <img 
                  src={w1Img}
                  alt="Residential Window Tinting Film"
                  style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} 
                />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="scale-in" delay={150}>
              <div 
                className="img-zoom-container"
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(10, 115, 255, 0.2)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              >
                <img 
                  src={w2Img}
                  alt="Window Film Application"
                  style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} 
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <CtaBanner title="GET A FREE QUOTE TODAY" subtitle="Transform your living spaces with high-performance heat control window films." image={heroImg} />
    </>
  );
}

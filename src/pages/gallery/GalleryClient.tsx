import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FacebookVideos from '@/components/FacebookVideos';
import CtaBanner from '@/components/CtaBanner';
import AnimatedSection from '@/components/AnimatedSection';

export default function GalleryClient({ mediaItems }: { mediaItems: any[] }) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'AUTOMOTIVE' | 'RESIDENTIAL' | 'COMMERCIAL'>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Only images assigned to the Gallery page (or Gallery Grid slot) belong here.
  const galleryMedia = (mediaItems || []).filter((item) => {
    const page = (item.page || '').toLowerCase();
    const position = (item.position || '').toLowerCase();
    return page === 'gallery' || (page !== 'home' && page !== 'about' && position === 'gallery');
  });

  const baseGalleryItems = galleryMedia.map(item => {
    let categoryMatch = 'ALL';
    const pageUpper = (item.page || '').toUpperCase();
    if (['AUTOMOTIVE', 'RESIDENTIAL', 'COMMERCIAL'].includes(pageUpper)) {
      categoryMatch = pageUpper;
    } else if (item.position?.toUpperCase() === 'AUTOMOTIVE' || item.position?.toUpperCase() === 'RESIDENTIAL' || item.position?.toUpperCase() === 'COMMERCIAL') {
      categoryMatch = item.position.toUpperCase();
    }

    return {
      id: item.id,
      title: item.name || 'Gallery Image',
      category: categoryMatch,
      image: item.url,
      desc: ''
    };
  });
    
  const galleryItems = baseGalleryItems.length > 0 ? baseGalleryItems : [];

  const filteredItems = activeTab === 'ALL'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeTab || item.category === 'ALL');

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
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
          <div className="section-badge animate-fade-down" style={{ justifyContent: 'center' }}>PROJECT SHOWCASE</div>
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
            OUR <span style={{ color: '#0a73ff' }}>GALLERY</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="section-subtitle" 
            style={{ margin: '0 auto 2.5rem auto' }}
          >
            Explore our premium tinting work across automotive, residential and commercial projects.
          </motion.p>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section style={{ padding: '4rem 0 6rem 0', backgroundColor: '#0b1118' }}>
        <div className="container">
          <div className="grid-3">
            {filteredItems.map((item, idx) => (
              <AnimatedSection key={item.id} animation="fade-up" delay={idx * 70}>
                <motion.div 
                  onClick={() => setLightboxIndex(idx)}
                  whileHover={{ y: -6, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  style={{
                    position: 'relative',
                    height: '280px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    backgroundColor: '#05080d',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  }}
                  className="card-dark"
                >
                  {/* Background Image with hover zoom */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }} />

                  {/* Dark Hover Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(5,8,13,0.95) 0%, rgba(5,8,13,0.3) 50%, rgba(5,8,13,0.4) 100%)',
                    opacity: 0.85,
                    transition: 'opacity 0.3s ease'
                  }} />

                  {/* Top Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: 'rgba(10, 115, 255, 0.85)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                  }}>
                    {item.category}
                  </div>

                  {/* Expand Icon */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}>
                    <Maximize2 size={16} />
                  </div>

                  {/* Caption Bottom */}
                  <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
                    <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, textTransform: 'none', marginBottom: '0.25rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.4 }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL WITH ANIMATEPRESENCE */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
          >
            {/* Close Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLightboxIndex(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                zIndex: 10001,
              }}
              aria-label="Close image"
            >
              <X size={24} />
            </motion.button>

            {/* Prev Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(10, 115, 255, 0.85)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10001,
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </motion.button>

            {/* Next Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(10, 115, 255, 0.85)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10001,
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              }}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </motion.button>

            {/* Lightbox Content Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              style={{
                maxWidth: '900px',
                width: '100%',
                backgroundColor: '#0b1118',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(10, 115, 255, 0.3)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.95), 0 0 40px rgba(10, 115, 255, 0.2)',
              }}
            >
              <img 
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                style={{
                  width: '100%',
                  maxHeight: '65vh',
                  objectFit: 'contain',
                  backgroundColor: '#05080d',
                  display: 'block'
                }}
              />
              <div style={{ padding: '1.5rem 2.0rem' }}>
                <div style={{ color: '#0a73ff', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  {filteredItems[lightboxIndex].category}
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.4rem', textTransform: 'none' }}>
                  {filteredItems[lightboxIndex].title}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                  {filteredItems[lightboxIndex].desc}
                </p>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* FACEBOOK VIDEOS SECTION */}
      <FacebookVideos />

      {/* FINAL CTA BANNER */}
      <CtaBanner title="READY TO TINT YOUR VEHICLE OR PROPERTY?" subtitle="Book your appointment today or request a personalized quote." image={galleryItems[0]?.image || "/images/auto-hero.png"} />
    </>
  );
}

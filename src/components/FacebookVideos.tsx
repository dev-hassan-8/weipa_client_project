import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FacebookIcon } from './SocialIcons';
import AnimatedSection from './AnimatedSection';

type VideoOrientation = 'portrait' | 'landscape';

interface Video {
  id: string;
  title: string;
  category: string;
  image: string;
  duration: string;
  fbUrl: string;
  orientation: VideoOrientation;
}

interface ActiveVideo {
  title: string;
  fbUrl: string;
  orientation: VideoOrientation;
}

export default function FacebookVideos() {
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideo(null);
      }
    };
    if (activeVideo) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeVideo]);

  const videos: Video[] = [
    {
      id: 'v1',
      title: 'Window Tint Transformation - Toyota Landcruiser 300 Series',
      category: 'Automotive Tinting',
      image: '/images/black-hilux.jpg',
      duration: '0:45',
      fbUrl: 'https://www.facebook.com/reel/2816891791999767',
      orientation: 'portrait',
    },
    {
      id: 'v2',
      title: 'Behind The Tint - Ceramic Heat Rejection Demo',
      category: 'Tech & Demo',
      image: '/images/facebook2.jpg',
      duration: '1:31',
      fbUrl: 'https://www.facebook.com/reel/1575716564146010',
      orientation: 'landscape',
    },
    {
      id: 'v3',
      title: 'Full Tint Refresh - Toyota Landcruiser 75 Series',
      category: 'Automotive Tinting',
      image: '/images/meroon.jpg',
      duration: '0:58',
      fbUrl: 'https://www.facebook.com/reel/1346316517690766',
      orientation: 'portrait',
    },
    {
      id: 'v4',
      title: 'Black Armour Ceramic Tint - Toyota Landcruiser 79 Series',
      category: 'Ceramic Tint',
      image: '/images/weipa.jpg',
      duration: '0:58',
      fbUrl: 'https://www.facebook.com/reel/1518711409729872',
      orientation: 'portrait',
    },
    {
      id: 'v5',
      title: 'Window Tint Transformation - Toyota Prado',
      category: 'Automotive Tinting',
      image: '/images/far.jpg',
      duration: '0:58',
      fbUrl: 'https://www.facebook.com/reel/1709302776774973',
      orientation: 'portrait',
    },
    {
      id: 'v6',
      title: 'Black Armour Ceramic Tint - Suzuki Jimny',
      category: 'Automotive Tinting',
      image: '/images/facebook6.jpg',
      duration: '0:35',
      fbUrl: 'https://www.facebook.com/reel/1097970905889134',
      orientation: 'portrait',
    },
  ];

  const getEmbedUrl = (fbUrl: string) => {
    const encoded = encodeURIComponent(fbUrl);
    return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&appId`;
  };

  const getModalSize = (orientation: VideoOrientation) => {
    if (orientation === 'portrait') {
      return {
        width: 'min(92vw, calc(82vh * 9 / 16))',
        height: '82vh',
        maxHeight: '82vh',
      };
    }
    return {
      width: 'min(90vw, calc((100vh - 120px) * 16 / 9))',
      height: 'min(calc(90vw * 9 / 16), calc(100vh - 120px))',
      maxHeight: 'calc(100vh - 120px)',
    };
  };

  return (
    <section style={{ padding: '5.5rem 0', backgroundColor: '#0B1118', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <div className="container">

        {/* Header */}
        <AnimatedSection animation="fade-up">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div className="section-badge">
                <FacebookIcon size={16} color="#0A73FF" />
                Social Showcase
              </div>
              <h2 className="section-title">LATEST FACEBOOK VIDEOS</h2>
              <p className="section-subtitle">
                See our real installations, tint tests, and vehicle transformations in action.
              </p>
            </div>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://www.facebook.com/profile.php?id=61575595830852&sk=reels_tab"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-blue"
            >
              <FacebookIcon size={18} />
              FOLLOW US ON FACEBOOK
            </motion.a>
          </div>
        </AnimatedSection>

        {/* Video Cards Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}
        >
          {videos.map((vid, idx) => (
            <AnimatedSection key={vid.id} animation="fade-up" delay={idx * 75}>
              <motion.div
                onClick={() => setActiveVideo({ title: vid.title, fbUrl: vid.fbUrl, orientation: vid.orientation })}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  backgroundColor: '#05080D',
                  height: '260px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                }}
                className="card-dark video-card"
              >
                {/* Background Thumbnail Image with zoom effect */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${vid.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.65,
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }} />

                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(5,8,13,0.96) 0%, rgba(5,8,13,0.25) 60%, rgba(5,8,13,0.45) 100%)'
                }} />

                {/* Play Button Icon Centered */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: '2.5rem',
                }}>
                  <motion.div 
                    whileHover={{ scale: 1.15 }}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(10, 115, 255, 0.9)',
                      border: '2px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow: '0 0 25px rgba(10, 115, 255, 0.6)',
                      flexShrink: 0,
                    }}
                  >
                    <Play size={24} fill="#FFFFFF" style={{ marginLeft: '3px' }} />
                  </motion.div>
                </div>

                {/* Duration Pill */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                }}>
                  {vid.duration}
                </div>

                {/* Title & Info at Bottom */}
                <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#0A73FF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.3rem' }}>
                    {vid.category}
                  </span>
                  <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, textTransform: 'none', lineHeight: 1.4 }}>
                    {vid.title}
                  </h4>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

      </div>

      {/* Full-Screen Video Overlay with AnimatePresence */}
      <AnimatePresence>
        {activeVideo && (() => {
          const modalSize = getModalSize(activeVideo.orientation);
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                backgroundColor: 'rgba(0, 0, 0, 0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
              }}
              onClick={() => setActiveVideo(null)}
            >
              {/* Header pill overlay top-left */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'fixed',
                  top: '1.25rem',
                  left: '1.25rem',
                  zIndex: 100001,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: 'rgba(11, 17, 24, 0.9)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '50px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  maxWidth: 'calc(100vw - 180px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <FacebookIcon size={20} color="#0A73FF" />
                <h4
                  style={{
                    color: '#fff',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {activeVideo.title}
                </h4>
                <a
                  href={activeVideo.fbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#0A73FF',
                    backgroundColor: 'rgba(10, 115, 255, 0.15)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(10, 115, 255, 0.3)',
                    textDecoration: 'none',
                    marginLeft: '0.5rem',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  Open on FB ↗
                </a>
              </motion.div>

              {/* Floating Close Button top-right */}
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveVideo(null)}
                style={{
                  position: 'fixed',
                  top: '1.25rem',
                  right: '1.25rem',
                  zIndex: 100001,
                  backgroundColor: 'rgba(11, 17, 24, 0.9)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
                aria-label="Close full screen video"
              >
                <X size={24} />
              </motion.button>

              {/* Responsive Video Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'relative',
                  width: modalSize.width,
                  height: modalSize.height,
                  maxHeight: modalSize.maxHeight,
                  backgroundColor: '#000000',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(10, 115, 255, 0.2)',
                  border: '1px solid rgba(10, 115, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2.5rem',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  src={getEmbedUrl(activeVideo.fbUrl)}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block'
                  }}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  title={activeVideo.title}
                />
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

interface CtaBannerProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

export default function CtaBanner({
  title = "READY TO TINT YOUR VEHICLE?",
  subtitle = "Drive cooler. Look sharper. Trust Weipa's tinting experts.",
}: CtaBannerProps) {
  return (
    <section style={{
      position: 'relative',
      padding: '6rem 0',
      backgroundColor: '#05080d',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      {/* Background Image Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.25,
        filter: 'brightness(0.7)'
      }} />

      {/* Ambient Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, #05080d 0%, rgba(5,8,13,0.85) 50%, #05080d 100%)'
      }} />

      {/* Radial Glow Centerpiece */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(10, 115, 255, 0.16) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        animation: 'pulseGlowSubtle 5s infinite ease-in-out',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <AnimatedSection animation="fade-up">
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
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
            <Shield size={15} />
            Premium Quality Guaranteed
          </motion.div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: '#ffffff',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            lineHeight: 1.1
          }}>
            {title}
          </h2>

          <p style={{
            color: '#cbd5e1',
            fontSize: '1.2rem',
            maxWidth: '650px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}>
            {subtitle}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
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
              style={{ padding: '1rem 2.25rem', fontSize: '1rem' }}
            >
              CALL US NOW
            </motion.a>
          </div>

          {/* Key Trust Points */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '3rem',
            color: '#94a3b8',
            fontSize: '0.9rem',
            flexWrap: 'wrap'
          }}>
            <motion.div 
              whileHover={{ y: -2, color: '#ffffff' }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'default' }}
            >
              <CheckCircle2 size={16} color="#0a73ff" />
              <span>Lifetime Warranty</span>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2, color: '#ffffff' }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'default' }}
            >
              <CheckCircle2 size={16} color="#0a73ff" />
              <span>Fast 24hr Response</span>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2, color: '#ffffff' }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'default' }}
            >
              <CheckCircle2 size={16} color="#0a73ff" />
              <span>Local Weipa Technicians</span>
            </motion.div>
          </div>

        </AnimatedSection>
      </div>
    </section>
  );
}

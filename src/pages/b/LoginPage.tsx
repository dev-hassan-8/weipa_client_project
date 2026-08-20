import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { useIntakeStore } from '@/lib/useIntakeStore';

export default function BackofficeLoginPage() {
  const navigate = useNavigate();
  const loginAdmin = useIntakeStore((state) => state.loginAdmin);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        loginAdmin(email);
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#05080d',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Subtle Radial Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(10, 115, 255, 0.12) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />

      <div className="b-modal-card" style={{ maxWidth: '440px', padding: '2.5rem 2rem' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            backgroundColor: 'rgba(10, 115, 255, 0.12)',
            border: '1px solid rgba(10, 115, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0a73ff',
            margin: '0 auto 1rem auto'
          }}>
            <ShieldCheck size={28} />
          </div>

          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: '#fff', letterSpacing: '0.08em' }}>
            WEIPA <span style={{ color: '#0a73ff' }}>TINT</span>
          </div>
          <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.2rem' }}>
            BACKOFFICE INTAKE PORTAL
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="b-input-group">
            <label className="b-label">Admin Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="email" 
                required 
                placeholder="admin@weipatint.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="b-input"
                style={{ paddingLeft: '2.6rem' }}
              />
            </div>
          </div>

          <div className="b-input-group" style={{ marginBottom: '1.75rem' }}>
            <label className="b-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="password" 
                required 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="b-input"
                style={{ paddingLeft: '2.6rem' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS BACKOFFICE'}
            <ArrowRight size={18} />
          </button>
        </form>

        {errorMsg && (
          <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '0.85rem', marginTop: '1rem', fontWeight: 700 }}>
            {errorMsg}
          </p>
        )}

      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, Inbox, Settings, LogOut, ExternalLink, ShieldCheck, Image, Clock, CalendarDays } from 'lucide-react';
import { useIntakeStore } from '@/lib/useIntakeStore';

export default function BackofficeLayout() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { isAuthenticated, adminUser, logoutAdmin, quotes, bookings, enquiries } = useIntakeStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || pathname === '/admin/login') return;
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          logoutAdmin();
          navigate('/admin/login');
        }
      })
      .catch(() => {
        logoutAdmin();
        navigate('/admin/login');
      });
  }, [mounted, pathname, navigate, logoutAdmin]);

  // Route protection guard
  useEffect(() => {
    if (mounted && pathname !== '/admin/login' && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [pathname, isAuthenticated, navigate, mounted]);

  // Exclude sidebar/topbar layout on login page
  if (pathname === '/admin/login') {
    return <Outlet />;
  }

  // Prevent hydration errors and wait for auth state
  if (!mounted) {
    return null;
  }

  // If not authenticated and trying to view protected backoffice route
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#05080d', color: '#fff' }}>
        Authenticating Backoffice Access...
      </div>
    );
  }

  const newQuotesCount = quotes.filter((q) => q.status === 'NEW').length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'PENDING').length;
  const unreadEnquiriesCount = enquiries.filter((e) => e.status === 'UNREAD').length;

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Quote Requests', href: '/admin/quotes', icon: FileText, badge: newQuotesCount },
    { name: 'Bookings & Schedule', href: '/admin/bookings', icon: Calendar, badge: pendingBookingsCount },
    { name: 'Calendar Events', href: '/admin/calendar-events', icon: CalendarDays },
    { name: 'Working Hours', href: '/admin/working-hours', icon: Clock },
    { name: 'Contact Enquiries', href: '/admin/enquiries', icon: Inbox, badge: unreadEnquiriesCount },
    { name: 'Media Library', href: '/admin/media', icon: Image },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error(e);
    }
    logoutAdmin();
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    if (pathname.match(/\/quotes\/.+/)) return 'Quote Intake Details';
    if (pathname.includes('/quotes')) return 'Quote Intake Manager';
    if (pathname.includes('/bookings')) return 'Bookings & Schedule';
    if (pathname.includes('/calendar-events')) return 'Calendar Events';
    if (pathname.includes('/working-hours')) return 'Daily Working Hours';
    if (pathname.includes('/enquiries')) return 'Contact Enquiries Inbox';
    if (pathname.includes('/media')) return 'Media Library';
    if (pathname.includes('/settings')) return 'Operational Settings';
    return 'Backoffice Dashboard Overview';
  };

  return (
    <div className="b-root">
      
      {/* SIDEBAR NAVIGATION (PROPRIETARY BACKOFFICE ONLY) */}
      <aside className="b-sidebar">
        <div>
          {/* Logo Brand */}
          <div className="b-sidebar-logo">
            <div className="b-sidebar-brand">
              WEIPA <span className="b-sidebar-brand-accent">TINT</span>
            </div>
            <div className="b-sidebar-tag">
              ADMIN BACKOFFICE SYSTEM
            </div>
          </div>

          {/* Nav List */}
          <nav>
            <ul className="b-nav-list">
              {navItems.map((item) => {
                const IconComp = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`b-nav-item ${isActive ? 'b-nav-item-active' : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <IconComp size={18} />
                        <span className="b-nav-text">{item.name}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="b-nav-badge">{item.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer Link to Public Website */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
          <Link 
            to="/" 
            target="_blank"
            className="b-nav-item"
            style={{ color: '#64748b' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ExternalLink size={18} />
              <span className="b-nav-text">View Public Website</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="b-main-content">
        
        {/* PROPRIETARY BACKOFFICE TOPBAR */}
        <header className="b-topbar">
          <h1 className="b-topbar-title">{getPageTitle()}</h1>

          <div className="b-topbar-actions">
            
            <div className="b-user-pill">
              <div className="b-user-avatar">
                {adminUser?.name ? adminUser.name[0] : 'C'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="b-user-name">{adminUser?.name || 'Chris (Weipa Tint)'}</span>
                <span className="b-user-email">{adminUser?.email || 'weipatint@gmail.com'}</span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="b-nav-item"
              style={{ padding: '0.5rem 0.8rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
              title="Logout from Backoffice"
            >
              <LogOut size={16} />
              <span className="b-nav-text" style={{ fontSize: '0.85rem' }}>Logout</span>
            </button>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="b-page-container">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ClientLayout from '@/components/ClientLayout';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import AutomotivePage from '@/pages/AutomotivePage';
import ResidentialPage from '@/pages/ResidentialPage';
import CommercialPage from '@/pages/CommercialPage';
import GalleryPage from '@/pages/GalleryPage';
import QuotePage from '@/pages/QuotePage';
import ContactPage from '@/pages/ContactPage';
import BookingIntakePage from '@/pages/BookingIntakePage';
import BookPage from '@/pages/BookPage';
import BookTokenPage from '@/pages/book/BookTokenPage';
import ReschedulePage from '@/pages/reschedule/ReschedulePage';
import BackofficeLayout from '@/pages/b/BackofficeLayout';
import BackofficeIndex from '@/pages/b/BackofficeIndex';
import LoginPage from '@/pages/b/LoginPage';
import DashboardPage from '@/pages/b/DashboardPage';
import QuotesPage from '@/pages/b/QuotesPage';
import QuoteDetailPage from '@/pages/b/QuoteDetailPage';
import BookingsPage from '@/pages/b/BookingsPage';
import BookingDetailPage from '@/pages/b/BookingDetailPage';
import EnquiriesPage from '@/pages/b/EnquiriesPage';
import MediaPage from '@/pages/b/MediaPage';
import SettingsPage from '@/pages/b/SettingsPage';
import WorkingHoursPage from '@/pages/b/WorkingHoursPage';
import CalendarEventsPage from '@/pages/b/CalendarEventsPage';

function LegacyAdminRedirect() {
  const { pathname, search } = useLocation();
  const target = pathname.replace(/^\/b/, '/admin') + search;
  return <Navigate to={target} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/automotive" element={<AutomotivePage />} />
        <Route path="/residential" element={<ResidentialPage />} />
        <Route path="/commercial" element={<CommercialPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/booking" element={<BookingIntakePage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/book/:token" element={<BookTokenPage />} />
        <Route path="/reschedule/:token" element={<ReschedulePage />} />
      </Route>

      <Route path="/b/*" element={<LegacyAdminRedirect />} />

      <Route path="/admin" element={<BackofficeLayout />}>
        <Route index element={<BackofficeIndex />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="quotes" element={<QuotesPage />} />
        <Route path="quotes/:id" element={<QuoteDetailPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="bookings/:id" element={<BookingDetailPage />} />
        <Route path="calendar-events" element={<CalendarEventsPage />} />
        <Route path="enquiries" element={<EnquiriesPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="working-hours" element={<WorkingHoursPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

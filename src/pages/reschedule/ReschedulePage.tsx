import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function fmtYMD(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function fmtDisplay(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ReschedulePage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [monthAvailability, setMonthAvailability] = useState<Record<string, number>>({});
  const [loadingMonthAvailability, setLoadingMonthAvailability] = useState(false);

  const [calY, setCalY] = useState(new Date().getFullYear());
  const [calM, setCalM] = useState(new Date().getMonth());
  const today = new Date();
  
  useEffect(() => {
    fetch(`/api/reschedule?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setBooking(data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    const monthKey = `${calY}-${String(calM + 1).padStart(2, '0')}`;
    const cDate = fmtYMD(today.getFullYear(), today.getMonth(), today.getDate());
    const cHour = today.getHours();

    setLoadingMonthAvailability(true);
    fetch(`/api/booking-slots?month=${monthKey}&token=${token}&cDate=${cDate}&cHour=${cHour}`)
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed to load availability');
        setMonthAvailability(data.availabilityByDate || {});
      })
      .catch(() => setMonthAvailability({}))
      .finally(() => setLoadingMonthAvailability(false));
  }, [calY, calM, token, today]);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSlots([]);
    setSelectedTime(null);
    fetch(`/api/booking-slots?date=${selectedDate}&cDate=${fmtYMD(today.getFullYear(), today.getMonth(), today.getDate())}&cHour=${today.getHours()}`)
      .then(r => r.json())
      .then(d => setSlots(d.closed ? [] : (d.available || [])))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  const confirm = async () => {
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newDate: selectedDate, newTime: selectedTime }),
      });
      const data = await res.json();
      if (res.ok && data.success) setSuccess(true);
      else setError(data.error || 'Failed to reschedule');
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const firstDow = new Date(calY, calM, 1).getDay();
  const daysInMonth = new Date(calY, calM + 1, 0).getDate();
  const prevMonth = () => { if (calM === 0) { setCalM(11); setCalY(y => y - 1); } else setCalM(m => m - 1); };
  const nextMonth = () => { if (calM === 11) { setCalM(0); setCalY(y => y + 1); } else setCalM(m => m + 1); };
  const isDisabled = (day: number) => {
    const dt = new Date(calY, calM, day);
    const td = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dt.getTime() < td.getTime();
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading...</div>;
  if (error && !booking) return <div style={{ color: 'red', padding: '2rem' }}>{error}</div>;
  if (success) return <div style={{ color: '#fff', padding: '2rem' }}>Successfully rescheduled! You will receive a confirmation email.</div>;

  return (
    <div style={{ backgroundColor: '#05080d', minHeight: '100vh', color: '#fff', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0a73ff' }}>Reschedule Appointment</h1>
      <div style={{ background: '#0b1118', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <p><strong>Service:</strong> {booking.serviceType}</p>
        <p><strong>Current Appointment:</strong> {booking.bookingDate} at {booking.bookingTime}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: '#0b1118', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button onClick={prevMonth} style={{ color: '#0a73ff', background: 'none', border: 'none' }}><ChevronLeft /></button>
            <span>{MONTHS[calM]} {calY}</span>
            <button onClick={nextMonth} style={{ color: '#0a73ff', background: 'none', border: 'none' }}><ChevronRight /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
            {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>{d}</div>)}
            {Array.from({ length: firstDow }).map((_, i) => <div key={`x${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const ds = fmtYMD(calY, calM, day);
              const disabled = isDisabled(day);
              const availableCount = monthAvailability[ds] || 0;
              const hasAvailability = availableCount > 0;
              const sel = selectedDate === ds;
              const isClickable = !disabled && hasAvailability;
              return (
                <button
                  key={day}
                  onClick={() => isClickable && setSelectedDate(ds)}
                  disabled={!isClickable}
                  style={{
                    padding: '0.5rem',
                    background: sel ? '#0a73ff' : hasAvailability ? 'rgba(10, 115, 255, 0.10)' : 'transparent',
                    color: disabled ? '#475569' : !hasAvailability ? '#64748b' : '#fff',
                    border: sel ? '1px solid #0a73ff' : hasAvailability ? '1px solid rgba(10, 115, 255, 0.35)' : '1px solid transparent',
                    borderRadius: '4px',
                    cursor: !isClickable ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.55 : hasAvailability ? 1 : 0.7,
                    boxShadow: sel ? '0 0 10px rgba(10,115,255,0.35)' : 'none'
                  }}
                >{day}</button>
              );
            })}
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b' }}>
            Available dates are highlighted. Fully booked dates are disabled. 7 days a week, 8:00 AM – 5:00 PM.
            {loadingMonthAvailability && <span style={{ marginLeft: '0.5rem', color: '#94a3b8' }}>Checking availability…</span>}
          </div>
        </div>

        <div style={{ background: '#0b1118', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Available Times</h3>
          {loadingSlots ? <p>Loading...</p> : slots.length === 0 ? <p>No slots</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {slots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  style={{
                    padding: '0.5rem',
                    background: selectedTime === slot ? '#0a73ff' : '#1e293b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >{slot}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          onClick={confirm}
          disabled={!selectedDate || !selectedTime || submitting}
          style={{
            padding: '1rem 2rem',
            background: '#0a73ff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: (!selectedDate || !selectedTime || submitting) ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? 'Confirming...' : 'Confirm Reschedule'}
        </button>
      </div>
    </div>
  );
}

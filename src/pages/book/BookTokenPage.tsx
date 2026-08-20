import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight,
  Loader2, User, Car, DollarSign, CalendarCheck, Download, Phone, Mail,
} from 'lucide-react';
import { LOGO_URL } from '@/lib/logoUrl';

/* ─────────────────────────── types ───────────────────────────── */
interface QuoteInfo {
  quoteId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  carMake: string;
  yearModel: string;
  tintType: string;
  service: string;
  quotationAmount: number;
  estimatedDuration: number;
  notes?: string[];
}

interface BookingResult {
  bookingId: string;
  bookingDate: string;
  bookingTime: string;
}

/* ─────────────────────────── helpers ─────────────────────────── */
const DAYS   = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function fmtYMD(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function fmtDisplay(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

/** "10:00 AM" → integer hour string suitable for iCal/GCal: "100000" */
function parseTimePart(t: string): string {
  const [time, period] = t.trim().split(' ');
  let [h, min] = time.split(':').map(Number);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2,'0')}${String(min).padStart(2,'0')}00`;
}

function googleCalUrl(q: QuoteInfo, r: BookingResult, location: string): string {
  const [start, end] = r.bookingTime.split(' – ');
  const d = r.bookingDate.replace(/-/g, '');
  const params = new URLSearchParams({
    action:  'TEMPLATE',
    text:    `${q.customerName} - ${q.carMake} ${q.yearModel} - $${q.quotationAmount.toFixed(2)} - Weipa`,
    dates:   `${d}T${parseTimePart(start)}/${d}T${parseTimePart(end)}`,
    details: `Vehicle: ${q.carMake} ${q.yearModel}\nFilm: ${q.tintType}\nAmount: $${q.quotationAmount.toFixed(2)}\nRef: ${r.bookingId}`,
    location,
    add: 'weipatint@gmail.com'
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function outlookCalUrl(q: QuoteInfo, r: BookingResult, location: string): string {
  const [start, end] = r.bookingTime.split(' – ');
  const d = r.bookingDate;
  const tStart = parseTimePart(start);
  const tEnd = parseTimePart(end);
  const isoStart = `${d}T${tStart.slice(0,2)}:${tStart.slice(2,4)}:00`;
  const isoEnd = `${d}T${tEnd.slice(0,2)}:${tEnd.slice(2,4)}:00`;
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: isoStart,
    enddt: isoEnd,
    subject: `${q.customerName} - ${q.carMake} ${q.yearModel} - $${q.quotationAmount.toFixed(2)} - Weipa`,
    body: `Vehicle: ${q.carMake} ${q.yearModel}\nFilm: ${q.tintType}\nAmount: $${q.quotationAmount.toFixed(2)}\nRef: ${r.bookingId}`,
    location,
    to: 'weipatint@gmail.com'
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
}

function yahooCalUrl(q: QuoteInfo, r: BookingResult, location: string): string {
  const [start, end] = r.bookingTime.split(' – ');
  const d = r.bookingDate.replace(/-/g, '');
  const params = new URLSearchParams({
    v: '60',
    view: 'd',
    type: '20',
    title: `${q.customerName} - ${q.carMake} ${q.yearModel} - $${q.quotationAmount.toFixed(2)} - Weipa`,
    st: `${d}T${parseTimePart(start)}`,
    et: `${d}T${parseTimePart(end)}`,
    desc: `Vehicle: ${q.carMake} ${q.yearModel}\nFilm: ${q.tintType}\nAmount: $${q.quotationAmount.toFixed(2)}\nRef: ${r.bookingId}`,
    in_loc: location,
    invites: 'weipatint@gmail.com'
  });
  return `https://calendar.yahoo.com/?${params}`;
}

function downloadIcs(q: QuoteInfo, r: BookingResult, location: string) {
  const [start, end] = r.bookingTime.split(' – ');
  const d = r.bookingDate.replace(/-/g, '');
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Weipa Tint//Booking//EN',
    'BEGIN:VEVENT',
    `DTSTART:${d}T${parseTimePart(start)}`,
    `DTEND:${d}T${parseTimePart(end)}`,
    `SUMMARY:${q.customerName} - ${q.carMake} ${q.yearModel} - $${q.quotationAmount.toFixed(2)} - Weipa`,
    `DESCRIPTION:Vehicle: ${q.carMake} ${q.yearModel}\\nFilm: ${q.tintType}\\nAmount: $${q.quotationAmount.toFixed(2)}\\nRef: ${r.bookingId}`,
    `LOCATION:${location}`,
    'ATTENDEE;ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:weipatint@gmail.com',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: `weipa-tint-${r.bookingId}.ics` });
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────── styles ──────────────────────────── */
const BG    = '#05080d';
const CARD  = '#0b1118';
const CARD2 = '#060a10';
const BLUE  = '#0a73ff';
const MUTED = '#94a3b8';
const DIM   = '#475569';

const pill: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
  border: `1px solid ${BLUE}33`, borderRadius: '9999px',
  padding: '0.25rem 0.9rem', fontSize: '0.78rem', fontWeight: 700,
  color: BLUE, letterSpacing: '0.07em', textTransform: 'uppercase',
  backgroundColor: `${BLUE}12`, marginBottom: '0.75rem',
};

/* ═══════════════════════ main component ══════════════════════════ */
export default function BookingPage() {
  const { token } = useParams<{ token: string }>();

  /* ── data state ── */
  const [loading,     setLoading]     = useState(true);
  const [quote,       setQuote]       = useState<QuoteInfo | null>(null);
  const [fatalError,  setFatalError]  = useState('');

  /* ── booking flow state ── */
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots,        setSlots]        = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [errorMsg,     setErrorMsg]     = useState('');
  const [result,       setResult]       = useState<BookingResult | null>(null);

  /* ── notes state ── */
  const [clientNote, setClientNote] = useState('');

  /* ── settings state ── */
  const [settings, setSettings] = useState({ phone: '0498 367 791', location: 'Weipa QLD 4874' });

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d && d.phone) setSettings(d); })
      .catch(() => {});
  }, []);

  /* ── calendar state ── */
  const [today, setToday] = useState(new Date());
  useEffect(() => {
    // Rely on the device's local timezone as requested
    setToday(new Date());
  }, []);

  const [calY, setCalY] = useState(new Date().getFullYear());
  const [calM, setCalM] = useState(new Date().getMonth());
  const [monthAvailability, setMonthAvailability] = useState<Record<string, number>>({});
  const [loadingMonthAvailability, setLoadingMonthAvailability] = useState(false);

  /* ── load quote info on mount ── */
  useEffect(() => {
    fetch(`/api/book-info?token=${token}`)
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Invalid link');
        return data;
      })
      .then(setQuote)
      .catch(e => setFatalError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    const monthKey = `${calY}-${String(calM + 1).padStart(2, '0')}`;
    const cDate = fmtYMD(today.getFullYear(), today.getMonth(), today.getDate());
    const cHour = today.getHours();

    setLoadingMonthAvailability(true);
    fetch(`/api/booking-slots?month=${monthKey}&token=${token}&cDate=${cDate}&cHour=${cHour}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed to load availability');
        setMonthAvailability(data.availabilityByDate || {});
      })
      .catch(() => setMonthAvailability({}))
      .finally(() => setLoadingMonthAvailability(false));
  }, [calY, calM, token, today]);

  /* ── fetch slots when date changes ── */
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSlots([]);
    setSelectedTime(null);
    
    // Pass current device date and hour to API to filter same-day past slots correctly
    const n = new Date();
    const cDate = fmtYMD(n.getFullYear(), n.getMonth(), n.getDate());
    const cHour = n.getHours();

    fetch(`/api/booking-slots?date=${selectedDate}&token=${token}&cDate=${cDate}&cHour=${cHour}`)
      .then(r => r.json())
      .then(d => setSlots(d.closed ? [] : (d.available || [])))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, token]);

  /* ── calendar helpers ── */
  const firstDow    = new Date(calY, calM, 1).getDay();
  const daysInMonth = new Date(calY, calM + 1, 0).getDate();
  const todayStr    = fmtYMD(today.getFullYear(), today.getMonth(), today.getDate());

  const canGoPrev = calY > today.getFullYear() || (calY === today.getFullYear() && calM > today.getMonth());
  const prevMonth = () => canGoPrev ? (calM === 0 ? (setCalM(11), setCalY(y => y - 1)) : setCalM(m => m - 1)) : null;
  const nextMonth = () => calM === 11 ? (setCalM(0),  setCalY(y => y + 1)) : setCalM(m => m + 1);

  const isDisabled = (day: number) => {
    const dt = new Date(calY, calM, day);
    const td = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dt.getTime() < td.getTime();
  };

  /* ── confirm booking ── */
  const confirm = async () => {
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res  = await fetch('/api/confirm-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
          note: clientNote.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ bookingId: data.bookingId, bookingDate: data.bookingDate, bookingTime: data.bookingTime });
      } else {
        setErrorMsg(data.error || 'Booking failed. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ══════════════════════ render states ══════════════════════════ */

  /* Loading */
  if (loading) return (
    <Page>
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
        <Loader2 size={30} color={BLUE} style={{ animation:'spin 1s linear infinite' }} />
        <span style={{ color: MUTED, fontSize:'1.05rem' }}>Loading your booking…</span>
      </div>
    </Page>
  );

  /* Fatal error / expired */
  if (fatalError || !quote) return (
    <Page>
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
        <div style={{ maxWidth:'480px', textAlign:'center', background:CARD, padding:'3rem 2.5rem', borderRadius:'16px', border:'1px solid rgba(239,68,68,0.25)' }}>
          <AlertCircle size={60} color="#ef4444" style={{ margin:'0 auto 1.5rem' }} />
          <h2 style={{ color:'#fff', fontSize:'1.8rem', marginBottom:'1rem' }}>Link Expired or Invalid</h2>
          <p style={{ color:MUTED, lineHeight:1.65, marginBottom:'2rem' }}>
            {fatalError || 'This booking link is no longer valid. It may have already been used.'}
          </p>
          <a href="tel:0498367791" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', backgroundColor:BLUE, color:'#fff', padding:'0.9rem 2rem', borderRadius:'8px', textDecoration:'none', fontWeight:700 }}>
            <Phone size={16} /> CALL 0498 367 791
          </a>
        </div>
      </div>
    </Page>
  );

  /* ── Success screen ── */
  if (result) {
    const calUrl = googleCalUrl(quote, result, settings.location);
    const rows: [string, string][] = [
      ['Reference',   result.bookingId],
      ['Customer',    quote.customerName],
      ['Phone',       quote.customerPhone],
      ['Email',       quote.customerEmail],
      ['Vehicle',     `${quote.carMake} ${quote.yearModel}`],
      ['Film',        quote.tintType],
      ['Date',        fmtDisplay(result.bookingDate)],
      ['Time',        result.bookingTime],
      ['Duration',    `${quote.estimatedDuration} hour${quote.estimatedDuration !== 1 ? 's' : ''}`],
      ['Total Price', `$${quote.quotationAmount.toFixed(2)}`],
    ];

    return (
      <Page>
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'3rem 1.5rem' }}>
          <img src={LOGO_URL} alt="Weipa Tint" style={{ height:'52px', marginBottom:'2.5rem' }} />

          <div style={{ maxWidth:'600px', width:'100%', background:CARD, borderRadius:'16px', border:`1px solid ${BLUE}33`, boxShadow:'0 25px 60px rgba(0,0,0,0.7)', overflow:'hidden' }}>
            {/* Green success header */}
            <div style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.1),rgba(10,115,255,0.05))', padding:'2.5rem', textAlign:'center', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width:'76px', height:'76px', borderRadius:'50%', background:'rgba(34,197,94,0.12)', border:'2px solid rgba(34,197,94,0.35)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem' }}>
                <CheckCircle2 size={40} color="#22c55e" />
              </div>
              <h1 style={{ color:'#fff', fontSize:'2rem', fontFamily:'var(--font-heading)', marginBottom:'0.35rem' }}>THANK YOU!</h1>
              <p style={{ color:MUTED, fontSize:'1.05rem' }}>
                Your booking is confirmed, <strong style={{ color:'#fff' }}>{quote.customerName}</strong>!
              </p>
            </div>

            {/* Summary */}
            <div style={{ padding:'1.75rem 2rem' }}>
              <h4 style={{ color:BLUE, fontSize:'0.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:'1px solid rgba(255,255,255,0.07)', paddingBottom:'0.75rem', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <CalendarCheck size={14} /> Booking Summary
              </h4>
              {rows.map(([label, value]) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'0.45rem 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'0.93rem', gap:'1rem' }}>
                  <span style={{ color:DIM, flexShrink:0 }}>{label}:</span>
                  <span style={{ color: label === 'Total Price' ? BLUE : label === 'Reference' ? '#fff' : '#e2e8f0', fontWeight: label === 'Total Price' || label === 'Reference' ? 700 : 400, textAlign:'right' }}>{value}</span>
                </div>
              ))}

              {/* Calendar actions */}
              <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginTop:'1.75rem', marginBottom:'1.25rem' }}>
                <a href={calUrl} target="_blank" rel="noopener noreferrer" style={{ flex:1, minWidth:'140px', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'0.45rem', backgroundColor:BLUE, color:'#fff', padding:'0.7rem 1rem', borderRadius:'8px', textDecoration:'none', fontWeight:700, fontSize:'0.85rem' }}>
                  <CalendarCheck size={14} /> Google Cal
                </a>
                <a href={outlookCalUrl(quote!, result!, settings.location)} target="_blank" rel="noopener noreferrer" style={{ flex:1, minWidth:'140px', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'0.45rem', backgroundColor:'#0078d4', color:'#fff', padding:'0.7rem 1rem', borderRadius:'8px', textDecoration:'none', fontWeight:700, fontSize:'0.85rem' }}>
                  <CalendarCheck size={14} /> Outlook
                </a>
                <a href={yahooCalUrl(quote!, result!, settings.location)} target="_blank" rel="noopener noreferrer" style={{ flex:1, minWidth:'140px', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'0.45rem', backgroundColor:'#6001d2', color:'#fff', padding:'0.7rem 1rem', borderRadius:'8px', textDecoration:'none', fontWeight:700, fontSize:'0.85rem' }}>
                  <CalendarCheck size={14} /> Yahoo
                </a>
                <button onClick={() => downloadIcs(quote!, result!, settings.location)} style={{ flex:1, minWidth:'140px', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'0.45rem', backgroundColor:'transparent', border:`1px solid ${BLUE}66`, color:BLUE, padding:'0.7rem 1rem', borderRadius:'8px', cursor:'pointer', fontWeight:700, fontSize:'0.85rem' }}>
                  <Download size={14} /> Other (.ics)
                </button>
              </div>

              <p style={{ color:DIM, fontSize:'0.83rem', textAlign:'center', marginBottom:'1.25rem' }}>
                A confirmation email &amp; SMS has been sent. To reschedule call <strong style={{ color:MUTED }}>{settings.phone}</strong>.
              </p>
              <div style={{ textAlign:'center' }}>
                <Link to="/" style={{ color:BLUE, fontSize:'0.9rem', textDecoration:'none' }}>← Back to Weipa Tint Website</Link>
              </div>
            </div>
          </div>
        </div>
        <PageFooter />
      </Page>
    );
  }

  /* ══════════════════════ main booking UI ═════════════════════════ */
  return (
    <Page>
      <div style={{ maxWidth:'960px', margin:'0 auto', padding:'3rem 1.5rem 5rem' }}>

        {/* ── Header ── */}
        <div style={{ textAlign:'center', marginBottom:'2.25rem' }}>
          <h1 style={{ color:'#fff', fontSize:'clamp(1.8rem,4vw,2.5rem)', fontFamily:'var(--font-heading)', textTransform:'uppercase', marginBottom:'0.5rem' }}>
            Book Your Service
          </h1>
          <p style={{ color:MUTED, fontSize:'1.05rem' }}>
            Block the Heat, Cherish the View – Custom Window Tinting Tailored for You.
          </p>
        </div>

        {/* ── Advisor Pre-Configured Banner ── */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:'1rem', background:`${BLUE}0a`, border:`1px solid ${BLUE}33`, borderRadius:'12px', padding:'1.25rem 1.5rem', marginBottom:'1.75rem' }}>
          <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:`${BLUE}18`, border:`1px solid ${BLUE}40`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <User size={21} color={BLUE} />
          </div>
          <div>
            <div style={{ fontWeight:700, color:'#fff', fontSize:'1rem', marginBottom:'0.4rem' }}>
              Advisor Pre-Configured Booking
            </div>
            <div style={{ color:MUTED, fontSize:'0.9rem', lineHeight:1.65 }}>
              This booking link was prepared for&nbsp;
              <strong style={{ color:'#e2e8f0' }}>{quote.customerName}</strong> ·&nbsp;
              {quote.carMake} {quote.yearModel} ·&nbsp;
              <em>{quote.tintType}</em> ·&nbsp;
              <strong style={{ color:BLUE }}>${quote.quotationAmount.toFixed(2)}</strong> ·&nbsp;
              {quote.estimatedDuration} hr{quote.estimatedDuration !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* ── Step 1: Date & Time ── */}
        <StepCard label="Step 1: Select Date &amp; Time" icon={<Calendar size={16} color={BLUE} />}>
          <div className="mobile-stack" style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'1.25rem' }}>

            {/* Calendar */}
            <div style={{ border:'1px solid rgba(255,255,255,0.07)', borderRadius:'10px', padding:'1.25rem' }}>
              {/* Month nav */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
                <NavBtn onClick={prevMonth} disabled={!canGoPrev}><ChevronLeft size={19} /></NavBtn>
                <span style={{ color:'#fff', fontWeight:700, fontSize:'0.98rem' }}>{MONTHS[calM]} {calY}</span>
                <NavBtn onClick={nextMonth}><ChevronRight size={19} /></NavBtn>
              </div>

              {/* Day headers */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'3px', marginBottom:'0.4rem' }}>
                {DAYS.map(d => <div key={d} style={{ textAlign:'center', color:DIM, fontSize:'0.68rem', fontWeight:700 }}>{d}</div>)}
              </div>

              {/* Day cells */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'3px' }}>
                {Array.from({ length: firstDow }, (_, i) => <div key={`x${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day     = i + 1;
                  const ds      = fmtYMD(calY, calM, day);
                  const disabled = isDisabled(day);
                  const availableCount = monthAvailability[ds] || 0;
                  const hasAvailability = availableCount > 0;
                  const sel      = selectedDate === ds;
                  const isToday  = ds === todayStr;
                  const isClickable = !disabled && hasAvailability;
                  return (
                    <button key={day} onClick={() => isClickable && setSelectedDate(ds)} disabled={!isClickable} style={{
                      padding:'0.42rem 0', borderRadius:'6px',
                      border: sel ? `1px solid ${BLUE}` : hasAvailability ? `1px solid ${BLUE}55` : isToday ? `1px solid ${BLUE}55` : '1px solid transparent',
                      backgroundColor: sel ? BLUE : hasAvailability ? 'rgba(10, 115, 255, 0.10)' : 'transparent',
                      color: disabled ? '#2d3748' : !hasAvailability ? '#475569' : sel ? '#fff' : '#e2e8f0',
                      cursor: !isClickable ? 'not-allowed' : 'pointer',
                      fontSize:'0.87rem', fontWeight: sel ? 700 : 400, textAlign:'center',
                      boxShadow: sel ? `0 0 10px ${BLUE}55` : hasAvailability ? '0 0 8px rgba(10,115,255,0.18)' : 'none',
                      transition:'all 0.15s',
                      opacity: disabled ? 0.55 : hasAvailability ? 1 : 0.7,
                    }}>{day}</button>
                  );
                })}
              </div>
              <div style={{ marginTop:'0.9rem', color:DIM, fontSize:'0.75rem', display:'flex', alignItems:'center', gap:'0.4rem', flexWrap:'wrap' }}>
                <Calendar size={11} /> Available days are highlighted. Fully booked days stay disabled. 7 days a week, 8:00 AM – 5:00 PM.
                {loadingMonthAvailability && <span style={{ color: '#94a3b8' }}>Checking availability…</span>}
              </div>
            </div>

            {/* Slots */}
            <div style={{ border:'1px solid rgba(255,255,255,0.07)', borderRadius:'10px', padding:'1.25rem' }}>
              <h3 style={{ color:'#fff', fontSize:'0.93rem', fontWeight:700, marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <Clock size={15} color={BLUE} />
                {selectedDate ? fmtDisplay(selectedDate).split(',')[0] : 'Select a Date First'}
              </h3>

              {!selectedDate && <p style={{ color:DIM, fontSize:'0.88rem' }}>← Pick a date to see available slots.</p>}

              {loadingSlots && (
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', color:MUTED, fontSize:'0.9rem' }}>
                  <Loader2 size={15} style={{ animation:'spin 1s linear infinite' }} /> Loading…
                </div>
              )}

              {selectedDate && !loadingSlots && slots.length === 0 && (
                <div>
                  <p style={{ color:MUTED, fontSize:'0.88rem', marginBottom:'0.35rem' }}>No slots available.</p>
                  <p style={{ color:DIM, fontSize:'0.82rem' }}>Try another date or call <a href="tel:0498367791" style={{ color:BLUE }}>0498 367 791</a>.</p>
                </div>
              )}

              {selectedDate && !loadingSlots && slots.length > 0 && (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.45rem' }}>
                  {slots.map(slot => {
                    const active = selectedTime === slot;
                    return (
                      <button key={slot} onClick={() => setSelectedTime(slot)} style={{
                        padding:'0.7rem 1rem', borderRadius:'8px',
                        border:`1px solid ${active ? BLUE : 'rgba(255,255,255,0.08)'}`,
                        backgroundColor: active ? `${BLUE}18` : 'transparent',
                        color: active ? '#60a5fa' : '#e2e8f0',
                        cursor:'pointer', fontWeight: active ? 700 : 400, fontSize:'0.91rem',
                        textAlign:'left', display:'flex', alignItems:'center', gap:'0.55rem',
                        transition:'all 0.15s',
                      }}>
                        {active ? <CheckCircle2 size={15} /> : <Clock size={15} style={{ opacity:0.35 }} />}
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </StepCard>

        {/* ── Step 2: Review & Confirm (revealed after date+time chosen) ── */}
        {selectedDate && selectedTime && (
          <StepCard label="Step 2: Review &amp; Confirm" icon={<User size={16} color={BLUE} />} animate>
            {/* Read-only customer info grid */}
            <div className="mobile-stack" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1.25rem' }}>
              {([
                ['Full Name',    quote.customerName,               <User size={14} />],
                ['Phone',        quote.customerPhone,              <Phone size={14} />],
                ['Email',        quote.customerEmail,              <Mail size={14} />],
                ['Vehicle',      `${quote.carMake} ${quote.yearModel}`, <Car size={14} />],
                ['Film Selected', quote.tintType,                 <CheckCircle2 size={14} />],
                ['Quoted Price', `$${quote.quotationAmount.toFixed(2)}`, <DollarSign size={14} />],
              ] as [string, string, React.ReactNode][]).map(([lbl, val, icon]) => (
                <div key={lbl} style={{ background:'#05080d', borderRadius:'8px', padding:'0.7rem 0.9rem', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ color:DIM, fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.3rem', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                    {icon} {lbl}
                  </div>
                  <div style={{ color: lbl === 'Quoted Price' ? BLUE : '#e2e8f0', fontWeight: lbl === 'Quoted Price' ? 700 : 400, fontSize:'0.92rem', wordBreak:'break-all' }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Appointment summary */}
            <div style={{ background:`${BLUE}09`, border:`1px solid ${BLUE}25`, borderRadius:'10px', padding:'1rem 1.25rem', marginBottom:'1.25rem', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>
              <div>
                <div style={{ color:DIM, fontSize:'0.75rem', marginBottom:'0.2rem' }}>Appointment Date</div>
                <div style={{ color:'#fff', fontWeight:700 }}>{fmtDisplay(selectedDate)}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:DIM, fontSize:'0.75rem', marginBottom:'0.2rem' }}>Time Slot</div>
                <div style={{ color:BLUE, fontWeight:700 }}>{selectedTime}</div>
              </div>
            </div>

            {errorMsg && (
              <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'8px', padding:'0.75rem 1rem', marginBottom:'1rem', color:'#f87171', fontSize:'0.9rem' }}>
                {errorMsg}
              </div>
            )}

            <textarea
              placeholder="Add a question, request, or booking update..."
              value={clientNote}
              onChange={(e) => setClientNote(e.target.value)}
              style={{
                width: '100%', minHeight: '80px', padding: '0.75rem 1rem', borderRadius: '8px',
                backgroundColor: CARD2, border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit',
                marginBottom: '1rem',
              }}
            />

            <button onClick={confirm} disabled={submitting} style={{
              width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.6rem',
              backgroundColor:BLUE, color:'#fff', border:'none', padding:'1rem 1.5rem',
              borderRadius:'10px', cursor: submitting ? 'not-allowed' : 'pointer',
              fontWeight:700, fontSize:'1rem', letterSpacing:'0.04em',
              opacity: submitting ? 0.7 : 1, transition:'all 0.2s',
            }}>
              {submitting
                ? <><Loader2 size={18} style={{ animation:'spin 1s linear infinite' }} /> CONFIRMING…</>
                : <><CheckCircle2 size={18} /> CONFIRM MY BOOKING</>}
            </button>

            <p style={{ color:DIM, fontSize:'0.79rem', textAlign:'center', marginTop:'0.85rem' }}>
              🔒 Your details are secure and used only to provide your service.
            </p>
          </StepCard>
        )}

      </div>
      <PageFooter />
    </Page>
  );
}

/* ─────────────────────────── sub-components ─────────────────────── */

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight:'100vh', backgroundColor:BG, fontFamily:'var(--font-body, Inter, sans-serif)' }}>
      {children}
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width:1024px) {
          .mobile-stack { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function StepCard({ label, icon, children, animate }: {
  label: string; icon: React.ReactNode; children: React.ReactNode; animate?: boolean;
}) {
  return (
    <div style={{ background:CARD, borderRadius:'14px', border:'1px solid rgba(255,255,255,0.07)', marginBottom:'1.5rem', overflow:'hidden', animation: animate ? 'fadeUp 0.3s ease' : undefined }}>
      <div style={{ padding:'0.9rem 1.5rem', background:CARD2, borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:'0.6rem' }}>
        {icon}
        <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:'0.93rem' }} dangerouslySetInnerHTML={{ __html: label }} />
      </div>
      <div style={{ padding:'1.5rem' }} className="grid-cal grid-info">
        {children}
      </div>
    </div>
  );
}

function NavBtn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'6px', color: disabled ? '#475569' : BLUE, cursor: disabled ? 'not-allowed' : 'pointer', padding:'0.25rem 0.5rem', display:'flex', alignItems:'center', opacity: disabled ? 0.5 : 1 }}>
      {children}
    </button>
  );
}

function PageFooter() {
  return (
    <footer style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'2rem 1.5rem', textAlign:'center' }}>
      <p style={{ color:DIM, fontSize:'0.8rem', maxWidth:'680px', margin:'0 auto 0.75rem', lineHeight:1.65 }}>
        Weipa Tint provides professional, premium window tinting solutions engineered for Cape York's harsh tropical climate —
        rejecting extreme heat, blocking 99% of harmful UV rays, and enhancing privacy for vehicles, residences, and commercial properties.
      </p>
      <div style={{ display:'flex', justifyContent:'center', gap:'1.5rem', fontSize:'0.8rem' }}>
        <Link to="/contact" style={{ color:DIM, textDecoration:'none' }}>Contact Us</Link>
        <span style={{ color:'#2d3748' }}>·</span>
        <Link to="/" style={{ color:DIM, textDecoration:'none' }}>Home</Link>
      </div>
    </footer>
  );
}

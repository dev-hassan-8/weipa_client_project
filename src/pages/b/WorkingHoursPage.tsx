import React, { useEffect, useState } from 'react';
import { Clock, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { DAY_KEYS, DEFAULT_WORKING_HOURS, DayKey, WorkingHoursSchedule, dayLabel, normalizeSchedule, timeOptions } from '@/lib/workingHours';

export default function WorkingHoursPage() {
  const [schedule, setSchedule] = useState<WorkingHoursSchedule>(DEFAULT_WORKING_HOURS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const times = timeOptions();

  useEffect(() => {
    fetch('/api/working-hours')
      .then((r) => r.json())
      .then((data) => {
        if (data.schedule) setSchedule(normalizeSchedule(data.schedule));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateDay = (key: DayKey, patch: Partial<WorkingHoursSchedule[DayKey]>) => {
    setSchedule((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const res = await fetch('/api/working-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        if (data.schedule) setSchedule(normalizeSchedule(data.schedule));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error || 'Failed to save working hours. Please try again.');
      }
    } catch {
      setError('Network error while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div className="b-table-card" style={{ padding: '2rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.3rem',
          color: '#fff',
          marginBottom: '0.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}>
          <Clock size={20} style={{ color: '#f59e0b' }} />
          Daily Working Hours
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Set open hours for each day. Closed days will not show available slots on the booking form.
        </p>

        {loading ? (
          <div style={{ color: '#94a3b8', padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Loading working hours…
          </div>
        ) : (
          <>
            {error && (
              <div style={{
                backgroundColor: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.35)',
                color: '#f87171',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontSize: '0.9rem',
              }}>
                {error}
              </div>
            )}
            {saved && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.35)',
                color: '#34d399',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontSize: '0.9rem',
              }}>
                <CheckCircle2 size={18} />
                Working hours saved successfully.
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table className="wh-table">
                <thead>
                  <tr>
                    {['Day', 'Closed', 'Opens', 'Closes'].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAY_KEYS.map((key) => {
                    const day = schedule[key];
                    return (
                      <tr key={key}>
                        <td className="wh-day">{dayLabel(key)}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={day.closed}
                            onChange={(e) => updateDay(key, { closed: e.target.checked })}
                            style={{ width: '18px', height: '18px', accentColor: '#0a73ff', cursor: 'pointer' }}
                          />
                        </td>
                        <td>
                          {!day.closed && (
                            <select
                              value={day.opens}
                              onChange={(e) => updateDay(key, { opens: e.target.value })}
                              className="b-input"
                              style={{ minWidth: '130px' }}
                            >
                              {times.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td>
                          {!day.closed && (
                            <select
                              value={day.closes}
                              onChange={(e) => updateDay(key, { closes: e.target.value })}
                              className="b-input"
                              style={{ minWidth: '130px' }}
                            >
                              {times.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', opacity: saving ? 0.7 : 1 }}
              >
                {saving ? <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={17} />}
                {saving ? 'SAVING…' : 'SAVE WORKING HOURS'}
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .wh-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .wh-table th {
          text-align: left;
          padding: 0.65rem 0.75rem;
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .wh-table td {
          padding: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }
        .wh-table tbody tr:hover td {
          background-color: rgba(10, 115, 255, 0.08);
        }
        .wh-day {
          color: #fff;
          font-weight: 600;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

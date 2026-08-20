export const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export type DayKey = (typeof DAY_KEYS)[number];

export type DayHours = {
  closed: boolean;
  opens: string;
  closes: string;
};

export type WorkingHoursSchedule = Record<DayKey, DayHours>;

export const DEFAULT_WORKING_HOURS: WorkingHoursSchedule = {
  sunday: { closed: true, opens: '08:00', closes: '17:00' },
  monday: { closed: false, opens: '08:00', closes: '17:00' },
  tuesday: { closed: false, opens: '11:30', closes: '17:00' },
  wednesday: { closed: false, opens: '11:30', closes: '17:00' },
  thursday: { closed: false, opens: '08:00', closes: '17:00' },
  friday: { closed: false, opens: '08:00', closes: '17:00' },
  saturday: { closed: false, opens: '08:00', closes: '17:00' },
};

const DAY_LABELS: Record<DayKey, string> = {
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
};

export function dayLabel(key: DayKey) {
  return DAY_LABELS[key];
}

export function formatTimeLabel(hhmm: string) {
  const [hStr, mStr] = hhmm.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

export function timeOptions() {
  const opts: { value: string; label: string }[] = [];
  for (let h = 6; h <= 20; h++) {
    for (const m of [0, 30]) {
      if (h === 20 && m > 0) break;
      const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      opts.push({ value, label: formatTimeLabel(value) });
    }
  }
  return opts;
}

export function normalizeSchedule(input: unknown): WorkingHoursSchedule {
  const base: WorkingHoursSchedule = { ...DEFAULT_WORKING_HOURS };
  if (!input || typeof input !== 'object') return base;
  const record = input as Record<string, Partial<DayHours>>;
  for (const key of DAY_KEYS) {
    const row = record[key];
    if (!row || typeof row !== 'object') continue;
    base[key] = {
      closed: Boolean(row.closed),
      opens: typeof row.opens === 'string' ? row.opens : base[key].opens,
      closes: typeof row.closes === 'string' ? row.closes : base[key].closes,
    };
  }
  return base;
}

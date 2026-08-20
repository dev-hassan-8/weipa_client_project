export const BRISBANE_TZ = 'Australia/Brisbane';
export const BRISBANE_OFFSET = '+10:00';

export function parseBrisbaneDateTime(value: string | null | undefined): Date | null {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const dt = new Date(`${trimmed}T00:00:00${BRISBANE_OFFSET}`);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T');
  const hasOffset = /[zZ]|[+-]\d{2}:\d{2}$/.test(normalized);
  const dt = new Date(hasOffset ? normalized : `${normalized}${BRISBANE_OFFSET}`);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export function formatBrisbaneDateTime(
  value: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
) {
  const dt = parseBrisbaneDateTime(value);
  if (!dt) return '—';
  return dt.toLocaleString('en-AU', options
    ? { timeZone: BRISBANE_TZ, ...options }
    : {
        timeZone: BRISBANE_TZ,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
}

export function brisbaneTodayYmd(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BRISBANE_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

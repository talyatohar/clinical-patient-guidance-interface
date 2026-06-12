/** Normalize Excel header for alias lookup */
export function normalizeColumnKey(header: unknown): string {
  if (header == null) return '';
  return String(header).trim().replace(/\s+/g, '').toLowerCase();
}

export function isEmptyCell(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
}

export function parseString(value: unknown, fallback = ''): string {
  if (isEmptyCell(value)) return fallback;
  return String(value).trim();
}

export function parseNullableString(value: unknown): string | null {
  if (isEmptyCell(value)) return null;
  return String(value).trim();
}

export function parseNumber(value: unknown, fallback = 0): number {
  if (isEmptyCell(value)) return fallback;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseInteger(value: unknown, fallback = 0): number {
  return Math.trunc(parseNumber(value, fallback));
}

/** ID numbers may arrive as Excel numeric cells */
export function parseIdNumber(value: unknown): string {
  if (isEmptyCell(value)) return '';
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }
  return String(value).trim();
}

/**
 * Excel time cells may be fractional day numbers, strings, or Date objects.
 * Returns HH:mm or empty string when unparseable.
 */
export function parseAppointmentTime(value: unknown): string {
  if (isEmptyCell(value)) return '';

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (match) {
      const hours = Number(match[1]);
      const minutes = Number(match[2]);
      if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
    }
    return trimmed;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const totalMinutes = Math.round(value * 24 * 60);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
  }

  return '';
}

export function pickFieldValue(
  row: Record<string, unknown>,
  aliases: readonly string[],
): unknown {
  const aliasSet = new Set(aliases.map((alias) => normalizeColumnKey(alias)));

  for (const [key, value] of Object.entries(row)) {
    if (aliasSet.has(normalizeColumnKey(key))) {
      return value;
    }
  }

  return undefined;
}

import type { Language } from '@/features/patient/types/language';

export function formatVisitDuration(
  language: Language,
  totalMinutes: number,
): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (language === 'he') {
    if (hours > 0 && minutes > 0) {
      return `${hours} שעות ו-${minutes} דקות`;
    }
    if (hours > 0) {
      return `${hours} שעות`;
    }
    return `${minutes} דקות`;
  }

  if (hours > 0 && minutes > 0) {
    return `${hours} hr ${minutes} min`;
  }
  if (hours > 0) {
    return `${hours} hr`;
  }
  return `${minutes} min`;
}

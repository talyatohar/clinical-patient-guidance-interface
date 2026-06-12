import type { Language } from '@/features/patient/types/language';

export function formatCompletionTime(language: Language, date: Date): string {
  const locale = language === 'he' ? 'he-IL' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

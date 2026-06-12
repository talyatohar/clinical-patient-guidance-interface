import { useMemo } from 'react';
import {
  translate,
  type TranslationKey,
} from '@/features/patient/i18n/translations';
import { usePatientState } from '@/features/patient/state';

export function usePatientTranslations() {
  const { language } = usePatientState();

  return useMemo(
    () => ({
      language,
      t: (key: TranslationKey, params?: Record<string, string>) =>
        translate(language, key, params),
    }),
    [language],
  );
}

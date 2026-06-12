import type { TranslationKey } from '@/features/patient/i18n/translations';

export const HELP_REASON_KEYS = [
  'helpReasonFindRoom',
  'helpReasonExamQuestion',
  'helpReasonFeelUnwell',
  'helpReasonInstructions',
  'helpReasonOther',
] as const satisfies readonly TranslationKey[];

export type HelpReasonKey = (typeof HELP_REASON_KEYS)[number];

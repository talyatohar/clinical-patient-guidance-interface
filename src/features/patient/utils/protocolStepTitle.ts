import type { Language } from '@/features/patient/types/language';
import type { ProtocolStep } from '@/shared/models/ProtocolStep';

export type StepTitleFields = Pick<ProtocolStep, 'stepTitleEn' | 'stepTitleHe'>;

/** Preferred language first, then the other; unknown label when both are empty. */
export function getProtocolStepDisplayTitle(
  step: StepTitleFields | null | undefined,
  language: Language,
  unknownLabel: string,
): string {
  if (!step) return unknownLabel;

  const en = step.stepTitleEn.trim();
  const he = step.stepTitleHe.trim();
  const primary = language === 'he' ? he : en;
  const fallback = language === 'he' ? en : he;

  return primary || fallback || unknownLabel;
}

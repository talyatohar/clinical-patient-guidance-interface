import type { ProtocolStep } from '@/shared/models/ProtocolStep';

type WaitingStepFields = Pick<
  ProtocolStep,
  'stepType' | 'stepTitleEn' | 'stepTitleHe'
>;

function stepTitleSuggestsWaiting(
  step: Pick<ProtocolStep, 'stepTitleEn' | 'stepTitleHe'>,
): boolean {
  const titleEn = step.stepTitleEn.trim().toLowerCase();
  const titleHe = step.stepTitleHe.trim();
  return (
    titleEn.includes('waiting') ||
    titleHe.includes('המתנה') ||
    titleHe.includes('שהייה בחדר המתנה')
  );
}

/** True when ProtocolSteps.stepType marks this as a waiting step. */
export function isWaitingStep(step: WaitingStepFields | null | undefined): boolean {
  if (!step) return false;

  const stepType = step.stepType.trim().toLowerCase();
  if (stepType === 'waiting') return true;
  if (stepType) return false;

  return stepTitleSuggestsWaiting(step);
}

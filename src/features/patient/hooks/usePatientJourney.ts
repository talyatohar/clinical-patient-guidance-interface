import { useMemo } from 'react';
import { getEducationForStep } from '@/features/patient/services/educationService';
import {
  getProgressPercent,
  getRemainingMinutes,
  getUpcomingSteps,
  isJourneyComplete,
} from '@/features/patient/services/protocolService';
import { usePatientState } from '@/features/patient/state';
import { translate } from '@/features/patient/i18n/translations';
import { getProtocolStepDisplayTitle } from '@/features/patient/utils/protocolStepTitle';

export function usePatientJourney() {
  const { session, language } = usePatientState();

  return useMemo(() => {
    if (!session) {
      return null;
    }

    const { protocolSteps, currentStepIndex } = session;
    const totalSteps = protocolSteps.length;
    const currentStep = protocolSteps[currentStepIndex] ?? null;
    const stepNumber = totalSteps > 0 ? currentStepIndex + 1 : 0;
    const unknownStepLabel = translate(language, 'unknownStepTitle');

    return {
      protocolSteps,
      currentStep,
      currentStepIndex,
      totalSteps,
      stepNumber,
      stepTitle: getProtocolStepDisplayTitle(
        currentStep,
        language,
        unknownStepLabel,
      ),
      progressPercent: getProgressPercent(currentStepIndex, totalSteps),
      remainingMinutes: getRemainingMinutes(protocolSteps, currentStepIndex),
      upcomingSteps: getUpcomingSteps(protocolSteps, currentStepIndex),
      stepEducation: currentStep
        ? getEducationForStep(currentStep.protocolId, currentStep.stepOrder)
        : undefined,
      isComplete: isJourneyComplete(currentStepIndex, totalSteps),
      hasSteps: totalSteps > 0,
    };
  }, [session, language]);
}

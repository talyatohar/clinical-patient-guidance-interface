import type { ProtocolStep } from '@/shared/models/ProtocolStep';
import type { Patient } from '@/shared/models/Patient';
import type { PatientSession } from '@/features/patient/types/session';
import { getProtocolStepsByProtocolId } from '@/shared/services/data';

export function getSortedProtocolSteps(protocolId: string): ProtocolStep[] {
  const normalized = protocolId.trim();
  if (!normalized) return [];

  return getProtocolStepsByProtocolId(normalized).sort(
    (a, b) => a.stepOrder - b.stepOrder,
  );
}

export function clampStepIndex(index: number, stepCount: number): number {
  if (stepCount <= 0) return 0;
  if (!Number.isFinite(index) || index < 0) return 0;
  if (index >= stepCount) return stepCount - 1;
  return Math.trunc(index);
}

export function createPatientSession(patient: Patient): PatientSession {
  const protocolSteps = getSortedProtocolSteps(patient.protocolId);
  const currentStepIndex = clampStepIndex(
    patient.currentStepIndex,
    protocolSteps.length,
  );

  return {
    patient,
    protocolSteps,
    currentStepIndex,
  };
}

export function getRemainingMinutes(
  steps: ProtocolStep[],
  fromIndex: number,
): number {
  if (fromIndex < 0 || fromIndex >= steps.length) return 0;

  return steps
    .slice(fromIndex)
    .reduce((total, step) => total + Math.max(0, step.estimatedMinutes), 0);
}

export function getProgressPercent(
  currentStepIndex: number,
  totalSteps: number,
): number {
  if (totalSteps <= 0) return 100;
  return Math.round((currentStepIndex / totalSteps) * 100);
}

export function isJourneyComplete(
  currentStepIndex: number,
  totalSteps: number,
): boolean {
  return totalSteps === 0 || currentStepIndex >= totalSteps;
}

export function getUpcomingSteps(
  steps: ProtocolStep[],
  currentStepIndex: number,
): ProtocolStep[] {
  if (currentStepIndex < 0) return [...steps];
  return steps.slice(currentStepIndex + 1);
}

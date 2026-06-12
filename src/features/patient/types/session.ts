import type { Patient } from '@/shared/models/Patient';
import type { ProtocolStep } from '@/shared/models/ProtocolStep';

/** Logged-in patient session with protocol steps from Excel */
export type PatientSession = {
  patient: Patient;
  /** Steps for patient.protocolId from the ProtocolSteps sheet */
  protocolSteps: ProtocolStep[];
  /** 0-based index into protocolSteps */
  currentStepIndex: number;
};

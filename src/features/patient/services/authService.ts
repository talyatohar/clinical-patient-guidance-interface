import { createPatientSession } from '@/features/patient/services/protocolService';
import type { PatientSession } from '@/features/patient/types/session';
import {
  getCachedDatabase,
  getPatientByIdNumber,
  loadDatabase,
} from '@/shared/services/data';

export type LoginValidationResult =
  | { success: true; session: PatientSession }
  | { success: false; error: 'invalid_credentials' | 'database_unavailable' };

function normalizeCode(value: string): string {
  return value.trim();
}

function codesMatch(expected: string, provided: string): boolean {
  const a = normalizeCode(expected);
  const b = normalizeCode(provided);
  if (!a || !b) return false;
  if (a === b) return true;

  const aNum = Number(a);
  const bNum = Number(b);
  if (Number.isFinite(aNum) && Number.isFinite(bNum) && aNum === bNum) {
    return true;
  }

  return false;
}

/**
 * Validates idNumber + verificationCode against the Patients sheet
 * in public/data/NuclearMedicineDemoDatabase.xlsx.
 */
export async function validatePatientLogin(
  idNumber: string,
  verificationCode: string,
): Promise<LoginValidationResult> {
  const cached = getCachedDatabase();
  const { loaded } = cached ? { loaded: true } : await loadDatabase();

  if (!loaded) {
    return { success: false, error: 'database_unavailable' };
  }

  const patient = getPatientByIdNumber(idNumber.trim());

  if (!patient || !codesMatch(patient.verificationCode, verificationCode)) {
    return { success: false, error: 'invalid_credentials' };
  }

  return { success: true, session: createPatientSession(patient) };
}

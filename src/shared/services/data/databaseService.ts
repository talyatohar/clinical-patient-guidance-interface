import {
  DATABASE_FILENAME,
  getDatabaseUrl,
} from '@/shared/constants/database';
import type { Patient } from '@/shared/models/Patient';
import type { ProtocolStep } from '@/shared/models/ProtocolStep';
import type { PreparationChecklistItem } from '@/shared/models/PreparationChecklistItem';
import type { StepEducation } from '@/shared/models/StepEducation';
import type { WaitingContent } from '@/shared/models/WaitingContent';
import {
  sortPreparationChecklistItems,
} from '@/shared/services/excel/excelParserService';
import {
  parseWorkbook,
  type ParsedDatabase,
  type ParseWarning,
} from '@/shared/services/excel';

export type DatabaseLoadResult = ParsedDatabase & {
  loaded: boolean;
};

let cachedDatabase: ParsedDatabase | null = null;

function emptyDatabase(warnings: ParseWarning[] = []): ParsedDatabase {
  return {
    patients: [],
    protocolSteps: [],
    stepEducation: [],
    waitingContent: [],
    preparationChecklists: [],
    warnings,
  };
}

async function fetchWorkbookBuffer(url: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}

/**
 * Loads and parses NuclearMedicineDemoDatabase.xlsx.
 * Safe to call repeatedly — subsequent calls return cached data unless `force` is true.
 */
export async function loadDatabase(options?: {
  url?: string;
  buffer?: ArrayBuffer;
  force?: boolean;
}): Promise<DatabaseLoadResult> {
  if (cachedDatabase && !options?.force) {
    return { ...cachedDatabase, loaded: true };
  }

  const warnings: ParseWarning[] = [];

  let buffer = options?.buffer ?? null;

  if (!buffer) {
    const url = options?.url ?? getDatabaseUrl();
    buffer = await fetchWorkbookBuffer(url);

    if (!buffer) {
      const failed = emptyDatabase([
        {
          sheet: 'workbook',
          row: 0,
          message: `Could not load ${DATABASE_FILENAME}`,
        },
      ]);
      cachedDatabase = failed;
      return { ...failed, loaded: false };
    }
  }

  const parsed = parseWorkbook(buffer);
  cachedDatabase = parsed;

  return {
    ...parsed,
    loaded: true,
  };
}

export function getCachedDatabase(): ParsedDatabase | null {
  return cachedDatabase;
}

export function getPatients(): Patient[] {
  return cachedDatabase?.patients ?? [];
}

export function getProtocolSteps(): ProtocolStep[] {
  return cachedDatabase?.protocolSteps ?? [];
}

export function getStepEducation(): StepEducation[] {
  return cachedDatabase?.stepEducation ?? [];
}

export function getWaitingContent(): WaitingContent[] {
  return cachedDatabase?.waitingContent ?? [];
}

export function getPreparationChecklists(): PreparationChecklistItem[] {
  return cachedDatabase?.preparationChecklists ?? [];
}

export function getPreparationChecklistByProtocolId(
  protocolId: string,
): PreparationChecklistItem[] {
  const normalized = protocolId.trim();
  if (!normalized) return [];

  const items = getPreparationChecklists().filter(
    (item) => item.protocolId === normalized,
  );

  return sortPreparationChecklistItems(items);
}

export function getStepEducationForStep(
  protocolId: string,
  stepOrder: number,
): StepEducation | undefined {
  const normalizedProtocol = protocolId.trim();
  const normalizedOrder = Math.trunc(stepOrder);

  return getStepEducation().find(
    (entry) =>
      entry.protocolId === normalizedProtocol &&
      entry.stepOrder === normalizedOrder,
  );
}

export function getWaitingContentForStep(
  protocolId: string,
  stepOrder: number,
): WaitingContent | undefined {
  const normalizedProtocol = protocolId.trim();
  const normalizedOrder = Math.trunc(stepOrder);

  return getWaitingContent().find(
    (entry) =>
      entry.protocolId === normalizedProtocol &&
      entry.stepOrder === normalizedOrder,
  );
}

export function getProtocolStepsByProtocolId(
  protocolId: string,
): ProtocolStep[] {
  const normalized = protocolId.trim();
  return getProtocolSteps()
    .filter((step) => step.protocolId === normalized)
    .sort((a, b) => a.stepOrder - b.stepOrder);
}

export function getPatientByIdNumber(idNumber: string): Patient | undefined {
  const normalized = idNumber.trim();
  const patients = getPatients();

  const exact = patients.find((patient) => patient.idNumber === normalized);
  if (exact) return exact;

  const inputNum = Number(normalized);
  if (Number.isFinite(inputNum)) {
    return patients.find((patient) => Number(patient.idNumber) === inputNum);
  }

  return undefined;
}

/** Sums estimatedMinutes for all steps of a protocol from the Excel ProtocolSteps sheet. */
export function getEstimatedVisitDurationMinutes(protocolId: string): number {
  const normalized = protocolId.trim();
  if (!normalized) return 0;

  return getProtocolStepsByProtocolId(normalized).reduce(
    (total, step) => total + Math.max(0, step.estimatedMinutes),
    0,
  );
}

export function clearDatabaseCache(): void {
  cachedDatabase = null;
}

import * as XLSX from 'xlsx';
import { DATABASE_SHEETS } from '@/shared/constants/database';
import type { Patient } from '@/shared/models/Patient';
import type { ProtocolStep } from '@/shared/models/ProtocolStep';
import type { PreparationChecklistItem } from '@/shared/models/PreparationChecklistItem';
import type { StepEducation } from '@/shared/models/StepEducation';
import type { WaitingContent } from '@/shared/models/WaitingContent';
import {
  PATIENT_COLUMN_ALIASES,
  PREPARATION_CHECKLIST_COLUMN_ALIASES,
  PROTOCOL_STEP_COLUMN_ALIASES,
  STEP_EDUCATION_COLUMN_ALIASES,
  WAITING_CONTENT_COLUMN_ALIASES,
} from '@/shared/services/excel/columnMappings';
import {
  isEmptyCell,
  parseAppointmentTime,
  parseIdNumber,
  parseInteger,
  parseNullableString,
  parseString,
  pickFieldValue,
} from '@/shared/services/excel/parseUtils';

export type ParseWarning = {
  sheet: string;
  row: number;
  message: string;
};

export type ParsedDatabase = {
  patients: Patient[];
  protocolSteps: ProtocolStep[];
  stepEducation: StepEducation[];
  waitingContent: WaitingContent[];
  preparationChecklists: PreparationChecklistItem[];
  warnings: ParseWarning[];
};

function sheetToRows(
  workbook: XLSX.WorkBook,
  sheetName: string,
): Record<string, unknown>[] {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];

  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,
    raw: true,
  });
}

function parsePatientRow(
  row: Record<string, unknown>,
  rowIndex: number,
  warnings: ParseWarning[],
): Patient | null {
  try {
    const idNumber = parseIdNumber(
      pickFieldValue(row, PATIENT_COLUMN_ALIASES.idNumber),
    );

    if (!idNumber) {
      warnings.push({
        sheet: DATABASE_SHEETS.patients,
        row: rowIndex,
        message: 'Skipped row: missing idNumber',
      });
      return null;
    }

    return {
      idNumber,
      verificationCode: parseString(
        pickFieldValue(row, PATIENT_COLUMN_ALIASES.verificationCode),
      ),
      firstName: parseString(
        pickFieldValue(row, PATIENT_COLUMN_ALIASES.firstName),
      ),
      lastName: parseString(
        pickFieldValue(row, PATIENT_COLUMN_ALIASES.lastName),
      ),
      examType: parseString(
        pickFieldValue(row, PATIENT_COLUMN_ALIASES.examType),
      ),
      appointmentTime: parseAppointmentTime(
        pickFieldValue(row, PATIENT_COLUMN_ALIASES.appointmentTime),
      ),
      protocolId: parseString(
        pickFieldValue(row, PATIENT_COLUMN_ALIASES.protocolId),
      ),
      currentStepIndex: parseInteger(
        pickFieldValue(row, PATIENT_COLUMN_ALIASES.currentStepIndex),
        0,
      ),
      status: parseString(pickFieldValue(row, PATIENT_COLUMN_ALIASES.status)),
      notes: parseNullableString(
        pickFieldValue(row, PATIENT_COLUMN_ALIASES.notes),
      ),
    };
  } catch {
    warnings.push({
      sheet: DATABASE_SHEETS.patients,
      row: rowIndex,
      message: 'Skipped row: unexpected parse error',
    });
    return null;
  }
}

function parseProtocolStepRow(
  row: Record<string, unknown>,
  rowIndex: number,
  warnings: ParseWarning[],
): ProtocolStep | null {
  try {
    const protocolId = parseString(
      pickFieldValue(row, PROTOCOL_STEP_COLUMN_ALIASES.protocolId),
    );
    const stepOrder = parseInteger(
      pickFieldValue(row, PROTOCOL_STEP_COLUMN_ALIASES.stepOrder),
      -1,
    );

    if (!protocolId || stepOrder < 0) {
      warnings.push({
        sheet: DATABASE_SHEETS.protocolSteps,
        row: rowIndex,
        message: 'Skipped row: missing protocolId or stepOrder',
      });
      return null;
    }

    return {
      protocolId,
      stepOrder,
      stepTitleEn: parseString(
        pickFieldValue(row, PROTOCOL_STEP_COLUMN_ALIASES.stepTitleEn),
      ),
      stepTitleHe: parseString(
        pickFieldValue(row, PROTOCOL_STEP_COLUMN_ALIASES.stepTitleHe),
      ),
      stepType: parseString(
        pickFieldValue(row, PROTOCOL_STEP_COLUMN_ALIASES.stepType),
      ),
      estimatedMinutes: parseInteger(
        pickFieldValue(row, PROTOCOL_STEP_COLUMN_ALIASES.estimatedMinutes),
        0,
      ),
    };
  } catch {
    warnings.push({
      sheet: DATABASE_SHEETS.protocolSteps,
      row: rowIndex,
      message: 'Skipped row: unexpected parse error',
    });
    return null;
  }
}

export function parsePatientsSheet(
  workbook: XLSX.WorkBook,
  warnings: ParseWarning[] = [],
): Patient[] {
  if (!workbook.SheetNames.includes(DATABASE_SHEETS.patients)) {
    warnings.push({
      sheet: DATABASE_SHEETS.patients,
      row: 0,
      message: 'Patients sheet not found',
    });
    return [];
  }

  const rows = sheetToRows(workbook, DATABASE_SHEETS.patients);
  const patients: Patient[] = [];

  rows.forEach((row, index) => {
    const rowIndex = index + 2;
    if (Object.values(row).every(isEmptyCell)) return;

    const patient = parsePatientRow(row, rowIndex, warnings);
    if (patient) patients.push(patient);
  });

  return patients;
}

export function parseProtocolStepsSheet(
  workbook: XLSX.WorkBook,
  warnings: ParseWarning[] = [],
): ProtocolStep[] {
  if (!workbook.SheetNames.includes(DATABASE_SHEETS.protocolSteps)) {
    warnings.push({
      sheet: DATABASE_SHEETS.protocolSteps,
      row: 0,
      message: 'ProtocolSteps sheet not found',
    });
    return [];
  }

  const rows = sheetToRows(workbook, DATABASE_SHEETS.protocolSteps);
  const steps: ProtocolStep[] = [];

  rows.forEach((row, index) => {
    const rowIndex = index + 2;
    if (Object.values(row).every(isEmptyCell)) return;

    const step = parseProtocolStepRow(row, rowIndex, warnings);
    if (step) steps.push(step);
  });

  return steps.sort(
    (a, b) =>
      a.protocolId.localeCompare(b.protocolId) || a.stepOrder - b.stepOrder,
  );
}

function parseStepEducationRow(
  row: Record<string, unknown>,
  rowIndex: number,
  warnings: ParseWarning[],
): StepEducation | null {
  try {
    const protocolId = parseString(
      pickFieldValue(row, STEP_EDUCATION_COLUMN_ALIASES.protocolId),
    );
    const stepOrder = parseInteger(
      pickFieldValue(row, STEP_EDUCATION_COLUMN_ALIASES.stepOrder),
      -1,
    );

    if (!protocolId || stepOrder < 0) {
      warnings.push({
        sheet: DATABASE_SHEETS.stepEducation,
        row: rowIndex,
        message: 'Skipped row: missing protocolId or stepOrder',
      });
      return null;
    }

    return {
      protocolId,
      stepOrder,
      whatHappensNowEn: parseString(
        pickFieldValue(row, STEP_EDUCATION_COLUMN_ALIASES.whatHappensNowEn),
      ),
      whatHappensNowHe: parseString(
        pickFieldValue(row, STEP_EDUCATION_COLUMN_ALIASES.whatHappensNowHe),
      ),
      whyImportantEn: parseString(
        pickFieldValue(row, STEP_EDUCATION_COLUMN_ALIASES.whyImportantEn),
      ),
      whyImportantHe: parseString(
        pickFieldValue(row, STEP_EDUCATION_COLUMN_ALIASES.whyImportantHe),
      ),
      commonQuestionEn: parseString(
        pickFieldValue(row, STEP_EDUCATION_COLUMN_ALIASES.commonQuestionEn),
      ),
      commonQuestionHe: parseString(
        pickFieldValue(row, STEP_EDUCATION_COLUMN_ALIASES.commonQuestionHe),
      ),
      commonAnswerEn: parseString(
        pickFieldValue(row, STEP_EDUCATION_COLUMN_ALIASES.commonAnswerEn),
      ),
      commonAnswerHe: parseString(
        pickFieldValue(row, STEP_EDUCATION_COLUMN_ALIASES.commonAnswerHe),
      ),
      reassuranceEn: parseString(
        pickFieldValue(row, STEP_EDUCATION_COLUMN_ALIASES.reassuranceEn),
      ),
      reassuranceHe: parseString(
        pickFieldValue(row, STEP_EDUCATION_COLUMN_ALIASES.reassuranceHe),
      ),
    };
  } catch {
    warnings.push({
      sheet: DATABASE_SHEETS.stepEducation,
      row: rowIndex,
      message: 'Skipped row: unexpected parse error',
    });
    return null;
  }
}

function parseWaitingContentRow(
  row: Record<string, unknown>,
  rowIndex: number,
  warnings: ParseWarning[],
): WaitingContent | null {
  try {
    const protocolId = parseString(
      pickFieldValue(row, WAITING_CONTENT_COLUMN_ALIASES.protocolId),
    );
    const stepOrder = parseInteger(
      pickFieldValue(row, WAITING_CONTENT_COLUMN_ALIASES.stepOrder),
      -1,
    );

    if (!protocolId || stepOrder < 0) {
      warnings.push({
        sheet: DATABASE_SHEETS.waitingContent,
        row: rowIndex,
        message: 'Skipped row: missing protocolId or stepOrder',
      });
      return null;
    }

    return {
      protocolId,
      stepOrder,
      funFactEn: parseString(
        pickFieldValue(row, WAITING_CONTENT_COLUMN_ALIASES.funFactEn),
      ),
      funFactHe: parseString(
        pickFieldValue(row, WAITING_CONTENT_COLUMN_ALIASES.funFactHe),
      ),
      breathingTitleEn: parseString(
        pickFieldValue(row, WAITING_CONTENT_COLUMN_ALIASES.breathingTitleEn),
      ),
      breathingTitleHe: parseString(
        pickFieldValue(row, WAITING_CONTENT_COLUMN_ALIASES.breathingTitleHe),
      ),
      breathingInstructionEn: parseString(
        pickFieldValue(
          row,
          WAITING_CONTENT_COLUMN_ALIASES.breathingInstructionEn,
        ),
      ),
      breathingInstructionHe: parseString(
        pickFieldValue(
          row,
          WAITING_CONTENT_COLUMN_ALIASES.breathingInstructionHe,
        ),
      ),
    };
  } catch {
    warnings.push({
      sheet: DATABASE_SHEETS.waitingContent,
      row: rowIndex,
      message: 'Skipped row: unexpected parse error',
    });
    return null;
  }
}

export function parseWaitingContentSheet(
  workbook: XLSX.WorkBook,
  warnings: ParseWarning[] = [],
): WaitingContent[] {
  if (!workbook.SheetNames.includes(DATABASE_SHEETS.waitingContent)) {
    warnings.push({
      sheet: DATABASE_SHEETS.waitingContent,
      row: 0,
      message: 'WaitingContent sheet not found',
    });
    return [];
  }

  const rows = sheetToRows(workbook, DATABASE_SHEETS.waitingContent);
  const content: WaitingContent[] = [];

  rows.forEach((row, index) => {
    const rowIndex = index + 2;
    if (Object.values(row).every(isEmptyCell)) return;

    const entry = parseWaitingContentRow(row, rowIndex, warnings);
    if (entry) content.push(entry);
  });

  return content.sort(
    (a, b) =>
      a.protocolId.localeCompare(b.protocolId) || a.stepOrder - b.stepOrder,
  );
}

export function parseStepEducationSheet(
  workbook: XLSX.WorkBook,
  warnings: ParseWarning[] = [],
): StepEducation[] {
  if (!workbook.SheetNames.includes(DATABASE_SHEETS.stepEducation)) {
    warnings.push({
      sheet: DATABASE_SHEETS.stepEducation,
      row: 0,
      message: 'StepEducation sheet not found',
    });
    return [];
  }

  const rows = sheetToRows(workbook, DATABASE_SHEETS.stepEducation);
  const education: StepEducation[] = [];

  rows.forEach((row, index) => {
    const rowIndex = index + 2;
    if (Object.values(row).every(isEmptyCell)) return;

    const entry = parseStepEducationRow(row, rowIndex, warnings);
    if (entry) education.push(entry);
  });

  return education.sort(
    (a, b) =>
      a.protocolId.localeCompare(b.protocolId) || a.stepOrder - b.stepOrder,
  );
}

function parsePreparationChecklistRow(
  row: Record<string, unknown>,
  rowIndex: number,
  parseOrder: number,
  warnings: ParseWarning[],
): PreparationChecklistItem | null {
  try {
    const protocolId = parseString(
      pickFieldValue(row, PREPARATION_CHECKLIST_COLUMN_ALIASES.protocolId),
    );
    const checklistItemEn = parseString(
      pickFieldValue(row, PREPARATION_CHECKLIST_COLUMN_ALIASES.checklistItemEn),
    );
    const checklistItemHe = parseString(
      pickFieldValue(row, PREPARATION_CHECKLIST_COLUMN_ALIASES.checklistItemHe),
    );

    if (!protocolId) {
      warnings.push({
        sheet: DATABASE_SHEETS.preparationChecklists,
        row: rowIndex,
        message: 'Skipped row: missing protocolId',
      });
      return null;
    }

    if (!checklistItemEn && !checklistItemHe) {
      return null;
    }

    const rawItemOrder = pickFieldValue(
      row,
      PREPARATION_CHECKLIST_COLUMN_ALIASES.itemOrder,
    );
    const hasItemOrder = !isEmptyCell(rawItemOrder);
    const parsedOrder = hasItemOrder
      ? parseInteger(rawItemOrder, -1)
      : -1;

    return {
      protocolId,
      itemOrder: hasItemOrder && parsedOrder >= 0 ? parsedOrder : null,
      checklistItemEn,
      checklistItemHe,
      parseOrder,
    };
  } catch {
    warnings.push({
      sheet: DATABASE_SHEETS.preparationChecklists,
      row: rowIndex,
      message: 'Skipped row: unexpected parse error',
    });
    return null;
  }
}

export function parsePreparationChecklistsSheet(
  workbook: XLSX.WorkBook,
  warnings: ParseWarning[] = [],
): PreparationChecklistItem[] {
  if (!workbook.SheetNames.includes(DATABASE_SHEETS.preparationChecklists)) {
    warnings.push({
      sheet: DATABASE_SHEETS.preparationChecklists,
      row: 0,
      message: 'PreparationChecklists sheet not found',
    });
    return [];
  }

  const rows = sheetToRows(workbook, DATABASE_SHEETS.preparationChecklists);
  const items: PreparationChecklistItem[] = [];

  rows.forEach((row, index) => {
    const rowIndex = index + 2;
    if (Object.values(row).every(isEmptyCell)) return;

    const item = parsePreparationChecklistRow(
      row,
      rowIndex,
      index,
      warnings,
    );
    if (item) items.push(item);
  });

  return items;
}

export function sortPreparationChecklistItems(
  items: PreparationChecklistItem[],
): PreparationChecklistItem[] {
  return [...items].sort((a, b) => {
    const aKey = a.itemOrder ?? a.parseOrder;
    const bKey = b.itemOrder ?? b.parseOrder;
    if (aKey !== bKey) return aKey - bKey;
    return a.parseOrder - b.parseOrder;
  });
}

export function parseWorkbook(buffer: ArrayBuffer): ParsedDatabase {
  const warnings: ParseWarning[] = [];

  try {
    const workbook = XLSX.read(buffer, { type: 'array' });

    return {
      patients: parsePatientsSheet(workbook, warnings),
      protocolSteps: parseProtocolStepsSheet(workbook, warnings),
      stepEducation: parseStepEducationSheet(workbook, warnings),
      waitingContent: parseWaitingContentSheet(workbook, warnings),
      preparationChecklists: parsePreparationChecklistsSheet(
        workbook,
        warnings,
      ),
      warnings,
    };
  } catch {
    return {
      patients: [],
      protocolSteps: [],
      stepEducation: [],
      waitingContent: [],
      preparationChecklists: [],
      warnings: [
        {
          sheet: 'workbook',
          row: 0,
          message: 'Failed to read Excel workbook',
        },
      ],
    };
  }
}

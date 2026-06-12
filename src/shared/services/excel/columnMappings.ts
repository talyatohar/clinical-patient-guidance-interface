import type { Patient } from '@/shared/models/Patient';
import type { ProtocolStep } from '@/shared/models/ProtocolStep';
import type { PreparationChecklistItem } from '@/shared/models/PreparationChecklistItem';
import type { StepEducation } from '@/shared/models/StepEducation';
import type { WaitingContent } from '@/shared/models/WaitingContent';

export type PatientField = keyof Patient;
export type ProtocolStepField = keyof ProtocolStep;

/** Known Excel headers per model field (normalized matching) */
export const PATIENT_COLUMN_ALIASES: Record<PatientField, readonly string[]> = {
  idNumber: ['idnumber'],
  verificationCode: ['verificationcode'],
  firstName: ['firstname'],
  lastName: ['lastname'],
  examType: ['examtype'],
  appointmentTime: ['appointmenttime'],
  protocolId: ['protocolid'],
  currentStepIndex: ['currentstepindex'],
  status: ['status'],
  notes: ['notes'],
};

export const PROTOCOL_STEP_COLUMN_ALIASES: Record<
  ProtocolStepField,
  readonly string[]
> = {
  protocolId: ['protocolid'],
  stepOrder: ['steporder'],
  stepTitleEn: ['steptitleen'],
  stepTitleHe: ['steptitlehe'],
  stepType: ['steptype'],
  estimatedMinutes: ['estimatedminutes'],
};

export type StepEducationField = keyof StepEducation;

export const STEP_EDUCATION_COLUMN_ALIASES: Record<
  StepEducationField,
  readonly string[]
> = {
  protocolId: ['protocolid'],
  stepOrder: ['steporder'],
  whatHappensNowEn: ['whathappensnowen'],
  whatHappensNowHe: ['whathappensnowhe'],
  whyImportantEn: ['whyimportanten'],
  whyImportantHe: ['whyimportanthe'],
  commonQuestionEn: ['commonquestionen'],
  commonQuestionHe: ['commonquestionhe'],
  commonAnswerEn: ['commonansweren'],
  commonAnswerHe: ['commonanswerhe'],
  reassuranceEn: ['reassuranceen'],
  reassuranceHe: ['reassurancehe'],
};

export type WaitingContentField = keyof WaitingContent;

export const WAITING_CONTENT_COLUMN_ALIASES: Record<
  WaitingContentField,
  readonly string[]
> = {
  protocolId: ['protocolid'],
  stepOrder: ['steporder'],
  funFactEn: ['funfacten'],
  funFactHe: ['funfacthe'],
  breathingTitleEn: ['breathingtitleen'],
  breathingTitleHe: ['breathingtitlehe'],
  breathingInstructionEn: ['breathinginstructionen'],
  breathingInstructionHe: ['breathinginstructionhe'],
};

export type PreparationChecklistField = keyof PreparationChecklistItem;

export const PREPARATION_CHECKLIST_COLUMN_ALIASES: Record<
  Exclude<PreparationChecklistField, 'parseOrder'>,
  readonly string[]
> = {
  protocolId: ['protocolid'],
  itemOrder: ['itemorder'],
  checklistItemEn: ['checklistitemen'],
  checklistItemHe: ['checklistitemhe'],
};
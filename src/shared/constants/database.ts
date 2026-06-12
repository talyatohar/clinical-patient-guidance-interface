export const DATABASE_FILENAME = 'NuclearMedicineDemoDatabase.xlsx';

/** Served from public/data/ at runtime */
export const DATABASE_PUBLIC_PATH = '/data/NuclearMedicineDemoDatabase.xlsx';

export const DATABASE_SHEETS = {
  patients: 'Patients',
  protocolSteps: 'ProtocolSteps',
  stepEducation: 'StepEducation',
  waitingContent: 'WaitingContent',
  preparationChecklists: 'PreparationChecklists',
} as const;

/** Resolves public Excel URL (respects Vite base path) */
export function getDatabaseUrl(): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const path = DATABASE_PUBLIC_PATH.replace(/^\//, '');
  return `${base}${path}`;
}

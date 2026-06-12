/**
 * Dev script: verify Excel parsing against the demo database.
 * Run: node scripts/verify-excel-parse.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '../public/data/NuclearMedicineDemoDatabase.xlsx');
const buffer = readFileSync(filePath).buffer;

const workbook = XLSX.read(buffer, { type: 'array' });
const patients = XLSX.utils.sheet_to_json(workbook.Sheets.Patients, { raw: true });
const steps = XLSX.utils.sheet_to_json(workbook.Sheets.ProtocolSteps, { raw: true });

console.log('Patients:', patients.length);
console.log('ProtocolSteps:', steps.length);
console.log('Sample patient:', patients[0]);
console.log('Sample step:', steps[0]);

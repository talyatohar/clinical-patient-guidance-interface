export type PreparationChecklistItem = {
  protocolId: string;
  /** Present when the Excel row includes itemOrder; otherwise null */
  itemOrder: number | null;
  checklistItemEn: string;
  checklistItemHe: string;
  /** Original row index in the sheet (stable sort when itemOrder is missing) */
  parseOrder: number;
};

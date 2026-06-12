import type { Language } from '@/features/patient/types/language';
import type { PreparationChecklistItem } from '@/shared/models/PreparationChecklistItem';
import { getPreparationChecklistByProtocolId } from '@/shared/services/data';

export function getPreparationChecklistForProtocol(
  protocolId: string,
): PreparationChecklistItem[] {
  return getPreparationChecklistByProtocolId(protocolId);
}

export function shouldShowPreparationChecklist(protocolId: string): boolean {
  return getPreparationChecklistForProtocol(protocolId).length > 0;
}

/** Preferred language first, then the other; empty only when both are missing. */
export function getChecklistItemDisplayText(
  item: PreparationChecklistItem,
  language: Language,
): string {
  const en = item.checklistItemEn.trim();
  const he = item.checklistItemHe.trim();

  if (language === 'he') {
    return he || en;
  }

  return en || he;
}

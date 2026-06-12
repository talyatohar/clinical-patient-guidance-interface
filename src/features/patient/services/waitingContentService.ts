import type { Language } from '@/features/patient/types/language';

import { pickBilingualEducationText } from '@/features/patient/services/educationService';

import type { WaitingContent } from '@/shared/models/WaitingContent';

import { getWaitingContentForStep } from '@/shared/services/data';



export type WaitingContentDisplay = {

  funFact: string;

  breathingTitle: string;

  breathingInstruction: string;

};



export function lookupWaitingContent(

  protocolId: string,

  stepOrder: number,

): WaitingContent | undefined {

  try {

    return getWaitingContentForStep(protocolId, stepOrder);

  } catch {

    return undefined;

  }

}



function bilingualFieldHasContent(english: string, hebrew: string): boolean {

  return Boolean(english.trim() || hebrew.trim());

}



export function hasWaitingContentData(

  content: WaitingContent | undefined,

): boolean {

  if (!content) return false;



  return (

    bilingualFieldHasContent(content.funFactEn, content.funFactHe) ||

    bilingualFieldHasContent(

      content.breathingTitleEn,

      content.breathingTitleHe,

    ) ||

    bilingualFieldHasContent(

      content.breathingInstructionEn,

      content.breathingInstructionHe,

    )

  );

}



export function buildWaitingContentDisplay(

  content: WaitingContent,

  language: Language,

  defaultBreathingTitle: string,

): WaitingContentDisplay | null {

  const funFact = pickBilingualEducationText(

    content.funFactEn,

    content.funFactHe,

    language,

  );

  const breathingTitle =

    pickBilingualEducationText(

      content.breathingTitleEn,

      content.breathingTitleHe,

      language,

    ) ?? defaultBreathingTitle;

  const breathingInstruction = pickBilingualEducationText(

    content.breathingInstructionEn,

    content.breathingInstructionHe,

    language,

  );



  if (!funFact && !breathingInstruction) {

    return null;

  }



  return {

    funFact: funFact ?? '',

    breathingTitle,

    breathingInstruction: breathingInstruction ?? '',

  };

}


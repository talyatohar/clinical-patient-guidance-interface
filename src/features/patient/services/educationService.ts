import type { Language } from '@/features/patient/types/language';
import { displayValue } from '@/features/patient/utils/displayValue';
import type { StepEducation } from '@/shared/models/StepEducation';
import { getStepEducationForStep } from '@/shared/services/data';

export type EducationSectionId =
  | 'whatHappens'
  | 'whyImportant'
  | 'commonQuestion'
  | 'reassurance';

export type EducationTextSection = {
  id: EducationSectionId;
  body: string;
};

export type EducationFaqSection = {
  id: 'commonQuestion';
  question: string | null;
  answer: string | null;
};

export type EducationSection = EducationTextSection | EducationFaqSection;

export type EducationBlock = {
  sections: EducationSection[];
};

export function getEducationForStep(
  protocolId: string,
  stepOrder: number,
): StepEducation[] {
  try {
    return getStepEducationForStep(protocolId, stepOrder);
  } catch {
    return [];
  }
}

/** Preferred language first, then the other; null when both are empty. */
export function pickBilingualEducationText(
  english: string,
  hebrew: string,
  language: Language,
): string | null {
  const en = english.trim();
  const he = hebrew.trim();
  const primary = language === 'he' ? he : en;
  const fallback = language === 'he' ? en : he;
  const combined = primary || fallback;
  return combined ? combined : null;
}

function bilingualFieldHasContent(english: string, hebrew: string): boolean {
  return Boolean(english.trim() || hebrew.trim());
}

export function buildEducationSections(
  education: StepEducation | undefined,
  language: Language,
): EducationSection[] {
  if (!education) return [];

  const sections: EducationSection[] = [];

  const whatHappens = pickBilingualEducationText(
    education.whatHappensNowEn,
    education.whatHappensNowHe,
    language,
  );
  if (whatHappens) {
    sections.push({ id: 'whatHappens', body: whatHappens });
  }

  const whyImportant = pickBilingualEducationText(
    education.whyImportantEn,
    education.whyImportantHe,
    language,
  );
  if (whyImportant) {
    sections.push({ id: 'whyImportant', body: whyImportant });
  }

  const faqQuestion = pickBilingualEducationText(
    education.commonQuestionEn,
    education.commonQuestionHe,
    language,
  );
  const faqAnswer = pickBilingualEducationText(
    education.commonAnswerEn,
    education.commonAnswerHe,
    language,
  );
  if (faqQuestion || faqAnswer) {
    sections.push({
      id: 'commonQuestion',
      question: displayValue(faqQuestion),
      answer: displayValue(faqAnswer),
    });
  }

  const reassurance = pickBilingualEducationText(
    education.reassuranceEn,
    education.reassuranceHe,
    language,
  );
  if (reassurance) {
    sections.push({ id: 'reassurance', body: reassurance });
  }

  return sections;
}

function sectionContentKey(section: EducationSection): string {
  if (section.id === 'commonQuestion') {
    const faq = section as EducationFaqSection;
    return `commonQuestion:q:${faq.question ?? ''}:a:${faq.answer ?? ''}`;
  }
  return `${section.id}:${section.body}`;
}

/** Build one card per education row; skip sections whose text was already shown. */
export function buildEducationBlocks(
  educationRows: StepEducation[],
  language: Language,
): EducationBlock[] {
  const seenContent = new Set<string>();
  const blocks: EducationBlock[] = [];

  for (const education of educationRows) {
    const sections = buildEducationSections(education, language).filter(
      (section) => {
        const key = sectionContentKey(section);
        if (seenContent.has(key)) return false;
        seenContent.add(key);
        return true;
      },
    );

    if (sections.length > 0) {
      blocks.push({ sections });
    }
  }

  return blocks;
}

export function hasAnyEducationContent(
  educationRows: StepEducation[],
): boolean {
  return educationRows.some((education) => rowHasEducationContent(education));
}

function rowHasEducationContent(education: StepEducation): boolean {
  return (
    bilingualFieldHasContent(
      education.whatHappensNowEn,
      education.whatHappensNowHe,
    ) ||
    bilingualFieldHasContent(education.whyImportantEn, education.whyImportantHe) ||
    bilingualFieldHasContent(
      education.commonQuestionEn,
      education.commonQuestionHe,
    ) ||
    bilingualFieldHasContent(education.commonAnswerEn, education.commonAnswerHe) ||
    bilingualFieldHasContent(education.reassuranceEn, education.reassuranceHe)
  );
}
